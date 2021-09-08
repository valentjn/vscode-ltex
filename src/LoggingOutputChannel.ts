/* Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// #if TARGET == 'vscode'
import * as Code from 'vscode';
import EventEmitter = Code.EventEmitter;
// #elseif TARGET == 'coc.nvim'
// import * as Code from 'coc.nvim';
// import EventEmitter = Code.Emitter;
// #endif

type Entry = {
  time: number;
  text: string;
};

export default class LoggingOutputChannel implements Code.OutputChannel {
  public readonly name: string;
  private _outputChannel: Code.OutputChannel;
  private _entries: Entry[];
  private _onAppendEventEmitter: EventEmitter<string>;

  private static readonly pruneDuration: number = 86400;

  public constructor(name: string) {
    this.name = name;
    this._outputChannel = Code.window.createOutputChannel(name);
    this._entries = [];
    this._onAppendEventEmitter = new EventEmitter<string>();
  }

  private pruneOldEntries(): void {
    const now: number = Date.now();

    while (this._entries.length > 0) {
      if (now - this._entries[0].time >= 1000 * LoggingOutputChannel.pruneDuration) {
        this._entries.shift();
      } else {
        break;
      }
    }
  }

  private appendEntry(text: string): void {
    this._entries.push({time: Date.now(), text: text});
  }

  public append(value: string): void {
    this._outputChannel.append(value);
    this.pruneOldEntries();
    this.appendEntry(value);
    this._onAppendEventEmitter.fire(value);
  }

  public appendLine(value: string): void {
    this._outputChannel.appendLine(value);
    this.pruneOldEntries();
    this.appendEntry(value + '\n');
    this._onAppendEventEmitter.fire(value + '\n');
  }

  public get content(): string {
    let contents: string = '';

    this._entries.forEach((entry: Entry) => {
      contents += entry.text;
    });

    return contents;
  }

  public onAppend(listener: (text: string) => void): void {
    this._onAppendEventEmitter.event(listener);
  }

  public clear(): void {
    this._outputChannel.clear();
    this._entries = [];
  }

  // #if TARGET == 'vscode'
  public show(preserveFocus?: boolean | undefined): void;
  public show(column?: Code.ViewColumn | undefined, preserveFocus?: boolean | undefined): void;
  public show(_column?: any, preserveFocus?: any): void {
  // #elseif TARGET == 'coc.nvim'
  // public show(preserveFocus?: boolean): void {
  // #endif
    this._outputChannel.show(preserveFocus);
  }

  public hide(): void {
    this._outputChannel.hide();
  }

  public dispose(): void {
    this._onAppendEventEmitter.dispose();
    this._outputChannel.dispose();
  }
}
