(function (root) {
  'use strict';
  function createMemory(role = 'wendy') { return { role, lower: {}, upper: {}, history: [] }; }
  function observe(memory, events, copies = 3) {
    const other = memory.role === 'human' ? 'wendy' : 'human';
    for (const raw of events) {
      // A draw identity is private even when the engine supplies it to presentation.
      const event = raw.kind === 'draw' ? { kind: 'draw', player: raw.player } : { ...raw };
      memory.history.push(event);
      const type = event.type;
      if (event.kind === 'request' && event.player === other) memory.lower[type] = Math.max(1, memory.lower[type] || 0);
      if (event.kind === 'miss' && event.player === memory.role) { memory.lower[type] = 0; memory.upper[type] = 0; }
      if (event.kind === 'transfer' && event.from === other) {
        memory.lower[type] = Math.max(0, (memory.lower[type] || 0) - 1);
        memory.upper[type] = Math.max(0, (memory.upper[type] ?? copies) - 1);
      }
      if (event.kind === 'transfer' && event.to === other) {
        memory.lower[type] = (memory.lower[type] || 0) + 1;
        memory.upper[type] = Math.min(copies, (memory.upper[type] ?? copies) + 1);
      }
      if (event.kind === 'draw' && event.player === other) {
        for (const key of Object.keys(memory.upper)) memory.upper[key] = Math.min(copies, memory.upper[key] + 1);
      }
      if (event.kind === 'set') { memory.lower[type] = 0; memory.upper[type] = 0; }
    }
  }
  function counts(hand) { const result = {}; for (const card of hand) result[card.type] = (result[card.type] || 0) + 1; return result; }
  function publicView(state, role, memory, candyTypes) {
    const other = role === 'human' ? 'wendy' : 'human';
    return {
      myHand: state.hands[role].map(card => ({ type: card.type })),
      mySets: state.sets[role].map(set => set.type), opponentSets: state.sets[other].map(set => set.type),
      opponentHandCount: state.hands[other].length, dishCount: state.pile.length,
      copiesPerType: state.copies, candyTypes: [...candyTypes], memory
    };
  }
  function combination(n, k) { let value = 1; for (let i = 1; i <= k; i++) value = value * (n - i + 1) / i; return value; }
  function beliefs(view) {
    const own = counts(view.myHand), completed = new Set([...view.mySets, ...view.opponentSets]);
    const types = view.candyTypes;
    const remaining = types.map(type => completed.has(type) ? 0 : view.copiesPerType - (own[type] || 0));
    const low = types.map((type, i) => Math.min(remaining[i], view.memory.lower[type] || 0));
    const high = types.map((type, i) => Math.min(remaining[i], view.copiesPerType - 1, view.memory.upper[type] ?? view.copiesPerType));
    const slots = view.opponentHandCount;
    const suffix = Array.from({ length: types.length + 1 }, () => new Float64Array(slots + 1));
    suffix[types.length][0] = 1;
    const factors = remaining.map((n, i) => Array.from({ length: high[i] + 1 }, (_, k) => k < low[i] ? 0 : combination(n, k)));
    for (let i = types.length - 1; i >= 0; i--) for (let s = 0; s <= slots; s++) {
      for (let k = low[i]; k <= Math.min(high[i], s); k++) suffix[i][s] += factors[i][k] * suffix[i + 1][s - k];
    }
    const mass = (index, count) => count < 0 || count > slots ? 0 : suffix[index][count];
    if (!mass(0, view.opponentHandCount)) throw new Error('Public clues have no consistent hidden allocation');
    function sample(random) {
      let slots = view.opponentHandCount; const opponent = {}, dish = {};
      for (let i = 0; i < types.length; i++) {
        let pick = random() * mass(i, slots), chosen = low[i];
        for (let k = low[i]; k <= Math.min(high[i], slots); k++) {
          const weight = combination(remaining[i], k) * mass(i + 1, slots - k);
          if (weight && (pick -= weight) <= 0) { chosen = k; break; }
        }
        opponent[types[i]] = chosen; dish[types[i]] = remaining[i] - chosen; slots -= chosen;
      }
      return { opponent, dish };
    }
    const prefix = Array.from({ length: types.length + 1 }, () => new Float64Array(slots + 1));
    prefix[0][0] = 1;
    for (let i = 0; i < types.length; i++) for (let s = 0; s <= slots; s++) {
      for (let k = low[i]; k <= Math.min(high[i], slots - s); k++) prefix[i + 1][s + k] += prefix[i][s] * factors[i][k];
    }
    const distributions = new Map();
    function distribution(type) {
      if (distributions.has(type)) return distributions.get(type);
      const index = types.indexOf(type), probabilities = Array(remaining[index] + 1).fill(0);
      for (let k = low[index]; k <= high[index]; k++) {
        for (let s = 0; s <= slots - k; s++) probabilities[k] += prefix[index][s] * factors[index][k] * mass(index + 1, slots - s - k);
        probabilities[k] /= mass(0, slots);
      }
      distributions.set(type, probabilities); return probabilities;
    }
    const probability = type => 1 - distribution(type)[0];
    return { sample, probability, distribution };
  }
  const api = { createMemory, observe, counts, publicView, beliefs };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.OpponentKnowledge = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
