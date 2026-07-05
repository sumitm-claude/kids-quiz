export default function MathTables({onBack}){
  return(
    <div style={{minHeight:"100vh",boxSizing:"border-box",background:"linear-gradient(135deg,#34D399,#059669)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',cursive",padding:20,textAlign:"center"}}>
      <div style={{fontSize:64,marginBottom:16}}>✖️</div>
      <h1 style={{color:"white",fontSize:32,margin:"0 0 10px",fontWeight:800}}>Math Tables</h1>
      <p style={{color:"rgba(255,255,255,.8)",fontSize:18,margin:"0 0 8px"}}>Tables 1–15. Blitz, Missing, Gauntlet.</p>
      <p style={{color:"rgba(255,255,255,.6)",fontSize:15,margin:"0 0 32px"}}>Coming soon…</p>
      <button onClick={onBack} style={{background:"white",color:"#059669",border:"none",borderRadius:16,padding:"13px 32px",fontSize:18,cursor:"pointer",fontFamily:"inherit",fontWeight:800}}>← Back to Hub</button>
    </div>
  );
}
