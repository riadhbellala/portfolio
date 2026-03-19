import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

const PROJECTS = [
  {
    id: 1,
    index: "01",
    name: "Lyceum",
    tagline: "Innovation · Leadership · Community",
    description: "A community platform for students passionate about technology, creativity, leadership, and innovation. Built to connect the next generation of builders.",
    tech: ["React", "Vite", "Tailwind","GSAP","Supabase"],
    url: "https://lyceum-club.vercel.app",
    image: "/assets/project-lyceum.png", // ← replace with: "/src/assets/project-lyceum.png"
    accent: "#61DAFB",
    year: "2024",
  },
  {
    id: 1,
    index: "01",
    name: "Lyceum",
    tagline: "Innovation · Leadership · Community",
    description: "A community platform for students passionate about technology, creativity, leadership, and innovation. Built to connect the next generation of builders.",
    tech: ["React", "Vite", "Tailwind","GSAP","Supabase"],
    url: "https://lyceum-club.vercel.app",
    image: "/src/assets/project-lyceum.png", // ← replace with: "/src/assets/project-lyceum.png"
    accent: "#61DAFB",
    year: "2024",
  },
  {
    id: 1,
    index: "01",
    name: "Lyceum",
    tagline: "Innovation · Leadership · Community",
    description: "A community platform for students passionate about technology, creativity, leadership, and innovation. Built to connect the next generation of builders.",
    tech: ["React", "Vite", "Tailwind","GSAP","Supabase"],
    url: "https://lyceum-club.vercel.app",
    image: "/src/assets/project-lyceum.png", // ← replace with: "/src/assets/project-lyceum.png"
    accent: "#61DAFB",
    year: "2026",
  },
  {
    id: 2,
    index: "02",
    name: "Project Two",
    tagline: "Your second project tagline here",
    description: "Replace this with your real project description. What problem does it solve? What makes it interesting and worth showing?",
    tech: ["React", "Supabase", "GSAP"],
    url: "https://example.com",
    image: null,
    accent: "#88CE02",
    year: "2025",
  },
];

// ── useBreakpoint — calls onMobile inside the resize event, not in an effect ──
function useBreakpoint(onBreakpointChange) {
  const get = useCallback(() => {
    const w = window.innerWidth;
    if (w < 640) return "mobile";
    if (w < 1024) return "tablet";
    return "desktop";
  }, []);
  const [bp, setBp] = useState(get);
  const callbackRef = useRef(onBreakpointChange);
  useEffect(() => { callbackRef.current = onBreakpointChange; });
  useEffect(() => {
    const h = () => {
      const next = get();
      setBp(next);
      callbackRef.current?.(next);  // fires in the event handler — not in effect body
    };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [get]);
  return bp;
}

function PlaceholderVisual({ project, isActive }) {
  const canvasRef = useRef(null);
  const frameRef  = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width  = canvas.offsetWidth  || 300;
    const H = canvas.height = canvas.offsetHeight || 200;
    const hex = project.accent;
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    let t = 0;
    function draw() {
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#0a0a0f"; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle=`rgba(${r},${g},${b},0.06)`; ctx.lineWidth=1;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      for(let wave=0;wave<5;wave++){
        ctx.beginPath();
        ctx.strokeStyle=`rgba(${r},${g},${b},${0.07+wave*0.04})`;
        ctx.lineWidth=1;
        for(let x=0;x<=W;x+=2){
          const y=H/2+Math.sin((x/W)*Math.PI*3+t+wave*0.8)*(22+wave*11)*(isActive?1.3:0.7);
          x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        ctx.stroke();
      }
      const pulse=Math.sin(t*1.5)*0.5+0.5;
      const orbR=(isActive?42:30)+pulse*8;
      const grad=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,orbR*2.5);
      grad.addColorStop(0,`rgba(${r},${g},${b},${0.5+pulse*0.2})`);
      grad.addColorStop(0.4,`rgba(${r},${g},${b},0.12)`);
      grad.addColorStop(1,"transparent");
      ctx.beginPath();ctx.arc(W/2,H/2,orbR*2.5,0,Math.PI*2);
      ctx.fillStyle=grad;ctx.fill();
      const bw=14,pad=10;
      ctx.strokeStyle=`rgba(${r},${g},${b},0.28)`;ctx.lineWidth=1.5;
      [[pad,pad,1,1],[W-pad,pad,-1,1],[pad,H-pad,1,-1],[W-pad,H-pad,-1,-1]].forEach(([x,y,sx,sy])=>{
        ctx.beginPath();ctx.moveTo(x+sx*bw,y);ctx.lineTo(x,y);ctx.lineTo(x,y+sy*bw);ctx.stroke();
      });
      ctx.font=`900 ${W*0.16}px monospace`;
      ctx.fillStyle=`rgba(${r},${g},${b},0.04)`;
      ctx.textAlign="center";
      ctx.fillText(project.index,W/2,H/2+W*0.06);
      t+=0.018;
      frameRef.current=requestAnimationFrame(draw);
    }
    draw();
    return ()=>cancelAnimationFrame(frameRef.current);
  },[project,isActive]);
  return <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block",borderRadius:"inherit"}}/>;
}

