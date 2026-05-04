"use client";
import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Phone, ArrowRight } from "lucide-react";
import { CABINET } from "@/lib/constants";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1Ref    = useRef<HTMLDivElement>(null);
  const layer2Ref    = useRef<HTMLDivElement>(null);
  const layer3Ref    = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  /* ── Entrance animation ─────────────────────────────────────────── */
  useGSAP(
    () => {
      gsap.set(".hero-eyebrow",  { y: 20, opacity: 0 });
      gsap.set(".hero-title-1",  { y: 90, opacity: 0 });
      gsap.set(".hero-title-2",  { y: 90, opacity: 0 });
      gsap.set(".hero-title-3",  { y: 40, opacity: 0 });
      gsap.set(".hero-divider",  { scaleX: 0 });
      gsap.set(".hero-sub",      { y: 20, opacity: 0 });
      gsap.set(".hero-cta",      { y: 20, opacity: 0 });
      gsap.set(".hero-scroll",   { opacity: 0 });
      gsap.set(".hero-stats",    { y: 20, opacity: 0 });
      gsap.set(".hero-frame",    { opacity: 0, scale: 0.96 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".hero-frame",    { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" })
        .to(".hero-eyebrow",  { y: 0, opacity: 1, duration: 0.6 }, "-=0.8")
        .to(".hero-title-1",  { y: 0, opacity: 1, duration: 1.1 }, "-=0.3")
        .to(".hero-title-2",  { y: 0, opacity: 1, duration: 1.1 }, "-=0.8")
        .to(".hero-title-3",  { y: 0, opacity: 1, duration: 0.7 }, "-=0.65")
        .to(".hero-divider",  { scaleX: 1, duration: 1.1, ease: "expo.out" }, "-=0.5")
        .to(".hero-sub",      { y: 0, opacity: 1, duration: 0.6 }, "-=0.5")
        .to(".hero-cta",      { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 }, "-=0.3")
        .to(".hero-scroll",   { opacity: 1, duration: 0.8 }, "-=0.2")
        .to(".hero-stats",    { y: 0, opacity: 1, duration: 0.6 }, "-=0.6");
    },
    { scope: containerRef }
  );

  /* ── Mouse parallax ─────────────────────────────────────────────── */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      gsap.to(layer1Ref.current, { x: dx * -20, y: dy * -14, duration: 2.2, ease: "power2.out" });
      gsap.to(layer2Ref.current, { x: dx * -10, y: dy * -7,  duration: 2.0, ease: "power2.out" });
      gsap.to(layer3Ref.current, { x: dx * 7,   y: dy * 5,   duration: 1.8, ease: "power2.out" });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ── Spotlight cursor ───────────────────────────────────────────────
   * A warm gold halo follows the mouse over the hero image.
   * The spotlight "illuminates" the smile — the more you explore, the
   * more the image reveals its detail. Pure theater, zero JavaScript cost.
   * ─────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const spotlight = spotlightRef.current;
    if (!spotlight) return;

    const onMove = (e: MouseEvent) => {
      const rect = spotlight.parentElement!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlight.style.background = `radial-gradient(
        600px circle at ${x}px ${y}px,
        rgba(201,160,72,0.13) 0%,
        rgba(240,234,224,0.04) 35%,
        transparent 65%
      )`;
      spotlight.style.opacity = "1";
    };
    const onLeave = () => { spotlight.style.opacity = "0"; };

    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "#0C0B09" }}
    >
      {/* ── Layer 1 : image + grid (deepest) ── */}
      <div ref={layer1Ref} className="absolute inset-0 will-change-transform">
        {/* Hero image — smile photography */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            opacity: 0.18,
          }}
        />
        {/* Atelier grid — gold, very subtle */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(201,160,72,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201,160,72,0.025) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* ── Layer 2 : atmospheric glows ── */}
      <div ref={layer2Ref} className="absolute inset-0 pointer-events-none will-change-transform">
        {/* Central gold glow */}
        <div
          className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(201,160,72,0.18) 0%, rgba(142,110,40,0.07) 40%, transparent 70%)",
            opacity: 0.7,
            animation: "breathe-gold 8s ease-in-out infinite",
          }}
        />
        {/* Pearl accent — top right */}
        <div
          className="absolute top-[-10%] right-[10%] w-[600px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(240,234,224,0.06) 0%, transparent 65%)",
            animation: "breathe-gold 11s ease-in-out infinite 2s",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 40%, rgba(12,11,9,0.88) 100%)",
          }}
        />
        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-48"
          style={{ background: "linear-gradient(to bottom, #0C0B09, transparent)" }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-56"
          style={{ background: "linear-gradient(to top, #0C0B09, transparent)" }} />
      </div>

      {/* ── Spotlight cursor overlay ── */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
        style={{ opacity: 0, mixBlendMode: "screen" }}
      />

      {/* ── Atelier corner frame ── */}
      <div className="absolute inset-6 pointer-events-none z-10 hidden lg:block">
        {[
          { top: 0,    left: 0,    borderTop: true,    borderLeft: true  },
          { top: 0,    right: 0,   borderTop: true,    borderRight: true },
          { bottom: 0, left: 0,    borderBottom: true, borderLeft: true  },
          { bottom: 0, right: 0,   borderBottom: true, borderRight: true },
        ].map((corner, i) => (
          <div
            key={i}
            className="hero-frame absolute w-12 h-12"
            style={{
              ...corner,
              borderTop:    corner.borderTop    ? "1px solid rgba(201,160,72,0.3)" : undefined,
              borderBottom: corner.borderBottom ? "1px solid rgba(201,160,72,0.3)" : undefined,
              borderLeft:   corner.borderLeft   ? "1px solid rgba(201,160,72,0.3)" : undefined,
              borderRight:  corner.borderRight  ? "1px solid rgba(201,160,72,0.3)" : undefined,
            }}
          />
        ))}
      </div>

      {/* ── Layer 3 : content ── */}
      <div
        ref={layer3Ref}
        className="relative z-20 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-5 lg:px-8 pt-28 pb-24 will-change-transform"
      >
        {/* Eyebrow */}
        <div className="hero-eyebrow flex items-center gap-3 mb-10">
          <div className="w-5 h-px" style={{ backgroundColor: "#C9A048" }} />
          <span className="font-data text-[11px] tracking-[0.3em] uppercase"
            style={{ color: "rgba(201,160,72,0.7)" }}>
            {CABINET.doctor} &nbsp;·&nbsp; {CABINET.zone} &nbsp;·&nbsp; [X]+ Years of Excellence
          </span>
        </div>

        {/* Title */}
        <div className="mb-10 overflow-hidden">
          <h1 className="hero-title-1 font-heading text-[clamp(3.8rem,10vw,10rem)] leading-[0.88] font-black"
            style={{ color: "#D8D2C8" }}>
            The Art of the
          </h1>
          <h1 className="hero-title-2 font-heading text-[clamp(3.8rem,10vw,10rem)] leading-[0.88] font-black text-glow-gold"
            style={{ color: "#C9A048" }}>
            Perfect Smile
          </h1>
          <p className="hero-title-3 font-heading text-[clamp(1.4rem,3.8vw,3.8rem)] leading-[1.1] font-bold mt-4"
            style={{ color: "rgba(240,234,224,0.2)", fontStyle: "italic" }}>
            Crafted with precision. Built to last.
          </p>
        </div>

        {/* Divider */}
        <div className="hero-divider w-16 h-px origin-left mb-8"
          style={{ backgroundColor: "#C9A048" }} />

        {/* Sub */}
        <p className="hero-sub max-w-md text-lg leading-relaxed mb-12"
          style={{ color: "rgba(216,210,200,0.42)" }}>
          From porcelain veneers to complete smile makeovers —
          every treatment is designed around{" "}
          <span className="font-medium" style={{ color: "rgba(216,210,200,0.75)" }}>you</span>,
          with the precision of a master craftsman.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-16">
          <a
            href="#contact"
            className="hero-cta group relative flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase overflow-hidden transition-all duration-300"
            style={{ backgroundColor: "#C9A048", color: "#0C0B09" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#8E6E28")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#C9A048")}
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)" }} />
            <span>Book Your Consultation</span>
            <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-200" />
          </a>

          <a
            href={`tel:${CABINET.phone}`}
            className="hero-cta group flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300"
            style={{ border: "1px solid rgba(201,160,72,0.3)", color: "rgba(201,160,72,0.7)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,72,0.7)";
              (e.currentTarget as HTMLElement).style.color = "#C9A048";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,72,0.3)";
              (e.currentTarget as HTMLElement).style.color = "rgba(201,160,72,0.7)";
            }}
          >
            <Phone size={13} />
            <span>{CABINET.phone}</span>
          </a>

          <a
            href="#craft"
            className="hero-cta flex items-center gap-2.5 px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300"
            style={{ color: "rgba(216,210,200,0.28)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(216,210,200,0.55)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(216,210,200,0.28)")}
          >
            <span>Explore Our Services</span>
          </a>
        </div>

        {/* Stats strip */}
        <div className="hero-stats flex flex-wrap gap-x-10 gap-y-3 pt-7"
          style={{ borderTop: "1px solid rgba(201,160,72,0.08)" }}>
          {[
            ["[X]+",  "Years of excellence"],
            ["[XX]+", "Smiles transformed"],
            ["5.0",   "Google rating"],
            ["[XX]+", "5-star reviews"],
          ].map(([val, label]) => (
            <div key={label} className="flex items-baseline gap-2">
              <span className="font-data text-sm font-medium" style={{ color: "#C9A048" }}>{val}</span>
              <span className="font-data text-[11px] tracking-wider uppercase"
                style={{ color: "rgba(216,210,200,0.25)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <span className="font-data text-[9px] tracking-[0.35em] uppercase"
          style={{ color: "rgba(201,160,72,0.3)" }}>Scroll</span>
        <div className="w-px h-10"
          style={{ background: "linear-gradient(to bottom, rgba(201,160,72,0.3), transparent)" }} />
      </div>
    </section>
  );
}
