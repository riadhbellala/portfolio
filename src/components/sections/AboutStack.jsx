import { useRef, useEffect, forwardRef, useState, useCallback } from "react";
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

/* ─── Data ───────────────────────────────────────────────────────────────── */
const SKILLS = [
  { name: "React",      label: "UI & Components",    icon: "⚛",  color: "rgba(97,218,251,0.15)",  stroke: "rgba(97,218,251,0.4)"  },
  { name: "TypeScript", label: "Typed JavaScript",   icon: "TS", color: "rgba(49,120,198,0.15)",  stroke: "rgba(49,120,198,0.5)"  },
  { name: "GSAP",       label: "Motion & Animation", icon: "G",  color: "rgba(136,206,64,0.12)",  stroke: "rgba(136,206,64,0.45)" },
  { name: "Tailwind",   label: "Styling",            icon: "TW", color: "rgba(56,189,248,0.12)",  stroke: "rgba(56,189,248,0.4)"  },
  { name: "Supabase",   label: "Backend",            icon: "SB", color: "rgba(62,207,142,0.12)",  stroke: "rgba(62,207,142,0.4)"  },
];

const PROCESS = [
  { number: "01", title: "Think",  desc: "Understand the problem deeply before touching code.", symbol: "?" },
  { number: "02", title: "Design", desc: "Shape interactions and flows until they feel right.",  symbol: "◈" },
  { number: "03", title: "Build",  desc: "Clean, purposeful code — no more, no less.",          symbol: "</>" },
  { number: "04", title: "Ship",   desc: "Deliver on time with polish that speaks for itself.", symbol: "→" },
];

/* ─── Noise texture overlay ──────────────────────────────────────────────── */
function NoiseOverlay() {
  return (
    <svg aria-hidden="true" style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      zIndex: 0, pointerEvents: "none", opacity: 0.035,
    }}>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)"/>
    </svg>
  );
}

/* ─── Floating orb ───────────────────────────────────────────────────────── */
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

/* ─── Active dot strip ───────────────────────────────────────────────────── */
function DotStrip({ count, activeIndex }) {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{
          width:  i === activeIndex ? "18px" : "4px",
          height: "4px",
          borderRadius: "2px",
          background: i === activeIndex ? "rgba(44,85,132,0.75)" : "rgba(44,85,132,0.2)",
          display: "inline-block",
          transition: "width 0.35s ease, background 0.35s ease",
        }}/>
      ))}
    </div>
  );
}

/* ─── Cycling skill display ──────────────────────────────────────────────── */
function SkillCycler({ entered }) {
  const itemRefs   = useRef([]);
  const lineRef    = useRef(null);
  const [active, setActive] = useState(0);

  const HOLD     = 1.4;
  const FADE_IN  = 0.4;
  const FADE_OUT = 0.3;

  useEffect(() => {
    if (!entered) return;
    const els = itemRefs.current.filter(Boolean);
    if (!els.length) return;

    gsap.set(els, { opacity: 0, y: 0, clipPath: "inset(0 100% 0 0)" });

    let current = 0;

    function showNext() {
      const el = els[current];
      setActive(current);

      // animated underline wipe
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: FADE_IN + HOLD, ease: "none" }
        );
      }

      // clip-path reveal left→right + fade
      gsap.fromTo(el,
        { opacity: 0, clipPath: "inset(0 100% 0 0)", y: 6 },
        {
          opacity: 1, clipPath: "inset(0 0% 0 0)", y: 0,
          duration: FADE_IN, ease: "power2.out",
          onComplete() {
            // hold then exit upward + clip from right
            gsap.to(el, {
              delay: HOLD,
              opacity: 0, y: -8,
              duration: FADE_OUT, ease: "power2.in",
              onComplete() {
                gsap.set(el, { clipPath: "inset(0 100% 0 0)" });
                current = (current + 1) % els.length;
                showNext();
              }
            });
          }
        }
      );
    }

    showNext();
    return () => gsap.killTweensOf([...els, lineRef.current]);
  }, [entered]);

  return (
    <div style={{ position: "relative" }}>
      {/* animated underline track */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "1px", background: "rgba(44,85,132,0.08)",
      }}>
        <div ref={lineRef} style={{
          height: "100%", width: "100%",
          background: "linear-gradient(90deg, rgba(44,85,132,0.6), transparent)",
          transformOrigin: "left center", transform: "scaleX(0)",
        }}/>
      </div>

      {/* items */}
      <div style={{ position: "relative", height: "120px", paddingBottom: "12px" }}>
        {SKILLS.map((s, i) => (
          <div
            key={s.name}
            ref={el => { itemRefs.current[i] = el; }}
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", gap: "20px",
              opacity: 0,
              paddingBottom: "12px",
            }}
          >
            {/* icon badge — unique color per skill */}
            <div style={{
              width: "64px", height: "64px",
              border: `1px solid ${s.stroke}`,
              borderRadius: "14px",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: s.color,
              flexShrink: 0,
              position: "relative", overflow: "hidden",
            }}>
              {/* subtle corner accent */}
              <div style={{
                position: "absolute", top: 0, left: 0,
                width: "20px", height: "20px",
                borderRight: `1px solid ${s.stroke}`,
                borderBottom: `1px solid ${s.stroke}`,
                opacity: 0.4,
                borderRadius: "0 0 6px 0",
              }}/>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: s.icon.length > 1 ? "14px" : "24px",
                fontWeight: 800,
                color: s.stroke.replace("0.4", "0.9").replace("0.45", "0.9").replace("0.5", "0.9"),
                letterSpacing: s.icon.length > 1 ? "-0.03em" : "0",
                position: "relative", zIndex: 1,
              }}>{s.icon}</span>
            </div>

            {/* text */}
            <div>
              <p style={{
                margin: "0 0 4px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "20px", fontWeight: 800,
                color: "rgba(255,255,255,0.92)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}>{s.name}</p>
              <p style={{
                margin: 0,
                fontFamily: "Georgia, serif", fontStyle: "italic",
                fontSize: "11px",
                color: s.stroke.replace("0.4","0.65").replace("0.45","0.65").replace("0.5","0.65"),
                letterSpacing: "0.05em",
              }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* dot strip */}
      <div style={{ marginTop: "14px" }}>
        <DotStrip count={SKILLS.length} activeIndex={active}/>
      </div>
    </div>
  );
}

