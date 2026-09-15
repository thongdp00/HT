import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

const funcs = ['Mm', 'bM', 'CS', 'Qc', 'AI', 'CM', 'LM', 'SI', 'J8', 'X8', 'Q8', 'G2', 'j2', 'K8', 'Z8', '_S', 'tS', 'eS', 'e5', 't5', 'Xx', 'Wx', 'Xa', 'PP'];

funcs.forEach(f => {
  let idx = code.indexOf(`function ${f}(`);
  if (idx === -1) idx = code.indexOf(`const ${f}=`);
  if (idx === -1) idx = code.indexOf(`let ${f}=`);
  if (idx === -1) idx = code.indexOf(`var ${f}=`);
  if (idx === -1) {
    const re = new RegExp(`[\\s,;]${f}\\s*=`, 'g');
    const m = re.exec(code);
    if (m) idx = m.index;
  }
  console.log(`=== ${f} (pos: ${idx}) ===`);
  if (idx !== -1) {
    console.log(code.substring(idx, idx + 400));
  }
});
