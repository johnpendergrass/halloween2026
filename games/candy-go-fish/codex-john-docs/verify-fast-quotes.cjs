const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 for(const scenario of ['wendyMiss','humanMiss','humanYes','wendyYes','wendyTap']){
  const page=await browser.newPage({viewport:{width:338,height:526}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8098/games/candy-go-fish/index.html');await page.locator('#humanSlots .slot').last().waitFor();
  assert.equal(await page.locator('#quoteSpeed b').textContent(),'Slow');
  await page.evaluate(scenario=>{const create=CandyEngine.create;CandyEngine.create=config=>{const s=create(config),t=config.layout.slotOrder;s.hands.human=[{type:t[0]},{type:t[1]}];s.hands.wendy=[{type:(scenario.includes('Yes')||scenario==='wendyTap')?t[0]:t[2]},{type:t[3]}];s.sets={human:[],wendy:[]};s.pile=[{type:t[4]},{type:t[5]},{type:t[6]}];s.turn=scenario.startsWith('wendy')?'wendy':'human';s.finished=false;s.pending=null;window.testState=s;return s;};WendyPlayer.choose=hand=>hand[0].type;window.visuals=[];const animate=Element.prototype.animate;Element.prototype.animate=function(frames,options){window.visuals.push({classes:this.className,duration:options.duration,frames});return animate.call(this,frames,options);};},scenario);
  await page.locator('#dialogAction').click();await page.locator('#quoteSpeed').click();assert.equal(await page.locator('#quoteSpeed b').textContent(),'Fast');const started=Date.now();
  if(scenario.startsWith('human'))await page.locator('#humanSlots .available').first().click();
  if(scenario==='wendyMiss'||scenario==='wendyYes') {
   await page.waitForFunction(()=>document.querySelector('#message').style.visibility!=='hidden' && document.querySelector('#message').textContent.includes('asks:') && !document.querySelector('.flying-speech'));
   await page.waitForTimeout(600);
   assert(await page.locator('#fishButton').isHidden(),'No Go Fish answer before reading beat');
   if(scenario==='wendyMiss')assert.equal(await page.locator('#humanSlots .available').count(),0);
   assert.match(await page.locator('#message').textContent(),/asks:/);
  }
  if(scenario.endsWith('Miss')){
   await page.waitForFunction(()=>!document.querySelector('#fishButton').disabled);
   assert(Date.now()-started<5000,'Fast question/reply uses a one-second reading beat');
   assert.match(await page.locator('#fishButton').textContent(),/NO, GO FISH!/);
   if(scenario==='humanMiss') {
    assert(await page.locator('#askButton').isVisible(),'Human question stays alongside the No reply');
    assert(await page.locator('#askButton').isDisabled(),'Retained question cannot send a duplicate request');
    await page.waitForTimeout(600);
    assert(await page.locator('#askButton').isVisible(),'Question stays until drawing');
   }
   if(scenario==='wendyMiss') {
    assert(await page.locator('#message').isVisible());
    assert.match(await page.locator('#message').textContent(),/Wendy asks:/,'Wendy question stays beside the No button');
    await page.waitForTimeout(700);
    assert.match(await page.locator('#message').textContent(),/Wendy asks:/);
    await page.locator('#rulesButton').click();await page.locator('#dialogAction').click();
    assert.match(await page.locator('#message').textContent(),/Wendy asks:/,'Question survives dialog redraw');
   }
   await page.locator('#fishButton').click();
   if(scenario==='wendyMiss')assert(!(await page.locator('#message').textContent()).includes('asks:'),'Question clears only after answering');
   if(scenario==='humanMiss')assert(await page.locator('#askButton').isHidden(),'Question clears when choosing to fish');
  }
  let tappedAt;
  if(scenario==='wendyTap') {
   await page.locator('#humanSlots .available').first().waitFor();
   tappedAt=Date.now();await page.locator('#humanSlots .available').first().click();
  }
  if(scenario==='wendyYes') {
   await page.locator('#heldOpponentQuestion').waitFor();
   assert.match(await page.locator('#heldOpponentQuestion').textContent(),/Wendy asks:/);
   await page.waitForFunction(()=>document.querySelector('#message').style.visibility!== 'hidden' && document.querySelector('#message').textContent.includes('Yes I do'));
   assert(await page.locator('#heldOpponentQuestion').isVisible(),'Wendy question stays while the player says Yes');
   assert.match(await page.locator('#message').textContent(),/Player said:.*Yes I do/);
   await page.locator('#rulesButton').click();await page.locator('#dialogAction').click();
   assert(await page.locator('#heldOpponentQuestion').isVisible(),'Question survives reply dialog pause');
  }
  await page.locator('.flying-candy,.flying-token').waitFor();
  if(scenario==='wendyYes')assert.equal(await page.locator('#heldOpponentQuestion').count(),0,'Question clears after the Yes answer finishes');
  if(scenario==='wendyTap') {
   assert(Date.now()-tappedAt<700,'Manual Fast gift starts immediately');
   assert.match(await page.locator('#message').textContent(),/Player said:.*Yes I do/);
   assert(await page.locator('#heldOpponentQuestion').isVisible());
  }
  const visuals=await page.evaluate(()=>window.visuals),quotes=visuals.filter(v=>v.classes.includes('speech'));
  assert(quotes.length>=1);assert(quotes.every(v=>v.duration===250));
  assert(quotes.every(v=>v.frames.every(f=>!f.transform)),'Fast quotes fade in place without floating or scaling');
  if(scenario!=='wendyTap')assert(visuals.some(v=>v.duration===480),'Automatic candy pulse timing stays unchanged');
  else assert(!visuals.some(v=>v.duration===480),'Manual Fast gift skips source pulse delay');
  assert(visuals.some(v=>v.duration===1400),'Candy travel timing stays unchanged');
  await page.locator('#quoteSpeed').click();assert.equal(await page.locator('#quoteSpeed b').textContent(),'Slow');
  assert.equal(await page.locator('.flying-candy,.flying-token').evaluate(node=>node.getAnimations()[0].effect.getTiming().duration),1400,'Toggling quote speed during candy travel does not change it');
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS: Fast questions, Yes and Go Fish replies for both speakers; candy timings unchanged.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
