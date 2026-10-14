const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
let pending;
const window = { addEventListener() {} };
const sandbox = { window, setTimeout(fn, delay) { assert.equal(delay, 2000); pending = fn; return 1; }, clearTimeout() { pending = null; } };
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/sounds/victory-sounds.js'), 'utf8'), sandbox);
vm.runInNewContext(fs.readFileSync(path.join(root, 'js/sound.js'), 'utf8'), sandbox);
for (const file of Object.values(window.CandyVictorySounds)) assert(fs.existsSync(path.join(root, 'assets/sounds/victory-announcements', file)));
const sounds = window.CandySound;
const played = [];
sounds.play = key => played.push(key);
for (const [winner, loser, margin, expected] of [
  ['Harry', 'Mike', 2, 'CLOSE'], ['Harry', 'Mike', 3, 'BIGWIN'],
  ['Mike', 'Ron', 5, 'BIGWIN'], ['Hermione', 'Boo', 1, 'CLOSE']
]) {
  sounds.scheduleVictory(winner, loser, margin);
  assert(pending); pending();
  assert.equal(played.at(-1), 'victory:' + window.CandyVictorySounds[`${winner.toLowerCase()}|${loser.toLowerCase()}|${expected}`]);
}
sounds.scheduleVictory('Ron', 'Sully', 3); assert.equal(pending, null);
sounds.scheduleVictory('Harry', 'Mike', 0); assert.equal(pending, null);
sounds.scheduleVictory('Harry', 'Mike', 3); sounds.cancelVictory(); assert.equal(pending, null);
sounds.scheduleVictory('Harry', 'Mike', 3); sounds.setChannelEnabled('ui', false); assert.equal(pending, null);
console.log('Victory catalog, BIGWIN boundary, both winner directions, missing/tied silence and cancellation passed.');
