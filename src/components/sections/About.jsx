import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── DATA ─────────────────────────────────────────────────────────────
// The sentence is split into two parts:
// HIGHLIGHT words get the blue accent color on reveal
// NORMAL words stay white
const SENTENCE = [
  { word: "Creativity,",  highlight: true  },
  { word: "thinking",     highlight: false },
  { word: "out",          highlight: false },
  { word: "of",           highlight: false },
  { word: "the",          highlight: false },
  { word: "box,",         highlight: false },
  { word: "reliability",  highlight: true  },
  { word: "—",            highlight: false },
  { word: "gathered",     highlight: false },
  { word: "in",           highlight: false },
  { word: "one",          highlight: false },
  { word: "place.",       highlight: true  },
];

const TRAITS = [
  { index: "01", title: "Creativity",   desc: "Turning ideas into visual experiences that feel alive." },
  { index: "02", title: "Thinking",     desc: "Out of the box solutions to problems others overlook."  },
  { index: "03", title: "Reliability",  desc: "Consistent, clean, and maintainable code every time."  },
];

export default function About() {
  const sectionRef  = useRef(null);
  const labelRef    = useRef(null);
  const wordRefs    = useRef([]);
  const traitRefs   = useRef([]);
  const dividerRef  = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── 1. SECTION LABEL FADES IN ───────────────────────────────
      gsap.fromTo(labelRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: labelRef.current,
            start: "top 85%",
          },
        }
      );

      // ── 2. WORD BY WORD SCROLL REVEAL ───────────────────────────
      // Each word starts invisible and dim
      // As user scrolls through the section, words light up one by one
      wordRefs.current.forEach((word, i) => {
        gsap.fromTo(word,
          { opacity: 0.08 },
          {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              // Each word starts revealing at a different scroll point
              // i / SENTENCE.length spreads them evenly across the scroll distance
              start: `top+=${i * 60} center`,
              end: `top+=${i * 60 + 80} center`,
              scrub: 0.5,
            },
          }
        );
      });

      // ── 3. DIVIDER LINE GROWS ───────────────────────────────────
      gsap.fromTo(dividerRef.current,
        { width: "0%" },
        {
          width: "100%",
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: dividerRef.current,
            start: "top 80%",
          },
        }
      );

      // ── 4. TRAIT ROWS SLIDE IN ──────────────────────────────────
      traitRefs.current.forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            // Each row staggers 0.12s after the previous
            delay: i * 0.12,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
            },
          }
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: "#080808",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "120px 48px",
        // Extra bottom padding so scroll-triggered words
        // have enough scroll distance to fully reveal
        paddingBottom: "200px",
      }}
    >

      {/* ── SECTION LABEL ── */}
      <span
        ref={labelRef}
        style={{
          display: "block",
          fontSize: "10px",
          letterSpacing: "0.5em",
          textTransform: "uppercase",
          color: "#2C5584",
          marginBottom: "64px",
          opacity: 0,
        }}
      >
        About
      </span>

      {/* ── WORD BY WORD SENTENCE ── */}
      {/* The sentence container uses flexWrap so words naturally
          wrap onto the next line like normal text */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(8px, 1.5vw, 18px)",
          maxWidth: "900px",
          marginBottom: "100px",
        }}
      >
        {SENTENCE.map((item, i) => (
          <span
            key={i}
            // Ref callback — stores each word span in the array
            ref={(el) => (wordRefs.current[i] = el)}
            style={{
              display: "inline-block",
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              // Highlighted words use blue, normal words use white
              color: item.highlight ? "#2C5584" : "#ffffff",
              // All words start very dim — opacity 0.08
              // GSAP will animate them to opacity 1 on scroll
              opacity: 0.08,
              userSelect: "none",
            }}
          >
            {item.word}
          </span>
        ))}
      </div>

      {/* ── DIVIDER LINE ── */}
      <div
        ref={dividerRef}
        style={{
          height: "1px",
          width: "0%",
          background: "rgba(255,255,255,0.08)",
          marginBottom: "64px",
        }}
      />

      {/* ── TRAIT ROWS ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0",
          maxWidth: "900px",
        }}
      >
        {TRAITS.map((trait, i) => (
          <div
            key={trait.index}
            ref={(el) => (traitRefs.current[i] = el)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "28px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              opacity: 0,
              // Cursor changes to pointer so it feels interactive
              cursor: "default",
            }}
            // Hover — title lights up with blue
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget.querySelector(".trait-title"), {
                color: "#2C5584",
                x: 8,
                duration: 0.3,
                ease: "power2.out",
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget.querySelector(".trait-title"), {
                color: "rgba(255,255,255,0.15)",
                x: 0,
                duration: 0.3,
                ease: "power2.out",
              });
            }}
          >
            {/* Left — index number */}
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.2)",
                minWidth: "40px",
              }}
            >
              {trait.index}
            </span>

            {/* Center — trait title */}
            <span
              className="trait-title"
              style={{
                flex: 1,
                fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.15)",
                paddingLeft: "32px",
                transition: "color 0.3s",
              }}
            >
              {trait.title}
            </span>

            {/* Right — description */}
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.3)",
                maxWidth: "240px",
                textAlign: "right",
                lineHeight: 1.6,
              }}
            >
              {trait.desc}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
}