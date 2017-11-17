'use strict';
const clsBluebird = require('cls-bluebird');
const {Patcher} = require('pandora-metrics');

class BluebirdPatcher extends Patcher {

  constructor() {
    super();

    let traceManager = this.getTraceManager();

    this.hook('3.x', (loadModule) => {
      const pkg = loadModule('package.json');
      const Promise = loadModule(pkg.main);
      clsBluebird(traceManager.ns, Promise);
    });
  }

  getModuleName() {
    return 'bluebird';
  }
}

module.exports = BluebirdPatcher;
