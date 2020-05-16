'use strict';

import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient';

export default class Logger {
  private static _clientOutputChannel: Code.OutputChannel;
  private static _serverOutputChannel: Code.OutputChannel;

  public static log(message: string, type: string = 'Info'): void {
    const timestamp: string = (new Date()).toISOString();
    const lines: string[] = message.split(/\r?\n/);

    lines.forEach((line: string) => {
      Logger._clientOutputChannel.appendLine(`${timestamp} ${type}: ${line}`);
    });
  }

  public static warn(message: string): void {
    Logger.log(message, 'Warning');
  }

  public static error(message: string, e?: Error): void {
    Logger.log(message, 'Error');

    if (e != null) {
      Logger.log('Error details:', 'Error');
      Logger.log(e.stack, 'Error');
    }
  }

  public static logExecutable(executable: CodeLanguageClient.Executable): void {
    Logger.log('  Command: ' + JSON.stringify(executable.command));
    Logger.log('  Arguments: ' + JSON.stringify(executable.args));
    Logger.log('  env[\'JAVA_HOME\']: ' +
        JSON.stringify(executable.options.env['JAVA_HOME']));
    Logger.log('  env[\'LTEX_LS_OPTS\']: ' +
        JSON.stringify(executable.options.env['LTEX_LS_OPTS']));
  }

  public static createOutputChannels(context: Code.ExtensionContext): void {
    Logger._clientOutputChannel = Code.window.createOutputChannel('LTeX Language Client');
    Logger._serverOutputChannel = Code.window.createOutputChannel('LTeX Language Server');

    context.subscriptions.push(Logger._clientOutputChannel);
    context.subscriptions.push(Logger._serverOutputChannel);
  }

  public static showClientOutputChannel(): void {
    Logger._clientOutputChannel.show();
  }

  public static get clientOutputChannel(): Code.OutputChannel { return Logger._clientOutputChannel; }
  public static get serverOutputChannel(): Code.OutputChannel { return Logger._serverOutputChannel; }
}
