> **1-Click Setup**: [Connect Walmart Connect & Get Your Synter MCP](https://synterai.com/mcp/walmart-connect/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_walmart-connect) · [Download Walmart Connect MCP Kit (.zip)](https://synterai.com/api/mcp/kit/walmart-connect) · [Live Platform Guide](https://synterai.com/mcp/walmart-connect)
# Walmart Connect MCP Server

> Report on Walmart Connect Sponsored Search and Display campaigns at $0.00 from Claude, Cursor, and Codex alongside Amazon and Instacart.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/walmart-connect
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/walmart-connect/connect
- **Download & Install Page**: https://synterai.com/mcp/walmart-connect/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/walmart-connect
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Walmart Connect Advertising API
- **Capability Scope**: Reporting and performance audit
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `pull_walmart_ads_performance`

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

## Walmart Connect MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_walmart_ads_performance` | Read | $0.00 (Free) | Pull Walmart Connect impressions, clicks, spend, conversions, and ROAS per campaign. |
| `get_spend_reconciliation` | Read | $0.00 (Free) | Reconcile Walmart Connect spend alongside Amazon Ads and Instacart Ads. |
| `list_connected_accounts` | Read | $0.00 (Free) | Verify connected Walmart Connect advertiser accounts in your workspace. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Walmart Connect Prompts

1. `Pull Walmart Connect performance for the last 14 days and rank campaigns by ROAS and attributed sales.`
2. `Compare Walmart Connect ROAS against Amazon Ads and Target Roundel in a single retail media summary.`

## Frequently Asked Questions

### Does Walmart Connect MCP support live campaign writes?

Synter currently exposes Walmart Connect for reporting and performance audits via pull_walmart_ads_performance. All own-account reporting reads are $0.00.
