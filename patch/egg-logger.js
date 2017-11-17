'use strict';
const { Patcher, MessageConstants } = require('pandora-metrics');

class EggLoggerPatcher extends Patcher {

  constructor() {
    super();

    const self = this;
    this.hook('^1.6.x', (loadModule, replaceSource) => {
      const logger = loadModule('lib/logger.js');
      ['info', 'error', 'warn'].forEach(method => {
        this.getShimmer().wrap(logger.prototype, method, (log) => {
          return function() {
            process.nextTick(() => {
              self.getSender().send(MessageConstants.LOGGER, {
                method,
                args: arguments
              });
            });
            return log.apply(this, arguments);
          };
        });
      });
    });
  }

  getModuleName() {
    return 'egg-logger';
  }
}

module.exports = EggLoggerPatcher;