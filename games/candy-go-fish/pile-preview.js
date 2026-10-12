'use strict';
(async function () {
  const imagePath = './assets/generic-candies/candy-bar-v1-300x150.png';
  const inputs = ['dishSize', 'traySize', 'rotation', 'trayRotation', 'spreadX', 'spreadY', 'saturation', 'brightness'];
  const panels = [];
  let nextId = 1;
  let arrangement = 0;
  const status = document.getElementById('status');
  function settings() {
    return Object.fromEntries(inputs.map(id => [id, Number(document.getElementById(id).value)]));
  }
  function randomFor(seed) {
    return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  }
  function locationFor(candy, kind, random, options = settings()) {
    const radians = candy.rotation * Math.PI / 180;
    const halfWidth = candy.widthVw * (Math.abs(Math.cos(radians)) + .5 * Math.abs(Math.sin(radians))) / 2;
    const halfHeight = candy.widthVw * (Math.abs(Math.sin(radians)) + .5 * Math.abs(Math.cos(radians))) / 2;
    if (kind === 'dish') {
      const spreadX = 21 * options.spreadX / 100, spreadY = 21 * options.spreadY / 100;
      const angle = random() * Math.PI * 2, distance = Math.sqrt(random());
      return { x: Math.cos(angle) * distance * spreadX, y: Math.sin(angle) * distance * spreadY + .7 };
    }
    // Leave the witch at the upper edge visible. Large transfers may overlap the rim.
    const spanX = Math.max(.3, 8.6 - halfWidth), spanY = Math.max(.15, 2.6 - halfHeight);
    return { x: (random() * 2 - 1) * spanX, y: 1.8 + (random() * 2 - 1) * spanY };
  }
  function makeCandy(kind, random, options) {
    const palette = [0, 35, 75, 125, 185, 235, 285];
    const candy = {
      id: nextId++, image: imagePath,
      widthVw: (kind === 'dish' ? 21 * options.dishSize : 20 * options.traySize) / 100 * (.88 + random() * .24),
      rotation: (random() * 2 - 1) * (kind === 'dish' ? options.rotation : options.trayRotation),
      hue: palette[Math.floor(random() * palette.length)],
      saturation: options.saturation / 100,
      brightness: options.brightness / 100 * (.96 + random() * .08)
    };
    candy.position = locationFor(candy, kind, random);
    return candy;
  }
  function candyNode(doc, candy) {
    const image = doc.createElement('img');
    image.className = 'study-candy'; image.src = candy.image; image.alt = ''; image.draggable = false;
    image.dataset.candyId = candy.id;
    image.style.width = candy.widthVw + 'vw'; image.style.height = candy.widthVw / 2 + 'vw';
    image.style.left = `calc(50% + ${candy.position.x}vw)`;
    image.style.top = `calc(50% + ${candy.position.y}vw)`;
    image.style.transform = `translate(-50%,-50%) rotate(${candy.rotation}deg)`;
    image.style.filter = `hue-rotate(${candy.hue}deg) saturate(${candy.saturation}) brightness(${candy.brightness}) drop-shadow(0 .15vw .2vw #0006)`;
    return image;
  }
  function renderPanel(panel) {
    for (const kind of ['dish', 'tray']) {
      panel.layers[kind].replaceChildren(...panel.piles[kind].map(candy => candyNode(panel.doc, candy)));
    }
    panel.doc.querySelector('#centerCircle .pile-number').textContent = panel.piles.dish.length;
    panel.doc.getElementById('wendyCount').textContent = panel.piles.tray.length;
    panel.counts.textContent = `Main dish: ${panel.piles.dish.length} · Wendy: ${panel.piles.tray.length}`;
    panel.button.disabled = panel.busy || panel.piles.dish.length === 0;
    const moving = panels.some(candidate => candidate.busy);
    for (const id of [...inputs, 'reroll', 'actualStart']) document.getElementById(id).disabled = moving;
  }
  function populate(panel) {
    const options = settings();
    panel.random = randomFor(42719 + panel.index * 9283 + arrangement * 11003);
    panel.piles = {
      dish: Array.from({length:panel.initialDish}, () => makeCandy('dish', panel.random, options)),
      tray: Array.from({length:panel.initialTray}, () => makeCandy('tray', panel.random, options))
    };
    renderPanel(panel);
  }
  function rebuild() {
    if (panels.some(panel => panel.busy)) return;
    const options = settings();
    for (const id of inputs) document.getElementById(id + 'Value').textContent = options[id] + (id === 'rotation' ? '°' : '%');
    panels.forEach(populate);
  }
  async function moveTopCandy(panel) {
    if (panel.busy || !panel.piles.dish.length) return;
    panel.busy = true;
    const candy = panel.piles.dish.at(-1);
    const source = panel.layers.dish.lastElementChild.getBoundingClientRect();
    panel.piles.dish.pop();
    // Keep image, scale, rotation, hue, saturation and brightness. Only relocate.
    candy.position = locationFor(candy, 'tray', panel.random);
    panel.piles.tray.push(candy);
    renderPanel(panel);
    const destinationNode = panel.layers.tray.lastElementChild;
    const destination = destinationNode.getBoundingClientRect(); destinationNode.style.visibility = 'hidden';
    const width = candy.widthVw * panel.frame.contentWindow.innerWidth / 100;
    const height = width / 2;
    const x = source.left + source.width / 2 - width / 2, y = source.top + source.height / 2 - height / 2;
    const dx = destination.left + destination.width / 2 - width / 2 - x;
    const dy = destination.top + destination.height / 2 - height / 2 - y;
    const flying = candyNode(panel.doc, candy);
    flying.classList.add('study-flight'); flying.style.left = x + 'px'; flying.style.top = y + 'px';
    panel.doc.body.append(flying);
    const bend = panel.frame.contentWindow.innerWidth * .12;
    const frames = Array.from({length:41}, (_, i) => {
      const t = i / 40, remaining = 1-t;
      return {offset:t, transform:`translate(${2*remaining*t*(dx/2+bend)+t*t*dx}px,${t*dy}px) rotate(${candy.rotation}deg) scale(${1+.5*Math.sin(Math.PI*t)})`};
    });
    try { await flying.animate(frames, {duration:1400, easing:'ease-in-out', fill:'both'}).finished; }
    finally { flying.remove(); destinationNode.style.visibility = ''; panel.busy = false; renderPanel(panel); }
    status.textContent = 'Moved one candy. Its size, rotation, color and brightness stayed the same.';
  }
  async function prepareFrame(panel) {
    const win = panel.frame.contentWindow, doc = win.document;
    for (let tries = 0; !doc.querySelector('#humanSlots .slot'); tries++) {
      if (tries > 200) throw new Error('Board did not load');
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    // This isolated preview has no automatic opponent turns or live game input.
    const create = win.CandyEngine.create;
    win.CandyEngine.create = config => { const state = create(config); state.turn = 'human'; return state; };
    doc.getElementById('dialogAction').click(); doc.getElementById('table').inert = true;
    const style = doc.createElement('style');
    style.textContent = '.candy-pile-layer{display:none}.study-layer{position:absolute;inset:0;pointer-events:none;z-index:1}.study-candy{position:absolute;object-fit:contain;pointer-events:none}.study-flight{position:fixed;z-index:30}.pile-number,.hand-count{z-index:3}';
    doc.head.append(style);
    panel.doc = doc; panel.layers = {};
    for (const [kind, id] of [['dish','centerCircle'],['tray','wendyPile']]) {
      const layer = doc.createElement('span'); layer.className = 'study-layer';
      doc.getElementById(id).append(layer); panel.layers[kind] = layer;
    }
    populate(panel);
  }
  try {
    const tasks = [[5,5,'Sparse'],[15,15,'Medium'],[30,20,'Full']].map(([dish,tray,title], index) => {
      const card = document.createElement('article'); card.className = 'comparison';
      const heading = document.createElement('h2'); heading.textContent = title;
      const counts = document.createElement('p'); counts.className = 'counts';
      const frame = document.createElement('iframe'); frame.title = title + ' pile preview';
      const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Move top candy to Wendy'; button.disabled = true;
      card.append(heading,counts,frame,button); document.getElementById('comparisons').append(card);
      const panel = {index,frame,counts,button,initialDish:dish,initialTray:tray,busy:false}; panels.push(panel);
      button.addEventListener('click', () => moveTopCandy(panel));
      return new Promise((resolve,reject) => { frame.addEventListener('load', () => prepareFrame(panel).then(resolve,reject), {once:true}); frame.src = './index.html'; });
    });
    await Promise.all(tasks);
    inputs.forEach(id => document.getElementById(id).addEventListener('input', rebuild));
    document.getElementById('reroll').addEventListener('click', () => { arrangement++; rebuild(); });
    document.getElementById('actualStart').addEventListener('click', () => { panels[1].initialDish=20; panels[1].initialTray=5; rebuild(); });
    rebuild(); status.textContent = 'Ready. Compare counts, tune appearance, or move a candy.';
  } catch (error) { status.textContent = 'Preview could not load: ' + error.message; console.error(error); }
})();
