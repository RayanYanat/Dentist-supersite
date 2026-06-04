"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { CompanyData } from "@/lib/types";

/**
 * Scene I — "The Transformation"
 *
 * Structure (rewritten this iteration):
 *
 *   1. Compact chapter intro (~50vh) — chapter dot, bridge phrase
 *      from the hero, heading, lede. Eases the cut from hero into
 *      the cases.
 *
 *   2. Cases grid — two before/after cards in a 2-column layout
 *      on desktop, stacked on mobile. NO full-screen pin: the
 *      previous version dedicated 240vh to two pinned scrubs which
 *      was overkill. These cards are ~4:5 portrait, side-by-side,
 *      and each one is a self-contained before/after slider the
 *      prospect controls directly with mouse or touch.
 *
 *      Mechanic per card:
 *        - BEFORE image stacked under AFTER image.
 *        - AFTER is clipped via inset(0 50% 0 0) by default →
 *          half-half split visible on first paint.
 *        - Mouse / touch moves over the card update the clip-path
 *          and the handle position in lockstep.
 *        - When the card scrolls into view for the first time,
 *          GSAP runs a one-shot "preview" animation: the handle
 *          sweeps from 0 → 100 → 50, showing the prospect the
 *          full range before they take over.
 *        - Bottom caption strip names the case + technique +
 *          duration.
 *
 * Why cards beat pinned scrub for *this* use case:
 *   The pinned scrub forced 120–240vh of scroll to walk the
 *   prospect through two reveals at the system's pace. Cards let
 *   the prospect *play*: they drag, the smile transforms, they
 *   feel ownership of the reveal. Plus the section is now ~120vh
 *   total instead of 310vh — same wow per case, half the scroll
 *   commitment.
 */

type CaseConfig = {
  index:     string;   // "I" / "II"
  headline:  string;
  duration:  string;
  before:    string;
  after:     string;
  objectPos: string;
};

const CASE_ONE: CaseConfig = {
  index:     "I",
  headline:  "Smile Design + Veneers",
  duration:  "12 days · 3 visits",
  before:    "/images/dental/portrait-before.png",
  after:     "/images/dental/portrait-after.png",
  objectPos: "center 28%",
};

const CASE_TWO: CaseConfig = {
  index:     "II",
  headline:  "Bonding + Whitening",
  duration:  "1 visit · 90 minutes",
  before:    "/images/dental/before.png",
  after:     "/images/dental/after.png",
  objectPos: "center 35%",
};

/* Implants pair — same subject as the portrait pair, full-face
 * frontal, generated from the same master prompt with the BEFORE
 * showing a missing upper-left central incisor (#21) and the AFTER
 * showing the same gap restored with an implant crown. */
const CASE_THREE: CaseConfig = {
  index:     "III",
  headline:  "Dental Implants + Crown",
  duration:  "16 weeks · 4 visits",
  before:    "/images/dental/implants-before.png",
  after:     "/images/dental/implants-after.png",
  objectPos: "center 28%",
};

