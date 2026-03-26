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
  { name: "React",      label: "UI & Components"   },
  { name: "TypeScript", label: "Typed JavaScript"  },
  { name: "GSAP",       label: "Motion & Animation"},
  { name: "Tailwind",   label: "Styling"           },
  { name: "Supabase",   label: "Backend"           },
];

const QUALITIES = [
  { number: "01", title: "Clean code",    desc: "Every line earns its place."          },
  { number: "02", title: "Real motion",   desc: "Interfaces that breathe and respond." },
  { number: "03", title: "Fast delivery", desc: "Built right, shipped on time."        },
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

/* ─── Skill pill ─────────────────────────────────────────────────────────── */
function SkillPill({ skill, index, entered }) {
  const ref = useRef(null);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    if (!entered || !ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.8 + index * 0.08 }
    );
  }, [entered, index]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        opacity: 0,
        display: "flex", alignItems: "center", gap: "10px",
        padding: "10px 18px",
        border: `1px solid ${hov ? "rgba(44,85,132,0.45)" : "rgba(44,85,132,0.15)"}`,
        background: hov ? "rgba(44,85,132,0.08)" : "transparent",
        borderRadius: "3px",
        transition: "all 0.25s ease",
        cursor: "default",
      }}
    >
      <span style={{
        width: "4px", height: "4px", borderRadius: "50%",
        background: hov ? "#2C5584" : "rgba(44,85,132,0.45)",
        flexShrink: 0, transition: "background 0.25s",
        boxShadow: hov ? "0 0 8px rgba(44,85,132,0.7)" : "none",
      }}/>
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "12px", fontWeight: 500,
        color: hov ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)",
        letterSpacing: "0.04em", transition: "color 0.25s",
      }}>{skill.name}</span>
      <span style={{
        fontSize: "10px", color: "rgba(44,85,132,0.55)",
        fontFamily: "Georgia, serif", fontStyle: "italic",
        marginLeft: "auto", opacity: hov ? 1 : 0,
        transition: "opacity 0.25s",
      }}>{skill.label}</span>
    </div>
  );
}

