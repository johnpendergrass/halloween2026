/* Go Fish's music default (2026-10-18): a fresh load has the music channel
   OFF and the mode Always; the Sound popup shows it so; a remembered note
   (on, paused) still wins on the next load; the MUSIC tap starts the tune.
   Needs the no-cache server on 8098. */
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--autoplay-policy=no-user-gesture-required'] });
  const out = {};
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 650 }, isMobile: true, hasTouch: true });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error' && !m.text().includes('404')) errors.push('console: ' + m.text()); });
    await page.goto('http://127.0.0.1:8098/games/candy-go-fish/index.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload(); await page.waitForTimeout(1500);
    // The tunes are Audio objects, not in the page: count play() calls instead.
    const spyPlay = () => page.evaluate(() => { window.__plays = 0; const play = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { window.__plays += 1; return play.call(this); }; });
    await spyPlay();
    const openPopup = async () => { await page.evaluate(() => document.getElementById('dialogSound').click()); await page.waitForTimeout(300); };
    const read = () => page.evaluate(() => ({
      enabled: CandySound.getChannel('music').enabled, mode: CandySound.musicMode,
      button: document.getElementById('musicEnabled').getAttribute('aria-pressed'),
      always: document.getElementById('modeContinuous').getAttribute('aria-pressed'),
      paused: document.getElementById('modePaused').getAttribute('aria-pressed'),
      saved: localStorage.getItem('halloween2026:candy-go-fish:music'),
      plays: window.__plays, popupOpen: !document.getElementById('musicOverlay').hidden,
    }));
    await openPopup();
    out.fresh = await read();
    // The MUSIC tap in the popup starts the tune; Cancel stops it.
    await page.evaluate(() => { document.getElementById('musicEnabled').click(); });
    await page.waitForTimeout(800);
    out.afterOn = await read();
    await page.evaluate(() => { document.getElementById('musicCancel').click(); });
    await page.waitForTimeout(300);
    out.afterCancel = await read();
    // A note from an OLDER version (no version field, as before 2026-10-18)
    // is dropped: the defaults show and the key is gone.
    await page.evaluate(() => localStorage.setItem('halloween2026:candy-go-fish:music', JSON.stringify({ enabled: true, volume: 0.6, track: 'haunted', mode: 'paused', ui: true })));
    await page.reload(); await page.waitForTimeout(1500);
    await spyPlay(); await openPopup();
    out.stale = await read();
    // OK writes the page's stamp as the version.
    await page.evaluate(() => { document.getElementById('musicEnabled').click(); document.getElementById('musicDone').click(); });
    await page.waitForTimeout(300);
    out.written = await read();
    out.stamp = await page.evaluate(() => new URL(document.querySelector('script[src*="candy-go-fish.js"]').src).searchParams.get('v'));
    // A remembered note of the current stamp wins: on + paused, reload.
    await page.evaluate((stamp) => localStorage.setItem('halloween2026:candy-go-fish:music', JSON.stringify({ version: stamp, enabled: true, volume: 0.6, track: 'haunted', mode: 'paused', ui: true })), out.stamp);
    await page.reload(); await page.waitForTimeout(1500);
    await spyPlay(); await openPopup();
    out.restored = await read();
    out.errors = errors;
  } finally { await browser.close(); }
  console.log(JSON.stringify(out, null, 1));
  const ok = !out.fresh.enabled && out.fresh.mode === 'continuous' && out.fresh.button === 'false' && out.fresh.always === 'true' && out.fresh.paused === 'false' && out.fresh.saved === null && out.fresh.plays === 0 && out.fresh.popupOpen
    && out.afterOn.enabled && out.afterOn.plays >= 1 && !out.afterCancel.enabled && !out.afterCancel.popupOpen
    && !out.stale.enabled && out.stale.mode === 'continuous' && out.stale.saved === null
    && out.written.enabled && out.stamp && JSON.parse(out.written.saved).version === out.stamp
    && out.restored.enabled && out.restored.mode === 'paused' && out.restored.button === 'true' && out.errors.length === 0;
  console.log(ok ? 'GOFISH MUSIC OK' : 'GOFISH MUSIC FAILED');
})();
