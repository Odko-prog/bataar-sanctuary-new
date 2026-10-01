import {readFileSync, writeFileSync} from 'node:fs';
const path = 'src/bataar-app.js';
let source = readFileSync(path, 'utf8');
let count = 0;
source = source.replace(/standardGerPrice:"[^"]*"/g, old => {
  count++;
  const text = old.includes('₮')
    ? '260,000₮ / хүн, хоног • ганцаар 390,000₮ • 3 хоолтой'
    : '260,000 MNT (≈ $72.31) / person / night • Single: 390,000 MNT (≈ $108.46) • 3 meals included';
  return 'standardGerPrice:' + JSON.stringify(text);
});
if (count !== 8) throw new Error('Unexpected standard room tariff count: ' + count);
writeFileSync(path, source);
console.log('Updated standard room prices in all 8 languages.');
