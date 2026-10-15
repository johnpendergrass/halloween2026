/* Startup preparation only: asset inventory, image decoding and generated audio. */
(() => {
  'use strict';
  const images = new Map();
  let ready = Promise.resolve();
  let settled = false;
  const failures = [];
  const artwork = [
    'backgrounds/green-blue-gradient.png', 'buttons/ceramic-pumpkin-new-game.png',
    'buttons/ceramic-pumpkin-rules.png', 'candy-dish/ghost-plate.png',
    'candy-dish/witch-tray.png', 'candy-dish/black-cat-tray.png',
    'candy-dish/player-grid-dish.png', 'candy-dish/opponent-grid-dish.png',
    'decorations/welcome-vines.svg', 'generic-candies/candy-bar.png'
  ];

  function loadImage(url) {
    if (images.has(url)) return images.get(url).ready;
    const image = new Image();
    const task = new Promise(resolve => {
      const finish = ok => {
        clearTimeout(timer); image.onload = image.onerror = null;
        if (!ok) failures.push(url);
        resolve();
      };
      const timer = setTimeout(() => finish(false), 6000);
      image.onload = () => image.decode().then(() => finish(true), () => finish(false));
      image.onerror = () => finish(false);
      image.src = url;
    });
    images.set(url, { image, ready: task });
    return task;
  }

  function loadAudio(clip, timeoutMs = 6000) {
    return new Promise(resolve => {
      const finish = () => {
        clearTimeout(timer);
        clip.removeEventListener('canplaythrough', finish);
        clip.removeEventListener('error', finish);
        if (clip.readyState < 4) failures.push(clip.src);
        resolve();
      };
      const timer = setTimeout(finish, timeoutMs);
      clip.addEventListener('canplaythrough', finish, { once: true });
      clip.addEventListener('error', finish, { once: true });
      if (clip.readyState >= 4) finish(); else clip.load();
    });
  }

  window.CandyPreload = {
    createSpinnerTick(context) {
      const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * .018), context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const progress = i / data.length;
        data[i] = (Math.random() * 2 - 1) * Math.min(1, i / (context.sampleRate * .001)) * Math.exp(-progress * 7);
      }
      return buffer;
    },
    start(config) {
      const paths = new Set(artwork);
      for (const profile of [...Object.values(config.players), ...(config.playerCharacters || []), ...(config.opponents || [])]) paths.add(profile.portrait);
      for (const candy of config.candies) paths.add('candybar-images/' + candy.image);
      // Nothing is played or unlocked here; playback remains gesture-owned.
      // All three soundtrack tunes are prepared up front (John wants to see
      // what that does to startup time before loading them lazily).
      const music = CandySound.prepareWelcomeMusic();
      ready = Promise.all([...paths].map(path => loadImage('./assets/' + path)).concat(CandySound.prepareAssets().map(clip => loadAudio(clip)), music.map(clip => loadAudio(clip, 20000))))
        .then(() => { settled = true; });
      return ready;
    },
    get settled() { return settled; },
    get failures() { return failures.slice(); },
    whenReady() { return ready; }
  };
})();
