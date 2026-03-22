import { useRef, useEffect, forwardRef, useState, useCallback } from "react";
import gsap from "gsap";

/* ─── Breakpoint ──────────────────────────────────────────────────────────── */
function useBreakpoint() {
  const get = useCallback(() => {
    const w = window.innerWidth;
    if (w < 640) return "mobile";
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

/* ─── Data (unchanged) ────────────────────────────────────────────────────── */
const STACK = [
  { name: "React",      abbr: "Re", color: "#61DAFB", category: "UI",       exp: "2yr" },
  { name: "TypeScript", abbr: "TS", color: "#3178C6", category: "Language", exp: "1yr" },
  { name: "JavaScript", abbr: "JS", color: "#F7DF1E", category: "Language", exp: "2yr" },
  { name: "GSAP",       abbr: "GS", color: "#88CE02", category: "Motion",   exp: "1yr" },
  { name: "Vite",       abbr: "Vt", color: "#646CFF", category: "Build",    exp: "1yr" },
  { name: "Tailwind",   abbr: "Tw", color: "#38BDF8", category: "CSS",      exp: "2yr" },
  { name: "Supabase",   abbr: "Sb", color: "#3ECF8E", category: "Backend",  exp: "6mo" },
  { name: "HTML",       abbr: "HT", color: "#E44D26", category: "Markup",   exp: "3yr" },
  { name: "CSS",        abbr: "CS", color: "#264DE4", category: "Style",    exp: "3yr" },
];

const DESKTOP_POS = [
  { x: 52, y: 18 },
  { x: 72, y: 38 },
  { x: 30, y: 32 },
  { x: 58, y: 55 },
  { x: 20, y: 60 },
  { x: 78, y: 65 },
  { x: 44, y: 76 },
  { x: 14, y: 38 },
  { x: 62, y: 82 },
];

const CONNECTIONS = [
  [0,2],[0,1],[0,3],
  [1,3],[1,5],
  [2,4],[2,7],
  [3,4],[3,6],[3,5],
  [4,7],
  [5,8],
  [6,8],
];

/* ─── Glowing particle canvas — NO grid ──────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, W, H;
    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.5 + Math.random() * 1.2,
      angle: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.00022,
      speed: 0.00005 + Math.random() * 0.0001,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.007 + Math.random() * 0.02,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.angle += p.drift;
        p.x = ((p.x + Math.cos(p.angle) * p.speed) + 1) % 1;
        p.y = ((p.y + Math.sin(p.angle) * p.speed) + 1) % 1;
        p.phase += p.phaseSpeed;
        const pulse = 0.5 + 0.5 * Math.sin(p.phase);
        ctx.save();
        ctx.shadowBlur  = 1.5 + pulse * 7;
        ctx.shadowColor = `rgba(44,85,132,${0.55 + pulse * 0.45})`;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(44,85,132,${0.12 + pulse * 0.58})`;
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden="true" style={{
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      zIndex: 0, pointerEvents: "none",
    }} />
  );
}

/* ─── Corner bracket ──────────────────────────────────────────────────────── */
function Corner({ top, bottom, left, right }) {
  return (
    <div aria-hidden="true" style={{
      position: "absolute", zIndex: 1,
      top, bottom, left, right,
      width: "18px", height: "18px",
      borderTop:    bottom !== undefined ? "none" : "1px solid rgba(44,85,132,0.28)",
      borderBottom: bottom !== undefined ? "1px solid rgba(44,85,132,0.28)" : "none",
      borderLeft:   right  !== undefined ? "none" : "1px solid rgba(44,85,132,0.28)",
      borderRight:  right  !== undefined ? "1px solid rgba(44,85,132,0.28)" : "none",
    }} />
  );
}

/* ─── TraceLines — animated draw-in on entrance ──────────────────────────── */
function TraceLines({ positions, activeIndex, containerW, containerH, entered }) {
  const lineRefs = useRef([]);

  useEffect(() => {
    if (!entered) return;
    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      try {
        const len = el.getTotalLength();
        gsap.fromTo(el,
          { strokeDasharray: `${len}`, strokeDashoffset: len, opacity: 0 },
          { strokeDashoffset: 0, opacity: 0.13, duration: 1.2 + i * 0.055, ease: "power2.inOut", delay: 0.35 + i * 0.04 }
        );
      } catch {
        gsap.to(el, { opacity: 0.13, duration: 0.8, delay: 0.35 + i * 0.04 });
      }
    });
  }, [entered]);

  useEffect(() => {
    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      const [a, b] = CONNECTIONS[i];
      const isActive = activeIndex === a || activeIndex === b;
      gsap.to(el, {
        opacity: isActive ? 0.62 : 0.13,
        strokeWidth: isActive ? 1.8 : 0.8,
        duration: 0.35, ease: "power2.out",
      });
    });
  }, [activeIndex]);

  return (
    <svg style={{
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 1, overflow: "visible",
    }}>
      <defs>
        <filter id="glow-trace">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {CONNECTIONS.map(([a, b], i) => {
        const pa = positions[a], pb = positions[b];
        if (!pa || !pb) return null;
        const x1 = (pa.x / 100) * containerW, y1 = (pa.y / 100) * containerH;
        const x2 = (pb.x / 100) * containerW, y2 = (pb.y / 100) * containerH;
        const mx = (x1 + x2) / 2;
        return (
          <path
            key={i}
            ref={el => (lineRefs.current[i] = el)}
            d={`M${x1},${y1} L${mx},${y1} L${mx},${y2} L${x2},${y2}`}
            stroke="rgba(44,100,200,0.85)"
            strokeWidth="0.8"
            fill="none"
            opacity="0"
            strokeDasharray="4 3"
            filter="url(#glow-trace)"
          />
        );
      })}
    </svg>
  );
}

