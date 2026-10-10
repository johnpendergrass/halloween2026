const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
 const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try {
  for (const trigger of ['#fishButton', '#centerCircle']) {
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
   assert.match(await page.locator('.go-fish-reply').textContent(), /Wendy said:.*NO, GO FISH!/);
   await page.waitForFunction(()=>!document.querySelector('#fishButton').disabled);
   assert.match(await page.locator('#fishButton').textContent(), /Wendy said:.*NO, GO FISH!/);
   assert.equal((await page.locator('#message').textContent()).trim(),'');
   assert.equal(await page.locator('#centerCircle').isEnabled(),true);
   assert(await page.evaluate(() => document.querySelector('#fishButton').getBoundingClientRect().right < document.querySelector('#centerCircle').getBoundingClientRect().left), 'Opponent reply appears left of the Candy Dish');
   const boxStyle = () => {
    const box=document.querySelector('#fishButton'), style=getComputedStyle(box);
    return [style.width,style.height,style.padding,style.backgroundColor,style.border,style.borderRadius,style.textAlign,
     ...[...box.children].flatMap(child=>{const s=getComputedStyle(child);return [s.fontSize,s.fontWeight,s.lineHeight,s.marginBottom];})];
   };
   const opponentStyle = await page.evaluate(boxStyle);
   await page.locator(trigger).click();
   await page.evaluate(() => { document.querySelector('#fishButton').click(); document.querySelector('#centerCircle').click(); });
   await page.waitForFunction(()=>window.testState.pile.length===2);
   assert.equal(await page.evaluate(()=>testState.hands.human.length),4);
   assert.equal(await page.evaluate(()=>testState.turn),'wendy');
   await page.waitForFunction(()=>!document.querySelector('#fishButton').disabled && document.querySelector('#fishButton').textContent.includes('Player said:'));
   assert.match(await page.locator('#fishButton').textContent(), /Player said:.*NO, GO FISH!/);
   assert.deepEqual(await page.evaluate(boxStyle),opponentStyle,'Both speakers use identical box and text formatting');
   assert(await page.evaluate(()=>document.querySelector('#fishButton').getBoundingClientRect().left > document.querySelector('#centerCircle').getBoundingClientRect().right),'Player reply remains on the right');
   assert.deepEqual(errors,[]);
   await page.close();
  }
  console.log('PASS: Go Fish reply arrives locked, button/dish each draw once, turn passes.');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
