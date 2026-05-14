"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

/**
 * Interstitial moment — full-bleed typographic break.
 *
 * Four short staccato lines, italic display serif, massive. Each
 * line fades up with a stagger as the section enters the viewport.
 * No chapter number, no nav anchor — this is *breath* between two
 * dense chapters (Ledger and Team).
 *
 * The lines reads like a manifesto in fragments: materials, optics,
 * principle. Reads in under three seconds, lands hard.
 */

const LINES = [
  "Lithium disilicate.",
  "Gold leaf.",
  "4.5× Carl Zeiss.",
  "One hand per case.",
];

export default function PullQuoteSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.set(".pq-line", { opacity: 0, y: 36, filter: "blur(6px)" });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 75%",
        once:    true,
        onEnter: () => {
          gsap.to(".pq-line", {
            opacity:  1,
            y:        0,
            filter:   "blur(0px)",
            duration: 1.0,
            stagger:  0.2,
            ease:     "power3.out",
          });
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ backgroundColor: "#0C0B09", overflow: "clip" }}
    >
      {/* Top + bottom hairlines — frame the moment */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,160,72,0.28), transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,160,72,0.28), transparent)" }}
      />

      {/* Soft warm wash from the right */}
      <div
        className="absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(217,178,92,0.08) 0%, transparent 65%)",
          animation:  "breathe-gold 18s ease-in-out infinite",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-28 lg:py-40">
        <div className="space-y-3 lg:space-y-5">
          {LINES.map((line, i) => (
            <p
              key={line}
              className="pq-line font-display italic"
              style={{
                fontSize:      "clamp(2.4rem, 8vw, 7rem)",
                lineHeight:    1.02,
                letterSpacing: "-0.025em",
                color:         i === LINES.length - 1 ? "#C9A048" : "#F0EAE0",
                fontWeight:    400,
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
