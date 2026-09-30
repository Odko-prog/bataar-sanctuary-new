import type React from 'react';
import './sanctuary-sections.css';

const finds = [
  {name:'Чулуужсан шүд', label:'Шүдний загвар', path:'M220 85 Q290 190 240 310 Q210 355 185 310 Q155 205 220 85', note:'Хэлбэр, ирмэг, гадаргууг ажиглаарай. Энэ нь сургалтын дүрслэл; бодит олдворын зураг биш.'},
  {name:'Чулуужсан яс', label:'Ясны загвар', path:'M110 135 Q70 85 110 65 Q155 40 170 100 L290 260 Q355 240 350 290 Q350 350 295 320 L145 165 Q100 200 90 160 Z', note:'Ясыг ил гаргахдаа хүч хэрэглэхгүй. Бодит олдвор таарвал хөдөлгөхгүй, байршлыг тэмдэглэж мэргэжлийн байгууллагад мэдэгдэнэ.'},
  {name:'Чулуужсан өндөг', label:'Өндөгний загвар', path:'M220 70 C340 130 345 320 220 340 C90 320 100 130 220 70 Z', note:'Бүрхүүлийн бүтцийг ажиглаарай. Байгалийн олдворыг авч явахын оронд мэргэжлийн судлаачид мэдээлнэ.'}
];
export function ExcavationLab({currentLang='mn',runtime}:{currentLang?:string;runtime:typeof React}) {
  const mn=currentLang==='mn';
  const canvas=runtime.useRef<HTMLCanvasElement>(null);
  const drawing=runtime.useRef(false);
  const lastPoint=runtime.useRef<{x:number;y:number}|null>(null);
  const lastSample=runtime.useRef(0);
  const [find,setFind]=runtime.useState(0), [reset,setReset]=runtime.useState(0), [progress,setProgress]=runtime.useState(0);
  const [tool,setTool]=runtime.useState<'brush'|'fine'>('brush');
  runtime.useEffect(()=>{
    const ctx=canvas.current?.getContext('2d',{willReadFrequently:true}); if(!ctx)return;
    ctx.globalCompositeOperation='source-over';
    ctx.fillStyle='#c4a16e';ctx.fillRect(0,0,440,400);
    // Deterministic grains keep the learning surface light and readable.
    for(let i=0;i<2200;i++){ctx.fillStyle=i%2?'#d7bb91':'#ad895c';ctx.fillRect((i*137)%440,(i*79)%400,2,2);}
    setProgress(0); drawing.current=false; lastPoint.current=null;
  },[find,reset]);
  const sample=()=>{
    const ctx=canvas.current?.getContext('2d'); if(!ctx)return;
    const data=ctx.getImageData(0,0,440,400).data;let clear=0,total=0;
    for(let i=3;i<data.length;i+=64){total++;if(data[i]<40)clear++;}
    setProgress(Math.round(clear/total*100));
  };
  const erase=(x:number,y:number)=>{
    const ctx=canvas.current?.getContext('2d');if(!ctx)return;
    ctx.globalCompositeOperation='destination-out';ctx.lineWidth=tool==='brush'?64:30;
    ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
    const prev=lastPoint.current;ctx.moveTo(prev?.x??x,prev?.y??y);ctx.lineTo(x+.01,y+.01);ctx.stroke();
    lastPoint.current={x,y};if(performance.now()-lastSample.current>150){sample();lastSample.current=performance.now();}
  };
  const point=(e:React.PointerEvent<HTMLCanvasElement>)=>{const r=e.currentTarget.getBoundingClientRect();erase((e.clientX-r.left)*440/r.width,(e.clientY-r.top)*400/r.height);};
  const stop=()=>{drawing.current=false;lastPoint.current=null;sample();};
  const selected=finds[find];
  return <section id="fossil-lab" className="sanctuary-lab">
    <header><span className="sanctuary-eyebrow">INTERACTIVE SCIENCE · {mn?'СУРГАЛТЫН СИМУЛЯЦИ':'LEARNING SIMULATION'}</span><h2>{mn?'Говийн нууцыг зөөлөн нээе.':'Brush away the sand. Discover a fossil.'}</h2><p>{mn?'Багсаа сонгоод элсэн дээр чирээрэй. Олдворын 80%-ийг ил гаргаад дараагийн загварыг судлаарай.':'Choose a brush and drag across the sand. Reveal 80% to complete your exploration.'}</p></header>
    <div className="sanctuary-lab-grid"><div className="sanctuary-dig-card">
      <div className="sanctuary-tool-row"><div>{(['brush','fine'] as const).map(t=><button key={t} aria-pressed={tool===t} onClick={()=>setTool(t)}>{t==='brush'?(mn?'Зөөлөн багс':'Soft brush'):(mn?'Нарийн багс':'Fine brush')}</button>)}</div><button onClick={()=>setReset(v=>v+1)}>{mn?'Дахин эхлэх':'Reset'}</button></div>
      <div className="sanctuary-dig-surface"><svg viewBox="0 0 440 400" role="img" aria-label={selected.label}><defs><linearGradient id="fossil-tone" x2="0" y2="1"><stop stopColor="#f4ead5"/><stop offset="1" stopColor="#a47a44"/></linearGradient></defs><rect width="440" height="400" fill="#69513b"/><path d={selected.path} fill="url(#fossil-tone)" stroke="#422f1c" strokeWidth="5"/><path d="M210 155 L230 210 L200 255 M170 260 L245 280" fill="none" stroke="#8c6a45" strokeWidth="3" opacity=".5"/></svg>
        <canvas ref={canvas} width="440" height="400" tabIndex={0} role="button" aria-label={mn?'Элс арилгах. Чирэх эсвэл Enter дарна уу.':'Brush sand: drag or press Enter.'} onPointerDown={e=>{drawing.current=true;lastPoint.current=null;e.currentTarget.setPointerCapture(e.pointerId);point(e);}} onPointerMove={e=>{if(drawing.current)point(e);}} onPointerUp={stop} onPointerCancel={stop} onLostPointerCapture={stop} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();const r=canvas.current?.getContext('2d');if(!r)return;const d=r.getImageData(0,0,440,400).data;for(let y=25;y<400;y+=40){for(let x=25;x<440;x+=40){if(d[(y*440+x)*4+3]>40){lastPoint.current=null;erase(x,y);sample();return;}}}}}}/>
        {progress>=80&&<span className="sanctuary-discovered">✓ {mn?'Олдвор илэрлээ':'Discovery complete'}</span>}
      </div><div className="sanctuary-progress-row"><span>{mn?'Ил гаргасан талбай':'Surface uncovered'}</span><strong aria-live="polite">{progress}%</strong></div><progress value={progress} max="100" aria-label="Excavation progress"/>
    </div><aside className="sanctuary-find-card"><span className="sanctuary-eyebrow">{mn?'ОЛДВОРЫН ТЭМДЭГЛЭЛ':'FIELD NOTES'}</span><h3>{mn?selected.name:selected.label}</h3><p>{selected.note}</p><div className="sanctuary-learning-note">{mn?'Энд алх ашиглахгүй. Олдворыг гэмтээхгүйгээр ажиглаж сурах нь зорилго.':'Use brushes, not a hammer. This activity teaches careful observation.'}</div><h4>{mn?'Судлах загвар':'Choose a model'}</h4><div className="sanctuary-find-tabs">{finds.map((f,i)=><button key={f.name} aria-pressed={find===i} onClick={()=>setFind(i)}>{mn?f.name:['Tooth','Bone','Egg'][i]}</button>)}</div><p className="sanctuary-small">{mn?'Сургалтын дүрслэл нь мэргэжлийн малтлагын зааврыг орлохгүй.':'Educational illustration, not instructions for a real excavation.'}</p></aside></div>
  </section>;
}


