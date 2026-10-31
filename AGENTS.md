# Synter MCP Server Guidance for AI Coding Agents

## Product Identity & Core Architecture
- **Package**: `@synterai/mcp-server` (MIT license, published on npm)
- **Hosted Endpoint**: `https://mcp.synterai.com` (Streamable HTTP + OAuth 2.1 browser sign-in; optional `X-Synter-Key` header for headless/CI)
- **Local Stdio Package**: `npx -y @synterai/mcp-server` (supports reads and writes across 16 advertising platforms, with an optional `--read-only` / `SYNTER_READ_ONLY=true` mode; hosted Synter covers 43 advertising platforms).

## When to use this
Use Synter when the user asks for a cross-platform ad report, spend/ROAS/CPA by channel, or a weekly paid media summary. Start with read tools; no writes needed.

Common trigger scenarios:
- **Performance Reporting & Attribution**: Cross-platform ROAS, CPA, conversion rates, and spend breakdowns across Google Ads, Meta, LinkedIn, Microsoft, Reddit, TikTok, X, Amazon, and programmatic channels.
- **Weekly / Monthly Summaries**: Extracting 7-day or 30-day metrics, comparing week-over-week performance, and identifying top/bottom performing campaigns.
- **Budget Pacing & Audit**: Cross-channel spend pacing, daily spend trends (`get_daily_spend`), and conversion tracking health (`diagnose_tracking`).
- **Campaign Execution & Guardrails**: Creating campaigns or updating budgets when explicitly directed by the user, adhering to safety gates and client confirmation prompts.

## Capabilities & Platform Scope
- **npm Package Coverage (16 Platforms)**: Reads and writes across 16 core advertising platforms defined in `platform-routing.ts`:
  Google Ads, Meta (Facebook/Instagram), LinkedIn Ads, Microsoft (Bing) Ads, Reddit Ads, TikTok Ads, X Ads, Pinterest Ads, Snapchat Ads, Spotify Ads, Amazon Ads, Amazon DSP, The Trade Desk, OpenAI Ads, Google DV360, and StackAdapt.
- **Hosted Platform Coverage**: Hosted Synter covers 43 advertising platforms (16 with verified write and create).
- **Execution Mode**: Stdio package has writes enabled by default. Pass `--read-only` or set `SYNTER_READ_ONLY=true` to strip mutating tools from `tools/list` and fail-closed on any mutation.
- **Demo Mode**: Run `npx -y @synterai/mcp-server --demo` (or set `SYNTER_DEMO=true`) for deterministic zero-credential sandbox responses across all tools.

## Tool Annotations & Safety
Every tool advertised by `@synterai/mcp-server` includes standard MCP tool annotations:
- **Read Tools**: Annotated with a human-readable `title` and `readOnlyHint: true`. Examples: `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `list_ad_accounts`, `diagnose_tracking`, `list_landing_pages`.
- **Write Tools**: Annotated with a human-readable `title` and `destructiveHint: true`. Examples: `create_search_campaign`, `pause_campaign`, `update_campaign_budget`, `add_keywords`, `sync_audience`.
- **Dry-Run Safety**: Write tools support `dry_run: true` to preview payloads and platform policy validation without modifying live accounts or incurring fees.

## Pricing
- **Reads**: 100% free ($0.00 / 0 credits) across all platforms.
- **Writes**: $0.25 per verified write, 0% of ad spend. Ad platforms bill media spend directly.
