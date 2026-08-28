// Regression test for the "hardcoded to Google despite advertising 7
// platforms" bug in list_campaigns and get_performance (and the dropped
// --platform argument in get_daily_spend). Locks in the exact script names
// verified to exist in apps/ppc-backend/client-tools/ at fix time — a typo
// here would silently route a platform to the wrong script or to nothing.
//
// Run: npm run build && node --test test/platform-routing.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM,
  GET_PERFORMANCE_SCRIPT_BY_PLATFORM,
  PERFORMANCE_CAMPAIGN_FILTER_PLATFORMS,
  PAUSE_CAMPAIGN_SCRIPT_BY_PLATFORM,
  UPDATE_BUDGET_SCRIPT_BY_PLATFORM,
  pauseCampaignArgs,
  updateBudgetArgs,
  resolveDateRangeArgs,
  ROLLING_DATE_RANGE_DAYS,
  requirePlatform,
  DAILY_SPEND_SCRIPT_BY_PLATFORM,
  ADVERTISED_PLATFORMS as ADVERTISED,
} from "../dist/platform-routing.js";

const ADVERTISED_PLATFORMS = [
  "google",
  "meta",
  "linkedin",
  "microsoft",
  "reddit",
  "tiktok",
  "x",
];

test("list_campaigns maps every advertised platform to a distinct real script", () => {
  for (const p of ADVERTISED_PLATFORMS) {
    assert.ok(
      LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM[p],
      `missing list_campaigns script for platform "${p}"`,
    );
  }
  // Every platform must route somewhere DIFFERENT — this is the exact bug
  // being fixed (everything silently collapsing onto one script).
  const scripts = Object.values(LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM);
  assert.equal(new Set(scripts).size, scripts.length, "duplicate script mapping");
});

test("list_campaigns script names match the verified apps/ppc-backend/client-tools/ files", () => {
  assert.deepEqual(LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM, {
    google: "google_ads_list_campaigns",
    meta: "meta_ads_list_campaigns",
    linkedin: "linkedin_ads_list_campaigns",
    microsoft: "microsoft_ads_list_campaigns",
    reddit: "reddit_ads_list_campaigns",
    tiktok: "tiktok_ads_list_campaigns",
    x: "x_ads_list_campaigns",
  });
});

test("get_performance maps every advertised platform to a distinct real script", () => {
  for (const p of ADVERTISED_PLATFORMS) {
    assert.ok(
      GET_PERFORMANCE_SCRIPT_BY_PLATFORM[p],
      `missing get_performance script for platform "${p}"`,
    );
  }
  const scripts = Object.values(GET_PERFORMANCE_SCRIPT_BY_PLATFORM);
  assert.equal(new Set(scripts).size, scripts.length, "duplicate script mapping");
});

// These are backend SCRIPT NAMES (the `script_name` field POSTed to
// /api/v1/tools/run), NOT the .py filenames. This test previously asserted the
// FILENAMES -- runner.py maps `"pull_google_ads": "pull_google_ads_data.py"`,
// key is the wire name and value is the file -- so it locked in the bug it was
// supposed to prevent: google and linkedin returned 400 UNKNOWN_TOOL on every
// get_performance call. Verified live with inspect_script.
test("get_performance maps each platform to the backend SCRIPT NAME, not the .py filename", () => {
  assert.deepEqual(GET_PERFORMANCE_SCRIPT_BY_PLATFORM, {
    google: "pull_google_ads",
    meta: "pull_meta_ads",
    linkedin: "pull_linkedin_ads",
    microsoft: "pull_microsoft_ads",
    reddit: "pull_reddit_ads",
    tiktok: "pull_tiktok_ads",
    x: "pull_x_ads",
  });
});

test("no mapped script name is a .py filename stem that differs from its wire name", () => {
  // The two that bit us. Guarding the shape, not just the values, so a future
  // edit that reintroduces a "_data" filename fails here by name.
  for (const [platform, script] of Object.entries(GET_PERFORMANCE_SCRIPT_BY_PLATFORM)) {
    assert.ok(
      !script.endsWith("_data"),
      `${platform} maps to "${script}", which looks like a .py filename stem. ` +
        "Use the WHITELISTED_SCRIPTS key from apps/ppc-backend/scripts/runner.py.",
    );
  }
});

