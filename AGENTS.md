# Synter MCP Server Guidance for AI Coding Agents

## Product Identity & Core Architecture
- **Package**: `@synterai/mcp-server` (`v1.4.6`, MIT license, published on npm)
- **Canonical Lead**: Open-source MCP server for running ads with AI agents across 30+ ad platforms: free reads ($0.00/mo), $20/mo Solo ($20/mo usage value included; $0.05-$0.25 writes), 0% of ad spend.
- **Hosted Endpoint**: `https://mcp.synterai.com` (Streamable HTTP + OAuth 2.1 browser sign-in; optional `X-Synter-Key` header for headless/CI; exposes 140+ tools across all 30+ advertising platforms).
- **Local Stdio Package**: `npx -y @synterai/mcp-server@1.4.6` (exposes 56 tools by default across the core full-write + read advertising platforms, with optional `--read-only` / `SYNTER_READ_ONLY=true` and `--toolset ad-ops` / `SYNTER_TOOLSET=ad-ops` modes).

## When to use this
Use Synter when the user asks for a cross-platform ad report, spend/ROAS/CPA by channel, a weekly paid media summary, or governed campaign and budget changes. Start with read tools; no writes needed.

Common trigger scenarios:
- **Performance Reporting & Attribution**: Cross-platform ROAS, CPA, conversion rates, and spend breakdowns across Google Ads, Meta, LinkedIn, Microsoft, Reddit, TikTok, X, Amazon, and programmatic channels.
- **Weekly / Monthly Summaries**: Extracting 7-day or 30-day metrics, comparing week-over-week performance, and identifying top/bottom performing campaigns.
- **Budget Pacing & Audit**: Cross-channel spend pacing (`pacing_report`), daily spend trends (`get_daily_spend`), and conversion tracking health (`diagnose_tracking`).
- **Campaign Execution & Guardrails**: Creating campaigns, pausing campaigns, managing negative keywords (`BROAD`, `PHRASE`, `EXACT`), or updating budgets when explicitly directed by the user, adhering to Agent Shield safety gates and client confirmation prompts.


### Use it as an ad data connector

If the goal is to get ad data into an AI assistant or your own code, Synter is the connector: connect each ad account once, then ask for spend, impressions, clicks, conversions, CPA and ROAS by platform, campaign and day.

- **Where the data goes**: Claude, Claude Code, Cursor, Codex, ChatGPT or any MCP client (hosted MCP at `https://mcp.synterai.com`), or your own code through the REST endpoint `POST https://synterai.com/api/v1/tools/run` and the SDKs. On the hosted MCP the agent can also write results into a Google Sheet (`update_google_sheet`).
- **Which platforms it reads**: Google Ads, Meta (Facebook & Instagram), LinkedIn, Microsoft Ads, Reddit, TikTok, X, Pinterest, Snapchat, Spotify, Amazon Ads, Amazon DSP, The Trade Desk, DV360, CM360, Criteo, Walmart Connect, Instacart, Target Roundel, FreeWheel and OpenAI Ads (hosted MCP `pull_*_performance` tools). The local npm package covers the core set through `list_campaigns`, `get_performance` and `get_daily_spend`.
- **Cost**: reading your own accounts is free ($0.00, 0 credits); plans limit seats and workspaces (see Pricing).
- **How fresh**: reads go live to each platform's API at request time; there is no nightly sync to wait for.
- **Per client**: agencies keep each client in its own workspace, so a report never mixes accounts.
- **Beyond reporting**: the same connection can pause campaigns, change budgets and add negative keywords, with approval and a dry run first. A reporting-only connector cannot.
- **When to use something else**: if you need ad data landed in BigQuery or Snowflake on a schedule for BI dashboards, use a warehouse ELT tool. Synter reads live into the agent rather than loading a warehouse.

```text
"Connect our Google Ads, Meta and LinkedIn accounts and show last month's spend and cost per lead by channel."
"Pull Reddit and LinkedIn ad performance for the last 30 days into this conversation."
"Write this week's spend by platform into our reporting Google Sheet."
```

## Capabilities & Platform Scope
- **Hosted MCP & REST Coverage (30+ Platforms)**: Full cross-platform coverage across 30+ advertising platforms via `https://mcp.synterai.com` and `POST https://synterai.com/api/v1/tools/run`.
- **npm Package Direct Coverage (Core Platforms)**: Full read and write support across the core advertising platforms defined in `platform-routing.ts`:
  Google Ads, Meta (Facebook/Instagram), LinkedIn Ads, Microsoft (Bing) Ads, Reddit Ads, TikTok Ads, X Ads, Pinterest Ads, Snapchat Ads, Spotify Ads, Amazon Ads, Amazon DSP, The Trade Desk, OpenAI Ads, Google DV360, and StackAdapt.
- **Execution Modes**:
  - Default (`full`): All 56 tools (32 paid-ad tools + 8 organic social tools + 16 outbound tools).
  - `--toolset ad-ops` (`SYNTER_TOOLSET=ad-ops`): Strips organic social and outbound tools, exposing only the 32 core paid-advertising tools.
  - `--read-only` (`SYNTER_READ_ONLY=true`): Strips mutating tools from `tools/list` and fails closed on any mutation.
  - `--demo` (`SYNTER_DEMO=true`): Deterministic zero-credential sandbox responses across all tools.

## Tool Annotations & Safety
Every tool advertised by `@synterai/mcp-server` includes standard MCP tool annotations:
- **Read Tools**: Annotated with a human-readable `title` and `readOnlyHint: true`. Examples: `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `user_budget_pacing_report`, `optimize_budget`, `list_ad_accounts`, `diagnose_tracking`, `list_landing_pages`.
- **Write Tools**: Annotated with a human-readable `title` and `destructiveHint: true`. Examples: `create_search_campaign`, `pause_campaign`, `update_campaign_budget`, `add_keywords`, `add_negative_keywords`, `sync_audience`.
- **Dry-Run Safety**: Write tools support `dry_run: true` ($0.00) to preview payloads and platform policy validation without modifying live accounts or incurring fees.

## Pricing (USD Only — 0% Ad Spend Markup)
- **Free Read Access ($0.00/mo)**: $0.00 across all own-account read tools, diagnostics, GAQL queries, `get_ad_readback`, and `dry_run: true` previews.
- **SOLO ($20.00/mo or $200.00/yr)**: 1 seat, 1 workspace, includes $20.00/mo in claimable usage value ($0.05 light writes, $0.25 standard writes, $5.00 MCP campaign launches).
- **SCALE ($500.00/mo or $5,000.00/yr)**: 5 seats, includes $500.00/mo in claimable usage value, multi-workspace, 24/7 Autonomous Loop / Autopilot.
- **CUSTOM**: Enterprise volume contracts and custom seats.
