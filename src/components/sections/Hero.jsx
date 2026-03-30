import { useRef, useEffect, useState, useCallback, forwardRef } from "react";
import gsap from "gsap";

/* ─── Breakpoint ─────────────────────────────────────────────────────────── */
function useBreakpoint() {
  const get = useCallback(() => {
    const w = window.innerWidth;
    if (w < 640)  return "mobile";
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

/* ─── Syntax-highlight span ──────────────────────────────────────────────── */
function S({ c, children }) {
  return <span style={{ color: c }}>{children}</span>;
}

/* ─── Noise overlay ──────────────────────────────────────────────────────── */
function NoiseOverlay() {
  return (
    <svg aria-hidden="true" style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      zIndex: 0, pointerEvents: "none", opacity: 0.035,
    }}>
      <filter id="hero-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#hero-noise)"/>
    </svg>
  );
}

/* ─── Orb ────────────────────────────────────────────────────────────────── */
function Orb({ style }) {
  return (
    <div aria-hidden="true" style={{
      position: "absolute", borderRadius: "50%",
      background: "radial-gradient(circle at 40% 40%, rgba(44,85,132,0.13), transparent 70%)",
      pointerEvents: "none", zIndex: 0,
      ...style,
    }}/>
  );
}

/* ─── Corner accents ─────────────────────────────────────────────────────── */
function CornerAccents() {
  const corners = [
    { top: 0,    left: 0,    borderTop: "1px solid rgba(44,85,132,0.25)", borderLeft:  "1px solid rgba(44,85,132,0.25)" },
    { top: 0,    right: 0,   borderTop: "1px solid rgba(44,85,132,0.25)", borderRight: "1px solid rgba(44,85,132,0.25)" },
    { bottom: 0, left: 0,    borderBottom: "1px solid rgba(44,85,132,0.25)", borderLeft:  "1px solid rgba(44,85,132,0.25)" },
    { bottom: 0, right: 0,   borderBottom: "1px solid rgba(44,85,132,0.25)", borderRight: "1px solid rgba(44,85,132,0.25)" },
  ];
  return corners.map((s, i) => (
    <div key={i} aria-hidden="true" style={{
      position: "absolute", width: "28px", height: "28px",
      pointerEvents: "none", zIndex: 2, margin: "20px",
      ...s,
    }}/>
  ));
}

/* ─── Grid floor ─────────────────────────────────────────────────────────── */
function GridFloor({ gridRef }) {
  return (
    <div ref={gridRef} aria-hidden="true" style={{
      position: "absolute", bottom: 0, left: "-20%", right: "-20%",
      height: "48%", zIndex: 0, opacity: 0,
      backgroundImage: `linear-gradient(rgba(44,85,132,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(44,85,132,0.1) 1px, transparent 1px)`,
      backgroundSize: "60px 60px",
      maskImage: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 90%)",
      WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 90%)",
      transform: "perspective(500px) rotateX(58deg)",
      transformOrigin: "bottom center",
    }}/>
  );
}

/* ─── Stat pill ──────────────────────────────────────────────────────────── */
function StatPill({ value, label, delay, entered }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!entered) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", delay }
    );
  }, [entered, delay]);
  return (
    <div ref={ref} style={{
      opacity: 0,
      display: "flex", flexDirection: "column", gap: "3px",
      padding: "12px 18px",
      border: "1px solid rgba(44,85,132,0.22)",
      borderRadius: "10px",
      background: "rgba(44,85,132,0.06)",
      backdropFilter: "blur(8px)",
    }}>
      <span style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 800,
        fontSize: "22px", letterSpacing: "-0.04em", lineHeight: 1,
        color: "rgba(255,255,255,0.9)",
      }}>{value}</span>
      <span style={{
        fontFamily: "Georgia, serif", fontStyle: "italic",
        fontSize: "10px", color: "rgba(44,85,132,0.65)",
        letterSpacing: "0.1em",
      }}>{label}</span>
    </div>
  );
}

