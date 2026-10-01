import {readFileSync, writeFileSync} from 'node:fs';
const path = 'src/bataar-app.js';
let source = readFileSync(path, 'utf8');
const old = 'children:o==="mn"?"Үнийн дүнг захиалга өгөх алхамд сонгосон огноогоор тооцоолно":o==="ja"?"宿泊料金は予約画面にて日程と人数に応じ自動計算されます":o==="zh"?"实时房价将在预订页面根据入住日期与人数精确核算":"Rates are calculated dynamically during booking"';
if (source.split(old).length !== 2) throw new Error('Expected one room price display');
source = source.replace(old, 'children:xe[F].price');
source = source.replace('o==="mn"?"Өглөөний зоог багтсан":"Gourmet breakfast included"', 'o==="mn"?"Өдрийн 3 хоол багтсан":"Three meals per day included"');
writeFileSync(path, source);
console.log('Room cards now render their approved tariff.');
