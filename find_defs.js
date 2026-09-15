import fs from 'fs';

const end = fs.readFileSync('./end_app.js', 'utf8');

const t9Idx = end.indexOf('T9=');
const e9Idx = end.indexOf('E9=');
const s9Idx = end.indexOf('S9=');

console.log('T9=:', t9Idx, 'E9=:', e9Idx, 'S9=:', s9Idx);
if (t9Idx !== -1) console.log('T9 context:', end.substring(t9Idx - 50, t9Idx + 200));
if (e9Idx !== -1) console.log('E9 context:', end.substring(e9Idx - 50, e9Idx + 200));
if (s9Idx !== -1) console.log('S9 context:', end.substring(s9Idx - 50, s9Idx + 200));
