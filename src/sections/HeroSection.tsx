"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Phone, ArrowRight } from "lucide-react";
import type { CompanyData } from "@/lib/types";

/**
 * Hero — Scene I "The Opening"
 *
 * Auto-playing cinematic intro on page load (~4.5 seconds). Compressed
 * from an earlier 5.5s version — for cold-outreach prospects with 30s
 * attention spans, 5.5s of intro before they can interact was burning
 * 18% of their available time on chrome. The cinematic feel survives.
 *
 * Three beats, all played automatically via a single GSAP timeline:
 *
 *   BEAT 1  (0.0–1.9 s)  — The whisper
 *     Black canvas. "We don't whiten teeth." fades up in italic, holds,
 *     fades out and is replaced by "We redesign faces." in gold.
 *
 *   BEAT 2  (1.9–3.0 s)  — The curtain
 *     Two solid slabs (top half + bottom half of the viewport) slide
 *     apart from the center — top up, bottom down — like elevator doors
 *     opening on a face. Photo scale settles (1.18 → 1.0); atmospheric
 *     darkening lifts.
 *
 *   BEAT 3  (3.0–4.5 s)  — The composition
 *     "Smile, Composed." masthead appears bottom-left, char by char
 *     with a blur-up reveal. Subtitle + CTAs slide in. Scroll cue
 *     invites the visitor into the next scene.
 *
 * The "Begin Consultation" CTA is magnetic on pointer:fine devices —
 * it attracts the cursor in a 120px radius. Premium signal used by
 * Stripe / Linear / Apple; mobile gets a static button.
 *
 * Why auto-play instead of scrub-on-scroll: forcing the user to scroll
 * to "activate" the page is counter-intuitive — a first-time visitor
 * expects the hero to be complete on arrival.
 */

/** Wraps each character of a string in an inline-block span so GSAP
 *  can stagger them. Spaces become non-breaking spaces so the layout
 *  stays stable while characters animate their y/blur transforms. */
function renderChars(text: string): React.JSX.Element[] {
  return text.split("").map((c, i) => (
    <span
      key={i}
      className="s1-char"
      style={{ display: "inline-block", whiteSpace: "pre" }}
    >
      {c === " " ? " " : c}
    </span>
  ));
}

