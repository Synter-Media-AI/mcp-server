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
  const client = new Client(
    { name: "demo-mode-test", version: "0.0.0" },
    { capabilities: {} }
  );
  await client.connect(transport);
  try {
    return await fn(client);
  } finally {
    await client.close();
  }
}

test("demo mode via --demo flag lists all 56 tools without API key", async () => {
  await withDemoClient({ args: ["--demo"] }, async (client) => {
    const { tools } = await client.listTools();
    assert.equal(tools.length, 56, "all 56 tools should be available in demo mode");
  });
});

test("demo mode via SYNTER_DEMO=true lists all 56 tools without API key", async () => {
  await withDemoClient({ env: { SYNTER_DEMO: "true" } }, async (client) => {
    const { tools } = await client.listTools();
    assert.equal(tools.length, 56, "all 56 tools should be available in demo mode");
  });
});

test("demo mode exposes free Agent Shield, Ångström, Skills, and LLM Visibility tools", async () => {
  await withDemoClient({ args: ["--demo"] }, async (client) => {
    // 1. inspect_agent_shield
    const shieldRes = await client.callTool({
      name: "inspect_agent_shield",
      arguments: {},
    });
    assert.ok(!shieldRes.isError);
    const shieldData = JSON.parse(shieldRes.content[0].text);
    assert.equal(shieldData.sandbox, true);
    assert.equal(shieldData.shield_status, "ENFORCING");
    assert.ok(shieldData.spend_guardrails.max_daily_budget_multiplier > 0);
    assert.equal(shieldData.pii_sanitization.mode, "STRICT_ZERO_UNHASHED");

    // 2. verify_angstrom_claim
    const angstromRes = await client.callTool({
      name: "verify_angstrom_claim",
      arguments: { claim: "Scale daily search budget by 15% with $45 Target CPA" },
    });
    assert.ok(!angstromRes.isError);
    const angstromData = JSON.parse(angstromRes.content[0].text);
    assert.equal(angstromData.model, "synter-angstrom-v1");
    assert.equal(angstromData.verified, true);
    assert.ok(angstromData.confidence_score > 0.9);

    // 3. get_skill
    const skillRes = await client.callTool({
      name: "get_skill",
      arguments: { skill: "pmax-brand-cannibalization" },
    });
    assert.ok(!skillRes.isError);
    const skillData = JSON.parse(skillRes.content[0].text);
    assert.equal(skillData.skill_id, "pmax-brand-cannibalization");
    assert.ok(Array.isArray(skillData.skill.execution_runbook));

    // 4. get_llm_visibility
    const llmRes = await client.callTool({
      name: "get_llm_visibility",
      arguments: {},
    });
    assert.ok(!llmRes.isError);
    const llmData = JSON.parse(llmRes.content[0].text);
    assert.ok(llmData.overall_visibility_score > 80);
    assert.ok(Array.isArray(llmData.ranking_among_alternatives));

    // 5. MCP Resources
    const { resources } = await client.listResources();
    assert.equal(resources.length, 4, "server should advertise 4 MCP resources");
    const uris = resources.map((r) => r.uri);
    assert.ok(uris.includes("synter://agent-shield/policies"));
    assert.ok(uris.includes("synter://angstrom/rubric"));
    assert.ok(uris.includes("synter://skills/catalog"));
    assert.ok(uris.includes("synter://pricing/coverage"));

    // Read a resource
    const readRes = await client.readResource({ uri: "synter://angstrom/rubric" });
    assert.match(readRes.contents[0].text, /Synter Ångström/);
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

    // StackAdapt
    const resSa = await client.callTool({
      name: "list_campaigns",
      arguments: { platform: "stackadapt" },
    });
    const dataSa = JSON.parse(resSa.content[0].text);
    assert.equal(dataSa.platform, "stackadapt");
    assert.ok(dataSa.campaigns[0].campaign_id.startsWith("demo-stackadapt"));
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
  assert.equal(stdout.trim(), "1.5.0");
});

test("zero-friction install-and-go: read tools and dry_run mutations succeed with zero flags and zero API key", async () => {
  await withDemoClient({ args: [] }, async (client) => {
    const campRes = await client.callTool({
      name: "list_campaigns",
      arguments: { platform: "google" },
    });
    assert.ok(!campRes.isError, "list_campaigns should succeed with zero flags and no API key");
    const campData = JSON.parse(campRes.content[0].text);
    assert.equal(campData.platform, "google");
    assert.ok(campData.campaigns.length > 0);

    const perfRes = await client.callTool({
      name: "get_performance",
      arguments: { platform: "meta", date_range: "LAST_7_DAYS" },
    });
    assert.ok(!perfRes.isError, "get_performance should succeed with zero flags and no API key");

    const dryRunRes = await client.callTool({
      name: "update_campaign_budget",
      arguments: { platform: "google", campaign_id: "demo-google-101", daily_budget: 200, dry_run: true },
    });
    assert.ok(!dryRunRes.isError, "dry_run mutation should succeed with zero flags and no API key");
    const dryRunData = JSON.parse(dryRunRes.content[0].text);
    assert.equal(dryRunData.dry_run, true);
    assert.equal(dryRunData.cost_credits, 0);
  });
});

test("demo mode supports organic publishing, warm intro discovery, email outreach, and LinkedIn tools", async () => {
  await withDemoClient({ args: ["--demo"] }, async (client) => {
    // 1. Organic readiness
    const orgReady = await client.callTool({
      name: "get_organic_publishing_readiness",
      arguments: {},
    });
    assert.ok(!orgReady.isError);
    const orgData = JSON.parse(orgReady.content[0].text);
    assert.equal(orgData.ready, true);
    assert.equal(orgData.platforms.linkedin.provider, "synter_nango_oauth");

    // 2. Warm intros discovery
    const warmIntros = await client.callTool({
      name: "prospector_get_warm_intros",
      arguments: { limit: 10 },
    });
    assert.ok(!warmIntros.isError);
    const warmData = JSON.parse(warmIntros.content[0].text);
    assert.ok(Array.isArray(warmData.warm_intro_paths));
    assert.ok(warmData.warm_intro_paths.length > 0);

    // 3. 1:1 outreach email via native Exchange
    const emailRes = await client.callTool({
      name: "prospector_send_outreach_email",
      arguments: {
        to_email: "david@example.com",
        subject: "Quick intro to Alex?",
        body_text: "Hey David, hope all is well!",
      },
    });
    assert.ok(!emailRes.isError);
    const emailData = JSON.parse(emailRes.content[0].text);
    assert.equal(emailData.provider, "microsoft_exchange_native");

    // 4. Native LinkedIn PDF document post
    const docRes = await client.callTool({
      name: "prospector_post_linkedin_document",
      arguments: {
        text: "Our Q4 AI Ad Infrastructure Benchmark",
        document_url: "https://synterai.com/reports/q4-benchmark.pdf",
      },
    });
    assert.ok(!docRes.isError);
    const docData = JSON.parse(docRes.content[0].text);
    assert.equal(docData.provider, "synter_linkedin_native");
  });
});

test("update_campaign_budget correctly parses daily_budget_micros in dry_run mode", async () => {
  await withDemoClient({ args: ["--demo"] }, async (client) => {
    const res = await client.callTool({
      name: "update_campaign_budget",
      arguments: {
        platform: "google",
        campaign_id: "camp_g_search_brand_01",
        daily_budget_micros: 50000000,
        dry_run: true,
      },
    });
    assert.ok(!res.isError);
    const data = JSON.parse(res.content[0].text);
    assert.equal(data.new_daily_budget, 50.0);
    assert.equal(data.new_daily_budget_micros, 50000000);
    assert.equal(data.dry_run, true);
    assert.equal(data.verified, true);
    assert.equal(data.agent_shield_verdict.status, "PASSED");
  });
});

