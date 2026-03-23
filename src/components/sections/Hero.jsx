import { useRef, useEffect, forwardRef, useState, useCallback } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";

/* ─── breakpoint hook ─── */
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

/* ─── constants ─── */
const LETTERS = ["R", "I", "A", "D", "H"];

/* ═══════════════════════════ FULL-SCREEN CODE LOADER ═══════════════════════════ */
function CodeLoader({ onDone }) {
  const overlayRef    = useRef(null);
  const canvasRef     = useRef(null);
  const centerRef     = useRef(null);
  const progressRef   = useRef(null);
  const pctRef        = useRef(null);
  const statusRef     = useRef(null);
  const glitchRef     = useRef(null);

  const STATUS = [
    { pct: 0,   text: "INITIALIZING RUNTIME" },
    { pct: 18,  text: "LOADING IDENTITY MODULE" },
    { pct: 35,  text: "COMPILING SKILL STACK" },
    { pct: 55,  text: "RESOLVING DEPENDENCIES" },
    { pct: 72,  text: "BUILDING PORTFOLIO" },
    { pct: 88,  text: "BUNDLING INTERFACE" },
    { pct: 100, text: "LAUNCH READY" },
  ];

  /* ── Full-screen matrix rain canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Code-flavoured characters to rain down
    const POOL = "import{export}const async function return await=>[](){}typescript react next gsap void null true false 01// /* */ &&||!======>_riadh_bellala_frontend engineer algeria #2C5584 #4fc3f7 render build deploy compile init load";
    const chars = POOL.split("");

    const FONT_SIZE = 13;
    let cols  = Math.floor(window.innerWidth / FONT_SIZE);
    let drops = Array.from({ length: cols }, () => Math.random() * -60);
    const speeds = Array.from({ length: cols }, () => 0.25 + Math.random() * 0.6);

    let alive = true;

    function draw() {
      if (!alive) return;

      // Fade trail
      ctx.fillStyle = "rgba(5,5,5,0.16)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x    = i * FONT_SIZE;
        const y    = drops[i] * FONT_SIZE;

        // Lead glyph — bright
        ctx.font      = `${FONT_SIZE}px "Fira Code", monospace`;
        ctx.fillStyle = "rgba(200,230,255,0.88)";
        ctx.fillText(char, x, y);

        // Second glyph fading to blue
        const trail = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = `rgba(44,85,132,0.22)`;
        ctx.fillText(trail, x, y - FONT_SIZE);

        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += speeds[i];
      }

      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      alive = false;
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ── Center panel GSAP timeline ── */
  useEffect(() => {
    const tl = gsap.timeline();

    // Reveal card
    tl.fromTo(
      centerRef.current,
      { opacity: 0, y: 20, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
      0.35
    );

    // Animate progress bar through steps
    STATUS.forEach(({ pct, text }, i) => {
      const at = 0.5 + i * 0.55;
      tl.to(progressRef.current, { width: `${pct}%`, duration: 0.45, ease: "power2.out" }, at);
      tl.call(() => {
        if (pctRef.current)    pctRef.current.textContent    = `${pct}%`;
        if (statusRef.current) statusRef.current.textContent = text;
      }, [], at);
    });

    const endT = 0.5 + (STATUS.length - 1) * 0.55 + 0.6;

    // Glitch flashes
    [0, 0.1, 0.22].forEach((offset, i) => {
      tl.to(glitchRef.current, { opacity: i % 2 === 0 ? 0.6 : 0, duration: 0.05 }, endT + offset);
    });
    tl.set(glitchRef.current, { opacity: 0 }, endT + 0.35);

    // Wipe overlay upward
    tl.to(overlayRef.current, {
      clipPath: "inset(0 0 100% 0)",
      duration: 0.85,
      ease: "power4.inOut",
    }, endT + 0.45);

    tl.call(onDone, [], endT + 0.45 + 0.85);
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#050505",
        clipPath: "inset(0 0 0% 0)",
        overflow: "hidden",
        fontFamily: "'Fira Code','Cascadia Code','Courier New',monospace",
      }}
    >
      {/* Full-screen rain */}
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} />

      {/* Radial vignette so centre card is legible */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 55% 55% at 50% 50%, transparent 25%, rgba(5,5,5,0.92) 100%)",
      }}/>

      {/* Glitch colour flash */}
      <div ref={glitchRef} style={{
        position:"absolute", inset:0, opacity:0, pointerEvents:"none",
        background:"rgba(44,85,132,0.4)", mixBlendMode:"screen",
      }}/>

      {/* ─── Centre card ─── */}
      <div ref={centerRef} style={{
        position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
        width:"min(540px,90vw)",
        opacity:0,
      }}>

        {/* Chrome title bar */}
        <div style={{
          background:"rgba(10,14,22,0.97)",
          border:"1px solid rgba(44,85,132,0.55)",
          borderBottom:"none",
          borderRadius:"8px 8px 0 0",
          padding:"10px 18px",
          display:"flex", alignItems:"center", gap:"14px",
          backdropFilter:"blur(24px)",
        }}>
          <div style={{ display:"flex", gap:"7px" }}>
            {["#ea4335","#fbbc05","#34a853"].map(c=>(
              <div key={c} style={{ width:"10px",height:"10px",borderRadius:"50%",background:c,opacity:0.75 }}/>
            ))}
          </div>
          <span style={{ fontSize:"11px", letterSpacing:"0.18em", color:"rgba(44,85,132,0.85)" }}>
            riadh.dev — <span style={{ color:"rgba(255,255,255,0.22)" }}>compiler.ts</span>
          </span>
          <div style={{ marginLeft:"auto", display:"flex", gap:"12px" }}>
            {["TSC","NODE v20","v2.4.1"].map(t=>(
              <span key={t} style={{ fontSize:"9px", color:"rgba(255,255,255,0.14)", letterSpacing:"0.1em" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Card body */}
        <div style={{
          background:"rgba(8,11,18,0.97)",
          border:"1px solid rgba(44,85,132,0.25)",
          borderTop:"none",
          borderRadius:"0 0 8px 8px",
          padding:"26px 26px 22px",
          backdropFilter:"blur(24px)",
          display:"flex", flexDirection:"column", gap:"22px",
        }}>

          {/* Syntax-highlighted code block */}
          <div style={{ fontSize:"clamp(10px,1.35vw,13px)", lineHeight:"1.85" }}>
            {[
              [<><S c="#ce93d8">import</S> <S c="rgba(255,255,255,0.7)">{`{identity}`}</S> <S c="#ce93d8">from</S> <S c="#a5d6a7">'@core/self'</S></>],
              [<><S c="#ce93d8">import</S> <S c="rgba(255,255,255,0.7)">{`{creativity, precision}`}</S> <S c="#ce93d8">from</S> <S c="#a5d6a7">'@skills/design'</S></>],
              [<><S c="#ce93d8">import</S> <S c="rgba(255,255,255,0.7)">{`{React, GSAP, TypeScript}`}</S> <S c="#ce93d8">from</S> <S c="#a5d6a7">'@stack/frontend'</S></>],
              [""],
              [<><S c="#ce93d8">const</S> <S c="#4fc3f7">developer</S> <S c="rgba(255,255,255,0.4)">=</S> <S c="rgba(255,255,255,0.7)">{`{`}</S></>],
              [<>&nbsp;&nbsp;<S c="rgba(255,255,255,0.38)">name:</S>&nbsp;&nbsp;&nbsp;&nbsp;<S c="#a5d6a7">"Riadh Bellala"</S></>],
              [<>&nbsp;&nbsp;<S c="rgba(255,255,255,0.38)">role:</S>&nbsp;&nbsp;&nbsp;&nbsp;<S c="#a5d6a7">"Frontend Engineer"</S></>],
              [<>&nbsp;&nbsp;<S c="rgba(255,255,255,0.38)">based:</S>&nbsp;&nbsp;&nbsp;<S c="#a5d6a7">"Algeria, DZ"</S></>],
              [<>&nbsp;&nbsp;<S c="rgba(255,255,255,0.38)">stack:</S>&nbsp;&nbsp;&nbsp;<S c="#ffcc80">[Next.js, React, TypeScript, GSAP]</S></>],
              [<>&nbsp;&nbsp;<S c="rgba(255,255,255,0.38)">passion:</S>&nbsp;<S c="#ffcc80">[Animation, Design Systems, UX]</S></>],
              [<><S c="rgba(255,255,255,0.7)">{`}`}</S></>],
            ].map((row, i) => (
              <div key={i} style={{ display:"flex", alignItems:"baseline", minHeight:"1.85em" }}>
                <span style={{
                  width:"30px", flexShrink:0, textAlign:"right", paddingRight:"14px",
                  color:"rgba(44,85,132,0.3)", fontSize:"10px", userSelect:"none",
                }}>
                  {row[0] !== "" ? i+1 : ""}
                </span>
                <span style={{ color:"rgba(255,255,255,0.8)" }}>{row[0]}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{
            height:"1px",
            background:"linear-gradient(90deg,transparent,rgba(44,85,132,0.4),transparent)",
          }}/>

          {/* Progress */}
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <div style={{
                  width:"6px",height:"6px",borderRadius:"50%",
                  background:"#34a853",
                  boxShadow:"0 0 8px rgba(52,168,83,0.9)",
                  animation:"pulse 1.2s ease-in-out infinite",
                }}/>
                <span ref={statusRef} style={{
                  fontSize:"10px", letterSpacing:"0.18em",
                  color:"rgba(255,255,255,0.32)",
                }}>INITIALIZING RUNTIME</span>
              </div>
              <span ref={pctRef} style={{
                fontSize:"13px", letterSpacing:"0.08em",
                color:"rgba(44,85,132,0.85)", fontWeight:700,
              }}>0%</span>
            </div>

            {/* Bar */}
            <div style={{
              height:"3px", background:"rgba(44,85,132,0.12)",
              borderRadius:"2px", overflow:"hidden",
            }}>
              <div ref={progressRef} style={{
                height:"100%", width:"0%",
                background:"linear-gradient(90deg,#2C5584,#4fc3f7)",
                borderRadius:"2px",
                boxShadow:"0 0 14px rgba(79,195,247,0.65)",
              }}/>
            </div>

            {/* Step dots */}
            <div style={{ display:"flex", gap:"5px", justifyContent:"center" }}>
              {STATUS.map((_,i)=>(
                <div key={i} style={{
                  width:"3px",height:"3px",borderRadius:"50%",
                  background:"rgba(44,85,132,0.28)",
                }}/>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.3;transform:scale(0.75)}}`}</style>
    </div>
  );
}

/* Tiny helper for inline syntax colour spans */
function S({ c, children }) {
  return <span style={{ color: c }}>{children}</span>;
}

/* ═══════════════════════════════════════════════════ HERO ════ */
const Hero = forwardRef(function Hero({ isMobile }, ref) {
  const bp       = useBreakpoint();
  const isTablet = bp === "tablet";
  const [loaded, setLoaded] = useState(false);

  const lettersRef    = useRef([]);
  const bottomRowRef  = useRef(null);
  const glowRef       = useRef(null);
  const cursorRingRef = useRef(null);
  const subtitleRef   = useRef(null);
  const lineRef       = useRef(null);
  const taglineRef    = useRef(null);
  const gridRef       = useRef(null);
  const hasEntered    = useRef(false);

  const runEntrance = useCallback(() => {
    if (hasEntered.current) return;
    hasEntered.current = true;

    lettersRef.current.forEach((el) => {
      if (!el) return;
      gsap.set(el, { opacity:1, y:160, rotateX:-90, filter:"blur(16px)", transformOrigin:"50% 100%" });
    });
    gsap.set(lineRef.current,      { scaleX:0, transformOrigin:"left" });
    gsap.set(subtitleRef.current,  { opacity:0, y:10 });
    gsap.set(taglineRef.current,   { opacity:0, x:-20 });
    gsap.set(bottomRowRef.current, { opacity:0, y:24 });
    gsap.set(gridRef.current,      { opacity:0 });

    const tl = gsap.timeline();
    tl.to(gridRef.current,     { opacity:1, duration:1.2, ease:"power2.out" });
    tl.to(lettersRef.current,  {
      y:0, rotateX:0, filter:"blur(0px)",
      duration:1.4, ease:"power4.out",
      stagger:{ each:0.09, from:"start" },
    }, "-=0.7");
    tl.to(lineRef.current,      { scaleX:1, duration:0.9, ease:"power3.inOut" }, "-=0.6");
    tl.to(subtitleRef.current,  { opacity:1, y:0, duration:0.7, ease:"power3.out" }, "-=0.5");
    tl.to(taglineRef.current,   { opacity:1, x:0, duration:0.6, ease:"power3.out" }, "-=0.4");
    tl.to(bottomRowRef.current, { opacity:1, y:0, duration:0.7, ease:"power3.out" }, "-=0.4");
  }, []);

  useEffect(() => { if (loaded) runEntrance(); }, [loaded, runEntrance]);

  useEffect(() => {
    if (isMobile || !loaded) return;
    const section = ref?.current;
    const onMove = (e) => {
      gsap.to(glowRef.current,       { x:e.clientX, y:e.clientY, duration:2.2, ease:"power2.out" });
      gsap.to(cursorRingRef.current, { x:e.clientX, y:e.clientY, duration:0.4, ease:"power2.out" });
      lettersRef.current.forEach((el) => {
        if (!el) return;
        const r  = el.getBoundingClientRect();
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const str = Math.max(0, 1 - Math.hypot(dx,dy) / 340) * 0.06;
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
  }, [isMobile, ref, loaded]);

  const onLetterEnter = (e) => {
    if (isMobile) return;
    gsap.to(e.currentTarget, { scale:1.1, duration:0.3, ease:"power2.out" });
    gsap.to(cursorRingRef.current, { scale:2.8, borderColor:"rgba(44,85,132,0.9)", duration:0.3 });
    e.currentTarget.style.webkitTextStroke = "1px rgba(79,195,247,0.9)";
    e.currentTarget.style.textShadow = "0 0 80px rgba(44,85,132,0.6)";
  };
  const onLetterLeave = (e) => {
    if (isMobile) return;
    gsap.to(e.currentTarget, { scale:1, duration:0.9, ease:"elastic.out(1,0.4)" });
    gsap.to(cursorRingRef.current, { scale:1, borderColor:"rgba(44,85,132,0.5)", duration:0.3 });
    e.currentTarget.style.webkitTextStroke = isMobile ? "1px rgba(255,255,255,0.6)" : "1px rgba(255,255,255,0.72)";
    e.currentTarget.style.textShadow = "none";
  };

  const handleNavigate = () => {
    document.body.style.overflow    = "";
    document.body.style.height      = "";
    document.documentElement.style.overflow = "";
  };

  const ml = { fontSize:"9px",  letterSpacing:"0.45em", textTransform:"uppercase", color:"rgba(255,255,255,0.2)",  marginBottom:"6px" };
  const mv = { fontSize:"11px", letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(255,255,255,0.55)" };

  return (
    <>
      {!loaded && <CodeLoader onDone={() => setLoaded(true)} />}

      {!isMobile && !isTablet && (
        <div ref={cursorRingRef} aria-hidden="true" style={{
          position:"fixed", top:0, left:0,
          width:"40px", height:"40px", borderRadius:"50%",
          border:"1px solid rgba(44,85,132,0.5)",
          pointerEvents:"none", zIndex:9998,
          transform:"translate(-50%,-50%)",
          mixBlendMode:"screen",
        }}/>
      )}

      <section ref={ref} style={{
        position:"fixed", inset:0, width:"100%", height:"100vh",
        background:"#080808", overflow:"hidden",
        display:"flex", flexDirection:"column", justifyContent:"center",
        alignItems:   isTablet||isMobile ? "center"  : "flex-start",
        paddingLeft:  isTablet||isMobile ? "20px"    : "8%",
        paddingRight: isTablet||isMobile ? "20px"    : "52%",
        cursor:       isMobile||isTablet ? "auto"    : "none",
        perspective:  "1200px",
      }}>

        {/* Perspective grid floor */}
        <div ref={gridRef} aria-hidden="true" style={{
          position:"absolute", bottom:0, left:"-20%", right:"-20%",
          height:"55%", zIndex:0, opacity:0,
          backgroundImage:`linear-gradient(rgba(44,85,132,0.12) 1px, transparent 1px),linear-gradient(90deg, rgba(44,85,132,0.12) 1px, transparent 1px)`,
          backgroundSize:"70px 70px",
          maskImage:"linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 85%)",
          WebkitMaskImage:"linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 85%)",
          transform:"perspective(500px) rotateX(58deg)",
          transformOrigin:"bottom center",
        }}/>

        <div ref={glowRef} aria-hidden="true" style={{
          position:"absolute", top:0, left:0,
          width:"900px", height:"900px", borderRadius:"50%",
          background:"radial-gradient(circle, rgba(44,85,132,0.13) 0%, transparent 65%)",
          pointerEvents:"none", filter:"blur(70px)", zIndex:0,
          transform:"translate(-50%,-50%)",
        }}/>

        {[
          { top:"24px",    left:"24px",  borderTop:"1px solid rgba(44,85,132,0.3)",    borderLeft:"1px solid rgba(44,85,132,0.3)"   },
          { top:"24px",    right:"24px", borderTop:"1px solid rgba(44,85,132,0.3)",    borderRight:"1px solid rgba(44,85,132,0.3)"  },
          { bottom:"24px", left:"24px",  borderBottom:"1px solid rgba(44,85,132,0.3)", borderLeft:"1px solid rgba(44,85,132,0.3)"   },
          { bottom:"24px", right:"24px", borderBottom:"1px solid rgba(44,85,132,0.3)", borderRight:"1px solid rgba(44,85,132,0.3)"  },
        ].map((s,i) => (
          <div key={i} aria-hidden="true" style={{ position:"absolute", width:"22px", height:"22px", pointerEvents:"none", zIndex:2, ...s }}/>
        ))}

        {/* Big name letters */}
        <div style={{
          display:"flex",
          justifyContent: isTablet||isMobile ? "center" : "flex-start",
          alignItems:"center",
          gap:"clamp(2px,0.5vw,8px)",
          position:"relative", zIndex:3,
          perspective:"800px", overflow:"visible",
        }}>
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={(el) => (lettersRef.current[i] = el)}
              onMouseEnter={onLetterEnter}
              onMouseLeave={onLetterLeave}
              style={{
                display:"inline-block",
                fontSize: isMobile
                  ? "clamp(3.8rem,20vw,6rem)"
                  : isTablet
                  ? "clamp(4rem,14vw,9rem)"
                  : "clamp(5rem,12vw,13rem)",
                fontWeight:900, lineHeight:0.88, letterSpacing:"-0.04em",
                color:"transparent",
                WebkitTextStroke: isMobile ? "1px rgba(255,255,255,0.6)" : "1px rgba(255,255,255,0.72)",
                userSelect:"none", willChange:"transform",
                transition:"color 0.2s, -webkit-text-stroke 0.2s, text-shadow 0.2s",
                transformStyle:"preserve-3d",
                opacity:0,
              }}
            >{letter}</span>
          ))}
        </div>

        <div ref={lineRef} style={{
          width:"clamp(180px,40vw,420px)", height:"1px",
          background:"linear-gradient(90deg,rgba(44,85,132,0.9),rgba(44,85,132,0.2),transparent)",
          marginTop:"16px", zIndex:3,
        }}/>

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
                style={{ ...mv, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"8px" }}
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