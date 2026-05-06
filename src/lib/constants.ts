/**
 * Static configuration that is NOT prospect-specific.
 * Per-prospect data flows in as a `company: CompanyData` prop, hydrated
 * server-side from Supabase in /[slug]/page.tsx.
 */

export const NAV_LINKS = [
  { label: "Our Craft",       href: "#craft"           },
  { label: "Transformations", href: "#transformations" },
  { label: "Our Signature",   href: "#signature"       },
  { label: "Contact",         href: "#contact"         },
];

/**
 * Plausible defaults for the signature/stats bar.
 * Uniform across every prospect — these are demo values, not per-lead data.
 * The leads table does not store stats; the dental schema is intentionally
 * minimal to keep prospect outreach friction low.
 */
export const STATS = [
  { value: 15,  suffix: "+",  label: "Years of Excellence"  },
  { value: 800, suffix: "+",  label: "Smiles Transformed"   },
  { value: 5,   suffix: ".0", label: "Google Rating"        },
  { value: 98,  suffix: "%",  label: "Patient Satisfaction" },
];

/**
 * Certifications shown in the footer + signature section.
 * Generic to American cosmetic dentistry — would be swapped per-region
 * (e.g. France: Conseil de l'Ordre, ADF) in a localized build.
 */
export const CERTIFS = ["ADA", "AGD", "AACD", "BBB"];
