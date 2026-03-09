import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { scrollManager } from "../../utils/ScrollManager";

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

// ── SVG Icons — each is a self-contained component ────────────────────────
// viewBox stays fixed at "0 0 60 60". width/height are passed as props
// so we can scale them responsively without distortion.
const HTMLIcon     = ({ size }) => (<svg viewBox="0 0 60 60" width={size} height={size} fill="none"><path d="M8 4l5 46 17 5 17-5 5-46z" stroke="#E44D26" strokeWidth="2" strokeLinejoin="round"/><path d="M14 14h32M15 24h30M20 34l10 4 10-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>);
const CSSIcon      = ({ size }) => (<svg viewBox="0 0 60 60" width={size} height={size} fill="none"><path d="M8 4l5 46 17 5 17-5 5-46z" stroke="#264DE4" strokeWidth="2" strokeLinejoin="round"/><path d="M14 14h32M15 24h30" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/><path d="M20 34c0 4 4 7 10 7s10-3 10-7" stroke="#264DE4" strokeWidth="2" strokeLinecap="round"/></svg>);
const JSIcon       = ({ size }) => (<svg viewBox="0 0 60 60" width={size} height={size} fill="none"><rect x="4" y="4" width="52" height="52" rx="4" stroke="#F7DF1E" strokeWidth="2"/><path d="M22 44V28" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/><path d="M22 44c0 4-3 8-8 8" stroke="#F7DF1E" strokeWidth="2" strokeLinecap="round"/><path d="M38 28v10c0 4-2 6-5 6s-5-2-5-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>);
const ReactIcon    = ({ size }) => (<svg viewBox="0 0 60 60" width={size} height={size} fill="none"><circle cx="30" cy="30" r="5" stroke="#61DAFB" strokeWidth="2.5"/><ellipse cx="30" cy="30" rx="24" ry="9" stroke="#61DAFB" strokeWidth="1.8"/><ellipse cx="30" cy="30" rx="24" ry="9" stroke="#61DAFB" strokeWidth="1.8" transform="rotate(60 30 30)"/><ellipse cx="30" cy="30" rx="24" ry="9" stroke="#61DAFB" strokeWidth="1.8" transform="rotate(120 30 30)"/></svg>);
const TailwindIcon = ({ size }) => (<svg viewBox="0 0 60 60" width={size} height={size} fill="none"><path d="M15 22c2-8 7-12 15-12 12 0 14 9 20 10.5C54 21.5 58 19.5 60 14 58 23 53 27 45 27c-12 0-13.5-9-19.5-10.5C22 15.5 18 17.5 15 22z" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round"/><path d="M0 37c2-8 7-12 15-12 12 0 14 9 20 10.5C39 36.5 43 34.5 45 29 43 38 38 42 30 42c-12 0-13.5-9-19.5-10.5C7 30.5 3 32.5 0 37z" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round"/></svg>);
const TSIcon       = ({ size }) => (<svg viewBox="0 0 60 60" width={size} height={size} fill="none"><rect x="4" y="4" width="52" height="52" rx="4" stroke="#3178C6" strokeWidth="2"/><path d="M12 26h20M22 26v20" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/><path d="M36 36c0 4 3 8 8 8s8-4 8-8-3-6-8-6-8-2-8-6 3-8 8-8 8 4 8 8" stroke="#3178C6" strokeWidth="2" strokeLinecap="round"/></svg>);
const SupabaseIcon = ({ size }) => (<svg viewBox="0 0 60 60" width={size} height={size} fill="none"><path d="M33 6L9 35h21v19l21-29H30z" stroke="#3ECF8E" strokeWidth="2" strokeLinejoin="round"/></svg>);

const STACK = [
  { name: "HTML",       Icon: HTMLIcon,     color: "#E44D26" },
  { name: "CSS",        Icon: CSSIcon,      color: "#264DE4" },
  { name: "JavaScript", Icon: JSIcon,       color: "#F7DF1E" },
  { name: "React",      Icon: ReactIcon,    color: "#61DAFB" },
  { name: "Tailwind",   Icon: TailwindIcon, color: "#38BDF8" },
  { name: "TypeScript", Icon: TSIcon,       color: "#3178C6" },
  { name: "Supabase",   Icon: SupabaseIcon, color: "#3ECF8E" },
];

// ── FloatingCard ─────────────────────────────────────────────────────────────
// A single tech icon card with:
// 1. Independent floating animation (random speed, distance, rotation)
// 2. Hover glow + scale (desktop) / tap feedback (mobile via CSS active state)
// 3. Receives iconSize from parent so it scales correctly per breakpoint
function FloatingCard({ item, cardRef, iconSize, cardPadding, isMobile }) {
  const iconRef   = useRef(null);
  const floatAnim = useRef(null);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    // Random values make every card float independently — they never sync up
    const delay    = Math.random() * 2;           // 0–2s start delay
    const duration = 2.5 + Math.random() * 1.5;  // 2.5–4s per cycle
    const yAmt     = 8 + Math.random() * 6;       // 8–14px vertical travel
    const rotAmt   = (Math.random() - 0.5) * 6;  // −3° to +3° rotation

    // gsap yoyo:true means: animate forward then reverse automatically.
    // Combined with repeat:-1 this creates an infinite sine-like oscillation.
    // sine.inOut is the most natural easing for floating — mimics real physics.
    floatAnim.current = gsap.to(iconRef.current, {
      y: yAmt, rotation: rotAmt,
      duration, ease: "sine.inOut",
      repeat: -1, yoyo: true, delay,
    });
    return () => floatAnim.current?.kill();
  }, []);

  const enter = (e) => {
    if (isMobile) return; // no hover on touch screens
    setHov(true);
    e.currentTarget.style.borderColor = item.color + "66"; // brand color at ~40% opacity
    e.currentTarget.style.background  = item.color + "12"; // brand color at ~7% opacity
    // Scale up and pause float while hovered — icon "responds" to touch
    gsap.to(iconRef.current, { scale: 1.2, duration: 0.3, ease: "back.out(2)" });
  };
  const leave = (e) => {
    if (isMobile) return;
    setHov(false);
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
    e.currentTarget.style.background  = "rgba(255,255,255,0.02)";
    // elastic.out = spring-back effect. 1=amplitude, 0.4=oscillation speed.
    gsap.to(iconRef.current, { scale: 1, duration: 0.6, ease: "elastic.out(1,0.4)" });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={enter}
      onMouseLeave={leave}
      style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: isMobile ? "8px" : "12px",
        padding: cardPadding,
        // minWidth ensures cards don't collapse — flex handles actual sizing
        minWidth: isMobile ? "72px" : "96px",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "6px",
        background: "rgba(255,255,255,0.02)",
        cursor: "default",
        transition: "border-color 0.3s, background 0.3s",
        opacity: 0, // GSAP will animate this in
      }}
    >
      {/* icon wrapper — GSAP targets this for floating + scale */}
      <div
        ref={iconRef}
        style={{
          // drop-shadow works on SVG paths (box-shadow would only affect the rect)
          filter: hov ? `drop-shadow(0 0 10px ${item.color}99)` : "none",
          transition: "filter 0.3s",
        }}
      >
        <item.Icon size={iconSize} />
      </div>
      <span style={{
        fontSize: isMobile ? "7px" : "9px",
        letterSpacing: "0.28em", textTransform: "uppercase",
        color: hov ? item.color : "rgba(255,255,255,0.4)",
        transition: "color 0.3s",
      }}>
        {item.name}
      </span>
    </div>
  );
}

