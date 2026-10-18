/* The speaker's touch target (2026-10-18): taps on the picture and just
   outside it toggle the sound and never start a round. */
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const out = {};
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 650 }, isMobile: true, hasTouch: true });
    await page.goto('http://127.0.0.1:8098/games/stack-o-lantern/index.html'); await page.waitForTimeout(500);
    const geo = await page.evaluate(() => { const b = document.getElementById('soundButton').getBoundingClientRect(); const i = document.querySelector('#soundButton img').getBoundingClientRect(); return { button: [b.left, b.top, b.width, b.height].map(Math.round), picture: [i.left, i.top, i.width, i.height].map(Math.round) }; });
    out.geo = geo;
    const [ix, iy, iw, ih] = geo.picture;
    const spots = { centre: [ix + iw / 2, iy + ih / 2], leftOut: [ix - 6, iy + ih / 2], rightOut: [ix + iw + 28, iy + ih / 2], belowOut: [ix + iw / 2, iy + ih + 28], corner: [ix + iw + 20, iy + ih + 20], farCorner: [ix + iw + 40, iy + ih + 40] };
    out.taps = {};
    for (const [name, [x, y]] of Object.entries(spots)) {
      const before = await page.evaluate(() => document.getElementById('soundButton').getAttribute('aria-pressed'));
      await page.touchscreen.tap(x, y); await page.waitForTimeout(500);   // over 350 ms apart, or the shell's double-tap guard cancels the click
      out.taps[name] = await page.evaluate((before) => ({ phase: state.phase, toggled: document.getElementById('soundButton').getAttribute('aria-pressed') !== before }), before);
    }
    // And a tap well below the speaker still starts the round.
    await page.touchscreen.tap(195, 400); await page.waitForTimeout(250);
    out.stageTap = await page.evaluate(() => state.phase);
  } finally { await browser.close(); }
  console.log(JSON.stringify(out));
  const ok = Object.values(out.taps).every(t => t.phase === 'ready' && t.toggled) && out.stageTap === 'playing' && out.geo.button[2] >= 44;
  console.log(ok ? 'SPEAKER OK' : 'SPEAKER FAILED');
})();
