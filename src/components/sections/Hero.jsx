import { useRef, useEffect } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { scrollManager } from "../../utils/ScrollManager";

const LETTERS = ["R", "I", "A", "D", "H"];
const MARQUEE = [
  "Frontend Developer", "✦", "React JS", "✦",
  "Creative Thinker", "✦", "Based in Algeria", "✦", "Available for Work", "✦",
];

export default function Hero() {
  const sectionRef     = useRef(null);
  const lettersRef     = useRef([]);
  const bottomRowRef   = useRef(null);
  const marqueeRef     = useRef(null);
  const marqueeInner   = useRef(null);
  const scrollLineRef  = useRef(null);
  const cursorDotRef   = useRef(null);
  const cursorRingRef  = useRef(null);
  const glowRef        = useRef(null);
  const marqueeAnimRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    gsap.set(section, { autoAlpha: 1 });
    gsap.set(lettersRef.current,    { yPercent: 120, opacity: 0 });
    gsap.set(bottomRowRef.current,  { opacity: 0, y: 28 });
    gsap.set(scrollLineRef.current, { scaleY: 0, transformOrigin: "top" });
    gsap.set(marqueeRef.current,    { opacity: 0 });
    gsap.set(cursorRingRef.current, { scale: 0, opacity: 0 });

    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(lettersRef.current,
        { yPercent: 0, opacity: 1, duration: 1.1, ease: "power4.out", stagger: 0.07 })
      .to(cursorRingRef.current,
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.5)" }, "-=0.6")
      .to(bottomRowRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
      .to(scrollLineRef.current,
        { scaleY: 1, duration: 1.2, ease: "power2.inOut" }, "-=0.6")
      .to(marqueeRef.current,
        { opacity: 1, duration: 0.5 }, "-=0.5");

    const mWidth = marqueeInner.current.offsetWidth / 3;
    marqueeAnimRef.current = gsap.to(marqueeInner.current, {
      x: -mWidth, duration: 24, ease: "none", repeat: -1,
    });

    const onMove = (e) => {
      gsap.to(cursorDotRef.current,  { x: e.clientX, y: e.clientY, duration: 0.08, ease: "none" });
      gsap.to(cursorRingRef.current, { x: e.clientX, y: e.clientY, duration: 0.5,  ease: "power2.out" });
      gsap.to(glowRef.current,       { x: e.clientX, y: e.clientY, duration: 1.8,  ease: "power2.out" });
      lettersRef.current.forEach((el) => {
        if (!el) return;
        const r    = el.getBoundingClientRect();
        const cx   = r.left + r.width / 2;
        const cy   = r.top  + r.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const str  = Math.max(0, 1 - dist / 380) * 0.06;
        gsap.to(el, { x: (e.clientX - cx) * str, y: (e.clientY - cy) * str, duration: 0.9, ease: "power2.out" });
      });
    };
    const onLeave = () => {
      lettersRef.current.forEach((el) => {
        if (!el) return;
        gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.4)" });
      });
    };

    window.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);

    scrollManager.register(section, [
      {
        in: (done) => {
          gsap.timeline({ onComplete: done })
            .to(lettersRef.current,
              { opacity: 1, yPercent: 0, duration: 0.7, ease: "power2.out", stagger: { each: 0.06, from: "center" } })
            .to(bottomRowRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3")
            .to(marqueeRef.current,   { opacity: 1, duration: 0.4 }, "-=0.2");
        },
        out: (done) => {
          gsap.timeline({ onComplete: done })
            .to(lettersRef.current,
              { opacity: 0, letterSpacing: "0.2em", yPercent: -20, duration: 0.65, ease: "power2.in", stagger: { each: 0.04, from: "center" } })
            .to(bottomRowRef.current, { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" }, "<")
            .to(marqueeRef.current,   { opacity: 0, duration: 0.3 }, "<");
        },
      },
    ]);

    return () => {
      marqueeAnimRef.current?.kill();
      window.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const handleLetterEnter = (e) => {
    e.currentTarget.style.color = "#2C5584";
    e.currentTarget.style.webkitTextStroke = "1px #2C5584";
    gsap.to(e.currentTarget, { scale: 1.07, duration: 0.3, ease: "power2.out" });
    gsap.to(cursorRingRef.current, { scale: 2.8, borderColor: "rgba(44,85,132,0.9)", duration: 0.35, ease: "power2.out" });
  };
  const handleLetterLeave = (e) => {
    e.currentTarget.style.color = "transparent";
    e.currentTarget.style.webkitTextStroke = "1px rgba(255,255,255,0.72)";
    gsap.to(e.currentTarget, { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    gsap.to(cursorRingRef.current, { scale: 1, borderColor: "rgba(44,85,132,0.55)", duration: 0.4, ease: "power2.out" });
  };

  return (
    <>
      <div ref={cursorDotRef} style={{
        position: "fixed", top: 0, left: 0, width: "4px", height: "4px",
        borderRadius: "50%", background: "#fff", pointerEvents: "none",
        zIndex: 9999, transform: "translate(-50%,-50%)",
      }} />
      <div ref={cursorRingRef} style={{
        position: "fixed", top: 0, left: 0, width: "38px", height: "38px",
        borderRadius: "50%", border: "1px solid rgba(44,85,132,0.55)",
        pointerEvents: "none", zIndex: 9998, transform: "translate(-50%,-50%)",
      }} />

      <section ref={sectionRef} style={{
        position: "fixed", inset: 0, width: "100%", height: "100vh",
        background: "#080808", overflow: "hidden",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        cursor: "none",
      }}>
        {/* Ambient glow */}
        <div ref={glowRef} style={{
          position: "absolute", top: "50%", left: "50%",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(44,85,132,0.1) 0%, transparent 68%)",
          pointerEvents: "none", transform: "translate(-50%,-50%)",
          filter: "blur(50px)", zIndex: 0,
        }} />

        {/* Corner brackets */}
        {[
          { top: "32px",    left: "32px",  borderTop:    "1px solid rgba(44,85,132,0.28)", borderLeft:   "1px solid rgba(44,85,132,0.28)" },
          { top: "32px",    right: "32px", borderTop:    "1px solid rgba(44,85,132,0.28)", borderRight:  "1px solid rgba(44,85,132,0.28)" },
          { bottom: "32px", left: "32px",  borderBottom: "1px solid rgba(44,85,132,0.28)", borderLeft:   "1px solid rgba(44,85,132,0.28)" },
          { bottom: "32px", right: "32px", borderBottom: "1px solid rgba(44,85,132,0.28)", borderRight:  "1px solid rgba(44,85,132,0.28)" },
        ].map((s, i) => (
          <div key={i} style={{ position: "absolute", width: "20px", height: "20px", pointerEvents: "none", zIndex: 1, ...s }} />
        ))}

        {/* Letters */}
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          overflow: "hidden", gap: "clamp(2px, 0.8vw, 14px)", padding: "0 24px",
          position: "relative", zIndex: 1,
        }}>
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={(el) => (lettersRef.current[i] = el)}
              style={{
                display: "inline-block",
                fontSize: "clamp(5rem, 19vw, 20rem)",
                fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.03em",
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.72)",
                opacity: 0, userSelect: "none",
                transition: "color 0.2s, -webkit-text-stroke 0.2s",
                willChange: "transform",
              }}
              onMouseEnter={handleLetterEnter}
              onMouseLeave={handleLetterLeave}
            >{letter}</span>
          ))}
        </div>

        {/* Bottom row */}
        <div ref={bottomRowRef} style={{
          position: "absolute", bottom: "90px", left: 0, right: 0,
          padding: "0 52px", display: "flex",
          justifyContent: "space-between", alignItems: "flex-end",
          opacity: 0, zIndex: 1,
        }}>
          <div>
            <p style={{ fontSize: "9px", letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: "6px" }}>Based in</p>
            <p style={{ fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.58)" }}>Algeria</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <div ref={scrollLineRef} style={{
              width: "1px", height: "52px",
              background: "linear-gradient(to bottom, rgba(44,85,132,0.8), transparent)",
            }} />
            <span style={{ fontSize: "7px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)" }}>Scroll</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "9px", letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: "6px" }}>Work</p>
            <Link
              to="/projects"
              style={{ fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.58)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#2C5584"; gsap.to(e.currentTarget, { x: 7, duration: 0.3, ease: "power2.out" }); }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.58)"; gsap.to(e.currentTarget, { x: 0, duration: 0.4, ease: "power2.out" }); }}
            >View Projects <span>→</span></Link>
          </div>
        </div>

        {/* Marquee */}
        <div
          ref={marqueeRef}
          onMouseEnter={() => marqueeAnimRef.current?.pause()}
          onMouseLeave={() => marqueeAnimRef.current?.resume()}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "13px 0", opacity: 0, zIndex: 1 }}
        >
          <div ref={marqueeInner} style={{ display: "flex", gap: "48px", whiteSpace: "nowrap", width: "max-content" }}>
            {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i} style={{
                fontSize: "9px", letterSpacing: "0.45em", textTransform: "uppercase",
                color: item === "✦" ? "#2C5584" : "rgba(255,255,255,0.15)",
              }}>{item}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}