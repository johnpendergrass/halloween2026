/* Pure rules. Presentation timing and Wendy's decisions live elsewhere. */
(function (root) {
  'use strict';
  function count(hand, type) { return hand.filter(card => card.type === type).length; }
  function heldTypes(hand) { return [...new Set(hand.map(card => card.type))]; }
  function collectSets(state, player, events) {
    for (const type of heldTypes(state.hands[player])) {
      if (count(state.hands[player], type) === state.copies) {
        const cards = state.hands[player].filter(card => card.type === type);
        state.hands[player] = state.hands[player].filter(card => card.type !== type);
        state.sets[player].push({ type, cards });
        events.push({ kind: 'set', player, type });
      }
    }
  }
  function checkFinish(state) {
    const allSets = state.sets.human.length + state.sets.wendy.length === state.typeCount;
    const emptyHand = !state.hands.human.length || !state.hands.wendy.length;
    if (allSets || emptyHand) {
      state.finished = true;
      state.reason = allSets ? 'allSets' : 'emptyHand';
      const difference = state.sets.human.length - state.sets.wendy.length;
      state.winner = difference > 0 ? 'human' : difference < 0 ? 'wendy' : 'tie';
    }
  }
  function create(config, random = Math.random, fixedDeck) {
    const deck = fixedDeck ? fixedDeck.map(card => ({ ...card })) : config.candies.flatMap(candy =>
      Array.from({ length: config.rules.copiesPerType }, (_, copy) => ({ id: candy.id + '-' + copy, type: candy.id })));
    if (!fixedDeck) {
      for (let index = deck.length - 1; index > 0; index--) {
        const other = Math.floor(random() * (index + 1));
        [deck[index], deck[other]] = [deck[other], deck[index]];
      }
    }
    const state = { pile: deck, hands: { human: [], wendy: [] }, sets: { human: [], wendy: [] },
      turn: random() < 0.5 ? 'human' : 'wendy', pending: null, finished: false,
      copies: config.rules.copiesPerType, typeCount: config.candies.length, history: [] };
    for (let index = 0; index < config.rules.initialHandSize; index++) {
      for (const player of ['human', 'wendy']) { if (state.pile.length) state.hands[player].push(state.pile.shift()); }
    }
    collectSets(state, 'human', []);
    collectSets(state, 'wendy', []);
    checkFinish(state);
    return state;
  }
  function request(state, actor, type) {
    if (state.finished || state.pending || actor !== state.turn || !count(state.hands[actor], type)) {
      throw new Error('Illegal request');
    }
    const other = actor === 'human' ? 'wendy' : 'human';
    const index = state.hands[other].findIndex(card => card.type === type);
    const events = [{ kind: 'request', player: actor, type }];
    if (index >= 0) {
      state.hands[actor].push(state.hands[other].splice(index, 1)[0]);
      events.push({ kind: 'transfer', from: other, to: actor, type });
      collectSets(state, actor, events);
      checkFinish(state);
    } else {
      events.push({ kind: 'miss', player: actor, type });
      if (state.pile.length) state.pending = { actor, type };
      else state.turn = other;
    }
    state.history.push(...events);
    return events;
  }
  function fish(state) {
    if (state.finished || !state.pending) throw new Error('No fishing draw pending');
    const { actor } = state.pending;
    const card = state.pile.shift();
    state.hands[actor].push(card);
    state.pending = null;
    state.turn = actor === 'human' ? 'wendy' : 'human';
    const events = [{ kind: 'draw', player: actor, type: card.type }];
    collectSets(state, actor, events);
    checkFinish(state);
    // Public history never includes the identity of Wendy's private draw.
    state.history.push({ kind: 'draw', player: actor });
    state.history.push(...events.filter(event => event.kind === 'set'));
    return events;
  }
  const api = { create, request, fish, count, heldTypes };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CandyEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
