/* Game-owned audio gateway. A future global sound switch can call setEnabled. */
//
// Two kinds of sound live here (John's iPhone, 2026-10-15/16):
//
// - UI clips and speech (arrows, set fanfares, "goes first", victory, tie)
//   are DECODED BUFFERS. At startup each short MP3 is fetched and decoded
//   into raw samples (an AudioBuffer); playing one makes a throwaway
//   AudioBufferSourceNode, exactly like the spinner ticks. The phone's
//   audio engine, once a tap has woken it, plays these whenever the game
//   asks, with no tap required: a timer-started voice works. Media
//   elements (new Audio) did not: iOS only let each of them start inside
//   a tap, and sometimes not even then.
// - The three soundtracks stay MEDIA ELEMENTS (they are minutes long; a
//   decoded copy would be tens of MB each). They are only ever asked to
//   play inside a tap, and every tap during play retries a stalled one.
(() => {
  'use strict';
  const characterSounds = {
    Ron: 'switch-to-ron-or-boo', Boo: 'switch-to-ron-or-boo',
    Harry: 'switch-to-harry-or-mike', Mike: 'switch-to-harry-or-mike',
    Hermione: 'switch-to-hermione-or-sully', Sully: 'switch-to-hermione-or-sully'
  };
  // Music clips only (media elements routed through the engine).
  const clips = new Map();
  // Decoded UI clips and speeches, by sound key (see assetMap).
  const buffers = new Map();
  // Decodes in flight or finished, by sound key: a promise of the buffer,
  // or of null when the fetch or the decode failed.
  const decodes = new Map();
  // Every UI sound that is playing right now (a "voice": one source node).
  const voices = new Set();
  // Gain of each UI sound (clips, speeches, the spinner tick): 0 = silent,
  // 1 = the file's full level. Was 0.5 until 2026-10-16; John found the UI
  // too loud next to the music, so 0.25 is the new starting point.
  const uiVolume = 0.25;
  // The spoken lines (the 'goes-first:' and 'victory:' keys) sit above the
  // other UI sounds (John, 2026-10-16: "about 25% louder", 0.375).
  const speechVolume = 0.375;
  // Per-sound overrides, for when one sound needs to sit above or below the
  // rest. The spinner tick is listed so it is easy to find; it follows uiVolume.
  // The three character-switch sounds (the portrait arrows) sit a quarter
  // below the rest (John, 2026-10-16).
  const soundVolumes = {
    spinnerTick: uiVolume,
    'switch-to-ron-or-boo': uiVolume * 0.75,
    'switch-to-harry-or-mike': uiVolume * 0.75,
    'switch-to-hermione-or-sully': uiVolume * 0.75
  };
  // The soundtrack's own gain inside its channel (the fade-in target). It
  // used to share the UI constant; it is unchanged at 0.5.
  const musicVolume = 0.5;
  // gainFor(sound): the gain a UI sound plays at, an override first, else
  // the speech level for a spoken line, else the common UI level.
  function gainFor(sound) {
    if (sound in soundVolumes) return soundVolumes[sound];
    if (sound.startsWith('goes-first:') || sound.startsWith('victory:')) return speechVolume;
    return uiVolume;
  }
  // Channel volume (0 to 1, what the Music popup's slider sets) multiplies
  // each sound's own gain. `scale` is applied on top and sets what the
  // slider's 100 means. The music scale was 1 / 0.75 (a third above the
  // level the game first shipped with); John found all the music too loud,
  // so it is a quarter lower since 2026-10-16: scale 1. The slider's stops
  // (0, 20, 40, 60, 80, 100) and the default stop of 80 are unchanged.
  const channels = {
    ui: { enabled: true, volume: 1, scale: 1, gain: null },
    music: { enabled: true, volume: 0.8, scale: 1, gain: null }
  };
  // When the soundtrack plays: 'paused' = only while a dialog is open (the
  // game is paused behind it); 'continuous' = it keeps going during play.
  let musicMode = 'paused';
  let context;
  let enabled = true;
  let victoryTimer;
  let victorySound = null;
  // Bumped by cancelVictory: a speech that finishes decoding after its game
  // over was cancelled (New game tapped) must not play late.
  let victoryToken = 0;
  // Game over music (John, 2026-10-15): about a second after the victory speech
  // ends, the soundtrack ramps up, but only in "paused" mode (in continuous
  // mode it is already playing). It keeps playing until New game is tapped.
  let victoryMusicTimer = null;
  let victorySpeechPending = false; // a speech is scheduled, so it decides when the music starts
  function victoryMusicAfter(ms) {
    clearTimeout(victoryMusicTimer);
    victoryMusicTimer = setTimeout(() => {
      victoryMusicTimer = null;
      if (musicMode === 'paused') window.CandySound.startWelcomeMusic();
    }, ms);
  }
  let spinnerFrame = null;
  let tickBuffer;
  // The dialog soundtrack. Three tunes; the player picks one in the Music
  // popup. Each tune keeps its own clip, so switching away and back resumes
  // where that tune left off (a page reload starts everything from zero).
  const musicTracks = [
    { id: 'earth', name: 'Earth', file: 'soundtrack-music-earth.mp3' },
    { id: 'haunted', name: 'Haunted', file: 'soundtrack-music-haunted.mp3' },
    { id: 'wonderful', name: 'Wonderful', file: 'soundtrack-music-wonderful.mp3' }
  ];
  let currentTrack = musicTracks.find(track => track.id === 'wonderful');
  // welcomeMusicWanted: a dialog that plays music is open. musicFadeStarted
  // and musicFadeInStart describe the fade of the CURRENT tune only.
  let welcomeMusicWanted = false, musicFadeStarted = false;
  let musicFadeInStart = null;


  const tickSources = new Set();

  function prepareContext(resume = true) {
    context ||= new (window.AudioContext || window.webkitAudioContext)();
    for (const channel of Object.values(channels)) {
      if (!channel.gain) {
        channel.gain = context.createGain();
        channel.gain.gain.value = channel.enabled ? channel.volume * channel.scale : 0;
        channel.gain.connect(context.destination);
      }
    }
    if (resume) {
      const resumed = context.resume();
      if (resumed) resumed.catch(() => {});
    }
  }

  function stopSpinnerTicks() {
    if (spinnerFrame !== null) cancelAnimationFrame(spinnerFrame);
    spinnerFrame = null;
    for (const source of tickSources) {
      try { source.stop(); } catch (_) { /* Already ended. */ }
    }
    tickSources.clear();
  }

  function prepareTickBuffer() {
    tickBuffer ||= CandyPreload.createSpinnerTick(context);
  }

  // Every UI sound and speech, by key: the file it comes from. Keys that
  // start with 'victory:' are the 36 victory speeches and the tie.
  function assetMap() {
    const paths = new Map([['confirmText', './assets/sounds/confirmText.mp3'],
      ['winsSet-player', './assets/sounds/winsSet-player.mp3'],
      ['winsSet-opponent', './assets/sounds/winsSet-opponent.mp3']]);
    for (const key of Object.values(characterSounds)) paths.set(key, './assets/sounds/' + key + '.mp3');
    for (const name of Object.keys(characterSounds)) paths.set('goes-first:' + name.toLowerCase(), './assets/sounds/speech/goes-first/' + encodeURIComponent(name.toLowerCase() + ' goes first.mp3'));
    for (const file of Object.values(window.CandyVictorySounds || {})) paths.set('victory:' + file, './assets/sounds/speech/victory/' + encodeURIComponent(file));
    // The tie has one voiceover of its own (John, 2026-10-15). It carries the
    // 'victory:' prefix so cancelling, replaying and the music timing treat it
    // like any victory speech.
    paths.set('victory:tie', './assets/sounds/speech/tie/' + encodeURIComponent('tie - no one saw that coming.mp3'));
    return paths;
  }

  // ---- Decoded buffers -----------------------------------------------------
  // decode(sound): fetch the MP3 and decode it into an AudioBuffer, once.
  // Returns a promise of the buffer, or of null if anything failed (the
  // failed attempt is forgotten, so the next call tries again: a flaky
  // phone connection should not silence a sound for the whole game).
  // Decoding needs the engine to exist but not to be awake, so it works
  // before any tap.
  function decode(sound) {
    if (buffers.has(sound)) return Promise.resolve(buffers.get(sound));
    if (decodes.has(sound)) return decodes.get(sound);
    const url = assetMap().get(sound);
    if (!url) return Promise.resolve(null);
    const task = fetch(url)
      .then(response => { if (!response.ok) throw new Error(url + ': ' + response.status); return response.arrayBuffer(); })
      // The callback form of decodeAudioData works on older iOS too.
      .then(bytes => new Promise((resolve, reject) => { prepareContext(false); context.decodeAudioData(bytes, resolve, reject); }))
      .then(buffer => { buffers.set(sound, buffer); return buffer; })
      .catch(() => { decodes.delete(sound); return null; });
    decodes.set(sound, task);
    return task;
  }

  // playBuffer(sound, buffer): start one voice on the UI channel. The
  // returned voice tells the caller how long the sound is and lets it hear
  // the end (scheduleVictory times the game-over music from it). Stopping a
  // voice early does not count as ending.
  function playBuffer(sound, buffer) {
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.value = gainFor(sound);
    source.connect(gain); gain.connect(channels.ui.gain);
    const voice = { sound, duration: buffer.duration, gain: gain.gain.value, onended: null, source, stopped: false };
    source.onended = () => {
      voices.delete(voice); source.disconnect(); gain.disconnect();
      if (!voice.stopped && voice.onended) voice.onended();
    };
    voices.add(voice);
    source.start();
    return voice;
  }

  function stopVoice(voice) {
    voice.stopped = true;
    try { voice.source.stop(); } catch (_) { /* Already ended. */ }
  }

  function spinnerTick() {
    if (!enabled || !channels.ui.enabled || context.state !== 'running') return;
    prepareTickBuffer();
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = tickBuffer;
    filter.type = 'lowpass'; filter.frequency.value = 3200;
    gain.gain.value = soundVolumes.spinnerTick ?? uiVolume;
    source.connect(filter); filter.connect(gain); gain.connect(channels.ui.gain);
    tickSources.add(source);
    source.onended = () => { tickSources.delete(source); source.disconnect(); filter.disconnect(); gain.disconnect(); };
    source.start();
  }

  function cancelVictory() {
    clearTimeout(victoryTimer);
    victoryToken++;
    clearTimeout(victoryMusicTimer); victoryMusicTimer = null; victorySpeechPending = false;
    for (const voice of voices) {
      if (voice.sound.startsWith('victory:')) stopVoice(voice);
    }
  }

  function stopAll(channel) {
    if (!channel || channel === 'music') {
      welcomeMusicWanted = false; musicFadeStarted = false;
      for (const track of musicTracks) clearTimeout(track.stopTimer);
      // Only a tune that is actually playing is touched; it keeps its position.
      for (const { clip } of clips.values()) {
        if (!clip.paused) clip.pause();
      }
    }
    if (!channel || channel === 'ui') {
      stopSpinnerTicks();
      for (const voice of voices) stopVoice(voice);
    }
  }

  // ---- Music (media elements) ----------------------------------------------
  // Get (creating on first use) the looping clip for one tune. Nothing plays
  // here; the clip sits silent at gain 0 until startWelcomeMusic fades it in.
  function musicEntry(track) {
    if (!track.entry) {
      const clip = new Audio('./assets/sounds/' + track.file);
      clip.preload = 'auto';
      clip.loop = true;
      const source = context.createMediaElementSource(clip);
      const gain = context.createGain();
      gain.gain.value = 0;
      source.connect(gain); gain.connect(channels.music.gain);
      track.entry = { clip, gain };
      clips.set('music:' + track.id, track.entry);
    }
    return track.entry;
  }

  // Fade one tune from its current level to silence over `seconds`, then
  // pause it. Its position is kept, so the next start resumes from there.
  function fadeOutTrack(track, seconds, fadeInStart) {
    clearTimeout(track.stopTimer);
    if (!track.entry) return;
    const gain = track.entry.gain.gain;
    const now = context.currentTime;
    // Explicitly preserve the envelope's current level before replacing its
    // scheduled ramp; some browsers otherwise fall back to its initial zero.
    const level = fadeInStart === null ? 0 : musicVolume * Math.min(1, Math.max(0, (now - fadeInStart) / 3));
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(level, now);
    gain.linearRampToValueAtTime(0, now + seconds);
    track.stopTimer = setTimeout(() => { track.entry.clip.pause(); }, seconds * 1000 + 100);
  }

  window.CandySound = {
    // The list the Music popup shows: [{ id, name }], in display order.
    get musicTracks() { return musicTracks.map(track => ({ id: track.id, name: track.name })); },
    get currentTrack() { return currentTrack.id; },
    prepareWelcomeMusic() {
      try {
        prepareContext(false);
        // Only the chosen tune is prepared (so only one download, 2 to 5 MB,
        // competes with the startup; John's iPhone, 2026-10-16). The other
        // two are created, and start downloading, when picked in the Sound
        // popup (selectTrack). Returns the clip so preload.js can watch it.
        return [musicEntry(currentTrack).clip];
      } catch (_) { return []; }
    },
    // startWelcomeMusic(): ask the current tune to play and fade in. Call it
    // INSIDE A TAP: a phone only starts a media element for a tap, and a
    // request made before the file is ready can stall (iOS then shows the
    // tune as "paused" in Now Playing). retryMusic() picks such a stall up
    // at the next tap.
    startWelcomeMusic() {
      if (!enabled || !channels.music.enabled) return;
      let entry;
      try { prepareContext(false); entry = musicEntry(currentTrack); } catch (_) { return; }
      const clip = entry.clip, track = currentTrack;
      welcomeMusicWanted = true;
      clearTimeout(track.stopTimer);
      const fadeIn = () => {
        // The tune may have been switched while play() was still pending.
        if (!welcomeMusicWanted || musicFadeStarted || currentTrack !== track || clip.paused || context.state !== 'running') return;
        musicFadeStarted = true;
        musicFadeInStart = context.currentTime;
        const gain = entry.gain.gain;
        gain.cancelScheduledValues(context.currentTime);
        gain.setValueAtTime(0, context.currentTime);
        gain.linearRampToValueAtTime(musicVolume, context.currentTime + 3);
      };
      clip.onplaying = fadeIn;
      try {
        context.resume().then(fadeIn).catch(() => {});
        if (clip.paused) clip.play().then(fadeIn).catch(() => {});
        else fadeIn();
      } catch (_) { /* Autoplay rejection never prevents starting the game. */ }
    },
    // retryMusic(): call inside any tap. Does nothing unless the music is
    // wanted right now (a dialog with music is open, Always mode is on, or
    // the game-over tune was asked for) and the tune is not playing.
    retryMusic() {
      if (!welcomeMusicWanted || !enabled || !channels.music.enabled) return;
      const entry = currentTrack.entry;
      if (!entry || !entry.clip.paused) return;
      this.startWelcomeMusic();
    },
    fadeOutWelcomeMusic() {
      // In continuous mode the dialog closing changes nothing: keep playing.
      if (musicMode === 'continuous') return;
      welcomeMusicWanted = false; musicFadeStarted = false;
      if (!context) return;
      fadeOutTrack(currentTrack, 2, musicFadeInStart);
    },
    get musicMode() { return musicMode; },
    setMusicMode(mode) {
      if (mode !== 'paused' && mode !== 'continuous') throw new RangeError('Unknown music mode: ' + mode);
      musicMode = mode;
    },
    // Switch to another tune (by id). The old one fades out over a second
    // and keeps its position; the new one fades in if a dialog wants music.
    selectTrack(id) {
      const track = musicTracks.find(track => track.id === id);
      if (!track) throw new RangeError('Unknown soundtrack: ' + id);
      if (track === currentTrack) return;
      const wanted = welcomeMusicWanted;
      if (context) fadeOutTrack(currentTrack, 1, musicFadeInStart);
      musicFadeStarted = false; musicFadeInStart = null;
      currentTrack = track;
      // Create the new tune's element now so its download starts at once,
      // even when nothing wants to play it yet.
      if (context) { try { musicEntry(track); } catch (_) { /* no audio here */ } }
      if (wanted) this.startWelcomeMusic();
    },
    // prepareAssets(): start decoding every UI clip and "goes first" speech
    // (twelve short files). The victory speeches (36 plus the tie) are not
    // decoded here: only one is ever needed per game, so scheduleVictory
    // decodes that one on demand (see prepareSpeech). Returns
    // [{ url, ready }] so preload.js can wait and record failures;
    // `ready` resolves to true (decoded) or false.
    prepareAssets() {
      try { prepareContext(false); prepareTickBuffer(); } catch (_) { return []; }
      const prepared = [];
      for (const [key, url] of assetMap()) {
        if (key.startsWith('victory:')) continue;
        prepared.push({ url, ready: decode(key).then(buffer => buffer !== null) });
      }
      return prepared;
    },
    // prepareSpeech(sound): decode one sound (normally a victory speech) ahead
    // of time; resolves to its AudioBuffer, or null if it could not be
    // decoded. Harmless to call for a sound that is already decoded.
    prepareSpeech(sound) {
      try { prepareContext(false); } catch (_) { return Promise.resolve(null); }
      return decode(sound);
    },
    // The keys of the sounds decoded so far (diagnostics and checks).
    get decodedSounds() { return [...buffers.keys()]; },
    playSetFanfare(player) {
      if (player === 'human') return this.play('winsSet-player');
      if (player === 'wendy') return this.play('winsSet-opponent');
    },
    setChannelEnabled(category, value) {
      const channel = channels[category];
      if (!channel) throw new RangeError('Unknown sound channel: ' + category);
      channel.enabled = Boolean(value);
      if (channel.gain) channel.gain.gain.value = channel.enabled ? channel.volume * channel.scale : 0;
      if (!channel.enabled) {
        stopAll(category);
        if (category === 'ui') cancelVictory();
      }
    },
    setChannelVolume(category, value) {
      const channel = channels[category];
      if (!channel) throw new RangeError('Unknown sound channel: ' + category);
      if (!Number.isFinite(value) || value < 0 || value > 1) throw new RangeError('Volume must be between 0 and 1');
      channel.volume = value;
      if (channel.gain) channel.gain.gain.value = channel.enabled ? value * channel.scale : 0;
    },
    getChannel(category) {
      const channel = channels[category];
      if (!channel) throw new RangeError('Unknown sound channel: ' + category);
      return { enabled: channel.enabled, volume: channel.volume };
    },
    setEnabled(value) {
      enabled = Boolean(value);
      if (!enabled) { stopAll(); cancelVictory(); }
    },
    get enabled() { return enabled; },
    // unlock(): call this inside a tap. Phones keep the audio engine asleep
    // until a tap resumes it, and every sound here is routed through it. In a
    // normal game the first dish tap wakes it (startSpinnerTicks); the demo
    // endings never reach a dish tap, so Let's play wakes it instead (John,
    // 2026-10-15: full sound on the desktop, none on the phone).
    unlock() {
      try { prepareContext(); } catch (_) { /* no audio on this device; nothing to wake */ }
    },
    // userTapped(): the one call for "a tap happened": wake the engine and
    // give a stalled soundtrack another chance. candy-go-fish.js calls it
    // for every click on the page.
    userTapped() {
      this.unlock();
      this.retryMusic();
    },
    cancelVictory,
    get hasVictorySpeech() { return Boolean(victorySound); },
    replayVictory() {
      cancelVictory();
      if (!victorySound) return;
      const token = victoryToken;
      this.prepareSpeech(victorySound).then(() => { if (token === victoryToken) this.play(victorySound); });
    },
    // scheduleVictory(winner, loser, margin): margin 0 is a tie and plays the
    // tie voiceover; otherwise the winner's BIGWIN (margin of three or more) or
    // CLOSE speech against this loser. The speech is decoded now and played
    // two seconds after the result shows (or as soon as the decode finishes,
    // if that takes longer on a slow connection).
    scheduleVictory(winner, loser, margin) {
      cancelVictory();
      victorySound = null;
      if (margin <= 0) victorySound = 'victory:tie';
      else {
        const key = [winner.toLowerCase(), loser.toLowerCase(), margin >= 3 ? 'BIGWIN' : 'CLOSE'].join('|');
        const filename = (window.CandyVictorySounds || {})[key];
        if (!filename) return; // Incomplete combinations intentionally stay silent.
        victorySound = 'victory:' + filename;
      }
      if (enabled && channels.ui.enabled) {
        victorySpeechPending = true;
        const token = victoryToken;
        const decoding = this.prepareSpeech(victorySound);
        victoryTimer = setTimeout(() => {
          decoding.then(() => {
            if (token !== victoryToken) return; // cancelled while decoding
            const voice = this.play(victorySound);
            if (!voice) { victoryMusicAfter(4000); return; }
            // The soundtrack follows a second after the speech ends. A fallback
            // timer covers a phone that silently refuses to play the voice.
            victoryMusicAfter(voice.duration * 1000 + 1000);
            voice.onended = () => victoryMusicAfter(1000);
          });
        }, 2000);
      }
    },
    // Game over without a speech (UI sounds off, or no clip for this
    // pairing): the soundtrack still comes in after a short pause.
    scheduleGameOverMusic() {
      if (!victorySpeechPending) victoryMusicAfter(3000);
    },
    playCharacter(name) {
      this.play(characterSounds[name]);
    },
    playGoesFirst(name) {
      if (Object.hasOwn(characterSounds, name)) this.play('goes-first:' + name.toLowerCase());
    },
    stopSpinnerTicks,
    startSpinnerTicks(animation, dish) {
      stopSpinnerTicks();
      if (!enabled || !channels.ui.enabled) return;
      try { prepareContext(); prepareTickBuffer(); } catch (_) { return; }
      let previous = 0, travel = 0, lastTick = -Infinity;
      const sample = timestamp => {
        spinnerFrame = null;
        if (animation.playState === 'finished' || animation.playState === 'idle') return;
        if (animation.playState === 'running' && !document.hidden) {
          // Start immediately once the click has unlocked audio, before the
          // first sixth-turn; subsequent ticks follow the plate's movement.
          if (lastTick === -Infinity && context.state === 'running') {
            spinnerTick(); lastTick = timestamp;
          }
          const matrix = new DOMMatrixReadOnly(getComputedStyle(dish).transform);
          const angle = Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
          const delta = ((angle - previous + 540) % 360) - 180;
          previous = angle;
          // One tick per 60 degrees of forward movement. Ignore landing wobble.
          if (delta > 0) travel += delta;
          if (travel >= 60) {
            travel %= 60;
            if (timestamp - lastTick >= 28) { spinnerTick(); lastTick = timestamp; }
          }
        }
        spinnerFrame = requestAnimationFrame(sample);
      };
      spinnerFrame = requestAnimationFrame(sample);
    },
    // play(sound): play one UI sound or speech from its decoded buffer, at
    // once. Returns the voice ({ sound, duration, gain, onended }) or
    // undefined when nothing played: sound off, UI channel off, unknown
    // key, or the buffer not decoded yet (then the decode is started so a
    // later call can play it).
    play(sound) {
      if (!enabled || !channels.ui.enabled || !assetMap().has(sound)) return;
      // Rapid switching replaces the previous cue, including across selectors.
      stopAll('ui');
      // Called directly from the selector click for phone audio activation.
      // Unavailable/blocked audio must never interrupt character selection.
      try {
        prepareContext();
        const buffer = buffers.get(sound);
        if (!buffer) { decode(sound); return; }
        return playBuffer(sound, buffer);
      } catch (_) { /* Audio failure must not block the selector. */ }
    }
  };
  window.addEventListener('pagehide', () => { stopAll(); cancelVictory(); });
})();
