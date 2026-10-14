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
  pinterest: "pinterest_ads_get_campaigns",
  snapchat: "snap_ads_list_campaigns",
  spotify: "spotify_ads_get_campaigns",
  amazon_ads: "amazon_ads_get_campaigns",
  amazon_dsp: "amazon_dsp_list_orders",
  the_trade_desk: "trade_desk_list_campaigns",
  openai: "openai_ads_get_campaigns",
  dv360: "dv360_list_campaigns",
  stackadapt: "stackadapt_get_campaigns",
};

// get_performance had the SAME hardcoded-to-Google bug as list_campaigns
// (always dispatched to Google regardless of `platform`), plus a second,
// independent bug: it forwarded a `--date-range` flag that NONE of the
// underlying scripts actually define (every one of the real scripts below
// takes --days / --start-date / --end-date / --from / --to / --since / --until
// instead — the date_range enum was silently dropped by argparse on every
// prior call).
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
  pinterest: "pull_pinterest_ads",
  snapchat: "snap_ads_get_report",
  spotify: "spotify_ads_get_performance",
  amazon_ads: "pull_amazon_ads",
  amazon_dsp: "amazon_dsp_pull_metrics",
  the_trade_desk: "trade_desk_pull_metrics",
  openai: "pull_openai_ads",
  dv360: "pull_dv360",
  stackadapt: "stackadapt_pull_metrics",
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
// Every one of the confirmed pull_* scripts declares explicit start/end flags
// (--start-date/--end-date, or --from/--to on stackadapt, or --since/--until
// on openai; verified against apps/ppc-backend/script_catalog.json), so the
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

/**
 * Own-property lookup. A bare `table[key]` walks the prototype chain, so
 * `platform: "constructor"` resolves to Object's constructor -- truthy, so it
 * passes a `if (!table[key])` guard -- and `date_range: "toString"` resolves to
 * a function that then gets stringified straight into a CLI flag value. Neither
 * is exploitable (the backend rejects the garbage), but both turn a clean
 * "unsupported platform" error into a confusing downstream failure, and the
 * lookup should never see anything it did not define.
 */
export function own<T>(table: Record<string, T>, key: string): T | undefined {
  return Object.prototype.hasOwnProperty.call(table, key)
    ? table[key]
    : undefined;
}

function utcDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day));
}

function dateBoundaryFlags(platform?: string): [string, string] {
  if (platform === "stackadapt") return ["--from", "--to"];
  if (platform === "openai") return ["--since", "--until"];
  return ["--start-date", "--end-date"];
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
  platform?: string,
): string[] {
  const rollingDays = own(ROLLING_DATE_RANGE_DAYS, range);
  if (rollingDays) {
    if (platform === "the_trade_desk" || platform === "spotify") {
      // trade_desk_pull_metrics and spotify_ads_get_performance require explicit --start-date/--end-date
      const year = now.getUTCFullYear();
      const month = now.getUTCMonth();
      const day = now.getUTCDate();
      const end = utcDay(utcDate(year, month, day));
      const start = utcDay(utcDate(year, month, day - rollingDays));
      return ["--start-date", start, "--end-date", end];
    }
    return ["--days", String(rollingDays)];
  }

  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const day = now.getUTCDate();
  const [startFlag, endFlag] = dateBoundaryFlags(platform);

  switch (range) {
    case "TODAY": {
      const today = utcDay(utcDate(year, month, day));
      return [startFlag, today, endFlag, today];
    }
    case "YESTERDAY": {
      // day - 1 rolls back across month and year boundaries on its own.
      const yesterday = utcDay(utcDate(year, month, day - 1));
      return [startFlag, yesterday, endFlag, yesterday];
    }
    case "THIS_MONTH": {
      // First of this month through today. The month is still open, so the
      // end is today, not the last day of the month.
      return [
        startFlag, utcDay(utcDate(year, month, 1)),
        endFlag, utcDay(utcDate(year, month, day)),
      ];
    }
    case "LAST_MONTH": {
      // Day 0 of this month is the last day of the previous month.
      return [
        startFlag, utcDay(utcDate(year, month - 1, 1)),
        endFlag, utcDay(utcDate(year, month, 0)),
      ];
    }
    default:
      return [];
  }
}

// get_performance exposes a `campaign_id` filter, but only scripts that
// declare --campaign-id in script_catalog.json accept it. Unsupported platforms
// fail loudly rather than silently dropping the filter and returning whole-account totals.
export const PERFORMANCE_CAMPAIGN_FILTER_PLATFORMS: ReadonlySet<string> =
  new Set(["google", "x", "amazon_dsp", "openai", "stackadapt"]);

// Write routes. pause_campaign and update_campaign_budget route each
// advertised platform to its verified backend script and CLI flags from
// apps/ppc-backend/script_catalog.json.
export const PAUSE_CAMPAIGN_SCRIPT_BY_PLATFORM: Record<string, string> = {
  google: "google_ads_pause_campaign",
  meta: "meta_ads_update_campaign",
  linkedin: "linkedin_ads_update_campaign",
  microsoft: "microsoft_ads_update_campaign",
  reddit: "reddit_ads_update_campaign",
  tiktok: "tiktok_ads_update_campaign",
  x: "x_ads_update_campaign",
  pinterest: "pinterest_ads_update_campaign_status",
  snapchat: "snap_ads_pause_campaign",
  spotify: "spotify_ads_update_campaign_status",
  amazon_ads: "amazon_ads_update_campaign",
  amazon_dsp: "amazon_dsp_pause_order",
  the_trade_desk: "trade_desk_pause_campaign",
  openai: "openai_ads_update_campaign",
  dv360: "dv360_pause_campaign",
  stackadapt: "stackadapt_pause_campaign",
};

