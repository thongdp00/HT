import fs from 'fs';

const end = fs.readFileSync('./end_app.js', 'utf8');

let pos = 0;
while ((pos = end.indexOf('T9', pos)) !== -1) {
  console.log('T9 at pos:', pos);
  console.log(end.substring(Math.max(0, pos - 40), Math.min(end.length, pos + 80)));
  pos += 2;
}
