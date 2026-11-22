> **1-Click Setup**: [Connect AdRoll & Get Your Synter MCP](https://synterai.com/mcp/adroll/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_adroll) · [Download AdRoll MCP Kit (.zip)](https://synterai.com/api/mcp/kit/adroll) · [Live Platform Guide](https://synterai.com/mcp/adroll)
# AdRoll Retargeting MCP Server

> Connect Claude, Cursor, and Codex to AdRoll for $0.00 retargeting and display campaign performance audits across 43+ ad platforms.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/adroll
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/adroll/connect
- **Download & Install Page**: https://synterai.com/mcp/adroll/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/adroll
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: AdRoll Marketing API
- **Capability Scope**: Reporting and performance audit
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

## AdRoll MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_performance` | Read | $0.00 (Free) | Pull AdRoll spend, impressions, clicks, and conversions for connected campaigns. |
| `list_campaigns` | Read | $0.00 (Free) | List AdRoll retargeting campaigns, budgets, and delivery status. |
| `get_spend_reconciliation` | Read | $0.00 (Free) | Compare AdRoll attribution against GA4 and first-party pixel conversions. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste AdRoll Prompts

1. `Pull AdRoll retargeting performance for the last 30 days and compare click-through CPA against Meta and Google Display.`

## Frequently Asked Questions

### Is AdRoll reporting free via Synter MCP?

Yes. Own-account performance pulls and attribution checks cost $0.00 with 0% ad spend markup.
