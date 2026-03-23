import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import lyceumImg from "../assets/project-lyceum.png";

gsap.registerPlugin(Draggable, InertiaPlugin);

const PROJECTS = [
  {
    id: 1,
    index: "01",
    name: "Lyceum",
    tagline: "Innovation · Leadership · Community",
    description:
      "A community platform for students passionate about technology, creativity, leadership, and innovation. Built to connect the next generation of builders.",
    tech: ["React", "Vite", "Tailwind", "GSAP", "Supabase"],
    url: "https://lyceum-club.vercel.app",
    image: lyceumImg,
    accent: "#61DAFB",
    year: "2024",
  },
  {
    id: 2,
    index: "02",
    name: "Lyceum",
    tagline: "Innovation · Leadership · Community",
    description:
      "A community platform for students passionate about technology, creativity, leadership, and innovation. Built to connect the next generation of builders.",
    tech: ["React", "Vite", "Tailwind", "GSAP", "Supabase"],
    url: "https://lyceum-club.vercel.app",
    image: lyceumImg,
    accent: "#88CE02",
    year: "2024",
  },
  {
    id: 3,
    index: "03",
    name: "Lyceum",
    tagline: "Innovation · Leadership · Community",
    description:
      "A community platform for students passionate about technology, creativity, leadership, and innovation. Built to connect the next generation of builders.",
    tech: ["React", "Vite", "Tailwind", "GSAP", "Supabase"],
    url: "https://lyceum-club.vercel.app",
    image: lyceumImg,
    accent: "#61DAFB",
    year: "2024",
  },
  {
    id: 4,
    index: "04",
    name: "Project Two",
    tagline: "Your second project tagline here",
    description:
      "Replace this with your real project description. What problem does it solve? What makes it interesting and worth showing?",
    tech: ["React", "Supabase", "GSAP"],
    url: "https://example.com",
    image: null,
    accent: "#88CE02",
    year: "2025",
  },
];

// ── useBreakpoint ─────────────────────────────────────────────────────────────
function useBreakpoint() {
  const get = () =>
    window.innerWidth < 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop";
  const [bp, setBp] = useState(get);
  useEffect(() => {
    const h = () => setBp(get());
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return bp;
}

// ── Placeholder canvas ────────────────────────────────────────────────────────
function PlaceholderVisual({ project, isActive }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const hex = project.accent;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    let t = 0;

    canvas.width = canvas.offsetWidth || 300;
    canvas.height = canvas.offsetHeight || 200;

    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.06)`;
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      for (let wave = 0; wave < 5; wave++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.07 + wave * 0.04})`;
        ctx.lineWidth = 1;
        for (let x = 0; x <= W; x += 2) {
          const y =
            H / 2 +
            Math.sin((x / W) * Math.PI * 3 + t + wave * 0.8) *
              (22 + wave * 11) *
              (isActive ? 1.3 : 0.7);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      const pulse = Math.sin(t * 1.5) * 0.5 + 0.5;
      const orbR = (isActive ? 42 : 30) + pulse * 8;
      const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, orbR * 2.5);
      grad.addColorStop(0, `rgba(${r},${g},${b},${0.5 + pulse * 0.2})`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},0.12)`);
      grad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, orbR * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      t += 0.018;
      frameRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [project, isActive]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

// ── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, isActive, onVisit, isMobile, cardW, cardH }) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      scale: isActive ? 1 : 0.86,
      opacity: isActive ? 1 : 0.32,
      filter: isActive ? "blur(0px)" : "blur(2px)",
      duration: 0.55,
      ease: "power3.out",
    });
  }, [isActive]);

  return (
    <div
      ref={cardRef}
      style={{
        width: cardW,
        height: cardH,
        flexShrink: 0,
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${isActive ? project.accent + "55" : "rgba(255,255,255,0.06)"}`,
        background: "#0a0a0f",
        boxShadow: isActive
          ? `0 0 50px ${project.accent}22, 0 24px 50px rgba(0,0,0,0.6)`
          : "0 12px 30px rgba(0,0,0,0.4)",
        position: "relative",
        userSelect: "none",
      }}
    >
      <div style={{ width: "100%", height: isMobile ? "50%" : "53%", position: "relative", overflow: "hidden" }}>
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none", display: "block" }}
          />
        ) : (
          <PlaceholderVisual project={project} isActive={isActive} />
        )}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom,transparent 40%,#0a0a0f)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: 10, right: 10,
          fontSize: 7, letterSpacing: "0.35em", textTransform: "uppercase",
          color: project.accent, border: `1px solid ${project.accent}44`,
          padding: "2px 7px", borderRadius: 2, background: `${project.accent}0a`,
          pointerEvents: "none",
        }}>
          {project.year}
        </div>
      </div>

      <div style={{ padding: isMobile ? 14 : 20, display: "flex", flexDirection: "column", gap: isMobile ? 7 : 9 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.3em", color: project.accent, fontFamily: "monospace" }}>
            {project.index}
          </span>
          <h3 style={{ margin: 0, fontSize: isMobile ? 17 : 22, fontWeight: 900, letterSpacing: "-0.04em", color: "rgba(255,255,255,0.92)", lineHeight: 1 }}>
            {project.name}
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: isMobile ? 10 : 11, letterSpacing: "0.02em", lineHeight: 1.55, color: "rgba(255,255,255,0.28)" }}>
          {project.tagline}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {project.tech.map((tech) => (
            <span key={tech} style={{
              fontSize: 6, letterSpacing: "0.18em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)",
              padding: "2px 6px", borderRadius: 2,
            }}>
              {tech}
            </span>
          ))}
        </div>
        {isActive && (
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onVisit(); }}
            style={{
              marginTop: 6, display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 8, letterSpacing: "0.28em", textTransform: "uppercase",
              color: project.accent, background: "none", border: "none",
              cursor: "pointer", padding: 0, width: "fit-content",
            }}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { x: 4, duration: 0.25, ease: "power2.out" })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { x: 0, duration: 0.25 })}
          >
            <div style={{ width: 16, height: 1, background: project.accent, flexShrink: 0 }} />
            Visit site →
          </button>
        )}
      </div>
    </div>
  );
}

