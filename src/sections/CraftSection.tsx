"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Gem, Pencil, Anchor, Sun, AlignJustify, Brush, ArrowRight } from "lucide-react";
import CharText from "@/components/shared/CharText";
import type { CompanyData } from "@/lib/types";

/**
 * "Our Craft" — six treatments presented as pieces in an atelier collection.
 *
 * Design intent:
 *   - Typography-first (Playfair italic + Mono numbering), no stock photos
 *     per card. The atelier voice is carried by spacing, gold accents, and
 *     the engraved-number watermark — not by lifestyle imagery.
 *   - Single accent (gold) instead of per-service palettes. Luxury reads
 *     as restraint; HVAC's heating/aircon/etc. multi-color treatment would
 *     fragment the cohesion the dental DA depends on.
 *   - The signature treatment (veneers, index 0) is featured with a tighter
 *     gold border by default; the others reveal it on hover.
 */

const SERVICES = [
  {
    num:      "01",
    icon:     Gem,
    domain:   "Porcelain Veneers",
    headline: "The Porcelain Veneer",
    detail:   "Hand-crafted porcelain shells, sculpted tooth-by-tooth to match the geometry of your face. Each set is designed in-house, never delegated.",
    tags:     ["Lithium Disilicate", "Zero-Prep Options", "Lifetime Bonding"],
    cta:      "Begin Consultation",
    featured: true,
  },
  {
    num:      "02",
    icon:     Pencil,
    domain:   "Smile Design",
    headline: "Bespoke Smile Design",
    detail:   "A complete cosmetic blueprint — proportion, color, line, character. Digital previews before a single tooth is touched.",
    tags:     ["3D Mock-Up", "DSD Protocol", "Try-In Phase"],
    cta:      "Discover the Process",
    featured: false,
  },
  {
    num:      "03",
    icon:     Anchor,
    domain:   "Dental Implants",
    headline: "Permanent Restoration",
    detail:   "Titanium foundations, ceramic crowns. The closest thing to a tooth that was never lost — engineered to last decades.",
    tags:     ["Single Tooth", "Full-Arch", "Same-Day Options"],
    cta:      "Schedule a Consult",
    featured: false,
  },
  {
    num:      "04",
    icon:     Sun,
    domain:   "Whitening",
    headline: "Luminance Treatment",
    detail:   "Professional-grade whitening calibrated to your enamel. No sensitivity protocols, no over-bleached effect — just measured brightness.",
    tags:     ["In-Office", "Custom Trays", "Sensitivity-Safe"],
    cta:      "Book Your Session",
    featured: false,
  },
  {
    num:      "05",
    icon:     AlignJustify,
    domain:   "Clear Aligners",
    headline: "Discreet Alignment",
    detail:   "Invisible orthodontics for adults who refused braces the first time. Designed and monitored entirely in-office, no third-party clinics.",
    tags:     ["Invisalign Diamond", "Adult Cases", "Refinement Plans"],
    cta:      "See If You Qualify",
    featured: false,
  },
  {
    num:      "06",
    icon:     Brush,
    domain:   "Cosmetic Bonding",
    headline: "Sculpted Refinement",
    detail:   "Composite layered by hand to close gaps, soften edges, restore proportion. The conservative answer when veneers would be excessive.",
    tags:     ["Single-Visit", "Reversible", "Same-Day Result"],
    cta:      "Schedule a Visit",
    featured: false,
  },
];

