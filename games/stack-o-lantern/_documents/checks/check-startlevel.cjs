/* Practice level check (2026-10-17): the badge over the base on the
   welcome screen, the practice panel, a practice round, Stack again back
   to the welcome screen. Loads the GAME page alone on 8098 (the shell is
   not needed: Halloween.reportScore is spied on), clears its storage, then:
     1. the badge reads "Level 1" and is shown; the panel is hidden;
     2. a tap on the badge does not start a round and opens the panel
        (21 options: 1, 10, 20 ... 200); Done with 50 closes it, the badge
        reads "Level 50", nothing is saved on the device; Cancel leaves
        things alone;
     3. a tap on the stage starts a practice round: the badge hides, the
        count is 50, the first slab slides at the ramp's speed for 50, the
        rungs up to 50 are earned quietly; a lined-up drop pops 51 with no
        banner; a game over reports 51 with the notes "Space Needle" and
        "**CHEAT**", the title reads SPACE NEEDLE (no mark) and the gold
        balloon shows (51 beats the corner's 1; since 2026-10-18, before
        that practice rounds were not reported);
     4. Stack again shows the welcome screen with the badge "Level 50";
     5. back at 1 through the panel, a round reports its count.
   Needs the no-cache server on 8098. */
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const out = {};
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 650 }, isMobile: true, hasTouch: true });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error' && !m.text().includes('404')) errors.push('console: ' + m.text()); });
    page.on('response', r => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
    await page.goto('http://127.0.0.1:8098/games/stack-o-lantern/index.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload(); await page.waitForTimeout(400);
    await page.evaluate(() => {
      window.__reported = [];
      Halloween.reportScore = (value, text, notes) => { window.__reported.push(value); window.__notes = (notes || []).join(); return 1; };
      window.__tap = (el) => el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    });
    const look = () => page.evaluate(() => ({
      phase: state.phase, badge: document.getElementById('levelBadge').textContent, badgeShown: !document.getElementById('levelBadge').hidden,
      panelShown: !document.getElementById('practicePanel').hidden, startShown: !document.getElementById('startScreen').hidden,
      saved: localStorage.getItem('halloween2026:stack-o-lantern:start-level'),   // always null since 2026-10-18
      chosen: chosenStartLevel,
    }));

    // 1.
    out.fresh = await look();
    await page.screenshot({ path: path.join(__dirname, 'startlevel-welcome.png') });

    // 2. the badge opens the panel without starting; Done with 50; Cancel.
    await page.evaluate(() => { const b = document.getElementById('levelBadge'); window.__tap(b); b.click(); });
    await page.waitForTimeout(200);
    out.opened = await look();
    out.options = await page.evaluate(() => document.getElementById('practiceLevel').options.length);
    out.lastOptions = await page.evaluate(() => [...document.getElementById('practiceLevel').options].slice(-4).map(o => o.value).join());
    out.firstOptions = await page.evaluate(() => [...document.getElementById('practiceLevel').options].slice(0, 3).map(o => o.value).join());
    await page.screenshot({ path: path.join(__dirname, 'startlevel-panel.png') });
    await page.evaluate(() => { document.getElementById('practiceLevel').value = '50'; document.getElementById('practiceDone').click(); });
    out.picked = await look();
    await page.evaluate(() => { document.getElementById('levelBadge').click(); document.getElementById('practiceLevel').value = '7'; document.getElementById('practiceCancel').click(); });
    out.cancelled = await look();

    // 3. a practice round from 50.
    await page.evaluate(() => window.__tap(document.getElementById('stage')));
    await page.waitForTimeout(200);
    out.practice = await page.evaluate(() => ({
      phase: state.phase, badgeShown: !document.getElementById('levelBadge').hidden, startLevel: state.startLevel, count: stackedCount(),
      speed: +state.mover.speed.toFixed(1), expectedSpeed: +(100 / crossingFor(50)).toFixed(1),
      preEarned: state.earned.filter(e => e.family === 'height').map(e => e.at).join(','),
    }));
    await page.evaluate(() => new Promise((resolve) => {
      const top = state.slabs[state.slabs.length - 1];
      function poll() {
        if (Math.abs(state.mover.x - top.x) <= 1) { window.__tap(document.getElementById('stage')); resolve(); return; }
        requestAnimationFrame(poll);
      }
      requestAnimationFrame(poll);
    }));
    await page.waitForTimeout(300);
    out.afterDrop = await page.evaluate(() => ({
      count: stackedCount(), pop: (document.querySelector('.count-pop') || {}).textContent || null,
      banner: document.getElementById('milestone').hidden ? '' : document.getElementById('milestoneName').textContent,
    }));
    await page.evaluate(async () => { gameOver(); await new Promise(r => setTimeout(r, END_DELAY_MS + 300)); });
    out.practiceEnd = await page.evaluate(() => ({
      place: state.place, title: document.getElementById('endWord').textContent, reported: window.__reported.slice(), notes: window.__notes,
      gold: !document.getElementById('newBest').hidden, green: !document.getElementById('topFive').hidden,
      best: document.getElementById('best').textContent,
    }));

    // 4. Stack again -> the welcome screen with the badge.
    await page.evaluate(() => document.getElementById('playAgain').click());
    await page.waitForTimeout(200);
    out.again = await look();

    // 5. back to 1: a real round reports.
    await page.evaluate(() => { document.getElementById('levelBadge').click(); document.getElementById('practiceLevel').value = '1'; document.getElementById('practiceDone').click(); });
    await page.evaluate(async () => {
      window.__tap(document.getElementById('stage'));
      while (state.slabs.length < 7) state.slabs.push({});
      gameOver(); await new Promise(r => setTimeout(r, END_DELAY_MS + 300));
    });
    out.realEnd = await page.evaluate(() => ({ startLevel: state.startLevel, reported: window.__reported.slice(), notes: window.__notes, title: document.getElementById('endWord').textContent }));

    // 6. a relaunch forgets the pick (2026-10-18): set 50, reload, the badge is Level 1 again.
    await page.evaluate(() => { document.getElementById('playAgain').click(); });
    await page.waitForTimeout(200);
    await page.evaluate(() => { document.getElementById('levelBadge').click(); document.getElementById('practiceLevel').value = '50'; document.getElementById('practiceDone').click(); });
    await page.reload(); await page.waitForTimeout(400);
    out.relaunched = await look();
    out.errors = errors;
  } finally {
    await browser.close();
  }
  console.log(JSON.stringify(out, null, 1));
  const ok = out.fresh.badge === 'Level 1' && out.fresh.badgeShown && !out.fresh.panelShown && out.fresh.phase === 'ready'
    && out.opened.phase === 'ready' && out.opened.panelShown && out.options === 21 && out.firstOptions === '1,10,20' && out.lastOptions === '170,180,190,200'
    && out.picked.badge === 'Level 50' && !out.picked.panelShown && out.picked.saved === null && out.picked.chosen === 50
    && out.cancelled.badge === 'Level 50' && !out.cancelled.panelShown && out.cancelled.chosen === 50
    && out.relaunched.badge === 'Level 1' && out.relaunched.chosen === 1
    && out.practice.phase === 'playing' && !out.practice.badgeShown && out.practice.startLevel === 50 && out.practice.count === 50
    && out.practice.speed === out.practice.expectedSpeed && out.practice.preEarned === '50,45,40,35,30,25,20,15,10,5'
    && out.afterDrop.count === 51 && out.afterDrop.pop === '51' && out.afterDrop.banner === ''
    && out.practiceEnd.place === 1 && out.practiceEnd.reported.join() === '51' && out.practiceEnd.notes === 'Space Needle,**CHEAT**'
    && out.practiceEnd.title === 'SPACE NEEDLE' && out.practiceEnd.gold && !out.practiceEnd.green && out.practiceEnd.best === '51'
    && out.again.phase === 'ready' && out.again.startShown && out.again.badgeShown && out.again.badge === 'Level 50'
    && out.realEnd.startLevel === 1 && out.realEnd.reported.join() === '51,7' && out.realEnd.notes === '' && !out.realEnd.title.includes('CHEAT')
    && out.errors.length === 0;
  console.log(ok ? 'STARTLEVEL OK' : 'STARTLEVEL FAILED');
})();
