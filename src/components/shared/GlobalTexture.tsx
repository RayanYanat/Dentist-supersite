"use client";

/**
 * Film grain overlay — fixed, covers entire viewport, pointer-events none.
 * Adds analog warmth to the digital obsidian palette.
 * z-index 9998 — below CustomCursor (9999) but above everything else.
 */
export default function GlobalTexture() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 9998,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
        opacity: 0.028,
        animation: "grain 0.5s steps(1) infinite",
        mixBlendMode: "overlay",
      }}
    />
  );
}
