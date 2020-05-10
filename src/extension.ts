'use strict';

import * as Path from 'path';
import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient';

async function setConfigurationSetting(settingName: string, settingValue: any,
      resourceConfig: Code.WorkspaceConfiguration, commandName: string): Promise<void> {
  const configurationTargetString: string = resourceConfig['configurationTarget'][commandName];
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
        console.error(`Could not set configuration "${settingName}":`);
        throw e;
      }
    }
  }
}

function convertToStringArray(obj: any): string[] {
  return (Array.isArray(obj) ? obj : [obj]);
}

function createLanguageClient(context: Code.ExtensionContext):
      CodeLanguageClient.LanguageClient {
  const isWindows: boolean = (process.platform === 'win32');

  // Start the child java process
  const ltexLsStartPath: string = Path.resolve(context.extensionPath, 'lib',
      'languagetool-languageserver', 'build', 'install',
      'languagetool-languageserver', 'bin', (isWindows ?
      'languagetool-languageserver.bat' : 'languagetool-languageserver'));

  const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');
  const initialJavaHeapSize: number = workspaceConfig['java']['initialHeapSize'];
  const maximumJavaHeapSize: number = workspaceConfig['java']['maximumHeapSize'];
  process.env['LTEX_LS_OPTS'] = '-Xms' + initialJavaHeapSize + 'm -Xmx' + maximumJavaHeapSize + 'm';

  if ((workspaceConfig['java'] != null) && (workspaceConfig['java']['path'] != null)) {
    process.env['JAVA_HOME'] = workspaceConfig['java']['path'];
  }

  const serverOptions: CodeLanguageClient.ServerOptions = {
    command: ltexLsStartPath,
    args: [],
    options: {'env': process.env},
  };

  var clientOutputChannel: Code.OutputChannel = null;

  if ((workspaceConfig['trace'] != null) && (workspaceConfig['trace']['server'] != null) &&
        (workspaceConfig['trace']['server'] != 'off')) {
    clientOutputChannel = Code.window.createOutputChannel('LTeX Language Client');
  }

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
        traceOutputChannel: clientOutputChannel,
      };

  return new CodeLanguageClient.LanguageClient(
      'ltex', 'LTeX Language Server', serverOptions, clientOptions);
}

function processTelemetry(params: any) {
  if (!('commandName' in params) || !params['commandName'].startsWith('ltex.')) {
    console.warn(`vscode-ltex: Unknown telemetry event "${params}"`);
    return;
  }

  const resourceConfig: Code.WorkspaceConfiguration =
      Code.workspace.getConfiguration('ltex', Code.Uri.parse(params['uri']));

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

export function activate(context: Code.ExtensionContext) {
  // Allow to enable languageTool in specific workspaces
  const workspaceConfig: Code.WorkspaceConfiguration = Code.workspace.getConfiguration('ltex');
  if (!workspaceConfig['enabled']) return;

  // create the language client
  const languageClient: CodeLanguageClient.LanguageClient = createLanguageClient(context);

  // Hack to enable the server to execute commands that change the client configuration
  // (e.g., adding words to the dictionary).
  // The client configuration cannot be directly changed by the server, so we send a
  // telemetry notification to the client, which then changes the configuration.
  languageClient.onTelemetry(processTelemetry);

  console.log('Creating server');
  let disposable: Code.Disposable = languageClient.start();

  // Push the disposable to the context's subscriptions so that the
  // client can be deactivated on extension deactivation
  context.subscriptions.push(disposable);
}
