"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { CompanyData } from "@/lib/types";

/**
 * Scene I — "The Crafts" (pinned scrub edition)
 *
 * The Crafts section is now the substantive heart of the site, not a
 * typographic footnote. The section pins for ~320vh of scroll. Each of
 * the four disciplines (Veneers, Smile Design, Implants, Bonding) takes
 * ~80vh of that scroll. As the user scrolls inside the pin, the active
 * discipline crossfades to the next.
 *
 * Per-discipline visual treatment:
 *   01 Porcelain Veneers  — hover-tracking loupe over the macro photo
 *                           (gold ring, 2.5× zoom — references the
 *                            4.5× surgical loupes in the Ledger)
 *   02 Smile Design        — DSD precision overlay draws itself on top
 *                           of the smile photo as the discipline becomes
 *                           active (smile line, vertical axis, canines,
 *                            phi bracket, ticks, marks)
 *   03 Dental Implants     — simple photo panel with technical metadata
 *                            overlay (dimensions, material, brand)
 *   04 Cosmetic Bonding    — simple photo panel with composite tagline
 *
 * Same scaffolding for the content panel on the right (numeral · name
 * · tagline · description · process steps · footer) — only the visual
 * treatment varies on the left.
 *
 * Mobile (< lg):
 *   The pin is disabled (touch-scroll + pin = iOS Safari pain). Each
 *   discipline becomes its own ~95vh vertical block, visual on top and
 *   content below. Animations fire on-enter rather than scrub.
 */

type Discipline = {
  numeral:     string;
  name:        string;
  tagline:     string;
  description: string;
  steps:       { num: string; label: string; timing?: string }[];
  footer:      string;
  photo:       string;
  photoPos:    string;
  visualType:  "loupe" | "dsd" | "implant" | "bonding";
};

const DISCIPLINES: Discipline[] = [
  {
    numeral:     "01",
    name:        "Porcelain Veneers",
    tagline:     "Lithium disilicate · Hand-layered · 12 days",
    description: "IPS e.max veneers layered by hand under three light registers — clinical, daylight, candlelight. No off-site lab. Every porcelain piece fired in the atelier and signed before placement.",
    steps: [
      { num: "01", label: "Photographic study + intra-oral scan",      timing: "1h" },
      { num: "02", label: "Digital mock-up + patient sign-off",         timing: "1 visit" },
      { num: "03", label: "Tooth preparation + temporaries",            timing: "1 visit" },
      { num: "04", label: "Layered fabrication in atelier",             timing: "5–7 days" },
      { num: "05", label: "Try-in, placement, hand-polish",             timing: "1 visit" },
    ],
    footer:     "From 3 visits · 12 days",
    photo:      "photo-1776406987595-ba14f3510c07",
    photoPos:   "center 50%",
    visualType: "loupe",
  },
  {
    numeral:     "02",
    name:        "Smile Design",
    tagline:     "DSD protocol · 47-point capture · Try-in phase",
    description: "Every geometry, every angle, every ratio plotted on a digital mock-up of the patient's own face. They see the outcome — and sign it off — before any tooth is touched.",
    steps: [
      { num: "01", label: "Five-point editorial portrait",              timing: "30 min" },
      { num: "02", label: "Intra-oral scan + facial harmony analysis",  timing: "30 min" },
      { num: "03", label: "3D mock-up + try-in trial",                  timing: "1 visit" },
      { num: "04", label: "Patient sign-off + treatment plan",          timing: "1 visit" },
    ],
    footer:     "From 2 visits · 8 days",
    photo:      "photo-1769559893692-c6d0623bf8e4",
    photoPos:   "center 50%",
    visualType: "dsd",
  },
  {
    numeral:     "03",
    name:        "Dental Implants",
    tagline:     "Titanium grade 4 · Computer-guided · Same-day options",
    description: "Straumann implants placed under surgical-guide planning. Where bone density allows, immediate-load same-day protocols. Restoration follows after osseointegration — three months from placement.",
    steps: [
      { num: "01", label: "CBCT scan + bone density analysis",          timing: "1 visit" },
      { num: "02", label: "Computer-guided surgical planning",          timing: "5 days"  },
      { num: "03", label: "Implant placement under guide",              timing: "1 visit" },
      { num: "04", label: "Osseointegration period",                    timing: "12 weeks" },
      { num: "05", label: "Final crown placement",                      timing: "1 visit" },
    ],
    footer:     "From 4 visits · 16 weeks",
    photo:      "photo-1771442873035-474765b40ac6",
    photoPos:   "center 50%",
    visualType: "implant",
  },
  {
    numeral:     "04",
    name:        "Cosmetic Bonding",
    tagline:     "Composite resin · Single-visit · Reversible",
    description: "Direct composite, sculpted and polished by hand in a single visit. Reserved for small repairs — chipped edges, micro-gaps, shade irregularities. Reversible. No tooth reduction.",
    steps: [
      { num: "01", label: "Shade selection + isolation",                timing: "15 min" },
      { num: "02", label: "Layered composite application",              timing: "45 min" },
      { num: "03", label: "Hand-sculpting + polish",                    timing: "30 min" },
    ],
    footer:     "1 visit · 90 minutes",
    photo:      "photo-1606811971618-4486d14f3f99",
    photoPos:   "center 45%",
    visualType: "bonding",
  },
];

