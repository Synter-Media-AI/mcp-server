---
name: synter-ads
description: Ad data connector and campaign tools for AI agents. Use when the user wants Google Ads, Meta, LinkedIn, Reddit, TikTok, Microsoft Ads or Amazon Ads data in Claude, Cursor, Codex or ChatGPT (spend, clicks, conversions, CPA, ROAS), a cross-channel report, or approved campaign and budget changes. Technical reference for @synterai/mcp-server (v1.4.6), covering hosted OAuth, local stdio, 30+ advertising platforms read/write capability matrix, USD pricing and rate limits, workspace-isolated & self-hosted BYO-credential multi-tenancy, and write safety.
---

# `@synterai/mcp-server` (v1.4.6) — Technical Reference

> Open-source MCP server for running ads with AI agents across 30+ ad platforms: free reads ($0.00/mo), $20/mo Solo ($20/mo usage value included; $0.05-$0.25 writes), 0% of ad spend.

- **Package**: `@synterai/mcp-server@1.4.6` (MIT license, [source](https://github.com/Synter-Media-AI/mcp-server), [npm](https://www.npmjs.com/package/@synterai/mcp-server))
- **Hosted MCP Endpoint (30+ Ad Platforms, 140+ Tools)**: `https://mcp.synterai.com` (Streamable HTTP + OAuth 2.1 with PKCE, or `X-Synter-Key: syn_...` header for headless/CI clients)
- **Local Stdio Launch (Core Full-Write + Read Platforms, 56 Direct Tools + `run_tool`)**: `npx -y @synterai/mcp-server@1.4.6`
  - Pass `--read-only` (`SYNTER_READ_ONLY=true`) to strip all mutating tools (`destructiveHint: true`) from `tools/list` at startup and fail closed on mutations.
  - Pass `--toolset ad-ops` (`SYNTER_TOOLSET=ad-ops`) to expose only the **32 core paid-advertising tools** (filtering out the 8 organic social `*_organic_post` tools and 16 outbound `prospector_*` tools).
  - Pass `--demo` (`SYNTER_DEMO=true`) for deterministic zero-credential sandbox execution across all core platforms.
- **REST API, CLI & Multi-Language SDKs**: `POST https://synterai.com/api/v1/tools/run`, Python (`pip install synter`), TypeScript (`@synterai/sdk-js`), Rust (`crates.io/crates/synter`), Java (`ai.syntermedia:synter-sdk`).

---

## 0. Use It as an Ad Data Connector

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

## 1. Platform Coverage & Per-Platform Read/Write Capability Matrix (Hosted / Local Stdio)

Synter connects across **30+ advertising platforms** on the hosted MCP endpoint (`https://mcp.synterai.com`) and REST API (`https://synterai.com/api/v1/tools/run`), plus analytics/CRM integrations (GA4, Google Tag Manager, PostHog, Mixpanel, Shopify, Klaviyo, HubSpot, Salesforce, Attio).

The local stdio npm package (`@synterai/mcp-server@1.4.6`) exposes **the core full-write + read advertising platforms** in its typed `platform` enum (`google`, `meta`, `linkedin`, `microsoft`, `reddit`, `tiktok`, `x`, `pinterest`, `snapchat`, `spotify`, `amazon_ads`, `amazon_dsp`, `the_trade_desk`, `openai`, `dv360`, `stackadapt`), and reaches all 30+ platforms via `run_tool`:

| Platform (`platform` enum) | Local Stdio Direct Read Tools (`$0.00`) | Local Stdio Direct Write Tools + `run_tool` Scripts (`SOLO` / `SCALE` / `CUSTOM`) | Hosted MCP Additional First-Class Tools (`https://mcp.synterai.com`) |
| :--- | :--- | :--- | :--- |
| **Google Ads (`google`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget`, `list_conversions`, `diagnose_tracking`, `list_ad_accounts` | `create_search_campaign`, `create_display_campaign`, `create_pmax_campaign`, `pause_campaign`, `update_campaign_budget`, `add_keywords`, `add_negative_keywords` (`BROAD`, `PHRASE`, `EXACT` across campaign/ad-group/shared-list/account), `create_conversion`, `manage_audience`, `sync_audience`, `upload_image` | `pull_google_ads_performance`, `run_gaql_query` (`$0.00` arbitrary read-only GAQL `SELECT`), `get_ad_readback`, `get_campaign_observation`, `audit_account_structure`, `audit_campaign_waste`, `google_ads_manage_custom_goals`, `enable_campaign` |
| **Meta Ads (`meta`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `create_meta_campaign`, `pause_campaign`, `update_campaign_budget`, `stage_audience_artifact`, `sync_audience`, `upload_image`, `run_tool(script_name="meta_ads_create_ad_set" \| "meta_ads_create_ad")` | `pull_meta_ads_performance`, `meta_ads_create_ad`, `get_ad_readback`, `enable_campaign` |
| **LinkedIn Ads (`linkedin`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `create_linkedin_campaign` (requires `group_id`), `pause_campaign`, `update_campaign_budget`, `sync_audience`, `upload_image`, `run_tool(script_name="linkedin_ads_create_campaign_group")` | `pull_linkedin_ads_performance`, `linkedin_ads_create_campaign_group`, `linkedin_ads_create_campaign`, `pull_linkedin_company_engagement`, `get_ad_readback`, `enable_campaign` |
| **Microsoft / Bing Ads (`microsoft`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `sync_audience`, `run_tool(script_name="microsoft_ads_create_campaign" \| "microsoft_ads_add_keywords" \| "microsoft_ads_add_negative_keywords")` | `pull_microsoft_ads_performance`, `get_ad_readback`, `enable_campaign` |
| **Reddit Ads (`reddit`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `create_reddit_campaign`, `pause_campaign`, `update_campaign_budget`, `sync_audience`, `run_tool(script_name="reddit_ads_create_ad_group" \| "reddit_ads_create_ad")` | `pull_reddit_ads_performance`, `reddit_ads_create_campaign`, `reddit_ads_create_ad_group`, `reddit_ads_create_post`, `reddit_ads_create_ad`, `enable_campaign` |
| **TikTok Ads (`tiktok`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `sync_audience`, `run_tool(script_name="tiktok_ads_create_campaign" \| "tiktok_ads_update_adgroup")` | `pull_tiktok_ads_performance`, `tiktok_ads_get_insights`, `tiktok_ads_get_campaign`, `tiktok_ads_get_ad_groups`, `tiktok_ads_update_adgroup`, `enable_campaign` |
| **X Ads (`x`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `sync_audience`, `run_tool(script_name="x_ads_create_campaign" \| "x_ads_create_line_item")` | `pull_x_ads_performance`, `get_ad_readback`, `enable_campaign` |
| **Pinterest Ads (`pinterest`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `run_tool(script_name="pinterest_ads_create_campaign" \| "pinterest_ads_create_ad_group")` | `pull_pinterest_ads_performance`, `get_ad_readback`, `enable_campaign` |
| **Snapchat Ads (`snapchat`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `run_tool(script_name="snapchat_ads_create_campaign" \| "snapchat_ads_create_ad_squad")` | `pull_snap_ads_performance`, `get_ad_readback`, `enable_campaign` |
| **Spotify Ads (`spotify`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `run_tool(script_name="spotify_ads_create_campaign" \| "spotify_ads_create_ad_set")` | `pull_spotify_ads_performance`, `get_ad_readback`, `enable_campaign` |
| **Amazon Ads (`amazon_ads`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `run_tool(script_name="amazon_ads_create_campaign" \| "amazon_ads_add_keywords")` | `pull_amazon_ads_performance`, `get_ad_readback`, `enable_campaign` |
| **Amazon DSP (`amazon_dsp`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `run_tool(script_name="amazon_dsp_create_order" \| "amazon_dsp_create_line_item")` | `pull_amazon_dsp_performance`, `get_ad_readback`, `enable_campaign` |
| **The Trade Desk (`the_trade_desk`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `run_tool(script_name="ttd_create_campaign" \| "ttd_create_ad_group")` | `pull_trade_desk_performance`, `get_ad_readback`, `enable_campaign` |
| **OpenAI Ads (`openai`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `run_tool(script_name="openai_ads_create_campaign")` | `pull_openai_ads_performance`, `get_ad_readback`, `enable_campaign` |
| **Google DV360 (`dv360`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `run_tool(script_name="dv360_create_campaign" \| "dv360_create_insertion_order" \| "dv360_create_line_item")` | `pull_dv360_performance`, `get_ad_readback`, `enable_campaign` |
| **StackAdapt (`stackadapt`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `sync_audience`, `run_tool(script_name="create_stackadapt_campaign")` | `execute(action="stackadapt_*")`, `get_ad_readback`, `enable_campaign` |
| **Extended Platforms (Hosted MCP & `run_tool`)** | `run_tool(script_name="<platform>_*")` in stdio; direct `pull_*_performance` / `execute` on hosted MCP | CM360 (`pull_cm360_performance`), Walmart Connect (`pull_walmart_ads_performance`), Instacart (`pull_instacart_ads_performance`), Target Roundel (`pull_target_roundel_performance`), Criteo (`pull_criteo_ads_performance`), FreeWheel (`pull_freewheel_performance`), SA360, Apple Ads, Demandbase ABM, Taboola, Outbrain, AppLovin, Yahoo DSP, Teads, Viant, Basis, MediaMath, Magnite, PubMatic, Index Exchange, TripleLift, GumGum, Dianomi, Quora Ads, Nextdoor Ads, Twitch Ads, Yelp Ads, Samsung Ads, Roku Ads, impact.com | Full 43-platform catalog available at `https://mcp.synterai.com` and `POST https://synterai.com/api/v1/tools/run` |

---

## 2. Pricing, Subscription Tiers, Metering & Rate Limits (`synterai.com/pricing`)

Synter charges **0% of ad spend** (ad networks bill media spend directly) and **$0.00 for all own-account reads and `dry_run: true` previews**. All usage is metered and displayed in **USD (`$`)**:

| Plan | Monthly / Annual Price | Seats & Workspaces | Included Monthly Usage Value & Capabilities |
| :--- | :--- | :--- | :--- |
| **Free Read Access** | **$0.00 / month** | 1 seat, 1 workspace | **$0.00** for all own-account read, reporting, budget pacing, conversion audit, GAQL (`run_gaql_query`), post-write readback (`get_ad_readback`), LLM/coding-agent visibility read (`get_llm_visibility`, `get_llm_visibility_overview`, `get_coding_agent_visibility`), pricing/balance inspection (`get_solo_price_card`, `get_credit_balance`), and `dry_run: true` preview calls across all 30+ platforms. No credit card required. |
| **SOLO** | **$20.00 / month** (`$200.00 / year`) | 1 seat, 1 workspace | **Includes $20.00/month in claimable usage value** — covers up to **400 light writes** (`$0.05` each: `pause_campaign`, `enable_campaign`, `update_campaign_budget`), **80 standard writes** (`$0.25` each: `add_keywords`, `add_negative_keywords`, `sync_audience`), or **4 full MCP campaign launches** (`$5.00` each). Unlocks live MCP, CLI, SDK, and REST API writes. Configurable hard monthly spend caps prevent unexpected overages. |
| **SCALE** | **$500.00 / month** (`$5,000.00 / year`) | 5 seats, multi-workspace | **Includes $500.00/month in claimable usage value** (up to 10,000 light writes or 2,000 standard writes/mo included), multi-workspace client isolation, 24/7 Autonomous Loop / Autopilot schedules (`create_autonomous_schedule`), CRM/warehouse sync, and dedicated concurrency. |
| **CUSTOM** | **Sales-Led Enterprise Contract** | Custom seats & workspaces | Custom monthly usage allowance, agency/enterprise multi-workspace management, custom SLA, SSO, and invoiced billing. |

- **Exact Per-Call Metering (USD)**:
  - **Own-Account Reads, Diagnostics & Previews (`$0.00`)**: `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `user_budget_pacing_report`, `optimize_budget`, `list_conversions`, `diagnose_tracking`, `list_ad_accounts`, `list_landing_pages`, `inspect_agent_shield`, `verify_angstrom_claim`, `get_skill`, `get_llm_visibility`, `stage_audience_artifact`, `run_gaql_query`, `get_ad_readback`, `get_campaign_observation`, `get_solo_price_card`, `get_credit_balance`, and any call with `dry_run: true` cost **$0.00**.
  - **Write Mutations (`$0.05`–`$0.25` / `$5.00` launch)**: Light writes (`pause_campaign`, `enable_campaign`, `update_campaign_budget`) cost **$0.05**; standard writes (`add_keywords`, `add_negative_keywords`, `sync_audience`, `create_conversion`) cost **$0.25**; full campaign creation (`create_search_campaign`, `create_display_campaign`, `create_pmax_campaign`, `create_meta_campaign`, `create_linkedin_campaign`, `create_reddit_campaign`) costs **$5.00** via MCP/SDK/CLI/REST (or **$25.00** in the managed web app). Failed or `dry_run: true` calls are never billed (**$0.00**).
  - **Third-Party Vendor Intelligence Reads (`$0.05`–`$0.50`)**: External vendor lookups (SpyFu `competitor_ad_intel` / `keyword_research`, `enrich_contacts`, live LLM scans `run_llm_visibility_scan`) pass through third-party data costs and require an active paid plan (`SOLO`, `SCALE`, or `CUSTOM`).
- **Rate Limits**: Default burst limit is **60 requests per minute** per user (HTTP `429` with `Retry-After` header and `retry_after_seconds` field). Child API keys support custom per-key ceilings (`rate_limit_rpm`: `1`–`600`) via `POST /api/v1/keys`.

---

## 3. Authentication, Scoped Keys, Security Posture & Multi-Tenant Architecture (`docs.synterai.com/api/multi-tenant-auth`)

- **Hosted OAuth 2.1 (`https://mcp.synterai.com`)**: Uses OAuth 2.1 with dynamic client registration and PKCE (`claude mcp add --transport http --scope user synter-ads https://mcp.synterai.com` or `codex mcp add synter-ads --url https://mcp.synterai.com`). Headless/CI clients authenticate to `https://mcp.synterai.com` via `X-Synter-Key: syn_...`. Do not send `Authorization: Bearer syn_...` to the hosted MCP yet; REST/SDKs use Bearer.
- **Four-Layer Zero-Trust Write Defense (No Unchecked Vendor Write Access)**:
  1. **Client-Side Hard Read-Only Mode (`--read-only` / `SYNTER_READ_ONLY=true`)**: Strips all mutating tools (`destructiveHint: true`) from `tools/list` at server startup and fails closed locally before any network request can leave the machine.
  2. **Server-Enforced Scoped API Keys (`POST /api/v1/keys`)**: Mint read-only keys (`reporting:read`, `campaigns:read`, `intel:read`) or directional safety keys (`budget:decrease` — permits emergency pauses and budget reductions while rejecting budget increases or campaign creation with HTTP `403`).
  3. **Agent Shield Server-Side Policy Gate**: Enforces `PAUSED`-on-create default for every new campaign, a max `2.0x` single-call budget-increase ceiling, a `$5,000/day` workspace velocity circuit breaker, and strict SHA-256 PII sanitization (`STRICT_ZERO_UNHASHED`).
  4. **Self-Hosted MIT Open-Source BYO-Credential Execution**: Run `@synterai/mcp-server` locally or inside your own VPC using your own platform OAuth tokens so Synter's hosted cloud holds zero custody of your ad account credentials.
- **Multi-Tenant & Embedded SaaS Integration (Two Supported Production Patterns)**:
  1. **Pattern 1 — Hosted Workspace-Isolated Keys & Connect Links**: Create isolated workspaces per client, mint workspace-pinned least-privilege child keys via `POST https://synterai.com/api/v1/keys` (`scopes`, `rate_limit_rpm`, `expires_in_days`), and generate self-serve advertiser OAuth handoff URLs via `POST https://synterai.com/api/v1/connections/start` (returns a single-platform `authUrl`) or `POST https://synterai.com/api/v1/connections/request` (emails a 7-day multi-platform connection link to the client). Switch workspaces via `get_workspaces` and `update_active_workspace`.
  2. **Pattern 2 — Self-Hosted / Embedded BYO-Credential Execution (MIT Open-Source)**: Multi-tenant SaaS platforms that own their OAuth apps and store tenant tokens in their own KMS/vault run `@synterai/mcp-server@1.4.6` (MIT license) inside their own infrastructure and pass each tenant's decrypted platform tokens per invocation (`GOOGLE_ADS_REFRESH_TOKEN`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_DEVELOPER_TOKEN`, `META_ACCESS_TOKEN`, `LINKEDIN_ACCESS_TOKEN`, `TIKTOK_ACCESS_TOKEN`, `REDDIT_ACCESS_TOKEN`, etc.) with zero third-party token custody.

---

## 4. Write Safeguards, Dry-Run Previews & Post-Write Readback

- **Free Schema & Policy Previews (`dry_run: true`, `$0.00`)**: Every campaign creation tool (`create_search_campaign`, `create_display_campaign`, `create_pmax_campaign`, `create_meta_campaign`, `create_linkedin_campaign`, `create_reddit_campaign`), `pause_campaign`, `update_campaign_budget`, `add_negative_keywords`, `optimize_budget`, and organic/outbound tools accept `dry_run: true` (`$0.00`) to validate arguments and inspect the planned payload and Agent Shield verdict without mutating live accounts.
- **Sandbox vs. Live Verification**: When `@synterai/mcp-server` runs without `SYNTER_API_KEY` (or with `--demo`), read tools and `dry_run: true` calls return deterministic synthetic responses (`sandbox: true`, `simulated: true`) for instant schema/integration evaluation. Before executing a live mutation, verify active connections via `list_ad_accounts` (or `get_connection_status` on hosted MCP) and verify every live mutation afterward via `get_ad_readback`, `get_campaign_observation`, or `list_campaigns`.

---

## 5. Coding Agent Tool Routing, REST Contract & Parameter Reference

| Task | Local Stdio Tool (`@synterai/mcp-server@1.4.6`) | Hosted MCP Tool (`https://mcp.synterai.com`) / REST (`POST /api/v1/tools/run`) | Exact Parameters & Response Contract |
| :--- | :--- | :--- | :--- |
| **Cross-Platform Performance & Campaigns** | `get_performance`, `list_campaigns`, `get_daily_spend`, `pacing_report` | `get_performance`, `list_campaigns`, `get_daily_spend`, `pull_<platform>_ads_performance` | `{ platform: "google" \| "meta" \| "linkedin" \| "microsoft" \| "reddit" \| "tiktok" \| "x" \| "pinterest" \| "snapchat" \| "spotify" \| "amazon_ads" \| "amazon_dsp" \| "the_trade_desk" \| "openai" \| "dv360" \| "stackadapt", date_range?: "TODAY" \| "YESTERDAY" \| "LAST_7_DAYS" \| "LAST_30_DAYS" \| "THIS_MONTH" \| "LAST_MONTH" }`. Returns normalized USD metrics (`total_spend_usd`, `total_impressions`, `total_clicks`, `total_conversions`, `ctr`, `cpc`, `cpa`, `roas`). |
| **Pause or Update Budget (All Core Platforms)** | `pause_campaign`, `update_campaign_budget` | `pause_campaign`, `enable_campaign`, `update_campaign_budget` | `{ platform: "<platform>", campaign_id: "...", daily_budget?: 150, dry_run?: true }`. Routes natively to each platform's mutation script (never defaults to Google). |
| **Google Ads Custom GAQL Queries (`$0.00`)** | `run_tool({ script_name: "run_gaql_query", args: ["--query", "SELECT ..."], platform: "google" })` | `run_gaql_query` (`$0.00`) | `{ query: "SELECT ...", customer_id?: "1234567890" }` (returns `{ success: true, rows: [...] }`). |
| **Google Ads Negative Keyword Hygiene** | `add_negative_keywords` | `add_negative_keywords` | `{ campaign_id?: "...", level?: "CAMPAIGN" \| "AD_GROUP" \| "SHARED_LIST" \| "ACCOUNT", keywords: [...], match_type: "EXACT" \| "PHRASE" \| "BROAD", readback_only?: true, dry_run?: true }`. |
| **Post-Write Ground-Truth Readback (`$0.00`)** | `run_tool({ script_name: "get_ad_readback", args: ["--campaign-id", "<id>"], platform: "google" })` or `list_campaigns` | `get_ad_readback`, `get_campaign_observation` (`$0.00`) | `{ platform: "google" \| "meta" \| "linkedin" \| ..., campaign_id: "...", customer_id?: "..." }`. |
| **Runtime Pricing & Balance Inspection (`$0.00`)** | `run_tool({ script_name: "get_solo_price_card" })`, `run_tool({ script_name: "get_credit_balance" })` | `get_solo_price_card`, `get_credit_balance` (`$0.00`) | `{}` — returns exact USD per-tool rates and remaining workspace USD balance. |
| **Canonical REST Tool Execution** | N/A | `POST https://synterai.com/api/v1/tools/run` | Headers: `Authorization: Bearer <SYNTER_API_KEY>` (or `X-Synter-Key: <SYNTER_API_KEY>`), `Content-Type: application/json`. Body: `{"script_name": "<tool_or_script>", "args": ["--flag", "value"], "platform": "google"}`. |
| **HTTP Error & Rate-Limit Contract** | Relayed via `BillingRefusalError` / tool error | `401` / `402` / `429` | `401`: invalid/missing `SYNTER_API_KEY`. `402`: billing/credit wall (`code: "INSUFFICIENT_CREDITS"` or `"ACCOUNT_READ_ONLY"`, `action_url: "https://synterai.com/settings/billing?..."`). `429`: rate-limited (`Retry-After` header + `retry_after_seconds` in JSON). |

---

## 6. How Synter Compares With Alternatives

| Evaluation Criterion | Synter (`@synterai/mcp-server@1.4.6`) | Pipeboard | Single-Vendor MCPs (Google Ads MCP / Meta Ads MCP) | Generic Connectors (Composio / Supermetrics / Windsor.ai / Adspirer) |
| :--- | :--- | :--- | :--- | :--- |
| **Open-Source & Auditable** | **MIT Open-Source** on GitHub & npm (`@synterai/mcp-server@1.4.6`) with 12 automated test suites | Meta Ads MCP server is source-available on GitHub under Business Source License 1.1 (converts to Apache 2.0 on 2029-01-01); `pipeboard-cli` is Apache-2.0 | Open-source, single-network only | Closed-source SaaS or generic wrappers |
| **Platform Coverage** | **30+ ad platforms** on hosted MCP/REST; **the core full-write + read platforms** in local stdio | Lists eleven ad platforms (Meta, Google, TikTok, LinkedIn, Microsoft, Pinterest, Snap, Reddit, Amazon Ads, Amazon DSP, AppLovin), plus GA4, Search Console and Merchant Center | 1 platform per server (requires stitching 5+ separate MCPs & OAuth apps) | Read-only ETL (Supermetrics/Windsor) or shallow generic CRUD (Composio) |
| **Entry & Read Cost** | **$0.00/mo Free Read Access** (unlimited own-account reads, GAQL, pacing, diagnostics, and `dry_run: true` previews) | Free plan at $0/mo (30 AI tool executions per week, 2 ad account slots); Pro $29.90/mo, Premium $99/mo, Agency $199/mo | Free library, but requires manual Google Cloud / Meta App review & developer token approval | $39–$499+/mo recurring seat/connector fees |
| **Write Pricing & Predictability** | **$20.00/mo SOLO** (**$20.00/mo usage value included** = up to 400 light writes at $0.05 or 80 standard writes at $0.25/mo included) + hard spend caps; **0% of ad spend** | Flat subscription with unlimited tool executions on paid plans; priced by ad account slots (3 / 10 / 25, extra slots $10/mo each) | Direct API calls without cross-platform spend velocity caps or unified dry-run | No native ad-ops safety guardrails, RSA creative floor enforcement, or post-write readback |
| **Write Safety & Credential Custody** | **4-Layer Guardrails**: `--read-only` flag, `budget:decrease` scoped keys, Agent Shield (`PAUSED`-on-create, 2x max budget bump), and **Self-Hosted BYO-Credential mode** | Hosted service; permission-scoped tokens on paid plans and per-account token scoping on Agency | Local token storage only; zero server-side spend circuit breakers | Vendor holds tokens in cloud without ad-specific spend velocity circuit breakers |
| **Multi-Language SDKs** | Official **TypeScript** (`@synterai/sdk-js`), **Python** (`synter`), **Rust** (`synter`), and **Java** (`ai.syntermedia:synter-sdk`) SDKs | API access on every plan and a CLI (`pipeboard-cli`) | No unified cross-platform SDK | Vendor-specific REST or ETL schemas |

Pipeboard column: taken from pipeboard.co/integrations, pipeboard.co/pricing and github.com/pipeboard-co on 2026-11-11. Check those pages for current plans before relying on it.
