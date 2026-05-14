"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { CompanyData } from "@/lib/types";

/**
 * Scene II — "The Atelier"
 *
 * Editorial grid of craft macros — porcelain in hand, instruments laid
 * out, restorations in close-up, hands working. No patient faces.
 * The section answers the visual question the rest of the site can't:
 * "Where's the matter?" The claims of craft and atelier need to be
 * grounded somewhere visible, not just typographic.
 *
 * Why this works for any prospect:
 *   Every cosmetic cabinet works with the same materials and tools.
 *   These photos read as "this is what cosmetic dentistry IS" rather
 *   than "this is a specific case from a specific practitioner." The
 *   prospect projects their own work into this visual register.
 *
 * Layout: asymmetric 5-cell grid on desktop (one large tile + four
 * smaller). Stacks vertically on mobile. Each tile reveals on
 * scroll-enter with a subtle stagger; the dark filter treatment keeps
 * all five photos in a consistent visual register regardless of their
 * original colour grading.
 */

type Macro = {
  /** Unsplash photo ID (everything after photo-) */
  src:    string;
  /** objectPosition value — crops to focus the editorial detail */
  pos:    string;
  /** Editorial label, mono caps */
  label:  string;
  /** Single-line caption, italic serif */
  caption: string;
};

const MACROS: Macro[] = [
  {
    src:     "photo-1664530838183-571e4f46040a",
    pos:     "center 50%",
    label:   "Implements",
    caption: "In hand, ready",
  },
  {
    src:     "photo-1606811918854-2bd64043db61",
    pos:     "center 50%",
    label:   "Reduction",
    caption: "Sub-millimetre",
  },
  {
    src:     "photo-1695986061759-bcf4ca33d0c4",
    pos:     "center 50%",
    label:   "Setting",
    caption: "Under loupes",
  },
  {
    src:     "photo-1675285657370-541bd9616b85",
    pos:     "center 50%",
    label:   "Restoration",
    caption: "Ceramic · post-glaze",
  },
  {
    src:     "photo-1673728795377-054e7fad7db1",
    pos:     "center 50%",
    label:   "Instrument set",
    caption: "Sterile · staged",
  },
];

