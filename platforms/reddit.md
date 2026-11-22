> **1-Click Setup**: [Connect Reddit Ads & Get Your Synter MCP](https://synterai.com/mcp/reddit/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_reddit) · [Download Reddit Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/reddit) · [Live Platform Guide](https://synterai.com/mcp/reddit)
# Reddit Ads MCP Server

> Connect Claude, Cursor, and Codex to Reddit Ads for $0.00 read-only reporting, search and subreddit targeting, and approval-gated promoted post execution.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/reddit
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/reddit/connect
- **Download & Install Page**: https://synterai.com/mcp/reddit/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/reddit
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Reddit Ads API v3
- **Capability Scope**: Reporting + full campaign creation
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `pull_reddit_ads_performance`

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

## Reddit Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_reddit_ads_performance` | Read | $0.00 (Free) | Pull spend, impressions, clicks, CPC, CTR, and conversion metrics across Reddit Ads. |
| `list_campaigns` | Read | $0.00 (Free) | List ACTIVE, PAUSED, and DRAFT Reddit campaigns with schedules and objective metadata. |
| `get_ad_readback` | Read | $0.00 (Free) | Read launched Reddit creative and CTA state directly from the Reddit Ads API. |
| `reddit_ads_create_campaign` | Write (approval-gated) | SOLO / SCALE | Create a PAUSED Reddit campaign container without starting live ad spend. |
| `reddit_ads_create_ad_group` | Write (approval-gated) | SOLO / SCALE | Configure subreddit, keyword search, and interest targeting on a PAUSED Reddit ad group. |
| `reddit_ads_create_post` | Write (approval-gated) | SOLO / SCALE | Create a promoted post creative ready to attach to a PAUSED Reddit ad group. |
| `reddit_ads_create_ad` | Write (approval-gated) | SOLO / SCALE | Bind a promoted post to an ad group with destination URL and tracking parameters. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Reddit Ads Prompts

1. `Pull our Reddit Ads performance for the last 14 days by campaign. Flag any ad group with spend above $50 and zero conversions.`
2. `Stage a PAUSED Reddit Search and subreddit campaign targeting technical builders searching for MCP servers, with a $30/day cap.`

## Frequently Asked Questions

### Is reading Reddit Ads metrics really free via Synter MCP?

Yes. All own-account read and reporting calls such as pull_reddit_ads_performance and list_campaigns cost $0.00 with 0% markup on your Reddit ad spend.

### Does creating a Reddit campaign immediately spend money?

No. reddit_ads_create_campaign and create_campaign_plan always create campaigns in a PAUSED state. Live activation requires explicit operator approval.
