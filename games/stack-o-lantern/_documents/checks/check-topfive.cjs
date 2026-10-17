/* Top-five check (2026-10-17): the shell's reportScore returns the score's
   place in the five-line list, and Stack's corner shows the right balloon
   for each end-screen tier. Loads the SHELL on 8098, clears the saved
   scores, opens Stack, then:
     1. reports 20 and 30 from the shell and reads the places (1, 1);
        a 5 is cut nowhere yet (3), a 30 ties below the earlier 30 (2);
     2. inside the iframe, fakes a tower of 6 and ends the round: the
        green TOP 5 SCORE! balloon (6 is 4th or 5th of the list);
     3. after backToStart the balloon and glow are gone;
     4. a tower of 40 with newBest set: the gold NEW HIGH SCORE! balloon;
     5. a tower of 3: no balloon at all, even though 3 makes the list;
     6. with the list full of bigger scores, a tower of 6: no balloon ("good").
   Screenshots the corner for the green and gold cases. Needs the no-cache
   server on 8098. */
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const out = {};
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 650 }, isMobile: true, hasTouch: true });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    // The browser's own /favicon.ico request 404s on the shell (there is
    // no icon file) and shows in the console without a URL; real missing
    // files are caught by the response listener, with their URL.
    page.on('console', m => { if (m.type() === 'error' && !m.text().includes('404')) errors.push('console: ' + m.text()); });
    page.on('response', r => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
    await page.goto('http://127.0.0.1:8098/index.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload(); await page.waitForTimeout(400);
    const click = (selectorOrText) => page.evaluate((s) => {
      const el = s.startsWith('text:')
        ? [...document.querySelectorAll('button, .game-card, [data-tab]')].find(e => e.textContent.includes(s.slice(5)))
        : document.querySelector(s);
      if (!el) return 'MISSING ' + s;
      el.click(); return 'clicked ' + s;
    }, selectorOrText);
    await click('#homeButton'); await page.waitForTimeout(400);
    await click('[data-tab="app"]'); await page.waitForTimeout(300);
    // Stack is slot 2; its button is an icon with no text.
    out.pick = await page.evaluate(() => { document.querySelectorAll('.game-button')[1].click(); return 'clicked slot 2'; });
    await page.waitForTimeout(1500);
    await click('#homeButton'); await page.waitForTimeout(500);   // close the panel again

    // 1. The shell's answers.
    out.places = await page.evaluate(() => [20, 30, 5, 30].map(v => window.halloweenApp.reportScore(v)));

    // 2..6. Inside the game.
    const frame = page.frames().find(f => f.url().includes('stack-o-lantern'));
    if (!frame) {
      out.frames = page.frames().map(f => f.url());
      out.cards = await page.evaluate(() => [...document.querySelectorAll('button, .game-card, [data-tab]')].map(e => e.className + ' | ' + e.textContent.trim().slice(0, 30)));
      throw new Error('no Stack frame: ' + JSON.stringify(out, null, 1));
    }
    // A spy on playSound: the fanfare each tier plays (the real sound
    // still plays, into a headless browser's silence).
    await frame.evaluate(() => {
      const real = playSound;
      window.__sounds = [];
      window.playSound = (name, detail) => { window.__sounds.push(name); real(name, detail); };
    });
    const corner = () => frame.evaluate(() => ({
      classes: document.getElementById('bestBox').className,
      gold: !document.getElementById('newBest').hidden,
      green: !document.getElementById('topFive').hidden,
      title: document.getElementById('endWord').textContent,
      place: state.place,
      fanfare: window.__sounds.filter(n => n.startsWith('fanfare')).join(','),
      pops: window.__sounds.filter(n => n === 'pop').length,
      sky: document.getElementById('fireworks').childElementCount,
    }));
    const endRound = (count, newBest) => frame.evaluate(async ([count, newBest]) => {
      window.__sounds = [];
      reset();
      state.phase = 'playing';
      while (state.slabs.length < count) state.slabs.push({});
      state.newBest = newBest;
      gameOver();
      await new Promise(r => setTimeout(r, END_DELAY_MS + 300));
    }, [count, newBest]);
    const shot = (name) => page.screenshot({ path: path.join(__dirname, name), clip: { x: 0, y: 60, width: 390, height: 120 } });

    // Each show is given time to finish before the pops are counted: the
    // green one is 3 bursts over 1.8 s, the gold 7 over 3.6 s (then a
    // trickle), the good one a single burst.
    await endRound(6, false);  await shot('topfive-green.png');
    await page.waitForTimeout(4600);  out.green = await corner();
    await frame.evaluate(() => backToStart());  out.afterBack = await corner();
    await endRound(40, true);  await shot('topfive-gold.png');
    await page.waitForTimeout(1300);
    await page.screenshot({ path: path.join(__dirname, 'topfive-fireworks.png') });   // mid-volley
    await page.waitForTimeout(5200);  out.gold = await corner();
    await frame.evaluate(() => backToStart());  out.afterGold = await corner();
    await endRound(3, false);  out.under5 = await corner();
    await frame.evaluate(() => backToStart());
    await page.evaluate(() => [90, 91, 92, 93, 94].forEach(v => window.halloweenApp.reportScore(v)));
    await endRound(6, false);  await page.waitForTimeout(3600);  out.good = await corner();
    out.errors = errors;
  } finally {
    await browser.close();
  }
  console.log(JSON.stringify(out, null, 1));
  const ok = out.places.join() === '1,1,3,2'
    && out.green.green && !out.green.gold && out.green.classes.includes('is-top-five')
    && !out.afterBack.green && !out.afterBack.gold && !out.afterBack.classes.includes('is-')
    && out.gold.gold && !out.gold.green && out.gold.classes.includes('is-new-best')
    && !out.under5.green && !out.under5.gold
    && !out.good.green && !out.good.gold && out.good.place === 0
    && out.green.fanfare === 'fanfareTopFive' && out.gold.fanfare === 'fanfareBest'
    && out.under5.fanfare === '' && out.good.fanfare === 'fanfareGood'
    && out.green.pops === 12 && out.gold.pops >= 16 && out.under5.pops === 0 && out.good.pops === 6
    && out.afterGold.sky === 0 && out.afterBack.sky === 0
    && out.errors.length === 0;
  console.log(ok ? 'TOPFIVE OK' : 'TOPFIVE FAILED');
})();
