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

import {i18n} from './I18n';
import Logger from './Logger';

type LanguageSpecificSettingValue = {
  [language: string]: string[];
};

type LanguageSpecificExternalFiles = {
  [language: string]: ExternalFile[];
};

type ExternalFile = {
  originalPath: string | null;
  resolvedPath: string;
  explicit: boolean;
};

type SettingAnalysis = {
  settingValue: LanguageSpecificSettingValue | null;
  externalFiles: LanguageSpecificExternalFiles;
};

type SettingValuePerScope = {
  key: string;
  defaultValue?: LanguageSpecificSettingValue;
  globalValue?: LanguageSpecificSettingValue;
  workspaceValue?: LanguageSpecificSettingValue;
  workspaceFolderValue?: LanguageSpecificSettingValue;
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
    'hiddenFalsePositives',
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

  public updateWatchers(uri: Code.Uri, settingName: string): void {
    const oldExternalFilePaths: Set<string> = new Set();
    const watchers: {[filePath: string]: Fs.FSWatcher} = this._watchers[settingName];

    for (const filePath in watchers) {
      if (!Object.prototype.hasOwnProperty.call(watchers, filePath)) continue;
      oldExternalFilePaths.add(filePath);
    }

    const externalFiles: LanguageSpecificExternalFiles = this.getExternalFilesFromSetting(
        uri, settingName);
    const newExternalFiles: Set<ExternalFile> = new Set();
    const newExternalFilePaths: Set<string> = new Set();

    for (const language in externalFiles) {
      if (!Object.prototype.hasOwnProperty.call(externalFiles, language)) continue;

      for (const externalFile of externalFiles[language]) {
        if (!newExternalFilePaths.has(externalFile.resolvedPath)) {
          newExternalFiles.add(externalFile);
          newExternalFilePaths.add(externalFile.resolvedPath);
        }
      }
    }

    for (const filePath of oldExternalFilePaths) {
      if (!newExternalFilePaths.has(filePath)) {
        watchers[filePath].close();
        delete this._watchers[settingName][filePath];
        delete this._contents[settingName][filePath];
      }
    }

    for (const externalFile of newExternalFiles) {
      const filePath: string = externalFile.resolvedPath;

      if (!oldExternalFilePaths.has(filePath)) {
        let watcher: Fs.FSWatcher | null = null;
        let contents: string | null = null;

        try {
          watcher = Fs.watch(filePath, this.onFileWatcherEvent.bind(this));
          contents = Fs.readFileSync(filePath, {encoding: 'utf-8'});
        } catch (e) {
          if (externalFile.explicit) {
            Logger.warn(i18n('couldNotReadExternalSettingFile', filePath), e);
          }

          watcher = null;
          contents = null;
          continue;
        }

        Logger.log(i18n('startedWatchingExternalSettingFile', filePath));
        this._watchers[settingName][filePath] = watcher;
        this._contents[settingName][filePath] = contents;
      }
    }
  }

  public getFirstExternalFilePath(uri: Code.Uri, settingName: string,
        scope: Code.ConfigurationTarget, language: string): string | null {
    const externalFiles: LanguageSpecificExternalFiles = this.analyzeSetting(
        uri, settingName, scope, language).externalFiles;
    return ((Object.prototype.hasOwnProperty.call(externalFiles, language) &&
        (externalFiles[language].length > 0)) ?
        externalFiles[language][0].resolvedPath : null);
  }

  private getExternalFilesFromSetting(uri: Code.Uri, settingName: string,
        language: string | null = null): LanguageSpecificExternalFiles {
    const resourceConfig: Code.WorkspaceConfiguration =
        Code.workspace.getConfiguration('ltex', uri);
    const settingValuePerScope: SettingValuePerScope | undefined =
        resourceConfig.inspect(settingName);
    const externalFiles: LanguageSpecificExternalFiles = {};

    for (const scope of [Code.ConfigurationTarget.Global, Code.ConfigurationTarget.Workspace,
          Code.ConfigurationTarget.WorkspaceFolder]) {
      const settingAnalysis: SettingAnalysis = this.analyzeSetting(
          uri, settingName, scope, language, settingValuePerScope);
      const scopeExternalFiles: LanguageSpecificExternalFiles = settingAnalysis.externalFiles;

      for (const curLanguage in scopeExternalFiles) {
        if (!Object.prototype.hasOwnProperty.call(scopeExternalFiles, curLanguage)) continue;
        if (!Object.prototype.hasOwnProperty.call(externalFiles, curLanguage)) {
          externalFiles[curLanguage] = [];
        }

        for (const externalFile of scopeExternalFiles[curLanguage]) {
          externalFiles[curLanguage].push(externalFile);
        }
      }
    }

    return externalFiles;
  }

  private analyzeSetting(uri: Code.Uri, settingName: string,
        scope: Code.ConfigurationTarget, language: string | null = null,
        settingValuePerScope: SettingValuePerScope | undefined = undefined): SettingAnalysis {
    if (settingValuePerScope == null) {
      const resourceConfig: Code.WorkspaceConfiguration =
          Code.workspace.getConfiguration('ltex', uri);
      settingValuePerScope = resourceConfig.inspect(settingName);
    }

    let defaultDirPath: string | null = null;
    let settingValue: LanguageSpecificSettingValue | undefined | null = null;

    switch (scope) {
      case Code.ConfigurationTarget.Global: {
        defaultDirPath = this.getUserSettingsDirPath();
        settingValue = ((settingValuePerScope != null) ?
            settingValuePerScope.globalValue : null);
        break;
      }
      case Code.ConfigurationTarget.Workspace: {
        defaultDirPath = this.getWorkspaceSettingsDirPath();
        settingValue = ((settingValuePerScope != null) ?
            settingValuePerScope.workspaceValue : null);
        break;
      }
      case Code.ConfigurationTarget.WorkspaceFolder: {
        defaultDirPath = this.getWorkspaceFolderSettingsDirPath(uri);
        settingValue = ((settingValuePerScope != null) ?
            settingValuePerScope.workspaceFolderValue : null);
        break;
      }
    }

    const languages: string[] = ((language != null) ? [language] : this._languages);
    const externalFiles: LanguageSpecificExternalFiles = {};

    for (const curLanguage of languages) {
      externalFiles[curLanguage] = [];

      if ((settingValue != null) &&
            Object.prototype.hasOwnProperty.call(settingValue, curLanguage)) {
        for (const entry of settingValue[curLanguage]) {
          if (!entry.startsWith(':')) continue;
          const originalFilePath: string = entry.substr(1);
          let filePath: string = ExternalFileManager.normalizePath(originalFilePath);

          if (!Path.isAbsolute(filePath) && (defaultDirPath != null)) {
            filePath = Path.resolve(defaultDirPath, filePath);
          }

          externalFiles[curLanguage].push({
            originalPath: originalFilePath,
            resolvedPath: filePath,
            explicit: true,
          });
        }
      }

      if (defaultDirPath != null) {
        const curLanguageSuffix: string = curLanguage.replace(/[^A-Za-z0-9\-_]/, '');
        externalFiles[curLanguage].push({
          originalPath: '',
          resolvedPath: Path.join(defaultDirPath, `ltex.${settingName}.${curLanguageSuffix}.txt`),
          explicit: false,
        });
      }
    }

    if (settingValue == null) settingValue = null;
    return {settingValue: settingValue, externalFiles: externalFiles};
  }

  public getUserSettingsDirPath(): string {
    return Path.resolve(this._context.globalStoragePath);
  }

  public getWorkspaceSettingsDirPath(): string | null {
    if (Code.workspace.workspaceFolders == null) return null;
    const workspaceDirUri: Code.Uri = Code.workspace.workspaceFolders[0].uri;
    if (workspaceDirUri.scheme != 'file') return null;
    return Path.resolve(workspaceDirUri.fsPath, '.vscode');
  }

  public getWorkspaceFolderSettingsDirPath(uri: Code.Uri): string | null {
    const workspaceFolder: Code.WorkspaceFolder | undefined =
        Code.workspace.getWorkspaceFolder(uri);
    if (workspaceFolder == null) return null;
    const workspaceFolderDirUri: Code.Uri = workspaceFolder.uri;
    if (workspaceFolderDirUri.scheme != 'file') return null;
    return Path.resolve(workspaceFolderDirUri.fsPath, '.vscode');
  }

  private static normalizePath(path: string): string {
    const match: RegExpMatchArray | null = path.match(/^~($|\/|\\\\)/);
    if (match != null) path = Path.resolve(Os.homedir(), path.substr(match[0].length));
    return path;
  }

  private onFileWatcherEvent(eventType: string, filePath: string): void {
    if (!Fs.existsSync(filePath)) {
      Logger.log(i18n('stoppedWatchingExternalSettingFileDueToDeletion', filePath));

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
      } catch (e) {
        Logger.warn(i18n('couldNotReadExternalSettingFile', filePath), e);
        return;
      }

      Logger.log(i18n('updatedExternalSettingFile', filePath));

      for (const settingName of ExternalFileManager._settingNames) {
        if (!Object.prototype.hasOwnProperty.call(this._contents[settingName], filePath)) continue;
        this._contents[settingName][filePath] = contents;
      }
    }
  }

  public getSettingValue(uri: Code.Uri, settingName: string, scope: Code.ConfigurationTarget):
        LanguageSpecificSettingValue {
    const settingAnalysis: SettingAnalysis = this.analyzeSetting(uri, settingName, scope);
    const externalFiles: LanguageSpecificExternalFiles = settingAnalysis.externalFiles;
    const settingValue: LanguageSpecificSettingValue = ((settingAnalysis.settingValue != null) ?
        settingAnalysis.settingValue : {});
    const result: LanguageSpecificSettingValue = {};

    for (const language in externalFiles) {
      if (!Object.prototype.hasOwnProperty.call(externalFiles, language)) continue;
      result[language] = [];

      for (const externalFile of externalFiles[language]) {
        this.loadFileAndPushToArray(externalFile.resolvedPath, settingName, result[language]);
      }
    }

    for (const language in settingValue) {
      if (!Object.prototype.hasOwnProperty.call(settingValue, language)) continue;
      if (!Object.prototype.hasOwnProperty.call(result, language)) result[language] = [];

      for (const entry of settingValue[language]) {
        if (entry.startsWith(':') &&
              Object.prototype.hasOwnProperty.call(settingAnalysis.externalFiles, language)) {
          const filePath: string | null = ExternalFileManager.getResolvedPath(
              settingAnalysis.externalFiles[language], entry.substr(1));

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

  private static getResolvedPath(filePathInfos: ExternalFile[], originalFilePath: string):
        string | null {
    for (const filePathInfo of filePathInfos) {
      if (filePathInfo.originalPath == originalFilePath) return filePathInfo.resolvedPath;
    }

    return null;
  }

  public appendToFile(filePath: string, settingName: string, entries: string[]): void {
    const externalFileKnown: boolean = Object.prototype.hasOwnProperty.call(
        this._contents[settingName], filePath);
    let contents: string;

    if (externalFileKnown) {
      contents = this._contents[settingName][filePath];
    } else {
      this.ensureParentDirExists(filePath);
      this.ensureFileExists(filePath);

      try {
        contents = Fs.readFileSync(filePath, {encoding: 'utf-8'});
      } catch (e) {
        Logger.error(i18n('couldNotReadExternalSettingFile', filePath), e);
        return;
      }

      Logger.log(i18n('readExternalSettingFile', filePath));
    }

    if ((contents.match(/[^ \r\n]/) != null) && !contents.endsWith(Os.EOL)) contents += Os.EOL;
    contents += entries.join(Os.EOL) + Os.EOL;

    if (externalFileKnown) this.ensureParentDirExists(filePath);

    try {
      Fs.writeFileSync(filePath, contents, {encoding: 'utf-8'});
    } catch (e) {
      Logger.error(i18n('couldNotAppendNewEntriesToExternalSettingFile', filePath), e);
      return;
    }

    Logger.log(i18n('appendedNewEntriesToExternalSettingFile', filePath));
    if (externalFileKnown) this._contents[settingName][filePath] = contents;
  }

  private ensureParentDirExists(filePath: string): void {
    const parentDirPath: string = Path.dirname(filePath);

    if (!Fs.existsSync(parentDirPath)) {
      try {
        Fs.mkdirSync(parentDirPath);
        Logger.log(i18n('createdDirectoryForExternalSettingFile', parentDirPath, filePath));
      } catch (e) {
        Logger.warn(i18n('couldNotCreateDirectoryForExternalSettingFile',
            parentDirPath, filePath), e);
      }
    }
  }

  private ensureFileExists(filePath: string): void {
    if (!Fs.existsSync(filePath)) {
      try {
        Fs.writeFileSync(filePath, '', {encoding: 'utf-8'});
        Logger.log(i18n('createdExternalSettingFile', filePath));
      } catch (e) {
        Logger.warn(i18n('couldNotCreateExternalSettingFile', filePath), e);
      }
    }
  }
}
