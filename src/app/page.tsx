// @ts-nocheck
// FINAL CLEAN VERSION - Landing with Login + Modal Features + Theme Switcher
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
  classic: { A: "#e8a598", DARK: "#070510", SURF: "#0e0b1a", CARD: "#140f24", BDR: "#221b35", GOLD: "#d4a847" },
  romantic: { A: "#d4a8b5", DARK: "#1a0f14", SURF: "#2a1a22", CARD: "#3a2530", BDR: "#5a3f4a", GOLD: "#e8c4a8" },
  modern: { A: "#a8b5d4", DARK: "#0f141a", SURF: "#1a222a", CARD: "#25303a", BDR: "#3f4a5a", GOLD: "#d4c4a8" }
};

const TOPICS = [
  {id:"love", name:"Love & Romance", emoji:"💌"},
  {id:"future", name:"Future Dreams", emoji:"🌠"},
  {id:"favorites", name:"Favorites", emoji:"⭐"},
  {id:"intimacy", name:"Intimacy", emoji:"🔥"},
  {id:"all-me", name:"All About Me", emoji:"👤"}
];

export default function Us() {
  const [theme, setTheme] = useState("classic");
  const [me, setMe] = useState(null);
  const [couple, setCouple] = useState(null);
  const [nav, setNav] = useState("home");
  const [nameIn, setNameIn] = useState("");
  const [codeIn, setCodeIn] = useState("");
  const [emailIn, setEmailIn] = useState("");
  const [passwordIn, setPasswordIn] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const colors = THEMES[theme];

  useEffect(() => {
    (async () => {
      const sess = await sGet("sess:us");
      if (sess?.code) {
        const c = await sGet(`couple:${sess.code}`, true);
        if (c) { setMe(sess); setCouple(c); }
      }
    })();
  }, []);

  const handleAuth = async () => {
    if (!emailIn.trim() || !passwordIn.trim()) return alert("Fill all fields");
    if (!isLogin && !nameIn.trim()) return alert("Enter your name");

    // Mock authentication
    const userId = uid();
    const sess = {
      userId,
      email: emailIn.trim(),
      name: isLogin ? "User" : nameIn.trim(),
      authenticated: true
    };

    await sSet("user:auth", sess);
    alert(isLogin ? "Logged in successfully!" : "Account created successfully!");
  };

  const createCouple = async () => {
    if (!nameIn.trim()) return alert("Enter name");
    const code = genCode();
    const userId = uid();
    const c = {code, user1id:userId, user1name:nameIn.trim(), user2id:null, user2name:null};
    await sSet(`couple:${code}`, c, true);
    const sess = {userId, name:nameIn.trim(), code, role:"user1"};
    await sSet("sess:us", sess);
    setMe(sess); setCouple(c);
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
    setMe(sess); setCouple(up);
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
  };

  const answer = (val) => {
    const na = {...answers, [currentStep]: val};
    setAnswers(na);
    if (currentStep < 9) setCurrentStep(s => s + 1);
    else {
      alert("Quiz completed! Ask your partner to finish for scoring.");
      setActiveQuiz(null);
      setNav("home");
    }
  };

  const logout = () => {
    if (confirm("Logout?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div style={{minHeight:"100vh",background:colors.DARK,color:"#f0e8f0",fontFamily:"system-ui",display:"flex",flexDirection:"column"}}>
      {/* Theme Switcher */}
      <div style={{
        position:"fixed",
        top:20,
        right:20,
        zIndex:1000,
        display:"flex",
        gap:8,
        background:colors.SURF,
        padding:8,
        borderRadius:20,
        border:`1px solid ${colors.BDR}`
      }}>
        {Object.keys(THEMES).map(t => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            style={{
              width:12,
              height:12,
              borderRadius:"50%",
              border:"none",
              background:theme === t ? THEMES[t].A : "transparent",
              cursor:"pointer",
              border:theme === t ? "2px solid #f0e8f0" : "2px solid transparent"
            }}
            title={`${t.charAt(0).toUpperCase() + t.slice(1)} Theme`}
          />
        ))}
      </div>

      {/* Landing Page */}
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",padding:"20px",background:"linear-gradient(135deg, colors.DARK 0%, colors.SURF 100%)",position:"relative",overflow:"hidden"}}>
        {/* Floating hearts animation */}
        <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:1}}>
          {[...Array(6)].map((_,i) => (
            <div key={i} style={{
              position:"absolute",
              left:`${15+Math.random()*70}%`,
              top:`${Math.random()*100}%`,
              fontSize:`${16+Math.random()*12}px`,
              animation:`float ${4+Math.random()*3}s ease-in-out infinite`,
              animationDelay:`${Math.random()*2}s`,
              color:colors.A,
              opacity:0.6
            }}>💖</div>
          ))}
        </div>

        {/* Hero section */}
        <div style={{position:"relative",zIndex:2,marginBottom:40}}>
          <div style={{
            fontSize:72,
            fontWeight:900,
            color:colors.A,
            marginBottom:16,
            fontFamily:"'Impact', 'Arial Black', sans-serif"
          }}>us.</div>

          <div style={{
            fontSize:24,
            fontWeight:700,
            color:"#f0e8f0",
            marginBottom:12,
            lineHeight:1.2
          }}>Stronger Relationships,<br/>One Question at a Time</div>

          <p style={{fontSize:16,color:"#f0e8f0",opacity:0.8,maxWidth:320,marginBottom:30}}>
            The couples app that turns awkward silences into meaningful conversations.
          </p>
        </div>

        {/* Login/Signup Form */}
        <div style={{
          background:"linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          padding:24,
          borderRadius:20,
          border:`1px solid ${colors.BDR}`,
          marginBottom:30,
          width:"100%",
          maxWidth:320,
          zIndex:2
        }}>
          <div style={{display:"flex",marginBottom:20,background:colors.SURF,borderRadius:12,padding:4}}>
            <button
              onClick={() => setIsLogin(true)}
              style={{
                flex:1,
                padding:8,
                borderRadius:8,
                border:"none",
                background:isLogin ? colors.A : "transparent",
                color:isLogin ? "#070510" : "#f0e8f0",
                fontWeight:600,
                cursor:"pointer"
              }}
            >Login</button>
            <button
              onClick={() => setIsLogin(false)}
              style={{
                flex:1,
                padding:8,
                borderRadius:8,
                border:"none",
                background:!isLogin ? colors.A : "transparent",
                color:!isLogin ? "#070510" : "#f0e8f0",
                fontWeight:600,
                cursor:"pointer"
              }}
            >Sign Up</button>
          </div>

          <input
            value={emailIn}
            onChange={e=>setEmailIn(e.target.value)}
            placeholder="Email"
            type="email"
            style={{
              width:"100%",
              padding:12,
              marginBottom:12,
              background:colors.CARD,
              border:`1px solid ${colors.BDR}`,
              borderRadius:8,
              color:"#f0e8f0",
              fontSize:16
            }}
          />

          <input
            value={passwordIn}
            onChange={e=>setPasswordIn(e.target.value)}
            placeholder="Password"
            type="password"
            style={{
              width:"100%",
              padding:12,
              marginBottom:12,
              background:colors.CARD,
              border:`1px solid ${colors.BDR}`,
              borderRadius:8,
              color:"#f0e8f0",
              fontSize:16
            }}
          />

          {!isLogin && (
            <input
              value={nameIn}
              onChange={e=>setNameIn(e.target.value)}
              placeholder="Your Name"
              style={{
                width:"100%",
                padding:12,
                marginBottom:12,
                background:colors.CARD,
                border:`1px solid ${colors.BDR}`,
                borderRadius:8,
                color:"#f0e8f0",
                fontSize:16
              }}
            />
          )}

          <button
            onClick={handleAuth}
            style={{
              width:"100%",
              padding:14,
              background:colors.A,
              color:colors.DARK,
              border:"none",
              borderRadius:12,
              fontWeight:700,
              fontSize:16,
              cursor:"pointer",
              marginBottom:12
            }}
          >
            {isLogin ? "Login" : "Create Account"}
          </button>

          <p style={{fontSize:12,color:"#f0e8f0",opacity:0.6,textAlign:"center"}}>
            🚀 Free beta access • Premium features coming soon
          </p>
        </div>

        {/* Feature Cards */}
        <div style={{display:"grid",gap:16,width:"100%",maxWidth:340,marginBottom:30,zIndex:2}}>
          <div
            onClick={() => setActiveModal("quiz")}
            style={{
              background:colors.CARD,
              padding:16,
              borderRadius:12,
              border:`1px solid ${colors.BDR}`,
              cursor:"pointer",
              transition:"all 0.3s ease"
            }}
          >
            <div style={{fontSize:18,fontWeight:600,color:colors.A,marginBottom:4}}>❓ Compatibility Quiz</div>
            <div style={{fontSize:14,color:"#f0e8f0",opacity:0.8}}>See how well you match</div>
          </div>

          <div
            onClick={() => setActiveModal("decide")}
            style={{
              background:colors.CARD,
              padding:16,
              borderRadius:12,
              border:`1px solid ${colors.BDR}`,
              cursor:"pointer",
              transition:"all 0.3s ease"
            }}
          >
            <div style={{fontSize:18,fontWeight:600,color:colors.A,marginBottom:4}}>🎲 Decision Helper</div>
            <div style={{fontSize:14,color:"#f0e8f0",opacity:0.8}}>Coin toss & date ideas</div>
          </div>

          <div
            onClick={() => setActiveModal("coach")}
            style={{
              background:colors.CARD,
              padding:16,
              borderRadius:12,
              border:`1px solid ${colors.BDR}`,
              cursor:"pointer",
              transition:"all 0.3s ease"
            }}
          >
            <div style={{fontSize:18,fontWeight:600,color:colors.A,marginBottom:4}}>💬 Relationship Coach</div>
            <div style={{fontSize:14,color:"#f0e8f0",opacity:0.8}}>Expert guidance</div>
          </div>
        </div>

        <p style={{fontSize:14,color:"#f0e8f0",opacity:0.7,zIndex:2}}>
          Join couples building stronger relationships
        </p>
      </div>

      {/* Feature Modals */}
      {activeModal && (
        <div style={{
          position:"fixed",
          top:0,
          left:0,
          right:0,
          bottom:0,
          background:"rgba(0,0,0,0.8)",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          zIndex:2000,
          padding:20
        }}>
          <div style={{
            background:colors.CARD,
            borderRadius:20,
            padding:24,
            maxWidth:320,
            width:"100%",
            border:`1px solid ${colors.BDR}`,
            position:"relative"
          }}>
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position:"absolute",
                top:12,
                right:12,
                background:"none",
                border:"none",
                fontSize:24,
                color:"#f0e8f0",
                cursor:"pointer"
              }}
            >×</button>

            {activeModal === "quiz" && (
              <div>
                <div style={{fontSize:24,fontWeight:700,color:colors.A,marginBottom:12}}>❓ Compatibility Quiz</div>
                <div style={{color:"#f0e8f0",marginBottom:16,lineHeight:1.5}}>
                  Take our 10-question compatibility quiz to discover how well you and your partner really know each other. Get instant insights and fun facts about your relationship!
                </div>
                <div style={{fontSize:14,color:"#f0e8f0",opacity:0.8,marginBottom:20}}>
                  • 10 carefully crafted questions<br/>
                  • Instant compatibility score<br/>
                  • Fun insights and tips<br/>
                  • Take it together or separately
                </div>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    if (me) startQuiz({name:"Compatibility Quiz", emoji:"❓"});
                  }}
                  style={{
                    width:"100%",
                    padding:14,
                    background:colors.A,
                    color:colors.DARK,
                    border:"none",
                    borderRadius:12,
                    fontWeight:700,
                    fontSize:16,
                    cursor:"pointer"
                  }}
                >
                  Start Quiz
                </button>
              </div>
            )}

            {activeModal === "decide" && (
              <div>
                <div style={{fontSize:24,fontWeight:700,color:colors.A,marginBottom:12}}>🎲 Decision Helper</div>
                <div style={{color:"#f0e8f0",marginBottom:16,lineHeight:1.5}}>
                  Never argue about what to do again! Our decision helper tools make choosing fun and fair for both partners.
                </div>
                <div style={{fontSize:14,color:"#f0e8f0",opacity:0.8,marginBottom:20}}>
                  • Fair coin toss for decisions<br/>
                  • Spinning date wheel with ideas<br/>
                  • Romantic, fun, and adventurous options<br/>
                  • Save your favorites
                </div>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    if (me) startCoinToss();
                  }}
                  style={{
                    width:"100%",
                    padding:14,
                    background:colors.A,
                    color:colors.DARK,
                    border:"none",
                    borderRadius:12,
                    fontWeight:700,
                    fontSize:16,
                    cursor:"pointer"
                  }}
                >
                  Try It Now
                </button>
              </div>
            )}

            {activeModal === "coach" && (
              <div>
                <div style={{fontSize:24,fontWeight:700,color:colors.A,marginBottom:12}}>💬 Relationship Coach</div>
                <div style={{color:"#f0e8f0",marginBottom:16,lineHeight:1.5}}>
                  Get professional relationship advice from Dr. Rescue whenever you need guidance on communication, conflict resolution, or relationship growth.
                </div>
                <div style={{fontSize:14,color:"#f0e8f0",opacity:0.8,marginBottom:20}}>
                  • Expert relationship advice<br/>
                  • Conflict resolution tips<br/>
                  • Communication guidance<br/>
                  • Private and confidential
                </div>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    if (me) setNav("rescue");
                  }}
                  style={{
                    width:"100%",
                    padding:14,
                    background:colors.A,
                    color:colors.DARK,
                    border:"none",
                    borderRadius:12,
                    fontWeight:700,
                    fontSize:16,
                    cursor:"pointer"
                  }}
                >
                  Get Advice
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main App */}
      {me && couple && (
        <>
          <div style={{padding:"14px 16px",background:colors.SURF,borderBottom:`1px solid ${colors.BDR}`,position:"sticky",top:0,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:28,fontWeight:700,color:colors.A}}>us.</div>
            <div>{me && `Code: ${me.code}`}</div>
          </div>

          <div style={{flex:1,overflowY:"auto",padding:"20px 16px"}}>
            {phase === "paired" && nav === "home" && (
              <div>
                <h1>Hello, {me?.name} ❤️</h1>
                <div style={{padding:16,background:colors.CARD,borderRadius:16,margin:"20px 0",border:`1px solid ${colors.BDR}`}}>
                  Your code: <strong style={{fontSize:22}}>{me?.code}</strong>
                </div>
                <button onClick={startCoinToss} style={{width:"100%",padding:24,background:colors.GOLD,color:"#070510",borderRadius:20,fontWeight:700,fontSize:18,marginBottom:20}}>🎲 Start Quiz Session</button>
                <button onClick={()=>setNav("wheel")} style={{width:"100%",padding:20,background:colors.CARD,borderRadius:20,marginBottom:12}}>🎡 Date Wheel</button>
                <button onClick={()=>setNav("rescue")} style={{width:"100%",padding:20,background:colors.CARD,borderRadius:20}}>⚕️ Dr. Rescue</button>
                <button onClick={logout} style={{marginTop:40,color:"#e87c7c",width:"100%",padding:14}}>Logout</button>
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
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
          75% { transform: translateY(-25px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
}
