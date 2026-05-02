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

const TOPICS = [
  {id:"all-me",name:"All About Me",emoji:"👤"},
  {id:"all-you",name:"All About You",emoji:"❤️"},
  {id:"love",name:"Love & Romance",emoji:"💌"},
  {id:"future",name:"Future Dreams",emoji:"🌠"},
  {id:"favorites",name:"Favorites",emoji:"⭐"},
  {id:"sex",name:"Intimacy & Sex",emoji:"🔥"},
  {id:"animals",name:"Animals & Pets",emoji:"🐾"}
];

const QZ = {
  "all-me": {title:"All About Me",emoji:"👤",questions:[
    {q:"My favorite way to spend a weekend is...",opts:["Reading in bed","Hiking outdoors","Cooking new recipes","Gaming or movies","Social events"]},
    {q:"The song that always makes me emotional is...",opts:["Something nostalgic","A love song","An upbeat anthem"]},
    {q:"If I could travel anywhere right now, I'd go to...",opts:["A tropical beach","European city","Mountain cabin","Adventure destination"]},
    {q:"My go-to comfort food is...",opts:["Pizza","Ice cream","Pasta","Burgers","Salad"]},
    {q:"When I'm stressed, I prefer to...",opts:["Talk it out","Be alone","Exercise","Watch shows","Eat chocolate"]},
    {q:"My dream job would be...",opts:["Artist","Chef","Teacher","Entrepreneur","Scientist"]},
    {q:"The best gift I've ever received was...",opts:["Something handmade","Jewelry","Experience","Money","A letter"]},
    {q:"My favorite season is...",opts:["Spring","Summer","Fall","Winter"]},
    {q:"I feel most at peace when...",opts:["Reading","Nature","Music","Cooking","With you"]},
    {q:"My biggest fear is...",opts:["Heights","Spiders","Public speaking","Being alone","Failure"]}
  ]},
  "all-you": {title:"All About You",emoji:"❤️",questions:[
    {q:"What was your favorite childhood memory?",opts:["Family vacations","Playing with friends","Special birthday","School activities","Sports"]},
    {q:"What's your most embarrassing moment?",opts:["Public speaking fail","Wardrobe malfunction","Dance floor disaster","Social awkwardness","Tech fail"]},
    {q:"If you won the lottery tomorrow, what's the first thing you'd do?",opts:["Quit job","Travel the world","Buy a house","Start a business","Give it away"]},
    {q:"What's your hidden talent?",opts:["Singing","Drawing","Dancing","Cooking","Sports"]},
    {q:"What's your favorite way to be comforted?",opts:["Hugs","Words","Food","Space","Activities"]},
    {q:"What's the most spontaneous thing you've done?",opts:["Last minute trip","Tattoo","Quit job","Public proposal","Skydiving"]},
    {q:"What's your favorite physical feature about yourself?",opts:["Eyes","Smile","Hair","Build","Hands"]},
    {q:"What's your dream vacation?",opts:["Beach resort","City exploration","Mountain retreat","Adventure trip","Cruise"]},
    {q:"What's your love language?",opts:["Words","Touch","Gifts","Time","Service"]},
    {q:"What's your biggest dream?",opts:["Family","Career","Travel","Business","Impact"]}
  ]},
  "love": {title:"Love & Romance",emoji:"💌",questions:[
    {q:"The most romantic gesture for me is...",opts:["Love notes","Quality time","Surprise gifts","Public affection","Acts of service"]},
    {q:"My ideal date night is...",opts:["Home cooked dinner","Fancy restaurant","Picnic","Movie night","Adventure"]},
    {q:"I feel most loved when you...",opts:["Compliment me","Hold my hand","Plan surprises","Listen deeply","Help me"]},
    {q:"My favorite way to show affection is...",opts:["Words","Touch","Gifts","Time","Service"]},
    {q:"The sweetest thing you've done for me is...",opts:["Remembered something","Surprised me","Listened","Helped me","Said something"]},
    {q:"I dream of us...",opts:["Traveling together","Building a home","Growing old","Having adventures","Being best friends"]},
    {q:"What makes our relationship special is...",opts:["Trust","Laughter","Communication","Support","Passion"]},
    {q:"My favorite memory of us is...",opts:["First date","Trip together","Inside joke","Surprise","Everyday moment"]},
    {q:"I love that you...",opts:["Make me laugh","Support me","Challenge me","Comfort me","Understand me"]},
    {q:"Forever means to me...",opts:["Commitment","Growth","Adventure","Security","Love"]}
  ]},
  "future": {title:"Future Dreams",emoji:"🌠",questions:[
    {q:"In 5 years, I see us...",opts:["Married","Traveling","With kids","Building business","Happy home"]},
    {q:"My biggest career goal is...",opts:["Leadership","Creativity","Impact","Stability","Freedom"]},
    {q:"I want our home to feel...",opts:["Cozy","Modern","Spacious","Welcoming","Adventurous"]},
    {q:"Family means to me...",opts:["Close relationships","Traditions","Support","Growth","Love"]},
    {q:"I dream of our wedding being...",opts:["Intimate","Extravagant","Destination","Traditional","Unique"]},
    {q:"Retirement looks like...",opts:["Travel","Hobbies","Family","Community","Peace"]},
    {q:"I want to teach our kids...",opts:["Kindness","Ambition","Creativity","Resilience","Curiosity"]},
    {q:"Our perfect weekend is...",opts:["Adventure","Relaxation","Social","Home projects","Exploration"]},
    {q:"I want to grow old...",opts:["With you","Happily","Adventurously","Peacefully","Actively"]},
    {q:"Legacy I want to leave is...",opts:["Love","Impact","Family","Knowledge","Memories"]}
  ]},
  "favorites": {title:"Favorites",emoji:"⭐",questions:[
    {q:"Favorite color?",opts:["Blue","Red","Green","Purple","Yellow","Pink","Black","White"]},
    {q:"Favorite movie genre?",opts:["Romance","Action","Comedy","Drama","Horror","Sci-fi","Documentary"]},
    {q:"Favorite music genre?",opts:["Pop","Rock","Jazz","Classical","Hip-hop","Country","Electronic"]},
    {q:"Favorite food?",opts:["Italian","Mexican","Asian","American","Mediterranean","French","Indian"]},
    {q:"Favorite dessert?",opts:["Chocolate","Ice cream","Cake","Cookies","Pie","Fruit","Cheesecake"]},
    {q:"Favorite season?",opts:["Spring","Summer","Fall","Winter"]},
    {q:"Favorite time of day?",opts:["Morning","Afternoon","Evening","Night"]},
    {q:"Favorite hobby?",opts:["Reading","Sports","Cooking","Gaming","Art","Music","Travel"]},
    {q:"Favorite animal?",opts:["Dog","Cat","Horse","Bird","Fish","Rabbit","Other"]},
    {q:"Favorite way to relax?",opts:["Reading","Music","Nature","Exercise","TV","Meditation","Bathing"]}
  ]},
  "sex": {title:"Intimacy & Sex",emoji:"🔥",questions:[
    {q:"My love language in intimacy is...",opts:["Words","Touch","Gifts","Time","Service"]},
    {q:"I feel most desired when...",opts:["You compliment me","Touch me","Look at me","Whisper to me","Surprise me"]},
    {q:"My favorite type of kiss is...",opts:["Soft and gentle","Passionate","Playful","Long and deep","Quick pecks"]},
    {q:"What turns me on most is...",opts:["Confidence","Tenderness","Humor","Intelligence","Physical touch"]},
    {q:"My ideal foreplay involves...",opts:["Massage","Conversation","Teasing","Direct touch","Sensual buildup"]},
    {q:"I prefer intimacy to be...",opts:["Romantic","Passionate","Playful","Tender","Adventurous"]},
    {q:"After intimacy, I love...",opts:["Cuddling","Talking","Sleeping","Eating","Showering"]},
    {q:"My biggest turn-off is...",opts:["Rushed","Silent","Rough","Distracted","Uncomfortable"]},
    {q:"I feel most connected when...",opts:["Eye contact","Whispers","Slow pace","Laughter","Deep kisses"]},
    {q:"What I'd love to try is...",opts:["New positions","Roleplay","Toys","Locations","Extended sessions"]}
  ]},
  "animals": {title:"Animals & Pets",emoji:"🐾",questions:[
    {q:"If I could have any pet, I'd choose...",opts:["Dog","Cat","Bird","Fish","Horse","Rabbit","Reptile","Other"]},
    {q:"My favorite animal at the zoo is...",opts:["Lions","Monkeys","Elephants","Penguins","Giraffes","Tigers","Bears"]},
    {q:"As a child, my favorite stuffed animal was...",opts:["Bear","Dog","Cat","Rabbit","Dinosaur","Unicorn","Other"]},
    {q:"I think pets make great...",opts:["Companions","Family members","Therapists","Protectors","Entertainers"]},
    {q:"My dream pet would be...",opts:["Rescue animal","Purebred","Exotic","Farm animal","Wild animal (tamed)","Multiple pets"]},
    {q:"I love animals because they...",opts:["Are loyal","Make me laugh","Are cuddly","Teach patience","Are beautiful"]},
    {q:"The cutest animal behavior is...",opts:["Puppies playing","Cats purring","Birds singing","Fish swimming","Horses running"]},
    {q:"I'd volunteer at...",opts:["Animal shelter","Zoo","Farm sanctuary","Wildlife rehab","Vet clinic"]},
    {q:"My favorite animal movie is...",opts:["Finding Nemo","The Lion King","Babe","Black Beauty","March of the Penguins"]},
    {q:"If I were an animal, I'd be...",opts:["Dog","Cat","Horse","Bird","Fish","Bear","Wolf","Other"]}
  ]}
};

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
  const [showCoinToss, setShowCoinToss] = useState(false);
  const [coinResult, setCoinResult] = useState(null);

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
    setShowCoinToss(true);
    setTimeout(() => {
      const result = Math.random() > 0.5 ? "Heads" : "Tails";
      setCoinResult(result);
      alert(`Coin landed on ${result}! Winner picks the topic.`);
      setShowCoinToss(false);
      // In real version, winner chooses topic
      setNav("quiz");
    }, 1500);
  };

  const startQuiz = (topic) => {
    // Load 10 questions for topic
    const quiz = QZ[topic.id];
    setActiveQuiz(quiz);
    setCurrentStep(0);
    setAnswers({});
  };

  const answer = (val) => {
    const na = {...answers, [currentStep]: val};
    setAnswers(na);
    if (currentStep < 9) setCurrentStep(s => s+1);
    else {
      sSet(`quiz-${activeQuiz.title}-${me.role}`, na, true);
      alert("Quiz completed! Share with partner for scoring & comparison.");
      setActiveQuiz(null);
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
      <div style={{padding:"14px 16px",background:SURF,borderBottom:`1px solid ${BDR}`,position:"sticky",top:0,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:28,fontWeight:700,color:A}}>us.</div>
        <div style={{fontSize:14}}>{me && `Code: ${me.code}`}</div>
      </div>

      {!couple?.user2name && me && <div style={{padding:12,background:"#e8a59822",textAlign:"center"}}>Share <strong>{me.code}</strong> with your partner</div>}

      <div style={{flex:1,overflowY:"auto",padding:"20px 16px"}}>
        {phase === "onboard" && (
          <div style={{maxWidth:420,margin:"60px auto",textAlign:"center"}}>
            <div style={{fontSize:80,color:A}}>us.</div>
            <p>Premium Couple Experience</p>
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
            <div style={{padding:16,background:CARD,borderRadius:16,margin: "20px 0",border:`1px solid ${BDR}`}}>
              <strong>Your code: </strong><span style={{fontSize:22,letterSpacing:".1em"}}>{me?.code}</span>
            </div>
            <button onClick={startCoinToss} style={{width:"100%",padding:20,background:GOLD,color:"#070510",borderRadius:20,fontWeight:700,fontSize:18,marginBottom:20}}>🎲 Start Quiz Session (Coin Toss)</button>
            <button onClick={()=>setNav("wheel")} style={{width:"100%",padding:20,background:CARD,borderRadius:20,marginBottom:12}}>🎡 Date Wheel</button>
            <button onClick={()=>setNav("rescue")} style={{width:"100%",padding:20,background:CARD,borderRadius:20}}>⚕️ Dr. Rescue</button>
            <button onClick={logout} style={{marginTop:40,color:"#e87c7c",width:"100%",padding:14}}>Logout</button>
          </div>
        )}

        {nav === "quiz" && !activeQuiz && (
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
            <button onClick={()=>alert(`🎡 ${["Sunset picnic","Cook a new recipe together","Star gazing","Dance class","Museum visit","Morning hike","Wine & paint night","Midnight drive","Farmers market","Board game night","Road trip","Spa day at home","Watch the sunrise","Pottery class","Karaoke night","Bookstore date","Drive-in movie","Escape room","Concert","Breakfast in bed","Botanical garden","Kayaking"][Math.floor(Math.random()*22)]}`)} style={{padding:"28px 80px",background:GOLD,color:"#070510",border:"none",borderRadius:999,fontSize:22,fontWeight:700}}>Spin the Wheel</button>
          </div>
        )}
      </div>

      {phase === "paired" && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:SURF,borderTop:`1px solid ${BDR}`,display:"flex",padding:"8px 0",zIndex:100}}>
          {[{id:"home",icon:"🏠"},{id:"quiz",icon:"💡"},{id:"wheel",icon:"🎡"}].map(item => (
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