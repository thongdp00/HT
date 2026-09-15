import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

const idx = 100767;
console.log(code.substring(idx - 500, idx + 500));
