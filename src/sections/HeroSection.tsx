"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Phone, ArrowRight } from "lucide-react";
import type { CompanyData } from "@/lib/types";

/**
 * Hero — Scene I "The Opening"
 *
 * Auto-playing cinematic intro on page load (~5.5 seconds). The visitor
 * doesn't have to do anything — the page reveals itself like a film
 * opening sequence. After the intro settles, the hero is "alive" with
 * subtle ambient effects, and the visitor is invited to scroll.
 *
 * Three beats, all played automatically via a single GSAP timeline:
 *
 *   BEAT 1  (0.0–2.0 s)  — The whisper
 *     Black canvas. "We don't whiten teeth." fades up in italic, holds,
 *     fades out and is replaced by "We redesign faces." in gold.
 *
 *   BEAT 2  (2.0–4.0 s)  — The curtain
 *     Two solid slabs (top half + bottom half of the viewport) slide
 *     apart from the center — top up, bottom down — like elevator doors
 *     opening on a face. Photo scale settles (1.18 → 1.0); atmospheric
 *     darkening lifts.
 *
 *   BEAT 3  (4.0–5.5 s)  — The composition
 *     "L'Art du Sourire" masthead appears bottom-left over the now-
 *     revealed portrait. Subtitle + CTAs slide in. Scroll cue invites
 *     the visitor into Scene II.
 *
 * Why auto-play instead of scrub-on-scroll: forcing the user to scroll
 * to "activate" the page is counter-intuitive — a first-time visitor
 * expects the hero to be complete on arrival. Scroll-driven storytelling
 * is reserved for SUBSEQUENT scenes (Scene II horizontal panels, Scene
 * III before/after scrub) where the user has already been onboarded
 * and understands they're inside a directed experience.
 */

