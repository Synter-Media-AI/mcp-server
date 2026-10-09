// Tests for SYNTER_DEMO and --demo sandbox mode.
// Verifies that when demo mode is active, the server runs with zero credentials,
// returns rich realistic sandbox mock data, and allows simulated testing.

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const execFileAsync = promisify(execFile);

async function withDemoClient(options, fn) {
  const env = {
    PATH: process.env.PATH ?? "",
    ...(options.env ?? {}),
  };
  // Ensure SYNTER_API_KEY is not leaked into demo client unless explicitly provided
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
  const client = new Client({ name: "demo-mode-test", version: "0.0.0" });
  await client.connect(transport);
  try {
    return await fn(client);
  } finally {
    await client.close();
  }
}

test("demo mode via --demo flag lists all 25 tools without API key", async () => {
  await withDemoClient({ args: ["--demo"] }, async (client) => {
    const { tools } = await client.listTools();
    assert.equal(tools.length, 25, "all 25 tools should be available in demo mode");
  });
});

test("demo mode via SYNTER_DEMO=true lists all 25 tools without API key", async () => {
  await withDemoClient({ env: { SYNTER_DEMO: "true" } }, async (client) => {
    const { tools } = await client.listTools();
    assert.equal(tools.length, 25, "all 25 tools should be available in demo mode");
  });
});

test("demo mode returns rich sandbox data for list_campaigns across platforms", async () => {
  await withDemoClient({ args: ["--demo"] }, async (client) => {
    // Google
    const resGoogle = await client.callTool({
      name: "list_campaigns",
      arguments: { platform: "google" },
    });
    assert.ok(!resGoogle.isError, "tool call should succeed in demo mode");
    const dataGoogle = JSON.parse(resGoogle.content[0].text);
    assert.equal(dataGoogle.sandbox, true, "should flag sandbox: true");
    assert.match(dataGoogle.notice, /DEMO SANDBOX DATA/);
    assert.equal(dataGoogle.platform, "google");
    assert.ok(dataGoogle.campaigns.length > 0, "should return demo campaigns");
    assert.ok(dataGoogle.campaigns[0].campaign_id.startsWith("demo-google"));

    // Meta
    const resMeta = await client.callTool({
      name: "list_campaigns",
      arguments: { platform: "meta" },
    });
    const dataMeta = JSON.parse(resMeta.content[0].text);
    assert.equal(dataMeta.sandbox, true);
    assert.equal(dataMeta.platform, "meta");
    assert.ok(dataMeta.campaigns[0].campaign_id.startsWith("demo-meta"));

    // LinkedIn
    const resLi = await client.callTool({
      name: "list_campaigns",
      arguments: { platform: "linkedin" },
    });
    const dataLi = JSON.parse(resLi.content[0].text);
    assert.equal(dataLi.platform, "linkedin");
    assert.ok(dataLi.campaigns[0].campaign_id.startsWith("demo-li"));
  });
});

test("demo mode returns aggregated metrics for get_performance", async () => {
  await withDemoClient({ args: ["--demo"] }, async (client) => {
    const result = await client.callTool({
      name: "get_performance",
      arguments: { platform: "google", date_range: "LAST_7_DAYS" },
    });
    assert.ok(!result.isError);
    const data = JSON.parse(result.content[0].text);
    assert.equal(data.sandbox, true);
    assert.equal(data.platform, "google");
    assert.ok(data.summary.total_spend_usd > 0, "should report total spend");
    assert.ok(data.summary.total_impressions > 0, "should report impressions");
    assert.ok(data.summary.total_clicks > 0, "should report clicks");
    assert.ok(data.summary.ctr > 0, "should report CTR");
  });
});

