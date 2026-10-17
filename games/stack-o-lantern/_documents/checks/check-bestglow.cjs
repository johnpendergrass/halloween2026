/* The bar without Stacked, the end word's new place, and the Best glow:
   round one (best 0 -> n) must not glow; a round that beats it must,
   and the glow must go when the next round starts. */
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 650 }, isMobile: true, hasTouch: true });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:8098/games/stack-o-lantern/index.html');
    await page.waitForTimeout(300);
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
      window.__round = async (goodDrops) => {
        for (let i = 0; i < goodDrops; i++) { await window.__dropWhen(d => d <= 3); await new Promise(r => setTimeout(r, 100)); }
        for (let i = 0; i < 12 && state.phase === 'playing'; i++) { await window.__dropWhen(d => d > 25); await new Promise(r => setTimeout(r, 150)); }
      };
    });
    const out = {};
    out.bar = await page.evaluate(() => [...document.querySelectorAll('.info-bar > *')].map(e => e.tagName + ':' + e.textContent.trim()));
    out.toggleCentre = await page.evaluate(() => { const r = document.getElementById('modeSwitch').getBoundingClientRect(); return +((r.left + r.right) / 2 / innerWidth * 100).toFixed(1); });
    const glow = () => page.evaluate(() => document.getElementById('bestBox').className + ' | best ' + document.getElementById('best').textContent);
    // Round 1: 3 good drops then a miss. Best 0 -> 3: no glow.
    await page.evaluate(() => window.__tap());
    await page.evaluate(() => window.__round(3));
    await page.waitForTimeout(1500);
    out.round1 = await glow();
    out.endWordTop = await page.evaluate(() => { const vw = innerWidth / 100; const top = document.getElementById('stage').getBoundingClientRect().top; const r = document.getElementById('endWord').getBoundingClientRect(); const h = document.getElementById('modeHint'); h.hidden = false; h.textContent = 'HARD mode: line the edges up within a hair.'; const hr = h.getBoundingClientRect(); return { word: +((r.top - top) / vw).toFixed(1), hintBottom: +((hr.bottom - top) / vw).toFixed(1) }; });
    await page.screenshot({ path: path.join(__dirname, 'bestglow-end1.png') });
    await page.evaluate(() => { document.getElementById('modeHint').hidden = true; });
    // Round 2: 5 good drops. Best 3 -> 5: glow.
    await page.locator('#playAgain').tap();
    await page.waitForTimeout(200);
    out.round2start = await glow();
    await page.evaluate(() => window.__round(5));
    await page.waitForTimeout(1500);
    out.round2 = await glow();
    await page.screenshot({ path: path.join(__dirname, 'bestglow-end2.png') });
    // Round 3 starts: the glow goes. 2 good drops, no new best.
    await page.locator('#playAgain').tap();
    await page.waitForTimeout(200);
    out.round3start = await glow();
    await page.evaluate(() => window.__round(2));
    await page.waitForTimeout(1500);
    out.round3 = await glow();
    out.milestonesTop = await page.evaluate(() => { const vw = innerWidth / 100; const top = document.getElementById('stage').getBoundingClientRect().top; const m = document.getElementById('endMilestones'); m.hidden = false; const r = m.getBoundingClientRect(); const c = document.getElementById('endCompare').getBoundingClientRect(); return { compareBottom: +((c.bottom - top) / vw).toFixed(1), milestones: +((r.top - top) / vw).toFixed(1) }; });
    out.errors = errors;
    console.log(JSON.stringify(out, null, 1));
  } finally { await browser.close(); }
})();
