'use strict';
const http = require('http');
module.exports = ({hook, shimmer, tracer, send}) => {
  shimmer.wrap(http, 'createServer', function wrapCreateServer(createServer) {
    return function wrappedCreateServer(requestListener) {
      if (requestListener) {
        const listener = tracer.bind(function(req, res) {
          if (this.getTraceId) {
            const traceId = this.getTraceId(req);
            const trace = tracer.addTrace(traceId);
            res.once('finish', () => {
              tracer.removeTrace(traceId);
              send('trace', trace);
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
