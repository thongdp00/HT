import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

// Let's dump the last 60,000 characters to a file and analyze
const tailLen = 80000;
const tail = code.substring(code.length - tailLen);
fs.writeFileSync('./app_code.js', tail);
console.log('Written app_code.js of length', tailLen);
