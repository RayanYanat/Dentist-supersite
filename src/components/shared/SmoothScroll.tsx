"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

/**
 * SmoothScroll — Lenis-powered inertia scrolling, desktop only.
 *
 * Why Lenis:
 *   The single biggest perceptual delta between "premium" and "template"
 *   sites is scroll inertia. With native scroll, the page feels like a
 *   stack of elements; with Lenis, it feels like a single object moving
 *   through a viewport. That alone shifts the brand register from
 *   Squarespace to Maison de Luxe.
 *
 * iOS safety (CLAUDE.md):
 *   - smoothWheel: true on desktop only — touch devices keep NATIVE scroll
 *     (smoothTouch defaults to false; we don't override).
 *   - No ScrollTrigger.normalizeScroll(true) — that one's an iOS killer.
 *   - prefers-reduced-motion respected: bail entirely, just return.
 *
 * GSAP integration:
 *   - Lenis pushes scroll updates through gsap.ticker so ScrollTrigger
 *     stays in sync with the smoothed scroll position. Without this,
 *     scrub: 1 animations would lag visibly behind the visual scroll.
 *   - lagSmoothing(0) disables GSAP's auto-catch-up on slow frames so
 *     Lenis remains the single source of truth.
 */
export default function SmoothScroll() {
  useEffect(() => {
    /* Reduced-motion users opt out — accessibility + iOS safety net */
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    /* Touch devices: Lenis on desktop only.
     * matchMedia("(pointer: fine)") is the cleanest "is this a real mouse"
     * detection — covers laptops/desktops, excludes phones/tablets.
     * On touch we keep native scroll for momentum + iOS safe-area behavior. */
    const hasFinePointer = window.matchMedia?.("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration:           1.15,    /* a touch slower than default — heavier feel */
      easing:             (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel:        true,
      wheelMultiplier:    1.0,
      touchMultiplier:    2.0,
      infinite:           false,
    });

    /* Bridge Lenis → ScrollTrigger.
     * Every scroll event fires ScrollTrigger.update so any scrub:1
     * animations track the smoothed position, not the native one. */
    lenis.on("scroll", ScrollTrigger.update);

    /* Drive Lenis from GSAP's ticker — single rAF loop for both. */
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
