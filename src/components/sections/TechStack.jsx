import { useRef, useEffect } from "react";
import gsap from "gsap";
import { scrollManager } from "../../utils/ScrollManager";

// ── ICONS ─────────────────────────────────────────────────────────────
const HTMLIcon = () => (
  <svg viewBox="0 0 60 60" width="44" height="44" fill="none">
    <path d="M8 4l5 46 17 5 17-5 5-46z" stroke="#E44D26" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M14 14h32M15 24h30M20 34l10 4 10-4" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const CSSIcon = () => (
  <svg viewBox="0 0 60 60" width="44" height="44" fill="none">
    <path d="M8 4l5 46 17 5 17-5 5-46z" stroke="#264DE4" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M14 14h32M15 24h30" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M20 34c0 4 4 7 10 7s10-3 10-7" stroke="#264DE4" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const JSIcon = () => (
  <svg viewBox="0 0 60 60" width="44" height="44" fill="none">
    <rect x="4" y="4" width="52" height="52" rx="4" stroke="#F7DF1E" strokeWidth="2"/>
    <path d="M22 44V28" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M22 44c0 4-3 8-8 8" stroke="#F7DF1E" strokeWidth="2" strokeLinecap="round"/>
    <path d="M38 28v10c0 4-2 6-5 6s-5-2-5-6" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);
const ReactIcon = () => (
  <svg viewBox="0 0 60 60" width="44" height="44" fill="none">
    <circle cx="30" cy="30" r="5" stroke="#61DAFB" strokeWidth="2.5"/>
    <ellipse cx="30" cy="30" rx="24" ry="9" stroke="#61DAFB" strokeWidth="1.8"/>
    <ellipse cx="30" cy="30" rx="24" ry="9" stroke="#61DAFB" strokeWidth="1.8" transform="rotate(60 30 30)"/>
    <ellipse cx="30" cy="30" rx="24" ry="9" stroke="#61DAFB" strokeWidth="1.8" transform="rotate(120 30 30)"/>
  </svg>
);
const TailwindIcon = () => (
  <svg viewBox="0 0 60 60" width="44" height="44" fill="none">
    <path d="M15 22c2-8 7-12 15-12 12 0 14 9 20 10.5C54 21.5 58 19.5 60 14 58 23 53 27 45 27c-12 0-13.5-9-19.5-10.5C22 15.5 18 17.5 15 22z"
      stroke="#38BDF8" strokeWidth="2" strokeLinecap="round"/>
    <path d="M0 37c2-8 7-12 15-12 12 0 14 9 20 10.5C39 36.5 43 34.5 45 29 43 38 38 42 30 42c-12 0-13.5-9-19.5-10.5C7 30.5 3 32.5 0 37z"
      stroke="#38BDF8" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const TSIcon = () => (
  <svg viewBox="0 0 60 60" width="44" height="44" fill="none">
    <rect x="4" y="4" width="52" height="52" rx="4" stroke="#3178C6" strokeWidth="2"/>
    <path d="M12 26h20M22 26v20" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M36 36c0 4 3 8 8 8s8-4 8-8-3-6-8-6-8-2-8-6 3-8 8-8 8 4 8 8"
      stroke="#3178C6" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const SupabaseIcon = () => (
  <svg viewBox="0 0 60 60" width="44" height="44" fill="none">
    <path d="M33 6L9 35h21v19l21-29H30z" stroke="#3ECF8E" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

const STACK = [
  { name: "HTML",       Icon: HTMLIcon     },
  { name: "CSS",        Icon: CSSIcon      },
  { name: "JavaScript", Icon: JSIcon       },
  { name: "React",      Icon: ReactIcon    },
  { name: "Tailwind",   Icon: TailwindIcon },
  { name: "TypeScript", Icon: TSIcon       },
  { name: "Supabase",   Icon: SupabaseIcon },
];

export default function TechStack() {
  const sectionRef = useRef(null);
  const labelRef   = useRef(null);
  const headingRef = useRef(null);
  const cardRefs   = useRef([]);

  useEffect(() => {
    gsap.set(labelRef.current,  { opacity: 0, y: 20 });
    gsap.set(headingRef.current,{ opacity: 0, y: 30 });
    gsap.set(cardRefs.current,  { opacity: 0, y: 50, scale: 0.85 });

    scrollManager.register(sectionRef.current, [
      {
        in: (done) => {
          gsap.timeline({ onComplete: done })
            // Label
            .to(labelRef.current,
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })
            // Heading slides up right after label
            .to(headingRef.current,
              { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.2")
            // Cards stagger up with spring bounce — connected to heading
            .to(cardRefs.current,
              { opacity: 1, y: 0, scale: 1,
                stagger: 0.08, duration: 0.55, ease: "back.out(1.7)" }, "-=0.2");
        },
        out: (done, reverse) => {
          gsap.timeline({ onComplete: done })
            .to([...cardRefs.current, headingRef.current, labelRef.current],
              { opacity: 0, y: reverse ? 40 : -40,
                stagger: reverse ? 0 : 0.03,
                duration: 0.5, ease: "power2.in" });
          if (reverse) gsap.set(cardRefs.current, { scale: 0.85 });
        },
      },
    ]);
  }, []);

  return (
    <section ref={sectionRef} style={{
      position: "fixed", inset: 0, width: "100%", height: "100vh",
      background: "#080808", overflow: "hidden",
      display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
      padding: "0 40px", visibility: "hidden",
    }}>

      <span ref={labelRef} style={{
        fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase",
        color: "#2C5584", marginBottom: "24px", display: "block",
        textAlign: "center", opacity: 0,
      }}>Tech Stack</span>

      <h2 ref={headingRef} style={{
        fontSize: "clamp(1.8rem, 4.5vw, 4rem)", fontWeight: 900,
        letterSpacing: "-0.03em", marginBottom: "48px",
        textAlign: "center", color: "rgba(255,255,255,0.9)",
        opacity: 0,
      }}>
        Tools I{" "}
        <span style={{ color: "#2C5584" }}>build</span>
        {" "}with.
      </h2>

      {/* Icon cards */}
      <div style={{
        display: "flex", flexWrap: "wrap",
        justifyContent: "center", gap: "20px",
        maxWidth: "720px",
      }}>
        {STACK.map((item, index) => (
          <div
            key={item.name}
            ref={(el) => (cardRefs.current[index] = el)}
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: "10px",
              padding: "22px 18px", minWidth: "90px",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "4px",
              background: "rgba(255,255,255,0.02)",
              opacity: 0, cursor: "default",
              transition: "border-color 0.3s, background 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(44,85,132,0.6)";
              e.currentTarget.style.background = "rgba(44,85,132,0.07)";
              gsap.to(e.currentTarget.querySelector(".icon-inner"),
                { y: -6, rotate: 5, duration: 0.35, ease: "power2.out" });
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              gsap.to(e.currentTarget.querySelector(".icon-inner"),
                { y: 0, rotate: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
            }}
          >
            <div className="icon-inner">
              <item.Icon />
            </div>
            <span style={{
              fontSize: "9px", letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
            }}>{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}