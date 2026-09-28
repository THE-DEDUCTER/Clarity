const fs = require('fs');

['public', 'Landing page'].forEach(base => {
  const mjsPath = base + '/framerusercontent.com/sites/5x6wTDFlVC2RJsqLlB4Imm/2fSZhHflhHNS-giSt8pkoWfiuaTSmtmyx88SH_qsu6M.soP3_U4c.mjs';
  const jsPath = base + '/framerusercontent.com/sites/5x6wTDFlVC2RJsqLlB4Imm/https/framerusercontent.com/modules/R98S9GW1PJsFbG4HXojH/9yVVpRWmgSdV7xnRxBpi/ZWKB3Jdq7.js';
  
  [mjsPath, jsPath].forEach(fp => {
    if (fs.existsSync(fp)) {
      let c = fs.readFileSync(fp, 'utf8');
      c = c.replace(/Daniel Reid Cahn[^"'<]*/gi, '');
      c = c.replace(/Neil Parikh[^"'<]*/gi, '');
      c = c.replace(/Dr\. Derrick Hull[^"'<]*/gi, '');
      c = c.replace(/Dr\. Caitlin Stamatis[^"'<]*/gi, '');
      c = c.replace(/Our people/gi, '');
      c = c.replace(/Who we are/gi, '');
      c = c.replace(/The Team/gi, '');
      c = c.replace(/Our experts and advisors/gi, '');
      c = c.replace(/obvaZnULvN3VIGxqzsD8rcK1qw/g, '');
      c = c.replace(/5b1zfTysu373OlxhiWnHvwpbgVE/g, '');
      c = c.replace(/btNOZYHw5weDtrUkkowQTSrtbTg/g, '');
      c = c.replace(/Krp37kORtvQ7Edj88ocRkYvkA/g, '');
      c = c.replace(/Coqp3NugkY09Vr7SznnmfcmM/g, '');
      fs.writeFileSync(fp, c, 'utf8');
      console.log('Sanitized:', fp);
    }
  });
});
