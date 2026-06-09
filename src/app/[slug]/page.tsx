import { notFound }       from "next/navigation";
import type { Metadata }  from "next";
import { getSupabase }    from "@/lib/supabase";
import type { CompanyData } from "@/lib/types";

import AmbientCanvas from "@/components/shared/AmbientCanvas";
import BookingBar    from "@/components/shared/BookingBar";
import CustomCursor  from "@/components/shared/CustomCursor";
import GlobalTexture from "@/components/shared/GlobalTexture";
import GSAPConfig    from "@/components/shared/GSAPConfig";
import SmoothScroll  from "@/components/shared/SmoothScroll";
import VisitTracker  from "@/components/shared/VisitTracker";
import ConceptBanner from "@/components/shared/ConceptBanner";
import Navbar        from "@/components/layout/Navbar";
import Footer        from "@/components/layout/Footer";
import HeroSection           from "@/sections/HeroSection";
import TransformationSection from "@/sections/TransformationSection";
import CraftSection          from "@/sections/CraftSection";
import GallerySection        from "@/sections/GallerySection";
import MakerSection          from "@/sections/SignatureSection"; /* file name kept; chapter is "The Team" */
import ContactSection        from "@/sections/ContactSection";

/* ── ISR config ────────────────────────────────────────────────────────────
 * dynamicParams = true  → slugs not in generateStaticParams are rendered
 *                          on first request, then cached.
 * revalidate = 3600     → cached HTML is fresh for 1 hour. Each prospect
 *                          URL is one-shot (sent once, viewed a few times
 *                          by that single prospect) so aggressive
 *                          revalidation buys nothing — but 1 h still lets
 *                          Supabase edits propagate within the same
 *                          outreach session. For instant cache flush after
 *                          editing, a git push triggers a Netlify rebuild.
 * generateStaticParams  → returns [] so nothing is pre-built at deploy time;
 *                          every page is generated on-demand the first time
 *                          a prospect opens their unique link.
 * ─────────────────────────────────────────────────────────────────────────── */
export const dynamicParams = true;
export const revalidate    = 3600;

export async function generateStaticParams() {
  return [];
}

/* ── Data fetcher ───────────────────────────────────────────────────────────
 * `zone` is computed here from the raw `city` column — it is never persisted
 * in Supabase. Every section that displays a service-area label reads
 * company.zone, never re-derives it.
 *
 * Sanitization runs on every text field — the Google-Maps scraper that fills
 * the leads table prefixes addresses with a private-use-area glyph (U+E0C8,
 * a map-pin icon from the scraper's source font). That glyph renders as a
 * "missing tofu" rectangle on every prospect page until cleaned. The city
 * field also gets bureaucratic suffixes ("Dubai Emirate", "Riyadh Region")
 * stripped because they read odd in editorial copy ("Cosmetic Dentistry in
 * Dubai Emirate" → "Cosmetic Dentistry in Dubai").
 * ─────────────────────────────────────────────────────────────────────────── */

/** Strip Unicode private-use-area characters (U+E000–U+F8FF). These are
 *  scraper-added icon glyphs that render as missing-glyph rectangles on
 *  the prospect's device. */
function stripPUA(s: string | null | undefined): string | null {
  if (!s) return null;
  const cleaned = s.replace(/[-]/g, "").trim();
  return cleaned || null;
}

/** Strip bureaucratic suffixes from city names so editorial copy reads
 *  naturally across regions ("Dubai Emirate" → "Dubai"). */
function normalizeCity(city: string): string {
  return city.replace(/\s+(Emirate|Region|Province|Governorate|Prefecture|County|Metropolitan\s+Area)$/i, "").trim();
}

async function getCompany(slug: string): Promise<CompanyData | null> {
  const { data, error } = await getSupabase()
    .from("leads")
    .select("slug, name, city, phone, email, address, rating, reviews_count, website, instagram, facebook")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  const row = data as Omit<CompanyData, "zone">;
  const cleanCity = normalizeCity(stripPUA(row.city) ?? "");

  return {
    ...row,
    name:    stripPUA(row.name)    ?? row.name,
    city:    cleanCity,
    address: stripPUA(row.address),
    email:   stripPUA(row.email),
    zone:    `${cleanCity} & surrounding areas`,
  };
}

/* ── Dynamic metadata ───────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company  = await getCompany(slug);

  if (!company) {
    return {
      title:       "Cosmetic Dentistry — Premium Care",
      description: "Cosmetic and restorative dentistry — crafted with precision.",
    };
  }

  return {
    title:       `${company.name} — Cosmetic Dentistry in ${company.city}`,
    description: `Premium cosmetic dentistry in ${company.city}. Veneers, implants, smile design — crafted with precision. Call ${company.phone} to book a consultation.`,
  };
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company  = await getCompany(slug);

  if (!company) return notFound();

  return (
    <>
      {/* Smooth scroll — desktop only, respects reduced-motion */}
      <SmoothScroll />

      {/* Global atmospheric layers — fixed, behind everything */}
      <AmbientCanvas />
      <GlobalTexture />
      <CustomCursor />

      {/* Visit tracking — fires a single POST per browser load (post-ISR) */}
      <VisitTracker slug={slug} />

      {/* Navbar outside <main> → root stacking context → iOS safe */}
      <Navbar company={company} />

      {/* Mobile-only sticky booking bar — restores persistent CTA on mobile
         where the navbar collapses into a hamburger after first scroll. */}
      <BookingBar company={company} />

      <main style={{ position: "relative", zIndex: 1 }}>
        {/* GSAPConfig first child — registers plugins before ScrollTriggers */}
        <GSAPConfig />

        <HeroSection           company={company} />
        <TransformationSection company={company} />
        <CraftSection          company={company} />
        <GallerySection        company={company} />
        <MakerSection          company={company} />
        <ContactSection        company={company} />

        <Footer company={company} />
      </main>

      <ConceptBanner name={company.name} />
    </>
  );
}
