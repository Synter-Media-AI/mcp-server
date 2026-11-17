import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

const LEAD =
  "Open-source MCP server for running ads with AI agents across 30+ ad platforms: free reads ($0.00/mo), $20/mo Solo ($20/mo usage value included; $0.05-$0.25 writes), 0% of ad spend.";

const REGISTRY_DESCRIPTION =
  "AI agents run ads across 30+ ad platforms. Hosted MCP with OAuth at mcp.synterai.com.";

const SERVER_JSON_MAX_DESCRIPTION = 100;

test("server.json advertises the hosted remote at https://mcp.synterai.com", () => {
  const server = JSON.parse(read("server.json"));
  assert.equal(server.remotes[0].url, "https://mcp.synterai.com");
});

test("server.json version matches package.json and description matches REGISTRY_DESCRIPTION", () => {
  const server = JSON.parse(read("server.json"));
  const pkg = JSON.parse(read("package.json"));
  assert.equal(server.version, pkg.version);
  assert.equal(server.description, REGISTRY_DESCRIPTION);
  assert.ok(
    server.description.length <= SERVER_JSON_MAX_DESCRIPTION,
    `server.json description is ${server.description.length} characters; registry cap is ${SERVER_JSON_MAX_DESCRIPTION}`,
  );
  assert.ok(!server.remotes?.[0]?.headers, "hosted remote must be OAuth-only (no headers)");
});

test("all discovery metadata files and README contain LEAD (server.json uses the short registry description)", () => {
  for (const p of [
    "package.json",
    "manifest.json",
    "plugin.json",
    ".claude-plugin/plugin.json",
    "gemini-extension.json",
    "glama.json",
    "smithery.yaml",
    "README.md",
    "llms.txt",
    "AGENTS.md",
    "GEMINI.md",
    "skills/synter-ads/SKILL.md",
  ]) {
    const text = read(p);
    assert.ok(text.includes(LEAD), `${p} must include LEAD`);
  }
});

test("public metadata does not reference syntermedia.ai", () => {
  for (const p of [
    "README.md",
    "server.json",
    "gemini-extension.json",
    "manifest.json",
    "package.json",
    "plugin.json",
    ".claude-plugin/plugin.json",
    "glama.json",
    "smithery.yaml",
    "skills/synter-ads/SKILL.md",
  ]) {
    const text = read(p);
    assert.ok(!text.includes("syntermedia.ai"), `${p} references syntermedia.ai`);
  }
});

test("public metadata has no stale platform counts or mismatched versions", () => {
  for (const p of [
    "README.md",
    "server.json",
    "gemini-extension.json",
    "manifest.json",
    "package.json",
    "llms.txt",
    "AGENTS.md",
    "GEMINI.md",
    "skills/synter-ads/SKILL.md",
  ]) {
    assert.doesNotMatch(
      read(p),
      /\b(14|16|19|20\+|21|27|43)\s+(ad(vertising)?\s+)?platforms\b/i,
      `${p} has a stale platform count`,
    );
    assert.doesNotMatch(
      read(p),
      /\b1\.(4\.8|5\.0)\b/,
      `${p} has an unreleased or mismatched version (expected 1.4.7)`,
    );
  }
});

test("validate-discovery passes", () => {
  execFileSync(process.execPath, [new URL("../scripts/validate-discovery.mjs", import.meta.url).pathname]);
});

test("validate-discovery fails when server.json description exceeds the 100-character registry cap", () => {
  const serverPath = new URL("../server.json", import.meta.url);
  const original = fs.readFileSync(serverPath, "utf8");
  try {
    const server = JSON.parse(original);
    server.description = "A".repeat(SERVER_JSON_MAX_DESCRIPTION + 1);
    fs.writeFileSync(serverPath, `${JSON.stringify(server, null, 2)}\n`);
    let failed = false;
    let message = "";
    try {
      execFileSync(process.execPath, [new URL("../scripts/validate-discovery.mjs", import.meta.url).pathname], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (err) {
      failed = true;
      message = `${err.stderr ?? ""}${err.stdout ?? ""}${err.message ?? ""}`;
    }
    assert.equal(failed, true, "validate-discovery should reject a 101-character description");
    assert.match(message, /description is 101 characters|caps it at 100|REGISTRY_DESCRIPTION/i);
  } finally {
    fs.writeFileSync(serverPath, original);
  }
});

test("README documents Add Synter to Amp as built-in and local read-only config", () => {
  const readme = read("README.md");
  assert.ok(readme.includes("## Add Synter to Amp"), "README missing Add Synter to Amp section");
  assert.ok(
    readme.includes("In Amp: Synter is a built-in integration. Turn it on in Amp under Settings > Integrations."),
    "README missing built-in integration line",
  );
  assert.ok(readme.includes("Local read-only (npm package)"), "README missing local read-only label");
  assert.ok(readme.includes("@synterai/mcp-server"), "README missing package reference");
  assert.ok(readme.includes("--read-only"), "README missing --read-only flag");
  assert.ok(readme.includes("--toolset ad-ops"), "README missing --toolset ad-ops flag");
  assert.ok(readme.includes("${SYNTER_API_KEY}"), "README missing ${SYNTER_API_KEY} variable");
  assert.ok(readme.includes("**Amp:** built in"), "README missing Amp built-in pointer");
  assert.ok(readme.includes('"amp.mcpServers"'), "README Amp MCP fallback must use the amp.mcpServers key");
  assert.ok(!readme.includes(".agents/mcp.json"), "README should not point Amp at .agents/mcp.json");
});

test("harness sweep copy: canonical platform count, pricing, brand, REST route, SDK names", () => {
  const files = ["README.md", "llms.txt", "GEMINI.md", "gemini-extension.json", "package.json", "skills/synter-ads/SKILL.md"];
  const banned = [
    [/\bSynter Media\b/, "old brand name"],
    [/tools\/execute\b/, "unserved REST route (use /api/v1/tools/run)"],
    [/workspace_id=/, "Python SDK has no workspace_id kwarg"],
    [/client\.performance\b/, "Python SDK has no client.performance"],
    [/(?<!ai\.syntermedia:)synter-sdk`\)|cargo add synter-sdk/, "Rust crate is `synter`"],
    [/ai\.synter:synter-sdk/, "Maven coordinates are ai.syntermedia:synter-sdk"],
    [/Settings\s*(→|->|>)\s*Connections/i, "Claude uses Settings → Connectors"],
    [/write limited|create limited/i, "ambiguous write-limited table wording"],
  ];
  for (const f of files) {
    const text = read(f);
    for (const [pat, why] of banned) {
      assert.doesNotMatch(text, pat, `${f}: ${why}`);
    }
  }

  const gemini = JSON.parse(read("gemini-extension.json"));
  assert.equal(gemini.contextFileName, "GEMINI.md");
  assert.ok(fs.existsSync(new URL("../GEMINI.md", import.meta.url)), "GEMINI.md must exist");

  const authLine =
    "Do not send `Authorization: Bearer syn_...` to the hosted MCP yet; REST/SDKs use Bearer.";
  for (const f of ["README.md", "llms.txt", "GEMINI.md"]) {
    assert.ok(read(f).includes(authLine), `${f} missing hosted MCP auth callout`);
  }
  assert.ok(read("README.md").includes("/api/v1/tools/run"), "README must document /api/v1/tools/run");
});
