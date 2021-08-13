/* Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Assert from 'assert';
import * as Code from 'vscode';

import ExtensionInitializer from './ExtensionInitializer';
import TestTools from './TestTools';

describe('Test extension (end-to-end)', () => {
  async function assertCheckingResult(document: Code.TextDocument): Promise<void> {
    await TestTools.sleep(5000);
    const diagnostics: Code.Diagnostic[] = Code.languages.getDiagnostics(document.uri);
    Assert.strictEqual(diagnostics.length, 1);
    Assert.strictEqual(diagnostics[0].source, 'LTeX');
  }

  before(async () => {
    await ExtensionInitializer.initialize();
  });

  beforeEach(async () => {
    await ExtensionInitializer.resetState();
  });

  it('Test checking of Markdown files', async () => {
    const document: Code.TextDocument = await TestTools.createNewFile('markdown',
        'This is an *test*.');
    return assertCheckingResult(document);
  });

  it('Test checking of LaTeX files', async () => {
    const document: Code.TextDocument = await TestTools.createNewFile('latex',
        'This is an \\textbf{test}.');
    return assertCheckingResult(document);
  });

  it('Test arrays in ltex.enabled', async () => {
    try {
      Code.workspace.getConfiguration('ltex').update('enabled', ['markdown'],
          Code.ConfigurationTarget.Global);

      const markdownDocument: Code.TextDocument = await TestTools.createNewFile('markdown',
          'This is an *test*.');
      await assertCheckingResult(markdownDocument);

      const latexDocument: Code.TextDocument = await TestTools.createNewFile('latex',
          'This is an *test*.');
      await TestTools.sleep(5000);
      const diagnostics: Code.Diagnostic[] = Code.languages.getDiagnostics(latexDocument.uri);
      Assert.strictEqual(diagnostics.length, 0);
    } finally {
      Code.workspace.getConfiguration('ltex').update('enabled', undefined,
          Code.ConfigurationTarget.Global);
    }
  });
});
