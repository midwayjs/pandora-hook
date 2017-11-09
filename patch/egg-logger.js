'use strict';
// const ErrorIndicator = require('pandora-metrics').ErrorIndicator;
// const indicator = new ErrorIndicator();

const isTest = process.env.NODE_ENV === 'test';
module.exports = (hook, shimmer) => {
  hook('egg-logger', '^1.6.0', (loadModule, replaceSource) => {
    const logger = loadModule('lib/logger.js');
    ['info', 'error', 'warn'].forEach(method => {
      shimmer.wrap(logger.prototype, method, (log) => {
        return function () {
          log.apply(this, arguments);
          process.emit('pandora-hook:egg-logger', {
            method,
            args: arguments
          });
        }
      });
    });
  });
};
