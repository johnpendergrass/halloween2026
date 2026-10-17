/* Narrow and growth milestones: clip the slab down to under half, then
   land several in a row (perfects), expecting Tightrope and Needle paths,
   and WIDERs in a row for Green Thumb. Reads the banner queue. */
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
      window.__slabs = () => [...document.querySelectorAll('#tower .slab')].map(s => ({ left: parseFloat(s.style.left), bottom: parseFloat(s.style.bottom), width: parseFloat(s.style.width) })).sort((a, b) => b.bottom - a.bottom);
      window.__dropWhen = (test) => new Promise((resolve) => {
        function poll() { const s = window.__slabs(); if (test(Math.abs(s[0].left - s[1].left), s[0].width)) { window.__tap(); resolve(); return; } requestAnimationFrame(poll); }
        requestAnimationFrame(poll);
      });
      window.__banners = []; window.__lastBanner = '';
      setInterval(() => { const m = document.getElementById('milestone'); const t = m.hidden ? '' : document.getElementById('milestoneName').textContent; if (t && t !== window.__lastBanner) { window.__banners.push(t); window.__lastBanner = t; } if (!t) window.__lastBanner = ''; }, 50);
    });
    await page.evaluate(() => window.__tap());
    // Clip twice at a wide offset: 46 -> about 21 -> about 10 (quarter = 11.5).
    await page.evaluate(() => window.__dropWhen((d) => d > 24 && d < 26)); await page.waitForTimeout(120); await page.evaluate(() => window.__dropWhen((d) => d > 10 && d < 11.5)); await page.waitForTimeout(120);
    const widthAfterClips = await page.evaluate(() => window.__slabs()[1].width);
    // Now perfects in a row: tiny streak 3 -> Needle; small streak 5 -> Tightrope;
    // WIDER at perfect 3, 6 -> Green Thumb at the second.
    for (let i = 0; i < 6; i++) { await page.evaluate(() => window.__dropWhen((d) => d <= 0.9)); await page.waitForTimeout(120); }
    // Clip the 14.6 slab to about 4.5 (an eighth = 5.75), then three perfects on pencils.
    await page.evaluate(() => window.__dropWhen((d) => d > 9.8 && d < 10.4)); await page.waitForTimeout(120);
    for (let i = 0; i < 3; i++) { await page.evaluate(() => window.__dropWhen((d) => d <= 0.7)); await page.waitForTimeout(120); }
    await page.waitForTimeout(24000);
    const out = await page.evaluate(() => ({ banners: window.__banners, count: document.getElementById('count').textContent, topWidth: window.__slabs()[1].width }));
    out.widthAfterClips = widthAfterClips;
    out.errors = errors;
    console.log(JSON.stringify(out, null, 1));
  } finally { await browser.close(); }
})();
