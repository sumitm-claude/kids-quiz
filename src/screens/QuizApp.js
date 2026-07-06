import {useState,useEffect,useRef} from 'react';
import {CATS,Q,PAL,getCol,shuf,norm,chk,mkHint,LVS,OKM,ERM,ls,lsSet} from '../data/quizData';
import PinPad from '../components/PinPad';
import UnlockModal from '../components/UnlockModal';
import {playCorrect,playWrong,playStreak,playUnlock,isSoundOn,toggleSound} from '../utils/sound';

export default function QuizApp({profile,avatarIdx,onBack,onSwitchPlayer}){
  const[pin,setPin]=useState(()=>ls('kq_pin',null));
  const[psc,setPsc]=useState(null);
  const[xQs,setXQs]=useState(()=>ls('kq_xqs',[]));
  const[xC,setXC]=useState(()=>ls('kq_xc',[]));
  const[actC,setActC]=useState(()=>ls('kq_actc',null));
  const[unlk,setUnlk]=useState(()=>profile.unlocked||['easy']);
  const[lv,setLv]=useState(()=>profile.level||'easy');
  const[sc,setSc]=useState('quiz');
  const[gen,setGen]=useState(false);
  const[gSt,setGSt]=useState('');
  const[gErr,setGErr]=useState('');
  const[nCat,setNCat]=useState('');
  const[popup,setPopup]=useState(null);
  const[que,setQue]=useState([]);
  const[qi,setQi]=useState(0);
  const[cor,setCor]=useState(()=>profile.correct||0);
  const[tot,setTot]=useState(0);
  const[str,setStr]=useState(0);
  const[bst,setBst]=useState(()=>profile.best_streak||0);
  const[inp,setInp]=useState('');
  const[sub,setSub]=useState(false);
  const[isOk,setIsOk]=useState(false);
  const[shint,setShint]=useState(false);
  const[msg,setMsg]=useState('');
  const[anm,setAnm]=useState('');
  const[showStats,setShowStats]=useState(false);
  const[showCats,setShowCats]=useState(false);
  const[expl,setExpl]=useState('');
  const[explLoading,setExplLoading]=useState(false);
  const[soundOn,setSoundOnUi]=useState(()=>isSoundOn());
  const iRef=useRef(null);
  const fetchingRef=useRef(false);

  useEffect(()=>{lsSet('kq_pin',pin);},[pin]);
  useEffect(()=>{lsSet('kq_unlk',unlk);},[unlk]);
  useEffect(()=>{lsSet('kq_lv',lv);},[lv]);
  useEffect(()=>{lsSet('kq_xqs',xQs);},[xQs]);
  useEffect(()=>{lsSet('kq_xc',xC);},[xC]);
  useEffect(()=>{lsSet('kq_actc',actC);},[actC]);

  const allQ=[...Q,...xQs];
  const allC=[...new Set(allQ.map(q=>q.cat))];
  const act=actC||allC;
  const pool=allQ.filter(q=>act.includes(q.cat)&&q.d===lv);
  const q=pool.length>0&&que.length>0?que[qi%que.length]:null;
  const col=q?getCol(q.cat,xC):PAL[0];

  useEffect(()=>{if(pool.length>0){setQue(shuf(pool));setQi(0);rst();}},[lv,JSON.stringify(actC)]);
  useEffect(()=>{
    if(cor>=25&&!unlk.includes('hard')){const nu=['easy','medium','hard'];setUnlk(nu);setPopup('hard');playUnlock();saveProfile({correct:cor,best_streak:bst,unlocked:nu,level:lv});}
    else if(cor>=10&&!unlk.includes('medium')){const nu=['easy','medium'];setUnlk(nu);setPopup('medium');playUnlock();saveProfile({correct:cor,best_streak:bst,unlocked:nu,level:lv});}
  },[cor]);
  useEffect(()=>{if(sc==='quiz'&&!sub&&iRef.current)iRef.current.focus();},[qi,sub,sc]);

  function rst(){setInp('');setSub(false);setIsOk(false);setShint(false);setMsg('');setAnm('');setExpl('');setExplLoading(false);}
  function openMenu(){if(!pin)setPsc('setup');else setPsc('enter');}
  function toggleCat(c){const cur=actC||allC;if(cur.length===1&&cur[0]===c)return;setActC(cur.includes(c)?cur.filter(x=>x!==c):[...cur,c]);}

  function doSub(){
    if(sub||!inp.trim()||!q)return;
    const ok=chk(inp,q);setIsOk(ok);setTot(t=>t+1);
    if(ok){const nc=cor+1;setCor(nc);const ns=str+1;setStr(ns);const nb=Math.max(bst,ns);setBst(nb);setMsg(OKM[~~(Math.random()*OKM.length)]);setAnm('pop');saveProfile({correct:nc,best_streak:nb,unlocked:unlk,level:lv});ns>=3?playStreak():playCorrect();}
    else{setStr(0);setMsg(ERM[~~(Math.random()*ERM.length)]);setAnm('wiggle');playWrong();}
    setSub(true);setTimeout(()=>setAnm(''),600);
  }
  function toggleSoundUi(){setSoundOnUi(toggleSound());}

  async function fetchMore(){
    if(fetchingRef.current)return;
    fetchingRef.current=true;
    const cats=[...new Set(pool.map(q=>q.cat))];
    await Promise.all(cats.map(async cat=>{
      const existing=allQ.filter(q=>q.cat===cat).map(q=>q.q);
      try{
        const r=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({category:cat,existing})});
        if(!r.ok)return;
        const qs=await r.json();
        const deduped=qs.filter(nq=>!allQ.some(eq=>norm(eq.q)===norm(nq.q)));
        if(deduped.length>0)setXQs(p=>[...p,...deduped]);
      }catch{}
    }));
    fetchingRef.current=false;
  }

  function nxt(){const ni=qi+1;if(ni%pool.length===0){setQue(shuf(pool));fetchMore();}setQi(ni);rst();}
  function hk(e){if(e.key==='Enter')sub?nxt():doSub();}
  function saveProfile(updates){fetch('/api/profile/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:profile.id,...updates})}).catch(()=>{});}
  function doSkip(){if(sub||!q)return;setIsOk(false);setStr(0);setMsg("No worries! 👀");setSub(true);}
  function changeLv(v){setLv(v);saveProfile({correct:cor,best_streak:bst,unlocked:unlk,level:v});}

  async function doGen(){
    const name=nCat.trim();if(!name||gen)return;
    if(allC.map(c=>c.toLowerCase()).includes(name.toLowerCase())){setGErr('That category already exists!');return;}
    setGen(true);setGErr('');setGSt('');
    try{
      const r=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({category:name})});
      if(!r.ok)throw new Error();
      const qs=await r.json();
      setXQs(p=>[...p,...qs]);setXC(p=>[...p,name]);
      setActC(p=>p?[...p,name]:null);
      setNCat('');setGSt(`✅ Added "${name}" — ${qs.length} questions across all levels!`);
    }catch{setGErr('Something went wrong. Try again.');setGSt('');}
    setGen(false);
  }

  if(psc==='setup')return <PinPad title="Create a Parent PIN" sub="Kids won't be able to change settings" onOk={(c)=>{setPin(c);setPsc(null);setSc('menu');}}/>;
  if(psc==='enter')return <PinPad title="Parent Access" sub="Enter your PIN to manage categories" onOk={()=>{setPsc(null);setSc('menu');}} cPin={pin}/>;

  if(sc==='menu')return(
    <div style={{minHeight:"100vh",boxSizing:"border-box",background:"linear-gradient(135deg,#667eea,#764ba2)",fontFamily:"'Nunito',cursive",padding:16}}>
      <div style={{maxWidth:540,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <button onClick={()=>setSc('quiz')} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:12,padding:"7px 14px",color:"white",fontSize:19,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>← Back</button>
          <h2 style={{color:"white",margin:0,fontSize:23}}>⚙️ Quiz Categories</h2>
        </div>
        <div style={{background:"white",borderRadius:20,padding:15,marginBottom:13,boxShadow:"0 8px 32px rgba(0,0,0,.2)"}}>
          <p style={{color:"#bbb",fontSize:12,margin:"0 0 10px",fontWeight:700,letterSpacing:1}}>TAP TO TOGGLE ON / OFF</p>
          {allC.map(c=>{
            const cc=getCol(c,xC),on=act.includes(c);
            const ec=[["easy","🟢","#d4edda","#155724"],["medium","🟡","#fff3cd","#856404"],["hard","🔴","#f8d7da","#721c24"]].map(([d,em,bg,fg])=>({em,bg,fg,n:allQ.filter(q=>q.cat===c&&q.d===d).length}));
            return(
              <div key={c} onClick={()=>toggleCat(c)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 10px",borderRadius:13,marginBottom:5,cursor:"pointer",background:on?cc.lt:"#f7f7f7",border:`2px solid ${on?cc.bg:"#eee"}`,transition:"all .2s"}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:on?cc.bg:"#ccc",flexShrink:0}}/>
                <span style={{flex:1,fontWeight:700,color:on?"#333":"#bbb",fontSize:13,lineHeight:1.3}}>{c}</span>
                <div style={{display:"flex",gap:3}}>{ec.map(({em,bg,fg,n})=><span key={em} style={{background:bg,color:fg,borderRadius:5,padding:"2px 4px",fontSize:11,fontWeight:700}}>{em}{n}</span>)}</div>
                <div style={{width:32,height:17,borderRadius:9,background:on?cc.bg:"#ddd",position:"relative",flexShrink:0}}>
                  <div style={{position:"absolute",top:2,left:on?16:2,width:13,height:13,borderRadius:"50%",background:"white",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{background:"white",borderRadius:20,padding:15,marginBottom:13,boxShadow:"0 8px 32px rgba(0,0,0,.2)"}}>
          <h3 style={{margin:"0 0 3px",color:"#333",fontSize:17}}>✨ Add a New Category</h3>
          <p style={{color:"#aaa",fontSize:13,margin:"0 0 10px"}}>AI generates Easy, Medium & Hard questions automatically!</p>
          <div style={{display:"flex",gap:7,marginBottom:7}}>
            <input value={nCat} onChange={e=>{setNCat(e.target.value);setGErr('');}} onKeyDown={e=>e.key==='Enter'&&doGen()} placeholder="e.g. Solar System, US Presidents…" disabled={gen} style={{flex:1,border:"2.5px solid #7C83FD",borderRadius:11,padding:"9px 11px",fontSize:16,fontFamily:"inherit",outline:"none",color:"#333"}}/>
            <button onClick={doGen} disabled={!nCat.trim()||gen} style={{background:nCat.trim()&&!gen?"linear-gradient(135deg,#7C83FD,#764ba2)":"#ddd",color:"white",border:"none",borderRadius:11,padding:"0 13px",fontSize:16,cursor:nCat.trim()&&!gen?"pointer":"default",fontFamily:"inherit",fontWeight:700,whiteSpace:"nowrap"}}>{gen?"⏳":"Add ✨"}</button>
          </div>
          {gSt&&<p style={{color:gSt.startsWith("✅")?"#28a745":"#667eea",fontSize:14,margin:0,fontWeight:600}}>{gSt}</p>}
          {gErr&&<p style={{color:"#dc3545",fontSize:14,margin:0,fontWeight:600}}>{gErr}</p>}
        </div>
        <button onClick={onBack} style={{width:"100%",background:"rgba(255,255,255,.15)",border:"2px solid rgba(255,255,255,.3)",color:"white",borderRadius:14,padding:"12px 0",fontSize:15,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>🏠 Back to Hub</button>
      </div>
    </div>
  );

  if(!q)return(
    <div style={{minHeight:"100vh",boxSizing:"border-box",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#667eea,#764ba2)",color:"white",fontFamily:"'Nunito',cursive",textAlign:"center",padding:20}}>
      <div style={{fontSize:42,marginBottom:10}}>😅</div>
      <p style={{fontSize:20,margin:"0 0 5px",fontWeight:700}}>No {lv} questions active!</p>
      <p style={{fontSize:16,opacity:.8,margin:"0 0 16px"}}>Switch level or enable more categories.</p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",marginBottom:12}}>
        {LVS.filter(L=>unlk.includes(L.id)&&L.id!==lv).map(L=>(
          <button key={L.id} onClick={()=>changeLv(L.id)} style={{background:"white",color:L.col,border:"none",borderRadius:12,padding:"9px 16px",fontSize:16,cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}>{L.em} {L.lbl}</button>
        ))}
        <button onClick={openMenu} style={{background:"rgba(255,255,255,.15)",border:"2px solid white",color:"white",borderRadius:12,padding:"9px 16px",fontSize:16,cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}>⚙️ Categories</button>
      </div>
      <button onClick={onBack} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.3)",color:"white",borderRadius:12,padding:"9px 16px",fontSize:15,cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}>🏠 Hub</button>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",boxSizing:"border-box",background:"linear-gradient(135deg,#667eea,#764ba2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:12}}>
      <div style={{background:"white",borderRadius:28,padding:"11px 14px 16px",maxWidth:560,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,.3)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
          <button onClick={()=>setShowCats(true)} style={{background:col.bg,color:"white",borderRadius:20,padding:"3px 9px",fontSize:12,fontWeight:700,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",border:"none",cursor:"pointer",fontFamily:"inherit"}}>{q.cat} ▾</button>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            <span style={{background:"#f0f0f0",borderRadius:10,padding:"2px 6px",fontSize:12,fontWeight:700,color:"#555"}}>✅{cor}</span>
            <span style={{background:str>=3?"#fff3cd":"#f0f0f0",borderRadius:10,padding:"2px 6px",fontSize:12,fontWeight:700,color:str>=3?"#856404":"#555"}}>🔥{str}</span>
            <button onClick={()=>setShowStats(true)} title={`${profile.name}'s stats`} style={{width:28,height:28,borderRadius:"50%",background:PAL[avatarIdx%PAL.length].bg,border:"none",color:"white",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"}}>{profile.name[0].toUpperCase()}</button>
            <button onClick={toggleSoundUi} title="Toggle sound" style={{background:"#f0f0f0",border:"none",borderRadius:9,padding:"3px 7px",cursor:"pointer",fontSize:14,lineHeight:1,fontFamily:"inherit"}}>{soundOn?"🔊":"🔇"}</button>
            <button onClick={onBack} style={{background:"#f0f0f0",border:"none",borderRadius:9,padding:"3px 7px",cursor:"pointer",fontSize:14,lineHeight:1,fontFamily:"inherit",fontWeight:700,color:"#666"}}>🏠</button>
            <button onClick={openMenu} style={{background:"#f0f0f0",border:"none",borderRadius:9,padding:"3px 7px",cursor:"pointer",fontSize:16,lineHeight:1}}>☰</button>
          </div>
        </div>
        <div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:5}}>
          {LVS.map(L=>{
            const locked=!unlk.includes(L.id),sel=lv===L.id;
            return(
              <button key={L.id} onClick={()=>!locked&&changeLv(L.id)} style={{background:sel?L.col:locked?"#f5f5f5":"#f0f0f0",color:sel?"white":locked?"#ccc":"#777",border:`2px solid ${sel?L.col:locked?"#eee":"#ddd"}`,borderRadius:17,padding:"4px 11px",fontSize:13,fontWeight:700,cursor:locked?"not-allowed":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:2}}>
                {locked?"🔒":L.em} {L.lbl}{locked&&<span style={{fontSize:11}}>({L.at}✅)</span>}
              </button>
            );
          })}
        </div>
        {(()=>{const nx=LVS.find(L=>!unlk.includes(L.id));if(!nx)return null;const from=LVS[LVS.indexOf(nx)-1]?.at||0;const pct2=Math.min(100,Math.max(0,Math.round(((cor-from)/(nx.at-from))*100)));return(<div style={{marginBottom:5}}><div style={{fontSize:11,color:"#aaa",textAlign:"center",marginBottom:3}}>{nx.at-cor} more correct to unlock {nx.em} {nx.lbl}</div><div style={{height:5,background:"#f0f0f0",borderRadius:3,overflow:"hidden"}}><div style={{height:5,background:nx.col,borderRadius:3,width:`${pct2}%`,transition:"width .5s"}}/></div></div>)})()}
        <div style={{textAlign:"right",fontSize:12,color:"#ccc",marginBottom:5}}>Question #{tot+1}</div>
        <div style={{background:col.lt,border:`2px solid ${col.bg}33`,borderRadius:17,padding:"12px 12px",marginBottom:8,minHeight:50,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3}}>
          <p style={{color:"#333",fontSize:19,margin:0,textAlign:"center",lineHeight:1.7,fontWeight:600}}>{q.q}</p>
          {q.cat===CATS[0]&&<p style={{color:col.bg,fontSize:13,margin:0,fontWeight:700}}>Type both words — e.g. CAT BAT</p>}
        </div>
        {!sub&&(
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:14,marginBottom:6}}>
            {shint
              ?<span style={{color:"#aaa",fontSize:14,letterSpacing:2}}>{mkHint(q)}</span>
              :<button onClick={()=>setShint(true)} style={{background:"none",border:"none",color:col.bg,fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:700,textDecoration:"underline"}}>💡 Show hint</button>}
            {!shint&&<button onClick={doSkip} style={{background:"none",border:"none",color:"#bbb",fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:700,textDecoration:"underline"}}>🤷 I don't know</button>}
          </div>
        )}
        {!sub&&(
          <div style={{display:"flex",gap:7,marginBottom:6}}>
            <input ref={iRef} value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={hk} onFocus={()=>iRef.current?.scrollIntoView({behavior:"smooth",block:"center"})} placeholder="Type your answer…" style={{flex:1,border:`2.5px solid ${col.bg}`,borderRadius:13,padding:"11px 13px",fontSize:19,fontFamily:"inherit",outline:"none",color:"#333"}}/>
            <button onClick={doSub} disabled={!inp.trim()} style={{background:inp.trim()?`linear-gradient(135deg,${col.bg},#764ba2)`:"#ddd",color:"white",border:"none",borderRadius:13,padding:"0 15px",fontSize:22,cursor:inp.trim()?"pointer":"default",fontFamily:"inherit",fontWeight:700}}>✓</button>
          </div>
        )}
        {sub&&(
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:700,marginBottom:5,color:isOk?"#28a745":"#dc3545",animation:anm==="pop"?"pop .4s ease":anm==="wiggle"?"wiggle .45s ease":"none"}}>{msg}</div>
            {str>=3&&isOk&&<div style={{fontSize:14,color:"#e67e22",fontWeight:700,marginBottom:3}}>🔥 {str} in a row!</div>}
            {!isOk&&<div style={{marginBottom:7}}>
              <div style={{fontSize:16,color:"#666"}}>Answer: <strong style={{color:"#28a745"}}>{q.a[0]}</strong></div>
              {expl?<div style={{fontSize:13,color:"#888",marginTop:5,fontStyle:"italic",lineHeight:1.5}}>{expl}</div>
              :explLoading?<div style={{fontSize:13,color:"#aaa",marginTop:4}}>Thinking…</div>
              :<button onClick={async()=>{setExplLoading(true);try{const r=await fetch('/api/explain',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({q:q.q,a:q.a[0],cat:q.cat})});const d=await r.json();setExpl(d.explanation);}catch{setExpl("No explanation available.");}finally{setExplLoading(false);}}} style={{background:"none",border:"none",color:"#7C83FD",fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:700,textDecoration:"underline",marginTop:4,display:"block"}}>Why? 💡</button>}
            </div>}
            <button onClick={nxt} style={{background:`linear-gradient(135deg,${col.bg},#764ba2)`,color:"white",border:"none",borderRadius:16,padding:"11px 24px",fontSize:18,cursor:"pointer",fontFamily:"inherit",fontWeight:700,boxShadow:"0 4px 16px rgba(0,0,0,.18)"}}>Next Question →</button>
          </div>
        )}
      </div>
      {showStats&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}}>
          <div style={{background:"white",borderRadius:28,padding:"26px 22px",maxWidth:320,width:"100%",textAlign:"center",boxShadow:"0 24px 64px rgba(0,0,0,.4)"}}>
            <div style={{width:68,height:68,borderRadius:"50%",background:PAL[avatarIdx%PAL.length].bg,color:"white",fontSize:32,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px"}}>{profile.name[0].toUpperCase()}</div>
            <h2 style={{margin:"0 0 2px",fontSize:22,color:"#333"}}>{profile.name}</h2>
            <p style={{color:"#bbb",fontSize:13,margin:"0 0 16px"}}>PIN: {profile.pin}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <div style={{background:"#f8f8f8",borderRadius:14,padding:"12px 8px"}}><div style={{fontSize:26,fontWeight:800,color:"#333"}}>{cor}</div><div style={{fontSize:11,color:"#aaa",fontWeight:700}}>CORRECT</div></div>
              <div style={{background:"#f8f8f8",borderRadius:14,padding:"12px 8px"}}><div style={{fontSize:26,fontWeight:800,color:"#333"}}>{bst}</div><div style={{fontSize:11,color:"#aaa",fontWeight:700}}>BEST STREAK</div></div>
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:7,marginBottom:18}}>
              {LVS.map(L=><span key={L.id} style={{background:unlk.includes(L.id)?L.col+"22":"#f5f5f5",color:unlk.includes(L.id)?L.col:"#ccc",borderRadius:10,padding:"4px 10px",fontSize:12,fontWeight:700}}>{unlk.includes(L.id)?L.em:"🔒"} {L.lbl}</span>)}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowStats(false)} style={{flex:1,background:"#f0f0f0",color:"#666",border:"none",borderRadius:13,padding:"11px 0",fontSize:15,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Close</button>
              <button onClick={()=>{setShowStats(false);onSwitchPlayer();}} style={{flex:1,background:"linear-gradient(135deg,#7C83FD,#764ba2)",color:"white",border:"none",borderRadius:13,padding:"11px 0",fontSize:15,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Switch Player</button>
            </div>
          </div>
        </div>
      )}
      {showCats&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}} onClick={()=>setShowCats(false)}>
          <div style={{background:"white",borderRadius:"24px 24px 0 0",padding:"16px 16px 32px",width:"100%",maxWidth:560,boxShadow:"0 -8px 40px rgba(0,0,0,.3)"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,borderRadius:2,background:"#e0e0e0",margin:"0 auto 14px"}}/>
            <h3 style={{margin:"0 0 12px",color:"#333",fontSize:16,textAlign:"center",fontWeight:800}}>Pick Categories</h3>
            <div style={{display:"flex",flexWrap:"wrap",gap:7,justifyContent:"center",marginBottom:16}}>
              {allC.map(c=>{const cc=getCol(c,xC),on=(actC||allC).includes(c);return(
                <button key={c} onClick={()=>toggleCat(c)} style={{background:on?cc.bg:"#f0f0f0",color:on?"white":"#999",border:"none",borderRadius:20,padding:"6px 13px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{c}</button>
              );})}
            </div>
            <button onClick={()=>setShowCats(false)} style={{width:"100%",background:"linear-gradient(135deg,#7C83FD,#764ba2)",color:"white",border:"none",borderRadius:13,padding:"12px 0",fontSize:16,cursor:"pointer",fontFamily:"inherit",fontWeight:800}}>Done ✓</button>
          </div>
        </div>
      )}
      {popup&&<UnlockModal lv={popup} onClose={(sw)=>{if(sw)changeLv(popup);setPopup(null);}}/>}
    </div>
  );
}