/* ─── Signal dot — color-matches destination ──────────────────────────────── */
function SignalDot({ positions, containerW, containerH }) {
  const dotRef = useRef(null);

  useEffect(() => {
    if (!dotRef.current || !positions.length) return;
    let idx = 0, tween;

    function travel() {
      const [a, b] = CONNECTIONS[idx % CONNECTIONS.length];
      const pa = positions[a], pb = positions[b];
      if (!pa || !pb) { idx++; travel(); return; }

      const color = STACK[b]?.color ?? "#61DAFB";
      const x1 = (pa.x / 100) * containerW, y1 = (pa.y / 100) * containerH;
      const x2 = (pb.x / 100) * containerW, y2 = (pb.y / 100) * containerH;

      if (dotRef.current) {
        dotRef.current.style.background  = color;
        dotRef.current.style.boxShadow   = `0 0 8px ${color}, 0 0 20px ${color}88`;
      }
      gsap.set(dotRef.current, { x: x1, y: y1, opacity: 0 });
      tween = gsap.timeline()
        .to(dotRef.current, { opacity: 1, duration: 0.16 })
        .to(dotRef.current, { x: x2, y: y2, duration: 0.8 + Math.random() * 0.6, ease: "power1.inOut" })
        .to(dotRef.current, { opacity: 0, duration: 0.16 }, "-=0.16")
        .call(() => { idx = (idx + 1) % CONNECTIONS.length; setTimeout(travel, 150 + Math.random() * 280); });
    }

    const t = setTimeout(travel, 1400);
    return () => { clearTimeout(t); tween?.kill(); };
  }, [positions, containerW, containerH]);

  return (
    <div ref={dotRef} aria-hidden="true" style={{
      position: "absolute", top: 0, left: 0,
      width: "7px", height: "7px", borderRadius: "50%",
      background: "#61DAFB",
      boxShadow: "0 0 8px #61DAFB, 0 0 20px #61DAFB88",
      pointerEvents: "none", zIndex: 5, opacity: 0,
      transform: "translate(-50%,-50%)",
    }}/>
  );
}