test("every advertised date_range resolves to flags the pull_* scripts accept", () => {
  for (const range of [
    "TODAY",
    "YESTERDAY",
    "LAST_7_DAYS",
    "LAST_30_DAYS",
    "THIS_MONTH",
    "LAST_MONTH",
  ]) {
    const args = resolveDateRangeArgs(range, new Date("2026-03-14T09:30:00Z"));
    assert.ok(args.length > 0, `date_range "${range}" resolved to nothing`);
    const flag = args[0];
    assert.ok(
      flag === "--days" || flag === "--start-date",
      `date_range "${range}" emitted unexpected flag "${flag}"`,
    );
  }
});

// The bug: THIS_MONTH and LAST_MONTH both resolved to a rolling 31 days, so
// LAST_MONTH never once returned last month. Mid-month reference date so a
// trailing-31-day window and the real calendar month cannot coincide.
test("LAST_MONTH is the previous calendar month, not a trailing 31 days", () => {
  assert.deepEqual(
    resolveDateRangeArgs("LAST_MONTH", new Date("2026-03-14T09:30:00Z")),
    ["--start-date", "2026-02-01", "--end-date", "2026-02-28"],
  );
  // Leap February, and a January reference that must roll the year back.
  assert.deepEqual(
    resolveDateRangeArgs("LAST_MONTH", new Date("2024-03-10T00:00:00Z")),
    ["--start-date", "2024-02-01", "--end-date", "2024-02-29"],
  );
  assert.deepEqual(
    resolveDateRangeArgs("LAST_MONTH", new Date("2026-01-20T00:00:00Z")),
    ["--start-date", "2025-12-01", "--end-date", "2025-12-31"],
  );
});

test("THIS_MONTH runs from the 1st to today, not a trailing 31 days", () => {
  assert.deepEqual(
    resolveDateRangeArgs("THIS_MONTH", new Date("2026-03-14T09:30:00Z")),
    ["--start-date", "2026-03-01", "--end-date", "2026-03-14"],
  );
});

// The bug: YESTERDAY mapped to `--days 1`, which is TODAY — a partial,
// still-accumulating day handed back as a closed one.
test("YESTERDAY is the day before today, and is not TODAY", () => {
  const ref = new Date("2026-03-14T09:30:00Z");
  assert.deepEqual(
    resolveDateRangeArgs("YESTERDAY", ref),
    ["--start-date", "2026-03-13", "--end-date", "2026-03-13"],
  );
  assert.notDeepEqual(
    resolveDateRangeArgs("YESTERDAY", ref),
    resolveDateRangeArgs("TODAY", ref),
  );
  // Rolls back across a month boundary.
  assert.deepEqual(
    resolveDateRangeArgs("YESTERDAY", new Date("2026-03-01T00:00:00Z")),
    ["--start-date", "2026-02-28", "--end-date", "2026-02-28"],
  );
});

test("genuinely rolling ranges still use --days", () => {
  const ref = new Date("2026-03-14T09:30:00Z");
  assert.deepEqual(resolveDateRangeArgs("LAST_7_DAYS", ref), ["--days", "7"]);
  assert.deepEqual(resolveDateRangeArgs("LAST_30_DAYS", ref), ["--days", "30"]);
  assert.deepEqual(Object.keys(ROLLING_DATE_RANGE_DAYS).sort(), [
    "LAST_30_DAYS",
    "LAST_7_DAYS",
  ]);
});

test("an unknown date_range resolves to no flags rather than throwing", () => {
  assert.deepEqual(resolveDateRangeArgs("SINCE_THE_BEGINNING", new Date()), []);
});

// The bug: pause_campaign and update_campaign_budget advertised the full
// 7-platform enum as REQUIRED, described themselves as working across all
// connected platforms, and then hardcoded platform: "google" — so a Reddit
// campaign id was sent to a Google pause.
test("pause_campaign routes every advertised platform to its own script", () => {
  for (const p of ADVERTISED_PLATFORMS) {
    assert.ok(
      PAUSE_CAMPAIGN_SCRIPT_BY_PLATFORM[p],
      `missing pause script for platform "${p}"`,
    );
  }
  assert.equal(
    PAUSE_CAMPAIGN_SCRIPT_BY_PLATFORM.google,
    "google_ads_pause_campaign",
  );
  // Non-Google platforms must NOT collapse back onto a Google script.
  for (const p of ADVERTISED_PLATFORMS.filter((x) => x !== "google")) {
    assert.ok(
      !PAUSE_CAMPAIGN_SCRIPT_BY_PLATFORM[p].startsWith("google"),
      `${p} still routes to a Google script`,
    );
    assert.ok(
      PAUSE_CAMPAIGN_SCRIPT_BY_PLATFORM[p].startsWith(
        p === "x" ? "x_ads" : p === "meta" ? "meta_ads" : p,
      ),
      `${p} routes to an unrelated script: ${PAUSE_CAMPAIGN_SCRIPT_BY_PLATFORM[p]}`,
    );
  }
});

