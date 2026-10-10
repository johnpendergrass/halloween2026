const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const config = require('../assets/json/game-config.json');
async function redVinesDeal(page, opponentHasCandy) {
  await page.evaluate(hasCandy => {
    const create = CandyEngine.create;
    CandyEngine.create = (...args) => {
      const state = create(...args);
      if (!CandyEngine.count(state.hands.human, 'redVines')) {
        const index = state.pile.findIndex(card => card.type === 'redVines');
        [state.hands.human[0], state.pile[index]] = [state.pile[index], state.hands.human[0]];
      }
      if (hasCandy && !CandyEngine.count(state.hands.wendy, 'redVines')) {
        const index = state.pile.findIndex(card => card.type === 'redVines');
        [state.hands.wendy[0], state.pile[index]] = [state.pile[index], state.hands.wendy[0]];
      } else if (!hasCandy) {
        state.hands.wendy.forEach((card, index) => {
          if (card.type !== 'redVines') return;
          const other = state.pile.findIndex(item => item.type !== 'redVines');
          [state.hands.wendy[index], state.pile[other]] = [state.pile[other], state.hands.wendy[index]];
        });
      }
      return state;
    };
  }, opponentHasCandy);
}
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 338, height: 526 } });
    const fast = structuredClone(config);
    Object.assign(fast.appearance, { requestSpeechMs: 300, giftTravelMs: 300, giftPulseMs: 80, playerRequestHoldMs: 60000 });
    await page.route('**/game-config.json', route => route.fulfill({ json: fast }));
    await page.addInitScript(() => {
      Math.random = () => 0.1;
      const timeout = window.setTimeout;
      window.setTimeout = (callback, ms, ...args) => timeout(callback,
        ms === 40 && document.querySelector('.flying-speech') ? 170 : ms, ...args);
      window.speechRedraws = [];
      window.finishedAnimationReplays = [];
      const play = Animation.prototype.play;
      Animation.prototype.play = function (...args) {
        const node = this.effect?.target;
        if (this.playState === 'finished' && node?.matches('.flying-speech, .flying-candy, .flying-token')) window.finishedAnimationReplays.push(node.className);
        return play.apply(this, args);
      };
      window.handoffFlashes = []; window.handoffFrames = 0;
      let outgoingSeen = false;
      const sample = () => {
        const outgoing = document.querySelector('.player-request-flight');
        if (outgoing) outgoingSeen = true;
        const reply = document.querySelector('.flying-speech:not(.player-request-flight)');
        if (outgoingSeen && (outgoing || reply)) {
          window.handoffFrames++;
          const button = document.querySelector('#askButton'), message = document.querySelector('#message');
          if (!button.hidden && button.childElementCount && (outgoing || !reply?.classList.contains('go-fish-reply'))) window.handoffFlashes.push('Original question reappeared');
          if (reply && !message.hidden && getComputedStyle(message).visibility === 'visible' && message.classList.contains('speech-request')) window.handoffFlashes.push('Stationary reply shown before arrival');
        }
        requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
      const cancel = Animation.prototype.cancel;
      Animation.prototype.cancel = function (...args) {
        const node = this.effect?.target;
        const result = cancel.apply(this, args);
        if (node?.isConnected && node.classList.contains('flying-speech')) {
          window.speechRedraws.push({ opacity: Number(getComputedStyle(node).opacity), text: node.textContent });
        }
        return result;
      };
    });
    await page.goto('http://127.0.0.1:8098/games/candy-go-fish/index.html');
    await page.locator('#humanSlots .slot').last().waitFor();
    await redVinesDeal(page, false);
    await page.locator('#dialogAction').click();
    await page.locator('#human-redVines').click();
    await page.locator('#askButton').click();
    await page.locator('.player-request-flight').waitFor();
    await page.evaluate(() => {
      // Mimic a slow timer while the compositor completes the animation.
      const until = performance.now() + 500;
      while (performance.now() < until) {}
    });
    await page.waitForFunction(() => !document.querySelector('#centerCircle').disabled);
    const first = await page.evaluate(() => window.speechRedraws);
    assert.deepEqual(await page.evaluate(() => window.finishedAnimationReplays), [], 'A completed animation must never be played again after a timer delay');
    console.log('Speech cancel snapshots:', JSON.stringify(first));
    assert(first.every(frame => frame.opacity === 0), 'Animation cancellation must not reveal an opaque unanimated bubble');
    assert(await page.evaluate(() => window.handoffFrames > 0));
    assert.deepEqual(await page.evaluate(() => window.handoffFlashes), [], 'No original question or stationary reply flashes during the handoff');
    await page.reload();
    await page.locator('#humanSlots .slot').last().waitFor();
    await redVinesDeal(page, true);
    await page.locator('#dialogAction').click();
    await page.locator('#human-redVines').click();
    await page.locator('#askButton').click();
    await page.locator('.flying-candy').waitFor();
    assert.equal(await page.locator('.flying-speech').count(), 0);
    const second = await page.evaluate(() => window.speechRedraws);
    assert.deepEqual(await page.evaluate(() => window.finishedAnimationReplays), [], 'Incoming replies must not restart when timers lag');
    assert(second.every(frame => frame.opacity === 0), 'Yes reply must not flash back after dissolving');
    assert.deepEqual(await page.evaluate(() => window.handoffFlashes), []);
    await page.reload();
    await page.locator('#humanSlots .slot').last().waitFor();
    await page.evaluate(() => {
      const create = CandyEngine.create;
      CandyEngine.create = (...args) => { const state = create(...args); state.turn = 'wendy'; return state; };
    });
    await page.locator('#dialogAction').click();
    await page.locator('.flying-speech').waitFor();
    await page.locator('.flying-speech').waitFor({ state: 'detached' });
    assert.deepEqual(await page.evaluate(() => window.finishedAnimationReplays), [], 'Wendy question must stay settled instead of restarting');
    assert(await page.locator('#message.speech-request').isVisible());
    console.log('Red Vines question handoffs to both Nope and Yes replies passed frame-by-frame DOM visibility checks.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
