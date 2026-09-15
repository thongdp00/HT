import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

// Find all occurrences of "HT TV" or "Danh sách"
let idx = 0;
while ((idx = code.indexOf('HT TV', idx)) !== -1) {
  console.log('HT TV at:', idx);
  console.log(code.substring(Math.max(0, idx - 100), Math.min(code.length, idx + 200)));
  idx += 5;
}

idx = 0;
while ((idx = code.indexOf('Danh sách kênh', idx)) !== -1) {
  console.log('Danh sách kênh at:', idx);
  console.log(code.substring(Math.max(0, idx - 100), Math.min(code.length, idx + 200)));
  idx += 10;
}
