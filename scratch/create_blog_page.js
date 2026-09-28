const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, '..', 'public', 'www.talktoash.com', 'index.html');
const destDir = path.join(__dirname, '..', 'public', 'www.talktoash.com', 'blog');
const destFile = path.join(destDir, 'index.html');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

let html = fs.readFileSync(srcFile, 'utf8');

// Switch the Framer route ID from Home ('augiA20Il') to Blog ('N_9TcloSF')
html = html.replace('"routeId":"augiA20Il"', '"routeId":"N_9TcloSF"');
html = html.replace('<title>Clarity - AI for Mental Health</title>', '<title>Clarity - Blog</title>');

fs.writeFileSync(destFile, html, 'utf8');
console.log('Created blog/index.html with routeId N_9TcloSF successfully');
