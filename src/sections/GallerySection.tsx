"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { CompanyData } from "@/lib/types";

/**
 * Scene II — "The Ledger"
 *
 * A typographic data section. The previous photo-driven mechanics
 * (before/after, precision reveal) ended up being decoration without
 * substance. This replaces them with six concrete, count-up statistics
 * that say something specific about the practice — a "scoreboard of
 * craft signals" that reads like the front page of a certification.
 *
 * Why this works for an outreach tool:
 *   - Concrete content (specific numbers) — every value tells a story
 *   - Easy to customise per prospect (just swap the values)
 *   - Visually distinct (huge mono numerals) — no two sites look alike
 *     when the figures change
 *   - Fits the atelier vocabulary (precision, materials, ratios)
 *   - Count-up animation gives a moment of "stop and read"
 *
 * Each stat is told three ways:
 *   1. The figure itself (huge, mono ivory)
 *   2. A short label (mono uppercase gold)
 *   3. A detail caption (smaller mono, muted)
 *
 * Layout: 3 columns × 2 rows on desktop. Single column stacked on mobile.
 * Each stat carries a thin gold rule above it as an editorial accent —
 * the rule draws in left-to-right on reveal, then the figure counts up.
 *
 * No pinning — just on-enter scroll reveal. The numbers do the heavy
 * lifting.
 */

type Stat = {
  /** Final numerical value used for the count-up tween. */
  value:   number;
  /** Formats the in-flight value into a display string (handles units, decimals, etc.). */
  display: (v: number) => string;
  /** Short uppercase mono label. */
  label:   string;
  /** Secondary caption, single line, mono muted. */
  detail:  string;
};

const STATS: Stat[] = [
  {
    value:   12,
    display: (v) => Math.round(v).toString(),
    label:   "Years",
    detail:  "Of cosmetic-only practice",
  },
  {
    value:   240,
    display: (v) => Math.round(v).toString(),
    label:   "Cases / year",
    detail:  "Composed in this atelier",
  },
  {
    value:   3,
    display: (v) => Math.round(v).toString(),
    label:   "Light registers",
    detail:  "Clinical · Daylight · Candlelight",
  },
  {
    value:   4.5,
    display: (v) => `${v.toFixed(1)}×`,
    label:   "Loupes",
    detail:  "Carl Zeiss EyeMag — surgical",
  },
  {
    value:   850,
    display: (v) => `${Math.round(v)}°C`,
    label:   "Atelier kiln",
    detail:  "Lithium disilicate firing — in-house",
  },
  {
    value:   12,
    display: (v) => `${Math.round(v)} d.`,
    label:   "Turnaround",
    detail:  "From photograph to placement",
  },
];

