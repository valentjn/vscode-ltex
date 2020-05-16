'use strict';

import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient';

import Dependencies from './Dependencies';
import Logger from './Logger';

async function setConfigurationSetting(settingName: string, settingValue: any,
      resourceConfig: Code.WorkspaceConfiguration, commandName: string): Promise<void> {
  const configurationTargetString: string =
      resourceConfig.get(`configurationTarget.${commandName}`);
  let configurationTargets: Code.ConfigurationTarget[];

  if (configurationTargetString === 'global') {
    configurationTargets = [Code.ConfigurationTarget.Global];
  } else if (configurationTargetString === 'workspace') {
    configurationTargets = [Code.ConfigurationTarget.Workspace,
        Code.ConfigurationTarget.Global];
  } else if (configurationTargetString === 'workspaceFolder') {
    configurationTargets = [Code.ConfigurationTarget.WorkspaceFolder,
        Code.ConfigurationTarget.Workspace, Code.ConfigurationTarget.Global];
  }

  for (const configurationTarget of configurationTargets) {
    try {
      await resourceConfig.update(settingName, settingValue, configurationTarget);
      return;
    } catch (e) {
      if (configurationTarget == configurationTargets[configurationTargets.length - 1]) {
        Logger.error(`Could not set configuration '${settingName}'.`, e);
      }
    }
  }
}

function convertToStringArray(obj: any): string[] {
  return (Array.isArray(obj) ? obj : [obj]);
}

async function startLanguageClient(context: Code.ExtensionContext): Promise<void> {
  const dependencies: Dependencies = new Dependencies(context, startLanguageClient);
  const success: boolean = await dependencies.install();
  if (success !== true) return;

  const statusBarMessageDisposable: Code.Disposable =
      Code.window.setStatusBarMessage('$(loading~spin) Starting LTeX...');
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
      'ltex', 'LTeX Language Server', serverOptions, clientOptions);

  languageClient.onReady().then(languageClientIsReady.bind(null, statusBarMessageDisposable));

  // Hack to enable the server to execute commands that change the client configuration
  // (e.g., adding words to the dictionary).
  // The client configuration cannot be directly changed by the server, so we send a
  // telemetry notification to the client, which then changes the configuration.
  languageClient.onTelemetry(processTelemetry);

  Logger.log('Starting ltex-ls...');
  Logger.logExecutable(serverOptions);
  Logger.log('');

  languageClient.info('Starting ltex-ls...');
  let languageClientDisposable: Code.Disposable = languageClient.start();

  // Push the disposable to the context's subscriptions so that the
  // client can be deactivated on extension deactivation
  context.subscriptions.push(languageClientDisposable);
  context.subscriptions.push(statusBarMessageDisposable);
}

async function languageClientIsReady(disposable: Code.Disposable): Promise<void> {
  disposable.dispose();
  Code.window.setStatusBarMessage('$(check) LTeX ready', 1000);

  const numberOfLanguageSupportExtensions: number = Code.extensions.all.filter(
      (x: Code.Extension<any>) => x.id.startsWith('valentjn.vscode-ltex-')).length;

  if (numberOfLanguageSupportExtensions > 0) {
    let message: string = 'Thanks for upgrading to LTeX 5.x! ';

    if (numberOfLanguageSupportExtensions > 1) {
      message += 'You can remove the LTeX language support ' +
          'extensions now. They are not needed anymore. ';
    } else {
      message += 'You can remove the LTeX language support ' +
          'extension now. It is not needed anymore. ';
    }

    message += 'Review the readme for a summary of important major changes.';

    Code.window.showInformationMessage(message,
          'More info about LTeX 5.x').then((selectedItem: string) => {
      if (selectedItem != null) {
        Code.env.openExternal(Code.Uri.parse(
            'https://github.com/valentjn/vscode-ltex#note-for-transitioning-to-ltex-5x'));
      }
    });
  }
}

function processTelemetry(params: any): void {
  if (!('commandName' in params) || !params['commandName'].startsWith('ltex.')) {
    Logger.log(`Unknown telemetry event '${params}'.`);
    return;
  }

  const resourceConfig: Code.WorkspaceConfiguration =
      Code.workspace.getConfiguration('ltex', Code.Uri.parse(params['uri']));

  if (params['commandName'] === 'ltex.addToDictionary') {
    const language: string = resourceConfig.get('language');
    const dictionarySetting: {[language: string]: string[]} = resourceConfig.get('dictionary');
    let dictionary: string[] = (
        ((dictionarySetting != null) && (dictionarySetting[language] != null)) ?
        dictionarySetting[language] : []);
    dictionary = dictionary.concat(convertToStringArray(params['word']));
    dictionary.sort((a: string, b: string) =>
        a.localeCompare(b, undefined, {sensitivity: 'base'}));
    dictionarySetting[language] = dictionary;
    setConfigurationSetting('dictionary', dictionarySetting, resourceConfig, 'addToDictionary');

  } else if (params['commandName'] === 'ltex.disableRule') {
    const language: string = resourceConfig.get('language');
    const disabledRulesSetting: {[language: string]: string[]} =
        resourceConfig.get('disabledRules');
    let disabledRules: string[] = (
        ((disabledRulesSetting != null) && (disabledRulesSetting[language] != null)) ?
        disabledRulesSetting[language] : []);
    disabledRules = disabledRules.concat(convertToStringArray(params['ruleId']));
    disabledRules.sort((a: string, b: string) =>
        a.localeCompare(b, undefined, {sensitivity: 'base'}));
    disabledRulesSetting[language] = disabledRules;
    setConfigurationSetting('disabledRules', disabledRules, resourceConfig, 'disableRule');

  } else if (params['commandName'] === 'ltex.ignoreRuleInSentence') {
    const ruleIds: string[] = convertToStringArray(params['ruleId']);
    const sentencePatterns: string[] = convertToStringArray(params['sentencePattern']);
    const ignoredRules: any[] = resourceConfig.get('ignoreRuleInSentence');

    for (let i: number = 0; i < ruleIds.length; i++) {
      ignoredRules.push({'rule': ruleIds[i], 'sentence': sentencePatterns[i]});
    }

    setConfigurationSetting('ignoreRuleInSentence', ignoredRules, resourceConfig,
        'ignoreRuleInSentence');
  }
}

export function activate(context: Code.ExtensionContext): void {
  Logger.createOutputChannels(context);

  // Allow to enable languageTool in specific workspaces
  const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');
  if (!workspaceConfig.get('enabled')) return;

  try {
    // create the language client
    startLanguageClient(context);
  } catch (e) {
    Logger.error('Could not start the language client!', e);
    Logger.showClientOutputChannel();
    Code.window.showErrorMessage('Could not start the language client.');
  }
}
