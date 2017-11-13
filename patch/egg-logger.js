'use strict';
module.exports = ({hook, shimmer, send}) => {
  hook('egg-logger', '^1.6.x', (loadModule, replaceSource) => {
    const logger = loadModule('lib/logger.js');
    ['info', 'error', 'warn'].forEach(method => {
      shimmer.wrap(logger.prototype, method, (log) => {
        return function () {
          process.nextTick(() => {
            send('logger', {
              method,
              args: arguments
            });
          });
          return log.apply(this, arguments);s
        }
      });
    });
  });
};
