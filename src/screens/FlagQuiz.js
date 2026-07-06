import {useState,useEffect,useRef} from 'react';
import {FLAGS,CONTINENTS} from '../data/flagData';
import {shuf,ls,lsSet,PAL} from '../data/quizData';

const ACC='#F87171',ACC2='#ef4444';
const HINT_COST=20;
const ROUND_SIZE=10;
const DIFFS=[{id:'easy',lbl:'Easy',em:'🟢'},{id:'medium',lbl:'Medium',em:'🟡'},{id:'hard',lbl:'Hard',em:'🔴'},{id:'all',lbl:'All',em:'🌈'}];

function normalize(s){
  return s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toUpperCase().replace(/[^A-Z0-9 ]/g,'').replace(/\s+/g,' ').trim();
}
function isCorrect(input,country){
  const n=normalize(input);
  if(!n)return false;
  if(normalize(country.name)===n)return true;
  return country.alt.some(a=>normalize(a)===n);
}
function hintText(country,n){
  if(n===1)return `🌍 It's in ${country.continent}`;
  if(n===2)return `🔤 Starts with "${country.name[0].toUpperCase()}"`;
  if(n===3)return `🔢 The name has ${country.name.replace(/[^A-Za-z]/g,'').length} letters`;
  return `📝 ${country.clue}`;
}

