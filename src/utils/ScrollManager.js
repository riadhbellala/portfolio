import gsap from "gsap";

// No Observer — using native wheel + touch events directly
// deltaY > 0 = wheel scrolling DOWN  = navigate forward
// deltaY < 0 = wheel scrolling UP    = navigate backward
// This is the most reliable cross-platform approach

class ScrollManager {
  constructor() {
    this.sections         = [];
    this.currentSection   = 0;
    this.isAnimating      = false;
    this._wheelHandler    = null;
    this._touchStartY     = 0;
    this._touchHandler    = null;
    this._touchEndHandler = null;
  }

  register(el, steps) {
    this.sections.push({ el, steps, currentStep: 0 });
  }

  init() {
    if (this.sections.length === 0) return;

    // Show only first section
    gsap.set(this.sections[0].el, { autoAlpha: 1, zIndex: 2 });
    this.sections.slice(1).forEach((s) =>
      gsap.set(s.el, { autoAlpha: 0, zIndex: 1 })
    );

    // Wheel — deltaY positive = scrolled down = go forward
    this._wheelHandler = (e) => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1;
      this.navigate(dir);
    };

    // Touch
    this._touchHandler = (e) => {
      this._touchStartY = e.touches[0].clientY;
    };
    this._touchEndHandler = (e) => {
      const delta = this._touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 30) return;
      this.navigate(delta > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", this._wheelHandler, { passive: false });
    window.addEventListener("touchstart", this._touchHandler, { passive: true });
    window.addEventListener("touchend", this._touchEndHandler, { passive: true });
  }

  navigate(direction) {
    if (this.isAnimating) return;
    const current = this.sections[this.currentSection];

    if (direction === 1) {
      const hasNextStep = current.currentStep < current.steps.length - 1;
      if (hasNextStep) {
        this.isAnimating = true;
        current.steps[current.currentStep].out(() => {
          current.currentStep++;
          current.steps[current.currentStep].in(() => {
            this.isAnimating = false;
          });
        }, false);
      } else {
        const next = this.currentSection + 1;
        if (next < this.sections.length) {
          this.isAnimating = true;
          this.transitionTo(next, "down");
        }
      }
    } else {
      const hasPrevStep = current.currentStep > 0;
      if (hasPrevStep) {
        this.isAnimating = true;
        current.steps[current.currentStep].out(() => {
          current.currentStep--;
          current.steps[current.currentStep].in(() => {
            this.isAnimating = false;
          });
        }, true);
      } else {
        const prev = this.currentSection - 1;
        if (prev >= 0) {
          this.isAnimating = true;
          this.transitionTo(prev, "up");
        }
      }
    }
  }

  transitionTo(nextIndex, direction) {
    const cur  = this.sections[this.currentSection];
    const next = this.sections[nextIndex];

    gsap.set(next.el, { autoAlpha: 1, zIndex: 3 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(cur.el,  { autoAlpha: 0, zIndex: 1 });
        gsap.set(next.el, { zIndex: 2 });
        this.currentSection = nextIndex;

        if (direction === "down") {
          next.currentStep = 0;
          next.steps[0].in(() => { this.isAnimating = false; });
        } else {
          const last = next.steps.length - 1;
          next.currentStep = last;
          next.steps[last].in(() => { this.isAnimating = false; });
        }
      },
    });

    if (direction === "down") {
      tl.to(cur.el,  { yPercent: -100, duration: 1, ease: "power3.inOut" });
      gsap.set(next.el, { yPercent: 100 });
      tl.to(next.el, { yPercent: 0,    duration: 1, ease: "power3.inOut" }, "<");
    } else {
      tl.to(cur.el,  { yPercent:  100, duration: 1, ease: "power3.inOut" });
      gsap.set(next.el, { yPercent: -100 });
      tl.to(next.el, { yPercent: 0,    duration: 1, ease: "power3.inOut" }, "<");
    }
  }

  destroy() {
    if (this._wheelHandler)    window.removeEventListener("wheel", this._wheelHandler);
    if (this._touchHandler)    window.removeEventListener("touchstart", this._touchHandler);
    if (this._touchEndHandler) window.removeEventListener("touchend", this._touchEndHandler);
  }
}

export const scrollManager = new ScrollManager();