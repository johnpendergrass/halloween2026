'use strict';
(async function () {
  // The generated companion keeps direct file:// opening functional.
  let config = window.CandyConfig;
  if (location.protocol !== 'file:') {
    try { const response = await fetch('./assets/json/game-config.json'); if (!response.ok) throw new Error('Config unavailable'); config = await response.json(); }
    catch (error) { console.warn('Using bundled candy configuration.', error); }
  }
  const byId = new Map(config.candies.map(candy => [candy.id, candy]));
  const el = id => document.getElementById(id);
  let state, memory, phase = 'intro', selected = null, generation = 0, overlayOpen = true, reported = false;
  let closeAction = startGame, displayedTurn = null;
  document.documentElement.style.setProperty('--empty-opacity', 1 - config.appearance.emptyCandyTransparency / 100);
  function image(type) { return './assets/candybar-images/' + byId.get(type).image; }
  function candyImage(type, className = '') {
    const img = document.createElement('img'); img.src = image(type); img.alt = ''; img.draggable = false; img.className = className; return img;
  }
  function buildSlots() {
    for (const player of ['human', 'wendy']) {
      for (const type of config.layout.slotOrder) {
        const slot = document.createElement(player === 'human' ? 'button' : 'div');
        slot.className = 'slot'; slot.dataset.type = type; slot.id = player + '-' + type;
        if (player === 'human') slot.addEventListener('pointerdown', event => {
          if (event.button !== 0) return;
          selectCandy(type);
        });
        if (player === 'human') slot.addEventListener('click', event => { if (event.detail === 0) selectCandy(type); });
        el(player + 'Slots').append(slot);
      }
    }
  }
  function selectCandy(type) {
    if (phase !== 'choose' || overlayOpen || !CandyEngine.count(state.hands.human, type)) return;
    selected = type; render();
  }
  function render() {
    if (!state) return;
    el('score').textContent = 'YOU ' + state.sets.human.length + ' · WENDY ' + state.sets.wendy.length;
    for (const player of ['human', 'wendy']) {
      el(player + 'Area').classList.toggle('active', displayedTurn === player && !state.finished);
      el(player + 'Count').textContent = 'Holding ' + state.hands[player].length + ' candies';
      for (const type of config.layout.slotOrder) {
        const slot = el(player + '-' + type), quantity = CandyEngine.count(state.hands[player], type);
        const complete = state.sets[player].some(set => set.type === type);
        const available = player === 'human' && quantity > 0 && phase === 'choose' && !overlayOpen;
        slot.replaceChildren(); slot.className = 'slot';
        slot.classList.toggle('complete', complete); slot.classList.toggle('selected', player === 'human' && selected === type);
        slot.classList.toggle('available', available);
        if (player === 'human') {
          slot.disabled = !available;
          slot.setAttribute('aria-label', byId.get(type).name + (complete ? '; completed set' : '; you have ' + quantity + '; select to ask'));
          slot.setAttribute('aria-pressed', String(selected === type));
        } else slot.setAttribute('aria-label', complete ? byId.get(type).name + '; completed set' : 'Uncompleted goal');
        if (player === 'human' || complete) {
          slot.append(candyImage(type, 'first' + (quantity > 1 ? ' stacked' : '')));
          if (player === 'human' && quantity > 1) slot.prepend(candyImage(type, 'second'));
          slot.classList.toggle('empty', !quantity && !complete);
          const badge = document.createElement('span'); badge.className = 'badge'; badge.textContent = complete ? '✓' : quantity; slot.append(badge);
        } else slot.classList.add('unknown');
      }
    }
    el('askButton').disabled = phase !== 'choose' || !selected || overlayOpen;
    el('fishButton').disabled = phase !== 'wendyFishWait' || overlayOpen;
    el('centerCircle').disabled = phase !== 'humanFishWait' || overlayOpen;
    const center = el('centerCircle'); center.replaceChildren();
    if ((phase === 'choose' && selected) || phase === 'requesting' || phase === 'wendyRequest') {
      if (selected) center.append(candyImage(selected));
      center.setAttribute('aria-label', selected ? byId.get(selected).name + ' requested' : 'Request area');
    } else {
      for (let index = 0; index < 4; index++) { const token = document.createElement('span'); token.className = 'pile-token'; center.append(token); }
      const number = document.createElement('span'); number.className = 'pile-number'; number.textContent = state.pile.length; center.append(number);
      center.setAttribute('aria-label', 'Draw a candy; ' + state.pile.length + ' in the pile');
    }
    const instructions = { choose: selected ? 'Tap Got any? to ask for ' + byId.get(selected).name : 'Choose a candy from your hand',
      humanFishWait: 'Tap the candy pile to go fish', wendyFishWait: 'You have none. Tap Go fish! to tell Wendy', thinking: 'Wendy is choosing a candy…',
      requesting: 'Passing a candy…', wendyRequest: 'Wendy asks: got any?', drawing: 'Drawing one candy…', finished: 'Game complete' };
    el('instruction').textContent = instructions[phase] || '';
  }
  async function waitActive(ms, token) {
    let elapsed = 0;
    while (elapsed < ms || overlayOpen) {
      if (token !== generation) return false;
      await new Promise(resolve => setTimeout(resolve, 40));
      if (!overlayOpen) elapsed += 40;
    }
    return token === generation;
  }
  async function fly(type, source, destination, hidden, token) {
    const from = source.getBoundingClientRect(), to = destination.getBoundingClientRect();
    const candy = hidden ? document.createElement('div') : candyImage(type);
    candy.className = hidden ? 'flying-token' : 'flying-candy'; document.body.append(candy);
    const box = candy.getBoundingClientRect();
    const x = from.left + from.width / 2 - box.width / 2, y = from.top + from.height / 2 - box.height / 2;
    const dx = to.left + to.width / 2 - box.width / 2 - x, dy = to.top + to.height / 2 - box.height / 2 - y;
    candy.style.left = x + 'px'; candy.style.top = y + 'px';
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 80 : config.appearance.travelMs;
    const animation = candy.animate([{ transform: 'translate(0,0) rotate(-8deg)' },
      { transform: `translate(${dx * 0.5}px,${dy * 0.5 - window.innerWidth * 0.07}px) rotate(6deg)`, offset: 0.5 },
      { transform: `translate(${dx}px,${dy}px) rotate(0deg)` }], { duration, easing: 'ease-in-out', fill: 'forwards' });
    let elapsed = 0;
    while (elapsed < duration && token === generation) {
      if (overlayOpen) animation.pause(); else animation.play();
      await new Promise(resolve => setTimeout(resolve, 40));
      if (!overlayOpen) elapsed += 40;
    }
    animation.cancel(); candy.remove(); return token === generation;
  }
  function startGame() {
    generation++; state = CandyEngine.create(config); memory = WendyPlayer.createMemory(); reported = false; selected = null;
    overlayOpen = false; el('overlay').hidden = true; el('table').inert = false;
    el('message').textContent = state.turn === 'human' ? 'You start. Got a sweet tooth?' : 'Wendy starts this round.';
    proceed(generation);
  }
  function finishGame() {
    phase = 'finished'; selected = null; render();
    if (!reported) { Halloween.reportScore(state.sets.human.length, state.sets.human.length + '–' + state.sets.wendy.length); reported = true; }
    const title = state.winner === 'human' ? 'You win!' : state.winner === 'wendy' ? 'Wendy wins!' : 'A sweet tie!';
    const reason = state.reason === 'allSets' ? 'All ten sets are collected.' : 'A player has run out of candies. The round ends here.';
    showDialog(title, `<p>${reason}</p><p><b>You ${state.sets.human.length} — Wendy ${state.sets.wendy.length}</b></p><p>Each completed set is worth one point.</p>`, 'Play again', startGame);
    el('message').textContent = title;
  }
  function showDialog(title, body, action, callback) {
    el('table').inert = true; el('dialogCancel').hidden = true;
    overlayOpen = true; el('overlay').hidden = false; el('dialogTitle').textContent = title;
    el('dialogBody').innerHTML = body; el('dialogAction').textContent = action; closeAction = callback; render(); el('dialogAction').focus();
  }
  async function proceed(token) {
    if (token !== generation) return;
    if (state.finished) { finishGame(); return; }
    displayedTurn = state.turn; selected = null;
    if (state.turn === 'human') { phase = 'choose'; render(); return; }
    phase = 'thinking'; render();
    if (!await waitActive(config.appearance.thinkingMs, token)) return;
    selected = WendyPlayer.choose(state.hands.wendy.map(card => ({ type: card.type })), memory);
    phase = 'wendyRequest'; el('message').textContent = 'Wendy asks for ' + byId.get(selected).name + '.'; render();
    if (!await waitActive(1100, token)) return;
    await resolveRequest('wendy', selected, token);
  }
  async function resolveRequest(actor, type, token) {
    phase = actor === 'human' ? 'requesting' : 'wendyRequest'; render();
    const events = CandyEngine.request(state, actor, type); WendyPlayer.observe(memory, events);
    const transfer = events.find(event => event.kind === 'transfer');
    if (transfer) {
      el('message').textContent = actor === 'human' ? 'Yes! Wendy gives you one ' + byId.get(type).name + '.' : 'You give Wendy one ' + byId.get(type).name + '.';
      const source = actor === 'human' ? el('wendyPile') : el('human-' + type);
      const destination = actor === 'human' ? el('human-' + type) : el('wendyPile');
      if (!await fly(type, source, destination, false, token)) return;
      render();
      const completed = events.find(event => event.kind === 'set');
      if (completed) el('message').textContent = (actor === 'human' ? 'You collected ' : 'Wendy collected ') + byId.get(type).name + '!';
      if (!await waitActive(completed ? 1000 : 650, token)) return;
      if (!state.finished) el('message').textContent = actor === 'human' ? 'Your turn continues. Ask again!' : 'Wendy gets another request.';
      proceed(token);
    } else if (state.pending) {
      phase = actor === 'human' ? 'humanFishWait' : 'wendyFishWait';
      el('message').textContent = actor === 'human' ? 'No ' + byId.get(type).name + ' here. Go fish!' : 'Wendy wants ' + byId.get(type).name + '. You have none.';
      render();
    } else {
      el('message').textContent = 'No match, and the pile is empty. Turn passes.'; render();
      if (await waitActive(1100, token)) proceed(token);
    }
  }
  async function drawCandy() {
    if (overlayOpen || !['humanFishWait', 'wendyFishWait'].includes(phase)) return;
    const token = generation, actor = state.pending.actor;
    phase = 'drawing'; render();
    if (actor === 'wendy') { el('message').textContent = 'Go fish, Wendy!'; if (!await waitActive(500, token)) return; }
    const events = CandyEngine.fish(state), draw = events[0]; WendyPlayer.observe(memory, events);
    el('message').textContent = actor === 'human' ? 'You drew ' + byId.get(draw.type).name + '.' : 'Wendy draws a candy.';
    if (!await fly(draw.type, el('centerCircle'), actor === 'human' ? el('human-' + draw.type) : el('wendyPile'), actor === 'wendy', token)) return;
    render();
    const completed = events.find(event => event.kind === 'set');
    if (completed) el('message').textContent = (actor === 'human' ? 'You collected ' : 'Wendy collected ') + byId.get(completed.type).name + '!';
    if (!await waitActive(1100, token)) return;
    proceed(token);
  }
  el('askButton').addEventListener('click', () => {
    if (phase !== 'choose' || !selected || overlayOpen) return;
    resolveRequest('human', selected, generation);
  });
  el('centerCircle').addEventListener('click', drawCandy);
  el('fishButton').addEventListener('click', drawCandy);
  el('dialogAction').addEventListener('click', () => closeAction());
  el('rulesButton').addEventListener('click', () => showDialog('How to play',
    '<p>Choose a candy you hold, then tap <b>Got any?</b></p><p>A match gives you <b>one candy</b> and another request. Three of a kind earns a set.</p><p>No match? Tap the pile to draw. <b>Fishing always ends your turn.</b> Tell Wendy to Go fish when you have none of her request.</p><p>The round ends when either hand is empty or all sets are complete. Most sets wins. Wendy sees only her hand and public clues.</p>', 'Back to the table', () => { overlayOpen = false; el('overlay').hidden = true; el('table').inert = false; render(); el('rulesButton').focus(); }));
  el('newGame').addEventListener('click', () => {
    showDialog('Deal again?', '<p>This will end the current round and deal a fresh hand.</p>', 'Start a new round', startGame);
    el('dialogCancel').hidden = false;
  });
  el('dialogCancel').addEventListener('click', () => {
    overlayOpen = false; el('overlay').hidden = true; el('table').inert = false; render(); el('newGame').focus();
  });
  document.addEventListener('keydown', event => {
    if (!overlayOpen || event.key !== 'Tab') return;
    const buttons = [el('dialogAction'), ...(!el('dialogCancel').hidden ? [el('dialogCancel')] : [])];
    const index = buttons.indexOf(document.activeElement);
    event.preventDefault(); buttons[(index + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length].focus();
  });
  el('table').inert = true;
  buildSlots();
  el('dialogAction').focus();
})();
