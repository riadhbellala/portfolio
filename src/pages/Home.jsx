import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import gsap from "gsap";
import Hero      from "../components/sections/Hero";
import About     from "../components/sections/About";
import TechStack from "../components/sections/TechStack";
import Contact   from "../components/sections/Contact";

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

function GrainOverlay() {
  return (
    <div aria-hidden="true" style={{
      position:"fixed",inset:0,zIndex:9990,pointerEvents:"none",opacity:0.032,
      backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundRepeat:"repeat",backgroundSize:"128px 128px",
    }}/>
  );
}

const SECTION_LABELS = ["Hero","About","Stack","Contact"];

function NavDots({ current, onGo, isMobile }) {
  if (isMobile) return null;
  return (
    <nav aria-label="Section navigation" style={{
      position:"fixed",right:"28px",top:"50%",transform:"translateY(-50%)",
      display:"flex",flexDirection:"column",gap:"16px",zIndex:9000,
    }}>
      {SECTION_LABELS.map((label, i) => (
        <button key={i} onClick={() => onGo(i)} title={label}
          aria-label={`Go to ${label}`}
          style={{
            width:"6px",height:"6px",borderRadius:"50%",
            background: i === current ? "#2C5584" : "rgba(255,255,255,0.18)",
            border:"none",cursor:"pointer",padding:0,
            transition:"transform 0.3s, background 0.3s",
            transform: i === current ? "scale(1.8)" : "scale(1)",
            outline:"none",
          }}
        />
      ))}
    </nav>
  );
}

function CustomCursor({ isMobile }) {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (isMobile) return;
    const onMove = (e) => {
      gsap.to(dotRef.current,  { x:e.clientX, y:e.clientY, duration:0.06, ease:"none" });
      gsap.to(ringRef.current, { x:e.clientX, y:e.clientY, duration:0.5,  ease:"power2.out" });
    };
    const grow   = () => gsap.to(ringRef.current, { scale:2.4, opacity:0.8, duration:0.3 });
    const shrink = () => gsap.to(ringRef.current, { scale:1,   opacity:1,   duration:0.3 });
    window.addEventListener("mousemove", onMove);
    document.querySelectorAll("a,button,[data-hover]").forEach(el => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isMobile]);

  if (isMobile) return null;
  return (
    <>
      <div ref={dotRef} aria-hidden="true" style={{
        position:"fixed",top:0,left:0,width:"5px",height:"5px",borderRadius:"50%",
        background:"#2C5584",pointerEvents:"none",zIndex:99999,
        transform:"translate(-50%,-50%)",
      }}/>
      <div ref={ringRef} aria-hidden="true" style={{
        position:"fixed",top:0,left:0,width:"36px",height:"36px",borderRadius:"50%",
        border:"1px solid rgba(44,85,132,0.6)",pointerEvents:"none",zIndex:99998,
        transform:"translate(-50%,-50%)",
      }}/>
    </>
  );
}

// ── Transition definitions — each section has its own exit + enter style ──────
// exitFn(el, dir, tl)  — animates the leaving section
// enterFn(el, dir, tl) — animates the entering section
const TRANSITIONS = [
  // Hero: shatter / implode out, rise up in
  {
    exit:  (el, dir, tl) => tl.to(el, { scale:1.08, autoAlpha:0, filter:"blur(12px)", duration:0.7, ease:"power3.in" }),
    enter: (el, dir, tl) => {
      gsap.set(el, { autoAlpha:0, y: dir==="down"?"6%":"-6%", scale:0.96, filter:"blur(0px)" });
      tl.to(el, { autoAlpha:1, y:"0%", scale:1, duration:0.85, ease:"power3.out" }, "-=0.25");
    },
  },
  // About: slice sideways, slide in from opposite
  {
    exit:  (el, dir, tl) => tl.to(el, { x: dir==="down"?"-5%":"5%", autoAlpha:0, skewX: dir==="down"?-3:3, duration:0.6, ease:"power3.in" }),
    enter: (el, dir, tl) => {
      gsap.set(el, { autoAlpha:0, x: dir==="down"?"6%":"-6%", skewX: dir==="down"?3:-3 });
      tl.to(el, { autoAlpha:1, x:"0%", skewX:0, duration:0.8, ease:"power3.out" }, "-=0.25");
    },
  },
  // TechStack: scale + rotate out, zoom in
  {
    exit:  (el, dir, tl) => tl.to(el, { scale:0.88, rotation:dir==="down"?-3:3, autoAlpha:0, duration:0.65, ease:"power3.in" }),
    enter: (el, dir, tl) => {
      gsap.set(el, { autoAlpha:0, scale:1.1, rotation:dir==="down"?2:-2 });
      tl.to(el, { autoAlpha:1, scale:1, rotation:0, duration:0.85, ease:"power3.out" }, "-=0.25");
    },
  },
  // Contact: venetian blinds — clip-path wipe
  {
    exit:  (el, dir, tl) => tl.to(el, { clipPath:"inset(0% 0% 100% 0%)", autoAlpha:0, duration:0.65, ease:"power3.in" }),
    enter: (el, dir, tl) => {
      gsap.set(el, { autoAlpha:1, clipPath: dir==="down"?"inset(100% 0% 0% 0%)":"inset(0% 0% 100% 0%)" });
      tl.to(el, { clipPath:"inset(0% 0% 0% 0%)", duration:0.85, ease:"power3.out" }, "-=0.25");
    },
  },
];

