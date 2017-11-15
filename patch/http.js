'use strict';
const http = require('http');
module.exports = ({hook, shimmer, Tracer, send}) => {
  shimmer.wrap(http, 'createServer', function wrapCreateServer(createServer) {
    return function wrappedCreateServer(requestListener) {
      if (requestListener) {
        const listener = Tracer.bind(function(req, res) {
          if (this.getTraceId) {
            Tracer.bindEmitter(req);
            Tracer.bindEmitter(res);
            const traceId = this.getTraceId(req);
            const tracer = Tracer.create({
              traceId
            });
            const span = tracer.startSpan('http');
            span.setTag('method', req.method.toUpperCase());
            span.setTag('url', req.url);
            res.once('finish', () => {
              span.finish();
              tracer.finish();
              send('trace', tracer);
            });
          }
          return requestListener(req, res);
        });
        return createServer.call(this, listener);
      }
      return createServer.call(this, requestListener);
    }
  });
};