export default function CraftSection({ company }: { company: CompanyData }) {
  void company;
  const sectionRef    = useRef<HTMLElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  /* One DOM ref per discipline panel + per loupe element */
  const panelRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const indicatorNum = useRef<HTMLSpanElement | null>(null);
  const indicatorBar = useRef<HTMLDivElement  | null>(null);
  /* Loupe refs — only used for Veneers (index 0) */
  const loupeContainerRef = useRef<HTMLDivElement>(null);
  const loupeRef          = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      /* ── Header reveal (above the pinned area) ──────────────────────── */
      gsap.set([".c1-meta", ".c1-rule", ".c1-heading", ".c1-lede"], { opacity: 0, y: 18 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 78%",
        once:    true,
        onEnter: () => {
          gsap.to(".c1-meta",    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
          gsap.to(".c1-rule",    { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", delay: 0.1 });
          gsap.to(".c1-heading", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.2 });
          gsap.to(".c1-lede",    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.5 });
        },
      });

      /* ── Desktop pinned scrub ────────────────────────────────────────
       * The pin wrapper is fixed for the duration of the discipline tour.
       * Each discipline becomes "active" (opacity 1) over its share of
       * the scroll. Transitions are GSAP tweens triggered by per-step
       * ScrollTriggers — discrete, not continuous (no scrub on opacity,
       * just clean crossfades).
       *
       * matchMedia gates the pin to lg+ so mobile gets the vertical
       * fallback layout (see JSX below). */
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        /* Initial state: only first discipline visible */
        panelRefs.current.forEach((panel, i) => {
          if (!panel) return;
          gsap.set(panel, { opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 2 : 1 });
        });

        /* Pin duration — deliberately long so each discipline gets
           enough scroll room that a single wheel event can't blast
           through multiple disciplines. Combined with `snap` below,
           every wheel impulse lands cleanly on the next discipline
           instead of skipping over two or three.
           150% per gap × 3 gaps = 450% total pin scroll. */
        const pinDuration = (DISCIPLINES.length - 1) * 150; // 450%

        let lastIdx = 0;
        ScrollTrigger.create({
          trigger:       pinWrapperRef.current,
          start:         "top top",
          end:           `+=${pinDuration}%`,
          pin:           true,
          pinType:       "fixed",
          anticipatePin: 1,
          /* Snap to each discipline.
             - snapTo:    1 / (N-1) → snap points at 0, 1/3, 2/3, 1
             - directional: snap in the direction of the scroll only
               (so a wheel-down snaps to the next discipline, not back
                to the one you just left)
             - duration:  short snap animation (0.4–0.7s)
             - delay:     short wait after scroll stops before snap
               fires (lets the user feel the inertia briefly then
               settle on a discipline)
             Together these make the section feel like a slide deck:
             one wheel → one discipline advance, no overshoot, no skip. */
          snap: {
            snapTo:     1 / (DISCIPLINES.length - 1),
            duration:   { min: 0.4, max: 0.7 },
            ease:       "power2.inOut",
            delay:      0.08,
            directional: true,
          },
          onUpdate: (self) => {
            const newIdx = Math.min(
              DISCIPLINES.length - 1,
              Math.floor(self.progress * DISCIPLINES.length),
            );
            if (newIdx !== lastIdx) {
              switchTo(newIdx);
              lastIdx = newIdx;
            }
          },
        });

        return () => {
          panelRefs.current.forEach((panel) => {
            if (panel) gsap.set(panel, { clearProps: "all" });
          });
        };
      });

      /* ── Switch helper — crossfades panels + updates indicator ──────── */
      const switchTo = (idx: number) => {
        panelRefs.current.forEach((panel, i) => {
          if (!panel) return;
          gsap.to(panel, {
            opacity:   i === idx ? 1 : 0,
            duration:  0.7,
            ease:      "power2.out",
            overwrite: "auto",
            onStart:   () => { if (i === idx) panel.style.zIndex = "2"; },
            onComplete:() => { if (i !== idx) panel.style.zIndex = "1"; },
          });
        });

        /* Animate the content reveals INSIDE the newly active panel */
        const activePanel = panelRefs.current[idx];
        if (activePanel) {
          const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
          tl.fromTo(activePanel.querySelectorAll(".disc-num"),
            { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 0.1)
            .fromTo(activePanel.querySelectorAll(".disc-rule"),
            { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "expo.out", transformOrigin: "left center" }, 0.2)
            .fromTo(activePanel.querySelectorAll(".disc-name"),
            { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8 }, 0.25)
            .fromTo(activePanel.querySelectorAll(".disc-tagline"),
            { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 0.5)
            .fromTo(activePanel.querySelectorAll(".disc-description"),
            { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.65 }, 0.6)
            .fromTo(activePanel.querySelectorAll(".disc-step"),
            { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.08 }, 0.75)
            .fromTo(activePanel.querySelectorAll(".disc-footer"),
            { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 1.15);

          /* DSD overlay reveal — only fires for Smile Design (idx === 1) */
          if (DISCIPLINES[idx].visualType === "dsd") {
            const overlayLines  = activePanel.querySelectorAll(".dsd-line");
            const overlayMarks  = activePanel.querySelectorAll(".dsd-mark");
            const overlayLabels = activePanel.querySelectorAll(".dsd-label");
            gsap.set(overlayLines, { strokeDashoffset: (_i, el) => Number((el as Element).getAttribute("data-len") ?? 100) });
            gsap.set(overlayMarks, { opacity: 0, scale: 0, transformOrigin: "center center" });
            gsap.set(overlayLabels, { opacity: 0, y: 4 });
            tl.to(overlayLines,  { strokeDashoffset: 0, duration: 1.0, ease: "power2.out" }, 0.4)
              .to(overlayMarks,  { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)" }, 1.1)
              .to(overlayLabels, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 }, 1.0);
          }
        }

        /* Update the chapter progress indicator */
        if (indicatorNum.current) {
          indicatorNum.current.textContent = String(idx + 1).padStart(2, "0");
        }
        if (indicatorBar.current) {
          gsap.to(indicatorBar.current, {
            scaleX:   (idx + 1) / DISCIPLINES.length,
            duration: 0.7,
            ease:     "power2.out",
          });
        }
      };

      /* ── Loupe interaction (Veneers, idx 0) ───────────────────────────
       * Track mouse over the loupe container, position the loupe ring
       * so its center is at the cursor. The inner zoomed-in photo is
       * positioned so the cursor's relative position in the small photo
       * aligns with the center of the loupe at 2.5× scale. */
      if (loupeContainerRef.current && loupeRef.current) {
        const ZOOM = 2.5;
        const LOUPE_SIZE = 200; // diameter in px

        const onMove = (e: MouseEvent) => {
          const container = loupeContainerRef.current;
          const loupe     = loupeRef.current;
          if (!container || !loupe) return;

          const rect = container.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
            loupe.style.opacity = "0";
            return;
          }

          loupe.style.opacity = "1";
          loupe.style.left    = `${x - LOUPE_SIZE / 2}px`;
          loupe.style.top     = `${y - LOUPE_SIZE / 2}px`;

          /* Position the inner zoomed image so the cursor's point in
             container maps to the loupe's center at ZOOM scale. */
          const inner = loupe.querySelector(".loupe-inner") as HTMLElement | null;
          if (inner) {
            const bgX = -(x * ZOOM - LOUPE_SIZE / 2);
            const bgY = -(y * ZOOM - LOUPE_SIZE / 2);
            inner.style.backgroundPosition = `${bgX}px ${bgY}px`;
            inner.style.backgroundSize     = `${rect.width * ZOOM}px ${rect.height * ZOOM}px`;
          }
        };

        const onLeave = () => {
          if (loupeRef.current) loupeRef.current.style.opacity = "0";
        };

        loupeContainerRef.current.addEventListener("mousemove", onMove);
        loupeContainerRef.current.addEventListener("mouseleave", onLeave);
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="craft"
      className="relative w-full"
      style={{ backgroundColor: "#0C0B09", overflow: "clip" }}
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
        className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full pointer-events-none z-[1]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(201,160,72,0.07) 0%, transparent 65%)",
          animation:  "breathe-gold 18s ease-in-out infinite",
        }}
      />

      <div className="relative z-[2] max-w-7xl mx-auto px-6 lg:px-12 pt-24 lg:pt-32">

        {/* ── Section header ─────────────────────────────────────────── */}
        <div className="mb-14 lg:mb-20 max-w-3xl">
          <div className="c1-meta flex items-center gap-3 mb-8">
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
            className="c1-rule h-px w-16 mb-8"
            style={{ backgroundColor: "#C9A048", transformOrigin: "left center" }}
          />

          <h2
            className="c1-heading font-display"
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
            className="c1-lede mt-8 text-base leading-relaxed max-w-lg"
            style={{ color: "rgba(216,210,200,0.6)" }}
          >
            Cosmetic dentistry composed by hand, in this atelier. Lithium disilicate,
            digital smile design, computer-guided implants, and reversible bonding.
            Each discipline in its own register.
          </p>
        </div>
      </div>

      {/* ── Desktop pinned scrub area ───────────────────────────────────
         * 4 discipline panels stacked absolutely. ScrollTrigger pins this
         * wrapper for ~300% of scroll; per-step triggers swap panels.
         * Mobile uses a vertical stack below this (lg:hidden vs hidden lg:block). */}
      <div
        ref={pinWrapperRef}
        className="hidden lg:block relative w-full"
        style={{ height: "100vh" }}
      >
        {/* Chapter indicator — pinned at top */}
        <div className="absolute top-6 left-0 right-0 z-[5] max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4">
            <span className="font-data text-[10px] tracking-[0.42em] uppercase" style={{ color: "rgba(201,160,72,0.55)" }}>
              Craft
            </span>
            <span
              ref={indicatorNum}
              className="font-display italic"
              style={{ fontSize: "clamp(1.4rem, 1.8vw, 1.8rem)", color: "#C9A048", lineHeight: 1 }}
            >
              01
            </span>
            <div className="flex-1 h-px relative" style={{ backgroundColor: "rgba(201,160,72,0.15)" }}>
              <div
                ref={indicatorBar}
                className="absolute inset-y-0 left-0 right-0"
                style={{ backgroundColor: "#C9A048", transformOrigin: "left center", transform: "scaleX(0.25)" }}
              />
            </div>
            <span className="font-data text-[10px] tracking-[0.42em] uppercase" style={{ color: "rgba(201,160,72,0.55)" }}>
              / 04
            </span>
          </div>
        </div>

        {/* Discipline panels — all stacked, only one visible at a time */}
        {DISCIPLINES.map((d, i) => (
          <div
            key={d.name}
            ref={(el) => { panelRefs.current[i] = el; }}
            className="absolute inset-0 flex items-center will-change-[opacity]"
          >
            <div className="max-w-7xl w-full mx-auto px-6 lg:px-12 pt-20 pb-12 grid grid-cols-12 gap-10 items-center">

              {/* LEFT — visual treatment (varies per discipline) */}
              <div className="col-span-6">
                {d.visualType === "loupe" && i === 0 && (
                  <DisciplineVisualLoupe
                    photo={d.photo}
                    photoPos={d.photoPos}
                    loupeContainerRef={loupeContainerRef}
                    loupeRef={loupeRef}
                  />
                )}
                {d.visualType === "dsd" && (
                  <DisciplineVisualDSD photo={d.photo} photoPos={d.photoPos} />
                )}
                {d.visualType === "implant" && (
                  <DisciplineVisualImplant photo={d.photo} photoPos={d.photoPos} />
                )}
                {d.visualType === "bonding" && (
                  <DisciplineVisualBonding photo={d.photo} photoPos={d.photoPos} />
                )}
              </div>

              {/* RIGHT — content panel */}
              <div className="col-span-6 lg:pl-8">
                <span
                  className="disc-num block font-data text-xs tracking-[0.32em] mb-3"
                  style={{ color: "rgba(201,160,72,0.62)" }}
                >
                  {d.numeral} &mdash; Discipline
                </span>
                <div
                  className="disc-rule h-px w-12 mb-5"
                  style={{ backgroundColor: "#C9A048" }}
                />
                <h3
                  className="disc-name font-display"
                  style={{
                    fontSize:      "clamp(2.2rem, 4.4vw, 3.8rem)",
                    lineHeight:    1.0,
                    letterSpacing: "-0.02em",
                    color:         "#F0EAE0",
                    fontWeight:    400,
                  }}
                >
                  {d.name.split(" ").slice(0, -1).join(" ")}{" "}
                  <span style={{ fontStyle: "italic", color: "#C9A048" }}>
                    {d.name.split(" ").slice(-1)[0]}.
                  </span>
                </h3>
                <p
                  className="disc-tagline mt-3 font-data text-[10px] tracking-[0.28em] uppercase"
                  style={{ color: "rgba(201,160,72,0.78)" }}
                >
                  {d.tagline}
                </p>
                <p
                  className="disc-description mt-5 text-sm leading-relaxed max-w-md"
                  style={{ color: "rgba(216,210,200,0.72)" }}
                >
                  {d.description}
                </p>

                {/* Process steps */}
                <ol className="mt-6 flex flex-col gap-2.5">
                  {d.steps.map((s) => (
                    <li
                      key={s.num}
                      className="disc-step flex items-baseline gap-4"
                    >
                      <span
                        className="font-data text-[10px] tracking-[0.32em] w-8 shrink-0"
                        style={{ color: "rgba(201,160,72,0.55)" }}
                      >
                        {s.num}
                      </span>
                      <span
                        className="font-data text-[11px] tracking-[0.14em] flex-1"
                        style={{ color: "rgba(216,210,200,0.78)" }}
                      >
                        {s.label}
                      </span>
                      {s.timing && (
                        <span
                          className="font-data text-[9px] tracking-[0.28em] uppercase shrink-0"
                          style={{ color: "rgba(201,160,72,0.55)" }}
                        >
                          {s.timing}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>

                <div
                  className="disc-footer mt-7 pt-5 font-data text-xs tracking-[0.28em] uppercase"
                  style={{ color: "#C9A048", borderTop: "1px solid rgba(201,160,72,0.22)" }}
                >
                  {d.footer}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Mobile fallback — vertical stack ────────────────────────── */}
      <div className="lg:hidden flex flex-col gap-12 pb-16">
        {DISCIPLINES.map((d) => (
          <article
            key={d.name}
            className="relative max-w-7xl mx-auto px-6 w-full"
          >
            <div className="relative w-full overflow-hidden mb-6" style={{ aspectRatio: "4 / 5" }}>
              <Image
                src={`https://images.unsplash.com/${d.photo}?auto=format&fit=crop&w=1200&q=85`}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: d.photoPos, filter: "brightness(0.92) contrast(1.05) saturate(0.85)" }}
              />
              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-5 h-5 pointer-events-none"
                style={{ borderTop: "1px solid rgba(201,160,72,0.55)", borderLeft: "1px solid rgba(201,160,72,0.55)" }} />
              <div className="absolute top-3 right-3 w-5 h-5 pointer-events-none"
                style={{ borderTop: "1px solid rgba(201,160,72,0.55)", borderRight: "1px solid rgba(201,160,72,0.55)" }} />
              <div className="absolute bottom-3 left-3 w-5 h-5 pointer-events-none"
                style={{ borderBottom: "1px solid rgba(201,160,72,0.55)", borderLeft: "1px solid rgba(201,160,72,0.55)" }} />
              <div className="absolute bottom-3 right-3 w-5 h-5 pointer-events-none"
                style={{ borderBottom: "1px solid rgba(201,160,72,0.55)", borderRight: "1px solid rgba(201,160,72,0.55)" }} />
            </div>

            <span className="block font-data text-xs tracking-[0.32em] mb-3" style={{ color: "rgba(201,160,72,0.62)" }}>
              {d.numeral} &mdash; Discipline
            </span>
            <h3 className="font-display" style={{
              fontSize: "clamp(2rem, 8vw, 3rem)", lineHeight: 1.0, letterSpacing: "-0.02em",
              color: "#F0EAE0", fontWeight: 400,
            }}>
              {d.name.split(" ").slice(0, -1).join(" ")}{" "}
              <span style={{ fontStyle: "italic", color: "#C9A048" }}>
                {d.name.split(" ").slice(-1)[0]}.
              </span>
            </h3>
            <p className="mt-3 font-data text-[10px] tracking-[0.28em] uppercase" style={{ color: "rgba(201,160,72,0.78)" }}>
              {d.tagline}
            </p>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(216,210,200,0.72)" }}>
              {d.description}
            </p>
            <ol className="mt-5 flex flex-col gap-2">
              {d.steps.map((s) => (
                <li key={s.num} className="flex items-baseline gap-3">
                  <span className="font-data text-[10px] tracking-[0.32em] w-7 shrink-0" style={{ color: "rgba(201,160,72,0.55)" }}>{s.num}</span>
                  <span className="font-data text-[11px] tracking-[0.14em] flex-1" style={{ color: "rgba(216,210,200,0.78)" }}>{s.label}</span>
                  {s.timing && (
                    <span className="font-data text-[9px] tracking-[0.28em] uppercase shrink-0" style={{ color: "rgba(201,160,72,0.55)" }}>{s.timing}</span>
                  )}
                </li>
              ))}
            </ol>
            <div className="mt-5 pt-4 font-data text-[11px] tracking-[0.28em] uppercase"
              style={{ color: "#C9A048", borderTop: "1px solid rgba(201,160,72,0.22)" }}>
              {d.footer}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Discipline visual components — one per visualType.
 * Each is sized to fit inside the panel's col-span-6 with an aspect
 * ratio that keeps the section feeling editorial (4/5 portrait).
 * ──────────────────────────────────────────────────────────────── */

function DisciplineVisualLoupe({
  photo,
  photoPos,
  loupeContainerRef,
  loupeRef,
}: {
  photo:             string;
  photoPos:          string;
  loupeContainerRef: React.RefObject<HTMLDivElement | null>;
  loupeRef:          React.RefObject<HTMLDivElement | null>;
}) {
  const photoUrl = `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1600&q=85`;
  return (
    <div className="relative w-full" style={{ aspectRatio: "4 / 5" }}>
      <div
        ref={loupeContainerRef}
        className="relative w-full h-full overflow-hidden cursor-none"
      >
        <Image
          src={photoUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
          style={{ objectPosition: photoPos, filter: "brightness(0.92) contrast(1.05) saturate(0.85)" }}
        />
        {/* Loupe ring — follows cursor, hidden when outside container */}
        <div
          ref={loupeRef}
          className="absolute pointer-events-none"
          style={{
            width:       "200px",
            height:      "200px",
            opacity:     0,
            borderRadius: "9999px",
            border:      "1.5px solid rgba(201,160,72,0.85)",
            boxShadow:   "0 0 28px rgba(201,160,72,0.35), inset 0 0 0 1px rgba(255,255,255,0.05)",
            transition:  "opacity 0.2s ease",
            willChange:  "left, top, opacity",
          }}
        >
          <div
            className="loupe-inner absolute inset-0 rounded-full"
            style={{
              backgroundImage:    `url(${photoUrl})`,
              backgroundRepeat:   "no-repeat",
              filter:             "brightness(1.0) contrast(1.1) saturate(0.92)",
            }}
          />
          {/* Crosshair in the loupe center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ width: "10px", height: "1px", backgroundColor: "rgba(201,160,72,0.8)" }} />
            <div className="absolute" style={{ width: "1px", height: "10px", backgroundColor: "rgba(201,160,72,0.8)" }} />
          </div>
        </div>
      </div>
      {/* Corner brackets */}
      <DisciplineCorners />
      {/* Caption */}
      <div className="mt-4 flex items-center justify-between">
        <span className="font-data text-[9px] tracking-[0.4em] uppercase" style={{ color: "rgba(201,160,72,0.65)" }}>
          Hover to inspect &middot; 2.5×
        </span>
        <span className="font-data text-[9px] tracking-[0.32em] uppercase" style={{ color: "rgba(216,210,200,0.4)" }}>
          Lithium disilicate
        </span>
      </div>
    </div>
  );
}

function DisciplineVisualDSD({ photo, photoPos }: { photo: string; photoPos: string }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: "4 / 5" }}>
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1600&q=85`}
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
          style={{ objectPosition: photoPos, filter: "brightness(0.95) contrast(1.06) saturate(1.0)" }}
        />

        {/* DSD precision overlay — drawn in by GSAP when discipline becomes active */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Vertical axis */}
          <line x1="50" y1="18" x2="50" y2="82"
            stroke="#C9A048" strokeWidth="0.18"
            vectorEffect="non-scaling-stroke"
            data-len="64" strokeDasharray="64"
            opacity="0.45"
            className="dsd-line" />
          {/* Smile line */}
          <line x1="22" y1="58" x2="78" y2="58"
            stroke="#C9A048" strokeWidth="0.32"
            vectorEffect="non-scaling-stroke"
            data-len="56" strokeDasharray="56"
            className="dsd-line" />
          {/* Incisal edge */}
          <line x1="30" y1="46" x2="70" y2="46"
            stroke="#C9A048" strokeWidth="0.16"
            vectorEffect="non-scaling-stroke"
            data-len="40" strokeDasharray="40"
            opacity="0.55"
            className="dsd-line" />
          {/* Canine markers */}
          <line x1="34" y1="48" x2="34" y2="62"
            stroke="#C9A048" strokeWidth="0.22"
            vectorEffect="non-scaling-stroke"
            data-len="14" strokeDasharray="14"
            className="dsd-line" />
          <line x1="66" y1="48" x2="66" y2="62"
            stroke="#C9A048" strokeWidth="0.22"
            vectorEffect="non-scaling-stroke"
            data-len="14" strokeDasharray="14"
            className="dsd-line" />
          {/* φ bracket */}
          <line x1="58" y1="52" x2="58" y2="58"
            stroke="#C9A048" strokeWidth="0.18"
            vectorEffect="non-scaling-stroke"
            data-len="6" strokeDasharray="6"
            opacity="0.7"
            className="dsd-line" />
          {/* Tick marks */}
          <circle cx="50" cy="58" r="0.6" fill="#C9A048" className="dsd-mark" />
          <circle cx="50" cy="46" r="0.4" fill="none" stroke="#C9A048" strokeWidth="0.22"
            vectorEffect="non-scaling-stroke" opacity="0.6" className="dsd-mark" />
        </svg>

        {/* Mono labels */}
        <span className="dsd-label absolute font-data tracking-[0.32em] uppercase"
          style={{ top: "54%", left: "62%", fontSize: "9px", color: "rgba(201,160,72,0.92)" }}>
          &phi;&thinsp;1.618
        </span>
        <span className="dsd-label absolute font-data tracking-[0.28em] uppercase"
          style={{ top: "62%", left: "50%", transform: "translateX(-50%)", fontSize: "8px", color: "rgba(201,160,72,0.78)" }}>
          47.2&thinsp;mm
        </span>
      </div>

      <DisciplineCorners />

      <div className="mt-4 flex items-center justify-between">
        <span className="font-data text-[9px] tracking-[0.4em] uppercase" style={{ color: "rgba(201,160,72,0.65)" }}>
          DSD &middot; 47-point capture
        </span>
        <span className="font-data text-[9px] tracking-[0.32em] uppercase" style={{ color: "rgba(216,210,200,0.4)" }}>
          Try-in &middot; Pre-cut
        </span>
      </div>
    </div>
  );
}

function DisciplineVisualImplant({ photo, photoPos }: { photo: string; photoPos: string }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: "4 / 5" }}>
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1600&q=85`}
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
          style={{ objectPosition: photoPos, filter: "brightness(0.95) contrast(1.08) saturate(0.85)" }}
        />
        {/* Technical metadata overlay — top-right */}
        <div className="absolute top-5 right-5 text-right pointer-events-none">
          <div className="font-data text-[9px] tracking-[0.32em] uppercase" style={{ color: "rgba(201,160,72,0.85)" }}>
            Straumann
          </div>
          <div className="font-data text-[8px] tracking-[0.24em] uppercase mt-1" style={{ color: "rgba(216,210,200,0.55)" }}>
            &Oslash; 4.1mm × 10mm
          </div>
          <div className="font-data text-[8px] tracking-[0.24em] uppercase mt-0.5" style={{ color: "rgba(216,210,200,0.55)" }}>
            Titanium &middot; Grade 4
          </div>
        </div>
        {/* Placement guide hairline — vertical, gold, with crosshair tick */}
        <div className="absolute top-1/4 bottom-1/4 left-1/2 w-px pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(201,160,72,0.7), transparent)", transform: "translateX(-50%)" }} />
        <div className="absolute pointer-events-none"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "16px", height: "16px",
                   border: "1px solid rgba(201,160,72,0.7)", borderRadius: "9999px" }} />
      </div>

      <DisciplineCorners />

      <div className="mt-4 flex items-center justify-between">
        <span className="font-data text-[9px] tracking-[0.4em] uppercase" style={{ color: "rgba(201,160,72,0.65)" }}>
          Surgical guide &middot; Computer-planned
        </span>
        <span className="font-data text-[9px] tracking-[0.32em] uppercase" style={{ color: "rgba(216,210,200,0.4)" }}>
          Case &middot; 04
        </span>
      </div>
    </div>
  );
}

function DisciplineVisualBonding({ photo, photoPos }: { photo: string; photoPos: string }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: "4 / 5" }}>
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1600&q=85`}
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
          style={{ objectPosition: photoPos, filter: "brightness(0.96) contrast(1.06) saturate(0.92)" }}
        />
        {/* Composite shade indicator — bottom-left */}
        <div className="absolute bottom-5 left-5 flex items-center gap-2 pointer-events-none">
          <span className="inline-block" style={{ width: "10px", height: "10px", backgroundColor: "#E8D9BA", border: "1px solid rgba(201,160,72,0.55)" }} />
          <span className="font-data text-[9px] tracking-[0.32em] uppercase" style={{ color: "rgba(201,160,72,0.85)" }}>
            Shade A2
          </span>
        </div>
      </div>

      <DisciplineCorners />

      <div className="mt-4 flex items-center justify-between">
        <span className="font-data text-[9px] tracking-[0.4em] uppercase" style={{ color: "rgba(201,160,72,0.65)" }}>
          Composite &middot; Reversible
        </span>
        <span className="font-data text-[9px] tracking-[0.32em] uppercase" style={{ color: "rgba(216,210,200,0.4)" }}>
          Single visit
        </span>
      </div>
    </div>
  );
}

/** Corner brackets — atelier framing, shared across all discipline visuals */
function DisciplineCorners() {
  return (
    <>
      <div className="absolute top-3 left-3 w-5 h-5 pointer-events-none"
        style={{ borderTop: "1px solid rgba(201,160,72,0.55)", borderLeft: "1px solid rgba(201,160,72,0.55)" }} />
      <div className="absolute top-3 right-3 w-5 h-5 pointer-events-none"
        style={{ borderTop: "1px solid rgba(201,160,72,0.55)", borderRight: "1px solid rgba(201,160,72,0.55)" }} />
      <div className="absolute bottom-3 left-3 w-5 h-5 pointer-events-none"
        style={{ borderBottom: "1px solid rgba(201,160,72,0.55)", borderLeft: "1px solid rgba(201,160,72,0.55)" }} />
      <div className="absolute bottom-3 right-3 w-5 h-5 pointer-events-none"
        style={{ borderBottom: "1px solid rgba(201,160,72,0.55)", borderRight: "1px solid rgba(201,160,72,0.55)" }} />
    </>
  );
}
