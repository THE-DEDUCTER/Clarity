const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const indexFile = path.join(__dirname, '..', 'public', 'www.talktoash.com', 'index.html');
let html = fs.readFileSync(indexFile, 'utf8');

const $ = cheerio.load(html);

// Remove specific sections based on exact text matches
// It's safer to find header text (h1, h2, h3, p) and remove the closest section wrapper
const phrasesToRemove = [
  "Announcing Lori Gottlieb",
  "Clinical Research Team",
  "Research Advisory Board",
  "Begin your journey",
  "Take the first step today",
  "Dr. Derrick Hull",
  "About Us" // But be careful not to remove the whole nav!
];

$('*').each((i, el) => {
  const text = $(el).text().trim();
  
  // We look at text of headers or strong elements
  if (el.tagName === 'h1' || el.tagName === 'h2' || el.tagName === 'h3' || el.tagName === 'p') {
    for (const phrase of phrasesToRemove) {
      if (text.includes(phrase)) {
        // Only if it's not a tiny nav link
        if (text.length > 3 && text.length < 200) {
          // Find the closest parent div that looks like a main section block
          // Usually in Framer, sections are direct children of the flex container that holds everything
          // Let's just remove the parent element that is big
          let parent = $(el).parent();
          for(let j=0; j<6; j++) {
            if(parent.parent().get(0) && parent.parent().get(0).tagName === 'body') {
              break; // don't remove body
            }
            if (parent.children().length > 3 || parent.css('width') === '100%') {
              // it's probably a section
            }
            parent = parent.parent();
          }
          
          // Actually, let's just use CSS injection for known text!
        }
      }
    }
  }
});

// Since Cheerio traversing can be tricky with Framer's nested divs, 
// let's do a CSS-based approach or just rely on a VERY specific DOM script that hides only exact matches.
// Wait, the easiest way to remove a block of HTML where we know the text is to use regex or find the exact block!

// Let's just use CSS injection to hide exactly the elements containing the text and their direct parents
