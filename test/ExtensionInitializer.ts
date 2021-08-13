/* Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient/node';

import * as Ltex from '../src/extension';
import TestTools from './TestTools';

export default class ExtensionInitializer {
  private static _languageClient: CodeLanguageClient.LanguageClient | null = null;

  public static async initialize(): Promise<void> {
    if (ExtensionInitializer._languageClient != null) return Promise.resolve();

    const ltex: Code.Extension<Ltex.Api> | undefined =
        Code.extensions.getExtension('valentjn.vscode-ltex');
    if (ltex == null) return Promise.reject(new Error('Could not find LTeX.'));

    Code.workspace.getConfiguration('ltex').update('trace.server', 'messages',
        Code.ConfigurationTarget.Global);
    const document: Code.TextDocument = await TestTools.createNewFile(
        'markdown', 'This is an *test*.');
    console.log('Waiting for activation of LTeX...');

    for (let i: number = 0; i < 120; i++) {
      if (ltex.isActive) break;
      await TestTools.sleep(500);
    }

    const api: Ltex.Api | null = ltex.exports;

    if (api.clientOutputChannel == null) {
      return Promise.reject(new Error('Client output channel not initialized.'));
    }

    console.log(api.clientOutputChannel.getContents());
    api.clientOutputChannel.onAppend((text: string) => {
      console.log(text);
    });

    if (api.serverOutputChannel == null) {
      return Promise.reject(new Error('Server output channel not initialized.'));
    }

    console.log(api.serverOutputChannel.getContents());
    api.serverOutputChannel.onAppend((text: string) => {
      console.log(text);
    });

    console.log('Waiting for language client to be ready...');
    ExtensionInitializer._languageClient = api.languageClient;

    if (ExtensionInitializer._languageClient == null) {
      return Promise.reject(new Error('Language client not initialized.'));
    }

    await ExtensionInitializer._languageClient.onReady();
    console.log('Language client is ready.');

    let ltexReady: boolean = false;

    for (let i: number = 0; i < 120; i++) {
      const diagnostics: Code.Diagnostic[] = Code.languages.getDiagnostics(document.uri);

      if ((diagnostics.length == 1) && (diagnostics[0].source == 'LTeX')) {
        ltexReady = true;
        break;
      }

      await TestTools.sleep(500);
    }

    if (!ltexReady) return Promise.reject(new Error('LTeX not successfully initialized.'));
  }

  public static async getLanguageClient(): Promise<CodeLanguageClient.LanguageClient> {
    if (ExtensionInitializer._languageClient != null) {
      return Promise.resolve(ExtensionInitializer._languageClient);
    } else {
      return ExtensionInitializer.initialize().then(
        () => new Promise((resolve: (value: CodeLanguageClient.LanguageClient) => void,
              reject: (reason: Error) => void) => {
          if (ExtensionInitializer._languageClient != null) {
            resolve(ExtensionInitializer._languageClient);
          } else {
            reject(new Error('LTeX not successfully initialized.'));
          }
        }),
      );
    }
  }

  public static async resetState(): Promise<void> {
    console.log('Closing all editors...');
    await Code.commands.executeCommand('workbench.action.closeAllEditors');
    await TestTools.sleep(200);
    return Promise.resolve();
  }
}
