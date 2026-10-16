// A tiny static web server for the checks that need HTTP (2026-10-16).
// The UI sounds are fetched with fetch() and decoded, and Chrome refuses
// fetch() over file://, so a check that listens for them must serve the
// game folder over http. Nothing here is a runtime dependency.
//
//   const { serveGame } = require('./serve-game.cjs');
//   const server = await serveGame();      // server.url = 'http://127.0.0.1:<port>'
//   await page.goto(server.url + '/index.html');
//   server.close();
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg', '.txt': 'text/plain', '.md': 'text/markdown'
};
function serveGame() {
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const file = path.join(root, decodeURIComponent(url.pathname));
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      response.writeHead(404); response.end('not found'); return;
    }
    response.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(response);
  });
  return new Promise(resolve => {
    server.listen(0, '127.0.0.1', () => {
      resolve({ url: 'http://127.0.0.1:' + server.address().port, close: () => server.close() });
    });
  });
}
module.exports = { serveGame };
