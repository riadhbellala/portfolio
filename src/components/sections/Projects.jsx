import {
  useRef, useEffect, useState, useCallback, forwardRef,
} from "react";
import gsap from "gsap";
import lyceumImg from "/src/assets/project-lyceum.png";

/* ─── Noise texture (same as AboutStack) ────────────────────────────────── */
function NoiseOverlay() {
  return (
    <svg aria-hidden="true" style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      zIndex: 0, pointerEvents: "none", opacity: 0.035,
    }}>
      <filter id="projects-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#projects-noise)"/>
    </svg>
  );
}

/* ─── Orb ────────────────────────────────────────────────────────────────── */
function Orb({ style }) {
  return (
    <div aria-hidden="true" style={{
      position: "absolute", borderRadius: "50%",
      background: "radial-gradient(circle at 40% 40%, rgba(44,85,132,0.13), transparent 70%)",
      pointerEvents: "none", zIndex: 0, ...style,
    }}/>
  );
}

/* ─── Breakpoint ─────────────────────────────────────────────────────────── */
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

/* ─── Projects data ──────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1,
    index: "01",
    name: "Lyceum",
    category: "Community Platform",
    tagline: "Connecting the next generation of builders",
    description: "A community platform for students passionate about technology, creativity, leadership, and innovation.",
    tech: ["React", "Vite", "Tailwind", "GSAP", "Supabase"],
    url: "https://lyceum-club.vercel.app",
    image: lyceumImg,
    year: "2024",
    role: "Full-Stack Dev",
  },
  {
    id: 2,
    index: "02",
    name: "Lyceum",
    category: "Community Platform",
    tagline: "Connecting the next generation of builders",
    description: "A community platform for students passionate about technology, creativity, leadership, and innovation.",
    tech: ["React", "Vite", "Tailwind", "GSAP", "Supabase"],
    url: "https://lyceum-club.vercel.app",
    image: lyceumImg,
    year: "2024",
    role: "Full-Stack Dev",
  },
  // ← Paste more project objects here
];

/* ─── Animated canvas fallback ──────────────────────────────────────────── */
function CanvasVisual() {
  const ref = useRef(null);
  const raf = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth || 400; canvas.height = canvas.offsetHeight || 300; };
    resize();
    window.addEventListener("resize", resize);
    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0a0d14"; ctx.fillRect(0, 0, W, H);
      for (let x = 0; x < W; x += 38)
        for (let y = 0; y < H; y += 38) {
          const pulse = Math.sin(t * 0.5 - Math.hypot(x - W / 2, y - H / 2) * 0.01) * 0.5 + 0.5;
          ctx.beginPath(); ctx.arc(x, y, 0.9, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(44,85,132,${0.04 + pulse * 0.1})`; ctx.fill();
        }
      for (let w = 0; w < 4; w++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(44,85,132,${0.04 + w * 0.02})`;
        ctx.lineWidth = 1;
        for (let x = 0; x <= W; x += 3) {
          const y = H / 2 + Math.sin((x / W) * Math.PI * 2.4 + t * 0.65 + w * 1.1) * (24 + w * 14);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      t += 0.016;
      raf.current = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}/>;
}

/* ─── Dot strip (same component style as AboutStack) ────────────────────── */
function DotStrip({ count, activeIndex, onSelect }) {
  if (count <= 1) return null;
  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
      {Array.from({ length: count }).map((_, i) => (
        <button key={i} onClick={() => onSelect(i)} style={{
          width: i === activeIndex ? "22px" : "6px",
          height: "6px", borderRadius: "3px",
          background: i === activeIndex ? "rgba(44,85,132,0.8)" : "rgba(44,85,132,0.22)",
          border: "none", padding: 0, cursor: "pointer",
          transition: "width 0.35s ease, background 0.35s ease",
          boxShadow: i === activeIndex ? "0 0 10px rgba(44,85,132,0.5)" : "none",
        }}/>
      ))}
    </div>
  );
}

