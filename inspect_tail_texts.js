import fs from 'fs';

const code = fs.readFileSync('./app_tail.js', 'utf8');

// Find all string literals that look like UI text
const textMatches = code.match(/"([^"\\]*)"/g) || [];
const texts = [...new Set(textMatches.map(s => s.slice(1, -1)))]
  .filter(s => s.length > 2 && !s.startsWith('http') && !s.includes('px') && !s.includes('rgb') && !s.includes('path') && !s.includes('000'));
console.log('UI Texts in tail:');
console.log(texts.filter(t => /[A-Za-zÀ-ỹ]/.test(t) && !t.includes('-')).slice(0, 80));
