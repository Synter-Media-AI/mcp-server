> **1-Click Setup**: [Connect Quora Ads & Get Your Synter MCP](https://synterai.com/mcp/quora-ads/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_quora-ads) · [Download Quora Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/quora-ads) · [Live Platform Guide](https://synterai.com/mcp/quora-ads)
# Quora Ads MCP Server

> Connect Claude, Cursor, and Codex to Quora Ads for $0.00 question-intent campaign reporting alongside Reddit, Google Search, and LinkedIn.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/quora-ads
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/quora-ads/connect
- **Download & Install Page**: https://synterai.com/mcp/quora-ads/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/quora-ads
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Quora Ads API
- **Capability Scope**: Reporting + write actions (depth varies)
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `get_performance`

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

## Quora Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_performance` | Read | $0.00 (Free) | Pull Quora Ads impressions, clicks, spend, CPC, and conversions. |
| `list_campaigns` | Read | $0.00 (Free) | List Quora Ads campaigns, daily budgets, and delivery state. |
| `get_daily_spend` | Read | $0.00 (Free) | Monitor daily Quora Ads pacing against target CPA. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Quora Ads Prompts

1. `Pull Quora Ads performance for the last 14 days and compare CPC and conversion rate against Reddit Ads.`

## Frequently Asked Questions

### Can Claude compare Quora Ads and Reddit Ads together?

Yes. Connect both Quora Ads and Reddit Ads to https://mcp.synterai.com and compare spend and conversion efficiency in one prompt.
