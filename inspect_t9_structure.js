import fs from 'fs';

const t9 = fs.readFileSync('./raw_T9.js', 'utf8');

// Let's inspect the props and beginning of T9
console.log('--- T9 start (first 1500 chars) ---');
console.log(t9.substring(0, 1500));
