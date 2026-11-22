> **1-Click Setup**: [Connect Roku Ads & Get Your Synter MCP](https://synterai.com/mcp/roku/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_roku) · [Download Roku Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/roku) · [Live Platform Guide](https://synterai.com/mcp/roku)
# Roku Ads (CTV) MCP Server

> Query Roku CTV programmatic deals through your connected DV360 seat at $0.00 directly inside Claude, Cursor, and Codex.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/roku
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/roku/connect
- **Download & Install Page**: https://synterai.com/mcp/roku/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/roku
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Programmatic CTV via DV360
- **Capability Scope**: Programmatic CTV reporting via DV360
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `pull_dv360_performance`

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

## Roku Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_dv360_performance` | Read | $0.00 (Free) | Pull Roku CTV PMP deal and line-item performance via your connected DV360 seat. |
| `get_spend_reconciliation` | Read | $0.00 (Free) | Reconcile Roku CTV spend against site conversions and branded search lift. |
| `list_campaigns` | Read | $0.00 (Free) | List DV360 insertion orders targeting Roku inventory. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Roku Ads Prompts

1. `Pull our Roku CTV deals in DV360 for the past 30 days and summarize spend, impressions, and eCPM.`

## Frequently Asked Questions

### Does Synter use a direct Roku Ads Manager API or programmatic seat?

Roku inventory is reached through your connected Display & Video 360 (DV360) programmatic seat in Synter MCP, with $0.00 own-account reads.
