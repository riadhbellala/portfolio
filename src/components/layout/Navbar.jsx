import { useRef, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

function useBreakpoint(onDesktop) {
  const get = useCallback(() => {
    const w = window.innerWidth;
    if (w < 640)  return "mobile";
    if (w < 1024) return "tablet";
    return "desktop";
  }, []);
  const [bp, setBp] = useState(get);
  const onDesktopRef = useRef(onDesktop);
  useEffect(() => { onDesktopRef.current = onDesktop; });
  useEffect(() => {
    const h = () => {
      const next = get();
      setBp(next);
      if (next === "desktop") onDesktopRef.current?.();
    };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [get]);
  return bp;
}

const GitHubSVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
const InstagramSVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);
const WhatsAppSVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const SOCIAL_LINKS = [
  { icon: GitHubSVG,    href: "https://github.com/riadhbellala",       label: "GitHub"    },
  { icon: InstagramSVG, href: "https://www.instagram.com/r_iiiadh.b/", label: "Instagram" },
  { icon: WhatsAppSVG,  href: "https://wa.me/213555711088",            label: "WhatsApp"  },
];

function HamburgerIcon({ open }) {
  const base = {
    display:"block", width:"22px", height:"1.5px",
    background:"rgba(255,255,255,0.7)",
    transition:"transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s",
    transformOrigin:"center",
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"5px", cursor:"pointer" }}>
      <span style={{ ...base, transform: open?"translateY(6.5px) rotate(45deg)":"none" }}/>
      <span style={{ ...base, opacity:open?0:1, transform:open?"scaleX(0)":"scaleX(1)" }}/>
      <span style={{ ...base, transform: open?"translateY(-6.5px) rotate(-45deg)":"none" }}/>
    </div>
  );
}

function MobileMenu({ open, onClose }) {
  const menuRef  = useRef(null);
  const iconsRef = useRef([]);

  useEffect(() => {
    if (!menuRef.current) return;
    if (open) {
      gsap.set(menuRef.current, { autoAlpha:1, yPercent:-100 });
      gsap.to(menuRef.current, { yPercent:0, duration:0.5, ease:"power3.out" });
      gsap.fromTo(iconsRef.current,
        { opacity:0, scale:0.7 },
        { opacity:1, scale:1, duration:0.35, ease:"back.out(2)", stagger:0.06, delay:0.2 }
      );
    } else {
      gsap.to(menuRef.current, {
        yPercent:-100, duration:0.4, ease:"power3.in",
        onComplete: () => gsap.set(menuRef.current, { autoAlpha:0 }),
      });
    }
  }, [open]);

  return (
    <div ref={menuRef} style={{
      position:"fixed", inset:0, background:"#080808",
      borderBottom:"1px solid rgba(44,85,132,0.25)",
      zIndex:9000, display:"flex", flexDirection:"column",
      justifyContent:"center", alignItems:"center",
      visibility:"hidden", opacity:0,
    }}>
      {/* Single CTA — scroll to contact via mailto */}
      <a href="mailto:riadh5726@gmail.com" onClick={onClose} style={{
        fontSize:"clamp(2rem,10vw,4rem)", fontWeight:900,
        letterSpacing:"0.08em", textTransform:"uppercase",
        textDecoration:"none",
        color:"transparent",
        WebkitTextStroke:"1px rgba(255,255,255,0.55)",
        marginBottom:"48px",
        transition:"color 0.25s, -webkit-text-stroke 0.25s",
        lineHeight:1.1,
      }}
      onMouseEnter={e=>{e.currentTarget.style.color="#2C5584";e.currentTarget.style.WebkitTextStroke="1px #2C5584";}}
      onMouseLeave={e=>{e.currentTarget.style.color="transparent";e.currentTarget.style.WebkitTextStroke="1px rgba(255,255,255,0.55)";}}>
        Hire me
      </a>

      <div style={{ display:"flex", gap:"28px" }}>
        {SOCIAL_LINKS.map(({ icon, href, label }, i) => (
          <a key={label} ref={el=>(iconsRef.current[i]=el)} href={href}
            target="_blank" rel="noreferrer" aria-label={label}
            style={{ color:"rgba(255,255,255,0.35)", transition:"color 0.25s", display:"flex", alignItems:"center", opacity:0 }}
            onMouseEnter={e=>(e.currentTarget.style.color="#fff")}
            onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.35)")}
          >{icon}</a>
        ))}
      </div>

      <p style={{ position:"absolute", bottom:"28px", fontSize:"8px", letterSpacing:"0.45em", textTransform:"uppercase", color:"rgba(255,255,255,0.12)" }}>
        Riadh · Portfolio
      </p>
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const bp       = useBreakpoint(() => setMenuOpen(false));
  const isMobile = bp === "mobile";

  const navRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(navRef.current, { opacity:0, y:-20 }, { opacity:1, y:0, duration:0.8, ease:"power2.out" });
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const iconStyle = {
    color:"rgba(255,255,255,0.5)", transition:"color 0.3s",
    display:"flex", alignItems:"center", padding:"8px", margin:"-8px",
  };

  return (
    <>
      <nav ref={navRef} style={{
        position:"fixed", top:0, left:0, width:"100%", zIndex:8000,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding: isMobile ? "16px 20px" : "24px 48px",
        background:"transparent",
      }}>
        {/* Left: social icons */}
        <div style={{ display:"flex", gap:"20px", alignItems:"center", minWidth: isMobile?"40px":"auto" }}>
          {!isMobile && SOCIAL_LINKS.map(({ icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
              style={iconStyle}
              onMouseEnter={e=>(e.currentTarget.style.color="#fff")}
              onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.5)")}
            >{icon}</a>
          ))}
        </div>

        {/* Center: logo */}
        <Link to="/" style={{
          position:"absolute", left:"50%", transform:"translateX(-50%)",
          color:"transparent",
          WebkitTextStroke:"1.5px #2C5584",
          fontWeight:900,
          fontSize: isMobile ? "2rem" : "2.8rem",
          letterSpacing:"0.2em", textTransform:"uppercase",
          textDecoration:"none", lineHeight:1,
        }}
        onMouseEnter={e=>{e.currentTarget.style.color="#2C5584";}}
        onMouseLeave={e=>{e.currentTarget.style.color="transparent";}}>
          R
        </Link>

        {/* Right: contact link or hamburger */}
        <div style={{ display:"flex", gap:"20px", alignItems:"center", minWidth: isMobile?"40px":"auto", justifyContent:"flex-end" }}>
          {!isMobile && (
            <a href="mailto:riadh5726@gmail.com" style={{
              color:"rgba(255,255,255,0.4)", fontSize:"0.7rem",
              letterSpacing:"0.22em", textTransform:"uppercase", textDecoration:"none",
              transition:"color 0.3s",
            }}
            onMouseEnter={e=>(e.currentTarget.style.color="#fff")}
            onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.4)")}
            >
              Hire me
            </a>
          )}
          {isMobile && (
            <button onClick={()=>setMenuOpen(v=>!v)}
              aria-label={menuOpen?"Close menu":"Open menu"}
              style={{ background:"none",border:"none",cursor:"pointer",padding:"4px",zIndex:9100,position:"relative" }}>
              <HamburgerIcon open={menuOpen}/>
            </button>
          )}
        </div>
      </nav>

      {isMobile && <MobileMenu open={menuOpen} onClose={()=>setMenuOpen(false)}/>}
    </>
  );
}