/* ─── Code lines data ────────────────────────────────────────────────────── */
const CODE_LINES = [
  [
    { c: "#ce93d8", t: "import" }, { c: "rgba(255,255,255,0.7)", t: " {identity} " },
    { c: "#ce93d8", t: "from" },   { c: "#a5d6a7", t: " '@core/self'" },
  ],
  [
    { c: "#ce93d8", t: "const" }, { c: "#4fc3f7", t: " developer" },
    { c: "rgba(255,255,255,0.4)", t: " =" }, { c: "rgba(255,255,255,0.7)", t: " {" },
  ],
  [
    { c: "rgba(255,255,255,0.38)", t: "\u00a0\u00a0name:" },
    { c: "#a5d6a7", t: ' "Riadh Bellala"' },
  ],
  [
    { c: "rgba(255,255,255,0.38)", t: "\u00a0\u00a0role:" },
    { c: "#a5d6a7", t: ' "Frontend Engineer"' },
  ],
  [
    { c: "rgba(255,255,255,0.7)", t: "}" },
  ],
];

/* ─── Nav card items — section indices match Home.jsx sectionRefs order ─── */
// 0=Hero, 1=Projects, 2=About, 3=Contact
const NAV_ITEMS = [
  { label: "Work",    sub: "View my projects",     sectionIndex: 1, icon: "◈" },
  { label: "About",   sub: "Skills & process",     sectionIndex: 2, icon: "?" },
  { label: "Contact", sub: "Let's build together", sectionIndex: 3, icon: "→" },
];

/* ─── Nav card ───────────────────────────────────────────────────────────── */
function NavCard({ item, onGoTo, isMobile }) {
  const innerRef = useRef(null);

  const handleClick = useCallback(() => {
    const dir = item.sectionIndex > 0 ? "down" : "up";
    onGoTo(item.sectionIndex, dir);
  }, [item.sectionIndex, onGoTo]);

  const handleMouseEnter = useCallback((e) => {
    gsap.to(e.currentTarget, { x: 6, duration: 0.3, ease: "power2.out" });
    if (innerRef.current) {
      innerRef.current.style.borderColor = "rgba(44,85,132,0.45)";
      innerRef.current.style.background  = "rgba(44,85,132,0.1)";
    }
  }, []);

  const handleMouseLeave = useCallback((e) => {
    gsap.to(e.currentTarget, { x: 0, duration: 0.4, ease: "power2.out" });
    if (innerRef.current) {
      innerRef.current.style.borderColor = "rgba(44,85,132,0.18)";
      innerRef.current.style.background  = "rgba(44,85,132,0.04)";
    }
  }, []);

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "block", width: "100%",
        background: "none", border: "none",
        padding: 0, cursor: "pointer", textAlign: "left",
      }}
    >
      <div ref={innerRef} style={{
        padding: isMobile ? "12px 14px" : "14px 18px",
        border: "1px solid rgba(44,85,132,0.18)",
        borderRadius: "12px",
        background: "rgba(44,85,132,0.04)",
        display: "flex", alignItems: "center", gap: "16px",
        transition: "border-color 0.25s, background 0.25s",
      }}>
        <div style={{
          width: "38px", height: "38px", flexShrink: 0,
          border: "1px solid rgba(44,85,132,0.3)",
          borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(44,85,132,0.08)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "16px",
          color: "rgba(44,85,132,0.85)",
        }}>{item.icon}</div>
        <div>
          <p style={{
            margin: "0 0 2px",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            fontSize: "14px", color: "rgba(255,255,255,0.85)",
            letterSpacing: "-0.02em",
          }}>{item.label}</p>
          <p style={{
            margin: 0,
            fontFamily: "Georgia, serif", fontStyle: "italic",
            fontSize: "10px", color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.05em",
          }}>{item.sub}</p>
        </div>
        <span style={{
          marginLeft: "auto",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "16px", color: "rgba(44,85,132,0.5)",
        }}>→</span>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FULL-SCREEN CODE LOADER
