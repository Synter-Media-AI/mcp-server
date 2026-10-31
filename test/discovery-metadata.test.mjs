import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

const LEAD =
  "Open-source MCP server for ad performance reports and approved changes across 16 ad platforms. $0.25 per verified write, 0% of ad spend.";

test("server.json advertises the hosted remote at https://mcp.synterai.com", () => {
  const server = JSON.parse(read("server.json"));
  assert.equal(server.remotes[0].url, "https://mcp.synterai.com");
});

test("server.json version matches package.json and description matches canonical LEAD", () => {
  const server = JSON.parse(read("server.json"));
  const pkg = JSON.parse(read("package.json"));
  assert.equal(server.version, pkg.version);
  assert.equal(server.description, LEAD);
});

test("all discovery metadata files and README contain LEAD", () => {
  for (const p of [
    "server.json",
    "package.json",
    "manifest.json",
    "plugin.json",
    ".claude-plugin/plugin.json",
    "gemini-extension.json",
    "glama.json",
    "smithery.yaml",
    "README.md",
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
  ]) {
    const text = read(p);
    assert.ok(!text.includes("syntermedia.ai"), `${p} references syntermedia.ai`);
  }
});

test("public metadata has no stale platform counts", () => {
  for (const p of [
    "README.md",
    "server.json",
    "gemini-extension.json",
    "manifest.json",
    "package.json",
  ]) {
    assert.doesNotMatch(read(p), /\b(14|19|21)\s+(ad\s+)?platforms\b/i, `${p} has a stale platform count`);
  }
});

test("regression test: no banned phrases in metadata, README, or src tool descriptions", () => {
  const banned = [
    /43\s+advertising\s+platforms/i,
    /43\s+ad\s+platforms/i,
    /free\s+to\s+read/i,
  ];

  const metadataFiles = [
    "server.json",
    "package.json",
    "manifest.json",
    "plugin.json",
    ".claude-plugin/plugin.json",
    "gemini-extension.json",
    "glama.json",
    "smithery.yaml",
    "AGENTS.md",
    "llms.txt",
  ];

  for (const f of metadataFiles) {
    const text = read(f);
    for (const pat of [...banned, /only\s+agentic\s+dsp/i]) {
      assert.ok(!pat.test(text), `${f} contains banned phrase matching ${pat}`);
    }
  }

  const readme = read("README.md");
  for (const pat of [...banned, /\$20\/(?:mo|month)/i]) {
    assert.ok(!pat.test(readme), `README.md contains banned phrase matching ${pat}`);
  }

  const srcIndex = read("src/index.ts");
  for (const pat of [...banned, /only\s+agentic\s+dsp/i]) {
    assert.ok(!pat.test(srcIndex), `src/index.ts contains banned phrase matching ${pat}`);
  }
});

test("validate-discovery passes", () => {
  execFileSync(process.execPath, [new URL("../scripts/validate-discovery.mjs", import.meta.url).pathname]);
});

test("README documents Add Synter to Amp as built-in and local read-only config", () => {
  const readme = read("README.md");
  assert.ok(readme.includes("## Add Synter to Amp"), "README missing Add Synter to Amp section");
  assert.ok(
    readme.includes("In Amp: Synter is a built-in integration. Turn it on in Amp under Settings > Integrations."),
    "README missing built-in integration line",
  );
  assert.ok(
    readme.includes("Claude, ChatGPT and other MCP clients, hosted (30+ ad platforms, the only Agentic DSP): https://mcp.synterai.com"),
    "README missing hosted line",
  );
  assert.ok(readme.includes("Local read-only (16 platforms)"), "README missing local read-only label");
  assert.ok(readme.includes("@synterai/mcp-server"), "README missing package reference");
  assert.ok(readme.includes("--read-only"), "README missing --read-only flag");
  assert.ok(readme.includes("${SYNTER_API_KEY}"), "README missing ${SYNTER_API_KEY} variable");
  assert.ok(readme.includes("**Amp:** built in"), "README missing line 52 Amp built-in pointer");
  assert.ok(!readme.includes("amp mcp add"), "README should not contain amp mcp add");
  assert.ok(!readme.includes("amp mcp remote"), "README should not contain amp mcp remote");
  assert.ok(!readme.includes("amp.mcpServers"), "README should not contain amp.mcpServers");
});

