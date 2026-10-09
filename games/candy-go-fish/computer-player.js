/* Wendy receives only her own hand and public events, never the human hand. */
(function (root) {
  'use strict';
  function createMemory() { return { known: new Set(), absent: new Set() }; }
  function observe(memory, events) {
    for (const event of events) {
      if (event.kind === 'request' && event.player === 'human') {
        memory.known.add(event.type); memory.absent.delete(event.type);
      }
      if (event.kind === 'miss' && event.player === 'wendy') {
        memory.known.delete(event.type); memory.absent.add(event.type);
      }
      if (event.kind === 'transfer' && event.to === 'human') {
        memory.known.add(event.type); memory.absent.delete(event.type);
      }
      if (event.kind === 'transfer' && event.from === 'human') {
        // A one-copy transfer cannot establish whether another copy remains.
        memory.known.delete(event.type);
      }
      if (event.kind === 'draw' && event.player === 'human') memory.absent.clear();
      if (event.kind === 'set') { memory.known.delete(event.type); memory.absent.delete(event.type); }
    }
  }
  function choose(hand, memory, random = Math.random) {
    const quantities = new Map();
    for (const card of hand) quantities.set(card.type, (quantities.get(card.type) || 0) + 1);
    const choices = [...quantities].map(([type, quantity]) => ({ type,
      weight: (memory.known.has(type) ? 8 : memory.absent.has(type) ? 0.3 : 2) * (quantity === 2 ? 1.8 : 1) }));
    let pick = random() * choices.reduce((sum, choice) => sum + choice.weight, 0);
    for (const choice of choices) { pick -= choice.weight; if (pick < 0) return choice.type; }
    return choices.at(-1)?.type;
  }
  const api = { createMemory, observe, choose };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.WendyPlayer = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
