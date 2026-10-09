// Run with Node; uses the bundled Playwright package and installed Chrome.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const gameRoot = path.resolve(__dirname, '..');
const gameData = JSON.parse(fs.readFileSync(path.join(gameRoot, 'assets/gamedata02.json'), 'utf8'));
const itemById = new Map(gameData.items.map(item => [item.id, item]));
const url = 'http://localhost:8097/games/candy-swap/touch-preview.html';

function expectedScores(candies) {
  return gameData.characters.map(character => candies.filter(candy => candy.owner === character.id).reduce((total, candy) => {
    const item = itemById.get(candy.id);
    return total + 1 + character.preferences.reduce((adjustment, preference) => adjustment + (item.attributes.includes(preference.attribute) ? gameData.rules.preferenceWeights[preference.level] : 0), 0);
  }, 0));
}

async function snapshot(frame) {
  return frame.evaluate(() => ({
    candies: [...document.querySelectorAll('.candy')].map(button => ({ owner: button.dataset.owner, id: button.dataset.itemId })),
    scores: [...document.querySelectorAll('.satisfaction')].map(score => Number(score.textContent)),
    selected: document.querySelectorAll('.candy.selected').length,
    popups: document.querySelectorAll('.candy-info').length
  }));
}

async function checkScores(page, frame) {
  const state = await snapshot(frame);
  assert.deepEqual(state.scores, expectedScores(state.candies));
  const total = state.scores.reduce((sum, value) => sum + value, 0);
  await page.waitForFunction(total => document.getElementById('totalScore').textContent === 'Total score: ' + total, total);
  return state;
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    let frame = page.frames()[1];
    await frame.locator('.candy').last().waitFor();
    const before = await checkScores(page, frame);
    const edgeValues = await frame.evaluate(() => ({
      neutral: itemValue({ preferences: [] }, { attributes: ['toy'] }),
      dislike: itemValue({ preferences: [{ attribute: 'peanut', level: 'dislike' }] }, { attributes: ['peanut'] }),
      strongDislike: itemValue({ preferences: [{ attribute: 'peanut', level: 'strongDislike' }] }, { attributes: ['peanut'] }),
      strongLike: itemValue({ preferences: [{ attribute: 'sour', level: 'favorite' }] }, { attributes: ['sour'] }),
      empty: characterScore(99)
    }));
    assert.deepEqual(edgeValues, { neutral: 1, dislike: 0, strongDislike: -1, strongLike: 3, empty: 0 });
    assert.equal(before.candies.length, 24);
    for (const character of gameData.characters) assert.equal(before.candies.filter(candy => candy.owner === character.id).length, 6);
    const candy = index => frame.locator('.candy').nth(index);

    await candy(0).tap();
    assert.equal((await snapshot(frame)).popups, 1);
    await candy(1).tap();
    assert.equal((await snapshot(frame)).selected, 1, 'same owner replaces selection');
    await candy(1).tap();
    assert.equal((await snapshot(frame)).selected, 0, 'tap again deselects');
    await candy(0).tap();
    await candy(6).tap();
    assert.equal((await snapshot(frame)).popups, 2);
    await frame.locator('#compareNo').tap();
    assert.equal((await snapshot(frame)).selected, 0);
    assert.deepEqual((await snapshot(frame)).candies, before.candies);

    await candy(0).tap();
    await candy(6).tap();
    await frame.locator('#compareYes').tap();
    assert.equal((await snapshot(frame)).popups, 0);
    const predicted = await frame.locator('.compare-score').evaluateAll(nodes => nodes.map(node => Number(node.dataset.after)));
    const hypothetical = before.candies.map(candy => ({ ...candy }));
    [hypothetical[0].id, hypothetical[6].id] = [hypothetical[6].id, hypothetical[0].id];
    assert.deepEqual(predicted, expectedScores(hypothetical).slice(0, 2));
    await page.screenshot({ path: path.join(__dirname, 'swap-comparison-390.png') });
    await frame.locator('#comparisonOverlay').tap({ position: { x: 2, y: 2 } });
    assert.equal((await snapshot(frame)).selected, 0);
    assert.deepEqual((await snapshot(frame)).candies, before.candies, 'outside tap cancels without swapping');

    await candy(0).tap();
    await candy(6).tap();
    await frame.locator('#compareYes').tap();
    await frame.locator('#swapNo').tap();
    assert.deepEqual((await snapshot(frame)).candies, before.candies, 'NO cancels without swapping');
    await candy(0).tap();
    await candy(6).tap();
    await frame.locator('#compareYes').tap();
    await frame.locator('#swapYes').tap();
    const after = await checkScores(page, frame);
    assert.deepEqual(after.candies, hypothetical);
    assert.equal(after.selected, 0);
    assert.equal(after.popups, 0);
    await page.screenshot({ path: path.join(__dirname, 'swap-board-390.png') });

    for (const size of [{ width: 375, height: 667 }, { width: 1920, height: 1080 }]) {
      await page.setViewportSize(size);
      await page.goto(url);
      frame = page.frames()[1];
      await frame.locator('.candy').last().waitFor();
      await checkScores(page, frame);
      await candy(0).tap();
      await candy(6).tap();
      await frame.locator('#compareYes').tap();
      const geometry = await frame.evaluate(() => {
        const panel = document.getElementById('comparisonPanel');
        const rect = panel.getBoundingClientRect();
        return { overflow: panel.scrollHeight > panel.clientHeight || panel.scrollWidth > panel.clientWidth,
          childrenOutside: [...panel.children].some(child => { const r = child.getBoundingClientRect(); return r.top < rect.top || r.bottom > rect.bottom; }),
          preferencesOverflow: [...document.querySelectorAll('.preferences')].some(e => e.scrollWidth > e.clientWidth || e.scrollHeight > e.clientHeight) };
      });
      assert.deepEqual(geometry, { overflow: false, childrenOutside: false, preferencesOverflow: false }, 'layout at ' + size.width);
      await page.screenshot({ path: path.join(__dirname, 'swap-comparison-' + size.width + '.png') });
    }
    // Deliberately long names with three attributes test the panel's maximum text load.
    const fixture = structuredClone(gameData);
    fixture.items = [{ ...fixture.items.find(item => item.id === 'reeses'), attributes: ['chocolate', 'peanut', 'crunchy'] }];
    await page.route('**/assets/gamedata02.json', route => route.fulfill({ json: fixture }));
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(url);
    frame = page.frames()[1];
    await frame.locator('.candy').last().waitFor();
    await candy(0).tap();
    await candy(6).tap();
    await frame.locator('#compareYes').tap();
    assert.equal(await frame.locator('#comparisonPanel').evaluate(e => e.scrollHeight > e.clientHeight || e.scrollWidth > e.clientWidth), false, 'long names / three attributes fit');
    await page.screenshot({ path: path.join(__dirname, 'swap-comparison-long-labels.png') });
    assert.deepEqual(errors, []);
    console.log('PASS: random deal, base +1 and preference scoring, total, selection changes, both NO paths, outside cancellation, comparison prediction, actual swap, and phone/desktop layouts.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
