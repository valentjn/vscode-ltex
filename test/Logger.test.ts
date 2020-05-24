import * as Assert from 'assert';
import * as Code from 'vscode';

import Logger from '../src/Logger';

describe('Test Logger', () => {
  before(() => {
    const clientOutputChannel: Code.OutputChannel =
        Code.window.createOutputChannel('LTeX Language Client');
    const serverOutputChannel: Code.OutputChannel =
        Code.window.createOutputChannel('LTeX Language Server');
    Logger.clientOutputChannel = clientOutputChannel;
    Logger.serverOutputChannel = serverOutputChannel;
    Assert.equal(Logger.clientOutputChannel, clientOutputChannel);
    Assert.equal(Logger.serverOutputChannel, serverOutputChannel);
  });

  it('Test log()', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    Logger.log(null);
  });

  it('Test warn()', () => {
    Logger.warn('Test');
    Logger.warn('Test', new Error('Error message'));
    Logger.error('Test');
    Logger.error('Test', new Error('Error message'));
  });

  it('Test showClientOutputChannel()', () => {
    Logger.showClientOutputChannel();
  });
});
