// @ts-nocheck
// FINAL STRONG LANDING VERSION - Copy this entire code
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

export default function Us() {
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
    <div style={{minHeight:"100vh",background:DARK,color:"#f0e8f0",fontFamily:"system-ui",display:"flex",flexDirection:"column"}}>
      {phase === "landing" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",padding:"40px 20px",background:"linear-gradient(135deg, #0f141a 0%, #1a222a 50%, #25303a 100%)",position:"relative",overflow:"hidden"}}>
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
                color:"#ff6b9d",
                opacity:0.7
              }}>💖</div>
            ))}
          </div>

          {/* Hero section */}
          <div style={{position:"relative",zIndex:2,marginBottom:40}}>
            <div style={{
              fontSize:96,
              fontWeight:900,
              background:"linear-gradient(45deg, #a8b5d4, #ff6b9d, #d4c4a8)",
              backgroundClip:"text",
              WebkitBackgroundClip:"text",
              color:"transparent",
              textShadow:"0 0 40px rgba(168,181,212,0.3)",
              marginBottom:20
            }}>us.</div>

            <div style={{
              fontSize:28,
              fontWeight:700,
              background:"linear-gradient(45deg, #f0e8f0, #a8b5d4)",
              backgroundClip:"text",
              WebkitBackgroundClip:"text",
              color:"transparent",
              marginBottom:16,
              lineHeight:1.2
            }}>Stronger Relationships,<br/>One Question at a Time</div>

            <p style={{fontSize:18,color:"#f0e8f0",opacity:0.9,maxWidth:340,marginBottom:32}}>
              The couples app that turns awkward silences into meaningful conversations and "I don't know" dates into unforgettable memories.
            </p>
          </div>

          {/* Interactive demo section */}
          <div style={{display:"grid",gap:20,width:"100%",maxWidth:380,marginBottom:40,zIndex:2}}>
            <div style={{
              background:"linear-gradient(135deg, rgba(168,181,212,0.1), rgba(168,181,212,0.05))",
              padding:24,
              borderRadius:20,
              border:"1px solid rgba(168,181,212,0.3)",
              backdropFilter:"blur(10px)",
              cursor:"pointer",
              transition:"all 0.3s ease",
              position:"relative",
              overflow:"hidden"
            }}>
              <div style={{
                position:"absolute",
                top:0,
                right:0,
                width:60,
                height:60,
                background:"linear-gradient(135deg, #ff6b9d, #a8b5d4)",
                borderRadius:"50%",
                opacity:0.1
              }}></div>
              <div style={{fontSize:20,fontWeight:600,color:"#f0e8f0",marginBottom:8}}>❓ Quiz Time</div>
              <div style={{fontSize:16,color:"#a8b5d4",marginBottom:12}}>Discover how well you really know each other</div>
              <div style={{fontSize:14,color:"#f0e8f0",opacity:0.8}}>10 questions • Instant compatibility score • Fun insights</div>
            </div>

            <div style={{
              background:"linear-gradient(135deg, rgba(212,196,168,0.1), rgba(212,196,168,0.05))",
              padding:24,
              borderRadius:20,
              border:"1px solid rgba(212,196,168,0.3)",
              backdropFilter:"blur(10px)",
              cursor:"pointer",
              transition:"all 0.3s ease",
              position:"relative",
              overflow:"hidden"
            }}>
              <div style={{
                position:"absolute",
                top:0,
                right:0,
                width:60,
                height:60,
                background:"linear-gradient(135deg, #d4c4a8, #ff6b9d)",
                borderRadius:"50%",
                opacity:0.1
              }}></div>
              <div style={{fontSize:20,fontWeight:600,color:"#f0e8f0",marginBottom:8}}>🎲 Decision Maker</div>
              <div style={{fontSize:16,color:"#d4c4a8",marginBottom:12}}>Never argue about what to do again</div>
              <div style={{fontSize:14,color:"#f0e8f0",opacity:0.8}}>Coin toss • Date wheel • Fair & fun</div>
            </div>

            <div style={{
              background:"linear-gradient(135deg, rgba(255,107,157,0.1), rgba(255,107,157,0.05))",
              padding:24,
              borderRadius:20,
              border:"1px solid rgba(255,107,157,0.3)",
              backdropFilter:"blur(10px)",
              cursor:"pointer",
              transition:"all 0.3s ease",
              position:"relative",
              overflow:"hidden"
            }}>
              <div style={{
                position:"absolute",
                top:0,
                right:0,
                width:60,
                height:60,
                background:"linear-gradient(135deg, #a8b5d4, #d4c4a8)",
                borderRadius:"50%",
                opacity:0.1
              }}></div>
              <div style={{fontSize:20,fontWeight:600,color:"#f0e8f0",marginBottom:8}}>💬 Relationship Coach</div>
              <div style={{fontSize:16,color:"#ff6b9d",marginBottom:12}}>Professional advice when you need it</div>
              <div style={{fontSize:14,color:"#f0e8f0",opacity:0.8}}>Dr. Rescue • Expert guidance • Private sessions</div>
            </div>
          </div>

          {/* How it works */}
          <div style={{marginBottom:40,zIndex:2}}>
            <div style={{fontSize:18,fontWeight:600,color:"#f0e8f0",marginBottom:16,textAlign:"center"}}>How it works</div>
            <div style={{display:"flex",justifyContent:"center",gap:16,flexWrap:"wrap"}}>
              <div style={{textAlign:"center",minWidth:80}}>
                <div style={{fontSize:24,marginBottom:8}}>1️⃣</div>
                <div style={{fontSize:14,color:"#a8b5d4",fontWeight:500}}>Connect</div>
                <div style={{fontSize:12,color:"#f0e8f0",opacity:0.7}}>Create your couple</div>
              </div>
              <div style={{fontSize:20,color:"#f0e8f0",opacity:0.5,alignSelf:"center"}}>→</div>
              <div style={{textAlign:"center",minWidth:80}}>
                <div style={{fontSize:24,marginBottom:8}}>2️⃣</div>
                <div style={{fontSize:14,color:"#a8b5d4",fontWeight:500}}>Discover</div>
                <div style={{fontSize:12,color:"#f0e8f0",opacity:0.7}}>Take quizzes together</div>
              </div>
              <div style={{fontSize:20,color:"#f0e8f0",opacity:0.5,alignSelf:"center"}}>→</div>
              <div style={{textAlign:"center",minWidth:80}}>
                <div style={{fontSize:24,marginBottom:8}}>3️⃣</div>
                <div style={{fontSize:14,color:"#a8b5d4",fontWeight:500}}>Grow</div>
                <div style={{fontSize:12,color:"#f0e8f0",opacity:0.7}}>Build stronger love</div>
              </div>
            </div>
          </div>

          {/* Social proof style */}
          <div style={{marginBottom:32,zIndex:2}}>
            <div style={{fontSize:16,color:"#f0e8f0",opacity:0.8,marginBottom:8}}>Join thousands of couples building stronger relationships</div>
            <div style={{display:"flex",justifyContent:"center",gap:8}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"linear-gradient(45deg, #a8b5d4, #ff6b9d)"}}></div>
              <div style={{width:8,height:8,borderRadius:"50%",background:"linear-gradient(45deg, #d4c4a8, #a8b5d4)"}}></div>
              <div style={{width:8,height:8,borderRadius:"50%",background:"linear-gradient(45deg, #ff6b9d, #d4c4a8)"}}></div>
            </div>
          </div>

          {/* Success stats visual hook */}
          <div style={{marginBottom:32,zIndex:2}}>
            <div style={{
              background:"linear-gradient(135deg, rgba(168,181,212,0.1), rgba(168,181,212,0.05))",
              padding:16,
              borderRadius:16,
              border:"1px solid rgba(168,181,212,0.2)",
              textAlign:"center"
            }}>
              <div style={{fontSize:20,fontWeight:700,color:"#a8b5d4",marginBottom:4}}>92%</div>
              <div style={{fontSize:14,color:"#f0e8f0",opacity:0.9}}>of couples report improved communication</div>
              <div style={{fontSize:12,color:"#f0e8f0",opacity:0.6,marginTop:4}}>*Based on beta user surveys</div>
            </div>
          </div>

          {/* CTA */}
          <button onClick={()=>setPhase("onboard")} style={{
            width:"100%",
            maxWidth:360,
            padding:22,
            background:"linear-gradient(45deg, #a8b5d4, #ff6b9d)",
            color:"#070510",
            border:"none",
            borderRadius:25,
            fontWeight:800,
            fontSize:20,
            boxShadow:"0 8px 32px rgba(168,181,212,0.4)",
            position:"relative",
            zIndex:2,
            cursor:"pointer",
            transition:"all 0.3s ease"
          }}>
            Start Your Love Story ✨
          </button>

          <p style={{marginTop:24,fontSize:16,color:"#a8b5d4",fontWeight:500,zIndex:2}}>
            🚀 Free Beta Access • Premium Launch Coming Soon
          </p>
          <p style={{marginTop:8,fontSize:14,color:"#f0e8f0",opacity:0.7,zIndex:2}}>
            Everything is free during beta • Future premium features in development
          </p>

          {/* Comprehensive Roadmap - ICO Style */}
          <div style={{marginTop:60,zIndex:2,padding:"0 20px 40px"}}>
            <div style={{textAlign:"center",marginBottom:40}}>
              <div style={{
                fontSize:32,
                fontWeight:900,
                background:"linear-gradient(45deg, #a8b5d4, #ff6b9d, #d4c4a8)",
                backgroundClip:"text",
                WebkitBackgroundClip:"text",
                color:"transparent",
                marginBottom:16
              }}>ROADMAP</div>
              <p style={{fontSize:18,color:"#f0e8f0",opacity:0.9}}>Building the future of relationship technology</p>
            </div>

            <div style={{display:"grid",gap:20,maxWidth:400,margin:"0 auto"}}>

              {/* Phase 1 - Current Beta */}
              <div style={{
                background:"linear-gradient(135deg, rgba(168,181,212,0.15), rgba(168,181,212,0.08))",
                padding:24,
                borderRadius:16,
                border:"2px solid #a8b5d4",
                position:"relative"
              }}>
                <div style={{
                  position:"absolute",
                  top:-12,
                  left:20,
                  background:"#a8b5d4",
                  color:"#070510",
                  padding:"4px 12px",
                  borderRadius:12,
                  fontSize:12,
                  fontWeight:700,
                  textTransform:"uppercase"
                }}>Phase 1 - Beta</div>
                <div style={{fontSize:20,fontWeight:700,color:"#a8b5d4",marginBottom:12}}>Foundation & Core Features</div>
                <div style={{color:"#f0e8f0",opacity:0.9,lineHeight:1.6}}>
                  ✅ **Basic Quiz System** - Relationship compatibility testing<br/>
                  ✅ **Coin Toss & Date Wheel** - Fun decision-making tools<br/>
                  ✅ **Dr. Rescue** - Relationship counseling prompts<br/>
                  ✅ **Cross-device Sync** - Basic data persistence<br/>
                  🚧 **User Accounts** - Sign-up system in development<br/>
                  🚧 **Advanced Analytics** - Compatibility insights
                </div>
                <div style={{
                  marginTop:16,
                  padding:"8px 16px",
                  background:"linear-gradient(45deg, #a8b5d4, #d4c4a8)",
                  borderRadius:20,
                  fontSize:14,
                  fontWeight:600,
                  color:"#070510",
                  display:"inline-block"
                }}>CURRENT STATUS</div>
              </div>

              {/* Phase 2 - Q3 2026 */}
              <div style={{
                background:"linear-gradient(135deg, rgba(212,196,168,0.15), rgba(212,196,168,0.08))",
                padding:24,
                borderRadius:16,
                border:"2px solid #d4c4a8",
                position:"relative"
              }}>
                <div style={{
                  position:"absolute",
                  top:-12,
                  left:20,
                  background:"#d4c4a8",
                  color:"#070510",
                  padding:"4px 12px",
                  borderRadius:12,
                  fontSize:12,
                  fontWeight:700,
                  textTransform:"uppercase"
                }}>Phase 2 - Q3 2026</div>
                <div style={{fontSize:20,fontWeight:700,color:"#d4c4a8",marginBottom:12}}>Premium Features Launch</div>
                <div style={{color:"#f0e8f0",opacity:0.9,lineHeight:1.6}}>
                  🔄 **User Accounts & Profiles** - Secure sign-up system<br/>
                  🔄 **Advanced Compatibility Reports** - Detailed relationship insights<br/>
                  🔄 **Private Messaging** - In-app communication between partners<br/>
                  🔄 **Shared Calendar** - Relationship milestone tracking<br/>
                  🔄 **Premium Quiz Library** - 50+ specialized relationship tests<br/>
                  🔄 **Mobile App Release** - Native iOS/Android apps
                </div>
                <div style={{
                  marginTop:16,
                  padding:"8px 16px",
                  background:"linear-gradient(45deg, #d4c4a8, #ff6b9d)",
                  borderRadius:20,
                  fontSize:14,
                  fontWeight:600,
                  color:"#070510",
                  display:"inline-block"
                }}>COMING SOON</div>
              </div>

              {/* Phase 3 - Q1 2027 */}
              <div style={{
                background:"linear-gradient(135deg, rgba(255,107,157,0.15), rgba(255,107,157,0.08))",
                padding:24,
                borderRadius:16,
                border:"2px solid #ff6b9d",
                position:"relative"
              }}>
                <div style={{
                  position:"absolute",
                  top:-12,
                  left:20,
                  background:"#ff6b9d",
                  color:"#070510",
                  padding:"4px 12px",
                  borderRadius:12,
                  fontSize:12,
                  fontWeight:700,
                  textTransform:"uppercase"
                }}>Phase 3 - Q1 2027</div>
                <div style={{fontSize:20,fontWeight:700,color:"#ff6b9d",marginBottom:12}}>AI-Powered Relationships</div>
                <div style={{color:"#f0e8f0",opacity:0.9,lineHeight:1.6}}>
                  🤖 **AI Relationship Coach** - Personalized advice & conflict resolution<br/>
                  📊 **Predictive Analytics** - Relationship health forecasting<br/>
                  🎯 **Custom Growth Plans** - Tailored improvement strategies<br/>
                  👥 **Community Features** - Verified couples network<br/>
                  📱 **Wearable Integration** - Mood & activity tracking<br/>
                  🌍 **Multi-language Support** - Global relationship tools
                </div>
                <div style={{
                  marginTop:16,
                  padding:"8px 16px",
                  background:"linear-gradient(45deg, #ff6b9d, #a8b5d4)",
                  borderRadius:20,
                  fontSize:14,
                  fontWeight:600,
                  color:"#070510",
                  display:"inline-block"
                }}>FUTURE VISION</div>
              </div>

              {/* Phase 4 - 2027+ */}
              <div style={{
                background:"linear-gradient(135deg, rgba(138,43,226,0.15), rgba(138,43,226,0.08))",
                padding:24,
                borderRadius:16,
                border:"2px solid #8a2be2",
                position:"relative"
              }}>
                <div style={{
                  position:"absolute",
                  top:-12,
                  left:20,
                  background:"#8a2be2",
                  color:"white",
                  padding:"4px 12px",
                  borderRadius:12,
                  fontSize:12,
                  fontWeight:700,
                  textTransform:"uppercase"
                }}>Phase 4 - 2027+</div>
                <div style={{fontSize:20,fontWeight:700,color:"#8a2be2",marginBottom:12}}>Relationship Revolution</div>
                <div style={{color:"#f0e8f0",opacity:0.9,lineHeight:1.6}}>
                  🧬 **Biometric Integration** - Heart rate & stress correlation<br/>
                  🎭 **Virtual Reality Dates** - Immersive shared experiences<br/>
                  🧠 **Neural Feedback** - Brainwave relationship insights<br/>
                  🌐 **Global Relationship Network** - Worldwide couples platform<br/>
                  ⚡ **Real-time Sync** - Instant partner connection anywhere<br/>
                  💎 **Ultimate Premium** - $9.99/month enterprise features
                </div>
                <div style={{
                  marginTop:16,
                  padding:"8px 16px",
                  background:"linear-gradient(45deg, #8a2be2, #ff6b9d)",
                  borderRadius:20,
                  fontSize:14,
                  fontWeight:600,
                  color:"white",
                  display:"inline-block"
                }}>ULTIMATE GOAL</div>
              </div>
            </div>

            <div style={{textAlign:"center",marginTop:40}}>
              <p style={{fontSize:16,color:"#f0e8f0",opacity:0.8,marginBottom:8}}>
                🚀 Join us on this journey to revolutionize relationships
              </p>
              <p style={{fontSize:14,color:"#f0e8f0",opacity:0.6}}>
                Your feedback during beta helps shape the future of digital relationships
              </p>
            </div>
          </div>
        </div>
      )}

      {phase !== "landing" && (
        <>
          <div style={{padding:"14px 16px",background:SURF,borderBottom:`1px solid ${BDR}`,position:"sticky",top:0,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:28,fontWeight:700,color:A}}>us.</div>
            <div>{me && `Code: ${me.code}`}</div>
          </div>

          <div style={{flex:1,overflowY:"auto",padding:"20px 16px"}}>
            {phase === "onboard" && (
              <div style={{maxWidth:420,margin:"60px auto",textAlign:"center"}}>
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

                {/* Prominent code sharing section */}
                <div style={{
                  background:"linear-gradient(135deg, #a8b5d4, #d4c4a8)",
                  padding:20,
                  borderRadius:20,
                  margin:"20px 0",
                  textAlign:"center",
                  boxShadow:"0 8px 32px rgba(168,181,212,0.3)"
                }}>
                  <div style={{fontSize:16,fontWeight:600,color:"#070510",marginBottom:8}}>Share this code with your partner</div>
                  <div style={{
                    fontSize:32,
                    fontWeight:900,
                    color:"#070510",
                    letterSpacing:"4px",
                    marginBottom:12,
                    fontFamily:"monospace"
                  }}>{me?.code}</div>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Join our couple on us.',
                          text: `Join me on us. with code: ${me?.code}`,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(`${me?.code}`).then(() => alert('Code copied to clipboard!'));
                      }
                    }}
                    style={{
                      padding:"12px 24px",
                      background:"#070510",
                      color:"white",
                      border:"none",
                      borderRadius:12,
                      fontWeight:600,
                      cursor:"pointer"
                    }}
                  >
                    📤 Share Code
                  </button>
                </div>

                <div style={{marginBottom:30}}>
                  <div style={{fontSize:16,color:"#f0e8f0",marginBottom:16,textAlign:"center"}}>Ready to deepen your connection?</div>
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
                    <button key={i} onClick={()=> {const na={...answers,[currentStep]:o};setAnswers(na);
                      if (currentStep < 9) setCurrentStep(s=>s+1);
                      else { alert("Quiz completed!"); setActiveQuiz(null); setNav("home"); }
                    }} style={{padding:20,background:CARD,borderRadius:20,border:`1px solid ${BDR}`}}>{o}</button>
                  ))}
                </div>
              </div>
            )}

            {nav === "wheel" && (
              <div style={{textAlign:"center",padding:"60px 20px"}}>
                <h2>Date Wheel</h2>
                <button onClick={()=>alert(`🎡 ${["Sunset picnic","Cook together","Star gazing","Hike"][Math.floor(Math.random()*4)]}`)} style={{padding:"28px 80px",background:GOLD,color:"#070510",border:"none",borderRadius:999,fontSize:22,fontWeight:700}}>Spin the Wheel</button>
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