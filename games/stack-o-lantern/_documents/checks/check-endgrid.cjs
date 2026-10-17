/* End-screen layout check: reach the end screen, then redraw the grid
   with 1..9 names (one per kind) and screenshot a few, with the widest
   word and a three-digit count forced in. Then tap a slanted chip. */
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    // 390 x 650 is about the shell's 9:15 panel.
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
    });
    await page.evaluate(() => window.__tap());
    for (let i = 0; i < 22; i++) { await page.evaluate(() => window.__dropWhen(d => d <= 0.9)); await page.waitForTimeout(100); }
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => window.__dropWhen(d => d > 25)); await page.waitForTimeout(150);
      if (await page.evaluate(() => document.getElementById('reaction').textContent.includes('SPLAT') || !document.getElementById('endScreen').hidden)) break;
    }
    await page.waitForTimeout(1500);
    const out = {};
    out.realEnd = await page.evaluate(() => ({
      word: document.getElementById('endWord').textContent,
      count: document.getElementById('endCount').innerText.replace(/\n/g, ' / '),
      chips: [...document.querySelectorAll('.milestone-chip')].map(c => c.textContent),
      cells: document.querySelectorAll('.grid-cell').length,
    }));
    await page.screenshot({ path: path.join(__dirname, 'endgrid-real.png') });

    // Force the widest word, a three-digit count, and one name per kind.
    await page.evaluate(() => {
      document.getElementById('endWord').textContent = 'STARSTRUCK.';
      document.getElementById('endNumber').textContent = '123';
      document.getElementById('endMilestones').hidden = false;
      const seen = new Set();
      window.__oneEach = MILESTONES.filter(m => !seen.has(m.kind) && seen.add(m.kind))
        .map(m => MILESTONES.filter(x => x.kind === m.kind).pop());   // the top of each kind: the long names
    });
    out.kinds = await page.evaluate(() => window.__oneEach.map(m => m.name));
    out.layouts = {};
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      const info = await page.evaluate((n) => {
        fillMilestoneGrid(window.__oneEach.slice(0, n));
        const vw = innerWidth / 100;
        const cells = [...document.querySelectorAll('.grid-cell')].map(c => c.children.length ? '1' : '0').join('');
        const chips = [...document.querySelectorAll('.milestone-chip')].map(c => {
          const r = c.getBoundingClientRect();
          return { name: c.textContent, l: +(r.left / vw).toFixed(1), r: +(r.right / vw).toFixed(1), t: +(r.top / vw).toFixed(1), b: +(r.bottom / vw).toFixed(1) };
        });
        const btn = document.getElementById('playAgain').getBoundingClientRect();
        return { cells, chips, buttonBottomVw: +(btn.bottom / vw).toFixed(1), stageBottomVw: +(document.getElementById('stage').getBoundingClientRect().bottom / vw).toFixed(1) };
      }, n);
      out.layouts[n] = info;
      if ([1, 4, 9].includes(n)) await page.screenshot({ path: path.join(__dirname, `endgrid-${n}.png`) });
    }
    // Where the word and the count sit relative to the moon (all in vw).
    out.positions = await page.evaluate(() => {
      const vw = innerWidth / 100; const stageTop = document.getElementById('stage').getBoundingClientRect().top;
      const box = (id) => { const r = document.getElementById(id).getBoundingClientRect(); return { l: +(r.left / vw).toFixed(1), r: +(r.right / vw).toFixed(1), t: +((r.top - stageTop) / vw).toFixed(1), b: +((r.bottom - stageTop) / vw).toFixed(1) }; };
      return { moon: box('moon'), word: box('endWord'), count: box('endCount'), compare: box('endCompare') };
    });
    // Tap a chip: the bubble opens above it; tap elsewhere closes it.
    const chip = page.locator('.milestone-chip').nth(4);
    await chip.tap(); await page.waitForTimeout(250);
    out.afterTap = await page.evaluate(() => ({ tip: document.getElementById('milestoneTip').hidden ? 'hidden' : document.getElementById('milestoneTip').textContent, open: document.querySelectorAll('.milestone-chip.is-open').length }));
    await page.screenshot({ path: path.join(__dirname, 'endgrid-tip.png') });
    await page.locator('#endCompare').tap(); await page.waitForTimeout(150);
    out.afterTapElsewhere = await page.evaluate(() => document.getElementById('milestoneTip').hidden ? 'hidden' : 'shown');
    out.errors = errors;
    console.log(JSON.stringify(out, null, 1));
  } finally { await browser.close(); }
})();
