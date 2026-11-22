> **1-Click Setup**: [Connect Google Ads & Get Your Synter MCP](https://synterai.com/mcp/google/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_google) · [Download Google Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/google) · [Live Platform Guide](https://synterai.com/mcp/google)
# Google Ads MCP Server

> Execute raw GAQL queries, audit wasted search terms, and stage Search, Demand Gen, and Performance Max campaigns directly from Claude, Cursor, or Codex.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/google
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/google/connect
- **Download & Install Page**: https://synterai.com/mcp/google/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/google
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Google Ads API v19+
- **Capability Scope**: Reporting + full campaign creation
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `pull_google_ads_performance`

## 1-Command Client Setup

### Claude Code
```bash
claude mcp add --transport http --scope user synter-ads https://mcp.synterai.com
```

### OpenAI Codex
```bash
codex mcp add synter-ads --url https://mcp.synterai.com
codex mcp login synter-ads
```

### Cursor / Claude Desktop (`mcp.json`)
```json
{
  "mcpServers": {
    "synter-ads": {
      "url": "https://mcp.synterai.com"
    }
  }
}
```

- **Cursor 1-Click Install**: cursor://anysphere.cursor-deeplink/mcp/install?name=synter-ads&config=eyJ1cmwiOiJodHRwczovL21jcC5zeW50ZXJhaS5jb20ifQ==
- **VS Code 1-Click Install**: vscode:mcp/install?%7B%22name%22%3A%22synter-ads%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.synterai.com%22%7D
- **Local npm package (optional stdio fallback)**: `npx -y @synterai/mcp-server@1.4.6`

## Google Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_google_ads_performance` | Read | $0.00 (Free) | Pull campaign, ad-group, and keyword spend, impressions, clicks, conversions, and CPA. |
| `run_gaql_query` | Read | $0.00 (Free) | Execute arbitrary Google Ads Query Language (GAQL) queries against search_term_view, campaign, and keyword_view. |
| `audit_campaign_waste` | Read | $0.00 (Free) | Identify non-converting search queries and ad groups bleeding budget. |
| `ga4_get_report` | Read | $0.00 (Free) | Pull native GA4 acquisition reports to cross-verify Google Ads conversions. |
| `create_campaign_plan` | Write (approval-gated) | SOLO / SCALE | Stage Google Search or Performance Max campaigns with RSAs and negative lists as PAUSED drafts. |
| `execute_campaign_plan` | Write (approval-gated) | SOLO / SCALE | Deploy an approved campaign plan using a single-use cryptographic execute_token. |
| `add_negative_keywords` | Write (approval-gated) | SOLO / SCALE | Add EXACT, PHRASE, or BROAD negative keywords to seal search leaks. |
| `update_campaign_budget` | Write (approval-gated) | SOLO / SCALE | Update daily spend budgets safely within server-side guardrail limits. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Google Ads Prompts

1. `Run a GAQL query on my Google Ads account to extract search terms from the last 14 days where cost > $50 and conversions = 0.`
2. `Stage a PAUSED Google Ads Search campaign for Enterprise SOC2 Automation with Target CPA $85 and exact match negative keywords.`
3. `Compare Google Ads reported conversions for the past 30 days against GA4 conversions from sessionMedium = 'cpc'.`

## Frequently Asked Questions

### Can I run arbitrary GAQL queries through Synter MCP?

Yes. The run_gaql_query tool lets Claude, Cursor, and Codex execute custom GAQL queries against campaign, ad_group, search_term_view, and keyword_view for $0.00.

### Are negative keywords supported with explicit match types?

Yes. add_negative_keywords supports EXACT, PHRASE, and BROAD negative keywords at campaign and shared list levels.

### How does Synter prevent accidental spend in Google Ads?

All newly staged campaigns default to PAUSED status. Activating live spend requires explicit operator approval and a single-use execute_token.
