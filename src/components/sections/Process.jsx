import { useRef, useEffect, forwardRef, useState, useCallback } from "react";

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
    index: "01",
    label: "Think",
    title: "Deep Research",
    shortDesc: "Understand before acting",
    desc: "I sit with the problem until the path becomes obvious — not assumed. Goals, constraints, and user needs are mapped before a single pixel is placed.",
    tags: ["Research", "Planning", "Scope"],
    symbol: "◎",
    phase: "Discovery",
    accent: "#4F8EF7",
    glowColor: "rgba(79,142,247,0.15)",
    borderColor: "rgba(79,142,247,0.25)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M11 8v6M8 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    index: "02",
    label: "Design",
    title: "Craft the Form",
    shortDesc: "Motion-first interfaces",
    desc: "Ideas become motion-first interfaces. Every spacing decision, typeface, and micro-interaction is deliberate — the result should feel inevitable, not designed.",
    tags: ["UI/UX", "Motion", "Prototype"],
    symbol: "◈",
    phase: "Design",
    accent: "#A78BFA",
    glowColor: "rgba(167,139,250,0.15)",
    borderColor: "rgba(167,139,250,0.25)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="17" cy="17" r="4" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    index: "03",
    label: "Build",
    title: "Write the Code",
    shortDesc: "Clean, typed, performant",
    desc: "Clean, typed, performant. React + TypeScript + GSAP with Supabase where needed. No dead code, no shortcuts — every component earns its place in the system.",
    tags: ["React", "TypeScript", "GSAP"],
    symbol: "◇",
    phase: "Engineering",
    accent: "#34D399",
    glowColor: "rgba(52,211,153,0.15)",
    borderColor: "rgba(52,211,153,0.25)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <polyline points="16,18 22,12 16,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="8,6 2,12 8,18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="14" y1="4" x2="10" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    index: "04",
    label: "Launch",
    title: "Ship & Refine",
    shortDesc: "Deploy with confidence",
    desc: "Deploy, verify, iterate. The work isn't done at merge — it ends when it's fast, accessible, and holds up under real conditions with real users.",
    tags: ["Deploy", "QA", "Iterate"],
    symbol: "◉",
    phase: "Release",
    accent: "#FB923C",
    glowColor: "rgba(251,146,60,0.15)",
    borderColor: "rgba(251,146,60,0.25)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const TIMER_MS = 5000;

/* ─── Typewriter hook ─────────────────────────────────────────────────────── */
function useTypewriter(text, active, speed = 16) {
  const [typed, setTyped] = useState("");
  const [done, setDone]   = useState(false);
  useEffect(() => {
    if (!active) { setTyped(""); setDone(false); return; }
    setTyped(""); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, active, speed]);
  return { typed, done };
}

/* ─── Progress ring ───────────────────────────────────────────────────────── */
function ProgressRing({ progress, color, size = 48, stroke = 2 }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - progress * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke}/>
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
}

