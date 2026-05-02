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

const TOPICS = [
  {id:"love", name:"Love & Romance", emoji:"💌"},
  {id:"future", name:"Future Dreams", emoji:"🌠"},
  {id:"favorites", name:"Favorites", emoji:"⭐"},
  {id:"intimacy", name:"Intimacy", emoji:"🔥"},
  {id:"all-me", name:"All About Me", emoji:"👤"}
];

export default function Us() {
  const [phase, setPhase] = useState("loading");
  const [me, setMe] = useState(null);
  const [couple, setCouple] = useState(null);
  const [nav, setNav] = useState("home");
  const [nameIn, setNameIn] = useState("");
  const [codeIn, setCodeIn] = useState("");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [partnerAnswers, setPartnerAnswers] = useState(null);
  const [score, setScore] = useState(null);

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
    <div style={{minHeight:"100vh",background:DARK,color:"#f0e8f0",fontFamily:"system-ui",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"14px 16px",background:SURF,borderBottom:`1px solid ${BDR}`,position:"sticky",top:0,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:28,fontWeight:700,color:A}}>us.</div>
        <div>{me && `Code: ${me.code}`}</div>
      </div>

      {!couple?.user2name && me && <div style={{padding:12,background:"#e8a59822",textAlign:"center"}}>Share code <strong>{me.code}</strong></div>}

      <div style={{flex:1,overflowY:"auto",padding:"20px 16px"}}>
        {phase === "onboard" && (
          <div style={{maxWidth:420,margin:"60px auto",textAlign:"center"}}>
            <div style={{fontSize:80,color:A}}>us.</div>
            <p style={{fontSize:18,marginBottom:40}}>Deep connection. Fun dates. Lasting love.</p>
            <input value={nameIn} onChange={e=>setNameIn(e.target.value)} placeholder="Your name" style={{width:"100%",padding:18,background:CARD,border:`1px solid ${BDR}`,borderRadius:16,marginBottom:16}} />
            <button onClick={createCouple} style={{width:"100%",padding:18,background:A,color:"#070510",border:"none",borderRadius:16,fontWeight:700,marginBottom:12}}>Create Couple</button>
            <button onClick={()=>setCodeIn(codeIn?"":" ")} style={{width:"100%",padding:18,background:CARD,border:`1px solid ${BDR}`,borderRadius:16}}>Join with Code</button>
            {codeIn && <input value={codeIn} onChange={e=>setCodeIn(e.target.value.toUpperCase())} placeholder="6-LETTER CODE" maxLength={6} style={{width:"100%",padding:18,background:CARD,border:`1px solid ${BDR}`,borderRadius:16,marginTop:12,textAlign:"center",letterSpacing:"6px"}} />}
            {codeIn && <button onClick={joinCouple} style={{width:"100%",padding:18,background:A,color:"#070510",border:"none",borderRadius:16,fontWeight:700,marginTop:12}}>Join</button>}
          </div>
        )}

        {phase === "paired" && nav === "home" && (
          <div>
            <h1>Hello, {me?.name} ❤️</h1>
            <div style={{padding:16,background:CARD,borderRadius:16,margin:"20px 0",border:`1px solid ${BDR}`}}>
              Your code: <strong style={{fontSize:22}}>{me?.code}</strong>
            </div>
            <button onClick={startCoinToss} style={{width:"100%",padding:24,background:GOLD,color:"#070510",borderRadius:20,fontWeight:700,fontSize:18,marginBottom:20}}>🎲 Start Quiz Session</button>
            <button onClick={()=>setNav("wheel")} style={{width:"100%",padding:20,background:CARD,borderRadius:20,marginBottom:12}}>🎡 Date Wheel</button>
            <button onClick={()=>setNav("rescue")} style={{width:"100%",padding:20,background:CARD,borderRadius:20}}>⚕️ Dr. Rescue</button>
            <button onClick={logout} style={{marginTop:40,color:"#e87c7c",width:"100%",padding:14}}>Logout</button>
          </div>
        )}

        {nav === "topics" && (
          <div>
            <h2>Choose Topic</h2>
            {TOPICS.map(t => (
              <button key={t.id} onClick={()=>startQuiz(t)} style={{width:"100%",padding:20,background:CARD,borderRadius:20,marginBottom:12,textAlign:"left",border:`1px solid ${BDR}`}}>
                <span style={{fontSize:32,marginRight:16}}>{t.emoji}</span> {t.name}
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
                <button key={i} onClick={()=>answer(o)} style={{padding:20,background:CARD,borderRadius:20,border:`1px solid ${BDR}`}}>{o}</button>
              ))}
            </div>
          </div>
        )}

        {nav === "wheel" && (
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <h2>Date Wheel</h2>
            <button onClick={()=>alert(`🎡 ${DDATES[Math.floor(Math.random()*DDATES.length)]}`)} style={{padding:"28px 80px",background:GOLD,color:"#070510",border:"none",borderRadius:999,fontSize:22,fontWeight:700}}>Spin the Wheel</button>
          </div>
        )}

        {nav === "rescue" && (
          <div>
            <h2>Dr. Rescue</h2>
            <button onClick={()=>{const t=prompt("Topic?");if(t){alert("Dr. Rescue: Listen fully, speak kindly, focus on solutions.");}}} style={{padding:20,background:CARD,borderRadius:20,width:"100%",marginTop:20}}>Open New Case</button>
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