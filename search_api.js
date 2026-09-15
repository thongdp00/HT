import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

// Find all occurrences of /api/
let idx = 0;
while ((idx = code.indexOf('/api/', idx)) !== -1) {
  console.log('API at:', idx);
  console.log(code.substring(Math.max(0, idx - 80), Math.min(code.length, idx + 150)));
  idx += 5;
}
