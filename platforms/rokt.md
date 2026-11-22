> **1-Click Setup**: [Connect Rokt & Get Your Synter MCP](https://synterai.com/mcp/rokt/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_rokt) · [Download Rokt MCP Kit (.zip)](https://synterai.com/api/mcp/kit/rokt) · [Live Platform Guide](https://synterai.com/mcp/rokt)
# Rokt Ecommerce Ads MCP Server

> Rokt ecommerce partner-seat reporting and transaction ad insights

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/rokt
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/rokt/connect
- **Download & Install Page**: https://synterai.com/mcp/rokt/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/rokt
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Rokt Ecommerce Partner API
- **Capability Scope**: Partner-seat reporting and setup
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `list_connected_accounts`

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

## Rokt MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected Rokt partner seats and their configuration status. |
| `get_connection_status` | Read | $0.00 (Free) | Check the connection status and credential health for a Rokt partner seat. |
| `get_paid_media_report` | Read | $0.00 (Free) | Fetch a Rokt transaction media performance report with impressions, clicks, and attributed revenue. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Rokt Prompts

1. `Show me the connection status for all Rokt partner seats`
2. `What is my Rokt-attributed revenue across partner seats this month?`
3. `Compare Rokt daily spend and attributed revenue for the last 14 days`

## Frequently Asked Questions

### How do I set up the Rokt MCP Server?

The server uses guided setup. Follow the step-by-step instructions to configure your Rokt partner seat credentials.

### Is a database platform required for Rokt?

No database platform mapping is required. Rokt integrates directly through its Ecommerce Partner API.

### Can I manage Rokt creative placements?

The server supports reporting and connection management. Creative and placement editing are not included.
