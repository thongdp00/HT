import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

const m3uPos = code.indexOf('https://raw.githubusercontent.com/thongdp00/m3u');
console.log('M3U Pos:', m3uPos);

// Let's dump from 198000 to 225000 to a file and look at the modules
const section = code.substring(198000, 225000);
fs.writeFileSync('./m3u_section.js', section);
console.log('Wrote m3u_section.js, length:', section.length);
