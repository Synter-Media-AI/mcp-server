import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

test("server.json advertises the hosted remote at https://mcp.synterai.com", () => {
  const server = JSON.parse(read("server.json"));
  assert.equal(server.remotes[0].url, "https://mcp.synterai.com");
});

test("public metadata does not reference syntermedia.ai", () => {
  for (const p of ["README.md", "server.json", "gemini-extension.json", "manifest.json", "package.json", "plugin.json", ".claude-plugin/plugin.json", "glama.json", "smithery.yaml"]) {
    const text = read(p);
    assert.ok(!text.includes("syntermedia.ai"), `${p} references syntermedia.ai`);
  }
});

test("README distinguishes hosted read coverage from verified write and create coverage", () => {
  const readme = read("README.md");
  assert.ok(readme.includes("Reads across 43 ad platforms; 16 with verified write and create"));
  assert.ok(readme.includes("local npm/stdio package's `platform` enum covers the 16 core platforms"));
  assert.ok(readme.includes("27 more, read through Synter's hosted MCP"));
});

test("public metadata has no stale platform counts", () => {
  for (const p of ["README.md", "server.json", "gemini-extension.json", "manifest.json", "package.json"]) {
    assert.doesNotMatch(read(p), /\b(14|19|21)\s+(ad\s+)?platforms\b/i, `${p} has a stale platform count`);
  }
});

test("validate-discovery passes", () => {
  execFileSync(process.execPath, [new URL("../scripts/validate-discovery.mjs", import.meta.url).pathname]);
});

test("README documents Add Synter to Amp with CLI and remote commands", () => {
  const readme = read("README.md");
  assert.ok(readme.includes("## Add Synter to Amp"), "README missing Add Synter to Amp section");
  assert.ok(readme.includes("amp mcp add synter https://mcp.synterai.com"), "README missing hosted amp mcp add command");
  assert.ok(readme.includes("amp mcp remote --personal add Synter https://mcp.synterai.com --auth oauth"), "README missing remote amp command");
  assert.ok(readme.includes("amp mcp add synter-ro --env SYNTER_API_KEY=$SYNTER_API_KEY -- npx -y @synterai/mcp-server --read-only"), "README missing local read-only amp command");
  assert.ok(readme.includes("amp.mcpServers"), "README missing amp.mcpServers JSON");
  assert.ok(readme.includes("${SYNTER_API_KEY}"), "README missing ${SYNTER_API_KEY} variable");
  assert.ok(readme.includes("mcp.json"), "README missing mcp.json reference");
  assert.ok(readme.includes("SKILL.md"), "README missing SKILL.md reference");
});

