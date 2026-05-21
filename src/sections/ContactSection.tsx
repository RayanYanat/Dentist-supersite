"use client";
import { useRef, useState, FormEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ArrowRight, Check } from "lucide-react";
import CharText from "@/components/shared/CharText";
import type { CompanyData } from "@/lib/types";

/**
 * Scene V — "The Invitation"
 *
 * Replaces the 4-field form-as-centerpiece with a private-appointment
 * card. The previous version put a generic Contact form at the heart of
 * the section — that's how every dental site closes, which is the
 * problem.
 *
 * The new architecture inverts the priority:
 *
 *   - The PHONE NUMBER is the centerpiece. Big, italic, hand-written in
 *     spirit. The luxury thing is that the patient calls.
 *   - The atelier address and hours sit as quiet factual lines below.
 *   - A two-field card (name + phone) is offered as a discreet
 *     alternative for those who'd rather be called back.
 *   - A closing italic line: "We don't take walk-ins. Every visit is
 *     composed."
 *
 * Stays in the dark register — closes the storytelling arc that opened
 * with Scene I (also dark).
 */

const HOURS = [
  ["Tue – Fri", "9:00 — 18:00"],
  ["Saturday",  "By appointment"],
  ["Sun – Mon", "Closed"],
];

export default function ContactSection({ company }: { company: CompanyData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.set(".inv-meta",     { opacity: 0, x: -10 });
      gsap.set(".inv-eyebrow",  { opacity: 0, y: 18 });
      gsap.set(".char-reveal",  { y: "115%", opacity: 0 });
      gsap.set(".inv-lede",     { opacity: 0, y: 20 });
      gsap.set(".inv-phone",    { opacity: 0, y: 32 });
      gsap.set(".inv-phone-cap",{ opacity: 0, y: 14 });
      gsap.set(".inv-rule",     { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".inv-detail",   { opacity: 0, y: 22 });
      gsap.set(".inv-card",     { opacity: 0, y: 30 });
      gsap.set(".inv-coda",     { opacity: 0, y: 14 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 80%",
        once:    true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".inv-meta",      { opacity: 1, x: 0, duration: 0.6 },             0)
            .to(".inv-eyebrow",   { opacity: 1, y: 0, duration: 0.6 },             0.1)
            .to(".char-reveal",   { y: "0%", opacity: 1, duration: 0.85, stagger: 0.022 }, 0.25)
            .to(".inv-lede",      { opacity: 1, y: 0, duration: 0.7 },             0.8)
            .to(".inv-phone",     { opacity: 1, y: 0, duration: 1.1 },             1.0)
            .to(".inv-phone-cap", { opacity: 1, y: 0, duration: 0.6 },             1.4)
            .to(".inv-rule",      { scaleX: 1, duration: 1.0, ease: "expo.out" }, 1.4)
            .to(".inv-detail",    { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 1.55)
            .to(".inv-card",      { opacity: 1, y: 0, duration: 0.9 },             1.8);
        },
      });

      ScrollTrigger.create({
        trigger: ".inv-coda",
        start:   "top 92%",
        once:    true,
        onEnter: () => {
          gsap.to(".inv-coda", { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" });
        },
      });
    },
    { scope: sectionRef }
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    /* Visual-only success — actual conversion is the phone follow-up. */
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative section-padding overflow-hidden"
      style={{ backgroundColor: "#0C0B09" }}
    >
      {/* Top hairline */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,160,72,0.3), transparent)" }}
      />

      {/* Ambient gold glow */}
      <div
        className="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(201,160,72,0.08) 0%, transparent 65%)",
          animation:  "breathe-gold 14s ease-in-out infinite",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-5 lg:px-8">

        {/* Chapter indicator */}
        <div className="inv-meta flex items-center gap-3 mb-10 lg:mb-14">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "#C9A048", animation: "caret-pulse 1.8s ease-in-out infinite" }}
          />
          <span
            className="font-data text-[10px] tracking-[0.45em] uppercase"
            style={{ color: "rgba(240,234,224,0.6)" }}
          >
            V &mdash; The Invitation
          </span>
        </div>

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="mb-16 lg:mb-20 max-w-3xl">
          <div className="inv-eyebrow flex items-center gap-3 mb-6">
            <div className="w-6 h-px" style={{ backgroundColor: "#C9A048" }} />
            <span
              className="font-data text-[11px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(201,160,72,0.75)" }}
            >
              Begin a private conversation
            </span>
          </div>
          <h2
            className="font-display"
            style={{
              fontSize:      "clamp(2.4rem, 6vw, 5.2rem)",
              lineHeight:    "0.96",
              letterSpacing: "-0.02em",
              color:         "#F0EAE0",
              fontWeight:    400,
            }}
          >
            <span className="block overflow-hidden" style={{ paddingTop: "0.05em", paddingBottom: "0.08em" }}>
              <CharText text="An invitation," />
            </span>
            <span className="block overflow-hidden italic" style={{ color: "#C9A048", paddingTop: "0.05em", paddingBottom: "0.12em" }}>
              <CharText text="composed." />
            </span>
          </h2>
          <p
            className="inv-lede mt-8 text-base leading-relaxed max-w-xl"
            style={{ color: "rgba(216,210,200,0.55)" }}
          >
            A consultation begins with a phone call &mdash; not a portal.
            The practice will know your name before you arrive.
          </p>
        </div>

        {/* ── The phone — the centerpiece ────────────────────────── */}
        <div className="mb-20 lg:mb-24 flex flex-col items-start">
          <a
            href={`tel:${company.phone}`}
            className="inv-phone font-display italic group inline-block"
            style={{
              fontSize:      "clamp(2.4rem, 6.5vw, 5.8rem)",
              lineHeight:    "1.0",
              letterSpacing: "-0.02em",
              color:         "#F0EAE0",
              fontWeight:    400,
              textDecoration: "none",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#C9A048"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#F0EAE0"; }}
          >
            {company.phone}
            <span
              className="ml-3 align-middle inline-block transition-transform duration-300 group-hover:translate-x-2"
              style={{ color: "#C9A048", fontSize: "0.42em" }}
            >
              &rarr;
            </span>
          </a>
          <p
            className="inv-phone-cap mt-6 font-data text-[11px] tracking-[0.32em] uppercase"
            style={{ color: "rgba(201,160,72,0.7)" }}
          >
            Direct line &middot; We answer personally within 24 hours
          </p>
        </div>

        {/* Hairline divider before factual strip */}
        <div
          className="inv-rule h-px w-full mb-12 lg:mb-16"
          style={{ backgroundColor: "rgba(201,160,72,0.18)" }}
        />

        {/* ── Factual strip — atelier / hours / correspondence ──── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 lg:mb-24">

          <div className="inv-detail">
            <span
              className="font-data text-[10px] tracking-[0.42em] uppercase block mb-4"
              style={{ color: "rgba(201,160,72,0.6)" }}
            >
              The Atelier
            </span>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(216,210,200,0.7)" }}>
              {company.address || company.zone}
            </p>
          </div>

          <div className="inv-detail">
            <span
              className="font-data text-[10px] tracking-[0.42em] uppercase block mb-4"
              style={{ color: "rgba(201,160,72,0.6)" }}
            >
              Atelier Hours
            </span>
            <dl className="space-y-1.5">
              {HOURS.map(([day, hours]) => (
                <div key={day} className="flex justify-between text-xs">
                  <dt style={{ color: "rgba(216,210,200,0.45)" }}>{day}</dt>
                  <dd className="font-data" style={{ color: "rgba(216,210,200,0.7)" }}>{hours}</dd>
                </div>
              ))}
            </dl>
          </div>

          {company.email && (
            <div className="inv-detail">
              <span
                className="font-data text-[10px] tracking-[0.42em] uppercase block mb-4"
                style={{ color: "rgba(201,160,72,0.6)" }}
              >
                Correspondence
              </span>
              <a
                href={`mailto:${company.email}`}
                className="text-sm leading-relaxed transition-colors duration-200 break-all"
                style={{ color: "rgba(216,210,200,0.7)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#C9A048"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(216,210,200,0.7)"; }}
              >
                {company.email}
              </a>
            </div>
          )}
        </div>

        {/* ── Discreet two-field card — "or have us call you" ───── */}
        <div className="inv-card relative max-w-xl mx-auto p-8 lg:p-10"
          style={{
            backgroundColor: "rgba(20,18,16,0.7)",
            border:          "1px solid rgba(201,160,72,0.18)",
          }}
        >
          {/* Corner brackets */}
          <div className="hidden sm:block absolute top-3 left-3 w-5 h-5 pointer-events-none"
            style={{ borderTop: "1px solid rgba(201,160,72,0.4)", borderLeft: "1px solid rgba(201,160,72,0.4)" }} />
          <div className="hidden sm:block absolute bottom-3 right-3 w-5 h-5 pointer-events-none"
            style={{ borderBottom: "1px solid rgba(201,160,72,0.4)", borderRight: "1px solid rgba(201,160,72,0.4)" }} />

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <p
                  className="font-data text-[10px] tracking-[0.32em] uppercase mb-2"
                  style={{ color: "rgba(201,160,72,0.7)" }}
                >
                  Or have us call you
                </p>
                <h3
                  className="font-display italic"
                  style={{
                    fontSize:      "clamp(1.3rem, 2vw, 1.5rem)",
                    color:         "#F0EAE0",
                    letterSpacing: "-0.005em",
                    fontWeight:    400,
                  }}
                >
                  Leave your name and the practice will reach out.
                </h3>
              </div>

              <Field label="Name" htmlFor="inv-name">
                <input
                  id="inv-name" name="name" type="text" required
                  placeholder="—"
                  autoComplete="name"
                  className="w-full bg-transparent outline-none text-base font-medium pb-2 transition-colors duration-300"
                  style={{ color: "#D8D2C8", borderBottom: "1px solid rgba(201,160,72,0.22)" }}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = "#C9A048"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderBottomColor = "rgba(201,160,72,0.22)"; }}
                />
              </Field>

              <Field label="Phone" htmlFor="inv-phone-input">
                <input
                  id="inv-phone-input" name="phone" type="tel" required
                  placeholder="—"
                  autoComplete="tel"
                  className="w-full bg-transparent outline-none text-base font-medium pb-2 transition-colors duration-300"
                  style={{ color: "#D8D2C8", borderBottom: "1px solid rgba(201,160,72,0.22)" }}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = "#C9A048"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderBottomColor = "rgba(201,160,72,0.22)"; }}
                />
              </Field>

              <button
                type="submit"
                className="group relative mt-2 flex items-center justify-center gap-3 px-6 py-3.5 text-xs font-bold tracking-[0.22em] uppercase overflow-hidden transition-all duration-300 self-start"
                style={{ backgroundColor: "#C9A048", color: "#0C0B09" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#D9B25C"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#C9A048"; }}
              >
                <span
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                  style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.28), transparent)" }}
                />
                <span>Request appointment</span>
                <ArrowRight size={12} className="group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center text-center py-8 gap-5">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(201,160,72,0.12)", border: "1px solid rgba(201,160,72,0.4)" }}
              >
                <Check size={20} style={{ color: "#C9A048" }} />
              </div>
              <div>
                <p
                  className="font-data text-[10px] tracking-[0.32em] uppercase mb-2"
                  style={{ color: "rgba(201,160,72,0.7)" }}
                >
                  Reservation received
                </p>
                <h3
                  className="font-display italic mb-2"
                  style={{
                    fontSize:      "1.4rem",
                    color:         "#F0EAE0",
                    letterSpacing: "-0.005em",
                    fontWeight:    400,
                  }}
                >
                  Thank you.
                </h3>
                <p className="text-sm leading-relaxed max-w-md" style={{ color: "rgba(216,210,200,0.55)" }}>
                  The practice will be in touch within the day to schedule your first visit.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Coda — italic closing line ────────────────────────── */}
        <div className="inv-coda mt-20 lg:mt-24 flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-px" style={{ backgroundColor: "rgba(201,160,72,0.45)" }} />
            <span style={{ color: "#C9A048", fontSize: "0.7rem" }}>&#9670;</span>
            <div className="w-10 h-px" style={{ backgroundColor: "rgba(201,160,72,0.45)" }} />
          </div>
          <p
            className="font-display italic"
            style={{
              fontSize:      "clamp(1rem, 1.6vw, 1.2rem)",
              color:         "rgba(216,210,200,0.65)",
              letterSpacing: "-0.005em",
              fontWeight:    400,
            }}
          >
            We don&rsquo;t take walk-ins. Every visit is composed.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Form field wrapper ─────────────────────────────────────────── */
function Field({
  label,
  htmlFor,
  children,
}: {
  label:    string;
  htmlFor:  string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block font-data text-[10px] tracking-[0.3em] uppercase mb-3"
        style={{ color: "rgba(201,160,72,0.55)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
