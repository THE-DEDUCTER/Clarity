const fs = require('fs');
const path = require('path');

// 1. Copy chatgpt-research.png to all target locations
const chatgptPath = path.join(__dirname, '..', 'public', 'assets', 'chatgpt-research.png');
const chatgptBuffer = fs.readFileSync(chatgptPath);

// Target 1: public/assets/research-hero.png
fs.writeFileSync(path.join(__dirname, '..', 'public', 'assets', 'research-hero.png'), chatgptBuffer);

// Target 2: public/framerusercontent.com/images/EJg9MzKFPQelNYdLwUTVJcRBym0.webp
const webpPath = path.join(__dirname, '..', 'public', 'framerusercontent.com', 'images', 'EJg9MzKFPQelNYdLwUTVJcRBym0.webp');
fs.writeFileSync(webpPath, chatgptBuffer);

// Target 3: Landing page/framerusercontent.com/images/EJg9MzKFPQelNYdLwUTVJcRBym0.webp
const landingWebpPath = path.join(__dirname, '..', 'Landing page', 'framerusercontent.com', 'images', 'EJg9MzKFPQelNYdLwUTVJcRBym0.webp');
if (fs.existsSync(path.dirname(landingWebpPath))) {
  fs.writeFileSync(landingWebpPath, chatgptBuffer);
}

// 2. Patch the research page bundle 3j7xTvsT0IRwq3QL8zX8cW-CMeb6OxzdsFQpygqWimE.Bkbab7hJ.mjs
const mjsFiles = [
  path.join(__dirname, '..', 'public', 'framerusercontent.com', 'sites', '5x6wTDFlVC2RJsqLlB4Imm', '3j7xTvsT0IRwq3QL8zX8cW-CMeb6OxzdsFQpygqWimE.Bkbab7hJ.mjs'),
  path.join(__dirname, '..', 'Landing page', 'framerusercontent.com', 'sites', '5x6wTDFlVC2RJsqLlB4Imm', '3j7xTvsT0IRwq3QL8zX8cW-CMeb6OxzdsFQpygqWimE.Bkbab7hJ.mjs')
];

mjsFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace all instances of EJg9MzKFPQelNYdLwUTVJcRBym0.webp with /assets/chatgpt-research.png
    content = content.replace(/https:\/\/framerusercontent\.com\/images\/EJg9MzKFPQelNYdLwUTVJcRBym0\.webp\?width=3840&height=2160/g, '/assets/chatgpt-research.png');
    content = content.replace(/https:\/\/framerusercontent\.com\/images\/EJg9MzKFPQelNYdLwUTVJcRBym0\.webp[^\`\"\']*/g, '/assets/chatgpt-research.png');
    content = content.replace(/EJg9MzKFPQelNYdLwUTVJcRBym0\.webp/g, 'chatgpt-research.png');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Patched research bundle:', file);
  }
});

console.log('All image replacements completed successfully.');