test("update_campaign_budget routes every advertised platform to its own script", () => {
  for (const p of ADVERTISED_PLATFORMS) {
    assert.ok(
      UPDATE_BUDGET_SCRIPT_BY_PLATFORM[p],
      `missing budget script for platform "${p}"`,
    );
  }
  assert.equal(
    UPDATE_BUDGET_SCRIPT_BY_PLATFORM.google,
    "update_campaign_budget",
  );
  for (const p of ADVERTISED_PLATFORMS.filter((x) => x !== "google")) {
    assert.ok(
      !UPDATE_BUDGET_SCRIPT_BY_PLATFORM[p].startsWith("google"),
      `${p} still routes to a Google script`,
    );
  }
});

// Flags are read off script_catalog.json, so a wrong one is a 400 at runtime.
test("pause args use the flag each platform's script actually declares", () => {
  assert.deepEqual(pauseCampaignArgs("google", "123"), [
    "--campaign-id",
    "123",
    "--action",
    "pause",
  ]);
  // x_ads_update_campaign declares --status and no --action.
  assert.deepEqual(pauseCampaignArgs("x", "abc"), [
    "--campaign-id",
    "abc",
    "--status",
    "PAUSED",
  ]);
});

test("budget args use --daily-budget, the flag the scripts declare", () => {
  assert.deepEqual(updateBudgetArgs("123", 50), [
    "--campaign-id",
    "123",
    "--daily-budget",
    "50",
  ]);
});

// The bug: campaign_id was forwarded for google and silently DROPPED for the
// other five, so a filtered request returned account-wide totals.
test("only platforms whose script declares --campaign-id accept the filter", () => {
  assert.ok(PERFORMANCE_CAMPAIGN_FILTER_PLATFORMS.has("google"));
  assert.ok(PERFORMANCE_CAMPAIGN_FILTER_PLATFORMS.has("x"));
  for (const p of ["meta", "linkedin", "microsoft", "reddit", "tiktok"]) {
    assert.ok(
      !PERFORMANCE_CAMPAIGN_FILTER_PLATFORMS.has(p),
      `${p} claims campaign_id support its pull_* script does not declare`,
    );
  }
});

// The bug: list_campaigns, get_performance and get_daily_spend all declared
// `platform` OPTIONAL and silently fell back to Google, while describing
// themselves as covering "all connected ad platforms". A six-platform
// advertiser asked for everything, got Google, and could not tell from the
// response. No silent default is the fix; aggregation is a separate feature.
test("an omitted platform is refused, never defaulted to Google", () => {
  for (const [tool, table] of [
    ["list_campaigns", LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM],
    ["get_performance", GET_PERFORMANCE_SCRIPT_BY_PLATFORM],
    ["get_daily_spend", DAILY_SPEND_SCRIPT_BY_PLATFORM],
  ]) {
    for (const missing of [undefined, null, "", "   ", 7]) {
      assert.throws(
        () => requirePlatform(tool, missing, table),
        /platform is required/,
        `${tool} accepted ${JSON.stringify(missing)} instead of refusing`,
      );
    }
    // The refusal must not quietly resolve to google either.
    assert.throws(() => requirePlatform(tool, undefined, table), (err) => {
      assert.ok(!/^google$/.test(String(err)), "defaulted to google");
      assert.match(String(err), /does not aggregate across/);
      return true;
    });
  }
});

test("requirePlatform normalizes case and whitespace but rejects unknowns", () => {
  assert.equal(
    requirePlatform("list_campaigns", "  Reddit ", LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM),
    "reddit",
  );
  assert.throws(
    () => requirePlatform("list_campaigns", "snapchat", LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM),
    /unsupported platform "snapchat"/,
  );
});

test("every routing table covers exactly the advertised platform enum", () => {
  for (const table of [
    LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM,
    GET_PERFORMANCE_SCRIPT_BY_PLATFORM,
    PAUSE_CAMPAIGN_SCRIPT_BY_PLATFORM,
    UPDATE_BUDGET_SCRIPT_BY_PLATFORM,
    DAILY_SPEND_SCRIPT_BY_PLATFORM,
  ]) {
    assert.deepEqual(Object.keys(table).sort(), [...ADVERTISED].sort());
  }
});
