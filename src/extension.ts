'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as net from 'net';
import * as child_process from 'child_process';

import { env, extensions, window, workspace, ConfigurationTarget, Disposable, ExtensionContext,
  OutputChannel, Uri, WorkspaceConfiguration } from 'vscode';
import { LanguageClient, LanguageClientOptions, StreamInfo } from 'vscode-languageclient';

export function activate(context: ExtensionContext) {
  function discoverExtensionPaths(): string[] {
    return extensions.all
      .filter(x => x.id.startsWith('valentjn.vscode-ltex-'))
      .map(x => x.extensionPath);
  }

  function buildDesiredClasspath(): string {
    const isWindows = (process.platform === 'win32');
    const joinCharacter = (isWindows ? ';' : ':');
    const appHome = (isWindows ? '%APP_HOME%' : '$APP_HOME');
    const additionalPaths = discoverExtensionPaths()
      .map(p => path.resolve(context.extensionPath, '..', p, 'lib', '*'))
      .join(joinCharacter);
    let desiredClasspath = path.join(appHome, 'lib', 'languagetool-patch.jar') + joinCharacter +
        path.join(appHome, 'lib', '*');

    if (additionalPaths) {
      desiredClasspath += joinCharacter + additionalPaths;
    }

    return desiredClasspath;
  }

  function setClasspath(text: string, desiredClasspath: string): string {
    const classpathRegexp = /^((?:set )?CLASSPATH=)(.*)$/m;
    return text.replace(classpathRegexp, `$1${desiredClasspath}`);
  }

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

  function createServer(): Promise<StreamInfo> {
    return new Promise((resolve, reject) => {
      var server: net.Server = net.createServer((socket) => {
        console.log('Creating server');

        resolve({
          reader: socket,
          writer: socket
        });

        socket.on('end', () => console.log('Disconnected'));
      }).on('error', (err) => {
        // handle errors here
        throw err;
      });

      const isWindows: boolean = (process.platform === 'win32');

      // grab a random port.
      server.listen(() => {
        // Start the child java process
        const scriptDir: string = path.resolve(context.extensionPath, 'lib',
            'languagetool-languageserver', 'build', 'install',
            'languagetool-languageserver', 'bin');
        const originalScript: string = path.resolve(scriptDir, isWindows ?
            'languagetool-languageserver.bat' : 'languagetool-languageserver');
        const newScript: string = path.resolve(scriptDir, isWindows ?
            'languagetool-languageserver-live.bat' : 'languagetool-languageserver-live');

        const scriptText: string = fs.readFileSync(originalScript, 'utf8');
        const newText: string = setClasspath(scriptText, buildDesiredClasspath());
        fs.writeFileSync(newScript, newText, { mode: 0o777 });

        const environmentVariables: Object = Object.create(process.env);
        const workspaceConfig: WorkspaceConfiguration = workspace.getConfiguration('ltex');
        const initialJavaHeapSize: number = workspaceConfig['performance']['initialJavaHeapSize'];
        const maximumJavaHeapSize: number = workspaceConfig['performance']['maximumJavaHeapSize'];
        environmentVariables["LANGUAGETOOL_LANGUAGESERVER_OPTS"] =
            "-Xms" + initialJavaHeapSize + "m -Xmx" + maximumJavaHeapSize +"m";
        const childProcess: child_process.ChildProcess = child_process.spawn(
            newScript, [server.address().port.toString()], {"env": environmentVariables});

        // log output
        childProcess.stdout.on('data', function(data) { outputChannel.append(data.toString()); });
        childProcess.stderr.on('data', function(data) { outputChannel.append(data.toString()); });
      });
    });
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      {scheme: 'file', language: 'markdown'},
      {scheme: 'untitled', language: 'markdown'},
      {scheme: 'file', language: 'latex'},
      {scheme: 'untitled', language: 'latex'},
    ],
    synchronize: {
      configurationSection: 'ltex'
    },
    // Until it is specified in the LSP that the locale is automatically sent with
    // the initialization request, we have to do that manually.
    // See https://github.com/microsoft/language-server-protocol/issues/754.
    initializationOptions : {
      locale: env.language,
    },
  };

  // Allow to enable languageTool in specific workspaces
  const workspaceConfig: WorkspaceConfiguration = workspace.getConfiguration('ltex');
  if (!workspaceConfig['enabled']) return;

  // create output channel for logging
  const outputChannel: OutputChannel = window.createOutputChannel("LTeX Language Server");

  // create the language client
  const languageClient: LanguageClient = new LanguageClient(
      'ltex', 'LTeX Language Client', createServer, clientOptions);

  // Hack to enable the server to execute commands that change the client configuration
  // (e.g., adding words to the dictionary).
  // The client configuration cannot be directly changed by the server, so we send a
  // telemetry notification to the client, which then changes the configuration.
  languageClient.onTelemetry((params) => {
    if (!('commandName' in params) || !params['commandName'].startsWith('ltex.')) {
      console.warn(`vscode-ltex: Unknown telemetry event "${params}"`);
      return;
    }

    const resourceConfig: WorkspaceConfiguration =
        workspace.getConfiguration('ltex', Uri.parse(params['uri']));

    if (params['commandName'] === 'ltex.addToDictionary') {
      const language: string = resourceConfig['language'];
      let dictionary: string[] = resourceConfig[language]['dictionary'];
      dictionary.push(params['word']);
      dictionary.sort((a: string, b: string) =>
          a.localeCompare(b, undefined, { sensitivity: 'base' }));
      setConfigurationSetting(language + '.dictionary', dictionary,
          resourceConfig, 'addToDictionary');

    } else if (params['commandName'] === 'ltex.disableRule') {
      const language: string = resourceConfig['language'];
      let disabledRules: string[] = resourceConfig[language]['disabledRules'];
      disabledRules.push(params['ruleId']);
      disabledRules.sort((a: string, b: string) =>
          a.localeCompare(b, undefined, { sensitivity: 'base' }));
      setConfigurationSetting(language + '.disabledRules', disabledRules,
          resourceConfig, 'disableRule');

    } else if (params['commandName'] === 'ltex.ignoreRuleInSentence') {
      resourceConfig['ignoreRuleInSentence'].push({'rule': params['ruleId'],
          'sentence': params['sentencePattern']});
      setConfigurationSetting('ignoreRuleInSentence', resourceConfig['ignoreRuleInSentence'],
          resourceConfig, 'ignoreRuleInSentence');
    }
  });

  let disposable: Disposable = languageClient.start();

  // Push the disposable to the context's subscriptions so that the
  // client can be deactivated on extension deactivation
  context.subscriptions.push(disposable);
}
