/* Copyright (C) 2020 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient';
import * as Path from 'path';

import {i18n} from './I18n';
import ProgressStack from './ProgressStack';

export default class CommandHandler {
  private _languageClient: CodeLanguageClient.LanguageClient;

  public constructor(languageClient: CodeLanguageClient.LanguageClient) {
    this._languageClient = languageClient;
  }

  public register(context: Code.ExtensionContext): void {
    context.subscriptions.push(Code.commands.registerCommand('ltex.checkCurrentDocument',
        this.checkCurrentDocument.bind(this)));
    context.subscriptions.push(Code.commands.registerCommand('ltex.checkAllDocumentsInWorkspace',
        this.checkAllDocumentsInWorkspace.bind(this)));
    context.subscriptions.push(Code.commands.registerCommand(
        'ltex.clearDiagnosticsInCurrentDocument',
        this.clearDiagnosticsInCurrentDocument.bind(this)));
    context.subscriptions.push(Code.commands.registerCommand('ltex.clearAllDiagnostics',
        this.clearAllDiagnostics.bind(this)));
  }

  public async checkDocument(uri: Code.Uri, codeLanguageId?: string,
        text?: string): Promise<boolean> {
    const args: any = {uri: uri.toString()};
    if (codeLanguageId != null) args.codeLanguageId = codeLanguageId;
    if (text != null) args.text = text;

    const result: any = await this._languageClient.sendRequest('workspace/executeCommand',
        {command: 'ltex.checkDocument', arguments: [args]});

    if (result.success) {
      return Promise.resolve(true);
    } else {
      Code.window.showErrorMessage(i18n('couldNotCheckDocument', uri.fsPath, result.errorMessage));
      return Promise.resolve(false);
    }
  }

  public async checkCurrentDocument(): Promise<boolean> {
    const textEditor: Code.TextEditor | undefined = Code.window.activeTextEditor;

    if (textEditor == null) {
      Code.window.showErrorMessage(i18n('noEditorOpenToCheckDocument'));
      return Promise.resolve(false);
    }

    return this.checkDocument(textEditor.document.uri, textEditor.document.languageId,
        textEditor.document.getText());
  }

  public async checkAllDocumentsInWorkspace(): Promise<boolean> {
    const progressOptions: Code.ProgressOptions = {
          title: 'LTeX',
          location: Code.ProgressLocation.Notification,
          cancellable: true,
        };

    return Code.window.withProgress(progressOptions,
          async (progress: Code.Progress<{increment?: number; message?: string}>,
            token: Code.CancellationToken): Promise<boolean> => {
      const codeProgress: ProgressStack = new ProgressStack(
          i18n('checkingAllDocumentsInWorkspace'), progress);

      codeProgress.startTask(0.1, i18n('findingAllDocumentsInWorkspace'));
      if (token.isCancellationRequested) return Promise.resolve(true);
      const uris: Code.Uri[] = await Code.workspace.findFiles(
          '**/*.{md,tex}', undefined, undefined, token);
      uris.sort((lhs: Code.Uri, rhs: Code.Uri) => lhs.fsPath.localeCompare(rhs.fsPath));
      codeProgress.finishTask();

      codeProgress.startTask(0.9, i18n('checkingAllDocumentsInWorkspace'));
      const n: number = uris.length;

      for (let i: number = 0; i < n; i++) {
        codeProgress.updateTask(i / n,
            i18n('checkingDocumentN', i + 1, n, Path.basename(uris[i].fsPath)));
        if (token.isCancellationRequested) return Promise.resolve(true);
        const success: boolean = await this.checkDocument(uris[i]);
        if (!success) return Promise.resolve(false);
      }

      codeProgress.finishTask();

      if (n > 0) {
        return Promise.resolve(true);
      } else {
        Code.window.showErrorMessage((Code.workspace.workspaceFolders == null) ?
            i18n('couldNotCheckDocumentsAsNoFoldersWereOpened') :
            i18n('couldNotCheckDocumentsAsNoDocumentsWereFound'));
        return Promise.resolve(false);
      }
    });
  }

  public clearDiagnosticsInCurrentDocument(): void {
    const diagnostics: Code.DiagnosticCollection | undefined = this._languageClient.diagnostics;
    if (diagnostics == null) return;
    const textEditor: Code.TextEditor | undefined = Code.window.activeTextEditor;
    if (textEditor == null) return;
    diagnostics.set(textEditor.document.uri, undefined);
  }

  public clearAllDiagnostics(): void {
    const diagnostics: Code.DiagnosticCollection | undefined = this._languageClient.diagnostics;
    if (diagnostics == null) return;
    diagnostics.clear();
  }
}
