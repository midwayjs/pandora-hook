'use strict';
const path = require('path');
const childProcess = require('child_process');
const fork = function(name, done) {
  const filePath = require.resolve(path.join(__dirname, `fixtures/${name}`));
  const worker = childProcess.fork(filePath, {
    env: {
      NODE_ENV: 'test',
    },
    execArgv: ['-r', path.join(__dirname, 'helper.js')]
  });
  worker.on('message', (data) => {
    if (data === 'done') {
      done();
    }
  });
}

describe('test/index.test.js', () => {
  it('should egg-logger work ok', done => {
    fork('egg-logger', done);
  });
});
