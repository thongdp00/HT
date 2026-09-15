import fs from 'fs';

const t9 = fs.readFileSync('./raw_T9.js', 'utf8');
console.log('T9 length:', t9.length);

// Let's print the return statement of T9 (the JSX rendered by the player)
const retIdx = t9.lastIndexOf('return');
console.log('--- T9 return statement (last 3000 chars) ---');
console.log(t9.substring(retIdx));
