import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

console.log('--- At 224000 ---');
console.log(code.substring(224000, 224500));

console.log('\n--- At 1929000 ---');
console.log(code.substring(1929000, 1929500));
