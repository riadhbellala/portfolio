// ─────────────────────────────────────────────────────────────────────────────
// useScrollEngine.js
//
// This is the brain of the fake-scroll system.
//
// HOW IT WORKS:
// 1. document.body gets overflow:hidden — no native scroll
// 2. A hidden <div id="scroll-proxy"> is 5000px tall — this is what the
//    browser thinks is the page. The scrollbar exists, scroll events fire,
//    but the page never visually moves.
// 3. Lenis reads the proxy scroll position and emits a smooth value.
// 4. We take that smooth scroll value and map it to section transitions.
// 5. Sections are position:fixed, stacked. GSAP animates between them.
//
// This gives us:
//   - Native scrollbar (accessibility, feel)
//   - Lenis smoothing
//   - Full control over what actually happens visually
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

// Total "scroll distance" per section in pixels
// Each section occupies this much of the fake scroll range
const SECTION_HEIGHT = 1000;

export function useScrollEngine(sections) {
  // sections = array of { id, el, animateIn(dir), animateOut(dir) }
  const currentRef   = useRef(0);
  const isAnimRef    = useRef(false);
  const lenisRef     = useRef(null);
  const lastScrollY  = useRef(0);

  const goTo = useCallback((nextIndex, direction) => {
    if (isAnimRef.current) return;
    if (nextIndex < 0 || nextIndex >= sections.length) return;

    const current = currentRef.current;
    if (nextIndex === current) return;

    isAnimRef.current = true;

    const outFn = sections[current]?.animateOut;
    const inFn  = sections[nextIndex]?.animateIn;

    // Chain: animate current out → animate next in → unlock
    const tl = gsap.timeline({
      onComplete: () => {
        currentRef.current = nextIndex;
        isAnimRef.current  = false;
      },
    });

    if (outFn) outFn(tl, direction);
    if (inFn)  inFn(tl, direction);
  }, [sections]);

  useEffect(() => {
    if (!sections || sections.length === 0) return;

    // ── Create scroll proxy ───────────────────────────────────────────────
    let proxy = document.getElementById("scroll-proxy");
    if (!proxy) {
      proxy = document.createElement("div");
      proxy.id = "scroll-proxy";
      document.body.appendChild(proxy);
    }
    proxy.style.cssText = `
      position: fixed; top: 0; left: 0;
      width: 1px; height: 1px;
      pointer-events: none; opacity: 0; z-index: -1;
    `;

    // Create an invisible tall div that gives scroll distance
    let spacer = document.getElementById("scroll-spacer");
    if (!spacer) {
      spacer = document.createElement("div");
      spacer.id = "scroll-spacer";
      document.body.appendChild(spacer);
    }
    spacer.style.cssText = `
      height: ${sections.length * SECTION_HEIGHT}px;
      width: 1px; position: absolute; top: 0; left: 0;
      pointer-events: none;
    `;

    // Lock body scroll visually (spacer provides the scroll distance)
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // ── Initialize Lenis ──────────────────────────────────────────────────
    // Dynamic import so it doesn't break if lenis isn't installed yet
    let lenis;
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({
        lerp: 0.08,
        duration: 1.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.8,
      });

      lenisRef.current = lenis;

      // Lenis RAF loop
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      // On each scroll tick from Lenis
      lenis.on("scroll", ({ scroll }) => {
        const sectionIndex = Math.floor(scroll / SECTION_HEIGHT);
        const clamped      = Math.min(sectionIndex, sections.length - 1);

        // Determine direction from last scroll
        const dir = scroll > lastScrollY.current ? "down" : "up";
        lastScrollY.current = scroll;

        if (clamped !== currentRef.current && !isAnimRef.current) {
          goTo(clamped, dir);
        }
      });
    }).catch(() => {
      // Fallback: use native wheel events if lenis not installed
      const onWheel = (e) => {
        e.preventDefault();
        const dir    = e.deltaY > 0 ? "down" : "up";
        const next   = dir === "down"
          ? currentRef.current + 1
          : currentRef.current - 1;
        goTo(next, dir);
      };
      window.addEventListener("wheel", onWheel, { passive: false });
    });

    // Keyboard support
    const onKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); goTo(currentRef.current + 1, "down"); }
      if (e.key === "ArrowUp"   || e.key === "PageUp"  ) { e.preventDefault(); goTo(currentRef.current - 1, "up");   }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      lenis?.destroy();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      spacer?.remove();
      window.removeEventListener("keydown", onKey);
    };
  }, [sections, goTo]);

  return { currentRef, goTo };
}