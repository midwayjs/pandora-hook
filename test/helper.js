'use strict';
const path = require('path');
const globby = require('globby');
const dir = path.join(__dirname, '../patch');

global.run = function(call) {

  globby.sync(['*.js', '*/**.js'], {
    cwd: dir
  }).forEach(file => {

    const PatcherCls = require(path.join(dir, file));
    let patcher = new PatcherCls();
    patcher.run();
  });

  call(function(err) {
    if (err) {
      console.error(err);
      process.send(err.toString());
    } else {
      process.send('done');
    }
  });
};
