> **1-Click Setup**: [Connect Taboola & Get Your Synter MCP](https://synterai.com/mcp/taboola/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_taboola) · [Download Taboola MCP Kit (.zip)](https://synterai.com/api/mcp/kit/taboola) · [Live Platform Guide](https://synterai.com/mcp/taboola)
# Taboola Native Ads MCP Server

> Connect Claude, Cursor, and Codex to Taboola Backstage for $0.00 native campaign reporting, account audits, and governed write scripts.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/taboola
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/taboola/connect
- **Download & Install Page**: https://synterai.com/mcp/taboola/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/taboola
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Taboola Backstage API
- **Capability Scope**: Reporting + write actions
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `taboola_get_accounts`

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

## Taboola MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `taboola_get_accounts` | Read | $0.00 (Free) | List accessible Taboola Backstage advertiser accounts. |
| `taboola_get_campaigns` | Read | $0.00 (Free) | List Taboola campaigns, bids, daily caps, and approval status. |
| `taboola_get_performance` | Read | $0.00 (Free) | Pull Taboola impressions, clicks, spend, CTR, CPC, conversions, CPA, and ROAS. |
| `execute` | Write (approval-gated) | SOLO / SCALE | Execute governed Taboola campaign creation and update scripts with operator sign-off. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Taboola Prompts

1. `List our Taboola campaigns and pull spend, clicks, conversions, and CPA for the last 14 days.`
2. `Compare Taboola native CPA against Outbrain and Meta Feed campaigns.`

## Frequently Asked Questions

### How do I connect Taboola to Synter MCP?

Enter your Taboola Backstage Client ID, Client Secret, and Account ID in Synter's encrypted connect drawer. All taboola_get_* reads cost $0.00.
