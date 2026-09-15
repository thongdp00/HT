import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

// Let's find react components or function names
// Find export or main render
console.log('--- Search for M3U URL context ---');
const m3uIdx = code.indexOf('https://raw.githubusercontent.com/thongdp00/m3u');
if (m3uIdx !== -1) {
  console.log(code.substring(m3uIdx - 400, m3uIdx + 600));
}

// Check for default channels
console.log('\n--- Search for DEFAULT_CHANNELS or channel list ---');
const match = code.match(/\[\{id:[^\]]+channel[^\]]+\]/i) || code.match(/name:"VTV1"/i);
if (match) {
  const idx = code.indexOf(match[0]);
  console.log('Channel list context:', code.substring(idx - 100, idx + 800));
}