function ProjectCard({ project, isActive, onClick, isMobile }) {
  const cardRef = useRef(null);
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      scale:   isActive ? 1    : 0.84,
      opacity: isActive ? 1    : 0.3,
      filter:  isActive ? "blur(0px)" : "blur(2px)",
      duration:0.7, ease:"power3.out",
    });
  }, [isActive]);

  const cardW = isMobile ? 240 : 360;
  const cardH = isMobile ? 300 : 420;
  const imgH  = isMobile ? "48%" : "52%";

  return (
    <div
      ref={cardRef}
      onClick={isActive ? onClick : undefined}
      style={{
        width:cardW, height:cardH,
        borderRadius:"12px", overflow:"hidden",
        border:`1px solid ${isActive?project.accent+"55":"rgba(255,255,255,0.06)"}`,
        background:"#0a0a0f",
        boxShadow:isActive
          ?`0 0 50px ${project.accent}22, 0 24px 50px rgba(0,0,0,0.6)`
          :"0 12px 30px rgba(0,0,0,0.4)",
        cursor:isActive?"pointer":"default",
        transition:"border-color 0.5s ease, box-shadow 0.5s ease",
        flexShrink:0, position:"relative", userSelect:"none",
      }}
    >
      <div style={{width:"100%",height:imgH,position:"relative",overflow:"hidden"}}>
        {project.image
          ?<img src={project.image} alt={project.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          :<PlaceholderVisual project={project} isActive={isActive}/>
        }
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"55%",background:"linear-gradient(to bottom,transparent,#0a0a0f)",pointerEvents:"none"}}/>
        <div style={{
          position:"absolute",top:"10px",right:"10px",
          fontSize:"7px",letterSpacing:"0.35em",textTransform:"uppercase",
          color:project.accent,border:`1px solid ${project.accent}44`,
          padding:"2px 7px",borderRadius:"2px",background:`${project.accent}0a`,
        }}>{project.year}</div>
      </div>

      <div style={{padding:isMobile?"12px":"18px",display:"flex",flexDirection:"column",gap:isMobile?"6px":"8px"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:"8px"}}>
          <span style={{fontSize:"8px",fontWeight:700,letterSpacing:"0.3em",color:project.accent,fontFamily:"monospace"}}>
            {project.index}
          </span>
          <h3 style={{margin:0,fontSize:isMobile?"16px":"21px",fontWeight:900,letterSpacing:"-0.04em",color:"rgba(255,255,255,0.92)",lineHeight:1}}>
            {project.name}
          </h3>
        </div>
        <p style={{margin:0,fontSize:isMobile?"9px":"10px",letterSpacing:"0.02em",lineHeight:1.5,color:"rgba(255,255,255,0.28)"}}>
          {project.tagline}
        </p>
        <div style={{display:"flex",flexWrap:"wrap",gap:"4px",marginTop:"2px"}}>
          {project.tech.map(t=>(
            <span key={t} style={{
              fontSize:"6px",letterSpacing:"0.18em",textTransform:"uppercase",
              color:"rgba(255,255,255,0.3)",border:"1px solid rgba(255,255,255,0.07)",
              padding:"2px 6px",borderRadius:"2px",
            }}>{t}</span>
          ))}
        </div>
        {isActive&&(
          <div style={{marginTop:"4px",display:"flex",alignItems:"center",gap:"6px",fontSize:"8px",letterSpacing:"0.28em",textTransform:"uppercase",color:project.accent}}>
            <div style={{width:"16px",height:"1px",background:project.accent}}/>
            Visit site →
          </div>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const [active,   setActive]   = useState(0);
  const [entering, setEntering] = useState(true);

  const trackRef  = useRef(null);
  const wrapRef   = useRef(null);
  const bodyRef   = useRef(null);
  const snapToRef = useRef(null); // stable ref so resize handler can call snapTo

  const total = PROJECTS.length;

  // ── snapTo defined before useBreakpoint so ref can point to it ────────────
  const snapTo = useCallback((index, currentCardW, currentGap) => {
    const clamped = Math.max(0, Math.min(index, total - 1));
    setActive(clamped);
    const trackW  = currentCardW + currentGap;
    const centerX = wrapRef.current ? wrapRef.current.offsetWidth / 2 : 0;
    const targetX = centerX - clamped * trackW - currentCardW / 2;
    gsap.to(trackRef.current, { x: targetX, duration: 0.75, ease: "power3.out" });
  }, [total]);

  // Keep ref always pointing to latest snapTo
  useEffect(() => { snapToRef.current = snapTo; });

  // ── useBreakpoint — re-centers carousel in the resize event (not effect) ──
  const bp = useBreakpoint((nextBp) => {
    // Called from inside the resize event handler — safe to derive state here
    const mobile  = nextBp === "mobile";
    const cardW   = mobile ? 240 : 360;
    const cardGap = mobile ? 20  : 40;
    snapToRef.current?.(0, cardW, cardGap);
  });

  const isMobile = bp === "mobile";
  const cardW    = isMobile ? 240 : 360;
  const gap      = isMobile ? 20  : 40;
  const ap       = PROJECTS[active];
  const NAV_H    = isMobile ? 56 : 70;

  // Entrance animation
  useEffect(() => {
    if (!bodyRef.current) return;
    gsap.set(bodyRef.current, { opacity: 0, y: 20 });
    gsap.to(bodyRef.current, {
      opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.2,
      onComplete: () => setEntering(false),
    });
  }, []);

  // Initial center on mount
  useEffect(() => {
    snapTo(0, cardW, gap);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs once on mount only

  // Draggable
  useEffect(() => {
    if (!trackRef.current) return;
    const d = Draggable.create(trackRef.current, {
      type: "x", inertia: true, cursor: "grab", activeCursor: "grabbing",
      onDragEnd() {
        const trackW  = cardW + gap;
        const centerX = wrapRef.current ? wrapRef.current.offsetWidth / 2 : 0;
        const curX    = gsap.getProperty(trackRef.current, "x");
        const idx     = Math.round((centerX - cardW / 2 - curX) / trackW);
        snapTo(idx, cardW, gap);
      },
    })[0];
    return () => d?.kill();
  }, [cardW, gap, snapTo]);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") snapTo(active + 1, cardW, gap);
      if (e.key === "ArrowLeft")  snapTo(active - 1, cardW, gap);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, cardW, gap, snapTo]);

  return (
    <div style={{
      position:"fixed", inset:0,
      background:"#080808",
      overflow:"hidden",
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      paddingTop:`${NAV_H}px`,
      boxSizing:"border-box",
    }}>

      {/* Grain */}
      <div aria-hidden="true" style={{
        position:"fixed",inset:0,zIndex:9990,pointerEvents:"none",opacity:0.032,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat:"repeat",backgroundSize:"128px 128px",
      }}/>

      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
        width:"60vw",height:"60vh",borderRadius:"50%",
        background:`radial-gradient(circle,${ap.accent}0a 0%,transparent 70%)`,
        pointerEvents:"none",zIndex:0,transition:"background 0.8s ease",filter:"blur(40px)",
      }}/>

      {/* Grid */}
      <div aria-hidden="true" style={{
        position:"absolute",inset:0,zIndex:0,pointerEvents:"none",
        backgroundImage:`linear-gradient(rgba(44,85,132,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(44,85,132,0.025) 1px,transparent 1px)`,
        backgroundSize:"60px 60px",
      }}/>

      {/* Content */}
      <div ref={bodyRef} style={{
        flex:1,
        width:"100%",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        gap: isMobile ? "12px" : "20px",
        zIndex:2,
        overflow:"hidden",
        paddingBottom: isMobile ? "12px" : "24px",
        boxSizing:"border-box",
      }}>

        {/* Label + counter */}
        <div style={{textAlign:"center"}}>
          <span style={{fontSize:"8px",letterSpacing:"0.55em",textTransform:"uppercase",color:"rgba(255,255,255,0.18)"}}>
            Selected Work
          </span>
          <span style={{marginLeft:"20px",fontSize:"9px",letterSpacing:"0.3em",fontFamily:"monospace",color:"rgba(255,255,255,0.2)",verticalAlign:"middle"}}>
            <span style={{color:ap.accent}}>{String(active+1).padStart(2,"0")}</span>
            /{String(total).padStart(2,"0")}
          </span>
        </div>

        {/* Carousel */}
        <div ref={wrapRef} style={{
          width:"100%",position:"relative",
          overflow:"visible",
          display:"flex",alignItems:"center",justifyContent:"center",
        }}>
          <div ref={trackRef} style={{
            display:"flex",gap:`${gap}px`,alignItems:"center",
            padding:`0 ${isMobile?"16px":"40px"}`,
            willChange:"transform",cursor:"grab",
          }}>
            {PROJECTS.map((project,i)=>(
              <ProjectCard
                key={project.id}
                project={project}
                isActive={active===i}
                isMobile={isMobile}
                onClick={()=>window.open(project.url,"_blank","noreferrer")}
              />
            ))}
          </div>
        </div>

        {/* Description — desktop only */}
        {!isMobile && (
          <div style={{textAlign:"center",maxWidth:"440px",padding:"0 24px"}}>
            <p style={{margin:0,fontSize:"12px",lineHeight:1.8,letterSpacing:"0.02em",color:"rgba(255,255,255,0.25)"}}>
              {ap.description}
            </p>
          </div>
        )}

        {/* Nav */}
        <div style={{display:"flex",alignItems:"center",gap:isMobile?"16px":"20px"}}>
          <button
            onClick={()=>snapTo(active-1,cardW,gap)}
            disabled={active===0}
            aria-label="Previous"
            style={{
              background:"none",
              border:`1px solid ${active===0?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.15)"}`,
              width:isMobile?"30px":"34px",height:isMobile?"30px":"34px",borderRadius:"50%",
              color:active===0?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.45)",
              cursor:active===0?"default":"pointer",
              fontSize:"13px",display:"flex",alignItems:"center",justifyContent:"center",
              transition:"border-color 0.3s, color 0.3s",
            }}
            onMouseEnter={e=>{if(active>0){e.currentTarget.style.borderColor=ap.accent;e.currentTarget.style.color=ap.accent;}}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=active===0?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.15)";e.currentTarget.style.color=active===0?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.45)";}}
          >←</button>

          <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
            {PROJECTS.map((_,i)=>(
              <button key={i} onClick={()=>snapTo(i,cardW,gap)} aria-label={`Project ${i+1}`} style={{
                width:active===i?"20px":"5px",height:"5px",borderRadius:"3px",
                background:active===i?ap.accent:"rgba(255,255,255,0.15)",
                border:"none",cursor:"pointer",padding:0,
                transition:"width 0.4s ease, background 0.4s ease",
              }}/>
            ))}
          </div>

          <button
            onClick={()=>snapTo(active+1,cardW,gap)}
            disabled={active===total-1}
            aria-label="Next"
            style={{
              background:"none",
              border:`1px solid ${active===total-1?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.15)"}`,
              width:isMobile?"30px":"34px",height:isMobile?"30px":"34px",borderRadius:"50%",
              color:active===total-1?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.45)",
              cursor:active===total-1?"default":"pointer",
              fontSize:"13px",display:"flex",alignItems:"center",justifyContent:"center",
              transition:"border-color 0.3s, color 0.3s",
            }}
            onMouseEnter={e=>{if(active<total-1){e.currentTarget.style.borderColor=ap.accent;e.currentTarget.style.color=ap.accent;}}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=active===total-1?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.15)";e.currentTarget.style.color=active===total-1?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.45)";}}
          >→</button>
        </div>

        {entering && (
          <p aria-hidden="true" style={{
            fontSize:"7px",letterSpacing:"0.4em",textTransform:"uppercase",
            color:"rgba(255,255,255,0.08)",margin:0,whiteSpace:"nowrap",
            animation:"fadeHint 2.5s ease 1.5s forwards",
          }}>drag · arrows · tap to visit</p>
        )}
      </div>

      <style>{`@keyframes fadeHint{0%{opacity:1}100%{opacity:0}}`}</style>
    </div>
  );
}