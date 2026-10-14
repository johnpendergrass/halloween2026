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
  // Channel volume multiplies each sound's own gain. Controls are added later.
  const channels = {
    ui: { enabled: true, volume: 1, gain: null },
    music: { enabled: true, volume: 1, gain: null }
  };
  let context;
  let enabled = true;
  let victoryTimer;
  let victorySound = null;
  let spinnerFrame = null;
  let tickBuffer;
  let welcomeMusic = null, welcomeMusicWanted = false, musicFadeStarted = false, musicStopTimer;
  let musicFadeInStart = null;


  const tickSources = new Set();

  function prepareContext(resume = true) {
    context ||= new (window.AudioContext || window.webkitAudioContext)();
    for (const channel of Object.values(channels)) {
      if (!channel.gain) {
        channel.gain = context.createGain();
        channel.gain.gain.value = channel.enabled ? channel.volume : 0;
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
    for (const [key, { clip }] of clips) {
      if (key.startsWith('victory:')) { clip.pause(); clip.currentTime = 0; }
    }
  }

  function stopAll(channel) {
    if (!channel || channel === 'music') {
      welcomeMusicWanted = false; musicFadeStarted = false; clearTimeout(musicStopTimer);
    }
    if (!channel || channel === 'ui') stopSpinnerTicks();

    for (const { clip, category } of clips.values()) {
      if (channel && category !== channel) continue;
      clip.pause();
      if (category !== 'music') clip.currentTime = 0;
    }
  }

  window.CandySound = {
    prepareWelcomeMusic() {
      try {
        prepareContext(false);
        // The dialog soundtrack. Two more candidates (haunted, earth) sit in
        // the same folder for a later choice; only this one is wired up.
        welcomeMusic ||= getClip('welcomeMusic', './assets/sounds/soundtrack-music-wonderful.mp3', 'music');
        welcomeMusic.clip.loop = true;
        if (!welcomeMusicWanted) welcomeMusic.gain.gain.value = 0;
        return welcomeMusic.clip;
      } catch (_) { return null; }
    },
    startWelcomeMusic() {
      if (!enabled || !channels.music.enabled) return;
      const clip = this.prepareWelcomeMusic();
      if (!clip) return;
      welcomeMusicWanted = true;
      clearTimeout(musicStopTimer);
      const fadeIn = () => {
        if (!welcomeMusicWanted || musicFadeStarted || clip.paused || context.state !== 'running') return;
        musicFadeStarted = true;
        musicFadeInStart = context.currentTime;
        const gain = welcomeMusic.gain.gain;
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
      welcomeMusicWanted = false; musicFadeStarted = false;
      clearTimeout(musicStopTimer);
      if (!welcomeMusic) return;
      const gain = welcomeMusic.gain.gain;
      const now = context.currentTime;
      // Explicitly preserve the envelope's current level before replacing its
      // scheduled ramp; some browsers otherwise fall back to its initial zero.
      const level = musicFadeInStart === null ? 0 : defaultVolume * Math.min(1, Math.max(0, (now - musicFadeInStart) / 3));
      gain.cancelScheduledValues(now);
      gain.setValueAtTime(level, now);
      gain.linearRampToValueAtTime(0, now + 2);
      musicStopTimer = setTimeout(() => {
        welcomeMusic.clip.pause();
      }, 2100);
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
      if (channel.gain) channel.gain.gain.value = channel.enabled ? channel.volume : 0;
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
      if (channel.gain) channel.gain.gain.value = channel.enabled ? value : 0;
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
      if (enabled && channels.ui.enabled) victoryTimer = setTimeout(() => this.play(victorySound), 2000);
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
        const playback = entry.clip.play();
        if (playback) playback.catch(() => {});
        return entry;
      } catch (_) { /* Audio failure must not block the selector. */ }
    }
  };
  window.addEventListener('pagehide', () => { stopAll(); cancelVictory(); });
})();
