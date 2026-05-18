"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { CompanyData } from "@/lib/types";

/**
 * Scene I — "The Crafts" (vertical stack edition)
 *
 * Each of the four disciplines (Veneers, Smile Design, Implants,
 * Bonding) is its own ~80–100vh vertical section. Image on one side,
 * content panel on the other, alternating per discipline for editorial
 * rhythm. Animations fire on scroll-enter — no pin, no snap.
 *
 * The previous pinned-scrub version was technically impressive but
 * wrong for a cold-outreach demo: forcing the prospect to scroll
 * deliberately through 4 disciplines added friction at exactly the
 * moment they want to scan quickly. Vertical stack gives them control
 * — they can dwell on Veneers if they're curious, blast past Bonding
 * if they don't care, and the experience is identical on mobile and
 * desktop.
 *
 * The four per-discipline visual signatures are preserved:
 *   01 Veneers      — hover-tracking 2.5× gold loupe over macro
 *   02 Smile Design — DSD overlay (axis, smile line, canines, φ) draws
 *                     in on scroll-enter
 *   03 Implants     — Straumann metadata + placement guide hairline
 *   04 Bonding      — composite shade swatch (A2)
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
  const sectionRef = useRef<HTMLElement>(null);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);
  const loupeContainerRef = useRef<HTMLDivElement>(null);
  const loupeRef          = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      /* ── Header reveal ────────────────────────────────────────────── */
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

      /* ── Per-discipline on-enter reveals ──────────────────────────── */
      articleRefs.current.forEach((article, idx) => {
        if (!article) return;

        /* Initial hidden state */
        gsap.set(article.querySelectorAll(".disc-num, .disc-tagline, .disc-description, .disc-step, .disc-footer"),
          { opacity: 0, y: 20 });
        gsap.set(article.querySelectorAll(".disc-rule"),
          { scaleX: 0, transformOrigin: "left center" });
        gsap.set(article.querySelectorAll(".disc-name"),
          { opacity: 0, y: 30 });
        gsap.set(article.querySelectorAll(".disc-visual"),
          { opacity: 0, y: 30 });

        /* DSD overlay initial state (only for Smile Design) */
        if (DISCIPLINES[idx].visualType === "dsd") {
          gsap.set(article.querySelectorAll(".dsd-line"), {
            strokeDashoffset: (_i, el) => Number((el as Element).getAttribute("data-len") ?? 100),
          });
          gsap.set(article.querySelectorAll(".dsd-mark"),  { opacity: 0, scale: 0, transformOrigin: "center center" });
          gsap.set(article.querySelectorAll(".dsd-label"), { opacity: 0, y: 4 });
        }

        /* Trigger reveals when article enters viewport */
        ScrollTrigger.create({
          trigger: article,
          start:   "top 75%",
          once:    true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

            tl.to(article.querySelectorAll(".disc-visual"),
              { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0)
              .to(article.querySelectorAll(".disc-num"),
              { opacity: 1, y: 0, duration: 0.5 }, 0.15)
              .to(article.querySelectorAll(".disc-rule"),
              { scaleX: 1, duration: 0.6, ease: "expo.out" }, 0.25)
              .to(article.querySelectorAll(".disc-name"),
              { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.3)
              .to(article.querySelectorAll(".disc-tagline"),
              { opacity: 1, y: 0, duration: 0.6 }, 0.55)
              .to(article.querySelectorAll(".disc-description"),
              { opacity: 1, y: 0, duration: 0.65 }, 0.65)
              .to(article.querySelectorAll(".disc-step"),
              { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.8)
              .to(article.querySelectorAll(".disc-footer"),
              { opacity: 1, y: 0, duration: 0.5 }, 1.2);

            /* DSD overlay reveal — only for Smile Design */
            if (DISCIPLINES[idx].visualType === "dsd") {
              tl.to(article.querySelectorAll(".dsd-line"),
                { strokeDashoffset: 0, duration: 1.1, ease: "power2.out" }, 0.5)
                .to(article.querySelectorAll(".dsd-mark"),
                { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)" }, 1.2)
                .to(article.querySelectorAll(".dsd-label"),
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 }, 1.1);
            }
          },
        });
      });

      /* ── Loupe interaction (Veneers — discipline 0) ───────────────── */
      if (loupeContainerRef.current && loupeRef.current) {
        const ZOOM = 2.5;
        const LOUPE_SIZE = 200;

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

      <div className="relative z-[2] max-w-7xl mx-auto px-6 lg:px-12 pt-24 lg:pt-32 pb-16 lg:pb-24">

        {/* ── Section header ─────────────────────────────────────────── */}
        <div className="mb-16 lg:mb-24 max-w-3xl">
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

        {/* ── Discipline articles — vertical stack, alternating sides ─── */}
        <div className="flex flex-col gap-20 lg:gap-32">
          {DISCIPLINES.map((d, i) => {
            const imageOnLeft = i % 2 === 0; // 0,2 left · 1,3 right

            return (
              <article
                key={d.name}
                ref={(el) => { articleRefs.current[i] = el; }}
                className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* VISUAL — image side */}
                <div
                  className={`disc-visual lg:col-span-6 ${imageOnLeft ? "lg:order-1" : "lg:order-2"}`}
                >
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

                {/* CONTENT — text side */}
                <div className={`lg:col-span-6 ${imageOnLeft ? "lg:order-2 lg:pl-4" : "lg:order-1 lg:pr-4"}`}>
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
                      fontSize:      "clamp(2.2rem, 4.6vw, 4rem)",
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
                    className="disc-description mt-5 text-sm lg:text-base leading-relaxed max-w-md"
                    style={{ color: "rgba(216,210,200,0.72)" }}
                  >
                    {d.description}
                  </p>

                  {/* Process steps */}
                  <ol className="mt-7 flex flex-col gap-2.5">
                    {d.steps.map((s) => (
                      <li key={s.num} className="disc-step flex items-baseline gap-4">
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
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Per-discipline visual components.
 * Each renders a 4/5 portrait container with corner brackets + caption.
 * Animations on the SVG/labels (DSD) are triggered by the parent
 * article's on-enter ScrollTrigger via classnames.
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
        className="relative w-full h-full overflow-hidden"
      >
        <Image
          src={photoUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
          style={{ objectPosition: photoPos, filter: "brightness(0.92) contrast(1.05) saturate(0.85)" }}
        />
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ width: "10px", height: "1px", backgroundColor: "rgba(201,160,72,0.8)" }} />
            <div className="absolute" style={{ width: "1px", height: "10px", backgroundColor: "rgba(201,160,72,0.8)" }} />
          </div>
        </div>
      </div>
      <DisciplineCorners />
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

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line x1="50" y1="18" x2="50" y2="82"
            stroke="#C9A048" strokeWidth="0.18"
            vectorEffect="non-scaling-stroke"
            data-len="64" strokeDasharray="64"
            opacity="0.45"
            className="dsd-line" />
          <line x1="22" y1="58" x2="78" y2="58"
            stroke="#C9A048" strokeWidth="0.32"
            vectorEffect="non-scaling-stroke"
            data-len="56" strokeDasharray="56"
            className="dsd-line" />
          <line x1="30" y1="46" x2="70" y2="46"
            stroke="#C9A048" strokeWidth="0.16"
            vectorEffect="non-scaling-stroke"
            data-len="40" strokeDasharray="40"
            opacity="0.55"
            className="dsd-line" />
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
          <line x1="58" y1="52" x2="58" y2="58"
            stroke="#C9A048" strokeWidth="0.18"
            vectorEffect="non-scaling-stroke"
            data-len="6" strokeDasharray="6"
            opacity="0.7"
            className="dsd-line" />
          <circle cx="50" cy="58" r="0.6" fill="#C9A048" className="dsd-mark" />
          <circle cx="50" cy="46" r="0.4" fill="none" stroke="#C9A048" strokeWidth="0.22"
            vectorEffect="non-scaling-stroke" opacity="0.6" className="dsd-mark" />
        </svg>

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
