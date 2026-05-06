"use client";
import { useEffect, useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import type { CompanyData } from "@/lib/types";

export default function Navbar({ company }: { company: CompanyData }) {
  const [scrolled, setScrolled]           = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  /* ── Shrink trigger ─────────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Active section via IntersectionObserver ────────────────────── */
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(`#${e.target.id}`);
        });
      },
      { rootMargin: "-30% 0px -65% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor:      scrolled ? "rgba(12,11,9,0.94)" : "transparent",
        backdropFilter:       scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom:         scrolled ? "1px solid rgba(201,160,72,0.08)" : "none",
      }}
    >
      <div
        className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between gap-8 transition-all duration-500"
        style={{ height: scrolled ? "52px" : "84px" }}
      >
        {/* Logo */}
        <a
          href="#"
          className="font-heading font-bold tracking-widest uppercase flex items-center gap-3 transition-all duration-500"
          style={{
            fontSize: scrolled ? "0.9rem" : "1.1rem",
            color: "#D8D2C8",
          }}
        >
          <span style={{ color: "#C9A048", fontSize: "0.6em" }}>◆</span>
          {company.name}
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium tracking-widest uppercase transition-colors duration-200"
                style={{ color: isActive ? "#C9A048" : "rgba(216,210,200,0.45)" }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = "#C9A048";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(216,210,200,0.45)";
                }}
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 h-px transition-all duration-300 ease-out"
                  style={{
                    width: isActive ? "100%" : "0%",
                    backgroundColor: "#C9A048",
                  }}
                />
              </a>
            );
          })}
        </nav>

        {/* Right — phone + CTA */}
        <div className="hidden lg:flex items-center gap-5">
          <a
            href={`tel:${company.phone}`}
            className="flex items-center gap-2 transition-colors duration-200"
            style={{ color: "rgba(216,210,200,0.6)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#C9A048"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(216,210,200,0.6)"; }}
          >
            <Phone size={13} style={{ color: "#C9A048" }} />
            <span className="font-data text-sm tracking-wider">{company.phone}</span>
          </a>
          <a
            href="#contact"
            className="px-5 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-300"
            style={{
              border: "1px solid rgba(201,160,72,0.5)",
              color: "#C9A048",
              paddingBlock: scrolled ? "0.4rem" : "0.55rem",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(201,160,72,0.08)";
              (e.currentTarget as HTMLElement).style.borderColor = "#C9A048";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,72,0.5)";
            }}
          >
            Book Consultation
          </a>
        </div>

        {/* Mobile */}
        <div className="flex lg:hidden items-center gap-4">
          <a
            href={`tel:${company.phone}`}
            className="flex items-center gap-1.5"
            style={{ color: "#C9A048" }}
            aria-label="Call"
          >
            <Phone size={15} />
            <span className="font-data text-xs">{company.phone}</span>
          </a>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{ color: "rgba(216,210,200,0.7)" }}
            className="hover:text-white transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="lg:hidden px-5 py-6 flex flex-col gap-5"
          style={{
            backgroundColor:      "rgba(12,11,9,0.97)",
            backdropFilter:       "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop:            "1px solid rgba(201,160,72,0.08)",
          }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-bold tracking-widest uppercase transition-colors"
                style={{ color: isActive ? "#C9A048" : "rgba(216,210,200,0.55)" }}
              >
                {isActive && <span className="mr-2" style={{ color: "#C9A048" }}>◆</span>}
                {link.label}
              </a>
            );
          })}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-2 px-5 py-3 text-xs font-bold tracking-widest uppercase text-center"
            style={{ border: "1px solid rgba(201,160,72,0.45)", color: "#C9A048" }}
          >
            Book Consultation
          </a>
        </div>
      )}
    </header>
  );
}
