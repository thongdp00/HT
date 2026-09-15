import fs from 'fs';

const end = fs.readFileSync('./end_app.js', 'utf8');

// Find function declarations: T9, E9, S9
const t9Idx = end.indexOf('function T9(');
const e9Idx = end.indexOf('function E9(');
const s9Idx = end.indexOf('function S9(');

console.log('t9Idx:', t9Idx, 'e9Idx:', e9Idx, 's9Idx:', s9Idx);

if (s9Idx !== -1) {
  const s9Next = t9Idx !== -1 && t9Idx > s9Idx ? t9Idx : (e9Idx !== -1 && e9Idx > s9Idx ? e9Idx : end.length);
  fs.writeFileSync('./comp_S9_drawer.js', end.substring(s9Idx, s9Next));
  console.log('Wrote S9 drawer, size:', s9Next - s9Idx);
}

if (e9Idx !== -1) {
  const e9Next = t9Idx !== -1 && t9Idx > e9Idx ? t9Idx : end.length;
  fs.writeFileSync('./comp_E9_osd.js', end.substring(e9Idx, e9Next));
  console.log('Wrote E9 OSD, size:', e9Next - e9Idx);
}

if (t9Idx !== -1) {
  const t9Next = end.indexOf('function A9(');
  fs.writeFileSync('./comp_T9_player.js', end.substring(t9Idx, t9Next !== -1 ? t9Next : end.length));
  console.log('Wrote T9 player, size:', (t9Next !== -1 ? t9Next : end.length) - t9Idx);
}
