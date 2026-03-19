import { useRef, useEffect, forwardRef, useState, useCallback } from "react";
import gsap from "gsap";

function useBreakpoint() {
  const get = useCallback(() => {
    const w = window.innerWidth;
    if (w < 640) return "mobile";
    if (w < 1024) return "tablet";
    return "desktop";
  }, []);
  const [bp, setBp] = useState(get);
  useEffect(() => {
    const h = () => setBp(get());
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [get]);
  return bp;
}

const WORDS = [
  {word:"Creativity,",accent:true}, {word:"thinking",accent:false},{word:"out",accent:false},
  {word:"of",accent:false},{word:"the",accent:false},{word:"box,",accent:false},
  {word:"reliability",accent:true},{word:"—",accent:false},{word:"gathered",accent:true},
  {word:"in",accent:false},{word:"one",accent:false},{word:"place.",accent:true},
];

const STATS = [
  {value:"2+",  label:"Years of experience"},
  {value:"20+", label:"Projects completed"},
  {value:"∞",   label:"Dedication"},
];

const About = forwardRef(function About({ isMobile }, ref) {
  const bp        = useBreakpoint();
  const isTablet  = bp === "tablet";
  const indexRef  = useRef(null);
  const labelRef  = useRef(null);
  const wordRefs  = useRef([]);
  const statsRef  = useRef([]);
  const divRef    = useRef(null);
  const photoAreaRef = useRef(null);
  const hasEntered   = useRef(false);

  // Stable scatter offsets
  const scatter = useRef(
    WORDS.map(() => ({
      x: (Math.random()-0.5)*500,
      y: (Math.random()-0.5)*300,
      r: (Math.random()-0.5)*60,
      s: 0.2+Math.random()*0.5,
    }))
  ).current;

  useEffect(() => {
    gsap.set(indexRef.current,  { opacity:0, x:-30 });
    gsap.set(labelRef.current,  { opacity:0, y:20 });
    gsap.set(divRef.current,    { scaleX:0, transformOrigin:"left" });
    gsap.set(statsRef.current,  { opacity:0, y:40 });
    gsap.set(photoAreaRef.current, { opacity:0, x:60 });
    wordRefs.current.forEach((el,i) => {
      if (!el) return;
      gsap.set(el, { opacity:0, x:scatter[i].x, y:scatter[i].y, rotation:scatter[i].r, scale:scatter[i].s });
    });
  }, [scatter]);

  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    const obs = new MutationObserver(() => {
      const visible = el.style.visibility !== "hidden" && parseFloat(el.style.opacity||"0") > 0.5;
      if (visible && !hasEntered.current) {
        hasEntered.current = true;
        playEntrance();
      }
    });
    obs.observe(el, { attributes:true, attributeFilter:["style"] });
    return () => obs.disconnect();
  }, [ref]);

  function playEntrance() {
    const tl = gsap.timeline();

    tl.to(indexRef.current, { opacity:1, x:0, duration:0.5, ease:"power3.out" });

    tl.to(wordRefs.current, {
      opacity:1, x:0, y:0, rotation:0, scale:1,
      duration:1.0, ease:"power4.out",
      stagger:{ each:0.035, from:"random" },
    }, "-=0.1");

    tl.to(divRef.current, { scaleX:1, duration:0.6, ease:"power2.inOut" }, "-=0.5");

    tl.to(labelRef.current, { opacity:1, y:0, duration:0.5, ease:"power3.out" }, "-=0.4");

    tl.to(photoAreaRef.current, { opacity:1, x:0, duration:0.8, ease:"power3.out" }, "-=0.8");

    tl.to(statsRef.current, {
      opacity:1, y:0, duration:0.6, ease:"back.out(1.5)",
      stagger:0.1,
    }, "-=0.4");
  }

  return (
    <section ref={ref} style={{
      position:"fixed",inset:0,width:"100%",height:"100vh",
      background:"#080808",overflow:"hidden",
      display:"flex",flexDirection:"column",
      justifyContent:"center",
      padding:isMobile?"0 24px":isTablet?"0 48px":"0 8%",
    }}>
      {/* Subtle grid */}
      <div aria-hidden="true" style={{
        position:"absolute",inset:0,zIndex:0,pointerEvents:"none",
        backgroundImage:`linear-gradient(rgba(44,85,132,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(44,85,132,0.035) 1px,transparent 1px)`,
        backgroundSize:"80px 80px",
      }}/>

      {/* Two-column layout on desktop */}
      <div style={{
        display:"flex",
        flexDirection:isMobile||isTablet?"column":"row",
        alignItems:isMobile||isTablet?"center":"flex-start",
        gap:isMobile?"32px":isTablet?"40px":"8%",
        zIndex:1,
        width:"100%",
        maxWidth:"1100px",
      }}>

        {/* Left: headline words */}
        <div style={{ flex:isMobile||isTablet?"none":"1 1 55%", textAlign:isMobile||isTablet?"center":"left" }}>
          <span ref={labelRef} style={{
            fontSize:"9px",letterSpacing:"0.55em",textTransform:"uppercase",
            color:"#2C5584",marginBottom:"20px",display:"block",
          }}>About me</span>

          <div style={{
            display:"flex",flexWrap:"wrap",
            justifyContent:isMobile||isTablet?"center":"flex-start",
            alignItems:"baseline",
            gap:"clamp(4px,1vw,12px)",
            maxWidth:isMobile?"360px":isTablet?"580px":"100%",
          }}>
            {WORDS.map((item, i) => (
              <span key={i} ref={(el) => (wordRefs.current[i] = el)} style={{
                display:"inline-block",
                fontSize:isMobile?"clamp(1.4rem,6vw,2.2rem)":isTablet?"clamp(1.5rem,4vw,2.8rem)":"clamp(1.8rem,3.2vw,3.6rem)",
                fontWeight:700,lineHeight:1.0,letterSpacing:"-0.025em",
                color:item.accent?"#2C5584":"rgba(255,255,255,0.9)",
                willChange:"transform,opacity",
              }}>{item.word}</span>
            ))}
          </div>

          {/* Divider */}
          <div ref={divRef} style={{
            width:isMobile?"100%":"240px",height:"1px",
            background:"linear-gradient(90deg,rgba(44,85,132,0.6),transparent)",
            margin:isMobile?"24px auto 0":"28px 0 0",
          }}/>
        </div>

        {/* Right: stats + description */}
        <div ref={photoAreaRef} style={{
          flex:isMobile||isTablet?"none":"0 0 auto",
          display:"flex",flexDirection:"column",
          gap:isMobile?"20px":"28px",
          alignItems:isMobile||isTablet?"center":"flex-start",
        }}>
          {/* Brief bio */}
          <p style={{
            fontSize:isMobile?"11px":"13px",
            lineHeight:1.8,
            letterSpacing:"0.02em",
            color:"rgba(255,255,255,0.35)",
            maxWidth:"320px",
            textAlign:isMobile||isTablet?"center":"left",
            margin:0,
          }}>
            Third-year CS student from Algeria,<br/>
            crafting interfaces that feel alive.<br/>
            Passionate about motion, code & design.
          </p>

          {/* Stats row */}
          <div style={{
            display:"flex",
            gap:isMobile?"clamp(16px,5vw,28px)":"clamp(24px,3vw,40px)",
            flexWrap:"wrap",
            justifyContent:isMobile||isTablet?"center":"flex-start",
          }}>
            {STATS.map((s, i) => (
              <div key={i} ref={(el) => (statsRef.current[i] = el)} style={{
                display:"flex",flexDirection:"column",gap:"4px",
                borderLeft:i>0?"1px solid rgba(255,255,255,0.06)":"none",
                paddingLeft:i>0?"clamp(16px,3vw,32px)":"0",
              }}>
                <span style={{
                  fontSize:"clamp(1.6rem,3vw,2.4rem)",
                  fontWeight:800,letterSpacing:"-0.04em",
                  color:"#fff",lineHeight:1,
                }}>{s.value}</span>
                <span style={{
                  fontSize:"8px",letterSpacing:"0.3em",textTransform:"uppercase",
                  color:"rgba(255,255,255,0.2)",
                }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default About;