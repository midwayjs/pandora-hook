'use strict';
const hook = require('module-hook');
const shimmer = require('shimmer');
const globby = require('globby');
const path = require('path');
const dir = path.join(__dirname, 'patch');

globby.sync(['*.js', '*/**.js'], {
  cwd: dir
}).forEach(file => {
  const m = require(path.join(dir, file));
  m(hook, shimmer);
});