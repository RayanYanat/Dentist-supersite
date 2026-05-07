"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Phone, ArrowRight } from "lucide-react";
import { STATS } from "@/lib/constants";
import type { CompanyData } from "@/lib/types";

/**
 * Hero — "Dark Room" v4
 *
 * The core mechanic: the portrait is always at full opacity, but buried
 * under a near-opaque dark overlay (rgba(12,11,9,0.92)). A CSS mask-image
 * controls WHERE the overlay shows — at cursor position, the mask is
 * transparent, so the overlay disappears and the smile emerges from
 * darkness. The cursor is a looking-glass, not a flashlight.
 *
 * Entry choreography (desktop, ~4s):
 *   0.0s — frame marks appear (crosshairs, ref labels, hairlines)
 *   0.8s — eyebrow + flourish arc
 *   1.0s — gray title chars cascade up (line 1)
 *   1.4s — gold title chars drift in from right (line 2, overlapping)
 *   1.4s — overlay auto-opens on the smile (cinematic reveal)
 *   2.2s — overlay peak — portrait fully visible
 *   2.7s — overlay starts to close
 *   1.9s — measurement bar draws
 *   2.7s — sub text + CTAs land
 *   3.4s — overlay fully closed → cursor interactive mode activates
 *   3.6s — scroll indicator
 *
 * Mobile: overlay breathes open/close on the centered smile (no cursor).
 *
 * Layer stack (z-index):
 *   1  — photo (full opacity) + top/bottom vertical fades
 *   2  — atelier grid (barely there)
 *   3  — DARK OVERLAY — the core mechanic (mask-image controlled)
 *   4  — gold breath ambient + pearl glow (screen blend)
 *   5  — crosshairs, ref labels, hairlines (always visible frame)
 *   6  — flourish arc
 *   7  — vignette (edge framing)
 *   20 — content + scroll indicator
 */

/* ── Module-level helpers — pure functions, no component state ───────────── */
const REVEAL_RADIUS = 300; /* px — looking-glass radius on desktop */

function buildMask(x: number, y: number, r: number): string {
  /* CSS mask alpha: transparent = overlay invisible (photo shows)
                    black       = overlay visible (photo hidden)   */
  return (
    `radial-gradient(circle at ${x}px ${y}px,` +
    ` transparent      0px,` +
    ` transparent      ${r * 0.42}px,` +
    ` rgba(0,0,0,0.72) ${r * 0.72}px,` +
    ` black            ${r}px)`
  );
}

function applyMask(el: HTMLDivElement, mask: string) {
  el.style.maskImage                              = mask;
  (el.style as CSSStyleDeclaration & { webkitMaskImage: string }).webkitMaskImage = mask;
}

/* ── Local CharText — two variants for asymmetric entrance ───────────────── */
function CharText({
  text,
  charClass = "hero-char",
}: {
  text: string;
  charClass?: string;
}) {
  return (
    <span aria-label={text}>
      {text.split("").map((c, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`${charClass} inline-block`}
          style={{ whiteSpace: "pre" }}
        >
          {c}
        </span>
      ))}
    </span>
  );
}

