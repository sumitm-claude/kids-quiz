import {useState,useEffect,useRef} from 'react';
import {ls,lsSet,PAL} from '../data/quizData';
import {playCorrect,playWrong,playUnlock,isSoundOn,toggleSound} from '../utils/sound';

const ACC='#34D399',ACC2='#059669';
const TABLES=Array.from({length:15},(_,i)=>i+1);
const MULT_MAX=12;
const ROUND_SIZE=10;
const GAUNTLET_SIZE=30;
const BLITZ_SECONDS=60;
const MODES=[
  {id:'blitz',lbl:'Blitz',em:'⚡',desc:'60 seconds — answer as many as you can'},
  {id:'missing',lbl:'Missing',em:'🧩',desc:'Find the missing number — round of 10'},
  {id:'gauntlet',lbl:'Gauntlet',em:'🏆',desc:'30 mixed questions — get graded A–F'},
];
const GRADE_COLORS={A:'#28a745',B:'#7C83FD',C:'#F7B731',D:'#fd9644',F:'#dc3545'};

function pickQuestion(tables,type){
  const a=tables[Math.floor(Math.random()*tables.length)];
  const b=1+Math.floor(Math.random()*MULT_MAX);
  const product=a*b;
  const t=type||(Math.random()<0.5?'standard':'missing');
  if(t==='standard')return{text:`${a} × ${b} = ?`,answer:product,type:'standard'};
  if(Math.random()<0.5)return{text:`? × ${b} = ${product}`,answer:a,type:'missing'};
  return{text:`${a} × ? = ${product}`,answer:b,type:'missing'};
}
function tablesKey(sel){return sel.length===TABLES.length?'all':[...sel].sort((x,y)=>x-y).join(',');}
function gradeFor(pct){if(pct>=90)return'A';if(pct>=80)return'B';if(pct>=70)return'C';if(pct>=60)return'D';return'F';}

