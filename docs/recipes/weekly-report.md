# Recipe: Weekly Paid Media Performance Report

This recipe demonstrates how to build a unified cross-platform weekly advertising performance report using Synter MCP (`@synterai/mcp-server`).

It queries read-only performance, campaigns, and pacing data across connected ad networks (Google Ads, Meta, LinkedIn, Reddit, Microsoft, etc.) and compiles a blended executive report.

## When to use this recipe
Use this workflow when you or an AI agent needs:
- A weekly paid media summary across all connected ad channels.
- Spend, conversions, CPA, and ROAS breakdown by platform for the last 7 days.
- Portfolio-wide budget pacing and spend velocity checks.
- Zero-risk reporting without initiating any write or mutation operations.

---

## Read-Only Tools Used

All tools used in this recipe are strictly read-only (`readOnlyHint: true`) and cost **$0.00 / 0 credits**:

| Tool | Annotation Title | Purpose |
| :--- | :--- | :--- |
| `list_ad_accounts` | **List Connected Ad Accounts** | Discover connected ad networks and account IDs |
| `get_performance` | **Get Performance Metrics** | Retrieve impressions, clicks, spend, conversions, and ROAS for `date_range: "LAST_7_DAYS"` |
| `list_campaigns` | **List Campaigns** | Inspect individual campaigns, statuses, and performance |
| `get_daily_spend` | **Get Daily Spend Breakdown** | Analyze daily spend trends over the past 7 days |
| `pacing_report` | **Cross-Channel Budget Pacing Report** | Audit portfolio pacing against month-to-date targets |

---

## Trying with Zero Credentials (Demo Mode)

You can run this recipe immediately without an API key, signup, or connected accounts using Synter's built-in demo sandbox:

```bash
# Launch server in demo mode
npx -y @synterai/mcp-server --demo
```

Or run the bundled runnable example:

```bash
node examples/weekly-report/generate-report.mjs
```

---

## Agent Prompt Example

In Claude Code, Cursor, Codex, or Amp, provide this prompt:

> "Generate a weekly paid media performance summary for the last 7 days across my connected Google Ads, Meta, LinkedIn, and Reddit accounts. Include spend, clicks, conversions, CPA, and ROAS by platform, compute portfolio blended totals, and check current budget pacing status."

The agent will execute `get_performance`, `list_campaigns`, and `pacing_report` across the target platforms and produce a summary.

---

## Sample Report Output

```markdown
# Weekly Paid Media Performance Report (Last 7 Days)

*Report generated via Synter MCP (@synterai/mcp-server)*

## Executive Summary
- **Total Paid Spend**: $8,124.00
- **Total Conversions**: 467
- **Blended CPA**: $17.40
- **Blended ROAS**: 3.15x
- **Total Clicks**: 10,450 (CTR: 2.65%)
- **Total Impressions**: 394,300

## Channel Breakdown
| Channel | Spend (USD) | Clicks | Conversions | CPA | ROAS |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Google** | $3,574.00 | 5,670 | 259 | $13.80 | 3.15x |
| **Meta** | $2,100.00 | 3,100 | 133 | $15.79 | 3.15x |
| **LinkedIn** | $2,100.00 | 430 | 31 | $67.74 | 3.15x |
| **Reddit** | $350.00 | 1,250 | 44 | $7.95 | 3.15x |

## Portfolio Pacing Status
- **Month-to-Date Spend**: $8,124.00
- **Pacing Status**: ON_TRACK

## Recommendations
- **Efficiency**: Reddit Ads and Meta Ads demonstrate the lowest acquisition cost.
- **Optimization**: Review Google Ads search queries to add negative keywords and reduce non-converting click spend.
```
