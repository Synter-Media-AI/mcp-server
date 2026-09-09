import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import { HostedMcpClient } from "../dist/hosted-client.js";

const fixture = JSON.parse(
  await readFile(new URL("./fixtures/hosted-tool-catalog.json", import.meta.url), "utf8"),
);

function response(body, init = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
    ...init,
  });
}

function sample(schema = {}) {
  if (schema.const !== undefined) return schema.const;
  if (Array.isArray(schema.enum)) return schema.enum[0];
  if (Array.isArray(schema.anyOf)) {
    const branch = schema.anyOf.find((item) => item.type !== "null") || schema.anyOf[0];
    return sample(branch);
  }
  if (Array.isArray(schema.oneOf)) return sample(schema.oneOf[0]);
  const type = Array.isArray(schema.type) ? schema.type.find((item) => item !== "null") : schema.type;
  switch (type) {
    case "object": {
      const value = {};
      for (const key of schema.required || []) value[key] = sample(schema.properties?.[key] || {});
      return value;
    }
    case "array":
      return Array.from({ length: Math.max(schema.minItems || 0, 1) }, () => sample(schema.items || {}));
    case "integer":
      return Math.max(schema.minimum ?? 1, 1);
    case "number":
      return Math.max(schema.minimum ?? 1, 1);
    case "boolean":
      return true;
    case "null":
      return null;
    default:
      return "test";
  }
}

test("discovers all 196 hosted tools and preserves schemas, titles, and annotations", async () => {
  const client = new HostedMcpClient({
    apiKey: "test-key",
    fetch: async (_url, init) => {
      const request = JSON.parse(init.body);
      assert.equal(request.method, "tools/list");
      assert.equal(init.headers["X-Synter-Key"], "test-key");
      assert.equal(init.headers.Authorization, undefined);
      return response({ jsonrpc: "2.0", id: request.id, result: { tools: fixture } });
    },
  });

  const actual = await client.listTools();
  assert.equal(fixture.length, 196);
  assert.equal(actual.length, 200);
  assert.deepEqual(actual.slice(0, fixture.length), fixture);
  assert.equal(new Set(actual.map(({ name }) => name)).size, actual.length);
});

test("every hosted fixture tool, including writes, validates and forwards to the same hosted name", async () => {
  const calls = [];
  const client = new HostedMcpClient({
    apiKey: "test-key",
    fetch: async (_url, init) => {
      const request = JSON.parse(init.body);
      if (request.method === "tools/list") {
        return response({ jsonrpc: "2.0", id: request.id, result: { tools: fixture } });
      }
      calls.push(request.params);
      return response({
        jsonrpc: "2.0",
        id: request.id,
        result: {
          content: [{ type: "text", text: request.params.name }],
          structuredContent: { forwarded: request.params.name },
          isError: false,
        },
      });
    },
  });

  await client.listTools();
  for (const tool of fixture) {
    const args = sample(tool.inputSchema);
    const result = await client.callTool(tool.name, args);
    assert.deepEqual(result, {
      content: [{ type: "text", text: tool.name }],
      structuredContent: { forwarded: tool.name },
      isError: false,
    });
  }
  assert.equal(calls.length, fixture.length);
  assert.deepEqual(calls.map(({ name }) => name), fixture.map(({ name }) => name));
  assert.ok(calls.some(({ name }) => fixture.find((tool) => tool.name === name)?.annotations?.effect === "write"));
});

test("catalog discovery follows cursors but refuses unbounded pagination", async () => {
  const requests = [];
  const client = new HostedMcpClient({
    maxCatalogPages: 2,
    fetch: async (_url, init) => {
      const request = JSON.parse(init.body);
      requests.push(request.params);
      const index = request.params.cursor ? 1 : 0;
      return response({
        jsonrpc: "2.0",
        id: request.id,
        result: { tools: [fixture[index]], ...(index === 0 ? { nextCursor: "page-2" } : {}) },
      });
    },
  });
  const tools = await client.listTools();
  assert.deepEqual(requests, [{}, { cursor: "page-2" }]);
  assert.deepEqual(tools.slice(0, 2), fixture.slice(0, 2));

  const bounded = new HostedMcpClient({
    maxCatalogPages: 1,
    fetch: async (_url, init) => {
      const request = JSON.parse(init.body);
      return response({ jsonrpc: "2.0", id: request.id, result: { tools: [fixture[0]], nextCursor: "more" } });
    },
  });
  await assert.rejects(() => bounded.listTools(), /exceeded the 1-page safety limit/);
});