export default function MathTables({profile,avatarIdx,onBack}){
  const[screen,setScreen]=useState('setup');
  const[mode,setMode]=useState('blitz');
  const[tables,setTables]=useState(TABLES);
  const[timeLeft,setTimeLeft]=useState(BLITZ_SECONDS);
  const[q,setQ]=useState(null);
  const[round,setRound]=useState([]);
  const[idx,setIdx]=useState(0);
  const[score,setScore]=useState(0);
  const[attempted,setAttempted]=useState(0);
  const[input,setInput]=useState('');
  const[sub,setSub]=useState(false);
  const[isOk,setIsOk]=useState(false);
  const[anm,setAnm]=useState('');
  const[bests,setBests]=useState(()=>ls('kq_math_best',{blitz:{},missing:{},gauntlet:{}}));
  const[soundOn,setSoundOnUi]=useState(()=>isSoundOn());
  const iRef=useRef(null);

  useEffect(()=>{lsSet('kq_math_best',bests);},[bests]);
  function toggleSoundUi(){setSoundOnUi(toggleSound());}
  useEffect(()=>{if((screen==='blitz'||screen==='round')&&!sub&&iRef.current)iRef.current.focus();},[q,idx,sub,screen]);

  useEffect(()=>{
    if(screen!=='blitz')return;
    if(timeLeft<=0){finishBlitz();return;}
    const id=setTimeout(()=>setTimeLeft(t=>t-1),1000);
    return ()=>clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[screen,timeLeft]);

  function toggleTable(n){
    setTables(t=>t.includes(n)?(t.length>1?t.filter(x=>x!==n):t):[...t,n].sort((x,y)=>x-y));
  }
  function resetQ(){setInput('');setSub(false);setIsOk(false);setAnm('');}

  function start(){
    if(mode==='blitz'){
      setScore(0);setAttempted(0);setTimeLeft(BLITZ_SECONDS);
      setQ(pickQuestion(tables,'standard'));setInput('');
      setScreen('blitz');
    }else if(mode==='missing'){
      setRound(Array.from({length:ROUND_SIZE},()=>pickQuestion(tables,'missing')));
      setIdx(0);setScore(0);resetQ();setScreen('round');
    }else{
      setRound(Array.from({length:GAUNTLET_SIZE},()=>pickQuestion(TABLES,null)));
      setIdx(0);setScore(0);resetQ();setScreen('round');
    }
  }

  function finishBlitz(){
    const key=tablesKey(tables);
    const isNew=score>0&&score>=(bests.blitz[key]||0);
    setBests(b=>({...b,blitz:{...b.blitz,[key]:Math.max(b.blitz[key]||0,score)}}));
    if(isNew)playUnlock();
    setScreen('summary');
  }
  function doSubBlitz(){
    if(!input.trim()||!q)return;
    const ok=parseInt(input,10)===q.answer;
    setAttempted(a=>a+1);
    if(ok){setScore(s=>s+1);setAnm('pop');playCorrect();}else{setAnm('wiggle');playWrong();}
    setInput('');
    setQ(pickQuestion(tables,'standard'));
    setTimeout(()=>setAnm(''),350);
  }
  function hkBlitz(e){if(e.key==='Enter')doSubBlitz();}

  const roundQ=round[idx];
  function doSub(){
    if(sub||!input.trim()||!roundQ)return;
    const ok=parseInt(input,10)===roundQ.answer;
    setIsOk(ok);
    if(ok){setScore(s=>s+1);setAnm('pop');playCorrect();}else{setAnm('wiggle');playWrong();}
    setSub(true);
  }
  function next(){
    if(idx+1>=round.length){
      let isNew=false;
      if(mode==='missing'){
        const key=tablesKey(tables);
        isNew=score>0&&score>=(bests.missing[key]||0);
        setBests(b=>({...b,missing:{...b.missing,[key]:Math.max(b.missing[key]||0,score)}}));
      }else{
        isNew=score>0&&score>=(bests.gauntlet.best||0);
        setBests(b=>({...b,gauntlet:{best:Math.max(b.gauntlet.best||0,score)}}));
      }
      if(isNew)playUnlock();
      setScreen('summary');
    }else{
      setIdx(i=>i+1);resetQ();
    }
  }
  function hkRound(e){if(e.key==='Enter')sub?next():doSub();}

  const key=tablesKey(tables);
  let bestLine=null;
  if(mode==='blitz'&&bests.blitz[key])bestLine=`Best: ${bests.blitz[key]} correct in 60s`;
  if(mode==='missing'&&bests.missing[key])bestLine=`Best: ${bests.missing[key]}/${ROUND_SIZE}`;
  if(mode==='gauntlet'&&bests.gauntlet.best)bestLine=`Best: ${bests.gauntlet.best}/${GAUNTLET_SIZE} (Grade ${gradeFor(bests.gauntlet.best/GAUNTLET_SIZE*100)})`;

  if(screen==='setup'){
    return(
      <div style={{minHeight:"100vh",boxSizing:"border-box",background:`linear-gradient(135deg,${ACC},${ACC2})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:20}}>
        <div style={{maxWidth:440,width:"100%"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,background:"rgba(255,255,255,.12)",borderRadius:20,padding:"14px 16px"}}>
            <div style={{width:48,height:48,borderRadius:"50%",background:PAL[avatarIdx%PAL.length].bg,color:"white",fontSize:22,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{profile.name[0].toUpperCase()}</div>
            <div style={{flex:1}}>
              <div style={{color:"white",fontWeight:800,fontSize:18}}>✖️ Math Tables</div>
              <div style={{color:"rgba(255,255,255,.65)",fontSize:12}}>Type the answer</div>
            </div>
            <button onClick={toggleSoundUi} title="Toggle sound" style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",color:"white",borderRadius:10,padding:"6px 9px",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>{soundOn?"🔊":"🔇"}</button>
            <button onClick={onBack} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",color:"white",borderRadius:10,padding:"6px 12px",fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>🏠 Hub</button>
          </div>
          <div style={{background:"white",borderRadius:24,padding:"20px 18px",boxShadow:"0 24px 64px rgba(0,0,0,.25)"}}>
            <div style={{fontSize:13,color:"#999",fontWeight:700,marginBottom:8,letterSpacing:.5}}>MODE</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
              {MODES.map(m=>(
                <button key={m.id} onClick={()=>setMode(m.id)} style={{background:mode===m.id?ACC:"#f5f5f5",border:"none",borderRadius:16,padding:"12px 14px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:24}}>{m.em}</span>
                  <span style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:15,color:mode===m.id?"white":"#333"}}>{m.lbl}</div>
                    <div style={{fontSize:12,color:mode===m.id?"rgba(255,255,255,.85)":"#999"}}>{m.desc}</div>
                  </span>
                </button>
              ))}
            </div>
            {mode!=='gauntlet'&&(
              <>
                <div style={{fontSize:13,color:"#999",fontWeight:700,marginBottom:8,letterSpacing:.5}}>TABLES</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
                  <button onClick={()=>setTables(TABLES)} style={{background:tables.length===TABLES.length?ACC:"#f5f5f5",color:tables.length===TABLES.length?"white":"#777",border:"none",borderRadius:12,padding:"7px 12px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>All</button>
                  {TABLES.map(n=>(
                    <button key={n} onClick={()=>toggleTable(n)} style={{background:tables.includes(n)?ACC:"#f5f5f5",color:tables.includes(n)?"white":"#777",border:"none",borderRadius:12,padding:"7px 12px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",minWidth:34}}>{n}</button>
                  ))}
                </div>
              </>
            )}
            {mode==='gauntlet'&&<div style={{fontSize:13,color:"#999",marginBottom:18,textAlign:"center"}}>Gauntlet always tests every table, 1–15.</div>}
            <div style={{background:"#f0fdf7",borderRadius:14,padding:"10px 14px",marginBottom:16,textAlign:"center"}}>
              <div style={{fontSize:14,color:"#666"}}>{bestLine||"No personal best yet — go set one!"}</div>
            </div>
            <button onClick={start} style={{width:"100%",background:`linear-gradient(135deg,${ACC},${ACC2})`,color:"white",border:"none",borderRadius:16,padding:"14px 0",fontSize:17,cursor:"pointer",fontFamily:"inherit",fontWeight:800,boxShadow:"0 8px 24px rgba(52,211,153,.4)"}}>Start →</button>
          </div>
        </div>
      </div>
    );
  }

  if(screen==='blitz'){
    if(!q)return null;
    return(
      <div style={{minHeight:"100vh",boxSizing:"border-box",background:`linear-gradient(135deg,${ACC},${ACC2})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:12}}>
        <div style={{background:"white",borderRadius:28,padding:"16px 18px 20px",maxWidth:400,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,.3)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <span style={{background:timeLeft<=10?"#fdecea":"#f0f0f0",color:timeLeft<=10?"#dc3545":"#666",borderRadius:10,padding:"4px 10px",fontSize:16,fontWeight:800}}>⏱ {timeLeft}s</span>
            <span style={{background:"#f0fdf7",borderRadius:10,padding:"4px 10px",fontSize:14,fontWeight:700,color:ACC2}}>✅ {score}</span>
            <button onClick={toggleSoundUi} title="Toggle sound" style={{background:"#f0f0f0",border:"none",borderRadius:9,padding:"3px 7px",cursor:"pointer",fontSize:14,lineHeight:1,fontFamily:"inherit"}}>{soundOn?"🔊":"🔇"}</button>
            <button onClick={onBack} style={{background:"#f0f0f0",border:"none",borderRadius:9,padding:"3px 7px",cursor:"pointer",fontSize:14,lineHeight:1,fontFamily:"inherit",fontWeight:700,color:"#666"}}>🏠</button>
          </div>
          <div style={{background:"#fafafa",border:"2px solid #f0f0f0",borderRadius:18,padding:"24px 12px",marginBottom:14,textAlign:"center"}}>
            <div style={{fontSize:32,fontWeight:800,color:"#333"}}>{q.text}</div>
          </div>
          <div style={{display:"flex",gap:7}}>
            <input ref={iRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={hkBlitz} inputMode="numeric" placeholder="Type the answer…" style={{flex:1,border:`2.5px solid ${anm==='pop'?'#28a745':anm==='wiggle'?'#dc3545':ACC}`,borderRadius:13,padding:"11px 13px",fontSize:20,fontFamily:"inherit",outline:"none",color:"#333",transition:"border-color .2s"}}/>
            <button onClick={doSubBlitz} disabled={!input.trim()} style={{background:input.trim()?`linear-gradient(135deg,${ACC},${ACC2})`:"#ddd",color:"white",border:"none",borderRadius:13,padding:"0 15px",fontSize:20,cursor:input.trim()?"pointer":"default",fontFamily:"inherit",fontWeight:700}}>✓</button>
          </div>
        </div>
      </div>
    );
  }

  if(screen==='round'){
    if(!roundQ)return null;
    return(
      <div style={{minHeight:"100vh",boxSizing:"border-box",background:`linear-gradient(135deg,${ACC},${ACC2})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:12}}>
        <div style={{background:"white",borderRadius:28,padding:"14px 16px 18px",maxWidth:400,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,.3)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <span style={{background:"#f0f0f0",borderRadius:10,padding:"3px 9px",fontSize:12,fontWeight:700,color:"#666"}}>Question {idx+1}/{round.length}</span>
            <div style={{display:"flex",gap:5,alignItems:"center"}}>
              <span style={{background:"#f0fdf7",borderRadius:10,padding:"3px 9px",fontSize:12,fontWeight:700,color:ACC2}}>✅ {score}</span>
              <button onClick={toggleSoundUi} title="Toggle sound" style={{background:"#f0f0f0",border:"none",borderRadius:9,padding:"3px 7px",cursor:"pointer",fontSize:14,lineHeight:1,fontFamily:"inherit"}}>{soundOn?"🔊":"🔇"}</button>
              <button onClick={onBack} style={{background:"#f0f0f0",border:"none",borderRadius:9,padding:"3px 7px",cursor:"pointer",fontSize:14,lineHeight:1,fontFamily:"inherit",fontWeight:700,color:"#666"}}>🏠</button>
            </div>
          </div>
          <div style={{background:"#fafafa",border:"2px solid #f0f0f0",borderRadius:18,padding:"24px 12px",marginBottom:14,textAlign:"center"}}>
            <div style={{fontSize:30,fontWeight:800,color:"#333"}}>{roundQ.text}</div>
          </div>
          {!sub&&(
            <div style={{display:"flex",gap:7}}>
              <input ref={iRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={hkRound} inputMode="numeric" placeholder="Type the answer…" style={{flex:1,border:`2.5px solid ${ACC}`,borderRadius:13,padding:"11px 13px",fontSize:19,fontFamily:"inherit",outline:"none",color:"#333"}}/>
              <button onClick={doSub} disabled={!input.trim()} style={{background:input.trim()?`linear-gradient(135deg,${ACC},${ACC2})`:"#ddd",color:"white",border:"none",borderRadius:13,padding:"0 15px",fontSize:20,cursor:input.trim()?"pointer":"default",fontFamily:"inherit",fontWeight:700}}>✓</button>
            </div>
          )}
          {sub&&(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:700,marginBottom:6,color:isOk?"#28a745":"#dc3545",animation:anm==="pop"?"pop .4s ease":anm==="wiggle"?"wiggle .45s ease":"none"}}>
                {isOk?"Correct! 🎉":"Not quite!"}
              </div>
              {!isOk&&<div style={{fontSize:15,color:"#666",marginBottom:8}}>Answer: <strong style={{color:"#28a745"}}>{roundQ.answer}</strong></div>}
              <button onClick={next} style={{background:`linear-gradient(135deg,${ACC},${ACC2})`,color:"white",border:"none",borderRadius:16,padding:"11px 24px",fontSize:17,cursor:"pointer",fontFamily:"inherit",fontWeight:700,boxShadow:"0 4px 16px rgba(0,0,0,.18)"}}>{idx+1>=round.length?"See Results →":"Next →"}</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if(screen==='summary'){
    let content;
    if(mode==='blitz'){
      const acc=attempted>0?Math.round(score/attempted*100):0;
      const isNewBest=score>0&&score>=(bests.blitz[key]||0);
      content=(
        <>
          <div style={{fontSize:44,marginBottom:6}}>⚡</div>
          <h2 style={{margin:"0 0 4px",fontSize:24,color:"#333"}}>Time's Up!</h2>
          <div style={{fontSize:32,fontWeight:800,color:ACC2,margin:"6px 0"}}>{score} correct</div>
          <div style={{fontSize:14,color:"#999",marginBottom:8}}>{attempted} attempted · {acc}% accuracy</div>
          {isNewBest&&score>0&&<div style={{background:"#fff3cd",color:"#856404",borderRadius:12,padding:"6px 12px",fontSize:14,fontWeight:700,display:"inline-block",marginBottom:8}}>🌟 New Personal Best!</div>}
        </>
      );
    }else if(mode==='missing'){
      const pct=score/round.length;
      const stars=pct>=.85?3:pct>=.6?2:pct>=.3?1:0;
      const prevBest=bests.missing[key]||0;
      const isNewBest=score>0&&score>=prevBest;
      content=(
        <>
          <div style={{fontSize:44,marginBottom:6}}>{stars===3?'🏆':stars===2?'🎉':stars===1?'👍':'💪'}</div>
          <h2 style={{margin:"0 0 4px",fontSize:24,color:"#333"}}>Round Complete!</h2>
          <div style={{fontSize:32,margin:"6px 0",letterSpacing:6}}>{[1,2,3].map(i=><span key={i} style={{color:i<=stars?"#F7B731":"#eee"}}>★</span>)}</div>
          <div style={{fontSize:20,fontWeight:800,color:ACC2,marginBottom:4}}>{score} / {round.length} correct</div>
          {isNewBest&&<div style={{background:"#fff3cd",color:"#856404",borderRadius:12,padding:"6px 12px",fontSize:14,fontWeight:700,display:"inline-block",marginBottom:8}}>🌟 New Personal Best!</div>}
        </>
      );
    }else{
      const pct=Math.round(score/round.length*100);
      const g=gradeFor(pct);
      const isNewBest=score>0&&score>=(bests.gauntlet.best||0);
      content=(
        <>
          <div style={{fontSize:56,fontWeight:800,color:GRADE_COLORS[g],margin:"6px 0"}}>{g}</div>
          <h2 style={{margin:"0 0 4px",fontSize:24,color:"#333"}}>Gauntlet Complete!</h2>
          <div style={{fontSize:20,fontWeight:800,color:ACC2,marginBottom:4}}>{score} / {round.length} ({pct}%)</div>
          {isNewBest&&<div style={{background:"#fff3cd",color:"#856404",borderRadius:12,padding:"6px 12px",fontSize:14,fontWeight:700,display:"inline-block",marginBottom:8}}>🌟 New Personal Best!</div>}
        </>
      );
    }
    return(
      <div style={{minHeight:"100vh",boxSizing:"border-box",background:`linear-gradient(135deg,${ACC},${ACC2})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:20}}>
        <div style={{background:"white",borderRadius:28,padding:"32px 24px",maxWidth:400,width:"100%",textAlign:"center",boxShadow:"0 24px 64px rgba(0,0,0,.3)"}}>
          {content}
          <div style={{display:"flex",flexDirection:"column",gap:9,marginTop:16}}>
            <button onClick={start} style={{background:`linear-gradient(135deg,${ACC},${ACC2})`,color:"white",border:"none",borderRadius:14,padding:"12px 0",fontSize:16,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>🔄 Play Again</button>
            <button onClick={()=>setScreen('setup')} style={{background:"#f5f5f5",color:"#666",border:"none",borderRadius:14,padding:"12px 0",fontSize:15,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>⚙️ Change Settings</button>
            <button onClick={onBack} style={{background:"none",color:"#bbb",border:"none",padding:"6px 0",fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>🏠 Back to Hub</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
