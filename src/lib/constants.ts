/**
 * Static configuration that is NOT prospect-specific.
 * Per-prospect data flows in as a `company: CompanyData` prop, hydrated
 * server-side from Supabase in /[slug]/page.tsx.
 */

export const NAV_LINKS = [
  { label: "The Crafts",      href: "#craft"   },
  { label: "The Ledger",      href: "#ledger"  },
  { label: "The Team",        href: "#team"    },
  { label: "Contact",         href: "#contact" },
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
 * Atelier signal badges shown in the footer.
 * Previously this was a list of US-specific cosmetic-dentistry
 * certifications (ADA, AGD, AACD, BBB). That broke immediately
 * for any non-US prospect — a Saudi or UK dentist saw American
 * acronyms in their own site, instant template-tell.
 *
 * Replaced with country-agnostic *atelier signals* — claims about
 * how the practice works, not about which trade body it belongs to.
 * These read correctly regardless of jurisdiction.
 */
export const CERTIFS = [
  "Atelier-signed",
  "Lithium disilicate",
  "Hand-layered",
  "Single hand per case",
];
