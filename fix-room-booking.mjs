import {readFileSync, writeFileSync} from 'node:fs';
const path='src/bataar-app.js'; let source=readFileSync(path,'utf8');
const replacements = [
  ['const Z5=({currentLang:', 'const LegacyTourBooking=({currentLang:'],
  ['id:"camp-book-ger-tab-btn",onClick:u,', 'id:"camp-book-ger-tab-btn",onClick:()=>u(null,F),'],
  ['children:xe[F].price', 'children:o==="mn"?"Өрөөний үнэ, хүний тоо, хоногийн тооцоог захиалгын карт дотор харна":"Room pricing is shown separately in the room booking cart"'],
];
for(const [old,value] of replacements){if(source.split(old).length!==2)throw new Error('Unexpected match: '+old);source=source.replace(old,value);}
source='import {RoomBooking} from "./components/RoomBooking";\n'+source;
const boundary='const LegacyTourBooking=';
source=source.replace(boundary,'const Z5=props=>props.initialPackage?a.jsx(LegacyTourBooking,props):a.jsx(RoomBooking,{initialRoom:props.initialSite,onClose:props.onClose});'+boundary);
writeFileSync(path,source);
console.log('Room booking is separate from tour booking and receives selected room.');
