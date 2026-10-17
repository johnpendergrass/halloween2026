const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 650 }, isMobile: true, hasTouch: true });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:8098/games/stack-o-lantern/index.html');
    await page.waitForTimeout(400);
    const hint = () => page.evaluate(() => document.getElementById('modeHint').hidden ? 'hidden' : document.getElementById('modeHint').textContent);
    const out = {};
    out.atStart = await hint();
    await page.screenshot({ path: path.join(__dirname, 'modenote-start.png') });
    await page.locator('#modeSwitch').tap(); await page.waitForTimeout(200);
    out.afterToggle = await hint();
    await page.locator('#modeSwitch').tap(); await page.waitForTimeout(200);
    out.afterToggleBack = await hint();
    await page.evaluate(() => document.getElementById('stage').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
    await page.waitForTimeout(200);
    out.afterStart = await hint();
    out.phase = await page.evaluate(() => state.phase);
    out.errors = errors;
    console.log(JSON.stringify(out));
  } finally { await browser.close(); }
})();
