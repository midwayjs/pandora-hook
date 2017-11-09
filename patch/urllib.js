'use strict';

module.exports = (hook, shimmer) => {
  hook('urllib', '^2.x', (loadModule, replaceSource) => {
    const urllib = loadModule('lib/urllib');
    shimmer.wrap(urllib, 'requestWithCallback', (request) => {
      return function wrapped(url, args, callback) {
        if (arguments.length === 2 && typeof args === 'function') {
          callback = args;
          args = null;
        }

        args = args || {};
        const startTime = Date.now();

        const node = {
          startTime,
          rt: 0,
          url,
          method: (args.method || 'GET').toLowerCase(),
          req: {
            data: args.data,
            content: args.content,
            contentType: args.contentType,
            dataType: args.dataType,
            headers: args.headers,
            timeout: args.timeout,
          }
        };
        return request.call(this, url, args, (err, data, res) => {
          node.error = err;
          if (res) {
            node.res = res;
            node.status = res.status;
          }
          node.rt = Date.now() - startTime;
          process.emit('pandora-hook:urllib', node);
          callback(err, data, res);
        });
      };
    });
  });
};
