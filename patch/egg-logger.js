'use strict';
module.exports = (hook, shimmer) => {
  hook('egg-logger', '^1.6.x', (loadModule, replaceSource) => {
    const logger = loadModule('lib/logger.js');
    ['info', 'error', 'warn'].forEach(method => {
      shimmer.wrap(logger.prototype, method, (log) => {
        return function () {
          process.emit('pandora-hook:egg-logger', {
            method,
            args: arguments
          });
          return log.apply(this, arguments);s
        }
      });
    });
  });
};