/* ─── TechNode — with scan-line sweep + 12-o'clock dot ───────────────────── */
const TechNode = forwardRef(function TechNode(
  { item, pos, isActive, onEnter, onLeave, index }, ref
) {
  const nodeSize   = 76;
  const labelAbove = pos.y > 58;
  const labelLeft  = pos.x > 70;

  return (
    <div
      ref={ref}
      onMouseEnter={() => onEnter(index)}
      onMouseLeave={() => onLeave()}
      style={{
        position: "absolute",
        left: `${pos.x}%`, top: `${pos.y}%`,
        transform: "translate(-50%,-50%)",
        padding: "22px", margin: "-22px",
        zIndex: 3, cursor: "default", userSelect: "none",
      }}
    >
      {/* Pulse ring */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: nodeSize + 30, height: nodeSize + 30,
        marginLeft: -(nodeSize + 30) / 2, marginTop: -(nodeSize + 30) / 2,
        borderRadius: "50%",
        border: `1px solid ${item.color}`,
        opacity: isActive ? 0.35 : 0,
        transform: isActive ? "scale(1)" : "scale(0.85)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
        pointerEvents: "none",
        animation: isActive ? "ping 1.8s ease-out infinite" : "none",
      }}/>

      {/* Orbiting dot at 12-o'clock */}
      {isActive && (
        <div aria-hidden="true" style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: "5px", height: "5px",
          marginLeft: "-2.5px",
          marginTop: -(nodeSize / 2 + 17) + "px",
          borderRadius: "50%",
          background: item.color,
          boxShadow: `0 0 8px ${item.color}, 0 0 16px ${item.color}88`,
          pointerEvents: "none",
          animation: "orbitdot 2.2s linear infinite",
          transformOrigin: `2.5px ${nodeSize / 2 + 17}px`,
        }}/>
      )}

      {/* Node circle */}
      <div style={{
        position: "relative",
        width: nodeSize, height: nodeSize, borderRadius: "50%",
        background: isActive
          ? `radial-gradient(circle at 35% 35%, ${item.color}28, ${item.color}08)`
          : "rgba(10,10,14,0.92)",
        border: `1px solid ${isActive ? item.color + "99" : "rgba(255,255,255,0.07)"}`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "3px",
        boxShadow: isActive
          ? `0 0 32px ${item.color}33, 0 0 64px ${item.color}11, inset 0 0 20px ${item.color}0a`
          : "none",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
      }}>
        {/* scan lines */}
        {isActive && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.013) 3px,rgba(255,255,255,0.013) 4px)",
            pointerEvents: "none",
          }}/>
        )}
        {/* shimmer sweep */}
        {isActive && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: `linear-gradient(115deg,transparent 30%,${item.color}1a 50%,transparent 70%)`,
            animation: "sweep 2.2s ease-in-out infinite",
            pointerEvents: "none",
          }}/>
        )}

        <span style={{
          fontSize: "18px", fontWeight: 900, letterSpacing: "-0.04em",
          color: isActive ? item.color : "rgba(255,255,255,0.65)",
          fontFamily: "monospace", lineHeight: 1,
          transition: "color 0.3s", position: "relative",
        }}>{item.abbr}</span>
        <span style={{
          fontSize: "6px", letterSpacing: "0.18em", textTransform: "uppercase",
          color: isActive ? item.color + "cc" : "rgba(255,255,255,0.18)",
          transition: "color 0.3s", position: "relative",
        }}>{item.category}</span>
      </div>

      {/* Smart label */}
      <div style={{
        position: "absolute",
        ...(labelAbove
          ? { bottom: "calc(100% - 10px)", top: "auto" }
          : { top: "calc(100% - 10px)", bottom: "auto" }),
        ...(labelLeft
          ? { right: "0", left: "auto", transform: "none" }
          : { left: "50%", right: "auto", transform: "translateX(-50%)" }),
        whiteSpace: "nowrap",
        textAlign: labelLeft ? "right" : "center",
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.25s ease",
        pointerEvents: "none", zIndex: 10,
      }}>
        <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: item.color }}>{item.name}</div>
        <div style={{ fontSize: "7px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.28)", marginTop: "2px" }}>{item.exp}</div>
      </div>
    </div>
  );
});

