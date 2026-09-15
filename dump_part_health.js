import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

const part = code.substring(1920000, 1930000);
fs.writeFileSync('./part_health.js', part);
console.log('Saved part_health.js, length:', part.length);
