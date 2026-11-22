> **1-Click Setup**: [Connect Instacart Ads & Get Your Synter MCP](https://synterai.com/mcp/instacart-ads/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_instacart-ads) · [Download Instacart Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/instacart-ads) · [Live Platform Guide](https://synterai.com/mcp/instacart-ads)
# Instacart Ads MCP Server

> Pull Instacart Ads impressions, spend, attributed orders, and attributed sales at $0.00 from Claude, Cursor, and Codex.

> Note: Instacart's first-party MCP covers consumer shopping workflows (store availability, recipes, carts), not Instacart Ads reporting. Use Synter for Instacart Ads campaign metrics.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/instacart-ads
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/instacart-ads/connect
- **Download & Install Page**: https://synterai.com/mcp/instacart-ads/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/instacart-ads
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Instacart Ads API
- **Capability Scope**: Reporting and performance audit
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `pull_instacart_ads_performance`

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

## Instacart Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_instacart_ads_performance` | Read | $0.00 (Free) | Pull Instacart Ads impressions, clicks, spend, attributed orders, and attributed sales. |
| `get_spend_reconciliation` | Read | $0.00 (Free) | Reconcile Instacart Ads spend against Walmart Connect and Amazon Ads. |
| `list_connected_accounts` | Read | $0.00 (Free) | Verify connected Instacart Ads advertiser accounts in your workspace. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Instacart Ads Prompts

1. `Pull Instacart Ads campaigns for the last 14 days with spend, attributed orders, attributed sales, and ROAS.`

## Frequently Asked Questions

### How is Synter different from Instacart's own MCP server?

Instacart's first-party MCP handles consumer shopping workflows (recipes, carts, store availability). Synter's MCP connects to Instacart Ads reporting via pull_instacart_ads_performance alongside 43+ ad platforms.
