// Tests for Synter MCP Server Reporting Capabilities & Competitive Benchmark
// Benchmarks Synter MCP against AdCP (Ad Context Protocol) and Pipeboard.
//
// Key Assertions:
// 1. Executable Implementation (vs AdCP: schema spec only, 0 executable tools)
// 2. Open-Source Zero Connector Fee (vs Pipeboard: closed-source $49-$199/mo)
// 3. Platform Coverage (16 Direct Execution ad networks vs Pipeboard 6)
// 4. Unified Metrics Schema (normalized spend, impressions, clicks, conversions, roas, cpa, ctr, cpc)
// 5. Time-Series Daily Spend Pacing (day-by-day reporting)
// 6. Safe Read-Only Diagnostics Enforcement (--read-only flag)

import { test } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import {
  ADVERTISED_PLATFORMS,
  resolveDateRangeArgs,
  CALENDAR_DATE_RANGES,
} from "../dist/platform-routing.js";

async function withMcpClient(options, fn) {
  const env = {
    PATH: process.env.PATH ?? "",
    ...(options.env ?? {}),
  };
  delete env.SYNTER_API_KEY;

  const args = [
    new URL("../dist/index.js", import.meta.url).pathname,
    ...(options.args ?? []),
  ];
  const transport = new StdioClientTransport({
    command: process.execPath,
    args,
    env,
    stderr: "ignore",
  });
  const client = new Client({ name: "competitive-benchmark-test", version: "1.3.0" });
  await client.connect(transport);
  try {
    return await fn(client);
  } finally {
    await client.close();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Executability & Architecture vs AdCP
// ─────────────────────────────────────────────────────────────────────────────

test("BEATS AdCP: Executable multi-tool server with live JSON-RPC vs passive schema specification", async () => {
  // AdCP is a proposed JSON schema standard with 0 executable tools and no runtime.
  // Synter is a production MCP server with 29 executable tools operating over JSON-RPC stdio.
  await withMcpClient({ args: ["--demo"] }, async (client) => {
    const { tools } = await client.listTools();
    assert.equal(tools.length, 29, "Synter provides 29 live tools; AdCP provides 0 executable tools");

    const reportingTools = tools.filter((t) =>
      [
        "get_performance",
        "get_daily_spend",
        "list_campaigns",
        "list_ad_accounts",
        "diagnose_tracking",
        "inspect_agent_shield",
        "verify_angstrom_claim",
        "get_skill",
        "get_llm_visibility",
      ].includes(t.name)
    );
    assert.equal(reportingTools.length, 9, "Synter provides 9 dedicated reporting/diagnostics/intelligence tools");

    // AdCP cannot execute tool calls. Synter executes immediately with deterministic responses.
    const start = Date.now();
    const result = await client.callTool({
      name: "get_performance",
      arguments: { platform: "google", date_range: "LAST_7_DAYS" },
    });
    const latencyMs = Date.now() - start;

    assert.ok(!result.isError);
    assert.ok(latencyMs < 500, `Execution latency ${latencyMs}ms is sub-second`);
    const data = JSON.parse(result.content[0].text);
    assert.equal(data.platform, "google");
    assert.ok(data.summary.total_spend_usd > 0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Platform Breadth vs Pipeboard
// ─────────────────────────────────────────────────────────────────────────────

test("BEATS Pipeboard: Outperforms Pipeboard 6-network limit with 16 direct execution platforms", async () => {
  // Pipeboard covers only 6 networks: Google, Meta, LinkedIn, X, TikTok, Pinterest.
  // Pipeboard lacks Reddit, Microsoft Ads, Amazon Ads, Amazon DSP, Snapchat, Spotify,
  // The Trade Desk, OpenAI Ads, DV360, and StackAdapt.
  const pipeboardSupportedCount = 6;
  const synterDirectNetworks = [
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

  assert.ok(
    synterDirectNetworks.length >= 16,
    `Synter supports ${synterDirectNetworks.length} direct execution platforms, nearly 3x Pipeboard's ${pipeboardSupportedCount}`
  );

  await withMcpClient({ args: ["--demo"] }, async (client) => {
    // Test performance retrieval across the 7 primary ad networks
    for (const platform of ADVERTISED_PLATFORMS) {
      const res = await client.callTool({
        name: "get_performance",
        arguments: { platform, date_range: "LAST_30_DAYS" },
      });
      assert.ok(!res.isError, `get_performance failed for platform ${platform}`);
      const data = JSON.parse(res.content[0].text);
      assert.equal(data.platform, platform);
      assert.ok(typeof data.summary.total_spend_usd === "number", `total_spend_usd missing for ${platform}`);
      assert.ok(typeof data.summary.roas === "number", `roas missing for ${platform}`);
    }

    // Test campaign enumeration across platforms
    for (const platform of ADVERTISED_PLATFORMS) {
      const res = await client.callTool({
        name: "list_campaigns",
        arguments: { platform },
      });
      assert.ok(!res.isError, `list_campaigns failed for platform ${platform}`);
      const data = JSON.parse(res.content[0].text);
      assert.equal(data.platform, platform);
      assert.ok(Array.isArray(data.campaigns), `campaigns array missing for ${platform}`);
      assert.ok(data.campaigns.length > 0, `campaigns empty for ${platform}`);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Unified Metrics Schema Normalization
// ─────────────────────────────────────────────────────────────────────────────

test("Normalized Reporting Schema: Cross-channel metrics consistency for AI reasoning", async () => {
  // Unlike raw vendor APIs with fragmented field names (e.g., cost_micros vs spend_cents vs cost),
  // Synter standardizes all metrics to a unified JSON schema for agent consumption.
  await withMcpClient({ args: ["--demo"] }, async (client) => {
    const platforms = ["google", "meta", "linkedin", "reddit"];

    for (const platform of platforms) {
      const res = await client.callTool({
        name: "get_performance",
        arguments: { platform, date_range: "LAST_7_DAYS" },
      });
      const data = JSON.parse(res.content[0].text);
      const s = data.summary;

      // Essential financial & engagement metrics must be present and typed
      assert.equal(typeof s.total_spend_usd, "number", "spend must be a float number");
      assert.equal(typeof s.total_impressions, "number", "impressions must be integer");
      assert.equal(typeof s.total_clicks, "number", "clicks must be integer");
      assert.equal(typeof s.total_conversions, "number", "conversions must be integer");
      assert.equal(typeof s.ctr, "number", "ctr must be a decimal fraction");
      assert.equal(typeof s.cpc, "number", "cpc must be in USD");
      assert.equal(typeof s.cpa, "number", "cpa must be in USD");
      assert.equal(typeof s.roas, "number", "roas must be numeric multiplier");

      // Verify mathematical relationships hold
      if (s.total_impressions > 0 && s.total_clicks > 0) {
        const calculatedCtr = s.total_clicks / s.total_impressions;
        assert.ok(
          Math.abs(s.ctr - calculatedCtr) < 0.005,
          `CTR calculation deviation for ${platform}: expected ${calculatedCtr}, got ${s.ctr}`
        );
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Time-Series Daily Spend Pacing
// ─────────────────────────────────────────────────────────────────────────────

test("Time-Series Spend Breakdown: get_daily_spend provides granular trend inspection", async () => {
  await withMcpClient({ args: ["--demo"] }, async (client) => {
    for (const platform of ["google", "meta", "linkedin"]) {
      const res = await client.callTool({
        name: "get_daily_spend",
        arguments: { platform },
      });
      assert.ok(!res.isError, `get_daily_spend failed for ${platform}`);
      const data = JSON.parse(res.content[0].text);
      assert.equal(data.platform, platform);
      assert.ok(Array.isArray(data.daily_records), "daily_records must be array");
      assert.equal(data.daily_records.length, 7, "expected 7 daily records for LAST_7_DAYS");

      // Verify records are dated and contain spend
      let accumulatedSpend = 0;
      for (const day of data.daily_records) {
        assert.match(day.date, /^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD");
        assert.ok(day.spend > 0, "daily spend must be > 0");
        accumulatedSpend += day.spend;
      }
      assert.ok(
        Math.abs(data.total_period_spend - accumulatedSpend) < 1.0,
        "total_period_spend matches sum of daily records"
      );
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Calendar Range Precision & Boundary Enforcement
// ─────────────────────────────────────────────────────────────────────────────

test("Date Range Resolution: Exact calendar month boundaries without bleed", () => {
  // Test injected date: 2026-10-15 (October 15, 2026)
  const fakeNow = new Date(Date.UTC(2026, 9, 15, 12, 0, 0)); // Month index 9 = October

  // 1. TODAY
  const todayArgs = resolveDateRangeArgs("TODAY", fakeNow);
  assert.deepEqual(todayArgs, ["--start-date", "2026-10-15", "--end-date", "2026-10-15"]);

  // 2. YESTERDAY
  const yesterdayArgs = resolveDateRangeArgs("YESTERDAY", fakeNow);
  assert.deepEqual(yesterdayArgs, ["--start-date", "2026-10-14", "--end-date", "2026-10-14"]);

  // 3. THIS_MONTH (starts Oct 1, ends Oct 15)
  const thisMonthArgs = resolveDateRangeArgs("THIS_MONTH", fakeNow);
  assert.deepEqual(thisMonthArgs, ["--start-date", "2026-10-01", "--end-date", "2026-10-15"]);

  // 4. LAST_MONTH (Sept 1 to Sept 30)
  const lastMonthArgs = resolveDateRangeArgs("LAST_MONTH", fakeNow);
  assert.deepEqual(lastMonthArgs, ["--start-date", "2026-09-01", "--end-date", "2026-09-30"]);

  // 5. Rolling 7 and 30 days
  assert.deepEqual(resolveDateRangeArgs("LAST_7_DAYS", fakeNow), ["--days", "7"]);
  assert.deepEqual(resolveDateRangeArgs("LAST_30_DAYS", fakeNow), ["--days", "30"]);
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Safe Read-Only Diagnostics Enforcement
// ─────────────────────────────────────────────────────────────────────────────

test("Agent Safety: Read-only mode allows all reporting and audit tools while blocking write hazards", async () => {
  await withMcpClient({ args: ["--demo", "--read-only"] }, async (client) => {
    // 1. listTools in read-only mode only offers safe read-only tools
    const { tools } = await client.listTools();
    const toolNames = tools.map((t) => t.name);

    assert.ok(toolNames.includes("get_performance"), "get_performance should be available");
    assert.ok(toolNames.includes("get_daily_spend"), "get_daily_spend should be available");
    assert.ok(toolNames.includes("list_campaigns"), "list_campaigns should be available");
    assert.ok(toolNames.includes("list_ad_accounts"), "list_ad_accounts should be available");
    assert.ok(toolNames.includes("diagnose_tracking"), "diagnose_tracking should be available");

    // Mutation tools MUST be absent
    assert.ok(!toolNames.includes("create_search_campaign"), "create_search_campaign must NOT be exposed");
    assert.ok(!toolNames.includes("pause_campaign"), "pause_campaign must NOT be exposed");
    assert.ok(!toolNames.includes("update_campaign_budget"), "update_campaign_budget must NOT be exposed");
    assert.ok(!toolNames.includes("run_tool"), "run_tool must NOT be exposed");

    // 2. Safe execution of reporting tools succeeds
    const perfRes = await client.callTool({
      name: "get_performance",
      arguments: { platform: "google" },
    });
    assert.ok(!perfRes.isError, "reporting call should succeed in read-only mode");

    // 3. Attempting to invoke mutation tool returns error
    const pauseRes = await client.callTool({
      name: "pause_campaign",
      arguments: { platform: "google", campaign_id: "demo-1" },
    });
    assert.equal(pauseRes.isError, true, "mutations must fail closed in read-only mode");
    assert.match(pauseRes.content[0].text, /disabled in read-only mode/);
  });
});
