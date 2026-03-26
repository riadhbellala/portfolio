import {
  useRef, useEffect, useState, useCallback, forwardRef,
} from "react";
import gsap from "gsap";
import lyceumImg from "/src/assets/project-lyceum.png";

/* ─────────────────────────────────────────────────────────────
   PROJECTS — add as many as you want, they all just work
───────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1,
    index: "01",
    name: "Lyceum",
    category: "Community Platform",
    tagline: "Connecting the next generation of builders",
    description:
      "A community platform for students passionate about technology, creativity, leadership, and innovation.",
    tech: ["React", "Vite", "Tailwind", "GSAP", "Supabase"],
    url: "https://lyceum-club.vercel.app",
    image: lyceumImg,
    accent: "#61DAFB",
    year: "2024",
    role: "Full-Stack Dev",
  },
  {
    id: 1,
    index: "01",
    name: "Lyceum",
    category: "Community Platform",
    tagline: "Connecting the next generation of builders",
    description:
      "A community platform for students passionate about technology, creativity, leadership, and innovation.",
    tech: ["React", "Vite", "Tailwind", "GSAP", "Supabase"],
    url: "https://lyceum-club.vercel.app",
    image: lyceumImg,
    accent: "#61DAFB",
    year: "2024",
    role: "Full-Stack Dev",
  },
  // ← Paste more project objects here
];

/* ─────────────────────────────────────────────────────────────
   Animated canvas (shown when no image is set)
───────────────────────────────────────────────────────────── */
function CanvasVisual({ project }) {
  const ref = useRef(null);
  const raf = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const [r, g, b] = [
      parseInt(project.accent.slice(1, 3), 16),
      parseInt(project.accent.slice(3, 5), 16),
      parseInt(project.accent.slice(5, 7), 16),
    ];
    let t = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth || 400;
      canvas.height = canvas.offsetHeight || 300;
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0a0d14"; ctx.fillRect(0, 0, W, H);
      for (let x = 0; x < W; x += 38)
        for (let y = 0; y < H; y += 38) {
          const pulse = Math.sin(t * 0.5 - Math.hypot(x - W / 2, y - H / 2) * 0.01) * 0.5 + 0.5;
          ctx.beginPath(); ctx.arc(x, y, 0.9, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${0.03 + pulse * 0.09})`; ctx.fill();
        }
      for (let w = 0; w < 5; w++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.04 + w * 0.022})`;
        ctx.lineWidth = 1.1;
        for (let x = 0; x <= W; x += 3) {
          const y = H / 2
            + Math.sin((x / W) * Math.PI * 2.4 + t * 0.65 + w * 1.1) * (28 + w * 16)
            + Math.cos((x / W) * Math.PI * 1.1 + t * 0.35 + w) * (12 + w * 7);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      const p2 = Math.sin(t * 1.1) * 0.5 + 0.5, oR = 70 + p2 * 28;
      const grd = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, oR * 2);
      grd.addColorStop(0, `rgba(${r},${g},${b},${0.3 + p2 * 0.13})`);
      grd.addColorStop(0.4, `rgba(${r},${g},${b},0.06)`);
      grd.addColorStop(1, "transparent");
      ctx.beginPath(); ctx.arc(W / 2, H / 2, oR * 2, 0, Math.PI * 2);
      ctx.fillStyle = grd; ctx.fill();
      t += 0.016;
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, [project]);
  return (
    <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
  );
}

