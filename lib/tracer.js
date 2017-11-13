'use strict';
const createNamespace = require('./cls').createNamespace;
const TRACEID = 'traceId';

class Tracer {
  constructor() {
    this.traceContainer = {};
    this.ns = createNamespace('pandora_tracer');
    this.finished = {};
    const contexts = this.ns._contexts;
    // 半分钟清除一次已经完成的trace, 避免内存泄漏
    if (contexts) {
      setInterval(() => {
        const finished = this.finished;
        this.finished = {};

        // 超过 30s 未完成，放弃
        for (let id in this.traceContainer) {
          const trace = this.traceContainer[id];
          const isTimeout = Date.now() - trace.date > 30 * 1000;
          if (isTimeout) {
            this.traceContainer[id] = null;
            delete this.traceContainer[id];
          }
        }

        for (let key of contexts.keys()) {
          const item = contexts.get(key);
          if (!item || finished[item.traceId]) {
            contexts.delete(key);
          }
        }
      }, 30 * 1000);
    }
  }

  getCurrentTrace() {
    const traceId = this.ns.get(TRACEID);
    if (traceId) {
      return this.traceContainer[traceId];
    }
  }

  getTrace(traceId) {
    return this.traceContainer[traceId];
  }

  addTrace(traceId) {
    this.ns.set(TRACEID, traceId);
    const trace = {
      traceId,
      date: Date.now(),
      error: false,
      chain: [],
    };
    this.traceContainer[traceId] = trace;
    return trace;
  }

  removeTrace(traceId) {
    if (this.traceContainer[traceId]) {
      this.finished[traceId] = 1;
      this.traceContainer[traceId] = null;
      delete this.traceContainer[traceId];
    }
  }

  bind(fn, context) {
    return this.ns.bind(fn, context);
  }

  run(fn, context) {
    return this.ns.run(fn, context);
  }

}

module.exports = new Tracer();
