import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

// Find where shaka-player ends and application code begins
// Shaka player usually exports something or has shaka.Player
const shakaIdx = code.lastIndexOf('shaka.Player');
console.log('Last shaka.Player index:', shakaIdx);

// Find where mpegts starts
const mpegtsIdx = code.indexOf('Mpegts');
console.log('Mpegts index:', mpegtsIdx);

// Find React render or root.render
const rootRenderIdx = code.indexOf('.render(');
console.log('root.render index:', rootRenderIdx);

console.log('Between shaka and mpegts length:', (mpegtsIdx !== -1 ? mpegtsIdx : code.length) - shakaIdx);
