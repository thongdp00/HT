import fs from 'fs';

const end = fs.readFileSync('./end_app.js', 'utf8');

// Find all occurrences of id: "..." in JSX
const ids = end.match(/id:"[^"]+"/g) || [];
console.log('All element IDs:', [...new Set(ids)]);

// Find all components that return Jt.jsx / Jt.jsxs
// Let's find function names before return Jt.jsx or Jt.jsxs
const funcs = [...end.matchAll(/function\s+([A-Za-z0-9_$]+)\s*\(([^)]*)\)\s*\{/g)];
console.log('Functions in end_app:', funcs.map(f => f[1]));
