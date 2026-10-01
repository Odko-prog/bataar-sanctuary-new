import React, {useState} from 'react';
import {roomStayPrice, type Room} from '../roomStayPrice';

const rooms = {standard:'Энгийн өрөө', deluxe:'Люкс өрөө', family:'Гэр бүлийн өрөө'};
export function RoomBooking({initialRoom, onClose}: {initialRoom?: string; onClose: () => void}) {
  const [room, setRoom] = useState<Room>(initialRoom && initialRoom in rooms ? initialRoom as Room : 'standard');
  const [guests, setGuests] = useState(2);
  const [arrival, setArrival] = useState('');
  const [departure, setDeparture] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const nights = arrival && departure ? Math.round((Date.parse(departure) - Date.parse(arrival))/86400000) : 0;
  const total = roomStayPrice(room, guests, nights);
  const roomCount = Math.ceil(guests / (room === 'family' ? 6 : 2));
  const body = `Нэр: ${name}\nХолбоо барих: ${contact}\nӨрөө: ${rooms[room]}\nХүн: ${guests}\nӨрөөний тоо: ${roomCount}\nИрэх: ${arrival}\nГарах: ${departure}\nХоног: ${nights}\nБайр + 3 хоол: ${total}₮\nАялал ороогүй. Бааз боломж, үнийг батална.`;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
    <section role="dialog" aria-modal="true" aria-label="Өрөөний захиалга" className="bg-white text-stone-900 max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
      <button onClick={onClose} className="float-right border px-3 py-1">Хаах</button>
      <h2 className="text-2xl font-semibold">Өрөөний захиалга</h2>
      <p className="text-sm">Баазын байр + өдрийн 3 хоол. Аяллын төлбөр тусдаа.</p>
      <label className="block">Өрөөний төрөл<select className="block border p-2 w-full" value={room} onChange={e=>setRoom(e.target.value as Room)}>{Object.entries(rooms).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
      <label className="block">Хүний тоо<input className="block border p-2 w-full" type="number" min="1" max="50" value={guests} onChange={e=>setGuests(Number(e.target.value))}/></label>
      <label className="block">Ирэх огноо<input className="block border p-2 w-full" type="date" value={arrival} onChange={e=>setArrival(e.target.value)}/></label>
      <label className="block">Гарах огноо<input className="block border p-2 w-full" type="date" min={arrival} value={departure} onChange={e=>setDeparture(e.target.value)}/></label>
      <div className="border bg-amber-50 p-4 space-y-2" aria-live="polite">
        <p>{rooms[room]} — {room === 'standard' ? '260,000₮ / хүн, хоног; ганцаар 390,000₮' : room === 'deluxe' ? 'Ганцаар 450,000₮; хосоороо нийт 650,000₮ / хоног' : '650,000₮ / өрөө, хоног'}</p>
        <p>{roomCount} өрөө · {guests} хүн · {nights > 0 ? nights : '—'} хоног</p>
        <p className="font-semibold">Байр + 3 хоол: {total === null ? 'Ирэх, гарах огноогоо сонгоно уу' : `${total.toLocaleString()}₮`}</p>
        <p className="text-sm">Аяллын үнэ энэ дүнд ороогүй. Бааз өрөөний боломж, хуваарилалт, эцсийн үнийг батална.</p>
      </div>
      <label className="block">Нэр<input className="block border p-2 w-full" value={name} onChange={e=>setName(e.target.value)}/></label>
      <label className="block">Утас эсвэл имэйл<input className="block border p-2 w-full" value={contact} onChange={e=>setContact(e.target.value)}/></label>
      {total !== null && name.trim() && contact.trim() ? <a className="block bg-stone-900 text-white p-3 text-center" href={`mailto:bataartravel@gmail.com?subject=${encodeURIComponent('Өрөө захиалах хүсэлт')}&body=${encodeURIComponent(body)}`}>Имэйлээр захиалгын хүсэлт илгээх</a> : <p className="text-sm">Хүсэлт илгээхийн өмнө огноо, нэр, холбоо барих мэдээллээ бөглөнө үү.</p>}
      <p className="text-xs">Имэйл апп нээгдэнэ. Баазаас баталгаажуулсан хариу иртэл захиалга батлагдаагүй.</p>
    </section>
  </div>;
}
