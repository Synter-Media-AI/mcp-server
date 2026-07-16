// Pure, side-effect-free platform-to-script routing tables. Kept in their own
// module (not inline in index.ts) so they're importable for tests without
// pulling in index.ts's top-level `main()` call, which starts a real stdio
// MCP server and blocks forever.

// list_campaigns previously always dispatched to google_ads_list_campaigns
// regardless of the `platform` argument the tool schema advertises (7
// platforms) — a caller passing platform="reddit" silently still got Google
// results. Real per-platform scripts confirmed to exist before wiring.
export const LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM: Record<string, string> = {
  google: "google_ads_list_campaigns",
  meta: "meta_ads_list_campaigns",
  linkedin: "linkedin_ads_list_campaigns",
  microsoft: "microsoft_ads_list_campaigns",
  reddit: "reddit_ads_list_campaigns",
  tiktok: "tiktok_ads_list_campaigns",
  x: "x_ads_list_campaigns",
};

// get_performance had the SAME hardcoded-to-Google bug as list_campaigns
// (always dispatched to pull_google_ads_data regardless of `platform`), plus
// a second, independent bug: it forwarded a `--date-range` flag that NONE of
// the underlying scripts actually define (every one of the 7 confirmed real
// scripts below takes --days / --start-date / --end-date instead — the
// date_range enum was silently dropped by argparse on every prior call).
// Script names verified per-platform (naming is NOT uniform: google/linkedin
// use a "_data" suffix, the rest don't) before wiring any of them.
export const GET_PERFORMANCE_SCRIPT_BY_PLATFORM: Record<string, string> = {
  google: "pull_google_ads_data",
  meta: "pull_meta_ads",
  linkedin: "pull_linkedin_ads_data",
  microsoft: "pull_microsoft_ads",
  reddit: "pull_reddit_ads",
  tiktok: "pull_tiktok_ads",
  x: "pull_x_ads",
};

// Approximate date_range -> --days mapping. None of the 7 scripts accept a
// named date-range flag or exact calendar-month boundaries via a single flag
// (only --start-date/--end-date, which would need real date arithmetic this
// tool doesn't have inputs for) — this is a best-effort day-count that is
// still strictly more correct than the prior behavior of silently ignoring
// date_range entirely and falling back to each script's own --days default.
export const DATE_RANGE_TO_DAYS: Record<string, number> = {
  TODAY: 1,
  YESTERDAY: 1,
  LAST_7_DAYS: 7,
  LAST_30_DAYS: 30,
  THIS_MONTH: 31,
  LAST_MONTH: 31,
};