/* ─── Cycling process display ────────────────────────────────────────────── */
function ProcessCycler({ entered }) {
  const itemRefs = useRef([]);
  const [active, setActive] = useState(0);

  const HOLD     = 1.5;
  const FADE_IN  = 0.42;
  const FADE_OUT = 0.3;

  useEffect(() => {
    if (!entered) return;
    const els = itemRefs.current.filter(Boolean);
    if (!els.length) return;

    gsap.set(els, { opacity: 0, x: 0, y: 0 });

    let current = 0;

    function showNext() {
      const el = els[current];
      setActive(current);

      // slide in from right
      gsap.fromTo(el,
        { opacity: 0, x: 24, y: 0 },
        {
          opacity: 1, x: 0,
          duration: FADE_IN, ease: "power3.out",
          onComplete() {
            gsap.to(el, {
              delay: HOLD,
              opacity: 0, x: -20,
              duration: FADE_OUT, ease: "power2.in",
              onComplete() {
                gsap.set(el, { x: 0 });
                current = (current + 1) % els.length;
                showNext();
              }
            });
          }
        }
      );
    }

    // stagger start relative to skills
    setTimeout(showNext, 400);
    return () => gsap.killTweensOf(els);
  }, [entered]);

  return (
    <div>
      <div style={{ position: "relative", height: "120px" }}>
        {PROCESS.map((p, i) => (
          <div
            key={p.number}
            ref={el => { itemRefs.current[i] = el; }}
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", gap: "20px",
              opacity: 0,
            }}
          >
            {/* step badge — monochrome with glyph */}
            <div style={{
              width: "64px", height: "64px",
              border: "1px solid rgba(44,85,132,0.35)",
              borderRadius: "14px",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              background: "rgba(44,85,132,0.07)",
              flexShrink: 0, gap: "2px",
              position: "relative",
            }}>
              {/* step number top-left micro label */}
              <span style={{
                position: "absolute", top: "7px", left: "9px",
                fontFamily: "Georgia, serif",
                fontSize: "8px", color: "rgba(44,85,132,0.5)",
                letterSpacing: "0.1em",
              }}>{p.number}</span>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: p.symbol.length > 1 ? "14px" : "22px",
                fontWeight: 700,
                color: "rgba(44,85,132,0.85)",
              }}>{p.symbol}</span>
            </div>

            {/* text */}
            <div style={{ flex: 1 }}>
              <p style={{
                margin: "0 0 5px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "20px", fontWeight: 800,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "-0.03em", lineHeight: 1,
              }}>{p.title}</p>
              <p style={{
                margin: 0,
                fontFamily: "Georgia, serif", fontStyle: "italic",
                fontSize: "11px", lineHeight: 1.65,
                color: "rgba(255,255,255,0.28)",
                maxWidth: "200px",
              }}>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* dot strip */}
      <div style={{ marginTop: "14px" }}>
        <DotStrip count={PROCESS.length} activeIndex={active}/>
      </div>
    </div>
  );
}

