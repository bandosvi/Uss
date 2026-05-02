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
const GOLD = "#d4a847";

const DDATES = ["Sunset picnic","Cook a new recipe together","Star gazing","Dance class","Museum visit","Morning hike","Wine & paint night","Midnight drive","Farmers market","Board game night","Road trip","Spa day at home","Watch the sunrise","Pottery class","Karaoke night","Bookstore date","Drive-in movie","Escape room","Concert","Breakfast in bed","Botanical garden","Kayaking"];

const QZ = [
  {id:"love-lang",cat:"foundation",title:"Love Languages",emoji:"💌",color:A,desc:"How you give and receive love",time:"8 min",type:"choice",
   questions:[
     {q:"You had a rough week. What would feel most healing?",opts:[{t:"Heartfelt message",k:"WA"},{t:"Full attention",k:"QT"},{t:"Thoughtful gift",k:"GG"},{t:"Acts of service",k:"AS"},{t:"Physical touch",k:"PT"}]}
   ],
   keys:{WA:{n:"Words of Affirmation"},QT:{n:"Quality Time"},GG:{n:"Gifts"},AS:{n:"Acts of Service"},PT:{n:"Physical Touch"}}
  },
  {id:"this-or-that",cat:"fun",title:"This or That",emoji:"🎲",color:GOLD,desc:"Fun & revealing",time:"4 min",type:"this-or-that",
   questions:[{a:"Morning person",b:"Night owl"},{a:"Beach",b:"Mountains"},{a:"Cook at home",b:"Restaurants"}]}
];