═══════════════════════════════════════════════════════════════ */
function CodeLoader({ onDone }) {
  const overlayRef  = useRef(null);
  const canvasRef   = useRef(null);
  const centerRef   = useRef(null);
  const progressRef = useRef(null);
  const pctRef      = useRef(null);
  const statusRef   = useRef(null);
  const glitchRef   = useRef(null);

  const STATUS = [
    { pct: 0,   text: "INITIALIZING RUNTIME" },
    { pct: 18,  text: "LOADING IDENTITY MODULE" },
    { pct: 35,  text: "COMPILING SKILL STACK" },
    { pct: 55,  text: "RESOLVING DEPENDENCIES" },
    { pct: 72,  text: "BUILDING PORTFOLIO" },
    { pct: 88,  text: "BUNDLING INTERFACE" },
    { pct: 100, text: "LAUNCH READY" },
  ];

  /* ── rain canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const POOL = "import{export}const async function return await=>[](){}typescript react next gsap void null true false 01// /* */ &&||!======>_riadh_bellala_frontend engineer algeria #2C5584 #4fc3f7 render build deploy compile init load";
    const chars = POOL.split("");
    const FONT_SIZE = 13;
    let drops = Array.from({ length: Math.floor(window.innerWidth / FONT_SIZE) }, () => Math.random() * -60);
    const speeds = drops.map(() => 0.25 + Math.random() * 0.6);
    let alive = true;

    function draw() {
      if (!alive) return;
      ctx.fillStyle = "rgba(5,5,5,0.16)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drops.forEach((_, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * FONT_SIZE, y = drops[i] * FONT_SIZE;
        ctx.font = `${FONT_SIZE}px "Fira Code", monospace`;
        ctx.fillStyle = "rgba(200,230,255,0.88)";
        ctx.fillText(char, x, y);
        ctx.fillStyle = "rgba(44,85,132,0.22)";
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - FONT_SIZE);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += speeds[i];
      });
      requestAnimationFrame(draw);
    }
    draw();
    return () => { alive = false; window.removeEventListener("resize", resize); };
  }, []);

  /* ── progress timeline ── */
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(centerRef.current,
      { opacity: 0, y: 20, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
      0.35
    );

    STATUS.forEach(({ pct, text }, i) => {
      const at = 0.5 + i * 0.55;
      tl.to(progressRef.current, { width: `${pct}%`, duration: 0.45, ease: "power2.out" }, at);
      tl.call(() => {
        if (pctRef.current)    pctRef.current.textContent    = `${pct}%`;
        if (statusRef.current) statusRef.current.textContent = text;
      }, [], at);
    });

    const endT = 0.5 + (STATUS.length - 1) * 0.55 + 0.6;
    [0, 0.1, 0.22].forEach((offset, i) => {
      tl.to(glitchRef.current, { opacity: i % 2 === 0 ? 0.6 : 0, duration: 0.05 }, endT + offset);
    });
    tl.set(glitchRef.current, { opacity: 0 }, endT + 0.35);
    tl.to(overlayRef.current, { clipPath: "inset(0 0 100% 0)", duration: 0.85, ease: "power4.inOut" }, endT + 0.45);
    tl.call(onDone, [], endT + 0.45 + 0.85);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={overlayRef} style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "#050505",
      clipPath: "inset(0 0 0% 0)", overflow: "hidden",
      fontFamily: "'Fira Code','Cascadia Code','Courier New',monospace",
    }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}/>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 55% at 50% 50%, transparent 25%, rgba(5,5,5,0.92) 100%)" }}/>
      <div ref={glitchRef} style={{ position: "absolute", inset: 0, opacity: 0, pointerEvents: "none", background: "rgba(44,85,132,0.4)", mixBlendMode: "screen" }}/>

      <div ref={centerRef} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(540px,90vw)", opacity: 0 }}>
        {/* window chrome */}
        <div style={{ background: "rgba(10,14,22,0.97)", border: "1px solid rgba(44,85,132,0.55)", borderBottom: "none", borderRadius: "8px 8px 0 0", padding: "10px 18px", display: "flex", alignItems: "center", gap: "14px", backdropFilter: "blur(24px)" }}>
          <div style={{ display: "flex", gap: "7px" }}>
            {["#ea4335","#fbbc05","#34a853"].map(c => <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c, opacity: 0.75 }}/>)}
          </div>
          <span style={{ fontSize: "11px", letterSpacing: "0.18em", color: "rgba(44,85,132,0.85)" }}>
            riadh.dev — <span style={{ color: "rgba(255,255,255,0.22)" }}>compiler.ts</span>
          </span>
        </div>

        {/* code body */}
        <div style={{ background: "rgba(8,11,18,0.97)", border: "1px solid rgba(44,85,132,0.25)", borderTop: "none", borderRadius: "0 0 8px 8px", padding: "26px 26px 22px", backdropFilter: "blur(24px)", display: "flex", flexDirection: "column", gap: "22px" }}>
          <div style={{ fontSize: "clamp(10px,1.35vw,13px)", lineHeight: "1.85" }}>
            {CODE_LINES.map((tokens, i) => (
              <div key={i} style={{ display: "flex", alignItems: "baseline", minHeight: "1.85em" }}>
                <span style={{ width: "30px", flexShrink: 0, textAlign: "right", paddingRight: "14px", color: "rgba(44,85,132,0.3)", fontSize: "10px", userSelect: "none" }}>{i + 1}</span>
                <span style={{ color: "rgba(255,255,255,0.8)" }}>
                  {tokens.map((tok, j) => (
                    <S key={j} c={tok.c}>{tok.t}</S>
                  ))}
                </span>
              </div>
            ))}
          </div>

          <div style={{ height: "1px", background: "linear-gradient(90deg,transparent,rgba(44,85,132,0.4),transparent)" }}/>

          {/* progress */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34a853", boxShadow: "0 0 8px rgba(52,168,83,0.9)", animation: "loader-pulse 1.2s ease-in-out infinite" }}/>
                <span ref={statusRef} style={{ fontSize: "10px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.32)" }}>INITIALIZING RUNTIME</span>
              </div>
              <span ref={pctRef} style={{ fontSize: "13px", letterSpacing: "0.08em", color: "rgba(44,85,132,0.85)", fontWeight: 700 }}>0%</span>
            </div>
            <div style={{ height: "3px", background: "rgba(44,85,132,0.12)", borderRadius: "2px", overflow: "hidden" }}>
              <div ref={progressRef} style={{ height: "100%", width: "0%", background: "linear-gradient(90deg,#2C5584,#4fc3f7)", borderRadius: "2px", boxShadow: "0 0 14px rgba(79,195,247,0.65)" }}/>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes loader-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.3;transform:scale(0.75)}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════ */
