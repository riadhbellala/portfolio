import { useRef, useEffect } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { scrollManager } from "../../utils/ScrollManager";

const LETTERS = ["R", "I", "A", "D", "H"];
const MARQUEE = [
  "Frontend Developer","★","React JS","★",
  "Creative Thinker","★","Based in Algeria","★","Available for Work","★",
];

export default function Hero() {
  const sectionRef   = useRef(null);
  const lettersRef   = useRef([]);
  const bottomRowRef = useRef(null);
  const marqueeRef   = useRef(null);
  const marqueeInner = useRef(null);
  const scrollLineRef= useRef(null);
  const cursorRef    = useRef(null);

  useEffect(() => {
    gsap.set(lettersRef.current,   { yPercent: 110, opacity: 0 });
    gsap.set(bottomRowRef.current, { opacity: 0, y: 20 });
    gsap.set(scrollLineRef.current,{ scaleY: 0, transformOrigin: "top" });
    gsap.set(marqueeRef.current,   { opacity: 0 });

    const entrance = gsap.timeline({ delay: 0.5 });
    entrance
      .to(lettersRef.current,
        { yPercent: 0, opacity: 1, duration: 1, ease: "power4.out", stagger: 0.07 })
      .to(bottomRowRef.current,
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.3")
      .to(scrollLineRef.current,
        { scaleY: 1, duration: 0.8, ease: "power2.inOut" }, "-=0.4")
      .to(marqueeRef.current,
        { opacity: 1, duration: 0.6 }, "-=0.3");

    const mWidth = marqueeInner.current.offsetWidth / 3;
    const marqueeAnim = gsap.to(marqueeInner.current, {
      x: -mWidth, duration: 20, ease: "none", repeat: -1,
    });

    const onMove = (e) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.5, ease: "power2.out" });
      lettersRef.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.035,
          y: (e.clientY - (r.top + r.height / 2)) * 0.035,
          duration: 0.9, ease: "power2.out",
        });
      });
    };
    const onLeave = () => {
      lettersRef.current.forEach((el) => {
        if (!el) return;
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,0.5)" });
      });
    };

    window.addEventListener("mousemove", onMove);
    const sec = sectionRef.current;
    sec.addEventListener("mouseleave", onLeave);

    scrollManager.register(sectionRef.current, [
      {
        in: (done) => {
          gsap.timeline({ onComplete: done })
            .to(lettersRef.current,
              { opacity: 1, yPercent: 0, letterSpacing: "-0.03em",
                duration: 0.7, ease: "power2.out", stagger: { each: 0.05, from: "center" } })
            .to(bottomRowRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3")
            .to(marqueeRef.current,   { opacity: 1, duration: 0.4 }, "-=0.2");
        },
        out: (done) => {
          gsap.timeline({ onComplete: done })
            .to(lettersRef.current,
              { opacity: 0, letterSpacing: "0.15em", yPercent: -15,
                duration: 0.6, ease: "power2.in", stagger: { each: 0.04, from: "center" } })
            .to(bottomRowRef.current, { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" }, "<")
            .to(marqueeRef.current,   { opacity: 0, duration: 0.3 }, "<");
        },
      },
    ]);

    return () => {
      marqueeAnim.kill();
      window.removeEventListener("mousemove", onMove);
      sec.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const metaLabel = { fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "6px" };
  const metaValue = { fontSize: "12px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)" };

  return (
    <>
      <div ref={cursorRef} style={{
        position: "fixed", top: 0, left: 0, width: "6px", height: "6px",
        borderRadius: "50%", background: "#2C5584", pointerEvents: "none",
        zIndex: 9999, transform: "translate(-50%,-50%)", mixBlendMode: "screen",
      }} />

      <section ref={sectionRef} style={{
        position: "fixed", inset: 0, width: "100%", height: "100vh",
        background: "#080808", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center",   // ← CENTER
        cursor: "none", visibility: "hidden",
      }}>

        {/* Name — centered */}
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          overflow: "hidden", gap: "clamp(2px,0.8vw,14px)", padding: "0 24px",
        }}>
          {LETTERS.map((letter, index) => (
            <span
              key={index}
              ref={(el) => (lettersRef.current[index] = el)}
              style={{
                display: "inline-block",
                fontSize: "clamp(5rem,19vw,20rem)",
                fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.03em",
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.8)",
                opacity: 0, userSelect: "none",
                transition: "color 0.25s ease, -webkit-text-stroke 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#2C5584";
                e.currentTarget.style.webkitTextStroke = "1px #2C5584";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "transparent";
                e.currentTarget.style.webkitTextStroke = "1px rgba(255,255,255,0.8)";
              }}
            >{letter}</span>
          ))}
        </div>

        {/* Bottom row */}
        <div ref={bottomRowRef} style={{
          position: "absolute", bottom: "100px", left: 0, right: 0,
          padding: "0 48px", display: "flex",
          justifyContent: "space-between", alignItems: "flex-end", opacity: 0,
        }}>
          <div>
            <p style={metaLabel}>Based in</p>
            <p style={metaValue}>Algeria</p>
          </div>
          <div ref={scrollLineRef} style={{
            width: "1px", height: "52px",
            background: "linear-gradient(to bottom, #2C5584, transparent)",
          }} />
          <div style={{ textAlign: "right" }}>
            <p style={metaLabel}>Work</p>
            <Link to="/projects"
              style={{ ...metaValue, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#2C5584"; gsap.to(e.currentTarget, { x: 6, duration: 0.3, ease: "power2.out" }); }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; gsap.to(e.currentTarget, { x: 0, duration: 0.3, ease: "power2.out" }); }}
            >View Projects <span>→</span></Link>
          </div>
        </div>

        {/* Marquee */}
        <div ref={marqueeRef} style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "13px 0", opacity: 0,
        }}>
          <div ref={marqueeInner} style={{ display: "flex", gap: "48px", whiteSpace: "nowrap", width: "max-content" }}>
            {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, index) => (
              <span key={index} style={{
                fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase",
                color: item === "★" ? "#2C5584" : "rgba(255,255,255,0.18)",
              }}>{item}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}