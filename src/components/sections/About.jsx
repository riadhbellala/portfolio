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
const WORDS = [
  { word: "Creativity,",  accent: true  },
  { word: "thinking",     accent: false },
  { word: "out",          accent: false },
  { word: "of",           accent: false },
  { word: "the",          accent: false },
  { word: "box,",         accent: false },
  { word: "reliability",  accent: true  },
  { word: "—",            accent: false },
  { word: "gathered",     accent: true  },
  { word: "in",           accent: false },
  { word: "one",          accent: false },
  { word: "place.",       accent: true  },
];

const STATS = [
  { value: "2+",  label: "Years exp.",   fillPct: 70  },
  { value: "20+", label: "Projects",     fillPct: 85  },
  { value: "∞",   label: "Dedication",   fillPct: 100 },
];

/* ─── Glowing particle canvas ─────────────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, W, H;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 60 }, () => ({
      x:          Math.random(),
      y:          Math.random(),
      r:          0.5 + Math.random() * 1.3,
      angle:      Math.random() * Math.PI * 2,
      drift:      (Math.random() - 0.5) * 0.00022,
      speed:      0.00005 + Math.random() * 0.00011,
      phase:      Math.random() * Math.PI * 2,
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
        const alpha = 0.12 + pulse * 0.6;
        const blur  = 1.5 + pulse * 7;

        ctx.save();
        ctx.shadowBlur  = blur;
        ctx.shadowColor = `rgba(44,85,132,${0.55 + pulse * 0.45})`;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(44,85,132,${alpha})`;
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden="true" style={{
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      zIndex: 0, pointerEvents: "none",
    }} />
  );
}

/* ─── Cursor glow ─────────────────────────────────────────────────────────── */
function CursorGlow({ containerRef }) {
  const glowRef = useRef(null);
  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(glowRef.current, {
        left: e.clientX - r.left, top: e.clientY - r.top,
        duration: 1.0, ease: "power2.out",
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [containerRef]);

  return (
    <div ref={glowRef} aria-hidden="true" style={{
      position: "absolute", zIndex: 0, pointerEvents: "none",
      width: "600px", height: "600px", borderRadius: "50%",
      transform: "translate(-50%,-50%)",
      background: "radial-gradient(circle, rgba(44,85,132,0.09) 0%, transparent 68%)",
      left: "50%", top: "50%",
    }} />
  );
}

/* ─── Corner bracket ──────────────────────────────────────────────────────── */
function Corner({ top, bottom, left, right }) {
  return (
    <div aria-hidden="true" style={{
      position: "absolute", zIndex: 1,
      top, bottom, left, right,
      width: "18px", height: "18px",
      borderTop:    bottom !== undefined ? "none" : "1px solid rgba(44,85,132,0.28)",
      borderBottom: bottom !== undefined ? "1px solid rgba(44,85,132,0.28)" : "none",
      borderLeft:   right  !== undefined ? "none" : "1px solid rgba(44,85,132,0.28)",
      borderRight:  right  !== undefined ? "1px solid rgba(44,85,132,0.28)" : "none",
    }} />
  );
}

/* ─── Magnetic word ───────────────────────────────────────────────────────── */
function MagWord({ word, accent, isMobile, isTablet, setRef }) {
  const el = useRef(null);
  const onMove = useCallback((e) => {
    const r = el.current.getBoundingClientRect();
    gsap.to(el.current, {
      x: (e.clientX - (r.left + r.width  / 2)) * 0.24,
      y: (e.clientY - (r.top  + r.height / 2)) * 0.24,
      duration: 0.3, ease: "power2.out",
    });
  }, []);
  const onLeave = useCallback(() => {
    gsap.to(el.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.45)" });
  }, []);

  return (
    <span
      ref={(node) => { el.current = node; setRef(node); }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        display: "inline-block",
        fontSize: isMobile
          ? "clamp(1.25rem,5.5vw,1.9rem)"
          : isTablet
            ? "clamp(1.5rem,4vw,2.6rem)"
            : "clamp(1.8rem,3.2vw,3.6rem)",
        fontWeight: 700,
        lineHeight: 1.05,
        letterSpacing: "-0.025em",
        color: accent ? "#2C5584" : "rgba(255,255,255,0.9)",
        willChange: "transform,opacity",
        cursor: "default",
      }}
    >{word}</span>
  );
}

