'use strict';

const gulp = require('gulp'),
    runSequence = require('run-sequence');

const buildClient = function () {
  gulp.task('_build-client', function (done) {
    runSequence(
      'analyze',
      'test-units',
      [ 'bundle-scripts', 'themes' ],
      done);
  });
};

module.exports = buildClient;