test("validates required, type, enum, and numeric constraints before a tool call", async () => {
  let networkCalls = 0;
  const strictTool = {
    name: "strict_tool",
    description: "fixture",
    inputSchema: {
      type: "object",
      properties: {
        mode: { type: "string", enum: ["safe"] },
        count: { type: "integer", minimum: 1, maximum: 3 },
      },
      required: ["mode", "count"],
      additionalProperties: false,
    },
  };
  const client = new HostedMcpClient({
    fetch: async (_url, init) => {
      const request = JSON.parse(init.body);
      if (request.method === "tools/list") {
        return response({ jsonrpc: "2.0", id: request.id, result: { tools: [strictTool] } });
      }
      networkCalls += 1;
      return response({ jsonrpc: "2.0", id: request.id, result: { content: [] } });
    },
  });
  await client.listTools();
  for (const invalid of [{}, { mode: "unsafe", count: 1 }, { mode: "safe", count: "1" }, { mode: "safe", count: -1 }]) {
    await assert.rejects(() => client.callTool("strict_tool", invalid), /invalid arguments/);
  }
  assert.equal(networkCalls, 0);
  await client.callTool("strict_tool", { mode: "safe", count: 2 });
  assert.equal(networkCalls, 1);
});

test("legacy wrappers are collision-free and forward corrected account-aware contracts", async () => {
  const calls = [];
  const client = new HostedMcpClient({
    fetch: async (_url, init) => {
      const request = JSON.parse(init.body);
      if (request.method === "tools/list") {
        return response({ jsonrpc: "2.0", id: request.id, result: { tools: fixture } });
      }
      calls.push(request.params);
      return response({ jsonrpc: "2.0", id: request.id, result: { content: [], structuredContent: { truncated: true } } });
    },
  });
  await client.listTools();
  await client.callTool("list_campaigns", { platform: "meta", account_id: "act-1" });
  await client.callTool("get_performance", { platform: "meta", account_id: "act-1", date_range: "LAST_7_DAYS" });
  await client.callTool("get_daily_spend", { platform: "meta", account_id: "act-1", date: "2026-09-08" });
  await client.callTool("list_ad_accounts", { limit: 100 });

  assert.equal(calls[0].name, "list_campaigns", "canonical name must never route to a legacy handler");
  assert.deepEqual(calls[0].arguments, { platform: "meta", account_id: "act-1" });
  assert.deepEqual(calls[1], {
    name: "pull_meta_ads_performance",
    arguments: { account_id: "act-1", date_range: "last_7_days" },
  });
  assert.deepEqual(calls[2], {
    name: "execute",
    arguments: {
      action: "get_account_daily_spend",
      platform: "meta",
      account_id: "act-1",
      args: ["--platform", "META", "--account-id", "act-1", "--date", "2026-09-08"],
    },
  });
  assert.deepEqual(calls[3], { name: "list_connected_accounts", arguments: { limit: 100 } });

  await assert.rejects(
    () => client.callTool("list_campaigns", { platform: "meta", limit: 1 }),
    /additional properties/,
  );
  assert.equal(calls.length, 4, "obsolete list_campaigns limit must be rejected before forwarding");
});

