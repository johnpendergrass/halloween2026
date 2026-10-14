/* Game-owned audio gateway. A future global sound switch can call setEnabled. */
(() => {
  'use strict';
  const characterSounds = {
    Ron: 'ronBoo', Boo: 'ronBoo',
    Harry: 'harryMike', Mike: 'harryMike',
    Hermione: 'hermioneSully', Sully: 'hermioneSully'
  };
  const clips = new Map();
  const defaultVolume = 0.5;
  // Per-sound overrides: 0 = silent, 1 = full signal level.
  const soundVolumes = {};
  // Channel volume multiplies each sound's own gain. Controls are added later.
  const channels = {
    ui: { enabled: true, volume: 1, gain: null },
    music: { enabled: true, volume: 1, gain: null }
  };
  let context;
  let enabled = true;
  let victoryTimer;
  let victorySound = null;

  function cancelVictory() {
    clearTimeout(victoryTimer);
    for (const [key, { clip }] of clips) {
      if (key.startsWith('victory:')) { clip.pause(); clip.currentTime = 0; }
    }
  }

  function stopAll(channel) {
    for (const { clip, category } of clips.values()) {
      if (channel && category !== channel) continue;
      clip.pause();
      clip.currentTime = 0;
    }
  }

  window.CandySound = {
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
    play(sound) {
      const victoryFile = sound?.startsWith('victory:') ? sound.slice(8) : null;
      const knownVictory = victoryFile && Object.values(window.CandyVictorySounds || {}).includes(victoryFile);
      const folder = sound === 'confirmText' ? 'welcome-and-start-clicks' :
        knownVictory ? 'victory-announcements' :
        Object.values(characterSounds).includes(sound) ? 'players-and-opponents' : null;
      if (!enabled || !channels.ui.enabled || !folder) return;
      // Rapid switching replaces the previous cue, including across selectors.
      stopAll('ui');
      // Called directly from the selector click for phone audio activation.
      // Unavailable/blocked audio must never interrupt character selection.
      try {
        context ||= new (window.AudioContext || window.webkitAudioContext)();
        for (const channel of Object.values(channels)) {
          if (!channel.gain) {
            channel.gain = context.createGain();
            channel.gain.gain.value = channel.enabled ? channel.volume : 0;
            channel.gain.connect(context.destination);
          }
        }
        const resumed = context.resume();
        if (resumed) resumed.catch(() => {});
        let entry = clips.get(sound);
        if (!entry) {
          const filename = knownVictory ? victoryFile : sound + '.mp3';
          const clip = new Audio('./assets/sounds/' + folder + '/' + encodeURIComponent(filename));
          const source = context.createMediaElementSource(clip);
          const gain = context.createGain();
          source.connect(gain);
          gain.connect(channels.ui.gain);
          entry = { clip, gain, category: 'ui' };
          clips.set(sound, entry);
        }
        entry.gain.gain.value = soundVolumes[sound] ?? defaultVolume;
        const playback = entry.clip.play();
        if (playback) playback.catch(() => {});
        return entry;
      } catch (_) { /* Audio failure must not block the selector. */ }
    }
  };
  window.addEventListener('pagehide', () => { stopAll(); cancelVictory(); });
})();
