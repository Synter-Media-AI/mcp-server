// A billing refusal from the Synter API must reach the MCP client as a tool
// RESULT the assistant relays: what is blocked, the exact fix link and an
// instruction to show it — never a bare "Error: INSUFFICIENT_CREDITS" or a
// legacy /sign-up?plan=developer link.

import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function withApi(status, body, fn) {
  const server = http.createServer((_req, res) => {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    return await fn(`http://127.0.0.1:${port}`);
  } finally {
    server.close();
  }
}

async function callTool(apiUrl, name, args) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [new URL("../dist/index.js", import.meta.url).pathname],
    env: { PATH: process.env.PATH ?? "", SYNTER_API_KEY: "test-key-not-real", SYNTER_API_URL: apiUrl },
    stderr: "ignore",
  });
  const client = new Client({ name: "billing-test", version: "0.0.0" }, { capabilities: {} });
  await client.connect(transport);
  try {
    return await client.callTool({ name, arguments: args });
  } finally {
    await client.close();
  }
}

test("server billing payload is relayed verbatim with the link and instruction", async () => {
  const actionUrl = "https://synterai.com/settings/billing?plan=solo&autoCheckout=1&source=mcp";
  await withApi(
    402,
    {
      success: false,
      error: "INSUFFICIENT_CREDITS",
      code: "INSUFFICIENT_CREDITS",
      billing_refusal: true,
      message: `The Synter tool \`list_campaigns\` was not run. Upgrade to SOLO here: ${actionUrl}`,
      action_url: actionUrl,
      assistant_instruction: `Show the user this link: ${actionUrl}`,
    },
    async (apiUrl) => {
      const res = await callTool(apiUrl, "list_landing_pages", {});
      assert.equal(res.isError, true);
      const text = res.content[0].text;
      assert.match(text, /^BILLING ACTION REQUIRED \(INSUFFICIENT_CREDITS\)/);
      assert.ok(text.includes(`Fix it here: ${actionUrl}`));
      assert.ok(text.includes("Assistant: Show the user this link"));
    },
  );
});

test("legacy 402 without a payload still gets a working synterai.com checkout link", async () => {
  await withApi(402, { error: "INSUFFICIENT_CREDITS" }, async (apiUrl) => {
    const res = await callTool(apiUrl, "list_landing_pages", {});
    assert.equal(res.isError, true);
    const text = res.content[0].text;
    assert.ok(
      text.includes("https://synterai.com/settings/billing?source=mcp"),
      text,
    );
    assert.doesNotMatch(text, /plan=|sign-up/);
    assert.ok(text.includes("This action is a write, and your Synter account needs a payment method or available credits to run it. Synter is free to connect; writes are $0.25 per verified write, 0% of ad spend. Add a payment method at https://synterai.com/settings/billing?source=mcp to continue."), text);
    assert.doesNotMatch(text, /SOLO|SCALE|CUSTOM|\$20|\$500|\/mo|stay free/i);
  });
});

test("a payment-method refusal links to the add-card page", async () => {
  await withApi(402, { error: "PAYMENT_METHOD_REQUIRED", message: "No card." }, async (apiUrl) => {
    const res = await callTool(apiUrl, "list_landing_pages", {});
    assert.ok(
      res.content[0].text.includes("https://synterai.com/settings/billing?setup=payment&source=mcp"),
    );
  });
});

test("non-billing errors keep the normal error path", async () => {
  await withApi(500, { error: "INTERNAL", message: "boom" }, async (apiUrl) => {
    const res = await callTool(apiUrl, "list_landing_pages", {});
    assert.equal(res.isError, true);
    assert.equal(res.content[0].text, "Error: boom");
  });
});

// --- Per-code coverage: every refusal code maps to a working synterai.com
// billing action (never a legacy /sign-up?plan=developer link). ---

const { BILLING_REFUSAL_CODES, billingRefusalFromResponse, formatBillingRefusalText } =
  await import(new URL("../dist/billing-refusal.js", import.meta.url).href);

const CARD_CODES = new Set(["PAYMENT_METHOD_REQUIRED", "PAYMENT_FAILED", "PAST_DUE"]);

function expectedAction(code) {
  if (CARD_CODES.has(code)) return "https://synterai.com/settings/billing?setup=payment&source=mcp";
  if (code === "ON_DEMAND_CAP_REACHED") {
    return "https://synterai.com/settings/billing?section=spend-management&source=mcp";
  }
  return "https://synterai.com/settings/billing?source=mcp";
}

