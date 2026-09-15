const fs = require('fs');
const code = fs.readFileSync('/tmp/index.js', 'utf8');

console.log('Bundle length:', code.length);

// Look for package names or keywords
const keywords = ['shaka', 'hls.js', 'channel', 'category', 'drm', 'clearkey', 'widevine', 'vtv', 'htv', 'm3u', 'epg'];
for (const kw of keywords) {
  const matches = (code.match(new RegExp(kw, 'gi')) || []).length;
  console.log(`Keyword "${kw}": ${matches} occurrences`);
}

// Extract channel data structures or arrays
const m3uMatches = code.match(/https?:\/\/[^"'\s]+\.(m3u8?|mpd)/gi) || [];
console.log('Stream matches (sample 10):', m3uMatches.slice(0, 10));

const apiEndpoints = code.match(/\/api\/[^"'\s]+/gi) || [];
console.log('API endpoints:', [...new Set(apiEndpoints)]);

// Let's find channel categories or constants
const vtvIndex = code.indexOf('VTV1');
if (vtvIndex !== -1) {
  console.log('VTV1 context:', code.substring(Math.max(0, vtvIndex - 200), vtvIndex + 300));
}
