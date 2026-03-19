import { useRef, useEffect, forwardRef, useState, useCallback } from "react";
import gsap from "gsap";

function useBreakpoint() {
  const get = useCallback(() => { const w=window.innerWidth; if(w<640)return"mobile"; if(w<1024)return"tablet"; return"desktop"; }, []);
  const [bp,setBp] = useState(get);
  useEffect(()=>{const h=()=>setBp(get());window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[get]);
  return bp;
}

const STACK = [
  {name:"HTML",       color:"#E44D26", icon:"</>" },
  {name:"CSS",        color:"#264DE4", icon:"{ }" },
  {name:"JavaScript", color:"#F7DF1E", icon:"JS"  },
  {name:"React",      color:"#61DAFB", icon:"⚛"  },
  {name:"Tailwind",   color:"#38BDF8", icon:"~"   },
  {name:"TypeScript", color:"#3178C6", icon:"TS"  },
  {name:"Supabase",   color:"#3ECF8E", icon:"⚡"  },
  {name:"GSAP",       color:"#88CE02", icon:"▶"   },
  {name:"Vite",       color:"#646CFF", icon:"⚡"  },
];

const TechStack = forwardRef(function TechStack({ isMobile }, ref) {
  const bp        = useBreakpoint();
  const isTablet  = bp === "tablet";
  const labelRef  = useRef(null);
  const headingRef= useRef(null);
  const coreRef   = useRef(null);
  const cardRefs  = useRef([]);
  const lineRefs  = useRef([]);
  const hasEntered= useRef(false);
  const orbitAnims= useRef([]);

  useEffect(() => {
    gsap.set(labelRef.current,   { opacity:0, y:-20 });
    gsap.set(headingRef.current, { opacity:0, y:20 });
    gsap.set(coreRef.current,    { opacity:0, scale:0 });
    cardRefs.current.forEach((el) => {
      if (!el) return;
      gsap.set(el, { opacity:0, scale:0, rotation:-20 });
    });
    lineRefs.current.forEach(el => { if (el) gsap.set(el, { opacity:0, scaleX:0, transformOrigin:"left" }); });
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
      if (!visible) {
        hasEntered.current = false;
        orbitAnims.current.forEach(a => a?.kill());
      }
    });
    obs.observe(el,{attributes:true,attributeFilter:["style"]});
    return ()=>obs.disconnect();
  },[ref]);

  function playEntrance() {
    const tl = gsap.timeline();

    tl.to(labelRef.current, { opacity:1, y:0, duration:0.5, ease:"power3.out" });
    tl.to(headingRef.current,{ opacity:1, y:0, duration:0.6, ease:"power3.out" }, "-=0.2");
    tl.to(coreRef.current,   { opacity:1, scale:1, duration:0.7, ease:"back.out(2)" }, "-=0.2");

    // Cards burst out from center
    tl.to(cardRefs.current, {
      opacity:1, scale:1, rotation:0,
      duration:0.7, ease:"back.out(1.8)",
      stagger:{ each:0.06, from:"start" },
    }, "-=0.3");

    tl.to(lineRefs.current, {
      opacity:1, scaleX:1,
      duration:0.5, ease:"power2.out",
      stagger:0.05,
    }, "-=0.5");

    // After entrance, start slow orbit rotation on each card
    tl.call(() => {
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const anim = gsap.to(el, {
          rotation: `+=${360}`,
          duration: 20 + i * 3,
          ease: "none",
          repeat: -1,
          transformOrigin: "center",
          modifiers: { rotation: gsap.utils.unitize(v => v) },
        });
        // Counter-rotate the inner content so text stays upright
        const inner = el.querySelector(".card-inner");
        if (inner) {
          gsap.to(inner, {
            rotation: `-=${360}`,
            duration: 20 + i * 3,
            ease: "none",
            repeat: -1,
          });
        }
        orbitAnims.current.push(anim);
      });
    });
  }

  return (
    <section ref={ref} style={{
      position:"fixed",inset:0,width:"100%",height:"100vh",
      background:"#080808",overflow:"hidden",
      display:"flex",alignItems:"center",justifyContent:"center",
    }}>
      {/* Background radial */}
      <div aria-hidden="true" style={{
        position:"absolute",top:"50%",left:"50%",
        transform:"translate(-50%,-50%)",
        width:"80vmin",height:"80vmin",borderRadius:"50%",
        background:"radial-gradient(circle, rgba(44,85,132,0.07) 0%, transparent 70%)",
        pointerEvents:"none",zIndex:0,
      }}/>

      {/* Left panel: label + heading */}
      <div style={{
        position:"absolute",
        left:isMobile?"50%":isTablet?"5%":"7%",
        top:isMobile?"10%":"50%",
        transform:isMobile?"translateX(-50%)":"translateY(-50%)",
        zIndex:3,
        textAlign:isMobile?"center":"left",
      }}>
        <span ref={labelRef} style={{
          fontSize:"9px",letterSpacing:"0.55em",textTransform:"uppercase",
          color:"#2C5584",display:"block",marginBottom:"14px",
        }}>03 — Stack</span>
        <h2 ref={headingRef} style={{
          fontSize:isMobile?"clamp(1.1rem,4vw,1.6rem)":isTablet?"clamp(1.2rem,3vw,2rem)":"clamp(1.4rem,2.5vw,2.8rem)",
          fontWeight:900,letterSpacing:"-0.03em",
          color:"rgba(255,255,255,0.9)",margin:0,
          lineHeight:1.1,
        }}>
          Tools I<br/><span style={{color:"#2C5584"}}>build</span> with.
        </h2>
      </div>

      {/* Central grid of cards */}
      <div style={{
        display:"grid",
        gridTemplateColumns:isMobile?"repeat(3,1fr)":isTablet?"repeat(3,1fr)":"repeat(3,1fr)",
        gap:isMobile?"10px":isTablet?"14px":"18px",
        zIndex:2,
        marginTop:isMobile?"80px":"0",
        marginLeft:isMobile?"0":isTablet?"0":"160px",
      }}>
        {STACK.map((item, i) => (
          <div key={item.name}
            ref={(el) => (cardRefs.current[i] = el)}
            data-hover="true"
            style={{ position:"relative" }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, { y:-8, scale:1.06, duration:0.3, ease:"power2.out" });
              const inner = e.currentTarget.querySelector(".card-inner");
              if (inner) inner.style.borderColor = item.color + "66";
              if (inner) inner.style.background = item.color + "10";
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { y:0, scale:1, duration:0.5, ease:"elastic.out(1,0.4)" });
              const inner = e.currentTarget.querySelector(".card-inner");
              if (inner) inner.style.borderColor = "rgba(255,255,255,0.07)";
              if (inner) inner.style.background = "rgba(255,255,255,0.02)";
            }}
          >
            <div className="card-inner" style={{
              display:"flex",flexDirection:"column",alignItems:"center",
              justifyContent:"center",
              gap:isMobile?"8px":"12px",
              padding:isMobile?"18px 14px":"26px 20px",
              border:"1px solid rgba(255,255,255,0.07)",
              borderRadius:"8px",
              background:"rgba(255,255,255,0.02)",
              cursor:"default",
              transition:"border-color 0.3s, background 0.3s",
              minWidth:isMobile?"80px":"100px",
            }}>
              {/* Icon badge */}
              <div style={{
                width:isMobile?"36px":"46px",
                height:isMobile?"36px":"46px",
                borderRadius:"50%",
                background:`${item.color}18`,
                border:`1px solid ${item.color}44`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:isMobile?"13px":"16px",
                fontWeight:900,
                color:item.color,
                letterSpacing:"-0.02em",
                boxShadow:`0 0 16px ${item.color}22`,
              }}>
                {item.icon}
              </div>
              <span style={{
                fontSize:isMobile?"7px":"8px",
                letterSpacing:"0.28em",
                textTransform:"uppercase",
                color:"rgba(255,255,255,0.35)",
              }}>{item.name}</span>
              {/* Connector line */}
              <div ref={(el) => (lineRefs.current[i] = el)} style={{
                position:"absolute",
                bottom:"-1px",left:"50%",
                width:"1px",height:"10px",
                background:`linear-gradient(to bottom, ${item.color}44, transparent)`,
                transform:"translateX(-50%)",
              }}/>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

export default TechStack;