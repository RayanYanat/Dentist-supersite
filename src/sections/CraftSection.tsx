"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { CompanyData } from "@/lib/types";

/**
 * Scene I — "The Crafts"
 *
 * Compact editorial ladder of the disciplines offered by the atelier.
 * The previous theatrical "3 acts of method" mechanic has been retired —
 * it was content-heavy in a way that locked the prospect into a specific
 * process narrative. This new version is service-first: numbered rows,
 * italic names, mono taglines. Easier to skim, easier for a prospect to
 * project their own services into.
 *
 * Atmospheric layers (drifting motes + slow scan beam) carry over so the
 * section still feels alive between two heavy moments.
 */

/* Each discipline has a custom line-art SVG icon — small, mono gold,
 * inline so it ships with the HTML (no extra request). The icons are
 * deliberately abstract so they read as "dental design system" rather
 * than literal photography. They sit before the italic name and ride
 * the same translateX hover as the name. */
type DisciplineIcon = (props: { className?: string }) => React.JSX.Element;

const VeneerIcon: DisciplineIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none"
    stroke="#C9A048" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
    {/* Stylised tooth — single front incisor */}
    <path d="M11 9 C 11 7, 13 6, 16 6 C 19 6, 21 7, 21 9 L 21 19 C 21 23, 19 25, 17 25 C 15.5 25, 15 23.5, 15 22 C 15 23.5, 14.5 25, 13 25 C 11 25, 9 23, 9 19 Z" />
    {/* Veneer shimmer — top edge highlight */}
    <path d="M12.5 8.5 L 14 11" opacity="0.7" />
    <path d="M19.5 8.5 L 18 11" opacity="0.7" />
  </svg>
);

const SmileDesignIcon: DisciplineIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none"
    stroke="#C9A048" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
    {/* Smile arc */}
    <path d="M5 16 Q 16 25, 27 16" />
    {/* Tooth markers above smile line */}
    <path d="M9.5 14 L 9.5 16.6" />
    <path d="M13 12.4 L 13 16.9" />
    <path d="M16 11.6 L 16 17" />
    <path d="M19 12.4 L 19 16.9" />
    <path d="M22.5 14 L 22.5 16.6" />
    {/* Measurement bracket above */}
    <path d="M5 8 L 5 6 L 27 6 L 27 8" opacity="0.5" />
  </svg>
);

const ImplantIcon: DisciplineIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none"
    stroke="#C9A048" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
    {/* Crown on top */}
    <path d="M11 4 C 11 3, 13 2.5, 16 2.5 C 19 2.5, 21 3, 21 4 L 20 9 L 12 9 Z" />
    {/* Abutment */}
    <path d="M13.5 9 L 13.5 11 L 18.5 11 L 18.5 9" />
    {/* Implant body */}
    <path d="M13 12 L 13 27" />
    <path d="M19 12 L 19 27" />
    {/* Threads — horizontal ticks */}
    <path d="M13 15 L 19 15" opacity="0.6" />
    <path d="M13 18 L 19 18" opacity="0.6" />
    <path d="M13 21 L 19 21" opacity="0.6" />
    <path d="M13 24 L 19 24" opacity="0.6" />
  </svg>
);

const BondingIcon: DisciplineIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none"
    stroke="#C9A048" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
    {/* Half-tooth profile */}
    <path d="M10 9 C 10 7, 11.5 6, 13 6 L 13 24 C 13 25.5, 11.5 26, 10 26 C 8 26, 7 24, 7 20 Z" />
    {/* Applicator stick from upper-right */}
    <path d="M16 14 L 25 6" />
    {/* Applicator tip — small circle + reservoir */}
    <circle cx="24.5" cy="6.2" r="1.4" />
    {/* Bonding drop forming */}
    <path d="M15 15.5 L 17 13.5" opacity="0.6" />
  </svg>
);

const DISCIPLINES: { num: string; name: string; tag: string; Icon: DisciplineIcon }[] = [
  { num: "01", name: "Porcelain Veneers", tag: "Lithium disilicate &middot; Hand-layered", Icon: VeneerIcon },
  { num: "02", name: "Smile Design",      tag: "3D mock-up &middot; Try-in phase",         Icon: SmileDesignIcon },
  { num: "03", name: "Dental Implants",   tag: "Titanium &middot; Same-day options",       Icon: ImplantIcon },
  { num: "04", name: "Cosmetic Bonding",  tag: "Single-visit &middot; Reversible",         Icon: BondingIcon },
];

