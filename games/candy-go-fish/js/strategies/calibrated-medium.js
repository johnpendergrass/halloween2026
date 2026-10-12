(function (root) {
  'use strict';
  const node = typeof module !== 'undefined' && module.exports;
  const medium = node ? require('./medium') : root.MediumOpponent;
  const defaults = { setByCopies: { 3: 1, 4: 4 } };
  function choose(view, random = Math.random, options = defaults, trace) {
    const settings = { ...defaults, ...options };
    return medium.choose(view, random, { set: settings.setByCopies[view.copiesPerType] }, trace);
  }
  const api = { choose, defaults }; if (node) module.exports = api; else root.CalibratedMediumOpponent = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
