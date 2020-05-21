import * as Assert from 'assert';

import ProgressStack from '../src/ProgressStack';

describe('Test ProgressStack', () => {
  it('Test finishTask()', () => {
    const progressStack: ProgressStack = new ProgressStack('Test', {report(): void {}});
    Assert.throws(progressStack.finishTask);
  });
});
