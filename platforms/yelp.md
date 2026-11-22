> **1-Click Setup**: [Connect Yelp Ads & Get Your Synter MCP](https://synterai.com/mcp/yelp/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_yelp) · [Download Yelp Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/yelp) · [Live Platform Guide](https://synterai.com/mcp/yelp)
# Yelp Ads MCP Server

> Audit Yelp Ads local search clicks, phone calls, leads, and budget pacing at $0.00 inside Claude, Cursor, and Codex.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/yelp
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/yelp/connect
- **Download & Install Page**: https://synterai.com/mcp/yelp/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/yelp
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Yelp Advertising Reporting API
- **Capability Scope**: Reporting and local lead audit
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

## Yelp Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_performance` | Read | $0.00 (Free) | Pull Yelp Ads impressions, clicks, leads, and spend across local campaigns. |
| `list_campaigns` | Read | $0.00 (Free) | List active Yelp Ads programs and monthly budget settings. |
| `get_daily_spend` | Read | $0.00 (Free) | Track daily Yelp Ads spend pacing. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Yelp Ads Prompts

1. `Pull Yelp Ads performance for the last 30 days and calculate cost per lead alongside Google Search and Nextdoor Ads.`

## Frequently Asked Questions

### Can I audit multi-location Yelp Ads alongside Google Ads?

Yes. Connect both Yelp Ads and Google Ads in Synter to query blended local acquisition metrics in one prompt.
