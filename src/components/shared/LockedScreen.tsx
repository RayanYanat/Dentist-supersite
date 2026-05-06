"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * Shown at "/" when a visitor lands on the bare domain without a slug
 * (e.g. they've stripped the URL out of curiosity). Communicates that the
 * link is personalized — without exposing the underlying template.
 *
 * Animation sequence (~2.2s total):
 *   1. Corner brackets fade in, staggered
 *   2. "By Invitation" badge slides up
 *   3. Diamond brand mark pops in (back.out overshoot)
 *   4. "PRIVATE" scans in left → right via clip-path
 *   5. "ATELIER" scans in (slightly offset)
 *   6. Divider draws left → right
 *   7. Subtitle lines fade up
 *   8. Data strip fades in
 *
 * Initial states are mirrored in globals.css (.ls-*) so the SSR HTML is
 * already invisible — no flash before the JS bundle hydrates.
 */
export default function LockedScreen() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    /* Reinforce hidden state — useGSAP runs in useLayoutEffect, so this
       fires synchronously before the browser paints the first frame. */
    gsap.set(".ls-bracket", { opacity: 0 });
    gsap.set(".ls-badge",   { opacity: 0, y: 14 });
    gsap.set(".ls-mark",    { opacity: 0, scale: 0.65 });
    gsap.set(".ls-divider", { scaleX: 0 });
    gsap.set(".ls-sub",     { opacity: 0, y: 14 });
    gsap.set(".ls-strip",   { opacity: 0 });
    /* Titles: visible but fully clipped from the right — scan reveal */
    gsap.set(".ls-title-1", { opacity: 1, clipPath: "inset(0% 100% 0% 0%)" });
    gsap.set(".ls-title-2", { opacity: 1, clipPath: "inset(0% 100% 0% 0%)" });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(".ls-bracket", { opacity: 1, duration: 1.1, stagger: 0.09 })
      .to(".ls-badge",   { opacity: 1, y: 0, duration: 0.55 }, "-=0.75")
      .to(".ls-mark",    { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.5)" }, "-=0.25")
      .to(".ls-title-1", { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power4.out" }, "-=0.05")
      .to(".ls-title-2", { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power4.out" }, "-=0.62")
      .to(".ls-divider", { scaleX: 1, duration: 0.9, ease: "expo.out" }, "-=0.4")
      .to(".ls-sub",     { opacity: 1, y: 0, duration: 0.65, stagger: 0.12 }, "-=0.45")
      .to(".ls-strip",   { opacity: 1, duration: 0.55 }, "-=0.25");
  }, { scope: ref });

  return (
    <div
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#0C0B09" }}
    >
      {/* ── Atelier grid — gold, very subtle ─────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,160,72,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,160,72,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* ── Ambient gold glows ──────────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 w-[700px] h-[550px] pointer-events-none"
        style={{
          background:    "radial-gradient(ellipse at top left, rgba(201,160,72,0.10) 0%, transparent 60%)",
          animation:     "breathe-gold 9s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[500px] pointer-events-none"
        style={{
          background:     "radial-gradient(ellipse at bottom right, rgba(240,234,224,0.06) 0%, transparent 60%)",
          animation:      "breathe-gold 12s ease-in-out infinite reverse",
          animationDelay: "3s",
        }}
      />

      {/* ── Corner brackets ─────────────────────────────────────────── */}
      <div className="absolute inset-7 pointer-events-none">
        <div
          className="ls-bracket absolute top-0 left-0 w-12 h-12"
          style={{
            borderTop:  "1px solid rgba(201,160,72,0.45)",
            borderLeft: "1px solid rgba(201,160,72,0.45)",
          }}
        />
        <div
          className="ls-bracket absolute top-0 right-0 w-12 h-12"
          style={{
            borderTop:   "1px solid rgba(201,160,72,0.45)",
            borderRight: "1px solid rgba(201,160,72,0.45)",
          }}
        />
        <div
          className="ls-bracket absolute bottom-0 left-0 w-12 h-12"
          style={{
            borderBottom: "1px solid rgba(201,160,72,0.45)",
            borderLeft:   "1px solid rgba(201,160,72,0.45)",
          }}
        />
        <div
          className="ls-bracket absolute bottom-0 right-0 w-12 h-12"
          style={{
            borderBottom: "1px solid rgba(201,160,72,0.45)",
            borderRight:  "1px solid rgba(201,160,72,0.45)",
          }}
        />
      </div>

      {/* ── Decorative center scan line ──────────────────────────────── */}
      <div
        className="absolute left-7 right-7 pointer-events-none"
        style={{
          top:        "50%",
          height:     "1px",
          background: "linear-gradient(to right, transparent, rgba(201,160,72,0.07) 20%, rgba(201,160,72,0.07) 80%, transparent)",
        }}
      />

      {/* ── Central content ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">

        {/* Pulse badge */}
        <div className="ls-badge flex items-center gap-2.5 mb-10">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
              style={{ backgroundColor: "#C9A048" }} />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#C9A048" }} />
          </span>
          <span
            className="font-data text-[10px] tracking-[0.32em] uppercase"
            style={{ color: "rgba(201,160,72,0.55)" }}
          >
            By Invitation Only
          </span>
        </div>

        {/* Brand mark — atelier diamond */}
        <div className="ls-mark mb-7">
          <span
            className="font-heading font-extrabold leading-none"
            style={{
              fontSize:   "3rem",
              color:      "#C9A048",
              textShadow: "0 0 60px rgba(201,160,72,0.5), 0 0 120px rgba(201,160,72,0.2)",
            }}
          >
            ◆
          </span>
        </div>

        {/* Title — scan-reveal */}
        <div className="overflow-x-hidden">
          <h1
            className="ls-title-1 font-heading font-extrabold"
            style={{
              fontSize:   "clamp(3rem,9.5vw,8.5rem)",
              lineHeight: 0.9,
              color:      "#D8D2C8",
            }}
          >
            PRIVATE
          </h1>
        </div>
        <div className="overflow-x-hidden mb-9">
          <h1
            className="ls-title-2 font-heading font-extrabold italic"
            style={{
              fontSize:   "clamp(3rem,9.5vw,8.5rem)",
              lineHeight: 0.9,
              color:      "#C9A048",
              textShadow: "0 0 40px rgba(201,160,72,0.35)",
            }}
          >
            ATELIER
          </h1>
        </div>

        {/* Divider */}
        <div
          className="ls-divider w-14 h-px origin-left mb-9"
          style={{ backgroundColor: "#C9A048" }}
        />

        {/* Subtitle */}
        <p
          className="ls-sub text-sm leading-relaxed mb-2"
          style={{ color: "rgba(216,210,200,0.45)", maxWidth: "28rem" }}
        >
          This URL is configured for a single recipient.
        </p>
        <p
          className="ls-sub text-sm leading-relaxed"
          style={{ color: "rgba(216,210,200,0.45)", maxWidth: "28rem" }}
        >
          Please use the personalized link that was sent to you.
        </p>

        {/* Data strip */}
        <div className="ls-strip mt-14 flex items-center gap-4">
          <div className="w-8 h-px" style={{ backgroundColor: "rgba(201,160,72,0.2)" }} />
          <span
            className="font-data text-[9px] tracking-[0.3em] uppercase"
            style={{ color: "rgba(216,210,200,0.35)" }}
          >
            Crafted Privately · By Appointment
          </span>
          <div className="w-8 h-px" style={{ backgroundColor: "rgba(201,160,72,0.2)" }} />
        </div>
      </div>
    </div>
  );
}
