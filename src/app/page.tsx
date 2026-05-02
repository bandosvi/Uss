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
const GOLD = "#d4a847", TEAL = "#7fcfcf", GRN = "#6dbc7a";

const DDATES = ["Sunset picnic","Cook a new recipe together","Star gazing","Dance class","Museum visit","Morning hike","Wine & paint night","Midnight drive","Farmers market","Board game night","Road trip","Spa day at home","Watch the sunrise","Pottery class","Karaoke night","Bookstore date","Drive-in movie","Escape room","Concert","Breakfast in bed","Botanical garden","Kayaking"];

const QZ = [
  {id:"love-lang",title:"Love Languages",emoji:"💌",color:A,desc:"How you give and receive love",time:"8 min",type:"choice",
   questions:[
     {q:"You had a rough week. What would feel most healing?",opts:[{t:"Heartfelt message",k:"WA"},{t:"Full attention",k:"QT"},{t:"Thoughtful gift",k:"GG"},{t:"Acts of service",k:"AS"},{t:"Being held",k:"PT"}]},
     {q:"You express love by…",opts:[{t:"Words",k:"WA"},{t:"Quality time",k:"QT"},{t:"Gifts",k:"GG"},{t:"Service",k:"AS"},{t:"Touch",k:"PT"}]},
     {q:"Most romantic thing is…",opts:[{t:"Love letter",k:"WA"},{t:"Full day together",k:"QT"},{t:"Surprise gift",k:"GG"},{t:"Helping without asking",k:"AS"},{t:"Dancing in kitchen",k:"PT"}]}
   ],
   keys:{WA:{n:"Words of Affirmation"},QT:{n:"Quality Time"},GG:{n:"Gifts"},AS:{n:"Acts of Service"},PT:{n:"Physical Touch"}}
  },

  {id:"guess-date",title:"Guess My Favorite Date",emoji:"🌲",color:GOLD,desc:"Romantic spots & adventures",time:"6 min",type:"choice",
   questions:[
     {q:"My dream date is…",opts:[{t:"Picnic in the woods",k:"woods"},{t:"Romantic Paris walk",k:"paris"},{t:"Cozy movie night",k:"home"},{t:"Beach sunset",k:"beach"},{t:"Adventure hike",k:"hike"}]}
   ]
  },

  {id:"guess-gift",title:"Guess My Perfect Gift",emoji:"🎁",color:TEAL,desc:"What gifts make me melt",time:"5 min",type:"choice",
   questions:[{q:"The gift that would make me happiest…",opts:[{t:"Handwritten letter",k:"letter"},{t:"Handmade item",k:"handmade"},{t:"Experience together",k:"experience"},{t:"Jewelry",k:"jewelry"}]}]
  },

  {id:"dream-date",title:"Dream Date Night",emoji:"🌙",color:"#c47a65",desc:"Build our perfect evening",time:"7 min",type:"choice",
   questions:[
     {q:"Ideal date night starts with…",opts:[{t:"Cooking together",k:"cook"},{t:"Dressing up & going out",k:"out"},{t:"Staying in with candles",k:"in"}]},
     {q:"Ending the night with…",opts:[{t:"Stargazing",k:"stars"},{t:"Deep conversation",k:"talk"},{t:"Cuddling & movie",k:"cuddle"}]}
   ]
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

  const logout = () => {
    if (confirm("Logout and clear all data?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const partnerName = couple ? (me?.role === "user1" ? couple.user2name : couple.user1name) : null;

  const startQuiz = (q) => { setActiveQuiz(q); setCurrentStep(0); setAnswers({}); };
  const answer = (val) => {
    const na = {...answers, [currentStep]: val};
    setAnswers(na);
    if (currentStep < (activeQuiz.questions.length - 1)) {
      setCurrentStep(s => s + 1);
    } else {
      sSet(`quiz-${activeQuiz.id}-${me.role}`, na, true);
      alert("Saved! Ask your partner to take the same quiz for scoring & comparison.");
      setActiveQuiz(null);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:DARK,color:"#f0e8f0",fontFamily:"system-ui",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"14px 16px",background:SURF,borderBottom:`1px solid ${BDR}`,position:"sticky",top:0,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:28,fontWeight:700,color:A}}>us.</div>
        <div style={{fontSize:14}}>{me && `Code: ${me.code}`}</div>
      </div>

      {!partnerName && me && <div style={{padding:12,background:"#e8a59822",textAlign:"center"}}>Share code <strong>{me.code}</strong></div>}

      <div style={{flex:1,overflowY:"auto",padding:"20px 16px"}}>
        {phase === "onboard" && (
          <div style={{maxWidth:420,margin:"60px auto",textAlign:"center"}}>
            <div style={{fontSize:80,color:A}}>us.</div>
            <p style={{fontSize:18,marginBottom:40}}>Premium couple sanctuary</p>
            <input value={nameIn} onChange={e=>setNameIn(e.target.value)} placeholder="Your name" style={{width:"100%",padding:18,background:CARD,border:`1px solid ${BDR}`,borderRadius:16,marginBottom:16}} />
            <button onClick={createCouple} style={{width:"100%",padding:18,background:A,color:"#070510",border:"none",borderRadius:16,fontWeight:700,marginBottom:12}}>Create Couple</button>
            <button onClick={()=>setCodeIn(codeIn?"":" ")} style={{width:"100%",padding:18,background:CARD,border:`1px solid ${BDR}`,borderRadius:16}}>Join with Code</button>
            {codeIn && (
              <div style={{marginTop:20}}>
                <input value={codeIn} onChange={e=>setCodeIn(e.target.value.toUpperCase())} placeholder="6-LETTER CODE" maxLength={6} style={{width:"100%",padding:18,background:CARD,border:`1px solid ${BDR}`,borderRadius:16,textAlign:"center",letterSpacing:"6px"}} />
                <button onClick={joinCouple} style={{width:"100%",padding:18,background:A,color:"#070510",border:"none",borderRadius:16,fontWeight:700,marginTop:12}}>Join</button>
              </div>
            )}
          </div>
        )}

        {phase === "paired" && nav === "home" && (
          <div>
            <h1>Hello, {me?.name} ❤️</h1>
            <div style={{padding:16,background:CARD,borderRadius:16,marginBottom:20,border:`1px solid ${BDR}`}}>
              <strong>Your code:</strong> <span style={{fontSize:22,letterSpacing:".1em"}}>{me?.code}</span><br/>
              <small>Share this with your partner to connect</small>
            </div>

            <div style={{display:"grid",gap:16}}>
              <button onClick={()=>setNav("quiz")} style={{padding:24,background:CARD,borderRadius:20,textAlign:"left",border:`1px solid ${BDR}`}}>💡 Quizzes & Games</button>
              <button onClick={()=>setNav("wheel")} style={{padding:24,background:CARD,borderRadius:20,textAlign:"left",border:`1px solid ${BDR}`}}>🎡 Date Wheel</button>
              <button onClick={()=>setNav("rescue")} style={{padding:24,background:CARD,borderRadius:20,textAlign:"left",border:`1px solid ${BDR}`}}>⚕️ Dr. Rescue</button>
            </div>

            <button onClick={logout} style={{marginTop:40,color:"#e87c7c",width:"100%",padding:14}}>Logout</button>
          </div>
        )}

        {nav === "quiz" && !activeQuiz && (
          <div>
            <h2 style={{fontSize:28,marginBottom:20}}>Premium Quizzes</h2>
            {QZ.map(q => (
              <button key={q.id} onClick={()=>startQuiz(q)} style={{width:"100%",padding:20,background:CARD,borderRadius:20,marginBottom:12,textAlign:"left",border:`1px solid ${BDR}`}}>
                <span style={{fontSize:32,marginRight:16}}>{q.emoji}</span>
                <strong>{q.title}</strong><br/>
                <small style={{opacity:0.7}}>{q.desc}</small>
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
            <h2>Date Wheel</h2>
            <button onClick={()=>alert(`🎡 ${wheel[Math.floor(Math.random()*wheel.length)]}`)} style={{padding:"28px 80px",background:GOLD,color:"#070510",border:"none",borderRadius:999,fontSize:22,fontWeight:700}}>Spin the Wheel</button>
          </div>
        )}

        {nav === "rescue" && (
          <div>
            <h2>Dr. Rescue</h2>
            <p style={{opacity:0.8}}>Submit both sides for honest AI mediation.</p>
            <button onClick={()=>{const t=prompt("Conflict topic?");if(t){alert("Dr. Rescue: Communicate calmly, listen fully, and focus on solutions together.");}}} style={{padding:20,background:CARD,borderRadius:20,width:"100%",marginTop:20}}>Open New Case</button>
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