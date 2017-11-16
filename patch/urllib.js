'use strict';
const MessageConstants = require('pandora-metrics').MessageConstants;

module.exports = ({hook, shimmer, Tracer, sender}) => {
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
        const tags = {
          method: (args.method || 'GET').toLowerCase(),
          url,
          data: args.data,
          content: args.content,
          contentType: args.contentType,
          dataType: args.dataType,
          headers: args.headers,
          timeout: args.timeout,
        };
        const tracer = Tracer.getCurrentTracer();
        let span = tracer && tracer.startSpan('urllib');
        if (span) {
          span.addTags(tags);
        }

        return request.call(this, url, args, (err, data, res) => {
          if (span) {
            span.setTag('error', err);
            span.setTag('response', res);
            span.finish();
          }

          process.nextTick(() => {
            sender.send(MessageConstants.TRACE, {
              name: 'urllib',
              data: Object.assign({
                startTime,
                endTime: Date.now(),
                error: err,
                res: res
              }, tags),
            });
          });

          callback(err, data, res);
        });
      };
    });
  });
};
