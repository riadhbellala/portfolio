import { useRef } from "react";
import { useDraggable } from "./useDraggable";

export default function FloatingShape({
  shape = "ring",
  size  = 120,
  color = "rgba(44,85,132,0.35)",
  style = {},
}) {
  const ref = useRef(null);

  // useRef runs once on mount — satisfies react-hooks/purity (no useMemo needed)
  const rand = useRef({
    floatY:        12 + Math.random() * 16,
    floatDuration: 2.8 + Math.random() * 2,
    floatRotation: (Math.random() - 0.5) * 12,
    floatDelay:    Math.random() * 2,
    parallaxStr:   0.012 + Math.random() * 0.02,
  }).current;

  useDraggable(ref, {
    floatY:        rand.floatY,
    floatDuration: rand.floatDuration,
    floatRotation: rand.floatRotation,
    floatDelay:    rand.floatDelay,
    parallaxStr:   rand.parallaxStr,
  });

  const svgs = {
    ring: (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="1.5"/>
        <circle cx="50" cy="50" r="28" stroke={color} strokeWidth="0.8" strokeDasharray="4 4"/>
      </svg>
    ),
    circle: (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="42" fill={color}/>
      </svg>
    ),
    triangle: (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <polygon points="50,8 95,88 5,88" stroke={color} strokeWidth="1.5" fill="none"/>
        <polygon points="50,24 80,76 20,76" stroke={color} strokeWidth="0.8" strokeDasharray="3 3" fill="none"/>
      </svg>
    ),
    cross: (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <line x1="50" y1="10" x2="50" y2="90" stroke={color} strokeWidth="1.5"/>
        <line x1="10" y1="50" x2="90" y2="50" stroke={color} strokeWidth="1.5"/>
        <circle cx="50" cy="50" r="6" fill={color}/>
      </svg>
    ),
    "dot-grid": (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {[20,50,80].map(x =>
          [20,50,80].map(y => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill={color}/>
          ))
        )}
      </svg>
    ),
    sphere: (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="42" stroke={color} strokeWidth="1.5"/>
        <ellipse cx="50" cy="50" rx="42" ry="16" stroke={color} strokeWidth="0.8" strokeDasharray="3 3"/>
        <ellipse cx="50" cy="50" rx="16" ry="42" stroke={color} strokeWidth="0.8"/>
        <circle cx="50" cy="50" r="3" fill={color}/>
      </svg>
    ),
  };

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        userSelect: "none",
        willChange: "transform",
        cursor: "grab",
        zIndex: 2,
        filter: `drop-shadow(0 0 18px ${color})`,
        ...style,
      }}
    >
      {svgs[shape] || svgs.ring}
    </div>
  );
}