export default function TransformationSection({ company }: { company: CompanyData }) {
  void company;
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      /* Intro panel reveal */
      gsap.set([".tx-intro-bridge", ".tx-intro-meta", ".tx-intro-rule", ".tx-intro-heading", ".tx-intro-lede"],
        { opacity: 0, y: 18 });
      ScrollTrigger.create({
        trigger: ".tx-intro",
        start:   "top 75%",
        once:    true,
        onEnter: () => {
          gsap.to(".tx-intro-bridge", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" });
          gsap.to(".tx-intro-meta",   { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.15 });
          gsap.to(".tx-intro-rule",   { opacity: 1, y: 0, duration: 0.7, ease: "expo.out",   delay: 0.25 });
          gsap.to(".tx-intro-heading",{ opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.35 });
          gsap.to(".tx-intro-lede",   { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.65 });
        },
      });

      /* Cards entrance — fade+scale on scroll-enter */
      gsap.set(".tx-card", { opacity: 0, y: 30, scale: 0.98 });
      ScrollTrigger.create({
        trigger: ".tx-cards",
        start:   "top 80%",
        once:    true,
        onEnter: () => {
          gsap.to(".tx-card", {
            opacity:  1,
            y:        0,
            scale:    1,
            duration: 1.0,
            stagger:  0.18,
            ease:     "power3.out",
          });
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="transformation"
      className="relative w-full"
      style={{ backgroundColor: "#0C0B09" }}
    >
      {/* Top hairline seam */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,160,72,0.32), transparent)" }}
      />

      {/* Soft gold breath upper-right */}
      <div
        className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(201,160,72,0.07) 0%, transparent 65%)",
          animation:  "breathe-gold 18s ease-in-out infinite",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Chapter intro ───────────────────────────────────────── */}
        <div className="tx-intro pt-24 lg:pt-32 pb-14 lg:pb-20">
          <p
            className="tx-intro-bridge font-display italic mb-10 lg:mb-12"
            style={{
              fontSize:      "clamp(1.05rem, 1.4vw, 1.3rem)",
              lineHeight:    1.4,
              color:         "rgba(216,210,200,0.45)",
              letterSpacing: "-0.005em",
              maxWidth:      "32ch",
            }}
          >
            …and here is the work, before and after.
          </p>

          <div className="tx-intro-meta flex items-center gap-3 mb-7">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: "#C9A048",
                animation:       "caret-pulse 1.8s ease-in-out infinite",
                boxShadow:       "0 0 8px rgba(201,160,72,0.7)",
              }}
            />
            <span
              className="font-data text-[10px] tracking-[0.45em] uppercase"
              style={{ color: "rgba(240,234,224,0.85)" }}
            >
              I &mdash; The Transformation
            </span>
          </div>

          <div
            className="tx-intro-rule h-px w-16 mb-7"
            style={{ backgroundColor: "#C9A048", transformOrigin: "left center" }}
          />

          <h2
            className="tx-intro-heading font-display max-w-2xl"
            style={{
              fontSize:      "clamp(2.4rem, 5.6vw, 4.6rem)",
              lineHeight:    "0.96",
              letterSpacing: "-0.02em",
              color:         "#F0EAE0",
              fontWeight:    400,
            }}
          >
            Three cases.
            <br />
            <span style={{ fontStyle: "italic", color: "#D9B25C" }}>One hand.</span>
          </h2>

          <p
            className="tx-intro-lede mt-7 text-base leading-relaxed max-w-lg"
            style={{ color: "rgba(216,210,200,0.6)" }}
          >
            Drag the handle on each case to compare. Three compositions
            from the atelier — veneers, bonding, and implants — each
            with its own scope, all composed by the same hand.
          </p>
        </div>

        {/* ── Cards grid ─────────────────────────────────────────── */}
        <div className="tx-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 pb-24 lg:pb-32">
          <CaseCard config={CASE_ONE} />
          <CaseCard config={CASE_TWO} />
          <CaseCard config={CASE_THREE} />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Single before/after card with mouse / touch slider.
 * The handle position drives the AFTER layer's clip-path inline.
 * ──────────────────────────────────────────────────────────────── */