/* ── Component ───────────────────────────────────────────────────────────── */
export default function HeroSection({ company }: { company: CompanyData }) {
  const containerRef    = useRef<HTMLElement>(null);
  const overlayRef      = useRef<HTMLDivElement>(null);
  const pearlRef        = useRef<HTMLDivElement>(null);
  const layer2Ref       = useRef<HTMLDivElement>(null);
  const interactiveRef  = useRef(false); /* true after auto-reveal closes */

  /* ── Entrance choreography + auto-reveal ──────────────────────────────── */
  useGSAP(
    () => {
      /* FOUC reinforcement — CSS already sets these, GSAP confirms them
         before the first browser paint (useGSAP = useLayoutEffect). */
      gsap.set(".hero-char",       { y: "115%", opacity: 0 });
      gsap.set(".hero-char-gold",  { x: 20,     opacity: 0 });
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

      /* Dark overlay — fully opaque at start, mask controls reveal */
      const overlay = overlayRef.current;
      const pearl   = pearlRef.current;
      const section = containerRef.current;

      if (overlay) {
        /* r=0 → mask is black everywhere → overlay fully opaque */
        applyMask(overlay, buildMask(0, 0, 0));
      }

      /* ── Main entrance timeline ─────────────────────────────────────── */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl
        /* Frame assembles — draftsman setting up paper before drawing */
        .to(".hero-cross",   { opacity: 0.55, scale: 1, duration: 0.5, stagger: 0.07 }, 0.2)
        .to(".hero-ref",     { opacity: 1, duration: 0.5, stagger: 0.07 }, 0.3)
        .to(".hero-hairline",{ scaleX: 1, duration: 0.9, ease: "expo.out", stagger: 0.08 }, 0.4)
        /* Eyebrow + the arc that frames the whole composition */
        .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.6 }, 0.8)
        .to(".hero-flourish",{ strokeDashoffset: 0, opacity: 0.4, duration: 1.8, ease: "power2.inOut" }, 0.8)
        /* Line 1 — gray chars rise from below */
        .to(".hero-char",    { y: "0%", opacity: 1, duration: 0.85, stagger: 0.024, ease: "power3.out" }, 1.0)
        /* Line 2 — gold chars drift in from the right (overlapping with end of line 1) */
        .to(".hero-char-gold",{ x: 0, opacity: 1, duration: 0.75, stagger: 0.02, ease: "power3.out" }, 1.35)
        /* Shimmer pulse on "Perfect Smile." as the last gold char lands */
        .to(".hero-perfect-line", {
          textShadow: "0 0 120px rgba(201,160,72,0.95), 0 0 240px rgba(201,160,72,0.45)",
          duration: 0.35,
          ease: "power2.out",
        }, 1.35 + 0.02 * 14 + 0.2)
        .to(".hero-perfect-line", {
          textShadow: "0 0 80px rgba(201,160,72,0.5), 0 0 160px rgba(201,160,72,0.2)",
          duration: 0.9,
          ease: "power2.inOut",
        }, 1.35 + 0.02 * 14 + 0.2 + 0.35)
        /* Measurement bar — precision instrument revealing proportion */
        .to(".hero-meas-path", { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" }, 1.9)
        .to(".hero-meas-tick", { scaleY: 1, duration: 0.4, stagger: 0.12 }, 2.9)
        .to(".hero-meas-label",{ opacity: 0.7, duration: 0.6 }, 3.1)
        /* Sub + CTAs land after the title climax */
        .to(".hero-sub",       { opacity: 1, y: 0, duration: 0.5 }, 2.6)
        .to(".hero-cta",       { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 2.8)
        .to(".hero-data-strip",{ opacity: 1, duration: 0.6 }, 3.3)
        .to(".hero-stats",     { opacity: 1, y: 0, duration: 0.6 }, 3.4)
        .to(".hero-scroll",    { opacity: 1, duration: 0.7 }, 3.6);

      /* ── Auto-reveal — cinematic portrait introduction ───────────────── */
      if (!overlay || !section) return;

      /* Center the reveal on the smile (photo is right-anchored ~72%) */
      const cx = section.offsetWidth  * 0.70;
      const cy = section.offsetHeight * 0.50;

      const fine = window.matchMedia?.("(pointer: fine)").matches;
      const sweep = { r: 0 };

      function updateReveal(r: number) {
        applyMask(overlay!, buildMask(cx, cy, r));
        if (pearl) {
          const pr = r * 0.48;
          pearl.style.background = (
            `radial-gradient(circle at ${cx}px ${cy}px,` +
            ` rgba(240,234,224,0.20) 0px,` +
            ` rgba(201,160,72,0.10)  ${pr * 0.7}px,` +
            ` rgba(201,160,72,0.22)  ${pr * 0.92}px,` +
            ` transparent           ${pr}px)`
          );
          pearl.style.opacity = String(Math.min(r / REVEAL_RADIUS, 1) * 0.9);
        }
      }

      /* Open — face emerges from darkness while title cascades */
      gsap.to(sweep, {
        r: REVEAL_RADIUS + 50,
        duration: 0.8,
        ease: "power2.out",
        delay: 1.4,
        onUpdate: () => updateReveal(sweep.r),
        onComplete: () => {
          if (fine) {
            /* Desktop: close after brief hold → hand control to cursor */
            gsap.to(sweep, {
              r: 0,
              duration: 0.7,
              ease: "power2.in",
              delay: 0.5,
              onUpdate: () => updateReveal(sweep.r),
              onComplete: () => {
                if (pearl) gsap.to(pearl, { opacity: 0, duration: 0.4 });
                interactiveRef.current = true;
              },
            });
          } else {
            /* Mobile: close once then breathe endlessly — no cursor needed */
            gsap.to(sweep, {
              r: 0,
              duration: 0.7,
              ease: "power2.in",
              delay: 0.6,
              onUpdate: () => updateReveal(sweep.r),
              onComplete: () => {
                gsap.to(sweep, {
                  r: REVEAL_RADIUS * 0.82,
                  duration: 3.2,
                  ease: "sine.inOut",
                  repeat: -1,
                  yoyo: true,
                  delay: 1.0,
                  onUpdate: () => updateReveal(sweep.r),
                });
              },
            });
          }
        },
      });
    },
    { scope: containerRef }
  );

  /* ── Cursor-controlled looking-glass (desktop only) ──────────────────── */
  useEffect(() => {
    const overlay   = overlayRef.current;
    const pearl     = pearlRef.current;
    const container = containerRef.current;
    const l2        = layer2Ref.current;
    if (!overlay || !container) return;

    const fine = window.matchMedia?.("(pointer: fine)").matches;
    if (!fine) return; /* touch devices use the breathing animation */

    /* Capture non-null refs for use inside closures */
    const containerEl = container;

    /* Lerped state — smooth reveal that feels weighty, not snappy */
    const target  = { x: 0, y: 0 };
    const current = { x: 0, y: 0, r: 0 };
    let inside = false;
    let animFrame: number;

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function tick() {
      if (inside) {
        current.x = lerp(current.x, target.x, 0.13);
        current.y = lerp(current.y, target.y, 0.13);
        current.r = lerp(current.r, REVEAL_RADIUS, 0.11);
      } else {
        current.r = lerp(current.r, 0, 0.09);
      }

      /* Only take control after the auto-reveal has finished */
      if (interactiveRef.current) {
        applyMask(overlay!, buildMask(current.x, current.y, current.r));

        if (pearl) {
          const pr = current.r * 0.48;
          const α  = Math.min(current.r / REVEAL_RADIUS, 1);
          pearl.style.background = (
            `radial-gradient(circle at ${current.x}px ${current.y}px,` +
            ` rgba(240,234,224,0.22) 0px,` +
            ` rgba(201,160,72,0.10)  ${pr * 0.65}px,` +
            ` rgba(201,160,72,0.24)  ${pr * 0.9}px,` +
            ` transparent           ${pr}px)`
          );
          pearl.style.opacity = String(α * 0.9);
        }
      }

      animFrame = requestAnimationFrame(tick);
    }

    function onMove(e: MouseEvent) {
      const rect = containerEl.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      inside = true;

      /* Subtle content-layer parallax — the page breathes with the cursor */
      if (l2) {
        const cx = window.innerWidth  / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        gsap.to(l2, { x: dx * 9, y: dy * 5, duration: 1.6, ease: "power2.out" });
      }
    }

    function onLeave() { inside = false; }

    animFrame = requestAnimationFrame(tick);
    containerEl.addEventListener("mousemove", onMove);
    containerEl.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(animFrame);
      containerEl.removeEventListener("mousemove", onMove);
      containerEl.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* Atelier reference derived from slug */
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
      {/* ── z-1 — Portrait (always at full opacity; overlay controls what's seen) */}
      <div className="absolute inset-0 z-[1]">
        <Image
          src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=2000&q=85"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
          style={{
            objectPosition: "72% center",
            filter:          "brightness(1.06) contrast(1.08) saturate(0.88) sepia(0.05)",
            /* Subtle breathing — makes the portrait feel alive before cursor interaction */
            animation:       "hero-photo-breathe 9s ease-in-out infinite",
          }}
        />
        {/* Vertical fades only — top/bottom blend into obsidian.
            Horizontal darkening is handled by the dark overlay. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #0C0B09 0%, rgba(12,11,9,0.22) 10%," +
              " transparent 28%, transparent 72%, rgba(12,11,9,0.28) 90%, #0C0B09 100%)",
          }}
        />
      </div>

      {/* ── z-2 — Atelier grid (barely visible through the overlay at cursor) */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,160,72,0.025) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(201,160,72,0.025) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* ── z-3 — DARK OVERLAY — the core mechanic ─────────────────────────
       * mask-image controls WHERE this overlay shows. At the cursor position,
       * the mask is transparent → overlay invisible → portrait emerges.
       * Everywhere else, mask is black → overlay fully opaque → obsidian.     */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{ backgroundColor: "rgba(12,11,9,0.92)" }}
      />

      {/* ── z-4 — Atmosphere ────────────────────────────────────────────── */}
      {/* Pearl+gold glow — illuminates the reveal window from within.
          The ring gradient creates a "looking-glass rim" at the edge. */}
      <div
        ref={pearlRef}
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{ opacity: 0, mixBlendMode: "screen" }}
      />
      {/* Ambient gold breath — warms the dark surface even outside the reveal */}
      <div
        className="absolute bottom-0 left-[12%] w-[900px] h-[700px] rounded-full z-[4] pointer-events-none"
        style={{
          background:   "radial-gradient(ellipse at center, rgba(201,160,72,0.13) 0%, rgba(142,110,40,0.04) 38%, transparent 68%)",
          animation:    "breathe-gold 10s ease-in-out infinite",
          mixBlendMode: "screen",
        }}
      />

      {/* ── z-5 — Frame elements (crosshairs, refs, hairlines) ──────────── */}
      {/* The frame is ALWAYS visible — it establishes the atelier register
          even before any content or portrait appears. */}
      {([
        { pos: "top-6 left-6 lg:top-10 lg:left-12",          i: 0 },
        { pos: "top-6 right-6 lg:top-10 lg:right-12",        i: 1 },
        { pos: "bottom-24 left-6 lg:bottom-28 lg:left-12",   i: 2 },
        { pos: "bottom-24 right-6 lg:bottom-28 lg:right-12", i: 3 },
      ] as { pos: string; i: number }[]).map(({ pos, i }) => (
        <svg
          key={i}
          aria-hidden="true"
          className={`hero-cross absolute ${pos} w-5 h-5 lg:w-6 lg:h-6 z-[5]`}
          viewBox="0 0 24 24"
          style={{ transformOrigin: "center", color: "#C9A048" }}
        >
          <line x1="0"  y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="0.7" opacity="0.7" />
          <line x1="12" y1="0"  x2="12" y2="24" stroke="currentColor" strokeWidth="0.7" opacity="0.7" />
          <circle cx="12" cy="12" r="2.4" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        </svg>
      ))}

      <div
        className="hero-ref absolute top-6 left-14 lg:top-10 lg:left-24 font-data text-[9px] tracking-[0.32em] uppercase z-[5]"
        style={{ color: "rgba(201,160,72,0.55)" }}
      >
        01&nbsp;/&nbsp;04
      </div>
      <div
        className="hero-ref absolute top-6 right-14 lg:top-10 lg:right-24 font-data text-[9px] tracking-[0.32em] uppercase z-[5] text-right"
        style={{ color: "rgba(201,160,72,0.55)" }}
      >
        REF&nbsp;·&nbsp;{ref}
      </div>
      <div
        className="hero-ref absolute bottom-24 left-14 lg:bottom-28 lg:left-24 font-data text-[9px] tracking-[0.32em] uppercase z-[5]"
        style={{ color: "rgba(201,160,72,0.55)" }}
      >
        SMILE&nbsp;DESIGN
      </div>
      <div
        className="hero-ref absolute bottom-24 right-14 lg:bottom-28 lg:right-24 font-data text-[9px] tracking-[0.32em] uppercase z-[5] text-right"
        style={{ color: "rgba(201,160,72,0.55)" }}
      >
        VERIFIED&nbsp;◆
      </div>

      {/* Hairlines — top edges draw inward */}
      <div
        className="hero-hairline absolute top-[10%] left-0 w-32 lg:w-52 h-px origin-left z-[5]"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,160,72,0.5))" }}
      />
      <div
        className="hero-hairline absolute top-[10%] right-0 w-32 lg:w-52 h-px origin-right z-[5]"
        style={{ background: "linear-gradient(to left, transparent, rgba(201,160,72,0.5))" }}
      />

      {/* ── z-6 — Flourish arc — "smile geometry" ───────────────────────── */}
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

      {/* ── z-7 — Vignette (edge framing, independent of overlay) ────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-[7]"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 48%, transparent 38%, rgba(12,11,9,0.80) 100%)",
        }}
      />

      {/* ── z-20 — Content ────────────────────────────────────────────────── */}
      <div
        ref={layer2Ref}
        className="relative z-[20] flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-5 lg:px-12 pt-32 pb-32 will-change-transform"
      >
        {/* Eyebrow */}
        <div className="hero-eyebrow flex items-center gap-3 mb-10 lg:mb-14">
          <div className="w-6 h-px" style={{ backgroundColor: "#C9A048" }} />
          <span
            className="font-data text-[11px] tracking-[0.32em] uppercase"
            style={{ color: "rgba(201,160,72,0.7)" }}
          >
            {company.zone}&nbsp;·&nbsp;Atelier of Cosmetic Dentistry
          </span>
        </div>

        {/* Title block */}
        <div className="mb-10 lg:mb-14 relative">

          {/* Line 1 — "The Art of the" — gray, chars rise from below */}
          <h1
            className="font-heading font-black mb-0"
            style={{
              fontSize:      "clamp(3.4rem, 11vw, 11rem)",
              lineHeight:    "0.88",
              letterSpacing: "-0.02em",
              color:         "#D8D2C8",
            }}
          >
            <span
              className="block overflow-hidden"
              style={{ paddingTop: "0.05em", paddingBottom: "0.05em" }}
            >
              <CharText text="The Art" />
              <span
                className="font-light italic"
                style={{ color: "rgba(216,210,200,0.40)", marginLeft: "0.25em" }}
              >
                <CharText text="of the" />
              </span>
            </span>
          </h1>

          {/* Line 2 — "Perfect Smile." — gold italic, chars drift in from right.
              No overflow-hidden here: the horizontal drift doesn't need clipping. */}
          <h1
            className="hero-perfect-line font-heading font-black italic"
            style={{
              fontSize:      "clamp(3.4rem, 11vw, 11rem)",
              lineHeight:    "0.88",
              letterSpacing: "-0.02em",
              color:         "#C9A048",
              textShadow:    "0 0 80px rgba(201,160,72,0.5), 0 0 160px rgba(201,160,72,0.2)",
              paddingTop:    "0.05em",
              paddingBottom: "0.12em",
              display:       "block",
            }}
          >
            <CharText text="Perfect Smile." charClass="hero-char-gold" />
          </h1>

          {/* Measurement bar — golden ratio annotation below the title */}
          <svg
            aria-hidden="true"
            className="absolute -bottom-4 lg:-bottom-6 left-0 w-full max-w-[820px] h-6 pointer-events-none hidden lg:block"
            viewBox="0 0 820 24"
            preserveAspectRatio="none"
          >
            <line
              className="hero-meas-path"
              x1="0" y1="12" x2="820" y2="12"
              stroke="#C9A048" strokeWidth="0.6"
              strokeDasharray="820 820"
            />
            <line
              className="hero-meas-tick"
              x1="0" y1="5" x2="0" y2="19"
              stroke="#C9A048" strokeWidth="0.7"
              style={{ transformOrigin: "0px 12px" }}
            />
            <line
              className="hero-meas-tick"
              x1="820" y1="5" x2="820" y2="19"
              stroke="#C9A048" strokeWidth="0.7"
              style={{ transformOrigin: "820px 12px" }}
            />
            <text
              className="hero-meas-label"
              x="410" y="9"
              fill="#C9A048"
              fontSize="9"
              fontFamily="var(--font-jetbrains), monospace"
              letterSpacing="3"
              textAnchor="middle"
            >
              φ · 1.618 · GOLDEN PROPORTION
            </text>
          </svg>
        </div>

        {/* Subheading */}
        <p
          className="hero-sub max-w-md text-base leading-relaxed mb-12"
          style={{ color: "rgba(216,210,200,0.5)" }}
        >
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
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#D9B25C";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#C9A048";
            }}
          >
            {/* Shimmer sweep on hover */}
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
              style={{
                background: "linear-gradient(to right, transparent, rgba(255,255,255,0.28), transparent)",
              }}
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

        {/* Signature strip */}
        <div
          className="hero-data-strip flex items-center gap-3 mb-3 font-data text-[10px] tracking-[0.32em] uppercase"
          style={{ color: "rgba(201,160,72,0.5)" }}
        >
          <span>◆</span>
          <span>Reference Document · Drawn by Hand · {company.name}</span>
          <span className="hidden sm:inline">◆</span>
        </div>

        {/* Stat bar */}
        <div
          className="hero-stats flex flex-wrap gap-x-10 gap-y-3 pt-6"
          style={{ borderTop: "1px solid rgba(201,160,72,0.12)" }}
        >
          {STATS.map(({ value, suffix, label }) => (
            <div key={label} className="flex items-baseline gap-2">
              <span className="font-data text-sm font-medium" style={{ color: "#C9A048" }}>
                {value}{suffix}
              </span>
              <span
                className="font-data text-[11px] tracking-wider uppercase"
                style={{ color: "rgba(216,210,200,0.32)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator — scanning beam ─────────────────────────────── */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-[20]">
        <span
          className="font-data text-[9px] tracking-[0.42em] uppercase"
          style={{ color: "rgba(201,160,72,0.38)" }}
        >
          Scroll
        </span>
        {/* Animated scanning beam — draws top→down, holds, erases top→down */}
        <div style={{ position: "relative", width: "1px", height: "54px", overflow: "hidden" }}>
          <div
            style={{
              position:   "absolute",
              top: 0, left: 0,
              width:      "1px",
              height:     "100%",
              background: "linear-gradient(to bottom, #C9A048, rgba(201,160,72,0.08))",
              animation:  "hero-scroll-beam 2.4s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </section>
  );
}
