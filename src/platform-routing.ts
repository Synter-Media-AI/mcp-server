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
// (always dispatched to Google regardless of `platform`), plus a second,
// independent bug: it forwarded a `--date-range` flag that NONE of the
// underlying scripts actually define (every one of the 7 confirmed real
// scripts below takes --days / --start-date / --end-date instead — the
// date_range enum was silently dropped by argparse on every prior call).
//
// The "_data" suffix note that used to sit here was WRONG, and it is the
// reason google and linkedin shipped broken. These values are backend SCRIPT
// NAMES — the `script_name` field POSTed to /api/v1/tools/run — not the .py
// FILENAMES. runner.py maps `"pull_google_ads": "pull_google_ads_data.py"` and
// `"pull_linkedin_ads": "pull_linkedin_ads_data.py"`: the key is the wire
// name, the value is the file. Reading the value off the map and shipping it
// made get_performance return 400 UNKNOWN_TOOL for google and linkedin on
// every call since the routing fix landed. Verified against
// apps/ppc-backend/script_catalog.json and live via inspect_script:
// pull_google_ads_data is not in the whitelist; pull_google_ads is.
export const GET_PERFORMANCE_SCRIPT_BY_PLATFORM: Record<string, string> = {
  google: "pull_google_ads",
  meta: "pull_meta_ads",
  linkedin: "pull_linkedin_ads",
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
