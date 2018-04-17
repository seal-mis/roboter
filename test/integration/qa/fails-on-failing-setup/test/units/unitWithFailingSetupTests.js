'use strict';

const assert = require('assertthat');

suite('unitWithFailingSetup', () => {
  setup(() => {
    throw new Error();
  });

  test('does not fail.', done => {
    assert.that(true).is.true();
    done();
  });
});
