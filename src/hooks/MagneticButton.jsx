import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useMagnet } from "./useMagnet";

export default function MagneticButton({ children, onClick, style = {}, className = "" }) {
  const outerRef = useMagnet({ strength: 0.35, radius: 80 });
  const innerRef = useRef(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const onMove = (e) => {
      const rect = outer.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = e.clientX - cx;
      const dy   = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 80) {
        gsap.to(inner, { x: dx * 0.15, y: dy * 0.15, duration: 0.3, ease: "power2.out" });
      } else {
        gsap.to(inner, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.4)" });
      }
    };

    const onLeave = () => {
      gsap.to(inner, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
    };

    window.addEventListener("mousemove", onMove);
    outer.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      outer.removeEventListener("mouseleave", onLeave);
    };
  }, [outerRef]);

  return (
    <div
      ref={outerRef}
      onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", ...style }}
      className={className}
    >
      <span ref={innerRef} style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
        {children}
      </span>
    </div>
  );
}