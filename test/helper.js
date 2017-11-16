'use strict';
const path = require('path');
const hook = require('module-hook');
const shimmer = require('shimmer');
const globby = require('globby');
const dir = path.join(__dirname, '../patch');

class Sender {
  send(key, data) {
    process.emit(key, data);
  }
}

global.run = function(call) {

  globby.sync(['*.js', '*/**.js'], {
    cwd: dir
  }).forEach(file => {
    const m = require(path.join(dir, file));
    m({hook, shimmer, sender: new Sender()});
  });

  call(function(err) {
    if (err) {
      process.send(err.toString());
    } else {
      process.send('done');
    }
  });
};