test("advertises aliases only for discovered targets and narrows performance platforms", async () => {
  const metaPerformance = fixture.find(({ name }) => name === "pull_meta_ads_performance");
  const calls = [];
  const client = new HostedMcpClient({
    fetch: async (_url, init) => {
      const request = JSON.parse(init.body);
      if (request.method === "tools/list") {
        return response({ jsonrpc: "2.0", id: request.id, result: { tools: [metaPerformance] } });
      }
      calls.push(request.params);
      return response({ jsonrpc: "2.0", id: request.id, result: { content: [] } });
    },
  });

  const tools = await client.listTools();
  const performance = tools.find(({ name }) => name === "get_performance");
  assert.deepEqual(performance.inputSchema.properties.platform.enum, ["meta"]);
  for (const unavailable of ["get_daily_spend", "list_ad_accounts", "run_tool"]) {
    assert.ok(!tools.some(({ name }) => name === unavailable), `${unavailable} was advertised without its target`);
  }
  await assert.rejects(
    () => client.callTool("get_performance", { platform: "google" }),
    /invalid arguments/,
  );
  assert.equal(calls.length, 0);
  await client.callTool("get_performance", { platform: "meta", account_id: "act-1" });
  assert.deepEqual(calls, [{ name: "pull_meta_ads_performance", arguments: { account_id: "act-1" } }]);

  let absentTargetCalls = 0;
  const noTargets = new HostedMcpClient({
    fetch: async (_url, init) => {
      const request = JSON.parse(init.body);
      if (request.method === "tools/list") {
        return response({ jsonrpc: "2.0", id: request.id, result: { tools: [fixture[0]] } });
      }
      absentTargetCalls += 1;
      return response({ jsonrpc: "2.0", id: request.id, result: { content: [] } });
    },
  });
  const withoutAliases = await noTargets.listTools();
  for (const unavailable of ["get_performance", "get_daily_spend", "list_ad_accounts", "run_tool"]) {
    assert.ok(!withoutAliases.some(({ name }) => name === unavailable));
  }
  await assert.rejects(() => noTargets.callTool("get_performance", { platform: "meta" }), /Unknown tool/);
  assert.equal(absentTargetCalls, 0);
});

test("rejects mapped alias arguments on target schema drift before tools/call", async () => {
  let toolCalls = 0;
  const driftedExecute = {
    name: "execute",
    description: "drifted fixture",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string" },
        nonce: { type: "string" },
      },
      required: ["action", "nonce"],
      additionalProperties: false,
    },
  };
  const client = new HostedMcpClient({
    fetch: async (_url, init) => {
      const request = JSON.parse(init.body);
      if (request.method === "tools/list") {
        return response({ jsonrpc: "2.0", id: request.id, result: { tools: [driftedExecute] } });
      }
      toolCalls += 1;
      return response({ jsonrpc: "2.0", id: request.id, result: { content: [] } });
    },
  });

  const tools = await client.listTools();
  assert.ok(tools.some(({ name }) => name === "get_daily_spend"));
  await assert.rejects(
    () => client.callTool("get_daily_spend", {
      platform: "meta",
      account_id: "act-1",
      date: "2026-09-08",
    }),
    /not supported by hosted target execute/,
  );
  assert.equal(toolCalls, 0);
});

test("returns useful HTTP, RPC, and timeout errors", async () => {
  const http = new HostedMcpClient({
    fetch: async () => response({ error: "rate limited" }, { status: 429, headers: { "retry-after": "5" } }),
  });
  await assert.rejects(() => http.listTools(), /HTTP 429.*rate limited.*Retry after 5/);

  const rpc = new HostedMcpClient({
    fetch: async () => response({ jsonrpc: "2.0", id: 1, error: { code: -32603, message: "backend failed" } }),
  });
  await assert.rejects(() => rpc.listTools(), /error -32603: backend failed/);

  const timeout = new HostedMcpClient({
    discoveryTimeoutMs: 5,
    fetch: async (_url, init) => new Promise((_resolve, reject) => {
      init.signal.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
    }),
  });
  await assert.rejects(() => timeout.listTools(), /timed out after 5ms/);
});

test("times out while a response body is stalled", async () => {
  const client = new HostedMcpClient({
    discoveryTimeoutMs: 5,
    fetch: async (_url, init) => new Response(new ReadableStream({
      start(controller) {
        init.signal.addEventListener("abort", () => {
          controller.error(new DOMException("aborted", "AbortError"));
        });
      },
    }), { status: 200, headers: { "content-type": "application/json" } }),
  });
  await assert.rejects(() => client.listTools(), /timed out after 5ms/);
});

test("accepts a Streamable HTTP SSE response", async () => {
  const client = new HostedMcpClient({
    fetch: async (_url, init) => {
      const request = JSON.parse(init.body);
      const body = JSON.stringify({ jsonrpc: "2.0", id: request.id, result: { tools: [fixture[0]] } });
      return new Response(`event: message\ndata: ${body}\n\n`, {
        status: 200,
        headers: { "content-type": "text/event-stream" },
      });
    },
  });
  const tools = await client.listTools();
  assert.equal(tools[0].name, fixture[0].name);
});
