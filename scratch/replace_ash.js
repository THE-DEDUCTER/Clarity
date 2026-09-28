const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Replace "Ash" with "Clarity"
  // We want to be careful not to break URLs or code.
  // We can look for text surrounded by non-alphanumeric (like HTML tags, quotes in json)
  // Or just replace "Ash" if it's followed by a space, punctuation, or end of string
  
  // Replace in HTML and JS
  content = content.replace(/\bAsh\b/g, 'Clarity');
  content = content.replace(/\bash\b/g, 'clarity');
  content = content.replace(/\bASH\b/g, 'CLARITY');
  
  // Also replace the title specifically
  content = content.replace(/Clarity - AI for Mental Health/gi, 'Clarity - AI for Mental Health');
  
  // For the logo image: we know it might be an SVG or image.
  // The user says "remove ash logo image too"
  // If we can't find the exact SVG, maybe we can add a global CSS to index.html
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Modified ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else {
      // Only process text-based files
      if (fullPath.endsWith('.html') || fullPath.endsWith('.js') || fullPath.endsWith('.json') || fullPath.endsWith('.mjs')) {
        replaceInFile(fullPath);
      }
    }
  }
}

const publicDir = path.join(__dirname, '..', 'public');
walkDir(publicDir);

// Inject global CSS in index.html to hide the logo and teams
const indexFile = path.join(publicDir, 'www.talktoash.com', 'index.html');
if (fs.existsSync(indexFile)) {
  let html = fs.readFileSync(indexFile, 'utf8');
  const style = `
  <style>
    /* Try to hide typical logo components in framer */
    /* Ash logo might be an img with specific src or a framer component */
    img[src*="FesOF44K73hNMA3Lo6qe73eDzI"], 
    img[src*="yu2Y2aEeuoC9xHd0VtWpziH4"],
    img[src*="c2zffCIKLHPsGOki5yq3hjltBE"] {
      display: none !important;
    }
    /* Hide team and contact links based on href */
    a[href*="team"], a[href*="contact"], a[href*="mailto:"] {
      display: none !important;
    }
  </style>
  `;
  if (!html.includes('/* Try to hide typical logo components')) {
    html = html.replace('</head>', style + '</head>');
    fs.writeFileSync(indexFile, html, 'utf8');
    console.log("Injected CSS into index.html");
  }
}

console.log("Done");
