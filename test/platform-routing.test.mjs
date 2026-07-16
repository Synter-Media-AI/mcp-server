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
  DATE_RANGE_TO_DAYS,
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

test("get_performance script names match the verified apps/ppc-backend/client-tools/ files (naming is NOT uniform)", () => {
  assert.deepEqual(GET_PERFORMANCE_SCRIPT_BY_PLATFORM, {
    google: "pull_google_ads_data",
    meta: "pull_meta_ads",
    linkedin: "pull_linkedin_ads_data",
    microsoft: "pull_microsoft_ads",
    reddit: "pull_reddit_ads",
    tiktok: "pull_tiktok_ads",
    x: "pull_x_ads",
  });
});

test("date_range values used by the tool schema all convert to a positive day count", () => {
  for (const range of [
    "TODAY",
    "YESTERDAY",
    "LAST_7_DAYS",
    "LAST_30_DAYS",
    "THIS_MONTH",
    "LAST_MONTH",
  ]) {
    assert.ok(
      DATE_RANGE_TO_DAYS[range] > 0,
      `date_range "${range}" does not map to a positive --days value`,
    );
  }
});
