/* Game-owned audio gateway. A future global sound switch can call setEnabled. */
(() => {
  'use strict';
  const characterSounds = {
    Ron: 'switch-to-ron-or-boo', Boo: 'switch-to-ron-or-boo',
    Harry: 'switch-to-harry-or-mike', Mike: 'switch-to-harry-or-mike',
    Hermione: 'switch-to-hermione-or-sully', Sully: 'switch-to-hermione-or-sully'
  };
  const clips = new Map();
  const defaultVolume = 0.5;
  // Per-sound overrides: 0 = silent, 1 = full signal level.
  const soundVolumes = { spinnerTick: 0.5 };
  // Channel volume (0 to 1, what the Music popup's slider sets) multiplies
  // each sound's own gain. `scale` is applied on top: the music channel
  // can go a third louder than the level the game first shipped with, so
  // that level now sits at volume 0.75 and the default stop is 0.8.
  const channels = {
    ui: { enabled: true, volume: 1, scale: 1, gain: null },
    music: { enabled: true, volume: 0.8, scale: 1 / 0.75, gain: null }
  };
  // When the soundtrack plays: 'paused' = only while a dialog is open (the
  // game is paused behind it); 'continuous' = it keeps going during play.
  let musicMode = 'paused';
  let context;
  let enabled = true;
  let victoryTimer;
  let victorySound = null;
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

  function assetMap() {
    const paths = new Map([['confirmText', './assets/sounds/confirmText.mp3'],
      ['winsSet-player', './assets/sounds/winsSet-player.mp3'],
      ['winsSet-opponent', './assets/sounds/winsSet-opponent.mp3']]);
    for (const key of Object.values(characterSounds)) paths.set(key, './assets/sounds/' + key + '.mp3');
    for (const name of Object.keys(characterSounds)) paths.set('goes-first:' + name.toLowerCase(), './assets/sounds/speech/goes-first/' + encodeURIComponent(name.toLowerCase() + ' goes first.mp3'));
    for (const file of Object.values(window.CandyVictorySounds || {})) paths.set('victory:' + file, './assets/sounds/speech/victory/' + encodeURIComponent(file));
    return paths;
  }

  function getClip(sound, url, category = 'ui') {
    let entry = clips.get(sound);
    if (!entry) {
      const clip = new Audio(url);
      clip.preload = 'auto';
      const source = context.createMediaElementSource(clip);
      const gain = context.createGain();
      source.connect(gain); gain.connect(channels[category].gain);
      entry = { clip, gain, category };
      clips.set(sound, entry);
    }
    return entry;
  }

  function spinnerTick() {
    if (!enabled || !channels.ui.enabled || context.state !== 'running') return;
    prepareTickBuffer();
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = tickBuffer;
    filter.type = 'lowpass'; filter.frequency.value = 3200;
    gain.gain.value = soundVolumes.spinnerTick ?? defaultVolume;
    source.connect(filter); filter.connect(gain); gain.connect(channels.ui.gain);
    tickSources.add(source);
    source.onended = () => { tickSources.delete(source); source.disconnect(); filter.disconnect(); gain.disconnect(); };
    source.start();
  }

  function cancelVictory() {
    clearTimeout(victoryTimer);
    clearTimeout(victoryMusicTimer); victoryMusicTimer = null; victorySpeechPending = false;
    for (const [key, { clip }] of clips) {
      if (key.startsWith('victory:') && !clip.paused) { clip.pause(); rewind(clip); }
    }
  }

  function stopAll(channel) {
    if (!channel || channel === 'music') {
      welcomeMusicWanted = false; musicFadeStarted = false;
      for (const track of musicTracks) clearTimeout(track.stopTimer);
    }
    if (!channel || channel === 'ui') stopSpinnerTicks();

    // Only clips that are actually playing are touched. Pausing every idle
    // media element (48 UI clips, 36 victory clips) took seconds on John's
    // iPhone, so the OFF switch drew its slash seconds late (2026-10-15).
    // The channel's gain is already zero when it is off, so nothing idle
    // needs attention; each sound rewinds itself in play() before it starts.
    for (const { clip, category } of clips.values()) {
      if (channel && category !== channel) continue;
      if (clip.paused) continue;
      clip.pause();
      if (category !== 'music') rewind(clip);
    }
  }

  // Put a clip back to its start. iOS Safari throws InvalidStateError when
  // currentTime is set on a clip that has not loaded anything yet, so
  // unloaded clips are skipped and errors swallowed.
  function rewind(clip) {
    if (clip.readyState === 0) return;
    try { clip.currentTime = 0; } catch (_) { /* nothing to rewind */ }
  }

  // Get (creating on first use) the looping clip for one tune. Nothing plays
  // here; the clip sits silent at gain 0 until startWelcomeMusic fades it in.
  function musicEntry(track) {
    if (!track.entry) {
      track.entry = getClip('music:' + track.id, './assets/sounds/' + track.file, 'music');
      track.entry.clip.loop = true;
      track.entry.gain.gain.value = 0;
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
    const level = fadeInStart === null ? 0 : defaultVolume * Math.min(1, Math.max(0, (now - fadeInStart) / 3));
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
        // All three tunes are prepared so switching in the popup is instant.
        // Returns the clips so preload.js can wait for them.
        return musicTracks.map(track => musicEntry(track).clip);
      } catch (_) { return []; }
    },
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
        gain.linearRampToValueAtTime(defaultVolume, context.currentTime + 3);
      };
      clip.onplaying = fadeIn;
      try {
        context.resume().then(fadeIn).catch(() => {});
        if (clip.paused) clip.play().then(fadeIn).catch(() => {});
        else fadeIn();
      } catch (_) { /* Autoplay rejection never prevents starting the game. */ }
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
      if (wanted) this.startWelcomeMusic();
    },
    prepareAssets() {
      try { prepareContext(false); prepareTickBuffer(); } catch (_) { return []; }

      const prepared = [];
      for (const [key, url] of assetMap()) {
        try { prepared.push(getClip(key, url).clip); } catch (_) { /* Playback can retry later. */ }
      }
      return prepared;
    },
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
    cancelVictory,
    get hasVictorySpeech() { return Boolean(victorySound); },
    replayVictory() {
      cancelVictory();
      if (victorySound) this.play(victorySound);
    },
    scheduleVictory(winner, loser, margin) {
      cancelVictory();
      victorySound = null;
      if (margin <= 0) return;
      const key = [winner.toLowerCase(), loser.toLowerCase(), margin >= 3 ? 'BIGWIN' : 'CLOSE'].join('|');
      const filename = (window.CandyVictorySounds || {})[key];
      if (!filename) return; // Incomplete combinations intentionally stay silent.
      victorySound = 'victory:' + filename;
      if (enabled && channels.ui.enabled) {
        victorySpeechPending = true;
        victoryTimer = setTimeout(() => {
          const clip = this.play(victorySound)?.clip;
          if (!clip) { victoryMusicAfter(4000); return; }
          // The soundtrack follows a second after the speech ends. A fallback
          // timer covers a phone that silently refuses to play the clip.
          const length = Number.isFinite(clip.duration) && clip.duration > 0 ? clip.duration * 1000 : 5000;
          victoryMusicAfter(length + 1000);
          clip.onended = () => victoryMusicAfter(1000);
        }, 2000);
      }
    },
    // Game over without a victory speech (a tie, UI sounds off, or no clip
    // for this pairing): the soundtrack still comes in after a short pause.
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
    play(sound) {
      const url = assetMap().get(sound);
      if (!enabled || !channels.ui.enabled || !url) return;
      // Rapid switching replaces the previous cue, including across selectors.
      stopAll('ui');
      // Called directly from the selector click for phone audio activation.
      // Unavailable/blocked audio must never interrupt character selection.
      try {
        prepareContext();
        const entry = getClip(sound, url);
        entry.gain.gain.value = soundVolumes[sound] ?? defaultVolume;
        rewind(entry.clip); // a clip paused mid-way by the OFF switch starts over
        const playback = entry.clip.play();
        if (playback) playback.catch(() => {});
        return entry;
      } catch (_) { /* Audio failure must not block the selector. */ }
    }
  };
  window.addEventListener('pagehide', () => { stopAll(); cancelVictory(); });
})();
