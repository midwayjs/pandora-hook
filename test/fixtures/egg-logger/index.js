'use strict';
run(function(done) {
  const Logger = require('egg-logger').Logger;
  const logger = new Logger();
  const assert = require('assert');
  process.on('PANDORA_PROCESS_MESSAGE_LOGGER', info => {
    const args = info.args;
    const err = args[0];
    assert(info.method === 'error');
    assert(err.message === 'test');
    done();
  });
  logger.error(new Error('test'));
});
