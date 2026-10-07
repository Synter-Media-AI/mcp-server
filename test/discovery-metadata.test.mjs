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
    assert.ok(!read(p).includes("syntermedia.ai"), `${p} references syntermedia.ai`);
  }
});

test('README says "16 ad platforms"', () => {
  assert.ok(read("README.md").includes("16 ad platforms"));
});

test("validate-discovery passes", () => {
  execFileSync(process.execPath, [new URL("../scripts/validate-discovery.mjs", import.meta.url).pathname]);
});