export default function CraftSection({ company }: { company: CompanyData }) {
  void company;
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      /* ── Header reveal ─────────────────────────────────────────────── */
      gsap.set([".m2-meta", ".m2-rule", ".m2-heading", ".m2-lede"], { opacity: 0, y: 18 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 80%",
        once:    true,
        onEnter: () => {
          gsap.to(".m2-meta",    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
          gsap.to(".m2-rule",    { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.1 });
          gsap.to(".m2-heading", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.2 });
          gsap.to(".m2-lede",    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.5 });
        },
      });

      /* ── Disciplines ladder reveal ──────────────────────────────────
       * Top hairline draws in, eyebrow fades, rows stagger in, then
       * inter-row rules draw left-to-right with matching stagger, and
       * finally the closing bottom rule expands. */
      gsap.set(".m2-disc-rule-top",    { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".m2-disc-eyebrow",     { opacity: 0, y: 14 });
      gsap.set(".m2-disc-row",         { opacity: 0, y: 22 });
      gsap.set(".m2-disc-row-rule",    { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".m2-disc-rule-bot",    { scaleX: 0, transformOrigin: "left center" });

      ScrollTrigger.create({
        trigger: ".m2-disc-block",
        start:   "top 85%",
        once:    true,
        onEnter: () => {
          gsap.to(".m2-disc-rule-top", { scaleX: 1, duration: 0.9, ease: "expo.out" });
          gsap.to(".m2-disc-eyebrow",  { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 });
          gsap.to(".m2-disc-row",      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.09, delay: 0.4 });
          gsap.to(".m2-disc-row-rule", { scaleX: 1, duration: 0.7, ease: "expo.out", stagger: 0.09, delay: 0.5 });
          gsap.to(".m2-disc-rule-bot", { scaleX: 1, duration: 1.0, ease: "expo.out", delay: 1.4 });
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="craft"
      className="relative w-full"
      style={{
        backgroundColor: "#0C0B09",
        overflow:        "clip",
      }}
    >
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
        className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(201,160,72,0.07) 0%, transparent 65%)",
          animation:  "breathe-gold 18s ease-in-out infinite",
        }}
      />

      {/* Ambient drifting motes — deterministic positions for SSR/CSR match */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {Array.from({ length: 14 }).map((_, i) => {
          const left  = (i * 11 + 5) % 100;
          const dur   = 16 + (i % 5) * 4;
          const delay = (i * 1.7) % 14;
          const size  = i % 3 === 0 ? 2.5 : i % 3 === 1 ? 1.8 : 1.2;
          return (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left:           `${left}%`,
                bottom:         "-10px",
                width:          `${size}px`,
                height:         `${size}px`,
                backgroundColor: "rgba(201,160,72,0.42)",
                boxShadow:       "0 0 6px rgba(201,160,72,0.32)",
                animation:       `m2-drift ${dur}s linear infinite`,
                animationDelay:  `-${delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* Slow vertical scan beam */}
      <div
        className="absolute left-0 right-0 z-[1] pointer-events-none"
        style={{
          height:    "1px",
          background: "linear-gradient(to right, transparent 0%, rgba(201,160,72,0.18) 20%, rgba(240,208,128,0.45) 50%, rgba(201,160,72,0.18) 80%, transparent 100%)",
          boxShadow: "0 0 14px rgba(201,160,72,0.25)",
          animation: "m2-scan 11s ease-in-out infinite",
        }}
      />

      <div className="relative z-[2] max-w-7xl mx-auto px-6 lg:px-12 pt-24 lg:pt-32 pb-20 lg:pb-24">

        {/* ── Section header ─────────────────────────────────────────── */}
        <div className="mb-12 lg:mb-16 max-w-3xl">
          <div className="m2-meta flex items-center gap-3 mb-8">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "#C9A048", animation: "caret-pulse 1.8s ease-in-out infinite" }}
            />
            <span
              className="font-data text-[10px] tracking-[0.45em] uppercase"
              style={{ color: "rgba(240,234,224,0.7)" }}
            >
              I &mdash; The Crafts
            </span>
          </div>

          <div
            className="m2-rule h-px w-16 mb-8"
            style={{ backgroundColor: "#C9A048", transformOrigin: "left center" }}
          />

          <h2
            className="m2-heading font-display"
            style={{
              fontSize:      "clamp(2.6rem, 6.5vw, 5.6rem)",
              lineHeight:    "0.96",
              letterSpacing: "-0.02em",
              color:         "#F0EAE0",
              fontWeight:    400,
            }}
          >
            Four crafts.
            <br />
            <span style={{ fontStyle: "italic", color: "#C9A048" }}>One atelier.</span>
          </h2>

          <p
            className="m2-lede mt-8 text-base leading-relaxed max-w-lg"
            style={{ color: "rgba(216,210,200,0.6)" }}
          >
            Cosmetic dentistry, composed by one hand. Lithium disilicate, hand-layered.
            Surgical loupes, never replaced by software. The materials of the atelier,
            applied to a single subject at a time.
          </p>
        </div>

        {/* ── The Crafts — editorial ladder ────────────────────────────
         * Numbered row + italic discipline name + mono tagline. On hover
         * the row warms (gold-warm number, gold-warm tagline) and the
         * name shifts slightly right — single visual moment per row. */}
        <div className="m2-disc-block">
          <div
            className="m2-disc-rule-top h-px w-full mb-10 lg:mb-12"
            style={{ backgroundColor: "rgba(201,160,72,0.28)" }}
          />

          <div className="m2-disc-eyebrow flex items-center gap-3 mb-8 lg:mb-10">
            <div className="w-6 h-px" style={{ backgroundColor: "#C9A048" }} />
            <span
              className="font-data text-[11px] tracking-[0.42em] uppercase"
              style={{ color: "rgba(201,160,72,0.78)" }}
            >
              The Disciplines
            </span>
          </div>

          <div className="flex flex-col">
            {DISCIPLINES.map((d, i) => (
              <div key={d.name}>
                <article
                  className="m2-disc-row group grid grid-cols-12 items-center gap-3 lg:gap-6 py-5 lg:py-7 cursor-default"
                  onMouseEnter={(e) => {
                    const root = e.currentTarget as HTMLElement;
                    const num  = root.querySelector(".disc-num")  as HTMLElement | null;
                    const icon = root.querySelector(".disc-icon") as HTMLElement | null;
                    const name = root.querySelector(".disc-name") as HTMLElement | null;
                    const tag  = root.querySelector(".disc-tag")  as HTMLElement | null;
                    if (num)  num.style.color      = "#D9B25C";
                    if (icon) icon.style.transform  = "translateX(4px)";
                    if (icon) icon.style.opacity    = "1";
                    if (name) name.style.transform  = "translateX(10px)";
                    if (tag)  tag.style.color      = "#D9B25C";
                  }}
                  onMouseLeave={(e) => {
                    const root = e.currentTarget as HTMLElement;
                    const num  = root.querySelector(".disc-num")  as HTMLElement | null;
                    const icon = root.querySelector(".disc-icon") as HTMLElement | null;
                    const name = root.querySelector(".disc-name") as HTMLElement | null;
                    const tag  = root.querySelector(".disc-tag")  as HTMLElement | null;
                    if (num)  num.style.color      = "rgba(201,160,72,0.55)";
                    if (icon) icon.style.transform  = "translateX(0px)";
                    if (icon) icon.style.opacity    = "0.7";
                    if (name) name.style.transform  = "translateX(0px)";
                    if (tag)  tag.style.color      = "rgba(201,160,72,0.65)";
                  }}
                >
                  <span
                    className="disc-num col-span-2 lg:col-span-1 font-data text-xs tracking-[0.32em]"
                    style={{
                      color:      "rgba(201,160,72,0.55)",
                      transition: "color 300ms ease",
                    }}
                  >
                    {d.num}.
                  </span>
                  <span
                    className="disc-icon hidden sm:flex sm:col-span-1 items-center justify-center"
                    style={{
                      opacity:    0.7,
                      transition: "transform 350ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease",
                    }}
                    aria-hidden="true"
                  >
                    <d.Icon className="w-7 h-7 lg:w-8 lg:h-8" />
                  </span>
                  <span
                    className="disc-name col-span-10 sm:col-span-9 lg:col-span-6 font-display italic"
                    style={{
                      fontSize:      "clamp(1.8rem, 4.6vw, 3.6rem)",
                      lineHeight:    1,
                      letterSpacing: "-0.02em",
                      color:         "#F0EAE0",
                      fontWeight:    400,
                      transition:    "transform 350ms cubic-bezier(0.22, 1, 0.36, 1)",
                      display:       "inline-block",
                    }}
                  >
                    {d.name}
                  </span>
                  <span
                    className="disc-tag hidden lg:block lg:col-span-4 font-data text-[10px] tracking-[0.28em] uppercase text-right"
                    style={{
                      color:      "rgba(201,160,72,0.65)",
                      transition: "color 300ms ease",
                    }}
                    dangerouslySetInnerHTML={{ __html: d.tag }}
                  />
                </article>
                {i < DISCIPLINES.length - 1 && (
                  <div
                    className="m2-disc-row-rule h-px w-full"
                    style={{ backgroundColor: "rgba(201,160,72,0.14)" }}
                  />
                )}
              </div>
            ))}
          </div>

          <div
            className="m2-disc-rule-bot h-px w-full mt-10 lg:mt-12"
            style={{ backgroundColor: "rgba(201,160,72,0.28)" }}
          />
        </div>
      </div>
    </section>
  );
}