/* ─── Step nav button ─────────────────────────────────────────────────────── */
function StepButton({ step, isActive, onClick }) {  // index removed (unused)
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Go to ${step.label}`}
      style={{
        all: "unset",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "14px 16px",
        borderRadius: "10px",
        border: `1px solid ${isActive ? step.borderColor : "rgba(255,255,255,0.05)"}`,
        background: isActive ? step.glowColor : hovered ? "rgba(255,255,255,0.03)" : "transparent",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: isActive ? `0 0 24px ${step.glowColor}, inset 0 0 24px ${step.glowColor}` : "none",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: "absolute",
        left: 0, top: "20%", bottom: "20%",
        width: "2px",
        borderRadius: "2px",
        background: step.accent,
        opacity: isActive ? 1 : 0,
        boxShadow: `0 0 8px ${step.accent}`,
        transition: "opacity 0.3s",
      }} />

      {/* Icon */}
      <div style={{
        color: isActive ? step.accent : "rgba(255,255,255,0.2)",
        transition: "color 0.3s",
        flexShrink: 0,
        display: "flex",
      }}>
        {step.icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: "9px",
          letterSpacing: "0.3em",
          color: isActive ? step.accent : "rgba(255,255,255,0.2)",
          marginBottom: "3px",
          transition: "color 0.3s",
        }}>{step.index} — {step.phase.toUpperCase()}</div>
        <div style={{
          fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          color: isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.3)",
          transition: "color 0.3s",
          letterSpacing: "-0.01em",
        }}>{step.label}</div>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div style={{
          width: "6px", height: "6px",
          borderRadius: "50%",
          background: step.accent,
          boxShadow: `0 0 8px ${step.accent}`,
          flexShrink: 0,
        }} />
      )}
    </button>
  );
}

/* ─── Main content panel ──────────────────────────────────────────────────── */
function ContentPanel({ step, isActive, timerProgress }) {
  const { typed, done } = useTypewriter(step.desc, isActive, 14);

  // Single counter: ms elapsed since typewriter finished.
  // All setState calls live inside setTimeout callbacks — never synchronously in an effect.
  const [msSinceDone, setMsSinceDone] = useState(0);
  const t1 = useRef(null);
  const t2 = useRef(null);
  const t3 = useRef(null);

  useEffect(() => {
    clearTimeout(t1.current);
    clearTimeout(t2.current);
    if (!done) return;
    t1.current = setTimeout(() => setMsSinceDone(200), 200);
    t2.current = setTimeout(() => setMsSinceDone(450), 450);
    return () => { clearTimeout(t1.current); clearTimeout(t2.current); };
  }, [done]);

  // Reset when panel deactivates — setState inside a timeout callback, not inline
  useEffect(() => {
    if (isActive) return;
    t3.current = setTimeout(() => setMsSinceDone(0), 0);
    return () => clearTimeout(t3.current);
  }, [isActive]);

  const showTags  = isActive && msSinceDone >= 200;
  const showStats = isActive && msSinceDone >= 450;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      opacity: isActive ? 1 : 0,
      transform: isActive ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)",
      pointerEvents: isActive ? "auto" : "none",
      position: isActive ? "relative" : "absolute",
    }}>
      {/* Phase badge row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "24px",
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "5px 12px",
          borderRadius: "100px",
          border: `1px solid ${step.borderColor}`,
          background: step.glowColor,
        }}>
          <div style={{ color: step.accent, display:"flex" }}>{step.icon}</div>
          <span style={{
            fontFamily: "'SF Mono', 'Fira Code', monospace",
            fontSize: "9px",
            letterSpacing: "0.25em",
            color: step.accent,
            fontWeight: 600,
          }}>{step.phase.toUpperCase()}</span>
        </div>

        <div style={{
          flex: 1, height: "1px",
          background: `linear-gradient(90deg, ${step.borderColor}, transparent)`,
        }} />

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <ProgressRing progress={timerProgress} color={step.accent} size={36} stroke={2} />
          <span style={{
            fontFamily: "'SF Mono', monospace",
            fontSize: "9px",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.2em",
          }}>{step.index}/04</span>
        </div>
      </div>

      {/* Big index ghost */}
      <div aria-hidden="true" style={{
        position: "absolute",
        top: "10%", right: "-2%",
        fontFamily: "'Helvetica Neue', sans-serif",
        fontSize: "clamp(8rem, 18vw, 16rem)",
        fontWeight: 900,
        color: "transparent",
        WebkitTextStroke: `1px ${step.borderColor}`,
        lineHeight: 1,
        letterSpacing: "-0.06em",
        userSelect: "none",
        pointerEvents: "none",
        opacity: 0.5,
      }}>{step.index}</div>

      {/* Main title */}
      <div style={{ position: "relative", marginBottom: "8px" }}>
        <h2 style={{
          margin: 0,
          fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
          fontSize: "clamp(2.6rem, 5vw, 5rem)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 0.95,
          color: "rgba(255,255,255,0.95)",
        }}>
          {step.title}
          <span style={{ color: step.accent }}>.</span>
        </h2>
      </div>

      {/* Short desc */}
      <p style={{
        margin: "0 0 28px",
        fontFamily: "'SF Mono', 'Fira Code', monospace",
        fontSize: "11px",
        letterSpacing: "0.2em",
        color: step.accent,
        opacity: 0.7,
        textTransform: "uppercase",
      }}>{step.shortDesc}</p>

      {/* Divider */}
      <div style={{
        height: "1px",
        background: `linear-gradient(90deg, ${step.borderColor}, transparent)`,
        marginBottom: "28px",
      }} />

      {/* Typewriter block */}
      <div style={{
        flex: 1,
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)",
        lineHeight: 1.85,
        color: "rgba(255,255,255,0.55)",
        letterSpacing: "0.01em",
        position: "relative",
        minHeight: "80px",
      }}>
        <span style={{ color: step.accent, fontFamily: "'SF Mono', monospace", fontSize: "12px", opacity: 0.6 }}>&gt;_ </span>
        {typed}
        {isActive && !done && (
          <span style={{
            display: "inline-block",
            width: "2px",
            height: "1em",
            background: step.accent,
            verticalAlign: "middle",
            marginLeft: "2px",
            animation: "blink 1s step-end infinite",
          }} />
        )}
      </div>

      {/* Tags */}
      <div style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        marginTop: "24px",
        opacity: showTags ? 1 : 0,
        transform: showTags ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.4s, transform 0.4s",
      }}>
        {step.tags.map((tag) => (
          <span key={tag} style={{
            fontFamily: "'SF Mono', 'Fira Code', monospace",
            fontSize: "9px",
            letterSpacing: "0.2em",
            padding: "6px 14px",
            borderRadius: "100px",
            border: `1px solid ${step.borderColor}`,
            background: step.glowColor,
            color: step.accent,
            textTransform: "uppercase",
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Stats row */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginTop: "24px",
        paddingTop: "20px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        opacity: showStats ? 1 : 0,
        transform: showStats ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.4s 0.1s, transform 0.4s 0.1s",
      }}>
        {[
          { label: "Phase", value: step.index + "/04" },
          { label: "Stage", value: step.phase },
          { label: "Status", value: "Active", highlight: true },
        ].map(({ label, value, highlight }) => (
          <div key={label}>
            <div style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.25em",
              color: "rgba(255,255,255,0.2)",
              marginBottom: "4px",
              textTransform: "uppercase",
            }}>{label}</div>
            <div style={{
              fontFamily: "'Helvetica Neue', sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              color: highlight ? step.accent : "rgba(255,255,255,0.7)",
              letterSpacing: "-0.01em",
            }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Process (main export) ───────────────────────────────────────────────── */
const Process = forwardRef(function Process({ isMobile }, ref) {
  const bp       = useBreakpoint();
  const isTablet = bp === "tablet";

  const [active,     setActive]     = useState(0);
  const [timerPct,   setTimerPct]   = useState(0);
  const [isEntered,  setIsEntered]  = useState(false);
  const timerRef   = useRef(null);
  const tickRef    = useRef(null);
  const startTs    = useRef(null);
  const prevActive = useRef(0);

  /* ─── goTo (manual navigation) ── */
  const goTo = useCallback((next) => {
    if (next === prevActive.current) return;
    prevActive.current = next;
    setActive(next);
    setTimerPct(0);
    startTs.current = Date.now();
  }, []);

  /* ─── Timer ── */
  // All interval/tick logic lives in refs so effects never call setState synchronously
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(tickRef.current);
    startTs.current = Date.now();

    tickRef.current = setInterval(() => {
      const elapsed = Date.now() - startTs.current;
      setTimerPct(Math.min(elapsed / TIMER_MS, 1));
    }, 50);

    timerRef.current = setInterval(() => {
      const next = (prevActive.current + 1) % STEPS.length;
      prevActive.current = next;
      setActive(next);
      setTimerPct(0);
      startTs.current = Date.now();
    }, TIMER_MS);
  }, []);

  // Mount / unmount only — startTimer is stable (empty deps via useCallback)
  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(timerRef.current);
      clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (i) => { goTo(i); startTimer(); };

  /* ─── Observer entrance ── */
  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsEntered(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);

  const activeStep = STEPS[active];

  return (
    <section ref={ref} style={{
      position: "fixed",
      inset: 0,
      width: "100%",
      height: "100vh",
      background: "#080C12",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      opacity: isEntered ? 1 : 0,
      transform: isEntered ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)",
    }}>

      {/* ── Grid background ── */}
      <div aria-hidden="true" style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        zIndex: 0,
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
      }} />

      {/* ── Ambient glow ── */}
      <div aria-hidden="true" style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        background: `radial-gradient(ellipse 60% 50% at 70% 50%, ${activeStep.glowColor}, transparent)`,
        transition: "background 0.8s ease",
      }} />


      {/* ── Main layout ── */}
      <div style={{
        position: "relative",
        zIndex: 5,
        flex: 1,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        padding: isMobile ? "72px 18px 16px" : isTablet ? "80px 40px 24px" : "80px 48px 28px",
        gap: isMobile ? "16px" : "48px",
        overflow: "hidden",
        boxSizing: "border-box",
      }}>

        {/* ── LEFT: Header + Nav ── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          width: isMobile ? "100%" : isTablet ? "220px" : "260px",
          flexShrink: 0,
          gap: isMobile ? "16px" : "24px",
        }}>
          {/* Title block */}
          <div style={{ flexShrink: 0 }}>
            <h1 style={{
              margin: "0 0 4px",
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              fontSize: isMobile ? "1.6rem" : "clamp(1.8rem, 2.8vw, 2.8rem)",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              color: "rgba(255,255,255,0.92)",
            }}>
              My{" "}
              <span style={{
                color: "transparent",
                WebkitTextStroke: `1.5px ${activeStep.accent}`,
                transition: "WebkitTextStroke 0.4s",
              }}>Process</span>
              <span style={{ color: activeStep.accent, transition: "color 0.4s" }}>.</span>
            </h1>
            {!isMobile && (
              <p style={{
                margin: 0,
                fontFamily: "'Georgia', serif",
                fontSize: "13px",
                color: "rgba(255,255,255,0.25)",
                lineHeight: 1.6,
                letterSpacing: "0.01em",
              }}>
                Four phases. No shortcuts.
              </p>
            )}
          </div>

          {/* Mobile: horizontal step tabs */}
          {isMobile ? (
            <div style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "4px",
            }}>
              {STEPS.map((step, i) => (
                <button
                  key={i}
                  onClick={() => handleClick(i)}
                  style={{
                    all: "unset",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    border: `1px solid ${active === i ? step.borderColor : "rgba(255,255,255,0.05)"}`,
                    background: active === i ? step.glowColor : "transparent",
                    transition: "all 0.3s",
                    flexShrink: 0,
                  }}
                >
                  <div style={{
                    color: active === i ? step.accent : "rgba(255,255,255,0.2)",
                    transition: "color 0.3s",
                    display: "flex",
                  }}>{step.icon}</div>
                  <span style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "8px",
                    letterSpacing: "0.2em",
                    color: active === i ? step.accent : "rgba(255,255,255,0.2)",
                    transition: "color 0.3s",
                  }}>{step.label.toUpperCase()}</span>
                </button>
              ))}
            </div>
          ) : (
            /* Desktop/tablet: vertical nav */
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              flex: 1,
            }}>
              {STEPS.map((step, i) => (
                <StepButton
                  key={i}
                  step={step}
                  isActive={active === i}
                  onClick={() => handleClick(i)}
                />
              ))}
            </div>
          )}

          {/* Bottom meta */}
          {!isMobile && (
            <div style={{
              padding: "14px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(255,255,255,0.02)",
            }}>
              <div style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "8px",
                letterSpacing: "0.25em",
                color: "rgba(255,255,255,0.15)",
                marginBottom: "10px",
                textTransform: "uppercase",
              }}>Overall Progress</div>
              {/* Step progress bars */}
              {STEPS.map((step, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}>
                  <span style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "8px",
                    color: i <= active ? step.accent : "rgba(255,255,255,0.1)",
                    width: "16px",
                    transition: "color 0.4s",
                  }}>{step.index}</span>
                  <div style={{
                    flex: 1,
                    height: "2px",
                    borderRadius: "2px",
                    background: "rgba(255,255,255,0.05)",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%",
                      width: i < active ? "100%" : i === active ? `${timerPct * 100}%` : "0%",
                      background: step.accent,
                      borderRadius: "2px",
                      transition: i < active ? "width 0.4s" : "none",
                      boxShadow: `0 0 6px ${step.accent}`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Vertical divider ── */}
        {!isMobile && (
          <div style={{
            width: "1px",
            flexShrink: 0,
            background: "rgba(255,255,255,0.06)",
            position: "relative",
          }}>
            <div style={{
              position: "absolute",
              top: 0, left: 0,
              width: "100%",
              height: `${((active + 1) / STEPS.length) * 100}%`,
              background: `linear-gradient(to bottom, ${activeStep.accent}, transparent)`,
              opacity: 0.6,
              transition: "height 0.8s cubic-bezier(0.4,0,0.2,1)",
            }} />
          </div>
        )}

        {/* ── RIGHT: Content panel ── */}
        <div style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: isMobile ? "0" : "4px 0",
        }}>
          {/* Panel border glow */}
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "12px",
            border: `1px solid ${activeStep.borderColor}`,
            transition: "border-color 0.5s",
            pointerEvents: "none",
            zIndex: 0,
            boxShadow: `inset 0 0 40px ${activeStep.glowColor}`,
          }} />

          <div style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            overflow: "hidden",
            padding: isMobile ? "20px" : "32px",
            boxSizing: "border-box",
          }}>
            {STEPS.map((step, i) => (
              <ContentPanel
                key={i}
                step={step}
                isActive={active === i}
                timerProgress={active === i ? timerPct : 0}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Global CSS ── */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
});

export default Process;