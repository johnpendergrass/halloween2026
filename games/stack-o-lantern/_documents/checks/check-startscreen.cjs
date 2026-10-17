/* Start screen check (2026-10-17): the moon glows there, the goal line
   is subdued, "Tap anywhere to start" is bigger and bold; a tap takes
   the glow off. Screenshot. Needs the no-cache server on 8098. */
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 650 }, isMobile: true, hasTouch: true });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:8098/games/stack-o-lantern/index.html');
    await page.waitForTimeout(1800);   // the first goal line is up
    const out = await page.evaluate(() => {
      const hint = document.querySelector('#startScreen .hint');
      const goal = document.getElementById('goalLine');
      return {
        glowing: document.getElementById('stage').classList.contains('is-glowing'),
        moonShadow: getComputedStyle(document.getElementById('moon')).boxShadow.slice(0, 50),
        hint: { text: hint.textContent, font: getComputedStyle(hint).fontSize, weight: getComputedStyle(hint).fontWeight },
        goal: { text: goal.textContent, opacity: getComputedStyle(goal).opacity },
      };
    });
    await page.screenshot({ path: path.join(__dirname, 'startscreen.png') });
    await page.evaluate(() => document.getElementById('stage').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
    await page.waitForTimeout(100);
    out.afterTap = await page.evaluate(() => ({ glowing: document.getElementById('stage').classList.contains('is-glowing'), phase: state.phase }));
    out.errors = errors;
    console.log(JSON.stringify(out, null, 1));
  } finally { await browser.close(); }
})();
