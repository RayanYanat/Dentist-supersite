"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { CompanyData } from "@/lib/types";

/**
 * Scene III — "The Transformation"
 *
 * The single most visceral moment of the site. Two portraits stack on
 * top of each other. A vertical separator beam is anchored to the right
 * edge of the "after" image's clip-path. As the user scrolls, the beam
 * sweeps left → right, and the "after" reveals from the same direction —
 * replacing "before" by exactly the amount of scroll the user provides.
 *
 * The user IS the transformation. They're not watching it; they're
 * dragging it forward through their scroll wheel.
 *
 * Mechanics:
 *   - Section pinned for 120vh of scroll (1.2 viewport heights).
 *   - clip-path: inset(0 X% 0 0) on the "after" image — X animates
 *     100 → 0 as scroll progresses 0 → 1, ease "none" so the visual
 *     position tracks the scroll wheel exactly (any easing here would
 *     make the user's input and the visual progress drift apart, which
 *     reads as broken).
 *   - Separator div positioned at left:X% — same animation curve.
 *   - Gold drop-shadow on the separator gives it a "scalpel beam" feel
 *     against the darkness.
 *
 * Pacing rationale: Scene II was ~300vh for 6 panels (snappy panel
 * transitions). Scene III is 120vh for ONE continuous scrub — slower,
 * more deliberate. This is the scene where the visitor LINGERS.
 *
 * Lower scrub value (0.6 vs Scene II's 1) keeps the visual position
 * tighter to the scroll input — important here because the user is
 * "dragging" the reveal and expects it to follow their scroll directly.
 */