export default function HeroSection({ company }: { company: CompanyData }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      /* ── Master timeline — auto-plays on mount, ~5.5s total ────────────
       * useGSAP runs as useLayoutEffect → fires synchronously after DOM
       * commit, before first paint. FOUC prevention is handled by the
       * .s1-* classes in globals.css setting opacity:0 / transforms.
       * Position values below are SECONDS.
       * ─────────────────────────────────────────────────────────────── */
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

      /* Persistent UI surfaces immediately */
      tl.to([".s1-meta", ".s1-rail"], { opacity: 1, duration: 0.5, stagger: 0.1 }, 0);
      /* Side rail fills during the entire intro — completion = "ready" */
      tl.to(".s1-rail-grow", { scaleY: 1, duration: 5.0, ease: "none" }, 0.3);

      /* ── BEAT 1 — The whisper ───────────────────────────────────────── */
      tl.fromTo(
        ".s1-line-a",
        { opacity: 0, y: 60, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0, ease: "power3.out" },
        0.3
      );
      tl.to(
        ".s1-line-a",
        { opacity: 0, y: -50, filter: "blur(8px)", duration: 0.7, ease: "power2.in" },
        1.6
      );

      tl.fromTo(
        ".s1-line-b",
        { opacity: 0, y: 60, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" },
        1.9
      );

      /* ── BEAT 2 — The curtain rises ─────────────────────────────────── */
      /* Slabs slide apart, photo emerges from the center outward */
      tl.to(
        ".s1-veil-top",
        { yPercent: -100, duration: 1.6, ease: "expo.inOut" },
        2.6
      );
      tl.to(
        ".s1-veil-bottom",
        { yPercent: 100, duration: 1.6, ease: "expo.inOut" },
        2.6
      );

      /* Photo subtle scale settles — camera pulling back */
      tl.fromTo(
        ".s1-photo",
        { scale: 1.18, filter: "brightness(0.65) contrast(1.18) saturate(0.75)" },
        { scale: 1.00, filter: "brightness(1.00) contrast(1.10) saturate(0.92)", duration: 2.2, ease: "power2.out" },
        2.6
      );

      /* Atmospheric darkening lifts as the reveal progresses */
      tl.fromTo(
        ".s1-atmosphere",
        { opacity: 0.55 },
        { opacity: 0,    duration: 1.8, ease: "power2.out" },
        2.8
      );

      /* Line 2 fades while the photo emerges underneath */
      tl.to(
        ".s1-line-b",
        { opacity: 0, y: -40, filter: "blur(6px)", duration: 0.8, ease: "power2.in" },
        3.0
      );

      /* ── BEAT 3 — The composition settles ───────────────────────────── */
      tl.fromTo(
        ".s1-masthead",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
        4.1
      );

      tl.fromTo(
        ".s1-sub",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        4.5
      );

      tl.fromTo(
        ".s1-cta",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out" },
        4.8
      );

      tl.fromTo(
        ".s1-cue",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5 },
        5.1
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: "#0C0B09" }}
    >
      <div className="relative w-full h-full">
        {/* ── z-1 — Portrait (always at full opacity, scale animated) ───── */}
        <div className="s1-photo absolute inset-0 z-[1] will-change-transform">
          <Image
            src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=2400&q=90"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
            style={{ objectPosition: "65% center" }}
          />
        </div>

        {/* ── z-2 — Atmospheric darkening (lifts during Beat 2) ─────────── */}
        <div
          className="s1-atmosphere absolute inset-0 z-[2] pointer-events-none"
          style={{ backgroundColor: "rgba(12,11,9,0.55)" }}
        />

        {/* ── z-3 — The two curtain slabs ───────────────────────────────── */}
        {/* Top slab — covers upper 51% (1% overlap to avoid hairline gap) */}
        <div
          className="s1-veil-top absolute top-0 left-0 right-0 z-[3] will-change-transform"
          style={{ height: "51%", backgroundColor: "#0C0B09" }}
        />
        {/* Bottom slab — covers lower 51% */}
        <div
          className="s1-veil-bottom absolute bottom-0 left-0 right-0 z-[3] will-change-transform"
          style={{ height: "51%", backgroundColor: "#0C0B09" }}
        />

        {/* ── z-4 — Beat 1 poetic lines (visible against black, then fade out) */}
        <div className="absolute inset-0 z-[4] flex items-center justify-center px-6 pointer-events-none">
          <div className="relative w-full max-w-5xl text-center">
            <p
              className="s1-line-a absolute inset-0 flex items-center justify-center font-display italic"
              style={{
                fontSize:      "clamp(2.2rem, 5.5vw, 4.5rem)",
                lineHeight:    "1.05",
                letterSpacing: "-0.01em",
                color:         "#D8D2C8",
                fontWeight:    400,
              }}
            >
              We don&rsquo;t whiten teeth.
            </p>
            <p
              className="s1-line-b absolute inset-0 flex items-center justify-center font-display italic"
              style={{
                fontSize:      "clamp(2.2rem, 5.5vw, 4.5rem)",
                lineHeight:    "1.05",
                letterSpacing: "-0.01em",
                color:         "#C9A048",
                fontWeight:    400,
              }}
            >
              We redesign faces.
            </p>
          </div>
        </div>

        {/* ── z-5 — Beat 3 composition (over photo, bottom-left masthead) ── */}
        <div className="absolute inset-0 z-[5] flex flex-col justify-end px-6 pb-24 lg:px-16 lg:pb-32 pointer-events-none">
          <div className="max-w-3xl">
            <h1
              className="s1-masthead font-display"
              style={{
                fontSize:      "clamp(3rem, 9vw, 9rem)",
                lineHeight:    "0.95",
                letterSpacing: "-0.02em",
                color:         "#F0EAE0",
                fontWeight:    400,
                textShadow:    "0 2px 40px rgba(0,0,0,0.5)",
              }}
            >
              <span style={{ fontStyle: "italic", color: "#C9A048" }}>L&rsquo;Art</span>{" "}
              du Sourire.
            </h1>

            <p
              className="s1-sub mt-6 max-w-md text-base leading-relaxed"
              style={{ color: "rgba(240,234,224,0.78)", textShadow: "0 1px 20px rgba(0,0,0,0.6)" }}
            >
              Hand-sculpted veneers, designed in-house, signed by the master.
              No outsourced labs, no rotating clinicians.
            </p>

            <div className="s1-cta mt-8 flex flex-col sm:flex-row flex-wrap gap-4 pointer-events-auto">
              <a
                href="#contact"
                className="group relative flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-[0.22em] uppercase overflow-hidden transition-all duration-300"
                style={{ backgroundColor: "#C9A048", color: "#0C0B09" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#D9B25C";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#C9A048";
                }}
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
                className="flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-[0.22em] uppercase transition-all duration-300"
                style={{
                  border:          "1px solid rgba(201,160,72,0.35)",
                  color:           "#F0EAE0",
                  backgroundColor: "rgba(12,11,9,0.45)",
                  backdropFilter:  "blur(8px)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,72,0.7)";
                  (e.currentTarget as HTMLElement).style.color       = "#C9A048";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,72,0.35)";
                  (e.currentTarget as HTMLElement).style.color       = "#F0EAE0";
                }}
              >
                <Phone size={13} />
                <span>{company.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── z-10 — Persistent UI: chapter indicators, side rail, scroll cue ── */}

        {/* Top-left chapter indicator with pulsing dot */}
        <div className="s1-meta absolute top-6 left-6 lg:top-10 lg:left-12 z-[10] flex items-center gap-3">
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
            I &mdash; The Opening
          </span>
        </div>

        {/* Top-right cabinet name */}
        <div className="s1-meta absolute top-6 right-6 lg:top-10 lg:right-16 z-[10] text-right">
          <div
            className="font-data text-[10px] tracking-[0.45em] uppercase mb-1"
            style={{ color: "rgba(201,160,72,0.7)" }}
          >
            {company.name}
          </div>
          <div
            className="font-data text-[9px] tracking-[0.32em] uppercase"
            style={{ color: "rgba(216,210,200,0.4)" }}
          >
            {company.zone}
          </div>
        </div>

        {/* Right-side scroll progress rail */}
        <div className="s1-rail absolute right-6 lg:right-10 top-32 bottom-32 z-[10] flex flex-col items-center gap-3">
          <span
            className="font-data text-[8px] tracking-[0.4em] uppercase"
            style={{ color: "rgba(201,160,72,0.55)" }}
          >
            01
          </span>
          <div
            className="flex-1 w-px relative"
            style={{ backgroundColor: "rgba(201,160,72,0.12)" }}
          >
            <div
              className="s1-rail-grow absolute top-0 left-0 w-px h-full"
              style={{ backgroundColor: "#C9A048" }}
            />
          </div>
          <span
            className="font-data text-[8px] tracking-[0.4em] uppercase"
            style={{ color: "rgba(201,160,72,0.25)" }}
          >
            05
          </span>
        </div>

        {/* Bottom scroll cue — only visible deep into Beat 3 */}
        <div className="s1-cue absolute bottom-6 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center gap-2.5 pointer-events-none">
          <span
            className="font-data text-[9px] tracking-[0.45em] uppercase"
            style={{ color: "rgba(201,160,72,0.5)" }}
          >
            Continue
          </span>
          <div style={{ position: "relative", width: "1px", height: "44px", overflow: "hidden" }}>
            <div
              style={{
                position:   "absolute",
                top: 0, left: 0,
                width:      "1px",
                height:     "100%",
                background: "linear-gradient(to bottom, #C9A048, rgba(201,160,72,0.1))",
                animation:  "hero-scroll-beam 2.4s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
