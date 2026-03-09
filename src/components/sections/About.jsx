import { useRef, useEffect } from "react";
import gsap from "gsap";
import { scrollManager } from "../../utils/ScrollManager";

// Words in the sentence — "gathered in one place." is PART of the sentence
// It lights up with the other words — no separate bold statement after
const SENTENCE = [
  { word: "Creativity,",  highlight: true  },
  { word: "thinking",     highlight: false },
  { word: "out",          highlight: false },
  { word: "of",           highlight: false },
  { word: "the",          highlight: false },
  { word: "box,",         highlight: false },
  { word: "reliability",  highlight: true  },
  { word: "—",            highlight: false },
  { word: "gathered",     highlight: true  },
  { word: "in",           highlight: false },
  { word: "one",          highlight: false },
  { word: "place.",       highlight: true  },
];

export default function About() {
  const sectionRef = useRef(null);
  const labelRef   = useRef(null);
  const wordsRef   = useRef(null);
  const wordRefs   = useRef([]);

  useEffect(() => {
    gsap.set(labelRef.current,  { opacity: 0, y: 30 });
    gsap.set(wordsRef.current,  { opacity: 0 });
    gsap.set(wordRefs.current,  { opacity: 0.06 });

    scrollManager.register(sectionRef.current, [
      {
        // IN: label fades in, words light up one by one
        in: (done) => {
          gsap.timeline({ onComplete: done })
            .to(labelRef.current,
              { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
            .to(wordsRef.current,
              { opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.2")
            .to(wordRefs.current,
              { opacity: 1, stagger: 0.07, duration: 0.5, ease: "power2.out" }, "-=0.1");
        },

        // OUT: everything fades up and out (going to next section or back)
        out: (done, reverse) => {
          if (reverse) {
            // Going back to Hero
            gsap.set(wordRefs.current, { opacity: 0.06 });
            gsap.timeline({ onComplete: done })
              .to([wordsRef.current, labelRef.current],
                { opacity: 0, y: 20, duration: 0.5, ease: "power2.in" });
          } else {
            // Going forward to TechStack
            gsap.timeline({ onComplete: done })
              .to(wordRefs.current,
                { opacity: 0.06, stagger: { each: 0.04, from: "end" }, duration: 0.4, ease: "power2.in" })
              .to([wordsRef.current, labelRef.current],
                { opacity: 0, y: -30, duration: 0.5, ease: "power2.in" }, "-=0.2");
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
      padding: "0 40px", visibility: "hidden",
    }}>
      {/* Label */}
      <span ref={labelRef} style={{
        fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase",
        color: "#2C5584", marginBottom: "52px", display: "block",
        opacity: 0, textAlign: "center",
      }}>About</span>

      {/* Words */}
      <div ref={wordsRef} style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center",
        gap: "clamp(6px, 1.4vw, 18px)", maxWidth: "880px", opacity: 0,
      }}>
        {SENTENCE.map((item, index) => (
          <span
            key={index}
            ref={(el) => (wordRefs.current[index] = el)}
            style={{
              display: "inline-block",
              fontSize: "clamp(1.8rem, 4.5vw, 4.2rem)",
              fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em",
              color: item.highlight ? "#2C5584" : "#ffffff",
              opacity: 0.06, userSelect: "none",
            }}
          >{item.word}</span>
        ))}
      </div>
    </section>
  );
}