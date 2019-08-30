'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as net from 'net';
import * as child_process from "child_process";

import { extensions, workspace, Disposable, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, SettingMonitor, StreamInfo } from 'vscode-languageclient';

export function activate(context: ExtensionContext) {

  function discoverExtensionPaths() {
    return extensions.all
      .filter(x => x.id.startsWith("valentjn.vscode-languagetool-"))
      .map(x => x.extensionPath)
  }

  function buildDesiredClasspath() {
    const isWindows = process.platform === 'win32';

    const joinCharacter = isWindows ? ';' : ':'

    const additionalPaths = discoverExtensionPaths()
      .map(p => path.resolve(context.extensionPath, '..', p, 'lib', '*'))
      .join(joinCharacter);

    let desiredClasspath = path.join('lib', '*');
    if (additionalPaths) {
      desiredClasspath += joinCharacter + additionalPaths
    }
    return desiredClasspath
  }

  function setClasspath(text: String, desiredClasspath: String): String {
    const classpathRegexp = /^((?:set )?CLASSPATH=[%$]APP_HOME%?[\\\/])(.*)$/m

    return text.replace(classpathRegexp, `$1${desiredClasspath}`)
  }

  function createServer(): Promise<StreamInfo> {
    return new Promise((resolve, reject) => {
      var server = net.createServer((socket) => {
        console.log("Creating server");

        resolve({
          reader: socket,
          writer: socket
        });

        socket.on('end', () => console.log("Disconnected"));
      }).on('error', (err) => {
        // handle errors here
        throw err;
      });

      let isWindows = process.platform === 'win32';

      // grab a random port.
      server.listen(() => {
        // Start the child java process
        let options = { cwd: workspace.rootPath };

        const scriptDir = path.resolve(context.extensionPath, 'lib', 'languagetool-languageserver', 'build', 'install', 'languagetool-languageserver', 'bin')
        let originalScript = path.resolve(scriptDir, isWindows ? 'languagetool-languageserver.bat' : 'languagetool-languageserver')
        const newScript = path.resolve(scriptDir, isWindows ? 'languagetool-languageserver-live.bat' : 'languagetool-languageserver-live')

        const scriptText = fs.readFileSync(originalScript, "utf8")
        const newText = setClasspath(scriptText, buildDesiredClasspath())
        fs.writeFileSync(newScript, newText, { mode: 0o777 })

        let process = child_process.spawn(newScript, [server.address().port.toString()], options);

        // Send raw output to a file
        let logFile = '/tmp/vscode-languagetool-languageserver.log';
        let logStream = fs.createWriteStream(logFile, { flags: 'w' });

        process.stdout.pipe(logStream);
        process.stderr.pipe(logStream);

        console.log(`Storing log in '${logFile}'`);
      });
    });
  };

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    documentSelector: ['plaintext', 'markdown', 'latex'],
    synchronize: {
      configurationSection: 'languageTool'
    }
  }

  // Allow to enable languageTool in specific workspaces
  let config = workspace.getConfiguration('languageTool');

  if (config['enabled']) {
    // create the language client
    let languageClient = new LanguageClient(
        'languageTool', 'LanguageTool Client', createServer, clientOptions);

    // Hack to enable the server to add words to the dictionary.
    // The client configuration cannot be changed directly by the server, so we send a
    // telemetry notification to the client, which then adds the word to the dictionary.
    languageClient.onTelemetry((param) => {
      let config = workspace.getConfiguration('languageTool');
      const prefix: string = 'languageTool.addToDictionary ';

      if (param.startsWith(prefix)) {
        const word: string = param.substring(prefix.length);
        let languagePrefix: string = config['language'];
        const dashPos: number = languagePrefix.indexOf('-');
        if (dashPos != -1) languagePrefix = languagePrefix.substring(0, dashPos);
        let dictionary: string[] = config[languagePrefix]['dictionary'];
        dictionary.push(word);
        dictionary.sort((a: string, b: string) =>
            a.localeCompare(b, undefined, { sensitivity: 'base' }));
        config.update(languagePrefix + '.dictionary', dictionary,
            ((workspace.rootPath) ? undefined : true));
      } else {
        console.warn(`vscode-languagetool: Unknown telemetry event "${param}"`);
      }
    });

    let disposable = languageClient.start();

    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(disposable);
  }
}