export function pauseCampaignArgs(platform: string, campaignId: string): string[] {
  const args = ["--campaign-id", campaignId];
  if (platform === "x") {
    return [...args, "--status", "PAUSED"];
  }
  if (platform === "openai") {
    return [...args, "--status", "paused"];
  }
  if (platform === "stackadapt") {
    return [...args, "--state", "PAUSED"];
  }
  return [...args, "--action", "pause"];
}

export const UPDATE_BUDGET_SCRIPT_BY_PLATFORM: Record<string, string> = {
  google: "update_campaign_budget",
  meta: "meta_ads_update_campaign",
  linkedin: "linkedin_ads_update_campaign",
  microsoft: "microsoft_ads_update_campaign",
  reddit: "reddit_ads_update_campaign",
  tiktok: "tiktok_ads_update_campaign",
  x: "x_ads_update_campaign",
  pinterest: "pinterest_ads_update_budget",
  snapchat: "snapchat_ads_update_campaign",
  spotify: "spotify_ads_update_budget",
  amazon_ads: "amazon_ads_update_campaign",
  amazon_dsp: "amazon_dsp_update_order_budget",
  the_trade_desk: "trade_desk_update_campaign_budget",
  openai: "openai_ads_update_campaign",
  dv360: "dv360_update_io_budget",
  stackadapt: "stackadapt_update_campaign_budget",
};

export function updateBudgetArgs(
  campaignId: string,
  dailyBudget: number | string,
  platform: string = "google",
): string[] {
  if (platform === "stackadapt") {
    return ["--campaign-id", campaignId, "--budget", String(dailyBudget), "--budget-type", "DAILY"];
  }
  if (platform === "amazon_ads" || platform === "amazon_dsp" || platform === "the_trade_desk") {
    return ["--campaign-id", campaignId, "--budget", String(dailyBudget)];
  }
  if (platform === "openai") {
    return ["--campaign-id", campaignId, "--budget-usd", String(dailyBudget)];
  }
  if (platform === "dv360") {
    return ["--io-id", campaignId, "--total-budget", String(dailyBudget)];
  }
  if (platform === "spotify") {
    return ["--ad-set-id", campaignId, "--daily-budget", String(dailyBudget)];
  }
  return ["--campaign-id", campaignId, "--daily-budget", String(dailyBudget)];
}

// Every advertised platform, in schema order. Exported so the tool schemas and
// the runtime cannot drift apart on what "supported" means.
export const ADVERTISED_PLATFORMS = [
  "google",
  "meta",
  "linkedin",
  "microsoft",
  "reddit",
  "tiktok",
  "x",
  "pinterest",
  "snapchat",
  "spotify",
  "amazon_ads",
  "amazon_dsp",
  "the_trade_desk",
  "openai",
  "dv360",
  "stackadapt",
] as const;

export const PLATFORM_SYNONYMS: Record<string, string> = {
  facebook: "meta",
  instagram: "meta",
  bing: "microsoft",
  twitter: "x",
  snap: "snapchat",
  amazon: "amazon_ads",
  trade_desk: "the_trade_desk",
  ttd: "the_trade_desk",
  thetradedesk: "the_trade_desk",
  openai_ads: "openai",
};

/**
 * Resolve the caller's `platform` argument, or refuse.
 */
export function requirePlatform(
  toolName: string,
  platform: unknown,
  table: Record<string, string>,
): string {
  const supported = Object.keys(table);
  if (typeof platform !== "string" || !platform.trim()) {
    throw new Error(
      `${toolName}: platform is required. Pass one of: ${supported.join(", ")}. ` +
      `This tool reports on one platform per call -- it does not aggregate across ` +
      `platforms, and it no longer defaults to Google. Call list_ad_accounts to see ` +
      `which platforms this workspace has connected.`,
    );
  }
  const rawNormalized = platform.trim().toLowerCase().replace(/-/g, "_");
  const normalized = own(PLATFORM_SYNONYMS, rawNormalized) ?? rawNormalized;
  if (own(table, normalized) === undefined) {
    throw new Error(
      `${toolName}: unsupported platform "${rawNormalized}". Supported: ${supported.join(", ")}.`,
    );
  }
  return normalized;
}

// get_account_daily_spend is ONE unified script that takes its own --platform
// flag, so unlike the tables above this maps every platform to the same script
// name. Kept as a table anyway so it validates through requirePlatform with
// the others and cannot drift from the advertised enum.
export const DAILY_SPEND_SCRIPT_BY_PLATFORM: Record<string, string> =
  Object.fromEntries(
    ADVERTISED_PLATFORMS.map((p) => [p, "get_account_daily_spend"]),
  );