/* ─── Active panel (left side info) ──────────────────────────────────────── */
function ActivePanel({ activeIndex }) {
  const item     = activeIndex >= 0 ? STACK[activeIndex] : null;
  const innerRef = useRef(null);

  useEffect(() => {
    if (!innerRef.current) return;
    gsap.fromTo(innerRef.current,
      { opacity: 0, x: -8 },
      { opacity: item ? 1 : 0, x: 0, duration: 0.3, ease: "power2.out" }
    );
  }, [activeIndex, item]);

  return (
    <div style={{
      height: "60px",
      borderLeft: `2px solid ${item ? item.color + "60" : "rgba(44,85,132,0.18)"}`,
      paddingLeft: "16px",
      position: "relative",
      transition: "border-color 0.35s",
    }}>
      {item && (
        <div style={{
          position: "absolute", top: -1, left: -4,
          width: "6px", height: "6px", borderRadius: "50%",
          background: item.color,
          boxShadow: `0 0 9px ${item.color}`,
        }}/>
      )}
      <div ref={innerRef} style={{ opacity: 0 }}>
        {item && (
          <>
            <div style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.3em",
              textTransform: "uppercase", color: item.color, marginBottom: "5px",
            }}>{item.name}</div>
            <div style={{
              fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.22)",
            }}>{item.category} · {item.exp}</div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Mobile radial dial ──────────────────────────────────────────────────── */
function MobileLayout({ hasEntered, labelRef, headingRef }) {
  const [active, setActive] = useState(0);
  const nodeRefs  = useRef([]);
  const lineRef   = useRef(null);
  const centerRef = useRef(null);
  const dialRef   = useRef(null);

  const DIAL_SIZE = Math.min(window.innerWidth * 0.82, 310);
  const CENTER_R  = DIAL_SIZE * 0.5;
  const ORBIT_R   = DIAL_SIZE * 0.38;
  const NODE_SIZE = 52;

  const angles = STACK.map((_, i) => (i / STACK.length) * Math.PI * 2 - Math.PI / 2);
  const nodePos = angles.map(a => ({
    x: CENTER_R + Math.cos(a) * ORBIT_R,
    y: CENTER_R + Math.sin(a) * ORBIT_R,
  }));

  useEffect(() => {
    if (!hasEntered) return;
    gsap.fromTo(dialRef.current,
      { opacity: 0, scale: 0.7, rotation: -20 },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.9, ease: "back.out(1.4)", delay: 0.2 }
    );
    nodeRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)", delay: 0.35 + i * 0.06 }
      );
    });
    gsap.fromTo(centerRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.8)", delay: 0.5 }
    );
  }, [hasEntered]);

  useEffect(() => {
    if (!lineRef.current) return;
    const pos = nodePos[active];
    gsap.to(lineRef.current, {
      attr: { x2: pos.x, y2: pos.y },
      duration: 0.35, ease: "power2.out",
    });
    gsap.fromTo(lineRef.current,
      { attr: { strokeDashoffset: 200 } },
      { attr: { strokeDashoffset: 0 }, duration: 0.45, ease: "power2.out" }
    );
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  const item = STACK[active];

  return (
    <div style={{
      position: "relative", zIndex: 1,
      display: "flex", flexDirection: "column",
      alignItems: "center", width: "100%",
      padding: "0 16px", boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "center", gap: "8px", marginBottom: "8px",
        }}>
          <p ref={labelRef} style={{ margin: 0, fontSize: "8px", letterSpacing: "0.45em", textTransform: "uppercase", color: "#2C5584"}}>
            Tools I build with
          </p>
        </div>
        <h2 ref={headingRef} style={{
          margin: 0, fontSize: "clamp(1.6rem,7vw,2.4rem)",
          fontWeight: 900, letterSpacing: "-0.04em",
          color: "rgba(255,255,255,0.92)", lineHeight: 1,
        }}>The <span style={{ color: "#2C5584" }}>Stack.</span></h2>
      </div>

      {/* Radial dial */}
      <div ref={dialRef} style={{
        position: "relative",
        width: DIAL_SIZE, height: DIAL_SIZE,
        flexShrink: 0, opacity: 0,
      }}>
        {/* SVG rings + connecting line */}
        <svg style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          overflow: "visible", pointerEvents: "none",
        }}>
          <circle cx={CENTER_R} cy={CENTER_R} r={ORBIT_R}
            fill="none" stroke="rgba(44,85,132,0.12)"
            strokeWidth="1" strokeDasharray="3 5" />
          <circle cx={CENTER_R} cy={CENTER_R} r={ORBIT_R * 0.55}
            fill="none" stroke="rgba(44,85,132,0.06)" strokeWidth="1" />
          <line
            ref={lineRef}
            x1={CENTER_R} y1={CENTER_R}
            x2={nodePos[active].x} y2={nodePos[active].y}
            stroke={item.color} strokeWidth="1" opacity="0.45"
            strokeDasharray="200" strokeDashoffset="0"
            style={{ filter: `drop-shadow(0 0 4px ${item.color}88)` }}
          />
          <circle
            cx={nodePos[active].x} cy={nodePos[active].y}
            r="2.5" fill={item.color} opacity="0.7"
            style={{ filter: `drop-shadow(0 0 5px ${item.color})` }}
          />
        </svg>

        {/* Center display */}
        <div ref={centerRef} style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%,-50%)",
          width: DIAL_SIZE * 0.32, height: DIAL_SIZE * 0.32,
          borderRadius: "50%",
          border: `1px solid ${item.color}44`,
          background: `radial-gradient(circle at 40% 40%,${item.color}18,rgba(8,8,8,0.95))`,
          boxShadow: `0 0 28px ${item.color}22, inset 0 0 20px ${item.color}0a`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "3px",
          transition: "border-color 0.35s, background 0.35s, box-shadow 0.35s",
          zIndex: 2, opacity: 0,
        }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.012) 3px,rgba(255,255,255,0.012) 4px)",
            pointerEvents: "none",
          }}/>
          <span style={{
            fontSize: "20px", fontWeight: 900, letterSpacing: "-0.04em",
            fontFamily: "monospace", color: item.color, lineHeight: 1,
            transition: "color 0.3s", position: "relative",
          }}>{item.abbr}</span>
          <span style={{
            fontSize: "5.5px", letterSpacing: "0.2em", textTransform: "uppercase",
            color: item.color + "99", position: "relative", transition: "color 0.3s",
          }}>{item.category}</span>
          <span style={{
            fontSize: "6px", letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.2)", position: "relative",
          }}>{item.exp}</span>
        </div>

        {/* Orbit nodes */}
        {STACK.map((tech, i) => {
          const isAct = i === active;
          const pos   = nodePos[i];
          return (
            <div
              key={tech.name}
              ref={el => (nodeRefs.current[i] = el)}
              onTouchStart={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              style={{
                position: "absolute",
                left: pos.x, top: pos.y,
                width: NODE_SIZE, height: NODE_SIZE,
                marginLeft: -NODE_SIZE / 2, marginTop: -NODE_SIZE / 2,
                borderRadius: "50%",
                border: `1px solid ${isAct ? tech.color + "88" : "rgba(255,255,255,0.07)"}`,
                background: isAct
                  ? `radial-gradient(circle at 35% 35%,${tech.color}28,${tech.color}06)`
                  : "rgba(10,10,14,0.88)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "2px",
                boxShadow: isAct ? `0 0 22px ${tech.color}44, 0 0 44px ${tech.color}18` : "none",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                cursor: "default", zIndex: 3, opacity: 0,
              }}
            >
              {isAct && (
                <div style={{
                  position: "absolute",
                  width: NODE_SIZE + 18, height: NODE_SIZE + 18,
                  left: -(18 / 2), top: -(18 / 2),
                  borderRadius: "50%",
                  border: `1px solid ${tech.color}55`,
                  animation: "ping 1.8s ease-out infinite",
                  pointerEvents: "none",
                }}/>
              )}
              <span style={{
                fontSize: "13px", fontWeight: 900, letterSpacing: "-0.04em",
                fontFamily: "monospace",
                color: isAct ? tech.color : "rgba(255,255,255,0.55)",
                transition: "color 0.3s", lineHeight: 1,
              }}>{tech.abbr}</span>
              <span style={{
                fontSize: "5px", letterSpacing: "0.15em", textTransform: "uppercase",
                color: isAct ? tech.color + "bb" : "rgba(255,255,255,0.16)",
                transition: "color 0.3s",
              }}>{tech.category}</span>
            </div>
          );
        })}
      </div>

      {/* Active tech name strip */}
      <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "16px", height: "1px", background: `linear-gradient(90deg,transparent,${item.color}66)` }}/>
        <span style={{
          fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase",
          color: item.color, fontWeight: 700, transition: "color 0.3s",
        }}>{item.name}</span>
        <div style={{ width: "1px", height: "10px", background: "rgba(255,255,255,0.1)" }}/>
        <span style={{ fontSize: "8px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)" }}>{item.exp}</span>
        <div style={{ width: "16px", height: "1px", background: `linear-gradient(90deg,${item.color}66,transparent)` }}/>
      </div>

      {/* Count */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
        <div style={{ width: "16px", height: "1px", background: "rgba(44,85,132,0.3)" }}/>
        <span style={{ fontSize: "7px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.13)" }}>
          {STACK.length} technologies
        </span>
        <div style={{ width: "16px", height: "1px", background: "rgba(44,85,132,0.3)" }}/>
      </div>
    </div>
  );
}


