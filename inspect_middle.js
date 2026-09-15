import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

const middlePart = code.substring(190000, 225000);
fs.writeFileSync('./middle_app.js', middlePart);
console.log('Written middle_app.js, size:', middlePart.length);
