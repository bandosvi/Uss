// @ts-nocheck
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

const A = "#e8a598", DARK = "#070510", SURF = "#0e0b1a", CARD = "#140f24", BDR = "#221b35";
const GOLD = "#d4a847", TEAL = "#7fcfcf";

const DDATES = ["Sunset picnic","Cook a new recipe together","Star gazing","Dance class","Museum visit","Morning hike","Wine & paint night","Midnight drive","Farmers market","Board game night","Road trip","Spa day at home","Watch the sunrise","Pottery class","Karaoke night","Bookstore date","Drive-in movie","Escape room","Concert","Breakfast in bed","Botanical garden","Kayaking"];

const QZ = [
  // Love Languages
  {id:"love-lang",title:"Love Languages",emoji:"💌",color:A,desc:"How you give and receive love",time:"8 min",type:"choice",
   questions:[
     {q:"You had a rough week. What would feel most healing?",opts:[{t:"A long heartfelt message",k:"WA"},{t:"Full phone-free attention",k:"QT"},{t:"A thoughtful gift",k:"GG"},{t:"Partner handled everything",k:"AS"},{t:"Being held",k:"PT"}]},
     {q:"You express love most naturally by…",opts:[{t:"Words and compliments",k:"WA"},{t:"Quality time together",k:"QT"},{t:"Giving gifts",k:"GG"},{t:"Acts of service",k:"AS"},{t:"Physical touch",k:"PT"}]}
   ],
   keys:{WA:{n:"Words of Affirmation"},QT:{n:"Quality Time"},GG:{n:"Gifts"},AS:{n:"Acts of Service"},PT:{n:"Physical Touch"}}
  },
  // Attachment Style
  {id:"attachment",title:"Attachment Style",emoji:"🔗",color:"#9b7fa8",desc:"Your relational wiring",time:"8 min",type:"choice",
   questions:[
     {q:"When my partner doesn't text back, I usually…",opts:[{t:"Assume they're busy",k:"SEC"},{t:"Feel uneasy and check phone",k:"ANX"},{t:"Barely notice",k:"AVO"}]}
   ],
   keys:{SEC:{n:"Secure"},ANX:{n:"Anxious"},AVO:{n:"Avoidant"}}
  },
  // Apology Languages
  {id:"apology",title:"Apology Languages",emoji:"🕊️",color:"#b8d4e8",desc:"How you need to receive an apology",time:"6 min",type:"choice",
   questions:[{q:"An apology feels real when your partner…",opts:[{t:"Clearly says I was wrong",k:"EW"},{t:"Asks what they can do to fix it",k:"MR"}]}],
   keys:{EW:{n:"Expressing Regret"},MR:{n:"Making Restitution"}}
  },
  // This or That
  {id:"this-or-that",title:"This or That",emoji:"🎲",color:GOLD,desc:"Fast & revealing",time:"4 min",type:"this-or-that",
   questions:[
     {a:"Morning person",b:"Night owl"},{a:"Beach vacation",b:"Mountain getaway"},
     {a:"Cook at home",b:"Restaurants"},{a:"Big parties",b:"Intimate dinners"}
   ]
  },
  // Hard Questions (open)
  {id:"hardq",title:"The Hard Questions",emoji:"🩺",color:"#c47a65",desc:"Deep conversations",time:"open",type:"open",
   questions:[{q:"What are you most afraid I'll discover about you?"}]
  }
];

