"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import type { CompanyData } from "@/lib/types";

/**
 * Scene II — "The Craft"
 *
 * Six disciplines presented as a HORIZONTAL SCROLL gallery. The section
 * is pinned for the duration of the panel sweep — vertical scroll input
 * is converted into horizontal panel translation via scrub:1.
 *
 * Mechanics:
 *   - Section element is the trigger.
 *   - Inner track holds 6 panels in a row, each 100vw wide.
 *   - As the user scrolls down through the section, the track translates
 *     left, sweeping panels through the viewport.
 *   - Total scroll distance = (panels - 1) × 100vw, so 1 px of vertical
 *     scroll ≈ 1 px of horizontal panel travel.
 *   - pinType:"fixed" required — Lenis owns body transform, default
 *     pinType:"transform" would conflict.
 *
 * Editorial design language:
 *   Each panel is typography-first. Giant numeric watermark + Cormorant
 *   Garamond title + body copy + tags + CTA. No stock photos per service
 *   (would read as "stock carousel" and break the atelier register).
 *   The accent colour and gold rules are the only visual constants.
 *
 * Persistent UI during the sweep:
 *   - "II — The Craft" chapter indicator (top-left, below navbar)
 *   - Panel-progress dots (top-right) — six pips, the active one filled
 *   - Subtle "Continue →" cue (bottom-right) — disappears on last panel
 */

type Service = {
  num:      string;
  domain:   string;
  title:    string;
  italic:   string;     /* italic accent in the title */
  detail:   string;
  tags:     string[];
};

const SERVICES: Service[] = [
  {
    num:    "01",
    domain: "Porcelain Veneers",
    title:  "The Porcelain",
    italic: "Veneer.",
    detail: "Hand-crafted shells, sculpted tooth-by-tooth to match the geometry of your face. Designed in-house, never delegated to outside labs.",
    tags:   ["Lithium Disilicate", "Zero-Prep Options", "Lifetime Bonding"],
  },
  {
    num:    "02",
    domain: "Smile Design",
    title:  "Bespoke Smile",
    italic: "Design.",
    detail: "A complete cosmetic blueprint — proportion, color, line, character. Digital previews and try-in phase before a single tooth is touched.",
    tags:   ["3D Mock-Up", "DSD Protocol", "Try-In Phase"],
  },
  {
    num:    "03",
    domain: "Dental Implants",
    title:  "Permanent",
    italic: "Restoration.",
    detail: "Titanium foundations, ceramic crowns. The closest thing to a tooth that was never lost — engineered to last decades, not years.",
    tags:   ["Single Tooth", "Full-Arch", "Same-Day Options"],
  },
  {
    num:    "04",
    domain: "Whitening",
    title:  "Luminance",
    italic: "Treatment.",
    detail: "Professional-grade whitening calibrated to your enamel. No sensitivity protocols, no over-bleached effect — just measured brightness.",
    tags:   ["In-Office", "Custom Trays", "Sensitivity-Safe"],
  },
  {
    num:    "05",
    domain: "Clear Aligners",
    title:  "Discreet",
    italic: "Alignment.",
    detail: "Invisible orthodontics for adults who refused braces the first time. Designed and monitored entirely in-house — no third-party clinics.",
    tags:   ["Invisalign Diamond", "Adult Cases", "Refinement Plans"],
  },
  {
    num:    "06",
    domain: "Cosmetic Bonding",
    title:  "Sculpted",
    italic: "Refinement.",
    detail: "Composite layered by hand to close gaps, soften edges, restore proportion. The conservative answer when veneers would be excessive.",
    tags:   ["Single-Visit", "Reversible", "Same-Day Result"],
  },
];

