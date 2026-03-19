import { useRef, useEffect, forwardRef, useState, useCallback } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Link } from "react-router-dom";

gsap.registerPlugin(Draggable, InertiaPlugin);

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

// ── Neural Brain Shape — draggable, animated, living ─────────────────────────
function NeuralBrain({ isMobile }) {
  const containerRef = useRef(null);
  const isDrag       = useRef(false);
  const floatRef     = useRef(null);
  const canvasRef    = useRef(null);
  const animFrameRef = useRef(null);

  // Node positions for the neural network
  const nodes = useRef([
    // core
    { x:200, y:180, r:7,  layer:0 },
    { x:200, y:220, r:5,  layer:0 },
    // left cluster
    { x:100, y:100, r:6,  layer:1 },
    { x:80,  y:160, r:4,  layer:1 },
    { x:110, y:240, r:5,  layer:1 },
    { x:90,  y:300, r:4,  layer:1 },
    // right cluster
    { x:300, y:90,  r:5,  layer:2 },
    { x:320, y:160, r:6,  layer:2 },
    { x:310, y:240, r:4,  layer:2 },
    { x:290, y:310, r:5,  layer:2 },
    // top
    { x:180, y:50,  r:4,  layer:3 },
    { x:220, y:40,  r:3,  layer:3 },
    { x:160, y:80,  r:3,  layer:3 },
    { x:240, y:70,  r:4,  layer:3 },
    // bottom
    { x:170, y:350, r:4,  layer:4 },
    { x:210, y:360, r:3,  layer:4 },
    { x:240, y:340, r:4,  layer:4 },
    // satellites
    { x:50,  y:200, r:3,  layer:5 },
    { x:350, y:200, r:3,  layer:5 },
    { x:200, y:400, r:3,  layer:5 },
  ]).current;

  // Connections between node indices
  const connections = useRef([
    [0,1],[0,2],[0,6],[0,10],[0,3],
    [1,4],[1,7],[1,14],[1,9],
    [2,3],[2,10],[2,17],
    [3,4],[3,5],[3,17],
    [4,5],[4,14],
    [5,17],[5,15],
    [6,7],[6,10],[6,11],
    [7,8],[7,18],
    [8,9],[8,16],
    [9,15],[9,18],
    [10,11],[10,12],[10,13],
    [11,13],[12,2],[13,6],
    [14,15],[15,16],[16,9],
    [17,3],[18,7],[19,15],
    [0,13],[1,12],[5,19],[8,19],
  ]).current;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const size = isMobile ? 0.55 : 1;
    gsap.set(el, { x: isMobile ? 0 : 280, y: isMobile ? 0 : -30, scale: size, opacity: 0 });

    // Float the whole brain
    floatRef.current = gsap.to(el, {
      y: `+=${isMobile ? 12 : 20}`,
      rotation: 4,
      duration: 4,
      ease: "sine.inOut",
      repeat: -1, yoyo: true,
      delay: 0.5,
    });

    // Reveal
    gsap.to(el, { opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.8 });

    // Make draggable
    Draggable.create(el, {
      type: "x,y",
      inertia: true,
      cursor: "grab",
      activeCursor: "grabbing",
      onDragStart() {
        isDrag.current = true;
        floatRef.current?.pause();
        gsap.to(el, { scale: size * 1.05, duration: 0.3, ease: "power2.out" });
      },
      onDragEnd() {
        isDrag.current = false;
        gsap.to(el, {
          scale: size, duration: 0.8, ease: "elastic.out(1,0.4)",
          onComplete: () => floatRef.current?.play(),
        });
      },
    });

    // Parallax
    const onMove = (e) => {
      if (isDrag.current) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      gsap.to(el, {
        x: (isMobile ? 0 : 280) + (e.clientX - cx) * 0.04,
        y: (isMobile ? 0 : -30) + (e.clientY - cy) * 0.03,
        duration: 1.8, ease: "power1.out", overwrite: "auto",
      });
    };
    if (!isMobile) window.addEventListener("mousemove", onMove);

    // Animate pulse signals traveling along connections
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = 420;
    canvas.height = 420;
    const ctx = canvas.getContext("2d");

    // Traveling signals state
    const signals = connections.map((conn) => ({
      conn,
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
      active: Math.random() > 0.6,
      opacity: 0,
    }));

    // Node pulse phases
    const phases = nodes.map(() => Math.random() * Math.PI * 2);

    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, 420, 420);
      frame++;

      // Draw connections
      connections.forEach(([a, b], i) => {
        const na = nodes[a]; const nb = nodes[b];
        const alpha = 0.08 + Math.sin(frame * 0.01 + i * 0.3) * 0.04;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = `rgba(44,85,132,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Draw traveling signals
      signals.forEach((sig) => {
        if (!sig.active) {
          if (Math.random() < 0.005) { sig.active = true; sig.t = 0; }
          return;
        }
        sig.t += sig.speed;
        if (sig.t >= 1) { sig.active = false; sig.t = 0; return; }

        const [a, b] = sig.conn;
        const na = nodes[a]; const nb = nodes[b];
        const x = na.x + (nb.x - na.x) * sig.t;
        const y = na.y + (nb.y - na.y) * sig.t;
        const alpha = Math.sin(sig.t * Math.PI);

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,160,255,${alpha * 0.9})`;
        ctx.fill();

        // Glow
        const grad = ctx.createRadialGradient(x,y,0, x,y,8);
        grad.addColorStop(0, `rgba(100,160,255,${alpha * 0.4})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Draw nodes
      nodes.forEach((n, i) => {
        const pulse = Math.sin(frame * 0.02 + phases[i]) * 0.5 + 0.5;
        const r = n.r + pulse * 2;
        const alpha = 0.5 + pulse * 0.5;

        // Outer glow
        const grad = ctx.createRadialGradient(n.x,n.y,0, n.x,n.y,r*4);
        grad.addColorStop(0, `rgba(44,120,200,${alpha * 0.3})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(44,100,180,${alpha})`;
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140,200,255,${alpha * 0.9})`;
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      floatRef.current?.kill();
      cancelAnimationFrame(animFrameRef.current);
      if (!isMobile) window.removeEventListener("mousemove", onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  return (
    <div ref={containerRef} style={{
      position: "absolute",
      top: "50%", left: isMobile ? "50%" : "auto",
      right: isMobile ? "auto" : "6%",
      transform: "translate(-50%, -50%)",
      cursor: "grab",
      zIndex: 2,
      userSelect: "none",
    }}>
      <canvas ref={canvasRef} width={420} height={420} style={{
        display: "block",
        filter: "drop-shadow(0 0 30px rgba(44,100,200,0.4))",
      }}/>
    </div>
  );
}

const Hero = forwardRef(function Hero({ isMobile }, ref) {
  const bp        = useBreakpoint();
  const isTablet  = bp === "tablet";

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

    tl.to(lineRef.current, { scaleX:1, duration:0.7, ease:"power3.inOut" }, "-=0.5");

    tl.to(subtitleRef.current, { opacity:1, y:0, duration:0.7, ease:"power3.out" }, "-=0.4");
    tl.to(taglineRef.current,  { opacity:1, x:0, duration:0.6, ease:"power3.out" }, "-=0.5");

    tl.to(bottomRowRef.current, { opacity:1, y:0, duration:0.7, ease:"power3.out" }, "-=0.4");

  }


  useEffect(() => {
    if (isMobile) return;
    const section = ref?.current;
    const onMove = (e) => {
      gsap.to(glowRef.current,       { x:e.clientX, y:e.clientY, duration:2,   ease:"power2.out" });
      gsap.to(cursorRingRef.current, { x:e.clientX, y:e.clientY, duration:0.5, ease:"power2.out" });
      lettersRef.current.forEach((el) => {
        if (!el) return;
        const r   = el.getBoundingClientRect();
        const cx  = r.left + r.width  / 2;
        const cy  = r.top  + r.height / 2;
        const dx  = e.clientX - cx;
        const dy  = e.clientY - cy;
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

  const ml = { fontSize:"9px",  letterSpacing:"0.45em", textTransform:"uppercase", color:"rgba(255,255,255,0.22)", marginBottom:"6px" };
  const mv = { fontSize:"11px", letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(255,255,255,0.58)" };

  return (
    <>
      {!isMobile && !isTablet && (
        <div ref={cursorRingRef} aria-hidden="true" style={{
          position:"fixed",top:0,left:0,width:"36px",height:"36px",borderRadius:"50%",
          border:"1px solid rgba(44,85,132,0.5)",pointerEvents:"none",
          zIndex:9998,transform:"translate(-50%,-50%)",
        }}/>
      )}

      <section ref={ref} style={{
        position:"fixed",inset:0,width:"100%",height:"100vh",
        background:"#080808",overflow:"hidden",
        display:"flex",flexDirection:"column",
        justifyContent:"center",
        alignItems: isTablet||isMobile ? "center" : "flex-start",
        paddingLeft: isTablet||isMobile ? "20px" : "8%",
        paddingRight: isTablet||isMobile ? "20px" : "52%",
        cursor: isMobile||isTablet ? "auto" : "none",
        perspective:"1000px",
      }}>

        {/* Ambient glow follows cursor */}
        <div ref={glowRef} aria-hidden="true" style={{
          position:"absolute",top:0,left:0,
          width:"700px",height:"700px",borderRadius:"50%",
          background:"radial-gradient(circle, rgba(44,85,132,0.12) 0%, transparent 65%)",
          pointerEvents:"none",filter:"blur(60px)",zIndex:0,
          transform:"translate(-50%,-50%)",
        }}/>

        {/* Corner brackets */}
        {[
          {top:"24px",left:"24px",   borderTop:"1px solid rgba(44,85,132,0.28)",borderLeft:"1px solid rgba(44,85,132,0.28)"},
          {top:"24px",right:"24px",  borderTop:"1px solid rgba(44,85,132,0.28)",borderRight:"1px solid rgba(44,85,132,0.28)"},
          {bottom:"24px",left:"24px",borderBottom:"1px solid rgba(44,85,132,0.28)",borderLeft:"1px solid rgba(44,85,132,0.28)"},
          {bottom:"24px",right:"24px",borderBottom:"1px solid rgba(44,85,132,0.28)",borderRight:"1px solid rgba(44,85,132,0.28)"},
        ].map((s,i)=>(
          <div key={i} aria-hidden="true" style={{position:"absolute",width:"20px",height:"20px",pointerEvents:"none",zIndex:1,...s}}/>
        ))}

        {/* Neural brain — right side */}
        <NeuralBrain isMobile={isMobile || isTablet} />

        {/* Index number */}
        <span style={{
          fontSize:"9px",letterSpacing:"0.5em",textTransform:"uppercase",
          color:"rgba(44,85,132,0.7)",marginBottom:"20px",zIndex:3,
          display:"block",
        }}></span>

        {/* Big letters */}
        <div style={{
          display:"flex",justifyContent: isTablet||isMobile?"center":"flex-start",
          alignItems:"center",
          gap:"clamp(2px,0.6vw,10px)",
          padding:"0",
          position:"relative",zIndex:3,
          perspective:"800px",
          overflow:"visible",
        }}>
          {LETTERS.map((letter, i) => (
            <span key={i} ref={(el) => (lettersRef.current[i] = el)}
              style={{
                display:"inline-block",
                fontSize: isMobile
                  ?"clamp(3.8rem,20vw,6rem)"
                  :isTablet
                  ?"clamp(4rem,14vw,9rem)"
                  :"clamp(5rem,12vw,13rem)",
                fontWeight:900,lineHeight:0.88,letterSpacing:"-0.04em",
                color:"transparent",
                WebkitTextStroke: isMobile?"1px rgba(255,255,255,0.6)":"1px rgba(255,255,255,0.75)",
                userSelect:"none",willChange:"transform",
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
          width:"clamp(180px,40vw,420px)",
          height:"1px",
          background:"linear-gradient(90deg,rgba(44,85,132,0.8),rgba(44,85,132,0.2),transparent)",
          marginTop:"16px",zIndex:3,
        }}/>

        {/* Subtitle row */}
        <div style={{ display:"flex", alignItems:"center", gap:"24px", marginTop:"18px", zIndex:3 }}>
          <p ref={subtitleRef} style={{
            fontSize:isMobile?"10px":isTablet?"10px":"12px",
            letterSpacing:"0.48em",textTransform:"uppercase",
            color:"rgba(255,255,255,0.22)",margin:0,marginLeft:100
          }}>Web Developer</p>
          <span style={{ width:"4px",height:"4px",borderRadius:"50%",background:"rgba(44,85,132,0.8)",display:"inline-block" }}/>
        </div>

        {/* Bottom row */}
        <div ref={bottomRowRef} style={{
          position:"absolute",
          bottom:isMobile?"60px":isTablet?"80px":"88px",
          left:0,right:0,
          padding:isMobile?"0 20px":isTablet?"0 32px":"0 52px",
          display:"flex",
          justifyContent:isMobile?"center":"space-between",
          alignItems:"flex-end",zIndex:3,
        }}>
          {!isMobile && <div><p style={ml}>Based in</p><p style={mv}>Algeria</p></div>}

          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"8px"}}>
            <div style={{width:"1px",height:isMobile?"36px":"52px",background:"linear-gradient(to bottom, rgba(44,85,132,0.8), transparent)"}}/>
            <span style={{fontSize:"7px",letterSpacing:"0.4em",textTransform:"uppercase",color:"rgba(255,255,255,0.13)"}}>
              {isMobile?"Swipe":"Scroll"}
            </span>
          </div>

          {!isMobile && (
            <div style={{textAlign:"right"}}>
              <p style={ml}>Work</p>
              <Link to="/projects"
                style={{...mv,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"8px"}}
                onMouseEnter={(e)=>{e.currentTarget.style.color="#2C5584";gsap.to(e.currentTarget,{x:6,duration:0.3,ease:"power2.out"});}}
                onMouseLeave={(e)=>{e.currentTarget.style.color="rgba(255,255,255,0.58)";gsap.to(e.currentTarget,{x:0,duration:0.3});}}
              >View Projects <span>→</span></Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
});

export default Hero;