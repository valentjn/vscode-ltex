/* Copyright (C) 2020 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient';

import DependencyManager from './DependencyManager';
import ExternalFileManager from './ExternalFileManager';
import {i18n} from './I18n';
import Logger from './Logger';

type LtexServerStatusResult = {
  processId: number | null;
  wallClockDuration: number | null;
  cpuDuration: number | null;
  cpuUsage: number | null;
  usedMemory: number | null;
  totalMemory: number | null;
};

export default class StatusPrinter {
  private _context: Code.ExtensionContext;
  private _dependencyManager: DependencyManager;
  private _externalFileManager: ExternalFileManager;
  private _languageClient: CodeLanguageClient.LanguageClient | null;

  private static readonly _ltexLsStatusTimeout: number = 500;

  public constructor(context: Code.ExtensionContext, dependencyManager: DependencyManager,
        externalFileManager: ExternalFileManager) {
    this._context = context;
    this._dependencyManager = dependencyManager;
    this._externalFileManager = externalFileManager;
    this._languageClient = null;
  }

  public set languageClient(languageClient: CodeLanguageClient.LanguageClient) {
    this._languageClient = languageClient;
  }

  public async print(): Promise<void> {
    let ltexLsStatus: LtexServerStatusResult = {
      processId: null,
      wallClockDuration: null,
      cpuDuration: null,
      cpuUsage: null,
      usedMemory: null,
      totalMemory: null,
    };

    if (this._languageClient != null) {
      try {
        const promises: Promise<LtexServerStatusResult>[] = [
          this._languageClient.sendRequest('ltex/serverStatus'),
          new Promise((_resolve: (value: LtexServerStatusResult) => void,
                reject: (reason?: any) => void) => {
            setTimeout(() => reject(new Error()), StatusPrinter._ltexLsStatusTimeout);
          }),
        ];

        ltexLsStatus = await Promise.race(promises).catch((_reason?: any) => ltexLsStatus);
      } catch {
        // ignore errors
      }
    }

    Logger.log(i18n('ltexStatus'));
    Logger.log(i18n('separationLine'));

    Logger.log(i18n('vscodeLtexInfo'));
    Logger.log(i18n('extensionDirPath', StatusPrinter.formatString(this._context.extensionPath)));
    Logger.log(i18n('userSettingsDirPath',
        StatusPrinter.formatString(this._externalFileManager.getUserSettingsDirPath())));
    Logger.log(i18n('workspaceSettingsDirPath',
        StatusPrinter.formatString(this._externalFileManager.getWorkspaceSettingsDirPath())));

    const activeTextEditor: Code.TextEditor | undefined = Code.window.activeTextEditor;
    let workspaceFolderSettingsDirPath: string | null = null;

    if (activeTextEditor != null) {
      workspaceFolderSettingsDirPath = this._externalFileManager.getWorkspaceFolderSettingsDirPath(
          activeTextEditor.document.uri);
    }

    Logger.log(i18n('workspaceFolderSettingsDirPath',
        StatusPrinter.formatString(workspaceFolderSettingsDirPath)));
    Logger.log(i18n('version',
        StatusPrinter.formatString(this._dependencyManager.vscodeLtexVersion)));

    Logger.log(i18n('ltexLsInfo'));
    Logger.log(i18n('version',
        StatusPrinter.formatString(this._dependencyManager.ltexLsVersion)));
    Logger.log(i18n('processId', StatusPrinter.formatNumber(ltexLsStatus.processId)));
    Logger.log(i18n('wallClockDuration',
        StatusPrinter.formatDuration(ltexLsStatus.wallClockDuration)));
    Logger.log(i18n('cpuDuration', StatusPrinter.formatDuration(ltexLsStatus.cpuDuration)));
    Logger.log(i18n('cpuUsage', StatusPrinter.formatFraction(ltexLsStatus.cpuUsage)));
    Logger.log(i18n('totalMemory', StatusPrinter.formatMemory(ltexLsStatus.totalMemory)));
    Logger.log(i18n('usedMemory', StatusPrinter.formatMemory(ltexLsStatus.usedMemory)));

    const watchedExternalFiles: string[] = this._externalFileManager.getAllWatchedExternalFiles();

    if (watchedExternalFiles.length > 0) {
      Logger.log(i18n('currentlyWatchedExternalSettingFiles'));

      for (const filePath of this._externalFileManager.getAllWatchedExternalFiles()) {
        Logger.log(i18n('externalSettingFile', filePath));
      }
    } else {
      Logger.log(i18n('currentlyWatchedExternalSettingFilesNa'));
    }

    Logger.log(i18n('separationLine'));

    return Promise.resolve();
  }

  private static formatString(str: string | null): string {
    return ((str != null) ? str : i18n('na'));
  }

  private static formatNumber(x: number | null): string {
    return ((x != null) ? `${x}` : i18n('na'));
  }

  private static formatFraction(fraction: number | null): string {
    return ((fraction != null) ? `${(100 * fraction).toFixed(1)}%` : i18n('na'));
  }

  private static formatDuration(duration: number | null): string {
    if (duration == null) return i18n('na');
    const milliseconds: number = Math.floor(1000 * (duration % 1));
    const seconds: number = Math.floor(duration % 60);
    const minutes: number = Math.floor(duration / 60) % 60;
    const hours: number = Math.floor(duration / 3600);
    const pad: ((x: number, length: number) => string) =
        ((x: number, length: number) => x.toString().padStart(length, '0'));

    if (hours > 0) {
      return `${hours}h${pad(minutes, 2)}m${pad(seconds, 2)}s.${pad(milliseconds, 3)}`;
    } else if (minutes > 0) {
      return `${minutes}m${pad(seconds, 2)}s.${pad(milliseconds, 3)}`;
    } else {
      return `${seconds}s.${pad(milliseconds, 3)}`;
    }
  }

  private static formatMemory(memory: number | null): string {
    return ((memory != null) ? `${(memory / 1e6).toFixed(2)}MB` : i18n('na'));
  }
}