export default function GallerySection({ company }: { company: CompanyData }) {
  void company;
  const sectionRef = useRef<HTMLElement>(null);
  /* One DOM ref per stat figure — GSAP writes the in-flight value
     directly to .textContent on each animation frame. Avoids React
     re-renders during the count-up. */
  const figureRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      /* ── Header reveal ────────────────────────────────────────────── */
      gsap.set([".s3-meta", ".s3-rule", ".s3-heading", ".s3-lede"], { opacity: 0, y: 18 });
      gsap.set(".s3-stat-rule",   { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".s3-stat-label",  { opacity: 0, y: 14 });
      gsap.set(".s3-stat-detail", { opacity: 0, y: 10 });
      gsap.set(".s3-stat-figure", { opacity: 0, y: 22 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 78%",
        once:    true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          /* Header reveals first */
          tl.to(".s3-meta",    { opacity: 1, y: 0, duration: 0.6 }, 0)
            .to(".s3-rule",    { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" }, 0.1)
            .to(".s3-heading", { opacity: 1, y: 0, duration: 0.95 }, 0.2)
            .to(".s3-lede",    { opacity: 1, y: 0, duration: 0.85 }, 0.5);

          /* Each stat: rule draws in, then figure + label + detail
             fade up while the figure also counts up to its target. */
          STATS.forEach((stat, i) => {
            const base   = 0.85 + i * 0.18;  // staggered start per stat
            const ruleEl = `.s3-stat-${i} .s3-stat-rule`;
            const figEl  = `.s3-stat-${i} .s3-stat-figure`;
            const labEl  = `.s3-stat-${i} .s3-stat-label`;
            const detEl  = `.s3-stat-${i} .s3-stat-detail`;

            tl.to(ruleEl,  { scaleX: 1, duration: 0.7, ease: "expo.out" },          base)
              .to(figEl,   { opacity: 1, y: 0, duration: 0.7 },                     base + 0.15)
              .to(labEl,   { opacity: 1, y: 0, duration: 0.55 },                    base + 0.2)
              .to(detEl,   { opacity: 1, y: 0, duration: 0.55 },                    base + 0.35);

            /* Count-up — tween a proxy object, write to .textContent on
               each frame. Use the stat's own display() so units/decimals
               are rendered consistently throughout the tween. */
            const target = figureRefs.current[i];
            if (target) {
              const proxy = { v: 0 };
              tl.to(
                proxy,
                {
                  v:        stat.value,
                  duration: 1.6,
                  ease:     "power3.out",
                  onUpdate: () => { target.textContent = stat.display(proxy.v); },
                },
                base + 0.18,
              );
            }
          });
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="ledger"
      className="relative w-full"
      style={{ backgroundColor: "#0C0B09", overflow: "clip" }}
    >
      {/* Top hairline seam — same motif as Maker section */}
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

      {/* Soft gold breath upper-right */}
      <div
        className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full pointer-events-none z-[1]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(201,160,72,0.07) 0%, transparent 65%)",
          animation:  "breathe-gold 18s ease-in-out infinite",
        }}
      />

      {/* Slow vertical scan beam — same atmospheric trick as Crafts */}
      <div
        className="absolute left-0 right-0 z-[1] pointer-events-none"
        style={{
          height:    "1px",
          background: "linear-gradient(to right, transparent 0%, rgba(201,160,72,0.18) 20%, rgba(240,208,128,0.45) 50%, rgba(201,160,72,0.18) 80%, transparent 100%)",
          boxShadow: "0 0 14px rgba(201,160,72,0.25)",
          animation: "m2-scan 11s ease-in-out infinite",
        }}
      />

      <div className="relative z-[2] max-w-7xl mx-auto px-6 lg:px-12 pt-24 lg:pt-32 pb-24 lg:pb-32">

        {/* ── Section header ─────────────────────────────────────────── */}
        <div className="mb-16 lg:mb-24 max-w-3xl">
          <div className="s3-meta flex items-center gap-3 mb-8">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "#C9A048", animation: "caret-pulse 1.8s ease-in-out infinite" }}
            />
            <span
              className="font-data text-[10px] tracking-[0.45em] uppercase"
              style={{ color: "rgba(240,234,224,0.7)" }}
            >
              II &mdash; The Ledger
            </span>
          </div>

          <div
            className="s3-rule h-px w-16 mb-8"
            style={{ backgroundColor: "#C9A048", transformOrigin: "left center" }}
          />

          <h2
            className="s3-heading font-display"
            style={{
              fontSize:      "clamp(2.6rem, 6.5vw, 5.6rem)",
              lineHeight:    "0.96",
              letterSpacing: "-0.02em",
              color:         "#F0EAE0",
              fontWeight:    400,
            }}
          >
            The atelier,
            <br />
            <span style={{ fontStyle: "italic", color: "#C9A048" }}>by the numbers.</span>
          </h2>

          <p
            className="s3-lede mt-8 text-base leading-relaxed max-w-lg"
            style={{ color: "rgba(216,210,200,0.6)" }}
          >
            What it takes to compose a single smile &mdash; in figures.
            Materials, magnification, and the count of hands on every chart.
          </p>
        </div>

        {/* ── Stats grid ──────────────────────────────────────────────
         * 3 columns × 2 rows on desktop. Stacked on mobile. Each stat
         * is a column with a top gold hairline, a giant numeral, a
         * small label, and a one-line detail. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-14 lg:gap-y-20">
          {STATS.map((stat, i) => (
            <div key={stat.label} className={`s3-stat-${i} relative`}>
              {/* Top hairline rule */}
              <div
                className="s3-stat-rule h-px w-full mb-6"
                style={{ backgroundColor: "rgba(201,160,72,0.32)" }}
              />

              {/* Stat index — small mono prefix top-right of the rule */}
              <span
                className="absolute right-0 -top-5 font-data text-[10px] tracking-[0.32em]"
                style={{ color: "rgba(201,160,72,0.42)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* The figure — huge mono ivory, GSAP writes here */}
              <div
                className="s3-stat-figure font-data"
                style={{
                  fontSize:      "clamp(3.8rem, 7vw, 6.2rem)",
                  lineHeight:    1,
                  letterSpacing: "-0.02em",
                  color:         "#F0EAE0",
                  fontWeight:    400,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <span ref={(el) => { figureRefs.current[i] = el; }}>
                  {stat.display(0)}
                </span>
              </div>

              {/* Label — small mono caps gold */}
              <div
                className="s3-stat-label font-data uppercase mt-5"
                style={{
                  fontSize:      "11px",
                  letterSpacing: "0.34em",
                  color:         "rgba(201,160,72,0.82)",
                }}
              >
                {stat.label}
              </div>

              {/* Detail — secondary caption, single line, muted */}
              <div
                className="s3-stat-detail font-data mt-2"
                style={{
                  fontSize:      "10px",
                  letterSpacing: "0.22em",
                  color:         "rgba(216,210,200,0.42)",
                  textTransform: "uppercase",
                }}
              >
                {stat.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