// ── NavBtn ────────────────────────────────────────────────────────────────────
function NavBtn({ children, onClick, disabled, accent, size }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "none",
        border: `1px solid ${disabled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.18)"}`,
        width: size, height: size, borderRadius: "50%",
        color: disabled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.5)",
        cursor: disabled ? "default" : "pointer",
        fontSize: 14,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "border-color 0.25s, color 0.25s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = accent;
          e.currentTarget.style.color = accent;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = disabled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.18)";
        e.currentTarget.style.color = disabled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.5)";
      }}
    >
      {children}
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Projects() {
  const bp       = useBreakpoint();
  const isMobile = bp === "mobile";

  const CARD_W = isMobile ? 260 : 360;
  const CARD_H = isMobile ? 320 : 430;
  const GAP    = isMobile ? 24  : 40;
  const NAV_H  = isMobile ? 56  : 70;
  const STEP   = CARD_W + GAP;   // distance between card left edges
  const total  = PROJECTS.length;

  const [active, setActive] = useState(0);
  const [ready,  setReady]  = useState(false);

  const trackRef  = useRef(null);
  const bodyRef   = useRef(null);
  const activeRef = useRef(0);
  const dragMoved = useRef(0);
  const dragging  = useRef(false);
  const draggerRef = useRef(null);

  // ── The one formula that everything depends on ──────────────────────────────
  // We want: left-of-track + index*STEP + CARD_W/2 == window.innerWidth/2
  // => trackX = window.innerWidth/2 - CARD_W/2 - index*STEP
  const getX = useCallback(
    (index) => window.innerWidth / 2 - CARD_W / 2 - index * STEP,
    [CARD_W, STEP]
  );

  const goTo = useCallback(
    (index, animate = true) => {
      const i = Math.max(0, Math.min(index, total - 1));
      activeRef.current = i;
      setActive(i);
      const x = getX(i);
      if (animate) {
        gsap.to(trackRef.current, { x, duration: 0.65, ease: "power3.out" });
      } else {
        gsap.set(trackRef.current, { x });
      }
    },
    [total, getX]
  );

  // ── Initial mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    requestAnimationFrame(() => {
      goTo(0, false);
      setReady(true);
      if (bodyRef.current) {
        gsap.fromTo(
          bodyRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1 }
        );
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-center when breakpoint / dimensions change ──────────────────────────
  useEffect(() => {
    if (!ready) return;
    goTo(activeRef.current, false);
  }, [bp, ready, goTo]);

  // ── Draggable setup ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready || !trackRef.current) return;

    draggerRef.current?.kill();

    draggerRef.current = Draggable.create(trackRef.current, {
      type: "x",
      inertia: true,
      cursor: "grab",
      activeCursor: "grabbing",
      minimumMovement: 5,
      // Prevent cards from flying completely off screen
      bounds: {
        minX: getX(total - 1) - CARD_W * 0.4,
        maxX: getX(0)         + CARD_W * 0.4,
      },
      onDragStart() {
        dragging.current  = true;
        dragMoved.current = 0;
        gsap.killTweensOf(trackRef.current);
      },
      onDrag() {
        dragMoved.current += Math.abs(this.deltaX);
      },
      onDragEnd() {
        // Inverse of getX to find which card we're nearest to
        const curX     = gsap.getProperty(trackRef.current, "x");
        const rawIndex = (window.innerWidth / 2 - CARD_W / 2 - curX) / STEP;
        goTo(Math.round(rawIndex));
        gsap.delayedCall(0.7, () => {
          dragging.current  = false;
          dragMoved.current = 0;
        });
      },
    })[0];

    return () => draggerRef.current?.kill();
  }, [ready, CARD_W, STEP, total, getX, goTo]);

  // ── Keyboard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goTo(activeRef.current + 1);
      if (e.key === "ArrowLeft")  goTo(activeRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  const ap = PROJECTS[active];

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#080808",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: NAV_H,
      boxSizing: "border-box",
    }}>

      {/* Grain */}
      <div aria-hidden style={{
        position: "fixed", inset: 0, zIndex: 9990, pointerEvents: "none", opacity: 0.032,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: "128px 128px",
      }} />

      {/* Glow */}
      <div aria-hidden style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: "60vw", height: "60vh", borderRadius: "50%",
        background: `radial-gradient(circle,${ap.accent}0a 0%,transparent 70%)`,
        pointerEvents: "none", zIndex: 0,
        transition: "background 0.8s ease", filter: "blur(40px)",
      }} />

      {/* Grid */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(44,85,132,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(44,85,132,0.025) 1px,transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* ── Body ── */}
      <div
        ref={bodyRef}
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? 14 : 22,
          zIndex: 2,
          paddingBottom: isMobile ? 16 : 28,
          boxSizing: "border-box",
          opacity: 0, // GSAP animates this in
        }}
      >

        {/* Counter */}
        <div style={{ textAlign: "center", userSelect: "none" }}>
          <span style={{ fontSize: 8, letterSpacing: "0.55em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)" }}>
            Selected Work
          </span>
          <span style={{ marginLeft: 20, fontSize: 9, letterSpacing: "0.3em", fontFamily: "monospace", color: "rgba(255,255,255,0.2)", verticalAlign: "middle" }}>
            <span style={{ color: ap.accent }}>{String(active + 1).padStart(2, "0")}</span>
            /{String(total).padStart(2, "0")}
          </span>
        </div>

        {/* ── Carousel ──
            Outer div: clips the side cards, fixed height
            Inner track (trackRef): position:absolute, GSAP moves it on X only
            Cards sit in a flex row inside the track
            The track's left:0, and getX() tells GSAP exactly where to move it
            so the active card is centered in the viewport
        */}
        <div style={{
          position: "relative",
          width: "100%",
          // Extra vertical space so scale(1) card doesn't get clipped
          height: CARD_H + 60,
          overflow: "hidden",
          flexShrink: 0,
        }}>
          <div
            ref={trackRef}
            style={{
              position: "absolute",
              // Vertical centering handled by CSS; GSAP only touches translateX
              top: "50%",
              left: 0,
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              gap: GAP,
              // No width constraint — let it grow as wide as cards need
              willChange: "transform",
            }}
          >
            {PROJECTS.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                isActive={active === i}
                isMobile={isMobile}
                cardW={CARD_W}
                cardH={CARD_H}
                onVisit={() => {
                  if (dragMoved.current < 8) {
                    window.open(project.url, "_blank", "noreferrer");
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Description (desktop only) */}
        {!isMobile && (
          <p style={{
            margin: 0, textAlign: "center", maxWidth: 440, padding: "0 24px",
            fontSize: 12, lineHeight: 1.8, letterSpacing: "0.02em",
            color: "rgba(255,255,255,0.25)", userSelect: "none",
          }}>
            {ap.description}
          </p>
        )}

        {/* ── Navigation ── */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 18 : 22 }}>

          <NavBtn
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            accent={ap.accent}
            size={isMobile ? 32 : 36}
          >←</NavBtn>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {PROJECTS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Project ${i + 1}`}
                style={{
                  width: active === i ? 22 : 6,
                  height: 6, borderRadius: 3,
                  background: active === i ? ap.accent : "rgba(255,255,255,0.15)",
                  border: "none", cursor: "pointer", padding: 0,
                  transition: "width 0.35s ease, background 0.35s ease",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          <NavBtn
            onClick={() => goTo(active + 1)}
            disabled={active === total - 1}
            accent={ap.accent}
            size={isMobile ? 32 : 36}
          >→</NavBtn>

        </div>

        <p aria-hidden style={{
          fontSize: 7, letterSpacing: "0.4em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.08)", margin: 0, whiteSpace: "nowrap",
          animation: "fadeHint 2.5s ease 1.8s forwards",
        }}>
          drag · arrows · click to visit
        </p>

      </div>

      <style>{`@keyframes fadeHint { 0%{opacity:1} 100%{opacity:0} }`}</style>
    </div>
  );
}