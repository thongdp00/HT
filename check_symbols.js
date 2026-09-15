import fs from 'fs';

const code = fs.readFileSync('formatted_T9.js', 'utf8');

// Check for top-level helper functions or symbols referenced in T9
// List of symbols we know:
// Pt -> React
// Jt -> jsx runtime
// ys -> Hls
// Yc -> mpegts
// al -> shaka
// f9 -> Music icon
// d9 -> Radio icon
// u9 -> Minimize icon
// o9 -> Maximize icon
// OP -> Tv icon
// s9 -> Hash icon
// Xx -> StreamHealthManager instance
// Wx -> getBufferAhead helper
// Xa -> handleAutoplay helper
// Mm -> isSportsChannel helper?
// Let's check other symbols:
const candidates = [
  'Xx', 'Wx', 'Xa', 'Mm', 'LM', 'SI', 'bM', 'CS', 'Qc', 'AI', 'CM',
  'J8', 'X8', 'Q8', 'G2', 'j2', 'K8', 'Z8', '_S', 'tS', 'eS', 'e5', 't5'
];

candidates.forEach(name => {
  const count = (code.match(new RegExp('\\b' + name + '\\b', 'g')) || []).length;
  console.log(`${name}: ${count} references in T9`);
});
