"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { CompanyData } from "@/lib/types";

/**
 * Scene I — "The Transformation"
 *
 * Sits between Hero and Crafts. The prospect sees a beautiful smile
 * in the hero, then immediately the proof of the cosmetic work: a
 * real before/after pair, revealed by a scroll-tied veil retreat.
 *
 * Mechanic — two stacked images, scrub-driven clip-path reveal:
 *   1. The BEFORE image fills the section at full opacity.
 *   2. The AFTER image is stacked on top, clipped via inset(0 100% 0 0)
 *      so only the leftmost 0% is visible — i.e. completely hidden.
 *   3. As the user scrolls, the clip-path animates to inset(0 0 0 0)
 *      — the right inset shrinks 100% → 0%, revealing the AFTER from
 *      LEFT to RIGHT.
 *   4. A vertical gold beam tracks the right edge of the visible
 *      AFTER (the boundary between BEFORE and AFTER).
 *   5. A DSD precision overlay (smile line, midline, canines, φ
 *      bracket) lives inside the same AFTER clip — it appears as
 *      the AFTER is revealed and draws itself in via stroke-dashoffset.
 *
 * Why this works:
 *   The previous attempt used a single composite "before/after"
 *   Unsplash photo with a watermark and odd composition. Bad asset.
 *   With a generated pair (same person, same framing, same lighting,
 *   teeth modified for the AFTER), the mechanic finally has matter:
 *   the prospect sees an actual cosmetic transformation, not a
 *   filter trick.
 *
 * ┌── ACTION REQUIRED ───────────────────────────────────────────────┐
 * │ The two image URLs below are PLACEHOLDERS using existing       │
 * │ Unsplash assets. Once the AI-generated before/after pair is    │
 * │ ready, swap BEFORE_IMG and AFTER_IMG to the new asset URLs.    │
 * │ Everything else (mechanic, positioning, overlay) stays.        │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * Pacing: 120vh pin, scrub 0.6 — same cadence as the previous
 * Composition section. Pin disabled on mobile (touch + pin = iOS
 * pain) — mobile gets the AFTER image full-bleed with a static
 * caption strip.
 */

/* Custom generated before/after pair — same person, same framing,
 * same lighting, only the teeth change. Both PNGs live in public/. */
const BEFORE_IMG = "/images/dental/before.png";
const AFTER_IMG  = "/images/dental/after.png";