/* ─────────────────────────────────────────────────────────────
   Breakpoint hook
───────────────────────────────────────────────────────────── */
function useBreakpoint() {
  const get = useCallback(() => (window.innerWidth < 768 ? "mobile" : "desktop"), []);
  const [bp, setBp] = useState(get);
  useEffect(() => {
    const h = () => setBp(get());
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [get]);
  return bp;
}

/* ─────────────────────────────────────────────────────────────
   Single project card
───────────────────────────────────────────────────────────── */
function ProjectCard({ project, isActive, cardRef, onClick }) {
  const p = project;
  return (
    <div
      ref={cardRef}
      onClick={onClick}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: 24,
        overflow: "hidden",
        cursor: isActive ? "default" : "pointer",
        userSelect: "none",
        willChange: "transform",
        background: "#0a0d14",
        boxShadow: isActive
          ? `0 40px 90px rgba(0,0,0,0.7), 0 0 0 1px ${p.accent}22, 0 0 60px ${p.accent}11`
          : "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
        transition: "box-shadow 0.4s ease",
        transformStyle: "preserve-3d",
      }}
    >
      {/* image or canvas */}
      {p.image ? (
        <img
          src={p.image}
          alt={p.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <CanvasVisual project={p} />
      )}

      {/* gradient overlays */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(6,8,15,0.97) 0%, rgba(6,8,15,0.5) 45%, rgba(6,8,15,0.05) 100%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 60% 20%, ${p.accent}14 0%, transparent 60%)`,
        pointerEvents: "none",
        transition: "background 0.5s",
      }} />

      {/* top badges */}
      <div style={{
        position: "absolute", top: 18, left: 18, right: 18,
        display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 3,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "5px 12px", borderRadius: 100,
          background: "rgba(6,8,15,0.7)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{
            width: 5, height: 5, borderRadius: "50%",
            background: p.accent, boxShadow: `0 0 7px ${p.accent}`,
          }} />
          <span style={{
            fontFamily: "'Courier New',monospace", fontSize: 8,
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
          }}>{p.index}</span>
        </div>
        <div style={{
          padding: "5px 12px", borderRadius: 100,
          background: "rgba(6,8,15,0.7)", backdropFilter: "blur(12px)",
          border: `1px solid ${p.accent}33`,
          fontFamily: "'Courier New',monospace", fontSize: 8,
          letterSpacing: "0.25em", color: p.accent,
        }}>{p.year}</div>
      </div>

      {/* bottom meta */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "0 22px 22px", zIndex: 3,
      }}>
        {/* category */}
        <div style={{ marginBottom: 8 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 11px", borderRadius: 100,
            border: `1px solid ${p.accent}44`, background: `${p.accent}10`,
            fontFamily: "'Courier New',monospace", fontSize: 7.5,
            letterSpacing: "0.3em", textTransform: "uppercase", color: p.accent,
          }}>{p.category}</span>
        </div>

        {/* name */}
        <h2 style={{
          margin: "0 0 6px",
          fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
          fontSize: "clamp(1.7rem,2.8vw,2.6rem)",
          fontWeight: 900, letterSpacing: "-0.045em",
          lineHeight: 1, color: "rgba(255,255,255,0.95)",
        }}>
          {p.name}<span style={{ color: p.accent }}>.</span>
        </h2>

        {/* description — expands on active */}
        <div style={{
          overflow: "hidden",
          maxHeight: isActive ? 60 : 0,
          opacity: isActive ? 1 : 0,
          transition: "max-height 0.4s ease, opacity 0.3s ease",
        }}>
          <p style={{
            margin: "0 0 12px", fontSize: 12, lineHeight: 1.65,
            color: "rgba(255,255,255,0.4)", fontFamily: "Georgia,serif",
          }}>{p.description}</p>
        </div>

        {/* tech badges — expands on active */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 5,
          overflow: "hidden",
          maxHeight: isActive ? 60 : 0,
          opacity: isActive ? 1 : 0,
          marginBottom: isActive ? 16 : 0,
          transition: "max-height 0.4s ease 0.05s, opacity 0.3s ease 0.05s, margin 0.3s",
        }}>
          {p.tech.map(t => (
            <span key={t} style={{
              padding: "3px 10px", borderRadius: 100,
              border: `1px solid ${p.accent}2a`, background: `${p.accent}09`,
              fontFamily: "'Courier New',monospace", fontSize: 7.5,
              letterSpacing: "0.18em", textTransform: "uppercase", color: `${p.accent}bb`,
            }}>{t}</span>
          ))}
        </div>

        {/* CTA — expands on active */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          overflow: "hidden",
          maxHeight: isActive ? 50 : 0,
          opacity: isActive ? 1 : 0,
          transition: "max-height 0.4s ease 0.1s, opacity 0.3s ease 0.1s",
        }}>
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 100,
              background: p.accent, color: "#06080f",
              fontFamily: "'Courier New',monospace", fontSize: 8.5, fontWeight: 700,
              letterSpacing: "0.28em", textTransform: "uppercase",
              textDecoration: "none", flexShrink: 0,
              boxShadow: `0 0 22px ${p.accent}44`,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 6px 28px ${p.accent}66`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = `0 0 22px ${p.accent}44`;
            }}
          >
            View Project ↗
          </a>
          <span style={{
            fontFamily: "'Courier New',monospace", fontSize: 7.5,
            letterSpacing: "0.22em", color: "rgba(255,255,255,0.18)",
            textTransform: "uppercase",
          }}>{p.role}</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Dot navigation
