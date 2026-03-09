import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const LETTERS = ["R", "I", "A", "D", "H"];

const MARQUEE = [
  "web Developer", "★", "React JS", "★",
  "out of the box ", "★", "Based in Algeria", "★" ,
];

export default function Hero() {
  const sectionRef    = useRef(null);
  const lettersRef    = useRef([]);
  const marqueeRef    = useRef(null);
  const marqueeInner  = useRef(null);
  const ctaRef        = useRef(null);
  const cursorRef     = useRef(null);
  const scrollLineRef = useRef(null);
  const locationRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── 1. ENTRANCE TIMELINE ─────────────────────────────────────
      const tl = gsap.timeline({ delay: 0.2 });

      tl
        // Letters wipe upward into view
        .fromTo(lettersRef.current,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, ease: "power4.out", stagger: 0.07 }
        )
        // Bottom info fades up
        .fromTo([locationRef.current, ctaRef.current],
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 },
          "-=0.3"
        )
        // Scroll line grows down
        .fromTo(scrollLineRef.current,
          { scaleY: 0, transformOrigin: "top" },
          { scaleY: 1, duration: 0.8, ease: "power2.inOut" },
          "-=0.3"
        )
        // Marquee fades in
        .fromTo(marqueeRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.4"
        );

      // ── 2. INFINITE MARQUEE ──────────────────────────────────────
      const mWidth = marqueeInner.current.offsetWidth / 3;
      gsap.to(marqueeInner.current, {
        x: -mWidth,
        duration: 20,
        ease: "none",
        repeat: -1,
      });

      // ── 3. SCROLL PARALLAX ───────────────────────────────────────
      gsap.to(lettersRef.current, {
        yPercent: -35,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(marqueeRef.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });

      // ── 4. MAGNETIC MOUSE TRACKING ───────────────────────────────
      const onMove = (e) => {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.5,
          ease: "power2.out",
        });

        lettersRef.current.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          gsap.to(el, {
            x: (e.clientX - cx) * 0.035,
            y: (e.clientY - cy) * 0.035,
            duration: 0.9,
            ease: "power2.out",
          });
        });
      };

      const onLeave = () => {
        lettersRef.current.forEach((el) => {
          gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,0.5)" });
        });
      };

      window.addEventListener("mousemove", onMove);
      const sec = sectionRef.current;
      sec.addEventListener("mouseleave", onLeave);

      return () => {
        window.removeEventListener("mousemove", onMove);
        sec.removeEventListener("mouseleave", onLeave);
      };

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── SHARED STYLE OBJECTS ──────────────────────────────────────────
  const label = {
    fontSize: "10px",
    letterSpacing: "0.4em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.28)",
    marginBottom: "6px",
  };

  const value = {
    fontSize: "12px",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.65)",
  };

  return (
    <>
      {/* ── CUSTOM CURSOR ── */}
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#2C5584",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%,-50%)",
          mixBlendMode: "screen",
        }}
      />

      {/* ── HERO SECTION ── */}
      <section
        ref={sectionRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          background: "#080808",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          cursor: "none",
        }}
      >

        {/* GIANT NAME */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          gap: "clamp(2px, 0.8vw, 14px)",
          padding: "0 16px",
        }}>
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={(el) => (lettersRef.current[i] = el)}
              style={{
                display: "inline-block",
                fontSize: "clamp(5rem, 19vw, 20rem)",
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.8)",
                opacity: 0,
                userSelect: "none",
                transition: "color 0.25s, -webkit-text-stroke 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#2C5584";
                e.currentTarget.style.WebkitTextStroke = "1px #2C5584";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "transparent";
                e.currentTarget.style.WebkitTextStroke = "1px rgba(255,255,255,0.8)";
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* BOTTOM ROW */}
        <div style={{
          position: "absolute",
          bottom: "100px",
          left: 0,
          right: 0,
          padding: "0 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}>

          {/* Left — location */}
          <div ref={locationRef} style={{ opacity: 0 }}>
            <p style={label}>Based in</p>
            <p style={value}>Algeria</p>
          </div>

          {/* Center — scroll line only, no text */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              ref={scrollLineRef}
              style={{
                width: "1px",
                height: "52px",
                background: "linear-gradient(to bottom, #2C5584, transparent)",
              }}
            />
          </div>

          {/* Right — CTA */}
          <div ref={ctaRef} style={{ textAlign: "right", opacity: 0 }}>
            <p style={label}>Work</p>
            <Link
              to="/projects"
              style={{
                ...value,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#2C5584";
                gsap.to(e.currentTarget, { x: 6, duration: 0.3, ease: "power2.out" });
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                gsap.to(e.currentTarget, { x: 0, duration: 0.3, ease: "power2.out" });
              }}
            >
              View Projects <span>→</span>
            </Link>
          </div>
        </div>

        {/* MARQUEE */}
        <div
          ref={marqueeRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            overflow: "hidden",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "13px 0",
            opacity: 0,
          }}
        >
          <div
            ref={marqueeInner}
            style={{
              display: "flex",
              gap: "48px",
              whiteSpace: "nowrap",
              width: "max-content",
            }}
          >
            {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, i) => (
              <span
                key={i}
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: item === "★" ? "#2C5584" : "rgba(255,255,255,0.18)",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

      </section>
    </>
  );
}