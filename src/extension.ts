'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as net from 'net';
import * as child_process from "child_process";

import { workspace, Disposable, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, SettingMonitor, StreamInfo } from 'vscode-languageclient';

export function activate(context: ExtensionContext) {

	function discoverExtensions() {
		const extensionsDir = path.resolve(context.extensionPath, '..')

		const installedExtensions = fs.readdirSync(extensionsDir)

		const extensionRegEx = /^adamvoss\.vscode-languagetool-(?:.*)-(?:.*?)$/
		return installedExtensions.filter(s => extensionRegEx.test(s))
	}

	function buildDesiredClasspath() {
		const isWindows = process.platform === 'win32';

		const joinCharacter = isWindows ? ';' : ':'

		const additionalPaths = discoverExtensions()
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
				if (context.storagePath) {
					if (!fs.existsSync(context.storagePath)) {
						console.log(context.storagePath);
						fs.mkdirSync(context.storagePath);
					}

					let logFile = context.storagePath + '/vscode-languagetool-languageserver.log';
					let logStream = fs.createWriteStream(logFile, { flags: 'w' });

					process.stdout.pipe(logStream);
					process.stderr.pipe(logStream);

					console.log(`Storing log in '${logFile}'`);
				}
				else {
					console.log("No storagePath, languagetool-languageserver logging disabled.");
				}
			});
		});
	};

	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		documentSelector: ['plaintext', 'markdown'],
		synchronize: {
			configurationSection: 'languageTool'
		}
	}

	// Create the language client and start the client.
	let disposable = new LanguageClient('languageTool', 'LanguageTool Client', createServer, clientOptions).start();

	// Push the disposable to the context's subscriptions so that the 
	// client can be deactivated on extension deactivation
	context.subscriptions.push(disposable);
}