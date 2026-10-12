(function (root) {
  'use strict';
  const node = typeof module !== 'undefined' && module.exports;
  const knowledge = node ? require('./shared/knowledge') : root.OpponentKnowledge;
  const temporalMemory = node ? require('./shared/temporal-memory') : root.TemporalMemory;
  const policies = node ? { beginner: require('./strategies/beginner'), medium: require('./strategies/calibrated-medium'), expert: require('./strategies/calibrated-expert') }
    : { beginner: root.BeginnerOpponent, medium: root.CalibratedMediumOpponent, expert: root.CalibratedExpertOpponent };
  const decisions = [];
  function publish() {
    if (node) return;
    let output = document.getElementById('opponentDecisionTrace');
    if (!output) { output = document.createElement('script'); output.type = 'application/json'; output.id = 'opponentDecisionTrace'; document.body.append(output); }
    output.textContent = JSON.stringify({ version: 1, decisions });
  }
  const api = { createMemory: temporalMemory.createMemory, initializeMemory: temporalMemory.initialize, observe: temporalMemory.observe, publicView: knowledge.publicView,
    clearTrace() { decisions.length = 0; publish(); },
    getTrace() { return JSON.parse(JSON.stringify(decisions)); },
    choose(strategy, view, random = Math.random) {
      if (!policies[strategy]) throw new Error('Unknown opponent strategy: ' + strategy);
      let details;
      const started = performance.now();
      const selected = policies[strategy].choose(view, random, undefined, trace => { details = trace; });
      decisions.push({ number: (decisions.at(-1)?.number || 0) + 1, actorName: view.actorName || view.memory.role,
        strategy, selected, durationMs: performance.now() - started, copiesPerType: view.copiesPerType,
        myHandCounts: knowledge.counts(view.myHand), mySets: [...view.mySets], opponentSets: [...view.opponentSets],
        opponentHandCount: view.opponentHandCount, dishCount: view.dishCount,
        clues: { lower: { ...view.memory.lower }, upper: { ...view.memory.upper } },
        recentPublicEvents: view.memory.history.slice(-12).map(event => ({ ...event })), ...details });
      if (decisions.length > 100) decisions.shift();
      publish();
      return selected;
    } };
  if (node) module.exports = api; else root.OpponentStrategies = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
