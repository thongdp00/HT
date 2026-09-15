import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

const start = 190000;
const length = 70000;
fs.writeFileSync('./app_extracted.js', code.substring(start, start + length));
console.log('Saved app_extracted.js, length:', length);
