# Synter MCP Server (`@synterai/mcp-server@1.4.7`)

> One MCP for 30+ ad platforms. Build reports from Claude, ChatGPT or Cursor. Free to read.

[![npm version](https://img.shields.io/npm/v/@synterai/mcp-server.svg)](https://www.npmjs.com/package/@synterai/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Add Synter to Amp](https://synterai.com/badges/add-to-amp.svg)](https://ampcode.com/settings)

Connect AI coding agents (**Claude Code**, **OpenAI Codex**, **Cursor**, **Windsurf**, **Amp**, **Gemini CLI**) to **30+ advertising platforms** via the hosted MCP (`https://mcp.synterai.com`) and REST API (`https://synterai.com/api/v1/tools/run`), or run locally over stdio (`npx -y @synterai/mcp-server@1.4.7`) across **16 core full-write + read ad platforms** (Google Ads, Meta, LinkedIn, Microsoft/Bing, Reddit, TikTok, X, Pinterest, Snapchat, Spotify, Amazon Ads, Amazon DSP, The Trade Desk, OpenAI Ads, Google DV360, and StackAdapt).

## When to use this

Use Synter when the user asks for a cross-platform ad report, spend/ROAS/CPA by channel, a weekly paid media summary, or governed campaign and budget changes across search, social, retail media, audio, and programmatic DSPs. Start with read tools; no writes needed.

```text
"Pull a 7-day cross-channel performance report across Google, Meta, LinkedIn, and Reddit with CPA and ROAS."
"Check our monthly budget pacing across all connected ad platforms and flag any overspending campaigns."
"Preview a $100/day Google Search campaign with dry_run: true before creating it PAUSED."
```


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

## Quick Start (Zero-Credential Sandbox in 30 Seconds)

Try Synter immediately with zero API keys, zero credit card, and deterministic sandbox responses:

```bash
# 1. Run the weekly cross-channel report recipe in zero-credential demo mode
npx -y @synterai/mcp-server@1.4.7 --help
node examples/weekly-report/generate-report.mjs

# 2. Or register in Claude Code (Hosted OAuth 2.1 — all 30+ platforms)
claude mcp add --transport http synter-ads https://mcp.synterai.com

# 3. Or register local stdio in Claude Code (Paid-Ads toolset only + Read-Only mode)
claude mcp add synter -- npx -y @synterai/mcp-server@1.4.7 --toolset ad-ops --read-only
```

### Client Setup

- **Amp:** built in (Settings > Integrations), or use the `"amp.mcpServers"` fallback below.
- **Claude Code**:
  - Hosted HTTP (OAuth 2.1): `claude mcp add --transport http synter-ads https://mcp.synterai.com`
  - Local stdio: `claude mcp add synter -e SYNTER_API_KEY=syn_your_key -- npx -y @synterai/mcp-server@1.4.7`
- **OpenAI Codex**:
  - `codex mcp add synter-ads --url https://mcp.synterai.com`
- **Claude.ai / Claude Desktop**:
  - Go to **Settings -> Connectors -> Add custom connector** and enter `https://mcp.synterai.com`.
- **ChatGPT**:
  - Custom MCP connectors require **Developer mode** (**Settings -> Apps & Connectors -> Advanced -> Developer mode**), then add `https://mcp.synterai.com`.
- **Cursor / Windsurf (`mcp.json`)**:
  ```json
  {
    "mcpServers": {
      "synter": {
        "command": "npx",
        "args": ["-y", "@synterai/mcp-server@1.4.7"],
        "env": {
          "SYNTER_API_KEY": "${SYNTER_API_KEY}"
        }
      }
    }
  }
  ```
- **Gemini CLI**:
  - `gemini extensions install https://github.com/Synter-Media-AI/mcp-server`

## Add Synter to Amp

1. **In Amp: Synter is a built-in integration. Turn it on in Amp under Settings > Integrations.**
2. **Claude, ChatGPT and other MCP clients, hosted (30+ ad platforms, the only Agentic DSP): https://mcp.synterai.com**
3. **Local read-only (npm package)**:
   ```json
   {
     "amp.mcpServers": {
       "synter": {
         "command": "npx",
         "args": ["-y", "@synterai/mcp-server@1.4.7", "--toolset", "ad-ops", "--read-only"],
         "env": {
           "SYNTER_API_KEY": "${SYNTER_API_KEY}"
         }
       }
     }
   }
   ```

---

## Toolsets, Read-Only Mode & Demo Mode

| Flag / Environment Variable | Behavior |
| :--- | :--- |
| **Default (`full`)** | Exposes all **56 direct stdio tools** (32 paid-ad tools across the core platforms + 8 organic social `*_organic_post` tools + 16 outbound `prospector_*` tools). |
| **`--toolset ad-ops`** (`SYNTER_TOOLSET=ad-ops`) | Exposes **only the 32 core paid-advertising tools** and strips all organic social and outbound tools from `tools/list` (and fails closed if called). |
| **`--read-only`** (`SYNTER_READ_ONLY=true`) | Exposes **only read-only tools** (`readOnlyHint: true`) in `tools/list` and blocks all mutating tools (`destructiveHint: true`) locally before any network call. |
| **`--demo`** (`SYNTER_DEMO=true`) | Runs in zero-credential sandbox mode with realistic, normalized multi-platform campaign and performance data (`sandbox: true`). |

---

## Platform Coverage & Read/Write Capability Matrix (Hosted / Local Stdio)

The hosted MCP (`https://mcp.synterai.com`) and REST endpoint (`POST https://synterai.com/api/v1/tools/run`) cover **30+ advertising platforms**. The local stdio package (`@synterai/mcp-server@1.4.7`) provides direct typed `platform` enum support across **the core full-write + read platforms** and reaches all 140+ backend scripts via `run_tool`:

| Platform (`platform` enum) | Direct Read Tools (`$0.00`) | Direct Write Tools + `run_tool` Scripts (`SOLO` / `SCALE` / `CUSTOM`) |
| :--- | :--- | :--- |
| **Google Ads (`google`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget`, `list_conversions`, `diagnose_tracking`, `list_ad_accounts`, `run_tool(script_name="run_gaql_query" \| "get_ad_readback")` | `create_search_campaign`, `create_display_campaign`, `create_pmax_campaign`, `pause_campaign`, `update_campaign_budget`, `add_keywords`, `add_negative_keywords` (`BROAD`, `PHRASE`, `EXACT` across campaign/ad-group/shared-list/account), `create_conversion`, `manage_audience`, `sync_audience`, `upload_image` |
| **Meta Ads (`meta`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `create_meta_campaign`, `pause_campaign`, `update_campaign_budget`, `stage_audience_artifact`, `sync_audience`, `upload_image`, `run_tool(script_name="meta_ads_create_ad_set" \| "meta_ads_create_ad")` |
| **LinkedIn Ads (`linkedin`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `create_linkedin_campaign` (requires `group_id`), `pause_campaign`, `update_campaign_budget`, `sync_audience`, `upload_image`, `run_tool(script_name="linkedin_ads_create_campaign_group")` |
| **Microsoft / Bing Ads (`microsoft`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `sync_audience`, `run_tool(script_name="microsoft_ads_create_campaign" \| "microsoft_ads_add_keywords" \| "microsoft_ads_add_negative_keywords")` |
| **Reddit Ads (`reddit`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `create_reddit_campaign`, `pause_campaign`, `update_campaign_budget`, `sync_audience`, `run_tool(script_name="reddit_ads_create_ad_group" \| "reddit_ads_create_ad")` |
| **TikTok Ads (`tiktok`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `sync_audience`, `run_tool(script_name="tiktok_ads_create_campaign" \| "tiktok_ads_update_adgroup")` |
| **X Ads (`x`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `sync_audience`, `run_tool(script_name="x_ads_create_campaign" \| "x_ads_create_line_item")` |
| **Pinterest Ads (`pinterest`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `run_tool(script_name="pinterest_ads_create_campaign" \| "pinterest_ads_create_ad_group")` |
| **Snapchat Ads (`snapchat`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `run_tool(script_name="snapchat_ads_create_campaign" \| "snapchat_ads_create_ad_squad")` |
| **Spotify Ads (`spotify`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `run_tool(script_name="spotify_ads_create_campaign" \| "spotify_ads_create_ad_set")` |
| **Amazon Ads (`amazon_ads`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `run_tool(script_name="amazon_ads_create_campaign" \| "amazon_ads_add_keywords")` |
| **Amazon DSP (`amazon_dsp`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `run_tool(script_name="amazon_dsp_create_order" \| "amazon_dsp_create_line_item")` |
| **The Trade Desk (`the_trade_desk`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `run_tool(script_name="ttd_create_campaign" \| "ttd_create_ad_group")` |
| **OpenAI Ads (`openai`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `run_tool(script_name="openai_ads_create_campaign")` |
| **Google DV360 (`dv360`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `run_tool(script_name="dv360_create_campaign" \| "dv360_create_insertion_order" \| "dv360_create_line_item")` |
| **StackAdapt (`stackadapt`)** | `list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `optimize_budget` | `pause_campaign`, `update_campaign_budget`, `sync_audience`, `run_tool(script_name="create_stackadapt_campaign")` |
| **Extended Platforms (Hosted MCP & `run_tool`)** | `run_tool(script_name="<platform>_*")` in stdio; direct `pull_*_performance` / `execute` on `https://mcp.synterai.com` | CM360, Walmart Connect, Instacart, Target Roundel, Criteo, FreeWheel, SA360, Apple Ads, Demandbase ABM, Taboola, Outbrain, AppLovin, Yahoo DSP, Teads, Viant, Basis, MediaMath, Magnite, PubMatic, Index Exchange, TripleLift, GumGum, Dianomi, Quora Ads, Nextdoor Ads, Twitch Ads, Yelp Ads, Samsung Ads, Roku Ads, impact.com |

---

## Pricing (100% USD — 0% of Ad Spend)

Synter charges **0% of ad spend** (ad networks bill media spend directly) and **$0.00 for all own-account reads and `dry_run: true` previews**. Full details at [https://synterai.com/pricing](https://synterai.com/pricing):

| Plan | Price | Seats & Workspaces | Included Monthly Usage Value & Write Rates |
| :--- | :--- | :--- | :--- |
| **Free Read Access** | **$0.00 / month** | 1 seat, 1 workspace | **$0.00** for all own-account read queries (`list_campaigns`, `get_performance`, `get_daily_spend`, `pacing_report`, `user_budget_pacing_report`, `optimize_budget`, `list_conversions`, `diagnose_tracking`, `list_ad_accounts`, `list_landing_pages`, `inspect_agent_shield`, `verify_angstrom_claim`, `get_skill`, `get_llm_visibility`, `run_gaql_query`, `get_ad_readback`, `get_solo_price_card`, `get_credit_balance`) and all `dry_run: true` previews. No credit card required. |
| **SOLO** | **$20.00 / month** (`$200.00 / year`) | 1 seat, 1 workspace | **Includes $20.00/month in claimable usage value** — covers up to **400 light writes** (`$0.05` each: `pause_campaign`, `enable_campaign`, `update_campaign_budget`), **80 standard writes** (`$0.25` each: `add_keywords`, `add_negative_keywords`, `sync_audience`, `create_conversion`), or **4 full MCP campaign launches** (`$5.00` each). Configurable hard spend caps prevent unexpected overages. |
| **SCALE** | **$500.00 / month** (`$5,000.00 / year`) | 5 seats, multi-workspace | **Includes $500.00/month in claimable usage value** (up to 10,000 light writes or 2,000 standard writes/mo included), multi-workspace client isolation, 24/7 Autonomous Loop / Autopilot schedules, CRM/warehouse sync, and dedicated concurrency. |
| **CUSTOM** | **Enterprise Contract** | Custom seats & workspaces | Custom monthly usage allowance, agency/enterprise multi-workspace management, custom SLA, SSO, and invoiced billing. |

---

## Security Posture, Write Safeguards & Multi-Tenant Architecture

### Four-Layer Write Defense
1. **Local Hard Read-Only Mode (`--read-only` / `SYNTER_READ_ONLY=true`)**: Strips all `destructiveHint: true` tools from `tools/list` and blocks mutations locally before any network request can leave your machine.
2. **Server-Enforced Scoped API Keys (`POST /api/v1/keys`)**: Mint read-only keys (`reporting:read`, `campaigns:read`, `intel:read`) or directional safety keys (`budget:decrease` — allows emergency campaign pauses and budget reductions while rejecting budget increases with HTTP `403`).
3. **Agent Shield Server-Side Policy Gate**: Enforces `PAUSED`-on-create default for every new campaign, a max `2.0x` single-call budget-increase ceiling, a `$5,000/day` workspace velocity circuit breaker, `dry_run: true` (`$0.00`) previews, mandatory post-write provider readback (`get_ad_readback`), and an immutable workspace audit log.
4. **Self-Hosted MIT Open-Source BYO-Credential Execution**: Run `@synterai/mcp-server@1.4.7` inside your own VPC/containers passing your own platform OAuth tokens directly via environment variables so Synter's hosted cloud holds zero custody of your ad account credentials.

### Multi-Tenant & Embedded SaaS Patterns (`docs.synterai.com/api/multi-tenant-auth`)
1. **Pattern 1 — Hosted Workspace-Isolated Keys & Connect Links**:
   - Mint workspace-pinned, scoped child API keys via `POST https://synterai.com/api/v1/keys` (`scopes`: `["reporting:read", "campaigns:read", "intel:read", "budget:decrease", "campaigns:write", "budget:write"]`, `rate_limit_rpm`: `1`–`600`, `expires_in_days`).
   - Generate self-serve advertiser OAuth handoff URLs via `POST https://synterai.com/api/v1/connections/start` (returns a single-platform `authUrl`) or `POST https://synterai.com/api/v1/connections/request` (sends a 7-day multi-platform connection link to the client).
   - Switch active workspaces on multi-workspace keys via `get_workspaces` and `update_active_workspace`.
2. **Pattern 2 — Self-Hosted BYO-Credential Mode (MIT Open-Source)**:
   - Multi-tenant SaaS apps that manage their own OAuth apps and store customer tokens in their own KMS/vault can invoke `@synterai/mcp-server` or `synter` CLI in isolated worker processes passing per-tenant platform tokens via environment variables (`GOOGLE_ADS_REFRESH_TOKEN`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_DEVELOPER_TOKEN`, `META_ACCESS_TOKEN`, `LINKEDIN_ACCESS_TOKEN`, etc.).

---

## REST API & Official Multi-Language SDKs

- **Hosted MCP (Streamable HTTP)**: `https://mcp.synterai.com` — authenticate via OAuth 2.1 browser sign-in or `X-Synter-Key: syn_...` header. Do not send `Authorization: Bearer syn_...` to the hosted MCP yet; REST/SDKs use Bearer.
- **REST Endpoint**: `POST https://synterai.com/api/v1/tools/run` with `Authorization: Bearer syn_...` (or `X-Synter-Key: syn_...`) and JSON body `{"script_name": "<tool_or_script>", "args": ["--flag", "value"], "platform": "google"}`.
- **TypeScript / JavaScript SDK**: `npm install @synterai/sdk-js`
- **Python SDK**: `pip install synter` -> `Synter(api_key=..., base_url=..., timeout=..., max_retries=...)`; metrics via `client.analytics.get_performance(...)`
- **Rust SDK**: `cargo add synter` ([crates.io/crates/synter](https://crates.io/crates/synter))
- **Java SDK**: Maven `ai.syntermedia:synter-sdk`

## Platform Directory

Explore platform-specific MCP guides, 1-click OAuth connect deep links, downloadable starter kits (.zip), and scoped tool explorers across 30+ ad platforms in 8 categories (full machine-readable index at https://synterai.com/mcp/llms.txt and https://synterai.com/.well-known/mcp):

### Social

- **Meta Ads (Facebook & Instagram)**: [Guide](platforms/meta.md) | [1-Click Connect](https://synterai.com/mcp/meta/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/meta) | [Install & Tools](https://synterai.com/mcp/meta/install)
- **LinkedIn Ads**: [Guide](platforms/linkedin.md) | [1-Click Connect](https://synterai.com/mcp/linkedin/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/linkedin) | [Install & Tools](https://synterai.com/mcp/linkedin/install)
- **TikTok Ads**: [Guide](platforms/tiktok.md) | [1-Click Connect](https://synterai.com/mcp/tiktok/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/tiktok) | [Install & Tools](https://synterai.com/mcp/tiktok/install)
- **Reddit Ads**: [Guide](platforms/reddit.md) | [1-Click Connect](https://synterai.com/mcp/reddit/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/reddit) | [Install & Tools](https://synterai.com/mcp/reddit/install)
- **X Ads**: [Guide](platforms/x.md) | [1-Click Connect](https://synterai.com/mcp/x/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/x) | [Install & Tools](https://synterai.com/mcp/x/install)
- **Snapchat Ads**: [Guide](platforms/snapchat.md) | [1-Click Connect](https://synterai.com/mcp/snapchat/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/snapchat) | [Install & Tools](https://synterai.com/mcp/snapchat/install)
- **Pinterest Ads**: [Guide](platforms/pinterest.md) | [1-Click Connect](https://synterai.com/mcp/pinterest/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/pinterest) | [Install & Tools](https://synterai.com/mcp/pinterest/install)
- **Quora Ads**: [Guide](platforms/quora-ads.md) | [1-Click Connect](https://synterai.com/mcp/quora-ads/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/quora-ads) | [Install & Tools](https://synterai.com/mcp/quora-ads/install)
- **Nextdoor Ads**: [Guide](platforms/nextdoor-ads.md) | [1-Click Connect](https://synterai.com/mcp/nextdoor-ads/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/nextdoor-ads) | [Install & Tools](https://synterai.com/mcp/nextdoor-ads/install)
- **Discord Quests**: [Guide](platforms/discord-quests.md) | [1-Click Connect](https://synterai.com/mcp/discord-quests/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/discord-quests) | [Install & Tools](https://synterai.com/mcp/discord-quests/install)
- **Roblox Ads**: [Guide](platforms/roblox-ads.md) | [1-Click Connect](https://synterai.com/mcp/roblox-ads/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/roblox-ads) | [Install & Tools](https://synterai.com/mcp/roblox-ads/install)

### Search

- **Google Ads**: [Guide](platforms/google.md) | [1-Click Connect](https://synterai.com/mcp/google/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/google) | [Install & Tools](https://synterai.com/mcp/google/install)
- **Microsoft Ads (Bing)**: [Guide](platforms/microsoft.md) | [1-Click Connect](https://synterai.com/mcp/microsoft/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/microsoft) | [Install & Tools](https://synterai.com/mcp/microsoft/install)
- **OpenAI Ads**: [Guide](platforms/openai.md) | [1-Click Connect](https://synterai.com/mcp/openai/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/openai) | [Install & Tools](https://synterai.com/mcp/openai/install)
- **Apple Search Ads**: [Guide](platforms/apple-search-ads.md) | [1-Click Connect](https://synterai.com/mcp/apple-search-ads/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/apple-search-ads) | [Install & Tools](https://synterai.com/mcp/apple-search-ads/install)
- **Brave Ads**: [Guide](platforms/brave-ads.md) | [1-Click Connect](https://synterai.com/mcp/brave-ads/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/brave-ads) | [Install & Tools](https://synterai.com/mcp/brave-ads/install)
- **Search Ads 360 (SA360)**: [Guide](platforms/sa360.md) | [1-Click Connect](https://synterai.com/mcp/sa360/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/sa360) | [Install & Tools](https://synterai.com/mcp/sa360/install)

### Retail Media & Commerce

- **Amazon Ads**: [Guide](platforms/amazon.md) | [1-Click Connect](https://synterai.com/mcp/amazon/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/amazon) | [Install & Tools](https://synterai.com/mcp/amazon/install)
- **Walmart Connect**: [Guide](platforms/walmart-connect.md) | [1-Click Connect](https://synterai.com/mcp/walmart-connect/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/walmart-connect) | [Install & Tools](https://synterai.com/mcp/walmart-connect/install)
- **Instacart Ads**: [Guide](platforms/instacart-ads.md) | [1-Click Connect](https://synterai.com/mcp/instacart-ads/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/instacart-ads) | [Install & Tools](https://synterai.com/mcp/instacart-ads/install)
- **Target Roundel**: [Guide](platforms/target-roundel.md) | [1-Click Connect](https://synterai.com/mcp/target-roundel/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/target-roundel) | [Install & Tools](https://synterai.com/mcp/target-roundel/install)
- **Kroger Precision Marketing**: [Guide](platforms/kroger-precision-marketing.md) | [1-Click Connect](https://synterai.com/mcp/kroger-precision-marketing/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/kroger-precision-marketing) | [Install & Tools](https://synterai.com/mcp/kroger-precision-marketing/install)
- **Criteo Commerce Media**: [Guide](platforms/criteo.md) | [1-Click Connect](https://synterai.com/mcp/criteo/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/criteo) | [Install & Tools](https://synterai.com/mcp/criteo/install)
- **eBay Promoted Listings**: [Guide](platforms/ebay.md) | [1-Click Connect](https://synterai.com/mcp/ebay/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/ebay) | [Install & Tools](https://synterai.com/mcp/ebay/install)
- **Etsy Ads**: [Guide](platforms/etsy.md) | [1-Click Connect](https://synterai.com/mcp/etsy/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/etsy) | [Install & Tools](https://synterai.com/mcp/etsy/install)
- **Rokt Ecommerce Ads**: [Guide](platforms/rokt.md) | [1-Click Connect](https://synterai.com/mcp/rokt/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/rokt) | [Install & Tools](https://synterai.com/mcp/rokt/install)

### Programmatic & DSP

- **Display & Video 360 (DV360)**: [Guide](platforms/dv360.md) | [1-Click Connect](https://synterai.com/mcp/dv360/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/dv360) | [Install & Tools](https://synterai.com/mcp/dv360/install)
- **StackAdapt Programmatic**: [Guide](platforms/stackadapt.md) | [1-Click Connect](https://synterai.com/mcp/stackadapt/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/stackadapt) | [Install & Tools](https://synterai.com/mcp/stackadapt/install)
- **The Trade Desk**: [Guide](platforms/the-trade-desk.md) | [1-Click Connect](https://synterai.com/mcp/the-trade-desk/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/the-trade-desk) | [Install & Tools](https://synterai.com/mcp/the-trade-desk/install)
- **Amazon DSP**: [Guide](platforms/amazon-dsp.md) | [1-Click Connect](https://synterai.com/mcp/amazon-dsp/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/amazon-dsp) | [Install & Tools](https://synterai.com/mcp/amazon-dsp/install)
- **Yahoo DSP**: [Guide](platforms/yahoo-dsp.md) | [1-Click Connect](https://synterai.com/mcp/yahoo-dsp/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/yahoo-dsp) | [Install & Tools](https://synterai.com/mcp/yahoo-dsp/install)
- **Basis DSP**: [Guide](platforms/basis-dsp.md) | [1-Click Connect](https://synterai.com/mcp/basis-dsp/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/basis-dsp) | [Install & Tools](https://synterai.com/mcp/basis-dsp/install)
- **Quantcast**: [Guide](platforms/quantcast.md) | [1-Click Connect](https://synterai.com/mcp/quantcast/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/quantcast) | [Install & Tools](https://synterai.com/mcp/quantcast/install)
- **Teads**: [Guide](platforms/teads.md) | [1-Click Connect](https://synterai.com/mcp/teads/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/teads) | [Install & Tools](https://synterai.com/mcp/teads/install)
- **AdRoll Retargeting**: [Guide](platforms/adroll.md) | [1-Click Connect](https://synterai.com/mcp/adroll/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/adroll) | [Install & Tools](https://synterai.com/mcp/adroll/install)
- **Moloco**: [Guide](platforms/moloco.md) | [1-Click Connect](https://synterai.com/mcp/moloco/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/moloco) | [Install & Tools](https://synterai.com/mcp/moloco/install)
- **Campaign Manager 360 (CM360)**: [Guide](platforms/cm360.md) | [1-Click Connect](https://synterai.com/mcp/cm360/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/cm360) | [Install & Tools](https://synterai.com/mcp/cm360/install)
- **Xandr (Microsoft Monetize)**: [Guide](platforms/xandr.md) | [1-Click Connect](https://synterai.com/mcp/xandr/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/xandr) | [Install & Tools](https://synterai.com/mcp/xandr/install)

### CTV, Video & Audio

- **Spotify Ads**: [Guide](platforms/spotify.md) | [1-Click Connect](https://synterai.com/mcp/spotify/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/spotify) | [Install & Tools](https://synterai.com/mcp/spotify/install)
- **YouTube Ads**: [Guide](platforms/youtube-ads.md) | [1-Click Connect](https://synterai.com/mcp/youtube-ads/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/youtube-ads) | [Install & Tools](https://synterai.com/mcp/youtube-ads/install)
- **MNTN**: [Guide](platforms/mntn.md) | [1-Click Connect](https://synterai.com/mcp/mntn/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/mntn) | [Install & Tools](https://synterai.com/mcp/mntn/install)
- **Tatari**: [Guide](platforms/tatari.md) | [1-Click Connect](https://synterai.com/mcp/tatari/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/tatari) | [Install & Tools](https://synterai.com/mcp/tatari/install)
- **Vibe.co**: [Guide](platforms/vibe-co.md) | [1-Click Connect](https://synterai.com/mcp/vibe-co/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/vibe-co) | [Install & Tools](https://synterai.com/mcp/vibe-co/install)
- **Twitch Ads**: [Guide](platforms/twitch-ads.md) | [1-Click Connect](https://synterai.com/mcp/twitch-ads/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/twitch-ads) | [Install & Tools](https://synterai.com/mcp/twitch-ads/install)
- **FreeWheel Buyer Cloud (Beeswax)**: [Guide](platforms/freewheel.md) | [1-Click Connect](https://synterai.com/mcp/freewheel/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/freewheel) | [Install & Tools](https://synterai.com/mcp/freewheel/install)
- **AppLovin (Axon) Ads**: [Guide](platforms/applovin.md) | [1-Click Connect](https://synterai.com/mcp/applovin/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/applovin) | [Install & Tools](https://synterai.com/mcp/applovin/install)
- **Samsung Ads (CTV)**: [Guide](platforms/samsung.md) | [1-Click Connect](https://synterai.com/mcp/samsung/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/samsung) | [Install & Tools](https://synterai.com/mcp/samsung/install)
- **Roku Ads (CTV)**: [Guide](platforms/roku.md) | [1-Click Connect](https://synterai.com/mcp/roku/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/roku) | [Install & Tools](https://synterai.com/mcp/roku/install)
- **Disney & Hulu Ads (CTV)**: [Guide](platforms/disney.md) | [1-Click Connect](https://synterai.com/mcp/disney/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/disney) | [Install & Tools](https://synterai.com/mcp/disney/install)

### Native & Discovery

- **Taboola Native Ads**: [Guide](platforms/taboola.md) | [1-Click Connect](https://synterai.com/mcp/taboola/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/taboola) | [Install & Tools](https://synterai.com/mcp/taboola/install)
- **Outbrain (Teads) Native Ads**: [Guide](platforms/outbrain.md) | [1-Click Connect](https://synterai.com/mcp/outbrain/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/outbrain) | [Install & Tools](https://synterai.com/mcp/outbrain/install)
- **Carbon Ads**: [Guide](platforms/carbon-ads.md) | [1-Click Connect](https://synterai.com/mcp/carbon-ads/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/carbon-ads) | [Install & Tools](https://synterai.com/mcp/carbon-ads/install)
- **EthicalAds**: [Guide](platforms/ethicalads.md) | [1-Click Connect](https://synterai.com/mcp/ethicalads/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/ethicalads) | [Install & Tools](https://synterai.com/mcp/ethicalads/install)
- **Thrad AI Ads**: [Guide](platforms/thrad.md) | [1-Click Connect](https://synterai.com/mcp/thrad/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/thrad) | [Install & Tools](https://synterai.com/mcp/thrad/install)

### Affiliate & Local

- **Yelp Ads**: [Guide](platforms/yelp.md) | [1-Click Connect](https://synterai.com/mcp/yelp/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/yelp) | [Install & Tools](https://synterai.com/mcp/yelp/install)
- **impact.com Affiliate**: [Guide](platforms/impact.md) | [1-Click Connect](https://synterai.com/mcp/impact/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/impact) | [Install & Tools](https://synterai.com/mcp/impact/install)
- **CJ Affiliate**: [Guide](platforms/cj-affiliate.md) | [1-Click Connect](https://synterai.com/mcp/cj-affiliate/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/cj-affiliate) | [Install & Tools](https://synterai.com/mcp/cj-affiliate/install)

### B2B & ABM

- **Demandbase ABM**: [Guide](platforms/demandbase.md) | [1-Click Connect](https://synterai.com/mcp/demandbase/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/demandbase) | [Install & Tools](https://synterai.com/mcp/demandbase/install)
- **DemandScience (Terminus) ABM**: [Guide](platforms/terminus.md) | [1-Click Connect](https://synterai.com/mcp/terminus/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/terminus) | [Install & Tools](https://synterai.com/mcp/terminus/install)
- **6sense ABM**: [Guide](platforms/6sense.md) | [1-Click Connect](https://synterai.com/mcp/6sense/connect?utm_source=github) | [Starter Kit (.zip)](https://synterai.com/api/mcp/kit/6sense) | [Install & Tools](https://synterai.com/mcp/6sense/install)

## License

MIT License — see [LICENSE](./LICENSE).
