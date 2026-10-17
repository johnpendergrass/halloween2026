/* Stack-o'-Lantern milestone check (scratch, 2026-10-16). Needs the
   no-cache server on 8098. Plays perfect drops by tapping when the
   sliding slab lines up, from inside the page (full-rate frames), and
   reads the badges, the banner and the end screen. Saves screenshots to
   the scratchpad. */
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const OUT = __dirname;
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 693 }, isMobile: true, hasTouch: true });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.goto('http://127.0.0.1:8098/games/stack-o-lantern/index.html');
    await page.waitForTimeout(300);

    // One perfect drop: wait (frame by frame) until the mover's left edge is
    // within `tol` of the top slab's, then tap the stage.
    await page.evaluate(() => {
      window.__perfectDrop = (tol) => new Promise((resolve) => {
        const stage = document.getElementById('stage');
        const t0 = performance.now();
        function poll() {
          const slabs = [...document.querySelectorAll('#tower .slab')]
            .map(s => ({ left: parseFloat(s.style.left), bottom: parseFloat(s.style.bottom) }))
            .sort((a, b) => b.bottom - a.bottom);
          const diff = Math.abs(slabs[0].left - slabs[1].left);
          if (diff <= tol) { stage.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); resolve(diff); return; }
          if (performance.now() - t0 > 8000) { resolve(-1); return; }
          requestAnimationFrame(poll);
        }
        requestAnimationFrame(poll);
      });
      window.__tap = () => document.getElementById('stage').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      window.__read = () => ({
        count: document.getElementById('count').textContent,
        reaction: document.getElementById('reaction').innerText.replace(/\s+/g, ' ').trim(),
        badges: [...document.querySelectorAll('.reaction .badge')].map(b => b.className.replace('badge badge-', '') + ' ' + b.textContent),
        banner: document.getElementById('milestone').hidden ? 'hidden' : document.getElementById('milestoneName').textContent + ' / ' + document.getElementById('milestoneWhat').textContent,
        sparks: document.querySelectorAll('.spark').length,
        moon: document.getElementById('moon').className,
      });
    });

    await page.evaluate(() => window.__tap());        // start
    const log = [];
    for (let i = 1; i <= 12; i++) {
      const diff = await page.evaluate(() => window.__perfectDrop(0.9));
      await page.waitForTimeout(120);
      const r = await page.evaluate(() => window.__read());
      log.push({ drop: i, diff: Number(diff.toFixed(2)), ...r });
      if (i === 5) { await page.waitForTimeout(250); await page.screenshot({ path: path.join(OUT, 'milestone-5.png') }); }
      if (i === 10) { await page.waitForTimeout(250); await page.screenshot({ path: path.join(OUT, 'milestone-10.png') }); }
    }
    // Watch the banner queue drain (one banner per 1.8 s).
    const queue = [];
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(300);
      const r = await page.evaluate(() => window.__read());
      if (queue[queue.length - 1] !== r.banner) queue.push(r.banner);
    }
    // Now sloppy drops at a wide offset until the narrowing tower misses.
    const sloppy = [];
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => new Promise((resolve) => {
        function poll() {
          const slabs = [...document.querySelectorAll('#tower .slab')]
            .map(s => ({ left: parseFloat(s.style.left), bottom: parseFloat(s.style.bottom) }))
            .sort((a, b) => b.bottom - a.bottom);
          if (Math.abs(slabs[0].left - slabs[1].left) > 25) { window.__tap(); resolve(); return; }
          requestAnimationFrame(poll);
        }
        requestAnimationFrame(poll);
      }));
      await page.waitForTimeout(150);
      const r = await page.evaluate(() => window.__read());
      sloppy.push(r.reaction + ' [' + r.badges.join('|') + ']');
      if (await page.evaluate(() => !document.getElementById('endScreen').hidden || document.getElementById('reaction').textContent.includes('SPLAT'))) break;
    }
    await page.waitForTimeout(1300);
    const end = await page.evaluate(() => ({
      word: document.getElementById('endWord').textContent,
      count: document.getElementById('endCount').textContent,
      compare: document.getElementById('endCompare').textContent,
      milestonesHidden: document.getElementById('endMilestones').hidden,
      list: document.getElementById('endMilestoneList').textContent,
      saved: localStorage.getItem('halloween2026:stack-o-lantern'),
    }));
    await page.screenshot({ path: path.join(OUT, 'milestone-end.png') });
    console.log(JSON.stringify({ sloppy, log: log.map(l => [l.drop, l.reaction, l.badges.join('|'), l.banner].join(' ; ')), queue, end, errors }, null, 1));
  } finally {
    await browser.close();
  }
})();
