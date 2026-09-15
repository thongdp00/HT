import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

// Find occurrences of "HT TV" or "VTV" or "thongdp00"
const target = 'thongdp00';
let pos = 0;
while (true) {
  pos = code.indexOf(target, pos);
  if (pos === -1) break;
  console.log(`Found "${target}" at position ${pos}`);
  console.log(code.substring(Math.max(0, pos - 500), Math.min(code.length, pos + 1000)));
  pos += target.length;
}