/* ─── SVG Radial ring stat ────────────────────────────────────────────────── */
function StatRing({ value, label, animate, delay, fillPct, size = 82 }) {
  const circleRef = useRef(null);
  const stroke = 1.5;
  const r      = (size - stroke * 2) / 2;
  const circ   = 2 * Math.PI * r;

  useEffect(() => {
    if (!animate || !circleRef.current) return;
    gsap.fromTo(circleRef.current,
      { strokeDashoffset: circ },
      { strokeDashoffset: circ * (1 - fillPct / 100), duration: 1.8, ease: "power2.out", delay }
    );
  }, [animate, circ, fillPct, delay]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r}
            fill="none" stroke="rgba(44,85,132,0.1)" strokeWidth={stroke} />
          <circle ref={circleRef} cx={size/2} cy={size/2} r={r}
            fill="none" stroke="#2C5584" strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ}
            style={{ filter: "drop-shadow(0 0 5px rgba(44,85,132,0.8))" }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontSize: size < 76 ? "1.1rem" : "clamp(1.2rem,2.2vw,1.7rem)",
            fontWeight: 800, letterSpacing: "-0.04em",
            color: "#fff", lineHeight: 1,
          }}>{value}</span>
        </div>
      </div>
      <span style={{
        fontSize: "7px", letterSpacing: "0.3em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.2)", textAlign: "center",
        maxWidth: size + "px",
      }}>{label}</span>
    </div>
  );
}

/* ─── Decorative vertical timeline dot ───────────────────────────────────── */
function TimelineDot({ active }) {
  return (
    <div style={{
      width: active ? "7px" : "4px",
      height: active ? "7px" : "4px",
      borderRadius: "50%",
      background: active ? "#2C5584" : "rgba(44,85,132,0.25)",
      boxShadow: active ? "0 0 10px rgba(44,85,132,0.9)" : "none",
      flexShrink: 0,
      transition: "all 0.3s",
    }} />
  );
}

