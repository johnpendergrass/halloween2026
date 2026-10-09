"use strict";

// Six fixed touch positions per character; the dealt items are random.
const layouts = [
  { position: "one", face: "🎃", points: [[28,8],[72,8],[30,28],[70,28],[42,47],[58,47]] },
  { position: "two", face: "👻", points: [[90,34],[91,55],[76,55],[91,100.5556],[76,100.5556],[90,121.5556]] },
  { position: "three", face: "🧛", points: [[28,147.5556],[72,147.5556],[30,127.5556],[70,127.5556],[42,108.5556],[58,108.5556]] },
  { position: "four", face: "🧙", points: [[10,34],[9,55],[24,55],[9,100.5556],[24,100.5556],[10,121.5556]] }
];
const colors = ["#ffadba", "#ffce71", "#a6d9fc", "#c3a9f5", "#9bdfb9", "#fca577"];
const shortLabels = { chocolate: "Choc", crunchy: "Crunch", peanut: "Peanut", marshmallow: "Mallow", lowSugar: "Low sug" };
const holder = document.getElementById("candies");
const infoHolder = document.getElementById("candyInfo");
const prompt = document.getElementById("comparePrompt");
const overlay = document.getElementById("comparisonOverlay");
const panel = document.getElementById("comparisonPanel");
let data;
let characters = [];
let slots = [];
let selections = [];
let showTargets = false;
let comparison = null;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function shuffle(list) {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function attributeLabel(id) {
  return data.attributes.find(attribute => attribute.id === id).label;
}

function preferenceLabel(preference, compact = false) {
  const label = compact ? (shortLabels[preference.attribute] || attributeLabel(preference.attribute)) : attributeLabel(preference.attribute);
  const weight = data.rules.preferenceWeights[preference.level];
  return label + (weight > 0 ? "+".repeat(weight) : "−".repeat(-weight));
}

function itemValue(character, item) {
  // Every item starts at +1; unlisted traits add no adjustment.
  return character.preferences.reduce((sum, preference) =>
    sum + (item.attributes.includes(preference.attribute) ? data.rules.preferenceWeights[preference.level] : 0), data.rules.baseItemValue);
}

function characterScore(owner) {
  return slots.filter(slot => slot.owner === owner).reduce((sum, slot) => sum + itemValue(characters[owner], slot.item), 0);
}

function signed(value) { return value > 0 ? "+" + value : String(value); }
function itemName(item) { return item.displayName || item.name; }

function candyImage(item) {
  const image = element("img", "candy-image");
  image.src = item.graphic;
  image.alt = "";
  image.draggable = false;
  return image;
}

function renderCandy(slot) {
  const button = slot.button;
  button.className = "candy " + slot.item.shape;
  button.classList.toggle("selected", selections.includes(slot));
  button.classList.toggle("show-targets", showTargets);
  button.style.setProperty("--color", slot.item.color);
  button.style.setProperty("--rotation", slot.item.rotation + "deg");
  button.setAttribute("aria-label", characters[slot.owner].name + ": " + itemName(slot.item));
  button.setAttribute("aria-pressed", String(selections.includes(slot)));
  button.dataset.itemId = slot.item.id || slot.item.name;
  const sweet = element("span", "sweet");
  sweet.append(candyImage(slot.item));
  button.replaceChildren(sweet);
}

function updateScores() {
  let total = 0;
  characters.forEach((character, owner) => {
    const value = characterScore(owner);
    total += value;
    const kid = document.querySelector(".kid." + layouts[owner].position);
    const score = kid.querySelector(".satisfaction");
    score.textContent = value;
    score.setAttribute("aria-label", character.name + " satisfaction: " + value);
    kid.setAttribute("aria-label", character.name + ", score " + value);
  });
  document.title = "Candy Swap · Total " + total;
  if (window.parent !== window) window.parent.postMessage({ type: "candy-swap-score", total }, location.origin);
}

function selectCandy(slot) {
  if (comparison) return;
  const index = selections.indexOf(slot);
  if (index !== -1) selections.splice(index, 1);
  else {
    const sameOwner = selections.findIndex(selected => selected.owner === slot.owner);
    if (sameOwner !== -1) selections[sameOwner] = slot;
    else if (selections.length < 2) selections.push(slot);
    else selections[1] = slot;
  }
  renderSelections();
}

function renderSelections() {
  slots.forEach(renderCandy);
  infoHolder.replaceChildren();
  selections.forEach(slot => {
    const popup = element("section", "candy-info");
    popup.setAttribute("aria-label", slot.item.name + " information");
    popup.append(element("strong", "", itemName(slot.item)));
    slot.item.attributes.forEach(attribute => popup.append(element("span", "", attributeLabel(attribute))));
    // May cover other candies, but leaves its own target exposed for deselecting.
    popup.style.left = Math.min(81, Math.max(19, slot.x)) + "vw";
    popup.style.top = (slot.y / (2016 / 1296 * 100) * 100) + "%";
    popup.classList.toggle("above", slot.y > 78);
    infoHolder.appendChild(popup);
  });
  prompt.hidden = selections.length !== 2;
}

function resetTurn() {
  const wasComparing = Boolean(comparison);
  const focusTarget = selections[0]?.button;
  selections = [];
  comparison = null;
  overlay.hidden = true;
  panel.replaceChildren();
  holder.inert = false;
  document.querySelectorAll(".kid, .preferences").forEach(node => node.inert = false);
  prompt.inert = false;
  renderSelections();
  if (wasComparing) focusTarget?.focus({ preventScroll: true });
}

function comparisonSummary(slot, other) {
  const character = characters[slot.owner];
  const before = characterScore(slot.owner);
  const after = before - itemValue(character, slot.item) + itemValue(character, other.item);
  return { slot, other, character, before, after, difference: after - before };
}

function playerSummary(summary) {
  const block = element("section", "compare-player");
  const portrait = element("span", "compare-face", layouts[summary.slot.owner].face);
  portrait.setAttribute("aria-hidden", "true");
  const details = element("div", "compare-player-details");
  details.append(element("strong", "compare-name", summary.character.name));
  const direction = summary.difference > 0 ? "↑ Happier" : summary.difference < 0 ? "↓ Sadder" : "↔ Same";
  const score = element("strong", "compare-score", (summary.accepted === false ? "Would be: " : "") + summary.before + " → " + summary.after + "  " + direction);
  score.classList.add(summary.difference > 0 ? "better" : summary.difference < 0 ? "worse" : "same");
  score.dataset.before = summary.before;
  score.dataset.after = summary.after;
  details.append(score);
  details.append(element("strong", "character-decision " + (summary.difference >= 0 ? "better" : "worse"), summary.difference >= 0 ? "✓ Accepts" : "✕ Declines"));
  const preferences = element("div", "compare-preferences");
  summary.character.preferences.forEach(preference => preferences.append(element("span", "", preferenceLabel(preference))));
  details.append(preferences);
  block.append(portrait, details);
  return block;
}

function candyComparison(summary) {
  const row = element("div", "compare-candies");
  [[summary.accepted ? "Gave" : "Offers", summary.slot.item], [summary.accepted ? "Got" : "Would get", summary.other.item]].forEach(([label, item]) => {
    const card = element("section", "compare-candy");
    const heading = element("div", "compare-candy-heading");
    heading.append(element("strong", "", label), candyImage(item), element("strong", "", signed(itemValue(summary.character, item))));
    card.append(heading, element("strong", "compare-candy-name", itemName(item)));
    card.append(element("span", "compare-attributes", item.attributes.map(attributeLabel).join(" · ")));
    row.append(card);
  });
  return row;
}

function openComparison() {
  if (selections.length !== 2 || selections[0].owner === selections[1].owner) return;
  const [first, second] = selections;
  comparison = [comparisonSummary(first, second), comparisonSummary(second, first)];
  const accepted = comparison.every(summary => summary.difference >= 0);
  if (accepted) {
    [first.item, second.item] = [second.item, first.item];
    updateScores();
  }
  // Snapshot outgoing/incoming candies before rendering the already-resolved result.
  const outcomes = comparison.map((summary, index) => ({ ...summary, accepted,
    slot: { ...summary.slot, item: accepted ? selections[1-index].item : summary.slot.item },
    other: { ...summary.other, item: accepted ? selections[index].item : summary.other.item }
  }));
  slots.forEach(renderCandy);
  infoHolder.replaceChildren();
  prompt.hidden = true;
  holder.inert = true;
  document.querySelectorAll(".kid, .preferences").forEach(node => node.inert = true);
  prompt.inert = true;
  const actions = element("div", "comparison-actions");
  const next = element("button", "swap-button", "Next proposal");
  next.id = "nextProposal";
  next.addEventListener("click", resetTurn);
  actions.append(next);
  const result = element("header", "trade-result");
  result.append(element("strong", "", accepted ? "Both agree — traded!" : "Trade declined"),
    element("span", "", accepted ? "Candies exchanged. Scores updated." : "Everyone keeps their candy. Nobody loses points."));
  panel.dataset.accepted = String(accepted);
  panel.replaceChildren(result, playerSummary(outcomes[0]), candyComparison(outcomes[0]), candyComparison(outcomes[1]), playerSummary(outcomes[1]), actions);
  overlay.hidden = false;
  next.focus({ preventScroll: true });
}

document.getElementById("compareYes").addEventListener("click", openComparison);
document.getElementById("compareNo").addEventListener("click", resetTurn);
overlay.addEventListener("click", event => { if (event.target === overlay) resetTurn(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape") resetTurn();
  if (comparison && event.key === "Tab") {
    event.preventDefault();
    document.getElementById("nextProposal").focus();
  }
});

// Standalone preview toolbar only; production app integration uses the helper.
window.addEventListener("message", event => {
  if (event.source !== window.parent || event.origin !== location.origin) return;
  if (event.data?.type === "candy-swap-targets") {
    showTargets = Boolean(event.data.show);
    slots.forEach(renderCandy);
  }
  if (event.data?.type === "candy-swap-clear" && data) resetTurn();
});

async function startDemo() {
  try {
    const response = await fetch("./assets/gamedata03.json", { cache: "no-store" });
    if (!response.ok) throw Error("Game data returned " + response.status);
    data = await response.json();
    const pool = data.items.filter(item => item.enabled);
    const traits = [...new Set(pool.flatMap(item => item.attributes))];
    characters = data.characters.map(character => ({ ...character, preferences: shuffle(traits).slice(0, 3).map((attribute, index) => ({ attribute, level: ["favorite", "like", "dislike"][index] })) }));
    if (characters.length !== 4 || !pool.length) throw Error("The demo needs four characters and an enabled candy pool.");
    characters.forEach((character, owner) => {
      const layout = layouts[owner];
      const preferences = document.querySelector(".preferences." + layout.position);
      preferences.setAttribute("aria-label", character.name + " preferences");
      preferences.replaceChildren(...character.preferences.map(preference => element("span", "", preferenceLabel(preference, true))));
      const shapes = shuffle(["square", "square", "square", "bar", "bar", "vertical"]);
      layout.points.forEach(([x, y], index) => {
        const item = { ...pool[Math.floor(Math.random() * pool.length)], shape: shapes[index], color: colors[Math.floor(Math.random() * colors.length)], rotation: Math.random() * 60 - 30 };
        const button = element("button", "candy");
        button.style.left = x + "vw";
        button.style.top = (y / (2016 / 1296 * 100) * 100) + "%";
        button.dataset.owner = character.id;
        button.dataset.slot = slots.length;
        const slot = { owner, x, y, number: index + 1, item, button };
        button.addEventListener("pointerdown", event => {
          if (!event.isPrimary || event.button !== 0) return;
          event.preventDefault();
          selectCandy(slot);
        });
        button.addEventListener("click", event => { if (event.detail === 0) selectCandy(slot); });
        slots.push(slot);
        holder.appendChild(button);
        renderCandy(slot);
      });
    });
    updateScores();
  } catch (error) {
    const status = document.getElementById("gameStatus");
    status.hidden = false;
    status.textContent = "Could not load the candy demo. " + error.message + " Open it using the local server.";
    console.error(error);
  }
}

startDemo();
