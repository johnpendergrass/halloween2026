const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
async function clickMiddle(page, selector) {
 const target=page.locator(selector); assert(await target.isEnabled());
 const box=await target.boundingBox(); assert(box);
 // A breathing target intentionally never satisfies Playwright's stable-box wait.
 await page.mouse.click(box.x+box.width/2,box.y+box.height/2);
}
(async () => {
 const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try {
  for (const trigger of ['#fishButton', '#centerCircle', 'question']) {
   const page = await browser.newPage({viewport:{width:338,height:526}});
   const errors=[]; page.on('pageerror', e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8098/games/candy-go-fish/index.html');
   await page.locator('#humanSlots .slot').last().waitFor();
   await page.evaluate(() => {
    const create=CandyEngine.create;
    CandyEngine.create = config => {
     const state=create(config), types=config.layout.slotOrder;
     state.hands.human=[{type:types[0]},{type:types[0]},{type:types[1]}];
     state.hands.wendy=[{type:types[2]},{type:types[2]},{type:types[3]}];
     state.sets={human:[],wendy:[]}; state.pile=[{type:types[4]},{type:types[5]},{type:types[6]}];
     state.turn='human'; state.finished=false; state.pending=null;
     window.testState=state; return state;
    };
   });
   await page.locator('#dialogAction').click();
   await page.locator('#humanSlots .available').first().click();
   await page.locator('#askButton').click();
   await page.locator('.go-fish-reply').waitFor();
   assert(await page.locator('#fishButton').isDisabled());
   assert(await page.locator('#centerCircle').isDisabled());
   assert.match(await page.locator('.go-fish-reply').textContent(), /Wendy says:.*NO, GO FISH!/);
   await page.waitForFunction(()=>!document.querySelector('#fishButton').disabled);
   assert.match(await page.locator('#fishButton').textContent(), /Wendy says:.*NO, GO FISH!/);
   assert.equal((await page.locator('#message').textContent()).trim(),'');
   assert.equal(await page.locator('#centerCircle').isEnabled(),true);
   assert(await page.evaluate(() => document.querySelector('#fishButton').getBoundingClientRect().right < document.querySelector('#centerCircle').getBoundingClientRect().left), 'Opponent reply appears left of the Candy Dish');
   const boxStyle = () => {
    const box=document.querySelector('#fishButton'), style=getComputedStyle(box);
    return [style.width,style.height,style.padding,style.backgroundColor,style.border,style.borderRadius,style.textAlign,
     ...[...box.children].flatMap(child=>{const s=getComputedStyle(child);return [s.fontSize,s.fontWeight,s.lineHeight,s.marginBottom];})];
   };
   assert.equal(await page.locator('#fishButton').evaluate(box=>getComputedStyle(box).animationName),'reply-breathe-intro, no-reply-breathe');
   assert.equal(await page.locator('#fishButton').evaluate(box=>getComputedStyle(box).animationDuration),'1s, 1s');
   assert.equal(await page.locator('#fishButton').evaluate(box=>getComputedStyle(box).animationDelay),'0.5s, 1.5s');
   const samples=await page.locator('#fishButton').evaluate(box=>{
    const animations=box.getAnimations(); animations.forEach(a=>a.pause());
    return [400,1000,1500].map(time=>{animations.forEach(a=>a.currentTime=time);return new DOMMatrix(getComputedStyle(box).transform).a;});
   });
   assert(Math.abs(samples[0]-1)<0.001,'Half-second delay holds natural size');
   assert(samples[1]>1 && samples[1]<1.04,'First swell eases in');
   assert(Math.abs(samples[2]-1.04)<0.001,'Full intensity remains four percent');
   // Freeze at the natural size while comparing box geometry / taking screenshots.
   await page.locator('#fishButton').evaluate(box=>box.getAnimations().forEach(animation=>{animation.pause();animation.currentTime=0;}));
   const opponentStyle = await page.evaluate(boxStyle);
   assert.equal(await page.locator('#fishButton').evaluate(box=>getComputedStyle(box).backgroundColor),'rgb(239, 163, 154)');
   assert(await page.locator('#fishButton').evaluate(box=>parseFloat(getComputedStyle(box,'::before').top)<0),'Wendy tail points upward');
   if(trigger==='#fishButton')await page.screenshot({path:require('node:path').join(__dirname,'humanMiss-coral-tails.png')});
   await clickMiddle(page, trigger === 'question' ? '#askButton' : trigger);
   await page.evaluate(() => { document.querySelector('#fishButton').click(); document.querySelector('#centerCircle').click(); });
   await page.waitForFunction(()=>window.testState.pile.length===2);
   assert.equal(await page.evaluate(()=>testState.hands.human.length),4);
   assert.equal(await page.evaluate(()=>testState.turn),'wendy');
   await page.waitForFunction(()=>!document.querySelector('#fishButton').disabled && document.querySelector('#fishButton').textContent.includes('Player says:'));
   assert.match(await page.locator('#fishButton').textContent(), /Player says:.*NO, GO FISH!/);
   assert.equal(await page.locator('#fishButton').evaluate(box=>getComputedStyle(box).animationName),'reply-breathe-intro, no-reply-breathe');
   await page.locator('#fishButton').evaluate(box=>box.getAnimations().forEach(animation=>{animation.pause();animation.currentTime=0;}));
   assert.deepEqual(await page.evaluate(boxStyle),opponentStyle,'Both speakers use identical box and text formatting');
   assert(await page.evaluate(()=>document.querySelector('#fishButton').getBoundingClientRect().left > document.querySelector('#centerCircle').getBoundingClientRect().right),'Player reply remains on the right');
   assert(await page.locator('#fishButton').evaluate(box=>parseFloat(getComputedStyle(box,'::before').bottom)<0),'Player tail points downward');
   if(trigger==='#fishButton')await page.screenshot({path:require('node:path').join(__dirname,'wendyMiss-coral-tails.png')});
   assert(await page.locator('#centerCircle').isEnabled(),'Dish also starts Wendy fishing');
   assert.match(await page.locator('#centerCircle').getAttribute('aria-label'),/acknowledge and continue/);
   assert.match(await page.locator('#message').textContent(),/Wendy asks:/,'Question stays until either draw action');
   await page.locator('#rulesButton').click();
   assert(await page.locator('#centerCircle').isDisabled(),'Dish is locked during Rules');
   assert(!(await page.locator('#fishButton').getAttribute('class')).includes('waiting-breath'),'Breathing stops during Rules');
   await page.locator('#dialogAction').click();
   assert.match(await page.locator('#message').textContent(),/Wendy asks:/,'Question survives Rules');
   if(trigger==='question') {
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await page.locator('#fishButton').evaluate(box=>getComputedStyle(box).animationName),'none','Reduced motion disables breathing');
    await page.emulateMedia({reducedMotion:'no-preference'});
   }
   const before=await page.evaluate(()=>testState.hands.wendy.length);
   await clickMiddle(page, trigger === 'question' ? '#message' : trigger);
   await page.evaluate(()=>{document.querySelector('#fishButton').click();document.querySelector('#centerCircle').click();});
   await page.waitForFunction(()=>window.testState.pile.length===1);
   assert.equal(await page.evaluate(()=>testState.hands.wendy.length),before+1,'Wendy receives exactly one candy');
   assert(!(await page.locator('#message').textContent()).includes('asks:'),'Question clears after initiating draw');
   assert(await page.locator('#fishButton').isHidden(),'Go Fish reply clears after initiating draw');
   assert(!(await page.locator('#fishButton').getAttribute('class')).includes('waiting-breath'),'Acknowledgement stops breathing');
   assert.deepEqual(errors,[]);
   await page.close();
  }
  console.log('PASS: Go Fish reply arrives locked, button/dish each draw once for either player; retained question and Rules locks.');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
