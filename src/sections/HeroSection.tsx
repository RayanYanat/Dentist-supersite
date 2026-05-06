"use client";
import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Phone, ArrowRight } from "lucide-react";
import { STATS } from "@/lib/constants";
import type { CompanyData } from "@/lib/types";

/**
 * Hero — "Atelier Blueprint"
 *
 * Premise reset: the previous hero relied on a barely-visible Unsplash
 * smile photo (opacity 0.18) plus an anaemic spotlight (0.13). Both signals
 * read as "template hesitating to commit". Both were cut.
 *
 * The new hero is a TECHNICAL DRAWING. The composition treats the page as
 * a master craftsman's specification sheet:
 *
 *   - Massive Playfair typography that enters CHARACTER BY CHARACTER from
 *     below a clipping mask (no SplitText paid plugin — manual span split)
 *   - SVG precision lines that DRAW THEMSELVES via stroke-dashoffset
 *     animation — corner crosshairs, golden-ratio measurement bar under the
 *     title, an organic "smile arc" curve along the bottom
 *   - Reference annotations in the four corners (font-mono, atelier voice)
 *     suggesting this is page 01/04 of a bound dossier
 *   - A spotlight cursor x4 stronger than before (0.42 vs 0.13) that now
 *     genuinely "illuminates" the precision marks as it passes over them
 *
 * Restraint with one bold gesture: the typography. Every other element is
 * subordinate — hairlines, faint glows, monospaced labels under 12px.
 */

