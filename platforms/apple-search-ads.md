> **1-Click Setup**: [Connect Apple Ads & Get Your Synter MCP](https://synterai.com/mcp/apple-search-ads/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_apple-search-ads) · [Download Apple Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/apple-search-ads) · [Live Platform Guide](https://synterai.com/mcp/apple-search-ads)
# Apple Search Ads MCP Server

> Connect Claude, Cursor, and Codex to Apple Ads for $0.00 campaign, ad-group, and keyword reporting plus governed search write scripts.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/apple-search-ads
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/apple-search-ads/connect
- **Download & Install Page**: https://synterai.com/mcp/apple-search-ads/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/apple-search-ads
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Apple Ads Campaign Management API v5
- **Capability Scope**: Reporting + write actions
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `apple_ads_get_accounts`

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

## Apple Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `apple_ads_get_accounts` | Read | $0.00 (Free) | List accessible Apple Ads organizations and advertiser accounts. |
| `apple_ads_get_campaigns` | Read | $0.00 (Free) | List Apple Ads campaigns, budgets, countries, and serving status. |
| `apple_ads_get_ad_groups` | Read | $0.00 (Free) | Inspect Apple Ads ad groups, default bids, and audience settings. |
| `apple_ads_get_keywords` | Read | $0.00 (Free) | Read targeting keywords, match types, and bid amounts across ad groups. |
| `apple_ads_get_performance` | Read | $0.00 (Free) | Pull impressions, taps, installs, spend, CPT, CPA, and TTR metrics. |
| `execute` | Write (approval-gated) | SOLO / SCALE | Run governed Apple Ads create and update scripts with operator approval. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Apple Ads Prompts

1. `Pull Apple Ads performance for the last 14 days and list keywords with spend above $50 and zero installs.`
2. `Compare Apple Ads CPI against Google App and Meta mobile install campaigns.`

## Frequently Asked Questions

### How do I connect Apple Ads to Synter MCP?

Generate an EC P-256 key pair in Apple Ads Account Settings, upload the public key there, and paste your Client ID, Team ID, Key ID, and private key in Synter's encrypted connect drawer.

### Is reading Apple Ads metrics free?

Yes. All apple_ads_get_* reporting tools cost $0.00 with 0% ad spend markup.
