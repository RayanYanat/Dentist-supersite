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
 * Sits between Hero and Crafts. Structure changed in this iteration:
 *
 *   1. Chapter intro panel (~70vh) — eases the transition from the
 *      hero. Without this, the cut from the hero portrait straight
 *      into the first case felt abrupt.
 *
 *   2. CASE I — pinned scrub with veil retreat (~120vh). Uses the
 *      portrait pair (same subject as the hero photo, so the prospect
 *      reads "the woman we showed in the hero — here's how she got
 *      there"). DSD precision overlay reveals on top as the AFTER
 *      uncovers. Positions tuned for portrait framing (smile sits
 *      lower in the frame than the close-up pair).
 *
 *   3. CASE II — pinned scrub with veil retreat (~90vh, shorter).
 *      Uses the close-up pair (different patient). No DSD overlay
 *      — the section signal is "more than one case", not "more
 *      analysis". Faster pin, lighter feel.
 *
 * Both cases share the same veil-retreat mechanic via a reusable
 * helper. The mechanic:
 *   AFTER is stacked on top of BEFORE, clipped to inset(0 100% 0 0)
 *   (i.e. invisible). Scroll progresses the clip to inset(0 0 0 0).
 *   A gold beam tracks the right edge of the visible AFTER.
 *
 * Mobile: pin disabled on every panel (touch + pin = iOS pain).
 * Both cases show the AFTER full-bleed with a small caption strip.
 */

type CaseConfig = {
  index:        string;       // "Case I" / "Case II"
  headline:     string;       // mono-tagline
  duration:     string;       // "12 days · 3 visits"
  before:       string;       // image path
  after:        string;       // image path
  objectPos:    string;       // tuned per image composition
  showDSD:      boolean;      // overlay on the AFTER half only
  pinDuration:  string;       // pin scroll length, e.g. "+=110%"
  /** Per-case class scope. Lets two cases coexist without sharing
   *  classNames (the GSAP timeline targets `.{idScope}-precision-line`
   *  etc., so they need distinct names). */
  idScope:      string;
};

const CASE_ONE: CaseConfig = {
  index:       "Case I",
  headline:    "Smile Design + Veneers",
  duration:    "12 days · 3 visits",
  before:      "/images/dental/portrait-before.png",
  after:       "/images/dental/portrait-after.png",
  objectPos:   "center 30%",
  showDSD:     true,
  pinDuration: "+=120%",
  idScope:     "tx1",
};

const CASE_TWO: CaseConfig = {
  index:       "Case II",
  headline:    "Bonding + Whitening",
  duration:    "1 visit · 90 minutes",
  before:      "/images/dental/before.png",
  after:       "/images/dental/after.png",
  objectPos:   "center 38%",
  showDSD:     false,
  pinDuration: "+=90%",
  idScope:     "tx2",
};

export default function TransformationSection({ company }: { company: CompanyData }) {
  void company;
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      /* Intro reveal — fade in on enter */
      gsap.set([".tx-intro-meta", ".tx-intro-rule", ".tx-intro-heading", ".tx-intro-lede", ".tx-intro-bridge"],
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

      const mm = gsap.matchMedia();

      /* Wire both cases on desktop only — pin + scrub doesn't play
         nice with touch on iOS. */
      mm.add("(min-width: 1024px)", () => {
        wireCase(CASE_ONE);
        wireCase(CASE_TWO);
        return undefined;
      });

      /* Persistent UI fades (chapter dot, labels) on each case */
      [CASE_ONE, CASE_TWO].forEach((c) => {
        gsap.set(
          [`.${c.idScope}-meta`, `.${c.idScope}-cap`, `.${c.idScope}-label-before`, `.${c.idScope}-label-after`, `.${c.idScope}-cue`],
          { opacity: 0 }
        );
        ScrollTrigger.create({
          trigger: `.${c.idScope}-section`,
          start:   "top 80%",
          once:    true,
          onEnter: () => {
            gsap.to(
              [`.${c.idScope}-meta`, `.${c.idScope}-cap`, `.${c.idScope}-label-before`, `.${c.idScope}-label-after`, `.${c.idScope}-cue`],
              { opacity: 1, duration: 0.7, stagger: 0.08, ease: "power2.out" }
            );
          },
        });
      });
    },
    { scope: sectionRef }
  );

  /** Wire a single case's veil-retreat scrub. Self-contained on the
   *  case's idScope so two cases can coexist. */
  function wireCase(c: CaseConfig) {
    const section = document.querySelector(`.${c.idScope}-section`) as HTMLElement | null;
    const after   = document.querySelector(`.${c.idScope}-after`)   as HTMLElement | null;
    const sep     = document.querySelector(`.${c.idScope}-sep`)     as HTMLElement | null;
    if (!section || !after || !sep) return;

    gsap.set(after, { clipPath: "inset(0% 100% 0% 0%)" });
    gsap.set(sep,   { left:     "0%" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger:       section,
        start:         "top top",
        end:           c.pinDuration,
        pin:           true,
        pinType:       "fixed",
        anticipatePin: 1,
        scrub:         0.6,
      },
    });

    tl.to(after, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 }, 0);
    tl.to(sep,   { left: "100%", ease: "none", duration: 1 }, 0);

    /* DSD overlay only for the first case (the one with the portrait pair). */
    if (c.showDSD) {
      gsap.set(`.${c.idScope}-precision`,       { opacity: 0 });
      gsap.set(`.${c.idScope}-precision-mark`,  { opacity: 0, scale: 0, transformOrigin: "center center" });
      gsap.set(`.${c.idScope}-precision-label`, { opacity: 0, y: 4 });

      tl.to(`.${c.idScope}-precision`,       { opacity: 1, duration: 0.05, ease: "none" },         0.30);
      tl.to(`.${c.idScope}-precision-line`,  { strokeDashoffset: 0, duration: 0.55, ease: "none" }, 0.38);
      tl.to(`.${c.idScope}-precision-mark`,  { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)" }, 0.75);
      tl.to(`.${c.idScope}-precision-label`, { opacity: 1, y: 0, duration: 0.3, stagger: 0.07 },    0.58);
    }
  }

  return (
    <section
      ref={sectionRef}
      id="transformation"
      className="relative w-full"
      style={{ backgroundColor: "#0C0B09" }}
    >
      {/* ════════════════════════════════════════════════════════════
       * INTRO PANEL — eases the transition from the hero
       * ════════════════════════════════════════════════════════════ */}
      <div className="tx-intro relative w-full" style={{ minHeight: "70vh" }}>
        {/* Top hairline seam — borrowed from Crafts / Ledger for visual
           continuity. Anchors the chapter break. */}
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

        <div className="relative max-w-5xl mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-16 lg:pb-24">

          {/* Bridge typography — quietly extends the hero's voice
             ("Smile, Composed.") into this section before the formal
             chapter intro. Gives the eye somewhere to land instead of
             flying straight into a new chapter dot. */}
          <p
            className="tx-intro-bridge font-display italic mb-12 lg:mb-16"
            style={{
              fontSize:      "clamp(1.1rem, 1.5vw, 1.4rem)",
              lineHeight:    1.4,
              color:         "rgba(216,210,200,0.45)",
              letterSpacing: "-0.005em",
              maxWidth:      "32ch",
            }}
          >
            …and here is the work, before and after.
          </p>

          {/* Chapter indicator */}
          <div className="tx-intro-meta flex items-center gap-3 mb-8">
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

          {/* Hairline rule */}
          <div
            className="tx-intro-rule h-px w-16 mb-8"
            style={{ backgroundColor: "#C9A048", transformOrigin: "left center" }}
          />

          {/* Heading */}
          <h2
            className="tx-intro-heading font-display"
            style={{
              fontSize:      "clamp(2.6rem, 6.5vw, 5.6rem)",
              lineHeight:    "0.96",
              letterSpacing: "-0.02em",
              color:         "#F0EAE0",
              fontWeight:    400,
            }}
          >
            Two cases.
            <br />
            <span style={{ fontStyle: "italic", color: "#D9B25C" }}>One hand.</span>
          </h2>

          {/* Lede */}
          <p
            className="tx-intro-lede mt-8 text-base leading-relaxed max-w-lg"
            style={{ color: "rgba(216,210,200,0.6)" }}
          >
            Recent compositions from the atelier. The first redesigned with
            a complete smile architecture; the second a single-visit
            correction. Same hand, same protocol — different scope.
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
       * CASE I — Portrait pair (same subject as hero), DSD overlay
       * ════════════════════════════════════════════════════════════ */}
      <CasePanel config={CASE_ONE} />

      {/* ════════════════════════════════════════════════════════════
       * CASE II — Close-up pair, no overlay
       * ════════════════════════════════════════════════════════════ */}
      <CasePanel config={CASE_TWO} />
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Reusable case panel.
 * Pinned 100vh on desktop, vertical stack on mobile.
 * ──────────────────────────────────────────────────────────────── */
