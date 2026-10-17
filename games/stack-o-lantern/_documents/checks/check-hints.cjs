/* Moon hints check: a bubble appears on the start screen, changes, stops
   when a round starts, and returns on the end screen. */
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 693 }, isMobile: true, hasTouch: true });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:8098/games/stack-o-lantern/index.html');
    const read = () => page.evaluate(() => { const b = document.getElementById('goalLine'); return (b.classList.contains('is-shown') ? 'SHOWN: ' : 'faded: ') + b.textContent; });
    const out = { atLoad: await read() };
    await page.waitForTimeout(2200);
    out.first = await read();
    await page.screenshot({ path: path.join(__dirname, 'hints-start.png') });
    await page.waitForTimeout(5000);
    out.second = await read();
    await page.evaluate(() => document.getElementById('stage').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
    await page.waitForTimeout(200);
    out.afterStart = await read();
    await page.waitForTimeout(3000);
    out.midRound = await read();
    // miss on purpose: tap repeatedly at a wide offset
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => new Promise((resolve) => {
        function poll() {
          const slabs = [...document.querySelectorAll('#tower .slab')].map(s => ({ left: parseFloat(s.style.left), bottom: parseFloat(s.style.bottom) })).sort((a, b) => b.bottom - a.bottom);
          if (Math.abs(slabs[0].left - slabs[1].left) > 25) { document.getElementById('stage').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); resolve(); return; }
          requestAnimationFrame(poll);
        }
        requestAnimationFrame(poll);
      }));
      await page.waitForTimeout(150);
      if (await page.evaluate(() => document.getElementById('reaction').textContent.includes('SPLAT'))) break;
    }
    await page.waitForTimeout(1000 + 1800);
    out.endScreen = await read();
    await page.screenshot({ path: path.join(__dirname, 'hints-end.png') });
    out.errors = errors;
    console.log(JSON.stringify(out, null, 1));
  } finally { await browser.close(); }
})();
