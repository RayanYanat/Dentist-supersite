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
import Navbar        from "@/components/layout/Navbar";
import Footer        from "@/components/layout/Footer";
import HeroSection      from "@/sections/HeroSection";
import CraftSection     from "@/sections/CraftSection";
import GallerySection   from "@/sections/GallerySection";
import MakerSection     from "@/sections/SignatureSection"; /* file name kept; chapter is "The Team" */
import ContactSection   from "@/sections/ContactSection";

/* ── ISR config ────────────────────────────────────────────────────────────
 * dynamicParams = true  → slugs not in generateStaticParams are rendered
 *                          on first request, then cached.
 * revalidate = 60       → cached HTML is fresh for 60 s. After that, the
 *                          next request triggers a background regeneration
 *                          (stale-while-revalidate). Short window so edits
 *                          made directly in Supabase (cabinet name, phone,
 *                          city, etc.) propagate to live prospect URLs
 *                          within a minute instead of waiting 24 h.
 * generateStaticParams  → returns [] so nothing is pre-built at deploy time;
 *                          every page is generated on-demand the first time
 *                          a prospect opens their unique link.
 * ─────────────────────────────────────────────────────────────────────────── */
export const dynamicParams = true;
export const revalidate    = 60;

export async function generateStaticParams() {
  return [];
}

/* ── Data fetcher ───────────────────────────────────────────────────────────
 * `zone` is computed here from the raw `city` column — it is never persisted
 * in Supabase. Every section that displays a service-area label reads
 * company.zone, never re-derives it.
 * ─────────────────────────────────────────────────────────────────────────── */
async function getCompany(slug: string): Promise<CompanyData | null> {
  const { data, error } = await getSupabase()
    .from("leads")
    .select("slug, name, city, phone, email, address, rating, reviews_count, website, instagram, facebook")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  const row = data as Omit<CompanyData, "zone">;
  return { ...row, zone: `${row.city} & surrounding areas` };
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

        <HeroSection      company={company} />
        <CraftSection     company={company} />
        <GallerySection   company={company} />
        <MakerSection     company={company} />
        <ContactSection   company={company} />

        <Footer company={company} />
      </main>
    </>
  );
}
