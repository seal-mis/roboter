'use strict';

const assert = require('assertthat');

suite('failingUnit', () => {
  test('fails.', done => {
    assert.that(true).is.false();
    done();
  });
});
