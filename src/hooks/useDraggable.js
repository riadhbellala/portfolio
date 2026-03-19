import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

export function useDraggable(ref, options = {}) {
  const {
    floatY        = 18,
    floatDuration = 3.5,
    floatRotation = 6,
    floatDelay    = 0,
    bounds        = null,
    inertia       = true,
    parallaxStr   = 0.018,
  } = options;

  const floatAnim  = useRef(null);
  const draggable  = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    floatAnim.current = gsap.to(el, {
      y:        floatY,
      rotation: floatRotation,
      duration: floatDuration,
      ease:     "sine.inOut",
      repeat:   -1,
      yoyo:     true,
      delay:    floatDelay,
    });

    draggable.current = Draggable.create(el, {
      type:         "x,y",
      inertia,
      bounds,
      cursor:       "grab",
      activeCursor: "grabbing",
      onDragStart() {
        isDragging.current = true;
        floatAnim.current?.pause();
        gsap.to(el, { scale: 1.08, rotation: 8, duration: 0.3, ease: "power2.out" });
      },
      onDragEnd() {
        isDragging.current = false;
        gsap.to(el, {
          scale: 1, rotation: 0,
          duration: 0.5, ease: "elastic.out(1, 0.5)",
          onComplete: () => floatAnim.current?.play(),
        });
      },
    })[0];

    const onMouseMove = (e) => {
      if (isDragging.current) return;
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      gsap.to(el, {
        x: `+=${(e.clientX - cx) * parallaxStr}`,
        y: `+=${(e.clientY - cy) * parallaxStr}`,
        duration: 1.2, ease: "power1.out", overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      floatAnim.current?.kill();
      draggable.current?.kill();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [ref, floatY, floatDuration, floatRotation, floatDelay, bounds, inertia, parallaxStr]);
}