export default function Home() {
  const bp       = useBreakpoint();
  const isMobile = bp === "mobile";

  const [current, setCurrent] = useState(0);
  const isAnimating = useRef(false);
  const currentRef  = useRef(0);

  const heroRef    = useRef(null);
  const aboutRef   = useRef(null);
  const stackRef   = useRef(null);
  const contactRef = useRef(null);


  const sectionRefs = useMemo(() => [heroRef, aboutRef, stackRef, contactRef], []);

  const goTo = useCallback((nextIndex, dir = "down") => {
    if (isAnimating.current) return;
    if (nextIndex < 0 || nextIndex >= sectionRefs.length) return;
    if (nextIndex === currentRef.current) return;

    isAnimating.current = true;
    const curIdx  = currentRef.current;
    const cur     = sectionRefs[curIdx].current;
    const next    = sectionRefs[nextIndex].current;
    if (!cur || !next) { isAnimating.current = false; return; }

    // Use the transition for the CURRENT (exiting) section
    const exitTrans  = TRANSITIONS[curIdx]  || TRANSITIONS[0];
    const enterTrans = TRANSITIONS[nextIndex] || TRANSITIONS[0];

    gsap.set(next, { zIndex:3, clipPath:"inset(0% 0% 0% 0%)" });
    gsap.set(cur,  { zIndex:2 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(cur, { autoAlpha:0, zIndex:1, x:0, y:0, scale:1, rotation:0, skewX:0, filter:"blur(0px)", clipPath:"inset(0% 0% 0% 0%)" });
        gsap.set(next, { zIndex:2 });
        currentRef.current = nextIndex;
        setCurrent(nextIndex);
        isAnimating.current = false;
      },
    });

    exitTrans.exit(cur, dir, tl);
    enterTrans.enter(next, dir, tl);

  }, [sectionRefs]);

  useEffect(() => {
    document.body.style.overflow    = "hidden";
    document.body.style.height      = "100vh";
    document.documentElement.style.overflow = "hidden";

    sectionRefs.forEach((r, i) => {
      if (r.current) gsap.set(r.current, {
        autoAlpha: i === 0 ? 1 : 0,
        zIndex: i === 0 ? 2 : 1,
        clipPath: "inset(0% 0% 0% 0%)",
      });
    });

    let lastWheel = 0;
    const onWheel = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheel < 1000) return;
      lastWheel = now;
      const dir = e.deltaY > 0 ? "down" : "up";
      goTo(dir === "down" ? currentRef.current + 1 : currentRef.current - 1, dir);
    };

    let touchStartY = 0;
    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
    const onTouchEnd   = (e) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return;
      const dir = delta > 0 ? "down" : "up";
      goTo(dir === "down" ? currentRef.current + 1 : currentRef.current - 1, dir);
    };

    const onKey = (e) => {
      if (["ArrowDown","PageDown"].includes(e.key)) { e.preventDefault(); goTo(currentRef.current+1,"down"); }
      if (["ArrowUp","PageUp"].includes(e.key))     { e.preventDefault(); goTo(currentRef.current-1,"up");   }
    };

    window.addEventListener("wheel",      onWheel,      { passive:false });
    window.addEventListener("touchstart", onTouchStart, { passive:true  });
    window.addEventListener("touchend",   onTouchEnd,   { passive:true  });
    window.addEventListener("keydown",    onKey);

    return () => {
      document.body.style.overflow    = "";
      document.body.style.height      = "";
      document.documentElement.style.overflow = "";
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend",   onTouchEnd);
      window.removeEventListener("keydown",    onKey);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goTo]);

  return (
    <>
      <GrainOverlay />
      <CustomCursor isMobile={isMobile} />
      <NavDots current={current} onGo={(i) => goTo(i, i > currentRef.current ? "down" : "up")} isMobile={isMobile} />
      <main style={{ width:"100vw",height:"100vh",overflow:"hidden",background:"#080808",cursor:isMobile?"auto":"none" }}>
        <Hero      ref={heroRef}    isMobile={isMobile} />
        <About     ref={aboutRef}   isMobile={isMobile} />
        <TechStack ref={stackRef}   isMobile={isMobile} />
        <Contact   ref={contactRef} isMobile={isMobile} />
      </main>
    </>
  );
}