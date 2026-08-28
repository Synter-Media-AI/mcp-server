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

// Date-range resolution.
//
// The previous mapping collapsed every named range onto a rolling `--days`
// count, which made three of the six ranges wrong: THIS_MONTH and LAST_MONTH
// both resolved to a trailing 31 days rather than calendar-month boundaries
// (so LAST_MONTH never once returned last month), and YESTERDAY resolved to
// `--days 1`, which is TODAY — a partial, still-accumulating day reported as
// a closed one.
//
// Every one of the 7 confirmed pull_* scripts declares --start-date and
// --end-date (verified against apps/ppc-backend/script_catalog.json), so the
// calendar-anchored ranges are now emitted as explicit boundaries. The two
// genuinely rolling ranges keep --days, because that is what they mean.
//
// TIMEZONE: boundaries are computed in UTC. Ad platforms report in the ad
// account's own timezone, so a UTC calendar month can differ from the
// account's calendar month by a few hours at each edge. UTC is chosen because
// it is deterministic and stated, rather than silently inheriting whatever
// timezone the machine running this MCP server happens to sit in. Callers who
// need account-timezone boundaries should pass explicit dates upstream.
export const ROLLING_DATE_RANGE_DAYS: Record<string, number> = {
  LAST_7_DAYS: 7,
  LAST_30_DAYS: 30,
};

export const CALENDAR_DATE_RANGES = [
  "TODAY",
  "YESTERDAY",
  "THIS_MONTH",
  "LAST_MONTH",
] as const;

function utcDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day));
}

/**
 * Resolve a named date_range to the CLI flags the backend scripts accept.
 *
 * Returns [] for an unrecognized range, which preserves the prior behavior of
 * letting the script fall back to its own --days default rather than failing
 * the call.
 *
 * `now` is injectable so the calendar arithmetic is testable without freezing
 * the clock.
 */
export function resolveDateRangeArgs(
  range: string,
  now: Date = new Date(),
): string[] {
  const rollingDays = ROLLING_DATE_RANGE_DAYS[range];
  if (rollingDays) return ["--days", String(rollingDays)];

  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const day = now.getUTCDate();

  switch (range) {
    case "TODAY": {
      const today = utcDay(utcDate(year, month, day));
      return ["--start-date", today, "--end-date", today];
    }
    case "YESTERDAY": {
      // day - 1 rolls back across month and year boundaries on its own.
      const yesterday = utcDay(utcDate(year, month, day - 1));
      return ["--start-date", yesterday, "--end-date", yesterday];
    }
    case "THIS_MONTH": {
      // First of this month through today. The month is still open, so the
      // end is today, not the last day of the month.
      return [
        "--start-date", utcDay(utcDate(year, month, 1)),
        "--end-date", utcDay(utcDate(year, month, day)),
      ];
    }
    case "LAST_MONTH": {
      // Day 0 of this month is the last day of the previous month.
      return [
        "--start-date", utcDay(utcDate(year, month - 1, 1)),
        "--end-date", utcDay(utcDate(year, month, 0)),
      ];
    }
    default:
      return [];
  }
}

// get_performance exposes a `campaign_id` filter, but only two of the seven
// pull_* scripts declare --campaign-id (google and x; verified against
// script_catalog.json). The previous code forwarded the flag for google and
// SILENTLY DROPPED it for the other five, so a caller filtering to one
// campaign got whole-account totals back with nothing to indicate the filter
// had been ignored — a wrong number that looks right. Unsupported platforms
// now fail loudly instead.
export const PERFORMANCE_CAMPAIGN_FILTER_PLATFORMS: ReadonlySet<string> =
  new Set(["google", "x"]);

// Write routes. pause_campaign and update_campaign_budget both advertise the
// full 7-platform enum as a REQUIRED argument and describe themselves as
// working "across all connected platforms", while hardcoding platform:
// "google" and discarding the caller's value. An agent asked to pause a
// Reddit campaign therefore issued a GOOGLE pause carrying a Reddit campaign
// id. Script names and flags below are read from
// apps/ppc-backend/script_catalog.json, not guessed.
//
// Note google's own pause script is `google_ads_pause_campaign`; the
// unqualified `pause_campaign` is the same Google-only tool under its legacy
// name, and `update_campaign_budget` is likewise Google-only. Neither accepts
// a --platform flag, which is why per-platform routing is required rather
// than forwarding a platform argument.
export const PAUSE_CAMPAIGN_SCRIPT_BY_PLATFORM: Record<string, string> = {
  google: "google_ads_pause_campaign",
  meta: "meta_ads_update_campaign",
  linkedin: "linkedin_ads_update_campaign",
  microsoft: "microsoft_ads_update_campaign",
  reddit: "reddit_ads_update_campaign",
  tiktok: "tiktok_ads_update_campaign",
  x: "x_ads_update_campaign",
};

// x_ads_update_campaign declares --status (ACTIVE/PAUSED) and no --action;
// the other six declare --action with a "pause" choice.
const PAUSE_VIA_STATUS_FLAG: ReadonlySet<string> = new Set(["x"]);

export function pauseCampaignArgs(platform: string, campaignId: string): string[] {
  const args = ["--campaign-id", campaignId];
  return PAUSE_VIA_STATUS_FLAG.has(platform)
    ? [...args, "--status", "PAUSED"]
    : [...args, "--action", "pause"];
}

// All seven budget scripts declare --campaign-id and --daily-budget.
export const UPDATE_BUDGET_SCRIPT_BY_PLATFORM: Record<string, string> = {
  google: "update_campaign_budget",
  meta: "meta_ads_update_campaign",
  linkedin: "linkedin_ads_update_campaign",
  microsoft: "microsoft_ads_update_campaign",
  reddit: "reddit_ads_update_campaign",
  tiktok: "tiktok_ads_update_campaign",
  x: "x_ads_update_campaign",
};

export function updateBudgetArgs(campaignId: string, dailyBudget: number | string): string[] {
  return ["--campaign-id", campaignId, "--daily-budget", String(dailyBudget)];
}
