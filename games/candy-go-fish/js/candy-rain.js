(function (root) {
  'use strict';
  // ---- Moods ----------------------------------------------------------------
  // The game-over candy show comes in three moods, picked by the result
  // (John, 2026-10-15):
  //   full    the player won: the whole sky of candy, brands and wrappers, spinning
  //   tie     nobody won: the same rain at about half strength
  //   cannon  the opponent won: a candy cannon hidden behind the game-over panel
  //           fires volleys up and out; each candy flies a gravity arc and falls
  //           back down behind the panel and off the bottom (John's design)
  // Every number the code uses lives in these tables, so a mood is one row to
  // tune. Shares are fractions of the screen: ".25" of the width, and so on.
  const RAIN = {
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
  // The cannon aims for about half the rain's density: 5 to 8 candies every
  // 0.6 s is roughly 11 a second against the rain's 22.
  const CANNON = {
    perVolley: [5, 8],      // candies in one shot (random in range)
    volleyMs: [450, 750],   // pause between shots (random in range)
    maxOnScreen: 60,
    brandChance: .75,       // 75% brand candies, 25% generic wrappers
    spread: .25,            // launch zone width as a share of the screen width, centred
    angle: 30,              // aim up to this many degrees either side of straight up
    rise: [.25, .6],        // how high a candy climbs above the muzzle, as a share of the screen height
    gravity: 1.8,           // screen heights per second squared (smaller = floatier)
    turns: [90, 540],       // tumble over the whole flight, degrees
    samples: 40             // keyframes per arc (more = smoother, 40 is plenty)
  };
  root.CandyRain = function ({ host, candies, generic = './assets/generic-candies/candy-bar.png' }) {
    let layer = null, delay = null, interval = null, volley = null;
    let mood = RAIN.full, dropped = 0; // dropped counts candies since the last start()
    let muzzle = null;                 // the element the cannon hides behind
    const animations = new Set();
    function stop() {
      clearTimeout(delay); clearInterval(interval); clearTimeout(volley); delay = interval = volley = null;
      for (const animation of animations) animation.cancel();
      animations.clear(); layer?.remove(); layer = null;
    }
    // drain(): no new candies; resolves when the ones in flight have gone.
    async function drain() {
      clearTimeout(delay); clearInterval(interval); clearTimeout(volley); delay = interval = volley = null;
      const finishingLayer = layer;
      await Promise.allSettled([...animations].map(animation => animation.finished));
      // A later start may already have created a new rain layer.
      if (layer === finishingLayer) { finishingLayer?.remove(); layer = null; }
    }
    function between(range) { return range[0] + Math.random() * (range[1] - range[0]); }
    function reducedMotion() { return matchMedia('(prefers-reduced-motion: reduce)').matches; }
    // One candy image, sized like the rain's: wrappers smaller, brands larger.
    function makeCandy(wrapper, width) {
      const size = width * (.08 + Math.random() * .11) * (wrapper ? 1 : 1.5 + Math.random());
      const candy = document.createElement('img');
      candy.alt = ''; candy.draggable = false;
      candy.src = wrapper ? generic : candies[Math.floor(Math.random() * candies.length)];
      candy.dataset.kind = wrapper ? 'generic' : 'brand';
      // A wrapper gets a random tint; a brand keeps its own colours.
      const tint = wrapper ? `hue-rotate(${Math.floor(Math.random() * 360)}deg) saturate(${.7 + Math.random() * 1.1}) brightness(${.85 + Math.random() * .35}) ` : '';
      Object.assign(candy.style, {
        position: 'absolute', left: '0', top: '0',
        width: size + 'px', height: size + 'px', objectFit: 'contain', pointerEvents: 'none',
        filter: tint + (mood.filter || '') + ' drop-shadow(0 2px 2px #0005)'
      });
      return { candy, size };
    }
    function track(animation, candy) {
      animations.add(animation);
      animation.finished.then(() => { animations.delete(animation); candy.remove(); }).catch(() => {});
    }
    // ---- Rain: straight down with a little sideways drift ----------------------
    function drop() {
      if (!layer || layer.childElementCount >= mood.maxOnScreen || dropped >= mood.total) return;
      dropped++;
      const { width, height } = host.getBoundingClientRect();
      const wrapper = !mood.brands || Math.random() < .6;
      const { candy, size } = makeCandy(wrapper, width);
      layer.append(candy);
      const startX = Math.random() * width - size / 2;
      const angle = Math.random() * 360;
      const reduced = reducedMotion();
      const turns = reduced ? 0 : (Math.random() < .5 ? -1 : 1) * between(mood.turns);
      const drift = reduced ? 0 : (Math.random() - .5) * width * mood.drift;
      track(candy.animate([
        { transform: `translate(${startX}px, ${-2 * size}px) rotate(${angle}deg)` },
        { transform: `translate(${startX + drift}px, ${height + 2 * size}px) rotate(${angle + turns}deg)` }
      ], { duration: reduced ? 6500 : between(mood.fallMs), easing: 'cubic-bezier(.35,0,.8,.6)' }), candy);
    }
    // ---- Cannon: a gravity arc from behind the game-over panel -----------------
    // Schoolbook projectile motion. With the launch speed split into an upward
    // part vy and a sideways part vx, after t seconds the candy is at
    //   x = x0 + vx * t          y = y0 - vy * t + gravity * t * t / 2
    // (y grows downwards on a screen, so gravity adds to it). The arc is sampled
    // into keyframes and played with linear easing, which keeps the browser's
    // animation machinery doing the work, exactly like the rain.
    function fire() {
      if (!layer || layer.childElementCount >= CANNON.maxOnScreen) return;
      const { width, height } = host.getBoundingClientRect();
      const reduced = reducedMotion();
      const wrapper = Math.random() >= CANNON.brandChance;
      const { candy, size } = makeCandy(wrapper, width);
      layer.append(candy);
      // The muzzle is the top edge of the panel the cannon hides behind; if
      // there is none, the bottom edge of the screen.
      const panel = muzzle?.getBoundingClientRect();
      const hostBox = host.getBoundingClientRect();
      const muzzleY = panel ? panel.top - hostBox.top : height;
      const x0 = width / 2 + (Math.random() - .5) * width * CANNON.spread - size / 2;
      const y0 = muzzleY - size / 2;
      // Speeds in pixels per second. The rise decides the upward speed
      // (vy² = 2 g h) and the aim angle turns some of it sideways.
      const gravity = CANNON.gravity * height;
      const vy = Math.sqrt(2 * gravity * between(CANNON.rise) * height);
      const aim = (Math.random() - .5) * 2 * CANNON.angle * Math.PI / 180;
      const vx = vy * Math.tan(aim);
      // Flight time until the candy is well below the bottom edge.
      const groundY = height + 2 * size;
      const flight = (vy + Math.sqrt(vy * vy + 2 * gravity * (groundY - y0))) / gravity;
      const angle = Math.random() * 360;
      const turns = reduced ? 0 : (Math.random() < .5 ? -1 : 1) * between(CANNON.turns);
      const frames = [];
      for (let i = 0; i <= CANNON.samples; i++) {
        const t = flight * i / CANNON.samples;
        frames.push({ transform: `translate(${x0 + vx * t}px, ${y0 - vy * t + gravity * t * t / 2}px) rotate(${angle + turns * i / CANNON.samples}deg)` });
      }
      track(candy.animate(frames, { duration: flight * 1000, easing: 'linear' }), candy);
    }
    function scheduleVolley() {
      const reduced = reducedMotion();
      volley = setTimeout(() => {
        const count = reduced ? 2 : Math.round(between(CANNON.perVolley));
        for (let i = 0; i < count; i++) fire();
        scheduleVolley();
      }, reduced ? 1500 : between(CANNON.volleyMs));
    }
    // start(waitMs, moodName, behind): the show begins after waitMs. moodName
    // is 'full', 'tie' or 'cannon' (anything else means full). For the cannon,
    // "behind" is the element it hides behind (the game-over panel).
    function start(waitMs = 3000, moodName = 'full', behind = null) {
      stop();
      mood = RAIN[moodName] || RAIN.full; dropped = 0; muzzle = behind;
      delay = setTimeout(() => {
        layer = document.createElement('div'); layer.className = 'candy-rain'; layer.dataset.mood = moodName; layer.setAttribute('aria-hidden', 'true');
        Object.assign(layer.style, { position: 'absolute', inset: '0', overflow: 'hidden', pointerEvents: 'none', zIndex: '2' });
        host.append(layer);
        if (moodName === 'cannon') { scheduleVolley(); return; }
        const reduced = reducedMotion();
        for (let i = 0; i < (reduced ? 2 : mood.burst); i++) drop();
        interval = setInterval(() => { for (let i = 0; i < (reduced ? 1 : mood.perTick); i++) drop(); }, reduced ? 900 : mood.tickMs);
      }, waitMs);
    }
    return { start, stop, drain };
  };
})(globalThis);
