import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

['OP', 'f9', 'd9', 'u9', 'o9'].forEach(name => {
  const match = code.indexOf(`const ${name}=`) !== -1 ? code.indexOf(`const ${name}=`) : (code.indexOf(`var ${name}=`) !== -1 ? code.indexOf(`var ${name}=`) : code.indexOf(`function ${name}(`));
  console.log(`${name} defined at:`, match);
  if (match !== -1) {
    console.log(code.substring(match, match + 300));
  }
});
