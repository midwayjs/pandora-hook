'use strict';
const assert = require('assert');

run(function(done) {
  const http = require('http');
  const urllib = require('urllib');
  const url = 'https://www.taobao.com/';

  process.on('pandora:hook:trace', node => {
    assert(node.chain.length > 0);
    done();
  });

  const server = http.createServer((req, res) => {
    urllib.request(url)
    .catch(err => {

    })
    .then(() => {
      res.end('hello');
    });
  });

  server.getTraceId = function(req) {
    return Math.random();
  }

  server.listen(0, () => {
    const port = server.address().port;
    urllib.request(`http://localhost:${port}`)
    .then( res => {
      console.log(res.data.toString());
    }).catch(err => {

    });
  });
});
