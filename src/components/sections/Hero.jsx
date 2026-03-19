import { useRef, useEffect, forwardRef, useState, useCallback } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Link } from "react-router-dom";

gsap.registerPlugin(Draggable, InertiaPlugin);

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

const LETTERS = ["R","I","A","D","H"];

function NeuralBrain({ isMobile }) {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const animFrameRef = useRef(null);
  const floatRef     = useRef(null);
  const isDrag       = useRef(false);
  const rotX         = useRef(-15);
  const rotY         = useRef(20);
  const velX         = useRef(0);
  const velY         = useRef(0);
  const lastMX       = useRef(0);
  const lastMY       = useRef(0);
  const posX         = useRef(0);
  const posY         = useRef(0);

  const SIZE = isMobile ? 260 : 680;
  const CX   = SIZE / 2;
  const CY   = SIZE / 2;
  const FL   = 800;

  const nodes3D = useRef([
    { x:0,    y:0,    z:0,    r:11, phase:0.0 },
    { x:30,   y:45,   z:15,   r:8,  phase:0.5 },
    { x:-38,  y:30,   z:22,   r:7,  phase:1.0 },
    { x:15,   y:-45,  z:-15,  r:8,  phase:1.5 },
    { x:120,  y:0,    z:0,    r:9,  phase:0.2 },
    { x:-120, y:0,    z:0,    r:9,  phase:0.7 },
    { x:0,    y:120,  z:0,    r:8,  phase:1.2 },
    { x:0,    y:-120, z:0,    r:8,  phase:1.7 },
    { x:0,    y:0,    z:120,  r:9,  phase:0.4 },
    { x:0,    y:0,    z:-120, r:8,  phase:0.9 },
    { x:180,  y:90,   z:45,   r:7,  phase:0.3 },
    { x:-165, y:105,  z:30,   r:7,  phase:0.8 },
    { x:90,   y:-180, z:60,   r:7,  phase:1.3 },
    { x:-75,  y:165,  z:90,   r:6,  phase:1.8 },
    { x:150,  y:-90,  z:-120, r:7,  phase:0.6 },
    { x:-135, y:-120, z:-90,  r:6,  phase:1.1 },
    { x:105,  y:150,  z:-105, r:7,  phase:1.6 },
    { x:-90,  y:-150, z:120,  r:6,  phase:2.1 },
    { x:255,  y:45,   z:75,   r:5,  phase:0.1 },
    { x:-240, y:60,   z:90,   r:5,  phase:0.6 },
    { x:75,   y:270,  z:45,   r:5,  phase:1.1 },
    { x:-60,  y:-255, z:75,   r:4,  phase:1.6 },
    { x:195,  y:-195, z:90,   r:5,  phase:2.1 },
    { x:-180, y:195,  z:-105, r:4,  phase:2.6 },
    { x:240,  y:-90,  z:-120, r:5,  phase:0.8 },
    { x:-225, y:90,   z:-135, r:4,  phase:1.3 },
    { x:60,   y:240,  z:-150, r:4,  phase:1.8 },
    { x:-45,  y:-225, z:165,  r:4,  phase:2.3 },
    { x:300,  y:150,  z:120,  r:4,  phase:0.4 },
    { x:-285, y:165,  z:135,  r:4,  phase:0.9 },
    { x:135,  y:315,  z:90,   r:4,  phase:1.4 },
    { x:-120, y:-300, z:105,  r:4,  phase:1.9 },
    { x:315,  y:-135, z:-90,  r:4,  phase:2.4 },
  ]).current;

  const connections = useRef((() => {
    const list = [];
    for (let i = 0; i < nodes3D.length; i++) {
      for (let j = i + 1; j < nodes3D.length; j++) {
        const dx = nodes3D[i].x - nodes3D[j].x;
        const dy = nodes3D[i].y - nodes3D[j].y;
        const dz = nodes3D[i].z - nodes3D[j].z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (dist < 260) list.push([i, j, dist]);
      }
    }
    return list;
  })()).current;

  const signals = useRef(
    connections.map(conn => ({
      conn,
      t: Math.random(),
      speed: 0.004 + Math.random() * 0.005,
      active: Math.random() > 0.55,
    }))
  ).current;

  function project(x, y, z, rxRad, ryRad) {
    const x1 = x * Math.cos(ryRad) + z * Math.sin(ryRad);
    const z1 = -x * Math.sin(ryRad) + z * Math.cos(ryRad);
    const y2 = y * Math.cos(rxRad) - z1 * Math.sin(rxRad);
    const z2 = y * Math.sin(rxRad) + z1 * Math.cos(rxRad);
    const scale = FL / (FL + z2 + 200);
    return { sx: CX + x1 * scale, sy: CY + y2 * scale, scale, z: z2 };
  }

  useEffect(() => {
    const el     = containerRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    canvas.width  = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");

    gsap.set(el, { x: posX.current, y: posY.current, opacity: 0 });
    gsap.to(el, { opacity: 1, duration: 1.4, ease: "power2.out", delay: 0.6 });

    // Auto rotation
    floatRef.current = gsap.to(rotY, {
      current: rotY.current + 360,
      duration: 40,
      ease: "none",
      repeat: -1,
    });

    // Bob — both mobile and desktop
    const bobAnim = gsap.to(el, {
      y: `+=${isMobile ? 10 : 22}`,
      duration: isMobile ? 3 : 4.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 0.5,
    });

    // Draggable — BOTH mobile and desktop
    const draggable = Draggable.create(el, {
      type: "x,y",
      inertia: true,
      cursor: "grab",
      activeCursor: "grabbing",
      onDragStart(e) {
        isDrag.current = true;
        floatRef.current?.pause();
        bobAnim.pause();
        lastMX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
        lastMY.current = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
        gsap.to(el, { scale: 1.04, duration: 0.3, ease: "power2.out" });
      },
      onDrag(e) {
        const cx = e.clientX ?? e.touches?.[0]?.clientX ?? lastMX.current;
        const cy = e.clientY ?? e.touches?.[0]?.clientY ?? lastMY.current;
        const dx = cx - lastMX.current;
        const dy = cy - lastMY.current;
        velX.current = dy * 0.35;
        velY.current = dx * 0.35;
        rotX.current += velX.current;
        rotY.current += velY.current;
        lastMX.current = cx;
        lastMY.current = cy;
      },
      onDragEnd() {
        isDrag.current = false;
        gsap.to(el, {
          scale: 1, duration: 0.8, ease: "elastic.out(1,0.4)",
          onComplete: () => {
            floatRef.current?.play();
            bobAnim.play();
          },
        });
        gsap.to(velX, {
          current: 0, duration: 2.5, ease: "power2.out",
          onUpdate: () => {
            rotX.current += velX.current;
            rotY.current += velY.current;
          },
        });
        gsap.to(velY, { current: 0, duration: 2.5, ease: "power2.out" });
      },
    })[0];

    // Mouse parallax — desktop only
    const onMouseMove = (e) => {
      if (isDrag.current || isMobile) return;
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      gsap.to(el, {
        x: posX.current + (e.clientX - cx) * 0.045,
        y: posY.current + (e.clientY - cy) * 0.03,
        duration: 2, ease: "power1.out", overwrite: "auto",
      });
      rotY.current += (e.clientX - cx) * 0.0008;
      rotX.current += (e.clientY - cy) * 0.0005;
    };
    if (!isMobile) window.addEventListener("mousemove", onMouseMove);

    const nodeScale = isMobile ? 0.35 : 1;
    let frame = 0;
    const nodePhases = nodes3D.map(n => n.phase);

    function draw() {
      ctx.clearRect(0, 0, SIZE, SIZE);
      frame++;

      const rxRad = (rotX.current * Math.PI) / 180;
      const ryRad = (rotY.current * Math.PI) / 180;

      const projected = nodes3D.map(n => project(
        n.x * nodeScale,
        n.y * nodeScale,
        n.z * nodeScale,
        rxRad, ryRad
      ));

      const order = projected
        .map((p, i) => ({ i, z: p.z }))
        .sort((a, b) => a.z - b.z);

      const connsSorted = [...connections].sort((a, b) => {
        const za = (projected[a[0]].z + projected[a[1]].z) / 2;
        const zb = (projected[b[0]].z + projected[b[1]].z) / 2;
        return za - zb;
      });

      // Connections
      connsSorted.forEach(([i, j]) => {
        const pa = projected[i];
        const pb = projected[j];
        const avgZ = (pa.z + pb.z) / 2;
        const depthFade = Math.max(0, Math.min(1, (avgZ + 500) / 900));
        const alpha = depthFade * (0.07 + Math.sin(frame * 0.008 + i * 0.2) * 0.03);
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.strokeStyle = `rgba(44,100,200,${alpha})`;
        ctx.lineWidth   = 0.8 * Math.min(pa.scale, pb.scale) * 1.5;
        ctx.stroke();
      });

      // Signals
      signals.forEach((sig) => {
        if (!sig.active) {
          if (Math.random() < 0.004) { sig.active = true; sig.t = 0; }
          return;
        }
        sig.t += sig.speed;
        if (sig.t >= 1) { sig.active = false; sig.t = 0; return; }

        const [a, b] = sig.conn;
        const pa = projected[a];
        const pb = projected[b];
        const sx = pa.sx + (pb.sx - pa.sx) * sig.t;
        const sy = pa.sy + (pb.sy - pa.sy) * sig.t;
        const sz = pa.z  + (pb.z  - pa.z)  * sig.t;
        const depthFade = Math.max(0, Math.min(1, (sz + 500) / 900));
        const alpha = Math.sin(sig.t * Math.PI) * depthFade;
        const sc    = pa.scale + (pb.scale - pa.scale) * sig.t;

        ctx.beginPath();
        ctx.arc(sx, sy, 3 * sc, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120,180,255,${alpha * 0.95})`;
        ctx.fill();

        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 12 * sc);
        grad.addColorStop(0, `rgba(100,170,255,${alpha * 0.5})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(sx, sy, 12 * sc, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Nodes
      order.forEach(({ i }) => {
        const n     = nodes3D[i];
        const p     = projected[i];
        const pulse = Math.sin(frame * 0.025 + nodePhases[i]) * 0.5 + 0.5;
        const r     = (n.r + pulse * 2.5) * p.scale * 2.2;
        const depthFade = Math.max(0, Math.min(1, (p.z + 500) / 900));
        const alpha = (0.4 + pulse * 0.6) * depthFade;

        const glowR = r * 4;
        const grad = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, glowR);
        grad.addColorStop(0, `rgba(44,120,220,${alpha * 0.35})`);
        grad.addColorStop(0.5, `rgba(44,80,180,${alpha * 0.15})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        const coreGrad = ctx.createRadialGradient(
          p.sx - r * 0.3, p.sy - r * 0.3, 0,
          p.sx, p.sy, r
        );
        coreGrad.addColorStop(0, `rgba(160,210,255,${alpha * 0.95})`);
        coreGrad.addColorStop(0.4, `rgba(60,130,220,${alpha * 0.9})`);
        coreGrad.addColorStop(1, `rgba(20,60,140,${alpha * 0.7})`);
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.sx - r * 0.28, p.sy - r * 0.28, r * 0.32, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,240,255,${alpha * 0.6})`;
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      floatRef.current?.kill();
      bobAnim.kill();
      draggable?.kill();
      cancelAnimationFrame(animFrameRef.current);
      if (!isMobile) window.removeEventListener("mousemove", onMouseMove);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  return (
    <div ref={containerRef} style={{
      position: "absolute",
      top: isMobile ? "62%" : "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      cursor: "grab",
      zIndex: isMobile ? 1 : 2,
      userSelect: "none",
      willChange: "transform",
    }}>
      <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{
        display: "block",
        filter: isMobile
          ? "drop-shadow(0 0 30px rgba(44,100,200,0.4))"
          : "drop-shadow(0 0 60px rgba(44,100,200,0.55)) drop-shadow(0 0 120px rgba(44,80,180,0.25))",
      }}/>
    </div>
  );
}

const Hero = forwardRef(function Hero({ isMobile }, ref) {
  const bp        = useBreakpoint();
  const isTablet  = bp === "tablet";

  const lettersRef    = useRef([]);
  const bottomRowRef  = useRef(null);
  const glowRef       = useRef(null);
  const cursorRingRef = useRef(null);
  const subtitleRef   = useRef(null);
  const lineRef       = useRef(null);
  const taglineRef    = useRef(null);
  const hasEntered    = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasEntered.current) return;
      hasEntered.current = true;
      runEntrance();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  function runEntrance() {
    lettersRef.current.forEach((el) => {
      if (!el) return;
      gsap.set(el, { opacity:1, y:140, rotateX:-80, transformOrigin:"50% 100%" });
    });
    gsap.set(lineRef.current,     { scaleX:0, transformOrigin:"left" });
    gsap.set(subtitleRef.current, { opacity:0, y:10 });
    gsap.set(taglineRef.current,  { opacity:0, x:-20 });
    gsap.set(bottomRowRef.current,{ opacity:0, y:24 });

    const tl = gsap.timeline();
    tl.to(lettersRef.current, {
      y:0, rotateX:0,
      duration:1.1, ease:"power4.out",
      stagger:{ each:0.07, from:"start" },
    });
    tl.to(lineRef.current,     { scaleX:1, duration:0.7, ease:"power3.inOut" }, "-=0.5");
    tl.to(subtitleRef.current, { opacity:1, y:0, duration:0.7, ease:"power3.out" }, "-=0.4");
    tl.to(taglineRef.current,  { opacity:1, x:0, duration:0.6, ease:"power3.out" }, "-=0.5");
    tl.to(bottomRowRef.current,{ opacity:1, y:0, duration:0.7, ease:"power3.out" }, "-=0.4");
  }

  useEffect(() => {
    if (isMobile) return;
    const section = ref?.current;
    const onMove = (e) => {
      gsap.to(glowRef.current,       { x:e.clientX, y:e.clientY, duration:2,   ease:"power2.out" });
      gsap.to(cursorRingRef.current, { x:e.clientX, y:e.clientY, duration:0.5, ease:"power2.out" });
      lettersRef.current.forEach((el) => {
        if (!el) return;
        const r   = el.getBoundingClientRect();
        const cx  = r.left + r.width  / 2;
        const cy  = r.top  + r.height / 2;
        const dx  = e.clientX - cx;
        const dy  = e.clientY - cy;
        const str = Math.max(0, 1 - Math.hypot(dx,dy) / 320) * 0.05;
        gsap.to(el, { x:dx*str, y:dy*str, duration:0.9, ease:"power2.out" });
      });
    };
    const onLeave = () =>
      lettersRef.current.forEach(el => el && gsap.to(el, { x:0, y:0, duration:1.0, ease:"elastic.out(1,0.4)" }));
    window.addEventListener("mousemove", onMove);
    section?.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      section?.removeEventListener("mouseleave", onLeave);
    };
  }, [isMobile, ref]);

  const onLetterEnter = (e) => {
    if (isMobile) return;
    e.currentTarget.style.color = "#2C5584";
    e.currentTarget.style.webkitTextStroke = "1px #2C5584";
    gsap.to(e.currentTarget, { scale:1.08, duration:0.3, ease:"power2.out" });
    gsap.to(cursorRingRef.current, { scale:2.5, duration:0.3 });
  };
  const onLetterLeave = (e) => {
    if (isMobile) return;
    e.currentTarget.style.color = "transparent";
    e.currentTarget.style.webkitTextStroke = "1px rgba(255,255,255,0.72)";
    gsap.to(e.currentTarget, { scale:1, duration:0.8, ease:"elastic.out(1,0.4)" });
    gsap.to(cursorRingRef.current, { scale:1, duration:0.3 });
  };

  const ml = { fontSize:"9px",  letterSpacing:"0.45em", textTransform:"uppercase", color:"rgba(255,255,255,0.22)", marginBottom:"6px" };
  const mv = { fontSize:"11px", letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(255,255,255,0.58)" };

  return (
    <>
      {!isMobile && !isTablet && (
        <div ref={cursorRingRef} aria-hidden="true" style={{
          position:"fixed",top:0,left:0,width:"36px",height:"36px",borderRadius:"50%",
          border:"1px solid rgba(44,85,132,0.5)",pointerEvents:"none",
          zIndex:9998,transform:"translate(-50%,-50%)",
        }}/>
      )}

      <section ref={ref} style={{
        position:"fixed",inset:0,width:"100%",height:"100vh",
        background:"#080808",overflow:"hidden",
        display:"flex",flexDirection:"column",
        justifyContent: isMobile ? "flex-start" : "center",
        paddingTop: isMobile ? "15%" : "0",
        alignItems: isTablet||isMobile ? "center" : "flex-start",
        paddingLeft:  isTablet||isMobile ? "20px" : "8%",
        paddingRight: isTablet||isMobile ? "20px" : "52%",
        cursor: isMobile||isTablet ? "auto" : "none",
        perspective: "1000px",
      }}>

        {/* Ambient glow */}
        <div ref={glowRef} aria-hidden="true" style={{
          position:"absolute",top:0,left:0,
          width:"700px",height:"700px",borderRadius:"50%",
          background:"radial-gradient(circle, rgba(44,85,132,0.12) 0%, transparent 65%)",
          pointerEvents:"none",filter:"blur(60px)",zIndex:0,
          transform:"translate(-50%,-50%)",
        }}/>

        {/* Corner brackets */}
        {[
          {top:"24px",left:"24px",    borderTop:"1px solid rgba(44,85,132,0.28)",borderLeft:"1px solid rgba(44,85,132,0.28)"},
          {top:"24px",right:"24px",   borderTop:"1px solid rgba(44,85,132,0.28)",borderRight:"1px solid rgba(44,85,132,0.28)"},
          {bottom:"24px",left:"24px", borderBottom:"1px solid rgba(44,85,132,0.28)",borderLeft:"1px solid rgba(44,85,132,0.28)"},
          {bottom:"24px",right:"24px",borderBottom:"1px solid rgba(44,85,132,0.28)",borderRight:"1px solid rgba(44,85,132,0.28)"},
        ].map((s,i) => (
          <div key={i} aria-hidden="true" style={{position:"absolute",width:"20px",height:"20px",pointerEvents:"none",zIndex:1,...s}}/>
        ))}

        {/* Neural brain */}
        <NeuralBrain isMobile={isMobile} />


        {/* Big letters */}
        <div style={{
          display:"flex",
          justifyContent: isTablet||isMobile ? "center" : "flex-start",
          alignItems:"center",
          gap:"clamp(2px,0.6vw,10px)",
          position:"relative",zIndex:3,
          perspective:"800px",
          overflow:"visible",
        }}>
          {LETTERS.map((letter, i) => (
            <span key={i} ref={(el) => (lettersRef.current[i] = el)}
              style={{
                display:"inline-block",
                fontSize: isMobile
                  ? "clamp(3.8rem,20vw,6rem)"
                  : isTablet
                  ? "clamp(4rem,14vw,9rem)"
                  : "clamp(5rem,12vw,13rem)",
                fontWeight:900,lineHeight:0.88,letterSpacing:"-0.04em",
                color:"transparent",
                WebkitTextStroke: isMobile ? "1px rgba(255,255,255,0.6)" : "1px rgba(255,255,255,0.75)",
                userSelect:"none",willChange:"transform",
                transition:"color 0.2s, -webkit-text-stroke 0.2s",
                transformStyle:"preserve-3d",
              }}
              onMouseEnter={onLetterEnter}
              onMouseLeave={onLetterLeave}
            >{letter}</span>
          ))}
        </div>

        {/* Thin rule */}
        <div ref={lineRef} style={{
          width:"clamp(180px,40vw,420px)",height:"1px",
          background:"linear-gradient(90deg,rgba(44,85,132,0.8),rgba(44,85,132,0.2),transparent)",
          marginTop:"16px",zIndex:3,
        }}/>

        {/* Subtitle row */}
        <div style={{ display:"flex", alignItems:"center", gap:"24px", marginTop:"18px", zIndex:3 }}>
          <p ref={subtitleRef} style={{
            fontSize: isMobile?"10px":isTablet?"10px":"12px",
            letterSpacing:"0.48em",textTransform:"uppercase",
            color:"rgba(255,255,255,0.22)",margin:0,
          }}>Web Developer</p>
          <span ref={taglineRef} style={{
            width:"4px",height:"4px",borderRadius:"50%",
            background:"rgba(44,85,132,0.8)",display:"inline-block",
          }}/>
        </div>

        {/* Bottom row */}
        <div ref={bottomRowRef} style={{
          position:"absolute",
          bottom: isMobile?"16px":isTablet?"80px":"88px",
          left:0,right:0,
          padding: isMobile?"0 20px":isTablet?"0 32px":"0 52px",
          display:"flex",
          justifyContent: isMobile?"center":"space-between",
          alignItems:"flex-end",zIndex:3,
        }}>
          {!isMobile && <div><p style={ml}>Based in</p><p style={mv}>Algeria</p></div>}

          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"8px"}}>
            <div style={{width:"1px",height:isMobile?"36px":"52px",background:"linear-gradient(to bottom, rgba(44,85,132,0.8), transparent)"}}/>
            <span style={{fontSize:"7px",letterSpacing:"0.4em",textTransform:"uppercase",color:"rgba(255,255,255,0.13)"}}>
              {isMobile ? "Swipe" : "Scroll"}
            </span>
          </div>

          {!isMobile && (
            <div style={{textAlign:"right"}}>
              <p style={ml}>Work</p>
              <Link to="/projects"
                style={{...mv,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"8px"}}
                onMouseEnter={(e)=>{e.currentTarget.style.color="#2C5584";gsap.to(e.currentTarget,{x:6,duration:0.3,ease:"power2.out"});}}
                onMouseLeave={(e)=>{e.currentTarget.style.color="rgba(255,255,255,0.58)";gsap.to(e.currentTarget,{x:0,duration:0.3});}}
              >View Projects <span>→</span></Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
});

export default Hero;