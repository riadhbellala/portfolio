import { useRef, useEffect, forwardRef, useState, useCallback } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";

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

const LETTERS = ["R","I","A","D","H"];

const Hero = forwardRef(function Hero({ isMobile }, ref) {
  const bp       = useBreakpoint();
  const isTablet = bp === "tablet";

  const lettersRef    = useRef([]);
  const bottomRowRef  = useRef(null);
  const glowRef       = useRef(null);
  const cursorRingRef = useRef(null);
  const subtitleRef   = useRef(null);
  const lineRef       = useRef(null);
  const taglineRef    = useRef(null);
  const hasEntered    = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasEntered.current) return;
      hasEntered.current = true;
      runEntrance();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  function runEntrance() {
    lettersRef.current.forEach((el) => {
      if (!el) return;
      gsap.set(el, { opacity:1, y:140, rotateX:-80, transformOrigin:"50% 100%" });
    });
    gsap.set(lineRef.current,     { scaleX:0, transformOrigin:"left" });
    gsap.set(subtitleRef.current, { opacity:0, y:10 });
    gsap.set(taglineRef.current,  { opacity:0, x:-20 });
    gsap.set(bottomRowRef.current,{ opacity:0, y:24 });

    const tl = gsap.timeline();
    tl.to(lettersRef.current, {
      y:0, rotateX:0,
      duration:1.1, ease:"power4.out",
      stagger:{ each:0.07, from:"start" },
    });
    tl.to(lineRef.current,     { scaleX:1, duration:0.7, ease:"power3.inOut" }, "-=0.5");
    tl.to(subtitleRef.current, { opacity:1, y:0, duration:0.7, ease:"power3.out" }, "-=0.4");
    tl.to(taglineRef.current,  { opacity:1, x:0, duration:0.6, ease:"power3.out" }, "-=0.5");
    tl.to(bottomRowRef.current,{ opacity:1, y:0, duration:0.7, ease:"power3.out" }, "-=0.4");
  }

  useEffect(() => {
    if (isMobile) return;
    const section = ref?.current;
    const onMove = (e) => {
      gsap.to(glowRef.current,       { x:e.clientX, y:e.clientY, duration:2,   ease:"power2.out" });
      gsap.to(cursorRingRef.current, { x:e.clientX, y:e.clientY, duration:0.5, ease:"power2.out" });
      lettersRef.current.forEach((el) => {
        if (!el) return;
        const r  = el.getBoundingClientRect();
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const str = Math.max(0, 1 - Math.hypot(dx,dy) / 320) * 0.05;
        gsap.to(el, { x:dx*str, y:dy*str, duration:0.9, ease:"power2.out" });
      });
    };
    const onLeave = () =>
      lettersRef.current.forEach(el => el && gsap.to(el, { x:0, y:0, duration:1.0, ease:"elastic.out(1,0.4)" }));
    window.addEventListener("mousemove", onMove);
    section?.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      section?.removeEventListener("mouseleave", onLeave);
    };
  }, [isMobile, ref]);

  const onLetterEnter = (e) => {
    if (isMobile) return;
    e.currentTarget.style.color = "#2C5584";
    e.currentTarget.style.webkitTextStroke = "1px #2C5584";
    gsap.to(e.currentTarget, { scale:1.08, duration:0.3, ease:"power2.out" });
    gsap.to(cursorRingRef.current, { scale:2.5, duration:0.3 });
  };
  const onLetterLeave = (e) => {
    if (isMobile) return;
    e.currentTarget.style.color = "transparent";
    e.currentTarget.style.webkitTextStroke = "1px rgba(255,255,255,0.72)";
    gsap.to(e.currentTarget, { scale:1, duration:0.8, ease:"elastic.out(1,0.4)" });
    gsap.to(cursorRingRef.current, { scale:1, duration:0.3 });
  };

  // ── Release the body scroll-lock that Home.jsx sets, before navigating ──
  const handleNavigate = () => {
    document.body.style.overflow    = "";
    document.body.style.height      = "";
    document.documentElement.style.overflow = "";
  };

  const ml = { fontSize:"9px",  letterSpacing:"0.45em", textTransform:"uppercase", color:"rgba(255,255,255,0.22)", marginBottom:"6px" };
  const mv = { fontSize:"11px", letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(255,255,255,0.58)" };

  return (
    <>
      {!isMobile && !isTablet && (
        <div ref={cursorRingRef} aria-hidden="true" style={{
          position:"fixed", top:0, left:0, width:"36px", height:"36px", borderRadius:"50%",
          border:"1px solid rgba(44,85,132,0.5)", pointerEvents:"none",
          zIndex:9998, transform:"translate(-50%,-50%)",
        }}/>
      )}

      <section ref={ref} style={{
        position:"fixed", inset:0, width:"100%", height:"100vh",
        background:"#080808", overflow:"hidden",
        display:"flex", flexDirection:"column",
        justifyContent:"center",
        paddingTop:"0",
        alignItems:    isTablet||isMobile ? "center"   : "flex-start",
        paddingLeft:   isTablet||isMobile ? "20px"     : "8%",
        paddingRight:  isTablet||isMobile ? "20px"     : "52%",
        cursor:        isMobile||isTablet ? "auto"     : "none",
        perspective:   "1000px",
      }}>

        {/* Ambient glow — follows cursor */}
        <div ref={glowRef} aria-hidden="true" style={{
          position:"absolute", top:0, left:0,
          width:"700px", height:"700px", borderRadius:"50%",
          background:"radial-gradient(circle, rgba(44,85,132,0.12) 0%, transparent 65%)",
          pointerEvents:"none", filter:"blur(60px)", zIndex:0,
          transform:"translate(-50%,-50%)",
        }}/>

        {/* Corner brackets */}
        {[
          { top:"24px",    left:"24px",  borderTop:"1px solid rgba(44,85,132,0.28)",    borderLeft:"1px solid rgba(44,85,132,0.28)"  },
          { top:"24px",    right:"24px", borderTop:"1px solid rgba(44,85,132,0.28)",    borderRight:"1px solid rgba(44,85,132,0.28)" },
          { bottom:"24px", left:"24px",  borderBottom:"1px solid rgba(44,85,132,0.28)", borderLeft:"1px solid rgba(44,85,132,0.28)"  },
          { bottom:"24px", right:"24px", borderBottom:"1px solid rgba(44,85,132,0.28)", borderRight:"1px solid rgba(44,85,132,0.28)" },
        ].map((s,i) => (
          <div key={i} aria-hidden="true" style={{ position:"absolute", width:"20px", height:"20px", pointerEvents:"none", zIndex:1, ...s }}/>
        ))}

        {/* Big letters */}
        <div style={{
          display:"flex",
          justifyContent: isTablet||isMobile ? "center" : "flex-start",
          alignItems:"center",
          gap:"clamp(2px,0.6vw,10px)",
          position:"relative", zIndex:3,
          perspective:"800px",
          overflow:"visible",
        }}>
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={(el) => (lettersRef.current[i] = el)}
              style={{
                display:"inline-block",
                fontSize: isMobile
                  ? "clamp(3.8rem,20vw,6rem)"
                  : isTablet
                  ? "clamp(4rem,14vw,9rem)"
                  : "clamp(5rem,12vw,13rem)",
                fontWeight:900, lineHeight:0.88, letterSpacing:"-0.04em",
                color:"transparent",
                WebkitTextStroke: isMobile ? "1px rgba(255,255,255,0.6)" : "1px rgba(255,255,255,0.75)",
                userSelect:"none", willChange:"transform",
                transition:"color 0.2s, -webkit-text-stroke 0.2s",
                transformStyle:"preserve-3d",
              }}
              onMouseEnter={onLetterEnter}
              onMouseLeave={onLetterLeave}
            >{letter}</span>
          ))}
        </div>

        {/* Thin rule */}
        <div ref={lineRef} style={{
          width:"clamp(180px,40vw,420px)", height:"1px",
          background:"linear-gradient(90deg,rgba(44,85,132,0.8),rgba(44,85,132,0.2),transparent)",
          marginTop:"16px", zIndex:3,
        }}/>

        {/* Subtitle */}
        <div style={{ display:"flex", alignItems:"center", gap:"24px", marginTop:"18px", zIndex:3 }}>
          <p ref={subtitleRef} style={{
            fontSize: isMobile?"10px":isTablet?"10px":"12px",
            letterSpacing:"0.48em", textTransform:"uppercase",
            color:"rgba(255,255,255,0.22)", margin:0,
          }}>Web Developer</p>
          <span ref={taglineRef} style={{
            width:"4px", height:"4px", borderRadius:"50%",
            background:"rgba(44,85,132,0.8)", display:"inline-block",
          }}/>
        </div>

        {/* Bottom row */}
        <div ref={bottomRowRef} style={{
          position:"absolute",
          bottom: isMobile?"16px":isTablet?"80px":"88px",
          left:0, right:0,
          padding: isMobile?"0 20px":isTablet?"0 32px":"0 52px",
          display:"flex",
          justifyContent: isMobile?"center":"space-between",
          alignItems:"flex-end", zIndex:3,
        }}>
          {!isMobile && (
            <div>
              <p style={ml}>Based in</p>
              <p style={mv}>Algeria</p>
            </div>
          )}

          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"8px" }}>
            <div style={{
              width:"1px",
              height: isMobile?"36px":"52px",
              background:"linear-gradient(to bottom, rgba(44,85,132,0.8), transparent)",
            }}/>
          </div>

          {!isMobile && (
            <div style={{ textAlign:"right" }}>
              <p style={ml}>Work</p>
              <Link
                to="/projects"
                onClick={handleNavigate}
                style={{
                  ...mv,
                  textDecoration:"none",
                  display:"inline-flex",
                  alignItems:"center",
                  gap:"8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#2C5584";
                  gsap.to(e.currentTarget, { x:6, duration:0.3, ease:"power2.out" });
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.58)";
                  gsap.to(e.currentTarget, { x:0, duration:0.3 });
                }}
              >
                View Projects <span>→</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
});

export default Hero;