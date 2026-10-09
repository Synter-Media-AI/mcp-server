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
  for (const p of ["README.md", "server.json", "gemini-extension.json"]) {
    const text = read(p).replaceAll("formerly syntermedia.ai", "");
    assert.ok(!text.includes("syntermedia.ai"), `${p} references syntermedia.ai`);
  }
});

test('README says "16 ad platforms"', () => {
  assert.ok(read("README.md").includes("16 ad platforms"));
});

test("public metadata has no stale platform counts", () => {
  for (const p of ["README.md", "server.json", "gemini-extension.json", "manifest.json", "package.json"]) {
    assert.doesNotMatch(read(p), /\b(14|19|21|27)\s+(ad\s+)?platforms\b/i, `${p} has a stale platform count`);
  }
});

test("validate-discovery passes", () => {
  execFileSync(process.execPath, [new URL("../scripts/validate-discovery.mjs", import.meta.url).pathname]);
});
