import { useRef, useEffect, forwardRef, useState, useCallback } from "react";
import gsap from "gsap";

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

const STACK = [
  { name: "React",      abbr: "Re",  color: "#61DAFB", category: "UI",       exp: "2yr"  },
  { name: "TypeScript", abbr: "TS",  color: "#3178C6", category: "Language", exp: "1yr"  },
  { name: "JavaScript", abbr: "JS",  color: "#F7DF1E", category: "Language", exp: "2yr"  },
  { name: "GSAP",       abbr: "GS",  color: "#88CE02", category: "Motion",   exp: "1yr"  },
  { name: "Vite",       abbr: "Vt",  color: "#646CFF", category: "Build",    exp: "1yr"  },
  { name: "Tailwind",   abbr: "Tw",  color: "#38BDF8", category: "CSS",      exp: "2yr"  },
  { name: "Supabase",   abbr: "Sb",  color: "#3ECF8E", category: "Backend",  exp: "6mo"  },
  { name: "HTML",       abbr: "HT",  color: "#E44D26", category: "Markup",   exp: "3yr"  },
  { name: "CSS",        abbr: "CS",  color: "#264DE4", category: "Style",    exp: "3yr"  },
];

const DESKTOP_POS = [
  { x: 52,  y: 18 },  // 0 React
  { x: 72,  y: 38 },  // 1 TypeScript
  { x: 30,  y: 32 },  // 2 JavaScript
  { x: 58,  y: 55 },  // 3 GSAP
  { x: 20,  y: 60 },  // 4 Vite
  { x: 78,  y: 65 },  // 5 Tailwind
  { x: 44,  y: 76 },  // 6 Supabase
  { x: 14,  y: 38 },  // 7 HTML
  { x: 62,  y: 82 },  // 8 CSS
];

const CONNECTIONS = [
  [0, 2], [0, 1], [0, 3],
  [1, 3], [1, 5],
  [2, 4], [2, 7],
  [3, 4], [3, 6], [3, 5],
  [4, 7],
  [5, 8],
  [6, 8],
];

function TraceLines({ positions, activeIndex, containerW, containerH }) {
  const lineRefs = useRef([]);

  useEffect(() => {
    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      const [a, b] = CONNECTIONS[i];
      const isActive = activeIndex === a || activeIndex === b;
      gsap.to(el, {
        opacity: isActive ? 0.55 : 0.12,
        strokeWidth: isActive ? 1.5 : 0.8,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  }, [activeIndex]);

  return (
    <svg style={{
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 1,
      overflow: "visible",
    }}>
      <defs>
        <filter id="glow-trace">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {CONNECTIONS.map(([a, b], i) => {
        const pa = positions[a];
        const pb = positions[b];
        if (!pa || !pb) return null;
        const x1 = (pa.x / 100) * containerW;
        const y1 = (pa.y / 100) * containerH;
        const x2 = (pb.x / 100) * containerW;
        const y2 = (pb.y / 100) * containerH;
        const mx = (x1 + x2) / 2;
        return (
          <polyline
            key={i}
            ref={el => (lineRefs.current[i] = el)}
            points={`${x1},${y1} ${mx},${y1} ${mx},${y2} ${x2},${y2}`}
            stroke="rgba(44,100,200,0.8)"
            strokeWidth="0.8"
            fill="none"
            opacity="0.12"
            strokeDasharray="4 3"
            filter="url(#glow-trace)"
          />
        );
      })}
    </svg>
  );
}

// ── Single tech node ──────────────────────────────────────────────────────────
const TechNode = forwardRef(function TechNode(
  { item, pos, isActive, onEnter, onLeave, index },
  ref
) {
  const nodeSize = 76;

  // Smart label direction: above for bottom-area nodes, right-aligned for right-edge nodes
  const labelAbove = pos.y > 58;
  const labelLeft  = pos.x > 70;

  return (
    <div
      ref={ref}
      onMouseEnter={() => onEnter(index)}
      onMouseLeave={() => onLeave()}
      style={{
        position: "absolute",
        left: `${pos.x}%`,
        top:  `${pos.y}%`,
        transform: "translate(-50%, -50%)",
        // Large transparent padding = enlarged mouse hit area.
        // This prevents mouseleave firing when the cursor moves toward the label.
        padding: "22px",
        margin: "-22px",
        zIndex: 3,
        cursor: "default",
        userSelect: "none",
      }}
    >
      {/* Pulse ring — centered inside the padded wrapper */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        width: nodeSize + 28,
        height: nodeSize + 28,
        marginLeft: -(nodeSize + 28) / 2,
        marginTop:  -(nodeSize + 28) / 2,
        borderRadius: "50%",
        border: `1px solid ${item.color}`,
        opacity: isActive ? 0.35 : 0,
        transform: isActive ? "scale(1)" : "scale(0.85)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
        pointerEvents: "none",
        animation: isActive ? "ping 1.8s ease-out infinite" : "none",
      }}/>

      {/* Node circle — also centered */}
      <div style={{
        position: "relative",
        width: nodeSize,
        height: nodeSize,
        borderRadius: "50%",
        background: isActive
          ? `radial-gradient(circle at 35% 35%, ${item.color}28, ${item.color}08)`
          : "rgba(12,12,16,0.9)",
        border: `1px solid ${isActive ? item.color + "99" : "rgba(255,255,255,0.08)"}`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "3px",
        boxShadow: isActive
          ? `0 0 28px ${item.color}33, inset 0 0 20px ${item.color}0a`
          : "none",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
      }}>
        {isActive && (
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px)",
            pointerEvents: "none", borderRadius: "50%",
          }}/>
        )}
        <span style={{
          fontSize: "18px", fontWeight: 900, letterSpacing: "-0.04em",
          color: isActive ? item.color : "rgba(255,255,255,0.7)",
          fontFamily: "monospace", lineHeight: 1,
          transition: "color 0.3s", position: "relative",
        }}>{item.abbr}</span>
        <span style={{
          fontSize: "6px", letterSpacing: "0.18em", textTransform: "uppercase",
          color: isActive ? item.color + "cc" : "rgba(255,255,255,0.2)",
          transition: "color 0.3s", position: "relative",
        }}>{item.category}</span>
      </div>

      {/* Label — smart position so it never clips */}
      <div style={{
        position: "absolute",
        // Vertical placement
        ...(labelAbove
          ? { bottom: "calc(100% - 10px)", top:    "auto"             }
          : { top:    "calc(100% - 10px)", bottom: "auto"             }),
        // Horizontal placement
        ...(labelLeft
          ? { right: "0",   left: "auto", transform: "none"           }
          : { left:  "50%", right: "auto", transform: "translateX(-50%)" }),
        whiteSpace: "nowrap",
        textAlign: labelLeft ? "right" : "center",
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.25s ease",
        pointerEvents: "none",
        zIndex: 10,
      }}>
        <div style={{
          fontSize: "9px", fontWeight: 700,
          letterSpacing: "0.28em", textTransform: "uppercase",
          color: item.color,
        }}>{item.name}</div>
        <div style={{
          fontSize: "7px", letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.3)", marginTop: "2px",
        }}>{item.exp}</div>
      </div>
    </div>
  );
});

