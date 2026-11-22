> **1-Click Setup**: [Connect FreeWheel & Get Your Synter MCP](https://synterai.com/mcp/freewheel/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_freewheel) · [Download FreeWheel MCP Kit (.zip)](https://synterai.com/api/mcp/kit/freewheel) · [Live Platform Guide](https://synterai.com/mcp/freewheel)
# FreeWheel Buyer Cloud (Beeswax) MCP Server

> Pull FreeWheel Buyer Cloud and Beeswax CTV and video line-item performance at $0.00 directly from Claude, Cursor, and Codex.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/freewheel
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/freewheel/connect
- **Download & Install Page**: https://synterai.com/mcp/freewheel/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/freewheel
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: FreeWheel Buyer Cloud / Beeswax API
- **Capability Scope**: Reporting and spend reconciliation
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `pull_freewheel_performance`

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

## FreeWheel MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_freewheel_performance` | Read | $0.00 (Free) | Pull FreeWheel Buyer Cloud impressions, video completions, spend, and eCPM. |
| `get_spend_reconciliation` | Read | $0.00 (Free) | Reconcile CTV media spend across FreeWheel, DV360, and The Trade Desk. |
| `list_campaigns` | Read | $0.00 (Free) | List connected FreeWheel campaigns and line-item budgets. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste FreeWheel Prompts

1. `Pull FreeWheel Buyer Cloud performance for the last 30 days and compare eCPM and completion rates against The Trade Desk.`

## Frequently Asked Questions

### Does Synter support Beeswax / FreeWheel Buyer Cloud credentials?

Yes. Enter your Buyer Cloud credentials in Synter's encrypted connect drawer to query pull_freewheel_performance for $0.00.