export default function Us() {
  const [phase, setPhase] = useState("loading");
  const [me, setMe] = useState(null);
  const [couple, setCouple] = useState(null);
  const [nav, setNav] = useState("home");

  const [cal, setCal] = useState([]);
  const [wheel, setWheel] = useState(DDATES);
  const [notes, setNotes] = useState([]);
  const [bounds, setBounds] = useState([]);
  const [rescueCases, setRescueCases] = useState([]);

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
        if (c) {
          setMe(sess);
          setCouple(c);
          loadData(sess.code);
          setPhase("paired");
          return;
        }
      }
      setPhase("onboard");
    })();
  }, []);

  const loadData = async (code) => {
    const [c,w,n,b,r] = await Promise.all([
      sGet(`cal:${code}`,true), sGet(`whl:${code}`,true),
      sGet(`nts:${code}`,true), sGet(`bnd:${code}`,true), sGet(`rsc:${code}`,true)
    ]);
    setCal(c||[]);
    setWheel(w||DDATES);
    setNotes(n||[]);
    setBounds(b||[]);
    setRescueCases(r||[]);
  };

  const saveData = (key, val) => sSet(key, val, true);

  const createCouple = async () => {
    if (!nameIn.trim()) return alert("Enter your name");
    const code = genCode();
    const userId = uid();
    const c = {code, user1id:userId, user1name:nameIn.trim(), user2id:null, user2name:null};
    await sSet(`couple:${code}`, c, true);
    const sess = {userId, name:nameIn.trim(), code, role:"user1"};
    await sSet("sess:us", sess);
    setMe(sess); setCouple(c); loadData(code); setPhase("paired");
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
    setMe(sess); setCouple(up); loadData(code); setPhase("paired");
  };

  const partnerName = couple ? (me?.role==="user1" ? couple.user2name : couple.user1name) : null;
  const isPaired = !!(couple?.user1id && couple?.user2id);

  const startQuiz = (q) => { setActiveQuiz(q); setCurrentStep(0); setAnswers({}); };
  const answer = (val) => {
    const na = {...answers, [currentStep]: val};
    setAnswers(na);
    if (currentStep < (activeQuiz?.questions?.length || 0) - 1) {
      setCurrentStep(s => s + 1);
    } else {
      alert("Quiz completed! Amazing work together ❤️");
      setActiveQuiz(null);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:DARK,color:"#f0e8f0",fontFamily:"system-ui",display:"flex",flexDirection:"column",overflow:"hidden",paddingBottom:"70px"}}>
      {/* Header - Mobile Optimized */}
      <div style={{padding:"14px 16px",background:SURF,borderBottom:`1px solid ${BDR}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
        <div style={{fontSize:28,fontWeight:700,color:A}}>us.</div>
        <div style={{fontSize:15,textAlign:"center"}}>
          {isPaired ? `${me?.name} ♥ ${partnerName || "Waiting"}` : `Code: ${me?.code || ""}`}
        </div>
      </div>

      {!isPaired && me && (
        <div style={{padding:"10px 16px",background:"#e8a59822",textAlign:"center",fontSize:14,fontWeight:500}}>
          Share code <strong style={{letterSpacing:".1em"}}>{me.code}</strong> with your partner
        </div>
      )}

      <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
        {phase === "onboard" && (
          <div style={{maxWidth:420,margin:"40px auto",textAlign:"center"}}>
            <div style={{fontSize:72,color:A,marginBottom:8}}>us.</div>
            <p style={{fontSize:18,marginBottom:32}}>Your private space for two</p>

            <input 
              value={nameIn} 
              onChange={e=>setNameIn(e.target.value)} 
              placeholder="Your name" 
              style={{width:"100%",padding:18,marginBottom:16,background:CARD,border:`1px solid ${BDR}`,borderRadius:16,fontSize:17}}
            />

            <button onClick={createCouple} style={{width:"100%",padding:18,background:A,color:"#070510",border:"none",borderRadius:16,fontWeight:700,fontSize:18,marginBottom:12}}>
              Create New Couple
            </button>

            <button onClick={()=>setCodeIn(codeIn ? "" : " ")} style={{width:"100%",padding:18,background:CARD,border:`1px solid ${BDR}`,borderRadius:16,fontSize:18}}>
              Join with Partner Code
            </button>

            {codeIn && (
              <div style={{marginTop:20}}>
                <input 
                  value={codeIn} 
                  onChange={e=>setCodeIn(e.target.value.toUpperCase())} 
                  placeholder="ENTER 6-LETTER CODE" 
                  maxLength={6}
                  style={{width:"100%",padding:18,background:CARD,border:`1px solid ${BDR}`,borderRadius:16,fontSize:20,letterSpacing:"6px",textAlign:"center"}}
                />
                <button onClick={joinCouple} style={{width:"100%",padding:18,background:A,color:"#070510",border:"none",borderRadius:16,fontWeight:700,marginTop:12}}>Join Couple</button>
              </div>
            )}
          </div>
        )}

        {phase === "paired" && nav === "home" && (
          <div>
            <h1 style={{fontSize:32,marginBottom:8}}>Hello, {me?.name} ❤️</h1>
            <div style={{display:"grid",gap:16,marginTop:20}}>
              <button onClick={()=>setNav("quiz")} style={mobileBtn}>💡 Quizzes</button>
              <button onClick={()=>setNav("wheel")} style={mobileBtn}>🎡 Date Wheel</button>
              <button onClick={()=>setNav("cal")} style={mobileBtn}>📅 Calendar</button>
              <button onClick={()=>setNav("notes")} style={mobileBtn}>📝 Notes</button>
              <button onClick={()=>setNav("rescue")} style={mobileBtn}>⚕️ Dr. Rescue</button>
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {nav === "quiz" && !activeQuiz && (
          <div>
            <h2 style={{fontSize:28,marginBottom:20}}>Quiz Studio</h2>
            {QZ.map(q => (
              <button key={q.id} onClick={()=>startQuiz(q)} style={mobileBtn}>
                <span style={{fontSize:32,marginRight:16}}>{q.emoji}</span>
                <div>
                  <div style={{fontWeight:600,fontSize:18}}>{q.title}</div>
                  <div style={{fontSize:13,opacity:0.7}}>{q.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeQuiz && (
          <div style={{paddingBottom:80}}>
            <button onClick={()=>setActiveQuiz(null)} style={{marginBottom:20,color:A}}>← Back</button>
            <div style={{fontSize:26,marginBottom:20}}>{activeQuiz.emoji} {activeQuiz.title}</div>
            <div style={{fontSize:19,lineHeight:1.5,marginBottom:30}}>{activeQuiz.questions[currentStep]?.q}</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {activeQuiz.questions[currentStep]?.opts?.map((o,i) => (
                <button key={i} onClick={()=>answer(o.k)} style={mobileBtn}>{o.t}</button>
              ))}
            </div>
          </div>
        )}

        {/* Date Wheel */}
        {nav === "wheel" && (
          <div style={{textAlign:"center",paddingTop:40}}>
            <h2 style={{fontSize:32,marginBottom:40}}>Date Wheel</h2>
            <button 
              onClick={()=>alert(`🎡 ${wheel[Math.floor(Math.random()*wheel.length)]}`)}
              style={{padding:"24px 60px",background:GOLD,color:"#070510",border:"none",borderRadius:999,fontSize:20,fontWeight:700,marginBottom:40}}
            >
              Spin the Wheel
            </button>
            <button onClick={()=>{const i=prompt("New date idea?");if(i){const nw=[...wheel,i];setWheel(nw);saveData(`whl:${me.code}`,nw);}}} style={mobileBtn}>+ Add New Idea</button>
          </div>
        )}

        {/* Calendar */}
        {nav === "cal" && (
          <div>
            <h2 style={{fontSize:28,marginBottom:20}}>Calendar</h2>
            <button onClick={()=>{const t=prompt("Event title");const d=prompt("Date (YYYY-MM-DD)");if(t&&d){const nw=[{id:uid(),title:t,date:d},...cal];setCal(nw);saveData(`cal:${me.code}`,nw);}}} style={mobileBtn}>+ Add Event</button>
          </div>
        )}

        {/* Notes */}
        {nav === "notes" && (
          <div>
            <h2 style={{fontSize:28,marginBottom:20}}>Notes</h2>
            <button onClick={()=>{const t=prompt("Title");const c=prompt("Content");if(t||c){const nw=[{id:uid(),title:t,content:c},...notes];setNotes(nw);saveData(`nts:${me.code}`,nw);}}} style={mobileBtn}>+ New Note</button>
          </div>
        )}

        {/* Dr. Rescue */}
        {nav === "rescue" && (
          <div>
            <h2 style={{fontSize:28,marginBottom:20}}>Dr. Rescue</h2>
            <button onClick={()=>{const t=prompt("What is the conflict about?");if(t){const s=prompt("Your side:");const nc={id:uid(),topic:t,side:s};const nw=[nc,...rescueCases];setRescueCases(nw);saveData(`rsc:${me.code}`,nw);alert("Case opened!");}}} style={mobileBtn}>Open New Case</button>
          </div>
        )}
      </div>

      {/* Mobile Bottom Nav */}
      {phase === "paired" && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:SURF,borderTop:`1px solid ${BDR}`,display:"flex",padding:"8px 0",zIndex:20}}>
          {[
            {id:"home",icon:"🏠"},
            {id:"quiz",icon:"💡"},
            {id:"wheel",icon:"🎡"},
            {id:"cal",icon:"📅"},
            {id:"rescue",icon:"⚕️"}
          ].map(item => (
            <button 
              key={item.id} 
              onClick={()=>setNav(item.id)}
              style={{
                flex:1,
                padding:"12px 4px",
                background:nav===item.id ? A : "transparent",
                color:nav===item.id ? "#070510" : "#f0e8f0",
                border:"none",
                borderRadius:12,
                fontSize:11,
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                gap:4
              }}
            >
              <span style={{fontSize:22}}>{item.icon}</span>
              <span style={{textTransform:"uppercase",letterSpacing:".5px"}}>{item.id}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const mobileBtn = {
  width:"100%",
  padding:"20px 16px",
  background:CARD,
  border:`1px solid ${BDR}`,
  borderRadius:20,
  textAlign:"left",
  fontSize:17,
  marginBottom:12
};