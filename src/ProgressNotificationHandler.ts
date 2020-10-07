/* Copyright (C) 2020 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Code from 'vscode';

import {i18n} from './I18n';
import Logger from './Logger';

export default class ProgressNotificationHandler {
  private _context: Code.ExtensionContext;
  private _progressMap: {
        [name: string]: {
          progress: number;
          startTime: number;
        };
      };
  private _statusBarMessageDisposable: Code.Disposable | null;

  public constructor(context: Code.ExtensionContext) {
    this._context = context;
    this._progressMap = {};
    this._statusBarMessageDisposable = null;
  }

  private static getKeys(obj: any): string[] {
    const result: string[] = [];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) result.push(key);
    }

    return result;
  }

  private newProgressCallback(): void {
    if (this._statusBarMessageDisposable != null) return;
    const uris: string[] = ProgressNotificationHandler.getKeys(this._progressMap);
    const now: number = Date.now();

    for (const uri of uris) {
      if (now - this._progressMap[uri].startTime >= 5000) {
        this._statusBarMessageDisposable =
            Code.window.setStatusBarMessage(`$(loading~spin) ${i18n('ltexIsChecking')}`, 300000);
        this._context.subscriptions.push(this._statusBarMessageDisposable);
        break;
      }
    }
  }

  public process(params: any): void {
    if (params.operation != 'checkDocument') {
      Logger.warn(i18n('unknownOperationInProgressEvent', params.operation, params));
      return;
    }

    if (params.progress == 1) {
      if (Object.prototype.hasOwnProperty.call(this._progressMap, params.uri)) {
        delete this._progressMap[params.uri];
        const uris: string[] = ProgressNotificationHandler.getKeys(this._progressMap);

        if ((uris.length == 0) && (this._statusBarMessageDisposable != null)) {
          this._statusBarMessageDisposable.dispose();
          this._statusBarMessageDisposable = null;
        }
      }
    } else {
      this._progressMap[params.uri] = {progress: params.progress, startTime: Date.now()};

      if (this._statusBarMessageDisposable == null) {
        setTimeout(this.newProgressCallback.bind(this), 5100);
      }
    }
  }
}
