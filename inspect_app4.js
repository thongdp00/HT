import fs from 'fs';

const code = fs.readFileSync('./site_index.js', 'utf8');

// Find UI components, dialogs, settings, remote control keys
const searchTerms = ['Android TV', 'ClearKey', 'Widevine', 'Shaka', 'HLS', 'FPT', 'TV360', 'SCTV', 'VTVcab', 'remote', 'channelNumber', 'favorite', 'history', 'aspectRatio'];

for (const term of searchTerms) {
  const count = (code.match(new RegExp(term, 'gi')) || []).length;
  console.log(`${term}: ${count} matches`);
}

// Find keyboard event listeners to understand TV remote control support
const keyMatches = code.match(/key === [^&|)]+/g) || code.match(/e\.key === [^&|)]+/g) || [];
console.log('Sample key comparisons:', [...new Set(keyMatches)].slice(0, 20));

// Find component names or JSX labels
const vietnameseLabels = code.match(/"[\p{L}\s0-9]{3,30}"/gu) || [];
const uniqueVn = [...new Set(vietnameseLabels)].filter(s => /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(s));
console.log('Sample Vietnamese UI labels:', uniqueVn.slice(0, 30));
