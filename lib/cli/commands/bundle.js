'use strict';

const path = require('path');

const buntstift = require('buntstift'),
      fileExists = require('file-exists'),
      getUsage = require('command-line-usage'),
      promisify = require('util.promisify');

const globalOptionDefinitions = require('../globalOptionDefinitions'),
      webpack = require('../../webpack');

const exists = promisify(fileExists);

const bundle = {
  description: 'Run code analysis.',

  async getOptionDefinitions () {
    return [
      {
        name: 'watch',
        alias: 'w',
        type: Boolean,
        defaultValue: false,
        description: 'Bundle app, start dev server and watch files'
      }
    ];
  },

  async run (options) {
    if (!options) {
      throw new Error('Options are missing.');
    }
    if (options.watch === undefined) {
      throw new Error('Watch is missing.');
    }

    const directory = process.cwd(),
          { help } = options;

    if (help) {
      return buntstift.info(getUsage([
        { header: 'roboter bundle', content: this.description },
        { header: 'Synopsis', content: 'roboter bundle' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]));
    }

    const doesEntryExist = await exists(path.join(directory, 'src', 'index.js'));

    if (!doesEntryExist) {
      buntstift.error('Entry file at src/index.js is missing.');
      throw new Error();
    }

    buntstift.line();
    buntstift.info('Bundling app...', { prefix: '▸' });

    const stopWaiting = buntstift.wait();

    try {
      const configuration = webpack.getDefaultConfiguration({ directory });

      const stats = await webpack.compile({ configuration });

      exists(path.join(directory, '.eslintrc.json'));

      /* eslint-disable no-console */
      console.log(stats.toString({
        chunks: false,
        colors: true
      }));
      /* eslint-enable no-console */

      stopWaiting();
      buntstift.success('Bundling successful.');
    } catch (ex) {
      stopWaiting();

      switch (ex.code) {
        default:
          buntstift.error('Failed to bundle app.');
      }

      throw ex;
    }
  }
};

module.exports = bundle;
