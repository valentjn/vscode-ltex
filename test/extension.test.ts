/* Copyright (C) 2020 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Assert from 'assert';
import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient';

import * as Ltex from '../src/extension';

describe('Test extension (end-to-end)', () => {
  let api: Ltex.Api | null = null;
  let languageClient: CodeLanguageClient.LanguageClient | null = null;

  async function createNewFile(codeLanguage: string, contents?: string):
        Promise<Code.TextDocument> {
    return await Code.workspace.openTextDocument({language: codeLanguage, content: contents});
  }

  async function sleep(ms: number): Promise<void> {
    return new Promise((resolve: () => void) => setTimeout(resolve, ms));
  }

  before(async () => {
    const ltex: Code.Extension<Ltex.Api> | undefined =
        Code.extensions.getExtension('valentjn.vscode-ltex');
    if (ltex == null) throw new Error('Could not find LTeX.');

    const document: Code.TextDocument = await createNewFile('markdown', 'This is an *test*.');
    console.log('Waiting for activation of LTeX...');

    for (let i: number = 0; i < 120; i++) {
      if (ltex.isActive) break;
      await sleep(500);
    }

    api = ltex.exports;

    if (api.clientOutputChannel == null) throw new Error('Client output channel not initialized.');
    console.log(api.clientOutputChannel.getContents());
    api.clientOutputChannel.onAppend((text: string) => {
      console.log(text);
    });

    if (api.serverOutputChannel == null) throw new Error('Server output channel not initialized.');
    console.log(api.serverOutputChannel.getContents());
    api.serverOutputChannel.onAppend((text: string) => {
      console.log(text);
    });

    console.log('Waiting for language client to be ready...');
    languageClient = api.languageClient;
    if (languageClient == null) throw new Error('Language client not initialized.');
    await languageClient.onReady();
    console.log('Language client is ready.');

    let ltexReady: boolean = false;

    for (let i: number = 0; i < 120; i++) {
      const diagnostics: Code.Diagnostic[] = Code.languages.getDiagnostics(document.uri);

      if ((diagnostics.length == 1) && (diagnostics[0].source == 'LTeX - EN_A_VS_AN')) {
        ltexReady = true;
        break;
      }

      await sleep(500);
    }

    if (!ltexReady) throw new Error('LTeX not successfully initialized.');
  });

  async function assertCheckingResult(document: Code.TextDocument): Promise<void> {
    await sleep(5000);
    const diagnostics: Code.Diagnostic[] = Code.languages.getDiagnostics(document.uri);
    Assert.strictEqual(diagnostics.length, 1);
    Assert.strictEqual(diagnostics[0].source, 'LTeX - EN_A_VS_AN');
  }

  it('Test checking of Markdown files', async () => {
    const document: Code.TextDocument = await createNewFile('markdown',
        'This is an *test*.');
    return assertCheckingResult(document);
  });

  it('Test checking of LaTeX files', async () => {
    const document: Code.TextDocument = await createNewFile('latex',
        'This is an \\textbf{test}.');
    return assertCheckingResult(document);
  });
});
