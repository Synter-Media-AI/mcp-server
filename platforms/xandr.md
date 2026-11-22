> **1-Click Setup**: [Connect Xandr & Get Your Synter MCP](https://synterai.com/mcp/xandr/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_xandr) · [Download Xandr MCP Kit (.zip)](https://synterai.com/api/mcp/kit/xandr) · [Live Platform Guide](https://synterai.com/mcp/xandr)
# Xandr (Microsoft Monetize) MCP Server

> Xandr / Microsoft Monetize programmatic reporting and pacing audit

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/xandr
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/xandr/connect
- **Download & Install Page**: https://synterai.com/mcp/xandr/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/xandr
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Microsoft Monetize / Xandr API
- **Capability Scope**: Programmatic reporting and pacing audit
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

## Xandr MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `list_campaigns` | Read | $0.00 (Free) | List Xandr / Microsoft Monetize campaigns with line item status, pacing, and budget. |
| `get_paid_media_report` | Read | $0.00 (Free) | Fetch a programmatic performance report from Xandr including impressions, CPM, and conversions. |
| `get_daily_spend` | Read | $0.00 (Free) | Retrieve daily spend by campaign or line item from Xandr for a date range. |
| `get_spend_reconciliation` | Read | $0.00 (Free) | Reconcile Xandr spend against invoiced and billed amounts to catch discrepancies. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Xandr Prompts

1. `Show me pacing for all active Xandr line items this month`
2. `Which Xandr deals are underdelivering versus their pacing goals?`
3. `Reconcile Xandr billed spend against platform-reported spend for last month`

## Frequently Asked Questions

### Is this the same as Microsoft Monetize?

Yes, Xandr was rebranded as Microsoft Monetize. The MCP server uses the Microsoft Monetize / Xandr API.

### Can I manage private marketplace deals?

Reporting on deal performance is supported. Deal negotiation and creation are not included in the reporting scope.

### Does it support advertiser and publisher seats?

The server focuses on advertiser / DSP reporting. Publisher monetization endpoints are not included.
