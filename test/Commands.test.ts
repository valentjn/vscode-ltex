/* Copyright (C) 2020 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Assert from 'assert';
import * as Code from 'vscode';
import * as Path from 'path';
import * as Util from 'util';

import ExtensionInitializer from './ExtensionInitializer';
import TestTools from './TestTools';

describe('Test commands', () => {
  before(async () => {
    await ExtensionInitializer.initialize();
  });

  beforeEach(async () => {
    await ExtensionInitializer.resetState();
  });

  it('Test ltex.clearDiagnosticsInCurrentDocument and ltex.checkCurrentDocument', async () => {
    const document: Code.TextDocument = await TestTools.createNewFile('latex',
        'This is an \\textbf{test}.');
    await TestTools.sleep(10000);
    Assert.strictEqual(Code.languages.getDiagnostics(document.uri).length, 1);
    await Code.commands.executeCommand('ltex.clearDiagnosticsInCurrentDocument');
    await TestTools.sleep(1000);
    Assert.strictEqual(Code.languages.getDiagnostics(document.uri).length, 0);
    await Code.commands.executeCommand('ltex.checkCurrentDocument');
    await TestTools.sleep(10000);
    Assert.strictEqual(Code.languages.getDiagnostics(document.uri).length, 1);
  });

  it('Test ltex.clearAllDiagnostics and ltex.checkCurrentDocument', async () => {
    const document1: Code.TextDocument = await TestTools.createNewFile('latex',
        'This is an \\textbf{test}.');
    const document2: Code.TextDocument = await TestTools.createNewFile('latex',
        'This is an \\textbf{test}.');
    await TestTools.sleep(10000);

    Assert.strictEqual(Code.languages.getDiagnostics(document1.uri).length, 1);
    Assert.strictEqual(Code.languages.getDiagnostics(document2.uri).length, 1);

    await Code.commands.executeCommand('ltex.clearDiagnosticsInCurrentDocument');
    await TestTools.sleep(1000);

    Assert.strictEqual(Code.languages.getDiagnostics(document1.uri).length, 0);
    Assert.strictEqual(Code.languages.getDiagnostics(document2.uri).length, 1);

    await Code.commands.executeCommand('ltex.checkCurrentDocument');
    await TestTools.sleep(10000);

    Assert.strictEqual(Code.languages.getDiagnostics(document1.uri).length, 1);
    Assert.strictEqual(Code.languages.getDiagnostics(document2.uri).length, 1);
  });

  it('Test ltex.checkAllDocumentsInWorkspace', async () => {
    if (Code.workspace.workspaceFolders == null) throw new Error('No workspace folder open.');
    const workspaceFolderPath: string = Code.workspace.workspaceFolders[0].uri.fsPath;
    const fileUri1: Code.Uri = Code.Uri.file(Path.join(workspaceFolderPath, 'test1.tex'));
    const fileUri2: Code.Uri = Code.Uri.file(Path.join(workspaceFolderPath, 'test2.md'));
    const fileUri3: Code.Uri = Code.Uri.file(Path.join(workspaceFolderPath, 'test3.txt'));

    const textEncoder: Util.TextEncoder = new Util.TextEncoder();
    await Code.workspace.fs.writeFile(fileUri1, textEncoder.encode('This is an test.\n'));
    await Code.workspace.fs.writeFile(fileUri2, textEncoder.encode('This is an test.\n'));
    await Code.workspace.fs.writeFile(fileUri3, textEncoder.encode('This is an test.\n'));
    await TestTools.sleep(1000);

    Assert.strictEqual(Code.languages.getDiagnostics(fileUri1).length, 0);
    Assert.strictEqual(Code.languages.getDiagnostics(fileUri2).length, 0);
    Assert.strictEqual(Code.languages.getDiagnostics(fileUri3).length, 0);

    await Code.commands.executeCommand('ltex.checkAllDocumentsInWorkspace');
    await TestTools.sleep(10000);

    Assert.strictEqual(Code.languages.getDiagnostics(fileUri1).length, 1);
    Assert.strictEqual(Code.languages.getDiagnostics(fileUri2).length, 1);
    Assert.strictEqual(Code.languages.getDiagnostics(fileUri3).length, 0);
  });
});
