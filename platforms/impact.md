> **1-Click Setup**: [Connect impact.com & Get Your Synter MCP](https://synterai.com/mcp/impact/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_impact) · [Download impact.com MCP Kit (.zip)](https://synterai.com/api/mcp/kit/impact) · [Live Platform Guide](https://synterai.com/mcp/impact)
# impact.com Affiliate MCP Server

> Query impact.com partner campaigns, affiliate actions, payouts, and ROAS at $0.00 inside Claude, Cursor, and Codex.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/impact
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/impact/connect
- **Download & Install Page**: https://synterai.com/mcp/impact/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/impact
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: impact.com Advertiser API
- **Capability Scope**: Reporting and affiliate audit
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `impact_get_campaigns`

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

## impact.com MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `impact_get_campaigns` | Read | $0.00 (Free) | List impact.com partner programs and campaign IDs. |
| `impact_get_actions` | Read | $0.00 (Free) | Inspect affiliate conversion actions, approval statuses, and commission payouts. |
| `impact_get_performance` | Read | $0.00 (Free) | Pull partner clicks, actions, revenue, and commission efficiency. |
| `get_attribution` | Read | $0.00 (Free) | Compare affiliate actions against paid search and social click attribution. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste impact.com Prompts

1. `Pull impact.com affiliate actions and payouts over the last 30 days and flag any partners overlapping with branded Google Search.`

## Frequently Asked Questions

### Are impact.com reporting tools free via Synter MCP?

Yes. impact_get_campaigns, impact_get_actions, and impact_get_performance cost $0.00 with 0% markup.
