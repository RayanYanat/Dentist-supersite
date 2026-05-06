"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { CompanyData } from "@/lib/types";

/**
 * "Transformations" — refondue v2.
 *
 * v1 problem: featured case used the SAME Unsplash photo twice with a CSS
 * filter swap to fake a before/after. Visible to anyone — biggest "lowcost"
 * tell on the page.
 *
 * v2 approach: drop the before/after fiction entirely. Reframe the section
 * as an EDITORIAL DOSSIER — four "Plates" presented like a master craftsman's
 * portfolio book. Each plate is an editorial spread with:
 *
 *   - A single atmospheric hero image (used as MOOD, not as proof)
 *   - A monumental Playfair title that reveals character-by-character
 *     when the plate enters the viewport (no SplitText paid plugin)
 *   - A descriptive paragraph in atelier voice
 *   - A blueprint-style metadata grid: Duration · Materials · Patient
 *   - Gold corner brackets framing the image (atelier signature)
 *   - Subtle image parallax as the plate scrolls past
 *   - Image position alternates left/right between plates for rhythm
 *
 * Why this is more luxurious than before/after:
 *   Real luxury brands don't sell with proof — they sell with artistry.
 *   Hermès doesn't show "before sewing / after sewing" pictures of a Birkin.
 *   The dental atelier does the same: it documents the work, doesn't compare.
 *
 *   The "Transformations" name stays — the transformation is the journey
 *   FROM consultation TO finished piece, told through the documentation.
 */

const PLATES = [
  {
    num:        "01",
    discipline: "Porcelain · Lithium Disilicate",
    title:      "Hand-layered Veneers",
    detail:     "Lithium disilicate veneers, sculpted tooth-by-tooth from a wax-up that took three weeks of revisions. Each shell signed and verified before bonding.",
    duration:   "12 weeks",
    materials:  "E.max Press · Layered",
    patient:    "F · 38 · Cosmetic",
    img:        "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600&q=85",
    alt:        "Porcelain veneer study",
  },
  {
    num:        "02",
    discipline: "Bespoke Smile Design",
    title:      "The Architecture of a Smile",
    detail:     "A complete cosmetic blueprint — proportion, axis, color, character. Designed digitally, mocked up in wax, tried in temporary, refined twice before the final pieces are pressed.",
    duration:   "6 weeks",
    materials:  "DSD · Digital Mock-up",
    patient:    "M · 44 · Smile Redesign",
    img:        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1600&q=85",
    alt:        "Smile design study",
  },
  {
    num:        "03",
    discipline: "Implant · Single-tooth",
    title:      "A Tooth That Was Never Lost",
    detail:     "Titanium foundation, ceramic crown. Engineered to outlast its neighbours. The closest approximation we know to a tooth that was never extracted in the first place.",
    duration:   "4 months",
    materials:  "Titanium · Zirconia Crown",
    patient:    "F · 52 · Lateral Incisor",
    img:        "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=1600&q=85",
    alt:        "Implant restoration study",
  },
  {
    num:        "04",
    discipline: "Composite · Hand-sculpted",
    title:      "The Conservative Answer",
    detail:     "Composite layered by hand to close gaps, soften edges, restore proportion — when veneers would be excessive. Reversible, single-visit, surgically conservative.",
    duration:   "Single visit",
    materials:  "Nano-hybrid Composite",
    patient:    "F · 29 · Diastema Closure",
    img:        "https://images.unsplash.com/photo-1559692048-79a3f837883d?auto=format&fit=crop&w=1600&q=85",
    alt:        "Cosmetic bonding study",
  },
];

