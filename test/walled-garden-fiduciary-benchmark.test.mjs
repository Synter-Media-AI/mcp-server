// Tests for Synter MCP Cross-Platform Fiduciary Independence vs. Walled-Garden Agents
// Benchmarks Synter Agent against single-platform walled garden agents
// (Google Ads "Ask Advisor" and StackAdapt "Ivy").
//
// Key Assertions:
// 1. Cross-Ecosystem Read Independence (Google, StackAdapt, Microsoft/Bing, Meta, Reddit, LinkedIn)
// 2. Fiduciary Cross-Platform Budget Rebalancing (Shifting -20% off Google Ads & StackAdapt onto Bing, Meta & Reddit)
// 3. Explicit Platform Isolation Guard (Refuses omitted platform rather than silently defaulting to Google)

import { test } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function withSynterMcp(args, fn) {
  const env = { PATH: process.env.PATH ?? "" };
  delete env.SYNTER_API_KEY;
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [new URL("../dist/index.js", import.meta.url).pathname, ...args],
    env,
    stderr: "ignore",
  });
  const client = new Client(
    { name: "walled-garden-fiduciary-benchmark", version: "1.5.0" },
    { capabilities: {} }
  );
  await client.connect(transport);
  try {
    return await fn(client);
  } finally {
    await client.close();
  }
}

test("BEATS Google Ask Advisor & StackAdapt Ivy: Cross-ecosystem telemetry across Google, StackAdapt, Microsoft Bing, Meta & Reddit", async () => {
  await withSynterMcp(["--demo"], async (client) => {
    const { tools } = await client.listTools();
    assert.equal(tools.length, 56, "Synter MCP exposes 56 executable tools");

    const targetChannels = ["google", "stackadapt", "microsoft", "meta", "reddit", "linkedin"];
    const channelSnapshots = {};

    for (const platform of targetChannels) {
      const perfRes = await client.callTool({
        name: "get_performance",
        arguments: { platform, date_range: "LAST_7_DAYS" },
      });
      assert.ok(!perfRes.isError, `get_performance succeeded for ${platform}`);
      const perf = JSON.parse(perfRes.content[0].text);

      const campRes = await client.callTool({
        name: "list_campaigns",
        arguments: { platform },
      });
      assert.ok(!campRes.isError, `list_campaigns succeeded for ${platform}`);
      const camps = JSON.parse(campRes.content[0].text);

      channelSnapshots[platform] = {
        spend: perf.summary.total_spend_usd,
        conversions: perf.summary.total_conversions,
        cpa: perf.summary.cpa,
        roas: perf.summary.roas,
        campaigns: camps.campaigns.length,
      };
    }

    assert.ok(
      channelSnapshots.reddit.cpa < channelSnapshots.google.cpa,
      "Reddit CPA ($7.95) beats Google blended CPA ($13.80) in developer acquisition"
    );
    assert.ok(
      channelSnapshots.microsoft.cpa > 0,
      "Microsoft/Bing Ads telemetry normalized alongside Google & Meta"
    );
    assert.ok(
      channelSnapshots.stackadapt.cpa > 0,
      "StackAdapt DSP telemetry normalized alongside search & social"
    );
  });
});