/* ── Char split helper — wraps each character in a span for stagger anim ─── */
function CharText({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {text.split("").map((c, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="hero-char inline-block"
          style={{ whiteSpace: "pre" }}
        >
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}

export default function HeroSection({ company }: { company: CompanyData }) {
  const containerRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const layer1Ref    = useRef<HTMLDivElement>(null);
  const layer2Ref    = useRef<HTMLDivElement>(null);

  /* ── Entrance choreography — one timeline, no ScrollTrigger ─────────────
   * Sequence is intentional:
   *   crosshairs → references → hairlines → eyebrow → title chars →
   *   flourish arc → measurement bar → sub & CTAs → data strip → stats
   * The title is the climax (~0.9–2.5s in). Everything else frames it.
   * ───────────────────────────────────────────────────────────────────── */
  useGSAP(
    () => {
      gsap.set(".hero-char",       { y: "115%", opacity: 0 });
      gsap.set(".hero-eyebrow",    { opacity: 0, y: 12 });
      gsap.set(".hero-ref",        { opacity: 0 });
      gsap.set(".hero-cross",      { opacity: 0, scale: 0.6 });
      gsap.set(".hero-hairline",   { scaleX: 0 });
      gsap.set(".hero-sub",        { opacity: 0, y: 12 });
      gsap.set(".hero-cta",        { opacity: 0, y: 12 });
      gsap.set(".hero-data-strip", { opacity: 0 });
      gsap.set(".hero-stats",      { opacity: 0, y: 12 });
      gsap.set(".hero-scroll",     { opacity: 0 });
      gsap.set(".hero-meas-path",  { strokeDashoffset: 800 });
      gsap.set(".hero-meas-tick",  { scaleY: 0 });
      gsap.set(".hero-meas-label", { opacity: 0 });
      gsap.set(".hero-flourish",   { strokeDashoffset: 1400, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl
        /* Frame establishes itself first — like a draftsman setting up paper */
        .to(".hero-cross",   { opacity: 0.55, scale: 1, duration: 0.5, stagger: 0.07 }, 0)
        .to(".hero-ref",     { opacity: 1, duration: 0.5, stagger: 0.07 }, 0.1)
        .to(".hero-hairline",{ scaleX: 1, duration: 1.0, ease: "expo.out", stagger: 0.08 }, 0.2)
        /* Eyebrow + flourish in parallel */
        .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.6 }, 0.5)
        .to(".hero-flourish",{ strokeDashoffset: 0, opacity: 0.45, duration: 1.8, ease: "power2.inOut" }, 0.5)
        /* Title — character cascade */
        .to(".hero-char",    { y: "0%", opacity: 1, duration: 0.9, stagger: 0.025, ease: "power3.out" }, 0.7)
        /* Measurement bar draws after most of the title is up */
        .to(".hero-meas-path", { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 1.6)
        .to(".hero-meas-tick", { scaleY: 1, duration: 0.4, stagger: 0.12 }, 2.6)
        .to(".hero-meas-label",{ opacity: 0.7, duration: 0.6 }, 2.8)
        /* Sub + CTAs land last */
        .to(".hero-sub",       { opacity: 1, y: 0, duration: 0.5 }, 2.4)
        .to(".hero-cta",       { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 2.6)
        .to(".hero-data-strip",{ opacity: 1, duration: 0.6 }, 3.0)
        .to(".hero-stats",     { opacity: 1, y: 0, duration: 0.6 }, 3.1)
        .to(".hero-scroll",    { opacity: 1, duration: 0.7 }, 3.3);
    },
    { scope: containerRef }
  );

  /* ── Spotlight + layer parallax ─────────────────────────────────────────
   * The spotlight is now a real reveal: at 0.42 opacity over a 700px radial
   * with mix-blend-mode: screen, it actually brightens what's underneath.
   * Combined with the SVG precision marks, it feels like an ultraviolet
   * inspection lamp passing over a watch movement.
   * ───────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const spot      = spotlightRef.current;
    const container = containerRef.current;
    const l1        = layer1Ref.current;
    const l2        = layer2Ref.current;
    if (!spot || !container) return;

    /* pointer:fine guard — disable expensive mousemove logic on touch devices */
    const fine = window.matchMedia?.("(pointer: fine)").matches;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      spot.style.background = `radial-gradient(
        700px circle at ${x}px ${y}px,
        rgba(201,160,72,0.42) 0%,
        rgba(201,160,72,0.22) 22%,
        rgba(240,234,224,0.08) 48%,
        transparent 75%
      )`;
      spot.style.opacity = "1";

      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      gsap.to(l1, { x: dx * -22, y: dy * -12, duration: 1.7, ease: "power2.out" });
      gsap.to(l2, { x: dx * 9,   y: dy * 6,   duration: 1.5, ease: "power2.out" });
    };
    const onLeave = () => { spot.style.opacity = "0"; };

    if (fine) {
      container.addEventListener("mousemove", onMove);
      container.addEventListener("mouseleave", onLeave);
    }
    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ── Atelier reference ─ derived once from slug for the corner annotation */
  const ref =
    company.slug
      ? company.slug.toUpperCase().slice(0, 8).padEnd(8, "·")
      : "X.001.AT";

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "#0C0B09" }}
    >
      {/* ── Layer 1 — atmospheric background ─────────────────────────── */}
      <div
        ref={layer1Ref}
        className="absolute inset-0 will-change-transform pointer-events-none"
      >
        {/* Atelier grid — barely there */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(201,160,72,0.022) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201,160,72,0.022) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
          }}
        />
        {/* Central gold breath */}
        <div
          className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(201,160,72,0.18) 0%, rgba(142,110,40,0.07) 38%, transparent 70%)",
            animation: "breathe-gold 9s ease-in-out infinite",
          }}
        />
        {/* Pearl accent — top right */}
        <div
          className="absolute top-[-15%] right-[5%] w-[700px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(240,234,224,0.05) 0%, transparent 65%)",
            animation: "breathe-gold 13s ease-in-out infinite 3s",
          }}
        />
      </div>

      {/* ── SVG precision drawing — corners + measurement bar + arc ────── */}
      {/* Crosshairs + reference labels in the 4 corners.
          Done as 4 small absolute SVGs to keep proportions perfect at any
          aspect ratio, regardless of viewport stretch. */}
      {[
        { pos: "top-6 left-6 lg:top-10 lg:left-12",       i: 0 },
        { pos: "top-6 right-6 lg:top-10 lg:right-12",     i: 1 },
        { pos: "bottom-24 left-6 lg:bottom-28 lg:left-12",i: 2 },
        { pos: "bottom-24 right-6 lg:bottom-28 lg:right-12", i: 3 },
      ].map(({ pos, i }) => (
        <svg
          key={i}
          aria-hidden="true"
          className={`hero-cross absolute ${pos} w-5 h-5 lg:w-6 lg:h-6 z-10`}
          viewBox="0 0 24 24"
          style={{ transformOrigin: "center", color: "#C9A048" }}
        >
          <line x1="0"  y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="0.7" opacity="0.7" />
          <line x1="12" y1="0"  x2="12" y2="24" stroke="currentColor" strokeWidth="0.7" opacity="0.7" />
          <circle cx="12" cy="12" r="2.4" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        </svg>
      ))}

      {/* Reference annotations — corner data labels */}
      <div className="hero-ref absolute top-6 left-14 lg:top-10 lg:left-24 font-data text-[9px] tracking-[0.32em] uppercase z-10"
        style={{ color: "rgba(201,160,72,0.55)" }}>
        01 / 04
      </div>
      <div className="hero-ref absolute top-6 right-14 lg:top-10 lg:right-24 font-data text-[9px] tracking-[0.32em] uppercase z-10 text-right"
        style={{ color: "rgba(201,160,72,0.55)" }}>
        REF · {ref}
      </div>
      <div className="hero-ref absolute bottom-24 left-14 lg:bottom-28 lg:left-24 font-data text-[9px] tracking-[0.32em] uppercase z-10"
        style={{ color: "rgba(201,160,72,0.55)" }}>
        SMILE&nbsp;DESIGN
      </div>
      <div className="hero-ref absolute bottom-24 right-14 lg:bottom-28 lg:right-24 font-data text-[9px] tracking-[0.32em] uppercase z-10 text-right"
        style={{ color: "rgba(201,160,72,0.55)" }}>
        VERIFIED&nbsp;◆
      </div>

      {/* Decorative hairlines — top edges */}
      <div className="hero-hairline absolute top-[10%] left-0 w-32 lg:w-48 h-px origin-left z-10"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,160,72,0.5))" }} />
      <div className="hero-hairline absolute top-[10%] right-0 w-32 lg:w-48 h-px origin-right z-10"
        style={{ background: "linear-gradient(to left, transparent, rgba(201,160,72,0.5))" }} />

      {/* Decorative arc — "smile geometry" along the bottom of the hero
          A single SVG path. Hidden on mobile to reduce visual noise. */}
      <svg
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 w-full pointer-events-none z-[6] hidden md:block"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        style={{ height: "220px" }}
      >
        <path
          className="hero-flourish"
          d="M -60 180 Q 360 60 720 90 Q 1080 120 1500 40"
          fill="none"
          stroke="#C9A048"
          strokeWidth="0.8"
          strokeDasharray="1400 1400"
        />
        <path
          className="hero-flourish"
          d="M -60 220 Q 360 110 720 140 Q 1080 170 1500 90"
          fill="none"
          stroke="#C9A048"
          strokeWidth="0.4"
          strokeDasharray="1400 1400"
          opacity="0.5"
        />
      </svg>

      {/* Spotlight cursor — much stronger than before */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none z-[8] transition-opacity duration-300"
        style={{ opacity: 0, mixBlendMode: "screen" }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[7]"
        style={{
          background: "radial-gradient(ellipse 85% 75% at 50% 45%, transparent 35%, rgba(12,11,9,0.85) 100%)",
        }}
      />

      {/* ── Layer 2 — content (parallax) ─────────────────────────────── */}
      <div
        ref={layer2Ref}
        className="relative z-20 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-5 lg:px-12 pt-32 pb-32 will-change-transform"
      >
        {/* Eyebrow */}
        <div className="hero-eyebrow flex items-center gap-3 mb-10 lg:mb-14">
          <div className="w-6 h-px" style={{ backgroundColor: "#C9A048" }} />
          <span className="font-data text-[11px] tracking-[0.32em] uppercase"
            style={{ color: "rgba(201,160,72,0.7)" }}>
            {company.zone} &nbsp;·&nbsp; Atelier of Cosmetic Dentistry
          </span>
        </div>

        {/* Title — character cascade reveal */}
        <div className="mb-10 lg:mb-14 relative">
          {/* Line 1: "The Art of the" */}
          <h1
            className="font-heading font-black mb-1"
            style={{
              fontSize:      "clamp(3.4rem, 11vw, 11rem)",
              lineHeight:    "0.88",
              letterSpacing: "-0.02em",
              color:         "#D8D2C8",
            }}
          >
            <span className="block overflow-hidden" style={{ paddingTop: "0.05em", paddingBottom: "0.05em" }}>
              <CharText text="The Art" />
              <span className="font-light italic" style={{ color: "rgba(216,210,200,0.45)", marginLeft: "0.25em" }}>
                <CharText text="of the" />
              </span>
            </span>
          </h1>

          {/* Line 2: "Perfect Smile." — gold, italic, the climax */}
          <h1
            className="font-heading font-black italic"
            style={{
              fontSize:      "clamp(3.4rem, 11vw, 11rem)",
              lineHeight:    "0.88",
              letterSpacing: "-0.02em",
              color:         "#C9A048",
              textShadow:    "0 0 60px rgba(201,160,72,0.4)",
            }}
          >
            <span className="block overflow-hidden" style={{ paddingTop: "0.05em", paddingBottom: "0.12em" }}>
              <CharText text="Perfect Smile." />
            </span>
          </h1>

          {/* Measurement bar — golden ratio under the title.
              Full-width SVG positioned absolutely; ticks + label included. */}
          <svg
            aria-hidden="true"
            className="absolute -bottom-4 lg:-bottom-6 left-0 w-full max-w-[800px] h-6 pointer-events-none hidden lg:block"
            viewBox="0 0 800 24"
            preserveAspectRatio="none"
          >
            <line className="hero-meas-path"
              x1="0" y1="12" x2="800" y2="12"
              stroke="#C9A048" strokeWidth="0.6"
              strokeDasharray="800 800"
            />
            <line className="hero-meas-tick" x1="0"   y1="6" x2="0"   y2="18" stroke="#C9A048" strokeWidth="0.6" style={{ transformOrigin: "0px 12px" }} />
            <line className="hero-meas-tick" x1="800" y1="6" x2="800" y2="18" stroke="#C9A048" strokeWidth="0.6" style={{ transformOrigin: "800px 12px" }} />
            <text className="hero-meas-label"
              x="400" y="9"
              fill="#C9A048"
              fontSize="9"
              fontFamily="var(--font-jetbrains), monospace"
              letterSpacing="3"
              textAnchor="middle">
              φ · 1.618 · GOLDEN PROPORTION
            </text>
          </svg>
        </div>

        {/* Sub */}
        <p className="hero-sub max-w-md text-base leading-relaxed mb-12"
          style={{ color: "rgba(216,210,200,0.5)" }}>
          From porcelain veneers to complete smile design — every piece is
          drawn, sculpted, and signed in-house, with the precision of a
          single master craftsman.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-16 lg:mb-20">
          <a
            href="#contact"
            className="hero-cta group relative flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-[0.22em] uppercase overflow-hidden transition-all duration-300"
            style={{ backgroundColor: "#C9A048", color: "#0C0B09" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#D9B25C")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#C9A048")}
          >
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
              style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.28), transparent)" }}
            />
            <span>Begin Consultation</span>
            <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-200" />
          </a>

          <a
            href={`tel:${company.phone}`}
            className="hero-cta group flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-[0.22em] uppercase transition-all duration-300"
            style={{ border: "1px solid rgba(201,160,72,0.3)", color: "rgba(201,160,72,0.75)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,72,0.7)";
              (e.currentTarget as HTMLElement).style.color       = "#C9A048";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,72,0.3)";
              (e.currentTarget as HTMLElement).style.color       = "rgba(201,160,72,0.75)";
            }}
          >
            <Phone size={13} />
            <span>{company.phone}</span>
          </a>
        </div>

        {/* Atelier signature strip */}
        <div className="hero-data-strip flex items-center gap-3 mb-3 font-data text-[10px] tracking-[0.32em] uppercase"
          style={{ color: "rgba(201,160,72,0.5)" }}>
          <span>◆</span>
          <span>Reference Document · Drawn by Hand · {company.name}</span>
          <span className="hidden sm:inline">◆</span>
        </div>

        {/* Stats — the audit trail */}
        <div className="hero-stats flex flex-wrap gap-x-10 gap-y-3 pt-6"
          style={{ borderTop: "1px solid rgba(201,160,72,0.12)" }}>
          {STATS.map(({ value, suffix, label }) => (
            <div key={label} className="flex items-baseline gap-2">
              <span className="font-data text-sm font-medium"
                style={{ color: "#C9A048" }}>
                {value}{suffix}
              </span>
              <span className="font-data text-[11px] tracking-wider uppercase"
                style={{ color: "rgba(216,210,200,0.32)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <span className="font-data text-[9px] tracking-[0.4em] uppercase"
          style={{ color: "rgba(201,160,72,0.4)" }}>
          Scroll to Reveal
        </span>
        <div className="w-px h-12"
          style={{ background: "linear-gradient(to bottom, rgba(201,160,72,0.45), transparent)" }} />
      </div>
    </section>
  );
}
