import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

const fixture = JSON.parse(
  await readFile(new URL("./fixtures/hosted-tool-catalog.json", import.meta.url), "utf8"),
);

test("compiled stdio server advertises Synter metadata and the complete hosted catalog", async (t) => {
  const http = createServer((request, response) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => { body += chunk; });
    request.on("end", () => {
      const rpc = JSON.parse(body);
      response.writeHead(200, { "content-type": "application/json" });
      const result = rpc.method === "tools/list"
        ? { tools: fixture }
        : {
            content: [{ type: "text", text: "preserved" }],
            structuredContent: { account_id: "act-1", truncated: true },
            isError: false,
          };
      response.end(JSON.stringify({ jsonrpc: "2.0", id: rpc.id, result }));
    });
  });
  http.listen(0, "127.0.0.1");
  await once(http, "listening");
  t.after(() => http.close());
  const address = http.address();

  const child = spawn(process.execPath, ["dist/index.js"], {
    env: {
      ...process.env,
      SYNTER_API_KEY: "test-key",
      SYNTER_MCP_URL: `http://127.0.0.1:${address.port}/mcp/`,
    },
    stdio: ["pipe", "pipe", "pipe"],
  });
  t.after(() => child.kill());

  const pending = new Map();
  let stdout = "";
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
    for (;;) {
      const newline = stdout.indexOf("\n");
      if (newline < 0) break;
      const line = stdout.slice(0, newline);
      stdout = stdout.slice(newline + 1);
      if (!line) continue;
      const message = JSON.parse(line);
      pending.get(message.id)?.(message);
      pending.delete(message.id);
    }
  });

  const rpc = (id, method, params = {}) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`stdio ${method} timed out`)), 5_000);
    pending.set(id, (message) => {
      clearTimeout(timer);
      resolve(message);
    });
    child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
  });

  const initialized = await rpc(1, "initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "test", version: "1" },
  });
  assert.equal(initialized.result.serverInfo.name, "synter-ads");
  assert.equal(initialized.result.serverInfo.version, "1.3.0");
  assert.equal(initialized.result.serverInfo.icons[0].src, "https://syntermedia.ai/brand/android-chrome-192x192.png");

  child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" })}\n`);
  const listed = await rpc(2, "tools/list");
  assert.equal(listed.result.tools.length, 200);
  assert.deepEqual(listed.result.tools.slice(0, fixture.length), fixture);

  const called = await rpc(3, "tools/call", {
    name: "list_campaigns",
    arguments: { platform: "meta", account_id: "act-1" },
  });
  assert.deepEqual(called.result, {
    content: [{ type: "text", text: "preserved" }],
    structuredContent: { account_id: "act-1", truncated: true },
    isError: false,
  });
});
