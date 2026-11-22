> **1-Click Setup**: [Connect Criteo & Get Your Synter MCP](https://synterai.com/mcp/criteo/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_criteo) · [Download Criteo MCP Kit (.zip)](https://synterai.com/api/mcp/kit/criteo) · [Live Platform Guide](https://synterai.com/mcp/criteo)
# Criteo Commerce Media MCP Server

> Pull Criteo Commerce Media displays, clicks, cost, conversions, and revenue at $0.00 across 43+ ad platforms in one MCP session.

> Note: Criteo also publishes a first-party MCP at developers.criteo.com/mcp. Use Synter when you want Criteo unified across 43+ ad platforms in one session.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/criteo
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/criteo/connect
- **Download & Install Page**: https://synterai.com/mcp/criteo/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/criteo
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Criteo Marketing Solutions API
- **Capability Scope**: Reporting + write actions
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `pull_criteo_ads_performance`

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

## Criteo MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_criteo_ads_performance` | Read | $0.00 (Free) | Pull Criteo displays, clicks, cost, conversions, and attributed revenue. |
| `list_campaigns` | Read | $0.00 (Free) | List connected Criteo campaigns and delivery states. |
| `get_spend_reconciliation` | Read | $0.00 (Free) | Reconcile Criteo spend against first-party Shopify and CRM orders. |
| `execute` | Write (approval-gated) | SOLO / SCALE | Run verified Criteo reporting and maintenance scripts when permitted by account scope. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Criteo Prompts

1. `Pull Criteo performance for the last 14 days showing displays, clicks, cost, and revenue by campaign.`
2. `Compare Criteo ROAS against Meta retargeting and Amazon Sponsored Display.`

## Frequently Asked Questions

### Does Criteo also have its own MCP server?

Yes, Criteo publishes a first-party MCP at https://developers.criteo.com/mcp. Synter connects Criteo across 43+ ad platforms behind a single endpoint (https://mcp.synterai.com).
