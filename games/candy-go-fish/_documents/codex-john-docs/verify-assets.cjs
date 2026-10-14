// Check live HTML/CSS/JS, dynamic configuration and the shell menu icon.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const config = require('../../assets/json/game-config.json');
const referenced = new Set(['json/game-config.json', 'json/config-data.js']);
const audioWindow = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/sounds/victory-sounds.js'), 'utf8'), audioWindow);
for (const filename of Object.values(audioWindow.window.CandyVictorySounds)) referenced.add('sounds/victory-announcements/' + filename);
for (const filename of ['ronBoo', 'harryMike', 'hermioneSully']) referenced.add('sounds/players-and-opponents/' + filename + '.mp3');
referenced.add('sounds/welcome-and-start-clicks/confirmText.mp3');
for (const filename of ['index.html', 'candy-go-fish.css', 'js/candy-go-fish.js', 'js/candy-piles.js', 'js/candy-rain.js']) {
  const source = fs.readFileSync(path.join(root, filename), 'utf8');
  for (const match of source.matchAll(/\.\/assets\/([^'"\s?]+)/g)) {
    if (!match[1].endsWith('/')) referenced.add(match[1]);
  }
}
for (const profile of [...Object.values(config.players), ...config.opponents, ...(config.playerCharacters || [])]) referenced.add(profile.portrait);
for (const candy of config.candies) referenced.add('candybar-images/' + candy.image);
const registry = JSON.parse(fs.readFileSync(path.resolve(root, '../../games.json'), 'utf8'));
assert(JSON.stringify(registry).includes('assets/halloween-fish.svg'));
referenced.add('halloween-fish.svg');
for (const relative of referenced) {
  assert(fs.statSync(path.join(root, 'assets', relative)).isFile(), 'Missing live asset: ' + relative);
}
const files = fs.readdirSync(path.join(root, 'assets'), { recursive: true, withFileTypes: true });
const trackedAudio = new Set(execFileSync('git', ['ls-files', '-z', '--', 'assets/sounds'], { cwd: root, encoding: 'utf8' }).split('\0'));
for (const entry of files.filter(entry => entry.isFile())) {
  const relative = path.relative(path.join(root, 'assets'), path.join(entry.parentPath, entry.name)).replaceAll('\\', '/');
  // Local audio masters/candidates are intentionally not included in this checkpoint.
  if (relative.startsWith('sounds/') && !trackedAudio.has('assets/' + relative)) continue;
  assert(referenced.has(relative) || ['json/README.md', 'sounds/README.md', 'sounds/startGameSpinner/spinnerDing.mp3'].includes(relative), 'Unused asset remains: ' + relative);
}
console.log('PASS: every live asset exists; published assets are used or documented retained sources.');
