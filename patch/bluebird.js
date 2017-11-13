'use strict';
const clsBluebird = require('cls-bluebird');
module.exports = ({hook}) => {
  hook('bluebird', '3.x', (loadModule, replaceSource) => {
    const pkg = loadModule('package.json');
    const Promise = loadModule(pkg.main);
    clsBluebird(tracer.ns, Promise);
  });
};