/* ─── Main ────────────────────────────────────────────────────────────────── */
const TechStack = forwardRef(function TechStack({ isMobile }, ref) {
  const bp       = useBreakpoint();
  const isTablet = bp === "tablet";

  const labelRef     = useRef(null);
  const headingRef   = useRef(null);
  const nodeRefs     = useRef([]);
  const containerRef = useRef(null);
  const bgNumRef     = useRef(null);
  const hasEntered   = useRef(false);

  const [activeIndex,   setActiveIndex]   = useState(-1);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 500 });
  const [entered,       setEntered]       = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries)
        setContainerSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    gsap.set(labelRef.current,   { opacity: 0, y: -20 });
    gsap.set(headingRef.current, { opacity: 0, y: 20  });
    bgNumRef.current && gsap.set(bgNumRef.current, { opacity: 0 });
    nodeRefs.current.forEach(el => el && gsap.set(el, { opacity: 0, scale: 0, rotation: -15 }));
  }, []);

  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    const obs = new MutationObserver(() => {
      const visible = el.style.visibility !== "hidden" && parseFloat(el.style.opacity || "0") > 0.5;
      if (visible && !hasEntered.current) {
        hasEntered.current = true;
        setEntered(true);
        playEntrance();
      }
      if (!visible) hasEntered.current = false;
    });
    obs.observe(el, { attributes: true, attributeFilter: ["style"] });
    return () => obs.disconnect();
  }, [ref]);

  function playEntrance() {
    const tl = gsap.timeline();
    bgNumRef.current && tl.to(bgNumRef.current, { opacity: 1, duration: 1.2, ease: "power2.out" }, 0);
    tl.to(labelRef.current,   { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.1);
    tl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.2);
    tl.to(nodeRefs.current, {
      opacity: 1, scale: 1, rotation: 0,
      duration: 0.65, ease: "back.out(2)",
      stagger: { each: 0.07, from: "center" },
    }, 0.35);
  }

  return (
    <section ref={ref} style={{
      position: "fixed", inset: 0,
      width: "100%", height: "100vh",
      background: "#080808", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <style>{`
        @keyframes ping {
          0%   { transform: scale(1);   opacity: 0.35; }
          70%  { transform: scale(1.7); opacity: 0; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes orbitdot {
          from { transform: rotate(0deg)   translateY(-55px) rotate(0deg); }
          to   { transform: rotate(360deg) translateY(-55px) rotate(-360deg); }
        }
        @keyframes sweep {
          0%   { transform: translateX(-130%); }
          60%  { transform: translateX(230%); }
          100% { transform: translateX(230%); }
        }
      `}</style>

      <ParticleCanvas />

      {/* Vignette */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center,transparent 38%,rgba(0,0,0,0.52) 100%)",
      }}/>

      {/* Ghost number */}
      <div ref={bgNumRef} aria-hidden="true" style={{
        position: "absolute", right: isMobile ? "-5%" : "-2%", bottom: "-8%",
        fontSize: isMobile ? "38vw" : "28vw", fontWeight: 900, fontFamily: "monospace",
        color: "transparent", WebkitTextStroke: "1px rgba(44,85,132,0.07)",
        letterSpacing: "-0.08em", lineHeight: 1,
        pointerEvents: "none", userSelect: "none", zIndex: 0,
      }}>03</div>

      {/* Corner brackets */}
      <Corner top="18px"    left="18px"  />
      <Corner top="18px"    right="18px" />
      <Corner bottom="18px" left="18px"  />
      <Corner bottom="18px" right="18px" />

      {/* ── MOBILE ── */}
      {isMobile && (
        <MobileLayout hasEntered={entered} labelRef={labelRef} headingRef={headingRef} />
      )}

      {/* ── DESKTOP / TABLET ── */}
      {!isMobile && (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", position: "relative" }}>

          {/* Left panel */}
          <div style={{
            position: "absolute",
            left: isTablet ? "5%" : "6%",
            top: "50%", transform: "translateY(-50%)",
            zIndex: 4, maxWidth: "230px",
            display: "flex", flexDirection: "column",
          }}>
            {/* Index label matching About style */}


            <p ref={labelRef} style={{
              fontSize: "8px", letterSpacing: "0.55em", textTransform: "uppercase",
              color: "#2C5584", margin: "0 0 14px",
            }}>Tools I build with</p>

            <h2 ref={headingRef} style={{
              fontSize: isTablet ? "clamp(1.8rem,4vw,3rem)" : "clamp(2rem,3.5vw,3.8rem)",
              fontWeight: 900, letterSpacing: "-0.04em",
              color: "rgba(255,255,255,0.92)", margin: "0 0 32px", lineHeight: 1.0,
            }}>
              The<br/><span style={{ color: "#2C5584" }}>Stack.</span>
            </h2>

            {/* Active tech info */}
            <ActivePanel activeIndex={activeIndex} />

            {/* Count */}
            <div style={{ marginTop: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "24px", height: "1px", background: "rgba(44,85,132,0.4)" }}/>
              <span style={{ fontSize: "8px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.14)" }}>
                {STACK.length} technologies
              </span>
            </div>
          </div>

          {/* Constellation */}
          <div ref={containerRef} style={{
            position: "absolute",
            left: isTablet ? "28%" : "26%",
            right: 0, top: 0, bottom: 0,
          }}>
            <TraceLines
              positions={DESKTOP_POS}
              activeIndex={activeIndex}
              containerW={containerSize.w}
              containerH={containerSize.h}
              entered={entered}
            />
            {STACK.map((item, i) => (
              <TechNode
                key={item.name}
                ref={el => (nodeRefs.current[i] = el)}
                item={item}
                pos={DESKTOP_POS[i]}
                isActive={activeIndex === i}
                onEnter={setActiveIndex}
                onLeave={() => setActiveIndex(-1)}
                index={i}
              />
            ))}
            <SignalDot
              positions={DESKTOP_POS}
              containerW={containerSize.w}
              containerH={containerSize.h}
            />
          </div>
        </div>
      )}
    </section>
  );
});

export default TechStack;