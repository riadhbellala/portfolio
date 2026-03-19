import { useRef, useEffect } from "react";
import gsap from "gsap";

export function useMagnet(options = {}) {
  const {
    strength       = 0.35,
    radius         = 80,
    ease           = "power2.out",
    duration       = 0.4,
    returnDuration = 0.7,
    returnEase     = "elastic.out(1, 0.4)",
  } = options;

  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = e.clientX - cx;
      const dy   = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        gsap.to(el, { x: dx * strength, y: dy * strength, duration, ease });
      } else {
        gsap.to(el, { x: 0, y: 0, duration: returnDuration, ease: returnEase });
      }
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: returnDuration, ease: returnEase });
    };

    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, radius, ease, duration, returnDuration, returnEase]);

  return ref;
}