import { NextRequest, NextResponse } from "next/server";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/track
 * Body: { slug: string }
 *
 * Increments visit_count, stamps first/last visited timestamps, and posts a
 * Slack notification — every time a prospect actually opens their page.
 * The Slack fetch is awaited (NOT fire-and-forget) because Netlify kills
 * pending async work the moment the response is returned.
 */
export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json() as { slug: string };
    if (!slug) return NextResponse.json({ ok: false }, { status: 400 });

    const userAgent = req.headers.get("user-agent") ?? "";

    /* ── Ignore bots ─────────────────────────────────────────────────── */
    if (/bot|crawl|spider|slurp|baidu|bytespider|GPTBot/i.test(userAgent)) {
      return NextResponse.json({ ok: true });
    }

    const supabase = getSupabase();

    /* ── Fetch current lead state ────────────────────────────────────── */
    const { data: lead } = await supabase
      .from("leads")
      .select("name, visit_count, first_visited_at")
      .eq("slug", slug)
      .single();

    if (!lead) {
      return NextResponse.json({ ok: false, reason: "lead not found" }, { status: 404 });
    }

    const isFirstVisit = !lead.first_visited_at;
    const newCount     = (lead.visit_count ?? 0) + 1;
    const now          = new Date().toISOString();

    /* ── Update lead — admin client bypasses RLS ─────────────────────── */
    await getSupabaseAdmin()
      .from("leads")
      .update({
        visit_count:      newCount,
        first_visited_at: isFirstVisit ? now : lead.first_visited_at,
        last_visited_at:  now,
      })
      .eq("slug", slug);

    /* ── Slack — awaited so Netlify doesn't kill it before it fires ──── */
    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      const isMobile   = /mobile|android|iphone|ipad/i.test(userAgent);
      const emoji      = isFirstVisit ? "🔥" : "🔄";
      const visitLabel = isFirstVisit ? "Première visite" : `Revisite #${newCount}`;
      const device     = isMobile ? "📱 Mobile" : "🖥️ Desktop";
      const time       = new Date().toLocaleTimeString("fr-FR", {
        hour:     "2-digit",
        minute:   "2-digit",
        timeZone: "Europe/Paris",
      });

      try {
        await fetch(slackUrl, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: [
                    `${emoji} *${lead.name}* est sur son site`,
                    `🕐 ${time}  ·  ${visitLabel}  ·  ${device}`,
                  ].join("\n"),
                },
              },
            ],
          }),
        });
      } catch {}
    }

    return NextResponse.json({ ok: true });

  } catch (e) {
    return NextResponse.json({ ok: false, caught: String(e) });
  }
}
