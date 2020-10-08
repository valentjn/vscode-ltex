/* Copyright (C) 2020 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient';

import BugReporter from './BugReporter';
import CommandHandler from './CommandHandler';
import DependencyManager from './DependencyManager';
import {I18n, i18n} from './I18n';
import Logger from './Logger';
import LoggingOutputChannel from './LoggingOutputChannel';
import ProgressNotificationHandler from './ProgressNotificationHandler';
import WorkspaceConfigurationRequestHandler from './WorkspaceConfigurationRequestHandler';

export class Api {
  public languageClient: CodeLanguageClient.LanguageClient | null = null;
  public clientOutputChannel: LoggingOutputChannel | null = null;
  public serverOutputChannel: LoggingOutputChannel | null = null;
}

let dependencyManager: DependencyManager | null = null;

async function languageClientIsReady(context: Code.ExtensionContext,
      languageClient: CodeLanguageClient.LanguageClient,
      disposable: Code.Disposable): Promise<void> {
  disposable.dispose();
  Code.window.setStatusBarMessage(`$(check) ${i18n('ltexReady')}`, 1000);

  const progressNotificationHandler: ProgressNotificationHandler =
      new ProgressNotificationHandler(context);
  languageClient.onNotification('ltex/progress',
      progressNotificationHandler.handle.bind(progressNotificationHandler));

  languageClient.onRequest('ltex/workspaceSpecificConfiguration',
      WorkspaceConfigurationRequestHandler.handle);

  const numberOfLanguageSupportExtensions: number = Code.extensions.all.filter(
      (x: Code.Extension<any>) => x.id.startsWith('valentjn.vscode-ltex-')).length;

  if (numberOfLanguageSupportExtensions > 0) {
    let message: string = `${i18n('thanksForUpgradingFromLtex4x')} `;

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
            'https://valentjn.github.io/vscode-ltex/docs/transitioning-from-ltex-4x.html'));
      }
    });
  }
}

async function startLanguageClient(context: Code.ExtensionContext):
      Promise<CodeLanguageClient.LanguageClient | null> {
  if (dependencyManager == null) {
    Logger.error('DependencyManager not initialized!');
    return Promise.resolve(null);
  }

  const success: boolean = await dependencyManager.install();
  if (success !== true) return Promise.resolve(null);

  const statusBarMessageDisposable: Code.Disposable =
      Code.window.setStatusBarMessage(`$(loading~spin) ${i18n('startingLtex')}`, 60000);
  const serverOptions: CodeLanguageClient.ServerOptions =
      await dependencyManager.getLtexLsExecutable();

  const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');
  const enabled: any = workspaceConfig.get('enabled');
  let enabledCodeLanguageIds: string[];

  if ((enabled === true) || (enabled === false)) {
    enabledCodeLanguageIds = (enabled ? ['markdown', 'latex', 'rsweave'] : []);
  } else {
    enabledCodeLanguageIds = enabled;
  }

  const documentSelector: CodeLanguageClient.DocumentFilter[] = [];

  for (const codeLanguageId of enabledCodeLanguageIds) {
    documentSelector.push({scheme: 'file', language: codeLanguageId});
    documentSelector.push({scheme: 'untitled', language: codeLanguageId});
  }

  // Options to control the language client
  const clientOptions: CodeLanguageClient.LanguageClientOptions = {
        documentSelector: documentSelector,
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

  languageClient.onReady().then(languageClientIsReady.bind(
      null, context, languageClient, statusBarMessageDisposable));

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

  dependencyManager = new DependencyManager(context);
  const bugReporter: BugReporter = new BugReporter(context, dependencyManager);
  const commandHandler: CommandHandler = new CommandHandler(bugReporter);
  commandHandler.register(context);

  // Allow to enable languageTool in specific workspaces
  const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');
  const enabled: any = workspaceConfig.get('enabled');

  if ((enabled === true) || (enabled.length > 0)) {
    try {
      // create the language client
      api.languageClient = await startLanguageClient(context);
      commandHandler.languageClient = api.languageClient;
    } catch (e) {
      Logger.error(i18n('couldNotStartLanguageClient'), e);
      Logger.showClientOutputChannel();
      Code.window.showErrorMessage(i18n('couldNotStartLanguageClient'));
    }
  }

  return Promise.resolve(api);
}
