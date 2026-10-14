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
  "pinterest",
  "snapchat",
  "spotify",
  "amazon_ads",
  "amazon_dsp",
  "the_trade_desk",
  "openai",
  "dv360",
  "stackadapt",
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
    pinterest: "pinterest_ads_get_campaigns",
    snapchat: "snap_ads_list_campaigns",
    spotify: "spotify_ads_get_campaigns",
    amazon_ads: "amazon_ads_get_campaigns",
    amazon_dsp: "amazon_dsp_list_orders",
    the_trade_desk: "trade_desk_list_campaigns",
    openai: "openai_ads_get_campaigns",
    dv360: "dv360_list_campaigns",
    stackadapt: "stackadapt_get_campaigns",
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
// /api/v1/tools/run), NOT the .py filenames.
test("get_performance maps each platform to the backend SCRIPT NAME, not the .py filename", () => {
  assert.deepEqual(GET_PERFORMANCE_SCRIPT_BY_PLATFORM, {
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
  });
});

test("no mapped script name is a .py filename stem that differs from its wire name", () => {
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
  assert.deepEqual(
    resolveDateRangeArgs("TODAY", new Date("2026-03-14T09:30:00Z"), "stackadapt"),
    ["--from", "2026-03-14", "--to", "2026-03-14"],
  );
  assert.deepEqual(
    resolveDateRangeArgs("TODAY", new Date("2026-03-14T09:30:00Z"), "openai"),
    ["--since", "2026-03-14", "--until", "2026-03-14"],
  );
});

test("LAST_MONTH is the previous calendar month, not a trailing 31 days", () => {
  assert.deepEqual(
    resolveDateRangeArgs("LAST_MONTH", new Date("2026-03-14T09:30:00Z")),
    ["--start-date", "2026-02-01", "--end-date", "2026-02-28"],
  );
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
  assert.equal(
    PAUSE_CAMPAIGN_SCRIPT_BY_PLATFORM.stackadapt,
    "stackadapt_pause_campaign",
  );
  for (const p of ADVERTISED_PLATFORMS.filter((x) => x !== "google")) {
    assert.ok(
      !PAUSE_CAMPAIGN_SCRIPT_BY_PLATFORM[p].startsWith("google"),
      `${p} still routes to a Google script`,
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
  assert.equal(
    UPDATE_BUDGET_SCRIPT_BY_PLATFORM.stackadapt,
    "stackadapt_update_campaign_budget",
  );
  for (const p of ADVERTISED_PLATFORMS.filter((x) => x !== "google")) {
    assert.ok(
      !UPDATE_BUDGET_SCRIPT_BY_PLATFORM[p].startsWith("google"),
      `${p} still routes to a Google script`,
    );
  }
});

test("pause args use the flag each platform's script actually declares", () => {
  assert.deepEqual(pauseCampaignArgs("google", "123"), [
    "--campaign-id",
    "123",
    "--action",
    "pause",
  ]);
  assert.deepEqual(pauseCampaignArgs("x", "abc"), [
    "--campaign-id",
    "abc",
    "--status",
    "PAUSED",
  ]);
  assert.deepEqual(pauseCampaignArgs("stackadapt", "sa-99"), [
    "--campaign-id",
    "sa-99",
    "--state",
    "PAUSED",
  ]);
  assert.deepEqual(pauseCampaignArgs("openai", "oa-1"), [
    "--campaign-id",
    "oa-1",
    "--status",
    "paused",
  ]);
});

test("budget args use the flag each platform's script declares", () => {
  assert.deepEqual(updateBudgetArgs("123", 50), [
    "--campaign-id",
    "123",
    "--daily-budget",
    "50",
  ]);
  assert.deepEqual(updateBudgetArgs("sa-1", 80, "stackadapt"), [
    "--campaign-id",
    "sa-1",
    "--budget",
    "80",
    "--budget-type",
    "DAILY",
  ]);
  assert.deepEqual(updateBudgetArgs("ttd-1", 100, "the_trade_desk"), [
    "--campaign-id",
    "ttd-1",
    "--budget",
    "100",
  ]);
});

test("only platforms whose script declares --campaign-id accept the filter", () => {
  assert.ok(PERFORMANCE_CAMPAIGN_FILTER_PLATFORMS.has("google"));
  assert.ok(PERFORMANCE_CAMPAIGN_FILTER_PLATFORMS.has("x"));
  assert.ok(PERFORMANCE_CAMPAIGN_FILTER_PLATFORMS.has("stackadapt"));
  assert.ok(PERFORMANCE_CAMPAIGN_FILTER_PLATFORMS.has("amazon_dsp"));
  assert.ok(PERFORMANCE_CAMPAIGN_FILTER_PLATFORMS.has("openai"));
  for (const p of ["meta", "linkedin", "microsoft", "reddit", "tiktok", "pinterest", "snapchat"]) {
    assert.ok(
      !PERFORMANCE_CAMPAIGN_FILTER_PLATFORMS.has(p),
      `${p} claims campaign_id support its pull_* script does not declare`,
    );
  }
});

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
    assert.throws(() => requirePlatform(tool, undefined, table), (err) => {
      assert.ok(!/^google$/.test(String(err)), "defaulted to google");
      assert.match(String(err), /does not aggregate across/);
      return true;
    });
  }
});

test("requirePlatform normalizes case, whitespace, and synonyms, but rejects unknowns", () => {
  assert.equal(
    requirePlatform("list_campaigns", "  Reddit ", LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM),
    "reddit",
  );
  assert.equal(
    requirePlatform("list_campaigns", "StackAdapt", LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM),
    "stackadapt",
  );
  assert.equal(
    requirePlatform("list_campaigns", "snap", LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM),
    "snapchat",
  );
  assert.equal(
    requirePlatform("list_campaigns", "amazon", LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM),
    "amazon_ads",
  );
  assert.equal(
    requirePlatform("list_campaigns", "trade_desk", LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM),
    "the_trade_desk",
  );
  assert.throws(
    () => requirePlatform("list_campaigns", "myspace", LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM),
    /unsupported platform "myspace"/,
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

test("prototype-chain keys are refused, not resolved", () => {
  for (const key of ["constructor", "__proto__", "toString", "valueOf", "hasOwnProperty"]) {
    assert.throws(
      () => requirePlatform("list_campaigns", key, LIST_CAMPAIGNS_SCRIPT_BY_PLATFORM),
      /unsupported platform/,
      `requirePlatform resolved prototype key "${key}" instead of refusing`,
    );
    assert.deepEqual(
      resolveDateRangeArgs(key, new Date("2026-03-14T00:00:00Z")),
      [],
      `resolveDateRangeArgs resolved prototype key "${key}"`,
    );
  }
});
