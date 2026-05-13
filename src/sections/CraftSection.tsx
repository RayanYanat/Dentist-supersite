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

const DISCIPLINES = [
  { num: "01", name: "Porcelain Veneers",   tag: "Lithium disilicate &middot; Hand-layered"  },
  { num: "02", name: "Smile Design",        tag: "3D mock-up &middot; Try-in phase"          },
  { num: "03", name: "Dental Implants",     tag: "Titanium &middot; Same-day options"        },
  { num: "04", name: "Cosmetic Bonding",    tag: "Single-visit &middot; Reversible"          },
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
                  className="m2-disc-row group grid grid-cols-12 items-baseline gap-3 lg:gap-6 py-5 lg:py-7 cursor-default"
                  onMouseEnter={(e) => {
                    const root = e.currentTarget as HTMLElement;
                    const num  = root.querySelector(".disc-num")  as HTMLElement | null;
                    const name = root.querySelector(".disc-name") as HTMLElement | null;
                    const tag  = root.querySelector(".disc-tag")  as HTMLElement | null;
                    if (num)  num.style.color     = "#D9B25C";
                    if (name) name.style.transform = "translateX(8px)";
                    if (tag)  tag.style.color     = "#D9B25C";
                  }}
                  onMouseLeave={(e) => {
                    const root = e.currentTarget as HTMLElement;
                    const num  = root.querySelector(".disc-num")  as HTMLElement | null;
                    const name = root.querySelector(".disc-name") as HTMLElement | null;
                    const tag  = root.querySelector(".disc-tag")  as HTMLElement | null;
                    if (num)  num.style.color     = "rgba(201,160,72,0.55)";
                    if (name) name.style.transform = "translateX(0px)";
                    if (tag)  tag.style.color     = "rgba(201,160,72,0.65)";
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
                    className="disc-name col-span-10 lg:col-span-7 font-display italic"
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
