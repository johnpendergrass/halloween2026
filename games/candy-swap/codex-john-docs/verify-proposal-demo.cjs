const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
 const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try {
  for (const width of [320,390,430]) {
   const page = await browser.newPage({viewport:{width,height:844},hasTouch:true});
   const errors=[]; page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://localhost:8097/games/candy-swap/touch-preview.html');
   const frame=page.frames().find(f=>f.url().endsWith('/index.html'));
   await frame.waitForFunction(()=>slots.length===24);
   const profiles=await frame.evaluate(()=>characters.map(c=>c.preferences));
   for(const preferences of profiles) {
    assert.equal(preferences.length,3);
    assert.equal(new Set(preferences.map(p=>p.attribute)).size,3);
    assert.deepEqual(preferences.map(p=>p.level),['favorite','like','dislike']);
   }
   assert.equal(await frame.locator('#preferencePopup').count(),0);
   await frame.locator('.candy').first().tap();
   assert.equal(await frame.locator('.candy.selected').count(),1);
   await frame.locator('.kid.two').tap();
   assert.equal(await frame.locator('.candy.selected').count(),1);
   // Deterministic scoring fixtures separate from random game initialization.
   await frame.evaluate(()=>{
    characters[0].preferences=[{attribute:'chocolate',level:'favorite'},{attribute:'cookie',level:'like'},{attribute:'mint',level:'dislike'}];
    characters[1].preferences=[{attribute:'chewy',level:'favorite'},{attribute:'chocolate',level:'like'},{attribute:'gum',level:'dislike'}];
   });
   for (const kind of ['improve','even','decline']) {
    const before=await frame.evaluate(kind=>{
     resetTurn();
     const a=slots[0],b=slots[6]; let pair;
     for(const x of data.items) for(const y of data.items) {
      const da=itemValue(characters[0],y)-itemValue(characters[0],x);
      const db=itemValue(characters[1],x)-itemValue(characters[1],y);
      if(kind==='improve' ? da>=0&&db>=0&&da+db>0 : kind==='even' ? da===0&&db===0 : da<0||db<0) pair ||= [x,y];
     }
     if(!pair) throw Error('No fixture for '+kind);
     a.item={...a.item,...pair[0]}; b.item={...b.item,...pair[1]}; updateScores();
     selectCandy(a);selectCandy(b);
     return {names:[a.item.name,b.item.name],scores:[characterScore(0),characterScore(1)]};
    },kind);
    await frame.locator('#compareYes').tap();
    assert.equal(await frame.locator('#comparisonPanel').getAttribute('data-accepted'),String(kind!=='decline'));
    const after=await frame.evaluate(()=>({names:[slots[0].item.name,slots[6].item.name],scores:[characterScore(0),characterScore(1)]}));
    assert.deepEqual(after.names,kind==='decline'?before.names:[...before.names].reverse());
    if(kind==='decline') assert.deepEqual(after.scores,before.scores);
    else assert.ok(after.scores.every((s,i)=>s>=before.scores[i]));
    const rects=await frame.evaluate(()=>{const p=document.getElementById('comparisonPanel'),b=document.getElementById('nextProposal');return {bottom:b.getBoundingClientRect().bottom,panelBottom:p.getBoundingClientRect().bottom,scroll:p.scrollHeight,client:p.clientHeight};});
    assert.ok(rects.bottom<=rects.panelBottom+1,JSON.stringify(rects));
    if(width===390) await page.screenshot({path:__dirname+'/proposal-result-'+kind+'-390.png'});
    await frame.locator('#nextProposal').tap();
    assert.equal(await frame.locator('.candy.selected').count(),0);
    assert.equal(await frame.locator('#comparisonOverlay').isVisible(),false);
   }
   assert.deepEqual(errors,[]);
   if(width===390) await page.screenshot({path:__dirname+'/proposal-demo-390.png'});
   await page.close();
  }
  console.log('PASS: three phone widths; three distinct random preferences per character; no preference popup; selection preserved; accepted, even and declined proposals; scores, ownership and next-round reset.');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
