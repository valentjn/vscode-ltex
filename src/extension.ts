/* Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// #if TARGET == 'vscode'
import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient/node';
// #elseif TARGET == 'coc.nvim'
// import * as Code from 'coc.nvim';
// import CodeLanguageClient = Code;
// #endif

import BugReporter from './BugReporter';
import CommandHandler from './CommandHandler';
import DependencyManager from './DependencyManager';
import ExternalFileManager from './ExternalFileManager';
import {I18n, i18n} from './I18n';
import Logger from './Logger';
import LoggingOutputChannel from './LoggingOutputChannel';
import StatusBarItemManager from './StatusBarItemManager';
import StatusPrinter from './StatusPrinter';
import WorkspaceConfigurationRequestHandler from './WorkspaceConfigurationRequestHandler';

export class Api {
  public languageClient: CodeLanguageClient.LanguageClient | null = null;
  public clientOutputChannel: LoggingOutputChannel | null = null;
  public serverOutputChannel: LoggingOutputChannel | null = null;
}

let dependencyManager: DependencyManager | null = null;

async function languageClientIsReady(languageClient: CodeLanguageClient.LanguageClient,
      externalFileManager: ExternalFileManager,
      statusBarItemManager: StatusBarItemManager): Promise<void> {
  statusBarItemManager.setStatusToReady();
  languageClient.onNotification('$/progress',
      statusBarItemManager.handleProgressNotification.bind(statusBarItemManager));

  const workspaceConfigurationRequestHandler: WorkspaceConfigurationRequestHandler =
      new WorkspaceConfigurationRequestHandler(externalFileManager);
  languageClient.onRequest('ltex/workspaceSpecificConfiguration',
      workspaceConfigurationRequestHandler.handle.bind(workspaceConfigurationRequestHandler));
}

async function startLanguageClient(context: Code.ExtensionContext,
      externalFileManager: ExternalFileManager, statusPrinter: StatusPrinter):
      Promise<CodeLanguageClient.LanguageClient | null> {
  let serverOptions: CodeLanguageClient.ServerOptions | null = null;

  // #if TARGET == 'vscode'
  if (context.extensionMode == Code.ExtensionMode.Development) {
    serverOptions = DependencyManager.getDebugServerOptions();
  }
  // #endif

  if (serverOptions == null) {
    if (dependencyManager == null) {
      Logger.error('DependencyManager not initialized!');
      return Promise.resolve(null);
    }

    const success: boolean = await dependencyManager.install();
    if (success !== true) return Promise.resolve(null);
    serverOptions = await dependencyManager.getLtexLsExecutable();
  }

  const statusBarItemManager: StatusBarItemManager = new StatusBarItemManager(context);

  const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');
  const enabled: any = workspaceConfig.get('enabled');
  let enabledCodeLanguageIds: string[];

  if ((enabled === true) || (enabled === false)) {
    enabledCodeLanguageIds = (enabled ? CommandHandler.getDefaultCodeLanguageIds() : []);
  } else {
    enabledCodeLanguageIds = enabled;
  }

  const documentSelector: CodeLanguageClient.DocumentFilter[] = [];

  for (const codeLanguageId of enabledCodeLanguageIds) {
    documentSelector.push({scheme: 'file', language: codeLanguageId});
    documentSelector.push({scheme: 'untitled', language: codeLanguageId});
    documentSelector.push({scheme: 'vscode-notebook-cell', language: codeLanguageId});
  }

  const clientOptions: CodeLanguageClient.LanguageClientOptions = {
        documentSelector: documentSelector,
        synchronize: {
          configurationSection: 'ltex',
        },
        // LSP sends locale itself since LSP 3.16.0. However, this would require VS Code 1.53.0.
        // Currently, we only require VS Code 1.52.0.
        initializationOptions: {
          // #if TARGET == 'vscode'
          locale: Code.env.language,
          // #endif
          customCapabilities: {
            workspaceSpecificConfiguration: true,
          },
        },
        revealOutputChannelOn: CodeLanguageClient.RevealOutputChannelOn.Never,
        // #if TARGET == 'vscode'
        traceOutputChannel: Logger.clientOutputChannel,
        // #endif
        outputChannel: Logger.serverOutputChannel,
      };

  const languageClient: CodeLanguageClient.LanguageClient = new CodeLanguageClient.LanguageClient(
      'ltex', i18n('ltexLanguageServer'), serverOptions, clientOptions);

  languageClient.onReady().then(languageClientIsReady.bind(
      null, languageClient, externalFileManager, statusBarItemManager));
  statusPrinter.languageClient = languageClient;

  if ('command' in serverOptions) {
    Logger.log(i18n('startingLtexLs'));
    Logger.logExecutable(serverOptions);
    Logger.log('');
  }

  languageClient.info(i18n('startingLtexLs'));
  const languageClientDisposable: Code.Disposable = languageClient.start();
  context.subscriptions.push(languageClientDisposable);

  return Promise.resolve(languageClient);
}

export async function activate(context: Code.ExtensionContext): Promise<Api> {
  Logger.createOutputChannels(context);
  I18n.initialize(context);

  const api: Api = new Api();
  api.clientOutputChannel = Logger.clientOutputChannel;
  api.serverOutputChannel = Logger.serverOutputChannel;

  dependencyManager = new DependencyManager(context);

  const externalFileManager: ExternalFileManager = new ExternalFileManager(context);
  const statusPrinter: StatusPrinter = new StatusPrinter(
      context, dependencyManager, externalFileManager);
  const bugReporter: BugReporter = new BugReporter(context, dependencyManager, statusPrinter);
  const commandHandler: CommandHandler = new CommandHandler(
      context, externalFileManager, statusPrinter, bugReporter);

  const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');
  const enabled: any = workspaceConfig.get('enabled');

  if ((enabled === true) || (enabled.length > 0)) {
    try {
      api.languageClient = await startLanguageClient(context, externalFileManager, statusPrinter);
      commandHandler.languageClient = api.languageClient;
    } catch (e: unknown) {
      Logger.error(i18n('couldNotStartLanguageClient'), e);
      Logger.showClientOutputChannel();
      Code.window.showErrorMessage(i18n('couldNotStartLanguageClient'));
    }
  }

  return Promise.resolve(api);
}
