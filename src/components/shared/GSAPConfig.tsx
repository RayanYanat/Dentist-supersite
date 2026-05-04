"use client";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

/**
 * Global GSAP configuration — mounts once, no DOM output.
 *
 * Everything in useEffect (browser-only).
 * Module-level GSAP calls crash Next.js SSR — "use client" module code
 * still runs on the server where browser APIs don't exist.
 *
 * ignoreMobileResize: true → prevents phantom ScrollTrigger recalculations
 * when iOS browser chrome shows/hides during scroll.
 */
export default function GSAPConfig() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }, []);

  return null;
}
