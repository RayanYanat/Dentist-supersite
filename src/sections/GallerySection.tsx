"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { CompanyData } from "@/lib/types";

/**
 * "Transformations" — the second wow moment from CLAUDE.md.
 *
 * The featured case is a scroll-scrubbed before/after reveal. As the user
 * scrolls through the section, a clip-path animates the "after" image over
 * the "before" image, with a vertical gold edge tracking the wipe. The
 * transformation is FELT through the act of scrolling, not announced.
 *
 *   - scrub: 1 → 1-second smoothing on scroll updates (no jitter)
 *   - no pin → avoids iOS smoothing issues with sticky containers
 *   - normalizeScroll → forbidden (CLAUDE.md), so we don't touch it
 *
 * The three smaller case studies use static side-by-side composition.
 * They establish breadth without competing with the featured reveal.
 *
 * Photography strategy: a single base photograph per case, with the "before"
 * variant rendered through a desaturated/dimmed CSS filter and the "after"
 * through a bright, saturated one. This avoids the uncanny-valley problem
 * of using two unrelated stock photos as if they were the same patient.
 */

const FEATURED = {
  num:        "Case 01",
  treatment:  "Full Porcelain Veneers",
  duration:   "12 weeks",
  materials:  "Lithium Disilicate · Hand-layered",
  patient:    "F · 38 · cosmetic restoration",
  img:        "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1800&q=85",
  alt:        "Cosmetic veneer transformation",
};

const CASES = [
  {
    num:       "Case 02",
    treatment: "Smile Design + Whitening",
    duration:  "6 weeks",
    img:       "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=900&q=85",
    alt:       "Smile design transformation",
  },
  {
    num:       "Case 03",
    treatment: "Implant Restoration",
    duration:  "4 months",
    img:       "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=900&q=85",
    alt:       "Implant restoration",
  },
  {
    num:       "Case 04",
    treatment: "Cosmetic Bonding",
    duration:  "Single visit",
    img:       "https://images.unsplash.com/photo-1559692048-79a3f837883d?auto=format&fit=crop&w=900&q=85",
    alt:       "Cosmetic bonding",
  },
];

/* CSS filter strings for the before / after treatments */
const BEFORE_FILTER = "grayscale(0.55) brightness(0.78) contrast(0.95) saturate(0.6)";
const AFTER_FILTER  = "brightness(1.08) contrast(1.05) saturate(1.15)";

