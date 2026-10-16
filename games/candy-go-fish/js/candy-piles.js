'use strict';
// Presentation only: card identities and game rules stay in CandyEngine.
window.CandyPiles = function () {
  const visuals = new Map();
  // The <img> drawn for each card, by card id. It is made once and then only
  // restyled and moved between the two piles: a redraw that recreated every
  // image made the candies flash on phones, which drop decoded bitmaps and
  // paint a new element blank for a frame (John, 2026-10-16).
  const elements = new Map();
  let moving = null;
  const random = Math.random;
  // Maximum center offsets, as percentages of the 21vw dish diameter.
  const dishPlacement = { spreadX: 22, spreadY: 20, originX: 0, originY: .7 };
  function position(candy, owner) {
    const angle = candy.rotation * Math.PI / 180;
    const hw = candy.width * (Math.abs(Math.cos(angle)) + .5 * Math.abs(Math.sin(angle))) / 2;
    const hh = candy.width * (Math.abs(Math.sin(angle)) + .5 * Math.abs(Math.cos(angle))) / 2;
    if (owner === 'dish') {
      const direction = random() * Math.PI * 2, distance = Math.sqrt(random());
      return {
        x: dishPlacement.originX + Math.cos(direction) * distance * 21 * dishPlacement.spreadX / 100,
        y: dishPlacement.originY + Math.sin(direction) * distance * 21 * dishPlacement.spreadY / 100
      };
    }
    return { x: (random()*2-1)*Math.max(.3,8.6-hw), y:1.8+(random()*2-1)*Math.max(.15,2.6-hh) };
  }
  function ensure(card, owner) {
    let candy = visuals.get(card.id);
    if (!candy) {
      const sizeVariation = .88+random()*.24;
      candy = { id:card.id, sizeVariation, width:(owner === 'dish' ? 21*.78 : 20*.45)*sizeVariation,
        rotation:(random()*2-1)*(owner === 'dish' ? 65 : 50), hue:[0,35,75,125,185,235,285][Math.floor(random()*7)],
        saturation:.5, brightness:.96+random()*.08, owner };
      candy.position = position(candy, owner); visuals.set(card.id, candy);
    } else if (candy.owner !== owner) {
      if (owner === 'wendy') candy.width = 20*.45*candy.sizeVariation;
      candy.owner = owner; candy.position = position(candy, owner);
    }
    return candy;
  }
  // style(img, candy): give an image the candy's size, place, tilt and tint.
  function style(img, candy) {
    img.style.width = candy.width+'vw'; img.style.height = candy.width/2+'vw';
    img.style.left = `calc(50% + ${candy.position.x}vw)`; img.style.top = `calc(50% + ${candy.position.y}vw)`;
    img.style.transform = `translate(-50%,-50%) rotate(${candy.rotation}deg)`;
    img.style.filter = `hue-rotate(${candy.hue}deg) saturate(${candy.saturation}) brightness(${candy.brightness}) drop-shadow(0 .15vw .2vw #0006)`;
    img.style.visibility = candy.id === moving ? 'hidden' : '';
    return img;
  }
  // node(candy): a fresh image of the candy (the flight uses one as its flier).
  function node(candy) {
    const img = document.createElement('img');
    img.src = './assets/generic-candies/candy-bar.png'; img.decoding = 'sync';
    img.alt = ''; img.draggable = false; img.className = 'pile-candy'; img.dataset.cardId = candy.id;
    return style(img, candy);
  }
  // element(candy): the one image kept for this card, made on first use.
  function element(candy) {
    if (!elements.has(candy.id)) elements.set(candy.id, node(candy));
    return style(elements.get(candy.id), candy);
  }
  function render(state) {
    for (const [owner,cards,id] of [['dish',state.pile,'centerCircle'],['wendy',state.hands.wendy,'wendyPile']]) {
      const host = document.getElementById(id);
      let layer = host.querySelector('.candy-pile-layer');
      if (!layer) { layer = document.createElement('span'); layer.className = 'candy-pile-layer'; host.append(layer); }
      // Engine draws from the front; reverse so the next draw is visually on top.
      const ordered = owner === 'dish' ? [...cards].reverse() : cards;
      const images = ordered.map(card => element(ensure(card, owner)));
      // Images that left this pile go; the rest are appended in order, which
      // moves an existing element rather than making a new one.
      for (const child of [...layer.children]) if (!images.includes(child)) child.remove();
      layer.append(...images);
    }
    state.hands.human.forEach(card => ensure(card,'human'));
  }
  function begin(card, source) {
    const candy = visuals.get(card.id);
    const element = source.querySelector(`[data-card-id="${card.id}"]`);
    const rect = (element || source).getBoundingClientRect();
    moving = card.id;
    // Snapshot departure size before render relocates/resizes the stored candy.
    return { candy:{...candy, get targetWidth(){return candy.width;}}, source:{getBoundingClientRect:()=>rect} };
  }
  function destination(card, fallback) {
    const element = fallback.querySelector(`[data-card-id="${card.id}"]`);
    return element || fallback;
  }
  return { render, begin, destination, node,
    finish(){moving=null;}, reset(){visuals.clear();elements.clear();moving=null;} };
};
