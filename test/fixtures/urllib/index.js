'use strict';
const assert = require('assert');
run(function(done) {
  const urllib = require('urllib');
  const url = 'https://www.taobao.com/';
  process.on('pandora:hook:module', info => {
    const node = info.data;
    assert(node.url === url);
    assert(node.method === 'get');
    assert(node.rt > 0);
    assert(node.startTime);
    done();
  });
  urllib.request(url)
  .then(res => {
    // todo
  })
  .catch(err => {
    console.error(err);
  })
});