export default function HeroSection({ company }: { company: CompanyData }) {
  const sectionRef     = useRef<HTMLElement>(null);
  const magneticBtnRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      /* ── Master timeline — auto-plays on mount, ~4.5s total ────────────
       * useGSAP runs as useLayoutEffect → fires synchronously after DOM
       * commit, before first paint. FOUC prevention is handled by the
       * .s1-* classes in globals.css setting opacity:0 / transforms.
       * Position values below are SECONDS.
       * ─────────────────────────────────────────────────────────────── */
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

      /* Persistent UI surfaces immediately */
      tl.to([".s1-meta", ".s1-rail"], { opacity: 1, duration: 0.5, stagger: 0.1 }, 0);
      /* Side rail fills during the entire intro — completion = "ready" */
      tl.to(".s1-rail-grow", { scaleY: 1, duration: 4.2, ease: "none" }, 0.2);

      /* ── BEAT 1 — The whisper ───────────────────────────────────────── */
      tl.fromTo(
        ".s1-line-a",
        { opacity: 0, y: 60, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
        0.1
      );
      tl.to(
        ".s1-line-a",
        { opacity: 0, y: -50, filter: "blur(8px)", duration: 0.5, ease: "power2.in" },
        1.0
      );

      tl.fromTo(
        ".s1-line-b",
        { opacity: 0, y: 60, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out" },
        1.2
      );

      /* ── BEAT 2 — The curtain rises ─────────────────────────────────── */
      /* Slabs slide apart, photo emerges from the center outward */
      tl.to(
        ".s1-veil-top",
        { yPercent: -100, duration: 1.3, ease: "expo.inOut" },
        1.9
      );
      tl.to(
        ".s1-veil-bottom",
        { yPercent: 100, duration: 1.3, ease: "expo.inOut" },
        1.9
      );

      /* Photo settles as the curtain reveals it. Stronger editorial
         colour grade on the final filter (darker, higher contrast,
         touch of sepia — reads more "cinema editorial" than "iPhone
         portrait").

         Scale animation (1.18 → 1.00 zoom-out) is desktop-only. On
         mobile the user reported the combination of the scale tween
         + iOS native scroll + compositor with will-change-transform
         caused visible jitter when they started scrolling during
         the intro. Mobile gets the filter colour-warm-up only — same
         narrative beat, no scale, no jank. */
      const isDesktop = typeof window !== "undefined" &&
                        window.matchMedia("(min-width: 1024px)").matches;

      if (isDesktop) {
        tl.fromTo(
          ".s1-photo",
          { scale: 1.18, filter: "brightness(0.65) contrast(1.18) saturate(0.75)" },
          { scale: 1.00, filter: "brightness(0.94) contrast(1.16) saturate(0.78) sepia(0.06)", duration: 1.8, ease: "power2.out" },
          1.9
        );
      } else {
        tl.fromTo(
          ".s1-photo",
          { filter: "brightness(0.65) contrast(1.18) saturate(0.75)" },
          { filter: "brightness(0.94) contrast(1.16) saturate(0.78) sepia(0.06)", duration: 1.6, ease: "power2.out" },
          1.9
        );
      }

      /* Atmospheric darkening lifts as the reveal progresses */
      tl.fromTo(
        ".s1-atmosphere",
        { opacity: 0.55 },
        { opacity: 0,    duration: 1.5, ease: "power2.out" },
        2.1
      );

      /* Line 2 fades while the photo emerges underneath */
      tl.to(
        ".s1-line-b",
        { opacity: 0, y: -40, filter: "blur(6px)", duration: 0.7, ease: "power2.in" },
        2.2
      );

      /* ── BEAT 3 — The composition settles ─────────────────────────────
       * The masthead reveals char-by-char with a blur-up. Each character
       * is wrapped in a .s1-char span (see JSX below). The container
       * fades to opacity 1 first; then the chars stagger in. */
      tl.to(
        ".s1-masthead",
        { opacity: 1, duration: 0.1 },
        2.9
      );
      tl.fromTo(
        ".s1-masthead .s1-char",
        { opacity: 0, y: 28, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, stagger: 0.038, ease: "power3.out" },
        2.95
      );

      tl.fromTo(
        ".s1-sub",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        3.5
      );

      tl.fromTo(
        ".s1-cta",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: "power2.out" },
        3.75
      );

      tl.fromTo(
        ".s1-cue",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5 },
        4.0
      );

      /* ── Magnetic CTA on "Begin Consultation" ──────────────────────
       * Desktop-only via matchMedia(pointer: fine). The button is pulled
       * toward the cursor in a 120px radius. quickTo gives a smoother
       * animation than gsap.to() inside a high-frequency mousemove
       * handler — it reuses the same tween instance and just updates
       * the target value. */
      const mm = gsap.matchMedia();
      mm.add("(pointer: fine)", () => {
        const btn = magneticBtnRef.current;
        if (!btn) return;

        const RADIUS   = 120;
        const STRENGTH = 0.35;
        const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power2.out" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power2.out" });

        const onMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const cx   = rect.left + rect.width  / 2;
          const cy   = rect.top  + rect.height / 2;
          const dx   = e.clientX - cx;
          const dy   = e.clientY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < RADIUS) {
            const factor = (1 - dist / RADIUS) * STRENGTH;
            xTo(dx * factor);
            yTo(dy * factor);
          } else {
            xTo(0);
            yTo(0);
          }
        };

        document.addEventListener("mousemove", onMove, { passive: true });
        return () => document.removeEventListener("mousemove", onMove);
      });

      /* ── Parallax + breathe — premium production cues ───────────────
       * Both desktop-only via matchMedia. On mobile:
       *   - Parallax compounds the iOS Safari URL-bar-collapse jump
       *     (yPercent calculations get re-evaluated as the section
       *     height changes mid-scroll → visible re-snap).
       *   - The breathe (1.0 → 1.012 scale loop) is too subtle to
       *     notice on a small screen but it still burns CPU/battery
       *     on mobile devices.
       * Gating both behind (min-width: 1024px) eliminates both costs
       * with no perceptible loss of polish on phones. */
      gsap.registerPlugin(ScrollTrigger);

      mm.add("(min-width: 1024px)", () => {
        gsap.to(".s1-photo-inner", {
          yPercent: 14,
          ease:     "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start:   "top top",
            end:     "bottom top",
            scrub:   0.4,
          },
        });

        gsap.to(".s1-photo-inner", {
          scale:    1.012,
          duration: 3.0,
          ease:     "sine.inOut",
          repeat:   -1,
          yoyo:     true,
          yoyoEase: "sine.inOut",
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#0C0B09",
        /* svh = small viewport height — stays stable on iOS Safari when
           the URL bar collapses on scroll. Plain 100vh would cause the
           whole hero to re-layout mid-scroll (the "jump" the user
           reported on mobile). Fallback to 100vh on older browsers
           that don't support svh. */
        height: "100svh",
        minHeight: "100svh",
      }}
    >
      <div className="relative w-full h-full">
        {/* ── z-1 — Portrait (always at full opacity, scale animated) ─────
         * Editorial portrait with a visible smile — the curtain reveals a
         * FACE, and a SMILE is what a cosmetic atelier transforms. Stock
         * dental closeups (teeth, x-rays, tools) read as "clinic" and
         * undermine the atelier register; the smile here is the category
         * cue without sacrificing the editorial frame. */}
        {/* will-change-transform gated to lg+. On mobile there's no
            transform on this layer (scale + parallax + breathe are all
            desktop-only) so promoting it to its own compositor layer
            is wasted memory and a documented source of iOS Safari
            scroll jank. */}
        <div className="s1-photo absolute inset-0 z-[1] lg:will-change-transform">
          {/* Inner wrapper hosts the parallax (yPercent on scroll) + the
              infinite breathe (scale yoyo) — both desktop-only. Outer
              .s1-photo handles the intro filter warm-up (+ scale on
              desktop). Separate transform layers prevent GSAP tweens
              from clobbering each other. */}
          <div className="s1-photo-inner absolute inset-0 lg:will-change-transform">
            <Image
              src="/images/dental/portrait-after.png"
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
              style={{ objectPosition: "center 30%" }}
            />
          </div>
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
                /* Layered shadow: tight one for edge against the warm
                   photo, wider halo for depth. Single soft shadow on a
                   busy background reads muddy. */
                textShadow:
                  "0 0 1px rgba(0,0,0,0.95), " +
                  "0 1px 3px rgba(0,0,0,0.9), " +
                  "0 3px 22px rgba(0,0,0,0.75), " +
                  "0 8px 60px rgba(0,0,0,0.55)",
              }}
            >
              {/* Each character wrapped so the intro timeline can blur-up
                  stagger them one by one. Spaces use &nbsp; so they keep
                  their width during the y/blur animation. */}
              <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                {renderChars("Smile,")}
              </span>
              <span className="s1-char" style={{ display: "inline-block", width: "0.3em" }} />
              <span style={{ display: "inline-block", whiteSpace: "nowrap", fontStyle: "italic", color: "#D9B25C" }}>
                {renderChars("Composed.")}
              </span>
            </h1>

            <p
              className="s1-sub mt-6 max-w-md text-base leading-relaxed"
              style={{ color: "rgba(240,234,224,0.78)", textShadow: "0 1px 20px rgba(0,0,0,0.6)" }}
            >
              Hand-sculpted veneers, designed in-house, finished by the practitioner
              who owns your case. No outsourced labs, no rotating chairs.
            </p>

            <div className="s1-cta mt-8 flex flex-col sm:flex-row flex-wrap gap-4 pointer-events-auto">
              <a
                ref={magneticBtnRef}
                href="#contact"
                className="group relative flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-[0.22em] uppercase overflow-hidden transition-colors duration-300 will-change-transform"
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

        {/* ── z-10 — Persistent UI: chapter indicator, side rail, scroll cue ──
         * The cabinet name is shown by the Navbar — never duplicated here.
         * Chapter indicator is offset below the navbar (top-24 / lg:top-28)
         * so it doesn't collide with the navbar logo + nav links above it.
         */}

        {/* Chapter indicator with pulsing dot — below navbar, left side.
            Multi-layered text-shadow so it survives against the warm
            photo background. Dot gets a small gold glow for the same
            reason. */}
        <div className="s1-meta absolute top-24 left-6 lg:top-28 lg:left-12 z-[10] flex items-center gap-3">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: "#C9A048",
              animation:       "caret-pulse 1.8s ease-in-out infinite",
              boxShadow:       "0 0 8px rgba(201,160,72,0.7)",
            }}
          />
          <span
            className="font-data text-[10px] tracking-[0.45em] uppercase"
            style={{
              color:      "rgba(240,234,224,0.95)",
              textShadow:
                "0 0 1px rgba(0,0,0,0.95), " +
                "0 1px 3px rgba(0,0,0,0.85), " +
                "0 2px 14px rgba(0,0,0,0.7)",
            }}
          >
            I &mdash; The Opening
          </span>
        </div>

        {/* Right-side scroll progress rail — below navbar.
            Rail labels get the same shadow treatment as the chapter
            indicator so the 01/05 are readable over the photo. */}
        <div className="s1-rail absolute right-6 lg:right-10 top-40 bottom-32 z-[10] flex flex-col items-center gap-3">
          <span
            className="font-data text-[8px] tracking-[0.4em] uppercase"
            style={{
              color:      "rgba(201,160,72,0.85)",
              textShadow: "0 0 1px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.7)",
            }}
          >
            01
          </span>
          <div
            className="flex-1 w-px relative"
            style={{ backgroundColor: "rgba(201,160,72,0.22)" }}
          >
            <div
              className="s1-rail-grow absolute top-0 left-0 w-px h-full"
              style={{ backgroundColor: "#C9A048", boxShadow: "0 0 6px rgba(201,160,72,0.5)" }}
            />
          </div>
          <span
            className="font-data text-[8px] tracking-[0.4em] uppercase"
            style={{
              color:      "rgba(201,160,72,0.5)",
              textShadow: "0 0 1px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.6)",
            }}
          >
            05
          </span>
        </div>

        {/* Bottom scroll cue — only visible deep into Beat 3 */}
        <div className="s1-cue absolute bottom-6 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center gap-2.5 pointer-events-none">
          <span
            className="font-data text-[9px] tracking-[0.45em] uppercase"
            style={{
              color:      "rgba(201,160,72,0.85)",
              textShadow: "0 0 1px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.7)",
            }}
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