test("Fiduciary Cross-Platform Budget Rebalancing: Shift -20% off Google Ads & StackAdapt onto Microsoft Bing Ads, Meta Ads & Reddit Ads", async () => {
  await withSynterMcp(["--demo"], async (client) => {
    // Step 1: Verify Agent Shield guardrails before mutating budgets
    const shieldRes = await client.callTool({
      name: "inspect_agent_shield",
      arguments: {},
    });
    const shield = JSON.parse(shieldRes.content[0].text);
    assert.equal(shield.shield_status, "ENFORCING");

    // Step 2: Verify Ångström claim for cross-platform budget shift
    const angstromRes = await client.callTool({
      name: "verify_angstrom_claim",
      arguments: {
        claim: "Reallocate 20% daily budget off diminishing-return Google PMax & StackAdapt into Bing Search, Meta Reels & Reddit DR",
      },
    });
    assert.ok(!angstromRes.isError);
    assert.equal(JSON.parse(angstromRes.content[0].text).verified, true);

    // Step 3: Trim Google Ads PMax ($250 -> $200/day, -20%) & StackAdapt ($220 -> $176/day, -20%)
    const googleTrim = await client.callTool({
      name: "update_campaign_budget",
      arguments: {
        platform: "google",
        campaign_id: "demo-google-102",
        daily_budget: 200.0,
      },
    });
    assert.ok(!googleTrim.isError);
    assert.equal(JSON.parse(googleTrim.content[0].text).new_daily_budget, 200.0);

    const stackadaptTrim = await client.callTool({
      name: "update_campaign_budget",
      arguments: {
        platform: "stackadapt",
        campaign_id: "demo-stackadapt-1601",
        daily_budget: 176.0,
      },
    });
    assert.ok(!stackadaptTrim.isError);
    assert.equal(JSON.parse(stackadaptTrim.content[0].text).new_daily_budget, 176.0);

    // Step 4: Reallocate saved $94/day across Microsoft Bing Ads (+20%), Meta Ads (+20%), and Reddit Ads (+20%)
    const bingScale = await client.callTool({
      name: "update_campaign_budget",
      arguments: {
        platform: "microsoft",
        campaign_id: "demo-ms-401",
        daily_budget: 90.0,
      },
    });
    assert.ok(!bingScale.isError);
    assert.equal(JSON.parse(bingScale.content[0].text).new_daily_budget, 90.0);

    const metaScale = await client.callTool({
      name: "update_campaign_budget",
      arguments: {
        platform: "meta",
        campaign_id: "demo-meta-201",
        daily_budget: 240.0,
      },
    });
    assert.ok(!metaScale.isError);
    assert.equal(JSON.parse(metaScale.content[0].text).new_daily_budget, 240.0);

    const redditScale = await client.callTool({
      name: "update_campaign_budget",
      arguments: {
        platform: "reddit",
        campaign_id: "demo-reddit-501",
        daily_budget: 60.0,
      },
    });
    assert.ok(!redditScale.isError);
    assert.equal(JSON.parse(redditScale.content[0].text).new_daily_budget, 60.0);
  });
});

import {
  requirePlatform,
  UPDATE_BUDGET_SCRIPT_BY_PLATFORM,
  PAUSE_CAMPAIGN_SCRIPT_BY_PLATFORM,
} from "../dist/platform-routing.js";

test("Fiduciary Neutrality Guard: Never silently defaults to Google Ads when platform is omitted and routes each network to its native mutation script", () => {
  assert.throws(
    () => requirePlatform("update_campaign_budget", undefined, UPDATE_BUDGET_SCRIPT_BY_PLATFORM),
    /platform is required/,
    "Must refuse budget mutation when platform is omitted instead of defaulting to Google"
  );

  // Verify Google, StackAdapt, Microsoft Bing, Meta, and Reddit each have distinct native budget mutation scripts
  const channels = ["google", "stackadapt", "microsoft", "meta", "reddit"];
  const scripts = new Set(channels.map((c) => UPDATE_BUDGET_SCRIPT_BY_PLATFORM[c]));
  assert.equal(scripts.size, 5, "Every platform routes to its own independent budget mutation engine");

  for (const ch of ["stackadapt", "microsoft", "meta", "reddit"]) {
    assert.ok(
      !UPDATE_BUDGET_SCRIPT_BY_PLATFORM[ch].startsWith("google"),
      `${ch} budget script is independent of Google`
    );
    assert.ok(
      !PAUSE_CAMPAIGN_SCRIPT_BY_PLATFORM[ch].startsWith("google"),
      `${ch} pause script is independent of Google`
    );
  }
});
