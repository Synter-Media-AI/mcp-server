// Tests for SYNTER_READ_ONLY and --read-only mode.
// Verifies that when read-only mode is active, only tools annotated with
// readOnlyHint: true are listed, and mutating tools are blocked.

import { test } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const READ_ONLY_TOOLS = [
  "list_campaigns",
  "get_performance",
  "get_daily_spend",
  "diagnose_tracking",
  "list_ad_accounts",
  "list_landing_pages",
];

async function withClient(options, fn) {
  const env = {
    PATH: process.env.PATH ?? "",
    ...(options.env ?? {}),
  };
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
  const client = new Client({ name: "read-only-test", version: "0.0.0" });
  await client.connect(transport);
  try {
    return await fn(client);
  } finally {
    await client.close();
  }
}

test("read-only mode via SYNTER_READ_ONLY=true lists only read-only tools", async () => {
  await withClient({ env: { SYNTER_READ_ONLY: "true" } }, async (client) => {
    const { tools } = await client.listTools();
    const toolNames = tools.map((t) => t.name);

    for (const roTool of READ_ONLY_TOOLS) {
      assert.ok(toolNames.includes(roTool), `read-only tool "${roTool}" should be listed`);
    }

    assert.ok(!toolNames.includes("create_search_campaign"), "create_search_campaign must not be listed");
    assert.ok(!toolNames.includes("pause_campaign"), "pause_campaign must not be listed");
    assert.ok(!toolNames.includes("update_campaign_budget"), "update_campaign_budget must not be listed");
    assert.ok(!toolNames.includes("sync_audience"), "sync_audience must not be listed");
  });
});

test("read-only mode via --read-only CLI arg filters mutating tools", async () => {
  await withClient({ args: ["--read-only"] }, async (client) => {
    const { tools } = await client.listTools();
    const toolNames = tools.map((t) => t.name);

    assert.ok(!toolNames.includes("create_meta_campaign"), "create_meta_campaign must not be listed");
    assert.ok(!toolNames.includes("upload_image"), "upload_image must not be listed");
  });
});

test("calling mutating tool in read-only mode returns isError response", async () => {
  await withClient({ env: { SYNTER_READ_ONLY: "true" } }, async (client) => {
    const res = await client.callTool({
      name: "create_search_campaign",
      arguments: { name: "Test", daily_budget: 50, keywords: ["test"] },
    });
    assert.equal(res.isError, true, "callTool must return isError: true");
    const text = res.content?.[0]?.text ?? "";
    assert.match(text, /disabled in read-only mode/, "error text must indicate read-only restriction");
  });
});
