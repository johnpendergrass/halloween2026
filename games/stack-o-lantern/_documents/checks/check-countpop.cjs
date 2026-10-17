/* Start screen with the goal line shown; then a few drops, catching the
   count pop mid-flight; then that the pops remove themselves. */
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 650 }, isMobile: true, hasTouch: true });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:8098/games/stack-o-lantern/index.html');
    await page.waitForTimeout(1700);
    const out = {};
    out.startLayout = await page.evaluate(() => {
      const vw = innerWidth / 100; const top = document.getElementById('stage').getBoundingClientRect().top;
      const box = (sel) => { const r = document.querySelector(sel).getBoundingClientRect(); return [+((r.top - top) / vw).toFixed(1), +((r.bottom - top) / vw).toFixed(1)]; };
      return { lines: box('#startScreen p.text-medium'), goal: box('#goalLine'), goalShown: document.getElementById('goalLine').className, hint: box('#startScreen .hint') };
    });
    await page.screenshot({ path: path.join(__dirname, 'countpop-start.png') });
    await page.evaluate(() => {
      window.__tap = () => document.getElementById('stage').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      window.__dropWhen = (test) => new Promise((resolve) => {
        function poll() {
          const slabs = [...document.querySelectorAll('#tower .slab')]
            .map(s => ({ left: parseFloat(s.style.left), bottom: parseFloat(s.style.bottom) }))
            .sort((a, b) => b.bottom - a.bottom);
          if (test(Math.abs(slabs[0].left - slabs[1].left))) { window.__tap(); resolve(); return; }
          requestAnimationFrame(poll);
        }
        requestAnimationFrame(poll);
      });
    });
    await page.evaluate(() => window.__tap());
    for (let i = 0; i < 3; i++) { await page.evaluate(() => window.__dropWhen(d => d <= 3)); await page.waitForTimeout(100); }
    await page.evaluate(() => window.__dropWhen(d => d <= 3));
    await page.waitForTimeout(180);
    out.midFlight = await page.evaluate(() => [...document.querySelectorAll('.count-pop')].map(p => ({ text: p.textContent, left: p.style.left, bottom: p.style.bottom, opacity: getComputedStyle(p).opacity })));
    await page.screenshot({ path: path.join(__dirname, 'countpop-flight.png') });
    await page.waitForTimeout(900);
    out.afterFlight = await page.evaluate(() => document.querySelectorAll('.count-pop').length);
    out.stacked = await page.evaluate(() => stackedCount());
    out.errors = errors;
    console.log(JSON.stringify(out));
  } finally { await browser.close(); }
})();
