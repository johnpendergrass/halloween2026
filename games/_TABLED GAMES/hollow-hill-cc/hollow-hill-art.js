/* Hollow Hill - the artwork.

   Every scene is drawn as SVG markup, built from small helper functions
   (a moon, a tree, a tombstone, a character...). hollow-hill.js drops the
   markup into the <svg viewBox="0 0 1000 1120"> in index.html, so every
   number here is in those units: 1000 wide, 1120 tall, (0,0) top left.

   A scene function receives the story flags and draws the scene as it is
   RIGHT NOW: the gate open or shut, the crows with or without the hat.
   That is the only "state" the art knows about.

   The drawing style is flat shapes with a little shading, so everything
   stays small and sharp at any size, and can be edited by hand. */

"use strict";

const ART = (() => {

  /* ---- Tiny helpers -------------------------------------------------- */

  /** A repeatable random-number maker, so the stars land in the same
      places every time the scene is drawn. */
  function makeRandom(seed) {
    let value = seed;
    return () => {
      value = (value * 1664525 + 1013904223) % 4294967296;
      return value / 4294967296;
    };
  }

  function sky(top, middle, bottom, horizon = 0.75) {
    return `
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${top}"/>
          <stop offset="${horizon}" stop-color="${middle}"/>
          <stop offset="1" stop-color="${bottom}"/>
        </linearGradient>
      </defs>
      <rect width="1000" height="1120" fill="url(#skyGrad)"/>`;
  }

  function stars(seed, count, lowestY) {
    const random = makeRandom(seed);
    let out = "";
    for (let i = 0; i < count; i++) {
      const x = Math.round(random() * 1000);
      const y = Math.round(random() * lowestY);
      const r = 1.5 + random() * 2;
      out += `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="#fff" opacity="${(0.4 + random() * 0.6).toFixed(2)}"/>`;
    }
    return out;
  }

  function moon(x, y, r) {
    return `
      <circle cx="${x}" cy="${y}" r="${r * 1.35}" fill="#f6e7b0" opacity="0.12"/>
      <circle cx="${x}" cy="${y}" r="${r}" fill="#f6e7b0"/>
      <circle cx="${x - r * 0.3}" cy="${y - r * 0.2}" r="${r * 0.16}" fill="#e6d59a"/>
      <circle cx="${x + r * 0.25}" cy="${y + r * 0.3}" r="${r * 0.1}" fill="#e6d59a"/>`;
  }

  /** Rolling hills as one filled path. `points` are [x, y] tops. */
  function hills(color, points) {
    let d = `M0 1120 L0 ${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[i + 1];
      const cx = (x1 + x2) / 2;
      d += ` Q${cx} ${Math.min(y1, y2) - 40} ${x2} ${y2}`;
    }
    d += ` L1000 1120 Z`;
    return `<path d="${d}" fill="${color}"/>`;
  }

  function ground(y, color) {
    return `<rect x="0" y="${y}" width="1000" height="${1120 - y}" fill="${color}"/>`;
  }

  /** A bare, crooked tree. (x, y) is the base of the trunk. */
  function tree(x, y, scale = 1, color = "#0d0716") {
    const s = scale;
    return `
      <g transform="translate(${x} ${y}) scale(${s})" fill="${color}">
        <path d="M-22 0 L-14 -120 L-60 -200 L-52 -206 L-10 -140 L-6 -250 L-40 -320 L-30 -324 L0 -270 L30 -330 L40 -324 L10 -250 L14 -170 L64 -220 L70 -212 L18 -130 L22 0 Z"/>
      </g>`;
  }

  /** A tombstone. `mark` is optional carved text or symbols (SVG markup). */
  function tombstone(x, y, w, h, mark = "", color = "#6b6478") {
    return `
      <g transform="translate(${x} ${y})">
        <rect x="${-w / 2 - 10}" y="${-8}" width="${w + 20}" height="14" rx="4" fill="#2a2a34"/>
        <path d="M${-w / 2} 0 V${-h + w / 2} A${w / 2} ${w / 2} 0 0 1 ${w / 2} ${-h + w / 2} V0 Z" fill="${color}"/>
        <path d="M${-w / 2} 0 V${-h + w / 2} A${w / 2} ${w / 2} 0 0 1 ${0} ${-h}" fill="none" stroke="#fff" stroke-opacity="0.12" stroke-width="6"/>
        ${mark}
      </g>`;
  }

  /** A pumpkin. `lit` gives it a glowing face. */
  function pumpkin(x, y, r, lit, withFace = true) {
    const body = lit ? "#ff9a2e" : "#c96a1c";
    const dark = lit ? "#e8741c" : "#9a4e12";
    const faceColor = lit ? "#fff1a8" : "#3a2010";
    let out = `<g transform="translate(${x} ${y})">`;
    if (lit) out += `<circle r="${r * 1.6}" fill="#ffb347" opacity="0.18"/>`;
    out += `
      <rect x="${-r * 0.12}" y="${-r * 1.15}" width="${r * 0.24}" height="${r * 0.35}" rx="${r * 0.06}" fill="#4f7a2e"/>
      <ellipse cx="0" cy="0" rx="${r}" ry="${r * 0.85}" fill="${body}"/>
      <ellipse cx="${-r * 0.45}" cy="0" rx="${r * 0.42}" ry="${r * 0.82}" fill="${dark}" opacity="0.45"/>
      <ellipse cx="${r * 0.45}" cy="0" rx="${r * 0.42}" ry="${r * 0.82}" fill="${dark}" opacity="0.45"/>
      <ellipse cx="0" cy="0" rx="${r * 0.4}" ry="${r * 0.85}" fill="${body}"/>`;
    if (withFace) {
      out += `
      <path d="M${-r * 0.5} ${-r * 0.1} L${-r * 0.2} ${-r * 0.1} L${-r * 0.35} ${-r * 0.4} Z" fill="${faceColor}"/>
      <path d="M${r * 0.5} ${-r * 0.1} L${r * 0.2} ${-r * 0.1} L${r * 0.35} ${-r * 0.4} Z" fill="${faceColor}"/>
      <path d="M${-r * 0.55} ${r * 0.2} L${-r * 0.35} ${r * 0.42} L${-r * 0.2} ${r * 0.22} L${0} ${r * 0.48} L${r * 0.2} ${r * 0.22} L${r * 0.35} ${r * 0.42} L${r * 0.55} ${r * 0.2} Z" fill="${faceColor}"/>`;
    }
    return out + "</g>";
  }

  /** A village house seen from the front. */
  function house(x, y, w, h, roofColor, wallColor, lit) {
    const win = lit ? "#ffd34d" : "#1a1220";
    return `
      <g transform="translate(${x} ${y})">
        <rect x="0" y="${-h}" width="${w}" height="${h}" fill="${wallColor}"/>
        <path d="M-14 ${-h} L${w / 2} ${-h - w * 0.55} L${w + 14} ${-h} Z" fill="${roofColor}"/>
        <rect x="${w * 0.18}" y="${-h * 0.75}" width="${w * 0.22}" height="${w * 0.22}" fill="${win}"/>
        <rect x="${w * 0.6}" y="${-h * 0.75}" width="${w * 0.22}" height="${w * 0.22}" fill="${win}"/>
        <rect x="${w * 0.38}" y="${-h * 0.42}" width="${w * 0.24}" height="${h * 0.42}" rx="6" fill="#2a1a12"/>
      </g>`;
  }

  /* ---- Characters ---------------------------------------------------- */

  /** The mayor: a vampire in a bathrobe and slippers. Feet at (x, y). */
  function mayor(x, y) {
    return `
      <g transform="translate(${x} ${y})"><g class="bob-slow">
        <ellipse cx="-30" cy="0" rx="34" ry="12" fill="#c94f7c"/>
        <ellipse cx="34" cy="0" rx="34" ry="12" fill="#c94f7c"/>
        <path d="M-70 -20 L-90 -230 L90 -230 L70 -20 Z" fill="#5a2d8a"/>
        <path d="M-90 -230 L-40 -260 L0 -170 L40 -260 L90 -230 Z" fill="#3d1f60"/>
        <rect x="-74" y="-130" width="148" height="18" fill="#c94f7c"/>
        <path d="M-40 -260 L0 -170 L40 -260 L30 -262 L0 -200 L-30 -262 Z" fill="#e8e0f0"/>
        <path d="M-105 -250 Q-140 -160 -110 -40 L-70 -60 L-75 -230 Z" fill="#1d0f2e"/>
        <path d="M105 -250 Q140 -160 110 -40 L70 -60 L75 -230 Z" fill="#1d0f2e"/>
        <ellipse cx="0" cy="-300" rx="52" ry="60" fill="#e9e2f0"/>
        <path d="M-52 -320 Q-40 -380 0 -372 Q40 -380 52 -320 L52 -300 Q30 -330 0 -300 Q-30 -330 -52 -300 Z" fill="#14101c"/>
        <ellipse cx="-20" cy="-300" rx="7" ry="9" fill="#2a2230"/>
        <ellipse cx="20" cy="-300" rx="7" ry="9" fill="#2a2230"/>
        <path d="M-18 -268 Q0 -256 18 -268" stroke="#2a2230" stroke-width="4" fill="none"/>
        <path d="M-12 -266 L-8 -252 L-4 -266 Z" fill="#fff"/>
        <path d="M12 -266 L8 -252 L4 -266 Z" fill="#fff"/>
        <path d="M-36 -320 Q-20 -336 -4 -322" stroke="#14101c" stroke-width="5" fill="none"/>
        <path d="M4 -322 Q20 -336 36 -320" stroke="#14101c" stroke-width="5" fill="none"/>
        <ellipse cx="0" cy="-236" rx="26" ry="10" fill="#f3d38a"/>
      </g></g>`;
  }

  /** The scarecrow guard on his pole. With or without his hat. */
  function scarecrow(x, y, hasHat) {
    return `
      <g transform="translate(${x} ${y})">
        <rect x="-10" y="-380" width="20" height="380" fill="#5a3a1e"/>
        <rect x="-150" y="-300" width="300" height="16" fill="#5a3a1e"/>
        <g class="sway">
          <path d="M-90 -290 L-110 -60 L110 -60 L90 -290 Z" fill="#8a4b2a"/>
          <path d="M-90 -290 L-70 -60 L-30 -60 L-40 -290 Z" fill="#a85f35" opacity="0.8"/>
          <path d="M20 -290 L30 -60 L70 -60 L60 -290 Z" fill="#a85f35" opacity="0.8"/>
          <rect x="-160" y="-290" width="70" height="40" rx="8" fill="#8a4b2a"/>
          <rect x="90" y="-290" width="70" height="40" rx="8" fill="#8a4b2a"/>
          <g stroke="#e0b64a" stroke-width="7" stroke-linecap="round">
            <path d="M-160 -280 L-190 -300 M-160 -270 L-195 -268 M-160 -258 L-188 -240"/>
            <path d="M160 -280 L190 -300 M160 -270 L195 -268 M160 -258 L188 -240"/>
            <path d="M-60 -60 L-70 -20 M-30 -60 L-34 -18 M30 -60 L36 -18 M60 -60 L72 -22"/>
          </g>
          <path d="M-60 -290 Q-70 -300 -60 -310 L60 -310 Q70 -300 60 -290 Z" fill="#e0b64a"/>
          <ellipse cx="0" cy="-370" rx="62" ry="70" fill="#d9b26f"/>
          <path d="M-62 -350 Q-30 -320 -60 -300" fill="none" stroke="#b58e4e" stroke-width="4"/>
          <circle cx="-22" cy="-380" r="8" fill="#2a2230"/>
          <circle cx="24" cy="-380" r="8" fill="#2a2230"/>
          <path d="M-26 -346 L-16 -338 L-6 -346 L4 -338 L14 -346 L24 -338" stroke="#2a2230" stroke-width="5" fill="none" stroke-linecap="round"/>
          ${hasHat ? hat(0, -430, 1) : ""}
        </g>
      </g>`;
  }

  /** The scarecrow's floppy straw hat. Sits with its brim centre at (x, y). */
  function hat(x, y, scale) {
    return `
      <g transform="translate(${x} ${y}) scale(${scale})">
        <ellipse cx="0" cy="0" rx="96" ry="18" fill="#a67c3a"/>
        <path d="M-58 -4 L-48 -74 Q0 -96 48 -74 L58 -4 Z" fill="#c4954a"/>
        <rect x="-52" y="-30" width="104" height="14" fill="#7a3e5e"/>
      </g>`;
  }

  /** The skeleton, with or without his skull. Feet at (x, y). */
  function skeleton(x, y, hasSkull) {
    return `
      <g transform="translate(${x} ${y})"><g class="bob">
        <g stroke="#efe6d3" stroke-width="12" stroke-linecap="round" fill="none">
          <path d="M-30 0 L-30 -110 M30 0 L30 -110"/>
          <path d="M-30 -110 L0 -150 L30 -110"/>
          <path d="M0 -150 L0 -260"/>
          ${hasSkull
            ? `<path d="M-40 -230 L-90 -170 M40 -230 L90 -170"/>`
            : `<path d="M-40 -230 L-100 -300 M40 -230 L100 -300"/>`}
        </g>
        <g fill="#efe6d3">
          <ellipse cx="0" cy="-230" rx="46" ry="16"/>
          <ellipse cx="0" cy="-205" rx="40" ry="14"/>
          <ellipse cx="0" cy="-180" rx="32" ry="12"/>
          <ellipse cx="0" cy="-158" rx="22" ry="10"/>
          <circle cx="${hasSkull ? -90 : -100}" cy="${hasSkull ? -170 : -300}" r="12"/>
          <circle cx="${hasSkull ? 90 : 100}" cy="${hasSkull ? -170 : -300}" r="12"/>
        </g>
        ${hasSkull ? skull(0, -300, 1) : `<circle cx="0" cy="-268" r="10" fill="#efe6d3"/>`}
      </g></g>`;
  }

  /** A skull, centred at (x, y). */
  function skull(x, y, scale) {
    return `
      <g transform="translate(${x} ${y}) scale(${scale})">
        <ellipse cx="0" cy="-6" rx="46" ry="42" fill="#efe6d3"/>
        <rect x="-28" y="18" width="56" height="26" rx="8" fill="#efe6d3"/>
        <ellipse cx="-17" cy="-6" rx="11" ry="13" fill="#2a2230"/>
        <ellipse cx="17" cy="-6" rx="11" ry="13" fill="#2a2230"/>
        <path d="M-4 14 L0 6 L4 14 Z" fill="#2a2230"/>
        <path d="M-18 30 V42 M-6 30 V42 M6 30 V42 M18 30 V42" stroke="#2a2230" stroke-width="3"/>
      </g>`;
  }

  /** Two crows on a perch. One wears the scarecrow's hat until it is traded. */
  function crows(x, y, withHat) {
    return `
      <g transform="translate(${x} ${y})" stroke="#8a8298" stroke-width="3">
        <g class="bob-slow">
          <ellipse cx="-50" cy="-30" rx="40" ry="28" fill="#15111c"/>
          <circle cx="-80" cy="-58" r="20" fill="#15111c"/>
          <path d="M-98 -56 L-122 -50 L-98 -46 Z" fill="#d9a441"/>
          <circle cx="-86" cy="-62" r="4" fill="#ffd34d"/>
          <path d="M-14 -34 L14 -20 L-10 -14 Z" fill="#15111c"/>
          ${withHat ? hat(-80, -74, 0.42) : ""}
        </g>
        <g class="bob">
          <ellipse cx="60" cy="-26" rx="36" ry="25" fill="#15111c"/>
          <circle cx="88" cy="-50" r="18" fill="#15111c"/>
          <path d="M104 -48 L126 -42 L104 -38 Z" fill="#d9a441"/>
          <circle cx="94" cy="-54" r="4" fill="#ffd34d"/>
          <path d="M28 -30 L0 -14 L26 -10 Z" fill="#15111c"/>
        </g>
      </g>`;
  }

  /** Madame Wail, the ghost organist, sitting at her organ. */
  function ghost(x, y) {
    return `
      <g transform="translate(${x} ${y})"><g class="bob-slow">
        <path d="M-70 0 Q-80 -60 -70 -140 Q-60 -220 0 -230 Q60 -220 70 -140 Q80 -60 70 0 L50 -22 L30 0 L10 -22 L-10 0 L-30 -22 L-50 0 Z" fill="#f3f0ff" opacity="0.92"/>
        <circle cx="-22" cy="-160" r="16" fill="none" stroke="#2a2230" stroke-width="4"/>
        <circle cx="22" cy="-160" r="16" fill="none" stroke="#2a2230" stroke-width="4"/>
        <path d="M-6 -160 L6 -160" stroke="#2a2230" stroke-width="4"/>
        <circle cx="-22" cy="-160" r="6" fill="#2a2230"/>
        <circle cx="22" cy="-160" r="6" fill="#2a2230"/>
        <ellipse cx="0" cy="-118" rx="10" ry="14" fill="#2a2230"/>
        <path d="M-70 -120 L-120 -100 M70 -120 L120 -100" stroke="#f3f0ff" stroke-width="18" stroke-linecap="round"/>
      </g></g>`;
  }

  /** A bat hanging upside down from a point (x, y). */
  function bat(x, y, scale = 1) {
    return `
      <g transform="translate(${x} ${y}) scale(${scale})"><g class="bob">
        <path d="M0 0 L0 30" stroke="#15111c" stroke-width="6"/>
        <ellipse cx="0" cy="48" rx="16" ry="24" fill="#15111c"/>
        <path d="M-14 40 Q-50 60 -60 24 Q-40 40 -20 34 Z" fill="#15111c"/>
        <path d="M14 40 Q50 60 60 24 Q40 40 20 34 Z" fill="#15111c"/>
        <circle cx="-6" cy="66" r="3" fill="#ffd34d"/>
        <circle cx="6" cy="66" r="3" fill="#ffd34d"/>
      </g></g>`;
  }

  /** A frog on a lily pad. */
  function frog(x, y, scale = 1) {
    return `
      <g transform="translate(${x} ${y}) scale(${scale})">
        <ellipse cx="0" cy="10" rx="80" ry="24" fill="#2f6b3a"/>
        <path d="M0 10 L60 -8 L70 8 Z" fill="#1f4d2a"/>
        <g class="bob">
          <ellipse cx="0" cy="-20" rx="38" ry="26" fill="#5fae4a"/>
          <circle cx="-18" cy="-42" r="12" fill="#5fae4a"/>
          <circle cx="18" cy="-42" r="12" fill="#5fae4a"/>
          <circle cx="-18" cy="-44" r="6" fill="#2a2230"/>
          <circle cx="18" cy="-44" r="6" fill="#2a2230"/>
          <path d="M-16 -18 Q0 -8 16 -18" stroke="#2a2230" stroke-width="3" fill="none"/>
        </g>
      </g>`;
  }

  /** A will-o'-wisp: a glowing ball with a soft trail. */
  function wisp(x, y, driftClass) {
    return `
      <g transform="translate(${x} ${y})"><g class="${driftClass}">
        <circle r="46" fill="#b7f5d8" opacity="0.18"/>
        <circle r="28" fill="#b7f5d8" opacity="0.5" class="flicker"/>
        <circle r="14" fill="#f3fff9"/>
        <circle cx="-6" cy="-3" r="3" fill="#2a2230"/>
        <circle cx="6" cy="-3" r="3" fill="#2a2230"/>
      </g></g>`;
  }

  /** The Great Pumpkin, the size of a house. */
  function greatPumpkin(x, y, lit, candlePlaced) {
    let out = pumpkin(x, y, 300, lit);
    if (!lit && candlePlaced) {
      // An unlit candle showing through the mouth.
      out += `<rect x="${x - 14}" y="${y + 60}" width="28" height="70" rx="6" fill="#f3e6c0"/>`;
    }
    return out;
  }

  /** The iron gate between two stone pillars. */
  function gate(x, y, open) {
    const bars = open
      ? `<g transform="translate(-150 -290) rotate(-70)">${ironBars()}</g>
         <g transform="translate(150 -290) scale(-1 1) rotate(-70)">${ironBars()}</g>`
      : `<g transform="translate(-150 -290)">${ironBars()}</g>
         <g transform="translate(150 -290) scale(-1 1)">${ironBars()}</g>`;
    return `
      <g transform="translate(${x} ${y})">
        <rect x="-210" y="-360" width="60" height="360" fill="#5a5566"/>
        <rect x="150" y="-360" width="60" height="360" fill="#5a5566"/>
        <rect x="-220" y="-380" width="80" height="30" fill="#6b6478"/>
        <rect x="140" y="-380" width="80" height="30" fill="#6b6478"/>
        ${pumpkin(-180, -410, 34, true)}
        ${pumpkin(180, -410, 34, true)}
        ${bars}
      </g>`;
  }

  function ironBars() {
    let out = `<rect x="0" y="0" width="150" height="290" fill="none" stroke="#2a2a34" stroke-width="10"/>`;
    for (let i = 1; i < 5; i++) out += `<line x1="${i * 30}" y1="0" x2="${i * 30}" y2="290" stroke="#2a2a34" stroke-width="8"/>`;
    out += `<path d="M0 0 Q75 -50 150 0" fill="none" stroke="#2a2a34" stroke-width="10"/>`;
    return out;
  }

  /** The four carved symbols on the crypt door. */
  function symbolMoon(x, y) {
    return `<path d="M${x + 20} ${y - 40} A42 42 0 1 0 ${x + 20} ${y + 40} A30 30 0 1 1 ${x + 20} ${y - 40} Z" fill="#c9c2d8"/>`;
  }
  function symbolBat(x, y) {
    return `<path d="M${x} ${y - 10} Q${x - 20} ${y - 40} ${x - 50} ${y - 20} Q${x - 30} ${y} ${x - 40} ${y + 24} Q${x - 20} ${y + 14} ${x} ${y + 30} Q${x + 20} ${y + 14} ${x + 40} ${y + 24} Q${x + 30} ${y} ${x + 50} ${y - 20} Q${x + 20} ${y - 40} ${x} ${y - 10} Z" fill="#c9c2d8"/>`;
  }
  function symbolPumpkin(x, y) {
    return `<ellipse cx="${x}" cy="${y + 6}" rx="42" ry="34" fill="#c9c2d8"/><rect x="${x - 5}" y="${y - 42}" width="10" height="16" fill="#c9c2d8"/>
            <path d="M${x - 22} ${y} L${x - 8} ${y} L${x - 15} ${y - 14} Z M${x + 22} ${y} L${x + 8} ${y} L${x + 15} ${y - 14} Z M${x - 22} ${y + 14} L${x + 22} ${y + 14} L${x} ${y + 26} Z" fill="#3a3244"/>`;
  }
  function symbolSkull(x, y) {
    return `<ellipse cx="${x}" cy="${y - 6}" rx="36" ry="32" fill="#c9c2d8"/><rect x="${x - 20}" y="${y + 12}" width="40" height="20" rx="6" fill="#c9c2d8"/>
            <ellipse cx="${x - 13}" cy="${y - 6}" rx="8" ry="10" fill="#3a3244"/><ellipse cx="${x + 13}" cy="${y - 6}" rx="8" ry="10" fill="#3a3244"/>`;
  }

  /* ---- The scenes ---------------------------------------------------- */

  function square(f) {
    const lit = f.lit;
    return `
      ${sky("#0f0822", "#2e1a44", "#5a2f6a")}
      ${stars(11, 60, 600)}
      ${moon(160, 150, 60)}
      ${hills("#1c1230", [[0, 620], [250, 560], [500, 480], [750, 540], [1000, 600]])}
      ${pumpkin(500, 470, 56, lit)}
      ${hills("#231838", [[0, 700], [300, 660], [600, 690], [1000, 640]])}
      ${house(40, 760, 170, 150, "#3d2b4a", "#5a4260", lit)}
      ${house(240, 780, 150, 170, "#4a2f5a", "#6b4a70", lit)}
      ${house(760, 770, 200, 160, "#3d2b4a", "#5a4260", lit)}
      ${ground(760, "#3a2f4a")}
      <ellipse cx="500" cy="1000" rx="620" ry="160" fill="#4a3d5c"/>
      <g fill="#5a4d6c">
        <ellipse cx="300" cy="960" rx="40" ry="14"/><ellipse cx="420" cy="1010" rx="46" ry="16"/>
        <ellipse cx="600" cy="980" rx="42" ry="14"/><ellipse cx="720" cy="1040" rx="50" ry="16"/>
        <ellipse cx="180" cy="1040" rx="44" ry="15"/><ellipse cx="520" cy="1070" rx="40" ry="13"/>
      </g>
      <g transform="translate(200 900)">
        <rect x="-10" y="-300" width="20" height="300" fill="#5a3a1e"/>
        <path d="M-10 -280 L-130 -280 L-150 -255 L-130 -230 L-10 -230 Z" fill="#8a5a2e"/>
        <path d="M10 -210 L130 -210 L150 -185 L130 -160 L10 -160 Z" fill="#8a5a2e"/>
        <path d="M-10 -140 L-130 -140 L-150 -115 L-130 -90 L-10 -90 Z" fill="#8a5a2e"/>
        <path d="M10 -270 L110 -270 L130 -245 L110 -220 L10 -220 Z" fill="#8a5a2e" opacity="0.001"/>
        <text x="-70" y="-247" font-family="Arial" font-size="30" font-weight="700" fill="#2a1a12" text-anchor="middle">CHAPEL</text>
        <text x="72" y="-177" font-family="Arial" font-size="30" font-weight="700" fill="#2a1a12" text-anchor="middle">GRAVES</text>
        <text x="-70" y="-107" font-family="Arial" font-size="30" font-weight="700" fill="#2a1a12" text-anchor="middle">BOG</text>
      </g>
      <g transform="translate(480 860)">
        <rect x="-50" y="-70" width="100" height="70" rx="10" fill="#6b4a2e"/>
        <rect x="-54" y="-76" width="108" height="14" rx="6" fill="#8a5a2e"/>
        <g class="bob-slow">
          <ellipse cx="0" cy="-100" rx="34" ry="24" fill="#15111c"/>
          <path d="M-26 -118 L-22 -140 L-8 -122 Z M26 -118 L22 -140 L8 -122 Z" fill="#15111c"/>
          <circle cx="-12" cy="-104" r="5" fill="#ffd34d"/><circle cx="12" cy="-104" r="5" fill="#ffd34d"/>
          <path d="M34 -96 Q70 -110 60 -70" stroke="#15111c" stroke-width="10" fill="none" stroke-linecap="round"/>
        </g>
      </g>
      ${mayor(760, 900)}`;
  }

  function gateScene(f) {
    return `
      ${sky("#0f0822", "#2e1a44", "#5a2f6a", 0.6)}
      ${stars(23, 50, 500)}
      ${moon(820, 130, 50)}
      ${hills("#1c1230", [[0, 560], [300, 420], [500, 330], [700, 400], [1000, 560]])}
      ${pumpkin(500, 330, 70, f.lit)}
      <path d="M470 900 Q500 700 500 400" stroke="#4a3d5c" stroke-width="60" fill="none" opacity="0.6"/>
      ${ground(900, "#26402e")}
      <rect x="0" y="560" width="1000" height="340" fill="#4a4556"/>
      <rect x="0" y="560" width="1000" height="24" fill="#5a5566"/>
      <g fill="#3f3a4b">
        <rect x="40" y="620" width="120" height="50" rx="4"/><rect x="220" y="700" width="140" height="50" rx="4"/>
        <rect x="80" y="790" width="120" height="50" rx="4"/><rect x="800" y="640" width="130" height="50" rx="4"/>
        <rect x="860" y="760" width="110" height="50" rx="4"/>
      </g>
      <rect x="330" y="560" width="340" height="340" fill="#1c1230"/>
      <path d="M470 900 Q500 750 500 600" stroke="#4a3d5c" stroke-width="50" fill="none" opacity="0.8"/>
      ${gate(500, 900, f.gateOpen)}
      ${scarecrow(200, 900, f.hatReturned)}
      ${tree(900, 900, 0.7)}`;
  }

  function graveyard(f) {
    // The hint: moon, bat, pumpkin, in a row, small enough to read as carving.
    const hintMark = `<g transform="translate(0 -100) scale(0.42)">${symbolMoon(-120, 0)}${symbolBat(0, 0)}${symbolPumpkin(120, 0)}</g>`;
    return `
      ${sky("#0f0822", "#2e1a44", "#3a2450")}
      ${stars(37, 70, 700)}
      ${moon(500, 170, 70)}
      ${hills("#1c1230", [[0, 660], [300, 600], [600, 640], [1000, 580]])}
      ${tree(120, 700, 1.1)}
      ${tree(880, 690, 0.9)}
      ${ground(700, "#22382a")}
      <ellipse cx="500" cy="1000" rx="700" ry="200" fill="#2a4633"/>
      <g fill="#1c1230">
        <rect x="0" y="640" width="1000" height="60"/>
      </g>
      <g transform="translate(940 500)">
        <rect x="-60" y="0" width="140" height="240" fill="#4a4556"/>
        <path d="M-70 0 L10 -60 L90 0 Z" fill="#5a5566"/>
        <rect x="-20" y="80" width="60" height="160" fill="#15111c"/>
      </g>
      ${tombstone(120, 940, 90, 140)}
      ${tombstone(860, 960, 100, 150)}
      ${tombstone(520, 920, 170, 200, hintMark, "#7a7288")}
      ${tombstone(720, 900, 150, 200, "", "#6b6478")}
      ${crows(720, 700, !f.hatTaken)}
      ${skeleton(300, 940, f.skullReturned)}
      <g fill="#2f5236">
        <ellipse cx="200" cy="1060" rx="80" ry="18"/><ellipse cx="620" cy="1090" rx="90" ry="20"/>
      </g>`;
  }

  function crypt(f) {
    const doorOpen = f.doorOpen;
    let door;
    if (doorOpen) {
      door = `
        <rect x="320" y="520" width="360" height="400" fill="#0a0612"/>
        <path d="M320 920 L400 920 L400 560 Z" fill="#15111c" opacity="0.8"/>
        ${f.skullTaken ? "" : `<g class="flicker">${skull(500, 850, 1.2)}</g>`}
        <rect x="320" y="520" width="360" height="400" fill="none" stroke="#2a2a34" stroke-width="14"/>`;
    } else {
      door = `
        <rect x="320" y="520" width="360" height="400" fill="#3a3244"/>
        <rect x="336" y="536" width="328" height="368" fill="none" stroke="#2a2230" stroke-width="6"/>
        <g fill="#2a2230">
          <rect x="350" y="560" width="140" height="140" rx="16"/>
          <rect x="510" y="560" width="140" height="140" rx="16"/>
          <rect x="350" y="720" width="140" height="140" rx="16"/>
          <rect x="510" y="720" width="140" height="140" rx="16"/>
        </g>
        ${symbolMoon(420, 630)}
        ${symbolBat(580, 630)}
        ${symbolPumpkin(420, 790)}
        ${symbolSkull(580, 790)}`;
    }
    return `
      ${sky("#0f0822", "#1c1230", "#1c1230", 0.5)}
      ${stars(51, 40, 400)}
      ${tree(60, 760, 1.2)}
      ${tree(960, 740, 1.1)}
      ${ground(920, "#22382a")}
      <rect x="180" y="380" width="640" height="540" fill="#4a4556"/>
      <path d="M150 380 L500 180 L850 380 Z" fill="#5a5566"/>
      <rect x="180" y="380" width="640" height="30" fill="#6b6478"/>
      <g fill="#3f3a4b">
        <rect x="200" y="440" width="110" height="46" rx="4"/><rect x="690" y="470" width="110" height="46" rx="4"/>
        <rect x="220" y="560" width="90" height="46" rx="4"/><rect x="700" y="620" width="100" height="46" rx="4"/>
        <rect x="210" y="760" width="100" height="46" rx="4"/><rect x="690" y="800" width="110" height="46" rx="4"/>
      </g>
      <text x="500" y="470" font-family="Arial" font-size="44" font-weight="700" fill="#2a2230" text-anchor="middle" letter-spacing="6">FAMILY BONES</text>
      ${door}
      ${pumpkin(250, 890, 40, true)}
      ${pumpkin(750, 890, 40, true)}`;
  }

  function chapel(f) {
    let bats = "";
    if (!f.batsFed) {
      bats = [640, 700, 760, 820].map((x, i) => bat(x, 330 + (i % 2) * 30, 0.9)).join("");
    }
    return `
      <rect width="1000" height="1120" fill="#2a2036"/>
      <g fill="#332842">
        <rect x="0" y="0" width="1000" height="80"/><rect x="0" y="160" width="1000" height="80"/>
        <rect x="0" y="320" width="1000" height="80"/><rect x="0" y="480" width="1000" height="80"/>
        <rect x="0" y="640" width="1000" height="80"/>
      </g>
      <g transform="translate(280 380)">
        <path d="M-120 0 V-160 A120 120 0 0 1 120 -160 V0 Z" fill="#1a1230"/>
        <path d="M-120 0 V-160 A120 120 0 0 1 120 -160 V0 Z" fill="none" stroke="#5a4c6e" stroke-width="12"/>
        <circle cx="0" cy="-150" r="50" fill="#f6e7b0"/>
        <path d="M-120 -80 H120 M0 0 V-280 M-80 -160 H80" stroke="#5a4c6e" stroke-width="8"/>
        <path d="M-120 -60 L120 -120 M-120 -120 L120 -60" stroke="#8a5a9e" stroke-width="4" opacity="0.6"/>
      </g>
      ${ground(860, "#3a3244")}
      <g fill="#2a2230">
        <rect x="0" y="860" width="1000" height="10"/>
        ${[0, 1, 2, 3, 4].map((i) => `<rect x="${i * 200}" y="870" width="4" height="250" opacity="0.5"/>`).join("")}
      </g>
      <g transform="translate(750 860)">
        <rect x="-190" y="-560" width="380" height="380" fill="#3d3450"/>
        ${[-150, -100, -50, 0, 50, 100].map((x, i) => `<rect x="${x - 18}" y="${-560 - 60 - (i === 2 || i === 3 ? 60 : Math.abs(i - 2.5) * 20)}" width="36" height="${380 + 60 + (i === 2 || i === 3 ? 60 : Math.abs(i - 2.5) * 20)}" rx="10" fill="#8a8298"/>`).join("")}
        <rect x="-200" y="-190" width="400" height="60" fill="#4a3f5c"/>
        <rect x="-160" y="-150" width="320" height="30" fill="#f3f0ff"/>
        ${[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120].map((x) => `<rect x="${x + 6}" y="-150" width="12" height="18" fill="#2a2230"/>`).join("")}
        <rect x="-140" y="-100" width="280" height="100" fill="#3d3450"/>
      </g>
      ${bats}
      ${ghost(650, 900)}
      <g transform="translate(180 860)">
        <rect x="-16" y="-200" width="32" height="200" fill="#6b6478"/>
        <ellipse cx="0" cy="-200" rx="80" ry="16" fill="#6b6478"/>
        ${[-50, -10, 30].map((x, i) => `
          <rect x="${x - 10}" y="${-300 + i * 12}" width="20" height="${100 - i * 12}" fill="#f3e6c0"/>
          <ellipse cx="${x}" cy="${-310 + i * 12}" rx="8" ry="16" fill="#ffd34d" class="flicker"/>`).join("")}
      </g>
      ${[[180, 1000], [500, 1040]].map(([x, y]) => `<rect x="${x - 120}" y="${y - 40}" width="240" height="40" rx="6" fill="#4a3a2a"/><rect x="${x - 110}" y="${y}" width="20" height="60" fill="#3a2c20"/><rect x="${x + 90}" y="${y}" width="20" height="60" fill="#3a2c20"/>`).join("")}`;
  }

  function bog(f) {
    let wisps = "";
    if (!f.wispCaught) {
      wisps = wisp(300, 450, "drift-a") + wisp(560, 380, "drift-b") + wisp(760, 520, "drift-c");
    }
    return `
      ${sky("#0f0822", "#1f2a3a", "#2f4a3a", 0.55)}
      ${stars(71, 40, 400)}
      ${moon(200, 140, 44)}
      ${hills("#14202a", [[0, 560], [400, 520], [700, 560], [1000, 500]])}
      ${tree(100, 720, 0.9, "#0b1410")}
      ${tree(930, 700, 1.0, "#0b1410")}
      ${tree(520, 700, 0.6, "#0b1410")}
      ${ground(700, "#1e3a2e")}
      <ellipse cx="500" cy="1000" rx="760" ry="260" fill="#2b5a58"/>
      <ellipse cx="500" cy="1000" rx="760" ry="260" fill="#8fd3c8" opacity="0.08"/>
      <g stroke="#1e3a2e" stroke-width="10" stroke-linecap="round">
        <path d="M120 800 L110 660 M150 810 L160 690 M880 820 L890 680 M910 830 L930 700 M700 760 L705 660"/>
      </g>
      <g fill="#c8f0e6" opacity="0.18">
        <ellipse cx="300" cy="820" rx="180" ry="30"/><ellipse cx="700" cy="900" rx="220" ry="34"/>
        <ellipse cx="450" cy="1020" rx="260" ry="36"/>
      </g>
      ${frog(300, 830, 1)}
      ${frog(540, 900, 0.8)}
      <ellipse cx="780" cy="1010" rx="150" ry="50" fill="#3a3a2a"/>
      ${f.spoonTaken ? "" : `<g transform="translate(780 980) rotate(-40)"><rect x="-8" y="-90" width="16" height="110" rx="6" fill="#cfd3d8"/><ellipse cx="0" cy="-100" rx="22" ry="14" fill="#e6eaee"/><circle cx="-6" cy="-104" r="5" fill="#fff" class="flicker"/></g>`}
      ${wisps}`;
  }

  function hilltop(f) {
    const lit = f.lit;
    return `
      ${sky("#0f0822", "#2e1a44", lit ? "#7a3f8a" : "#3a2450", 0.7)}
      ${stars(91, 90, 800)}
      ${moon(140, 160, 70)}
      ${hills("#1c1230", [[0, 800], [200, 760], [500, 720], [800, 780], [1000, 760]])}
      <g transform="translate(0 0)">
        ${[[80, 900], [200, 880], [330, 910], [700, 890], [820, 870], [930, 905]].map(([x, y]) =>
          `<rect x="${x}" y="${y - 40}" width="50" height="40" fill="#2a1f3a"/><path d="M${x - 6} ${y - 40} L${x + 25} ${y - 62} L${x + 56} ${y - 40} Z" fill="#3a2b4c"/>
           <rect x="${x + 16}" y="${y - 30}" width="16" height="14" fill="${lit ? "#ffd34d" : "#1a1220"}"/>`).join("")}
      </g>
      ${hills("#2a4a35", [[0, 940], [300, 860], [500, 820], [700, 860], [1000, 940]])}
      ${greatPumpkin(500, 640, lit, f.candlePlaced)}
      ${lit ? `<g opacity="0.5">${[-60, -30, 0, 30, 60].map((a) => `<path d="M500 640 L${500 + Math.sin(a * Math.PI / 180) * 900} ${640 - Math.cos(a * Math.PI / 180) * 900}" stroke="#ffd34d" stroke-width="40" opacity="0.15"/>`).join("")}</g>` : ""}
      ${pumpkin(120, 980, 40, true)}
      ${pumpkin(880, 990, 40, true)}`;
  }

  /* ---- Inventory icons (their own little SVGs, 100 x 100) ------------- */

  const ITEM_ICONS = {
    candy: `<svg viewBox="0 0 100 100"><path d="M20 30 L35 50 L20 70 Z M80 30 L65 50 L80 70 Z" fill="#ffb347"/><ellipse cx="50" cy="50" rx="22" ry="20" fill="#ff9a2e"/><path d="M40 36 Q50 50 40 64 M60 36 Q50 50 60 64" stroke="#fff" stroke-width="4" fill="none" opacity="0.6"/></svg>`,
    spoon: `<svg viewBox="0 0 100 100"><g transform="rotate(-40 50 50)"><rect x="45" y="30" width="10" height="55" rx="4" fill="#cfd3d8"/><ellipse cx="50" cy="24" rx="16" ry="12" fill="#e6eaee"/><circle cx="46" cy="20" r="3" fill="#fff"/></g></svg>`,
    hat: `<svg viewBox="0 0 100 100">${hat(50, 62, 0.5)}</svg>`,
    skull: `<svg viewBox="0 0 100 100">${skull(50, 50, 0.95)}</svg>`,
    jar: `<svg viewBox="0 0 100 100"><rect x="30" y="14" width="40" height="12" rx="3" fill="#8a6a3a"/><rect x="24" y="26" width="52" height="60" rx="10" fill="#cfe8f5" opacity="0.7"/><rect x="30" y="34" width="8" height="40" rx="4" fill="#fff" opacity="0.6"/></svg>`,
    wispjar: `<svg viewBox="0 0 100 100"><rect x="30" y="14" width="40" height="12" rx="3" fill="#8a6a3a"/><rect x="24" y="26" width="52" height="60" rx="10" fill="#cfe8f5" opacity="0.7"/><circle cx="50" cy="58" r="16" fill="#b7f5d8" opacity="0.6"/><circle cx="50" cy="58" r="8" fill="#f3fff9"/><circle cx="47" cy="56" r="1.6" fill="#2a2230"/><circle cx="53" cy="56" r="1.6" fill="#2a2230"/></svg>`,
    candle: `<svg viewBox="0 0 100 100"><rect x="38" y="36" width="24" height="52" rx="5" fill="#f3e6c0"/><rect x="48" y="26" width="4" height="12" fill="#2a2230"/><ellipse cx="50" cy="24" rx="7" ry="12" fill="#ffd34d"/></svg>`,
  };

  return {
    scenes: { square, gate: gateScene, graveyard, crypt, chapel, bog, hilltop },
    ITEM_ICONS,
  };
})();
