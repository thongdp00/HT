import fs from 'fs';

const end = fs.readFileSync('./end_app.js', 'utf8');

fs.writeFileSync('./comp_player_engine.js', end.substring(0, 48262));
console.log('Wrote comp_player_engine.js of size:', 48262);

// Check comp_channeldrawer.js
console.log('\n--- comp_channeldrawer.js ---');
console.log(fs.readFileSync('./comp_channeldrawer.js', 'utf8'));

// Check comp_app.js
console.log('\n--- comp_app.js ---');
console.log(fs.readFileSync('./comp_app.js', 'utf8'));
