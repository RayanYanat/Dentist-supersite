"use client";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import type { CompanyData } from "@/lib/types";

/**
 * BookingBar — mobile-only sticky CTA at the bottom of the viewport.
 *
 * Why: most cold-email opens happen on mobile. The desktop navbar already
 * carries the "Book Consultation" CTA, but on mobile that hamburger menu
 * collapses and the only persistent action is the phone link. A prospect
 * scrolling through the page on mobile loses contact with the call-to-action
 * after the hero. The booking bar restores that anchor without taking
 * permanent screen real estate.
 *
 * Trigger: hidden until the user has scrolled past ~80% of the viewport
 * height (roughly past the hero). Once visible, it stays until the user
 * reaches the contact section — where it would be redundant with the
 * inline form, so it fades out again.
 *
 * Layout: two-side bar — left half phones, right half jumps to #contact.
 * Two affordances because mobile users split between "call now" and
 * "book a slot." Gold + obsidian, no surprise.
 */
export default function BookingBar({ company }: { company: CompanyData }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y          = window.scrollY;
      const vh         = window.innerHeight;
      const contactEl  = document.getElementById("contact");
      const contactTop = contactEl ? contactEl.getBoundingClientRect().top + window.scrollY : Infinity;
      const docHeight  = document.documentElement.scrollHeight;

      // Show after the hero, hide near/inside the contact section + at page bottom.
      const afterHero = y > vh * 0.8;
      const nearContact = contactTop !== Infinity && y > contactTop - vh * 0.4;
      const nearBottom = y + vh > docHeight - 80;

      setVisible(afterHero && !nearContact && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="lg:hidden fixed inset-x-0 bottom-0 z-40 transition-all duration-400 ease-out"
      style={{
        transform: visible ? "translateY(0)" : "translateY(110%)",
        opacity:   visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        backgroundColor:      "rgba(12,11,9,0.94)",
        backdropFilter:       "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderTop:            "1px solid rgba(201,160,72,0.18)",
        boxShadow:            "0 -8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div className="flex items-stretch">
        {/* Call — left half */}
        <a
          href={`tel:${company.phone}`}
          className="flex-1 flex items-center justify-center gap-2 py-4 active:bg-[rgba(201,160,72,0.08)] transition-colors"
          style={{ color: "rgba(216,210,200,0.85)" }}
          aria-label={`Call ${company.phone}`}
        >
          <Phone size={14} style={{ color: "#C9A048" }} />
          <span className="font-data text-[11px] tracking-[0.22em] uppercase">Call now</span>
        </a>

        {/* Vertical divider */}
        <div className="w-px self-stretch" style={{ backgroundColor: "rgba(201,160,72,0.18)" }} />

        {/* Book — right half */}
        <a
          href="#contact"
          className="flex-1 flex items-center justify-center py-4 active:bg-[rgba(201,160,72,0.15)] transition-colors"
          style={{ color: "#C9A048" }}
        >
          <span className="font-data text-[11px] tracking-[0.22em] uppercase font-bold">
            Book a call &middot; 30 min
          </span>
        </a>
      </div>
    </div>
  );
}
