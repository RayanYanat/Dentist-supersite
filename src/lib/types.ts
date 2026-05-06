/**
 * Data shape for a single prospect/client row in Supabase `leads` table.
 * All sections that previously read from lib/constants.ts now receive a
 * CompanyData prop injected by the [slug]/page.tsx Server Component.
 *
 * `zone` is NOT a DB column — it's computed in [slug]/page.tsx as
 *   `${row.city} & surrounding areas`
 * and merged into the row before being passed to sections.
 */
export interface CompanyData {
  slug:    string;
  name:    string;
  city:    string;
  zone:    string;
  phone:   string;
  email:   string | null;
  license: string | null;
  address: string | null;
}
