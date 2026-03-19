import { useRef, useEffect, forwardRef, useState, useCallback } from "react";
import gsap from "gsap";
import MagneticButton from "../../hooks/MagneticButton";

function useBreakpoint() {
  const get = useCallback(() => { const w=window.innerWidth; if(w<640)return"mobile"; if(w<1024)return"tablet"; return"desktop"; }, []);
  const [bp,setBp] = useState(get);
  useEffect(()=>{const h=()=>setBp(get());window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[get]);
  return bp;
}

const SOCIALS = [
  { name:"GH",  label:"GitHub",    url:"https://github.com/riadhbellala",       color:"#ffffff" },
  { name:"IG",  label:"Instagram", url:"https://www.instagram.com/r_iiiadh.b/", color:"#E1306C" },
  { name:"WA",  label:"WhatsApp",  url:"https://wa.me/213555711088",            color:"#25D366" },
  { name:"FB",  label:"Facebook",  url:"https://facebook.com",                  color:"#1877F2" },
];

const Contact = forwardRef(function Contact({ isMobile }, ref) {
  const bp        = useBreakpoint();
  const isTablet  = bp === "tablet";

  const indexRef    = useRef(null);
  const bigTextRef  = useRef([]);
  const emailRef    = useRef(null);
  const divRef      = useRef(null);
  const socialsRef  = useRef([]);
  const btnRef      = useRef(null);
  const footerRef   = useRef(null);
  const decorRef    = useRef(null);
  const hasEntered  = useRef(false);

  // Split "Let's Talk" into chars
  const BIG_TEXT = "Let's Talk.";
  const chars = BIG_TEXT.split("");

  useEffect(() => {
    gsap.set(indexRef.current,  { opacity:0, x:-20 });
    gsap.set(bigTextRef.current,{ opacity:0, y:80, rotateX:-40, transformOrigin:"50% 100%" });
    gsap.set(divRef.current,    { scaleX:0, transformOrigin:"left" });
    gsap.set(emailRef.current,  { opacity:0, y:16 });
    gsap.set(socialsRef.current,{ opacity:0, x:-20 });
    gsap.set(btnRef.current,    { opacity:0, y:20 });
    gsap.set(footerRef.current, { opacity:0 });
    gsap.set(decorRef.current,  { opacity:0, scale:0.8 });
  }, []);

  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    const obs = new MutationObserver(() => {
      const visible = el.style.visibility!=="hidden" && parseFloat(el.style.opacity||"0")>0.5;
      if (visible && !hasEntered.current) {
        hasEntered.current = true;
        playEntrance();
      }
      if (!visible) hasEntered.current = false;
    });
    obs.observe(el,{attributes:true,attributeFilter:["style"]});
    return ()=>obs.disconnect();
  },[ref]);

  function playEntrance() {
    const tl = gsap.timeline();

    tl.to(indexRef.current, { opacity:1, x:0, duration:0.5, ease:"power3.out" });

    // Chars tumble in
    tl.to(bigTextRef.current, {
      opacity:1, y:0, rotateX:0,
      duration:0.9, ease:"power4.out",
      stagger:{ each:0.04, from:"start" },
    }, "-=0.2");

    tl.to(divRef.current, { scaleX:1, duration:0.7, ease:"power2.inOut" }, "-=0.3");

    tl.to(emailRef.current, { opacity:1, y:0, duration:0.5, ease:"power2.out" }, "-=0.4");

    tl.to(socialsRef.current, {
      opacity:1, x:0, duration:0.5, ease:"power3.out",
      stagger:0.08,
    }, "-=0.3");

    tl.to(btnRef.current,   { opacity:1, y:0, duration:0.5, ease:"back.out(1.5)" }, "-=0.2");
    tl.to(decorRef.current, { opacity:1, scale:1, duration:0.6, ease:"back.out(1.5)" }, "-=0.4");
    tl.to(footerRef.current,{ opacity:1, duration:0.4 }, "-=0.1");
  }

  return (
    <section ref={ref} style={{
      position:"fixed",inset:0,width:"100%",height:"100vh",
      background:"#080808",overflow:"hidden",
      display:"flex",flexDirection:"column",
      justifyContent:"center",
      padding:isMobile?"0 24px":isTablet?"0 48px":"0 8%",
    }}>

      {/* Top accent */}
      <div aria-hidden="true" style={{
        position:"absolute",top:0,left:0,right:0,height:"1px",
        background:"linear-gradient(90deg,transparent,rgba(44,85,132,0.25),rgba(44,85,132,0.25),transparent)",
        pointerEvents:"none",
      }}/>

      {/* Right-side decorative element */}
      <div ref={decorRef} aria-hidden="true" style={{
        position:"absolute",
        right:isMobile?"20px":isTablet?"40px":"7%",
        top:"50%",transform:"translateY(-50%)",
        zIndex:1,
        display:"flex",flexDirection:"column",
        alignItems:"center",gap:"6px",
        opacity:0,
      }}>
        {/* Vertical line with dots */}
        {[0,1,2,3,4,5,6,7].map(i => (
          <div key={i} style={{
            width:"1px",height:"20px",
            background:i%2===0?"rgba(44,85,132,0.4)":"rgba(255,255,255,0.05)",
          }}/>
        ))}
        <div style={{
          width:"6px",height:"6px",borderRadius:"50%",
          background:"rgba(44,85,132,0.6)",
          boxShadow:"0 0 10px rgba(44,85,132,0.4)",
        }}/>
        {[0,1,2].map(i => (
          <div key={i} style={{width:"1px",height:"20px",background:"rgba(44,85,132,0.2)"}}/>
        ))}
        <span style={{
          fontSize:"7px",letterSpacing:"0.4em",textTransform:"uppercase",
          color:"rgba(255,255,255,0.1)",
          writingMode:"vertical-rl",textOrientation:"mixed",
          marginTop:"8px",
        }}>04 — Contact</span>
      </div>

      {/* Index */}
      <span ref={indexRef} style={{
        fontSize:"9px",letterSpacing:"0.55em",textTransform:"uppercase",
        color:"rgba(44,85,132,0.6)",marginBottom:"20px",display:"block",
      }}>04 / Get in touch</span>

      {/* Big headline */}
      <div style={{
        display:"flex",flexWrap:"wrap",
        justifyContent:isMobile||isTablet?"center":"flex-start",
        overflow:"hidden",
        marginBottom:"0",
        perspective:"600px",
      }}>
        {chars.map((char, i) => (
          <span key={i}
            ref={(el) => (bigTextRef.current[i] = el)}
            style={{
              display:"inline-block",
              fontSize:isMobile?"clamp(2.8rem,13vw,4rem)":isTablet?"clamp(3rem,10vw,6rem)":"clamp(3.5rem,8vw,9rem)",
              fontWeight:900,letterSpacing:char===" "?"0.2em":"-0.04em",
              color:char==="."?"#2C5584":"rgba(255,255,255,0.92)",
              lineHeight:0.9,
              transformStyle:"preserve-3d",
              whiteSpace: char===" "?"pre":"normal",
            }}
          >{char===" "?" ":char}</span>
        ))}
      </div>

      {/* Divider */}
      <div ref={divRef} style={{
        width:isMobile?"100%":"clamp(200px,40vw,500px)",
        height:"1px",
        background:"linear-gradient(90deg,rgba(44,85,132,0.7),rgba(44,85,132,0.2),transparent)",
        margin:isMobile?"20px auto":"24px 0",
      }}/>

      {/* Email */}
      <a ref={emailRef} href="mailto:riadh5726@gmail.com" data-hover="true"
        style={{
          fontSize:isMobile?"11px":isTablet?"12px":"14px",
          letterSpacing:"0.2em",textTransform:"uppercase",
          color:"rgba(255,255,255,0.25)",textDecoration:"none",
          marginBottom:isMobile?"28px":"36px",
          display:"block",
          textAlign:isMobile||isTablet?"center":"left",
          transition:"color 0.25s",
        }}
        onMouseEnter={(e)=>{
          e.currentTarget.style.color="#2C5584";
          gsap.to(e.currentTarget,{x:6,duration:0.3,ease:"power2.out"});
        }}
        onMouseLeave={(e)=>{
          e.currentTarget.style.color="rgba(255,255,255,0.25)";
          gsap.to(e.currentTarget,{x:0,duration:0.4});
        }}>
        riadh5726@gmail.com →
      </a>

      {/* Social links — minimal text style */}
      <div style={{
        display:"flex",gap:isMobile?"20px":"32px",
        flexWrap:"wrap",
        justifyContent:isMobile||isTablet?"center":"flex-start",
        marginBottom:isMobile?"28px":"36px",
      }}>
        {SOCIALS.map((s, i) => (
          <a key={s.name}
            ref={(el) => (socialsRef.current[i] = el)}
            href={s.url} target="_blank" rel="noreferrer"
            data-hover="true"
            style={{
              display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",
              textDecoration:"none",cursor:"pointer",
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, { y:-4, duration:0.25, ease:"power2.out" });
              e.currentTarget.querySelector("span.sname").style.color = s.color;
              e.currentTarget.querySelector("span.sbig").style.color  = s.color;
              e.currentTarget.querySelector("span.sbig").style.textShadow = `0 0 20px ${s.color}66`;
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { y:0, duration:0.4, ease:"elastic.out(1,0.4)" });
              e.currentTarget.querySelector("span.sname").style.color = "rgba(255,255,255,0.2)";
              e.currentTarget.querySelector("span.sbig").style.color  = "rgba(255,255,255,0.55)";
              e.currentTarget.querySelector("span.sbig").style.textShadow = "none";
            }}
          >
            <span className="sbig" style={{
              fontSize:isMobile?"18px":"22px",fontWeight:900,letterSpacing:"-0.04em",
              color:"rgba(255,255,255,0.55)",transition:"color 0.25s, text-shadow 0.25s",
            }}>{s.name}</span>
            <span className="sname" style={{
              fontSize:"7px",letterSpacing:"0.35em",textTransform:"uppercase",
              color:"rgba(255,255,255,0.2)",transition:"color 0.25s",
            }}>{s.label}</span>
          </a>
        ))}
      </div>

      {/* CTA Button */}
      <div ref={btnRef} style={{ textAlign:isMobile||isTablet?"center":"left" }}>
        <MagneticButton
          onClick={()=>window.open("mailto:riadh5726@gmail.com")}
          style={{
            padding:isMobile?"13px 32px":"16px 44px",
            border:"1px solid rgba(44,85,132,0.45)",
            borderRadius:"2px",
            fontSize:isMobile?"9px":"10px",
            letterSpacing:"0.4em",textTransform:"uppercase",
            color:"rgba(255,255,255,0.65)",
            background:"rgba(44,85,132,0.07)",
            transition:"border-color 0.3s, background 0.3s, color 0.3s",
          }}
          onMouseEnter={(e)=>{
            e.currentTarget.style.borderColor="rgba(44,85,132,0.8)";
            e.currentTarget.style.background="rgba(44,85,132,0.15)";
            e.currentTarget.style.color="#fff";
          }}
          onMouseLeave={(e)=>{
            e.currentTarget.style.borderColor="rgba(44,85,132,0.45)";
            e.currentTarget.style.background="rgba(44,85,132,0.07)";
            e.currentTarget.style.color="rgba(255,255,255,0.65)";
          }}
        >
          Start a conversation →
        </MagneticButton>
      </div>

      {/* Footer */}
      <p ref={footerRef} style={{
        position:"absolute",bottom:"24px",
        left:isMobile?"50%":"8%",
        transform:isMobile?"translateX(-50%)":"none",
        fontSize:"8px",letterSpacing:"0.35em",textTransform:"uppercase",
        color:"rgba(255,255,255,0.08)",margin:0,whiteSpace:"nowrap",
      }}>
        Designed & Built by Riadh © 2025
      </p>
    </section>
  );
});

export default Contact;