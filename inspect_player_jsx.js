import fs from 'fs';

const end = fs.readFileSync('./end_app.js', 'utf8');

// Let's inspect functions and React components in end
// Find where components are declared or called
console.log('--- Search for VideoPlayer JSX ---');
const playerIdx = end.indexOf('<video');
if (playerIdx !== -1) {
  console.log('video tag found at', playerIdx);
  console.log(end.substring(playerIdx - 200, playerIdx + 300));
} else {
  // Minified JSX uses Jt.jsx("video", ...)
  const vMatch = end.indexOf('"video"');
  console.log('"video" found at', vMatch);
  if (vMatch !== -1) {
    console.log(end.substring(vMatch - 150, vMatch + 350));
  }
}
