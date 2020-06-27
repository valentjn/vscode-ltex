import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient';

import BugReporter from './BugReporter';
import Dependencies from './Dependencies';
import {I18n, i18n} from './I18n';
import Logger from './Logger';
import LoggingOutputChannel from './LoggingOutputChannel';
import TelemetryProcessor from './TelemetryProcessor';

export class Api {
  public languageClient: CodeLanguageClient.LanguageClient | null = null;
  public clientOutputChannel: LoggingOutputChannel | null = null;
  public serverOutputChannel: LoggingOutputChannel | null = null;
}

let dependencies: Dependencies | null = null;

async function languageClientIsReady(disposable: Code.Disposable): Promise<void> {
  disposable.dispose();
  Code.window.setStatusBarMessage(`$(check) ${i18n('ltexReady')}`, 1000);

  const numberOfLanguageSupportExtensions: number = Code.extensions.all.filter(
      (x: Code.Extension<any>) => x.id.startsWith('valentjn.vscode-ltex-')).length;

  if (numberOfLanguageSupportExtensions > 0) {
    let message: string = `${i18n('thanksForUpgradingToLtex5x')} `;

    if (numberOfLanguageSupportExtensions > 1) {
      message += `${i18n('removeLanguageSupportExtensions')} `;
    } else {
      message += `${i18n('removeLanguageSupportExtension')} `;
    }

    message += i18n('reviewSummaryOfImportantMajorChanges');

    Code.window.showInformationMessage(message,
          i18n('moreInfoAboutLtex5x')).then((selectedItem: string | undefined) => {
      if (selectedItem != null) {
        Code.env.openExternal(Code.Uri.parse(
            'https://valentjn.github.io/vscode-ltex/docs/transitioning-to-ltex-5x.html'));
      }
    });
  }
}

async function startLanguageClient(context: Code.ExtensionContext):
      Promise<CodeLanguageClient.LanguageClient | null> {
  if (dependencies == null) {
    Logger.error('Dependencies not initialized!');
    return Promise.resolve(null);
  }

  const success: boolean = await dependencies.install();
  if (success !== true) return Promise.resolve(null);

  const statusBarMessageDisposable: Code.Disposable =
      Code.window.setStatusBarMessage(`$(loading~spin) ${i18n('startingLtex')}`, 60000);
  const serverOptions: CodeLanguageClient.ServerOptions = await dependencies.getLtexLsExecutable();

  // Options to control the language client
  const clientOptions: CodeLanguageClient.LanguageClientOptions = {
        documentSelector: [
          {scheme: 'file', language: 'markdown'},
          {scheme: 'untitled', language: 'markdown'},
          {scheme: 'file', language: 'latex'},
          {scheme: 'untitled', language: 'latex'},
          {scheme: 'file', language: 'rsweave'},
          {scheme: 'untitled', language: 'rsweave'},
        ],
        synchronize: {
          configurationSection: 'ltex',
        },
        // Until it is specified in the LSP that the locale is automatically sent with
        // the initialization request, we have to do that manually.
        // See https://github.com/microsoft/language-server-protocol/issues/754.
        initializationOptions: {
          locale: Code.env.language,
        },
        revealOutputChannelOn: CodeLanguageClient.RevealOutputChannelOn.Never,
        traceOutputChannel: Logger.clientOutputChannel,
        outputChannel: Logger.serverOutputChannel,
      };

  const languageClient: CodeLanguageClient.LanguageClient = new CodeLanguageClient.LanguageClient(
      'ltex', i18n('ltexLanguageServer'), serverOptions, clientOptions);

  languageClient.onReady().then(languageClientIsReady.bind(null, statusBarMessageDisposable));

  // Hack to enable the server to execute commands that change the client configuration
  // (e.g., adding words to the dictionary).
  // The client configuration cannot be directly changed by the server, so we send a
  // telemetry notification to the client, which then changes the configuration.
  const telemetryProcessor: TelemetryProcessor = new TelemetryProcessor(context);
  languageClient.onTelemetry(telemetryProcessor.process, telemetryProcessor);

  Logger.log(i18n('startingLtexLs'));
  Logger.logExecutable(serverOptions);
  Logger.log('');

  languageClient.info(i18n('startingLtexLs'));
  const languageClientDisposable: Code.Disposable = languageClient.start();

  // Push the disposable to the context's subscriptions so that the
  // client can be deactivated on extension deactivation
  context.subscriptions.push(languageClientDisposable);
  context.subscriptions.push(statusBarMessageDisposable);

  return Promise.resolve(languageClient);
}

export async function activate(context: Code.ExtensionContext): Promise<Api> {
  Logger.createOutputChannels(context);
  I18n.initialize(context);

  const api: Api = new Api();
  api.clientOutputChannel = Logger.clientOutputChannel;
  api.serverOutputChannel = Logger.serverOutputChannel;

  dependencies = new Dependencies(context);
  const bugReporter: BugReporter = new BugReporter(context, dependencies);
  context.subscriptions.push(Code.commands.registerCommand('ltex.reportBug',
      bugReporter.report.bind(bugReporter)));

  // Allow to enable languageTool in specific workspaces
  const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');

  if (workspaceConfig.get('enabled')) {
    try {
      // create the language client
      api.languageClient = await startLanguageClient(context);
    } catch (e) {
      Logger.error(i18n('couldNotStartLanguageClient'), e);
      Logger.showClientOutputChannel();
      Code.window.showErrorMessage(i18n('couldNotStartLanguageClient'));
    }
  }

  return Promise.resolve(api);
}
