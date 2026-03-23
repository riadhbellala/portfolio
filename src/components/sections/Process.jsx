import { useRef, useEffect, forwardRef, useState, useCallback } from "react";
import gsap from "gsap";

/* ─── Breakpoint ──────────────────────────────────────────────────────────── */
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

/* ─── Data ────────────────────────────────────────────────────────────────── */
const STEPS = [
  {
    index: "01", label: "Think",  title: "The Clarity",
    desc:  "Before anything exists, I sit with the problem. Goals, constraints, user needs — mapped out until the path forward feels obvious, not assumed.",
    tags:  ["Research", "Planning", "Scope"],
    symbol: "◎", phase: "Phase I",
  },
  {
    index: "02", label: "Design", title: "The Form",
    desc:  "Ideas become motion-first interfaces. Every spacing decision, typeface, and micro-interaction is deliberate — the design should feel inevitable.",
    tags:  ["UI/UX", "Motion", "Prototype"],
    symbol: "◈", phase: "Phase II",
  },
  {
    index: "03", label: "Code",   title: "The Build",
    desc:  "Clean, typed, performant. React + TypeScript + GSAP with Supabase behind it. No dead code, no shortcuts — every component earns its place.",
    tags:  ["React", "TypeScript", "GSAP"],
    symbol: "◇", phase: "Phase III",
  },
  {
    index: "04", label: "Launch", title: "The Release",
    desc:  "Deploy, verify, refine. The work isn't done at merge — it ends when it's fast, accessible, and holds up under real conditions.",
    tags:  ["Deploy", "QA", "Iterate"],
    symbol: "◉", phase: "Phase IV",
  },
];

const TIMER_MS = 4000;

/* ─── Particle canvas ─────────────────────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, W, H;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 48 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.5 + Math.random() * 1.1,
      angle: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.00022,
      speed: 0.00005 + Math.random() * 0.0001,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.007 + Math.random() * 0.02,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.angle += p.drift;
        p.x = ((p.x + Math.cos(p.angle) * p.speed) + 1) % 1;
        p.y = ((p.y + Math.sin(p.angle) * p.speed) + 1) % 1;
        p.phase += p.phaseSpeed;
        const pulse = 0.5 + 0.5 * Math.sin(p.phase);
        ctx.save();
        ctx.shadowBlur  = 1.5 + pulse * 7;
        ctx.shadowColor = `rgba(44,85,132,${0.55 + pulse * 0.45})`;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(44,85,132,${0.12 + pulse * 0.56})`;
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden="true" style={{ position:"absolute", inset:0, width:"100%", height:"100%", zIndex:0, pointerEvents:"none" }} />;
}

/* ─── Corner bracket ──────────────────────────────────────────────────────── */
function Corner({ top, bottom, left, right }) {
  return (
    <div aria-hidden="true" style={{
      position:"absolute", zIndex:5, top, bottom, left, right,
      width:"18px", height:"18px",
      borderTop:    bottom !== undefined ? "none" : "1px solid rgba(44,85,132,0.28)",
      borderBottom: bottom !== undefined ? "1px solid rgba(44,85,132,0.28)" : "none",
      borderLeft:   right  !== undefined ? "none" : "1px solid rgba(44,85,132,0.28)",
      borderRight:  right  !== undefined ? "1px solid rgba(44,85,132,0.28)" : "none",
    }} />
  );
}

/* ─── SVG hexagon node ─────────────────────────────────────────────────────── */
function HexNode({ isActive, onClick, nodeRef, glowRef }) {
  const S = 18; // hex "radius"
  // Flat-top hexagon points
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i);
    return `${S + S * Math.cos(a)},${S + S * Math.sin(a)}`;
  }).join(" ");

  return (
    <div
      onClick={onClick}
      style={{ position:"relative", width: S*2, height: S*2, cursor:"pointer", flexShrink:0 }}
    >
      {/* Outer glow ring (GSAP animated) */}
      <div ref={glowRef} style={{
        position:"absolute",
        inset: "-10px",
        borderRadius:"50%",
        background:"radial-gradient(circle,rgba(44,85,132,0.35) 0%,transparent 70%)",
        opacity:0, pointerEvents:"none",
      }} />
      <svg
        ref={nodeRef}
        width={S*2} height={S*2}
        viewBox={`0 0 ${S*2} ${S*2}`}
        style={{ display:"block", overflow:"visible" }}
      >
        {/* Outer hex */}
        <polygon
          points={pts}
          fill={isActive ? "rgba(44,85,132,0.15)" : "rgba(8,8,8,0.9)"}
          stroke={isActive ? "#2C5584" : "rgba(44,85,132,0.25)"}
          strokeWidth="1"
          style={{ transition:"fill 0.4s, stroke 0.4s", filter: isActive ? "drop-shadow(0 0 6px rgba(44,85,132,0.8))" : "none" }}
        />
        {/* Inner hex (decorative) */}
        <polygon
          points={Array.from({ length: 6 }, (_, i) => {
            const a = (Math.PI / 180) * (60 * i);
            return `${S + (S*0.55) * Math.cos(a)},${S + (S*0.55) * Math.sin(a)}`;
          }).join(" ")}
          fill="none"
          stroke={isActive ? "rgba(44,85,132,0.5)" : "rgba(44,85,132,0.1)"}
          strokeWidth="1"
          style={{ transition:"stroke 0.4s" }}
        />
        {/* Center dot */}
        <circle
          cx={S} cy={S} r="3"
          fill={isActive ? "#2C5584" : "rgba(44,85,132,0.3)"}
          style={{
            transition:"fill 0.4s",
            filter: isActive ? "drop-shadow(0 0 4px #2C5584)" : "none",
          }}
        />
      </svg>
    </div>
  );
}