export default function TechStack() {
  const bp       = useBreakpoint();
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";

  const sectionRef = useRef(null);
  const labelRef   = useRef(null);
  const headingRef = useRef(null);
  const cardRefs   = useRef([]);

  // Responsive icon/card sizing derived from breakpoint
  const iconSize   = isMobile ? 28 : isTablet ? 34 : 40;
  const cardPadding = isMobile ? "16px 12px 14px" : isTablet ? "20px 16px 16px" : "26px 20px 20px";

  useEffect(() => {
    gsap.set(sectionRef.current, { autoAlpha: 0 });
    gsap.set(labelRef.current,   { opacity: 0, y: 16 });
    gsap.set(headingRef.current, { opacity: 0, y: 28 });
    // Cards start offset downward and shrunk — back.out gives the pop-in feel
    gsap.set(cardRefs.current,   { opacity: 0, y: 40, scale: 0.85 });

    scrollManager.register(sectionRef.current, [
      {
        in: (done) => {
          gsap.timeline({ onComplete: done })
            .to(labelRef.current,
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })
            .to(headingRef.current,
              { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.2")
            .to(cardRefs.current,
              // back.out(1.8) = overshoots scale slightly above 1 before settling
              { opacity: 1, y: 0, scale: 1,
                stagger: 0.07, duration: 0.6, ease: "back.out(1.8)" }, "-=0.2");
        },
        out: (done, reverse) => {
          gsap.timeline({ onComplete: done })
            .to([...cardRefs.current, headingRef.current, labelRef.current],
              { opacity: 0,
                y: reverse ? 40 : -40,      // direction-aware exit
                scale: reverse ? 0.85 : 1,  // shrink back when going backward
                stagger: 0.03, duration: 0.45, ease: "power2.in" });
          if (reverse) gsap.set(cardRefs.current, { scale: 0.85 });
        },
      },
    ]);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "fixed", inset: 0, width: "100%", height: "100vh",
        background: "#080808", overflow: "hidden",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: isMobile ? "0 16px" : "0 40px",
      }}
    >
      <span ref={labelRef} style={{
        fontSize: "9px", letterSpacing: "0.55em", textTransform: "uppercase",
        color: "#2C5584", marginBottom: isMobile ? "14px" : "20px", opacity: 0,
      }}>
        Tech Stack
      </span>

      <h2 ref={headingRef} style={{
        fontSize: isMobile
          ? "clamp(1.2rem, 5vw, 1.8rem)"
          : isTablet
          ? "clamp(1.4rem, 3.5vw, 2.4rem)"
          : "clamp(1.6rem, 3.5vw, 3.2rem)",
        fontWeight: 900, letterSpacing: "-0.03em",
        marginBottom: isMobile ? "28px" : isTablet ? "36px" : "52px",
        color: "rgba(255,255,255,0.9)", opacity: 0, textAlign: "center",
      }}>
        Tools I <span style={{ color: "#2C5584" }}>build</span> with.
      </h2>

      {/* ── Card grid ── */}
      {/* flexWrap:wrap lets cards flow to multiple rows on small screens */}
      {/* maxWidth constrains the grid width so cards don't spread too far */}
      <div style={{
        display: "flex", flexWrap: "wrap",
        justifyContent: "center",
        gap: isMobile ? "10px" : isTablet ? "14px" : "18px",
        maxWidth: isMobile ? "320px" : isTablet ? "560px" : "760px",
      }}>
        {STACK.map((item, i) => (
          <FloatingCard
            key={item.name}
            item={item}
            iconSize={iconSize}
            cardPadding={cardPadding}
            isMobile={isMobile}
            cardRef={(el) => (cardRefs.current[i] = el)}
          />
        ))}
      </div>
    </section>
  );
}