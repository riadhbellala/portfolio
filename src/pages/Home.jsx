import { useEffect, useState, useCallback } from "react";
import { scrollManager } from "../utils/ScrollManager";
import Hero      from "../components/sections/Hero";
import About     from "../components/sections/About";
import TechStack from "../components/sections/TechStack";
import Contact   from "../components/sections/Contact";

// ── useBreakpoint (self-contained) ────────────────────────────────────────
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

const SECTION_LABELS = ["Hero", "About", "Stack", "Contact"];

// ── NavDots ──────────────────────────────────────────────────────────────
// Right-side navigation dots. Each dot is a pill button.
// Active dot expands wider (pill shape). Inactive dots are small circles.
// On mobile: hidden to save space (users swipe instead of clicking dots).
function NavDots({ current, total, onChange, isMobile }) {
  if (isMobile) return null; // no dots on mobile — too small to tap reliably

  return (
    <div style={{
      position: "fixed",
      // Tablet: bring dots slightly closer to edge
      right: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex", flexDirection: "column", gap: "14px",
      zIndex: 1000,
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          title={SECTION_LABELS[i]}
          aria-label={`Go to ${SECTION_LABELS[i]} section`}
          style={{
            // Active dot: wide pill. Inactive: small square (borderRadius makes circle).
            width: i === current ? "24px" : "6px",
            height: "6px",
            borderRadius: "3px",
            background: i === current ? "#2C5584" : "rgba(255,255,255,0.2)",
            border: "none", cursor: "pointer", padding: 0,
            // cubic-bezier(0.4,0,0.2,1) = Material Design standard easing
            // fast expansion, gentle settle — feels responsive
            transition: "width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.3s",
            outline: "none",
            // Invisible expanded tap target so small dots are easier to click
            position: "relative",
          }}
        />
      ))}
    </div>
  );
}

// ── GrainOverlay ─────────────────────────────────────────────────────────
// A fixed overlay with SVG fractal noise at very low opacity.
// Adds subtle film grain texture to the flat dark background.
// On mobile: slightly lower opacity so it doesn't muddy the display.
function GrainOverlay({ isMobile }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      zIndex: 9990, // above all sections but below cursor
      pointerEvents: "none", // never blocks clicks/taps
      opacity: isMobile ? 0.022 : 0.032,
      // feTurbulence generates fractal noise. baseFrequency controls grain size.
      // stitchTiles:"stitch" makes the tile edges seamless.
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "128px 128px",
    }} />
  );
}

export default function Home() {
  const bp       = useBreakpoint();
  const isMobile = bp === "mobile";

  // currentSection drives the active NavDot highlight
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Wire up the section-change callback so React re-renders the dots
    // whenever ScrollManager transitions to a new section
    scrollManager.onSectionChange = (i) => setCurrent(i);

    // 100ms delay gives all child sections time to mount and call register()
    // before init() tries to hide sections 2-4.
    // Without this, sections array might be incomplete when init runs.
    const timer = setTimeout(() => { scrollManager.init(); }, 100);

    return () => {
      clearTimeout(timer);
      // ScrollManager is a singleton — must manually reset state on unmount
      // otherwise navigating back to Home would register duplicate sections
      scrollManager.onSectionChange = null;
      scrollManager.destroy();
      scrollManager.sections       = [];
      scrollManager.currentSection = 0;
      scrollManager.isAnimating    = false;
    };
  }, []);

  return (
    <main style={{
      height: "100vh",
      overflow: "hidden", // prevents the page from being scrollable
      background: "#080808",
      // Hide system cursor on desktop (we render a custom one in Hero)
      // Restore on mobile for usability
      cursor: isMobile ? "auto" : "none",
    }}>
      <GrainOverlay isMobile={isMobile} />
      <NavDots
        current={current}
        total={SECTION_LABELS.length}
        onChange={(i) => scrollManager.jumpTo(i)}
        isMobile={isMobile}
      />

      {/* Sections render in DOM order — ScrollManager controls visibility */}
      <Hero />
      <About />
      <TechStack />
      <Contact />
    </main>
  );
}