/* ─── About ───────────────────────────────────────────────────────────────── */
const About = forwardRef(function About({ isMobile }, ref) {
  const bp        = useBreakpoint();
  const isTablet  = bp === "tablet";
  const isDesktop = bp === "desktop";

  /* refs */
  const indexRef     = useRef(null);
  const labelRef     = useRef(null);
  const wordRefs     = useRef([]);
  const statsRef     = useRef([]);
  const divRef       = useRef(null);
  const photoAreaRef = useRef(null);
  const hasEntered   = useRef(false);
  const bioRef       = useRef(null);
  const tagRef       = useRef(null);
  const quoteRef     = useRef(null);
  const locationRef  = useRef(null);

  const [statsGo, setStatsGo] = useState(false);

  /* original scatter offsets */
  const scatter = useRef(
    WORDS.map(() => ({
      x: (Math.random() - 0.5) * 500,
      y: (Math.random() - 0.5) * 300,
      r: (Math.random() - 0.5) * 60,
      s: 0.2 + Math.random() * 0.5,
    }))
  ).current;

  /* init hidden */
  useEffect(() => {
    const hide = [indexRef, labelRef, divRef, bioRef, tagRef, quoteRef, locationRef];
    hide.forEach(r => r.current && gsap.set(r.current, { opacity: 0 }));
    gsap.set(labelRef.current,      { y: 16 });
    gsap.set(divRef.current,        { scaleX: 0, transformOrigin: "left" });
    gsap.set(statsRef.current,      { opacity: 0, y: 30 });
    gsap.set(photoAreaRef.current,  { opacity: 0, x: isDesktop ? 50 : 0, y: isDesktop ? 0 : 20 });
    gsap.set(bioRef.current,        { y: 12 });
    gsap.set(tagRef.current,        { y: 10 });
    gsap.set(quoteRef.current,      { x: 16 });
    gsap.set(locationRef.current,   { y: 8 });
    gsap.set(indexRef.current,      { x: -24 });

    wordRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        opacity: 0,
        x: scatter[i].x, y: scatter[i].y,
        rotation: scatter[i].r, scale: scatter[i].s,
      });
    });
  }, [scatter, isDesktop]);

  /* observer */
  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    const obs = new MutationObserver(() => {
      const visible =
        el.style.visibility !== "hidden" &&
        parseFloat(el.style.opacity || "0") > 0.5;
      if (visible && !hasEntered.current) {
        hasEntered.current = true;
        playEntrance();
      }
    });
    obs.observe(el, { attributes: true, attributeFilter: ["style"] });
    return () => obs.disconnect();
  }, [ref]);

  function playEntrance() {
    const tl = gsap.timeline();

    tl.to(indexRef.current,  { opacity: 1, x: 0,  duration: 0.5, ease: "power3.out" });
    tl.to(wordRefs.current,  {
      opacity: 1, x: 0, y: 0, rotation: 0, scale: 1,
      duration: 1.0, ease: "power4.out",
      stagger: { each: 0.035, from: "random" },
    }, "-=0.1");
    tl.to(divRef.current,         { opacity: 1, scaleX: 1, duration: 0.6, ease: "power2.inOut" }, "-=0.5");
    tl.to(labelRef.current,       { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.4");
    tl.to(bioRef.current,         { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.4");
    tl.to(tagRef.current,         { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, "-=0.3");
    tl.to(photoAreaRef.current,   { opacity: 1, x: 0, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");
    tl.to(statsRef.current,       { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.5)", stagger: 0.1 }, "-=0.5");
    tl.to(quoteRef.current,       { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }, "-=0.3");
    tl.to(locationRef.current,    { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, "-=0.25");
    tl.add(() => setStatsGo(true));
  }

  /* ── Mobile layout: single compact column, everything fits 100vh ── */
  if (isMobile) {
    return (
      <section ref={ref} style={{
        position: "fixed", inset: 0, width: "100%", height: "100vh",
        background: "#080808", overflow: "hidden",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "0 22px",
        boxSizing: "border-box",
      }}>
        <ParticleCanvas />
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,0.6) 100%)",
        }} />
        <Corner top="12px"    left="12px"  />
        <Corner top="12px"    right="12px" />
        <Corner bottom="12px" left="12px"  />
        <Corner bottom="12px" right="12px" />

        <div style={{
          position: "relative", zIndex: 1,
          display: "flex", flexDirection: "column",
          alignItems: "center",
          width: "100%",
          gap: "0",
        }}>

          {/* Section label */}
          <div ref={indexRef} style={{
            display: "flex", alignItems: "center", gap: "8px",
            marginBottom: "14px",
          }}>
            <span ref={labelRef} style={{ fontSize: "8px", letterSpacing: "0.5em", textTransform: "uppercase", color: "#2C5584" }}>About me</span>
          </div>

          {/* Words — compact on mobile */}
          <div style={{
            display: "flex", flexWrap: "wrap",
            justifyContent: "center", alignItems: "baseline",
            gap: "clamp(3px,1.2vw,8px)",
            maxWidth: "320px",
            marginBottom: "14px",
          }}>
            {WORDS.map((item, i) => (
              <MagWord
                key={i} word={item.word} accent={item.accent}
                isMobile={true} isTablet={false}
                setRef={(el) => (wordRefs.current[i] = el)}
              />
            ))}
          </div>

          {/* Divider */}
          <div ref={divRef} style={{
            width: "80px", height: "1px",
            background: "linear-gradient(90deg,transparent,rgba(44,85,132,0.6),transparent)",
            marginBottom: "12px",
          }} />

          {/* Bio — single tight line */}
          <p ref={bioRef} style={{
            margin: "0 0 14px 0",
            fontSize: "10px", lineHeight: 1.7,
            letterSpacing: "0.02em",
            color: "rgba(255,255,255,0.3)",
            textAlign: "center", maxWidth: "260px",
          }}>
            CS student · Algeria · motion &amp; code obsessed
          </p>

          {/* Stats row — inline compact */}
          <div style={{
            display: "flex", gap: "0",
            marginBottom: "14px",
            width: "100%", maxWidth: "300px",
            border: "1px solid rgba(44,85,132,0.12)",
          }}>
            {STATS.map((s, i) => (
              <div key={i} ref={(el) => (statsRef.current[i] = el)} style={{
                flex: 1,
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: "3px",
                padding: "10px 6px",
                borderRight: i < STATS.length - 1 ? "1px solid rgba(44,85,132,0.12)" : "none",
                background: "rgba(44,85,132,0.03)",
              }}>
                <span style={{
                  fontSize: "clamp(1.3rem,6vw,1.8rem)",
                  fontWeight: 800, letterSpacing: "-0.04em",
                  color: "#fff", lineHeight: 1,
                }}>{s.value}</span>
                <span style={{
                  fontSize: "6.5px", letterSpacing: "0.25em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.2)",
                  textAlign: "center",
                }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div ref={quoteRef} style={{
            padding: "10px 14px",
            borderLeft: "2px solid rgba(44,85,132,0.4)",
            background: "rgba(44,85,132,0.04)",
            maxWidth: "280px",
            marginBottom: "12px",
            alignSelf: "center",
          }}>
            <p style={{
              margin: 0, fontSize: "10px", lineHeight: 1.8,
              color: "rgba(255,255,255,0.25)", fontStyle: "italic",
              textAlign: "left",
            }}>
              "I don't just write code —<br />
              I engineer <span style={{ color: "rgba(44,85,132,0.85)", fontStyle: "normal", fontWeight: 600 }}>experiences</span>."
            </p>
          </div>

          {/* Badge */}
          <div ref={tagRef} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 12px",
            border: "1px solid rgba(44,85,132,0.2)",
            background: "rgba(44,85,132,0.05)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "linear-gradient(105deg,transparent 40%,rgba(44,85,132,0.07) 50%,transparent 60%)",
              animation: "shimmer 3.5s ease-in-out infinite",
            }} />
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 0 2px rgba(74,222,128,0.15), 0 0 10px rgba(74,222,128,0.7)",
              animation: "pdot 2s ease-in-out infinite", flexShrink: 0,
              display: "inline-block",
            }} />
            <span style={{ fontSize: "8px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>
              Open to opportunities
            </span>
          </div>

        </div>

        <style>{`
          @keyframes pdot {
            0%,100% { box-shadow: 0 0 0 2px rgba(74,222,128,0.12), 0 0 8px rgba(74,222,128,0.55); }
            50%      { box-shadow: 0 0 0 3px rgba(74,222,128,0.08), 0 0 16px rgba(74,222,128,0.9); }
          }
          @keyframes shimmer {
            0%   { transform: translateX(-120%); }
            60%  { transform: translateX(220%); }
            100% { transform: translateX(220%); }
          }
        `}</style>
      </section>
    );
  }

  /* ── Tablet / Desktop layout ── */
  return (
    <section ref={ref} style={{
      position: "fixed", inset: 0, width: "100%", height: "100vh",
      background: "#080808", overflow: "hidden",
      display: "flex", flexDirection: "column",
      justifyContent: "center",
      padding: isTablet ? "0 48px" : "0 8%",
      boxSizing: "border-box",
    }}>
      <ParticleCanvas />
      <CursorGlow containerRef={ref} />

      {/* vignette */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center,transparent 38%,rgba(0,0,0,0.55) 100%)",
      }} />

      <Corner top="18px"    left="18px"  />
      <Corner top="18px"    right="18px" />
      <Corner bottom="18px" left="18px"  />
      <Corner bottom="18px" right="18px" />

      {/* decorative vertical line right side */}
      {isDesktop && (
        <div aria-hidden="true" style={{
          position: "absolute", zIndex: 0,
          right: "calc(8% - 1px)", top: 0, bottom: 0, width: "1px",
          background: "linear-gradient(to bottom,transparent,rgba(44,85,132,0.1) 30%,rgba(44,85,132,0.1) 70%,transparent)",
          pointerEvents: "none",
        }} />
      )}

      {/* two-column */}
      <div style={{
        display: "flex",
        flexDirection: isTablet ? "column" : "row",
        alignItems: isTablet ? "flex-start" : "center",
        gap: isTablet ? "36px" : "7%",
        zIndex: 1, width: "100%", maxWidth: "1160px",
      }}>

        {/* ══ LEFT ══ */}
        <div style={{
          flex: isTablet ? "none" : "1 1 56%",
          display: "flex", flexDirection: "column",
          alignItems: "flex-start",
          gap: "0",
        }}>

          {/* label row */}
          <div ref={indexRef} style={{
            display: "flex", alignItems: "center", gap: "10px",
            marginBottom: "18px",
          }}>
            <span ref={labelRef} style={{ fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase", color: "#2C5584" }}>About me</span>
          </div>

          {/* word scatter */}
          <div style={{
            display: "flex", flexWrap: "wrap",
            justifyContent: "flex-start", alignItems: "baseline",
            gap: "clamp(4px,1vw,12px)",
            maxWidth: isTablet ? "580px" : "100%",
            marginBottom: "0",
          }}>
            {WORDS.map((item, i) => (
              <MagWord
                key={i} word={item.word} accent={item.accent}
                isMobile={false} isTablet={isTablet}
                setRef={(el) => (wordRefs.current[i] = el)}
              />
            ))}
          </div>

          {/* divider */}
          <div ref={divRef} style={{
            width: "200px", height: "1px",
            background: "linear-gradient(90deg,rgba(44,85,132,0.6),transparent)",
            margin: "24px 0",
          }} />

          {/* bio */}
          <p ref={bioRef} style={{
            margin: "0 0 20px 0",
            fontSize: "13px", lineHeight: 1.85,
            letterSpacing: "0.02em",
            color: "rgba(255,255,255,0.32)",
            maxWidth: "340px",
          }}>
            Third-year CS student from Algeria,<br />
            crafting interfaces that feel alive.<br />
            Passionate about motion, code &amp; design.
          </p>

          {/* availability badge */}
          <div ref={tagRef} style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            padding: "8px 18px",
            border: "1px solid rgba(44,85,132,0.22)",
            background: "rgba(44,85,132,0.05)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "linear-gradient(105deg,transparent 40%,rgba(44,85,132,0.08) 50%,transparent 60%)",
              animation: "shimmer 3.5s ease-in-out infinite",
            }} />
            <span style={{
              display: "inline-block", width: "7px", height: "7px", borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 0 2px rgba(74,222,128,0.15), 0 0 10px rgba(74,222,128,0.7)",
              animation: "pdot 2s ease-in-out infinite", flexShrink: 0,
            }} />
            <span style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", position: "relative" }}>
              Open to opportunities · Remote
            </span>
          </div>

        </div>

        {/* ══ RIGHT ══ */}
        <div ref={photoAreaRef} style={{
          flex: isTablet ? "none" : "0 0 auto",
          display: "flex", flexDirection: "column",
          gap: isTablet ? "28px" : "36px",
          alignItems: "flex-start",
          minWidth: isTablet ? "auto" : "300px",
        }}>

          {/* stats — radial rings */}
          <div style={{
            display: "flex",
            gap: isTablet ? "clamp(24px,4vw,44px)" : "clamp(28px,3.5vw,52px)",
          }}>
            {STATS.map((s, i) => (
              <div key={i} ref={(el) => (statsRef.current[i] = el)}>
                <StatRing
                  value={s.value} label={s.label}
                  animate={statsGo}
                  delay={i * 0.18}
                  fillPct={s.fillPct}
                  size={isTablet ? 74 : 88}
                />
              </div>
            ))}
          </div>

          {/* quote card */}
          <div ref={quoteRef} style={{
            position: "relative",
            padding: "18px 22px",
            borderLeft: "2px solid rgba(44,85,132,0.45)",
            background: "rgba(44,85,132,0.04)",
            maxWidth: "300px",
          }}>
            {/* glow dots on border */}
            <div style={{
              position: "absolute", top: -1, left: -4,
              width: "7px", height: "7px", borderRadius: "50%",
              background: "#2C5584",
              boxShadow: "0 0 10px rgba(44,85,132,0.9)",
            }} />
            <div style={{
              position: "absolute", bottom: -1, left: -3,
              width: "4px", height: "4px", borderRadius: "50%",
              background: "rgba(44,85,132,0.45)",
            }} />
            <p style={{
              margin: 0, fontSize: "12px", lineHeight: 1.85,
              letterSpacing: "0.03em",
              color: "rgba(255,255,255,0.26)", fontStyle: "italic",
            }}>
              "I don't just write code —<br />
              I engineer <span style={{ color: "rgba(44,85,132,0.9)", fontStyle: "normal", fontWeight: 600 }}>experiences</span>."
            </p>
          </div>

          {/* location row */}
          <div ref={locationRef} style={{
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            {[
              { dot: true,  text: "Algeria · DZ" },
              { dot: false, text: "Remote ready" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {i > 0 && <div style={{ width: "1px", height: "10px", background: "rgba(255,255,255,0.08)", marginRight: "4px" }} />}
                <TimelineDot active={i === 0} />
                <span style={{
                  fontSize: "9px", letterSpacing: "0.2em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.2)",
                }}>{item.text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pdot {
          0%,100% { box-shadow: 0 0 0 2px rgba(74,222,128,0.12), 0 0 8px rgba(74,222,128,0.55); }
          50%      { box-shadow: 0 0 0 3px rgba(74,222,128,0.08), 0 0 16px rgba(74,222,128,0.9); }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-120%); }
          60%  { transform: translateX(220%); }
          100% { transform: translateX(220%); }
        }
      `}</style>
    </section>
  );
});

export default About;