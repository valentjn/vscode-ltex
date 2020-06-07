import * as Assert from 'assert';
import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient';

import * as Ltex from '../src/extension';

describe('Test extension (end-to-end)', () => {
  let api: Ltex.Api | null = null;
  let languageClient: CodeLanguageClient.LanguageClient | null = null;

  async function createNewFile(name: string, contents?: string): Promise<Code.TextDocument> {
    console.log(`Creating new file '${name}'...`);
    const uri: Code.Uri = Code.Uri.parse(`untitled:${name}`);
    const textDocument: Code.TextDocument = await Code.workspace.openTextDocument(uri);

    if (contents != null) {
      console.log(`Inserting text '${contents}'...`);
      const workspaceEdit: Code.WorkspaceEdit = new Code.WorkspaceEdit();
      workspaceEdit.insert(uri, new Code.Position(0, 0), contents);
      await Code.workspace.applyEdit(workspaceEdit);
    }

    return textDocument;
  }

  async function sleep(ms: number): Promise<void> {
    return new Promise((resolve: () => void) => setTimeout(resolve, ms));
  }

  before(async () => {
    const ltex: Code.Extension<Ltex.Api> | undefined =
        Code.extensions.getExtension('valentjn.vscode-ltex');
    if (ltex == null) throw new Error('Could not find LTeX.');
    await createNewFile('activate.md');
    console.log('Waiting for activation of LTeX...');
    while (!ltex.isActive) await sleep(200);

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
  });

  it('test1.md - Test checking of Markdown files', async () => {
    const document: Code.TextDocument = await createNewFile('test1.md',
        'This is *an test*.');

    return new Promise((resolve: () => void) => {
      if (languageClient == null) throw new Error('Language client not initialized.');
      languageClient.onNotification('textDocument/publishDiagnostics',
            (params: CodeLanguageClient.PublishDiagnosticsParams) => {
        if (params.uri == document.uri.toString()) {
          Assert.equal(params.diagnostics.length, 1);
          Assert.equal(params.diagnostics[0].source, 'LTeX - EN_A_VS_AN');
          resolve();
        }
      });
    });
  });

  it('test1.tex - Test checking of LaTeX files', async () => {
    const document: Code.TextDocument = await createNewFile('test1.tex',
        'This is \\textbf{an test}.');

    return new Promise((resolve: () => void) => {
      if (languageClient == null) throw new Error('Language client not initialized.');
      languageClient.onNotification('textDocument/publishDiagnostics',
            (params: CodeLanguageClient.PublishDiagnosticsParams) => {
        if (params.uri == document.uri.toString()) {
          Assert.equal(params.diagnostics.length, 1);
          Assert.equal(params.diagnostics[0].source, 'LTeX - EN_A_VS_AN');
          resolve();
        }
      });
    });
  });
});
