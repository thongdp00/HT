import fs from 'fs';

const part = fs.readFileSync('./part_health.js', 'utf8');
const amIdx = part.indexOf('AM=');
if (amIdx !== -1) {
  console.log(part.substring(amIdx, amIdx + 3000));
}
