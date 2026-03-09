import { useEffect } from "react";
import { scrollManager } from "../utils/ScrollManager";
import Hero      from "../components/sections/Hero";
import About     from "../components/sections/About";
import TechStack from "../components/sections/TechStack";
import Contact   from "../components/sections/Contact";

export default function Home() {
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollManager.init();
    }, 100);

    return () => {
      clearTimeout(timer);
      scrollManager.destroy();
      scrollManager.sections       = [];
      scrollManager.currentSection = 0;
      scrollManager.isAnimating    = false;
    };
  }, []);

  return (
    <main style={{
      height: "100vh",
      overflow: "hidden",
      background: "#080808",
      cursor: "none",
    }}>
      <Hero />
      <About />
      <TechStack />
      <Contact />
    </main>
  );
}