> **1-Click Setup**: [Connect Etsy Ads & Get Your Synter MCP](https://synterai.com/mcp/etsy/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_etsy) · [Download Etsy Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/etsy) · [Live Platform Guide](https://synterai.com/mcp/etsy)
# Etsy Ads MCP Server

> Etsy Ads reporting and shop marketing insights for makers and brands

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/etsy
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/etsy/connect
- **Download & Install Page**: https://synterai.com/mcp/etsy/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/etsy
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Etsy Ads & Shop Marketing API
- **Capability Scope**: Reporting and shop campaign audit
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `list_campaigns`

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

## Etsy Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `list_campaigns` | Read | $0.00 (Free) | List Etsy Ads campaigns for a shop including status, budget, and daily spend. |
| `get_paid_media_report` | Read | $0.00 (Free) | Fetch a paid media performance report for Etsy Ads with impressions, clicks, and attributed stats. |
| `get_daily_spend` | Read | $0.00 (Free) | Retrieve daily spend breakdown for Etsy Ads campaigns over a selected date range. |
| `get_spend_reconciliation` | Read | $0.00 (Free) | Reconcile Etsy Ads spend against billing records and surface discrepancies. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Etsy Ads Prompts

1. `Summarize my Etsy Ads campaign performance for the last 30 days`
2. `Which Etsy listings are driving the most ad-attributed revenue?`
3. `Compare Etsy Ads daily spend across the last two weeks`

## Frequently Asked Questions

### How does the Etsy Ads MCP Server connect?

The server uses OAuth to securely connect to your Etsy shop and Ads account.

### Can I create or edit Etsy Ads campaigns?

This server is focused on reporting and spend reconciliation. Campaign creation is not supported.

### Does it support multi-shop accounts?

Yes, you can switch between connected Etsy shops if your workspace has multiple authorized accounts.
