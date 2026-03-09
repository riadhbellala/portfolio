import { useRef, useEffect } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { scrollManager } from "../../utils/ScrollManager";

// ─────────────────────────────────────────────────────────────────────────────
// useBreakpoint
// Returns "mobile" (< 640px), "tablet" (640–1023px), or "desktop" (≥ 1024px).
// It adds a resize listener so the value updates live when the window resizes.
// We import it inline here so each file is self-contained.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useCallback } from "react";
function useBreakpoint() {
  const get = useCallback(() => {
    const w = window.innerWidth;
    if (w < 640)  return "mobile";
    if (w < 1024) return "tablet";
    return "desktop";
  }, []);

  const [bp, setBp] = useState(get);

  useEffect(() => {
    const handler = () => setBp(get());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [get]);

  return bp;
}

const LETTERS = ["R", "I", "A", "D", "H"];
const MARQUEE = [
  "Frontend Developer", "✦", "React JS", "✦",
  "Creative Thinker", "✦", "Based in Algeria", "✦", "Available for Work", "✦",
];

export default function Hero() {
  const bp = useBreakpoint();
  // isMobile / isTablet used for conditional rendering and style values
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";

  const sectionRef     = useRef(null);
  const lettersRef     = useRef([]);
  const bottomRowRef   = useRef(null);
  const marqueeRef     = useRef(null);
  const marqueeInner   = useRef(null);
  const scrollLineRef  = useRef(null);
  // Cursor refs — only used on desktop (mouse devices)
  const cursorDotRef   = useRef(null);
  const cursorRingRef  = useRef(null);
  const glowRef        = useRef(null);
  const marqueeAnimRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    // Make this section immediately visible.
    // ScrollManager will hide all other sections when init() runs.
    gsap.set(section, { autoAlpha: 1 });

    // ── Set starting (hidden) states for every animated element ──────────
    // yPercent: 120  →  element starts 120% of its own height BELOW its
    // normal position. Because the parent has overflow:hidden, it's invisible.
    gsap.set(lettersRef.current,    { yPercent: 120, opacity: 0 });
    gsap.set(bottomRowRef.current,  { opacity: 0, y: 28 });
    gsap.set(scrollLineRef.current, { scaleY: 0, transformOrigin: "top" });
    gsap.set(marqueeRef.current,    { opacity: 0 });
    if (cursorRingRef.current) gsap.set(cursorRingRef.current, { scale: 0, opacity: 0 });

    // ── Entrance timeline ────────────────────────────────────────────────
    // gsap.timeline() chains animations. Each .to() starts when the previous
    // one ends, unless you pass a position parameter like "-=0.4" which means
    // "start 0.4 seconds before the previous one finishes" (overlap/parallelize).
    const tl = gsap.timeline({ delay: 0.3 });
    tl
      // Letters rise up one by one. stagger:0.07 = 70ms between each letter.
      // power4.out = very fast start, smooth deceleration — gives energy.
      .to(lettersRef.current,
        { yPercent: 0, opacity: 1, duration: 1.1, ease: "power4.out", stagger: 0.07 })
      // Cursor ring pops in with a back.out overshoot while letters still animating
      .to(cursorRingRef.current,
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.5)" }, "-=0.6")
      // Bottom row slides up — starts 0.4s before cursor ring finishes
      .to(bottomRowRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
      // Scroll line grows downward from top
      .to(scrollLineRef.current,
        { scaleY: 1, duration: 1.2, ease: "power2.inOut" }, "-=0.6")
      // Marquee fades in
      .to(marqueeRef.current,
        { opacity: 1, duration: 0.5 }, "-=0.5");

    // ── Marquee animation ────────────────────────────────────────────────
    // offsetWidth / 3 = width of ONE copy of the text (we have 3 copies).
    // We animate x from 0 to -mWidth, which scrolls exactly one full copy.
    // repeat:-1 loops forever. ease:"none" = constant speed, no easing.
    // When x reaches -mWidth, GSAP loops back to 0 — invisible because
    // the content at position 0 looks identical to position -mWidth.
    const mWidth = marqueeInner.current.offsetWidth / 3;
    marqueeAnimRef.current = gsap.to(marqueeInner.current, {
      x: -mWidth, duration: 24, ease: "none", repeat: -1,
    });

    // ── Mouse tracking — all non-touch devices (desktop + tablet) ──────────
    // Mobile phones are touch-only so we skip everything mouse-related there.
    // Tablets (iPad, Surface, etc.) can have a mouse/trackpad — include them.
    // The CUSTOM CURSOR dot+ring is desktop-only (see JSX).
    // The MAGNETIC EFFECT + GLOW work on both desktop and tablet.
    let onMove, onLeave;
    if (!isMobile) {
      onMove = (e) => {
        // Custom cursor elements only exist on desktop — guard with ?. (optional chaining)
        // so this doesn't crash on tablet where the refs are null
        if (cursorDotRef.current)
          gsap.to(cursorDotRef.current,
            { x: e.clientX, y: e.clientY, duration: 0.08, ease: "none" });
        if (cursorRingRef.current)
          gsap.to(cursorRingRef.current,
            { x: e.clientX, y: e.clientY, duration: 0.5, ease: "power2.out" });

        // Glow blob follows cursor on both desktop and tablet
        gsap.to(glowRef.current,
          { x: e.clientX, y: e.clientY, duration: 1.8, ease: "power2.out" });

        // Magnetic pull — works on desktop and tablet
        lettersRef.current.forEach((el) => {
          if (!el) return;
          const r    = el.getBoundingClientRect();
          const cx   = r.left + r.width / 2;
          const cy   = r.top  + r.height / 2;
          const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
          const str  = Math.max(0, 1 - dist / 380) * 0.06;
          gsap.to(el, {
            x: (e.clientX - cx) * str,
            y: (e.clientY - cy) * str,
            duration: 0.9, ease: "power2.out",
          });
        });
      };

      onLeave = () => {
        lettersRef.current.forEach((el) => {
          if (!el) return;
          gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.4)" });
        });
      };

      window.addEventListener("mousemove", onMove);
      section.addEventListener("mouseleave", onLeave);
    }

    // ── Register with ScrollManager ──────────────────────────────────────
    // in(done)  = how this section animates INTO view (called by ScrollManager)
    // out(done) = how this section animates OUT OF view
    // CRITICAL: done() must always be called — it unlocks isAnimating.
    scrollManager.register(section, [
      {
        in: (done) => {
          gsap.timeline({ onComplete: done })
            .to(lettersRef.current,
              { opacity: 1, yPercent: 0, duration: 0.7, ease: "power2.out",
                stagger: { each: 0.06, from: "center" } }) // lights up from center out
            .to(bottomRowRef.current,
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3")
            .to(marqueeRef.current,
              { opacity: 1, duration: 0.4 }, "-=0.2");
        },
        out: (done) => {
          gsap.timeline({ onComplete: done })
            .to(lettersRef.current,
              { opacity: 0, letterSpacing: "0.2em", yPercent: -20,
                duration: 0.65, ease: "power2.in",
                stagger: { each: 0.04, from: "center" } }) // dims from center out
            .to(bottomRowRef.current,
              { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" }, "<")
            .to(marqueeRef.current,
              { opacity: 0, duration: 0.3 }, "<");
        },
      },
    ]);

    return () => {
      marqueeAnimRef.current?.kill(); // stop marquee loop on unmount
      if (onMove) window.removeEventListener("mousemove", onMove);
      if (onLeave) section.removeEventListener("mouseleave", onLeave);
    };
  // Re-run if isMobile changes — mobile loses all mouse effects,
  // tablet and desktop both keep them
  }, [isMobile]);

  // ── Letter hover handlers (desktop only) ────────────────────────────────
  // ── Letter hover handlers ────────────────────────────────────────────────
  // Skip ONLY on mobile (touch-only). Tablet users can have a mouse/trackpad
  // and should get the full colour + scale + cursor ring effect.
  // On desktop: cursor ring also animates (it exists in the DOM).
  // On tablet: cursor ring ref is null — the gsap.to calls are guarded with ?.
  const handleLetterEnter = (e) => {
    if (isMobile) return;
    e.currentTarget.style.color = "#2C5584";
    e.currentTarget.style.webkitTextStroke = "1px #2C5584";
    gsap.to(e.currentTarget, { scale: 1.07, duration: 0.3, ease: "power2.out" });
    // cursorRingRef.current is null on tablet — optional chaining prevents crash
    if (cursorRingRef.current)
      gsap.to(cursorRingRef.current,
        { scale: 2.8, borderColor: "rgba(44,85,132,0.9)", duration: 0.35, ease: "power2.out" });
  };
  const handleLetterLeave = (e) => {
    if (isMobile) return;
    e.currentTarget.style.color = "transparent";
    e.currentTarget.style.webkitTextStroke = "1px rgba(255,255,255,0.72)";
    gsap.to(e.currentTarget, { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    if (cursorRingRef.current)
      gsap.to(cursorRingRef.current,
        { scale: 1, borderColor: "rgba(44,85,132,0.55)", duration: 0.4, ease: "power2.out" });
  };

  return (
    <>
      {/* ── Custom cursor — hidden on mobile/tablet ── */}
      {/* position:fixed + top/left:0 means GSAP moves them using x/y (transform) */}
      {/* translate(-50%,-50%) keeps the center of each circle on the cursor point */}
      {!isMobile && !isTablet && (
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
        </>
      )}

      <section
        ref={sectionRef}
        style={{
          position: "fixed", inset: 0, width: "100%", height: "100vh",
          background: "#080808", overflow: "hidden",
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
          // Hide the real cursor on desktop (we have our custom one)
          // On mobile restore default cursor for usability
          cursor: isMobile || isTablet ? "auto" : "none",
        }}
      >
        {/* ── Ambient glow blob ──────────────────────────────────────────── */}
        {/* Mobile: CSS-centered (no mouse to follow). position absolute 50%/50%.  */}
        {/* Tablet + Desktop: starts at top:0,left:0 — GSAP moves it via x/y      */}
        {/* on mousemove so it follows the cursor. translate(-50%,-50%) keeps the  */}
        {/* center of the blob on the cursor point regardless of its size.         */}
        <div
          ref={glowRef}
          style={{
            position: "absolute",
            top:  isMobile ? "50%" : 0,
            left: isMobile ? "50%" : 0,
            width: isMobile ? "280px" : "600px",
            height: isMobile ? "280px" : "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(44,85,132,0.12) 0%, transparent 68%)",
            pointerEvents: "none",
            transform: "translate(-50%,-50%)",
            filter: "blur(50px)", zIndex: 0,
          }}
        />

        {/* ── Corner brackets — smaller on mobile ── */}
        {[
          { top: isMobile ? "16px" : "32px", left: isMobile ? "16px" : "32px",
            borderTop: "1px solid rgba(44,85,132,0.28)", borderLeft: "1px solid rgba(44,85,132,0.28)" },
          { top: isMobile ? "16px" : "32px", right: isMobile ? "16px" : "32px",
            borderTop: "1px solid rgba(44,85,132,0.28)", borderRight: "1px solid rgba(44,85,132,0.28)" },
          { bottom: isMobile ? "16px" : "32px", left: isMobile ? "16px" : "32px",
            borderBottom: "1px solid rgba(44,85,132,0.28)", borderLeft: "1px solid rgba(44,85,132,0.28)" },
          { bottom: isMobile ? "16px" : "32px", right: isMobile ? "16px" : "32px",
            borderBottom: "1px solid rgba(44,85,132,0.28)", borderRight: "1px solid rgba(44,85,132,0.28)" },
        ].map((s, i) => (
          <div key={i} style={{
            position: "absolute",
            width: isMobile ? "14px" : "20px",
            height: isMobile ? "14px" : "20px",
            pointerEvents: "none", zIndex: 1, ...s,
          }} />
        ))}

        {/* ── Name letters ── */}
        {/* overflow:hidden on this wrapper clips the letters during the slide-up entrance */}
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          overflow: "hidden",
          // clamp(min, preferred, max) — scales with viewport width (vw)
          // On mobile: letters are bigger relative to screen (fills nicely)
          gap: "clamp(1px, 0.8vw, 14px)",
          padding: isMobile ? "0 12px" : "0 24px",
          position: "relative", zIndex: 1,
        }}>
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={(el) => (lettersRef.current[i] = el)}
              style={{
                display: "inline-block",
                // clamp auto-adapts: mobile fills screen width, desktop caps at 20rem
                fontSize: isMobile
                  ? "clamp(3.5rem, 18vw, 5.5rem)"
                  : isTablet
                  ? "clamp(4rem, 15vw, 10rem)"
                  : "clamp(5rem, 19vw, 20rem)",
                fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.03em",
                color: "transparent",
                WebkitTextStroke: isMobile ? "1px rgba(255,255,255,0.65)" : "1px rgba(255,255,255,0.72)",
                opacity: 0, userSelect: "none",
                transition: "color 0.2s, -webkit-text-stroke 0.2s",
                willChange: "transform",
              }}
              onMouseEnter={handleLetterEnter}
              onMouseLeave={handleLetterLeave}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* ── Bottom row — hidden on mobile to avoid cramping ── */}
        {/* On mobile we only show the scroll indicator (centered) */}
        <div
          ref={bottomRowRef}
          style={{
            position: "absolute",
            // Raise bottom row slightly on tablet to avoid marquee overlap
            bottom: isMobile ? "60px" : isTablet ? "80px" : "90px",
            left: 0, right: 0,
            padding: isMobile ? "0 20px" : isTablet ? "0 32px" : "0 52px",
            display: "flex",
            // Mobile: center everything. Tablet/desktop: space-between
            justifyContent: isMobile ? "center" : "space-between",
            alignItems: "flex-end",
            opacity: 0, zIndex: 1,
          }}
        >
          {/* Hide "Based in" on mobile — not enough space */}
          {!isMobile && (
            <div>
              <p style={{ fontSize: "9px", letterSpacing: "0.45em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.22)", marginBottom: "6px" }}>Based in</p>
              <p style={{ fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.58)" }}>Algeria</p>
            </div>
          )}

          {/* Scroll indicator — always visible */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <div ref={scrollLineRef} style={{
              width: "1px", height: isMobile ? "36px" : "52px",
              background: "linear-gradient(to bottom, rgba(44,85,132,0.8), transparent)",
            }} />
            <span style={{ fontSize: "7px", letterSpacing: "0.4em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.15)" }}>
              {isMobile ? "Swipe" : "Scroll"}
            </span>
          </div>

          {/* Hide "View Projects" link on mobile */}
          {!isMobile && (
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.45em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.22)", marginBottom: "6px" }}>Work</p>
              <Link
                to="/projects"
                style={{ fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.58)", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: "8px" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#2C5584";
                  gsap.to(e.currentTarget, { x: 7, duration: 0.3, ease: "power2.out" });
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.58)";
                  gsap.to(e.currentTarget, { x: 0, duration: 0.4, ease: "power2.out" });
                }}
              >
                View Projects <span>→</span>
              </Link>
            </div>
          )}
        </div>

        {/* ── Marquee ── */}
        <div
          ref={marqueeRef}
          onMouseEnter={() => marqueeAnimRef.current?.pause()}
          onMouseLeave={() => marqueeAnimRef.current?.resume()}
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            overflow: "hidden",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: isMobile ? "10px 0" : "13px 0",
            opacity: 0, zIndex: 1,
          }}
        >
          <div
            ref={marqueeInner}
            style={{ display: "flex", gap: isMobile ? "28px" : "48px",
              whiteSpace: "nowrap", width: "max-content" }}
          >
            {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i} style={{
                fontSize: isMobile ? "7px" : "9px",
                letterSpacing: "0.45em", textTransform: "uppercase",
                color: item === "✦" ? "#2C5584" : "rgba(255,255,255,0.15)",
              }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}