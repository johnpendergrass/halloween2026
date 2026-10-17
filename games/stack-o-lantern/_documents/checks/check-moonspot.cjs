/* Moon-spot check: screenshots of the start screen, a milestone banner
   mid-game (Sharp Eye at 5 perfects), and the end screen with 9 names;
   the moon's box on each, in vw from the stage top. */
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 650 }, isMobile: true, hasTouch: true });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:8098/games/stack-o-lantern/index.html');
    await page.waitForTimeout(300);
    const moonBox = () => page.evaluate(() => {
      const vw = innerWidth / 100; const top = document.getElementById('stage').getBoundingClientRect().top;
      const r = document.getElementById('moon').getBoundingClientRect();
      return { l: +(r.left / vw).toFixed(1), r: +(r.right / vw).toFixed(1), t: +((r.top - top) / vw).toFixed(1), b: +((r.bottom - top) / vw).toFixed(1), transform: document.getElementById('moon').style.transform || 'none' };
    });
    const out = {};
    out.moonStart = await moonBox();
    await page.screenshot({ path: path.join(__dirname, 'moonspot-start.png') });
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
    for (let i = 0; i < 5; i++) { await page.evaluate(() => window.__dropWhen(d => d <= 0.9)); await page.waitForTimeout(100); }
    await page.waitForTimeout(500);
    out.banner = await page.evaluate(() => ({ hidden: document.getElementById('milestone').hidden, name: document.getElementById('milestoneName').textContent }));
    await page.screenshot({ path: path.join(__dirname, 'moonspot-banner.png') });
    for (let i = 0; i < 12; i++) { await page.evaluate(() => window.__dropWhen(d => d <= 0.9)); await page.waitForTimeout(100); }
    out.moonMidGame = await moonBox();
    out.camera = await page.evaluate(() => state.camera.toFixed(1));
    await page.screenshot({ path: path.join(__dirname, 'moonspot-play.png') });
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => window.__dropWhen(d => d > 25)); await page.waitForTimeout(150);
      if (await page.evaluate(() => !document.getElementById('endScreen').hidden || document.getElementById('reaction').textContent.length > 0 && state.phase === 'over')) break;
    }
    await page.waitForTimeout(1500);
    out.moonEnd = await moonBox();
    out.realEnd = await page.evaluate(() => ({ word: document.getElementById('endWord').textContent, count: document.getElementById('endCount').innerText.replace(/\n/g, ' / '), chips: [...document.querySelectorAll('.milestone-chip')].map(c => c.textContent) }));
    await page.screenshot({ path: path.join(__dirname, 'moonspot-end-real.png') });
    await page.evaluate(() => {
      document.getElementById('endWord').textContent = 'LEGENDARY.';
      document.getElementById('endNumber').textContent = '20';
      document.getElementById('endMilestones').hidden = false;
      const seen = new Set();
      const oneEach = MILESTONES.filter(m => !seen.has(m.kind) && seen.add(m.kind)).map(m => MILESTONES.filter(x => x.kind === m.kind).pop());
      fillMilestoneGrid(oneEach);
    });
    out.positions = await page.evaluate(() => {
      const vw = innerWidth / 100; const stageTop = document.getElementById('stage').getBoundingClientRect().top;
      const box = (sel) => { const r = document.querySelector(sel).getBoundingClientRect(); return { l: +(r.left / vw).toFixed(1), r: +(r.right / vw).toFixed(1), t: +((r.top - stageTop) / vw).toFixed(1), b: +((r.bottom - stageTop) / vw).toFixed(1) }; };
      return { word: box('#endWord'), count: box('#endCount'), compare: box('#endCompare'), heading: box('#endMilestones p'), grid: box('.milestone-grid'), button: box('#playAgain'), stage: box('#stage') };
    });
    await page.screenshot({ path: path.join(__dirname, 'moonspot-end-9.png') });
    await page.evaluate(() => fillMilestoneGrid([MILESTONES[0]]));
    await page.screenshot({ path: path.join(__dirname, 'moonspot-end-1.png') });
    out.errors = errors;
    console.log(JSON.stringify(out, null, 1));
  } finally { await browser.close(); }
})();
