# Synter

> Open-source MCP server for running ads with AI agents across 43 ad platforms (16 in local stdio): free reads ($0.00/mo), $20/mo Solo ($20/mo usage value included; $0.05-$0.25 writes), 0% of ad spend.

Synter (https://synterai.com) is an open-source MCP server (`@synterai/mcp-server@1.4.6`, MIT license) that lets AI agents report on and make governed changes to ad campaigns across **43 advertising platforms** on hosted MCP (`https://mcp.synterai.com`) and **16 core full-write + read platforms** in the local stdio package (Google Ads, Meta, LinkedIn, Microsoft, Reddit, TikTok, X, Pinterest, Snapchat, Spotify, Amazon Ads, Amazon DSP, The Trade Desk, OpenAI Ads, DV360, and StackAdapt).

## Connection

- **Hosted MCP**: `https://mcp.synterai.com` (Streamable HTTP, 140+ tools across 43 platforms).
- **Local Stdio**: `npx -y @synterai/mcp-server@1.4.6` (pass `--read-only` to disable writes, `--toolset ad-ops` to expose only paid-ad tools, or `--demo` for zero-credential sandbox mode).
- **Auth**: OAuth 2.1 browser sign-in, or the `X-Synter-Key: syn_...` header for headless use. Do not send `Authorization: Bearer syn_...` to the hosted MCP yet; REST/SDKs use Bearer.
- **Connect Accounts**: Users connect ad accounts at https://synterai.com/integrations or programmatically via `POST /api/v1/connections/start`.

## Key tools

- **Reads (`readOnlyHint: true`, `$0.00`)**: `list_ad_accounts`, `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `user_budget_pacing_report`, `optimize_budget`, `diagnose_tracking`, `list_conversions`, `inspect_agent_shield`, `verify_angstrom_claim`.
- **Writes (`destructiveHint: true`)**: `create_search_campaign`, `create_display_campaign`, `create_pmax_campaign`, `create_meta_campaign`, `create_linkedin_campaign`, `create_reddit_campaign`, `pause_campaign`, `update_campaign_budget`, `add_keywords`, `add_negative_keywords`, `stage_audience_artifact`, `sync_audience`, `manage_audience`, `run_tool`.

Start with read tools for reports. Use `dry_run: true` (`$0.00`) to preview any write before running it live.

## Safety

- New campaigns are created `PAUSED` by default; nothing spends until explicitly enabled.
- Confirm the account, budget, and action with the user before any live write.
- Agent Shield workspace spend caps (2x max single budget increase, $5,000/day default velocity ceiling), launch preflight, mandatory post-write provider readback, and an immutable audit log apply to writes.

## Pricing (100% USD — 0% of Ad Spend)

- **Free Read Access ($0.00/mo)**: All own-account reads, diagnostics, GAQL queries, `get_ad_readback`, and `dry_run: true` previews are **$0.00**.
- **SOLO ($20.00/mo or $200.00/yr)**: 1 seat, 1 workspace, includes **$20.00/mo in claimable usage value** ($0.05 light writes, $0.25 standard writes, $5.00 MCP campaign launches).
- **SCALE ($500.00/mo or $5,000.00/yr)**: 5 seats, includes **$500.00/mo in claimable usage value**, multi-workspace, 24/7 Autopilot.
- **CUSTOM**: Enterprise contracts. See https://synterai.com/pricing.
