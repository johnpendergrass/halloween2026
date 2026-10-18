/* CHEAT look (2026-10-18): a practice round from 50 inside the SHELL, so the
   real reportScore runs: the end screen's title reads SPACE NEEDLE CHEAT
   (the mark half-size, green), the THIS GAME list shows the note bold.
   Needs the no-cache server on 8098. */
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const out = {};
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error' && !m.text().includes('404')) errors.push('console: ' + m.text()); });
    await page.goto('http://127.0.0.1:8098/index.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload(); await page.waitForTimeout(800);
    const click = (selectorOrText) => page.evaluate((s) => {
      const matches = (b, t) => b.textContent.includes(t) || (b.getAttribute('aria-label') || '').includes(t) || [...b.querySelectorAll('img')].some(i => i.src.toLowerCase().includes(t.toLowerCase()));
      const el = s.startsWith('text:') ? [...document.querySelectorAll('button')].find(b => matches(b, s.slice(5))) : document.querySelector(s);
      if (!el) return 'missing ' + s;
      el.click(); return 'clicked ' + s;
    }, selectorOrText);
    await click('#homeButton'); await page.waitForTimeout(400);
    await click('[data-tab="app"]'); await page.waitForTimeout(300);
    out.pick = await click('text:Stack'); await page.waitForTimeout(1500);

    // Inside the game's frame: practice 50, one lined-up drop, game over.
    const frame = page.frames().find(f => f.url().includes('stack-o-lantern'));
    out.frame = !!frame;
    await frame.evaluate(() => { document.getElementById('levelBadge').click(); document.getElementById('practiceLevel').value = '50'; document.getElementById('practiceDone').click(); });
    await frame.evaluate(() => document.getElementById('stage').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
    await frame.waitForFunction(() => state.mover && state.phase === 'playing');
    await frame.evaluate(() => new Promise((resolve) => {
      const top = state.slabs[state.slabs.length - 1];
      function poll() {
        if (Math.abs(state.mover.x - top.x) <= 1) { document.getElementById('stage').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); resolve(); return; }
        requestAnimationFrame(poll);
      }
      requestAnimationFrame(poll);
    }));
    await frame.waitForTimeout(300);
    await frame.evaluate(async () => { gameOver(); await new Promise(r => setTimeout(r, END_DELAY_MS + 600)); });
    out.end = await frame.evaluate(() => ({
      title: document.getElementById('endWord').textContent, place: state.place,
      mark: getComputedStyle(document.querySelector('.cheat-mark')).color,
      gold: !document.getElementById('newBest').hidden, green: !document.getElementById('topFive').hidden,
    }));
    await page.screenshot({ path: path.join(__dirname, 'cheat-end.png') });

    // The shell's list.
    await click('#homeButton'); await page.waitForTimeout(500);
    await click('[data-tab="game"]'); await page.waitForTimeout(400);
    out.list = await page.evaluate(() => ({
      firstRow: document.querySelector('#thisGameScores .score-row').textContent.replace(/\s+/g, ' ').trim(),
      boldNotes: [...document.querySelectorAll('#thisGameScores .score-note b')].map(b => b.textContent).join(),
      saved: JSON.parse(localStorage.getItem('halloween2026:stack-o-lantern')).scores,
    }));
    await page.screenshot({ path: path.join(__dirname, 'cheat-list.png') });
    out.errors = errors;
  } finally {
    await browser.close();
  }
  console.log(JSON.stringify(out, null, 1));
  const ok = out.end.title === 'SPACE NEEDLE CHEAT' && out.end.place === 1 && out.list.boldNotes === 'CHEAT'
    && out.list.saved[0].value === 51 && out.list.saved[0].notes.join() === 'Space Needle,**CHEAT**' && out.errors.length === 0;
  console.log(ok ? 'CHEAT OK' : 'CHEAT FAILED');
})();
