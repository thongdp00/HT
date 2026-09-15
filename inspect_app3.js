import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

// Let's search around K8 (the M3U url) and find the channel parsing, default channels, categories, etc.
const m3uIdx = code.indexOf('https://raw.githubusercontent.com/thongdp00/m3u/refs/heads/main/ht-tv.m3u');
console.log('--- Code from K8 for 3000 chars ---');
console.log(code.substring(m3uIdx, m3uIdx + 3000));
