---
name: synter-ads
description: Technical reference for @synterai/mcp-server (v1.5.0), covering hosted OAuth, local stdio, platform coverage, pricing and metering, workspace isolation, and write safety.
---

# `@synterai/mcp-server` (v1.5.0) — Technical Reference

- **Package**: `@synterai/mcp-server@1.5.0` (MIT license, [source](https://github.com/Synter-Media-AI/mcp-server))
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (Streamable HTTP + OAuth 2.1 with PKCE, or `X-Synter-Key` header for headless/CI clients)
- **Local Stdio Launch**: `npx -y @synterai/mcp-server@1.5.0` (pass `--read-only` to strip mutating tools from `tools/list` at startup, or `--demo` for offline schema/mock testing)
- **REST API, CLI & SDKs**: `https://synterai.com/api/v1`, `pip install synter`, `@synterai/sdk-js`, `crates.io/crates/synter`, Maven `ai.syntermedia:synter-sdk`

## 1. Platform Coverage (43 Read Platforms; 16 with Verified Write & Create)

Synter reads across **43 ad platforms** through the hosted endpoint (`https://mcp.synterai.com`), with **16 core platforms** supporting verified write and campaign creation in the local npm/stdio `platform` enum:

- **16 Core Platforms (`platform` enum)**: `google`, `meta`, `linkedin`, `microsoft`, `reddit`, `tiktok`, `x`, `pinterest`, `snapchat`, `stackadapt`, `amazon_dsp` (create limited), `spotify` (write limited), `amazon_ads` (write limited), `openai` (write limited), `the_trade_desk` (write/create limited), and `dv360` (write/create limited).
- **27 Additional Hosted Read Platforms**: Taboola, Outbrain, Yahoo DSP, Criteo, Teads, Basis DSP, Quantcast, Nextdoor Ads, Quora Ads, Apple Search Ads, YouTube Ads, Moloco, MNTN, Tatari, Vibe.co, AdRoll, Perplexity Ads, Brave Ads, Carbon Ads, EthicalAds, Twitch Ads, Discord Quests, Roblox Ads, Walmart Connect, Instacart Ads, Target Roundel, and Kroger Precision Marketing.
- **Built-in Ad-Ops Capabilities Beyond Raw Connectors**: Cross-channel budget optimization (`optimize_budget`), Google Ads GAQL queries, negative keyword management (campaign, ad-group, shared list, and account level), first-party audience staging and SHA-256 Customer Match sync (`stage_audience_artifact`, `sync_audience`), AI image/video creative generation, and conversion tracking diagnostics (`diagnose_tracking`).

## 2. Pricing, Plans & Metering (`synterai.com/pricing`)

Synter charges **0% of ad spend** (ad platforms bill media directly) and **$0.00 for read-only calls**:

| Plan | Monthly Price | Seats & Workspaces | Included Monthly Credits & Scope |
| :--- | :--- | :--- | :--- |
| **Free Read Access** | **$0 / month** | Self-serve signup (no card required to connect & read) | **$0.00 (`0 credits`)** for all read, reporting, pacing, tracking diagnosis, and `dry_run: true` preview calls across all 43 ad platforms. |
| **Solo (Developer)** | **$20 / month** ($200/yr) | 1 workspace, 1 developer seat, 1 advertiser account/platform | Includes **$20.00/mo** in claimable usage credits. Full MCP, CLI, SDK, and REST API read/write access across all supported platforms. |
| **Scale (Teams & Brands)** | **$500 / month** ($5,000/yr) | 1 brand workspace (+$500/mo per additional workspace), 5 seats | Includes **$500.00/mo** in claimable usage credits, 24/7 Autonomous ROAS Optimization (Autopilot), 1-click bulk execution, and CRM sync (HubSpot, Salesforce, Attio, Pipedrive). |
| **Custom (Agencies & Enterprise)** | **Custom** | Unlimited seats, multi-client workspaces, consolidated billing | Custom credit allowances, white-label client portal, SSO (SAML/Okta), and dedicated engineering support. |

- **Metered Action Rates (1x on MCP, SDK, CLI & API — bring your own LLM)**: Reads (`list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `diagnose_tracking`) cost **$0.00**; light writes (`pause_campaign`, `update_campaign_budget`) cost **$0.05** (`400` light writes/mo covered by Solo's $20 credit allowance); unpriced tool calls cost **$0.25**; campaign launches cost **$5.00** on MCP/API (or **$25.00** inside the Synter Angstrom web app, which includes a 5x markup for managed LLM compute). Use `forecast_tool_cost` on the hosted server to inspect exact rates before execution.

## 3. Authentication, Scoped Keys & Multi-Tenant / Partner Architecture

- **Hosted OAuth 2.1 (`https://mcp.synterai.com`)**: Uses OAuth 2.1 with dynamic client registration and PKCE for interactive MCP clients (Claude Code, Cursor, VS Code, Codex, Windsurf). Note: unauthenticated HTTP requests to `mcp.synterai.com` return `401` to trigger the MCP client's OAuth handshake.
- **Server-Side Scoped API Keys & Read-Only Enforcement**: Headless/CI services authenticate via `X-Synter-Key` (or `SYNTER_API_KEY` in stdio). Server-enforced API keys minted via `POST /api/v1/workspaces/{id}/keys` or `synterai.com/developer` support `tools:read` (server-side read-only — rejects all mutations with `403`), directional `budget:decrease` (allows emergency pauses and budget reductions while rejecting upward spend changes), or `tools:write`. Passing `--read-only` or `SYNTER_READ_ONLY=true` to `@synterai/mcp-server` also strips all mutating tools from `tools/list` locally.
- **Multi-Tenant Workspace Provisioning & White-Label OAuth**: Provision isolated per-tenant workspaces programmatically (`POST https://synterai.com/api/v1/workspaces`) or scope requests via `SYNTER_WORKSPACE_ID` / `X-Synter-Workspace`. Generate white-label per-tenant OAuth connection links (`POST /api/v1/oauth/{platform}/authorize` with `workspace_id` and custom `redirect_uri`), register your own BYO OAuth client app per workspace, or run the open-source `synter` CLI/SDK (`@synterai/sdk-js`, `pip install synter`) with first-party platform credentials (`GOOGLE_ADS_DEVELOPER_TOKEN`, `META_ACCESS_TOKEN`, `LINKEDIN_ACCESS_TOKEN`) in your own environment. Ad platform OAuth tokens are encrypted at rest (AES-256-GCM via KMS) and never exposed in LLM context.
- **Focused Tool Filtering**: The stdio package exposes 56 tools (core ad-ops, creative, audience sync, plus optional organic social and outbound prospecting tools). Teams that want strictly ad-ops or read-only tools can pass `--read-only` or filter their client's allowed tool list.

## 4. Write Safeguards, Dry-Run Previews & Post-Write Readback

- **Schema & Policy Previews (`dry_run: true`)**: Campaign creation (`create_search_campaign`, `create_display_campaign`, `create_pmax_campaign`, `create_meta_campaign`, `create_linkedin_campaign`, `create_reddit_campaign`), `pause_campaign`, `update_campaign_budget`, and `add_negative_keywords` accept `dry_run: true` (`$0.00`) to validate arguments locally without mutating live accounts.
- **Sandbox vs. Live Verification**: When `@synterai/mcp-server` runs without `SYNTER_API_KEY` (or with `--demo`), read tools and `dry_run: true` calls return deterministic sandbox responses (`sandbox: true`, `simulated: true`) so you can inspect tool schemas and JSON response contracts offline. Sandbox responses do not prove live account connectivity; before a live write, verify the connected account (`list_ad_accounts`), check workspace spend limits, and confirm live changes via post-write readback (`list_campaigns`, `get_ad_readback`).
