import { useRef, useEffect } from "react";
import gsap from "gsap";
import { scrollManager } from "../../utils/ScrollManager";

// ── SOCIAL ICONS ──────────────────────────────────────────────────────
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);
const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const SOCIALS = [
  { name: "GitHub",    handle: "@riadh",    url: "https://github.com",    Icon: GithubIcon,    color: "#ffffff" },
  { name: "Instagram", handle: "@riadh",    url: "https://instagram.com", Icon: InstagramIcon, color: "#E1306C" },
  { name: "WhatsApp",  handle: "+213 ...",  url: "https://wa.me",         Icon: WhatsappIcon,  color: "#25D366" },
  { name: "Facebook",  handle: "Riadh",     url: "https://facebook.com",  Icon: FacebookIcon,  color: "#1877F2" },
];

export default function Contact() {
  const sectionRef  = useRef(null);
  const labelRef    = useRef(null);
  const headingRef  = useRef(null);
  const cardRefs    = useRef([]);
  const footerRef   = useRef(null);

  useEffect(() => {
    gsap.set(labelRef.current,  { opacity: 0, y: 20 });
    gsap.set(headingRef.current,{ opacity: 0, y: 30 });
    gsap.set(cardRefs.current,  { opacity: 0, y: 50, scale: 0.85 });
    gsap.set(footerRef.current, { opacity: 0 });

    scrollManager.register(sectionRef.current, [
      {
        // Everything appears together — heading then social cards
        in: (done) => {
          gsap.timeline({ onComplete: done })
            .to(labelRef.current,
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })
            .to(headingRef.current,
              { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.2")
            // Social icon cards bounce up with stagger — connected to heading
            .to(cardRefs.current,
              { opacity: 1, y: 0, scale: 1,
                stagger: 0.1, duration: 0.6, ease: "back.out(1.7)" }, "-=0.1")
            .to(footerRef.current,
              { opacity: 1, duration: 0.4 }, "-=0.1");
        },
        out: (done, reverse) => {
          gsap.timeline({ onComplete: done })
            .to([...cardRefs.current, headingRef.current, labelRef.current, footerRef.current],
              { opacity: 0, y: reverse ? 40 : -40,
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
      }}>Contact</span>

      <h2 ref={headingRef} style={{
        fontSize: "clamp(2rem, 5.5vw, 5rem)", fontWeight: 900,
        letterSpacing: "-0.03em", marginBottom: "52px",
        textAlign: "center", color: "rgba(255,255,255,0.9)",
        opacity: 0,
      }}>
        Let's{" "}
        <span style={{ color: "#2C5584" }}>connect.</span>
      </h2>

      {/* Social icon cards — big, centered, animated */}
      <div style={{
        display: "flex", gap: "20px",
        justifyContent: "center", flexWrap: "wrap",
        maxWidth: "560px",
      }}>
        {SOCIALS.map((social, index) => (
          <a
            key={social.name}
            ref={(el) => (cardRefs.current[index] = el)}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: "12px",
              padding: "28px 24px", minWidth: "110px",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "4px",
              background: "rgba(255,255,255,0.02)",
              textDecoration: "none",
              opacity: 0, cursor: "pointer",
              transition: "border-color 0.3s, background 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = social.color + "55";
              e.currentTarget.style.background = social.color + "11";
              gsap.to(e.currentTarget.querySelector(".sicon"),
                { y: -7, scale: 1.15, duration: 0.3, ease: "power2.out",
                  color: social.color });
              gsap.to(e.currentTarget.querySelector(".sname"),
                { color: social.color, duration: 0.3 });
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              gsap.to(e.currentTarget.querySelector(".sicon"),
                { y: 0, scale: 1, duration: 0.5, ease: "elastic.out(1,0.4)",
                  color: "rgba(255,255,255,0.5)" });
              gsap.to(e.currentTarget.querySelector(".sname"),
                { color: "rgba(255,255,255,0.4)", duration: 0.3 });
            }}
          >
            <div className="sicon" style={{ color: "rgba(255,255,255,0.5)" }}>
              <social.Icon />
            </div>
            <span className="sname" style={{
              fontSize: "9px", letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
            }}>{social.name}</span>
          </a>
        ))}
      </div>

      <p ref={footerRef} style={{
        marginTop: "52px", fontSize: "10px", textAlign: "center",
        letterSpacing: "0.3em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.1)", opacity: 0,
      }}>
        Designed & Built by Riadh © 2025
      </p>
    </section>
  );
}