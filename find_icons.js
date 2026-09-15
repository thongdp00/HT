import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

// Find all lucide icon names
// Lucide icons often have createLucideIcon or displayName or svg paths
const lucideNames = code.match(/displayName\s*=\s*"([A-Za-z0-9]+)"/g) || [];
console.log('Lucide displayNames:', [...new Set(lucideNames.map(s => s.replace(/displayName\s*=\s*"/, '').replace('"', '')))]);
