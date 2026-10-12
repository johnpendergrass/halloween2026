(function (root) {
'use strict';
const node = typeof module !== 'undefined' && module.exports;
const knowledge = node ? require('../shared/knowledge') : root.OpponentKnowledge;
const temporal = node ? require('../shared/temporal-beliefs') : root.TemporalBeliefs;
const defaults = { particles: 1024, certain: 0, success: 3, completion: 4, pickup: 0, progress: 1, end: 100, style: 'medium' };
function choose(view, random = Math.random, options = defaults, trace) {
  const weights = { ...defaults, ...options }, own = knowledge.counts(view.myHand), belief = temporal.beliefs(view, random, weights);
  const candidates = Object.keys(own).map(type => {
    const distribution = belief.distribution(type), need = view.copiesPerType - own[type];
    const probability = 1 - distribution[0], completionChance = distribution.slice(need).reduce((a, b) => a + b, 0);
    const expectedPickup = distribution.reduce((a, p, i) => a + p * Math.min(i, need), 0);
    const completes = need === 1;
    const components = { certain: probability > 1 - 1e-9 ? weights.certain : 0,
      success: probability * weights.success,
      completion: weights.completion * (weights.style === 'medium' ? Number(completes) * probability : completionChance),
      pickup: weights.pickup * expectedPickup,
      progress: weights.progress * own[type] / view.copiesPerType * probability, ending: 0 };
    if ((completes && view.myHand.length + 1 === view.copiesPerType) || view.opponentHandCount === 1) {
      const margin = view.mySets.length + Number(completes) - view.opponentSets.length;
      components.ending = probability * weights.end * Math.sign(margin);
      if (margin < 0) components.certain = 0;
    }
    return { type, held: own[type], probability, completionChance, expectedPickup, components, value: Object.values(components).reduce((a, b) => a + b, 0) };
  });
  const best = Math.max(...candidates.map(candidate => candidate.value)), ties = candidates.filter(candidate => Math.abs(candidate.value - best) < 1e-9), roll = random();
  if (trace) trace({ method: 'temporal public-evidence probabilities', particles: belief.particles, resets: belief.resets, candidates, tiedBest: ties.map(candidate => candidate.type), randomRoll: roll });
  return ties[Math.floor(roll * ties.length)].type;
}
const api = { choose, defaults }; if (node) module.exports = api; else root.TemporalOpponent = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
