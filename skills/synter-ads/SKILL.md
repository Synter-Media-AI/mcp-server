---
name: synter-ads
description: Technical reference for the Synter Media MCP server (@synterai/mcp-server@1.4.4, https://mcp.synterai.com) and REST/SDK integration across 16 ad platforms. Documents tool schemas, free read-only operations ($0.00 / 0 credits), Solo ($20/mo) and Scale ($500/mo) execution tiers, server-side approval gates, and scoped credentials.
---

# Synter Media MCP Server (`synter-ads`) — Technical Reference

- **Package**: `@synterai/mcp-server@1.4.4` (MIT license, open source at `https://github.com/Synter-Media-AI/mcp-server`)
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (Streamable HTTP + OAuth 2.1 PKCE or `X-Synter-Key` header)
- **Local Stdio / Sandbox**: `npx -y @synterai/mcp-server@1.4.4` (pass `--read-only` to strip write tools at startup, or `--demo` for offline deterministic sandbox testing without credentials)
- **REST API**: `https://api.synterai.com/v1`

## 1. Pricing & Credit Metering (`services/credits.py`)

| Tier / Operation | Monthly Fee | Included Monthly Credits | Per-Call Cost |
| :--- | :--- | :--- | :--- |
| **Free Read-Only Tier** | **$0.00 / month** | N/A (`0 credits` per read) | **$0.00 (`0 credits`)** for all own-account read, reporting, campaign inventory, daily spend, budget pacing, conversion audit, and GAQL diagnostic tools (`list_campaigns`, `get_performance`, `get_daily_spend`, `optimize_budget`, `diagnose_tracking`, `list_conversions`, `run_gaql_query`, `get_connection_status`, `get_credit_balance`, `forecast_tool_cost`, `inspect_agent_shield`, `verify_angstrom_claim`, `get_skill`, `get_llm_visibility`). |
| **SOLO Plan** | **$20.00 / month** ($200/yr) | **$20.00 / month** claimable | 1 seat, 1 workspace. Light writes (`pause_campaign`, `update_campaign_budget`) cost **$0.05** (`2 credits`). Unpriced write tools fail closed at **$0.25** (`10 credits`). |
| **SCALE Plan** | **$500.00 / month** ($5,000/yr) | **$500.00 / month** claimable | 5 seats, multi-workspace support, CRM sync (HubSpot, Salesforce, Attio, Pipedrive), and priority SLA. |
| **CUSTOM Plan** | Sales-led | Custom pooled allowance | Multi-tenant partner/agency workspaces, dedicated VPC runners, SAML SSO/Okta. |

- **Ad Spend Markup**: **0%** (no percentage of ad spend; media is billed directly by the ad networks).
- **Pre-Call Cost Lookup**: Call `forecast_tool_cost(tool_name)` (`$0.00`) to inspect the exact USD/credit rate before invoking any tool.

## 2. Supported Ad Platforms (16 Ad Platforms)

All generic tools (`list_campaigns`, `get_performance`, `get_daily_spend`, `pause_campaign`, `update_campaign_budget`) accept a unified `platform` enum across **16 ad platforms**:

1. `google` — Google Ads (Search, Display, Performance Max, YouTube, Demand Gen; plus `run_gaql_query`)
2. `meta` — Meta Ads (Facebook & Instagram)
3. `linkedin` — LinkedIn Ads
4. `microsoft` — Microsoft Advertising (Bing)
5. `reddit` — Reddit Ads
6. `tiktok` — TikTok Ads
7. `x` — X Ads
8. `pinterest` — Pinterest Ads
9. `snapchat` — Snapchat Ads
10. `spotify` — Spotify Ads
11. `amazon_ads` — Amazon Sponsored Ads (SP, SB, SD)
12. `amazon_dsp` — Amazon DSP
13. `the_trade_desk` — The Trade Desk (TTD)
14. `openai` — OpenAI Ads
15. `dv360` — Google Display & Video 360 (DV360)
16. `stackadapt` — StackAdapt Programmatic DSP

## 3. Server-Side Approval Gate & Scoped Credentials

Every tool execution across MCP, REST, SDK, and CLI passes through the server-side Safety Gate (`services/safety_gate.py` & `services/policy_engine.py`):

- **Enforced Paused-on-Create**: Newly created campaigns (`create_search_campaign`, `create_display_campaign`, `create_pmax_campaign`, `create_campaign_plan`) are server-enforced `PAUSED` on creation.
- **Draft -> Review -> Approve -> Execute Workflow**:
  1. `create_campaign_plan` creates a draft launch plan and returns an idempotency `execute_token`.
  2. `run_launch_preflight` validates conversion tracking and landing page readiness (read-only, `$0.00`).
  3. `approve_campaign_plan` requires `expected_version` optimistic locking so a modified plan cannot be approved unseen.
  4. `execute_campaign_plan` executes approved entities in dependency order and automatically pauses already-activated entities if a downstream step fails.
- **Held Writes (`HTTP 202 pending_review`)**: Under the default `Suggest` workspace policy, high-impact writes (campaign creation, enabling/resuming campaigns, deletions, creative pushes) return `status: "pending_review"` with an `audit_id` and `reviewed_args` until approved by a workspace admin.
- **Directional & Read-Only Key Scopes**:
  - `ads:read` (or `--read-only` CLI flag): Permits all reporting and diagnostic tools; blocks all mutations.
  - `budget:decrease`: Permits emergency `pause_campaign` and downward `update_campaign_budget` adjustments while rejecting budget increases at the gateway.
- **Post-Write Readback Verification**: Call `list_campaigns`, `get_ad_readback`, or `get_account_changelog` after any write to verify upstream platform state.
