import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Exercise the built server over MCP stdio. Only fetch is stubbed; no live calls.
async function withServer(overrides, check) {
  const client = new Client({ name: "endpoint-test", version: "1.0.0" }, { capabilities: {} });
  const bootstrap = `
    globalThis.fetch = async (url, init) => new Response(JSON.stringify({
      url, method: init.method, headers: init.headers, body: init.body
    }), { status: 200, headers: { "Content-Type": "application/json" } });
    await import(${JSON.stringify(new URL("../dist/index.js", import.meta.url).href)});
  `;
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ["--input-type=module", "-e", bootstrap],
    env: { SYNTER_API_KEY: "syn_test_key", ...overrides },
    stderr: "ignore",
  });
  try {
    await client.connect(transport);
    await check(async (name, args) => {
      const result = await client.callTool({ name, arguments: args });
      assert.notEqual(result.isError, true);
      return JSON.parse(result.content[0].text);
    });
  } finally {
    await client.close();
  }
}

for (const [label, env, api, artifact] of [
  ["new defaults", {}, "https://synterai.com", "https://api.synterai.com"],
  ["legacy overrides", { SYNTER_API_URL: "https://syntermedia.ai", SYNTER_ARTIFACT_API_URL: "https://api.syntermedia.ai" }, "https://syntermedia.ai", "https://api.syntermedia.ai"],
  ["custom overrides", { SYNTER_API_URL: "https://custom.example", SYNTER_ARTIFACT_API_URL: "https://artifacts.example" }, "https://custom.example", "https://artifacts.example"],
  ["empty overrides", { SYNTER_API_URL: "", SYNTER_ARTIFACT_API_URL: "" }, "https://synterai.com", "https://api.synterai.com"],
]) {
  test(`API and artifact requests honor ${label}`, { timeout: 10000 }, async () => {
    await withServer(env, async (call) => {
      const dispatched = await call("run_tool", { script_name: "list_connected_accounts", args: [] });
      assert.equal(dispatched.url, `${api}/api/v1/tools/run`);
      assert.equal(dispatched.headers.Authorization, "Bearer syn_test_key");
      const listed = await call("list_landing_pages", {});
      assert.equal(listed.url, `${api}/api/v1/landing-pages`);
      assert.equal(listed.method, "GET");
      const staged = await call("stage_audience_artifact", { body: "hash", i_have_consent: true });
      assert.equal(staged.url, `${artifact}/artifacts/audience-sync-input`);
      assert.equal(staged.headers["X-Synter-Key"], "syn_test_key");
      assert.equal(staged.headers.Authorization, undefined);
    });
  });
}
