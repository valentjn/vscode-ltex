import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient';

export default class Logger {
  private static _clientOutputChannel: Code.OutputChannel;
  private static _serverOutputChannel: Code.OutputChannel;
  private static _isDebugMode: boolean = (
      (Object.prototype.hasOwnProperty.call(process.env, 'LTEX_DEBUG')) &&
      (process.env.LTEX_DEBUG == '1'));

  public static log(message: string, type: string = 'Info'): void {
    const timestamp: string = (new Date()).toISOString();
    const lines: string[] = message.split(/\r?\n/);

    lines.forEach((line: string) => {
      const logLine: string = `${timestamp} ${type}: ${line}`;
      Logger._clientOutputChannel.appendLine(logLine);
      if (Logger._isDebugMode) console.log(logLine);
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
      Logger.log('  env[\'JAVA_HOME\']: ' +
          JSON.stringify(executable.options.env['JAVA_HOME']));
      Logger.log('  env[\'LTEX_LS_OPTS\']: ' +
          JSON.stringify(executable.options.env['LTEX_LS_OPTS']));
    }
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

  public static get clientOutputChannel(): Code.OutputChannel {
    return Logger._clientOutputChannel;
  }

  public static get serverOutputChannel(): Code.OutputChannel {
    return Logger._serverOutputChannel;
  }
}
