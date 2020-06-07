import * as Code from 'vscode';

type Entry = {
  time: number;
  text: string;
};

export default class LoggingOutputChannel implements Code.OutputChannel {
  public readonly name: string;
  private _outputChannel: Code.OutputChannel;
  private _entries: Entry[];
  private _onAppendEventEmitter: Code.EventEmitter<string>;

  private static readonly pruneDuration: number = 86400;

  public constructor(name: string) {
    this.name = name;
    this._outputChannel = Code.window.createOutputChannel(name);
    this._entries = [];
    this._onAppendEventEmitter = new Code.EventEmitter<string>();
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

  public getContents(): string {
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

  public show(preserveFocus?: boolean | undefined): void;
  public show(column?: Code.ViewColumn | undefined, preserveFocus?: boolean | undefined): void;
  public show(column?: any, preserveFocus?: any): void {
    this._outputChannel.show(column, preserveFocus);
  }

  public hide(): void {
    this._outputChannel.hide();
  }

  public dispose(): void {
    this._onAppendEventEmitter.dispose();
    this._outputChannel.dispose();
  }
}
