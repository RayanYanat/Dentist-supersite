"use client";
import { useEffect } from "react";

/**
 * Fires a single POST to /api/track on page mount.
 * Renders nothing — purely a side-effect component.
 *
 * Why a client component, not the Server Component?
 * The [slug] page uses ISR (revalidate = 86400). The Server Component only
 * re-executes once per 24 h per slug, so logging there would record one
 * visit per day regardless of real traffic. A useEffect fires on every
 * actual browser load — which is exactly what the outreach loop needs.
 *
 * The fetch is fire-and-forget intentionally: visit tracking must never
 * block the UI or surface a failed-network state to the prospect.
 */
export default function VisitTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch("/api/track", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ slug }),
    }).catch(() => {});
  }, [slug]);

  return null;
}
