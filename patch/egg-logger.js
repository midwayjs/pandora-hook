'use strict';
const MessageConstants = require('pandora-metrics').MessageConstants;

module.exports = ({hook, shimmer, sender}) => {
  hook('egg-logger', '^1.6.x', (loadModule, replaceSource) => {
    const logger = loadModule('lib/logger.js');
    ['info', 'error', 'warn'].forEach(method => {
      shimmer.wrap(logger.prototype, method, (log) => {
        return function () {
          process.nextTick(() => {
            sender.send(MessageConstants.LOGGER, {
              method,
              args: arguments
            });
          });
          return log.apply(this, arguments);
        }
      });
    });
  });
};
