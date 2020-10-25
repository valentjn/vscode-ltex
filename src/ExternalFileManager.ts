/* Copyright (C) 2020 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Code from 'vscode';
import * as Fs from 'fs';
import * as Os from 'os';
import * as Path from 'path';

type LanguageSpecificSettingValue = {
  [language: string]: string[];
};

type LanguageSpecificExternalFilePaths = {
  [language: string]: ExternalFilePath[];
};

type ExternalFilePath = {
  originalPath: string | null;
  resolvedPath: string;
};
type SettingAnalysis = {
  settingValue: LanguageSpecificSettingValue | null;
  externalFilePaths: LanguageSpecificExternalFilePaths;
};

export default class ExternalFileManager {
  private _context: Code.ExtensionContext;
  private _languages: string[];
  private _watchers: {[settingName: string]: {[filePath: string]: Fs.FSWatcher}};
  private _contents: {[settingName: string]: {[filePath: string]: string}};

  private static readonly _settingNames: string[] = [
    'dictionary',
    'disabledRules',
    'enabledRules',
  ];

  public constructor(context: Code.ExtensionContext) {
    this._context = context;
    this._languages = ExternalFileManager.getLanguages(context);
    this._watchers = {};
    this._contents = {};

    for (const settingName of ExternalFileManager._settingNames) {
      this._watchers[settingName] = {};
      this._contents[settingName] = {};
    }
  }

  private static getLanguages(context: Code.ExtensionContext): string[] {
    const packageJsonPath: string = Path.resolve(context.extensionPath, 'package.json');
    const packageJson: any = JSON.parse(Fs.readFileSync(packageJsonPath, {encoding: 'utf-8'}));
    const languages: string[] =
        packageJson['contributes']['configuration']['properties']['ltex.language']['enum'];
    return languages;
  }

  private updateWatchers(uri: Code.Uri, settingName: string, scope: Code.ConfigurationTarget):
        void {
    const oldExternalFilePaths: Set<string> = new Set();
    const watchers: {[filePath: string]: Fs.FSWatcher} = this._watchers[settingName];

    for (const filePath in watchers) {
      if (!Object.prototype.hasOwnProperty.call(watchers, filePath)) continue;
      oldExternalFilePaths.add(filePath);
    }

    const settingAnalysis: SettingAnalysis = this.analyzeSetting(uri, settingName, scope);
    const externalFilePaths: LanguageSpecificExternalFilePaths = settingAnalysis.externalFilePaths;
    const newExternalFilePaths: Set<string> = new Set();

    for (const language in externalFilePaths) {
      if (!Object.prototype.hasOwnProperty.call(externalFilePaths, language)) continue;

      for (const externalFilePath of externalFilePaths[language]) {
        newExternalFilePaths.add(externalFilePath.resolvedPath);
      }
    }

    for (const filePath of oldExternalFilePaths) {
      if (!newExternalFilePaths.has(filePath)) {
        watchers[filePath].close();
        delete this._watchers[settingName][filePath];
        delete this._contents[settingName][filePath];
      }
    }

    for (const filePath of newExternalFilePaths) {
      if (!oldExternalFilePaths.has(filePath)) {
        let watcher: Fs.FSWatcher | null = null;
        let contents: string | null = null;

        try {
          watcher = Fs.watch(filePath, this.onFileWatcherEvent.bind(this));
          contents = Fs.readFileSync(filePath, {encoding: 'utf-8'});
        } catch {
          watcher = null;
          contents = null;
        }

        if ((watcher == null) || (contents == null)) continue;
        this._watchers[settingName][filePath] = watcher;
        this._contents[settingName][filePath] = contents;
      }
    }
  }

  private analyzeSetting(uri: Code.Uri, settingName: string,
        scope: Code.ConfigurationTarget, language: string | null = null): SettingAnalysis {
    const resourceConfig: Code.WorkspaceConfiguration =
        Code.workspace.getConfiguration('ltex', uri);
    const setting: {
      key: string;
      defaultValue?: LanguageSpecificSettingValue;
      globalValue?: LanguageSpecificSettingValue;
      workspaceValue?: LanguageSpecificSettingValue;
      workspaceFolderValue?: LanguageSpecificSettingValue;
    } | undefined = resourceConfig.inspect(settingName);
    let defaultDirPath: string | null = null;
    let settingValue: LanguageSpecificSettingValue | undefined | null = null;

    switch (scope) {
      case Code.ConfigurationTarget.Global: {
        defaultDirPath = Path.resolve(this._context.globalStoragePath);
        settingValue = ((setting != null) ? setting.globalValue : null);
        break;
      }
      case Code.ConfigurationTarget.Workspace: {
        if (Code.workspace.workspaceFolders != null) {
          const defaultDirUri: Code.Uri = Code.workspace.workspaceFolders[0].uri;

          if (defaultDirUri.scheme == 'file') {
            defaultDirPath = Path.resolve(defaultDirUri.fsPath, '.vscode');
          }
        }

        settingValue = ((setting != null) ? setting.workspaceValue : null);
        break;
      }
      case Code.ConfigurationTarget.WorkspaceFolder: {
        const workspaceFolder: Code.WorkspaceFolder | undefined =
            Code.workspace.getWorkspaceFolder(uri);

        if (workspaceFolder != null) {
          const defaultDirUri: Code.Uri = workspaceFolder.uri;

          if (defaultDirUri.scheme == 'file') {
            defaultDirPath = Path.resolve(defaultDirUri.fsPath, '.vscode');
          }
        }

        settingValue = ((setting != null) ? setting.workspaceFolderValue : null);
        break;
      }
    }

    const languages: string[] = ((language != null) ? [language] : this._languages);
    const filePaths: LanguageSpecificExternalFilePaths = {};

    for (const curLanguage of languages) {
      filePaths[curLanguage] = [];

      if ((settingValue != null) &&
            Object.prototype.hasOwnProperty.call(settingValue, curLanguage)) {
        for (const entry of settingValue[curLanguage]) {
          if (!entry.startsWith(':')) continue;
          const originalFilePath: string = entry.substr(1);
          let filePath: string = ExternalFileManager.normalizePath(originalFilePath);

          if (!Path.isAbsolute(filePath) && (defaultDirPath != null)) {
            filePath = Path.resolve(defaultDirPath, filePath);
          }

          filePaths[curLanguage].push({originalPath: originalFilePath, resolvedPath: filePath});
        }
      }

      if (defaultDirPath != null) {
        const curLanguageSuffix: string = curLanguage.replace(/[^A-Za-z0-9\-_]/, '');
        filePaths[curLanguage].push({originalPath: '', resolvedPath:
            Path.join(defaultDirPath, `ltex.${settingName}.${curLanguageSuffix}.txt`)});
      }
    }

    if (settingValue == null) settingValue = null;
    return {settingValue: settingValue, externalFilePaths: filePaths};
  }

  private static normalizePath(path: string): string {
    const match: RegExpMatchArray | null = path.match(/^~($|\/|\\\\)/);
    if (match != null) path = Path.resolve(Os.homedir(), path.substr(match[0].length));
    return path;
  }

  private onFileWatcherEvent(eventType: string, filePath: string): void {
    if (!Fs.existsSync(filePath)) {
      for (const settingName of ExternalFileManager._settingNames) {
        if (!Object.prototype.hasOwnProperty.call(this._contents[settingName], filePath)) {
          continue;
        }

        delete this._watchers[settingName][filePath];
        delete this._contents[settingName][filePath];
      }
    } else if (eventType == 'change') {
      let contents: string | null = null;

      try {
        contents = Fs.readFileSync(filePath, {encoding: 'utf-8'});
      } catch {
        return;
      }

      for (const settingName of ExternalFileManager._settingNames) {
        if (!Object.prototype.hasOwnProperty.call(this._contents[settingName], filePath)) continue;
        this._contents[settingName][filePath] = contents;
      }
    }
  }

  public getSettingValue(uri: Code.Uri, settingName: string, scope: Code.ConfigurationTarget):
        LanguageSpecificSettingValue {
    this.updateWatchers(uri, settingName, scope);

    const settingAnalysis: SettingAnalysis = this.analyzeSetting(uri, settingName, scope);
    const externalFilePaths: LanguageSpecificExternalFilePaths = settingAnalysis.externalFilePaths;
    const settingValue: LanguageSpecificSettingValue = ((settingAnalysis.settingValue != null) ?
        settingAnalysis.settingValue : {});
    const result: LanguageSpecificSettingValue = {};

    for (const language in externalFilePaths) {
      if (!Object.prototype.hasOwnProperty.call(externalFilePaths, language)) continue;
      result[language] = [];

      for (const externalFilePath of externalFilePaths[language]) {
        this.loadFileAndPushToArray(externalFilePath.resolvedPath, settingName, result[language]);
      }
    }

    for (const language in settingValue) {
      if (!Object.prototype.hasOwnProperty.call(settingValue, language)) continue;
      if (!Object.prototype.hasOwnProperty.call(result, language)) result[language] = [];

      for (const entry of settingValue[language]) {
        if (entry.startsWith(':') &&
              Object.prototype.hasOwnProperty.call(settingAnalysis.externalFilePaths, language)) {
          const filePath: string | null = ExternalFileManager.getResolvedPath(
              settingAnalysis.externalFilePaths[language], entry.substr(1));

          if (filePath != null) {
            this.loadFileAndPushToArray(filePath, settingName, result[language]);
          }
        } else {
          result[language].push(entry);
        }
      }
    }

    return result;
  }

  private loadFileAndPushToArray(filePath: string, settingName: string, array: string[]): void {
    if (!Object.prototype.hasOwnProperty.call(this._contents[settingName], filePath)) return;
    const contents: string = this._contents[settingName][filePath];

    for (const line of contents.split(/\r?\n/)) {
      const trimmedLine: string = line.trim();
      if (trimmedLine.length > 0) array.push(line.trim());
    }
  }

  private static getResolvedPath(externalFilePaths: ExternalFilePath[],
        originalFilePath: string): string | null {
    for (const externalFilePath of externalFilePaths) {
      if (externalFilePath.originalPath == originalFilePath) return externalFilePath.resolvedPath;
    }

    return null;
  }
}
