import { useEffect, useState } from "react";
import { scrollManager } from "../utils/ScrollManager";
import Hero      from "../components/sections/Hero";
import About     from "../components/sections/About";
import TechStack from "../components/sections/TechStack";
import Contact   from "../components/sections/Contact";

const SECTIONS = ["Hero", "About", "Stack", "Contact"];

function NavDots({ current, total, onChange }) {
  return (
    <div style={{
      position: "fixed", right: "28px", top: "50%",
      transform: "translateY(-50%)",
      display: "flex", flexDirection: "column", gap: "14px",
      zIndex: 1000,
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          title={SECTIONS[i]}
          style={{
            width: i === current ? "24px" : "6px",
            height: "6px", borderRadius: "3px",
            background: i === current ? "#2C5584" : "rgba(255,255,255,0.2)",
            border: "none", cursor: "pointer", padding: 0,
            transition: "width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.3s",
            outline: "none",
          }}
        />
      ))}
    </div>
  );
}

function GrainOverlay() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9990, pointerEvents: "none",
      opacity: 0.032,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat", backgroundSize: "128px 128px",
    }} />
  );
}

export default function Home() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    scrollManager.onSectionChange = (i) => setCurrent(i);
    const timer = setTimeout(() => { scrollManager.init(); }, 100);
    return () => {
      clearTimeout(timer);
      scrollManager.onSectionChange = null;
      scrollManager.destroy();
      scrollManager.sections       = [];
      scrollManager.currentSection = 0;
      scrollManager.isAnimating    = false;
    };
  }, []);

  return (
    <main style={{ height: "100vh", overflow: "hidden", background: "#080808", cursor: "none" }}>
      <GrainOverlay />
      <NavDots current={current} total={SECTIONS.length} onChange={(i) => scrollManager.jumpTo(i)} />
      <Hero />
      <About />
      <TechStack />
      <Contact />
    </main>
  );
}