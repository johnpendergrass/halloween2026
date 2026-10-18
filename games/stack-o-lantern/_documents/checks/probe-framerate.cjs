/* Frame-rate probe (2026-10-18): how far does the slab jump between drawn
   frames at the 0.65 s floor when the CPU is slow? Loads the game alone
   on 8098, starts a practice round at 172 (the floor), and for each CPU
   throttle (1x = this PC, 4x and 6x stand in for a mid-range / old phone)
   samples every animation frame for 3 s: the gap between frames and the
   slab's movement per frame. Headless Chrome paints at 60 Hz. */
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const out = {};
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 650 }, isMobile: true, hasTouch: true });
    const cdp = await page.context().newCDPSession(page);
    const errors = []; out.errors = errors; page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.goto('http://127.0.0.1:8098/games/stack-o-lantern/index.html');
    await page.waitForTimeout(400);
    await page.evaluate(() => {
      Halloween.reportScore = () => 0;
      window.__tap = (el) => el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    });
    out.band = await page.evaluate(() => PERFECT_TOLERANCE * 2);
    for (const rate of [1, 6, 10, 20]) {
      await cdp.send('Emulation.setCPUThrottlingRate', { rate });
      // A fresh page and a practice round at 172, then let the slab slide.
      await page.reload(); await page.waitForTimeout(500);
      await page.evaluate(() => {
        Halloween.reportScore = () => 0;
        window.__tap = (el) => el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      });
      await page.evaluate(() => { document.getElementById('levelBadge').click(); document.getElementById('practiceLevel').value = '172'; document.getElementById('practiceDone').click(); });
      await page.evaluate(() => window.__tap(document.getElementById('stage')));
      await page.waitForFunction(() => state.mover && state.phase === 'playing', null, { timeout: 5000 }).catch(() => {});
      out['phase' + rate] = await page.evaluate(() => state.phase + ' mover:' + !!state.mover);
      const sample = await page.evaluate(() => new Promise((resolve) => {
        const gaps = [], jumps = [];
        let last = performance.now(), lastX = state.mover.x;
        const tick = (now) => {
          gaps.push(now - last); last = now;
          if (state.mover) { jumps.push(Math.abs(state.mover.x - lastX)); lastX = state.mover.x; }
          if (gaps.length < 180) requestAnimationFrame(tick); else resolve({ gaps, jumps });
        };
        requestAnimationFrame(tick);
      }));
      const sorted = (a) => [...a].sort((x, y) => x - y);
      const pct = (a, p) => sorted(a)[Math.floor((a.length - 1) * p)];
      const g = sample.gaps.slice(1), j = sample.jumps.filter((x) => x > 0 && x < 20); // drop bounces
      out['cpu' + rate + 'x'] = {
        crossing: await page.evaluate(() => +(100 / state.mover.speed).toFixed(3)),
        frameMs: { median: +pct(g, 0.5).toFixed(1), p95: +pct(g, 0.95).toFixed(1), max: +Math.max(...g).toFixed(1) },
        jumpVw: { median: +pct(j, 0.5).toFixed(2), p95: +pct(j, 0.95).toFixed(2), max: +Math.max(...j).toFixed(2) },
      };
    }
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  } catch (e) { out.failed = String(e.message).split("\n")[0]; } finally {
    await browser.close();
  }
  console.log(JSON.stringify(out, null, 1));
})();
