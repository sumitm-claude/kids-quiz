import {LVS} from '../data/quizData';

export default function UnlockModal({lv,onClose}){
  const L=LVS.find(l=>l.id===lv);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}}>
      <div style={{background:"white",borderRadius:28,padding:"34px 22px",maxWidth:320,width:"100%",textAlign:"center",boxShadow:"0 24px 64px rgba(0,0,0,.4)"}}>
        <div style={{fontSize:68,marginBottom:8}}>{lv==="hard"?"🔥":"⭐"}</div>
        <h2 style={{color:"#333",fontSize:28,margin:"0 0 8px"}}>{L.lbl} Mode Unlocked!</h2>
        <p style={{color:"#555",fontSize:18,margin:"0 0 4px"}}>You answered <strong style={{color:L.col}}>{L.at} questions</strong> correctly!</p>
        <p style={{color:"#aaa",fontSize:16,margin:"0 0 22px"}}>{lv==="hard"?"Ready for the toughest challenges!":"Ready for something harder?"}</p>
        <div style={{display:"flex",gap:8,justifyContent:"center"}}>
          <button onClick={()=>onClose(false)} style={{background:"#f0f0f0",color:"#666",border:"none",borderRadius:13,padding:"10px 15px",fontSize:16,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Stay here</button>
          <button onClick={()=>onClose(true)} style={{background:`linear-gradient(135deg,${L.col},#764ba2)`,color:"white",border:"none",borderRadius:13,padding:"10px 15px",fontSize:16,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Try {L.em} {L.lbl}! →</button>
        </div>
      </div>
    </div>
  );
}
