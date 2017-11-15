'use strict';
const tracer = require('./lib/trace_manager');
const hook = require('module-hook');
const shimmer = require('shimmer');
const globby = require('globby');
const path = require('path');
const dir = path.join(__dirname, 'patch');

function send(type, payload) {
  process.emit(`pandora:hook:${type}`, payload);
}

globby.sync(['*.js', '*/**.js'], {
  cwd: dir
}).forEach(file => {
  const m = require(path.join(dir, file));
  m({
    hook,
    shimmer,
    Tracer: tracer,
    send
  });
});
