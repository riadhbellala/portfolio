import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { scrollManager } from "../../utils/ScrollManager";

// ── useBreakpoint hook (self-contained) ────────────────────────────────────
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
  { value: "2+",   label: "Years exp."  },
  { value: "20+",  label: "Projects"    },
  { value: "100%", label: "Dedication"  },
];

export default function About() {
  const bp       = useBreakpoint();
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";

  const sectionRef = useRef(null);
  const labelRef   = useRef(null);
  const wordsRef   = useRef(null);
  const wordRefs   = useRef([]);
  const statsRef   = useRef([]);

  useEffect(() => {
    // Hide section — ScrollManager reveals it via autoAlpha when navigating here
    gsap.set(sectionRef.current, { autoAlpha: 0 });

    // Starting states — all invisible, some offset downward
    gsap.set(labelRef.current,  { opacity: 0, y: 24 });
    gsap.set(wordsRef.current,  { opacity: 0 });
    // 0.06 opacity = text is "ghosted" — barely visible, hinting at content
    // This is the key aesthetic: the sentence feels unread until animated in
    gsap.set(wordRefs.current,  { opacity: 0.06 });
    gsap.set(statsRef.current,  { opacity: 0, y: 20 });

    scrollManager.register(sectionRef.current, [
      {
        // IN: label → words light up one by one → stats pop in
        in: (done) => {
          gsap.timeline({ onComplete: done })
            .to(labelRef.current,
              { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" })
            .to(wordsRef.current,
              // Make the container visible so words inside can show
              { opacity: 1, duration: 0.3 }, "-=0.2")
            .to(wordRefs.current,
              // stagger:0.07 = 70ms between each word — reading rhythm
              { opacity: 1, stagger: 0.07, duration: 0.55, ease: "power2.out" }, "-=0.1")
            .to(statsRef.current,
              // back.out(1.5) = slight overshoot on arrival — satisfying pop
              { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "back.out(1.5)" }, "-=0.3");
        },
        // OUT: two different animations depending on direction
        out: (done, reverse) => {
          if (reverse) {
            // Going BACK to Hero — instantly reset word opacities, slide down
            gsap.set(wordRefs.current, { opacity: 0.06 });
            gsap.timeline({ onComplete: done })
              .to([wordsRef.current, labelRef.current, ...statsRef.current],
                { opacity: 0, y: 18, duration: 0.45, ease: "power2.in" });
          } else {
            // Going FORWARD to TechStack — words dim in reverse order (last→first)
            // This feels like the sentence is being "unread" before moving on
            gsap.timeline({ onComplete: done })
              .to(wordRefs.current,
                { opacity: 0.06,
                  stagger: { each: 0.04, from: "end" }, // from:"end" reverses stagger direction
                  duration: 0.35, ease: "power2.in" })
              .to([wordsRef.current, labelRef.current, ...statsRef.current],
                { opacity: 0, y: -28, duration: 0.45, ease: "power2.in" }, "-=0.2");
          }
        },
      },
    ]);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "fixed", inset: 0, width: "100%", height: "100vh",
        background: "#080808", overflow: "hidden",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        // clamp for padding: min 16px on tiny screens, scales up to 80px on wide screens
        padding: isMobile
          ? "0 16px"
          : isTablet
          ? "0 clamp(24px, 5vw, 60px)"
          : "0 clamp(24px, 6vw, 80px)",
        textAlign: "center",
      }}
    >
      {/* ── Section label ── */}
      <span
        ref={labelRef}
        style={{
          fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase",
          color: "#2C5584",
          // Tighter spacing on mobile to avoid crowding
          marginBottom: isMobile ? "24px" : "40px",
          opacity: 0, display: "block",
        }}
      >
        About
      </span>

      {/* ── Manifesto words ── */}
      {/* flexWrap:wrap allows words to break to next line naturally */}
      {/* justifyContent:center keeps wrapped lines centered */}
      <div
        ref={wordsRef}
        style={{
          display: "flex", flexWrap: "wrap",
          justifyContent: "center", alignItems: "baseline",
          // clamp for gap between words — tighter on mobile
          gap: isMobile
            ? "clamp(4px, 1.5vw, 8px)"
            : "clamp(6px, 1.2vw, 16px)",
          // maxWidth constrains the text block so it wraps nicely on wide screens
          maxWidth: isMobile ? "360px" : isTablet ? "620px" : "860px",
          opacity: 0,
        }}
      >
        {WORDS.map((item, i) => (
          <span
            key={i}
            ref={(el) => (wordRefs.current[i] = el)}
            style={{
              display: "inline-block",
              // Font size scales with viewport — smaller floor on mobile
              fontSize: isMobile
                ? "clamp(1.3rem, 5.5vw, 2rem)"
                : isTablet
                ? "clamp(1.5rem, 4vw, 3rem)"
                : "clamp(1.9rem, 4.6vw, 4.4rem)",
              fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.025em",
              color: item.accent ? "#2C5584" : "#ffffff",
              opacity: 0.06, userSelect: "none",
            }}
          >
            {item.word}
          </span>
        ))}
      </div>

      {/* ── Stats row ── */}
      <div
        style={{
          display: "flex",
          // On mobile: tighter gap so all 3 fit on screen
          gap: isMobile ? "clamp(20px, 6vw, 32px)" : "clamp(32px, 6vw, 80px)",
          marginTop: isMobile ? "32px" : "56px",
          justifyContent: "center",
          // On very small screens, allow wrapping (though unlikely with 3 items)
          flexWrap: "wrap",
        }}
      >
        {STATS.map((s, i) => (
          <div
            key={i}
            ref={(el) => (statsRef.current[i] = el)}
            style={{ opacity: 0, textAlign: "center" }}
          >
            <p style={{
              fontSize: isMobile
                ? "clamp(1.2rem, 5vw, 1.8rem)"
                : "clamp(1.6rem, 3vw, 2.8rem)",
              fontWeight: 800, letterSpacing: "-0.04em",
              color: "#fff", lineHeight: 1, marginBottom: "6px",
            }}>
              {s.value}
            </p>
            <p style={{
              fontSize: isMobile ? "8px" : "9px",
              letterSpacing: "0.4em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}