export default function CraftSection({ company }: { company: CompanyData }) {
  void company; /* reserved — will personalize the CTAs in a later iteration */
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      const track   = trackRef.current;
      if (!section || !track) return;

      /* ── Horizontal sweep — pinned + scrubbed + snapped ────────────────
       * UX-tuned for comfort:
       *   - Horizontal track distance: (n-1) × innerWidth — fixed, this
       *     is how far panels actually need to travel.
       *   - Vertical SCROLL distance: only 60vh per transition → 300vh
       *     total for 6 panels. Aggressive ratio (each scroll tick
       *     advances panels ~2.6× faster than 1:1) so the section
       *     doesn't feel like a long slog.
       *   - Snap: the scroll position eases into each panel's anchor
       *     once the user stops scrolling. Each panel feels like a
       *     page turn — clean, intentional, never "stranded between
       *     panels."
       * ───────────────────────────────────────────────────────────── */
      const trackDistance  = () => (SERVICES.length - 1) * window.innerWidth;
      const scrollDistance = () => (SERVICES.length - 1) * window.innerHeight * 0.6;

      const sweep = gsap.to(track, {
        x: () => -trackDistance(),
        ease: "none",
        scrollTrigger: {
          trigger:             section,
          start:               "top top",
          end:                 () => `+=${scrollDistance()}`,
          pin:                 true,
          pinType:             "fixed",
          anticipatePin:       1,
          scrub:               1,
          invalidateOnRefresh: true,
          snap: {
            snapTo:    1 / (SERVICES.length - 1),
            duration:  { min: 0.25, max: 0.55 },
            delay:     0.05,
            ease:      "power2.inOut",
          },
        },
      });

      /* ── Per-panel reveal animations ─────────────────────────────────
       * Each panel's content fades + drifts in when the panel enters the
       * viewport. Two trigger flavors are needed:
       *
       *   - Panel 1 is visible from Scene II's first frame (it sits at
       *     x:0 when the sweep is at progress 0). Its reveal is keyed to
       *     SECTION entry (vertical), not horizontal sweep.
       *
       *   - Panels 2-6 enter the viewport HORIZONTALLY as the sweep
       *     translates the track left. ScrollTrigger's `containerAnimation`
       *     option lets us trigger off horizontal position within the
       *     sweep's timeline — start: "left 80%" means "when this panel's
       *     left edge crosses 80% of the viewport width from the left."
       * ────────────────────────────────────────────────────────────── */
      const panels = gsap.utils.toArray<HTMLElement>(".s2-panel");
      panels.forEach((panel, i) => {
        const num   = panel.querySelector(".s2-num");
        const dom   = panel.querySelector(".s2-domain");
        const ttl   = panel.querySelector(".s2-title");
        const det   = panel.querySelector(".s2-detail");
        const tagL  = panel.querySelectorAll(".s2-tag");
        const cta   = panel.querySelector(".s2-cta");
        const line  = panel.querySelector(".s2-rule");

        /* Initial states — invisible / offset */
        gsap.set([num, dom, ttl, det, cta], { opacity: 0, y: 40 });
        gsap.set(tagL, { opacity: 0, y: 20 });
        gsap.set(line, { scaleX: 0, opacity: 0, transformOrigin: "left center" });

        const playReveal = () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(num,   { opacity: 1, y: 0, duration: 1.0 },                 0)
            .to(line,  { scaleX: 1, opacity: 1, duration: 0.7 },            0.15)
            .to(dom,   { opacity: 1, y: 0, duration: 0.55 },                0.25)
            .to(ttl,   { opacity: 1, y: 0, duration: 0.9 },                 0.30)
            .to(det,   { opacity: 1, y: 0, duration: 0.7 },                 0.50)
            .to(tagL,  { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 }, 0.65)
            .to(cta,   { opacity: 1, y: 0, duration: 0.55 },                0.85);
        };

        if (i === 0) {
          /* Panel 1 — fires when Scene II enters the viewport (vertical) */
          ScrollTrigger.create({
            trigger: section,
            start:   "top 85%",
            once:    true,
            onEnter: playReveal,
          });
        } else {
          /* Panels 2-6 — fire as they slide into view during the sweep.
             containerAnimation tells ScrollTrigger to track the panel's
             position WITHIN the sweep tween rather than via page scroll. */
          ScrollTrigger.create({
            trigger:            panel,
            containerAnimation: sweep,
            start:              "left 80%",
            once:               true,
            onEnter:            playReveal,
          });
        }
      });

      /* Progress dots — fill the active dot based on sweep progress.
         Same scroll range as the sweep (so they stay in sync). */
      ScrollTrigger.create({
        trigger:             section,
        start:               "top top",
        end:                 () => `+=${scrollDistance()}`,
        scrub:               true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx = Math.round(self.progress * (SERVICES.length - 1));
          document.querySelectorAll(".s2-dot").forEach((el, i) => {
            (el as HTMLElement).style.backgroundColor =
              i <= idx ? "#C9A048" : "rgba(201,160,72,0.18)";
            (el as HTMLElement).style.transform =
              i === idx ? "scale(1.4)" : "scale(1)";
          });
        },
      });

      /* Persistent UI fade in once at scene entry */
      gsap.set([".s2-meta", ".s2-progress", ".s2-cue"], { opacity: 0 });
      ScrollTrigger.create({
        trigger: section,
        start:   "top 80%",
        once:    true,
        onEnter: () => {
          gsap.to([".s2-meta", ".s2-progress", ".s2-cue"], {
            opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.1,
          });
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="craft"
      className="relative w-full overflow-hidden"
      style={{
        height:          "100vh",                /* pinned target — when pinned, ScrollTrigger expands the scroll distance below */
        backgroundColor: "#0C0B09",
      }}
    >
      {/* ── Atelier grid texture — barely there, atmospheric ──────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,160,72,0.025) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(201,160,72,0.025) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
        }}
      />

      {/* ── Track — holds all panels in a horizontal row ──────────────── */}
      <div
        ref={trackRef}
        className="relative z-[2] flex h-full will-change-transform"
        style={{ width: `${SERVICES.length * 100}vw` }}
      >
        {SERVICES.map((svc) => (
          <article
            key={svc.num}
            className="s2-panel relative flex-shrink-0 h-full flex items-center"
            style={{ width: "100vw" }}
          >
            <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-12 gap-6 lg:gap-12 items-center">

              {/* ── Left column — giant number watermark + domain ───── */}
              <div className="col-span-12 lg:col-span-5 flex flex-col">
                <span
                  className="s2-num font-display italic font-light leading-none select-none"
                  style={{
                    fontSize: "clamp(8rem, 22vw, 22rem)",
                    color:    "rgba(201,160,72,0.95)",
                    textShadow: "0 0 80px rgba(201,160,72,0.25)",
                  }}
                >
                  {svc.num}
                </span>
                <div className="s2-rule mt-6 lg:mt-10 w-24 h-px"
                  style={{ backgroundColor: "#C9A048" }}
                />
                <span
                  className="s2-domain font-data text-[11px] tracking-[0.42em] uppercase mt-4 lg:mt-5"
                  style={{ color: "rgba(201,160,72,0.7)" }}
                >
                  {svc.domain}
                </span>
              </div>

              {/* ── Right column — title + body + tags + CTA ────────── */}
              <div className="col-span-12 lg:col-span-7 lg:pl-8">
                <h2
                  className="s2-title font-display"
                  style={{
                    fontSize:      "clamp(3rem, 7.5vw, 7rem)",
                    lineHeight:    "0.95",
                    letterSpacing: "-0.02em",
                    color:         "#F0EAE0",
                    fontWeight:    400,
                  }}
                >
                  {svc.title}{" "}
                  <span style={{ fontStyle: "italic", color: "#C9A048" }}>
                    {svc.italic}
                  </span>
                </h2>

                <p
                  className="s2-detail mt-8 max-w-md text-base leading-relaxed"
                  style={{ color: "rgba(216,210,200,0.65)" }}
                >
                  {svc.detail}
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {svc.tags.map((t) => (
                    <span
                      key={t}
                      className="s2-tag font-data text-[10px] tracking-[0.18em] uppercase px-3 py-1.5"
                      style={{
                        border:          "1px solid rgba(201,160,72,0.32)",
                        color:           "rgba(201,160,72,0.85)",
                        backgroundColor: "rgba(201,160,72,0.04)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href="#contact"
                  className="s2-cta group mt-10 inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.22em] uppercase"
                  style={{ color: "#C9A048" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#D9B25C")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#C9A048")}
                >
                  <span>Begin Consultation</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ── Persistent UI ─────────────────────────────────────────────── */}

      {/* Top-left chapter indicator — below navbar */}
      <div className="s2-meta absolute top-24 left-6 lg:top-28 lg:left-12 z-[10] flex items-center gap-3">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: "#C9A048",
            animation:       "caret-pulse 1.8s ease-in-out infinite",
          }}
        />
        <span
          className="font-data text-[10px] tracking-[0.45em] uppercase"
          style={{ color: "rgba(240,234,224,0.7)" }}
        >
          II &mdash; The Craft
        </span>
      </div>

      {/* Top-right panel progress — six dots */}
      <div className="s2-progress absolute top-24 right-6 lg:top-28 lg:right-12 z-[10] flex items-center gap-2">
        {SERVICES.map((s, i) => (
          <span
            key={s.num}
            className="s2-dot inline-block w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === 0 ? "#C9A048" : "rgba(201,160,72,0.18)",
            }}
          />
        ))}
      </div>

      {/* Bottom-right scroll cue */}
      <div className="s2-cue absolute bottom-8 right-6 lg:bottom-12 lg:right-12 z-[10] flex items-center gap-3">
        <span
          className="font-data text-[9px] tracking-[0.45em] uppercase"
          style={{ color: "rgba(201,160,72,0.5)" }}
        >
          Continue
        </span>
        <ArrowRight size={11} style={{ color: "rgba(201,160,72,0.5)" }} />
      </div>
    </section>
  );
}
