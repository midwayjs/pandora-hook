'use strict';
const assert = require('assert');
const UrllibPatcher = require('../../../patch/urllib');
const urllibPatcher = new UrllibPatcher();

run(function(done) {
  urllibPatcher.run();

  const urllib = require('urllib');
  const url = 'https://www.taobao.com/';

  process.on('PANDORA_PROCESS_MESSAGE_TRACENODE', info => {
    const node = info.data;
    assert(node.url === url);
    assert(node.method === 'get');
    assert(node.endTime);
    assert(node.startTime);
    done();
  });

  urllib.request(url);
});