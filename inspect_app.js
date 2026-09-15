import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

console.log('Bundle length:', code.length);

// Look for package names or keywords
const keywords = ['shaka', 'hls.js', 'channel', 'category', 'drm', 'clearkey', 'widevine', 'm3u', 'epg', 'workers.dev', 'api'];
for (const kw of keywords) {
  const matches = (code.match(new RegExp(kw, 'gi')) || []).length;
  console.log(`Keyword "${kw}": ${matches} occurrences`);
}

// Find strings or endpoints
const urls = [...new Set(code.match(/https?:\/\/[^\s"'`\\<>;]+/g) || [])];
console.log('Total URLs:', urls.length);
console.log('Sample URLs:');
urls.filter(u => !u.includes('w3.org') && !u.includes('schema.org') && !u.includes('github.com')).slice(0, 35).forEach(u => console.log('  ', u));
