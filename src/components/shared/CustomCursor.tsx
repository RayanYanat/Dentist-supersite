"use client";
import { useEffect, useRef } from "react";

/**
 * Gold atelier cursor — desktop only (pointer: fine).
 *
 * Two-layer design:
 *   • Dot  — 4 px solid gold, tracks cursor exactly via rAF
 *   • Ring — 28 px thin square ring (slight border-radius), lags with lerp
 *
 * On interactive elements: ring expands to 44 px + brightens.
 * On hover: uses event delegation → covers dynamically rendered React elements.
 *
 * cursor: none set on <html> (not body) for full coverage.
 */
export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement;
    root.style.cursor = "none";

    let mouseX = -200, mouseY = -200;
    let ringX  = -200, ringY  = -200;
    let hovering = false;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      const lerp = hovering ? 0.14 : 0.10;
      ringX += (mouseX - ringX) * lerp;
      ringY += (mouseY - ringY) * lerp;

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const SELECTOR = "a, button, [role=button], label, input, textarea, select";

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(SELECTOR)) {
        hovering = true;
        if (ringRef.current) {
          ringRef.current.style.width       = "44px";
          ringRef.current.style.height      = "44px";
          ringRef.current.style.borderColor = "rgba(201,160,72,0.8)";
          ringRef.current.style.boxShadow   = "0 0 16px rgba(201,160,72,0.25)";
        }
        if (dotRef.current) {
          dotRef.current.style.backgroundColor = "rgba(201,160,72,0.5)";
          dotRef.current.style.width  = "8px";
          dotRef.current.style.height = "8px";
        }
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(SELECTOR)) {
        hovering = false;
        if (ringRef.current) {
          ringRef.current.style.width       = "28px";
          ringRef.current.style.height      = "28px";
          ringRef.current.style.borderColor = "rgba(201,160,72,0.35)";
          ringRef.current.style.boxShadow   = "0 0 8px rgba(201,160,72,0.10)";
        }
        if (dotRef.current) {
          dotRef.current.style.backgroundColor = "#C9A048";
          dotRef.current.style.width  = "4px";
          dotRef.current.style.height = "4px";
        }
      }
    };

    const onLeave = () => { mouseX = -200; mouseY = -200; };

    document.addEventListener("mouseover",  onOver,  { passive: true });
    document.addEventListener("mouseout",   onOut,   { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      root.style.cursor = "";
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mouseout",   onOut);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="atelier-cursor fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex:          9999,
          width:           "4px",
          height:          "4px",
          backgroundColor: "#C9A048",
          borderRadius:    "50%",
          willChange:      "transform",
          transition:      "width 0.15s, height 0.15s, background-color 0.15s",
          /* Initial transform parks the dot off-screen so it never flashes
             at the top-left before the first mousemove event arrives. */
          transform:       "translate(-200px, -200px)",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="atelier-cursor fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex:       9999,
          width:        "28px",
          height:       "28px",
          border:       "1px solid rgba(201,160,72,0.35)",
          borderRadius: "2px",
          willChange:   "transform",
          transition:   "width 0.25s ease, height 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
          boxShadow:    "0 0 8px rgba(201,160,72,0.10)",
          /* Initial transform parks the ring off-screen — see dot note. */
          transform:    "translate(-200px, -200px)",
        }}
      />
    </>
  );
}
