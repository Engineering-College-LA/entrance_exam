function Landing({ onStart }) {
  return (
    <div style={{ background:COLORS.navy, minHeight:"calc(100vh - 60px)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, opacity:0.04, backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:-200, right:-200, width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(21,101,192,.25) 0%,transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"relative", zIndex:1, maxWidth:1000, margin:"0 auto", padding:"80px 32px 60px", display:"grid", gridTemplateColumns:"1fr 360px", gap:60, alignItems:"center" }}>
        <div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, fontFamily:"monospace", fontSize:11, color:COLORS.accent, letterSpacing:2, textTransform:"uppercase", background:"rgba(232,160,32,.1)", border:"1px solid rgba(232,160,32,.3)", padding:"5px 14px", borderRadius:2, marginBottom:24 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:COLORS.accent, display:"inline-block" }} />Admissions 2026 — Now Open
          </div>
          <h1 style={{ fontWeight:800, fontSize:48, lineHeight:1.05, color:COLORS.white, marginBottom:18 }}>Mathematics<br/><span style={{ color:COLORS.accent }}>Entrance Exam</span></h1>
          <p style={{ fontSize:16, color:"#8fa3c0", lineHeight:1.7, maxWidth:420, marginBottom:40 }}>Demonstrate your mathematical aptitude for admission to E|C Engineering College. 20 multiple-choice questions, 60 minutes.</p>
          <div style={{ display:"flex", gap:32, marginBottom:48 }}>
            {[["20","Questions"],["60","Minutes"],["1×","Attempt"]].map(([n,l])=>(
              <div key={l} style={{ borderLeft:`3px solid ${COLORS.blue}`, paddingLeft:14 }}>
                <div style={{ fontWeight:800, fontSize:26, color:COLORS.white }}>{n}</div>
                <div style={{ fontSize:12, color:"#6a85a8", marginTop:2 }}>{l}</div>
              </div>))}
          </div>
          <button onClick={onStart} style={{ display:"inline-flex", alignItems:"center", gap:12, background:COLORS.accent, color:COLORS.navy, fontWeight:800, fontSize:15, padding:"15px 36px", borderRadius:3, border:"none", cursor:"pointer", boxShadow:"0 8px 32px rgba(232,160,32,.35)", letterSpacing:0.3 }}>Take the Exam <span style={{ fontSize:18 }}>→</span></button>
        </div>
        <div style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:8, padding:28, backdropFilter:"blur(10px)" }}>
          <div style={{ fontWeight:700, fontSize:15, color:COLORS.white, marginBottom:18, display:"flex", alignItems:"center", gap:8 }}><span style={{ color:COLORS.accent, fontSize:18 }}>∑</span> Math Entrance Exam</div>
          {[["Subject","Mathematics"],["Format","Multiple Choice"],["Questions","20 questions"],["Time Limit","60 minutes"],["Attempts","ONE ATTEMPT"],["Results","Instant Report"]].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"11px 0", borderBottom:"1px solid rgba(255,255,255,.07)", fontSize:13 }}>
              <span style={{ color:"#8fa3c0" }}>{k}</span>
              <span style={{ color:COLORS.white, fontWeight:600 }}>{k==="Attempts"?<span style={{ background:"rgba(21,101,192,.3)", color:"#7fb3ff", fontFamily:"monospace", fontSize:11, padding:"2px 8px", borderRadius:2 }}>{v}</span>:v}</span>
            </div>))}
        </div>
      </div>
    </div>
  );
}
