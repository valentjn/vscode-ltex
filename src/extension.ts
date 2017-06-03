'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as net from 'net';
import * as child_process from "child_process";

import { workspace, Disposable, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, SettingMonitor, StreamInfo } from 'vscode-languageclient';

export function activate(context: ExtensionContext) {

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

				let script = path.resolve(context.extensionPath, 'lib', 'languagetool-languageserver', 'build', 'install', 'languagetool-languageserver', 'bin', isWindows ? 'languagetool-languageserver.bat' : 'languagetool-languageserver')

				let process = child_process.spawn(script, [server.address().port.toString()], options);

				// Send raw output to a file
				if (!fs.existsSync(context.storagePath))
					fs.mkdirSync(context.storagePath);

				let logFile = context.storagePath + '/vscode-languagetool-languageserver.log';
				let logStream = fs.createWriteStream(logFile, { flags: 'w' });

				process.stdout.pipe(logStream);
				process.stderr.pipe(logStream);

				console.log(`Storing log in '${logFile}'`);
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