function CaseCard({ config }: { config: CaseConfig }) {
  const { index, headline, duration, before, after, objectPos } = config;

  const cardRef    = useRef<HTMLDivElement>(null);
  const afterRef   = useRef<HTMLDivElement>(null);
  const handleRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card   = cardRef.current;
    const after  = afterRef.current;
    const handle = handleRef.current;
    if (!card || !after || !handle) return;

    /* Set the slider to a given percent (0–100) — drives both the
       AFTER clip-path and the handle's horizontal position. */
    const setPos = (pct: number) => {
      const clamped = Math.max(0, Math.min(100, pct));
      after.style.clipPath = `inset(0% ${100 - clamped}% 0% 0%)`;
      handle.style.left    = `${clamped}%`;
    };

    /* Initial state — start with all BEFORE visible (after clipped to 0). */
    setPos(0);

    /* Convert client-X to a percentage of the card width. */
    const eventToPct = (clientX: number) => {
      const rect = card.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    };

    /* Pointer-driven interaction (covers mouse + touch via Pointer Events,
       supported on all modern browsers). The card responds to:
       - hover (mouse only) — the slider follows the cursor live
       - drag (mouse + touch) — explicit "active" gesture
       Both update setPos in the same handler. */
    let isPointerDown = false;

    const onPointerMove = (e: PointerEvent) => {
      /* Mouse can scrub on hover (no button required); touch only
         scrubs while the user is actively pressing (pointerdown→up). */
      if (e.pointerType !== "mouse" && !isPointerDown) return;
      setPos(eventToPct(e.clientX));
    };

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      setPos(eventToPct(e.clientX));
      try { card.setPointerCapture(e.pointerId); } catch {}
    };

    const onPointerUp = (e: PointerEvent) => {
      isPointerDown = false;
      try { card.releasePointerCapture(e.pointerId); } catch {}
    };

    card.addEventListener("pointermove", onPointerMove);
    card.addEventListener("pointerdown", onPointerDown);
    card.addEventListener("pointerup",   onPointerUp);
    card.addEventListener("pointercancel", onPointerUp);

    /* One-shot preview animation when the card first scrolls into view.
       Sweeps 0 → 100 → 50 so the prospect SEES the transformation
       before they take over with their own pointer. */
    const proxy = { p: 0 };
    let previewPlayed = false;
    const trigger = ScrollTrigger.create({
      trigger: card,
      start:   "top 70%",
      once:    true,
      onEnter: () => {
        if (previewPlayed) return;
        previewPlayed = true;
        gsap.to(proxy, {
          p:        100,
          duration: 1.6,
          ease:     "power2.inOut",
          delay:    0.2,
          onUpdate: () => setPos(proxy.p),
        }).then(() => {
          gsap.to(proxy, {
            p:        50,
            duration: 1.0,
            ease:     "power2.inOut",
            onUpdate: () => setPos(proxy.p),
          });
        });
      },
    });

    return () => {
      card.removeEventListener("pointermove", onPointerMove);
      card.removeEventListener("pointerdown", onPointerDown);
      card.removeEventListener("pointerup",   onPointerUp);
      card.removeEventListener("pointercancel", onPointerUp);
      trigger.kill();
    };
  }, []);

  return (
    <article className="tx-card relative w-full">
      {/* Image container — 4:5 portrait, cursor:col-resize signals
          the slider affordance to mouse users. */}
      <div
        ref={cardRef}
        className="relative w-full overflow-hidden touch-none select-none"
        style={{
          aspectRatio:     "4 / 5",
          backgroundColor: "#141210",
          cursor:          "col-resize",
        }}
      >
        {/* BEFORE — always visible */}
        <div className="absolute inset-0 z-[1]">
          <Image
            src={before}
            alt=""
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover pointer-events-none"
            style={{ objectPosition: objectPos, filter: "brightness(0.94) contrast(1.02)" }}
          />
        </div>

        {/* AFTER — clipped, follows pointer */}
        <div
          ref={afterRef}
          className="absolute inset-0 z-[2] overflow-hidden will-change-[clip-path]"
        >
          <Image
            src={after}
            alt=""
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover pointer-events-none"
            style={{ objectPosition: objectPos, filter: "brightness(1.0) contrast(1.06)" }}
          />
        </div>

        {/* Handle bar — vertical gold beam + draggable knob in the middle */}
        <div
          ref={handleRef}
          className="absolute top-0 bottom-0 z-[3] pointer-events-none will-change-[left]"
          style={{
            left:       "0%",
            width:      "1.5px",
            background:
              "linear-gradient(to bottom, transparent 0%, #C9A048 15%, #F0D080 50%, #C9A048 85%, transparent 100%)",
            boxShadow:  "0 0 16px 1px rgba(201,160,72,0.5), 0 0 32px 3px rgba(201,160,72,0.18)",
            transform:  "translateX(-50%)",
          }}
        >
          {/* Knob — circular grip at vertical centre */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width:        "36px",
              height:       "36px",
              borderRadius: "9999px",
              border:       "1.5px solid rgba(201,160,72,0.85)",
              backgroundColor: "rgba(12,11,9,0.65)",
              backdropFilter:  "blur(6px)",
              boxShadow:    "0 0 18px rgba(201,160,72,0.45)",
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
            }}
          >
            {/* Two small arrow-chevrons inside the knob */}
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
              <path d="M5 1 L1 5 L5 9" stroke="#C9A048" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 1 L13 5 L9 9" stroke="#C9A048" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Vignette to bed the labels */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3 z-[4] pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(12,11,9,0.6) 0%, transparent 100%)" }}
        />

        {/* BEFORE label — bottom-left */}
        <div className="absolute bottom-5 left-5 z-[5] pointer-events-none">
          <span
            className="font-data text-[10px] tracking-[0.35em] uppercase"
            style={{
              color:      "rgba(216,210,200,0.85)",
              textShadow: "0 0 1px rgba(0,0,0,0.95), 0 1px 6px rgba(0,0,0,0.7)",
            }}
          >
            Before
          </span>
        </div>
        {/* AFTER label — bottom-right */}
        <div className="absolute bottom-5 right-5 z-[5] pointer-events-none">
          <span
            className="font-data text-[10px] tracking-[0.35em] uppercase"
            style={{
              color:      "#D9B25C",
              textShadow: "0 0 1px rgba(0,0,0,0.95), 0 1px 6px rgba(0,0,0,0.7)",
            }}
          >
            After
          </span>
        </div>
      </div>

      {/* Caption strip below the card */}
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <div>
          <div
            className="font-data text-[10px] tracking-[0.42em] uppercase"
            style={{ color: "rgba(201,160,72,0.85)" }}
          >
            Case &middot; {index}
          </div>
          <div
            className="font-display italic mt-2"
            style={{
              fontSize:      "clamp(1.2rem, 2vw, 1.6rem)",
              color:         "#F0EAE0",
              letterSpacing: "-0.005em",
              lineHeight:    1.1,
            }}
          >
            {headline}
          </div>
        </div>
        <div
          className="font-data text-[9px] tracking-[0.28em] uppercase text-right shrink-0"
          style={{ color: "rgba(216,210,200,0.48)" }}
        >
          {duration}
        </div>
      </div>
    </article>
  );
}
