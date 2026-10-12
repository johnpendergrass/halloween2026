'use strict';
// Presentation only: card identities and game rules stay in CandyEngine.
window.CandyPiles = function () {
  const visuals = new Map();
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
  function node(candy) {
    const img = document.createElement('img');
    img.src = './assets/generic-candies/candy-bar-v1-300x150.png';
    img.alt = ''; img.draggable = false; img.className = 'pile-candy'; img.dataset.cardId = candy.id;
    img.style.width = candy.width+'vw'; img.style.height = candy.width/2+'vw';
    img.style.left = `calc(50% + ${candy.position.x}vw)`; img.style.top = `calc(50% + ${candy.position.y}vw)`;
    img.style.transform = `translate(-50%,-50%) rotate(${candy.rotation}deg)`;
    img.style.filter = `hue-rotate(${candy.hue}deg) saturate(${candy.saturation}) brightness(${candy.brightness}) drop-shadow(0 .15vw .2vw #0006)`;
    if (candy.id === moving) img.style.visibility = 'hidden';
    return img;
  }
  function render(state) {
    for (const [owner,cards,id] of [['dish',state.pile,'centerCircle'],['wendy',state.hands.wendy,'wendyPile']]) {
      const host = document.getElementById(id);
      host.querySelector('.candy-pile-layer')?.remove();
      const layer = document.createElement('span'); layer.className = 'candy-pile-layer';
      // Engine draws from the front; reverse so the next draw is visually on top.
      const ordered = owner === 'dish' ? [...cards].reverse() : cards;
      layer.append(...ordered.map(card => node(ensure(card, owner)))); host.append(layer);
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
    finish(){moving=null;}, reset(){visuals.clear();moving=null;} };
};
