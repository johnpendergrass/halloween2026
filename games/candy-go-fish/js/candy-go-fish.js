'use strict';
(async function () {
  // The generated companion keeps direct file:// opening functional.
  let config = window.CandyConfig;
  if (location.protocol !== 'file:') {
    try { const response = await fetch('./assets/json/game-config.json?v=2026-1012-candy-welcome'); if (!response.ok) throw new Error('Config unavailable'); config = await response.json(); }
    catch (error) { console.warn('Using bundled candy configuration.', error); }
  }
  const piles = CandyPiles();
  const byId = new Map(config.candies.map(candy => [candy.id, candy]));
  const el = id => document.getElementById(id);
  const candyRain = CandyRain({ host: document.body, candies: config.candies.map(candy => './assets/candybar-images/' + candy.image) });
  let restarting = false;
  let humanName = config.players.human.name;
  const playerCharacters = config.playerCharacters || [config.players.human];
  let playerCharacterIndex = Math.max(0, playerCharacters.findIndex(player => player.name === humanName));
  let opponentName = config.players.wendy.name;
  const opponents = config.opponents || [config.players.wendy];
  let opponentIndex = Math.max(0, opponents.findIndex(player => player.name === opponentName));
  function escapeMarkup(value) { return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;'); }
  document.querySelector('.player-portrait .portrait-name').textContent = humanName.toUpperCase();
  document.querySelector('.wendy-portrait .portrait-name').textContent = (config.players.wendy.displayName || opponentName).toUpperCase();
  for (const [player, selector] of [['human', '.player-portrait'], ['wendy', '.wendy-portrait']]) {
    const portrait = document.querySelector(selector + ' .portrait');
    portrait.src = './assets/' + config.players[player].portrait; portrait.alt = config.players[player].name;
  }
  el('wendySlots').setAttribute('aria-label', opponentName + "'s completed sets");
  el('askButton').querySelector('span').textContent = 'ASK ' + opponentName.toUpperCase();
  el('fishButton').setAttribute('aria-label', humanName + ' says: NO, GO FISH!');
  el('dialogBody').querySelector('p').textContent = 'Ask for candies.';
  let state, memory, phase = 'intro', selected = null, generation = 0, overlayOpen = true, reported = false;
  let closeAction = startGame, displayedTurn = null;
  let yesWait = null;
  let requestedGift = null;
  let playerRequestWait = null;
  let messageSpeaker = 'human';
  // Quotes fade in place; candy transport keeps its independent motion.
  const quoteTiming = { fadeMs: config.appearance.quoteFadeMs, holdMs: config.appearance.quoteHoldMs };
  let retainedPlayerRequest = null;
  let retainedOpponentRequest = null;
  let startingPlayer = null;
  const openingPhase = () => ['pickStarter', 'spinningStarter', 'starterReady'].includes(phase);
  function setMessageSpeaker(player) {
    messageSpeaker = player;
    el('message').dataset.speaker = player;
    el('message').classList.toggle('on-right', player === 'human');
  }
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
  function giftShortcutUsed(token) {
    return requestedGift?.token === token && requestedGift.released;
  }
  function selectCandy(type) {
    if (!overlayOpen && requestedGift?.token === generation && !requestedGift.released && requestedGift.type === type) {
      requestedGift.released = true;
      if (yesWait) yesWait.released = true;
      render();
      el('message').replaceChildren(); el('message').style.visibility = 'hidden';
      el('heldOpponentQuestion')?.remove();
      document.querySelectorAll('.stationary-speech').forEach(layer => { layer.style.visibility = 'hidden'; });
      return;
    }
    if (phase !== 'choose' || overlayOpen || !CandyEngine.count(state.hands.human, type)) return;
    selected = type; render();
    const waiting = { token: generation, type };
    playerRequestWait = waiting;
    waitActive(config.appearance.playerRequestHoldMs, waiting.token, () => playerRequestWait !== waiting, true).then(valid => {
      if (valid && playerRequestWait === waiting) sendPlayerRequest(waiting.type, waiting.token);
    });
  }
  function middleAcknowledgementReady() {
    return !overlayOpen && (['humanFishWait', 'wendyFishWait'].includes(phase) ||
      (yesWait?.token === generation && !yesWait.released));
  }
  function updateMiddleControls() {
    const ready = Boolean(middleAcknowledgementReady());
    el('centerCircle').disabled = !ready;
    if (el('heldOpponentQuestion')) el('heldOpponentQuestion').disabled = !ready;
    if (retainedPlayerRequest) el('askButton').disabled = !ready;
    el('message').classList.toggle('acknowledge', ready);
    el('message').classList.toggle('waiting-breath', ready && Boolean(yesWait?.token === generation && !yesWait.released));
    // The Yes reply already supplies native keyboard button semantics.
    const messageButton = ready && !el('yesReply');
    el('message').setAttribute('role', messageButton ? 'button' : 'status');
    el('message').tabIndex = messageButton ? 0 : -1;
    el('centerCircle').setAttribute('aria-label', 'Candy Dish; ' + (ready ? 'acknowledge and continue; ' : '') + (state?.pile.length ?? 0) + ' remaining');
  }
  function acknowledgeMiddle() {
    if (!overlayOpen && phase === 'pickStarter') { spinStarter(); return; }
    if (!overlayOpen && phase === 'starterReady') { dealGame(); return; }
    if (!middleAcknowledgementReady()) return;
    if (yesWait?.token === generation && !yesWait.released) {
      yesWait.released = true;
      el('yesReply').disabled = true;
      updateMiddleControls();
    } else drawCandy();
  }
  function render() {
    if (!state) return;
    const opening = openingPhase();
    for (const id of ['opponentPrevious', 'opponentNext']) {
      el(id).disabled = overlayOpen || phase === 'finished' || opponents.length < 2;
    }
    for (const id of ['playerPrevious', 'playerNext']) {
      el(id).disabled = overlayOpen || phase === 'finished' || playerCharacters.length < 2;
    }
    el('table').classList.toggle('opening-board', opening);
    el('table').classList.toggle('starter-chosen', phase === 'starterReady');
    el('table').classList.toggle('starter-up', startingPlayer === 'wendy');
    el('gameOver').hidden = phase !== 'finished';
    el('gameOver').parentElement.classList.toggle('finished', phase === 'finished');
    document.querySelector('.wendy-portrait').classList.toggle('portrait-active', displayedTurn === 'wendy' && !state.finished);
    document.querySelector('.player-portrait').classList.toggle('portrait-active', displayedTurn === 'human' && !state.finished);
    for (const player of ['human', 'wendy']) {
      el(player + 'Area').classList.toggle('active', displayedTurn === player && !state.finished);
      const total = state.sets[player].length;
      const scoreLabel = document.createElement('span'); scoreLabel.textContent = 'CANDY SETS';
      const scoreNumber = document.createElement('strong'); scoreNumber.textContent = total;
      el(player + 'SetCount').replaceChildren(scoreLabel, scoreNumber);
      el(player + 'SetCount').setAttribute('aria-label', config.players[player].name + ' has ' + total + (total === 1 ? ' set' : ' sets'));
      if (el(player + 'Count')) el(player + 'Count').textContent = state.hands[player].length;
      if (player === 'human') el('humanPile').setAttribute('aria-label', humanName + ' holds ' + state.hands.human.length + (state.hands.human.length === 1 ? ' candy' : ' candies'));
      el(player + 'Pile')?.setAttribute('aria-label', config.players[player].name + ' holds ' + state.hands[player].length + (state.hands[player].length === 1 ? ' candy' : ' candies'));
      for (const type of config.layout.slotOrder) {
        const slot = el(player + '-' + type), quantity = CandyEngine.count(state.hands[player], type);
        const complete = state.sets[player].some(set => set.type === type);
        const canGive = requestedGift?.token === generation && !requestedGift.released && requestedGift.type === type;
        const available = player === 'human' && quantity > 0 && (phase === 'choose' || canGive) && !overlayOpen;
        slot.replaceChildren(); slot.className = 'slot';
        const highlighted = player === 'human' && ((selected === type && phase === 'choose') || canGive);
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
          if (player === 'human' && quantity > 2) art.prepend(candyImage(type, 'third'));
          slot.append(art);
          slot.classList.toggle('empty', !quantity && !complete);
          if (complete || quantity > 0) {
            const badge = document.createElement('span'); badge.className = 'badge'; badge.textContent = complete ? '✓' : quantity; slot.append(badge);
          }
        } else slot.classList.add('unknown');
      }
    }
    el('askButton').disabled = phase !== 'choose' || !selected || overlayOpen;
    el('fishButton').disabled = !['humanFishWait', 'wendyFishWait'].includes(phase) || overlayOpen;
    el('fishButton').classList.toggle('waiting-breath', ['humanFishWait', 'wendyFishWait'].includes(phase) && !overlayOpen);
    el('fishButton').classList.toggle('reply-arrived', ['humanFishWait', 'wendyFishWait', 'fishResponse'].includes(phase));
    const fishPlayer = phase === 'humanFishWait' || (phase === 'fishResponse' && state.pending?.actor === 'human') ? 'wendy' : 'human';
    el('fishButton').dataset.speaker = fishPlayer;
    const fishSpeaker = config.players[fishPlayer].name;
    fillGoFishReply(el('fishButton'), fishSpeaker);
    el('fishButton').setAttribute('aria-label', fishSpeaker + ' says: NO, GO FISH!' + (phase === 'humanFishWait' ? ' Draw a candy' : ' Tell ' + opponentName + ' to draw'));
    const keepPlayerQuestion = retainedPlayerRequest && ['requesting', 'fishResponse', 'humanFishWait'].includes(phase);
    el('askButton').hidden = el('askButton').disabled && !keepPlayerQuestion;
    if ((phase === 'choose' && selected) || keepPlayerQuestion) {
      el('askButton').classList.add('speech-request');
      fillRequestBubble(el('askButton'), humanName, keepPlayerQuestion ? retainedPlayerRequest : selected);
      el('askButton').setAttribute('aria-label', 'Ask ' + opponentName + ': Do you have any ' + byId.get(selected).longName + '?');
    }
    el('fishButton').hidden = el('fishButton').disabled;
    el('centerCircle').disabled = !['humanFishWait', 'wendyFishWait'].includes(phase) || overlayOpen;
    const center = el('centerCircle');
    if (!opening || !center.querySelector('img')) {
    center.replaceChildren();
    const dish = document.createElement('img'); dish.src = './assets/candy-dish/ghost-plate.png';
    dish.alt = ''; dish.draggable = false; center.append(dish);
    const number = document.createElement('span'); number.className = 'pile-number'; number.textContent = state.pile.length; center.append(number);
    }
    if (!opening) center.querySelector('img').style.transform = '';
    center.setAttribute('aria-label', 'Candy Dish; ' + (phase === 'wendyFishWait' ? 'let ' + opponentName + ' draw a candy' : 'draw a candy') + '; ' + state.pile.length + ' remaining');
    piles.render(state);
    // Keep the opponent question until the human actually answers Go Fish.
    if (retainedOpponentRequest && ['fishResponse', 'wendyFishWait'].includes(phase)) {
      setMessageSpeaker('wendy');
      el('message').style.visibility = '';
      el('message').classList.add('speech-request');
      fillRequestBubble(el('message'), opponentName, retainedOpponentRequest);
    }
    // One message uses a free side of the dish; buttons supply obvious actions.
    if (phase === 'choose') el('message').textContent = selected ? '' : 'Choose a candy from your hand.';
    el('message').classList.toggle('choose-instruction', phase === 'choose' && !selected);
    if (phase === 'thinking') el('message').textContent = '';
    if (phase === 'humanFishWait') el('message').replaceChildren();
    if (phase === 'choose') messageSpeaker = 'human';
    el('message').classList.toggle('on-right', messageSpeaker === 'human');
    el('message').hidden = phase === 'finished' || phase === 'thinking' || (phase === 'choose' && Boolean(selected));
    updateMiddleControls();
    if (opening) {
      const ready = phase !== 'spinningStarter' && !overlayOpen;
      center.disabled = !ready;
      el('message').classList.remove('speech-request', 'yes-answer', 'waiting-breath', 'on-right');
      el('message').classList.add('choose-instruction');
      el('message').classList.toggle('opening-action', ready);
      el('message').hidden = phase === 'spinningStarter';
      el('message').style.visibility = '';
      el('message').textContent = phase === 'starterReady' ? config.players[startingPlayer].name + ' goes first - click to start' : 'Click to choose a starting player';
      el('message').setAttribute('role', 'button'); el('message').tabIndex = ready ? 0 : -1;
      center.setAttribute('aria-label', phase === 'starterReady' ? 'Start the game' : 'Spin to choose a starting player');
    } else el('message').classList.remove('opening-action');
  }
  async function waitActive(ms, token, interrupted = () => false, quoteWait = false) {
    let elapsed = 0;
    while (elapsed < (quoteWait ? Math.min(ms, quoteTiming.holdMs) : ms) || overlayOpen) {
      if (token !== generation) return false;
      if (!overlayOpen && interrupted()) return true;
      await new Promise(resolve => setTimeout(resolve, 40));
      if (!overlayOpen) elapsed += 40;
    }
    return token === generation;
  }
  async function playVisual(animation, duration, token, removeTarget = false, interrupted = () => false) {
    let elapsed = 0;
    while (elapsed < duration && token === generation && animation.playState !== 'finished') {
      if (!overlayOpen && interrupted()) break;
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
  function fillGoFishReply(container, speakerName) {
    const label = document.createElement('span'); label.textContent = speakerName + ' says:';
    const action = document.createElement('strong'); action.textContent = 'NO, GO FISH!';
    container.replaceChildren(label, action);
  }
  function fillRequestBubble(container, speakerName, type) {
    const speaker = document.createElement('span'); speaker.className = 'speech-speaker'; speaker.textContent = speakerName + ' asks:';
    const prompt = document.createElement('span'); prompt.className = 'speech-prompt'; prompt.textContent = 'Do you have any';
    const name = document.createElement('span'); name.className = 'speech-candy-name'; name.textContent = byId.get(type).shortName + '?';
    const icon = candyImage(type, 'speech-candy'); icon.alt = byId.get(type).longName;
    const display = { ...config.candyDisplay, ...byId.get(type).display };
    const scale = config.candyDisplay.speechImageScale / 100;
    const slot = el('human-' + type);
    icon.style.width = slot.clientWidth * display.fitWidthPercent / 100 * display.imageScale / 100 * scale + 'px';
    icon.style.height = slot.clientHeight * display.fitHeightPercent / 100 * display.imageScale / 100 * scale + 'px';
    icon.style.transform = 'translate(-50%, -50%) rotate(' + display.rotationDegrees + 'deg)';
    const art = document.createElement('span'); art.className = 'speech-candy-art'; art.append(icon);
    container.replaceChildren(art, speaker, prompt, name);
  }
  async function sendPlayerRequest(type, token) {
    if (token !== generation || phase !== 'choose' || selected !== type || overlayOpen) return;
    playerRequestWait = null;
    retainedPlayerRequest = type; phase = 'requesting';
    el('message').style.visibility = 'hidden'; el('message').replaceChildren();
    render(); await resolveRequest('human', type, token);
  }
  async function presentSpeech(text, token, holdMs, keepQuote = false, dissolve = false, requestType = null, fishReply = false, speakerPlayer = 'wendy') {
    if (giftShortcutUsed(token)) return true;
    const message = fishReply ? el('fishButton') : el('message');
    const name = config.players[speakerPlayer].name;
    if (!fishReply) setMessageSpeaker(speakerPlayer);
    else message.dataset.speaker = speakerPlayer;
    if (fishReply) { message.hidden = false; message.disabled = true; }
    message.style.visibility = 'hidden';
    if (!fishReply) message.classList.add('speech-request');
    message.classList.toggle('yes-answer', !fishReply && text === 'Yes I do');
    const speaker = document.createElement('span'); speaker.className = 'speech-speaker'; speaker.textContent = name + ' says:';
    const quote = document.createElement('span'); quote.className = 'speech-quote'; quote.textContent = '“' + text + '”';
    if (fishReply) {
      fillGoFishReply(message, name);
    } else message.replaceChildren(speaker, quote);
    if (requestType) fillRequestBubble(message, name, requestType);
    const target = message.getBoundingClientRect();
    const moving = message.cloneNode(true);
    moving.removeAttribute('id'); moving.removeAttribute('role'); moving.removeAttribute('aria-live'); moving.setAttribute('aria-hidden', 'true');
    moving.className = (fishReply ? 'go-fish-reply stationary-speech' : 'speech-request stationary-speech') + (speakerPlayer === 'human' ? ' on-right' : '') + (message.classList.contains('yes-answer') ? ' yes-answer' : '');
    moving.style.visibility = 'visible'; moving.style.opacity = '0';
    moving.style.left = target.left + 'px'; moving.style.top = target.top + 'px'; moving.style.width = target.width + 'px';
    document.body.append(moving); message.style.visibility = 'hidden';
    const duration = quoteTiming.fadeMs;
    const animation = moving.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing: 'ease-in-out', fill: 'both' });
    const valid = await playVisual(animation, duration, token, true, () => giftShortcutUsed(token));
    moving.remove();
    if (!valid) return false;
    if (giftShortcutUsed(token)) return true;
    if (dissolve) {
      message.style.visibility = '';
      if (!await waitActive(holdMs, token, () => false, true)) return false;
      const fadeMs = quoteTiming.fadeMs;
      const fade = message.animate([{ opacity: 1 }, { opacity: 0 }], { duration: fadeMs, fill: 'both', easing: 'ease-out' });
      if (!await playVisual(fade, fadeMs, token)) return false;
      message.style.visibility = 'hidden'; message.replaceChildren(); message.classList.remove('speech-request', 'yes-answer', 'waiting-breath');
      fade.cancel(); message.style.visibility = '';
      return true;
    }
    message.style.visibility = '';
    if (fishReply) return true;
    if (requestType) render();
    // Answers appear automatically, but receipt always waits for acknowledgement.
    const effectiveHold = requestType ? quoteTiming.holdMs : Math.min(holdMs, quoteTiming.holdMs);
    if (!await waitActive(effectiveHold, token, () => giftShortcutUsed(token), true)) return false;
    if (!keepQuote) message.classList.remove('speech-request', 'yes-answer', 'waiting-breath');
    return true;
  }
  async function fly(type, source, destination, hidden, token, generic = null) {
    const from = source.getBoundingClientRect(), to = destination.getBoundingClientRect();
    const candy = generic ? piles.node(generic) : hidden ? document.createElement('div') : candyImage(type);
    candy.className = generic ? 'flying-candy pile-flight' : hidden ? 'flying-token' : 'flying-candy'; candy.style.visibility = ''; document.body.append(candy);
    candy.style.width = (generic ? generic.width : config.candyDisplay.giftWidthVw) + 'vw';
    candy.style.height = (generic ? generic.width / 2 : hidden ? config.candyDisplay.giftWidthVw / 2 : config.candyDisplay.giftHeightVw) + 'vw';
    candy.style.transform = 'none';
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
        const landingScale = generic ? generic.targetWidth / generic.width : 1;
        const baseScale = t <= .5 ? 1 : landingScale;
        const scale = baseScale + (config.candyDisplay.giftMidScale - baseScale) * Math.sin(Math.PI * t);
        return { offset: t, transform: `translate(${curveX}px,${curveY}px) rotate(${generic ? generic.rotation : rotation * remaining}deg) scale(${scale})`, opacity: 1 - dissolve };
      });
    if (reduced) frames = [{ opacity: 1 }, { opacity: 0 }];
    const animation = candy.animate(frames, { duration, easing: config.appearance.giftEasing, fill: 'forwards' });
    const valid = await playVisual(animation, duration, token);
    candy.remove(); return valid;
  }
  function startGame() {
    candyRain.stop(); restarting = false;
    el('gameOverNew').disabled = false; el('gameOverNew').querySelector('span').textContent = 'New game';
    el('newGame').disabled = false;
    el('overlay').classList.remove('welcoming');
    el('heldOpponentQuestion')?.remove();
    playerRequestWait = null;
    retainedPlayerRequest = null;
    retainedOpponentRequest = null;
    yesWait = null;
    requestedGift = null;
    generation++; piles.reset(); startingPlayer = null; OpponentStrategies.clearTrace();
    state = { pile: [], hands: { human: [], wendy: [] }, sets: { human: [], wendy: [] }, copies: config.rules.copiesPerType, finished: false };
    phase = 'pickStarter'; displayedTurn = null; reported = false; selected = null;
    overlayOpen = false; el('overlay').hidden = true; el('table').inert = false;
    el('message').style.visibility = ''; el('message').classList.remove('speech-request', 'yes-answer', 'waiting-breath');
    el('centerCircle').replaceChildren();
    document.querySelectorAll('.stationary-speech, .flying-candy, .flying-token').forEach(node => node.remove());
    render();
  }
  async function spinStarter() {
    if (phase !== 'pickStarter' || overlayOpen) return;
    startingPlayer = Math.random() < .5 ? 'human' : 'wendy';
    phase = 'spinningStarter'; render();
    const token = generation, dish = el('centerCircle').querySelector('img');
    const target = 360 * 7 + (startingPlayer === 'human' ? 180 : 0);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduced ? 80 : 3700;
    const animation = dish.animate(reduced ? [{ opacity: .7 }, { opacity: 1 }] : [
      { transform: 'rotate(0deg)', offset: 0, easing: 'cubic-bezier(.65,0,1,1)' },
      { transform: 'rotate(180deg)', offset: .2, easing: 'linear' },
      { transform: 'rotate(' + (target - 640) + 'deg)', offset: .58, easing: 'cubic-bezier(0,0,.2,1)' },
      { transform: 'rotate(' + (target + 18) + 'deg)', offset: .86, easing: 'ease-in-out' },
      { transform: 'rotate(' + (target - 9) + 'deg)', offset: .92, easing: 'ease-in-out' },
      { transform: 'rotate(' + (target + 4) + 'deg)', offset: .97, easing: 'ease-out' },
      { transform: 'rotate(' + target + 'deg)', offset: 1 }
    ], { duration, fill: 'forwards' });
    if (!await playVisual(animation, duration, token)) return;
    dish.style.transform = 'rotate(' + (startingPlayer === 'human' ? 180 : 0) + 'deg)'; animation.cancel();
    phase = 'starterReady'; render();
  }
  function dealGame() {
    if (phase !== 'starterReady' || overlayOpen) return;
    state = CandyEngine.create(config); state.turn = startingPlayer;
    memory = OpponentStrategies.createMemory('wendy');
    OpponentStrategies.initializeMemory(memory, state.hands.wendy, state.hands.human.length);
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
    el('gameOverReason').textContent = 'Game over because ' + reason;
    el('gameOverRemaining').hidden = state.reason !== 'emptyHand';
    el('gameOverRemaining').textContent = 'Candy Dish had ' + remaining + ' left.';
    el('gameOverScore').textContent = humanName + ' had ' + state.sets.human.length + (state.sets.human.length === 1 ? ' candy set; ' : ' candy sets; ') + opponentName + ' had ' + state.sets.wendy.length + '.';
    candyRain.start(3000);
  }
  function showDialog(title, body, action, callback) {
    el('overlay').classList.remove('celebrating', 'rules');
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
    el('message').classList.remove('speech-request', 'yes-answer', 'waiting-breath');
    if (state.finished) { finishGame(); return; }
    displayedTurn = state.turn; selected = null;
    if (state.turn === 'human') { phase = 'choose'; render(); return; }
    phase = 'thinking'; render();
    if (!await waitActive(config.appearance.thinkingMs, token)) return;
    // Read the selected profile only when making a new decision. In-flight asks keep their type.
    const decisionView = OpponentStrategies.publicView(state, 'wendy', memory, config.candies.map(candy => candy.id));
    decisionView.actorName = opponentName;
    selected = OpponentStrategies.choose(config.players.wendy.strategy || 'beginner', decisionView);
    setMessageSpeaker('wendy');
    requestedGift = CandyEngine.count(state.hands.human, selected) ? { token, type: selected, released: false } : null;
    phase = 'wendyRequest'; el('message').textContent = opponentName + ' asks for ' + byId.get(selected).shortName + '.'; render();
    const holdMs = CandyEngine.count(state.hands.human, selected) ? config.appearance.requestGiveHoldMs : config.appearance.requestHoldMs;
    const keepRequest = !CandyEngine.count(state.hands.human, selected);
    if (!await presentSpeech('', token, holdMs, keepRequest, false, selected)) return;
    await resolveRequest('wendy', selected, token);
  }
  async function resolveRequest(actor, type, token) {
    let heldQuestion = null;
    phase = actor === 'human' ? 'requesting' : 'wendyRequest'; render();
    const giver = actor === 'human' ? 'wendy' : 'human';
    if (CandyEngine.count(state.hands[giver], type) && !giftShortcutUsed(token)) {
      if (actor === 'wendy') {
        heldQuestion = document.createElement('button');
        heldQuestion.type = 'button';
        heldQuestion.dataset.speaker = 'wendy';
        heldQuestion.id = 'heldOpponentQuestion'; heldQuestion.className = 'speech-request';
        fillRequestBubble(heldQuestion, opponentName, type);
        heldQuestion.addEventListener('click', acknowledgeMiddle);
        heldQuestion.disabled = true;
        el('message').parentElement.append(heldQuestion);
      }
      if (!await presentSpeech('Yes I do', token, 0, true, false, null, false, giver)) return;
      const waiting = { token, released: giftShortcutUsed(token) };
      yesWait = waiting;
      const reply = document.createElement('button');
      reply.id = 'yesReply'; reply.type = 'button';
      reply.setAttribute('aria-label', config.players[giver].name + ' says: Yes I do. Acknowledge the transfer');
      reply.append(...el('message').childNodes); el('message').append(reply);
      render();
      const acknowledgeMs = config.appearance.yesAutoTransferMs;
      if (!await waitActive(acknowledgeMs, token, () => waiting.released)) return;
      yesWait = null;
      updateMiddleControls();
    }
    requestedGift = null;
    const transferringCard = state.hands[giver].find(card => card.type === type);
    const pileFlight = transferringCard ? piles.begin(transferringCard, actor === 'human' ? el('wendyPile') : el('human-' + type)) : null;
    const events = CandyEngine.request(state, actor, type); OpponentStrategies.observe(memory, events, state.copies);
    const transfer = events.find(event => event.kind === 'transfer');
    if (transfer) {
      setMessageSpeaker(actor === 'human' ? 'wendy' : 'human');
      const source = actor === 'human' ? el('wendyPile') : el('human-' + type);
      const destination = actor === 'human' ? el('human-' + type) : el('wendyPile');
      piles.render(state);
      const flight = fly(type, pileFlight.source, piles.destination(transferringCard, destination), false, token);
      retainedPlayerRequest = null;
      el('askButton').hidden = true;
      heldQuestion?.remove();
      el('message').replaceChildren(); el('message').classList.remove('speech-request', 'yes-answer', 'waiting-breath'); el('message').style.visibility = '';
      if (!await flight) return;
      piles.finish(); render();
      const completed = events.find(event => event.kind === 'set');
      if (completed) { if (!await celebrateSet(completed, token)) return; }
      else if (!await waitActive(650, token)) return;
      proceed(token);
    } else if (state.pending) {
      if (actor === 'human') {
        retainedPlayerRequest = type;
        phase = 'fishResponse'; render();
        if (!await presentSpeech('', token, 0, true, false, null, true)) return;
        phase = 'humanFishWait'; render();
        return;
      }
      retainedOpponentRequest = type;
      phase = 'fishResponse'; render();
      if (!await presentSpeech('', token, 0, true, false, null, true, 'human')) return;
      phase = 'wendyFishWait'; render();
    } else {
      el('message').textContent = 'No match, and the pile is empty. Turn passes.'; render();
      if (await waitActive(1100, token)) proceed(token);
    }
  }
  async function drawCandy() {
    if (overlayOpen || !['humanFishWait', 'wendyFishWait'].includes(phase)) return;
    const token = generation, actor = state.pending.actor;
    retainedPlayerRequest = null;
    retainedOpponentRequest = null;
    el('message').classList.remove('speech-request', 'yes-answer', 'waiting-breath');
    phase = 'drawing'; render();
    setMessageSpeaker(actor);
    const drawingCard = state.pile[0];
    const pileFlight = piles.begin(drawingCard, el('centerCircle'));
    const events = CandyEngine.fish(state), draw = events[0]; OpponentStrategies.observe(memory, events, state.copies);
    el('message').textContent = actor === 'human' ? 'You drew ' + byId.get(draw.type).shortName + '.' : '';
    piles.render(state);
    const destination = actor === 'human' ? el('human-' + draw.type) : el('wendyPile');
    if (!await fly(draw.type, pileFlight.source, piles.destination(drawingCard, destination), actor === 'wendy', token, actor === 'wendy' ? pileFlight.candy : null)) return;
    piles.finish(); render();
    const completed = events.find(event => event.kind === 'set');
    if (completed) { if (!await celebrateSet(completed, token)) return; }
    else if (!await waitActive(1100, token)) return;
    proceed(token);
  }
  el('askButton').addEventListener('click', () => {
    if (middleAcknowledgementReady()) { acknowledgeMiddle(); return; }
    if (phase !== 'choose' || !selected || overlayOpen) return;
    sendPlayerRequest(selected, generation);
  });
  el('centerCircle').addEventListener('click', acknowledgeMiddle);
  el('fishButton').addEventListener('click', acknowledgeMiddle);
  el('message').addEventListener('click', acknowledgeMiddle);
  el('message').addEventListener('keydown', event => {
    if (event.target === el('message') && ['Enter', ' '].includes(event.key) && (middleAcknowledgementReady() || openingPhase())) {
      event.preventDefault(); acknowledgeMiddle();
    }
  });
  async function replayAfterRain() {
    if (phase !== 'finished' || restarting) return;
    restarting = true;
    const token = generation;
    el('gameOverNew').disabled = true; el('gameOverNew').querySelector('span').textContent = 'Finishing…';
    el('newGame').disabled = true;
    await candyRain.drain();
    if (token === generation) startGame();
  }
  el('gameOverNew').addEventListener('click', replayAfterRain);
  function switchOpponent(direction) {
    if (overlayOpen || phase === 'finished' || opponents.length < 2) return;
    const previousName = opponentName;
    opponentIndex = (opponentIndex + direction + opponents.length) % opponents.length;
    Object.assign(config.players.wendy, opponents[opponentIndex]);
    opponentName = config.players.wendy.name;
    document.querySelector('.wendy-portrait .portrait-name').textContent = (config.players.wendy.displayName || opponentName).toUpperCase();
    const portrait = document.querySelector('.wendy-portrait .portrait');
    portrait.src = './assets/' + config.players.wendy.portrait; portrait.alt = opponentName;
    el('wendySlots').setAttribute('aria-label', opponentName + "'s completed sets");
    // Rename existing speech in place without rebuilding piles or interrupting motion.
    for (const host of document.querySelectorAll('#message, #askButton, #fishButton, #heldOpponentQuestion, .stationary-speech')) {
      const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) walker.currentNode.textContent = walker.currentNode.textContent.replaceAll(previousName, opponentName).replaceAll(previousName.toUpperCase(), opponentName.toUpperCase());
    }
    for (const node of document.querySelectorAll('[aria-label]')) {
      node.setAttribute('aria-label', node.getAttribute('aria-label').replaceAll(previousName, opponentName));
    }
  }
  el('opponentPrevious').addEventListener('click', () => switchOpponent(-1));
  el('opponentNext').addEventListener('click', () => switchOpponent(1));
  function switchPlayerCharacter(direction) {
    if (overlayOpen || phase === 'finished' || playerCharacters.length < 2) return;
    const previousName = humanName;
    playerCharacterIndex = (playerCharacterIndex + direction + playerCharacters.length) % playerCharacters.length;
    Object.assign(config.players.human, playerCharacters[playerCharacterIndex]);
    humanName = config.players.human.name;
    document.querySelector('.player-portrait .portrait-name').textContent = humanName.toUpperCase();
    const portrait = document.querySelector('.player-portrait .portrait');
    portrait.src = './assets/' + config.players.human.portrait; portrait.alt = humanName;
    for (const host of document.querySelectorAll('#message, #askButton, #fishButton, #heldOpponentQuestion, .stationary-speech')) {
      const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) walker.currentNode.textContent = walker.currentNode.textContent.replaceAll(previousName, humanName).replaceAll(previousName.toUpperCase(), humanName.toUpperCase());
    }
    for (const node of document.querySelectorAll('[aria-label]')) {
      node.setAttribute('aria-label', node.getAttribute('aria-label').replaceAll(previousName, humanName));
    }
  }
  el('playerPrevious').addEventListener('click', () => switchPlayerCharacter(-1));
  el('playerNext').addEventListener('click', () => switchPlayerCharacter(1));
  el('dialogAction').addEventListener('click', () => closeAction());
  el('overlay').addEventListener('click', event => {
    if (event.target === el('overlay') && el('overlay').classList.contains('celebrating')) closeAction();
  });
  el('rulesButton').addEventListener('click', () => { if (restarting) return; showDialog('How to play',
    '<p><b>Your turn:</b> Select a candy you hold to request a matching one.</p>' +
    '<p>If the other player has it, you get one of theirs and ask again. If not, <b>GO FISH!</b> Tap the Candy Dish to draw one candy.</p>' +
    '<p class="rule-emphasis"><strong>YOUR TURN ENDS WHEN YOU HAVE TO GO FISH, FOR ANY REASON.</strong><br>Even if you draw a match!</p>' +
    '<p>Collect sets of <b>' + state.copies + ' matching candies</b>.</p>' +
    '<p class="rule-emphasis"><strong>THE GAME ENDS WHEN EITHER PLAYER OR THE CANDY DISH RUNS OUT OF CANDY.</strong></p>' +
    '<p><b>Most sets wins!</b></p>', 'Back to the table', () => { overlayOpen = false; el('overlay').hidden = true; el('table').inert = false; render(); el('rulesButton').focus(); });
    el('overlay').classList.add('rules');
  });
  el('newGame').addEventListener('click', () => {
    if (phase === 'finished') { replayAfterRain(); return; }
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
  buildSlots();
  addEventListener('pagehide', () => candyRain.stop());
  startGame();
  showDialog('GO FISH!', el('dialogBody').innerHTML, "Let's play", startGame);
  const welcomeSubtitle = document.createElement('span');
  welcomeSubtitle.className = 'welcome-subtitle'; welcomeSubtitle.textContent = 'Candy Edition!';
  el('dialogTitle').append(welcomeSubtitle);
  el('overlay').classList.add('welcoming');
})();
