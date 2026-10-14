const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('C:/Users/johnp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  for (const autoplay of [true, false, 'missing']) {
    const browser = await chromium.launch({ headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', args:autoplay ? ['--autoplay-policy=no-user-gesture-required'] : ['--autoplay-policy=user-gesture-required'] });
    try {
      const page = await browser.newPage({viewport:{width:338,height:526},reducedMotion:'reduce'});
      const errors=[];page.on('pageerror',error=>errors.push(error.message));
      await page.addInitScript(missing => {
        window.audioClips=[];window.audioRamps=[];
        const NativeAudio=Audio;
        window.Audio=function(...args){if(missing && args[0]?.endsWith('game-over-music.mp3')) args[0]='./assets/sounds/missing-test-music.mp3';const clip=new NativeAudio(...args);audioClips.push(clip);return clip;};
        window.Audio.prototype=NativeAudio.prototype;
        const ramp=AudioParam.prototype.linearRampToValueAtTime;
        AudioParam.prototype.linearRampToValueAtTime=function(value,time){if(value===.5)window.musicGainParam=this;audioRamps.push({value,time});return ramp.call(this,value,time);};
      }, autoplay === 'missing');
      await page.goto('file:///'+path.resolve(__dirname,'../../index.html').replaceAll('\\','/'));
      await page.waitForFunction(()=>document.getElementById('dialogAction').textContent==="Let's play" && !document.getElementById('dialogAction').disabled);
      if (autoplay === 'missing') {
        assert((await page.evaluate(()=>CandyPreload.failures)).some(url=>url.endsWith('missing-test-music.mp3')));
        await page.locator('#dialogAction').click();
        assert(await page.locator('#overlay').isHidden());
        assert.deepEqual(errors,[]);
        continue;
      }
      if (!autoplay) await page.locator('#dialogTitle').click();
      await page.waitForFunction(()=>audioRamps.some(ramp=>ramp.value===.5));
      const music=await page.evaluate(()=>{const clip=audioClips.find(clip=>clip.src.endsWith('game-over-music.mp3'));return{loop:clip.loop,paused:clip.paused,ready:clip.readyState,duration:clip.duration};});
      assert.equal(music.loop,true);assert.equal(music.paused,false);assert(music.ready>=3);assert(music.duration>280);
      await page.waitForTimeout(3200);
      await page.screenshot({path:path.join(__dirname,autoplay?'welcome-music-playing-mode.png':'welcome-music-tap-mode.png')});
      await page.locator('#dialogAction').click();
      assert(await page.locator('#overlay').isHidden());
      assert((await page.evaluate(()=>audioRamps)).some(ramp=>ramp.value===0));
      assert.equal(await page.evaluate(()=>audioClips.find(clip=>clip.src.endsWith('game-over-music.mp3')).paused),false,'Music keeps playing during fade');
      await page.waitForTimeout(300);
      assert(await page.evaluate(()=>musicGainParam.value)>.3,'Fade starts from audible level');
      await page.waitForTimeout(700);
      const halfwayGain=await page.evaluate(()=>musicGainParam.value);
      assert(halfwayGain>.1 && halfwayGain<.35,'Music becomes quieter halfway through fade');
      await page.waitForFunction(()=>audioClips.find(clip=>clip.src.endsWith('game-over-music.mp3')).paused);
      const savedPosition = await page.evaluate(()=>audioClips.find(clip=>clip.src.endsWith('game-over-music.mp3')).currentTime);
      assert(savedPosition>0,'Fade-out preserves music position');
      // UI playback remains available after fading music out.
      await page.locator('#playerNext').click();
      if (autoplay === true) {
        await page.locator('#rulesButton').click();
        assert(await page.evaluate(()=>audioClips.find(clip=>clip.src.endsWith('game-over-music.mp3')).currentTime)>=savedPosition,'Rules resumes saved position');
        await page.waitForFunction(()=>!audioClips.find(clip=>clip.src.endsWith('game-over-music.mp3')).paused);
        await page.waitForTimeout(3200);
        assert(await page.evaluate(()=>musicGainParam.value)>.45);
        await page.locator('#dialogAction').click();
        await page.waitForTimeout(300);
        assert(await page.evaluate(()=>musicGainParam.value)>.3);
        await page.waitForFunction(()=>audioClips.find(clip=>clip.src.endsWith('game-over-music.mp3')).paused);
        for (const button of ['#dialogCancel', '#dialogAction']) {
          const previousPosition = await page.evaluate(()=>audioClips.find(clip=>clip.src.endsWith('game-over-music.mp3')).currentTime);
          await page.locator('#newGame').click();
          assert(await page.evaluate(()=>audioClips.find(clip=>clip.src.endsWith('game-over-music.mp3')).currentTime)>=previousPosition,'New-round prompt resumes saved position');
          assert(await page.locator('#overlay').evaluate(node=>node.classList.contains('new-round')));
          await page.waitForFunction(()=>!audioClips.find(clip=>clip.src.endsWith('game-over-music.mp3')).paused);
          await page.waitForTimeout(3200);
          assert(await page.evaluate(()=>musicGainParam.value)>.45);
          await page.locator(button).click();
          assert(await page.locator('#overlay').isHidden());
          await page.waitForTimeout(300);
          assert(await page.evaluate(()=>musicGainParam.value)>.3);
          await page.waitForFunction(()=>audioClips.find(clip=>clip.src.endsWith('game-over-music.mp3')).paused);
        }
      }
      assert.deepEqual(errors,[]);
      await page.close();
    } finally {await browser.close();}
  }
  console.log('PASS: music readiness/button, looping, fade-in/out, gameplay entry and restricted-autoplay tap fallback.');
})().catch(error=>{console.error(error);process.exitCode=1;});
