// @ts-nocheck
"use client";
import { useState } from "react";

const A = "#e8a598", DARK = "#070510", SURF = "#0e0b1a", CARD = "#140f24", BDR = "#221b35";
const GOLD = "#d4a847", TEAL = "#7fcfcf", GRN = "#6dbc7a";

export default function Landing() {
  const [showApp, setShowApp] = useState(false);

  if (showApp) {
    return <UsApp onBack={() => setShowApp(false)} />;
  }

  return (
    <div style={{minHeight:"100vh",background:DARK,color:"#f0e8f0",fontFamily:"system-ui"}}>
      {/* Header */}
      <div style={{padding:"20px 16px",background:SURF,borderBottom:`1px solid ${BDR}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:32,fontWeight:700,color:A}}>us.</div>
        <button onClick={() => setShowApp(true)} style={{padding:"12px 20px",background:A,color:"#070510",border:"none",borderRadius:12,fontWeight:600}}>Try Free</button>
      </div>

      {/* Hero */}
      <div style={{padding:"60px 20px",textAlign:"center",background:`linear-gradient(135deg, ${SURF} 0%, ${DARK} 100%)`}}>
        <div style={{fontSize:72,color:A,marginBottom:16}}>us.</div>
        <h1 style={{fontSize:28,fontWeight:700,marginBottom:16}}>The Ultimate Couples App</h1>
        <p style={{fontSize:18,lineHeight:1.6,opacity:0.9,marginBottom:32}}>
          Deepen your connection through meaningful conversations, fun games, and shared memories.
        </p>
        <button onClick={() => setShowApp(true)} style={{padding:"20px 40px",background:GOLD,color:"#070510",border:"none",borderRadius:20,fontSize:18,fontWeight:700}}>Start Your Journey</button>
      </div>

      {/* Features */}
      <div style={{padding:"40px 20px"}}>
        <h2 style={{fontSize:32,textAlign:"center",marginBottom:40,color:A}}>What Makes Us Special</h2>

        <div style={{display:"grid",gap:24}}>
          <div style={{padding:24,background:CARD,borderRadius:20,border:`1px solid ${BDR}`}}>
            <div style={{fontSize:40,marginBottom:16}}>🎲</div>
            <h3 style={{fontSize:20,fontWeight:600,marginBottom:12}}>Fair Play Sessions</h3>
            <p>Coin toss decides who picks the topic for truly democratic conversations.</p>
          </div>

          <div style={{padding:24,background:CARD,borderRadius:20,border:`1px solid ${BDR}`}}>
            <div style={{fontSize:40,marginBottom:16}}>💡</div>
            <h3 style={{fontSize:20,fontWeight:600,marginBottom:12}}>70+ Deep Questions</h3>
            <p>7 relationship topics with 10 thoughtful questions each for meaningful discussions.</p>
          </div>

          <div style={{padding:24,background:CARD,borderRadius:20,border:`1px solid ${BDR}`}}>
            <div style={{fontSize:40,marginBottom:16}}>🎡</div>
            <h3 style={{fontSize:20,fontWeight:600,marginBottom:12}}>Date Ideas</h3>
            <p>Spin our wheel for spontaneous date inspiration from 22 romantic activities.</p>
          </div>

          <div style={{padding:24,background:CARD,borderRadius:20,border:`1px solid ${BDR}`}}>
            <div style={{fontSize:40,marginBottom:16}}>📸</div>
            <h3 style={{fontSize:20,fontWeight:600,marginBottom:12}}>Photo Memories</h3>
            <p>Coming soon: Shared photo album for your relationship milestones.</p>
          </div>

          <div style={{padding:24,background:CARD,borderRadius:20,border:`1px solid ${BDR}`}}>
            <div style={{fontSize:40,marginBottom:16}}>⚕️</div>
            <h3 style={{fontSize:20,fontWeight:600,marginBottom:12}}>Relationship Support</h3>
            <p>Dr. Rescue provides guidance for navigating relationship challenges.</p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={{padding:"40px 20px",background:SURF}}>
        <h2 style={{fontSize:32,textAlign:"center",marginBottom:16,color:A}}>Pricing</h2>
        <p style={{textAlign:"center",marginBottom:40,opacity:0.8}}>
          Currently <strong>FREE</strong> during beta. Premium features coming soon.
        </p>

        <div style={{display:"grid",gap:20}}>
          <div style={{padding:24,background:CARD,borderRadius:20,border:`2px solid ${GOLD}`}}>
            <div style={{fontSize:24,fontWeight:700,marginBottom:8,color:GOLD}}>Lifetime Membership</div>
            <div style={{fontSize:32,fontWeight:700,marginBottom:16,color:A}}>$29</div>
            <p style={{marginBottom:20}}>One-time payment, access forever</p>
            <div style={{fontSize:14,opacity:0.7,marginBottom:16}}>
              ⏰ Limited time offer before official launch<br/>
              📈 Price increases to $49 after launch<br/>
              ❌ No longer available after 6 months live
            </div>
            <button style={{width:"100%",padding:16,background:GOLD,color:"#070510",border:"none",borderRadius:12,fontWeight:600}}>Get Lifetime Access - $29</button>
          </div>

          <div style={{padding:24,background:CARD,borderRadius:20,border:`1px solid ${BDR}`,opacity:0.6}}>
            <div style={{fontSize:20,fontWeight:600,marginBottom:8}}>Monthly Subscription</div>
            <div style={{fontSize:24,fontWeight:600,marginBottom:16}}>$4.99/month</div>
            <p>Available after official launch</p>
          </div>

          <div style={{padding:24,background:CARD,borderRadius:20,border:`1px solid ${BDR}`,opacity:0.6}}>
            <div style={{fontSize:20,fontWeight:600,marginBottom:8}}>Yearly Subscription</div>
            <div style={{fontSize:24,fontWeight:600,marginBottom:16}}>$39/year</div>
            <p>Available after official launch</p>
          </div>
        </div>

        <div style={{marginTop:32,textAlign:"center"}}>
          <p style={{fontSize:14,opacity:0.7,lineHeight:1.6}}>
            🚀 <strong>Free During Development:</strong> All features unlocked now<br/>
            ⏰ <strong>Limited Time:</strong> Lifetime membership at $29 before launch<br/>
            📈 <strong>Future Pricing:</strong> $49 lifetime after launch, then subscription-only<br/>
            ❌ <strong>Deadline:</strong> Lifetime option ends 6 months after going live
          </p>
        </div>
      </div>

      {/* Future Features */}
      <div style={{padding:"40px 20px"}}>
        <h2 style={{fontSize:32,textAlign:"center",marginBottom:40,color:A}}>Coming Soon</h2>

        <div style={{display:"grid",gap:20}}>
          <div style={{padding:20,background:CARD,borderRadius:16,border:`1px solid ${BDR}`}}>
            <h3 style={{fontSize:18,fontWeight:600,marginBottom:8}}>🎯 Compatibility Scoring</h3>
            <p>Compare answers with your partner and get relationship insights</p>
          </div>

          <div style={{padding:20,background:CARD,borderRadius:16,border:`1px solid ${BDR}`}}>
            <h3 style={{fontSize:18,fontWeight:600,marginBottom:8}}>📊 Progress Tracking</h3>
            <p>Track how well you know each other over time</p>
          </div>

          <div style={{padding:20,background:CARD,borderRadius:16,border:`1px solid ${BDR}`}}>
            <h3 style={{fontSize:18,fontWeight:600,marginBottom:8}}>💬 AI Relationship Coach</h3>
            <p>Personalized advice based on your quiz answers</p>
          </div>

          <div style={{padding:20,background:CARD,borderRadius:16,border:`1px solid ${BDR}`}}>
            <h3 style={{fontSize:18,fontWeight:600,marginBottom:8}}>📅 Shared Calendar</h3>
            <p>Plan dates and track relationship milestones together</p>
          </div>

          <div style={{padding:20,background:CARD,borderRadius:16,border:`1px solid ${BDR}`}}>
            <h3 style={{fontSize:18,fontWeight:600,marginBottom:8}}>🎮 More Games</h3>
            <p>Truth or Dare, Would You Rather, and relationship challenges</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{padding:"40px 20px",textAlign:"center",background:SURF}}>
        <h2 style={{fontSize:28,marginBottom:16}}>Ready to Deepen Your Connection?</h2>
        <p style={{marginBottom:32,opacity:0.9}}>
          Join thousands of couples strengthening their relationships through meaningful conversations.
        </p>
        <button onClick={() => setShowApp(true)} style={{padding:"20px 40px",background:A,color:"#070510",border:"none",borderRadius:20,fontSize:18,fontWeight:700}}>
          Start Your Free Journey
        </button>
      </div>

      {/* Footer */}
      <div style={{padding:"20px",textAlign:"center",borderTop:`1px solid ${BDR}`,background:SURF}}>
        <p style={{fontSize:14,opacity:0.7}}>
          Made with ❤️ for couples everywhere • Currently in beta • Free during development
        </p>
      </div>
    </div>
  );
}

// The main app component
function UsApp({ onBack }) {
  const [phase, setPhase] = useState("loading");
  const [me, setMe] = useState(null);
  const [couple, setCouple] = useState(null);
  const [nav, setNav] = useState("home");
  const [nameIn, setNameIn] = useState("");
  const [codeIn, setCodeIn] = useState("");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showCoinToss, setShowCoinToss] = useState(false);
  const [coinWinner, setCoinWinner] = useState(null);

  // ... existing app code ...

  const DDATES = ["Sunset picnic","Cook a new recipe together","Star gazing","Dance class","Museum visit","Morning hike","Wine & paint night","Midnight drive","Farmers market","Board game night","Road trip","Spa day at home","Watch the sunrise","Pottery class","Karaoke night","Bookstore date","Drive-in movie","Escape room","Concert","Breakfast in bed","Botanical garden","Kayaking"];

  const TOPICS = [
    {id:"all-me", name:"All About Me", emoji:"👤"},
    {id:"all-you", name:"All About You", emoji:"❤️"},
    {id:"love", name:"Love & Romance", emoji:"💌"},
    {id:"future", name:"Future Dreams", emoji:"🌠"},
    {id:"favorites", name:"Favorites", emoji:"⭐"},
    {id:"intimacy", name:"Intimacy & Sex", emoji:"🔥"},
    {id:"fun", name:"Fun & Play", emoji:"🎲"}
  ];

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

  const startSession = () => {
    setShowCoinToss(true);
    setTimeout(() => {
      const isHeads = Math.random() > 0.5;
      const winner = isHeads ? "Heads" : "Tails";
      setCoinWinner(winner);
      alert(`Coin toss: ${winner} wins! Winner chooses the topic.`);
      setShowCoinToss(false);
      setNav("topics");
    }, 1200);
  };

  const startQuiz = (topic) => {
    const quiz = {
      title: topic.name,
      emoji: topic.emoji,
      questions: Array.from({length:10}, (_, i) => ({
        q: `Question ${i+1} about ${topic.name}...`,
        opts: ["Option A", "Option B", "Option C", "Option D"]
      }))
    };
    setActiveQuiz(quiz);
    setCurrentStep(0);
    setAnswers({});
  };

  const answer = (val) => {
    const na = {...answers, [currentStep]: val};
    setAnswers(na);
    if (currentStep < 9) {
      setCurrentStep(s => s + 1);
    } else {
      sSet(`quiz-${activeQuiz.title}-${me.role}`, na, true);
      alert("Quiz saved! Ask your partner to complete it for scoring & comparison.");
      setActiveQuiz(null);
      setNav("home");
    }
  };

  const logout = () => {
    if (confirm("Logout and clear data?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div style={{minHeight:"100vh",background:DARK,color:"#f0e8f0",fontFamily:"system-ui",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"14px 16px",background:SURF,borderBottom:`1px solid ${BDR}`,position:"sticky",top:0,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <button onClick={onBack} style={{color:A,fontSize:18}}>← Landing</button>
        <div style={{fontSize:28,fontWeight:700,color:A}}>us.</div>
        <div>{me && `Code: ${me.code}`}</div>
      </div>

      {/* Free Beta Banner */}
      <div style={{padding:"8px 16px",background:GOLD,color:"#070510",textAlign:"center",fontSize:14,fontWeight:600}}>
        🎉 FREE BETA - Premium features coming soon at $4.99/month or $39/year
      </div>

      {!couple?.user2name && me && <div style={{padding:12,background:"#e8a59822",textAlign:"center"}}>Share code <strong>{me.code}</strong></div>}

      <div style={{flex:1,overflowY:"auto",padding:"20px 16px"}}>
        {phase === "onboard" && (
          <div style={{maxWidth:420,margin:"60px auto",textAlign:"center"}}>
            <div style={{fontSize:80,color:A}}>us.</div>
            <p>Premium couple experience</p>
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
            <button onClick={startSession} style={{width:"100%",padding:24,background:GOLD,color:"#070510",borderRadius:20,fontWeight:700,fontSize:18,marginBottom:20}}>🎲 Start Quiz Session</button>
            <button onClick={()=>setNav("wheel")} style={{width:"100%",padding:20,background:CARD,borderRadius:20,marginBottom:12}}>🎡 Date Wheel</button>
            <button onClick={()=>setNav("album")} style={{width:"100%",padding:20,background:CARD,borderRadius:20,marginBottom:12}}>📸 Photo Album</button>
            <button onClick={()=>setNav("rescue")} style={{width:"100%",padding:20,background:CARD,borderRadius:20}}>⚕️ Dr. Rescue</button>
            <button onClick={logout} style={{marginTop:40,color:"#e87c7c",width:"100%",padding:14}}>Logout</button>
          </div>
        )}

        {nav === "topics" && (
          <div>
            <h2>Choose a Topic</h2>
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

        {nav === "album" && (
          <div>
            <h2>Photo Album</h2>
            <p style={{opacity:0.7}}>Shared couple memories — coming soon in premium</p>
            <button style={{padding:20,background:CARD,borderRadius:20,width:"100%",marginTop:20}}>+ Add Photo</button>
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
          {[{id:"home",icon:"🏠"},{id:"quiz",icon:"💡"},{id:"wheel",icon:"🎡"},{id:"album",icon:"📸"},{id:"rescue",icon:"⚕️"}].map(item => (
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