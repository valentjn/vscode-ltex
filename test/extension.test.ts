import * as Assert from 'assert';
import * as Code from 'vscode';
import * as Ltex from '../src/extension';

// Defines a Mocha test suite to group tests of similar kind together
suite('Extension Tests', () => {
  // Defines a Mocha unit test
  test('Something 1', () => {
    Assert.equal(-1, [1, 2, 3].indexOf(5));
    Assert.equal(-1, [1, 2, 3].indexOf(0));

    const ltex: Code.Extension<Ltex.Api> | undefined =
        Code.extensions.getExtension('valentjn.vscode-ltex');
    if (ltex == null) throw new Error('Could not find LTeX.');
    const api: Ltex.Api = ltex.exports;
    console.log(api);
  });
});
