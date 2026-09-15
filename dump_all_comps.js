import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

const t9Start = 1929608;
const s9Start = code.indexOf('const S9=', t9Start) !== -1 ? code.indexOf('const S9=', t9Start) : code.indexOf('S9=', t9Start);
const e9Start = code.indexOf('E9=', s9Start);
const a9Start = code.indexOf('function A9(', e9Start);
const x9Start = code.indexOf('function x9(', a9Start);
const i9Start = code.indexOf('function I9(', x9Start);

console.log({ t9Start, s9Start, e9Start, a9Start, x9Start, i9Start, end: code.length });

fs.writeFileSync('./raw_T9.js', code.substring(t9Start, s9Start));
fs.writeFileSync('./raw_S9.js', code.substring(s9Start, e9Start));
fs.writeFileSync('./raw_E9.js', code.substring(e9Start, a9Start));
fs.writeFileSync('./raw_A9.js', code.substring(a9Start, x9Start));
fs.writeFileSync('./raw_x9.js', code.substring(x9Start, i9Start));
fs.writeFileSync('./raw_I9.js', code.substring(i9Start));

console.log('Successfully saved all raw components!');
