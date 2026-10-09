// JSON is the editable source. Regenerate the file:// companion after changes.
const fs = require('node:fs');
const path = require('node:path');
const directory = path.resolve(__dirname, '../assets/json');
const config = JSON.parse(fs.readFileSync(path.join(directory, 'game-config.json'), 'utf8'));
fs.writeFileSync(path.join(directory, 'config-data.js'), '// Generated from game-config.json by codex-john-docs/sync-config.cjs.\nwindow.CandyConfig = ' + JSON.stringify(config, null, 2) + ';\n');
console.log('Updated standalone configuration companion.');
