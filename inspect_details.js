import fs from 'fs';

const middle = fs.readFileSync('./middle_app.js', 'utf8');
const end = fs.readFileSync('./end_app.js', 'utf8');

console.log('--- Middle beginning (500 chars) ---');
console.log(middle.substring(0, 500));

console.log('\n--- Middle end (500 chars) ---');
console.log(middle.substring(middle.length - 500));

console.log('\n--- End beginning (500 chars) ---');
console.log(end.substring(0, 500));
