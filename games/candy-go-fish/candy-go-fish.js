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
  const humanName = config.players.human.name, opponentName = config.players.wendy.name;
  function escapeMarkup(value) { return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;'); }
  document.querySelector('.player-portrait .portrait-name').textContent = humanName.toUpperCase();
  document.querySelector('.wendy-portrait .portrait-name').textContent = opponentName.toUpperCase();
  for (const [player, selector] of [['human', '.player-portrait'], ['wendy', '.wendy-portrait']]) {
    const portrait = document.querySelector(selector + ' .portrait');
    portrait.src = './assets/' + config.players[player].portrait; portrait.alt = config.players[player].name;
  }
  el('wendySlots').setAttribute('aria-label', opponentName + "'s completed sets");
  el('askButton').querySelector('span').textContent = 'ASK ' + opponentName.toUpperCase();
  el('fishButton').setAttribute('aria-label', 'You say: NOPE! GO FISH!');
  el('dialogBody').querySelector('p').textContent = 'Ask ' + opponentName + ' for candies. Collect three of a kind to claim a set.';
  let state, memory, phase = 'intro', selected = null, generation = 0, overlayOpen = true, reported = false;
  let closeAction = startGame, displayedTurn = null;
  let giftWait = null;
  let playerRequestWait = null;
  function image(type) { return './assets/candybar-images/' + byId.get(type).image; }
  function candyImage(type, className = '') {
    const img = document.createElement('img'); img.src = image(type); img.alt = ''; img.draggable = false; img.className = className; return img;
  }
  function buildSlots() {
    for (const player of ['human', 'wendy']) {
      for (const type of config.layout.slotOrder) {
        const slot = document.createElement(player === 'human' ? 'button' : 'div');
        slot.className = 'slot'; slot.dataset.type = type; slot.id = player + '-' + type;
        const display = { ...config.candyDisplay, ...byId.get(type).display };
        slot.style.setProperty('--empty-opacity', 1 - display.emptyTransparency / 100);
        slot.style.setProperty('--candy-width', display.fitWidthPercent * display.imageScale / 100 + '%');
        slot.style.setProperty('--candy-height', display.fitHeightPercent * display.imageScale / 100 + '%');
        slot.style.setProperty('--candy-rotation', display.rotationDegrees + 'deg');
        slot.style.setProperty('--stack-offset', display.stackOffsetVw + 'vw');
        slot.style.setProperty('--stack-rotation', display.stackRotationDegrees + 'deg');
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
    if (giftWait && giftWait.token === generation && giftWait.type === type && !giftWait.released && !overlayOpen) {
      giftWait.released = true; render(); return;
    }
    if (phase !== 'choose' || overlayOpen || !CandyEngine.count(state.hands.human, type)) return;
    selected = type; render();
    const waiting = { token: generation, type };
    playerRequestWait = waiting;
    waitActive(config.appearance.playerRequestHoldMs, waiting.token, () => playerRequestWait !== waiting).then(valid => {
      if (valid && playerRequestWait === waiting) sendPlayerRequest(waiting.type, waiting.token);
    });
  }
  function render() {
    if (!state) return;
    el('gameOver').hidden = phase !== 'finished';
    el('gameOver').parentElement.classList.toggle('finished', phase === 'finished');
    document.querySelector('.wendy-portrait').classList.toggle('portrait-active', displayedTurn === 'wendy' && !state.finished);
    document.querySelector('.player-portrait').classList.toggle('portrait-active', displayedTurn === 'human' && !state.finished);
    for (const player of ['human', 'wendy']) {
      el(player + 'Area').classList.toggle('active', displayedTurn === player && !state.finished);
      const total = state.sets[player].length;
      el(player + 'SetCount').textContent = total + (total === 1 ? ' SET' : ' SETS');
      el(player + 'SetCount').setAttribute('aria-label', config.players[player].name + ' has ' + total + (total === 1 ? ' set' : ' sets'));
      el(player + 'Count').textContent = state.hands[player].length;
      el(player + 'Pile').setAttribute('aria-label', config.players[player].name + ' holds ' + state.hands[player].length + (state.hands[player].length === 1 ? ' candy' : ' candies'));
      for (const type of config.layout.slotOrder) {
        const slot = el(player + '-' + type), quantity = CandyEngine.count(state.hands[player], type);
        const complete = state.sets[player].some(set => set.type === type);
        const canGive = giftWait && giftWait.token === generation && giftWait.type === type && !giftWait.released;
        const available = player === 'human' && quantity > 0 && (phase === 'choose' || canGive) && !overlayOpen;
        slot.replaceChildren(); slot.className = 'slot';
        const highlighted = player === 'human' && ((selected === type && ['choose', 'requesting'].includes(phase)) || canGive);
        slot.classList.toggle('complete', complete); slot.classList.toggle('selected', Boolean(highlighted));
        slot.classList.toggle('available', available);
        if (player === 'human') {
          slot.disabled = !available;
          slot.setAttribute('aria-label', byId.get(type).longName + (complete ? '; completed set' : '; you have ' + quantity + (canGive ? '; give one to ' + opponentName : '; select to ask')));
          slot.setAttribute('aria-pressed', String(Boolean(highlighted)));
        } else slot.setAttribute('aria-label', complete ? byId.get(type).longName + '; completed set' : 'Uncompleted goal');
        if (player === 'human' || complete) {
          const art = document.createElement('span'); art.className = 'candy-art';
          art.append(candyImage(type, 'first' + (quantity > 1 ? ' stacked' : '')));
          if (player === 'human' && quantity > 1) art.prepend(candyImage(type, 'second'));
          slot.append(art);
          slot.classList.toggle('empty', !quantity && !complete);
          const badge = document.createElement('span'); badge.className = 'badge'; badge.textContent = complete ? '✓' : quantity; slot.append(badge);
        } else slot.classList.add('unknown');
      }
    }
    el('askButton').disabled = phase !== 'choose' || !selected || overlayOpen;
    el('fishButton').disabled = phase !== 'wendyFishWait' || overlayOpen;
    el('askButton').hidden = el('askButton').disabled;
    if (phase === 'choose' && selected) {
      el('askButton').classList.add('speech-request');
      fillRequestBubble(el('askButton'), humanName, selected);
      el('askButton').setAttribute('aria-label', 'Ask ' + opponentName + ': Do you have any ' + byId.get(selected).longName + '?');
    }
    el('fishButton').hidden = el('fishButton').disabled;
    el('centerCircle').disabled = phase !== 'humanFishWait' || overlayOpen;
    const center = el('centerCircle'); center.replaceChildren();
    for (let index = 0; index < 4; index++) { const token = document.createElement('span'); token.className = 'pile-token'; center.append(token); }
    const number = document.createElement('span'); number.className = 'pile-number'; number.textContent = state.pile.length; center.append(number);
    center.setAttribute('aria-label', 'Candy Dish; draw a candy; ' + state.pile.length + ' remaining');
    // One message uses a free side of the dish; buttons supply obvious actions.
    if (phase === 'choose') el('message').textContent = selected ? '' : 'Choose a candy from your hand.';
    if (phase === 'thinking') el('message').textContent = '';
    if (phase === 'humanFishWait' && !el('message').classList.contains('speech-request')) el('message').textContent = 'No match. Tap the Candy Dish to draw.';
    el('message').classList.toggle('on-right', !el('askButton').hidden);
    el('message').hidden = phase === 'finished' || phase === 'thinking' || (phase === 'choose' && Boolean(selected));
  }
  async function waitActive(ms, token, interrupted = () => false) {
    let elapsed = 0;
    while (elapsed < ms || overlayOpen) {
      if (token !== generation) return false;
      if (!overlayOpen && interrupted()) return true;
      await new Promise(resolve => setTimeout(resolve, 40));
      if (!overlayOpen) elapsed += 40;
    }
    return token === generation;
  }
  async function playVisual(animation, duration, token, removeTarget = false) {
    let elapsed = 0;
    while (elapsed < duration && token === generation && animation.playState !== 'finished') {
      if (overlayOpen && animation.playState !== 'paused') animation.pause();
      else if (!overlayOpen && animation.playState === 'paused') animation.play();
      await new Promise(resolve => setTimeout(resolve, 40));
      if (!overlayOpen) elapsed += 40;
    }
    // Remove speech layers before releasing their animation effects. This
    // also avoids a compositor restoring the layer at its original position.
    if (removeTarget) {
      const target = animation.effect.target;
      target.style.visibility = 'hidden'; target.remove(); animation.cancel();
    } else if (token === generation) animation.finish(); else animation.cancel();
    return token === generation;
  }
  async function emphasizeGift(source, token) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduced ? 120 : config.appearance.giftPulseMs;
    source.classList.add('giving');
    const pulse = source.animate(reduced ? [{ opacity: 1 }, { opacity: 1 }] : [
      { transform: 'scale(1)' }, { transform: `scale(${config.candyDisplay.giftPulseScale})`, offset: 0.32 },
      { transform: 'scale(1)', offset: 0.65 }, { transform: 'scale(1.06)', offset: 0.82 }, { transform: 'scale(1)' }
    ], { duration, easing: 'ease-in-out' });
    const valid = await playVisual(pulse, duration, token);
    source.classList.remove('giving');
    return valid;
  }
  function fillRequestBubble(container, speakerName, type) {
    const speaker = document.createElement('span'); speaker.className = 'speech-speaker'; speaker.textContent = speakerName + ' asks:';
    const prompt = document.createElement('span'); prompt.className = 'speech-prompt'; prompt.textContent = 'Do you have any';
    const name = document.createElement('span'); name.className = 'speech-candy-name'; name.textContent = byId.get(type).shortName;
    const icon = candyImage(type, 'speech-candy'); icon.alt = byId.get(type).longName;
    const display = { ...config.candyDisplay, ...byId.get(type).display };
    const scale = config.candyDisplay.speechImageScale / 100;
    const slot = el('human-' + type);
    icon.style.width = slot.clientWidth * display.fitWidthPercent / 100 * display.imageScale / 100 * scale + 'px';
    icon.style.height = slot.clientHeight * display.fitHeightPercent / 100 * display.imageScale / 100 * scale + 'px';
    icon.style.transform = 'translate(-50%, -50%) rotate(' + display.rotationDegrees + 'deg)';
    const art = document.createElement('span'); art.className = 'speech-candy-art'; art.append(icon);
    container.replaceChildren(speaker, prompt, name, art);
  }
  async function sendPlayerRequest(type, token) {
    if (token !== generation || phase !== 'choose' || selected !== type || overlayOpen) return;
    playerRequestWait = null;
    const source = el('askButton'), from = source.getBoundingClientRect();
    const to = document.querySelector('.wendy-portrait .portrait').getBoundingClientRect();
    const moving = document.createElement('div'); moving.className = 'speech-request flying-speech player-request-flight';
    moving.style.opacity = '0';
    moving.setAttribute('aria-hidden', 'true');
    for (const child of source.children) moving.append(child.cloneNode(true));
    moving.style.left = from.left + 'px'; moving.style.top = from.top + 'px'; moving.style.width = from.width + 'px';
    document.body.append(moving);
    // The question now belongs only to the flying copy; do not leave a
    // populated stationary button for a redraw to expose during the handoff.
    source.hidden = true; source.replaceChildren(); source.classList.remove('speech-request');
    el('message').style.visibility = 'hidden'; el('message').replaceChildren();
    phase = 'requesting'; render();
    const dx = to.left + to.width / 2 - from.left - from.width / 2;
    const dy = to.top + to.height / 2 - from.top - from.height / 2;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduced ? 100 : config.appearance.requestSpeechMs;
    const frames = reduced ? [{ opacity: 1 }, { opacity: 0 }] : [
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.8}px,${dy * 0.8}px) scale(0.55)`, opacity: 0.85, offset: 0.75 },
      { transform: `translate(${dx}px,${dy}px) scale(0.15)`, opacity: 0 }
    ];
    const valid = await playVisual(moving.animate(frames, { duration, easing: 'ease-in-out', fill: 'both' }), duration, token, true);
    moving.remove();
    if (valid) await resolveRequest('human', type, token);
  }
  async function presentOpponentSpeech(text, token, holdMs, keepQuote = false, travelMs = config.appearance.requestSpeechMs, dissolve = false, requestType = null) {
    const message = el('message');
    message.style.visibility = 'hidden';
    message.classList.add('speech-request');
    const speaker = document.createElement('span'); speaker.className = 'speech-speaker'; speaker.textContent = opponentName + ' says:';
    const quote = document.createElement('span'); quote.className = 'speech-quote'; quote.textContent = '“' + text + '”';
    message.replaceChildren(speaker, quote);
    if (requestType) fillRequestBubble(message, opponentName, requestType);
    const target = message.getBoundingClientRect();
    const origin = document.querySelector('.wendy-portrait .portrait').getBoundingClientRect();
    const moving = message.cloneNode(true);
    moving.removeAttribute('id'); moving.removeAttribute('role'); moving.removeAttribute('aria-live'); moving.setAttribute('aria-hidden', 'true');
    moving.className = 'speech-request flying-speech';
    moving.style.visibility = 'visible'; moving.style.opacity = '0';
    moving.style.left = target.left + 'px'; moving.style.top = target.top + 'px'; moving.style.width = target.width + 'px';
    document.body.append(moving); message.style.visibility = 'hidden';
    const dx = origin.left + origin.width / 2 - target.left - target.width / 2;
    const dy = origin.top + origin.height / 2 - target.top - target.height / 2;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduced ? 100 : travelMs;
    const frames = reduced ? [{ opacity: 0 }, { opacity: 1 }] : [
      { transform: `translate(${dx}px,${dy}px) scale(0.15)`, opacity: 0 },
      { transform: `translate(${dx * 0.32}px,${dy * 0.32}px) scale(0.8)`, opacity: 0.8, offset: 0.65 },
      { transform: 'translate(0,0) scale(1)', opacity: 1 }
    ];
    const animation = moving.animate(frames, { duration, easing: 'ease-in-out', fill: 'both' });
    const valid = await playVisual(animation, duration, token, true);
    moving.remove();
    if (!valid) return false;
    if (dissolve) {
      message.style.visibility = '';
      if (!await waitActive(holdMs, token)) return false;
      const fadeMs = reduced ? 100 : config.appearance.replyDissolveMs;
      const fade = message.animate([{ opacity: 1 }, { opacity: 0 }], { duration: fadeMs, fill: 'both', easing: 'ease-out' });
      if (!await playVisual(fade, fadeMs, token)) return false;
      message.style.visibility = 'hidden'; message.replaceChildren(); message.classList.remove('speech-request');
      fade.cancel(); message.style.visibility = '';
      return true;
    }
    message.style.visibility = '';
    if (requestType) render();
    // Give the fully settled quote time to be read before automatic receipt.
    const waiting = phase === 'wendyRequest' && CandyEngine.count(state.hands.human, selected)
      ? { token, type: selected, released: false } : null;
    const highlightDelay = waiting ? Math.min(config.appearance.requestHighlightDelayMs, holdMs) : 0;
    if (highlightDelay && !await waitActive(highlightDelay, token)) return false;
    if (waiting) { giftWait = waiting; render(); }
    const held = await waitActive(holdMs - highlightDelay, token, () => Boolean(waiting?.released));
    if (giftWait === waiting) giftWait = null;
    if (!held) return false;
    if (waiting) render();
    if (!keepQuote) message.classList.remove('speech-request');
    return true;
  }
  async function fly(type, source, destination, hidden, token) {
    const from = source.getBoundingClientRect(), to = destination.getBoundingClientRect();
    const candy = hidden ? document.createElement('div') : candyImage(type);
    candy.className = hidden ? 'flying-token' : 'flying-candy'; document.body.append(candy);
    candy.style.width = config.candyDisplay.giftWidthVw + 'vw';
    candy.style.height = (hidden ? config.candyDisplay.giftWidthVw / 2 : config.candyDisplay.giftHeightVw) + 'vw';
    const box = candy.getBoundingClientRect();
    const x = from.left + from.width / 2 - box.width / 2, y = from.top + from.height / 2 - box.height / 2;
    const dx = to.left + to.width / 2 - box.width / 2 - x, dy = to.top + to.height / 2 - box.height / 2 - y;
    candy.style.left = x + 'px'; candy.style.top = y + 'px';
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduced ? 80 : config.appearance.giftTravelMs;
    let frames;
      // Sample a quadratic curve; a single easing function accelerates along it.
      const bend = window.innerWidth * config.candyDisplay.giftArcVw / 100;
      const controlX = dx / 2 + (dx < 0 ? bend : -bend), controlY = dy / 2;
      const rotation = hidden ? 0 : byId.get(type).display?.rotationDegrees ?? config.candyDisplay.rotationDegrees;
      frames = Array.from({ length: 41 }, (_, index) => {
        const t = index / 40, remaining = 1 - t;
        const dissolve = Math.max(0, (t - config.candyDisplay.giftDissolveStart) / (1 - config.candyDisplay.giftDissolveStart));
        const curveX = 2 * remaining * t * controlX + t * t * dx;
        const curveY = 2 * remaining * t * controlY + t * t * dy;
        return { offset: t, transform: `translate(${curveX}px,${curveY}px) rotate(${rotation * remaining}deg) scale(${1 - dissolve * 0.45})`, opacity: 1 - dissolve };
      });
    if (reduced) frames = [{ opacity: 1 }, { opacity: 0 }];
    const animation = candy.animate(frames, { duration, easing: config.appearance.giftEasing, fill: 'forwards' });
    const valid = await playVisual(animation, duration, token);
    candy.remove(); return valid;
  }
  function startGame() {
    playerRequestWait = null;
    giftWait = null;
    generation++; state = CandyEngine.create(config); memory = WendyPlayer.createMemory(); reported = false; selected = null;
    overlayOpen = false; el('overlay').hidden = true; el('table').inert = false;
    el('message').style.visibility = ''; el('message').classList.remove('speech-request');
    el('message').textContent = state.turn === 'human' ? humanName + ' starts this round.' : opponentName + ' starts this round.';
    proceed(generation);
  }
  function finishGame() {
    phase = 'finished'; selected = null; render();
    if (!reported) { Halloween.reportScore(state.sets.human.length, state.sets.human.length + '–' + state.sets.wendy.length); reported = true; }
    const title = state.winner === 'human' ? humanName + ' wins!' : state.winner === 'wendy' ? opponentName + ' wins!' : 'A sweet tie!';
    const remaining = state.pile.length + (state.pile.length === 1 ? ' candy' : ' candies');
    const handEnding = !state.hands.wendy.length && !state.hands.human.length ? 'Both players ran out of candies' :
      !state.hands.wendy.length ? opponentName + ' ran out of candies' : humanName + ' ran out of candies';
    const reason = state.reason === 'allSets' ? 'All ten sets are complete.' : state.reason === 'emptyPile' ? 'Candy Dish ran out of candies.' :
      handEnding;
    el('gameOverTitle').textContent = 'Game over — ' + title;
    el('gameOverReason').textContent = reason;
    el('gameOverRemaining').hidden = state.reason !== 'emptyHand';
    el('gameOverRemaining').textContent = 'Candy Dish had ' + remaining + ' left.';
    el('gameOverScore').textContent = humanName + ' had ' + state.sets.human.length + (state.sets.human.length === 1 ? ' candy set; ' : ' candy sets; ') + opponentName + ' had ' + state.sets.wendy.length + '.';
  }
  function showDialog(title, body, action, callback) {
    el('overlay').classList.remove('celebrating');
    el('table').inert = true; el('dialogCancel').hidden = true;
    overlayOpen = true; el('overlay').hidden = false; el('dialogTitle').textContent = title;
    el('dialogBody').innerHTML = body; el('dialogAction').textContent = action; closeAction = callback; render(); el('dialogAction').focus();
  }
  async function celebrateSet(event, token) {
    if (token !== generation) return false;
    const name = config.players[event.player].name, candy = byId.get(event.type);
    await new Promise(resolve => {
      showDialog(name + ' won a set!', '<img class="celebration-candy" src="' + escapeMarkup(image(event.type)) + '" alt="' + escapeMarkup(candy.longName) + '" draggable="false">' +
        '<p>Collected all ' + state.copies + ' <b>' + escapeMarkup(candy.longName.toUpperCase()) + '</b> candies!</p>', 'Continue', () => {
        el('overlay').classList.remove('celebrating'); overlayOpen = false; el('overlay').hidden = true; el('table').inert = false;
        render(); resolve();
      });
      el('overlay').classList.add('celebrating');
    });
    return token === generation;
  }
  async function proceed(token) {
    if (token !== generation) return;
    el('message').classList.remove('speech-request');
    if (state.finished) { finishGame(); return; }
    displayedTurn = state.turn; selected = null;
    if (state.turn === 'human') { phase = 'choose'; render(); return; }
    phase = 'thinking'; render();
    if (!await waitActive(config.appearance.thinkingMs, token)) return;
    selected = WendyPlayer.choose(state.hands.wendy.map(card => ({ type: card.type })), memory);
    phase = 'wendyRequest'; el('message').textContent = opponentName + ' asks for ' + byId.get(selected).shortName + '.'; render();
    const holdMs = CandyEngine.count(state.hands.human, selected) ? config.appearance.requestGiveHoldMs : config.appearance.requestHoldMs;
    const keepRequest = !CandyEngine.count(state.hands.human, selected);
    if (!await presentOpponentSpeech('', token, holdMs, keepRequest, config.appearance.requestSpeechMs, false, selected)) return;
    await resolveRequest('wendy', selected, token);
  }
  async function resolveRequest(actor, type, token) {
    phase = actor === 'human' ? 'requesting' : 'wendyRequest'; render();
    if (actor === 'wendy' && CandyEngine.count(state.hands.human, type)) {
      el('message').textContent = 'You have ' + byId.get(type).shortName + ' — giving one to ' + opponentName + '.';
      if (!await emphasizeGift(el('human-' + type), token)) return;
    }
    if (actor === 'human' && CandyEngine.count(state.hands.wendy, type)) {
      if (!await presentOpponentSpeech('Yes I do', token, config.appearance.requestHoldMs, false, config.appearance.requestSpeechMs, true)) return;
      if (!await emphasizeGift(el('wendyPile'), token)) return;
    }
    const events = CandyEngine.request(state, actor, type); WendyPlayer.observe(memory, events);
    const transfer = events.find(event => event.kind === 'transfer');
    if (transfer) {
      el('message').textContent = actor === 'human' ? 'Yes! ' + opponentName + ' gives you one ' + byId.get(type).shortName + '.' : 'You give ' + opponentName + ' one ' + byId.get(type).shortName + '.';
      const source = actor === 'human' ? el('wendyPile') : el('human-' + type);
      const destination = actor === 'human' ? el('human-' + type) : el('wendyPile');
      if (!await fly(type, source, destination, false, token)) return;
      render();
      const completed = events.find(event => event.kind === 'set');
      if (completed) { if (!await celebrateSet(completed, token)) return; }
      else if (!await waitActive(650, token)) return;
      proceed(token);
    } else if (state.pending) {
      if (actor === 'human') {
        phase = 'fishResponse'; render();
        if (!await presentOpponentSpeech('Nope. Tap the candy dish to Go Fish!', token, 0, true)) return;
        phase = 'humanFishWait'; render();
        return;
      }
      phase = 'wendyFishWait';
      render();
    } else {
      el('message').textContent = 'No match, and the pile is empty. Turn passes.'; render();
      if (await waitActive(1100, token)) proceed(token);
    }
  }
  async function drawCandy() {
    if (overlayOpen || !['humanFishWait', 'wendyFishWait'].includes(phase)) return;
    const token = generation, actor = state.pending.actor;
    el('message').classList.remove('speech-request');
    phase = 'drawing'; render();
    if (actor === 'wendy') { el('message').textContent = 'Go fish, ' + opponentName + '!'; if (!await waitActive(500, token)) return; }
    if (!await emphasizeGift(el('centerCircle'), token)) return;
    const events = CandyEngine.fish(state), draw = events[0]; WendyPlayer.observe(memory, events);
    el('message').textContent = actor === 'human' ? 'You drew ' + byId.get(draw.type).shortName + '.' : opponentName + ' draws a candy.';
    if (!await fly(draw.type, el('centerCircle'), actor === 'human' ? el('human-' + draw.type) : el('wendyPile'), actor === 'wendy', token)) return;
    render();
    const completed = events.find(event => event.kind === 'set');
    if (completed) { if (!await celebrateSet(completed, token)) return; }
    else if (!await waitActive(1100, token)) return;
    proceed(token);
  }
  el('askButton').addEventListener('click', () => {
    if (phase !== 'choose' || !selected || overlayOpen) return;
    sendPlayerRequest(selected, generation);
  });
  el('centerCircle').addEventListener('click', drawCandy);
  el('fishButton').addEventListener('click', drawCandy);
  el('gameOverNew').addEventListener('click', startGame);
  el('dialogAction').addEventListener('click', () => closeAction());
  el('overlay').addEventListener('click', event => {
    if (event.target === el('overlay') && el('overlay').classList.contains('celebrating')) closeAction();
  });
  el('rulesButton').addEventListener('click', () => showDialog('How to play',
    ('<p>Choose a candy you hold, then tap <b>Got any?</b></p><p>A match gives you <b>one candy</b> and another request. Three of a kind earns a set.</p><p>No match? Tap the Candy Dish to draw. <b>Fishing always ends your turn.</b> Tell Wendy to Go fish when you have none of her request.</p><p>The round ends when the Candy Dish empties, either hand empties, or all sets are complete. The last draw can still complete a set. Most sets wins. Wendy sees only her hand and public clues.</p>').replaceAll('Wendy', escapeMarkup(opponentName)), 'Back to the table', () => { overlayOpen = false; el('overlay').hidden = true; el('table').inert = false; render(); el('rulesButton').focus(); }));
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
