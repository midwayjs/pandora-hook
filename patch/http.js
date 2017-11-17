'use strict';
const http = require('http');
const {Patcher, MessageConstants} = require('pandora-metrics');

class HttpPatcher extends Patcher {

  constructor() {
    super();

    let TraceManager = this.getTraceManager();
    this.getShimmer().wrap(http, 'createServer', function wrapCreateServer(createServer) {
      return function wrappedCreateServer(requestListener) {
        if (requestListener) {
          const listener = TraceManager.bind(function(req, res) {
            if (this.getTraceId) {
              TraceManager.bindEmitter(req);
              TraceManager.bindEmitter(res);
              const traceId = this.getTraceId(req);
              const tracer = TraceManager.create({
                traceId
              });
              const span = tracer.startSpan('http');
              span.setTag('method', req.method.toUpperCase());
              span.setTag('url', req.url);
              res.once('finish', () => {
                span.finish();
                tracer.finish();
                this.getSender().send(MessageConstants.TRACE, tracer);
              });
            }
            return requestListener(req, res);
          });
          return createServer.call(this, listener);
        }
        return createServer.call(this, requestListener);
      }
    });
  }
}
module.exports = HttpPatcher;
