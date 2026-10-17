const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 390, height: 693 }, isMobile: true, hasTouch: true });
  await page.goto('http://127.0.0.1:8098/games/stack-o-lantern/index.html');
  const out = await page.evaluate(() => {
    const names = MILESTONES.map(m => m.name);
    const span = document.createElement('span');
    span.style.cssText = 'position:absolute;white-space:nowrap;font-weight:700;font-family:Arial;visibility:hidden';
    document.body.appendChild(span);
    const vw = innerWidth / 100;
    const res = {};
    for (const size of [3.6, 3.3, 3.0]) {
      span.style.fontSize = size + 'vw';
      res[size] = names.map(n => { span.textContent = n; return n + '=' + (span.offsetWidth / vw).toFixed(1); }).join(', ');
    }
    res.stageH = document.getElementById('stage').getBoundingClientRect().height / vw;
    res.infoH = document.querySelector('.info-bar').getBoundingClientRect().height / vw;
    return res;
  });
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();