const Hero = forwardRef(function Hero({ isMobile: isMobileProp, onGoTo }, ref) {
  const bp       = useBreakpoint();
  const isTablet = bp === "tablet";
  const isMobile = isMobileProp ?? bp === "mobile";

  const [loaded, setLoaded] = useState(false);

  /* refs */
  const eyebrowRef = useRef(null);
  const nameRef    = useRef(null);
  const roleRef    = useRef(null);
  const lineRef    = useRef(null);
  const bioRef     = useRef(null);
  const statusRef  = useRef(null);
  const statsRef   = useRef(null);
  const ctaRef     = useRef(null);
  const gridRef    = useRef(null);
  const glowRef    = useRef(null);

  const hasEntered = useRef(false);
  const [entered, setEntered] = useState(false);

  /* ── initial hide ── */
  useEffect(() => {
    [eyebrowRef, nameRef, roleRef, lineRef, bioRef, statusRef, statsRef, ctaRef].forEach(r => {
      if (r.current) gsap.set(r.current, { opacity: 0, y: 18 });
    });
    if (gridRef.current) gsap.set(gridRef.current, { opacity: 0 });
  }, []);

  /* ── entrance ── */
  const playEntrance = useCallback(() => {
    if (hasEntered.current) return;
    hasEntered.current = true;
    setEntered(true);
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(gridRef.current,    { opacity: 1, duration: 1.2 })
      .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.8")
      .to(nameRef.current,    { opacity: 1, y: 0, duration: 0.75 }, "-=0.3")
      .to(lineRef.current,    { opacity: 1, y: 0, duration: 0.45 }, "-=0.4")
      .to(roleRef.current,    { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      .to(bioRef.current,     { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      .to(statsRef.current,   { opacity: 1, y: 0, duration: 0.5 }, "-=0.25")
      .to(statusRef.current,  { opacity: 1, y: 0, duration: 0.45 }, "-=0.25")
      .to(ctaRef.current,     { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
  }, []);

  /* ── trigger entrance after loader ── */
  useEffect(() => {
    if (loaded) {
      const id = requestAnimationFrame(() => playEntrance());
      return () => cancelAnimationFrame(id);
    }
  }, [loaded, playEntrance]);

  /* ── mouse glow parallax ── */
  useEffect(() => {
    if (isMobile || !loaded) return;
    const onMove = (e) => {
      gsap.to(glowRef.current, { x: e.clientX, y: e.clientY, duration: 2.5, ease: "power2.out" });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isMobile, loaded]);

  const sectionStyle = {
    position: "fixed", inset: 0,
    width: "100%", height: "100vh",
    background: "#080808",
    overflow: "hidden",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxSizing: "border-box",
    padding: isMobile ? "0 28px" : isTablet ? "0 56px" : "0 8%",
  };

  /* ══ MOBILE ══ */
  if (isMobile) {
    return (
      <>
        {!loaded && <CodeLoader onDone={() => setLoaded(true)} />}
        <section ref={ref} style={sectionStyle}>
          <NoiseOverlay/>
          <CornerAccents/>
          <Orb style={{ width: "320px", height: "320px", top: "-80px", right: "-100px" }}/>
          <Orb style={{ width: "240px", height: "240px", bottom: "-60px", left: "-80px" }}/>
          <GridFloor gridRef={gridRef}/>

          <div style={{
            position: "relative", zIndex: 1, width: "100%",
            display: "flex", flexDirection: "column", gap: "20px",
            paddingTop: "24px",
          }}>
            {/* eyebrow */}
            <p ref={eyebrowRef} style={{
              margin: 0, fontFamily: "Georgia, serif", fontStyle: "italic",
              fontSize: "11px", color: "rgba(44,85,132,0.65)", letterSpacing: "0.12em",
            }}>
              Nice to meet you —
            </p>

            {/* name */}
            <div ref={nameRef}>
              <h1 style={{
                margin: "0 0 10px",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 800,
                fontSize: "clamp(2.2rem,11vw,3.2rem)",
                letterSpacing: "-0.04em", lineHeight: 0.93,
                color: "rgba(255,255,255,0.92)",
              }}>
                Riadh<br/>
                <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(44,85,132,0.8)" }}>Bellala</span>
              </h1>
            </div>

            {/* divider */}
            <div ref={lineRef} style={{ height: "1px", background: "linear-gradient(90deg, rgba(44,85,132,0.7), transparent)", width: "160px" }}/>

            {/* role */}
            <p ref={roleRef} style={{
              margin: 0, fontFamily: "Georgia, serif", fontStyle: "italic",
              fontSize: "12px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em",
            }}>
              Frontend Developer · CS Student · Algeria
            </p>

            {/* bio */}
            <p ref={bioRef} style={{
              margin: 0, fontFamily: "Georgia, serif",
              fontSize: "13px", lineHeight: 1.85,
              color: "rgba(255,255,255,0.3)", fontStyle: "italic",
            }}>
              I craft interfaces that move — clean code, purposeful animation, and design that earns attention.
            </p>

            {/* stats */}
            <div ref={statsRef} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <StatPill value="3+"  label="Years building"   delay={0}   entered={entered}/>
              <StatPill value="10+" label="Projects shipped" delay={0.1} entered={entered}/>
            </div>

            {/* status */}
            <div ref={statusRef} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "hero-glow 2s ease-in-out infinite" }}/>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>Available for projects</span>
            </div>

            {/* nav cards — mobile */}
            <div ref={ctaRef} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {NAV_ITEMS.map((item) => (
                <NavCard key={item.label} item={item} onGoTo={onGoTo} isMobile={true}/>
              ))}
            </div>
          </div>

          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;800&display=swap');
            @keyframes hero-glow { 0%,100%{box-shadow:0 0 6px rgba(74,222,128,0.5)} 50%{box-shadow:0 0 18px rgba(74,222,128,0.9)} }
          `}</style>
        </section>
      </>
    );
  }

  /* ══ DESKTOP / TABLET ══ */
  return (
    <>
      {!loaded && <CodeLoader onDone={() => setLoaded(true)} />}
      <section ref={ref} style={sectionStyle}>
        <NoiseOverlay/>
        <CornerAccents/>
        <Orb style={{ width: "600px", height: "600px", top: "-200px", right: "-150px" }}/>
        <Orb style={{ width: "400px", height: "400px", bottom: "-150px", left: "-100px" }}/>
        <GridFloor gridRef={gridRef}/>

        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(44,85,132,0.2), transparent)" }}/>
        <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: "8%", right: "8%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(44,85,132,0.2), transparent)" }}/>

        {/* mouse-tracking glow */}
        <div ref={glowRef} aria-hidden="true" style={{
          position: "absolute", top: 0, left: 0,
          width: "800px", height: "800px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(44,85,132,0.11) 0%, transparent 65%)",
          pointerEvents: "none", filter: "blur(60px)", zIndex: 0,
          transform: "translate(-50%,-50%)",
        }}/>

        {/* 3-column grid */}
        <div style={{
          position: "relative", zIndex: 1,
          display: "grid",
          gridTemplateColumns: isTablet ? "1fr 1fr" : "1.2fr 0.5fr 1fr",
          gap: isTablet ? "64px" : "clamp(48px, 5vw, 96px)",
          width: "100%", maxWidth: "1280px",
          alignItems: "center",
        }}>

          {/* COL 1 — identity */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <p ref={eyebrowRef} style={{ margin: 0, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "12px", color: "rgba(44,85,132,0.65)", letterSpacing: "0.14em" }}>
              Nice to meet you —
            </p>
            <div ref={nameRef}>
              <h1 style={{ margin: "0 0 12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(3rem, 5.5vw, 6rem)", letterSpacing: "-0.05em", lineHeight: 0.88, color: "rgba(255,255,255,0.93)" }}>
                Riadh<br/>
                <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(44,85,132,0.8)" }}>Bellala</span>
              </h1>
            </div>
            <div ref={lineRef} style={{ width: "200px", height: "1px", background: "linear-gradient(90deg, rgba(44,85,132,0.7), transparent)" }}/>
            <p ref={roleRef} style={{ margin: 0, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "13px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.07em" }}>
              Frontend Developer · CS Student · Algeria
            </p>
            <p ref={bioRef} style={{ margin: 0, maxWidth: "340px", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "14px", lineHeight: 1.9, color: "rgba(255,255,255,0.28)" }}>
              I craft interfaces that move — clean code, purposeful animation, and design that earns attention. I turn ideas into polished products.
            </p>
            <div ref={statsRef} style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <StatPill value="3+"  label="Years building"   delay={0}   entered={entered}/>
              <StatPill value="10+" label="Projects shipped"  delay={0.1} entered={entered}/>
              <StatPill value="∞"   label="Coffee consumed"  delay={0.2} entered={entered}/>
            </div>
          </div>

          {/* COL 2 — separator (desktop only) */}
          {!isTablet && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px", height: "100%" }}>
              <div style={{ width: "1px", flex: 1, maxHeight: "280px", background: "linear-gradient(to bottom, transparent, rgba(44,85,132,0.22), transparent)" }}/>
              <div style={{ width: "52px", height: "52px", border: "1px solid rgba(44,85,132,0.25)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(44,85,132,0.06)", flexShrink: 0 }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: "14px", color: "rgba(44,85,132,0.7)", letterSpacing: "0.05em" }}>RB</span>
              </div>
              <div style={{ width: "1px", flex: 1, maxHeight: "280px", background: "linear-gradient(to bottom, transparent, rgba(44,85,132,0.22), transparent)" }}/>
            </div>
          )}

          {/* COL 3 — nav cards */}
          <div ref={ctaRef} style={{ display: "flex", flexDirection: "column", gap: "32px", opacity: 0 }}>
            <p style={{ margin: 0, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "10px", letterSpacing: "0.2em", color: "rgba(44,85,132,0.5)", textTransform: "uppercase" }}>
              Quick links
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {NAV_ITEMS.map((item) => (
                <NavCard key={item.label} item={item} onGoTo={onGoTo} isMobile={false}/>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
              <div style={{ height: "1px", width: "32px", background: "rgba(44,85,132,0.3)" }}/>
              <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "10px", color: "rgba(44,85,132,0.45)", letterSpacing: "0.1em" }}>Algeria, DZ</span>
            </div>
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;800&display=swap');
          @keyframes hero-glow { 0%,100%{box-shadow:0 0 6px rgba(74,222,128,0.5)} 50%{box-shadow:0 0 18px rgba(74,222,128,0.95)} }
        `}</style>
      </section>
    </>
  );
});

export default Hero;