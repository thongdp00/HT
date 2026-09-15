import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

// Find return statements with jsx in main components
// Let's find strings that appear in the UI
const strings = code.match(/"([^"\\]|\\.)*"/g) || [];
const uiStrings = strings.filter(s => {
  const clean = s.replace(/"/g, '');
  return clean.length > 3 && clean.length < 50 && /[a-zA-ZÀ-ỹ]/.test(clean) && !clean.includes('http') && !clean.includes('data:');
});
console.log('Sample UI strings:', [...new Set(uiStrings)].slice(0, 50));
