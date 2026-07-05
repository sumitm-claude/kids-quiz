import {useState} from 'react';
import {PAL,ls,lsSet} from '../data/quizData';

export default function WhoScreen({onLogin}){
  const[sc,setSc]=useState('who');
  const[recents,setRecents]=useState(()=>ls('kq_recents',[]));
  const[newName,setNewName]=useState('');
  const[newAvatarIdx,setNewAvatarIdx]=useState(0);
  const[loginDigs,setLoginDigs]=useState([]);
  const[loginErr,setLoginErr]=useState('');
  const[profileLoading,setProfileLoading]=useState(false);
  const[newPin,setNewPin]=useState(null);
  const[pendingProfile,setPendingProfile]=useState(null);
  const[pendingAvatar,setPendingAvatar]=useState(0);

  function doLogin(p,av){
    const avMap=ls('kq_avmap',{});
    lsSet('kq_avmap',{...avMap,[p.pin]:av});
    const u=[{name:p.name,pin:p.pin},...recents.filter(r=>r.pin!==p.pin)].slice(0,4);
    setRecents(u);lsSet('kq_recents',u);
    onLogin(p,av);
  }

  async function fetchProfile(pin){
    setProfileLoading(true);setLoginErr('');
    try{
      const r=await fetch('/api/profile/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pin})});
      if(!r.ok){setLoginErr('PIN not found. Try again.');setLoginDigs([]);return;}
      const p=await r.json();
      const avMap=ls('kq_avmap',{});
      doLogin(p,avMap[p.pin]||0);
    }catch{setLoginErr('Connection error. Try again.');setLoginDigs([]);}
    finally{setProfileLoading(false);}
  }

  function pressLoginDig(n){
    if(loginDigs.length>=4||profileLoading)return;
    const nd=[...loginDigs,String(n)];setLoginDigs(nd);
    if(nd.length===4)fetchProfile(nd.join(''));
  }

  async function doCreate(){
    if(!newName.trim()||profileLoading)return;
    setProfileLoading(true);
    try{
      const r=await fetch('/api/profile/create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:newName.trim()})});
      const p=await r.json();
      const avMap=ls('kq_avmap',{});
      lsSet('kq_avmap',{...avMap,[p.pin]:newAvatarIdx});
      setPendingProfile(p);setPendingAvatar(newAvatarIdx);setNewPin(p.pin);
    }catch{}finally{setProfileLoading(false);}
  }

  if(newPin)return(
    <div style={{minHeight:"100vh",boxSizing:"border-box",background:"linear-gradient(135deg,#667eea,#764ba2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:20}}>
      <div style={{background:"white",borderRadius:28,padding:"34px 24px",maxWidth:340,width:"100%",textAlign:"center",boxShadow:"0 24px 64px rgba(0,0,0,.3)"}}>
        <div style={{fontSize:52,marginBottom:8}}>🎉</div>
        <h2 style={{color:"#333",margin:"0 0 6px",fontSize:24}}>Hi {pendingProfile?.name}!</h2>
        <p style={{color:"#666",fontSize:15,margin:"0 0 16px"}}>Your secret PIN is — write it down!</p>
        <div style={{background:"#f0f2ff",borderRadius:16,padding:"18px 0",fontSize:44,fontWeight:800,letterSpacing:10,color:"#7C83FD",marginBottom:16}}>{newPin}</div>
        <p style={{color:"#aaa",fontSize:13,margin:"0 0 20px"}}>You'll need this to play on a different device.</p>
        <button onClick={()=>{setNewPin(null);doLogin(pendingProfile,pendingAvatar);}} style={{background:"linear-gradient(135deg,#7C83FD,#764ba2)",color:"white",border:"none",borderRadius:14,padding:"13px 28px",fontSize:18,cursor:"pointer",fontFamily:"inherit",fontWeight:800,width:"100%"}}>Let's play! →</button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",boxSizing:"border-box",background:"linear-gradient(135deg,#667eea,#764ba2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:20}}>
      <div style={{maxWidth:400,width:"100%",textAlign:"center"}}>
        {sc==='pinlogin'?(
          <>
            <div style={{fontSize:44,marginBottom:8}}>🔑</div>
            <h2 style={{color:"white",fontSize:26,margin:"0 0 4px"}}>Enter your PIN</h2>
            <p style={{color:"rgba(255,255,255,.7)",fontSize:15,margin:"0 0 20px"}}>Your 4-digit PIN</p>
            <div style={{background:"white",borderRadius:24,padding:"24px 20px",boxShadow:"0 24px 64px rgba(0,0,0,.3)"}}>
              <div style={{display:"flex",justifyContent:"center",gap:13,marginBottom:20}}>
                {[0,1,2,3].map(i=><div key={i} style={{width:15,height:15,borderRadius:"50%",border:"2.5px solid #7C83FD",background:loginDigs[i]!=null?"#7C83FD":"transparent",transition:"background .15s"}}/>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                {[1,2,3,4,5,6,7,8,9].map(n=><button key={n} onClick={()=>pressLoginDig(n)} disabled={profileLoading} style={{background:"#f4f4f4",border:"none",borderRadius:13,padding:"14px 0",fontSize:24,fontWeight:700,color:"#333",cursor:"pointer",fontFamily:"inherit"}}>{n}</button>)}
                <div/>
                <button onClick={()=>pressLoginDig(0)} disabled={profileLoading} style={{background:"#f4f4f4",border:"none",borderRadius:13,padding:"14px 0",fontSize:24,fontWeight:700,color:"#333",cursor:"pointer",fontFamily:"inherit"}}>0</button>
                <button onClick={()=>setLoginDigs(d=>d.slice(0,-1))} style={{background:"#f4f4f4",border:"none",borderRadius:13,padding:"14px 0",fontSize:19,cursor:"pointer",fontFamily:"inherit"}}>⌫</button>
              </div>
              {loginErr&&<p style={{color:"#dc3545",fontSize:14,margin:"0 0 6px",fontWeight:600}}>{loginErr}</p>}
              {profileLoading&&<p style={{color:"#7C83FD",fontSize:14,margin:0}}>Loading…</p>}
            </div>
            <button onClick={()=>{setSc('who');setLoginDigs([]);setLoginErr('');}} style={{marginTop:14,background:"rgba(255,255,255,.2)",border:"none",color:"white",borderRadius:12,padding:"10px 20px",fontSize:15,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>← Back</button>
          </>
        ):sc==='newq'?(
          <>
            <div style={{fontSize:44,marginBottom:8}}>✨</div>
            <h2 style={{color:"white",fontSize:26,margin:"0 0 4px"}}>New Quizzer</h2>
            <p style={{color:"rgba(255,255,255,.7)",fontSize:15,margin:"0 0 20px"}}>What's your name?</p>
            <div style={{background:"white",borderRadius:24,padding:"24px 20px",boxShadow:"0 24px 64px rgba(0,0,0,.3)"}}>
              <input autoFocus value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doCreate()} placeholder="Your name…" style={{width:"100%",border:"2.5px solid #7C83FD",borderRadius:11,padding:"11px 13px",fontSize:20,fontFamily:"inherit",outline:"none",color:"#333",marginBottom:14}}/>
              <p style={{fontSize:12,color:"#bbb",fontWeight:700,margin:"0 0 8px",textAlign:"center",letterSpacing:.5}}>PICK YOUR COLOUR</p>
              <div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap",marginBottom:14}}>
                {PAL.slice(0,8).map((p,i)=>(
                  <button key={i} onClick={()=>setNewAvatarIdx(i)} style={{width:38,height:38,borderRadius:"50%",background:p.bg,border:newAvatarIdx===i?"3px solid #333":"3px solid transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:16,fontWeight:800,transition:"transform .1s",transform:newAvatarIdx===i?"scale(1.15)":"scale(1)"}}>{newAvatarIdx===i?"✓":""}</button>
                ))}
              </div>
              <button onClick={doCreate} disabled={!newName.trim()||profileLoading} style={{width:"100%",background:newName.trim()&&!profileLoading?"linear-gradient(135deg,#7C83FD,#764ba2)":"#ddd",color:"white",border:"none",borderRadius:13,padding:"13px 0",fontSize:18,cursor:newName.trim()&&!profileLoading?"pointer":"default",fontFamily:"inherit",fontWeight:800}}>{profileLoading?"Creating…":"Start! →"}</button>
            </div>
            <button onClick={()=>{setSc('who');setNewName('');}} style={{marginTop:14,background:"rgba(255,255,255,.2)",border:"none",color:"white",borderRadius:12,padding:"10px 20px",fontSize:15,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>← Back</button>
          </>
        ):(
          <>
            <div style={{fontSize:52,marginBottom:8}}>👋</div>
            <h2 style={{color:"white",fontSize:28,margin:"0 0 4px"}}>Who's playing?</h2>
            <p style={{color:"rgba(255,255,255,.7)",fontSize:16,margin:"0 0 22px"}}>Tap your name to start</p>
            {recents.length>0&&(
              <div style={{display:"grid",gridTemplateColumns:recents.length===1?"1fr":"1fr 1fr",gap:10,marginBottom:14}}>
                {recents.map((r,i)=>(
                  <button key={r.pin} onClick={()=>fetchProfile(r.pin)} disabled={profileLoading} style={{background:"white",border:"none",borderRadius:20,padding:"20px 12px",cursor:"pointer",fontFamily:"inherit",textAlign:"center",boxShadow:"0 8px 24px rgba(0,0,0,.15)",opacity:profileLoading?.6:1}}>
                    <div style={{width:52,height:52,borderRadius:"50%",background:PAL[i%PAL.length].bg,color:"white",fontSize:26,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px"}}>{r.name[0].toUpperCase()}</div>
                    <div style={{fontWeight:800,color:"#333",fontSize:16}}>{r.name}</div>
                  </button>
                ))}
              </div>
            )}
            {profileLoading&&<p style={{color:"white",marginBottom:10}}>Loading…</p>}
            {loginErr&&<p style={{color:"#ffcccc",fontWeight:700,marginBottom:10}}>{loginErr}</p>}
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              <button onClick={()=>{setSc('newq');setNewName('');setLoginErr('');}} style={{background:"white",color:"#7C83FD",border:"none",borderRadius:14,padding:"14px 0",fontSize:18,cursor:"pointer",fontFamily:"inherit",fontWeight:800}}>✨ New Quizzer</button>
              <button onClick={()=>{setSc('pinlogin');setLoginDigs([]);setLoginErr('');}} style={{background:"rgba(255,255,255,.15)",color:"white",border:"2px solid rgba(255,255,255,.4)",borderRadius:14,padding:"12px 0",fontSize:15,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>📱 Enter PIN (new device)</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
