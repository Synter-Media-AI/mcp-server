> **1-Click Setup**: [Connect CJ Affiliate & Get Your Synter MCP](https://synterai.com/mcp/cj-affiliate/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_cj-affiliate) · [Download CJ Affiliate MCP Kit (.zip)](https://synterai.com/api/mcp/kit/cj-affiliate) · [Live Platform Guide](https://synterai.com/mcp/cj-affiliate)
# CJ Affiliate MCP Server

> Connect Claude, Cursor, and Codex to CJ Affiliate for $0.00 publisher commission reporting and cross-channel attribution audits.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/cj-affiliate
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/cj-affiliate/connect
- **Download & Install Page**: https://synterai.com/mcp/cj-affiliate/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/cj-affiliate
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: CJ Affiliate Commission Detail API
- **Capability Scope**: Reporting and commission audit
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

## CJ Affiliate MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_performance` | Read | $0.00 (Free) | Pull CJ Affiliate commissions, attributed revenue, and order counts. |
| `get_attribution` | Read | $0.00 (Free) | Compare CJ publisher revenue against paid acquisition channels. |
| `get_spend_reconciliation` | Read | $0.00 (Free) | Reconcile affiliate commission payouts with blended CAC. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste CJ Affiliate Prompts

1. `Summarize CJ Affiliate commissions and attributed revenue for the last 30 days alongside impact.com and Google Ads.`

## Frequently Asked Questions

### How do I connect CJ Affiliate to Synter MCP?

Paste your CJ Personal Access Token and Company ID in Synter's encrypted connect drawer to query commission data at $0.00.
