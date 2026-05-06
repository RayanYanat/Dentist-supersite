"use client";
import { useRef, useState, FormEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, Clock, ArrowRight, Check } from "lucide-react";
import type { CompanyData } from "@/lib/types";

/**
 * "Begin Your Journey" — premium booking pane, not a generic contact form.
 *
 * The journey starts with a conversation, not a 10-field intake. Three
 * fields only (name · phone-or-email · treatment of interest) plus an
 * optional note. Submit simulates a successful reservation and animates
 * the form into a "thank you" state — no real backend call: in this
 * outreach model, the actual conversion is the phone follow-up that the
 * prospect's reply triggers, not a form POST.
 *
 * Right rail carries the directly callable contact data (phone, email,
 * address, atelier hours) which is, in practice, the channel that closes.
 */

const TREATMENTS = [
  "Porcelain Veneers",
  "Smile Design",
  "Dental Implants",
  "Whitening",
  "Clear Aligners",
  "Cosmetic Bonding",
  "Other / Not sure yet",
];

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

      gsap.set(".contact-header", { opacity: 0, y: 30 });
      gsap.set(".contact-form",   { opacity: 0, y: 50 });
      gsap.set(".contact-rail",   { opacity: 0, y: 50 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 82%",
        once:    true,
        onEnter: () => {
          gsap.to(".contact-header", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
          gsap.to(".contact-form",   { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.2 });
          gsap.to(".contact-rail",   { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.35 });
        },
      });
    },
    { scope: sectionRef }
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    /* Visual-only success — the prospect's actual conversion path is the
       phone follow-up, not a server-side form handler. */
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

      {/* Ambient gold glows */}
      <div
        className="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(201,160,72,0.08) 0%, transparent 65%)",
          animation:  "breathe-gold 14s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:     "radial-gradient(ellipse at center, rgba(240,234,224,0.05) 0%, transparent 65%)",
          animation:      "breathe-gold 18s ease-in-out infinite reverse",
          animationDelay: "5s",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="contact-header mb-16 lg:mb-20 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px" style={{ backgroundColor: "#C9A048" }} />
            <span className="font-data text-[11px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(201,160,72,0.75)" }}>
              Contact
            </span>
          </div>
          <h2 className="font-heading text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] font-extrabold mb-6"
            style={{ color: "#D8D2C8" }}>
            Begin your<br />
            <span className="italic" style={{ color: "#C9A048" }}>journey.</span>
          </h2>
          <p className="text-base leading-relaxed max-w-xl"
            style={{ color: "rgba(216,210,200,0.45)" }}>
            A consultation begins with a conversation — not a form.
            Tell us a little, and the practice will reach out to schedule
            your first visit, on your terms.
          </p>
        </div>

        {/* ── Two-column layout ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">

          {/* ── Form ────────────────────────────────────────────── */}
          <div className="contact-form lg:col-span-7 relative p-8 lg:p-12"
            style={{
              backgroundColor: "#141210",
              border:          "1px solid rgba(201,160,72,0.15)",
            }}>

            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-6 h-6 pointer-events-none"
              style={{ borderTop: "1px solid rgba(201,160,72,0.4)", borderLeft: "1px solid rgba(201,160,72,0.4)" }} />
            <div className="absolute bottom-3 right-3 w-6 h-6 pointer-events-none"
              style={{ borderBottom: "1px solid rgba(201,160,72,0.4)", borderRight: "1px solid rgba(201,160,72,0.4)" }} />

            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                <div>
                  <p className="font-data text-[10px] tracking-[0.32em] uppercase mb-2"
                    style={{ color: "rgba(201,160,72,0.7)" }}>
                    Reservation Inquiry
                  </p>
                  <h3 className="font-heading text-2xl font-bold italic"
                    style={{ color: "#D8D2C8", textTransform: "none", letterSpacing: "-0.005em" }}>
                    Tell us a little.
                  </h3>
                </div>

                <Field label="Full Name" htmlFor="name">
                  <input id="name" name="name" type="text" required
                    placeholder="—"
                    className="w-full bg-transparent outline-none text-base font-medium pb-2 transition-colors duration-300"
                    style={{
                      color:          "#D8D2C8",
                      borderBottom:   "1px solid rgba(201,160,72,0.2)",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderBottomColor = "#C9A048"; }}
                    onBlur={(e)  => { e.currentTarget.style.borderBottomColor = "rgba(201,160,72,0.2)"; }}
                  />
                </Field>

                <Field label="Phone or Email" htmlFor="contact">
                  <input id="contact" name="contact" type="text" required
                    placeholder="—"
                    className="w-full bg-transparent outline-none text-base font-medium pb-2 transition-colors duration-300"
                    style={{
                      color:        "#D8D2C8",
                      borderBottom: "1px solid rgba(201,160,72,0.2)",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderBottomColor = "#C9A048"; }}
                    onBlur={(e)  => { e.currentTarget.style.borderBottomColor = "rgba(201,160,72,0.2)"; }}
                  />
                </Field>

                <Field label="Treatment of Interest" htmlFor="treatment">
                  <select id="treatment" name="treatment" required
                    className="w-full bg-transparent outline-none text-base font-medium pb-2 transition-colors duration-300 appearance-none cursor-pointer"
                    style={{
                      color:        "#D8D2C8",
                      borderBottom: "1px solid rgba(201,160,72,0.2)",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderBottomColor = "#C9A048"; }}
                    onBlur={(e)  => { e.currentTarget.style.borderBottomColor = "rgba(201,160,72,0.2)"; }}
                    defaultValue=""
                  >
                    <option value="" disabled style={{ backgroundColor: "#141210", color: "rgba(216,210,200,0.4)" }}>
                      —
                    </option>
                    {TREATMENTS.map((t) => (
                      <option key={t} value={t} style={{ backgroundColor: "#141210", color: "#D8D2C8" }}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="A Note (optional)" htmlFor="note">
                  <textarea id="note" name="note" rows={3}
                    placeholder="—"
                    className="w-full bg-transparent outline-none text-base font-medium pb-2 resize-none transition-colors duration-300"
                    style={{
                      color:        "#D8D2C8",
                      borderBottom: "1px solid rgba(201,160,72,0.2)",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderBottomColor = "#C9A048"; }}
                    onBlur={(e)  => { e.currentTarget.style.borderBottomColor = "rgba(201,160,72,0.2)"; }}
                  />
                </Field>

                <button type="submit"
                  className="group relative mt-2 flex items-center justify-center gap-3 px-8 py-4 text-xs font-bold tracking-[0.22em] uppercase overflow-hidden transition-all duration-300 self-start"
                  style={{ backgroundColor: "#C9A048", color: "#0C0B09" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#8E6E28"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#C9A048"; }}
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                    style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)" }} />
                  <span>Reserve a Consultation</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                </button>

                <p className="font-data text-[10px] tracking-wider"
                  style={{ color: "rgba(216,210,200,0.3)" }}>
                  We respond within 24 hours · No automated replies
                </p>
              </form>
            ) : (
              <div className="flex flex-col items-center text-center py-12 gap-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(201,160,72,0.12)", border: "1px solid rgba(201,160,72,0.4)" }}>
                  <Check size={22} style={{ color: "#C9A048" }} />
                </div>
                <div>
                  <p className="font-data text-[10px] tracking-[0.3em] uppercase mb-2"
                    style={{ color: "rgba(201,160,72,0.7)" }}>
                    Reservation Received
                  </p>
                  <h3 className="font-heading text-2xl font-bold italic mb-3"
                    style={{ color: "#D8D2C8", textTransform: "none", letterSpacing: "-0.005em" }}>
                    Thank you.
                  </h3>
                  <p className="text-sm leading-relaxed max-w-md"
                    style={{ color: "rgba(216,210,200,0.5)" }}>
                    The practice will be in touch within the day to schedule your first visit.
                    For anything urgent, call us directly at{" "}
                    <a href={`tel:${company.phone}`} className="underline"
                      style={{ color: "#C9A048" }}>
                      {company.phone}
                    </a>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Right rail — direct contact ─────────────────────── */}
          <div className="contact-rail lg:col-span-5 flex flex-col gap-5">

            {/* Phone */}
            <a href={`tel:${company.phone}`}
              className="group relative p-7 transition-all duration-300"
              style={{
                backgroundColor: "rgba(201,160,72,0.04)",
                border:          "1px solid rgba(201,160,72,0.15)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor     = "rgba(201,160,72,0.5)";
                el.style.backgroundColor = "rgba(201,160,72,0.08)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor     = "rgba(201,160,72,0.15)";
                el.style.backgroundColor = "rgba(201,160,72,0.04)";
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-data text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: "rgba(201,160,72,0.6)" }}>
                  Direct Line
                </span>
                <Phone size={15} style={{ color: "#C9A048" }} />
              </div>
              <p className="font-heading text-2xl font-bold tracking-tight"
                style={{ color: "#D8D2C8", textTransform: "none" }}>
                {company.phone}
              </p>
              <p className="font-data text-[10px] tracking-wider mt-2"
                style={{ color: "rgba(216,210,200,0.35)" }}>
                Tap to call
              </p>
            </a>

            {/* Email */}
            {company.email && (
              <a href={`mailto:${company.email}`}
                className="group relative p-7 transition-all duration-300"
                style={{
                  backgroundColor: "#141210",
                  border:          "1px solid rgba(201,160,72,0.1)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(201,160,72,0.4)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(201,160,72,0.1)";
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-data text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: "rgba(201,160,72,0.6)" }}>
                    Correspondence
                  </span>
                  <Mail size={15} style={{ color: "#C9A048" }} />
                </div>
                <p className="font-heading text-base font-bold tracking-tight break-all"
                  style={{ color: "#D8D2C8", textTransform: "none" }}>
                  {company.email}
                </p>
              </a>
            )}

            {/* Address + Hours */}
            <div className="relative p-7"
              style={{
                backgroundColor: "#141210",
                border:          "1px solid rgba(201,160,72,0.1)",
              }}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-data text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: "rgba(201,160,72,0.6)" }}>
                  The Atelier
                </span>
                <MapPin size={15} style={{ color: "#C9A048" }} />
              </div>
              {company.address ? (
                <p className="text-sm leading-relaxed mb-5"
                  style={{ color: "rgba(216,210,200,0.7)" }}>
                  {company.address}
                </p>
              ) : (
                <p className="text-sm leading-relaxed mb-5"
                  style={{ color: "rgba(216,210,200,0.7)" }}>
                  {company.zone}
                </p>
              )}

              <div className="flex items-center gap-2 mb-3 pt-4"
                style={{ borderTop: "1px solid rgba(201,160,72,0.08)" }}>
                <Clock size={11} style={{ color: "rgba(201,160,72,0.55)" }} />
                <span className="font-data text-[10px] tracking-[0.28em] uppercase"
                  style={{ color: "rgba(201,160,72,0.55)" }}>
                  Atelier Hours
                </span>
              </div>
              <dl className="space-y-1.5">
                {HOURS.map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-xs">
                    <dt style={{ color: "rgba(216,210,200,0.45)" }}>{day}</dt>
                    <dd className="font-data" style={{ color: "rgba(216,210,200,0.65)" }}>{hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
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
      <label htmlFor={htmlFor}
        className="block font-data text-[10px] tracking-[0.3em] uppercase mb-3"
        style={{ color: "rgba(201,160,72,0.55)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
