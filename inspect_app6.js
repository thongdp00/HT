import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

// The application code in Vite bundles is near the end
const lastPart = code.substring(Math.max(0, code.length - 150000));
console.log('Length of bundle:', code.length);
console.log('Sample from last 150k:');

// Look for JSX / UI elements in the last part
const tags = lastPart.match(/jsx\([^)]+\)/g) || lastPart.match(/jsxs\([^)]+\)/g) || [];
console.log('JSX calls in last part:', tags.length);

// Write lastPart to a file for easy examination
fs.writeFileSync('./app_tail.js', lastPart);
console.log('Wrote ./app_tail.js');