test("demo mode returns sandbox data for list_ad_accounts and diagnose_tracking", async () => {
  await withDemoClient({ args: ["--demo"] }, async (client) => {
    // list_ad_accounts
    const accResult = await client.callTool({
      name: "list_ad_accounts",
      arguments: { platform: "google" },
    });
    assert.ok(!accResult.isError);
    const accData = JSON.parse(accResult.content[0].text);
    assert.equal(accData.sandbox, true);
    assert.ok(Array.isArray(accData.accounts), "should return accounts list");
    assert.equal(accData.platform, "google");

    // diagnose_tracking
    const diagResult = await client.callTool({
      name: "diagnose_tracking",
      arguments: { url: "https://synterai.com" },
    });
    assert.ok(!diagResult.isError);
    const diagData = JSON.parse(diagResult.content[0].text);
    assert.equal(diagData.sandbox, true);
    assert.equal(diagData.gtm_detected, true);
    assert.equal(diagData.conversion_pixels.length, 3);
  });
});

test("demo mode simulates mutations successfully when not in read-only mode", async () => {
  await withDemoClient({ args: ["--demo"] }, async (client) => {
    // pause_campaign
    const pauseRes = await client.callTool({
      name: "pause_campaign",
      arguments: { platform: "google", campaign_id: "demo-google-101" },
    });
    assert.ok(!pauseRes.isError);
    const pauseData = JSON.parse(pauseRes.content[0].text);
    assert.equal(pauseData.sandbox, true);
    assert.equal(pauseData.simulated, true);
    assert.equal(pauseData.status, "PAUSED");

    // update_campaign_budget
    const budgetRes = await client.callTool({
      name: "update_campaign_budget",
      arguments: { platform: "google", campaign_id: "demo-google-101", daily_budget: 175.0 },
    });
    assert.ok(!budgetRes.isError);
    const budgetData = JSON.parse(budgetRes.content[0].text);
    assert.equal(budgetData.new_daily_budget, 175.0);

    // create_search_campaign
    const createRes = await client.callTool({
      name: "create_search_campaign",
      arguments: {
        campaign_name: "Test Demo Campaign",
        daily_budget: 50.0,
        headlines: ["Headline 1", "Headline 2", "Headline 3"],
        descriptions: ["Description 1", "Description 2"],
        keywords: ["ai agent", "mcp server"],
      },
    });
    assert.ok(!createRes.isError);
    const createData = JSON.parse(createRes.content[0].text);
    assert.equal(createData.sandbox, true);
    assert.equal(createData.status, "PAUSED");
    assert.ok(createData.campaign_id.startsWith("demo-google-search"));
  });
});

test("demo mode + read-only mode (--demo --read-only) blocks mutating tools", async () => {
  await withDemoClient({ args: ["--demo", "--read-only"] }, async (client) => {
    // Read tool works
    const readRes = await client.callTool({
      name: "list_campaigns",
      arguments: { platform: "google" },
    });
    assert.ok(!readRes.isError);
    const readData = JSON.parse(readRes.content[0].text);
    assert.equal(readData.sandbox, true);

    // Mutating tool is blocked
    const mutateRes = await client.callTool({
      name: "pause_campaign",
      arguments: { platform: "google", campaign_id: "demo-google-101" },
    });
    assert.equal(mutateRes.isError, true);
    assert.match(mutateRes.content[0].text, /Tool 'pause_campaign' is disabled in read-only mode/);
  });
});

test("calling an unknown tool in demo mode fails with Unknown tool", async () => {
  await withDemoClient({ args: ["--demo"] }, async (client) => {
    const result = await client.callTool({
      name: "non_existent_tool",
      arguments: {},
    });
    assert.equal(result.isError, true);
    assert.match(result.content[0].text, /Unknown tool: non_existent_tool/);
  });
});

test("--help CLI argument displays help and exits with code 0", async () => {
  const binaryPath = new URL("../dist/index.js", import.meta.url).pathname;
  const { stdout } = await execFileAsync(process.execPath, [binaryPath, "--help"]);
  assert.match(stdout, /Synter MCP Server/);
  assert.match(stdout, /--demo/);
  assert.match(stdout, /--read-only/);
});

test("--version CLI argument displays version and exits with code 0", async () => {
  const binaryPath = new URL("../dist/index.js", import.meta.url).pathname;
  const { stdout } = await execFileAsync(process.execPath, [binaryPath, "--version"]);
  assert.equal(stdout.trim(), "1.3.0");
});
