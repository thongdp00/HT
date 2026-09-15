import fs from 'fs';

// Let's read m3u_section.js and end_app.js
const m3u = fs.readFileSync('./m3u_section.js', 'utf8');
const end = fs.readFileSync('./end_app.js', 'utf8');

console.log('m3u size:', m3u.length);
console.log('end size:', end.length);

// Let's save a combined app client code
fs.writeFileSync('./client_source.js', m3u + '\n\n' + end);
console.log('Wrote client_source.js');
