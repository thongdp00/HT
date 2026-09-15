import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

['OP', 'f9', 'd9', 'u9', 'o9'].forEach(name => {
  const re = new RegExp(`[\\s,;]${name}\\s*=`, 'g');
  const match = re.exec(code);
  if (match) {
    console.log(`${name} match at:`, match.index);
    console.log(code.substring(match.index, match.index + 200));
  }
});
