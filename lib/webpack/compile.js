'use strict';

const webpack = require('webpack');

const compile = function ({ configuration }) {
  return new Promise((resolve, reject) => {
    if (!configuration) {
      return reject(new Error('Configuration is missing'));
    }

    const compiler = webpack(configuration);

    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        return reject(new Error(info.errors));
      }

      resolve(stats);
    });
  });
};

module.exports = compile;
