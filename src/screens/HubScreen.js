import {PAL} from '../data/quizData';

const APPS=[
  {id:'quiz', name:'Quiz',      em:'🧠', col:'#818CF8', desc:'Trivia across 13+ categories'},
  {id:'flags',name:'Flag Quiz', em:'🌍', col:'#F87171', desc:'195 countries — type the name'},
  {id:'math', name:'Math Tables',em:'✖️', col:'#34D399', desc:'Tables 1–15, three game modes'},
];

export default function HubScreen({profile,avatarIdx,onPickApp,onSwitchPlayer}){
  return(
    <div style={{minHeight:"100vh",boxSizing:"border-box",background:"linear-gradient(135deg,#667eea,#764ba2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:20}}>
      <div style={{maxWidth:440,width:"100%"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28,background:"rgba(255,255,255,.12)",borderRadius:20,padding:"14px 16px"}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:PAL[avatarIdx%PAL.length].bg,color:"white",fontSize:24,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{profile.name[0].toUpperCase()}</div>
          <div style={{flex:1}}>
            <div style={{color:"white",fontWeight:800,fontSize:20}}>Hi, {profile.name}!</div>
            <div style={{color:"rgba(255,255,255,.65)",fontSize:13}}>Choose an app to play</div>
          </div>
          <button onClick={onSwitchPlayer} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",color:"white",borderRadius:10,padding:"6px 12px",fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Switch</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {APPS.map(app=>(
            <button key={app.id} onClick={()=>onPickApp(app.id)}
              style={{background:"white",border:"none",borderRadius:22,padding:"18px 20px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",boxShadow:"0 8px 32px rgba(0,0,0,.18)",display:"flex",alignItems:"center",gap:16}}
              onMouseDown={e=>e.currentTarget.style.transform="scale(.97)"}
              onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
              onTouchStart={e=>e.currentTarget.style.transform="scale(.97)"}
              onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}
            >
              <div style={{width:58,height:58,borderRadius:16,background:`${app.col}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0,border:`2px solid ${app.col}33`}}>{app.em}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:19,color:"#222",marginBottom:3}}>{app.name}</div>
                <div style={{fontSize:13,color:"#999"}}>{app.desc}</div>
              </div>
              <div style={{fontSize:22,color:app.col,fontWeight:800}}>›</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
