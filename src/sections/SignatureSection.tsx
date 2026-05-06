"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { STATS, CERTIFS } from "@/lib/constants";
import CharText from "@/components/shared/CharText";
import type { CompanyData } from "@/lib/types";

/**
 * "Our Signature" — combines what HVAC kept as separate Stats + Trust
 * sections. Three movements, one section:
 *
 *   1. By the numbers — animated stat counters on scroll
 *   2. By the hand    — recognitions / certifications strip
 *   3. By the voice   — three patient testimonials in atelier voice
 *
 * The merge is intentional: in the dental atelier DA, social proof reads
 * as a single impression — "this practice signs its work" — rather than
 * as fragmented brag panels.
 *
 * Counters animate via gsap proxy objects (object.val 0 → target) with
 * an onUpdate that writes Math.round() into the span. ScrollTrigger.once
 * so re-entering the section doesn't restart the count.
 */

const VOICES = [
  {
    quote:     "I'd put off cosmetic work for fifteen years. The consultation alone changed my mind — they took an hour with me before mentioning a single procedure.",
    name:      "Margaret L.",
    treatment: "Porcelain Veneers · 2024",
  },
  {
    quote:     "What sold me was that they redesigned my entire treatment plan when I asked one question. Most clinics would have stuck to the original sale.",
    name:      "David R.",
    treatment: "Implant Restoration · 2024",
  },
  {
    quote:     "The atmosphere is the first surprise. The result is the second.",
    name:      "Émilie K.",
    treatment: "Smile Design · 2025",
  },
];

