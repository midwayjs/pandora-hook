'use strict';
const opentracing = require('opentracing');
const PandoraSpan = require('./span');
const EventEmitter = require('super-event-emitter');

class PandoraTracer extends opentracing.Tracer {
  constructor(options) {
    super();
    EventEmitter.mixin(this);
    this.options = options;
    this._spans = [];
  }

  _startSpan(name, fields) {
    // _allocSpan is given it's own method so that derived classes can
    // allocate any type of object they want, but not have to duplicate
    // the other common logic in startSpan().
    const span = this._allocSpan();
    span.setOperationName(name);
    this._spans.push(span);

    if (fields.references) {
      for (let i = 0; i < fields.references; i++) {
        span.addReference(fields.references[i]);
      }
    }

    // Capture the stack at the time the span started
    span._startStack = new Error().stack;
    return span;
  }

  _allocSpan() {
    return new PandoraSpan(this);
  }

  finish() {
    this.emit('finish', this);
  }

  report() {
    return this;
  }

};

module.exports = PandoraTracer;
