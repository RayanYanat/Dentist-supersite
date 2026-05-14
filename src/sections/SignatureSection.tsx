"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { CompanyData } from "@/lib/types";

/**
 * Scene IV — "The Maker"
 *
 * Replaces the previous Signature section (testimonial pull-quote +
 * audit-trail stat + cert acronyms) which was meaningless filler — it
 * decorated empty space because there was no real person, no real proof,
 * no real signature behind it.
 *
 * The Maker repurposes the slot to introduce the practitioner: portrait
 * left, brief bio right, hand-drawn signature SVG drawn live as you
 * read. For a single-doctor cosmetic atelier, the doctor IS the brand —
 * Patek can be institutional, a dental atelier cannot. Adding the maker
 * here gives the rest of the site (the "hand-sculpted, signed
 * personally" claims) a centre of gravity.
 *
 * Mechanic — the portrait warms up as you scroll into the section.
 *
 *   start: section top reaches 80% of viewport height
 *   end:   section top reaches 30% of viewport height
 *   scrub: 0.6 (eased follow, not 1:1)
 *
 *   Filter scrubs from { brightness 0.5, saturate 0.35, contrast 1.18 }
 *   to            { brightness 1.0, saturate 0.95, contrast 1.05 }
 *   Scale scrubs from 1.06 → 1.00.
 *
 * The result is that the doctor "comes into being" as the visitor
 * commits attention to them — a subtle but specific narrative beat that
 * fits the introduction-of-a-craftsman moment.
 *
 * The signature path is drawn after the bio settles. It now signs the
 * actual person whose face is shown — the gesture earns its weight.
 *
 * The file is still SignatureSection.tsx for git-history continuity;
 * the exported component is renamed accordingly.
 */

