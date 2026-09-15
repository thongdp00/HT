import fs from 'fs';

const s9 = fs.readFileSync('./raw_S9.js', 'utf8');
const t9 = fs.readFileSync('./raw_T9.js', 'utf8');

// Check JSX elements in S9
const tagsS9 = s9.match(/Jt\.jsx\(([A-Za-z0-9_$]+)/g) || [];
console.log('JSX tags in S9:', [...new Set(tagsS9)]);

// Check JSX elements in T9
const tagsT9 = t9.match(/Jt\.jsx\(([A-Za-z0-9_$]+)/g) || [];
console.log('JSX tags in T9:', [...new Set(tagsT9)]);
