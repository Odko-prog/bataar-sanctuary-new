import {readFileSync, writeFileSync} from 'node:fs';
const path = 'src/bataar-app.js';
let count = 0;
const source = readFileSync(path, 'utf8').replace(/deluxeGerPrice:"[^"]*"/g, old => {
  count++;
  const text = old.includes('₮')
    ? 'Ганцаар 450,000₮ • хосоороо нийт 650,000₮ / хоног • 3 хоол багтсан'
    : 'Single: 450,000 MNT • Couple total: 650,000 MNT / room / night • 3 meals per guest included';
  return 'deluxeGerPrice:' + JSON.stringify(text);
});
if (count !== 8) throw new Error('Unexpected deluxe room tariff count: ' + count);
writeFileSync(path, source);
console.log('Updated deluxe room prices in all 8 languages.');