export default function Us() {
  const [phase, setPhase] = useState("loading");
  const [me, setMe] = useState(null);
  const [couple, setCouple] = useState(null);
  const [nav, setNav] = useState("home");

  const [wheel, setWheel] = useState(DDATES);
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
      } else setPhase("onboard");
    })();
  }, []);

  const createCouple = async () => {
    if (!nameIn.trim()) return alert("Enter your name");
    const code = genCode();
    const userId = uid();
    const c = {code, user1id:userId, user1name:nameIn.trim(), user2id:null, user2name:null};
    await sSet(`couple:${code}`, c, true);
    const sess = {userId, name:nameIn.trim(), code, role:"user1"};
    await sSet("sess:us", sess);
    setMe(sess); setCouple(c); setPhase("paired");
  };

  const joinCouple = async () => {
    if (!nameIn.trim() || !codeIn.trim()) return alert("Fill all fields");
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

  const partner = couple ? (me?.role === "user1" ? couple.user2name : couple.user1name) : null;

  const startQuiz = (q) => { setActiveQuiz(q); setCurrentStep(0); setAnswers({}); };
  const answer = (val) => {
    const na = {...answers, [currentStep]: val};
    setAnswers(na);
    if (currentStep < (activeQuiz?.questions?.length || 0) - 1) setCurrentStep(s => s+1);
    else { alert("Quiz completed! Amazing work together ❤️"); setActiveQuiz(null); }
  };

  return (
    <div style={{minHeight:"100vh",background:DARK,color:"#f0e8f0",fontFamily:"system-ui",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"14px 16px",background:SURF,borderBottom:`1px solid ${BDR}`,position:"sticky",top:0,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:28,fontWeight:700,color:A}}>us.</div>
        <div>{me ? `${me.name} ${partner ? `♥ ${partner}` : "♥ Waiting"}` : ""}</div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"20px 16px"}}>
        {phase === "onboard" && (
          <div style={{maxWidth:420,margin:"60px auto",textAlign:"center"}}>
            <div style={{fontSize:80,color:A}}>us.</div>
            <p style={{fontSize:18,marginBottom:40}}>Your private couple sanctuary</p>
            <input value={nameIn} onChange={e=>setNameIn(e.target.value)} placeholder="Your name" style={{width:"100%",padding:18,background:CARD,border:`1px solid ${BDR}`,borderRadius:16,fontSize:17,marginBottom:16}} />
            <button onClick={createCouple} style={{width:"100%",padding:18,background:A,color:"#070510",border:"none",borderRadius:16,fontWeight:700,fontSize:18,marginBottom:12}}>Create New Couple</button>
            <button onClick={()=>setCodeIn(codeIn?"":" ")} style={{width:"100%",padding:18,background:CARD,border:`1px solid ${BDR}`,borderRadius:16,fontSize:18}}>Join with Code</button>
            {codeIn && (
              <div style={{marginTop:20}}>
                <input value={codeIn} onChange={e=>setCodeIn(e.target.value.toUpperCase())} placeholder="6-LETTER CODE" maxLength={6} style={{width:"100%",padding:18,background:CARD,border:`1px solid ${BDR}`,borderRadius:16,fontSize:20,letterSpacing:"6px",textAlign:"center"}} />
                <button onClick={joinCouple} style={{width:"100%",padding:18,background:A,color:"#070510",border:"none",borderRadius:16,fontWeight:700,marginTop:12}}>Join Couple</button>
              </div>
            )}
          </div>
        )}

        {phase === "paired" && nav === "home" && (
          <div>
            <h1 style={{fontSize:32}}>Hello, {me?.name} ❤️</h1>
            <div style={{display:"grid",gap:16,marginTop:30}}>
              <button onClick={()=>setNav("quiz")} style={{padding:24,background:CARD,borderRadius:20,fontSize:18,textAlign:"left",border:`1px solid ${BDR}`}}>💡 Quizzes</button>
              <button onClick={()=>setNav("wheel")} style={{padding:24,background:CARD,borderRadius:20,fontSize:18,textAlign:"left",border:`1px solid ${BDR}`}}>🎡 Date Wheel</button>
              <button onClick={()=>setNav("rescue")} style={{padding:24,background:CARD,borderRadius:20,fontSize:18,textAlign:"left",border:`1px solid ${BDR}`}}>⚕️ Dr. Rescue</button>
            </div>
          </div>
        )}

        {nav === "quiz" && !activeQuiz && (
          <div>
            <h2 style={{fontSize:28,marginBottom:20}}>Quiz Studio</h2>
            {QZ.map(q => (
              <button key={q.id} onClick={()=>startQuiz(q)} style={{width:"100%",padding:20,background:CARD,borderRadius:20,marginBottom:12,textAlign:"left",border:`1px solid ${BDR}`}}>
                <span style={{fontSize:32,marginRight:16}}>{q.emoji}</span>
                <strong style={{fontSize:19}}>{q.title}</strong>
              </button>
            ))}
          </div>
        )}

        {activeQuiz && (
          <div style={{paddingBottom:100}}>
            <button onClick={()=>setActiveQuiz(null)} style={{color:A,marginBottom:20}}>← Back</button>
            <div style={{fontSize:26,marginBottom:16}}>{activeQuiz.emoji} {activeQuiz.title}</div>
            <div style={{fontSize:19,lineHeight:1.5,marginBottom:30}}>{activeQuiz.questions[currentStep]?.q}</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {activeQuiz.questions[currentStep]?.opts?.map((o,i) => (
                <button key={i} onClick={()=>answer(o.k)} style={{padding:20,background:CARD,borderRadius:20,border:`1px solid ${BDR}`}}>{o.t}</button>
              ))}
            </div>
          </div>
        )}

        {nav === "wheel" && (
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <h2 style={{fontSize:32,marginBottom:40}}>Date Wheel</h2>
            <button onClick={()=>alert(`🎡 ${wheel[Math.floor(Math.random()*wheel.length)]}`)} style={{padding:"28px 80px",background:GOLD,color:"#070510",border:"none",borderRadius:999,fontSize:22,fontWeight:700}}>Spin the Wheel</button>
          </div>
        )}

        {nav === "rescue" && (
          <div>
            <h2 style={{fontSize:28}}>Dr. Rescue</h2>
            <button onClick={()=>{const t=prompt("Topic?");if(t){alert("Case opened! Dr. Rescue will help.");}}} style={{padding:20,background:CARD,borderRadius:20,width:"100%",marginTop:20}}>Open New Case</button>
          </div>
        )}
      </div>

      {phase === "paired" && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:SURF,borderTop:`1px solid ${BDR}`,display:"flex",padding:"8px 0",zIndex:100}}>
          {[{id:"home",icon:"🏠"},{id:"quiz",icon:"💡"},{id:"wheel",icon:"🎡"},{id:"rescue",icon:"⚕️"}].map(item => (
            <button key={item.id} onClick={()=>setNav(item.id)} style={{flex:1,padding:"12px 8px",background:nav===item.id?A:"transparent",color:nav===item.id?"#070510":"#f0e8f0",border:"none",borderRadius:12,fontSize:11}}>
              <div style={{fontSize:26}}>{item.icon}</div>
              <div>{item.id}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}