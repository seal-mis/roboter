'use strict';

const assert = require('assertthat');

const exitCode = 1;

const stdout = [];

const stderr = '✗ Tests failed.';

const validate = async function (result) {
  assert.that(result.stdout).is.not.containing('Running integration tests');
};

module.exports = { exitCode, stdout, stderr, validate };
