(function (root) {
  'use strict';
  const node = typeof module !== 'undefined' && module.exports;
  const knowledge = node ? require('./knowledge') : root.OpponentKnowledge;
  function createMemory(role = 'wendy') { const memory = knowledge.createMemory(role); memory.transitions = []; return memory; }
  function initialize(memory, myHand, opponentHandCount) {
    memory.initialHand = myHand.map(card => ({ type: card.type }));
    memory.initialOpponentCount = opponentHandCount;
  }
  function observe(memory, events, copies) {
    // Retain our own private draws; discard identities of the OTHER player's draws.
    memory.transitions.push(events.map(event => event.kind === 'draw' && event.player !== memory.role ? { kind: 'draw', player: event.player } : { ...event }));
    knowledge.observe(memory, events, copies);
  }
  const api = { createMemory, initialize, observe }; if (node) module.exports = api; else root.TemporalMemory = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
