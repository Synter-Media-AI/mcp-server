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
  const client = new Client({ name: "stdio-tools-list-test", version: "0.0.0" });
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

test("tools/list returns the same 25 tool names as 1.2.4", async () => {
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
