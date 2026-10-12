(function (root) {
  'use strict';
  const node = typeof module !== 'undefined' && module.exports;
  const temporal = node ? require('./temporal') : root.TemporalOpponent;
  const defaults = { particles: 1024, style: 'tactical', completion: 12, pickup: 1, progress: 0, certain: 0, requestBias: 4 };
  function choose(view, random = Math.random, options = defaults, trace) {
    return temporal.choose(view, random, { ...defaults, ...options }, trace);
  }
  const api = { choose, defaults }; if (node) module.exports = api; else root.CalibratedExpertOpponent = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
