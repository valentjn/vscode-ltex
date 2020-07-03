/* Copyright (C) 2020 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Code from 'vscode';

import {i18n} from './I18n';

export default class ProgressStack {
  private _taskProgressStack: number[];
  private _taskSizeStack: number[];
  private _taskNameStack: string[];
  private _progressInterface: Code.Progress<{increment?: number; message?: string}>;
  private _progressOnLastUpdate: number;

  public constructor(name: string,
        progressInterface: Code.Progress<{increment?: number; message?: string}>) {
    this._taskProgressStack = [0];
    this._taskSizeStack = [1];
    this._taskNameStack = [name];
    this._progressInterface = progressInterface;
    this._progressOnLastUpdate = 0;
  }

  public startTask(size: number, name: string): void {
    this._taskProgressStack.push(0);
    this._taskSizeStack.push(size);
    this._taskNameStack.push(name);
    this.showProgress();
  }

  public updateTask(progress: number, name?: string): void {
    const n: number = this._taskProgressStack.length;
    this._taskProgressStack[n - 1] = progress;
    if (name != null) this._taskNameStack[n - 1] = name;
    this.showProgress();
  }

  public finishTask(): void {
    const n: number = this._taskProgressStack.length - 1;
    if (n == 0) throw Error(i18n('couldNotFinishTask'));
    this._taskProgressStack.pop();
    this._taskProgressStack[n - 1] += this._taskSizeStack.pop() as number;
    this._taskNameStack.pop();
    this.showProgress();
  }

  public getTaskName(): string {
    const n: number = this._taskProgressStack.length;
    return this._taskNameStack[n - 1];
  }

  public showProgress(): void {
    const n: number = this._taskProgressStack.length;
    let currentProgress: number = 0;
    let currentSize: number = 1;

    for (let i: number = 0; i < n; i++) {
      currentSize *= this._taskSizeStack[i];
      currentProgress += currentSize * this._taskProgressStack[i];
    }

    const progressIncrement: number = 100 * currentProgress - this._progressOnLastUpdate;
    const currentName: string = this._taskNameStack[n - 1];
    this._progressInterface.report({increment: progressIncrement, message: currentName});
    this._progressOnLastUpdate = 100 * currentProgress;
  }
}
