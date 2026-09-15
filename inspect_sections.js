import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

// Find all React hooks (useState, useEffect, useMemo, useCallback, useRef) in the app code
// The app code is from around 190000 to 220000 and 1930000 to 1984809
console.log('--- Scanning sections ---');

// Let's find component definitions in the end section
const endPart = code.substring(1930000);
fs.writeFileSync('./end_app.js', endPart);
console.log('Written end_app.js, size:', endPart.length);