// ── Mobile marquee ────────────────────────────────────────────────────────────
function MobileLayout({ hasEntered }) {
  const row1 = STACK.slice(0, 5);
  const row2 = STACK.slice(4);

  const MarqueeRow = ({ items, reverse, delay }) => {
    const trackRef = useRef(null);
    useEffect(() => {
      if (!hasEntered || !trackRef.current) return;
      const total = items.length;
      gsap.to(trackRef.current, {
        x: reverse ? `+=${total * 110}` : `-=${total * 110}`,
        duration: total * 3.5,
        ease: "none",
        repeat: -1,
        delay,
        modifiers: {
          x: gsap.utils.unitize(x => {
            const wrap = total * 110;
            return ((parseFloat(x) % wrap) + wrap) % wrap * (reverse ? 1 : -1);
          }),
        },
      });
    }, [hasEntered, items, reverse, delay]);

    const doubled = [...items, ...items, ...items];
    return (
      <div style={{
        overflow: "hidden", width: "100%",
        maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
      }}>
        <div ref={trackRef} style={{ display: "flex", gap: "16px", width: "max-content" }}>
          {doubled.map((item, i) => (
            <div key={i} style={{
              flexShrink: 0, width: "94px", height: "94px", borderRadius: "50%",
              border: `1px solid ${item.color}44`,
              background: `radial-gradient(circle at 35% 35%, ${item.color}12, transparent)`,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "4px",
            }}>
              <span style={{ fontSize: "17px", fontWeight: 900, color: item.color, fontFamily: "monospace", letterSpacing: "-0.04em" }}>{item.abbr}</span>
              <span style={{ fontSize: "6px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>{item.category}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
      <MarqueeRow items={row1} reverse={false} delay={0} />
      <MarqueeRow items={row2} reverse={true}  delay={0.5} />
    </div>
  );
}

// ── Signal dot ────────────────────────────────────────────────────────────────
function SignalDot({ positions, containerW, containerH }) {
  const dotRef = useRef(null);

  useEffect(() => {
    if (!dotRef.current || !positions.length) return;
    let connIndex = 0;
    let tween;

    function travel() {
      const [a, b] = CONNECTIONS[connIndex % CONNECTIONS.length];
      const pa = positions[a];
      const pb = positions[b];
      if (!pa || !pb) { connIndex++; travel(); return; }

      const x1 = (pa.x / 100) * containerW;
      const y1 = (pa.y / 100) * containerH;
      const x2 = (pb.x / 100) * containerW;
      const y2 = (pb.y / 100) * containerH;

      gsap.set(dotRef.current, { x: x1, y: y1, opacity: 0 });
      tween = gsap.timeline()
        .to(dotRef.current, { opacity: 0.9, duration: 0.15 })
        .to(dotRef.current, { x: x2, y: y2, duration: 0.9 + Math.random() * 0.6, ease: "power1.inOut" })
        .to(dotRef.current, { opacity: 0, duration: 0.15 }, "-=0.15")
        .call(() => {
          connIndex = (connIndex + 1) % CONNECTIONS.length;
          setTimeout(travel, 180 + Math.random() * 300);
        });
    }

    const timeout = setTimeout(travel, 1200);
    return () => { clearTimeout(timeout); tween?.kill(); };
  }, [positions, containerW, containerH]);

  return (
    <div ref={dotRef} aria-hidden="true" style={{
      position: "absolute", top: 0, left: 0,
      width: "6px", height: "6px", borderRadius: "50%",
      background: "#61DAFB",
      boxShadow: "0 0 8px #61DAFB, 0 0 16px #61DAFB88",
      pointerEvents: "none", zIndex: 2, opacity: 0,
      transform: "translate(-50%, -50%)",
    }}/>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
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
    gsap.set(bgNumRef.current,   { opacity: 0 });
    nodeRefs.current.forEach(el => {
      if (el) gsap.set(el, { opacity: 0, scale: 0, rotation: -15 });
    });
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
    tl.to(bgNumRef.current,   { opacity: 1, duration: 1.2, ease: "power2.out" }, 0);
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
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      <div ref={bgNumRef} aria-hidden="true" style={{
        position: "absolute", right: isMobile ? "-5%" : "-2%", bottom: "-8%",
        fontSize: isMobile ? "38vw" : "28vw", fontWeight: 900, fontFamily: "monospace",
        color: "transparent", WebkitTextStroke: "1px rgba(44,85,132,0.07)",
        letterSpacing: "-0.08em", lineHeight: 1,
        pointerEvents: "none", userSelect: "none", zIndex: 0,
      }}>03</div>

      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(44,85,132,0.028) 1px, transparent 1px),
          linear-gradient(90deg, rgba(44,85,132,0.028) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}/>

      {[[0,0],[0,1],[1,0],[1,1]].map(([r,c], i) => (
        <div key={i} aria-hidden="true" style={{
          position: "absolute",
          top: r===0 ? "32px" : "auto", bottom: r===1 ? "32px" : "auto",
          left: c===0 ? "32px" : "auto", right: c===1 ? "32px" : "auto",
          width: "4px", height: "4px", borderRadius: "50%",
          background: "rgba(44,85,132,0.3)", pointerEvents: "none", zIndex: 1,
        }}/>
      ))}

      {/* MOBILE */}
      {isMobile && (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
          <div style={{ textAlign: "center", marginBottom: "40px", padding: "0 24px" }}>
            <p ref={labelRef} style={{
              fontSize: "8px", letterSpacing: "0.55em", textTransform: "uppercase",
              color: "#2C5584", margin: "0 0 12px",
            }}>Tools I build with</p>
            <h2 ref={headingRef} style={{
              fontSize: "clamp(1.8rem,8vw,2.8rem)", fontWeight: 900,
              letterSpacing: "-0.04em", color: "rgba(255,255,255,0.92)",
              margin: 0, lineHeight: 1.0,
            }}>The <span style={{ color: "#2C5584" }}>Stack.</span></h2>
          </div>
          <MobileLayout hasEntered={entered} />
        </div>
      )}

      {/* DESKTOP / TABLET */}
      {!isMobile && (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", position: "relative" }}>
          {/* Left panel */}
          <div style={{
            position: "absolute", left: isTablet ? "5%" : "6%",
            top: "50%", transform: "translateY(-50%)",
            zIndex: 4, maxWidth: "220px",
          }}>
            <p ref={labelRef} style={{
              fontSize: "8px", letterSpacing: "0.55em", textTransform: "uppercase",
              color: "#2C5584", margin: "0 0 16px",
            }}>Tools I build with</p>
            <h2 ref={headingRef} style={{
              fontSize: isTablet ? "clamp(1.8rem,4vw,3rem)" : "clamp(2rem,3.5vw,3.8rem)",
              fontWeight: 900, letterSpacing: "-0.04em",
              color: "rgba(255,255,255,0.92)", margin: "0 0 28px", lineHeight: 1.0,
            }}>
              The<br/><span style={{ color: "#2C5584" }}>Stack.</span>
            </h2>

            <div style={{
              height: "60px", borderLeft: "1px solid rgba(44,85,132,0.3)",
              paddingLeft: "16px",
              opacity: activeIndex >= 0 ? 1 : 0, transition: "opacity 0.3s ease",
            }}>
              {activeIndex >= 0 && (
                <>
                  <div style={{
                    fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase",
                    color: STACK[activeIndex]?.color, marginBottom: "4px",
                  }}>{STACK[activeIndex]?.name}</div>
                  <div style={{
                    fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.25)",
                  }}>{STACK[activeIndex]?.category} · {STACK[activeIndex]?.exp}</div>
                </>
              )}
            </div>

            <div style={{ marginTop: "32px", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "28px", height: "1px", background: "rgba(44,85,132,0.4)" }}/>
              <span style={{
                fontSize: "8px", letterSpacing: "0.3em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.15)",
              }}>{STACK.length} technologies</span>
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