// Boots the built server (dist/index.js) over stdio and talks to it with the
// @modelcontextprotocol/sdk 1.x client. Guards the 0.6 -> 1.x SDK upgrade: the
// server must still start, report its version, list exactly the same 25 tools,
// and turn tool failures into isError results rather than crashing.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// The tool names 1.2.4 (SDK 0.6) listed, in order. Renaming or dropping one
// breaks every client config and agent prompt that references it.
const EXPECTED_TOOLS = [
  "list_campaigns",
  "create_search_campaign",
  "create_display_campaign",
  "create_pmax_campaign",
  "pause_campaign",
  "update_campaign_budget",
  "get_performance",
  "get_daily_spend",
  "pacing_report",
  "user_budget_pacing_report",
  "optimize_budget",
  "add_keywords",
  "add_negative_keywords",
  "create_conversion",
  "list_conversions",
  "diagnose_tracking",
  "generate_image",
  "generate_video",
  "create_meta_campaign",
  "create_linkedin_campaign",
  "create_reddit_campaign",
  "stage_audience_artifact",
  "sync_audience",
  "manage_audience",
  "list_ad_accounts",
  "upload_image",
  "run_tool",
  "list_landing_pages",
  "inspect_agent_shield",
  "verify_angstrom_claim",
  "get_skill",
  "get_llm_visibility",
  "get_organic_publishing_readiness",
  "draft_organic_post",
  "validate_organic_post",
  "approve_organic_post",
  "schedule_organic_post",
  "publish_organic_post",
  "cancel_scheduled_post",
  "list_scheduled_posts",
  "prospector_get_pipeline_summary",
  "prospector_get_campaigns",
  "prospector_get_campaign",
  "prospector_get_campaign_performance",
  "prospector_get_leads",
  "prospector_get_inbox_health",
  "prospector_get_pending_replies",
  "prospector_get_intro_paths",
  "prospector_get_warm_intros",
  "prospector_create_campaign",
  "prospector_update_campaign_sequence",
  "prospector_add_leads",
  "prospector_create_reply",
  "prospector_send_outreach_email",
  "prospector_post_linkedin_document",
  "prospector_post_linkedin_comment",
];

const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

async function withClient(fn) {
  // No SYNTER_API_KEY: the server must boot and list tools without one, and
  // nothing in this test may reach the network.
  const env = { PATH: process.env.PATH ?? "" };
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [new URL("../dist/index.js", import.meta.url).pathname],
    env,
    stderr: "ignore",
  });
  const client = new Client(
    { name: "stdio-tools-list-test", version: "0.0.0" },
    { capabilities: {} }
  );
  await client.connect(transport);
  try {
    return await fn(client);
  } finally {
    await client.close();
  }
}

test("server boots over stdio and reports name and package version", async () => {
  await withClient(async (client) => {
    assert.deepEqual(client.getServerVersion(), { name: "synter-mcp", version: pkg.version });
    assert.ok(client.getServerCapabilities()?.tools, "server must advertise the tools capability");
  });
});

test("tools/list returns all 56 tools including organic publishing, email, warm intros, and LinkedIn outreach", async () => {
  await withClient(async (client) => {
    const { tools } = await client.listTools();
    assert.deepEqual(
      tools.map((t) => t.name),
      EXPECTED_TOOLS,
    );
    for (const tool of tools) {
      assert.equal(tool.inputSchema.type, "object", `${tool.name} inputSchema must be an object schema`);
      assert.ok(tool.description, `${tool.name} must have a description`);
    }
  });
});

test("tools/call without an API key returns an isError result, not a crash", async () => {
  await withClient(async (client) => {
    const result = await client.callTool({ name: "list_ad_accounts", arguments: {} });
    assert.equal(result.isError, true);
    assert.match(result.content[0].text, /SYNTER_API_KEY not set/);
  });
});