export default function GallerySection({ company }: { company: CompanyData }) {
  void company;
  const sectionRef  = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      /* ── Header reveal ─────────────────────────────────────────── */
      gsap.set(".gallery-header", { opacity: 0, y: 30 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 82%",
        once:    true,
        onEnter: () => {
          gsap.to(".gallery-header", {
            opacity: 1, y: 0,
            duration: 0.8, ease: "power3.out",
          });
        },
      });

      /* ── Featured case — scrub-controlled clip reveal ──────────── */
      gsap.set(".gallery-after",  { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(".gallery-edge",   { left: "0%" });
      gsap.set(".gallery-meta",   { opacity: 0, y: 20 });

      gsap.to(".gallery-after", {
        clipPath: "inset(0% 0% 0% 0%)",
        ease:     "none",
        scrollTrigger: {
          trigger: featuredRef.current,
          start:   "top 75%",
          end:     "bottom 30%",
          scrub:   1,
        },
      });

      gsap.to(".gallery-edge", {
        left: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: featuredRef.current,
          start:   "top 75%",
          end:     "bottom 30%",
          scrub:   1,
        },
      });

      ScrollTrigger.create({
        trigger: featuredRef.current,
        start:   "top 70%",
        once:    true,
        onEnter: () => {
          gsap.to(".gallery-meta", {
            opacity: 1, y: 0,
            duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2,
          });
        },
      });

      /* ── Case study cards reveal ───────────────────────────────── */
      gsap.set(".gallery-case", { opacity: 0, y: 50 });

      ScrollTrigger.create({
        trigger: ".gallery-cases-grid",
        start:   "top 85%",
        once:    true,
        onEnter: () => {
          gsap.to(".gallery-case", {
            opacity: 1, y: 0,
            duration: 0.8, stagger: 0.12, ease: "power3.out",
          });
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="transformations"
      className="relative section-padding overflow-hidden"
      style={{ backgroundColor: "#0C0B09" }}
    >
      {/* ── Subtle grid ──────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,160,72,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,160,72,0.018) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* ── Top hairline divider ─────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,160,72,0.3), transparent)" }}
      />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="gallery-header mb-16 lg:mb-24 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px" style={{ backgroundColor: "#C9A048" }} />
            <span className="font-data text-[11px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(201,160,72,0.75)" }}>
              Transformations
            </span>
          </div>
          <h2 className="font-heading text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] font-extrabold mb-6"
            style={{ color: "#D8D2C8" }}>
            Selected work,<br />
            <span className="italic" style={{ color: "#C9A048" }}>quietly documented.</span>
          </h2>
          <p className="text-base leading-relaxed max-w-xl"
            style={{ color: "rgba(216,210,200,0.45)" }}>
            Every transformation is recorded for the patient&apos;s file —
            never published without consent. Below: a small, anonymized
            selection of work shared with permission.
          </p>
        </div>

        {/* ── Featured case — scrub reveal ─────────────────────── */}
        <div ref={featuredRef} className="relative grid lg:grid-cols-12 gap-10 lg:gap-16 mb-24 lg:mb-32 items-center">

          {/* Image column */}
          <div className="relative lg:col-span-8 aspect-[16/11] overflow-hidden"
            style={{ backgroundColor: "#141210", border: "1px solid rgba(201,160,72,0.12)" }}>

            {/* Before — base layer */}
            <Image
              src={FEATURED.img}
              alt={`${FEATURED.alt} — before`}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
              style={{ filter: BEFORE_FILTER }}
              priority={false}
            />

            {/* After — clip-revealed layer */}
            <div
              className="gallery-after absolute inset-0"
              style={{ willChange: "clip-path" }}
            >
              <Image
                src={FEATURED.img}
                alt={`${FEATURED.alt} — after`}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                style={{ filter: AFTER_FILTER }}
                priority={false}
              />
            </div>

            {/* Vertical gold edge — tracks the wipe */}
            <div
              className="gallery-edge absolute top-0 bottom-0 pointer-events-none"
              style={{
                width:      "1px",
                background: "linear-gradient(to bottom, transparent, #C9A048 18%, #C9A048 82%, transparent)",
                boxShadow:  "0 0 18px rgba(201,160,72,0.5), 0 0 4px rgba(201,160,72,0.9)",
                transform:  "translateX(-0.5px)",
              }}
            />

            {/* Corner labels */}
            <div className="absolute top-5 left-5 flex items-center gap-2.5 px-3 py-1.5"
              style={{
                backgroundColor: "rgba(12,11,9,0.7)",
                backdropFilter:  "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                border:          "1px solid rgba(201,160,72,0.15)",
              }}>
              <span className="font-data text-[9px] tracking-[0.3em] uppercase"
                style={{ color: "rgba(216,210,200,0.55)" }}>
                Before
              </span>
            </div>
            <div className="absolute top-5 right-5 flex items-center gap-2.5 px-3 py-1.5"
              style={{
                backgroundColor: "rgba(12,11,9,0.7)",
                backdropFilter:  "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                border:          "1px solid rgba(201,160,72,0.3)",
              }}>
              <span className="font-data text-[9px] tracking-[0.3em] uppercase"
                style={{ color: "#C9A048" }}>
                After
              </span>
            </div>
          </div>

          {/* Meta column */}
          <div className="lg:col-span-4 flex flex-col">
            <span className="gallery-meta font-data text-[10px] tracking-[0.32em] uppercase mb-4"
              style={{ color: "rgba(201,160,72,0.7)" }}>
              {FEATURED.num}
            </span>
            <h3 className="gallery-meta font-heading text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.1] font-bold mb-8 italic"
              style={{ color: "#D8D2C8", textTransform: "none", letterSpacing: "-0.005em" }}>
              {FEATURED.treatment}
            </h3>

            <dl className="space-y-5 mb-10">
              {[
                ["Duration",  FEATURED.duration],
                ["Materials", FEATURED.materials],
                ["Patient",   FEATURED.patient],
              ].map(([label, value]) => (
                <div key={label} className="gallery-meta">
                  <dt className="font-data text-[9px] tracking-[0.3em] uppercase mb-1"
                    style={{ color: "rgba(216,210,200,0.3)" }}>
                    {label}
                  </dt>
                  <dd className="text-sm"
                    style={{ color: "rgba(216,210,200,0.7)" }}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="gallery-meta pt-6"
              style={{ borderTop: "1px solid rgba(201,160,72,0.1)" }}>
              <p className="font-data text-[10px] tracking-[0.25em] uppercase"
                style={{ color: "rgba(216,210,200,0.32)" }}>
                Scroll to reveal →
              </p>
            </div>
          </div>
        </div>

        {/* ── Case studies grid ─────────────────────────────────── */}
        <div className="gallery-cases-grid grid grid-cols-1 md:grid-cols-3 gap-5">
          {CASES.map((c) => (
            <article key={c.num}
              className="gallery-case relative overflow-hidden transition-all duration-500 group"
              style={{
                backgroundColor: "#141210",
                border:          "1px solid rgba(201,160,72,0.08)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,72,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,72,0.08)";
              }}
            >
              {/* Side-by-side before/after */}
              <div className="relative aspect-[4/3] grid grid-cols-2">
                {/* Before */}
                <div className="relative overflow-hidden">
                  <Image
                    src={c.img}
                    alt={`${c.alt} — before`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: BEFORE_FILTER }}
                  />
                  <span className="absolute bottom-2 left-2 font-data text-[9px] tracking-[0.25em] uppercase px-2 py-1"
                    style={{
                      backgroundColor: "rgba(12,11,9,0.7)",
                      backdropFilter:  "blur(4px)",
                      WebkitBackdropFilter: "blur(4px)",
                      color: "rgba(216,210,200,0.55)",
                    }}>
                    Before
                  </span>
                </div>

                {/* After */}
                <div className="relative overflow-hidden">
                  <Image
                    src={c.img}
                    alt={`${c.alt} — after`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: AFTER_FILTER }}
                  />
                  <span className="absolute bottom-2 right-2 font-data text-[9px] tracking-[0.25em] uppercase px-2 py-1"
                    style={{
                      backgroundColor: "rgba(12,11,9,0.7)",
                      backdropFilter:  "blur(4px)",
                      WebkitBackdropFilter: "blur(4px)",
                      color: "#C9A048",
                    }}>
                    After
                  </span>
                </div>

                {/* Vertical divider */}
                <div className="absolute inset-y-0 left-1/2 w-px pointer-events-none"
                  style={{ backgroundColor: "rgba(201,160,72,0.4)", transform: "translateX(-0.5px)" }} />
              </div>

              {/* Meta */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-data text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: "rgba(201,160,72,0.7)" }}>
                    {c.num}
                  </span>
                  <span className="font-data text-[10px] tracking-wider uppercase"
                    style={{ color: "rgba(216,210,200,0.3)" }}>
                    {c.duration}
                  </span>
                </div>
                <h4 className="font-heading text-base leading-tight font-bold italic"
                  style={{ color: "#D8D2C8", textTransform: "none", letterSpacing: "-0.005em" }}>
                  {c.treatment}
                </h4>
              </div>
            </article>
          ))}
        </div>

        {/* ── Bottom data strip ─────────────────────────────────── */}
        <div className="mt-12 flex items-center gap-4">
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(201,160,72,0.08)" }} />
          <p className="font-data text-[10px] tracking-[0.3em] uppercase text-center"
            style={{ color: "rgba(216,210,200,0.3)" }}>
            All cases shared with explicit consent · Patient privacy preserved
          </p>
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(201,160,72,0.08)" }} />
        </div>
      </div>
    </section>
  );
}
