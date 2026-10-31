import { test } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const VERIFIED_READ_TOOLS = new Set([
  "list_campaigns",
  "get_performance",
  "get_daily_spend",
  "pacing_report",
  "user_budget_pacing_report",
  "optimize_budget",
  "list_conversions",
  "diagnose_tracking",
  "list_ad_accounts",
  "list_landing_pages",
  "inspect_agent_shield",
  "verify_angstrom_claim",
  "get_skill",
  "get_llm_visibility",
  "get_organic_publishing_readiness",
  "validate_organic_post",
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
]);

const VERIFIED_WRITE_TOOLS = new Set([
  "create_search_campaign",
  "create_display_campaign",
  "create_pmax_campaign",
  "pause_campaign",
  "update_campaign_budget",
  "add_keywords",
  "add_negative_keywords",
  "create_conversion",
  "generate_image",
  "generate_video",
  "create_meta_campaign",
  "create_linkedin_campaign",
  "create_reddit_campaign",
  "stage_audience_artifact",
  "sync_audience",
  "manage_audience",
  "upload_image",
  "run_tool",
  "draft_organic_post",
  "approve_organic_post",
  "schedule_organic_post",
  "publish_organic_post",
  "cancel_scheduled_post",
  "prospector_create_campaign",
  "prospector_update_campaign_sequence",
  "prospector_add_leads",
  "prospector_create_reply",
  "prospector_send_outreach_email",
  "prospector_post_linkedin_document",
  "prospector_post_linkedin_comment",
]);

async function withClient(fn) {
  const env = { PATH: process.env.PATH ?? "" };
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [new URL("../dist/index.js", import.meta.url).pathname],
    env,
    stderr: "ignore",
  });
  const client = new Client(
    { name: "tool-annotations-test", version: "0.0.0" },
    { capabilities: {} }
  );
  await client.connect(transport);
  try {
    return await fn(client);
  } finally {
    await client.close();
  }
}

test("every tool has annotations with title and either readOnlyHint:true or destructiveHint:true", async () => {
  await withClient(async (client) => {
    const { tools } = await client.listTools();
    assert.equal(tools.length, 56, "server must list all 56 tools");

    const readTools = [];
    const writeTools = [];

    for (const tool of tools) {
      assert.ok(
        tool.annotations && typeof tool.annotations === "object",
        `tool ${tool.name} must declare annotations object`
      );

      const title = tool.annotations.title;
      assert.ok(
        typeof title === "string" && title.trim().length > 0,
        `tool ${tool.name} must declare a non-empty annotations.title (got: ${JSON.stringify(title)})`
      );

      const isReadOnly = tool.annotations.readOnlyHint === true;
      const isDestructive = tool.annotations.destructiveHint === true;

      // Exactly one hint must be true
      assert.ok(
        (isReadOnly && !isDestructive) || (!isReadOnly && isDestructive),
        `tool ${tool.name} must have exactly one of readOnlyHint:true or destructiveHint:true (got readOnlyHint: ${tool.annotations.readOnlyHint}, destructiveHint: ${tool.annotations.destructiveHint})`
      );

      if (isReadOnly) {
        readTools.push(tool.name);
        assert.ok(
          VERIFIED_READ_TOOLS.has(tool.name),
          `tool ${tool.name} marked readOnlyHint:true but not in expected read tools set`
        );
      } else {
        writeTools.push(tool.name);
        assert.ok(
          VERIFIED_WRITE_TOOLS.has(tool.name),
          `tool ${tool.name} marked destructiveHint:true but not in expected write tools set`
        );
      }
    }

    assert.equal(readTools.length, VERIFIED_READ_TOOLS.size, `expected ${VERIFIED_READ_TOOLS.size} read tools`);
    assert.equal(writeTools.length, VERIFIED_WRITE_TOOLS.size, `expected ${VERIFIED_WRITE_TOOLS.size} write tools`);
  });
});
