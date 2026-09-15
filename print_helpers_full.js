import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

function printFunc(name, startPos) {
  let pos = code.indexOf(`function ${name}(`, startPos || 0);
  if (pos === -1) pos = code.indexOf(`const ${name}=`, startPos || 0);
  if (pos === -1) {
    const re = new RegExp(`[\\s,;]${name}\\s*=`, 'g');
    const m = re.exec(code);
    if (m) pos = m.index;
  }
  console.log(`\n================= FUNCTION: ${name} (pos ${pos}) =================`);
  if (pos !== -1) {
    // find next function or closing brace
    console.log(code.substring(pos, pos + 1200));
  }
}

['Mm', 'bM', 'CS', 'Qc', 'AI', 'CM', 'LM', 'SI', 'J8', 'X8', 'Q8', 'G2', 'EI', 'wM'].forEach(f => printFunc(f));
