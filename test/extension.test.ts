/* Copyright (C) 2020 Julian Valentin, LTeX Development Community
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
    Assert.strictEqual(diagnostics[0].source, 'LTeX - EN_A_VS_AN');
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

  it('Test deletion of diagnostics when closing files', async () => {
    const document: Code.TextDocument = await TestTools.createNewFile('latex',
        'This is an \\textbf{test}.');
    await assertCheckingResult(document);
    Code.commands.executeCommand('workbench.action.closeActiveEditor');
    await TestTools.sleep(1000);
    Assert.strictEqual(Code.languages.getDiagnostics(document.uri).length, 0);
  });

  it('Test ltex.clearDiagnosticsWhenClosingFile', async () => {
    try {
      Code.workspace.getConfiguration('ltex').update('clearDiagnosticsWhenClosingFile', false,
          Code.ConfigurationTarget.Global);
      const document: Code.TextDocument = await TestTools.createNewFile('latex',
          'This is an \\textbf{test}.');
      await assertCheckingResult(document);
      Code.commands.executeCommand('workbench.action.closeActiveEditor');
      await TestTools.sleep(1000);
      Assert.strictEqual(Code.languages.getDiagnostics(document.uri).length, 1);
    } finally {
      Code.workspace.getConfiguration('ltex').update('clearDiagnosticsWhenClosingFile', undefined,
          Code.ConfigurationTarget.Global);
    }
  });
});
