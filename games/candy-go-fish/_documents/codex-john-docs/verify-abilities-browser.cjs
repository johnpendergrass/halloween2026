const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const config = require('../../assets/json/game-config.json');
const startRound = require('./start-round.cjs');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    for (const copies of [3, 4]) for (const profile of [0, 1, 2]) {
      const page = await browser.newPage({ viewport: { width: 338, height: 526 }, reducedMotion: 'reduce' });
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      const testConfig = structuredClone(config); testConfig.rules.copiesPerType = copies;
      Object.assign(testConfig.appearance, { thinkingMs: 40, quoteFadeMs: 40, quoteHoldMs: 40, playerRequestHoldMs: 40 });
      await page.route('**/game-config.json*', route => route.fulfill({ json: testConfig }));
      await page.goto('http://127.0.0.1:8098/games/candy-go-fish/index.html');
      await page.locator('#overlay.welcoming #dialogAction').click();
      await page.locator('.opening-action').waitFor();
      await page.evaluate(() => {
        const create = CandyEngine.create;
        CandyEngine.create = config => {
          const state = create(config), pool = [...state.pile, ...state.hands.human, ...state.hands.wendy];
          const types = config.candies.map(candy => candy.id);
          function hand(indices) { return indices.map(i => pool.splice(pool.findIndex(card => card.type === types[i]), 1)[0]); }
          state.hands.wendy = hand([0, 0, 1, 1, 2]); state.hands.human = hand([3, 3, 4, 4, 5]);
          state.pile = pool; state.turn = 'wendy'; state.sets = { human: [], wendy: [] }; state.finished = false;
          return window.abilityState = state;
        };
      });
      for (let i = 0; i < profile; i++) await page.locator('#opponentNext').click();
      await startRound(page, 'wendy');
      await page.waitForFunction(() => JSON.parse(document.querySelector('#opponentDecisionTrace').textContent).decisions.length === 1);
      const trace = JSON.parse(await page.locator('#opponentDecisionTrace').textContent()).decisions[0];
      assert.equal(trace.strategy, ['beginner', 'medium', 'expert'][profile]);
      assert.equal(trace.copiesPerType, copies);
      if (profile === 2) { assert.equal(trace.method, 'temporal public-evidence probabilities'); assert.equal(trace.particles, 1024); }
      await page.locator('#fishButton:not(:disabled)').waitFor();
      const before = await page.evaluate(() => JSON.stringify(abilityState));
      await page.locator('#opponentNext').click();
      assert.equal(await page.evaluate(() => JSON.stringify(abilityState)), before, 'Changing persona must preserve the pending request');
      await page.locator('#centerCircle').click();
      await page.locator('#humanSlots .slot.available').first().waitFor();
      const missType = await page.evaluate(() => abilityState.hands.human.find(card => !abilityState.hands.wendy.some(other => other.type === card.type)).type);
      await page.locator('#human-' + missType).click();
      await page.locator('#fishButton[data-speaker="wendy"]:not(:disabled)').waitFor();
      await page.locator('#centerCircle').click();
      await page.waitForFunction(() => JSON.parse(document.querySelector('#opponentDecisionTrace').textContent).decisions.length >= 2);
      const next = JSON.parse(await page.locator('#opponentDecisionTrace').textContent()).decisions[1];
      assert.equal(next.strategy, ['medium', 'expert', 'beginner'][profile], 'The next decision must use the new strategy');
      assert.deepEqual(errors, []); await page.close();
    }
    console.log('Live Ron/Harry/Hermione decisions and in-flight/next-decision switching passed for triples and quadruples.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