/* ─── Single project row ────────────────────────────────────────────────── */
function ProjectRow({ project: p, isActive, rowRef, onClick, isMobile }) {
  return (
    <div
      ref={rowRef}
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: "28px",
        padding: "20px",
        border: isActive ? "1px solid rgba(44,85,132,0.4)" : "1px solid rgba(44,85,132,0.12)",
        borderRadius: "16px",
        background: isActive ? "rgba(44,85,132,0.07)" : "rgba(44,85,132,0.02)",
        cursor: isActive ? "default" : "pointer",
        transition: "border-color 0.35s, background 0.35s",
        overflow: "hidden",
        userSelect: "none",
        backdropFilter: "blur(8px)",
      }}
      onMouseEnter={e => {
        if (isActive) return;
        e.currentTarget.style.borderColor = "rgba(44,85,132,0.3)";
        e.currentTarget.style.background  = "rgba(44,85,132,0.05)";
      }}
      onMouseLeave={e => {
        if (isActive) return;
        e.currentTarget.style.borderColor = "rgba(44,85,132,0.12)";
        e.currentTarget.style.background  = "rgba(44,85,132,0.02)";
      }}
    >
      {/* ── Image / canvas panel ── */}
      <div style={{
        flexShrink: 0,
        width:  isMobile ? "100%" : isActive ? "240px" : "140px",
        height: isMobile ? "180px" : isActive ? "160px" : "100px",
        borderRadius: "10px",
        overflow: "hidden",
        position: "relative",
        transition: "width 0.45s ease, height 0.45s ease",
        background: "#0a0d14",
        border: "1px solid rgba(44,85,132,0.15)",
      }}>
        {p.image
          ? <img src={p.image} alt={p.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: isActive ? 1 : 0.5, transition: "opacity 0.4s" }}/>
          : <CanvasVisual/>
        }
        {/* gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(6,8,15,0.65), transparent)",
          pointerEvents: "none",
        }}/>
        {/* index badge */}
        <div style={{
          position: "absolute", top: "8px", left: "8px",
          padding: "3px 9px", borderRadius: "100px",
          background: "rgba(6,8,15,0.75)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(44,85,132,0.3)",
          fontFamily: "Georgia, serif", fontStyle: "italic",
          fontSize: "9px", letterSpacing: "0.15em",
          color: "rgba(44,85,132,0.75)",
        }}>{p.index}</div>
      </div>

      {/* ── Text panel ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px" }}>
        {/* top row */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "Georgia, serif", fontStyle: "italic",
            fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(44,85,132,0.55)",
          }}>{p.category}</span>
          <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "rgba(44,85,132,0.35)", display: "inline-block" }}/>
          <span style={{
            fontFamily: "Georgia, serif", fontStyle: "italic",
            fontSize: "9px", color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em",
          }}>{p.year}</span>
        </div>

        {/* name */}
        <h2 style={{
          margin: 0,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 800,
          fontSize: isActive ? "clamp(1.4rem,2.5vw,2rem)" : "clamp(1.1rem,2vw,1.5rem)",
          letterSpacing: "-0.04em", lineHeight: 1,
          color: "rgba(255,255,255,0.9)",
          transition: "font-size 0.35s ease",
        }}>
          {p.name}
          <span style={{ color: "rgba(44,85,132,0.75)" }}>.</span>
        </h2>

        {/* tagline */}
        <p style={{
          margin: 0,
          fontFamily: "Georgia, serif", fontStyle: "italic",
          fontSize: "11px", lineHeight: 1.65,
          color: "rgba(255,255,255,0.28)",
          maxWidth: "420px",
        }}>{p.tagline}</p>

        {/* expanded content */}
        <div style={{
          maxHeight: isActive ? "200px" : "0px",
          overflow: "hidden",
          opacity: isActive ? 1 : 0,
          transition: "max-height 0.45s ease, opacity 0.35s ease",
        }}>
          <p style={{
            margin: "0 0 12px",
            fontFamily: "Georgia, serif", fontStyle: "italic",
            fontSize: "12px", lineHeight: 1.75,
            color: "rgba(255,255,255,0.3)",
          }}>{p.description}</p>

          {/* tech pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
            {p.tech.map(t => (
              <span key={t} style={{
                padding: "3px 10px", borderRadius: "100px",
                border: "1px solid rgba(44,85,132,0.3)",
                background: "rgba(44,85,132,0.07)",
                fontFamily: "Georgia, serif", fontStyle: "italic",
                fontSize: "9px", letterSpacing: "0.1em",
                color: "rgba(44,85,132,0.7)",
              }}>{t}</span>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a
              href={p.url} target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "10px 22px", borderRadius: "100px",
                border: "1px solid rgba(44,85,132,0.5)",
                background: "rgba(44,85,132,0.12)",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(44,85,132,0.9)", textDecoration: "none",
                transition: "background 0.25s, border-color 0.25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(44,85,132,0.22)"; e.currentTarget.style.borderColor = "rgba(44,85,132,0.75)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(44,85,132,0.12)"; e.currentTarget.style.borderColor = "rgba(44,85,132,0.5)"; }}
            >
              View Project <span>↗</span>
            </a>
            <span style={{
              fontFamily: "Georgia, serif", fontStyle: "italic",
              fontSize: "9px", letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.18)",
            }}>{p.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROJECTS — redesigned to match AboutStack premium vibe
═══════════════════════════════════════════════════════════════ */
const Projects = forwardRef(function Projects({ isMobile: isMobileProp }, ref) {
  const bp       = useBreakpoint();
  const isMobile = isMobileProp ?? bp === "mobile";

  const [active, setActive]   = useState(0);
  const [, setEntered] = useState(false);

  const wrapRef    = useRef(null);
  const headerRef  = useRef(null);
  const listRef    = useRef(null);
  const footerRef  = useRef(null);
  const rowRefs    = useRef([]);
  const hasEntered = useRef(false);
  const dragState  = useRef({ startX: 0, dx: 0, active: false });

  const n    = PROJECTS.length;

  /* ── Entrance ── */
  function playEntrance() {
    if (hasEntered.current) return;
    hasEntered.current = true;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (headerRef.current)
      tl.fromTo(headerRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
    if (listRef.current)
      tl.fromTo(listRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.3");
    if (footerRef.current)
      tl.fromTo(footerRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3");

    // stagger row reveals
    rowRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el, { x: -20, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.55, ease: "power3.out",
        delay: 0.3 + i * 0.12,
      });
    });
  }

  /* ── Visibility observer ── */
  useEffect(() => {
    const el = ref?.current ?? wrapRef.current;
    if (!el) return;
    if (ref?.current) {
      const obs = new MutationObserver(() => {
        const visible = el.style.visibility !== "hidden" && parseFloat(el.style.opacity || "0") > 0.5;
        if (visible && !hasEntered.current) { setEntered(true); playEntrance(); }
      });
      obs.observe(el, { attributes: true, attributeFilter: ["style"] });
      return () => obs.disconnect();
    }
    playEntrance();
    setEntered(true);
  }, [ref]);

  /* ── Keyboard ── */
  useEffect(() => {
    const h = (e) => {
      if (["ArrowRight", "ArrowDown"].includes(e.key)) setActive(a => Math.min(a + 1, n - 1));
      if (["ArrowLeft",  "ArrowUp"  ].includes(e.key)) setActive(a => Math.max(a - 1, 0));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [n]);

  /* ── Touch drag (for mobile between projects) ── */
  const startDrag = (clientX) => { dragState.current = { startX: clientX, dx: 0, active: true }; };
  const moveDrag  = (clientX) => {
    if (!dragState.current.active) return;
    dragState.current.dx = clientX - dragState.current.startX;
  };
  const endDrag = () => {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    const { dx } = dragState.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0 && active < n - 1) setActive(a => a + 1);
      else if (dx > 0 && active > 0) setActive(a => a - 1);
    }
  };

  /* ── Section shell ── */
  const sectionStyle = {
    position: "fixed", inset: 0,
    width: "100%", height: "100vh",
    background: "#080808",
    overflow: "hidden",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxSizing: "border-box",
    padding: isMobile ? "0 24px" : "0 8%",
  };

  return (
    <section
      ref={ref ?? wrapRef}
      style={sectionStyle}
      onMouseDown={e => startDrag(e.clientX)}
      onMouseUp={endDrag}
      onTouchStart={e => startDrag(e.touches[0].clientX)}
      onTouchMove={e => moveDrag(e.touches[0].clientX)}
      onTouchEnd={endDrag}
    >
      <NoiseOverlay/>
      <Orb style={{ width: "600px", height: "600px", top: "-200px", right: "-150px" }}/>
      <Orb style={{ width: "400px", height: "400px", bottom: "-150px", left: "-100px" }}/>

      {/* top + bottom rule lines */}
      <div aria-hidden="true" style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(44,85,132,0.2), transparent)" }}/>
      <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: "8%", right: "8%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(44,85,132,0.2), transparent)" }}/>

      {/* dynamic ambient glow tied to active project */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "60vw", height: "60vh",
        background: "radial-gradient(ellipse at center, rgba(44,85,132,0.07) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
        transition: "background 0.7s ease",
      }}/>

      {/* main content */}
      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: "1040px",
        display: "flex", flexDirection: "column", gap: "28px",
      }}>

        {/* ── Header ── */}
        <div ref={headerRef} style={{ opacity: 0, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <p style={{
              margin: "0 0 6px", fontFamily: "Georgia, serif", fontStyle: "italic",
              fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(44,85,132,0.5)",
            }}>Selected work</p>
            <h2 style={{
              margin: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 800,
              fontSize: "clamp(1.6rem,3vw,2.4rem)", letterSpacing: "-0.04em", lineHeight: 1,
              color: "rgba(255,255,255,0.9)",
            }}>
              Projects
              <span style={{ color: "rgba(44,85,132,0.7)" }}>.</span>
            </h2>
          </div>
          <p style={{
            margin: 0, fontFamily: "Georgia, serif", fontStyle: "italic",
            fontSize: "12px", color: "rgba(255,255,255,0.18)", letterSpacing: "0.05em",
            paddingBottom: "4px",
          }}>
            {n} project{n !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, rgba(44,85,132,0.3), transparent)" }}/>

        {/* ── Project list ── */}
        <div ref={listRef} style={{ opacity: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
          {PROJECTS.map((p, i) => (
            <ProjectRow
              key={p.id + "-" + i}
              project={p}
              isActive={active === i}
              rowRef={el => (rowRefs.current[i] = el)}
              onClick={() => setActive(i)}
              isMobile={isMobile}
            />
          ))}
        </div>

        {/* ── Footer ── */}
        <div ref={footerRef} style={{
          opacity: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "12px",
        }}>
          <DotStrip count={n} activeIndex={active} onSelect={setActive}/>

          {/* Prev / Next buttons */}
          {n > 1 && (
            <div style={{ display: "flex", gap: "10px" }}>
              {[
                { label: "←", action: () => setActive(a => Math.max(a - 1, 0)),     disabled: active === 0 },
                { label: "→", action: () => setActive(a => Math.min(a + 1, n - 1)), disabled: active === n - 1 },
              ].map(({ label, action, disabled }) => (
                <button key={label} onClick={action} disabled={disabled} style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  border: `1px solid ${disabled ? "rgba(44,85,132,0.1)" : "rgba(44,85,132,0.35)"}`,
                  background: disabled ? "transparent" : "rgba(44,85,132,0.08)",
                  color: disabled ? "rgba(255,255,255,0.15)" : "rgba(44,85,132,0.85)",
                  fontSize: "14px", cursor: disabled ? "default" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.25s ease", outline: "none",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = "rgba(44,85,132,0.15)"; e.currentTarget.style.borderColor = "rgba(44,85,132,0.6)"; } }}
                onMouseLeave={e => { if (!disabled) { e.currentTarget.style.background = "rgba(44,85,132,0.08)"; e.currentTarget.style.borderColor = "rgba(44,85,132,0.35)"; } }}
                >{label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;800&display=swap');
      `}</style>
    </section>
  );
});

export default Projects;