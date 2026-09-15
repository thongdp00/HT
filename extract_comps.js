import fs from 'fs';

const end = fs.readFileSync('./end_app.js', 'utf8');

// Find boundaries of A9, x9, I9
const a9Idx = end.indexOf('function A9(');
const x9Idx = end.indexOf('function x9(');
const i9Idx = end.indexOf('function I9(');

console.log('a9Idx:', a9Idx);
console.log('x9Idx:', x9Idx);
console.log('i9Idx:', i9Idx);

if (a9Idx !== -1 && x9Idx !== -1) {
  fs.writeFileSync('./comp_videoplayer.js', end.substring(a9Idx, x9Idx));
  console.log('Wrote comp_videoplayer.js, size:', x9Idx - a9Idx);
}

if (x9Idx !== -1 && i9Idx !== -1) {
  fs.writeFileSync('./comp_channeldrawer.js', end.substring(x9Idx, i9Idx));
  console.log('Wrote comp_channeldrawer.js, size:', i9Idx - x9Idx);
}

if (i9Idx !== -1) {
  fs.writeFileSync('./comp_app.js', end.substring(i9Idx));
  console.log('Wrote comp_app.js, size:', end.length - i9Idx);
}
