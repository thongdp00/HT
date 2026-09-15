import fs from 'fs';

const code = fs.readFileSync('formatted_T9.js', 'utf8');
const lines = code.split('\n');

console.log('Total lines in formatted_T9.js:', lines.length);

// Print lines in chunks or summary
// Let's find key markers:
// 1. Initial refs & state: lines 1-100
// 2. Candidate generation & prioritization: lines 100-360
// 3. Cleanup logic: lines 360-460
// 4. Shaka player setup & DRM: lines 950-1200
// 5. Hls player setup: lines 1250-1450
// 6. mpegts player setup: lines 850-930
// 7. Video events & error recovery: lines 460-700
console.log('Lines 1 to 50:');
console.log(lines.slice(0, 50).join('\n'));
