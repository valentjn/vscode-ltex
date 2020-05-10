'use strict';

import * as path from 'path';

import { ConfigurationTarget, Disposable, env, ExtensionContext, OutputChannel,
    Uri, window, workspace, WorkspaceConfiguration } from 'vscode';
import { LanguageClient, LanguageClientOptions, RevealOutputChannelOn,
    ServerOptions } from 'vscode-languageclient';

async function setConfigurationSetting(settingName: string, settingValue: any,
      resourceConfig: WorkspaceConfiguration, commandName: string): Promise<void> {
  const configurationTargetString: string = resourceConfig['configurationTarget'][commandName];
  let configurationTargets: ConfigurationTarget[];

  if (configurationTargetString === 'global') {
    configurationTargets = [ConfigurationTarget.Global];
  } else if (configurationTargetString === 'workspace') {
    configurationTargets = [ConfigurationTarget.Workspace, ConfigurationTarget.Global];
  } else if (configurationTargetString === 'workspaceFolder') {
    configurationTargets = [ConfigurationTarget.WorkspaceFolder, ConfigurationTarget.Workspace,
        ConfigurationTarget.Global];
  }

  for (const configurationTarget of configurationTargets) {
    try {
      await resourceConfig.update(settingName, settingValue, configurationTarget);
      return;
    } catch (e) {
      if (configurationTarget == configurationTargets[configurationTargets.length - 1]) {
        console.error(`Could not set configuration "${settingName}":`);
        throw e;
      }
    }
  }
}

function convertToStringArray(obj: any): string[] {
  return (Array.isArray(obj) ? obj : [obj]);
}

function createLanguageClient(context: ExtensionContext): LanguageClient {
  const isWindows: boolean = (process.platform === 'win32');

  // Start the child java process
  const ltexLsStartPath: string = path.resolve(context.extensionPath, 'lib',
      'languagetool-languageserver', 'build', 'install',
      'languagetool-languageserver', 'bin', (isWindows ?
      'languagetool-languageserver.bat' : 'languagetool-languageserver'));

  const workspaceConfig: WorkspaceConfiguration = workspace.getConfiguration('ltex');
  const initialJavaHeapSize: number = workspaceConfig['java']['initialHeapSize'];
  const maximumJavaHeapSize: number = workspaceConfig['java']['maximumHeapSize'];
  process.env['LTEX_LS_OPTS'] = '-Xms' + initialJavaHeapSize + 'm -Xmx' + maximumJavaHeapSize + 'm';

  if ((workspaceConfig['java'] != null) && (workspaceConfig['java']['path'] != null)) {
    process.env['JAVA_HOME'] = workspaceConfig['java']['path'];
  }

  const serverOptions: ServerOptions = {
    command: ltexLsStartPath,
    args: [],
    options: {'env': process.env},
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
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
          locale: env.language,
        },
        revealOutputChannelOn: RevealOutputChannelOn.Never,
        traceOutputChannel: window.createOutputChannel('LTeX Language Client'),
      };

  const languageClient: LanguageClient = new LanguageClient(
      'ltex', 'LTeX Language Server', serverOptions, clientOptions);
  return languageClient;
}

function processTelemetry(params: any) {
  if (!('commandName' in params) || !params['commandName'].startsWith('ltex.')) {
    console.warn(`vscode-ltex: Unknown telemetry event "${params}"`);
    return;
  }

  const resourceConfig: WorkspaceConfiguration =
      workspace.getConfiguration('ltex', Uri.parse(params['uri']));

  if (params['commandName'] === 'ltex.addToDictionary') {
    const language: string = resourceConfig['language'];
    let dictionary: string[] = resourceConfig[language]['dictionary'];
    dictionary = dictionary.concat(convertToStringArray(params['word']));
    dictionary.sort((a: string, b: string) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' }));
    setConfigurationSetting(language + '.dictionary', dictionary,
        resourceConfig, 'addToDictionary');

  } else if (params['commandName'] === 'ltex.disableRule') {
    const language: string = resourceConfig['language'];
    let disabledRules: string[] = resourceConfig[language]['disabledRules'];
    disabledRules = disabledRules.concat(convertToStringArray(params['ruleId']));
    disabledRules.sort((a: string, b: string) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' }));
    setConfigurationSetting(language + '.disabledRules', disabledRules,
        resourceConfig, 'disableRule');

  } else if (params['commandName'] === 'ltex.ignoreRuleInSentence') {
    const ruleIds: string[] = convertToStringArray(params['ruleId']);
    const sentencePatterns: string[] = convertToStringArray(params['sentencePattern']);

    for (let i: number = 0; i < ruleIds.length; i++) {
      resourceConfig['ignoreRuleInSentence'].push({'rule': ruleIds[i],
          'sentence': sentencePatterns[i]});
    }

    setConfigurationSetting('ignoreRuleInSentence', resourceConfig['ignoreRuleInSentence'],
        resourceConfig, 'ignoreRuleInSentence');
  }
}

export function activate(context: ExtensionContext) {
  // Allow to enable languageTool in specific workspaces
  const workspaceConfig: WorkspaceConfiguration = workspace.getConfiguration('ltex');
  if (!workspaceConfig['enabled']) return;

  // create the language client
  const languageClient: LanguageClient = createLanguageClient(context);

  // Hack to enable the server to execute commands that change the client configuration
  // (e.g., adding words to the dictionary).
  // The client configuration cannot be directly changed by the server, so we send a
  // telemetry notification to the client, which then changes the configuration.
  languageClient.onTelemetry(processTelemetry);

  console.log('Creating server');
  let disposable: Disposable = languageClient.start();

  // Push the disposable to the context's subscriptions so that the
  // client can be deactivated on extension deactivation
  context.subscriptions.push(disposable);
}
