import {useState} from 'react';

export default function PinPad({title,sub,onOk,cPin=null}){
  const[digs,setDigs]=useState([]);
  const[phase,setPhase]=useState("e");
  const[first,setFirst]=useState(null);
  const[shk,setShk]=useState(false);
  const[err,setErr]=useState("");
  function press(d){
    if(digs.length>=4)return;
    const n=[...digs,d];setDigs(n);setErr("");
    if(n.length===4)setTimeout(()=>go(n),120);
  }
  function go(en){
    const c=en.join("");
    if(cPin!=null){
      if(c===cPin)onOk();
      else{setErr("Wrong PIN.");setShk(true);setTimeout(()=>{setShk(false);setDigs([]);},600);}
    }else{
      if(phase==="e"){setFirst(c);setPhase("c");setDigs([]);}
      else if(c===first)onOk(c);
      else{setErr("Didn't match. Try again.");setShk(true);setTimeout(()=>{setShk(false);setDigs([]);setPhase("e");setFirst(null);},600);}
    }
  }
  const lbl=cPin?title:phase==="e"?title:"Confirm your PIN";
  const sb=cPin?sub:phase==="e"?sub:"Enter the same PIN again";
  return(
    <div style={{minHeight:"100vh",boxSizing:"border-box",background:"linear-gradient(135deg,#667eea,#764ba2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:20}}>
      <div style={{background:"white",borderRadius:28,padding:"34px 26px",maxWidth:300,width:"100%",textAlign:"center",boxShadow:"0 24px 64px rgba(0,0,0,.3)"}}>
        <div style={{fontSize:42,marginBottom:8}}>🔐</div>
        <h2 style={{color:"#333",margin:"0 0 4px",fontSize:23}}>{lbl}</h2>
        <p style={{color:"#aaa",fontSize:14,margin:"0 0 20px"}}>{sb}</p>
        <div style={{display:"flex",justifyContent:"center",gap:13,marginBottom:20,animation:shk?"shake .5s":"none"}}>
          {[0,1,2,3].map(i=><div key={i} style={{width:15,height:15,borderRadius:"50%",border:"2.5px solid #7C83FD",background:digs[i]!=null?"#7C83FD":"transparent",transition:"background .15s"}}/>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
          {[1,2,3,4,5,6,7,8,9].map(n=>(
            <button key={n} onClick={()=>press(String(n))} style={{background:"#f4f4f4",border:"none",borderRadius:13,padding:"14px 0",fontSize:24,fontWeight:700,color:"#333",cursor:"pointer",fontFamily:"inherit"}}>{n}</button>
          ))}
          <div/>
          <button onClick={()=>press("0")} style={{background:"#f4f4f4",border:"none",borderRadius:13,padding:"14px 0",fontSize:24,fontWeight:700,color:"#333",cursor:"pointer",fontFamily:"inherit"}}>0</button>
          <button onClick={()=>setDigs(d=>d.slice(0,-1))} style={{background:"#f4f4f4",border:"none",borderRadius:13,padding:"14px 0",fontSize:19,cursor:"pointer",fontFamily:"inherit"}}>⌫</button>
        </div>
        {err&&<p style={{color:"#dc3545",fontSize:14,margin:0,fontWeight:600}}>{err}</p>}
      </div>
    </div>
  );
}
