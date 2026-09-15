import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

const crIdx = code.indexOf('createRoot(');
console.log('createRoot index:', crIdx);
if (crIdx !== -1) {
  console.log(code.substring(crIdx - 300, crIdx + 400));
}