export default function GallerySection({ company }: { company: CompanyData }) {
  void company;
  const sectionRef = useRef<HTMLElement>(null);
  const afterRef   = useRef<HTMLDivElement>(null);
  const sepRef     = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      const after   = afterRef.current;
      const sep     = sepRef.current;
      if (!section || !after || !sep) return;

      /* Initial state: after fully clipped (only before visible);
         separator at the very left edge. */
      gsap.set(after, { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(sep,   { left:     "0%" });

      /* Master scrub timeline */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:       section,
          start:         "top top",
          end:           "+=120%",
          pin:           true,
          pinType:       "fixed",
          anticipatePin: 1,
          scrub:         0.6,
        },
      });

      /* The "after" reveal — clip-path right inset closes from 100% → 0% */
      tl.to(after, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 }, 0);

      /* The separator beam — tracks the right edge of the visible "after" */
      tl.to(sep, { left: "100%", ease: "none", duration: 1 }, 0);

      /* Subtle camera-pull-back on the after image — emerges with breath */
      tl.fromTo(
        ".s3-after-img",
        { scale: 1.06 },
        { scale: 1.00, ease: "power2.out", duration: 1 },
        0
      );

      /* Persistent UI — fade in once the section reaches the viewport */
      gsap.set(
        [".s3-meta", ".s3-cap", ".s3-label-before", ".s3-label-after", ".s3-cue"],
        { opacity: 0 }
      );
      ScrollTrigger.create({
        trigger: section,
        start:   "top 80%",
        once:    true,
        onEnter: () => {
          gsap.to(
            [".s3-meta", ".s3-cap", ".s3-label-before", ".s3-label-after", ".s3-cue"],
            { opacity: 1, duration: 0.7, stagger: 0.08, ease: "power2.out" }
          );
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="transformations"
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", backgroundColor: "#0C0B09" }}
    >
      {/* ── z-1 — Before (bottom layer, always visible) ──────────────── */}
      <div className="absolute inset-0 z-[1]">
        <Image
          src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=2400&q=90"
          alt="Before"
          fill
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: "center 30%",
            filter:         "brightness(0.78) contrast(1.05) saturate(0.65) sepia(0.05)",
          }}
        />
      </div>

      {/* ── z-2 — After (top layer, clip-path animated) ──────────────── */}
      <div
        ref={afterRef}
        className="absolute inset-0 z-[2] overflow-hidden will-change-[clip-path]"
      >
        <div className="s3-after-img absolute inset-0 will-change-transform">
          <Image
            src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=2400&q=90"
            alt="After"
            fill
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition: "center 30%",
              filter:         "brightness(1.05) contrast(1.10) saturate(0.95) sepia(0.02)",
            }}
          />
        </div>
      </div>

      {/* ── z-3 — Separator beam ─────────────────────────────────────── */}
      <div
        ref={sepRef}
        className="absolute top-0 bottom-0 z-[3] pointer-events-none will-change-[left]"
        style={{
          left:        "0%",
          width:       "1.5px",
          background:
            "linear-gradient(to bottom, transparent 0%, #C9A048 15%, #F0D080 50%, #C9A048 85%, transparent 100%)",
          boxShadow:   "0 0 24px 2px rgba(201,160,72,0.55), 0 0 48px 4px rgba(201,160,72,0.25)",
          transform:   "translateX(-50%)",
        }}
      />

      {/* ── z-4 — Vignette + atelier grid for atmosphere ─────────────── */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 95% 85% at 50% 50%, transparent 35%, rgba(12,11,9,0.75) 100%)" }}
      />
      <div
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,160,72,0.018) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(201,160,72,0.018) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
        }}
      />

      {/* ── z-10 — Persistent UI ─────────────────────────────────────── */}

      {/* Top-left chapter indicator */}
      <div className="s3-meta absolute top-24 left-6 lg:top-28 lg:left-12 z-[10] flex items-center gap-3">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "#C9A048", animation: "caret-pulse 1.8s ease-in-out infinite" }}
        />
        <span
          className="font-data text-[10px] tracking-[0.45em] uppercase"
          style={{ color: "rgba(240,234,224,0.7)" }}
        >
          III &mdash; The Transformation
        </span>
      </div>

      {/* Top-right case caption */}
      <div className="s3-cap absolute top-24 right-6 lg:top-28 lg:right-12 z-[10] text-right">
        <div
          className="font-data text-[10px] tracking-[0.45em] uppercase mb-1"
          style={{ color: "rgba(201,160,72,0.7)" }}
        >
          Case 042 &middot; 2024
        </div>
        <div
          className="font-data text-[9px] tracking-[0.32em] uppercase"
          style={{ color: "rgba(216,210,200,0.4)" }}
        >
          Porcelain Veneers &middot; 8 Sessions
        </div>
      </div>

      {/* Bottom-left "Before" label */}
      <div className="s3-label-before absolute bottom-32 left-6 lg:bottom-40 lg:left-12 z-[10]">
        <span
          className="font-display italic"
          style={{
            fontSize:      "clamp(1.6rem, 3vw, 2.4rem)",
            color:         "rgba(216,210,200,0.85)",
            letterSpacing: "-0.005em",
            textShadow:    "0 1px 14px rgba(0,0,0,0.7)",
          }}
        >
          Before
        </span>
      </div>

      {/* Bottom-right "After" label */}
      <div className="s3-label-after absolute bottom-32 right-6 lg:bottom-40 lg:right-12 z-[10] text-right">
        <span
          className="font-display italic"
          style={{
            fontSize:      "clamp(1.6rem, 3vw, 2.4rem)",
            color:         "#C9A048",
            letterSpacing: "-0.005em",
            textShadow:    "0 1px 14px rgba(0,0,0,0.7)",
          }}
        >
          After
        </span>
      </div>

      {/* Bottom-center scroll cue */}
      <div className="s3-cue absolute bottom-8 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center gap-2 pointer-events-none">
        <span
          className="font-data text-[9px] tracking-[0.45em] uppercase"
          style={{ color: "rgba(201,160,72,0.55)" }}
        >
          Scroll to reveal
        </span>
        <div style={{ position: "relative", width: "1px", height: "44px", overflow: "hidden" }}>
          <div
            style={{
              position:   "absolute",
              top: 0, left: 0,
              width:      "1px",
              height:     "100%",
              background: "linear-gradient(to bottom, #C9A048, rgba(201,160,72,0.1))",
              animation:  "hero-scroll-beam 2.4s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </section>
  );
}
