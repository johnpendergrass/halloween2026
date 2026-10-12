(function (root) {
  'use strict';
  const baseline = typeof module !== 'undefined' && module.exports ? require('../computer-player') : root.WendyPlayer;
  // Preserve the original weighted-random policy exactly as a comparison baseline.
  function choose(view, random = Math.random, options, trace) {
    const memory = baseline.createMemory(), other = view.memory.role === 'human' ? 'wendy' : 'human';
    const mapped = view.memory.history.map(event => {
      const result = { ...event };
      for (const field of ['player', 'from', 'to']) if (result[field]) result[field] = result[field] === other ? 'human' : 'wendy';
      return result;
    });
    baseline.observe(memory, mapped);
    let roll;
    const selected = baseline.choose(view.myHand, memory, () => { roll = random(); return roll; }, view.copiesPerType);
    if (trace) {
      const counts = {}; for (const card of view.myHand) counts[card.type] = (counts[card.type] || 0) + 1;
      const candidates = Object.entries(counts).map(([type, held]) => {
        const clue = memory.known.has(type) ? 'remembered possession' : memory.absent.has(type) ? 'remembered absence' : 'unknown';
        const baseWeight = memory.known.has(type) ? 8 : memory.absent.has(type) ? .3 : 2;
        const completionMultiplier = held === view.copiesPerType - 1 ? 1.8 : 1;
        return { type, held, clue, baseWeight, completionMultiplier, weight: baseWeight * completionMultiplier };
      });
      const totalWeight = candidates.reduce((sum, candidate) => sum + candidate.weight, 0);
      trace({ method: 'weighted random', randomRoll: roll, totalWeight,
        candidates: candidates.map(candidate => ({ ...candidate, selectionChance: candidate.weight / totalWeight })) });
    }
    return selected;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { choose }; else root.BeginnerOpponent = { choose };
})(typeof globalThis !== 'undefined' ? globalThis : this);
