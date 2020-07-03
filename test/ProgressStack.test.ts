/* Copyright (C) 2020 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Assert from 'assert';

import ProgressStack from '../src/ProgressStack';

describe('Test ProgressStack', () => {
  it('Test finishTask()', () => {
    const progressStack: ProgressStack = new ProgressStack('Test', {report(): void {}});
    Assert.throws(progressStack.finishTask);
  });
});
