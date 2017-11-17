'use strict';
const path = require('path');
const hook = require('module-hook');
const shimmer = require('shimmer');
const globby = require('globby');
const dir = path.join(__dirname, '../patch');
const {TraceManager, MessengerSender} = require('pandora-metrics');

global.run = function(call) {

  let traceManager = new TraceManager();

  globby.sync(['*.js', '*/**.js'], {
    cwd: dir
  }).forEach(file => {
    const m = require(path.join(dir, file));
    m({hook, shimmer, sender: new MessengerSender(), tracer: traceManager});
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