function CasePanel({ config }: { config: CaseConfig }) {
  const { idScope, before, after, objectPos, showDSD, index, headline, duration } = config;

  return (
    <section
      className={`${idScope}-section relative w-full overflow-hidden`}
      style={{ height: "100vh", backgroundColor: "#0C0B09" }}
    >
      {/* z-1 — BEFORE (always visible) */}
      <div className="absolute inset-0 z-[1]">
        <Image
          src={before}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: objectPos, filter: "brightness(0.94) contrast(1.02)" }}
        />
      </div>

      {/* z-2 — AFTER (clipped, revealed by scrub) */}
      <div
        className={`${idScope}-after absolute inset-0 z-[2] overflow-hidden will-change-[clip-path]`}
      >
        <Image
          src={after}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: objectPos, filter: "brightness(1.0) contrast(1.06)" }}
        />

        {/* DSD overlay — only on Case I, positions calibrated for
            portrait framing (smile sits around y=72%, narrower
            horizontal span than the close-up framing). */}
        {showDSD && (
          <>
            <svg
              className={`${idScope}-precision absolute inset-0 w-full h-full pointer-events-none`}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Vertical facial midline — extends through eyes/nose/mouth */}
              <line
                x1="50" y1="20" x2="50" y2="88"
                stroke="#C9A048" strokeWidth="0.16"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="68" strokeDashoffset="68"
                opacity="0.42"
                className={`${idScope}-precision-line`}
              />
              {/* Smile line — portrait framing, narrower horizontal */}
              <line
                x1="38" y1="72" x2="62" y2="72"
                stroke="#C9A048" strokeWidth="0.30"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="24" strokeDashoffset="24"
                className={`${idScope}-precision-line`}
              />
              {/* Incisal edge */}
              <line
                x1="42" y1="66" x2="58" y2="66"
                stroke="#C9A048" strokeWidth="0.16"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="16" strokeDashoffset="16"
                opacity="0.55"
                className={`${idScope}-precision-line`}
              />
              {/* Canine markers */}
              <line
                x1="42" y1="68" x2="42" y2="76"
                stroke="#C9A048" strokeWidth="0.22"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="8" strokeDashoffset="8"
                className={`${idScope}-precision-line`}
              />
              <line
                x1="58" y1="68" x2="58" y2="76"
                stroke="#C9A048" strokeWidth="0.22"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="8" strokeDashoffset="8"
                className={`${idScope}-precision-line`}
              />
              {/* φ bracket */}
              <line
                x1="54" y1="69" x2="54" y2="75"
                stroke="#C9A048" strokeWidth="0.18"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="6" strokeDashoffset="6"
                opacity="0.7"
                className={`${idScope}-precision-line`}
              />
              {/* Midline + smile-line intersection */}
              <circle cx="50" cy="72" r="0.55" fill="#C9A048" className={`${idScope}-precision-mark`} />
            </svg>

            {/* Mono measurement labels — portrait framing */}
            <div className={`${idScope}-precision absolute inset-0 pointer-events-none`}>
              <span
                className={`${idScope}-precision-label absolute font-data tracking-[0.32em] uppercase`}
                style={{ top: "68%", left: "65%", fontSize: "10px", color: "rgba(201,160,72,0.95)" }}
              >
                &phi;&thinsp;1.618
              </span>
              <span
                className={`${idScope}-precision-label absolute font-data tracking-[0.28em] uppercase`}
                style={{ top: "76%", left: "50%", transform: "translateX(-50%)", fontSize: "8px", color: "rgba(201,160,72,0.72)" }}
              >
                Smile line &middot; 47.2&thinsp;mm
              </span>
              <span
                className={`${idScope}-precision-label absolute font-data tracking-[0.28em] uppercase`}
                style={{ top: "18%", left: "50%", transform: "translateX(-50%)", fontSize: "8.5px", color: "rgba(201,160,72,0.55)" }}
              >
                DSD &middot; Composed
              </span>
            </div>
          </>
        )}
      </div>

      {/* z-3 — Separator beam (desktop only — mobile has no pin) */}
      <div
        className={`${idScope}-sep absolute top-0 bottom-0 z-[3] pointer-events-none will-change-[left] hidden lg:block`}
        style={{
          left:      "0%",
          width:     "1.5px",
          background:
            "linear-gradient(to bottom, transparent 0%, #C9A048 15%, #F0D080 50%, #C9A048 85%, transparent 100%)",
          boxShadow: "0 0 22px 2px rgba(201,160,72,0.52), 0 0 44px 4px rgba(201,160,72,0.22)",
          transform: "translateX(-50%)",
        }}
      />

      {/* z-4 — Vignette + grid */}
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

      {/* z-10 — Persistent UI */}

      {/* Top-left case indicator */}
      <div className={`${idScope}-meta absolute top-12 left-6 lg:top-16 lg:left-12 z-[10] flex items-center gap-3`}>
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "#C9A048", boxShadow: "0 0 8px rgba(201,160,72,0.7)" }}
        />
        <span
          className="font-data text-[10px] tracking-[0.45em] uppercase"
          style={{
            color:      "rgba(240,234,224,0.95)",
            textShadow: "0 0 1px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.85), 0 2px 14px rgba(0,0,0,0.7)",
          }}
        >
          {index}
        </span>
      </div>

      {/* Top-right case caption */}
      <div className={`${idScope}-cap absolute top-12 right-6 lg:top-16 lg:right-12 z-[10] text-right`}>
        <div
          className="font-data text-[10px] tracking-[0.45em] uppercase mb-1"
          style={{
            color:      "rgba(201,160,72,0.9)",
            textShadow: "0 0 1px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.7)",
          }}
        >
          {headline}
        </div>
        <div
          className="font-data text-[9px] tracking-[0.32em] uppercase"
          style={{
            color:      "rgba(216,210,200,0.6)",
            textShadow: "0 0 1px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.6)",
          }}
        >
          {duration}
        </div>
      </div>

      {/* Bottom-left — Before */}
      <div className={`${idScope}-label-before absolute bottom-24 left-6 lg:bottom-32 lg:left-12 z-[10]`}>
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
      <div className={`${idScope}-label-after absolute bottom-24 right-6 lg:bottom-32 lg:right-12 z-[10] text-right`}>
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

      {/* Bottom-center scroll cue (desktop only) */}
      <div className={`${idScope}-cue absolute bottom-8 left-1/2 -translate-x-1/2 z-[10] hidden lg:flex flex-col items-center gap-2 pointer-events-none`}>
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