/* Char split helper — reused pattern from HeroSection */
function CharText({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {text.split("").map((c, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="plate-char inline-block"
          style={{ whiteSpace: "pre" }}
        >
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}

export default function GallerySection({ company }: { company: CompanyData }) {
  void company;
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      /* Section header */
      gsap.set(".gallery-header", { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 82%",
        once:    true,
        onEnter: () => {
          gsap.to(".gallery-header", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
        },
      });

      /* Each plate animates independently when it enters the viewport.
         Querying within scope only — no global selectors leaking across pages. */
      const plates = gsap.utils.toArray<HTMLElement>(".plate");

      plates.forEach((plate) => {
        /* initial states */
        const num     = plate.querySelector(".plate-num");
        const chars   = plate.querySelectorAll(".plate-char");
        const detail  = plate.querySelector(".plate-detail");
        const meta    = plate.querySelectorAll(".plate-meta-row");
        const image   = plate.querySelector<HTMLElement>(".plate-image");
        const corners = plate.querySelectorAll(".plate-corner");

        gsap.set(num,     { opacity: 0, x: -20 });
        gsap.set(chars,   { y: "115%", opacity: 0 });
        gsap.set(detail,  { opacity: 0, y: 20 });
        gsap.set(meta,    { opacity: 0, y: 12 });
        gsap.set(image,   { opacity: 0, scale: 1.06 });
        gsap.set(corners, { opacity: 0, scale: 0.7 });

        /* Entry timeline — fires once when plate hits 75% */
        ScrollTrigger.create({
          trigger: plate,
          start:   "top 78%",
          once:    true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.to(image,   { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" }, 0)
              .to(corners, { opacity: 0.65, scale: 1, duration: 0.5, stagger: 0.06 }, 0.4)
              .to(num,     { opacity: 1, x: 0, duration: 0.6 }, 0.2)
              .to(chars,   { y: "0%", opacity: 1, duration: 0.8, stagger: 0.022 }, 0.4)
              .to(detail,  { opacity: 1, y: 0, duration: 0.6 }, 0.9)
              .to(meta,    { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 1.1);
          },
        });

        /* Subtle image parallax — moves slower than scroll, gentle separation */
        if (image) {
          gsap.to(image, {
            yPercent: -8,
            ease:     "none",
            scrollTrigger: {
              trigger: plate,
              start:   "top bottom",
              end:     "bottom top",
              scrub:   1,
            },
          });
        }
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
      {/* ── Subtle grid texture ──────────────────────────────────── */}
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

      {/* ── Top hairline divider ────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,160,72,0.3), transparent)" }}
      />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="gallery-header mb-20 lg:mb-32 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px" style={{ backgroundColor: "#C9A048" }} />
            <span className="font-data text-[11px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(201,160,72,0.75)" }}>
              Transformations · Selected Plates
            </span>
          </div>
          <h2 className="font-heading text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] font-extrabold mb-6"
            style={{ color: "#D8D2C8" }}>
            A small dossier,<br />
            <span className="italic" style={{ color: "#C9A048" }}>quietly documented.</span>
          </h2>
          <p className="text-base leading-relaxed max-w-xl"
            style={{ color: "rgba(216,210,200,0.45)" }}>
            Every piece is recorded for the patient&apos;s file — never published
            without consent. Below: four anonymised studies, shared with permission,
            from the atelier&apos;s archive.
          </p>
        </div>

        {/* ── Plates ─────────────────────────────────────────────── */}
        <div className="space-y-32 lg:space-y-48">
          {PLATES.map((plate, i) => {
            const imageRight = i % 2 === 1;
            return (
              <article
                key={plate.num}
                className="plate relative grid lg:grid-cols-12 gap-10 lg:gap-16 items-center"
              >
                {/* Image column */}
                <div
                  className={`relative lg:col-span-7 ${imageRight ? "lg:order-2" : ""}`}
                >
                  <div
                    className="plate-image relative aspect-[4/5] sm:aspect-[16/11] overflow-hidden will-change-transform"
                    style={{
                      backgroundColor: "#141210",
                      border:          "1px solid rgba(201,160,72,0.12)",
                    }}
                  >
                    <Image
                      src={plate.img}
                      alt={plate.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                      style={{
                        filter: "brightness(0.92) contrast(1.04) saturate(1.05)",
                      }}
                      priority={false}
                    />

                    {/* Atelier corner brackets — animate in independently */}
                    {[
                      { pos: "top-3 left-3",     borders: { borderTop: true,    borderLeft: true  } },
                      { pos: "top-3 right-3",    borders: { borderTop: true,    borderRight: true } },
                      { pos: "bottom-3 left-3",  borders: { borderBottom: true, borderLeft: true  } },
                      { pos: "bottom-3 right-3", borders: { borderBottom: true, borderRight: true } },
                    ].map((b, k) => (
                      <div
                        key={k}
                        className={`plate-corner absolute ${b.pos} w-7 h-7 pointer-events-none`}
                        style={{
                          borderTop:    b.borders.borderTop    ? "1px solid #C9A048" : undefined,
                          borderBottom: b.borders.borderBottom ? "1px solid #C9A048" : undefined,
                          borderLeft:   b.borders.borderLeft   ? "1px solid #C9A048" : undefined,
                          borderRight:  b.borders.borderRight  ? "1px solid #C9A048" : undefined,
                        }}
                      />
                    ))}

                    {/* Plate label inside the frame, bottom-left — like a photo print */}
                    <div className="absolute bottom-5 left-5 flex items-center gap-2.5 px-3 py-1.5"
                      style={{
                        backgroundColor:      "rgba(12,11,9,0.72)",
                        backdropFilter:       "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                        border:               "1px solid rgba(201,160,72,0.18)",
                      }}>
                      <span className="font-data text-[9px] tracking-[0.32em] uppercase"
                        style={{ color: "rgba(201,160,72,0.7)" }}>
                        Plate · {plate.num}/04
                      </span>
                    </div>
                  </div>
                </div>

                {/* Text column */}
                <div className={`lg:col-span-5 ${imageRight ? "lg:order-1" : ""}`}>
                  <span className="plate-num inline-block font-data text-[10px] tracking-[0.32em] uppercase mb-5"
                    style={{ color: "rgba(201,160,72,0.65)" }}>
                    {plate.discipline}
                  </span>

                  <h3
                    className="font-heading font-bold mb-8 italic"
                    style={{
                      fontSize:      "clamp(1.8rem, 3.2vw, 3rem)",
                      lineHeight:    "1.04",
                      letterSpacing: "-0.01em",
                      color:         "#D8D2C8",
                      textTransform: "none",
                    }}
                  >
                    <span className="block overflow-hidden" style={{ paddingTop: "0.05em", paddingBottom: "0.1em" }}>
                      <CharText text={plate.title} />
                    </span>
                  </h3>

                  <p className="plate-detail text-base leading-relaxed mb-10 max-w-md"
                    style={{ color: "rgba(216,210,200,0.55)" }}>
                    {plate.detail}
                  </p>

                  <dl className="space-y-5">
                    {[
                      ["Duration",  plate.duration],
                      ["Materials", plate.materials],
                      ["Patient",   plate.patient],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="plate-meta-row grid grid-cols-[120px_1fr] items-baseline gap-4 pb-4"
                        style={{ borderBottom: "1px solid rgba(201,160,72,0.08)" }}
                      >
                        <dt className="font-data text-[9px] tracking-[0.3em] uppercase"
                          style={{ color: "rgba(216,210,200,0.32)" }}>
                          {label}
                        </dt>
                        <dd className="font-data text-sm tracking-wide"
                          style={{ color: "rgba(216,210,200,0.78)" }}>
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            );
          })}
        </div>

        {/* ── Bottom data strip ─────────────────────────────────── */}
        <div className="mt-24 lg:mt-32 flex items-center gap-4">
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(201,160,72,0.08)" }} />
          <p className="font-data text-[10px] tracking-[0.3em] uppercase text-center"
            style={{ color: "rgba(216,210,200,0.32)" }}>
            All Plates Shared with Explicit Consent · Patient Identity Preserved
          </p>
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(201,160,72,0.08)" }} />
        </div>
      </div>
    </section>
  );
}
