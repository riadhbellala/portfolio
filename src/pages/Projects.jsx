import { useRef, useEffect, useState, useCallback, forwardRef } from "react";
import gsap from "gsap";
import lyceumImg from "../assets/project-lyceum.png";

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1,
    index: "01",
    name: "Lyceum",
    category: "Community Platform",
    tagline: "Connecting the next generation of builders",
    description:
      "A community platform for students passionate about technology, creativity, leadership, and innovation. Built to connect the next generation of builders.",
    tech: ["React", "Vite", "Tailwind", "GSAP", "Supabase"],
    url: "https://lyceum-club.vercel.app",
    image: lyceumImg,
    accent: "#61DAFB",
    year: "2024",
    role: "Full-Stack Dev",
  },
  {
    id: 2,
    index: "02",
    name: "Project Two",
    category: "Web Application",
    tagline: "Your second project tagline here",
    description:
      "Replace this with your real project description. What problem does it solve? What makes it interesting?",
    tech: ["React", "Supabase", "GSAP"],
    url: "https://example.com",
    image: null,
    accent: "#A8FF78",
    year: "2024",
    role: "Frontend Dev",
  },
  {
    id: 3,
    index: "03",
    name: "Project Three",
    category: "Design System",
    tagline: "Precision at every scale",
    description:
      "A design system built for speed and consistency. Every token, component, and pattern engineered to work together.",
    tech: ["TypeScript", "Figma", "Storybook"],
    url: "https://example.com",
    image: null,
    accent: "#FF6B6B",
    year: "2025",
    role: "Design Engineer",
  },
  {
    id: 4,
    index: "04",
    name: "Project Four",
    category: "Data Visualization",
    tagline: "Making sense of complex data",
    description:
      "Interactive dashboards that turn raw data into clear, actionable insights. Built for analysts and executives alike.",
    tech: ["D3.js", "React", "Python"],
    url: "https://example.com",
    image: null,
    accent: "#F7B731",
    year: "2025",
    role: "Frontend Dev",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   ANIMATED CANVAS VISUAL
───────────────────────────────────────────────────────────────────────────── */
function CanvasVisual({ project }) {
  const ref = useRef(null);
  const raf = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const hex = project.accent;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    let t = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  || 300;
      canvas.height = canvas.offsetHeight || 200;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#06080f";
      ctx.fillRect(0, 0, W, H);

      // Dot grid
      for (let x = 0; x < W; x += 36) {
        for (let y = 0; y < H; y += 36) {
          const dist = Math.hypot(x - W / 2, y - H / 2);
          const pulse = Math.sin(t * 0.6 - dist * 0.012) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(x, y, 0.9, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${0.04 + pulse * 0.1})`;
          ctx.fill();
        }
      }

      // Flowing waves
      for (let wave = 0; wave < 6; wave++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.04 + wave * 0.025})`;
        ctx.lineWidth = 1.2;
        for (let x = 0; x <= W; x += 3) {
          const y =
            H / 2 +
            Math.sin((x / W) * Math.PI * 2.5 + t * 0.7 + wave * 1.1) * (30 + wave * 18) +
            Math.cos((x / W) * Math.PI * 1.2 + t * 0.4 + wave) * (15 + wave * 8);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Central orb
      const pulse2 = Math.sin(t * 1.2) * 0.5 + 0.5;
      const orbR = 80 + pulse2 * 30;
      const grd = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, orbR * 2);
      grd.addColorStop(0,   `rgba(${r},${g},${b},${0.35 + pulse2 * 0.15})`);
      grd.addColorStop(0.4, `rgba(${r},${g},${b},0.08)`);
      grd.addColorStop(1,   "transparent");
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, orbR * 2, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

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
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   BREAKPOINT
───────────────────────────────────────────────────────────────────────────── */
function useBreakpoint() {
  const get = () => (window.innerWidth < 768 ? "mobile" : "desktop");
  const [bp, setBp] = useState(get);
  useEffect(() => {
    const h = () => setBp(get());
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return bp;
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT ROW (desktop)
───────────────────────────────────────────────────────────────────────────── */
const ProjectRow = forwardRef(function ProjectRow(
  { project, isActive, isHovered, isDimmed, onClick, onMouseEnter, onMouseLeave },
  ref
) {
  const [localHover, setLocalHover] = useState(false);
  const highlight = isActive || isHovered || localHover;

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => { setLocalHover(true); onMouseEnter(); }}
      onMouseLeave={() => { setLocalHover(false); onMouseLeave(); }}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "18px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        cursor: "pointer",
        opacity: isDimmed ? 0.25 : 1,
        transition: "opacity 0.25s ease",
        position: "relative",
        userSelect: "none",
      }}
    >
      {/* Active left marker */}
      <div style={{
        position: "absolute",
        left: -20,
        top: "50%",
        transform: "translateY(-50%)",
        width: 4,
        height: isActive ? "60%" : "0%",
        borderRadius: 2,
        background: project.accent,
        boxShadow: `0 0 10px ${project.accent}`,
        transition: "height 0.35s cubic-bezier(0.4,0,0.2,1)",
      }} />

      {/* Index */}
      <span style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 9, letterSpacing: "0.35em",
        color: highlight ? project.accent : "rgba(255,255,255,0.18)",
        width: 36, flexShrink: 0,
        transition: "color 0.2s",
      }}>{project.index}</span>

      {/* Name */}
      <span style={{
        flex: 1,
        fontSize: highlight ? "1.6rem" : "1.35rem",
        fontWeight: 800,
        letterSpacing: highlight ? "-0.04em" : "-0.02em",
        color: highlight ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.35)",
        lineHeight: 1,
        transition: "font-size 0.3s cubic-bezier(0.4,0,0.2,1), color 0.25s, letter-spacing 0.3s",
      }}>
        {project.name}
      </span>

      {/* Category */}
      <span style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 8, letterSpacing: "0.25em",
        color: "rgba(255,255,255,0.2)",
        textTransform: "uppercase",
        opacity: highlight ? 1 : 0,
        transform: highlight ? "translateX(0)" : "translateX(8px)",
        transition: "opacity 0.25s, transform 0.25s",
        flexShrink: 0,
        paddingRight: 4,
      }}>
        {project.category}
      </span>

      {/* Arrow */}
      <span style={{
        fontSize: 14,
        color: project.accent,
        opacity: highlight ? 1 : 0,
        transform: highlight ? "translateX(0)" : "translateX(-6px)",
        transition: "opacity 0.2s, transform 0.2s",
        marginLeft: 10,
        flexShrink: 0,
      }}>→</span>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────────────────────
   MOBILE ROW
───────────────────────────────────────────────────────────────────────────── */
function MobileRow({ project, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "15px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      {/* Left accent bar */}
      <div style={{
        width: 3,
        height: isActive ? 44 : 22,
        borderRadius: 2,
        background: isActive ? project.accent : "rgba(255,255,255,0.1)",
        flexShrink: 0,
        transition: "height 0.35s cubic-bezier(0.4,0,0.2,1), background 0.3s",
        boxShadow: isActive ? `0 0 10px ${project.accent}` : "none",
      }} />

      {/* Text block */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: isActive ? 5 : 0 }}>
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 8, letterSpacing: "0.3em",
            color: isActive ? project.accent : "rgba(255,255,255,0.2)",
            flexShrink: 0,
            transition: "color 0.25s",
          }}>{project.index}</span>
          <span style={{
            fontSize: isActive ? 19 : 15,
            fontWeight: 800,
            letterSpacing: isActive ? "-0.04em" : "-0.02em",
            color: isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.38)",
            lineHeight: 1,
            transition: "font-size 0.3s cubic-bezier(0.4,0,0.2,1), color 0.25s, letter-spacing 0.25s",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>{project.name}</span>
        </div>

        {/* Tagline — expands when active */}
        <div style={{
          overflow: "hidden",
          maxHeight: isActive ? "60px" : "0px",
          opacity: isActive ? 1 : 0,
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s",
        }}>
          <p style={{
            margin: 0,
            fontSize: 11, lineHeight: 1.55,
            color: "rgba(255,255,255,0.28)",
            fontFamily: "'Georgia', serif",
            letterSpacing: "0.01em",
          }}>{project.tagline}</p>
        </div>
      </div>

      {/* Right: year + arrow */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "flex-end",
        gap: 4, flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 8, letterSpacing: "0.25em",
          color: isActive ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.12)",
          transition: "color 0.25s",
        }}>{project.year}</span>
        <span style={{
          fontSize: 13,
          color: project.accent,
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateX(0)" : "translateX(-4px)",
          transition: "opacity 0.25s, transform 0.25s",
        }}>→</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function Projects() {
  const bp       = useBreakpoint();
  const isMobile = bp === "mobile";

  const [active,  setActive]  = useState(0);
  const [hovered, setHovered] = useState(null);
  const [entered, setEntered] = useState(false);

  const displayed = hovered !== null ? hovered : active;
  const proj      = PROJECTS[displayed];

  const wrapRef     = useRef(null);
  const imgRef      = useRef(null);
  const metaNameRef = useRef(null);
  const metaCatRef  = useRef(null);
  const metaDescRef = useRef(null);
  const metaTechRef = useRef(null);
  const metaYearRef = useRef(null);
  const lineRefs    = useRef([]);

  // ── Entrance animation ──
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.15 });
    tl.fromTo(wrapRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out",
        onComplete: () => setEntered(true) }
    );
    // Only animate lineRefs on desktop (they don't exist on mobile)
    const validLines = lineRefs.current.filter(Boolean);
    if (validLines.length) {
      tl.fromTo(validLines,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.07, duration: 0.6, ease: "expo.out" },
        "-=0.2"
      );
    }
    // On mobile: animate the initial image in
    if (imgRef.current) {
      tl.fromTo(imgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Meta / image crossfade on project change (desktop) ──
  const prevDisplayed = useRef(displayed);
  useEffect(() => {
    if (!entered || isMobile) return;
    if (prevDisplayed.current === displayed) return;
    prevDisplayed.current = displayed;

    const els = [
      metaNameRef.current, metaCatRef.current,
      metaDescRef.current, metaTechRef.current, metaYearRef.current,
    ].filter(Boolean);

    gsap.fromTo(els,
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.04, duration: 0.4, ease: "power3.out" }
    );

    if (imgRef.current) {
      gsap.fromTo(imgRef.current,
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" }
      );
    }
  }, [displayed, entered, isMobile]);

  const handleLineClick = useCallback((i) => {
    setActive(i);
    setHovered(null);
  }, []);

  /* ════════════════════════════════════════════════════════════════
     MOBILE LAYOUT
  ════════════════════════════════════════════════════════════════ */
  if (isMobile) {
    return (
      <div ref={wrapRef} style={{
        position: "fixed", inset: 0,
        background: "#06080f",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        opacity: 0,
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}>

        {/* ── Visual panel (top ~44%) ── */}
        <div style={{
          height: "44%",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
          background: "#06080f",
        }}>
          {/* All project visuals stacked — CSS opacity transition switches them */}
          {PROJECTS.map((p, i) => (
            p.image ? (
              <img
                key={p.id}
                src={p.image}
                alt={p.name}
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover", display: "block",
                  opacity: active === i ? 1 : 0,
                  transition: "opacity 0.5s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            ) : (
              <div key={p.id} style={{
                position: "absolute", inset: 0,
                opacity: active === i ? 1 : 0,
                transition: "opacity 0.5s cubic-bezier(0.4,0,0.2,1)",
              }}>
                <CanvasVisual project={p} />
              </div>
            )
          ))}

          {/* Bottom gradient — blends into bg */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(6,8,15,0.1) 0%, rgba(6,8,15,0.7) 75%, #06080f 100%)",
            pointerEvents: "none",
            zIndex: 2,
          }} />

          {/* Accent glow — transitions with active project */}
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at 50% 60%, ${proj.accent}1c 0%, transparent 65%)`,
            pointerEvents: "none",
            zIndex: 1,
            transition: "background 0.6s ease",
          }} />

          {/* Project name badge — bottom left of visual */}
          <div style={{
            position: "absolute",
            bottom: 16, left: 20,
            zIndex: 3,
            pointerEvents: "none",
          }}>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 7, letterSpacing: "0.4em",
              color: proj.accent,
              textTransform: "uppercase",
              marginBottom: 4,
              transition: "color 0.3s",
            }}>{proj.index} — {proj.category}</div>
            <div style={{
              fontSize: "1.55rem",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: "rgba(255,255,255,0.92)",
            }}>
              {proj.name}
              <span style={{ color: proj.accent, transition: "color 0.3s" }}>.</span>
            </div>
          </div>

          {/* Navbar-area top fade (safety, in case navbar overlaps) */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 64,
            background: "linear-gradient(to bottom, #06080f 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 2,
          }} />
        </div>

        {/* ── Project list (bottom ~56%, scrollable) ── */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          padding: "0 20px",
          paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
          boxSizing: "border-box",
        }}>

          {/* Section header */}
          <div style={{
            padding: "16px 0 10px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.12)" }} />
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 8, letterSpacing: "0.45em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.18)",
            }}>Selected Work</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(255,255,255,0.06),transparent)" }} />
          </div>

          {/* Rows */}
          {PROJECTS.map((p, i) => (
            <MobileRow
              key={p.id}
              project={p}
              isActive={active === i}
              onClick={() => handleLineClick(i)}
            />
          ))}

          {/* Visit CTA */}
          <div style={{ padding: "20px 0 4px" }}>
            <a
              href={proj.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                fontFamily: "'Courier New', monospace",
                fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase",
                color: proj.accent,
                textDecoration: "none",
                transition: "color 0.3s",
              }}
            >
              <div style={{
                width: 16, height: 1,
                background: proj.accent, flexShrink: 0,
                transition: "background 0.3s",
              }} />
              View {proj.name} ↗
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════════
     DESKTOP LAYOUT
  ════════════════════════════════════════════════════════════════ */
  return (
    <div ref={wrapRef} style={{
      position: "fixed", inset: 0,
      background: "#06080f",
      display: "flex",
      overflow: "hidden",
      opacity: 0,
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>

      {/* ── LEFT PANEL — project list ── */}
      <div style={{
        width: "clamp(340px, 40%, 500px)",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 0 0 clamp(40px, 6vw, 80px)",
        position: "relative",
        zIndex: 3,
      }}>

        {/* Section label */}
        <div style={{
          marginBottom: 40,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.2)" }} />
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 8, letterSpacing: "0.5em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
          }}>Selected Work</span>
        </div>

        {/* Project rows */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {PROJECTS.map((p, i) => (
            <ProjectRow
              key={p.id}
              ref={el => (lineRefs.current[i] = el)}
              project={p}
              isActive={active === i}
              isHovered={hovered === i}
              isDimmed={hovered !== null && hovered !== i}
              onClick={() => handleLineClick(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </div>

        {/* Counter */}
        <div style={{
          marginTop: 48,
          fontFamily: "'Courier New', monospace",
          fontSize: 8, letterSpacing: "0.4em",
          color: "rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ color: proj.accent, transition: "color 0.3s" }}>
            {String(displayed + 1).padStart(2, "0")}
          </span>
          <span>/ {String(PROJECTS.length).padStart(2, "0")}</span>
          <div style={{
            flex: 1, height: 1,
            background: "linear-gradient(90deg, rgba(255,255,255,0.08), transparent)",
          }} />
        </div>
      </div>

      {/* ── RIGHT PANEL — visual + meta ── */}
      <div style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}>

        {/* Full-bleed visual */}
        <div style={{ position: "absolute", inset: 0 }}>
          {proj.image ? (
            <img
              ref={imgRef}
              src={proj.image}
              alt={proj.name}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover", display: "block",
                opacity: 0,
              }}
            />
          ) : (
            <div ref={imgRef} style={{ position: "absolute", inset: 0, opacity: 0 }}>
              <CanvasVisual project={proj} />
            </div>
          )}

          {/* Left fade into list panel */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, #06080f 0%, transparent 30%)",
            pointerEvents: "none", zIndex: 1,
          }} />
          {/* Bottom fade for meta */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, #06080f 0%, transparent 55%)",
            pointerEvents: "none", zIndex: 1,
          }} />
          {/* Accent glow */}
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at 60% 40%, ${proj.accent}14 0%, transparent 60%)`,
            pointerEvents: "none", zIndex: 1,
            transition: "background 0.6s ease",
          }} />
        </div>

        {/* Meta block */}
        <div style={{
          position: "relative", zIndex: 2,
          padding: "0 clamp(32px, 5vw, 64px) clamp(32px, 5vh, 56px) clamp(32px, 4vw, 56px)",
          maxWidth: 520,
        }}>
          {/* Category badge */}
          <div ref={metaCatRef} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            marginBottom: 14,
            padding: "4px 12px",
            border: `1px solid ${proj.accent}44`,
            borderRadius: 100,
            background: `${proj.accent}0d`,
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: "50%",
              background: proj.accent,
              boxShadow: `0 0 8px ${proj.accent}`,
            }} />
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 8, letterSpacing: "0.3em",
              color: proj.accent, textTransform: "uppercase",
            }}>{proj.category}</span>
          </div>

          <h2 ref={metaNameRef} style={{
            margin: "0 0 8px",
            fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
            fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1,
            color: "rgba(255,255,255,0.95)",
          }}>
            {proj.name}<span style={{ color: proj.accent }}>.</span>
          </h2>

          <p ref={metaDescRef} style={{
            margin: "0 0 20px", fontSize: 13, lineHeight: 1.75,
            color: "rgba(255,255,255,0.38)",
            fontFamily: "'Georgia', serif",
            letterSpacing: "0.01em", maxWidth: 400,
          }}>
            {proj.description}
          </p>

          <div ref={metaTechRef} style={{
            display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20,
          }}>
            {proj.tech.map(t => (
              <span key={t} style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 8, letterSpacing: "0.2em",
                padding: "4px 10px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
              }}>{t}</span>
            ))}
          </div>

          <div ref={metaYearRef} style={{
            display: "flex", alignItems: "center", gap: 20,
          }}>
            <a
              href={proj.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                fontFamily: "'Courier New', monospace",
                fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase",
                color: proj.accent, textDecoration: "none",
                transition: "gap 0.25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.gap = "16px"; }}
              onMouseLeave={e => { e.currentTarget.style.gap = "10px"; }}
            >
              <span style={{
                display: "inline-block", width: 20, height: 1,
                background: proj.accent, flexShrink: 0,
              }} />
              View project
              <span style={{ fontSize: 11 }}>↗</span>
            </a>
            <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 8, letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.2)",
            }}>{proj.role} · {proj.year}</span>
          </div>
        </div>
      </div>
    </div>
  );
}