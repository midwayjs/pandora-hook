'use strict';
const opentracing = require('opentracing');
const uuid = require('uuid');

class PandoraSpan extends opentracing.Span {
  constructor(tracer) {
    super();
    this._tracer = tracer;
    this._uuid = this._generateUUID();
    this._startMs = Date.now();
    this._finishMs = 0;
    this._operationName = '';
    this._tags = {};
    this._logs = [];
  }

  _setOperationName(name) {
    this._operationName = name;
  }

  _generateUUID() {
    return uuid();
  }

  _addTags(set) {
    const keys = Object.keys(set);
    for (const key of keys) {
      this._tags[key] = set[key];
    }
  }

  _log(fields, timestamp) {
    this._logs.push({
      fields,
      timestamp
    });
  }

  _finish(finishTime) {
    finishTime = finishTime || Date.now();
    this._finishMs = finishTime;
  }

  addReference(ref) {
  }

  /**
   * Returns a simplified object better for console.log()'ing.
   */
  debug() {
    return {
      uuid      : this._uuid,
      operation : this._operationName,
      millis    : [this._finishMs - this._startMs, this._startMs, this._finishMs],
      tags: this._tags,
      logs: this._logs,
    };
  }
};

module.exports = PandoraSpan;
