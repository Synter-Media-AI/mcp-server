import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptPath = path.resolve(__dirname, "../examples/weekly-report/generate-report.mjs");

test("weekly-report recipe script runs in demo mode with no API key and prints valid report", async () => {
  const env = {
    PATH: process.env.PATH ?? "",
  };
  delete env.SYNTER_API_KEY;

  const { stdout, stderr } = await execFileAsync(process.execPath, [scriptPath], { env });
  assert.equal(stderr, "");
  assert.ok(stdout.includes("# Weekly Paid Media Performance Report (Last 7 Days)"));
  assert.ok(stdout.includes("## Executive Summary"));
  assert.ok(stdout.includes("## Channel Breakdown"));
  assert.ok(stdout.includes("**Google**"));
  assert.ok(stdout.includes("**Meta**"));
  assert.ok(stdout.includes("**Linkedin**"));
  assert.ok(stdout.includes("**Reddit**"));
  assert.ok(stdout.includes("## Portfolio Pacing Status"));
});