export default function TransformationSection({ company }: { company: CompanyData }) {
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

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        /* Initial state — AFTER clipped to 0 width (right inset 100%),
           separator parked at the left edge. */
        gsap.set(after, { clipPath: "inset(0% 100% 0% 0%)" });
        gsap.set(sep,   { left:     "0%" });

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

        /* AFTER reveals from left to right: right inset shrinks
           100% → 0%. */
        tl.to(after, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 }, 0);

        /* Separator beam tracks the right edge of the visible AFTER. */
        tl.to(sep, { left: "100%", ease: "none", duration: 1 }, 0);

        /* DSD precision overlay — lives inside the AFTER container so
           it shares the same clip. Lines draw themselves via the same
           scrub timeline; marks pop; labels fade. */
        gsap.set(".tx-precision",       { opacity: 0 });
        gsap.set(".tx-precision-mark",  { opacity: 0, scale: 0, transformOrigin: "center center" });
        gsap.set(".tx-precision-label", { opacity: 0, y: 4 });

        tl.to(".tx-precision",       { opacity: 1, duration: 0.05, ease: "none" },         0.30);
        tl.to(".tx-precision-line",  { strokeDashoffset: 0, duration: 0.55, ease: "none" }, 0.38);
        tl.to(".tx-precision-mark",  { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)" }, 0.75);
        tl.to(".tx-precision-label", { opacity: 1, y: 0, duration: 0.3, stagger: 0.07 },    0.58);

        return () => {
          gsap.set(after, { clearProps: "all" });
          gsap.set(sep,   { clearProps: "all" });
        };
      });

      /* Mobile (< lg) — no pin, no scrub. The section shows the AFTER
         image full-bleed with a small caption strip. The before/after
         storytelling is desktop-only because the veil-retreat scrub
         doesn't translate well to touch scroll. */

      /* Persistent UI fade-in on scroll approach (both desktop + mobile) */
      gsap.set(
        [".tx-meta", ".tx-cap", ".tx-label-before", ".tx-label-after", ".tx-cue"],
        { opacity: 0 }
      );
      ScrollTrigger.create({
        trigger: section,
        start:   "top 80%",
        once:    true,
        onEnter: () => {
          gsap.to(
            [".tx-meta", ".tx-cap", ".tx-label-before", ".tx-label-after", ".tx-cue"],
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
      id="transformation"
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", backgroundColor: "#0C0B09" }}
    >
      {/* ── z-1 — BEFORE image (full visible) ─────────────────────────── */}
      <div className="absolute inset-0 z-[1]">
        <Image
          src={BEFORE_IMG}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: "center 38%",
            /* Generated BEFORE already carries its own grade (yellowed
               teeth, neutral skin) — keep filter near-identity, just a
               touch of darkening to integrate into the obsidian section
               background. */
            filter: "brightness(0.94) contrast(1.02)",
          }}
        />
      </div>

      {/* ── z-2 — AFTER image (clipped, revealed by scrub) ────────────── */}
      <div
        ref={afterRef}
        className="absolute inset-0 z-[2] overflow-hidden will-change-[clip-path]"
      >
        <Image
          src={AFTER_IMG}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: "center 38%",
            /* Generated AFTER already carries the warm cosmetic grade
               (brilliant white teeth, healthy skin) — slight contrast
               bump only, no need to push saturation. */
            filter: "brightness(1.0) contrast(1.06)",
          }}
        />

        {/* DSD precision overlay — inside the AFTER clip so it only
           shows on the revealed side. Centred on the smile (x≈50,
           y≈58). When the generated pair lands, fine-tune the y
           coordinates to match where the new smile actually sits in
           the frame. */}
        <svg
          className="tx-precision absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Vertical midline */}
          <line
            x1="50" y1="22" x2="50" y2="78"
            stroke="#C9A048" strokeWidth="0.16"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="56" strokeDashoffset="56"
            opacity="0.42"
            className="tx-precision-line"
          />
          {/* Smile line */}
          <line
            x1="26" y1="62" x2="74" y2="62"
            stroke="#C9A048" strokeWidth="0.30"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="48" strokeDashoffset="48"
            className="tx-precision-line"
          />
          {/* Incisal edge */}
          <line
            x1="34" y1="54" x2="66" y2="54"
            stroke="#C9A048" strokeWidth="0.16"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="32" strokeDashoffset="32"
            opacity="0.55"
            className="tx-precision-line"
          />
          {/* Canine markers */}
          <line
            x1="36" y1="56" x2="36" y2="66"
            stroke="#C9A048" strokeWidth="0.22"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="10" strokeDashoffset="10"
            className="tx-precision-line"
          />
          <line
            x1="64" y1="56" x2="64" y2="66"
            stroke="#C9A048" strokeWidth="0.22"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="10" strokeDashoffset="10"
            className="tx-precision-line"
          />
          {/* φ bracket */}
          <line
            x1="55" y1="57" x2="55" y2="63"
            stroke="#C9A048" strokeWidth="0.18"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="6" strokeDashoffset="6"
            opacity="0.7"
            className="tx-precision-line"
          />
          {/* Midline + smile-line intersection */}
          <circle cx="50" cy="62" r="0.55" fill="#C9A048" className="tx-precision-mark" />
        </svg>

        {/* Measurement labels */}
        <div className="tx-precision absolute inset-0 pointer-events-none">
          <span
            className="tx-precision-label absolute font-data tracking-[0.32em] uppercase"
            style={{ top: "57%", left: "73%", fontSize: "10px", color: "rgba(201,160,72,0.95)" }}
          >
            &phi;&thinsp;1.618
          </span>
          <span
            className="tx-precision-label absolute font-data tracking-[0.28em] uppercase"
            style={{ top: "66%", left: "50%", transform: "translateX(-50%)", fontSize: "8px", color: "rgba(201,160,72,0.72)" }}
          >
            Smile line &middot; 47.2&thinsp;mm
          </span>
          <span
            className="tx-precision-label absolute font-data tracking-[0.28em] uppercase"
            style={{ top: "20%", left: "50%", transform: "translateX(-50%)", fontSize: "8.5px", color: "rgba(201,160,72,0.55)" }}
          >
            DSD &middot; Composed
          </span>
        </div>
      </div>

      {/* ── z-3 — Separator beam (tracks AFTER's right edge) ──────────── */}
      <div
        ref={sepRef}
        className="absolute top-0 bottom-0 z-[3] pointer-events-none will-change-[left] hidden lg:block"
        style={{
          left:      "0%",
          width:     "1.5px",
          background:
            "linear-gradient(to bottom, transparent 0%, #C9A048 15%, #F0D080 50%, #C9A048 85%, transparent 100%)",
          boxShadow: "0 0 22px 2px rgba(201,160,72,0.52), 0 0 44px 4px rgba(201,160,72,0.22)",
          transform: "translateX(-50%)",
        }}
      />

      {/* ── z-4 — Vignette + atelier grid ─────────────────────────────── */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 95% 85% at 50% 50%, transparent 30%, rgba(12,11,9,0.72) 100%)" }}
      />
      <div
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,160,72,0.016) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(201,160,72,0.016) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
        }}
      />

      {/* ── z-10 — Persistent UI ──────────────────────────────────────── */}

      {/* Top-left chapter indicator */}
      <div className="tx-meta absolute top-24 left-6 lg:top-28 lg:left-12 z-[10] flex items-center gap-3">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "#C9A048", animation: "caret-pulse 1.8s ease-in-out infinite", boxShadow: "0 0 8px rgba(201,160,72,0.7)" }}
        />
        <span
          className="font-data text-[10px] tracking-[0.45em] uppercase"
          style={{
            color:      "rgba(240,234,224,0.95)",
            textShadow: "0 0 1px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.85), 0 2px 14px rgba(0,0,0,0.7)",
          }}
        >
          I &mdash; The Transformation
        </span>
      </div>

      {/* Top-right protocol tag */}
      <div className="tx-cap absolute top-24 right-6 lg:top-28 lg:right-12 z-[10] text-right">
        <div
          className="font-data text-[10px] tracking-[0.45em] uppercase mb-1"
          style={{
            color:      "rgba(201,160,72,0.85)",
            textShadow: "0 0 1px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.7)",
          }}
        >
          DSD Protocol
        </div>
        <div
          className="font-data text-[9px] tracking-[0.32em] uppercase"
          style={{
            color:      "rgba(216,210,200,0.55)",
            textShadow: "0 0 1px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.6)",
          }}
        >
          Case &middot; Composed
        </div>
      </div>

      {/* Bottom-left — Before */}
      <div className="tx-label-before absolute bottom-32 left-6 lg:bottom-40 lg:left-12 z-[10]">
        <span
          className="font-display italic"
          style={{
            fontSize:      "clamp(1.6rem, 3vw, 2.4rem)",
            color:         "rgba(216,210,200,0.78)",
            letterSpacing: "-0.005em",
            textShadow:    "0 0 1px rgba(0,0,0,0.95), 0 1px 14px rgba(0,0,0,0.7)",
          }}
        >
          Before
        </span>
        <p
          className="font-data text-[9px] tracking-[0.3em] uppercase mt-2"
          style={{
            color:      "rgba(216,210,200,0.5)",
            textShadow: "0 0 1px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.6)",
          }}
        >
          Untouched
        </p>
      </div>

      {/* Bottom-right — After */}
      <div className="tx-label-after absolute bottom-32 right-6 lg:bottom-40 lg:right-12 z-[10] text-right">
        <span
          className="font-display italic"
          style={{
            fontSize:      "clamp(1.6rem, 3vw, 2.4rem)",
            color:         "#D9B25C",
            letterSpacing: "-0.005em",
            textShadow:    "0 0 1px rgba(0,0,0,0.95), 0 1px 14px rgba(0,0,0,0.7)",
          }}
        >
          After
        </span>
        <p
          className="font-data text-[9px] tracking-[0.3em] uppercase mt-2"
          style={{
            color:      "rgba(201,160,72,0.62)",
            textShadow: "0 0 1px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.7)",
          }}
        >
          Composed
        </p>
      </div>

      {/* Bottom-center scroll cue (desktop only — mobile doesn't pin) */}
      <div className="tx-cue absolute bottom-8 left-1/2 -translate-x-1/2 z-[10] hidden lg:flex flex-col items-center gap-2 pointer-events-none">
        <span
          className="font-data text-[9px] tracking-[0.45em] uppercase"
          style={{
            color:      "rgba(201,160,72,0.85)",
            textShadow: "0 0 1px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.7)",
          }}
        >
          Scroll to reveal
        </span>
        <div style={{ position: "relative", width: "1px", height: "44px", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute", top: 0, left: 0,
              width:    "1px", height: "100%",
              background: "linear-gradient(to bottom, #C9A048, rgba(201,160,72,0.1))",
              animation:  "hero-scroll-beam 2.4s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </section>
  );
}
