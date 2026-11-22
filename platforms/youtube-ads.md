> **1-Click Setup**: [Connect YouTube Ads & Get Your Synter MCP](https://synterai.com/mcp/youtube-ads/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_youtube-ads) · [Download YouTube Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/youtube-ads) · [Live Platform Guide](https://synterai.com/mcp/youtube-ads)
# YouTube Ads MCP Server

> Query YouTube Demand Gen and video campaign performance, GAQL breakdowns, and PAUSED video launches through your connected Google Ads MCP seat.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/youtube-ads
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/youtube-ads/connect
- **Download & Install Page**: https://synterai.com/mcp/youtube-ads/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/youtube-ads
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Google Ads API (Demand Gen & Video)
- **Capability Scope**: Write via Google Ads Demand Gen
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

## YouTube Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_google_ads_performance` | Read | $0.00 (Free) | Pull spend, views, clicks, and conversions for Google Ads Demand Gen and video campaigns serving on YouTube. |
| `run_gaql_query` | Read | $0.00 (Free) | Query video view rates, placements, and audience segments serving on YouTube via GAQL. |
| `youtube_get_videos` | Read | $0.00 (Free) | Inspect connected YouTube channel videos available for campaign promotion. |
| `update_campaign_budget` | Write (approval-gated) | SOLO / SCALE | Adjust daily Demand Gen and video budgets within safety guardrails. |
| `create_campaign_plan` | Write (approval-gated) | SOLO / SCALE | Stage PAUSED Google Ads Demand Gen campaigns for YouTube inventory. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste YouTube Ads Prompts

1. `Show my Google Ads Demand Gen and video campaigns that serve on YouTube with spend, views, and conversions over the last 14 days.`
2. `Compare YouTube Ads CPA against Meta Reels and TikTok video campaigns in one table.`

## Frequently Asked Questions

### How does Synter connect to YouTube Ads?

YouTube ad buying runs inside Google Ads. Connect your Google Ads account with 1-click OAuth and query video and Demand Gen campaigns directly via https://mcp.synterai.com.
