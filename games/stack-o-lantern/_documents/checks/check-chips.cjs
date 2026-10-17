/* End-screen chips check: play to a few milestones, miss, then tap a chip
   (touch), read the bubble, tap elsewhere, hover with a mouse. */
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 693 }, isMobile: true, hasTouch: true });
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
    });
    await page.evaluate(() => window.__tap());
    for (let i = 0; i < 7; i++) { await page.evaluate(() => window.__dropWhen(d => d <= 0.9)); await page.waitForTimeout(100); }
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => window.__dropWhen(d => d > 25)); await page.waitForTimeout(150);
      if (await page.evaluate(() => document.getElementById('reaction').textContent.includes('SPLAT'))) break;
    }
    await page.waitForTimeout(1500);
    const out = {};
    out.chips = await page.locator('.milestone-chip').allTextContents();
    out.moonScale = await page.evaluate(() => getComputedStyle(document.getElementById('moon')).scale);
    out.moonAtEnd = await page.evaluate(() => document.getElementById('moon').className);
    out.endWord = await page.evaluate(() => document.getElementById('endWord').textContent + ' | flash: ' + document.getElementById('reactionWord').textContent);
    await page.screenshot({ path: path.join(__dirname, 'chips-end.png') });
    const first = page.locator('.milestone-chip').first();
    await first.tap(); await page.waitForTimeout(250);
    out.afterTap = await page.evaluate(() => ({ tip: document.getElementById('milestoneTip').hidden ? 'hidden' : document.getElementById('milestoneTip').textContent, open: document.querySelectorAll('.milestone-chip.is-open').length, top: document.getElementById('milestoneTip').style.top, left: document.getElementById('milestoneTip').style.left }));
    await page.screenshot({ path: path.join(__dirname, 'chips-tip.png') });
    await first.tap(); await page.waitForTimeout(150);
    out.afterSecondTap = await page.evaluate(() => document.getElementById('milestoneTip').hidden ? 'hidden' : 'shown');
    const last = page.locator('.milestone-chip').last();
    await last.tap(); await page.waitForTimeout(150);
    out.lastChipTip = await page.evaluate(() => document.getElementById('milestoneTip').textContent);
    await page.locator('#endWord').tap(); await page.waitForTimeout(150);
    out.afterTapElsewhere = await page.evaluate(() => document.getElementById('milestoneTip').hidden ? 'hidden' : 'shown');
    out.stillOver = await page.evaluate(() => !document.getElementById('endScreen').hidden);
    out.errors = errors;
    console.log(JSON.stringify(out, null, 1));
  } finally { await browser.close(); }
})();