export default function CraftSection({ company }: { company: CompanyData }) {
  void company; /* reserved — will be used for "[city] residents" copy in a later iteration */
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      /* Header: eyebrow + paragraph fade in, but the H2 reveals
         CHARACTER BY CHARACTER for editorial weight. */
      gsap.set(".craft-eyebrow",  { opacity: 0, y: 20 });
      gsap.set(".craft-lede",     { opacity: 0, y: 20 });
      gsap.set(".char-reveal",    { y: "115%", opacity: 0 });
      gsap.set(".craft-card",     { opacity: 0, y: 50, scale: 0.97 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 82%",
        once:    true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".craft-eyebrow", { opacity: 1, y: 0, duration: 0.6 }, 0)
            .to(".char-reveal",   { y: "0%", opacity: 1, duration: 0.85, stagger: 0.022 }, 0.15)
            .to(".craft-lede",    { opacity: 1, y: 0, duration: 0.7 }, 0.7)
            .to(".craft-card",    { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.08 }, 0.5);
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="craft"
      className="relative section-padding overflow-hidden"
      style={{ backgroundColor: "#F7F4EE" }}     /* ── LIGHT REGISTER ── */
                                                 /* warm ivory — the
                                                    color of the perfect
                                                    tooth. After the
                                                    obsidian hero, the
                                                    page opens. */
    >
      {/* ── Subtle gold paper grid — visible enough on ivory to feel
              like premium printed stock without screaming. ───────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,160,72,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,160,72,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* ── Warm panel breath — soft cream wash, not gold halo.
              On a light bg, gold radial gradients muddy. We use a barely
              visible warm-on-warm panel that gently moves. ──────────── */}
      <div
        className="absolute -left-48 top-1/4 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(217,178,92,0.12) 0%, transparent 60%)",
          animation:  "breathe-gold 14s ease-in-out infinite",
          mixBlendMode: "multiply",
        }}
      />
      <div
        className="absolute -right-32 bottom-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:     "radial-gradient(ellipse at center, rgba(26,22,18,0.04) 0%, transparent 65%)",
          animation:      "breathe-gold 18s ease-in-out infinite reverse",
          animationDelay: "4s",
        }}
      />

      {/* ── Top hairline — gold edge marking the sombre→clair boundary ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,160,72,0.55), transparent)" }}
      />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="mb-16 lg:mb-20 max-w-3xl">
          <div className="craft-eyebrow flex items-center gap-3 mb-6">
            <div className="w-6 h-px" style={{ backgroundColor: "#C9A048" }} />
            <span className="font-data text-[11px] tracking-[0.3em] uppercase"
              style={{ color: "#8E6E28" }}>
              Our Craft
            </span>
          </div>
          <h2 className="font-heading text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] font-extrabold mb-6"
            style={{ color: "#1A1612" }}>
            <span className="block overflow-hidden" style={{ paddingTop: "0.05em", paddingBottom: "0.08em" }}>
              <CharText text="Six disciplines." />
            </span>
            <span className="block overflow-hidden italic" style={{ color: "#C9A048", paddingTop: "0.05em", paddingBottom: "0.12em" }}>
              <CharText text="One atelier." />
            </span>
          </h2>
          <p className="craft-lede text-base leading-relaxed max-w-xl"
            style={{ color: "rgba(26,22,18,0.6)" }}>
            Every treatment is designed in-house, by the same hands that perform it.
            No outsourced labs, no rotating clinicians — just the consistency that
            comes from a single atelier.
          </p>
        </div>

        {/* ── 3-column grid — cards now feel like premium paper stock ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((svc) => {
            const Icon = svc.icon;
            return (
              <article
                key={svc.num}
                className="craft-card group relative flex flex-col p-8 lg:p-9 overflow-hidden transition-all duration-500"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: svc.featured
                    ? "1px solid rgba(201,160,72,0.5)"
                    : "1px solid rgba(201,160,72,0.18)",
                  boxShadow: svc.featured
                    ? "0 1px 0 rgba(201,160,72,0.05), 0 8px 24px rgba(26,22,18,0.04)"
                    : "0 1px 0 rgba(201,160,72,0.04), 0 4px 14px rgba(26,22,18,0.03)",
                  minHeight: "26rem",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(201,160,72,0.7)";
                  el.style.boxShadow   = "0 1px 0 rgba(201,160,72,0.12), 0 18px 50px rgba(26,22,18,0.10)";
                  el.style.transform   = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = svc.featured
                    ? "rgba(201,160,72,0.5)"
                    : "rgba(201,160,72,0.18)";
                  el.style.boxShadow   = svc.featured
                    ? "0 1px 0 rgba(201,160,72,0.05), 0 8px 24px rgba(26,22,18,0.04)"
                    : "0 1px 0 rgba(201,160,72,0.04), 0 4px 14px rgba(26,22,18,0.03)";
                  el.style.transform   = "translateY(0)";
                }}
              >
                {/* Number watermark — engraved in the corner.
                    On light bg, gold needs a touch more opacity to read. */}
                <span
                  className="absolute -top-4 -right-3 font-heading font-extrabold leading-none select-none pointer-events-none italic"
                  style={{
                    fontSize: "10rem",
                    color:    "rgba(201,160,72,0.09)",
                  }}
                >
                  {svc.num}
                </span>

                {/* Bottom hairline accent — reveals on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(to right, transparent, rgba(201,160,72,0.7), transparent)" }}
                />

                {/* Top row — domain + icon */}
                <div className="relative flex items-center justify-between mb-10">
                  <span className="font-data text-[10px] tracking-[0.32em] uppercase"
                    style={{ color: "#8E6E28" }}>
                    {svc.domain}
                  </span>
                  <div
                    className="w-11 h-11 flex items-center justify-center transition-colors duration-300"
                    style={{
                      backgroundColor: "rgba(201,160,72,0.08)",
                      border:          "1px solid rgba(201,160,72,0.28)",
                    }}
                  >
                    <Icon size={17} style={{ color: "#C9A048" }} />
                  </div>
                </div>

                {/* Headline — Playfair italic, deep warm ink color */}
                <h3
                  className="relative font-heading text-[clamp(1.55rem,2.2vw,1.95rem)] leading-[1.05] font-bold mb-5"
                  style={{ color: "#1A1612", textTransform: "none", letterSpacing: "-0.005em" }}
                >
                  {svc.headline}
                </h3>

                {/* Detail */}
                <p className="relative text-sm leading-relaxed mb-7 flex-1"
                  style={{ color: "rgba(26,22,18,0.6)" }}>
                  {svc.detail}
                </p>

                {/* Tags */}
                <div className="relative flex flex-wrap gap-2 mb-8">
                  {svc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-data text-[10px] tracking-wider uppercase px-2.5 py-1 transition-colors duration-300"
                      style={{
                        color:  "#8E6E28",
                        border: "1px solid rgba(201,160,72,0.32)",
                        backgroundColor: "rgba(201,160,72,0.04)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href="#contact"
                  className="relative flex items-center gap-2.5 text-[11px] font-bold tracking-[0.22em] uppercase transition-colors duration-300 w-fit"
                  style={{ color: "#8E6E28" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#C9A048")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#8E6E28")}
                >
                  <span>{svc.cta}</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                </a>
              </article>
            );
          })}
        </div>

        {/* ── Bottom data strip ─────────────────────────────────────── */}
        <div className="mt-12 flex items-center gap-4">
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(201,160,72,0.22)" }} />
          <p className="font-data text-[10px] tracking-[0.3em] uppercase text-center"
            style={{ color: "rgba(26,22,18,0.45)" }}>
            Every Piece Designed In-House · Never Outsourced
          </p>
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(201,160,72,0.22)" }} />
        </div>
      </div>
    </section>
  );
}
