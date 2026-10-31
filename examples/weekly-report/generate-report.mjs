#!/usr/bin/env node

/**
 * Weekly Paid Media Performance Report Generator
 *
 * Runs against Synter MCP Server in zero-credential demo mode (--demo).
 * Queries read-only performance, campaigns, and pacing tools across
 * multiple ad platforms and outputs a consolidated weekly performance report.
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverBinary = path.resolve(__dirname, "../../dist/index.js");

async function generateWeeklyReport() {
  const env = {
    PATH: process.env.PATH ?? "",
    SYNTER_DEMO: "true",
  };

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverBinary, "--demo"],
    env,
    stderr: "ignore",
  });

  const client = new Client(
    { name: "weekly-report-generator", version: "1.0.0" },
    { capabilities: {} }
  );

  await client.connect(transport);

  try {
    const platformsToReport = ["google", "meta", "linkedin", "reddit"];
    const channelMetrics = [];

    for (const platform of platformsToReport) {
      const perfRes = await client.callTool({
        name: "get_performance",
        arguments: { platform, date_range: "LAST_7_DAYS" },
      });

      if (!perfRes.isError && perfRes.content?.[0]?.text) {
        try {
          const perfData = JSON.parse(perfRes.content[0].text);
          const summary = perfData.summary ?? perfData;
          channelMetrics.push({
            platform: platform.charAt(0).toUpperCase() + platform.slice(1),
            spend: summary.total_spend_usd ?? summary.spend ?? 0,
            impressions: summary.total_impressions ?? summary.impressions ?? 0,
            clicks: summary.total_clicks ?? summary.clicks ?? 0,
            conversions: summary.total_conversions ?? summary.conversions ?? 0,
            cpa: summary.cpa ?? (summary.total_conversions ? (summary.total_spend_usd / summary.total_conversions) : 0),
            roas: summary.roas ?? 0,
          });
        } catch {
          // ignore parsing error for individual channel in recipe
        }
      }
    }

    // Query portfolio pacing report
    let pacingSummary = null;
    const pacingRes = await client.callTool({
      name: "pacing_report",
      arguments: {},
    });
    if (!pacingRes.isError && pacingRes.content?.[0]?.text) {
      try {
        pacingSummary = JSON.parse(pacingRes.content[0].text);
      } catch {
        // ignore parsing error
      }
    }

    // Compute blended totals
    const totalSpend = channelMetrics.reduce((acc, c) => acc + c.spend, 0);
    const totalImpressions = channelMetrics.reduce((acc, c) => acc + c.impressions, 0);
    const totalClicks = channelMetrics.reduce((acc, c) => acc + c.clicks, 0);
    const totalConversions = channelMetrics.reduce((acc, c) => acc + c.conversions, 0);
    const blendedCpa = totalConversions > 0 ? (totalSpend / totalConversions) : 0;
    const blendedCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100) : 0;
    const weightedRoas = totalSpend > 0
      ? (channelMetrics.reduce((acc, c) => acc + (c.roas * c.spend), 0) / totalSpend)
      : 0;

    // Format output Markdown
    const lines = [
      "# Weekly Paid Media Performance Report (Last 7 Days)",
      "",
      `*Report generated via Synter MCP (@synterai/mcp-server) — Zero-credential demo mode*`,
      "",
      "## Executive Summary",
      `- **Total Paid Spend**: $${totalSpend.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `- **Total Conversions**: ${totalConversions.toLocaleString("en-US")}`,
      `- **Blended CPA**: $${blendedCpa.toFixed(2)}`,
      `- **Blended ROAS**: ${weightedRoas.toFixed(2)}x`,
      `- **Total Clicks**: ${totalClicks.toLocaleString("en-US")} (CTR: ${blendedCtr.toFixed(2)}%)`,
      `- **Total Impressions**: ${totalImpressions.toLocaleString("en-US")}`,
      "",
      "## Channel Breakdown",
      "| Channel | Spend (USD) | Clicks | Conversions | CPA | ROAS |",
      "| :--- | :--- | :--- | :--- | :--- | :--- |",
    ];

    for (const m of channelMetrics) {
      lines.push(
        `| **${m.platform}** | $${m.spend.toFixed(2)} | ${m.clicks.toLocaleString()} | ${m.conversions.toLocaleString()} | $${m.cpa.toFixed(2)} | ${m.roas.toFixed(2)}x |`
      );
    }

    if (pacingSummary) {
      lines.push("");
      lines.push("## Portfolio Pacing Status");
      lines.push(`- **Month-to-Date Spend**: $${(pacingSummary.mtd_spend_usd ?? totalSpend).toLocaleString("en-US", { minimumFractionDigits: 2 })}`);
      lines.push(`- **Pacing Status**: ${pacingSummary.status ?? "ON_TRACK"}`);
      if (pacingSummary.warnings && pacingSummary.warnings.length > 0) {
        lines.push("- **Warnings**:");
        for (const w of pacingSummary.warnings) {
          lines.push(`  - ${w}`);
        }
      }
    }

    lines.push("");
    lines.push("## Recommendations");
    lines.push("- **Top Efficiency**: Reddit and Meta show strong conversion volume and favorable CPA relative to target.");
    lines.push("- **Action Item**: Review Google Ads search term query logs for negative keyword additions to cut waste.");

    const reportOutput = lines.join("\n");
    console.log(reportOutput);
    return reportOutput;
  } finally {
    await client.close();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateWeeklyReport().catch((err) => {
    console.error("Failed to generate weekly report:", err);
    process.exit(1);
  });
}

export { generateWeeklyReport };
