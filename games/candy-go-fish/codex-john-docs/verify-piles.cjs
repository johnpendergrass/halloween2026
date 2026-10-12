const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const config = require('../assets/json/game-config.json');
const startRound = require('./start-round.cjs');
(async () => {
 const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try {
  const page = await browser.newPage({viewport:{width:338,height:526}});
  const errors = []; page.on('pageerror',e=>errors.push(e.message));
  const fast=structuredClone(config); Object.assign(fast.appearance,{thinkingMs:40,quoteFadeMs:40,quoteHoldMs:40,playerRequestHoldMs:40});
  await page.route('**/game-config.json*',route=>route.fulfill({json:fast}));
  for (const actor of ['human','wendy']) for (const match of [true,false]) {
   await page.goto('http://127.0.0.1:8098/games/candy-go-fish/index.html');
   await page.locator('#humanSlots .slot').last().waitFor();
   const expected = await page.evaluate(({actor,match})=>{
    const types=CandyConfig.candies.map(c=>c.id);
    CandyEngine.create=()=>{
     const state={pile:types.slice(4).map((type,i)=>({id:'d'+i,type})),hands:{human:[{id:'h1',type:types[0]},{id:'h2',type:types[1]}],wendy:[{id:'w1',type:match?types[0]:types[2]},{id:'w2',type:types[3]}]},sets:{human:[],wendy:[]},turn:actor,pending:null,finished:false,copies:3,typeCount:10,history:[]};
     window.fixture=state; return state;
    };
    WendyPlayer.choose=()=>types[match?0:2];
    const animate=Element.prototype.animate;window.flights=[];
    Element.prototype.animate=function(frames,options){if(this.classList.contains('flying-candy'))window.flights.push({frames,src:this.getAttribute('src')});return animate.call(this,frames,options);};
    return CandyConfig.candies[match?0:4].image;
   },{actor,match});
   await startRound(page, actor);
   if(actor==='human')await page.locator('#humanSlots .slot.available').first().click();
   await page.waitForFunction(match=>match?!!document.querySelector('#yesReply')&&!document.querySelector('#yesReply').disabled:!document.querySelector('#fishButton').disabled,match);
   const before=await page.evaluate(()=>({dish:fixture.pile.length,wendy:fixture.hands.wendy.length}));
   await page.locator('#centerCircle').click();
   await page.locator('.flying-candy').waitFor();
   const flight=await page.evaluate(()=>flights.at(-1));
   if(actor==='wendy'&&!match){
    assert(flight.src.includes('/generic-candies/'));
    const scale=Number(flight.frames.at(-1).transform.match(/scale\(([^)]+)\)/)[1]);
    assert(Math.abs(scale-(20*.45)/(21*.78))<1e-6,'Private draw lands at Wendy size');
   } else assert.equal(flight.src,'./assets/candybar-images/'+expected,'Public transfers show actual candy');
   await page.locator('.flying-candy').waitFor({state:'detached'});
   const counts=await page.evaluate(()=>({dish:document.querySelectorAll('#centerCircle .pile-candy').length,wendy:document.querySelectorAll('#wendyPile .pile-candy').length}));
   assert.equal(counts.dish,before.dish-(match?0:1));
   assert.equal(counts.wendy,before.wendy+(match?(actor==='wendy'?1:-1):(actor==='wendy'?1:0)));
  }
  await page.evaluate(()=>{
   const piles=CandyPiles(),cards=[{id:'one'},{id:'two'},{id:'three'},{id:'survivor'}],state={pile:[],hands:{human:[],wendy:cards}};
   piles.render(state);const original=document.querySelector('[data-card-id="survivor"]').getAttribute('style');
   state.hands.wendy=[cards[3]];piles.render(state);
   if(document.querySelectorAll('#wendyPile .pile-candy').length!==1)throw Error('Set cards not removed');
   if(document.querySelector('[data-card-id="survivor"]').getAttribute('style')!==original)throw Error('Survivor rearranged');
  });
  assert.deepEqual(errors,[]);
  console.log('PASS: Actual candy flights for requests/player draws, private Wendy wrapper landing scale, pile counts and stable survivors after sets.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
