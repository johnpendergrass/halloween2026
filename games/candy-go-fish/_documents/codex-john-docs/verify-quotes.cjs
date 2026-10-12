const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 for(const scenarioSpec of ['wendyMiss','humanMiss','humanYes','humanYes:auto','humanYes:#centerCircle','humanYes:#askButton','wendyYes','wendyYes:auto','wendyYes:#heldOpponentQuestion','wendyYes:#centerCircle','wendySlot:arrival','wendySlot:answer','wendySlot:settled']){
  const [scenario,ackTrigger]=scenarioSpec.split(':');
  const page=await browser.newPage({viewport:{width:338,height:526}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  if(process.env.QUOTE_TIMER_LAG) await page.addInitScript(()=>{
    const timeout=window.setTimeout;
    window.setTimeout=(fn,ms,...args)=>timeout(fn,ms===40 && document.querySelector('.stationary-speech') ? 170 : ms,...args);
    window.finishedQuoteReplays=[];
    const play=Animation.prototype.play;
    Animation.prototype.play=function(){if(this.playState==='finished' && this.effect?.target?.matches('.stationary-speech'))window.finishedQuoteReplays.push(this.effect.target.className);return play.call(this);};
  });
  if(process.env.QUOTE_REDUCED_MOTION) await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:8098/games/candy-go-fish/index.html');await page.locator('#humanSlots .slot').last().waitFor();
  assert.equal(await page.locator('#quoteSpeed').count(),0);
  await page.evaluate(scenario=>{const create=CandyEngine.create;CandyEngine.create=config=>{const s=create(config),t=config.layout.slotOrder;s.hands.human=[{type:t[0]},{type:t[1]}];s.hands.wendy=[{type:(scenario.includes('Yes')||scenario==='wendySlot')?t[0]:t[2]},{type:t[3]}];s.sets={human:[],wendy:[]};s.pile=[{type:t[4]},{type:t[5]},{type:t[6]}];s.turn=scenario.startsWith('wendy')?'wendy':'human';s.finished=false;s.pending=null;[s.pile,s.hands.human,s.hands.wendy].forEach((cards,owner)=>cards.forEach((card,index)=>card.id=owner+'-'+index));window.testState=s;return s;};WendyPlayer.choose=hand=>hand[0].type;window.visuals=[];const animate=Element.prototype.animate;Element.prototype.animate=function(frames,options){window.visuals.push({classes:this.className,duration:options.duration,frames});return animate.call(this,frames,options);};},scenario);
  await require('./start-round.cjs')(page,scenario.startsWith('wendy')?'wendy':'human');const started=Date.now();
  if(scenario.startsWith('human'))await page.locator('#humanSlots .available').first().click();
  if(scenario==='wendyMiss'||scenario==='wendyYes') {
   await page.waitForFunction(()=>document.querySelector('#message').style.visibility!=='hidden' && document.querySelector('#message').textContent.includes('asks:') && !document.querySelector('.stationary-speech'));
   await page.waitForTimeout(600);
   assert(await page.locator('#fishButton').isHidden(),'No Go Fish answer before reading beat');
   if(scenario==='wendyMiss')assert.equal(await page.locator('#humanSlots .available').count(),0);
   assert.match(await page.locator('#message').textContent(),/asks:/);
  }
  if(scenario.endsWith('Miss')){
   await page.waitForFunction(()=>!document.querySelector('#fishButton').disabled);
   assert(Date.now()-started<5000,'Question/reply uses a one-second reading beat');
   assert.match(await page.locator('#fishButton').textContent(),/NO, GO FISH!/);
   if(scenario==='humanMiss') {
    assert(await page.locator('#askButton').isVisible(),'Human question stays alongside the No reply');
    assert(await page.locator('#askButton').isEnabled(),'Retained question can acknowledge the draw');
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
   const replyBox=await page.locator('#fishButton').boundingBox();await page.mouse.click(replyBox.x+replyBox.width/2,replyBox.y+replyBox.height/2);
   if(scenario==='wendyMiss')assert(!(await page.locator('#message').textContent()).includes('asks:'),'Question clears only after answering');
   if(scenario==='humanMiss')assert(await page.locator('#askButton').isHidden(),'Question clears when choosing to fish');
  }
  let yesReadyAt;
  if(scenario==='humanYes') {
   await page.waitForFunction(()=>document.querySelector('#message').style.visibility!=='hidden' && document.querySelector('#message').textContent.includes('Yes I do') && !document.querySelector('.stationary-speech'));
   assert(await page.locator('#askButton').isVisible(),'Player question remains beside Wendy Yes');
   assert.equal(await page.locator('#humanSlots .selected').count(),0,'Sent request does not highlight a disabled candy');
   assert(await page.locator('#askButton').isEnabled(),'Retained question can acknowledge Yes');
   await page.locator('#rulesButton').click();
   await page.waitForTimeout(1400);
   assert.equal(await page.locator('.flying-candy').count(),0,'Rules pauses the Yes reading beat');
   await page.locator('#dialogAction').click();
   assert(await page.locator('#askButton').isVisible(),'Question survives Rules redraw');
   yesReadyAt=Date.now();
   await page.waitForTimeout(1000);
   assert.match(await page.locator('#message').textContent(),/Wendy says:.*Yes I do/);
   assert(await page.locator('#askButton').isVisible(),'Both messages remain for the reading beat');
   assert.equal(await page.locator('.flying-candy').count(),0,'Candy waits for player confirmation');
   await page.waitForTimeout(1000);
   assert.equal(await page.locator('.flying-candy').count(),0,'No automatic transfer before four-second deadline');
   assert.equal(await page.locator('#message').evaluate(box=>getComputedStyle(box).animationName),'reply-breathe-intro, no-reply-breathe','Yes reply breathes during its wait');
   assert.deepEqual(await page.locator('#message').evaluate(box=>{const style=getComputedStyle(box);return [style.backgroundColor,style.color];}),['rgb(205, 235, 183)','rgb(0, 0, 0)'],'Both Yes speakers use light green and black');
   if(!ackTrigger)await page.screenshot({path:require('node:path').join(__dirname,scenario+'-green-reply.png')});
   if(ackTrigger!=='auto')await page.locator(ackTrigger || '#yesReply').evaluate(button=>{button.click();button.click();});
  }
  if(scenario==='wendyYes') {
   await page.locator('#heldOpponentQuestion').waitFor();
   assert.match(await page.locator('#heldOpponentQuestion').textContent(),/Wendy asks:/);
   await page.waitForFunction(()=>document.querySelector('#message').style.visibility!== 'hidden' && document.querySelector('#message').textContent.includes('Yes I do'));
   assert(await page.locator('#heldOpponentQuestion').isVisible(),'Wendy question stays while the player says Yes');
   assert.match(await page.locator('#message').textContent(),/Player says:.*Yes I do/);
   await page.locator('#rulesButton').click();await page.locator('#dialogAction').click();
   assert(await page.locator('#heldOpponentQuestion').isVisible(),'Question survives reply dialog pause');
   const before=await page.evaluate(()=>testState.hands.human.length);
   await page.waitForTimeout(1800);
   assert.equal(await page.locator('.flying-candy').count(),0,'Wendy receives nothing before four seconds');
   assert.equal(await page.evaluate(()=>testState.hands.human.length),before,'No engine transfer before four seconds or acknowledgement');
   assert(await page.locator('#heldOpponentQuestion').isVisible());
   assert.match(await page.locator('#message').textContent(),/Yes I do/);
   assert.equal(await page.locator('#humanSlots .available').count(),1,'Only the requested candy is a gift shortcut');
   assert.equal(await page.locator('#message').evaluate(box=>getComputedStyle(box).animationName),'reply-breathe-intro, no-reply-breathe','Yes reply breathes during its wait');
   assert.deepEqual(await page.locator('#message').evaluate(box=>{const style=getComputedStyle(box);return [style.backgroundColor,style.color];}),['rgb(205, 235, 183)','rgb(0, 0, 0)'],'Both Yes speakers use light green and black');
   if(!ackTrigger)await page.screenshot({path:require('node:path').join(__dirname,scenario+'-green-reply.png')});
   if(ackTrigger!=='auto')await page.locator(ackTrigger || '#yesReply').evaluate(button=>{button.click();button.click();});
  }
  let shortcutAt;
  if(scenario==='wendySlot') {
   await page.locator('#humanSlots .available').waitFor();
   if(ackTrigger!=='arrival') {
    await page.waitForFunction(()=>document.querySelector('#message').textContent.includes('Yes I do'));
    if(ackTrigger==='settled')await page.locator('#yesReply').waitFor();
   }
   shortcutAt=Date.now();
   await page.locator('#humanSlots .available').evaluate(button=>{button.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,button:0}));button.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,button:0}));});
  }
  await page.locator('.flying-candy,.flying-token').waitFor();
  if(scenario==='wendySlot') {
   assert(Date.now()-shortcutAt<600,'Grid tap skips quote waits and starts flight immediately');
   assert.equal(await page.locator('#heldOpponentQuestion').count(),0);
   assert.equal(await page.locator('#message').textContent(),'');
   assert.equal(await page.locator('.flying-candy').count(),1,'Repeated slot tap gives exactly one candy');
   assert.equal(await page.evaluate(()=>testState.hands.human.length),1);
  }

  if(scenario==='humanYes') {
   if(ackTrigger==='auto')assert(Date.now()-yesReadyAt>=3700,'Automatic departure waits about four active seconds');
   assert(await page.locator('#askButton').isHidden(),'Question clears at candy departure');
   assert.equal(await page.locator('.flying-candy').count(),1,'Repeated confirmation starts only one transfer');
   assert.equal(await page.locator('#message').textContent(),'','Yes reply clears during flight');
   assert(!(await page.locator('#message').getAttribute('class')).includes('waiting-breath'),'Yes breathing stops on departure');
  }
  if(scenario==='wendyYes')assert.equal(await page.locator('#heldOpponentQuestion').count(),0,'Question clears after the Yes answer finishes');
  const visuals=await page.evaluate(()=>window.visuals),quotes=visuals.filter(v=>v.classes.includes('speech'));
  assert(quotes.length>=1);assert(quotes.every(v=>v.duration===250));
  assert(quotes.every(v=>v.frames.every(f=>!f.transform)),'Quotes fade in place without floating or scaling');
  assert(!visuals.some(v=>v.duration===480 || v.duration===120),'No source bounce before candy departure');
  assert(visuals.some(v=>v.duration===(process.env.QUOTE_REDUCED_MOTION?80:1400)),'Candy travel timing stays unchanged');
  if(!process.env.QUOTE_REDUCED_MOTION) {
   const travel=visuals.find(v=>v.classes.split(' ').includes('flying-candy')||v.classes==='flying-token');
   const scale=frame=>Number(frame.transform.match(/scale\(([^)]+)\)/)[1]);
   assert.equal(scale(travel.frames[0]),1,'Candy starts at 100%');
   assert.equal(scale(travel.frames[20]),1.5,'Candy reaches 150% halfway');
   const landingScale=scenario==='wendyMiss' ? (20*.45)/(21*.78) : 1;
   assert(Math.abs(scale(travel.frames.at(-1))-landingScale)<.000001,'Candy finishes at destination size');
  }
  assert.equal(await page.locator('.flying-candy,.flying-token').evaluate(node=>node.getAnimations()[0].effect.getTiming().duration),process.env.QUOTE_REDUCED_MOTION?80:1400,'Candy travel retains its independent duration');
  if(process.env.QUOTE_TIMER_LAG)assert.deepEqual(await page.evaluate(()=>window.finishedQuoteReplays),[]);
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS: Questions, Yes and Go Fish replies for both speakers; candy timings unchanged.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
