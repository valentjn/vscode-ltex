/* Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient/node';

import LoggingOutputChannel from './LoggingOutputChannel';

export default class Logger {
  private static _clientOutputChannel: LoggingOutputChannel;
  private static _serverOutputChannel: LoggingOutputChannel;

  public static log(message: string, type: string = 'Info'): void {
    const timestamp: string = (new Date()).toISOString();
    if (message == null) message = '';
    const lines: string[] = message.split(/\r?\n/);

    lines.forEach((line: string) => {
      const logLine: string = `${timestamp} ${type}: ${line}`;
      Logger._clientOutputChannel.appendLine(logLine);
    });
  }

  public static warn(message: string, e?: Error): void {
    Logger.log(message, 'Warning');
    if (e != null) Logger.logError(e, 'Warning');
  }

  public static error(message: string, e?: Error): void {
    Logger.log(message, 'Error');
    if (e != null) Logger.logError(e, 'Error');
  }

  public static logError(e: Error, type: string = 'Info'): void {
    Logger.log('Error details:', type);
    Logger.log(((e.stack != null) ? e.stack : `${e.name}: ${e.message}`), type);
  }

  public static logExecutable(executable: CodeLanguageClient.Executable): void {
    Logger.log('  Command: ' + JSON.stringify(executable.command));
    Logger.log('  Arguments: ' + JSON.stringify(executable.args));

    if (executable.options != null) {
      Logger.log('  env[\'JAVA_HOME\']: '
          + JSON.stringify(executable.options.env['JAVA_HOME']));
      Logger.log('  env[\'JAVA_OPTS\']: '
          + JSON.stringify(executable.options.env['JAVA_OPTS']));
    }
  }

  public static createOutputChannels(context: Code.ExtensionContext): void {
    Logger._clientOutputChannel = new LoggingOutputChannel('LTeX Language Client');
    Logger._serverOutputChannel = new LoggingOutputChannel('LTeX Language Server');

    context.subscriptions.push(Logger._clientOutputChannel);
    context.subscriptions.push(Logger._serverOutputChannel);
  }

  public static showClientOutputChannel(): void {
    Logger._clientOutputChannel.show();
  }

  public static get clientOutputChannel(): LoggingOutputChannel {
    return Logger._clientOutputChannel;
  }

  public static set clientOutputChannel(clientOutputChannel: LoggingOutputChannel) {
    Logger._clientOutputChannel = clientOutputChannel;
  }

  public static get serverOutputChannel(): LoggingOutputChannel {
    return Logger._serverOutputChannel;
  }

  public static set serverOutputChannel(serverOutputChannel: LoggingOutputChannel) {
    Logger._serverOutputChannel = serverOutputChannel;
  }
}
