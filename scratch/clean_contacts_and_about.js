const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'www.talktoash.com', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Remove the 3 Resources / GET IN TOUCH blocks
let countResources = 0;
while (html.includes('data-framer-name="Resources"')) {
  const startIdx = html.indexOf('<div class="framer-6egu0i" data-framer-name="Resources"');
  if (startIdx === -1) break;
  
  // Cut until right before <div class="framer-rk5a4b" data-framer-name="Support">
  const nextSectionIdx = html.indexOf('data-framer-name="Support"', startIdx);
  if (nextSectionIdx !== -1) {
    // Look backwards from nextSectionIdx to find `<div class="framer-rk5a4b"` or `<div class="framer-l4n3bd"`
    const dividerIdx = html.lastIndexOf('<div class="framer-l4n3bd"', nextSectionIdx);
    const cutEndIdx = dividerIdx !== -1 ? dividerIdx : html.lastIndexOf('<div', nextSectionIdx);
    html = html.substring(0, startIdx) + html.substring(cutEndIdx);
    countResources++;
  } else {
    break;
  }
}
console.log('Removed Resources blocks:', countResources);

// 2. Remove the About Us nav links
// Pattern: <!--$--><a ... href="./about" ... >...</a><!--/$-->
const lines = html.split('\n');
const newLines = [];
let skipping = false;
let removedAboutCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!skipping && (line.includes('href="./about"') || (lines[i+1] && lines[i+1].includes('href="./about"')))) {
    // If it's starting an <a> tag pointing to ./about
    skipping = true;
    removedAboutCount++;
  }
  
  if (skipping) {
    if (line.includes('</a><!--/$-->') || line.includes('</a')) {
      skipping = false;
      continue;
    }
    continue;
  }
  newLines.push(line);
}

html = newLines.join('\n');
console.log('Removed About links:', removedAboutCount);

// 3. Extra safeguard: remove any leftover "GET IN TOUCH", "About Us", or sling shot careers/emails
html = html.replace(/About Us/g, '');
html = html.replace(/GET IN TOUCH/g, '');
html = html.replace(/href="mailto:[^"]*"/g, 'style="display:none;"');
html = html.replace(/https:\/\/slingshotai\.com\/careers/g, '#');

fs.writeFileSync(filePath, html, 'utf8');
console.log('Finished updating index.html');
