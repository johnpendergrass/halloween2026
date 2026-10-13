(function (root) {
  'use strict';
  root.CandyRain = function ({ host, candies, generic = './assets/generic-candies/candy-bar.png' }) {
    let layer = null, delay = null, interval = null;
    const animations = new Set();
    function stop() {
      clearTimeout(delay); clearInterval(interval); delay = interval = null;
      for (const animation of animations) animation.cancel();
      animations.clear(); layer?.remove(); layer = null;
    }
    async function drain() {
      clearTimeout(delay); clearInterval(interval); delay = interval = null;
      const finishingLayer = layer;
      await Promise.allSettled([...animations].map(animation => animation.finished));
      // A later start may already have created a new rain layer.
      if (layer === finishingLayer) { finishingLayer?.remove(); layer = null; }
    }
    function drop() {
      if (!layer || layer.childElementCount >= 120) return;
      const { width, height } = host.getBoundingClientRect();
      const wrapper = Math.random() < .6;
      const size = width * (.08 + Math.random() * .11) * (wrapper ? 1 : 1.5 + Math.random());
      const candy = document.createElement('img');
      candy.alt = ''; candy.draggable = false;
      candy.src = wrapper ? generic : candies[Math.floor(Math.random() * candies.length)];
      candy.dataset.kind = wrapper ? 'generic' : 'brand';
      Object.assign(candy.style, {
        position: 'absolute', left: Math.random() * width - size / 2 + 'px', top: '0',
        width: size + 'px', height: size + 'px', objectFit: 'contain', pointerEvents: 'none',
        filter: wrapper ? `hue-rotate(${Math.floor(Math.random() * 360)}deg) saturate(${.7 + Math.random() * 1.1}) brightness(${.85 + Math.random() * .35}) drop-shadow(0 2px 2px #0005)` : 'drop-shadow(0 2px 2px #0005)'
      });
      layer.append(candy);
      const angle = Math.random() * 360;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const turns = reduced ? 0 : (Math.random() < .5 ? -1 : 1) * (360 + Math.random() * 900);
      const drift = reduced ? 0 : (Math.random() - .5) * width * .28;
      const animation = candy.animate([
        { transform: `translate(0, ${-2 * size}px) rotate(${angle}deg)` },
        { transform: `translate(${drift}px, ${height + 2 * size}px) rotate(${angle + turns}deg)` }
      ], { duration: reduced ? 6500 : 2800 + Math.random() * 2200, easing: 'cubic-bezier(.35,0,.8,.6)' });
      animations.add(animation);
      animation.finished.then(() => { animations.delete(animation); candy.remove(); }).catch(() => {});
    }
    function start(waitMs = 3000) {
      stop();
      delay = setTimeout(() => {
        layer = document.createElement('div'); layer.className = 'candy-rain'; layer.setAttribute('aria-hidden', 'true');
        Object.assign(layer.style, { position: 'absolute', inset: '0', overflow: 'hidden', pointerEvents: 'none', zIndex: '2' });
        host.append(layer);
        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        for (let i = 0; i < (reduced ? 2 : 12); i++) drop();
        interval = setInterval(() => { for (let i = 0; i < (reduced ? 1 : 4); i++) drop(); }, reduced ? 900 : 180);
      }, waitMs);
    }
    return { start, stop, drain };
  };
})(globalThis);
