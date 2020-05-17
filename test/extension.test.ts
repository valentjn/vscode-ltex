import * as Assert from 'assert';
import * as Code from 'vscode';
import * as Ltex from '../src/extension';

describe('LTeX tests', () => {
  async function createNewFile(name: string, contents?: string): Promise<Code.TextDocument> {
    const uri: Code.Uri = Code.Uri.parse(`untitled:${name}`);
    const textDocument: Code.TextDocument = await Code.workspace.openTextDocument(uri);
    const workspaceEdit: Code.WorkspaceEdit = new Code.WorkspaceEdit();
    if (contents != null) workspaceEdit.insert(uri, new Code.Position(0, 0), contents);
    await Code.workspace.applyEdit(workspaceEdit);
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
    while (!ltex.isActive) await sleep(200);
    Assert.ok(ltex.isActive);
    const api: Ltex.Api = ltex.exports;
    if (api.languageClient == null) throw new Error('Language client not initialized.');
    await api.languageClient.onReady();
  });

  it('Test', async () => {
    const document: Code.TextDocument = await createNewFile('test.md', 'This is an test.\n');
    await sleep(20000);
    const diagnostics: Code.Diagnostic[] = Code.languages.getDiagnostics(document.uri);
    console.log(diagnostics);
    Assert.equal(diagnostics.length, 1);
    Assert.equal(diagnostics[0].source, 'LTeX - EN_A_VS_AN');
  });
});
