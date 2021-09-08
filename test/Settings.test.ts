/* Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// #if TARGET == 'vscode'
import * as Assert from 'assert';
import * as Code from 'vscode';

import ExtensionInitializer from './ExtensionInitializer';
import TestTools from './TestTools';

describe('Test settings', () => {
  before(async () => {
    await ExtensionInitializer.initialize();
  });

  beforeEach(async () => {
    await ExtensionInitializer.resetState();
  });

  it('Test deletion of diagnostics when closing files', async () => {
    const document: Code.TextDocument = await TestTools.createNewFile('latex',
        'This is an \\textbf{test}.');
    await TestTools.sleep(5000);

    Assert.strictEqual(Code.languages.getDiagnostics(document.uri).length, 1);

    await Code.commands.executeCommand('workbench.action.closeActiveEditor');
    await TestTools.sleep(1000);

    Assert.strictEqual(Code.languages.getDiagnostics(document.uri).length, 0);
  });

  it('Test ltex.clearDiagnosticsWhenClosingFile', async () => {
    try {
      Code.workspace.getConfiguration('ltex').update('clearDiagnosticsWhenClosingFile', false,
          Code.ConfigurationTarget.Global);
      const document: Code.TextDocument = await TestTools.createNewFile('latex',
          'This is an \\textbf{test}.');
      await TestTools.sleep(5000);

      Assert.strictEqual(Code.languages.getDiagnostics(document.uri).length, 1);

      await Code.commands.executeCommand('workbench.action.closeActiveEditor');
      await TestTools.sleep(1000);

      Assert.strictEqual(Code.languages.getDiagnostics(document.uri).length, 1);
    } finally {
      Code.workspace.getConfiguration('ltex').update(
          'clearDiagnosticsWhenClosingFile', undefined, Code.ConfigurationTarget.Global);
    }
  });
});
// #endif