/* ─── Quality card ───────────────────────────────────────────────────────── */
function QualityCard({ item, index, entered }) {
  const ref = useRef(null);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    if (!entered || !ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", delay: 0.6 + index * 0.12 }
    );
  }, [entered, index]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        opacity: 0,
        padding: "22px 24px",
        border: `1px solid ${hov ? "rgba(44,85,132,0.3)" : "rgba(44,85,132,0.1)"}`,
        background: hov ? "rgba(44,85,132,0.06)" : "rgba(44,85,132,0.02)",
        borderRadius: "4px",
        transition: "all 0.3s ease",
        cursor: "default",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: hov
          ? "linear-gradient(90deg, transparent, rgba(44,85,132,0.7), transparent)"
          : "transparent",
        transition: "background 0.3s",
      }}/>

      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
        <span style={{
          fontFamily: "Georgia, serif",
          fontSize: "11px", color: "rgba(44,85,132,0.5)",
          letterSpacing: "0.12em", flexShrink: 0, marginTop: "2px",
        }}>{item.number}</span>
        <div>
          <p style={{
            margin: "0 0 6px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px", fontWeight: 600,
            color: hov ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.55)",
            letterSpacing: "0.02em", transition: "color 0.3s",
          }}>{item.title}</p>
          <p style={{
            margin: 0,
            fontSize: "11px", lineHeight: 1.7,
            color: "rgba(255,255,255,0.22)",
            fontFamily: "Georgia, serif", fontStyle: "italic",
          }}>{item.desc}</p>
        </div>
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

  /* refs for staggered entrance */
  const eyebrowRef = useRef(null);
  const nameRef    = useRef(null);
  const roleRef    = useRef(null);
  const lineRef    = useRef(null);
  const bioRef     = useRef(null);
  const statusRef  = useRef(null);

  /* set initial hidden state */
  useEffect(() => {
    [eyebrowRef, nameRef, roleRef, lineRef, bioRef, statusRef].forEach(r => {
      if (r.current) gsap.set(r.current, { opacity: 0, y: 20 });
    });
  }, []);

  /* watch visibility from parent */
  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    const obs = new MutationObserver(() => {
      const visible = el.style.visibility !== "hidden" && parseFloat(el.style.opacity || "0") > 0.5;
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
  }

  const sectionStyle = {
    position: "fixed", inset: 0,
    width: "100%", height: "100vh",
    background: "#080808",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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

          <p ref={eyebrowRef} style={{
            margin: 0, fontFamily: "Georgia, serif", fontStyle: "italic",
            fontSize: "11px", color: "rgba(44,85,132,0.65)", letterSpacing: "0.12em",
          }}>
            Nice to meet you —
          </p>

          <div>
            <h2 ref={nameRef} style={{
              margin: "0 0 8px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 800, fontSize: "clamp(2rem,9vw,3rem)",
              letterSpacing: "-0.04em", lineHeight: 0.95,
              color: "rgba(255,255,255,0.92)",
            }}>
              I build<br/>
              <span style={{ color: "#2C5584" }}>digital</span><br/>
              experiences.
            </h2>
            <p ref={roleRef} style={{
              margin: 0,
              fontFamily: "Georgia, serif", fontStyle: "italic",
              fontSize: "12px", color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.06em",
            }}>
              Frontend developer · CS student · Algeria
            </p>
          </div>

          <div ref={lineRef} style={{
            height: "1px",
            background: "linear-gradient(90deg, rgba(44,85,132,0.6), transparent)",
            width: "160px",
          }}/>

          <p ref={bioRef} style={{
            margin: 0,
            fontFamily: "Georgia, serif",
            fontSize: "13px", lineHeight: 1.85,
            color: "rgba(255,255,255,0.3)",
            fontStyle: "italic",
          }}>
            Third-year CS student passionate about motion, clean code, and interfaces that feel alive.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {SKILLS.map((s, i) => <SkillPill key={s.name} skill={s} index={i} entered={entered}/>)}
          </div>

          <div ref={statusRef} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 10px rgba(74,222,128,0.8)",
              animation: "glow 2s ease-in-out infinite",
              display: "inline-block",
            }}/>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px", letterSpacing: "0.22em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
            }}>Available for projects</span>
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;800&display=swap');
          @keyframes glow {
            0%,100% { box-shadow: 0 0 6px rgba(74,222,128,0.5); }
            50%      { box-shadow: 0 0 18px rgba(74,222,128,0.9); }
          }
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

      {/* thin top + bottom rule */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: "8%", right: "8%", height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(44,85,132,0.2), transparent)",
      }}/>
      <div aria-hidden="true" style={{
        position: "absolute", bottom: 0, left: "8%", right: "8%", height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(44,85,132,0.2), transparent)",
      }}/>

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

          <p ref={eyebrowRef} style={{
            margin: 0,
            fontFamily: "Georgia, serif", fontStyle: "italic",
            fontSize: "12px", color: "rgba(44,85,132,0.65)",
            letterSpacing: "0.14em",
          }}>
            Nice to meet you —
          </p>

          <div ref={nameRef}>
            <h2 style={{
              margin: "0 0 10px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.4rem, 4.5vw, 5rem)",
              letterSpacing: "-0.05em", lineHeight: 0.9,
              color: "rgba(255,255,255,0.93)",
            }}>
              I build<br/>
              <span style={{
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(44,85,132,0.75)",
              }}>digital</span><br/>
              experiences.
            </h2>
          </div>

          <p ref={roleRef} style={{
            margin: 0,
            fontFamily: "Georgia, serif", fontStyle: "italic",
            fontSize: "13px", color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.07em",
          }}>
            Frontend developer · CS student · Algeria
          </p>

          <div ref={lineRef} style={{
            width: "200px", height: "1px",
            background: "linear-gradient(90deg, rgba(44,85,132,0.7), transparent)",
          }}/>

          <p ref={bioRef} style={{
            margin: 0, maxWidth: "340px",
            fontFamily: "Georgia, serif", fontStyle: "italic",
            fontSize: "14px", lineHeight: 1.9,
            color: "rgba(255,255,255,0.28)",
          }}>
            Third-year CS student passionate about motion, clean code, and interfaces that feel alive. I turn ideas into polished products.
          </p>

          <div ref={statusRef} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: "#4ade80",
              display: "inline-block",
              animation: "glow 2s ease-in-out infinite",
            }}/>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px", letterSpacing: "0.28em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
            }}>Available for projects · Remote</span>
          </div>
        </div>

        {/* ── COL 2: Thin vertical separator (desktop only) ── */}
        {!isTablet && (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "32px", height: "100%",
          }}>
            <div style={{
              width: "1px", flex: 1, maxHeight: "280px",
              background: "linear-gradient(to bottom, transparent, rgba(44,85,132,0.22), transparent)",
            }}/>
            {/* initials monogram */}
            <div style={{
              width: "52px", height: "52px",
              border: "1px solid rgba(44,85,132,0.25)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(44,85,132,0.06)",
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: "Georgia, serif",
                fontSize: "14px", color: "rgba(44,85,132,0.7)",
                letterSpacing: "0.05em",
              }}>FD</span>
            </div>
            <div style={{
              width: "1px", flex: 1, maxHeight: "280px",
              background: "linear-gradient(to bottom, transparent, rgba(44,85,132,0.22), transparent)",
            }}/>
          </div>
        )}

        {/* ── COL 3: Skills + Qualities ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>

          {/* skills */}
          <div>
            <p style={{
              margin: "0 0 14px",
              fontFamily: "Georgia, serif", fontStyle: "italic",
              fontSize: "10px", letterSpacing: "0.2em",
              color: "rgba(44,85,132,0.5)",
              textTransform: "uppercase",
            }}>What I work with</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {SKILLS.map((s, i) => <SkillPill key={s.name} skill={s} index={i} entered={entered}/>)}
            </div>
          </div>

          {/* horizontal rule */}
          <div style={{
            height: "1px",
            background: "linear-gradient(90deg, rgba(44,85,132,0.18), transparent)",
          }}/>

          {/* qualities */}
          <div>
            <p style={{
              margin: "0 0 14px",
              fontFamily: "Georgia, serif", fontStyle: "italic",
              fontSize: "10px", letterSpacing: "0.2em",
              color: "rgba(44,85,132,0.5)",
              textTransform: "uppercase",
            }}>How I work</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {QUALITIES.map((q, i) => <QualityCard key={q.number} item={q} index={i} entered={entered}/>)}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;800&display=swap');
        @keyframes glow {
          0%,100% { box-shadow: 0 0 6px rgba(74,222,128,0.5); }
          50%      { box-shadow: 0 0 18px rgba(74,222,128,0.95); }
        }
      `}</style>
    </section>
  );
});

export default AboutStack;