export default function FlagQuiz({profile,avatarIdx,onBack}){
  const[screen,setScreen]=useState('setup');
  const[difficulty,setDifficulty]=useState('easy');
  const[continent,setContinent]=useState('all');
  const[round,setRound]=useState([]);
  const[idx,setIdx]=useState(0);
  const[score,setScore]=useState(0);
  const[hintsUsed,setHintsUsed]=useState(0);
  const[revealed,setRevealed]=useState([]);
  const[input,setInput]=useState('');
  const[sub,setSub]=useState(false);
  const[isOk,setIsOk]=useState(false);
  const[anm,setAnm]=useState('');
  const[bests,setBests]=useState(()=>ls('kq_flags_best',{}));
  const iRef=useRef(null);

  useEffect(()=>{lsSet('kq_flags_best',bests);},[bests]);
  useEffect(()=>{if(screen==='quiz'&&!sub&&iRef.current)iRef.current.focus();},[idx,sub,screen]);

  function pool(){
    return FLAGS.filter(f=>(difficulty==='all'||f.difficulty===difficulty)&&(continent==='all'||f.continent===continent));
  }
  function bestKey(){return `${difficulty}_${continent}`;}

  function start(){
    const p=pool();
    const n=Math.min(ROUND_SIZE,p.length);
    setRound(shuf(p).slice(0,n));
    setIdx(0);setScore(0);
    resetQ();
    setScreen('quiz');
  }
  function resetQ(){setInput('');setSub(false);setIsOk(false);setHintsUsed(0);setRevealed([]);setAnm('');}

  const country=round[idx];
  const maxPts=100-hintsUsed*HINT_COST;

  function revealHint(){
    if(sub||hintsUsed>=4||!country)return;
    const n=hintsUsed+1;
    setRevealed(r=>[...r,hintText(country,n)]);
    setHintsUsed(n);
  }
  function doSub(){
    if(sub||!input.trim()||!country)return;
    const ok=isCorrect(input,country);
    setIsOk(ok);
    if(ok){setScore(s=>s+maxPts);setAnm('pop');}
    else setAnm('wiggle');
    setSub(true);
  }
  function doSkip(){
    if(sub||!country)return;
    setIsOk(false);setSub(true);
  }
  function next(){
    if(idx+1>=round.length){
      const key=bestKey();
      setBests(b=>({...b,[key]:Math.max(b[key]||0,score)}));
      setScreen('summary');
    }else{
      setIdx(i=>i+1);resetQ();
    }
  }
  function hk(e){if(e.key==='Enter')sub?next():doSub();}

  const maxScore=round.length*100;
  const pct=maxScore>0?score/maxScore:0;
  const stars=pct>=.85?3:pct>=.6?2:pct>=.3?1:0;
  const prevBest=bests[bestKey()]||0;
  const isNewBest=score>prevBest&&score>0;

  if(screen==='setup'){
    const avail=pool().length;
    const roundN=Math.min(ROUND_SIZE,avail);
    return(
      <div style={{minHeight:"100vh",boxSizing:"border-box",background:`linear-gradient(135deg,${ACC},${ACC2})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:20}}>
        <div style={{maxWidth:440,width:"100%"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,background:"rgba(255,255,255,.12)",borderRadius:20,padding:"14px 16px"}}>
            <div style={{width:48,height:48,borderRadius:"50%",background:PAL[avatarIdx%PAL.length].bg,color:"white",fontSize:22,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{profile.name[0].toUpperCase()}</div>
            <div style={{flex:1}}>
              <div style={{color:"white",fontWeight:800,fontSize:18}}>🌍 Flag Quiz</div>
              <div style={{color:"rgba(255,255,255,.65)",fontSize:12}}>Type the country name</div>
            </div>
            <button onClick={onBack} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",color:"white",borderRadius:10,padding:"6px 12px",fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>🏠 Hub</button>
          </div>
          <div style={{background:"white",borderRadius:24,padding:"20px 18px",boxShadow:"0 24px 64px rgba(0,0,0,.25)"}}>
            <div style={{fontSize:13,color:"#999",fontWeight:700,marginBottom:8,letterSpacing:.5}}>DIFFICULTY</div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:18}}>
              {DIFFS.map(d=>(
                <button key={d.id} onClick={()=>setDifficulty(d.id)} style={{background:difficulty===d.id?ACC:"#f5f5f5",color:difficulty===d.id?"white":"#777",border:"none",borderRadius:14,padding:"9px 14px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{d.em} {d.lbl}</button>
              ))}
            </div>
            <div style={{fontSize:13,color:"#999",fontWeight:700,marginBottom:8,letterSpacing:.5}}>CONTINENT</div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:18}}>
              <button onClick={()=>setContinent('all')} style={{background:continent==='all'?ACC:"#f5f5f5",color:continent==='all'?"white":"#777",border:"none",borderRadius:14,padding:"9px 14px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🌐 All</button>
              {CONTINENTS.map(c=>(
                <button key={c} onClick={()=>setContinent(c)} style={{background:continent===c?ACC:"#f5f5f5",color:continent===c?"white":"#777",border:"none",borderRadius:14,padding:"9px 14px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{c}</button>
              ))}
            </div>
            <div style={{background:"#fff5f5",borderRadius:14,padding:"10px 14px",marginBottom:16,textAlign:"center"}}>
              <div style={{fontSize:14,color:"#666"}}>{avail} countries available · round of <strong>{roundN}</strong></div>
              {prevBest>0&&<div style={{fontSize:13,color:"#999",marginTop:2}}>Best for this setup: <strong style={{color:ACC2}}>{prevBest}</strong> pts</div>}
            </div>
            <button onClick={start} disabled={avail===0} style={{width:"100%",background:avail>0?`linear-gradient(135deg,${ACC},${ACC2})`:"#ddd",color:"white",border:"none",borderRadius:16,padding:"14px 0",fontSize:17,cursor:avail>0?"pointer":"default",fontFamily:"inherit",fontWeight:800,boxShadow:avail>0?"0 8px 24px rgba(248,113,113,.4)":"none"}}>Start Round →</button>
          </div>
        </div>
      </div>
    );
  }

  if(screen==='summary'){
    return(
      <div style={{minHeight:"100vh",boxSizing:"border-box",background:`linear-gradient(135deg,${ACC},${ACC2})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:20}}>
        <div style={{background:"white",borderRadius:28,padding:"32px 24px",maxWidth:400,width:"100%",textAlign:"center",boxShadow:"0 24px 64px rgba(0,0,0,.3)"}}>
          <div style={{fontSize:44,marginBottom:6}}>{stars===3?'🏆':stars===2?'🎉':stars===1?'👍':'💪'}</div>
          <h2 style={{margin:"0 0 4px",fontSize:24,color:"#333"}}>Round Complete!</h2>
          <div style={{fontSize:32,margin:"6px 0",letterSpacing:6}}>{[1,2,3].map(i=><span key={i} style={{color:i<=stars?"#F7B731":"#eee"}}>★</span>)}</div>
          <div style={{fontSize:20,fontWeight:800,color:ACC2,marginBottom:4}}>{score} / {maxScore} pts</div>
          {isNewBest&&<div style={{background:"#fff3cd",color:"#856404",borderRadius:12,padding:"6px 12px",fontSize:14,fontWeight:700,display:"inline-block",marginBottom:8}}>🌟 New Personal Best!</div>}
          {!isNewBest&&prevBest>0&&<div style={{fontSize:13,color:"#999",marginBottom:8}}>Best: {prevBest} pts</div>}
          <div style={{display:"flex",flexDirection:"column",gap:9,marginTop:16}}>
            <button onClick={start} style={{background:`linear-gradient(135deg,${ACC},${ACC2})`,color:"white",border:"none",borderRadius:14,padding:"12px 0",fontSize:16,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>🔄 Play Again</button>
            <button onClick={()=>setScreen('setup')} style={{background:"#f5f5f5",color:"#666",border:"none",borderRadius:14,padding:"12px 0",fontSize:15,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>⚙️ Change Settings</button>
            <button onClick={onBack} style={{background:"none",color:"#bbb",border:"none",padding:"6px 0",fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>🏠 Back to Hub</button>
          </div>
        </div>
      </div>
    );
  }

  if(!country)return null;

  return(
    <div style={{minHeight:"100vh",boxSizing:"border-box",background:`linear-gradient(135deg,${ACC},${ACC2})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:12}}>
      <div style={{background:"white",borderRadius:28,padding:"14px 16px 18px",maxWidth:440,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,.3)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{background:"#f0f0f0",borderRadius:10,padding:"3px 9px",fontSize:12,fontWeight:700,color:"#666"}}>Question {idx+1}/{round.length}</span>
          <div style={{display:"flex",gap:5,alignItems:"center"}}>
            <span style={{background:"#fff0f0",borderRadius:10,padding:"3px 9px",fontSize:12,fontWeight:700,color:ACC2}}>⭐ {score} pts</span>
            <button onClick={onBack} style={{background:"#f0f0f0",border:"none",borderRadius:9,padding:"3px 7px",cursor:"pointer",fontSize:14,lineHeight:1,fontFamily:"inherit",fontWeight:700,color:"#666"}}>🏠</button>
          </div>
        </div>
        <div style={{background:"#fafafa",border:"2px solid #f0f0f0",borderRadius:18,padding:"18px 12px",marginBottom:12,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
          <img src={`https://flagcdn.com/w160/${country.code}.png`} alt="flag to guess" style={{width:140,maxWidth:"100%",borderRadius:8,boxShadow:"0 4px 16px rgba(0,0,0,.18)"}}/>
          <p style={{margin:0,fontSize:17,fontWeight:700,color:"#333"}}>Which country is this?</p>
        </div>
        {revealed.length>0&&(
          <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:10}}>
            {revealed.map((h,i)=><div key={i} style={{background:"#f5f5ff",borderRadius:10,padding:"7px 11px",fontSize:13,color:"#666"}}>{h}</div>)}
          </div>
        )}
        {!sub&&(
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:14,marginBottom:8}}>
            {hintsUsed<4
              ?<button onClick={revealHint} style={{background:"none",border:"none",color:ACC2,fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:700,textDecoration:"underline"}}>💡 Hint (worth {maxPts-HINT_COST} pts after)</button>
              :<span style={{color:"#ccc",fontSize:13}}>All hints used</span>}
            <button onClick={doSkip} style={{background:"none",border:"none",color:"#bbb",fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:700,textDecoration:"underline"}}>🤷 Skip</button>
          </div>
        )}
        {!sub&&(
          <div style={{display:"flex",gap:7}}>
            <input ref={iRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={hk} placeholder="Type the country name…" style={{flex:1,border:`2.5px solid ${ACC}`,borderRadius:13,padding:"11px 13px",fontSize:17,fontFamily:"inherit",outline:"none",color:"#333"}}/>
            <button onClick={doSub} disabled={!input.trim()} style={{background:input.trim()?`linear-gradient(135deg,${ACC},${ACC2})`:"#ddd",color:"white",border:"none",borderRadius:13,padding:"0 15px",fontSize:20,cursor:input.trim()?"pointer":"default",fontFamily:"inherit",fontWeight:700}}>✓</button>
          </div>
        )}
        {sub&&(
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:700,marginBottom:6,color:isOk?"#28a745":"#dc3545",animation:anm==="pop"?"pop .4s ease":anm==="wiggle"?"wiggle .45s ease":"none"}}>
              {isOk?`Correct! +${maxPts} pts 🎉`:"Not quite!"}
            </div>
            {!isOk&&<div style={{fontSize:15,color:"#666",marginBottom:8}}>It was <strong style={{color:"#28a745"}}>{country.name}</strong></div>}
            <button onClick={next} style={{background:`linear-gradient(135deg,${ACC},${ACC2})`,color:"white",border:"none",borderRadius:16,padding:"11px 24px",fontSize:17,cursor:"pointer",fontFamily:"inherit",fontWeight:700,boxShadow:"0 4px 16px rgba(0,0,0,.18)"}}>{idx+1>=round.length?"See Results →":"Next Flag →"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
