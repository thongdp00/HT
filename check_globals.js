import fs from 'fs';

// Let's inspect formatted_T9.js imports / global symbols
const code = fs.readFileSync('formatted_T9.js', 'utf8');

// Find all identifiers that look like globals or functions from outside T9
// In minified code: Pt is React, Jt is jsx runtime, H8 is ReactDOM
// What about video engines: Hls, mpegts, shaka?
console.log('Includes Hls:', code.includes('Hls') || code.includes('hls'));
console.log('Includes shaka:', code.includes('shaka'));
console.log('Includes mpegts:', code.includes('mpegts'));

// Find any functions referenced in formatted_T9.js
const regex = /\b([a-zA-Z0-9_$]{2,})\b/g;
const matches = [...new Set(code.match(regex))];
console.log('Total unique tokens:', matches.length);

// Let's check icons in formatted_T9.js:
// We know: f9 = Music, d9 = Radio, u9 = Minimize, o9 = Maximize
// In S9: OP = Tv
// In E9: s9 = Hash, OP = Tv