export default function SignatureSection({ company }: { company: CompanyData }) {
  const sectionRef  = useRef<HTMLElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.set(".sig-eyebrow",  { opacity: 0, y: 20 });
      gsap.set(".sig-lede",     { opacity: 0, y: 20 });
      gsap.set(".char-reveal",  { y: "115%", opacity: 0 });
      gsap.set(".sig-stat",     { opacity: 0, y: 30 });
      gsap.set(".sig-cert-row", { opacity: 0, y: 20 });
      gsap.set(".sig-voice",    { opacity: 0, y: 40 });
      gsap.set(".sig-divider",  { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".sig-sign",     { opacity: 0 });

      /* Header — eyebrow → char cascade → lede */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 82%",
        once:    true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".sig-eyebrow", { opacity: 1, y: 0, duration: 0.6 }, 0)
            .to(".char-reveal", { y: "0%", opacity: 1, duration: 0.85, stagger: 0.022 }, 0.15)
            .to(".sig-lede",    { opacity: 1, y: 0, duration: 0.7 }, 0.7);
        },
      });

      /* Stats — counters + reveal */
      ScrollTrigger.create({
        trigger: ".sig-stats-row",
        start:   "top 85%",
        once:    true,
        onEnter: () => {
          gsap.to(".sig-stat", {
            opacity: 1, y: 0,
            duration: 0.8, stagger: 0.1, ease: "power3.out",
          });

          STATS.forEach((stat, i) => {
            const el = counterRefs.current[i];
            if (!el) return;
            const obj = { val: 0 };
            gsap.to(obj, {
              val:      stat.value,
              duration: 1.8,
              ease:     "power2.out",
              delay:    0.2 + i * 0.1,
              onUpdate: () => {
                /* For "5.0" we want one decimal; for the rest, integer */
                el.textContent =
                  stat.suffix === ".0"
                    ? obj.val.toFixed(1).replace(/\.0$/, "")
                    : String(Math.round(obj.val));
              },
            });
          });
        },
      });

      /* Dividers */
      gsap.utils.toArray<HTMLElement>(".sig-divider").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start:   "top 88%",
          once:    true,
          onEnter: () => {
            gsap.to(el, { scaleX: 1, duration: 1.1, ease: "expo.out" });
          },
        });
      });

      /* Certifications */
      ScrollTrigger.create({
        trigger: ".sig-certs",
        start:   "top 88%",
        once:    true,
        onEnter: () => {
          gsap.to(".sig-cert-row", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
        },
      });

      /* Voices */
      ScrollTrigger.create({
        trigger: ".sig-voices",
        start:   "top 80%",
        once:    true,
        onEnter: () => {
          gsap.to(".sig-voice", {
            opacity: 1, y: 0,
            duration: 0.9, stagger: 0.15, ease: "power3.out",
          });
        },
      });

      /* Signature line */
      ScrollTrigger.create({
        trigger: ".sig-sign",
        start:   "top 92%",
        once:    true,
        onEnter: () => {
          gsap.to(".sig-sign", { opacity: 1, duration: 1.0, ease: "power2.out" });
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="signature"
      className="relative section-padding overflow-hidden"
      style={{ backgroundColor: "#141210" }}
    >
      {/* Top hairline */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,160,72,0.3), transparent)" }}
      />

      {/* Subtle ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top, rgba(201,160,72,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="mb-16 lg:mb-24 max-w-3xl">
          <div className="sig-eyebrow flex items-center gap-3 mb-6">
            <div className="w-6 h-px" style={{ backgroundColor: "#C9A048" }} />
            <span className="font-data text-[11px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(201,160,72,0.75)" }}>
              Our Signature
            </span>
          </div>
          <h2 className="font-heading text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] font-extrabold mb-6"
            style={{ color: "#D8D2C8" }}>
            <span className="block overflow-hidden" style={{ paddingTop: "0.05em", paddingBottom: "0.08em" }}>
              <CharText text="By the numbers," />
            </span>
            <span className="block overflow-hidden italic" style={{ color: "#C9A048", paddingTop: "0.05em", paddingBottom: "0.12em" }}>
              <CharText text="by the hand." />
            </span>
          </h2>
          <p className="sig-lede text-base leading-relaxed max-w-xl"
            style={{ color: "rgba(216,210,200,0.45)" }}>
            Every result is recorded, reviewed, and signed.
            What follows is not advertising — it is the audit trail.
          </p>
        </div>

        {/* ── Stats band ────────────────────────────────────────── */}
        <div className="sig-stats-row grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 mb-16 lg:mb-20">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="sig-stat flex flex-col">
              <div className="flex items-baseline gap-1 mb-3">
                <span
                  ref={(el) => { counterRefs.current[i] = el; }}
                  className="font-heading font-extrabold tracking-tight italic"
                  style={{
                    fontSize:   "clamp(3.5rem, 7vw, 5.5rem)",
                    lineHeight: 1,
                    color:      "#C9A048",
                  }}
                >
                  0
                </span>
                <span className="font-heading font-extrabold italic"
                  style={{
                    fontSize:   "clamp(2rem, 4vw, 3rem)",
                    lineHeight: 1,
                    color:      "#C9A048",
                  }}>
                  {stat.suffix}
                </span>
              </div>
              <span className="font-data text-[10px] tracking-[0.3em] uppercase"
                style={{ color: "rgba(216,210,200,0.4)" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Divider ───────────────────────────────────────────── */}
        <div className="sig-divider w-full h-px mb-16 lg:mb-20"
          style={{ backgroundColor: "rgba(201,160,72,0.12)" }} />

        {/* ── Certifications ────────────────────────────────────── */}
        <div className="sig-certs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 lg:mb-20">
          <div className="lg:col-span-4">
            <p className="font-data text-[10px] tracking-[0.3em] uppercase mb-2"
              style={{ color: "rgba(201,160,72,0.7)" }}>
              Membership & Recognition
            </p>
            <p className="text-sm leading-relaxed"
              style={{ color: "rgba(216,210,200,0.4)" }}>
              Active credentials with the bodies that audit American cosmetic dentistry.
            </p>
          </div>
          <div className="sig-cert-row lg:col-span-8 flex flex-wrap gap-3">
            {CERTIFS.map((c) => (
              <span
                key={c}
                className="font-heading text-base font-bold tracking-[0.2em] uppercase px-5 py-3 transition-all duration-300"
                style={{
                  border:          "1px solid rgba(201,160,72,0.2)",
                  color:           "rgba(201,160,72,0.7)",
                  backgroundColor: "rgba(201,160,72,0.025)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor     = "rgba(201,160,72,0.5)";
                  el.style.color           = "#C9A048";
                  el.style.backgroundColor = "rgba(201,160,72,0.06)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor     = "rgba(201,160,72,0.2)";
                  el.style.color           = "rgba(201,160,72,0.7)";
                  el.style.backgroundColor = "rgba(201,160,72,0.025)";
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* ── Divider ───────────────────────────────────────────── */}
        <div className="sig-divider w-full h-px mb-16 lg:mb-20"
          style={{ backgroundColor: "rgba(201,160,72,0.12)" }} />

        {/* ── Voices ────────────────────────────────────────────── */}
        <div className="sig-voices">
          <p className="font-data text-[10px] tracking-[0.3em] uppercase mb-10"
            style={{ color: "rgba(201,160,72,0.7)" }}>
            In Their Own Words
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {VOICES.map((v) => (
              <figure
                key={v.name}
                className="sig-voice relative pl-6 pt-2"
              >
                {/* Gold quote stroke */}
                <div className="absolute left-0 top-0 bottom-0 w-px"
                  style={{ background: "linear-gradient(to bottom, #C9A048 0%, rgba(201,160,72,0.1) 100%)" }} />
                <span className="absolute left-0 -top-3 font-heading text-3xl font-extrabold leading-none italic"
                  style={{ color: "#C9A048" }}>
                  &ldquo;
                </span>

                <blockquote className="font-heading italic text-lg leading-snug mb-7"
                  style={{ color: "#D8D2C8", textTransform: "none", letterSpacing: "-0.005em" }}>
                  {v.quote}
                </blockquote>

                <figcaption>
                  <p className="font-data text-xs tracking-wider mb-1"
                    style={{ color: "#C9A048" }}>
                    {v.name}
                  </p>
                  <p className="font-data text-[10px] tracking-[0.25em] uppercase"
                    style={{ color: "rgba(216,210,200,0.35)" }}>
                    {v.treatment}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* ── Signature line ────────────────────────────────────── */}
        <div className="sig-sign mt-20 lg:mt-24 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-px" style={{ backgroundColor: "rgba(201,160,72,0.3)" }} />
            <span style={{ color: "#C9A048", fontSize: "0.7rem" }}>◆</span>
            <div className="w-10 h-px" style={{ backgroundColor: "rgba(201,160,72,0.3)" }} />
          </div>
          <p className="font-heading italic text-base mb-1"
            style={{ color: "rgba(216,210,200,0.55)", textTransform: "none", letterSpacing: 0 }}>
            Every chart signed personally — never delegated.
          </p>
          <p className="font-data text-[10px] tracking-[0.32em] uppercase"
            style={{ color: "rgba(216,210,200,0.3)" }}>
            {company.name}
          </p>
        </div>
      </div>
    </section>
  );
}