/* ─── Signal dot that travels on the track ───────────────────────────────── */
function TrackSignal() {
  // purely decorative — a small dot that travels back and forth on the track
  const dotRef = useRef(null);
  useEffect(() => {
    const el = dotRef.current;
    if (!el) return;
    let raf;
    let dir = 1;
    let pct = 0;
    const speed = 0.15;
    function tick() {
      pct += speed * dir;
      if (pct >= 100) { pct = 100; dir = -1; }
      if (pct <= 0)   { pct = 0;   dir =  1; }
      el.style.left = `${pct}%`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div ref={dotRef} aria-hidden="true" style={{
      position:"absolute", top:"50%", left:"0%",
      transform:"translate(-50%,-50%)",
      width:"4px", height:"4px", borderRadius:"50%",
      background:"#2C5584",
      boxShadow:"0 0 8px rgba(44,85,132,0.9), 0 0 18px rgba(44,85,132,0.5)",
      pointerEvents:"none", zIndex:2,
      opacity:0.7,
    }} />
  );
}

/* ─── Terminal readout detail panel ─────────────────────────────────────── */
function TerminalPanel({ step, panelRef, innerRef }) {
  const [typed, setTyped]       = useState("");
  const [showTags, setShowTags] = useState(false);
  const [cursor, setCursor]     = useState(true);

  useEffect(() => {
    setTyped("");
    setShowTags(false);
    const text = step.desc;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(iv);
        setTimeout(() => setShowTags(true), 200);
      }
    }, 18);
    const blink = setInterval(() => setCursor(c => !c), 530);
    return () => { clearInterval(iv); clearInterval(blink); };
  }, [step.desc]);

  return (
    <div ref={panelRef} style={{
      position:"relative", overflow:"hidden",
      background:"rgba(4,8,16,0.85)",
      border:"1px solid rgba(44,85,132,0.2)",
      flexShrink:0,
    }}>
      {/* Terminal header bar */}
      <div style={{
        display:"flex", alignItems:"center", gap:"6px",
        padding:"8px 16px",
        borderBottom:"1px solid rgba(44,85,132,0.12)",
        background:"rgba(44,85,132,0.05)",
      }}>
        {/* Traffic lights */}
        {["rgba(255,95,86,0.5)","rgba(255,189,46,0.5)","rgba(39,201,63,0.5)"].map((c,i) => (
          <div key={i} style={{ width:"8px", height:"8px", borderRadius:"50%", background:c }} />
        ))}
        <div style={{ flex:1, textAlign:"center" }}>
          <span style={{
            fontFamily:"monospace", fontSize:"8px", letterSpacing:"0.25em",
            color:"rgba(255,255,255,0.18)",
          }}>process.log — {step.phase}</span>
        </div>
        <div style={{
          fontFamily:"monospace", fontSize:"7px", letterSpacing:"0.2em",
          color:"rgba(44,85,132,0.55)",
        }}>{step.index}/04</div>
      </div>

      {/* Terminal body */}
      <div ref={innerRef} style={{
        padding:"14px 18px",
        display:"flex",
        flexDirection:"column",
        gap:"10px",
      }}>
        {/* Prompt line with title */}
        <div style={{ display:"flex", alignItems:"baseline", gap:"8px" }}>
          <span style={{ fontFamily:"monospace", fontSize:"10px", color:"rgba(44,85,132,0.7)", flexShrink:0 }}>~$</span>
          <span style={{
            fontFamily:"monospace", fontSize:"10px", letterSpacing:"0.04em",
            color:"rgba(44,85,132,0.5)",
          }}>exec</span>
          <span style={{
            fontSize:"clamp(0.9rem,1.8vw,1.3rem)",
            fontWeight:900, letterSpacing:"-0.03em", lineHeight:1,
            color:"rgba(255,255,255,0.9)",
          }}>{step.title}</span>
          <span style={{
            fontFamily:"monospace", fontSize:"10px",
            color:"rgba(44,85,132,0.4)",
          }}>{step.symbol}</span>
        </div>

        {/* Typewriter output */}
        <div style={{
          fontFamily:"monospace", fontSize:"11px", lineHeight:1.75,
          color:"rgba(255,255,255,0.32)",
          letterSpacing:"0.01em",
          minHeight:"40px",
        }}>
          <span style={{ color:"rgba(44,85,132,0.5)" }}>// </span>
          {typed}
          <span style={{
            display:"inline-block", width:"7px", height:"12px",
            background: cursor ? "rgba(44,85,132,0.7)" : "transparent",
            verticalAlign:"middle", marginLeft:"1px",
            transition:"background 0.1s",
          }} />
        </div>

        {/* Tags as "flags" */}
        <div style={{
          display:"flex", gap:"6px", flexWrap:"wrap",
          opacity: showTags ? 1 : 0,
          transition:"opacity 0.4s",
        }}>
          {step.tags.map((tag) => (
            <span key={tag} style={{
              fontFamily:"monospace",
              fontSize:"7.5px", letterSpacing:"0.2em",
              padding:"3px 10px",
              background:"rgba(44,85,132,0.08)",
              border:"1px solid rgba(44,85,132,0.25)",
              color:"rgba(44,85,132,0.7)",
            }}>--{tag.toLowerCase()}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Process ─────────────────────────────────────────────────────────────── */
const Process = forwardRef(function Process({ isMobile }, ref) {
  const bp       = useBreakpoint();
  const isTablet = bp === "tablet";

  const [active,   setActive]   = useState(0);
  const prevActive = useRef(0);
  const isAnim     = useRef(false);
  const hasEntered = useRef(false);
  const timerRef   = useRef(null);

  /* header refs */
  const indexRef   = useRef(null);
  const hlabelRef  = useRef(null);
  const headingRef = useRef(null);
  const subRef     = useRef(null);
  const divRef     = useRef(null);
  const bgNumRef   = useRef(null);

  /* timeline refs */
  const trackRef    = useRef(null);
  const fillRef     = useRef(null);
  const nodeRefs    = useRef([]);   // HexNode svg wrappers
  const glowRefs    = useRef([]);   // glow divs
  const cardRefs    = useRef([]);   // above/below cards
  const stemRefs    = useRef([]);   // stems
  const timelineRef = useRef(null);

  /* detail panel */
  const detailRef  = useRef(null);

  /* mobile */
  const mobilePanelRefs = useRef([]);
  const mobileDotRefs   = useRef([]);
  const mobileFillRef   = useRef(null);

  /* ─── goTo ─────────────────────────────────────────────────────────────── */
  const goTo = useCallback((next) => {
    if (next === prevActive.current || isAnim.current) return;
    isAnim.current = true;
    const prev = prevActive.current;
    const pct  = (next / (STEPS.length - 1)) * 100;
    const dir  = next > prev ? 1 : -1;

    const tl = gsap.timeline({ onComplete: () => { isAnim.current = false; } });

    if (!isMobile) {
      /* Fill crawls */
      tl.to(fillRef.current, { width:`${pct}%`, duration:0.8, ease:"power2.inOut" }, 0);

      /* Old hex dims */
      const og = glowRefs.current[prev];
      if (og) tl.to(og, { opacity:0, scale:0.7, duration:0.35, ease:"power2.in" }, 0);
      const on = nodeRefs.current[prev];
      if (on) tl.to(on, { scale:1, duration:0.3, ease:"power2.out" }, 0);

      /* New hex pulses */
      const ng = glowRefs.current[next];
      if (ng) tl.to(ng, { opacity:1, scale:1, duration:0.6, ease:"expo.out" }, 0.12);
      const nn = nodeRefs.current[next];
      if (nn) {
        tl.to(nn, { scale:1.2, duration:0.2, ease:"power2.out" }, 0.1);
        tl.to(nn, { scale:1.0, duration:0.5, ease:"elastic.out(1,0.5)" }, 0.3);
      }

      /* Cards */
      const oc = cardRefs.current[prev];
      const nc = cardRefs.current[next];
      if (oc) tl.to(oc, { opacity:0, y: dir * -16, filter:"blur(4px)", duration:0.3, ease:"power2.in" }, 0);
      if (nc) {
        gsap.set(nc, { opacity:0, y: dir * 20, filter:"blur(4px)" });
        tl.to(nc, { opacity:1, y:0, filter:"blur(0px)", duration:0.55, ease:"power3.out" }, 0.28);
      }

      /* Stems */
      const os = stemRefs.current[prev];
      const ns = stemRefs.current[next];
      if (os) tl.to(os, { scaleY:0, opacity:0, duration:0.25, ease:"power2.in" }, 0);
      if (ns) {
        gsap.set(ns, { scaleY:0, opacity:0 });
        tl.to(ns, { scaleY:1, opacity:1, duration:0.5, ease:"expo.out" }, 0.22);
      }

      /* Detail panel: just update active — TerminalPanel re-runs its own anim */
      tl.add(() => setActive(next), 0.25);

    } else {
      /* Mobile */
      tl.to(mobileFillRef.current, { height:`${pct}%`, duration:0.65, ease:"power2.inOut" }, 0);

      const od = mobileDotRefs.current[prev];
      const nd = mobileDotRefs.current[next];
      if (od) tl.to(od, { scale:1, background:"rgba(8,8,8,1)", borderColor:"rgba(44,85,132,0.25)", boxShadow:"none", duration:0.3 }, 0);
      if (nd) tl.to(nd, { scale:1.4, background:"#2C5584", borderColor:"#2C5584", boxShadow:"0 0 12px rgba(44,85,132,0.9)", duration:0.4, ease:"back.out(2)" }, 0.1);

      const op = mobilePanelRefs.current[prev];
      const np = mobilePanelRefs.current[next];
      if (op) tl.to(op, { opacity:0, x: dir * -28, duration:0.25, ease:"power2.in" }, 0);
      if (np) {
        gsap.set(np, { opacity:0, x: dir * 28 });
        tl.to(np, { opacity:1, x:0, duration:0.42, ease:"power3.out" }, 0.22);
      }

      tl.add(() => setActive(next), 0.22);
    }

    prevActive.current = next;
  }, [isMobile]);

  /* ─── Auto timer ── */
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      goTo((prevActive.current + 1) % STEPS.length);
    }, TIMER_MS);
  }, [goTo]);

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, [startTimer]);

  const handleClick = (i) => { goTo(i); startTimer(); };

  /* ─── Init hidden ── */
  useEffect(() => {
    [indexRef, hlabelRef, headingRef, subRef, divRef, bgNumRef, trackRef, detailRef, timelineRef].forEach(r => {
      if (r.current) gsap.set(r.current, { opacity:0 });
    });
    gsap.set(headingRef.current, { y:32 });
    gsap.set(subRef.current,     { y:18 });
    gsap.set(indexRef.current,   { x:-20 });
    gsap.set(divRef.current,     { scaleX:0, transformOrigin:"left" });

    if (!isMobile) {
      gsap.set(fillRef.current,   { width:"0%" });
      nodeRefs.current.forEach(el  => el  && gsap.set(el,  { scale:0, opacity:0 }));
      glowRefs.current.forEach(el  => el  && gsap.set(el,  { opacity:0, scale:0.6 }));
      cardRefs.current.forEach(el  => el  && gsap.set(el,  { opacity:0, y:16 }));
      stemRefs.current.forEach(el  => el  && gsap.set(el,  { scaleY:0, opacity:0 }));
    } else {
      mobileDotRefs.current.forEach(el  => el  && gsap.set(el,  { scale:0, opacity:0 }));
      mobilePanelRefs.current.forEach(el => el  && gsap.set(el,  { opacity:0 }));
      if (mobileFillRef.current) gsap.set(mobileFillRef.current, { height:"0%" });
    }
  }, [isMobile]);

  /* ─── Observer ── */
  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    const obs = new MutationObserver(() => {
      const visible = el.style.visibility !== "hidden" && parseFloat(el.style.opacity || "0") > 0.5;
      if (visible && !hasEntered.current) { hasEntered.current = true; playEntrance(); }
    });
    obs.observe(el, { attributes:true, attributeFilter:["style"] });
    return () => obs.disconnect();
  }, [ref]);

  function playEntrance() {
    const tl = gsap.timeline();
    tl.to(bgNumRef.current,   { opacity:1,           duration:1.2, ease:"power2.out"   }, 0);
    tl.to(indexRef.current,   { opacity:1, x:0,      duration:0.5, ease:"power3.out"   }, 0.1);
    tl.to(hlabelRef.current,  { opacity:1,           duration:0.4, ease:"power3.out"   }, 0.2);
    tl.to(headingRef.current, { opacity:1, y:0,      duration:0.8, ease:"expo.out"     }, 0.25);
    tl.to(subRef.current,     { opacity:1, y:0,      duration:0.5, ease:"power3.out"   }, 0.45);
    tl.to(divRef.current,     { opacity:1, scaleX:1, duration:0.6, ease:"power2.inOut" }, 0.5);
    tl.to(trackRef.current,   { opacity:1,           duration:0.5, ease:"power2.out"   }, 0.6);
    tl.to(timelineRef.current,{ opacity:1,           duration:0.4, ease:"power3.out"   }, 0.62);

    /* Nodes pop in */
    nodeRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.to(el, { scale:1, opacity:1, duration:0.45, ease:"back.out(2.2)" }, 0.7 + i * 0.1);
    });

    /* First node glows */
    tl.to(glowRefs.current[0], { opacity:1, scale:1, duration:0.6, ease:"expo.out" }, 0.85);
    tl.to(nodeRefs.current[0], { scale:1.2, duration:0.18 }, 0.85);
    tl.to(nodeRefs.current[0], { scale:1.0, duration:0.5, ease:"elastic.out(1,0.5)" }, 1.03);

    /* Cards */
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.to(el, { opacity: i === 0 ? 1 : 0.15, y:0, filter:"blur(0px)", duration:0.45, ease:"power3.out" }, 0.78 + i * 0.08);
    });

    /* First stem */
    if (stemRefs.current[0]) {
      tl.to(stemRefs.current[0], { scaleY:1, opacity:1, duration:0.45, ease:"expo.out" }, 0.92);
    }
    stemRefs.current.slice(1).forEach(el => el && gsap.set(el, { scaleY:0, opacity:0 }));

    /* Detail */
    tl.to(detailRef.current, { opacity:1, duration:0.5, ease:"power3.out" }, 0.95);
  }

  const px       = isMobile ? "22px" : isTablet ? "48px" : "8%";
  const headerPT = isMobile ? "52px" : isTablet ? "56px" : "60px";
  const STEM_H   = isTablet ? 18 : 24;

  /* which steps go above vs below */
  const isAbove = (i) => i % 2 === 0;

  return (
    <section ref={ref} style={{
      position:"fixed", inset:0, width:"100%", height:"100vh",
      background:"#080808", overflow:"hidden",
      display:"flex", flexDirection:"column",
      boxSizing:"border-box",
    }}>
      <ParticleCanvas />

      <div aria-hidden="true" style={{
        position:"absolute", inset:0, zIndex:0, pointerEvents:"none",
        background:"radial-gradient(ellipse at 50% 60%,transparent 35%,rgba(0,0,0,0.55) 100%)",
      }} />

      {/* Ghost number */}
      <div ref={bgNumRef} aria-hidden="true" style={{
        position:"absolute", right:"-2%", bottom:"-10%",
        fontSize: isMobile ? "38vw" : "26vw", fontWeight:900, fontFamily:"monospace",
        color:"transparent", WebkitTextStroke:"1px rgba(44,85,132,0.05)",
        letterSpacing:"-0.08em", lineHeight:1,
        pointerEvents:"none", userSelect:"none", zIndex:0,
      }}>04</div>

      <Corner top="18px"    left="18px"  />
      <Corner top="18px"    right="18px" />
      <Corner bottom="18px" left="18px"  />
      <Corner bottom="18px" right="18px" />

      {/* ═══ HEADER ═══ */}
      <div style={{
        position:"relative", zIndex:2, flexShrink:0,
        display:"flex", alignItems:"flex-end", justifyContent:"space-between",
        padding:`${headerPT} ${px} ${isMobile ? "14px" : "16px"}`,
        gap:"16px",
      }}>
        <div>
          <div ref={indexRef} style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
            <span style={{ fontSize:"9px", letterSpacing:"0.4em", textTransform:"uppercase", color:"#2C5584", opacity:0.75 }}>[ 04 ]</span>
            <div style={{ width:"24px", height:"1px", background:"linear-gradient(90deg,rgba(44,85,132,0.5),transparent)" }} />
            <span ref={hlabelRef} style={{ fontSize:"9px", letterSpacing:"0.55em", textTransform:"uppercase", color:"rgba(255,255,255,0.18)" }}>How I work</span>
          </div>
          <h2 ref={headingRef} style={{
            margin:0,
            fontSize: isMobile ? "clamp(1.5rem,6.5vw,2.2rem)" : isTablet ? "clamp(1.7rem,3.8vw,2.8rem)" : "clamp(1.9rem,3vw,3.2rem)",
            fontWeight:900, letterSpacing:"-0.04em",
            color:"rgba(255,255,255,0.92)", lineHeight:1,
          }}>My <span style={{ color:"#2C5584" }}>Process.</span></h2>
        </div>
        <p ref={subRef} style={{
          margin:0, fontSize: isMobile ? "9px" : "10px",
          lineHeight:1.65, letterSpacing:"0.02em",
          color:"rgba(255,255,255,0.18)",
          textAlign:"right", maxWidth:"140px", flexShrink:0,
        }}>Four phases.<br />No skipping.</p>
      </div>

      {/* Divider */}
      <div ref={divRef} style={{
        position:"relative", zIndex:2, flexShrink:0,
        height:"1px", margin: isMobile ? "0 22px" : `0 ${px}`,
        background:"linear-gradient(90deg,rgba(44,85,132,0.4),rgba(44,85,132,0.04))",
      }} />

      {/* ═══ CONTENT ═══ */}
      {isMobile ? (

        /* ─── MOBILE: vertical spine ─── */
        <div style={{
          position:"relative", zIndex:1, flex:1, overflow:"hidden",
          display:"flex", padding:"12px 22px 16px", boxSizing:"border-box",
        }}>
          {/* Spine */}
          <div style={{
            position:"relative", width:"1px", flexShrink:0,
            marginRight:"22px", background:"rgba(255,255,255,0.06)",
          }}>
            <div ref={mobileFillRef} style={{
              position:"absolute", top:0, left:0, width:"100%", height:"0%",
              background:"linear-gradient(to bottom,#2C5584,rgba(44,85,132,0.15))",
              boxShadow:"0 0 8px rgba(44,85,132,0.8)",
            }} />
          </div>

          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:"0", overflow:"hidden" }}>
            {STEPS.map((step, i) => {
              const isAct = active === i;
              return (
                <div
                  key={i}
                  onClick={() => handleClick(i)}
                  style={{
                    flex: isAct ? "2" : "1",
                    position:"relative",
                    display:"flex", alignItems:"flex-start",
                    cursor:"pointer",
                    paddingTop:"10px", paddingLeft:"4px",
                    overflow:"hidden",
                    transition:"flex 0.45s cubic-bezier(0.4,0,0.2,1)",
                    minHeight:0,
                  }}
                >
                  <div
                    ref={el => (mobileDotRefs.current[i] = el)}
                    style={{
                      position:"absolute", left:"-27px", top:"14px",
                      width:"10px", height:"10px", borderRadius:"50%",
                      background:"rgba(8,8,8,1)", border:"1px solid rgba(44,85,132,0.25)",
                      zIndex:2, flexShrink:0,
                    }}
                  />
                  <div ref={el => (mobilePanelRefs.current[i] = el)} style={{ flex:1, overflow:"hidden" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"3px" }}>
                      <span style={{
                        fontFamily:"monospace", fontSize:"7px", letterSpacing:"0.35em",
                        color: isAct ? "rgba(44,85,132,0.75)" : "rgba(44,85,132,0.22)",
                        transition:"color 0.35s",
                      }}>{step.phase}</span>
                      <span style={{ fontSize:"9px", color: isAct ? "rgba(44,85,132,0.55)" : "rgba(255,255,255,0.06)", transition:"color 0.35s" }}>{step.symbol}</span>
                    </div>
                    <div style={{
                      fontSize: isAct ? "clamp(1rem,4.5vw,1.35rem)" : "clamp(0.8rem,3vw,0.95rem)",
                      fontWeight: isAct ? 800 : 400,
                      letterSpacing: isAct ? "-0.02em" : "0.1em",
                      textTransform: isAct ? "none" : "uppercase",
                      color: isAct ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.18)",
                      transition:"all 0.4s cubic-bezier(0.4,0,0.2,1)",
                      lineHeight:1.1, marginBottom: isAct ? "8px" : "0",
                    }}>{step.label}</div>
                    {isAct && (
                      <>
                        <p style={{ margin:"0 0 8px", fontSize:"10px", lineHeight:1.7, color:"rgba(255,255,255,0.28)", maxWidth:"280px" }}>
                          {step.desc}
                        </p>
                        <div style={{ display:"flex", gap:"4px", flexWrap:"wrap" }}>
                          {step.tags.map(t => (
                            <span key={t} style={{
                              fontFamily:"monospace", fontSize:"6.5px", letterSpacing:"0.25em", textTransform:"uppercase",
                              padding:"2px 7px", border:"1px solid rgba(44,85,132,0.22)",
                              color:"rgba(44,85,132,0.6)",
                            }}>--{t.toLowerCase()}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      ) : (

        /* ─── DESKTOP / TABLET: horizontal circuit timeline ─── */
        <div
          ref={timelineRef}
          style={{
            position:"relative", zIndex:1, flex:1,
            display:"flex", flexDirection:"column", justifyContent:"center",
            padding:`0 ${px}`, boxSizing:"border-box", overflow:"hidden",
          }}
        >
          {/* ── Cards ABOVE (0, 2) ── */}
          <div style={{
            display:"flex", alignItems:"flex-end",
            height: isTablet ? "100px" : "115px",
          }}>
            {STEPS.map((step, i) => isAbove(i) ? (
              <div key={i} style={{ flex:1, display:"flex", justifyContent:"center" }}>
                <div
                  ref={el => (cardRefs.current[i] = el)}
                  onClick={() => handleClick(i)}
                  style={{
                    display:"flex", flexDirection:"column", alignItems:"center",
                    cursor:"pointer", gap:"6px",
                    width: isTablet ? "140px" : "180px",
                  }}
                >
                  {/* Ghost index number behind card */}
                  <div style={{
                    position:"relative", textAlign:"center",
                    width:"100%",
                  }}>
                    <div aria-hidden="true" style={{
                      position:"absolute", left:"50%", top:"50%",
                      transform:"translate(-50%,-50%)",
                      fontSize: isTablet ? "3.5rem" : "5rem",
                      fontWeight:900, fontFamily:"monospace",
                      color:"transparent",
                      WebkitTextStroke: active === i ? "1px rgba(44,85,132,0.22)" : "1px rgba(44,85,132,0.06)",
                      letterSpacing:"-0.06em", lineHeight:1,
                      userSelect:"none", pointerEvents:"none",
                      transition:"WebkitTextStroke 0.5s",
                      whiteSpace:"nowrap",
                    }}>{step.index}</div>

                    {/* Phase label */}
                    <div style={{
                      fontFamily:"monospace", fontSize:"7px", letterSpacing:"0.4em",
                      color: active === i ? "rgba(44,85,132,0.75)" : "rgba(44,85,132,0.2)",
                      transition:"color 0.4s", marginBottom:"5px",
                      position:"relative",
                    }}>{step.phase}</div>

                    {/* Symbol */}
                    <div style={{
                      fontSize: active === i ? "1.4rem" : "0.95rem",
                      color: active === i ? "rgba(44,85,132,0.7)" : "rgba(255,255,255,0.06)",
                      transition:"all 0.45s cubic-bezier(0.4,0,0.2,1)",
                      lineHeight:1, marginBottom:"7px",
                      position:"relative",
                    }}>{step.symbol}</div>

                    {/* Label */}
                    <div style={{
                      fontSize: active === i ? (isTablet ? "1rem" : "1.25rem") : (isTablet ? "0.7rem" : "0.8rem"),
                      fontWeight: active === i ? 800 : 400,
                      letterSpacing: active === i ? "-0.02em" : "0.14em",
                      textTransform: active === i ? "none" : "uppercase",
                      color: active === i ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.18)",
                      transition:"all 0.5s cubic-bezier(0.4,0,0.2,1)", lineHeight:1,
                      position:"relative",
                    }}>{step.label}</div>
                  </div>

                  {/* Stem down */}
                  <div
                    ref={el => (stemRefs.current[i] = el)}
                    style={{
                      width:"1px", height:`${STEM_H}px`,
                      background:"linear-gradient(to bottom,rgba(44,85,132,0.5),rgba(44,85,132,0.08))",
                      transformOrigin:"bottom", flexShrink:0,
                    }}
                  />
                </div>
              </div>
            ) : <div key={i} style={{ flex:1 }} />)}
          </div>

          {/* ── Circuit track ── */}
          <div
            ref={trackRef}
            style={{
              position:"relative", height:"2px", flexShrink:0,
              background:"rgba(255,255,255,0.05)",
            }}
          >
            {/* Dash pattern overlay */}
            <div aria-hidden="true" style={{
              position:"absolute", inset:0,
              backgroundImage:"repeating-linear-gradient(90deg,rgba(44,85,132,0.12) 0px,rgba(44,85,132,0.12) 6px,transparent 6px,transparent 14px)",
            }} />

            {/* Progress fill */}
            <div ref={fillRef} style={{
              position:"absolute", left:0, top:0, height:"100%", width:"0%",
              background:"linear-gradient(90deg,#2C5584,rgba(44,85,132,0.3))",
              boxShadow:"0 0 10px rgba(44,85,132,0.9), 0 0 22px rgba(44,85,132,0.4)",
              zIndex:1,
            }}>
              {/* Playhead tip */}
              <div style={{
                position:"absolute", right:"-6px", top:"50%",
                transform:"translateY(-50%)",
                width:"12px", height:"12px", borderRadius:"50%",
                background:"#2C5584",
                boxShadow:"0 0 16px rgba(44,85,132,1), 0 0 32px rgba(44,85,132,0.7), 0 0 56px rgba(44,85,132,0.3)",
              }} />
            </div>

            {/* Traveling signal dot */}
            <TrackSignal />

            {/* Hex nodes */}
            {STEPS.map((_, i) => (
              <div key={i} style={{
                position:"absolute",
                left:`${(i / (STEPS.length - 1)) * 100}%`,
                top:"50%", transform:"translate(-50%,-50%)",
                zIndex:3,
              }}>
                <HexNode
                  isActive={active === i}
                  onClick={() => handleClick(i)}
                  nodeRef={el => (nodeRefs.current[i] = el)}
                  glowRef={el => (glowRefs.current[i] = el)}
                />
              </div>
            ))}
          </div>

          {/* ── Cards BELOW (1, 3) ── */}
          <div style={{
            display:"flex", alignItems:"flex-start",
            height: isTablet ? "100px" : "115px",
          }}>
            {STEPS.map((step, i) => !isAbove(i) ? (
              <div key={i} style={{ flex:1, display:"flex", justifyContent:"center" }}>
                <div
                  ref={el => (cardRefs.current[i] = el)}
                  onClick={() => handleClick(i)}
                  style={{
                    display:"flex", flexDirection:"column", alignItems:"center",
                    cursor:"pointer", gap:"6px",
                    width: isTablet ? "140px" : "180px",
                  }}
                >
                  {/* Stem up */}
                  <div
                    ref={el => (stemRefs.current[i] = el)}
                    style={{
                      width:"1px", height:`${STEM_H}px`,
                      background:"linear-gradient(to bottom,rgba(44,85,132,0.08),rgba(44,85,132,0.5))",
                      transformOrigin:"top", flexShrink:0,
                    }}
                  />

                  <div style={{ position:"relative", textAlign:"center", width:"100%" }}>
                    <div aria-hidden="true" style={{
                      position:"absolute", left:"50%", top:"50%",
                      transform:"translate(-50%,-50%)",
                      fontSize: isTablet ? "3.5rem" : "5rem",
                      fontWeight:900, fontFamily:"monospace",
                      color:"transparent",
                      WebkitTextStroke: active === i ? "1px rgba(44,85,132,0.22)" : "1px rgba(44,85,132,0.06)",
                      letterSpacing:"-0.06em", lineHeight:1,
                      userSelect:"none", pointerEvents:"none",
                      transition:"WebkitTextStroke 0.5s",
                      whiteSpace:"nowrap",
                    }}>{step.index}</div>

                    <div style={{
                      fontSize: active === i ? (isTablet ? "1rem" : "1.25rem") : (isTablet ? "0.7rem" : "0.8rem"),
                      fontWeight: active === i ? 800 : 400,
                      letterSpacing: active === i ? "-0.02em" : "0.14em",
                      textTransform: active === i ? "none" : "uppercase",
                      color: active === i ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.18)",
                      transition:"all 0.5s cubic-bezier(0.4,0,0.2,1)",
                      lineHeight:1, marginBottom:"7px", position:"relative",
                    }}>{step.label}</div>

                    <div style={{
                      fontSize: active === i ? "1.4rem" : "0.95rem",
                      color: active === i ? "rgba(44,85,132,0.7)" : "rgba(255,255,255,0.06)",
                      transition:"all 0.45s cubic-bezier(0.4,0,0.2,1)",
                      lineHeight:1, marginBottom:"5px", position:"relative",
                    }}>{step.symbol}</div>

                    <div style={{
                      fontFamily:"monospace", fontSize:"7px", letterSpacing:"0.4em",
                      color: active === i ? "rgba(44,85,132,0.75)" : "rgba(44,85,132,0.2)",
                      transition:"color 0.4s", position:"relative",
                    }}>{step.phase}</div>
                  </div>
                </div>
              </div>
            ) : <div key={i} style={{ flex:1 }} />)}
          </div>

          {/* ── Terminal detail panel ── */}
          <TerminalPanel
            step={STEPS[active]}
            panelRef={detailRef}
            innerRef={null}
          />
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0%   { transform:translateX(-120%); }
          60%  { transform:translateX(220%); }
          100% { transform:translateX(220%); }
        }
      `}</style>
    </section>
  );
});

export default Process;