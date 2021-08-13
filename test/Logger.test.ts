/* Copyright (C) 2019-2021 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Assert from 'assert';

import Logger from '../src/Logger';
import LoggingOutputChannel from '../src/LoggingOutputChannel';

describe('Test Logger', () => {
  before(() => {
    const clientOutputChannel: LoggingOutputChannel =
        new LoggingOutputChannel('LTeX Language Client');
    const serverOutputChannel: LoggingOutputChannel =
        new LoggingOutputChannel('LTeX Language Server');
    Logger.clientOutputChannel = clientOutputChannel;
    Logger.serverOutputChannel = serverOutputChannel;
    Assert.strictEqual(Logger.clientOutputChannel, clientOutputChannel);
    Assert.strictEqual(Logger.serverOutputChannel, serverOutputChannel);
  });

  it('Test log()', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Logger.log(null);
  });

  it('Test warn()', () => {
    Logger.clientOutputChannel.clear();
    Logger.warn('Test1');
    Logger.warn('Test2', new Error('Error1'));
    const log: string = Logger.clientOutputChannel.getContents();
    Assert.ok(log.includes('Warning'));
    Assert.ok(log.includes('Test1'));
    Assert.ok(log.includes('Test2'));
    Assert.ok(log.includes('Error1'));
  });

  it('Test error()', () => {
    Logger.clientOutputChannel.clear();
    Logger.error('Test1');
    Logger.error('Test2', new Error('Error1'));
    const log: string = Logger.clientOutputChannel.getContents();
    Assert.ok(log.includes('Error'));
    Assert.ok(log.includes('Test1'));
    Assert.ok(log.includes('Test2'));
    Assert.ok(log.includes('Error1'));
  });

  it('Test showClientOutputChannel()', () => {
    Logger.showClientOutputChannel();
  });
});
