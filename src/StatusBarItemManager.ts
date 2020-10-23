/* Copyright (C) 2020 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Code from 'vscode';

import {i18n} from './I18n';
import Logger from './Logger';

enum Status {
  starting,
  ready,
  checking,
}

export default class StatusBarItemManager {
  private _statusBarItem: Code.StatusBarItem;
  private _progressMap: {
        [name: string]: {
          progress: number;
          startTime: number;
        };
      };
  private _status: Status;

  private _startingStatusText: string;
  private _readyStatusText: string;
  private _checkingStatusText: string;

  private static readonly readyStatusDuration: number = 1000;
  private static readonly checkingStatusDelay: number = 5000;

  public constructor(context: Code.ExtensionContext) {
    this._statusBarItem = Code.window.createStatusBarItem(Code.StatusBarAlignment.Left);
    this._progressMap = {};
    this._status = Status.starting;

    this._startingStatusText = `$(loading~spin) ${i18n('startingLtex')}`;
    this._readyStatusText = `$(check) ${i18n('ltexReady')}`;
    this._checkingStatusText = `$(loading~spin) ${i18n('ltexIsChecking')}`;

    context.subscriptions.push(this._statusBarItem);
    context.subscriptions.push(Code.workspace.onDidChangeConfiguration(
        this.onDidChangeConfiguration, this));

    this.setStatusToStarting();
  }

  private onDidChangeConfiguration(event: Code.ConfigurationChangeEvent): void {
    if (event.affectsConfiguration('ltex.statusBarItem')) this.update();
  }

  private update(): void {
    if (this._status == Status.starting) {
      this._statusBarItem.text = this._startingStatusText;
      this._statusBarItem.show();
      return;
    }

    const uris: string[] = StatusBarItemManager.getKeys(this._progressMap);
    const now: number = Date.now();

    for (const uri of uris) {
      if (now - this._progressMap[uri].startTime >= StatusBarItemManager.checkingStatusDelay) {
        this._status = Status.checking;
        this._statusBarItem.text = this._checkingStatusText;
        this._statusBarItem.show();
        return;
      }
    }

    const oldStatus: Status = this._status;
    this._status = Status.ready;
    this._statusBarItem.text = this._readyStatusText;

    if (oldStatus == Status.checking) {
      this.setStatusToReady();
      return;
    }

    const visible: boolean | undefined =
        Code.workspace.getConfiguration('ltex').get('statusBarItem');

    if ((visible != null) && visible) {
      this._statusBarItem.show();
      return;
    }

    this._statusBarItem.hide();
  }

  private static getKeys(obj: any): string[] {
    const result: string[] = [];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) result.push(key);
    }

    return result;
  }

  public setStatusToStarting(): void {
    this._status = Status.starting;
    this.update();
  }

  public setStatusToReady(): void {
    this._status = Status.ready;
    this._statusBarItem.text = this._readyStatusText;
    this._statusBarItem.show();
    setTimeout(this.update.bind(this), StatusBarItemManager.readyStatusDuration);
  }

  public handleProgressNotification(params: {uri: string, operation: string,
        progress: number}): void {
    if (params.operation != 'checkDocument') {
      Logger.warn(i18n('unknownOperationInProgressEvent', params.operation, params));
      return;
    }

    if (params.progress == 1) {
      if (Object.prototype.hasOwnProperty.call(this._progressMap, params.uri)) {
        delete this._progressMap[params.uri];
        this.update();
      }
    } else {
      this._progressMap[params.uri] = {progress: params.progress, startTime: Date.now()};
      setTimeout(this.update.bind(this), StatusBarItemManager.checkingStatusDelay + 100);
    }
  }
}