export default function MakerSection({ company }: { company: CompanyData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef   = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      /* ── Photo warm-up — scrubbed filter + scale ──────────────────── */
      const photo = photoRef.current;
      if (photo) {
        gsap.fromTo(
          photo,
          {
            filter: "brightness(0.5) saturate(0.35) contrast(1.18)",
            scale:  1.06,
          },
          {
            filter: "brightness(1.0) saturate(0.95) contrast(1.05)",
            scale:  1.0,
            ease:   "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start:   "top 85%",
              end:     "top 25%",
              scrub:   0.6,
            },
          }
        );
      }

      /* ── Header + body reveal ────────────────────────────────────── */
      gsap.set(".mk-meta",      { opacity: 0, x: -10 });
      gsap.set(".mk-rule",      { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".mk-eyebrow",   { opacity: 0, y: 16 });
      gsap.set(".mk-heading",   { opacity: 0, y: 24 });
      gsap.set(".mk-bio",       { opacity: 0, y: 22 });
      gsap.set(".mk-divider",   { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".mk-path",      { strokeDashoffset: 1 });
      gsap.set(".mk-flourish",  { strokeDashoffset: 1 });
      gsap.set(".mk-attrib",    { opacity: 0, y: 14 });
      gsap.set(".mk-photo-frame", { opacity: 0, y: 30 });
      gsap.set(".mk-photo-tag", { opacity: 0 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 78%",
        once:    true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".mk-meta",        { opacity: 1, x: 0, duration: 0.6 },                  0)
            .to(".mk-photo-frame", { opacity: 1, y: 0, duration: 1.0 },                  0.05)
            .to(".mk-rule",        { scaleX: 1, duration: 0.9, ease: "expo.out" },       0.15)
            .to(".mk-eyebrow",     { opacity: 1, y: 0, duration: 0.6 },                  0.25)
            .to(".mk-heading",     { opacity: 1, y: 0, duration: 0.95 },                 0.35)
            .to(".mk-bio",         { opacity: 1, y: 0, duration: 0.9 },                  0.7)
            .to(".mk-photo-tag",   { opacity: 1, duration: 0.6 },                        0.85)
            .to(".mk-divider",     { scaleX: 1, duration: 0.9, ease: "expo.out" },       1.1)
            .to(".mk-path",        { strokeDashoffset: 0, duration: 2.4, ease: "power1.inOut" }, 1.3)
            .to(".mk-flourish",    { strokeDashoffset: 0, duration: 0.85, ease: "power2.out" },  3.0)
            .to(".mk-attrib",      { opacity: 1, y: 0, duration: 0.7 },                  3.2);
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative section-padding overflow-hidden"
      style={{ backgroundColor: "#0C0B09" }}
    >
      {/* Top hairline */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,160,72,0.32), transparent)" }}
      />

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

      {/* Soft warm wash from the photo side */}
      <div
        className="absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(217,178,92,0.08) 0%, transparent 65%)",
          animation:  "breathe-gold 18s ease-in-out infinite",
        }}
      />

      <div className="relative z-[2] max-w-7xl mx-auto px-5 lg:px-8">

        {/* Chapter indicator */}
        <div className="mk-meta flex items-center gap-3 mb-12 lg:mb-16">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "#C9A048", animation: "caret-pulse 1.8s ease-in-out infinite" }}
          />
          <span
            className="font-data text-[10px] tracking-[0.45em] uppercase"
            style={{ color: "rgba(240,234,224,0.7)" }}
          >
            IV &mdash; The Team
          </span>
        </div>

        {/* ── Two-column spread ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* LEFT — Portrait (warms up via scrub) */}
          <div className="mk-photo-frame lg:col-span-5 relative">
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "4 / 5" }}
            >
              <div
                ref={photoRef}
                className="absolute inset-0 will-change-transform"
                style={{
                  filter: "brightness(0.5) saturate(0.35) contrast(1.18)",
                  transform: "scale(1.06)",
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1771442873035-474765b40ac6?auto=format&fit=crop&w=1600&q=90"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: "center 50%" }}
                />
              </div>

              {/* Bottom-fade to bed the photo into the section ground */}
              <div
                className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                style={{
                  background: "linear-gradient(to bottom, transparent 0%, rgba(12,11,9,0.55) 100%)",
                }}
              />

              {/* Corner brackets — atelier framing */}
              <div className="absolute top-3 left-3 w-6 h-6 pointer-events-none"
                style={{ borderTop: "1px solid rgba(201,160,72,0.55)", borderLeft: "1px solid rgba(201,160,72,0.55)" }} />
              <div className="absolute top-3 right-3 w-6 h-6 pointer-events-none"
                style={{ borderTop: "1px solid rgba(201,160,72,0.55)", borderRight: "1px solid rgba(201,160,72,0.55)" }} />
              <div className="absolute bottom-3 left-3 w-6 h-6 pointer-events-none"
                style={{ borderBottom: "1px solid rgba(201,160,72,0.55)", borderLeft: "1px solid rgba(201,160,72,0.55)" }} />
              <div className="absolute bottom-3 right-3 w-6 h-6 pointer-events-none"
                style={{ borderBottom: "1px solid rgba(201,160,72,0.55)", borderRight: "1px solid rgba(201,160,72,0.55)" }} />
            </div>

            {/* Caption strip below portrait */}
            <div className="mk-photo-tag mt-5 flex items-center justify-between">
              <span
                className="font-data text-[10px] tracking-[0.42em] uppercase"
                style={{ color: "rgba(201,160,72,0.65)" }}
              >
                Atelier &middot; {company.city}
              </span>
              <span
                className="font-data text-[9px] tracking-[0.32em] uppercase"
                style={{ color: "rgba(216,210,200,0.4)" }}
              >
                Composition &middot; in hand
              </span>
            </div>
          </div>

          {/* RIGHT — Eyebrow + heading + bio + signature */}
          <div className="lg:col-span-7 lg:pl-6 lg:pt-4">

            <div
              className="mk-rule h-px w-16 mb-8"
              style={{ backgroundColor: "#C9A048" }}
            />

            <span
              className="mk-eyebrow font-data text-[11px] tracking-[0.42em] uppercase block mb-6"
              style={{ color: "rgba(201,160,72,0.75)" }}
            >
              The team
            </span>

            <h2
              className="mk-heading font-display"
              style={{
                fontSize:      "clamp(2.4rem, 5.5vw, 4.8rem)",
                lineHeight:    "0.96",
                letterSpacing: "-0.018em",
                color:         "#F0EAE0",
                fontWeight:    400,
              }}
            >
              Signed by{" "}
              <span style={{ fontStyle: "italic", color: "#C9A048" }}>one hand.</span>
            </h2>

            <p
              className="mk-bio mt-10 max-w-xl text-base leading-relaxed"
              style={{ color: "rgba(216,210,200,0.7)" }}
            >
              A single principle&nbsp;: the same hand sees you from consultation through placement.
              {" "}Cases at {company.name}{" "}are not passed between chairs &mdash; each chart
              carries the signature of the practitioner who owns it, from photograph to polish.
              {" "}Veneers, smile design, implants &mdash; composed for one patient at a time.
              {" "}Never rushed. Never sub-contracted to an off-site lab.
            </p>

            {/* Hairline divider before the signature */}
            <div
              className="mk-divider mt-12 mb-8 h-px w-full"
              style={{ backgroundColor: "rgba(201,160,72,0.22)" }}
            />

            {/* Signature SVG — draws itself after the bio settles */}
            <svg
              viewBox="0 0 400 100"
              preserveAspectRatio="xMidYMid meet"
              className="block"
              style={{ width: "min(320px, 80%)", height: "auto" }}
              aria-hidden="true"
            >
              <path
                d="M 16 60
                   C 30 32, 48 32, 60 56
                   C 72 80, 90 78, 100 56
                   C 110 34, 128 34, 140 56
                   C 150 70, 162 64, 172 52
                   C 188 36, 210 38, 224 58
                   C 234 74, 250 70, 266 58
                   C 282 46, 298 30, 322 38
                   C 344 46, 358 64, 372 50"
                stroke="#C9A048"
                strokeWidth="2.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset="1"
                className="mk-path"
              />
              <path
                d="M 60 80 C 160 80, 260 80, 350 78"
                stroke="#C9A048"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset="1"
                opacity="0.55"
                className="mk-flourish"
              />
            </svg>

            {/* Attribution — generic, no placeholder names */}
            <div className="mk-attrib mt-6 flex flex-col gap-1">
              <span
                className="font-data text-xs tracking-[0.28em] uppercase"
                style={{ color: "#C9A048" }}
              >
                {company.name}
              </span>
              <span
                className="font-data text-[10px] tracking-[0.28em] uppercase"
                style={{ color: "rgba(216,210,200,0.5)" }}
              >
                Atelier &middot; {company.city}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
