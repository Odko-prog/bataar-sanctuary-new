import {readFileSync, writeFileSync} from 'node:fs';
const path = 'src/bataar-app.js';
let count = 0;
const source = readFileSync(path, 'utf8').replace(/familyGerPrice:"[^"]*"/g, old => {
  count++;
  const text = old.includes('₮')
    ? '650,000₮ / өрөө, хоног • өдрийн 3 хоол багтсан'
    : '650,000 MNT / room / night • 3 meals included';
  return 'familyGerPrice:' + JSON.stringify(text);
});
if (count !== 8) throw new Error('Unexpected family room tariff count: ' + count);
writeFileSync(path, source);
console.log('Updated family room prices in all 8 languages.');
