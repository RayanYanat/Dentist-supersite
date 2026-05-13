"use client";
import { Phone, Mail, MapPin } from "lucide-react";
import { NAV_LINKS, CERTIFS } from "@/lib/constants";
import type { CompanyData } from "@/lib/types";

export default function Footer({ company }: { company: CompanyData }) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: "#080706", borderTop: "1px solid rgba(201,160,72,0.08)" }}
    >
      <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,160,72,0.5), transparent)" }} />

      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 lg:py-20">

          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-5">
              <span style={{ color: "#C9A048" }}>◆</span>
              <span className="font-heading text-xl font-extrabold tracking-widest uppercase"
                style={{ color: "#D8D2C8" }}>
                {company.name}
              </span>
            </a>
            <p className="text-sm leading-relaxed max-w-xs mb-7"
              style={{ color: "rgba(216,210,200,0.35)" }}>
              Cosmetic & restorative dentistry serving {company.zone}.
              Crafted with precision — every smile, every time.
            </p>
            <div className="flex flex-wrap gap-2">
              {CERTIFS.map((c) => (
                <span key={c}
                  className="font-heading text-xs font-bold tracking-widest uppercase px-3 py-1.5 transition-all duration-200"
                  style={{ border: "1px solid rgba(201,160,72,0.18)", color: "rgba(201,160,72,0.55)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,72,0.45)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(201,160,72,0.85)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,72,0.18)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(201,160,72,0.55)";
                  }}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-data text-[10px] tracking-[0.28em] uppercase mb-6"
              style={{ color: "rgba(216,210,200,0.22)" }}>
              Navigation
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}
                    className="text-sm font-medium transition-colors duration-200"
                    style={{ color: "rgba(216,210,200,0.38)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#C9A048")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(216,210,200,0.38)")}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact"
                  className="text-sm font-bold transition-colors duration-200"
                  style={{ color: "rgba(201,160,72,0.65)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#C9A048")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(201,160,72,0.65)")}>
                  Book Consultation →
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-data text-[10px] tracking-[0.28em] uppercase mb-6"
              style={{ color: "rgba(216,210,200,0.22)" }}>
              Contact
            </p>
            <ul className="space-y-4">
              {[
                { Icon: Phone, value: company.phone, href: `tel:${company.phone}` },
                ...(company.email
                  ? [{ Icon: Mail, value: company.email, href: `mailto:${company.email}` }]
                  : []),
                { Icon: MapPin, value: company.zone, href: null as string | null },
              ].map(({ Icon, value, href }) => (
                <li key={value}>
                  {href ? (
                    <a href={href}
                      className="flex items-center gap-3 text-sm transition-colors duration-200"
                      style={{ color: "rgba(216,210,200,0.45)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#C9A048")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(216,210,200,0.45)")}>
                      <Icon size={13} style={{ color: "rgba(201,160,72,0.5)", flexShrink: 0 }} />
                      <span className="font-data tracking-wider">{value}</span>
                    </a>
                  ) : (
                    <div className="flex items-start gap-3 text-sm"
                      style={{ color: "rgba(216,210,200,0.35)" }}>
                      <Icon size={13} style={{ color: "rgba(201,160,72,0.5)", flexShrink: 0, marginTop: 2 }} />
                      <span>{value}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex items-center gap-2.5 px-4 py-3"
              style={{ border: "1px solid rgba(201,160,72,0.12)", backgroundColor: "rgba(201,160,72,0.04)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
                style={{ backgroundColor: "#C9A048" }} />
              <span className="font-data text-[10px] tracking-wider uppercase"
                style={{ color: "rgba(201,160,72,0.6)" }}>
                Accepting New Patients
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(201,160,72,0.06)" }}>
          <p className="font-data text-[10px] tracking-wider"
            style={{ color: "rgba(216,210,200,0.18)" }}>
            © {year} {company.name} — All rights reserved
            {company.rating && ` · ${company.rating}★ (${company.reviews_count} reviews)`}
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Accessibility"].map((item) => (
              <a key={item} href="#"
                className="font-data text-[10px] tracking-wider transition-colors duration-200"
                style={{ color: "rgba(216,210,200,0.18)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(201,160,72,0.5)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(216,210,200,0.18)")}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
