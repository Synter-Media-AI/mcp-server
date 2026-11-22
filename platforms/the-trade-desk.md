> **1-Click Setup**: [Connect The Trade Desk & Get Your Synter MCP](https://synterai.com/mcp/the-trade-desk/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_the-trade-desk) · [Download The Trade Desk MCP Kit (.zip)](https://synterai.com/api/mcp/kit/the-trade-desk) · [Live Platform Guide](https://synterai.com/mcp/the-trade-desk)
# The Trade Desk MCP Server

> Connect Claude, Cursor, and Codex to The Trade Desk for $0.00 omnichannel DSP reporting, CTV/display spend reconciliation, and governed programmatic plans.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/the-trade-desk
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/the-trade-desk/connect
- **Download & Install Page**: https://synterai.com/mcp/the-trade-desk/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/the-trade-desk
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: The Trade Desk REST & GraphQL API
- **Capability Scope**: Reporting + governed programmatic workflows
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `pull_trade_desk_performance`

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

## The Trade Desk MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_trade_desk_performance` | Read | $0.00 (Free) | Pull The Trade Desk impressions, clicks, media cost, CPM, and conversions. |
| `get_spend_reconciliation` | Read | $0.00 (Free) | Reconcile The Trade Desk programmatic spend against warehouse and CRM conversions. |
| `list_campaigns` | Read | $0.00 (Free) | List connected Trade Desk campaigns and pacing state. |
| `create_campaign_plan` | Write (approval-gated) | SOLO / SCALE | Stage PAUSED programmatic plans for operator review. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste The Trade Desk Prompts

1. `Pull The Trade Desk CTV and display performance for the past 30 days and reconcile total spend.`

## Frequently Asked Questions

### Is reading The Trade Desk metrics free via Synter MCP?

Yes. pull_trade_desk_performance and get_spend_reconciliation cost $0.00 with 0% ad spend fee.
