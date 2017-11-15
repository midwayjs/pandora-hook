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
      worker.kill();
      done();
    }
  });
};

describe('test/index.test.js', () => {
  it('should egg-logger work ok', done => {
    fork('egg-logger', done);
  });

  it('should urllib work ok', done => {
    fork('urllib', done);
  });

  it('should http and trace work ok', done => {
    fork('http', done);
  });
});