───────────────────────────────────────────────────────────── */
function DotNav({ total, active, accent, onSelect }) {
  if (total <= 1) return null;
  // for many projects, show max 7 dots + ellipsis behaviour
  const MAX = 7;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      {Array.from({ length: Math.min(total, MAX) }).map((_, i) => {
        const idx = total <= MAX ? i : Math.round((i / (MAX - 1)) * (total - 1));
        const isActive = total <= MAX ? active === i : Math.abs(active - idx) < total / MAX;
        return (
          <button
            key={i}
            onClick={() => onSelect(total <= MAX ? i : idx)}
            style={{
              width: isActive ? 22 : 6, height: 6, borderRadius: 3,
              border: "none", padding: 0, cursor: "pointer",
              background: isActive ? accent : "rgba(255,255,255,0.18)",
              boxShadow: isActive ? `0 0 10px ${accent}88` : "none",
              transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────── */
const Projects = forwardRef(function Projects({ isMobile: isMobileProp }, ref) {
  const bp = useBreakpoint();
  const isMobile = isMobileProp ?? bp === "mobile";

  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);

  const wrapRef = useRef(null);
  const deckRef = useRef(null);
  const cardRefs = useRef([]);
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const dragState = useRef({ startX: 0, dx: 0, active: false });

  const n = PROJECTS.length;
  const proj = PROJECTS[active];

  /* ── fan layout ── */
  const layoutDeck = useCallback((activeIdx, animate = true) => {
    PROJECTS.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const offset = i - activeIdx;
      const abs = Math.abs(offset);
      const sign = Math.sign(offset);

      gsap.to(el, {
        x: offset === 0 ? 0 : `${sign * Math.min(abs * 16, 48)}%`,
        rotateY: offset === 0 ? 0 : sign * Math.min(abs * 5, 20),
        scale: offset === 0 ? 1 : Math.max(0.9 - abs * 0.05, 0.72),
        z: offset === 0 ? 0 : -abs * 45,
        opacity: abs > 3 ? 0 : offset === 0 ? 1 : Math.max(0.82 - abs * 0.2, 0.18),
        zIndex: n - abs,
        duration: animate ? 0.55 : 0,
        ease: "expo.out",
        pointerEvents: offset === 0 ? "auto" : "none",
      });
    });
  }, [n]);

  /* ── entrance ── */
  function playEntrance() {
    const tl = gsap.timeline({ delay: 0.06 });
    if (headerRef.current)
      tl.fromTo(headerRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
    if (deckRef.current)
      tl.fromTo(deckRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: "expo.out" }, "-=0.35");
    if (footerRef.current)
      tl.fromTo(footerRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "expo.out" }, "-=0.3");
    setTimeout(() => layoutDeck(0, true), 200);
  }

  useEffect(() => {
    const el = ref?.current ?? wrapRef.current;
    if (!el) return;
    if (ref?.current) {
      const obs = new MutationObserver(() => {
        const visible = el.style.visibility !== "hidden" && parseFloat(el.style.opacity || "0") > 0.5;
        if (visible && !entered) { setTimeout(() => setEntered(true), 0); playEntrance(); }
      });
      obs.observe(el, { attributes: true, attributeFilter: ["style"] });
      return () => obs.disconnect();
    }
    playEntrance();
    setTimeout(() => setEntered(true), 0);
  }, [ref]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (entered) layoutDeck(active, true);
  }, [active, entered, layoutDeck]);

  /* ── drag ── */
  const startDrag = (clientX) => {
    dragState.current = { startX: clientX, dx: 0, active: true };
    setIsDragging(true);
  };
  const moveDrag = (clientX) => {
    if (!dragState.current.active) return;
    dragState.current.dx = clientX - dragState.current.startX;
    const el = cardRefs.current[active];
    if (el) gsap.to(el, { x: `${dragState.current.dx * 0.07}%`, duration: 0.08 });
  };
  const endDrag = () => {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    setIsDragging(false);
    setHintVisible(false);
    const { dx } = dragState.current;
    // snap back active card
    const el = cardRefs.current[active];
    if (el) gsap.to(el, { x: 0, duration: 0.35, ease: "expo.out" });
    if (Math.abs(dx) > 50) {
      if (dx < 0 && active < n - 1) setActive(a => a + 1);
      else if (dx > 0 && active > 0) setActive(a => a - 1);
    }
  };

  /* ── keyboard ── */
  useEffect(() => {
    const h = (e) => {
      if (["ArrowRight", "ArrowDown"].includes(e.key)) setActive(a => Math.min(a + 1, n - 1));
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) setActive(a => Math.max(a - 1, 0));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [n]);

  const go = (dir) => setActive(a => dir === "prev" ? Math.max(a - 1, 0) : Math.min(a + 1, n - 1));

  const CARD_W = isMobile ? "min(82vw, 340px)" : "min(40vw, 500px)";
  const CARD_H = isMobile ? "min(68vh, 490px)" : "min(72vh, 600px)";

  return (
    <section
      ref={ref ?? wrapRef}
      style={{
        position: "fixed", inset: 0,
        background: "#06080f",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
        perspective: "1400px",
      }}
    >
      {/* grain texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 20, opacity: 0.5,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      }} />

      {/* ambient glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "70vw", height: "70vh",
        background: `radial-gradient(ellipse at center, ${proj.accent}0a 0%, transparent 70%)`,
        pointerEvents: "none",
        transition: "background 0.7s ease",
        zIndex: 0,
      }} />

      {/* header */}
      <div ref={headerRef} style={{
        position: "absolute",
        top: isMobile ? 20 : 30,
        left: 0, right: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 12, zIndex: 10, opacity: 0,
      }}>
        <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.15)" }} />
        <span style={{
          fontFamily: "'Courier New',monospace", fontSize: 8,
          letterSpacing: "0.55em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.18)",
        }}>Selected Work</span>
        <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.15)" }} />
      </div>

      {/* deck */}
      <div
        ref={deckRef}
        style={{
          position: "relative", zIndex: 5,
          width: CARD_W, height: CARD_H,
          transformStyle: "preserve-3d",
          cursor: isDragging ? "grabbing" : n > 1 ? "grab" : "default",
          opacity: 0,
        }}
        onMouseDown={e => startDrag(e.clientX)}
        onMouseMove={e => moveDrag(e.clientX)}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={e => startDrag(e.touches[0].clientX)}
        onTouchMove={e => { e.preventDefault(); moveDrag(e.touches[0].clientX); }}
        onTouchEnd={endDrag}
      >
        {PROJECTS.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            isActive={active === i}
            cardRef={el => (cardRefs.current[i] = el)}
            onClick={() => { if (i !== active) setActive(i); }}
          />
        ))}
      </div>

      {/* swipe hint — fades after first interaction */}
      {n > 1 && hintVisible && (
        <div style={{
          position: "absolute",
          bottom: isMobile ? "calc(80px + env(safe-area-inset-bottom,0px))" : 88,
          left: "50%", transform: "translateX(-50%)",
          display: "flex", alignItems: "center", gap: 10,
          fontFamily: "'Courier New',monospace", fontSize: 8,
          letterSpacing: "0.4em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.18)", whiteSpace: "nowrap",
          zIndex: 10, pointerEvents: "none",
          animation: "hint-pulse 2.5s ease-in-out infinite",
        }}>
          <span>←</span>
          <span>drag to explore</span>
          <span>→</span>
        </div>
      )}

      {/* footer nav */}
      <div ref={footerRef} style={{
        position: "absolute",
        bottom: isMobile ? "calc(20px + env(safe-area-inset-bottom,0px))" : 32,
        display: "flex", alignItems: "center", gap: 16, zIndex: 10, opacity: 0,
      }}>
        {/* prev */}
        <button
          onClick={() => go("prev")}
          disabled={active === 0}
          style={{
            width: 38, height: 38, borderRadius: "50%",
            border: `1px solid ${active === 0 ? "rgba(255,255,255,0.06)" : proj.accent + "44"}`,
            background: active === 0 ? "rgba(255,255,255,0.02)" : `${proj.accent}0e`,
            color: active === 0 ? "rgba(255,255,255,0.2)" : proj.accent,
            fontSize: 15, cursor: active === 0 ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.25s ease", outline: "none",
            boxShadow: active === 0 ? "none" : `0 0 14px ${proj.accent}22`,
          }}
        >←</button>

        <DotNav total={n} active={active} accent={proj.accent} onSelect={setActive} />

        {/* next */}
        <button
          onClick={() => go("next")}
          disabled={active === n - 1}
          style={{
            width: 38, height: 38, borderRadius: "50%",
            border: `1px solid ${active === n - 1 ? "rgba(255,255,255,0.06)" : proj.accent + "44"}`,
            background: active === n - 1 ? "rgba(255,255,255,0.02)" : `${proj.accent}0e`,
            color: active === n - 1 ? "rgba(255,255,255,0.2)" : proj.accent,
            fontSize: 15, cursor: active === n - 1 ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.25s ease", outline: "none",
            boxShadow: active === n - 1 ? "none" : `0 0 14px ${proj.accent}22`,
          }}
        >→</button>
      </div>

      {/* pulse animation for hint */}
      <style>{`
        @keyframes hint-pulse {
          0%, 100% { opacity: 0.18; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
});

export default Projects;