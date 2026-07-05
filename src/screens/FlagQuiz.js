export default function FlagQuiz({onBack}){
  return(
    <div style={{minHeight:"100vh",boxSizing:"border-box",background:"linear-gradient(135deg,#F87171,#ef4444)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:20,textAlign:"center"}}>
      <div style={{fontSize:64,marginBottom:16}}>🌍</div>
      <h1 style={{color:"white",fontSize:32,margin:"0 0 10px",fontWeight:800}}>Flag Quiz</h1>
      <p style={{color:"rgba(255,255,255,.8)",fontSize:18,margin:"0 0 8px"}}>195 countries. Type the name.</p>
      <p style={{color:"rgba(255,255,255,.6)",fontSize:15,margin:"0 0 32px"}}>Coming soon…</p>
      <button onClick={onBack} style={{background:"white",color:"#ef4444",border:"none",borderRadius:16,padding:"13px 32px",fontSize:18,cursor:"pointer",fontFamily:"inherit",fontWeight:800}}>← Back to Hub</button>
    </div>
  );
}
