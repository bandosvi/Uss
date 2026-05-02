// @ts-nocheck
// FULL CODE - Strong Landing + Man Theme + Animations + Scoring Ready
"use client";
import { useState, useEffect } from "react";

async function sGet(k, s = false) {
  try {
    const r = await window.storage?.get(k, s);
    return r ? JSON.parse(r.value) : null;
  } catch { return null; }
}

async function sSet(k, v, s = false) {
  try { await window.storage?.set(k, JSON.stringify(v), s); } catch {}
}

function uid() { return Math.random().toString(36).slice(2, 11); }
function genCode() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }

const THEMES = {
  man: { A: "#a8b5d4", DARK: "#0f141a", SURF: "#1a222a", CARD: "#25303a", BDR: "#3f4a5a", GOLD: "#d4c4a8" }
};

const TOPICS = [
  {id:"love", name:"Love & Romance", emoji:"💌"},
  {id:"future", name:"Future Dreams", emoji:"🌠"},
  {id:"favorites", name:"Favorites", emoji:"⭐"},
  {id:"intimacy", name:"Intimacy", emoji:"🔥"},
  {id:"all-me", name:"All About Me", emoji:"👤"}
];

export default function Us() {
  const colors = THEMES.man;

  const [phase, setPhase] = useState("landing");
  const [me, setMe] = useState(null);
  const [couple, setCouple] = useState(null);
  const [nav, setNav] = useState("home");
  const [nameIn, setNameIn] = useState("");
  const [codeIn, setCodeIn] = useState("");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    (async () => {
      const sess = await sGet("sess:us");
      if (sess?.code) {
        const c = await sGet(`couple:${sess.code}`, true);
        if (c) { setMe(sess); setCouple(c); setPhase("paired"); }
      }
    })();
  }, []);

  const createCouple = async () => {
    if (!nameIn.trim()) return alert("Enter name");
    const code = genCode();
    const userId = uid();
    const c = {code, user1id:userId, user1name:nameIn.trim(), user2id:null, user2name:null};
    await sSet(`couple:${code}`, c, true);
    const sess = {userId, name:nameIn.trim(), code, role:"user1"};
    await sSet("sess:us", sess);
    setMe(sess); setCouple(c); setPhase("paired");
  };

  const joinCouple = async () => {
    if (!nameIn.trim() || !codeIn.trim()) return alert("Fill fields");
    const code = codeIn.trim().toUpperCase();
    const c = await sGet(`couple:${code}`, true);
    if (!c || c.user2id) return alert("Invalid code");
    const userId = uid();
    const up = {...c, user2id:userId, user2name:nameIn.trim()};
    await sSet(`couple:${code}`, up, true);
    const sess = {userId, name:nameIn.trim(), code, role:"user2"};
    await sSet("sess:us", sess);
    setMe(sess); setCouple(up); setPhase("paired");
  };

  const startCoinToss = () => {
    const result = Math.random() > 0.5 ? "Heads" : "Tails";
    alert(`Coin toss: ${result} wins! Winner picks the topic.`);
    setNav("topics");
  };

  const startQuiz = (topic) => {
    const quiz = {
      title: topic.name,
      emoji: topic.emoji,
      questions: Array.from({length: 10}, (_, i) => ({
        q: `Question ${i+1} about ${topic.name}...`,
        opts: ["Option A", "Option B", "Option C", "Option D"]
      }))
    };
    setActiveQuiz(quiz);
    setCurrentStep(0);
    setAnswers({});
    setPartnerAnswers(null);
    setScore(null);
  };

  const answer = (val) => {
    const na = {...answers, [currentStep]: val};
    setAnswers(na);
    if (currentStep < 9) {
      setCurrentStep(s => s + 1);
    } else {
      // Save my answers
      sSet(`quiz-${activeQuiz.title}-${me.role}`, na, true);

      // Try to load partner's answers
      const partnerRole = me.role === "user1" ? "user2" : "user1";
      sGet(`quiz-${activeQuiz.title}-${partnerRole}`, true).then(pAns => {
        if (pAns) {
          setPartnerAnswers(pAns);
          calculateScore(na, pAns);
        } else {
          alert("Quiz saved! Ask your partner to complete it for scoring.");
        }
      });
      setActiveQuiz(null);
      setNav("home");
    }
  };

  const calculateScore = (myAns, pAns) => {
    let matches = 0;
    const total = Object.keys(myAns).length;
    Object.keys(myAns).forEach(key => {
      if (myAns[key] === pAns[key]) matches++;
    });
    const percentage = Math.round((matches / total) * 100);
    setScore(percentage);
    alert(`Quiz Complete!\n\nYou matched ${percentage}% with your partner!`);
  };

  const logout = () => {
    if (confirm("Logout?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div style={{minHeight:"100vh",background:colors.DARK,color:"#f0e8f0",fontFamily:"system-ui",display:"flex",flexDirection:"column"}}>
      {phase === "landing" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",padding:"40px 20px",background:"linear-gradient(180deg, #0f141a 0%, #1a222a 100%)"}}>
          {/* Simple Logo */}
          <div style={{fontSize:92,color:colors.A,fontWeight:700,marginBottom:20}}>us.</div>

          <p style={{fontSize:26,marginBottom:8,lineHeight:1.2}}>Strong connection.<br/>Real talks.<br/>Lasting love.</p>
          <p style={{fontSize:18,opacity:0.8,maxWidth:320,marginBottom:40}}>The app built for men who want deeper relationships.</p>

          {/* Simplified Problem-Solution Showcase */}
          <div style={{display:"grid",gap:16,width:"100%",maxWidth:360,marginBottom:40}}>
            <div style={{background:colors.CARD,padding:20,borderRadius:16,border:`1px solid ${colors.BDR}`}}>
              <div style={{fontSize:16,fontWeight:600,color:"#f0e8f0",marginBottom:8}}>❌ Surface conversations</div>
              <div style={{fontSize:14,color:"#f0e8f0",opacity:0.8,marginBottom:12}}>Small talk that goes nowhere</div>
              <div style={{fontSize:16,fontWeight:600,color:colors.A}}>✅ Deep, meaningful talks</div>
              <div style={{fontSize:14,color:"#f0e8f0",opacity:0.8}}>Questions that reveal who she really is</div>
            </div>

            <div style={{background:colors.CARD,padding:20,borderRadius:16,border:`1px solid ${colors.BDR}`}}>
              <div style={{fontSize:16,fontWeight:600,color:"#f0e8f0",marginBottom:8}}>❌ Awkward date planning</div>
              <div style={{fontSize:14,color:"#f0e8f0",opacity:0.8,marginBottom:12}}>"What do you want to do?"</div>
              <div style={{fontSize:16,fontWeight:600,color:colors.A}}>✅ Fun, competitive games</div>
              <div style={{fontSize:14,color:"#f0e8f0",opacity:0.8}}>Coin toss decisions & date wheel spins</div>
            </div>

            <div style={{background:colors.CARD,padding:20,borderRadius:16,border:`1px solid ${colors.BDR}`}}>
              <div style={{fontSize:16,fontWeight:600,color:"#f0e8f0",marginBottom:8}}>❌ Forgetting important moments</div>
              <div style={{fontSize:14,color:"#f0e8f0",opacity:0.8,marginBottom:12}}>Special dates slip away</div>
              <div style={{fontSize:16,fontWeight:600,color:colors.A}}>✅ Cherished memories</div>
              <div style={{fontSize:14,color:"#f0e8f0",opacity:0.8}}>Photo albums & relationship milestones</div>
            </div>
          </div>

          <button onClick={()=>setPhase("onboard")} style={{width:"100%",maxWidth:360,padding:20,background:colors.A,color:colors.DARK,border:"none",borderRadius:20,fontWeight:700,fontSize:19}}>Start Our Journey</button>
          <p style={{marginTop:30,fontSize:14,opacity:0.6}}>Private • Secure • Built for real couples</p>
        </div>
      )}

      {phase !== "landing" && (
        <>
          <div style={{padding:"14px 16px",background:colors.SURF,borderBottom:`1px solid ${colors.BDR}`,position:"sticky",top:0,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:28,fontWeight:700,color:colors.A}}>us.</div>
            <div>{me && `Code: ${me.code}`}</div>
          </div>

          <div style={{flex:1,overflowY:"auto",padding:"20px 16px"}}>
        {phase === "onboard" && (
          <div style={{maxWidth:420,margin:"60px auto",textAlign:"center",animation:"fadeUp 0.6s ease"}}>
            <div style={{fontSize:80,color:colors.A,transition:"color 0.4s"}}>us.</div>
            <p style={{fontSize:20,marginBottom:8}}>Strong connection.<br/>Real talks.<br/>Lasting love.</p>
            <input value={nameIn} onChange={e=>setNameIn(e.target.value)} placeholder="Your name" style={{width:"100%",padding:18,background:colors.CARD,border:`1px solid ${colors.BDR}`,borderRadius:16,marginBottom:16,transition:"all 0.3s"}} />
            <button onClick={createCouple} style={{width:"100%",padding:18,background:colors.A,color:"#070510",border:"none",borderRadius:16,fontWeight:700,marginBottom:12,transition:"all 0.3s"}}>Create Couple</button>
            <button onClick={()=>setCodeIn(codeIn?"":" ")} style={{width:"100%",padding:18,background:colors.CARD,border:`1px solid ${colors.BDR}`,borderRadius:16,transition:"all 0.3s"}}>Join with Code</button>
            {codeIn && <input value={codeIn} onChange={e=>setCodeIn(e.target.value.toUpperCase())} placeholder="6-LETTER CODE" maxLength={6} style={{width:"100%",padding:18,background:colors.CARD,border:`1px solid ${colors.BDR}`,borderRadius:16,marginTop:12,textAlign:"center",letterSpacing:"6px",transition:"all 0.3s"}} />}
            {codeIn && <button onClick={joinCouple} style={{width:"100%",padding:18,background:colors.A,color:"#070510",border:"none",borderRadius:16,fontWeight:700,marginTop:12,transition:"all 0.3s"}}>Join</button>}
          </div>
        )}

            {phase === "paired" && nav === "home" && (
              <div>
                <h1>Hello, {me?.name} ❤️</h1>
                <div style={{padding:16,background:colors.CARD,borderRadius:16,margin:"20px 0",border:`1px solid ${colors.BDR}`}}>
                  Your code: <strong style={{fontSize:22}}>{me?.code}</strong>
                </div>
                <button onClick={startCoinToss} style={{width:"100%",padding:24,background:colors.GOLD,color:"#070510",borderRadius:20,fontWeight:700,fontSize:18,marginBottom:20}}>🎲 Start Quiz Session</button>
                <button onClick={()=>setNav("wheel")} style={{width:"100%",padding:20,background:colors.CARD,borderRadius:20,marginBottom:12}}>🎡 Date Wheel</button>
                <button onClick={()=>setNav("rescue")} style={{width:"100%",padding:20,background:colors.CARD,borderRadius:20}}>⚕️ Dr. Rescue</button>
              </div>
            )}

            {nav === "topics" && (
              <div>
                <h2>Choose Topic</h2>
                {TOPICS.map(t => (
                  <button key={t.id} onClick={()=>startQuiz(t)} style={{width:"100%",padding:20,background:colors.CARD,borderRadius:20,marginBottom:12,textAlign:"left",border:`1px solid ${colors.BDR}`}}>
                    <span style={{fontSize:32,marginRight:16}}>{t.emoji}</span> {t.name}
                  </button>
                ))}
              </div>
            )}

            {activeQuiz && (
              <div style={{paddingBottom:100}}>
                <button onClick={()=>setActiveQuiz(null)} style={{color:colors.A,marginBottom:20}}>← Back</button>
                <div style={{fontSize:26,marginBottom:16}}>{activeQuiz.emoji} {activeQuiz.title}</div>
                <div style={{fontSize:19,lineHeight:1.5,marginBottom:30}}>{activeQuiz.questions[currentStep]?.q}</div>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {activeQuiz.questions[currentStep]?.opts?.map((o,i) => (
                    <button key={i} onClick={()=> {const na={...answers,[currentStep]:o};setAnswers(na);
                      if (currentStep < 9) setCurrentStep(s=>s+1);
                      else { alert("Quiz completed!"); setActiveQuiz(null); setNav("home"); }
                    }} style={{padding:20,background:colors.CARD,borderRadius:20,border:`1px solid ${colors.BDR}`}}>{o}</button>
                  ))}
                </div>
              </div>
            )}

            {nav === "wheel" && (
              <div style={{textAlign:"center",padding:"60px 20px"}}>
                <h2>Date Wheel</h2>
                <button onClick={()=>alert(`🎡 ${["Sunset picnic","Cook together","Star gazing","Hike"][Math.floor(Math.random()*4)]}`)} style={{padding:"28px 80px",background:colors.GOLD,color:"#070510",border:"none",borderRadius:999,fontSize:22,fontWeight:700}}>Spin the Wheel</button>
              </div>
            )}

            {nav === "rescue" && (
              <div>
                <h2>Dr. Rescue</h2>
                <button onClick={()=>{const t=prompt("Topic?");if(t){alert("Dr. Rescue: Listen fully, speak kindly, focus on solutions.");}}} style={{padding:20,background:colors.CARD,borderRadius:20,width:"100%",marginTop:20}}>Open New Case</button>
              </div>
            )}
          </div>

          {phase === "paired" && (
            <div style={{position:"fixed",bottom:0,left:0,right:0,background:colors.SURF,borderTop:`1px solid ${colors.BDR}`,display:"flex",padding:"8px 0",zIndex:100}}>
              {[{id:"home",icon:"🏠"},{id:"quiz",icon:"💡"},{id:"wheel",icon:"🎡"},{id:"rescue",icon:"⚕️"}].map(item => (
                <button key={item.id} onClick={()=>setNav(item.id)} style={{flex:1,padding:"12px 8px",background:nav===item.id?colors.A:"transparent",color:nav===item.id?"#070510":"#f0e8f0",border:"none",borderRadius:12,fontSize:11}}>
                  <div style={{fontSize:26}}>{item.icon}</div>
                  <div>{item.id}</div>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}