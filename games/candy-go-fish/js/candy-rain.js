(function (root) {
  'use strict';
  // ---- Moods ----------------------------------------------------------------
  // The rain has two strengths, picked by the result (John, 2026-10-15):
  //   full  the player won: the whole sky of candy, brands and wrappers, spinning
  //   tie   nobody won: the same rain at about half strength
  // (A muted "trickle" for a loss was tried and removed the same evening; John
  // wants a real celebration for the opponent instead, still to be designed.)
  // Every number the drop code uses lives here, so a mood is one row to tune.
  const MOODS = {
    full: {
      burst: 12,          // candies dropped the moment the rain starts
      perTick: 4,         // candies added on every tick after that
      tickMs: 180,        // time between ticks
      maxOnScreen: 120,   // never more than this many candies at once
      total: Infinity,    // keep going until stop() or drain()
      brands: true,       // brand images allowed (otherwise wrappers only)
      fallMs: [2800, 5000], // how long one candy takes to fall (random in range)
      turns: [360, 1260],   // how far it spins on the way down, degrees
      drift: .28,           // sideways wander as a share of the screen width
      filter: ''            // extra CSS filter on every candy
    },
    tie: {
      burst: 6, perTick: 2, tickMs: 360, maxOnScreen: 60, total: 70, brands: true,
      fallMs: [2800, 5000], turns: [360, 1260], drift: .28, filter: ''
    }
  };
  root.CandyRain = function ({ host, candies, generic = './assets/generic-candies/candy-bar.png' }) {
    let layer = null, delay = null, interval = null;
    let mood = MOODS.full, dropped = 0; // dropped counts candies since the last start()
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
    function between(range) { return range[0] + Math.random() * (range[1] - range[0]); }
    function drop() {
      if (!layer || layer.childElementCount >= mood.maxOnScreen || dropped >= mood.total) return;
      dropped++;
      const { width, height } = host.getBoundingClientRect();
      const wrapper = !mood.brands || Math.random() < .6;
      const size = width * (.08 + Math.random() * .11) * (wrapper ? 1 : 1.5 + Math.random());
      const candy = document.createElement('img');
      candy.alt = ''; candy.draggable = false;
      candy.src = wrapper ? generic : candies[Math.floor(Math.random() * candies.length)];
      candy.dataset.kind = wrapper ? 'generic' : 'brand';
      // A wrapper gets a random tint; a brand keeps its own colours. The mood's
      // own filter (none today) is applied after that.
      const tint = wrapper ? `hue-rotate(${Math.floor(Math.random() * 360)}deg) saturate(${.7 + Math.random() * 1.1}) brightness(${.85 + Math.random() * .35}) ` : '';
      Object.assign(candy.style, {
        position: 'absolute', left: Math.random() * width - size / 2 + 'px', top: '0',
        width: size + 'px', height: size + 'px', objectFit: 'contain', pointerEvents: 'none',
        filter: tint + mood.filter + ' drop-shadow(0 2px 2px #0005)'
      });
      layer.append(candy);
      const angle = Math.random() * 360;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const turns = reduced ? 0 : (Math.random() < .5 ? -1 : 1) * between(mood.turns);
      const drift = reduced ? 0 : (Math.random() - .5) * width * mood.drift;
      const animation = candy.animate([
        { transform: `translate(0, ${-2 * size}px) rotate(${angle}deg)` },
        { transform: `translate(${drift}px, ${height + 2 * size}px) rotate(${angle + turns}deg)` }
      ], { duration: reduced ? 6500 : between(mood.fallMs), easing: 'cubic-bezier(.35,0,.8,.6)' });
      animations.add(animation);
      animation.finished.then(() => { animations.delete(animation); candy.remove(); }).catch(() => {});
    }
    // start(waitMs, moodName): the rain begins after waitMs. moodName is
    // 'full' or 'tie' (see MOODS above); anything else means full.
    function start(waitMs = 3000, moodName = 'full') {
      stop();
      mood = MOODS[moodName] || MOODS.full; dropped = 0;
      delay = setTimeout(() => {
        layer = document.createElement('div'); layer.className = 'candy-rain'; layer.dataset.mood = moodName; layer.setAttribute('aria-hidden', 'true');
        Object.assign(layer.style, { position: 'absolute', inset: '0', overflow: 'hidden', pointerEvents: 'none', zIndex: '2' });
        host.append(layer);
        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        for (let i = 0; i < (reduced ? 2 : mood.burst); i++) drop();
        interval = setInterval(() => { for (let i = 0; i < (reduced ? 1 : mood.perTick); i++) drop(); }, reduced ? 900 : mood.tickMs);
      }, waitMs);
    }
    return { start, stop, drain };
  };
})(globalThis);
