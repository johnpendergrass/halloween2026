/* Shell check (2026-10-17): open the app, pick Stack o' Lantern (slot 2),
   read the top bar's title and the Home icon's size, open the panel on
   THIS GAME and read its text; then play a short round inside the iframe
   and read the saved score's note (the level's name). Screenshots.
   Needs the no-cache server on 8098. */
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 693 }, isMobile: true, hasTouch: true });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:8098/index.html');
    await page.waitForTimeout(800);
    const out = {};
    // Pick slot 2 from the GAMES tab: Home opens the panel on THIS GAME; the
    // GAMES tab is a button. Clicks are sent from inside the page (the
    // sliding drawer intercepts Playwright's taps while it moves).
    const click = (selectorOrText) => page.evaluate((s) => {
      // A slot button shows an icon, not text: match its spoken name or its icon's file too.
      const matches = (b, t) => b.textContent.includes(t) || (b.getAttribute('aria-label') || '').includes(t) || [...b.querySelectorAll('img')].some(i => i.src.toLowerCase().includes(t.toLowerCase()));
      const el = s.startsWith('text:') ? [...document.querySelectorAll('button')].find(b => matches(b, s.slice(5))) : document.querySelector(s);
      if (!el) return 'missing ' + s;
      el.click(); return 'clicked ' + s;
    }, selectorOrText);
    await click('#homeButton'); await page.waitForTimeout(400);
    out.picks = [await click('[data-tab="app"]')]; await page.waitForTimeout(300);
    out.picks.push(await click('text:Stack')); await page.waitForTimeout(1200);
    out.topBar = await page.evaluate(() => {
      const home = document.getElementById('homeButton');
      const r = home.getBoundingClientRect();
      const bar = document.querySelector('.top-panel').getBoundingClientRect();
      return { title: document.getElementById('topTitle').textContent, homeFont: getComputedStyle(home).fontSize, homeBox: { w: Math.round(r.width), h: Math.round(r.height) }, barH: Math.round(bar.height) };
    });
    await page.screenshot({ path: path.join(__dirname, 'shell-top.png') });
    // THIS GAME tab text.
    await click('#homeButton'); await page.waitForTimeout(400);
    out.thisGame = await page.evaluate(() => ({
      title: document.getElementById('thisGameTitle').textContent,
      description: document.getElementById('thisGameDescription').textContent,
      howToPlay: document.getElementById('thisGameHowToPlay').textContent,
    }));
    await page.screenshot({ path: path.join(__dirname, 'shell-thisgame.png') });
    // Scroll the tab so the description is in view, and shoot that too.
    await page.evaluate(() => document.getElementById('thisGameDescription').scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(__dirname, 'shell-thisgame-text.png') });
    await click('#homeButton'); await page.waitForTimeout(400);
    // A round inside the iframe: 6 perfects (Scarecrow), then a miss.
    out.frames = page.frames().map(f => f.url());
    const frame = page.frames().find(f => f.url().includes('stack-o-lantern'));
    if (!frame) { out.errors = errors; console.log(JSON.stringify(out, null, 1)); return; }
    await frame.evaluate(() => {
      window.__tap = () => document.getElementById('stage').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      window.__dropWhen = (test) => new Promise((resolve) => {
        const t0 = performance.now();
        function poll() {
          const s = [...document.querySelectorAll('#tower .slab')].map(e => ({ left: parseFloat(e.style.left), bottom: parseFloat(e.style.bottom) })).sort((a, b) => b.bottom - a.bottom);
          if (test(Math.abs(s[0].left - s[1].left))) { window.__tap(); resolve(true); return; }
          if (performance.now() - t0 > 8000) { resolve(false); return; }
          requestAnimationFrame(poll);
        }
        requestAnimationFrame(poll);
      });
    });
    await frame.evaluate(() => window.__tap());
    for (let i = 0; i < 6; i++) { await frame.evaluate(() => window.__dropWhen(d => d <= 0.9)); await page.waitForTimeout(100); }
    for (let i = 0; i < 12; i++) {
      await frame.evaluate(() => window.__dropWhen(d => d > 25)); await page.waitForTimeout(150);
      if (await frame.evaluate(() => state.phase === 'over')) break;
    }
    await page.waitForTimeout(1500);
    out.saved = await page.evaluate(() => JSON.parse(localStorage.getItem('halloween2026:stack-o-lantern') || '{}').scores);
    await click('#homeButton'); await page.waitForTimeout(400);
    out.scoreRows = await page.evaluate(() => [...document.querySelectorAll('#thisGameScores .score-row')].map(r => r.textContent.replace(/\s+/g, ' ').trim()));
    await page.screenshot({ path: path.join(__dirname, 'shell-scores.png') });

    // Load the app again: the game's corner must start from the saved 7.
    await page.goto('http://127.0.0.1:8098/index.html'); await page.waitForTimeout(800);
    await click('#homeButton'); await page.waitForTimeout(400);
    await click('[data-tab="app"]'); await page.waitForTimeout(300);
    await click('text:Stack'); await page.waitForTimeout(1500);
    const frame2 = page.frames().find(f => f.url().includes('stack-o-lantern'));
    out.cornerAfterReload = await frame2.evaluate(() => document.getElementById('best').textContent);
    // Clear the scores in the shell: the list empties and the game loads again, corner 0.
    await click('#homeButton'); await page.waitForTimeout(400);
    await click('#clearScores'); await page.waitForTimeout(200);
    await click('#clearYes'); await page.waitForTimeout(1500);
    out.afterClear = await page.evaluate(() => ({
      rows: [...document.querySelectorAll('#thisGameScores .score-row')].map(r => r.textContent.replace(/\s+/g, ' ').trim()),
      saved: localStorage.getItem('halloween2026:stack-o-lantern'),
    }));
    const frame3 = page.frames().find(f => f.url().includes('stack-o-lantern'));
    out.afterClear.corner = await frame3.evaluate(() => document.getElementById('best').textContent);
    out.afterClear.phase = await frame3.evaluate(() => state.phase);
    await page.screenshot({ path: path.join(__dirname, 'shell-cleared.png') });
    out.errors = errors;
    console.log(JSON.stringify(out, null, 1));
  } finally { await browser.close(); }
})();
