const assert = require('node:assert/strict');
const config = require('../../assets/json/game-config.json');
const engine = require('../../js/game-engine');
const wendy = require('../../js/computer-player');
function fixture(human, opponent, pile = []) {
  let id = 0;
  const cards = types => types.map(type => ({ id: String(id++), type }));
  return { hands: { human: cards(human), wendy: cards(opponent) }, pile: cards(pile),
    sets: { human: [], wendy: [] }, turn: 'human', pending: null, finished: false, copies: 3, typeCount: 10, history: [] };
}
let state = fixture(['a', 'b'], ['a', 'a', 'c'], ['d']);
engine.request(state, 'human', 'a');
assert.equal(engine.count(state.hands.human, 'a'), 2);
assert.equal(engine.count(state.hands.wendy, 'a'), 1);
assert.equal(state.turn, 'human');
engine.request(state, 'human', 'a');
assert.equal(state.sets.human.length, 1);
assert.equal(state.hands.human.length, 1);
assert.equal(state.finished, false);
for (const drawn of ['a', 'c']) {
  state = fixture(['a', 'b'], ['c', 'c'], [drawn]);
  engine.request(state, 'human', 'a');
  assert.equal(state.pending.actor, 'human');
  assert.throws(() => engine.request(state, 'human', 'b'));
  engine.fish(state);
  assert.equal(state.turn, 'wendy');
  assert.equal(state.pending, null);
}
state = fixture(['a', 'a'], ['a', 'b'], ['c']);
engine.request(state, 'human', 'a');
assert.equal(state.finished, true);
assert.equal(state.reason, 'emptyHand');
assert.equal(state.pile.length, 1);
assert.equal(state.winner, 'human');
assert.throws(() => engine.request(state, 'human', 'a'));
state = fixture(['a', 'b'], ['c']);
engine.request(state, 'human', 'a');
assert.equal(state.turn, 'wendy');
assert.throws(() => engine.request(state, 'wendy', 'a'));
state = fixture(['a'], ['b', 'c']);
state.turn = 'wendy'; state.pile = [{ id: 'x', type: 'b' }];
engine.request(state, 'wendy', 'b'); engine.fish(state);
assert(!state.history.some(event => event.kind === 'draw' && 'type' in event));
state = fixture(['a', 'a', 'c'], ['b', 'b'], ['a']);
engine.request(state, 'human', 'a');
engine.fish(state);
assert.equal(state.finished, true);
assert.equal(state.reason, 'emptyPile');
assert.equal(state.sets.human.length, 1, 'Final draw must complete its triple before game over');
assert.equal(state.winner, 'human');
assert.equal(state.hands.human.length, 1);
const memory = wendy.createMemory();
wendy.observe(memory, [{ kind: 'request', player: 'human', type: 'a' }]);
assert(memory.known.has('a'));
wendy.observe(memory, [{ kind: 'miss', player: 'wendy', type: 'a' }]);
assert(memory.absent.has('a'));
wendy.observe(memory, [{ kind: 'draw', player: 'human' }]);
assert.equal(memory.absent.size, 0);
function invariant(state) {
  const cards = [...state.pile, ...state.hands.human, ...state.hands.wendy, ...state.sets.human.flatMap(set => set.cards), ...state.sets.wendy.flatMap(set => set.cards)];
  assert.equal(cards.length, state.typeCount * state.copies); assert.equal(new Set(cards.map(card => card.id)).size, state.typeCount * state.copies);
  const types = [...state.sets.human, ...state.sets.wendy].map(set => set.type);
  assert.equal(new Set(types).size, types.length);
  for (const player of ['human', 'wendy']) for (const type of engine.heldTypes(state.hands[player])) assert(engine.count(state.hands[player], type) < state.copies);
}
let randomSeed = 1349;
function random() { randomSeed = (randomSeed * 1664525 + 1013904223) >>> 0; return randomSeed / 4294967296; }
let maximumMoves = 0;
// Force the old alternating deal to give both actors a triple.
const openingTypes = [config.candies[0].id, config.candies[1].id];
const forcedDeck = Array.from({ length: 3 }, (_, copy) => openingTypes.map(type => ({ id: type + '-' + copy, type }))).flat()
  .concat(config.candies.slice(2).flatMap(candy => Array.from({ length: 3 }, (_, copy) => ({ id: candy.id + '-' + copy, type: candy.id }))));
state = engine.create(config, random, forcedDeck);
invariant(state);
for (const player of ['human', 'wendy']) {
  assert.equal(state.hands[player].length, 5);
  assert.equal(state.sets[player].length, 0, 'Initial deal must never collect a set');
}
assert.equal(state.pile.length, 20);
assert.equal(forcedDeck.length, 30, 'Dealing must not mutate the supplied deck');
for (const copiesPerType of [3, 4]) for (let game = 0; game < 1000; game++) {
  state = engine.create({ ...config, rules: { ...config.rules, copiesPerType } }, random); const memories = { human: wendy.createMemory(), wendy: wendy.createMemory() };
  for (const player of ['human', 'wendy']) {
    assert.equal(state.hands[player].length, config.rules.initialHandSize);
    assert.equal(state.sets[player].length, 0, 'Initial deal must never collect a set');
  }
  let moves = 0; invariant(state);
  while (!state.finished && moves++ < 500) {
    const actor = state.turn;
    const type = wendy.choose(state.hands[actor].map(card => ({ type: card.type })), memories[actor], random, state.copies);
    const events = engine.request(state, actor, type); wendy.observe(memories.wendy, events);
    if (state.pending) wendy.observe(memories.wendy, engine.fish(state));
    invariant(state);
  }
  assert(state.finished, 'Game failed to terminate'); maximumMoves = Math.max(maximumMoves, moves);
}
console.log('Rules, memory, privacy, conservation and 1,000 games each with three/four copies passed; maximum ' + maximumMoves + ' requests.');
