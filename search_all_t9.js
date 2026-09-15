import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

let pos = 0;
while ((pos = code.indexOf('T9', pos)) !== -1) {
  console.log('T9 at:', pos);
  console.log(code.substring(Math.max(0, pos - 50), Math.min(code.length, pos + 80)));
  pos += 2;
}
