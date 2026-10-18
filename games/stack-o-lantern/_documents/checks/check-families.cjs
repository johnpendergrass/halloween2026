/* Families check (2026-10-17): a round of 12 perfects then sloppy drops
   to a miss. Reads the banners, the end title (the HEIGHT level's name),
   the italic line under the count, the "You earned" row (up to three
   chips, accuracy / growth / bounce), the italics in a tip, then forces
   rows of 1, 2 and 3 of the longest names and screenshots them. Then a
   two-pumpkin round: the title must be a low word and the line one of
   the four old ones. Needs the no-cache server on 8098. */
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 650 }, isMobile: true, hasTouch: true });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.goto('http://127.0.0.1:8098/games/stack-o-lantern/index.html');
    await page.waitForTimeout(300);
    await page.evaluate(() => {
      window.__tap = () => document.getElementById('stage').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      window.__slabs = () => [...document.querySelectorAll('#tower .slab')]
        .map(s => ({ left: parseFloat(s.style.left), bottom: parseFloat(s.style.bottom), width: parseFloat(s.style.width) }))
        .sort((a, b) => b.bottom - a.bottom);
      window.__dropWhen = (test) => new Promise((resolve) => {
        const t0 = performance.now();
        function poll() {
          const s = window.__slabs();
          if (s.length < 2) { resolve('no mover'); return; }   // not in a round: say so instead of hanging
          if (test(Math.abs(s[0].left - s[1].left), s[0].width)) { window.__tap(); resolve(true); return; }
          if (performance.now() - t0 > 8000) { resolve(false); return; }
          requestAnimationFrame(poll);
        }
        requestAnimationFrame(poll);
      });
      window.__banners = []; window.__lastBanner = '';
      setInterval(() => {
        const m = document.getElementById('milestone');
        const t = m.hidden ? '' : document.getElementById('milestoneName').textContent + ' / ' + document.getElementById('milestoneWhat').innerHTML;
        if (t && t !== window.__lastBanner) { window.__banners.push(t); window.__lastBanner = t; }
        if (!t) window.__lastBanner = '';
      }, 50);
    });
    const out = {};
    out.goalLineHtml = await page.evaluate(() => new Promise((resolve) => setTimeout(() => resolve(document.getElementById('goalLine').innerHTML), 1500)));

    await page.evaluate(() => window.__tap());   // start
    for (let i = 0; i < 12; i++) { await page.evaluate(() => window.__dropWhen(d => d <= 0.9)); await page.waitForTimeout(100); }
    out.streaksAfter12 = await page.evaluate(() => ({ perfect: state.streak, clean: state.cleanStreak, cleanPerfect: state.cleanPerfectStreak, growth: state.growthStreak, earned: state.earned.map(e => e.name) }));
    for (let i = 0; i < 12; i++) {
      await page.evaluate(() => window.__dropWhen(d => d > 25)); await page.waitForTimeout(150);
      if (await page.evaluate(() => state.phase === 'over')) break;
    }
    await page.waitForTimeout(3000);   // the banner queue drains; the end screen is up
    out.banners = await page.evaluate(() => window.__banners);
    out.realEnd = await page.evaluate(() => {
      const vw = innerWidth / 100;
      return {
        count: stackedCount(),
        title: document.getElementById('endWord').textContent,
        flash: document.getElementById('reactionWord').textContent,
        heading: document.querySelector('#endMilestones p').textContent,
        compareHtml: document.getElementById('endCompare').innerHTML,
        compareBox: (() => { const r = document.getElementById('endCompare').getBoundingClientRect(); return { h: +(r.height / vw).toFixed(1), lines: Math.round(r.height / (4.5 * vw * 1.35)) }; })(),
        earned: state.earned.map(e => e.name),
        chips: [...document.querySelectorAll('.milestone-chip')].map(c => c.textContent),
        places: [...document.querySelectorAll('.milestone-chip')].map(c => c.style.left + ' ' + c.style.top),
      };
    });
    await page.screenshot({ path: path.join(__dirname, 'families-real.png') });

    // Tap the first chip: the bubble must carry <i>perfect</i> when the tip has it.
    const chip = page.locator('.milestone-chip').first();
    await chip.tap(); await page.waitForTimeout(250);
    out.tipHtml = await page.evaluate(() => document.getElementById('milestoneTip').hidden ? 'hidden' : document.getElementById('milestoneTip').innerHTML);
    await page.screenshot({ path: path.join(__dirname, 'families-tip.png') });
    await page.locator('#endCompare').tap(); await page.waitForTimeout(150);

    // Force the longest names into rows of 1, 2 and 3 and measure them.
    out.layouts = {};
    for (const n of [1, 2, 3]) {
      const info = await page.evaluate((n) => {
        const names = ['Eye of the Needle', 'Pumpkin Farmer', 'Sharpshooter'];
        fillMilestoneRow(names.slice(0, n).map(name => MILESTONES.find(m => m.name === name)));
        document.getElementById('endWord').textContent = 'SHANGHAI TOWER';
        const vw = innerWidth / 100;
        const stageTop = document.getElementById('stage').getBoundingClientRect().top;
        const chips = [...document.querySelectorAll('.milestone-chip')].map(c => {
          const r = c.getBoundingClientRect();
          return { name: c.textContent, l: +(r.left / vw).toFixed(1), r: +(r.right / vw).toFixed(1), cy: +((r.top + r.height / 2 - stageTop) / vw).toFixed(1), w: +(r.width / vw).toFixed(1), h: +(r.height / vw).toFixed(1), font: getComputedStyle(c).fontSize };
        });
        const title = document.getElementById('endWord').getBoundingClientRect();   // the framed word
        const heading = document.querySelector('#endMilestones p').getBoundingClientRect();
        const row = document.getElementById('endMilestoneList').getBoundingClientRect();
        const btn = document.getElementById('playAgain').getBoundingClientRect();
        return { chips, titleBox: { l: +(title.left / vw).toFixed(1), r: +(title.right / vw).toFixed(1), t: +((title.top - stageTop) / vw).toFixed(1), b: +((title.bottom - stageTop) / vw).toFixed(1) }, headingBottomVw: +((heading.bottom - stageTop) / vw).toFixed(1), rowTopVw: +((row.top - stageTop) / vw).toFixed(1), rowBottomVw: +((row.bottom - stageTop) / vw).toFixed(1), buttonTopVw: +((btn.top - stageTop) / vw).toFixed(1) };
      }, n);
      out.layouts[n] = info;
      await page.screenshot({ path: path.join(__dirname, `families-row-${n}.png`) });
    }

    // A two-pumpkin round: no level, so the title is a low word. Stack
    // again goes to the welcome screen (since 2026-10-17); a tap starts.
    await page.locator('#playAgain').tap(); await page.waitForTimeout(200);
    await page.evaluate(() => window.__tap()); await page.waitForTimeout(100);
    for (let i = 0; i < 2; i++) { await page.evaluate(() => window.__dropWhen(d => d <= 0.9)); await page.waitForTimeout(100); }
    for (let i = 0; i < 12; i++) {
      await page.evaluate(() => window.__dropWhen(d => d > 25)); await page.waitForTimeout(150);
      if (await page.evaluate(() => state.phase === 'over')) break;
    }
    await page.waitForTimeout(1500);
    out.lowEnd = await page.evaluate(() => ({
      count: stackedCount(),
      title: document.getElementById('endWord').textContent,
      flash: document.getElementById('reactionWord').textContent,
      compare: document.getElementById('endCompare').textContent,
      earned: state.earned.map(e => e.name),
      milestonesHidden: document.getElementById('endMilestones').hidden,
    }));
    await page.screenshot({ path: path.join(__dirname, 'families-low.png') });

    // A third round that beats the first: the number glows, the balloon
    // shows, the moon glows; all three go at the next start.
    await page.locator('#playAgain').tap(); await page.waitForTimeout(200);
    await page.evaluate(() => window.__tap()); await page.waitForTimeout(100);
    out.duringPlay = await page.evaluate(() => ({ balloon: document.getElementById('newBest').hidden ? 'hidden' : 'shown', over: document.getElementById('stage').classList.contains('is-glowing') }));
    for (let i = 0; i < 15; i++) { await page.evaluate(() => window.__dropWhen(d => d <= 0.9)); await page.waitForTimeout(100); }
    for (let i = 0; i < 12; i++) {
      await page.evaluate(() => window.__dropWhen(d => d > 25)); await page.waitForTimeout(150);
      if (await page.evaluate(() => state.phase === 'over')) break;
    }
    await page.waitForTimeout(1500);
    out.newBestEnd = await page.evaluate(() => {
      const vw = innerWidth / 100;
      const r = document.getElementById('newBest').getBoundingClientRect();
      const b = document.getElementById('bestBox').getBoundingClientRect();
      return {
        count: stackedCount(), best: document.getElementById('best').textContent,
        glow: document.getElementById('bestBox').classList.contains('is-new-best'),
        balloon: document.getElementById('newBest').hidden ? 'hidden' : 'shown',
        balloonBox: { l: +(r.left / vw).toFixed(1), r: +(r.right / vw).toFixed(1), t: +(r.top / vw).toFixed(1) },
        bestBox: { l: +(b.left / vw).toFixed(1), r: +(b.right / vw).toFixed(1), text: document.getElementById('bestBox').textContent.replace(/\s+/g, ' ') },
        moonShadow: getComputedStyle(document.getElementById('moon')).boxShadow.slice(0, 60),
        over: document.getElementById('stage').classList.contains('is-glowing'),
      };
    });
    await page.screenshot({ path: path.join(__dirname, 'families-newbest.png') });

    // The end screen's minute: a tap on it re-arms the wait; when the wait
    // runs out (called directly here, 60 s is too long to sit through) the
    // welcome screen is back, the high score stays, the glow and balloon go.
    await page.evaluate(() => { window.__timerBefore = endTimer; });
    await page.locator('#endCompare').tap(); await page.waitForTimeout(100);
    out.endTimer = await page.evaluate(() => ({ armed: endTimer !== 0, reArmedByTap: endTimer !== window.__timerBefore }));
    await page.evaluate(() => backToStart()); await page.waitForTimeout(300);
    out.afterTimeout = await page.evaluate(() => ({
      phase: state.phase, startShown: !document.getElementById('startScreen').hidden, endShown: !document.getElementById('endScreen').hidden,
      best: document.getElementById('best').textContent, glow: document.getElementById('bestBox').classList.contains('is-new-best'),
      balloon: document.getElementById('newBest').hidden ? 'hidden' : 'shown', glowing: document.getElementById('stage').classList.contains('is-glowing'),
      slabs: document.querySelectorAll('#tower .slab').length,
    }));
    await page.screenshot({ path: path.join(__dirname, 'families-backtostart.png') });
    out.errors = errors;
    console.log(JSON.stringify(out, null, 1));
  } finally { await browser.close(); }
})();
