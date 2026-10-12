// Check live HTML/CSS/JS, dynamic configuration and the shell menu icon.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');
const config = require('../../assets/json/game-config.json');
const referenced = new Set(['json/game-config.json', 'json/config-data.js']);
for (const filename of ['index.html', 'candy-go-fish.css', 'js/candy-go-fish.js', 'js/candy-piles.js']) {
  const source = fs.readFileSync(path.join(root, filename), 'utf8');
  for (const match of source.matchAll(/\.\/assets\/([^'"\s?]+)/g)) {
    if (!match[1].endsWith('/')) referenced.add(match[1]);
  }
}
for (const profile of [...Object.values(config.players), ...config.opponents]) referenced.add(profile.portrait);
for (const candy of config.candies) referenced.add('candybar-images/' + candy.image);
const registry = JSON.parse(fs.readFileSync(path.resolve(root, '../../games.json'), 'utf8'));
assert(JSON.stringify(registry).includes('assets/halloween-fish.svg'));
referenced.add('halloween-fish.svg');
for (const relative of referenced) {
  assert(fs.statSync(path.join(root, 'assets', relative)).isFile(), 'Missing live asset: ' + relative);
}
const files = fs.readdirSync(path.join(root, 'assets'), { recursive: true, withFileTypes: true });
for (const entry of files.filter(entry => entry.isFile())) {
  const relative = path.relative(path.join(root, 'assets'), path.join(entry.parentPath, entry.name)).replaceAll('\\', '/');
  assert(referenced.has(relative) || relative === 'json/README.md', 'Unused asset remains: ' + relative);
}
console.log('PASS: every live asset exists and only used assets plus config documentation remain.');