export default function AtelierSection({ company }: { company: CompanyData }) {
  void company;
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      /* Header reveal */
      gsap.set([".at-meta", ".at-rule", ".at-heading", ".at-lede"], { opacity: 0, y: 18 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 78%",
        once:    true,
        onEnter: () => {
          gsap.to(".at-meta",    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
          gsap.to(".at-rule",    { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", delay: 0.1 });
          gsap.to(".at-heading", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.2 });
          gsap.to(".at-lede",    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.5 });
        },
      });

      /* Grid tiles reveal — stagger fade + scale, then label/caption */
      gsap.set(".at-tile",         { opacity: 0, y: 30, scale: 1.04 });
      gsap.set(".at-tile-label",   { opacity: 0, y: 8 });
      gsap.set(".at-tile-caption", { opacity: 0 });
      ScrollTrigger.create({
        trigger: ".at-grid",
        start:   "top 80%",
        once:    true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".at-tile",         { opacity: 1, y: 0, scale: 1.0, duration: 1.0, stagger: 0.12 }, 0)
            .to(".at-tile-label",   { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 },             0.5)
            .to(".at-tile-caption", { opacity: 1, duration: 0.5, stagger: 0.12 },                   0.65);
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="atelier"
      className="relative w-full"
      style={{
        backgroundColor: "#0C0B09",
        overflow:        "clip",
      }}
    >
      {/* Top hairline seam */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-[1]"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,160,72,0.32), transparent)" }}
      />

      {/* Atelier grid texture */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,160,72,0.022) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(201,160,72,0.022) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
        }}
      />

      {/* Soft gold breath upper-left */}
      <div
        className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full pointer-events-none z-[1]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(201,160,72,0.07) 0%, transparent 65%)",
          animation:  "breathe-gold 18s ease-in-out infinite",
        }}
      />

      <div className="relative z-[2] max-w-7xl mx-auto px-6 lg:px-12 pt-24 lg:pt-32 pb-24 lg:pb-32">

        {/* ── Section header ─────────────────────────────────────────── */}
        <div className="mb-14 lg:mb-20 max-w-3xl">
          <div className="at-meta flex items-center gap-3 mb-8">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "#C9A048", animation: "caret-pulse 1.8s ease-in-out infinite" }}
            />
            <span
              className="font-data text-[10px] tracking-[0.45em] uppercase"
              style={{ color: "rgba(240,234,224,0.7)" }}
            >
              II &mdash; The Atelier
            </span>
          </div>

          <div
            className="at-rule h-px w-16 mb-8"
            style={{ backgroundColor: "#C9A048", transformOrigin: "left center" }}
          />

          <h2
            className="at-heading font-display"
            style={{
              fontSize:      "clamp(2.6rem, 6.5vw, 5.6rem)",
              lineHeight:    "0.96",
              letterSpacing: "-0.02em",
              color:         "#F0EAE0",
              fontWeight:    400,
            }}
          >
            The matter
            <br />
            <span style={{ fontStyle: "italic", color: "#C9A048" }}>of the work.</span>
          </h2>

          <p
            className="at-lede mt-8 text-base leading-relaxed max-w-lg"
            style={{ color: "rgba(216,210,200,0.6)" }}
          >
            Implements, materials, and the moment a hand reduces a quarter of a
            millimetre by eye. Cosmetic dentistry, in close-up.
          </p>
        </div>

        {/* ── Asymmetric 5-tile grid ───────────────────────────────────
         * Desktop layout (12-col grid):
         *   tile 0 (large): cols 1–7, rows 1–2   (~58% wide × 2 rows tall)
         *   tile 1:         cols 8–12, row 1     (~42% wide × 1 row tall)
         *   tile 2:         cols 8–12, row 2
         *   tile 3:         cols 1–6, row 3      (~50% wide)
         *   tile 4:         cols 7–12, row 3
         * Each row has a fixed aspect-ratio container so the grid stays
         * editorial and balanced regardless of image dimensions.
         * Mobile (< lg): tiles stack vertically. */}
        <div className="at-grid hidden lg:grid grid-cols-12 grid-rows-[280px_280px_280px] gap-3">
          {/* Large feature tile */}
          <AtelierTile
            macro={MACROS[0]}
            className="col-span-7 row-span-2"
            indexLabel="01"
          />
          {/* Top-right tile */}
          <AtelierTile
            macro={MACROS[1]}
            className="col-span-5 row-span-1"
            indexLabel="02"
          />
          {/* Middle-right tile */}
          <AtelierTile
            macro={MACROS[2]}
            className="col-span-5 row-span-1"
            indexLabel="03"
          />
          {/* Bottom-left half */}
          <AtelierTile
            macro={MACROS[3]}
            className="col-span-6 row-span-1"
            indexLabel="04"
          />
          {/* Bottom-right half */}
          <AtelierTile
            macro={MACROS[4]}
            className="col-span-6 row-span-1"
            indexLabel="05"
          />
        </div>

        {/* Mobile: simple vertical stack */}
        <div className="at-grid lg:hidden flex flex-col gap-3">
          {MACROS.map((m, i) => (
            <AtelierTile
              key={m.src}
              macro={m}
              className="h-[58vh] max-h-[420px]"
              indexLabel={String(i + 1).padStart(2, "0")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Single grid cell. Renders the photo with a dark editorial filter,
 * corner brackets in gold (atelier-coded framing), and a bottom-left
 * caption strip with the index, label, and italic caption.
 */
function AtelierTile({
  macro,
  className,
  indexLabel,
}: {
  macro:      Macro;
  className:  string;
  indexLabel: string;
}) {
  return (
    <article
      className={`at-tile relative overflow-hidden ${className}`}
      style={{ backgroundColor: "#141210", willChange: "transform" }}
    >
      <Image
        src={`https://images.unsplash.com/${macro.src}?auto=format&fit=crop&w=1400&q=85`}
        alt=""
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
        style={{
          objectPosition: macro.pos,
          filter:         "brightness(0.85) contrast(1.06) saturate(0.7)",
        }}
      />

      {/* Top fade for label legibility */}
      <div
        className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(12,11,9,0.55) 0%, transparent 100%)" }}
      />
      {/* Bottom fade for caption legibility */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(12,11,9,0.85) 0%, transparent 100%)" }}
      />

      {/* Corner brackets — atelier framing */}
      <div className="absolute top-3 left-3 w-5 h-5 pointer-events-none"
        style={{ borderTop: "1px solid rgba(201,160,72,0.55)", borderLeft: "1px solid rgba(201,160,72,0.55)" }} />
      <div className="absolute top-3 right-3 w-5 h-5 pointer-events-none"
        style={{ borderTop: "1px solid rgba(201,160,72,0.55)", borderRight: "1px solid rgba(201,160,72,0.55)" }} />
      <div className="absolute bottom-3 left-3 w-5 h-5 pointer-events-none"
        style={{ borderBottom: "1px solid rgba(201,160,72,0.55)", borderLeft: "1px solid rgba(201,160,72,0.55)" }} />
      <div className="absolute bottom-3 right-3 w-5 h-5 pointer-events-none"
        style={{ borderBottom: "1px solid rgba(201,160,72,0.55)", borderRight: "1px solid rgba(201,160,72,0.55)" }} />

      {/* Top-left index */}
      <span
        className="at-tile-label absolute top-5 left-7 font-data text-[10px] tracking-[0.32em]"
        style={{ color: "rgba(201,160,72,0.85)" }}
      >
        {indexLabel}
      </span>

      {/* Bottom-left caption block */}
      <div className="at-tile-caption absolute bottom-6 left-7 right-7">
        <span
          className="font-data text-[10px] tracking-[0.36em] uppercase block"
          style={{ color: "rgba(201,160,72,0.85)" }}
        >
          {macro.label}
        </span>
        <span
          className="font-display italic text-base block mt-1.5"
          style={{
            color:         "rgba(240,234,224,0.88)",
            letterSpacing: "-0.005em",
            textShadow:    "0 1px 12px rgba(0,0,0,0.7)",
          }}
        >
          {macro.caption}
        </span>
      </div>
    </article>
  );
}