/* ─── AboutStack (main) ──────────────────────────────────────────────────── */
const AboutStack = forwardRef(function AboutStack({ isMobile }, ref) {
  const bp       = useBreakpoint();
  const isTablet = bp === "tablet";
  const isMob    = bp === "mobile" || isMobile;

  const hasEntered = useRef(false);
  const [entered, setEntered] = useState(false);

  const eyebrowRef     = useRef(null);
  const nameRef        = useRef(null);
  const roleRef        = useRef(null);
  const lineRef        = useRef(null);
  const bioRef         = useRef(null);
  const statusRef      = useRef(null);
  const skillsHeadRef  = useRef(null);
  const dividerRef     = useRef(null);
  const processHeadRef = useRef(null);

  useEffect(() => {
    [eyebrowRef, nameRef, roleRef, lineRef, bioRef, statusRef,
     skillsHeadRef, dividerRef, processHeadRef].forEach(r => {
      if (r.current) gsap.set(r.current, { opacity: 0, y: 16 });
    });
  }, []);

  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    const obs = new MutationObserver(() => {
      const visible =
        el.style.visibility !== "hidden" &&
        parseFloat(el.style.opacity || "0") > 0.5;
      if (visible && !hasEntered.current) {
        hasEntered.current = true;
        setEntered(true);
        playEntrance();
      }
      if (!visible) hasEntered.current = false;
    });
    obs.observe(el, { attributes: true, attributeFilter: ["style"] });
    return () => obs.disconnect();
  }, [ref]);

  function playEntrance() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 })
      .to(nameRef.current,    { opacity: 1, y: 0, duration: 0.7 }, "-=0.2")
      .to(roleRef.current,    { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
      .to(lineRef.current,    { opacity: 1, y: 0, duration: 0.4 }, "-=0.2")
      .to(bioRef.current,     { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
      .to(statusRef.current,  { opacity: 1, y: 0, duration: 0.45 }, "-=0.25");

    tl.to(skillsHeadRef.current,  { opacity: 1, y: 0, duration: 0.4 }, 0.3)
      .to(dividerRef.current,     { opacity: 1, y: 0, duration: 0.3 }, 0.5)
      .to(processHeadRef.current, { opacity: 1, y: 0, duration: 0.4 }, 0.6);
  }

  const sectionStyle = {
    position: "fixed", inset: 0,
    width: "100%", height: "100vh",
    background: "#080808",
    overflow: "hidden",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxSizing: "border-box",
    padding: isMob ? "0 28px" : isTablet ? "0 56px" : "0 8%",
  };

  /* ══ MOBILE ══ */
  if (isMob) {
    return (
      <section ref={ref} style={sectionStyle}>
        <NoiseOverlay/>
        <Orb style={{ width: "320px", height: "320px", top: "-80px", right: "-100px" }}/>
        <Orb style={{ width: "240px", height: "240px", bottom: "-60px", left: "-80px" }}/>
        <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", gap: "28px" }}>
          <p ref={eyebrowRef} style={{ margin: 0, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "11px", color: "rgba(44,85,132,0.65)", letterSpacing: "0.12em" }}>
            Nice to meet you —
          </p>
          <div>
            <h2 ref={nameRef} style={{ margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(2rem,9vw,3rem)", letterSpacing: "-0.04em", lineHeight: 0.95, color: "rgba(255,255,255,0.92)" }}>
              I build<br/><span style={{ color: "#2C5584" }}>digital</span><br/>experiences.
            </h2>
            <p ref={roleRef} style={{ margin: 0, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "12px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>
              Frontend developer · CS student · Algeria
            </p>
          </div>
          <div ref={lineRef} style={{ height: "1px", background: "linear-gradient(90deg, rgba(44,85,132,0.6), transparent)", width: "160px" }}/>
          <p ref={bioRef} style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: "13px", lineHeight: 1.85, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
            Third-year CS student passionate about motion, clean code, and interfaces that feel alive.
          </p>
          <SkillCycler entered={entered}/>
          <div ref={statusRef} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "glow 2s ease-in-out infinite" }}/>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>Available for projects</span>
          </div>
        </div>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;800&display=swap');
          @keyframes glow { 0%,100%{box-shadow:0 0 6px rgba(74,222,128,0.5)} 50%{box-shadow:0 0 18px rgba(74,222,128,0.9)} }
        `}</style>
      </section>
    );
  }

  /* ══ DESKTOP / TABLET ══ */
  return (
    <section ref={ref} style={sectionStyle}>
      <NoiseOverlay/>
      <Orb style={{ width: "600px", height: "600px", top: "-200px", right: "-150px" }}/>
      <Orb style={{ width: "400px", height: "400px", bottom: "-150px", left: "-100px" }}/>

      <div aria-hidden="true" style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(44,85,132,0.2), transparent)" }}/>
      <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: "8%", right: "8%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(44,85,132,0.2), transparent)" }}/>

      <div style={{
        position: "relative", zIndex: 1,
        display: "grid",
        gridTemplateColumns: isTablet ? "1fr 1fr" : "1.1fr 0.6fr 1fr",
        gap: isTablet ? "64px" : "clamp(48px, 5vw, 96px)",
        width: "100%", maxWidth: "1280px",
        alignItems: "center",
      }}>

        {/* ── COL 1: Identity ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <p ref={eyebrowRef} style={{ margin: 0, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "12px", color: "rgba(44,85,132,0.65)", letterSpacing: "0.14em" }}>
            Nice to meet you —
          </p>
          <div ref={nameRef}>
            <h2 style={{ margin: "0 0 10px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(2.4rem, 4.5vw, 5rem)", letterSpacing: "-0.05em", lineHeight: 0.9, color: "rgba(255,255,255,0.93)" }}>
              I build<br/>
              <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(44,85,132,0.75)" }}>digital</span><br/>
              experiences.
            </h2>
          </div>
          <p ref={roleRef} style={{ margin: 0, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "13px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.07em" }}>
            Frontend developer · CS student · Algeria
          </p>
          <div ref={lineRef} style={{ width: "200px", height: "1px", background: "linear-gradient(90deg, rgba(44,85,132,0.7), transparent)" }}/>
          <p ref={bioRef} style={{ margin: 0, maxWidth: "340px", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "14px", lineHeight: 1.9, color: "rgba(255,255,255,0.28)" }}>
            Third-year CS student passionate about motion, clean code, and interfaces that feel alive. I turn ideas into polished products.
          </p>
          <div ref={statusRef} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "glow 2s ease-in-out infinite" }}/>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>Available for projects · Remote</span>
          </div>
        </div>

        {/* ── COL 2: Separator ── */}
        {!isTablet && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px", height: "100%" }}>
            <div style={{ width: "1px", flex: 1, maxHeight: "280px", background: "linear-gradient(to bottom, transparent, rgba(44,85,132,0.22), transparent)" }}/>
            <div style={{ width: "52px", height: "52px", border: "1px solid rgba(44,85,132,0.25)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(44,85,132,0.06)", flexShrink: 0 }}>
              <span style={{ fontFamily: "Georgia, serif", fontSize: "14px", color: "rgba(44,85,132,0.7)", letterSpacing: "0.05em" }}>FD</span>
            </div>
            <div style={{ width: "1px", flex: 1, maxHeight: "280px", background: "linear-gradient(to bottom, transparent, rgba(44,85,132,0.22), transparent)" }}/>
          </div>
        )}

        {/* ── COL 3: Cyclers ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>

          {/* Skills */}
          <div>
            <p ref={skillsHeadRef} style={{ margin: "0 0 20px", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "10px", letterSpacing: "0.2em", color: "rgba(44,85,132,0.5)", textTransform: "uppercase" }}>
              What I work with
            </p>
            <SkillCycler entered={entered}/>
          </div>

          {/* Divider */}
          <div ref={dividerRef} style={{ height: "1px", background: "linear-gradient(90deg, rgba(44,85,132,0.18), transparent)" }}/>

          {/* Process */}
          <div>
            <p ref={processHeadRef} style={{ margin: "0 0 20px", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "10px", letterSpacing: "0.2em", color: "rgba(44,85,132,0.5)", textTransform: "uppercase" }}>
              How I work
            </p>
            <ProcessCycler entered={entered}/>
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;800&display=swap');
        @keyframes glow { 0%,100%{box-shadow:0 0 6px rgba(74,222,128,0.5)} 50%{box-shadow:0 0 18px rgba(74,222,128,0.95)} }
      `}</style>
    </section>
  );
});

export default AboutStack;