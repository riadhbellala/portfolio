import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

const GlobalBrain = forwardRef(function GlobalBrain({ isMobile }, ref) {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const animFrameRef = useRef(null);
  const floatRef     = useRef(null);
  const bobRef       = useRef(null);
  const isDrag       = useRef(false);
  const rotX         = useRef(-15);
  const rotY         = useRef(20);
  const velX         = useRef(0);
  const velY         = useRef(0);
  const lastMX       = useRef(0);
  const lastMY       = useRef(0);
  const currentSpeed = useRef(0.3);
  const sceneRef     = useRef(0);

  const SIZE = isMobile ? 260 : 680;
  const CX   = SIZE / 2;
  const CY   = SIZE / 2;
  const FL   = 800;

  const SCENES = useRef([
    { getX: ()=> isMobile ? 0 : window.innerWidth * 0.27,  y: 0,   scale: 1,    opacity: 1,    speed: 0.3 },
    { getX: ()=> isMobile ? 0 : -window.innerWidth * 0.22, y: 40,  scale: 0.72, opacity: 0.55, speed: 0.7 },
    { getX: ()=> isMobile ? 0 : window.innerWidth * 0.18,  y: -30, scale: 0.58, opacity: 0.45, speed: 1.2 },
    { getX: ()=> isMobile ? 0 : window.innerWidth * 0.20,  y: 20,  scale: 0.68, opacity: 0.5,  speed: 0.5 },
  ]).current;

  useImperativeHandle(ref, () => ({
    goToScene(index, direction) {
      const scene = SCENES[index];
      if (!scene) return;
      sceneRef.current = index;
      const el = containerRef.current;
      if (!el) return;

      floatRef.current?.pause();
      bobRef.current?.pause();

      const tx = scene.getX();
      const ty = scene.y;

      gsap.to(el, {
        x: tx, y: ty,
        scale: scene.scale,
        opacity: scene.opacity,
        duration: 1.0,
        ease: "power3.inOut",
        onComplete: () => {
          floatRef.current?.play();
          bobRef.current?.play();
        },
      });

      const burst = direction === "down" ? 1 : -1;
      rotY.current += burst * 30;
      rotX.current += burst * 10;

      gsap.to(currentSpeed, {
        current: scene.speed,
        duration: 1.2,
        ease: "power2.out",
      });
    },
  })); // eslint-disable-line react-hooks/exhaustive-deps

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

    const initX = isMobile ? 0 : window.innerWidth * 0.27;
    gsap.set(el, { x: initX, y: 0, opacity: 0, scale: 1 });
    gsap.to(el,  { opacity: 1, duration: 1.4, ease: "power2.out", delay: 0.6 });

    floatRef.current = gsap.to(rotY, {
      current: rotY.current + 360,
      duration: 40, ease: "none", repeat: -1,
    });

    bobRef.current = gsap.to(el, {
      y: `+=${isMobile ? 10 : 22}`,
      duration: isMobile ? 3 : 4.5,
      ease: "sine.inOut", repeat: -1, yoyo: true, delay: 0.5,
    });

    const draggable = Draggable.create(el, {
      type: "x,y",
      inertia: true,
      cursor: "grab",
      activeCursor: "grabbing",
      onDragStart(e) {
        isDrag.current = true;
        floatRef.current?.pause();
        bobRef.current?.pause();
        lastMX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
        lastMY.current = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
        gsap.to(el, {
          scale: SCENES[sceneRef.current].scale * 1.05,
          duration: 0.3, ease: "power2.out",
        });
      },
      onDrag(e) {
        const cx = e.clientX ?? e.touches?.[0]?.clientX ?? lastMX.current;
        const cy = e.clientY ?? e.touches?.[0]?.clientY ?? lastMY.current;
        velX.current = (cy - lastMY.current) * 0.35;
        velY.current = (cx - lastMX.current) * 0.35;
        rotX.current += velX.current;
        rotY.current += velY.current;
        lastMX.current = cx;
        lastMY.current = cy;
      },
      onDragEnd() {
        isDrag.current = false;
        const scene = SCENES[sceneRef.current];
        gsap.to(el, {
          scale: scene.scale, duration: 0.8, ease: "elastic.out(1,0.4)",
          onComplete: () => {
            floatRef.current?.play();
            bobRef.current?.play();
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

    const onMouseMove = (e) => {
      if (isDrag.current || isMobile) return;
      const scene = SCENES[sceneRef.current];
      const baseX = scene.getX();
      const baseY = scene.y;
      gsap.to(el, {
        x: baseX + (e.clientX - window.innerWidth  / 2) * 0.04,
        y: baseY + (e.clientY - window.innerHeight / 2) * 0.025,
        duration: 2, ease: "power1.out", overwrite: "auto",
      });
      rotY.current += (e.clientX - window.innerWidth  / 2) * 0.0006;
      rotX.current += (e.clientY - window.innerHeight / 2) * 0.0004;
    };
    if (!isMobile) window.addEventListener("mousemove", onMouseMove);

    const nodeScale  = isMobile ? 0.35 : 1;
    const nodePhases = nodes3D.map(n => n.phase);
    let frame = 0;

    function draw() {
      ctx.clearRect(0, 0, SIZE, SIZE);
      frame++;
      rotY.current += currentSpeed.current * 0.3;

      const rxRad = (rotX.current * Math.PI) / 180;
      const ryRad = (rotY.current * Math.PI) / 180;

      const projected = nodes3D.map(n => project(
        n.x * nodeScale, n.y * nodeScale, n.z * nodeScale,
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

      connsSorted.forEach(([i, j]) => {
        const pa = projected[i];
        const pb = projected[j];
        const avgZ = (pa.z + pb.z) / 2;
        const df = Math.max(0, Math.min(1, (avgZ + 500) / 900));
        const alpha = df * (0.07 + Math.sin(frame * 0.008 + i * 0.2) * 0.03);
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.strokeStyle = `rgba(44,100,200,${alpha})`;
        ctx.lineWidth   = 0.8 * Math.min(pa.scale, pb.scale) * 1.5;
        ctx.stroke();
      });

      signals.forEach((sig) => {
        if (!sig.active) {
          if (Math.random() < 0.004) { sig.active = true; sig.t = 0; }
          return;
        }
        sig.t += sig.speed;
        if (sig.t >= 1) { sig.active = false; sig.t = 0; return; }
        const [a, b] = sig.conn;
        const pa = projected[a], pb = projected[b];
        const sx = pa.sx + (pb.sx - pa.sx) * sig.t;
        const sy = pa.sy + (pb.sy - pa.sy) * sig.t;
        const sz = pa.z  + (pb.z  - pa.z)  * sig.t;
        const df = Math.max(0, Math.min(1, (sz + 500) / 900));
        const alpha = Math.sin(sig.t * Math.PI) * df;
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

      order.forEach(({ i }) => {
        const n     = nodes3D[i];
        const p     = projected[i];
        const pulse = Math.sin(frame * 0.025 + nodePhases[i]) * 0.5 + 0.5;
        const r     = (n.r + pulse * 2.5) * p.scale * 2.2;
        const df    = Math.max(0, Math.min(1, (p.z + 500) / 900));
        const alpha = (0.4 + pulse * 0.6) * df;

        const glowR = r * 4;
        const gGlow = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, glowR);
        gGlow.addColorStop(0,   `rgba(44,120,220,${alpha * 0.35})`);
        gGlow.addColorStop(0.5, `rgba(44,80,180,${alpha * 0.15})`);
        gGlow.addColorStop(1,   "transparent");
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, glowR, 0, Math.PI * 2);
        ctx.fillStyle = gGlow;
        ctx.fill();

        const gCore = ctx.createRadialGradient(
          p.sx - r * 0.3, p.sy - r * 0.3, 0,
          p.sx, p.sy, r
        );
        gCore.addColorStop(0,   `rgba(160,210,255,${alpha * 0.95})`);
        gCore.addColorStop(0.4, `rgba(60,130,220,${alpha * 0.9})`);
        gCore.addColorStop(1,   `rgba(20,60,140,${alpha * 0.7})`);
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fillStyle = gCore;
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
      bobRef.current?.kill();
      draggable?.kill();
      cancelAnimationFrame(animFrameRef.current);
      if (!isMobile) window.removeEventListener("mousemove", onMouseMove);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  return (
    <div ref={containerRef} style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      cursor: "grab",
      zIndex: 5,           // between base(0) and sections(10+)
      userSelect: "none",
      willChange: "transform",
      pointerEvents: "auto",
    }}>
      <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{
        display: "block",
        filter: isMobile
          ? "drop-shadow(0 0 30px rgba(44,100,200,0.4))"
          : "drop-shadow(0 0 60px rgba(44,100,200,0.55)) drop-shadow(0 0 120px rgba(44,80,180,0.25))",
      }}/>
    </div>
  );
});

export default GlobalBrain;