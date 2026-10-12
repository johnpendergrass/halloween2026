(function (root) {
  'use strict';
  const knowledge = typeof module !== 'undefined' && module.exports ? require('../shared/knowledge') : root.OpponentKnowledge;
  const defaults = { success: 3, set: 4, progress: 1, losingFinish: 100, winningFinish: 100 };
  function rank(view, weights = defaults) {
    weights = { ...defaults, ...weights };
    const own = knowledge.counts(view.myHand), belief = knowledge.beliefs(view);
    return Object.keys(own).map(type => {
      const probability = belief.probability(type), completes = own[type] === view.copiesPerType - 1;
      const components = { success: probability * weights.success,
        completion: completes ? probability * weights.set : 0,
        progress: completes ? 0 : probability * weights.progress * own[type] / view.copiesPerType, ending: 0 };
      let endMargin = null;
      if (completes && view.myHand.length + 1 === view.copiesPerType) {
        const margin = view.mySets.length + 1 - view.opponentSets.length;
        endMargin = margin;
        components.ending = probability * (margin > 0 ? weights.winningFinish : margin < 0 ? -weights.losingFinish : 0);
      }
      // Taking the opponent's last candy also immediately ends the round.
      else if (view.opponentHandCount === 1) {
        const margin = view.mySets.length + Number(completes) - view.opponentSets.length;
        endMargin = margin;
        components.ending = probability * (margin > 0 ? weights.winningFinish : margin < 0 ? -weights.losingFinish : 0);
      }
      const value = Object.values(components).reduce((sum, component) => sum + component, 0);
      return { type, held: own[type], probability, completes, endMargin, components, value };
    });
  }
  function choose(view, random = Math.random, weights = defaults, trace) {
    const choices = rank(view, weights), best = Math.max(...choices.map(choice => choice.value));
    const ties = choices.filter(choice => Math.abs(choice.value - best) < 1e-9);
    const roll = random();
    if (trace) trace({ method: 'probability and weighted score', weights: { ...defaults, ...weights }, candidates: choices,
      tiedBest: ties.map(choice => choice.type), randomRoll: roll });
    return ties[Math.floor(roll * ties.length)]?.type;
  }
  const api = { choose, rank, defaults };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.MediumOpponent = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
