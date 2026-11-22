> **1-Click Setup**: [Connect TikTok Ads & Get Your Synter MCP](https://synterai.com/mcp/tiktok/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_tiktok) · [Download TikTok Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/tiktok) · [Live Platform Guide](https://synterai.com/mcp/tiktok)
# TikTok Ads MCP Server

> Inspect video hook retention curves, query ad groups and creatives, and stage 9:16 vertical video campaigns directly from Claude, Cursor, and Codex.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/tiktok
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/tiktok/connect
- **Download & Install Page**: https://synterai.com/mcp/tiktok/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/tiktok
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: TikTok Marketing API v1.3+
- **Capability Scope**: Reporting + full campaign creation
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `pull_tiktok_ads_performance`

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

## TikTok Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_tiktok_ads_performance` | Read | $0.00 (Free) | Pull spend, video views, clicks, CTR, CPC, and conversion events. |
| `tiktok_ads_get_insights` | Read | $0.00 (Free) | Analyze video hook rates, watch time retention, and creative-level CPA. |
| `tiktok_ads_get_campaign` | Read | $0.00 (Free) | Inspect campaign objectives, budgets, and delivery status. |
| `tiktok_ads_get_ad_groups` | Read | $0.00 (Free) | List TikTok ad groups with targeting, bidding, and schedule settings. |
| `tiktok_ads_get_ads` | Read | $0.00 (Free) | Inspect active TikTok video creatives, Spark Ad bindings, and review states. |
| `tiktok_ads_update_adgroup` | Write (approval-gated) | SOLO / SCALE | Adjust ad-group budgets and targeting safely within guardrail caps. |
| `create_campaign_plan` | Write (approval-gated) | SOLO / SCALE | Stage complete TikTok ad groups and video creatives as PAUSED drafts. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste TikTok Ads Prompts

1. `Pull our TikTok Ads performance for the last 7 days and rank active creatives by hook retention and CPA.`
2. `List all TikTok ad groups spending more than $100 with zero conversions over the last 7 days.`

## Frequently Asked Questions

### Does TikTok Ads MCP support Spark Ads?

Yes. You can inspect and manage Spark Ads alongside standard 9:16 vertical video campaigns.

### Is TikTok Ads reporting free via MCP?

Yes. pull_tiktok_ads_performance and tiktok_ads_get_* read tools cost $0.00 with 0% ad spend markup.