for (const code of BILLING_REFUSAL_CODES) {
  test(`${code} maps to a working synterai.com billing action`, () => {
    // Older API shape: status 403 + legacy sign-up link must still be recognised
    // by code and must not leak the legacy link as the action.
    const refusal = billingRefusalFromResponse(
      403,
      {
        error: code,
        message: "Blocked.",
        upgradeUrl: "https://synterai.com/sign-up?plan=developer&billing=monthly",
      },
      "https://synterai.com",
    );
    assert.ok(refusal, `${code} must be treated as a billing refusal`);
    assert.equal(refusal.code, code);
    assert.equal(refusal.billing_refusal, true);
    assert.equal(refusal.action_url, expectedAction(code));
    const url = new URL(refusal.action_url);
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, "synterai.com");
    assert.equal(url.pathname, "/settings/billing");
    assert.equal(url.searchParams.get("source"), "mcp");
    assert.equal(refusal.plans, undefined);
    const text = formatBillingRefusalText(refusal);
    assert.ok(text.startsWith(`BILLING ACTION REQUIRED (${code})\n`), text);
    assert.ok(text.includes(`Fix it here: ${refusal.action_url}`));
    assert.ok(text.includes("show them this link exactly as written"));
    assert.ok(refusal.message.includes(`Add a payment method at ${refusal.action_url} to continue.`));
    assert.ok(refusal.message.includes("$0.25 per verified write, 0% of ad spend"));
    assert.doesNotMatch(text, /SOLO|SCALE|CUSTOM|\$20|\$500|\/mo/);
    assert.ok(!refusal.action_url.includes("sign-up"));
    assert.ok(!refusal.message.includes("plan=developer"));
  });
}

test("a bare 402 with no code still becomes BILLING_REQUIRED with the billing link", () => {
  const refusal = billingRefusalFromResponse(402, {}, "https://synterai.com");
  assert.equal(refusal.code, "BILLING_REQUIRED");
  assert.equal(refusal.action_url, expectedAction("BILLING_REQUIRED"));
});

test("staging API URL keeps refusal links on staging", () => {
  const refusal = billingRefusalFromResponse(
    402,
    { error: "INSUFFICIENT_CREDITS" },
    "https://staging.synterai.com",
  );
  assert.equal(
    refusal.action_url,
    "https://staging.synterai.com/settings/billing?source=mcp",
  );
});

test("non-billing codes are not treated as refusals", () => {
  assert.equal(billingRefusalFromResponse(500, { error: "INTERNAL" }, "https://synterai.com"), null);
  assert.equal(billingRefusalFromResponse(404, { error: "NOT_FOUND" }, "https://synterai.com"), null);
});

test("POST tool path (list_campaigns) no longer returns legacy sign-up checkout JSON", async () => {
  await withApi(402, { error: "INSUFFICIENT_CREDITS" }, async (apiUrl) => {
    const res = await callTool(apiUrl, "list_campaigns", { platform: "google" });
    assert.equal(res.isError, true);
    const text = res.content[0].text;
    assert.match(text, /^BILLING ACTION REQUIRED \(INSUFFICIENT_CREDITS\)/);
    assert.doesNotMatch(text, /plan=developer|sign-up|mcp_low_balance|checkoutUrls|upgradeHint/);
  });
});

test("hosted MCP tool path (organic) relays ON_DEMAND_CAP_REACHED with the spend-limit link", async () => {
  await withApi(403, { error: "ON_DEMAND_CAP_REACHED", message: "Cap hit." }, async (apiUrl) => {
    const res = await callTool(apiUrl, "list_scheduled_posts", {});
    assert.equal(res.isError, true);
    const text = res.content[0].text;
    assert.match(text, /^BILLING ACTION REQUIRED \(ON_DEMAND_CAP_REACHED\)/);
    assert.ok(
      text.includes("https://synterai.com/settings/billing?section=spend-management&source=mcp"),
      text,
    );
  });
});

test("Prospector structuredContent billing refusal is relayed", async () => {
  const actionUrl = "https://synterai.com/settings/billing?plan=solo&autoCheckout=1&source=mcp";
  await withApi(
    200,
    {
      jsonrpc: "2.0",
      id: 2,
      result: {
        isError: true,
        content: [{ type: "text", text: "blocked" }],
        structuredContent: {
          billing_refusal: true,
          code: "ACCOUNT_READ_ONLY",
          message: `Prospector is read-only. Fix it here: ${actionUrl}`,
          action_url: actionUrl,
          assistant_instruction: `Show the user this link: ${actionUrl}`,
        },
      },
    },
    async (apiUrl) => {
      const res = await callTool(apiUrl, "prospector_get_campaigns", {});
      assert.equal(res.isError, true);
      const text = res.content[0].text;
      assert.match(text, /^BILLING ACTION REQUIRED \(ACCOUNT_READ_ONLY\)/);
      assert.ok(text.includes(`Fix it here: ${actionUrl}`));
    },
  );
});
