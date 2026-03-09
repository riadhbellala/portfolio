import { useRef, useEffect } from "react";
import gsap from "gsap";
import { scrollManager } from "../../utils/ScrollManager";

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
  const sectionRef = useRef(null);
  const labelRef   = useRef(null);
  const wordsRef   = useRef(null);
  const wordRefs   = useRef([]);
  const statsRef   = useRef([]);

  useEffect(() => {
    gsap.set(sectionRef.current, { autoAlpha: 0 });
    gsap.set(labelRef.current,   { opacity: 0, y: 24 });
    gsap.set(wordsRef.current,   { opacity: 0 });
    gsap.set(wordRefs.current,   { opacity: 0.06 });
    gsap.set(statsRef.current,   { opacity: 0, y: 20 });

    scrollManager.register(sectionRef.current, [
      {
        in: (done) => {
          gsap.timeline({ onComplete: done })
            .to(labelRef.current,  { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" })
            .to(wordsRef.current,  { opacity: 1, duration: 0.3 }, "-=0.2")
            .to(wordRefs.current,  { opacity: 1, stagger: 0.07, duration: 0.55, ease: "power2.out" }, "-=0.1")
            .to(statsRef.current,  { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "back.out(1.5)" }, "-=0.3");
        },
        out: (done, reverse) => {
          if (reverse) {
            gsap.set(wordRefs.current, { opacity: 0.06 });
            gsap.timeline({ onComplete: done })
              .to([wordsRef.current, labelRef.current, ...statsRef.current],
                { opacity: 0, y: 18, duration: 0.45, ease: "power2.in" });
          } else {
            gsap.timeline({ onComplete: done })
              .to(wordRefs.current,
                { opacity: 0.06, stagger: { each: 0.04, from: "end" }, duration: 0.35, ease: "power2.in" })
              .to([wordsRef.current, labelRef.current, ...statsRef.current],
                { opacity: 0, y: -28, duration: 0.45, ease: "power2.in" }, "-=0.2");
          }
        },
      },
    ]);
  }, []);

  return (
    <section ref={sectionRef} style={{
      position: "fixed", inset: 0, width: "100%", height: "100vh",
      background: "#080808", overflow: "hidden",
      display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
      padding: "0 clamp(24px, 6vw, 80px)",
      textAlign: "center",
    }}>

      {/* Label */}
      <span ref={labelRef} style={{
        fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase",
        color: "#2C5584", marginBottom: "40px", opacity: 0, display: "block",
      }}>About</span>

      {/* Manifesto — centered */}
      <div ref={wordsRef} style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline",
        gap: "clamp(6px, 1.2vw, 16px)",
        maxWidth: "860px", opacity: 0,
      }}>
        {WORDS.map((item, i) => (
          <span
            key={i}
            ref={(el) => (wordRefs.current[i] = el)}
            style={{
              display: "inline-block",
              fontSize: "clamp(1.9rem, 4.6vw, 4.4rem)",
              fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.025em",
              color: item.accent ? "#2C5584" : "#ffffff",
              opacity: 0.06, userSelect: "none",
            }}
          >{item.word}</span>
        ))}
      </div>

      {/* Stats row — centered */}
      <div style={{
        display: "flex", gap: "clamp(32px, 6vw, 80px)",
        marginTop: "56px", justifyContent: "center",
      }}>
        {STATS.map((s, i) => (
          <div key={i} ref={(el) => (statsRef.current[i] = el)} style={{ opacity: 0, textAlign: "center" }}>
            <p style={{
              fontSize: "clamp(1.6rem, 3vw, 2.8rem)", fontWeight: 800,
              letterSpacing: "-0.04em", color: "#fff", lineHeight: 1, marginBottom: "6px",
            }}>{s.value}</p>
            <p style={{
              fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}