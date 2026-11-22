> **1-Click Setup**: [Connect Brave Ads & Get Your Synter MCP](https://synterai.com/mcp/brave-ads/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_brave-ads) · [Download Brave Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/brave-ads) · [Live Platform Guide](https://synterai.com/mcp/brave-ads)
# Brave Ads MCP Server

> Connect Claude, Cursor, and Codex to Brave Ads for $0.00 read-only workflows, Privacy Search CPC / CPM analysis, and governed execution alongside 43+ ad platforms.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/brave-ads
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/brave-ads/connect
- **Download & Install Page**: https://synterai.com/mcp/brave-ads/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/brave-ads
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Brave Ads Partner & Connector Scope
- **Capability Scope**: Reporting & Audit
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `list_connected_accounts`

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

## Brave Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `list_connected_accounts` | Read | $0.00 (Free) | Verify workspace connection status and inspect available Brave Ads connector operations. |
| `get_connection_status` | Read | $0.00 (Free) | Check active credential health and workspace scoping for Brave Ads. |
| `list_campaigns` | Read | $0.00 (Free) | List active workspace campaigns across connected ad accounts alongside Brave Ads. |
| `run_launch_preflight` | Read | $0.00 (Free) | Verify landing page HTTP 200 status and pixel conversion health before launch. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Brave Ads Prompts

1. `List my connected ad accounts and check Brave Ads connection readiness and available tools.`
2. `Review Brave Ads spend alongside Google Search and Reddit Ads in my workspace summary.`
3. `Prepare a draft campaign brief for Brave Search Ads targeting developer and privacy keywords.`

## Frequently Asked Questions

### Is reading Brave Ads metrics free via Synter MCP?

Yes. Own-account read and inspection tools on https://mcp.synterai.com cost $0.00 with 0% ad spend markup. Reporting and execution depth varies by platform API and connected-account scope.

### Can Claude, Cursor, or ChatGPT query Brave Ads alongside other ad networks?

Yes. Synter unifies Brave Ads with 43+ ad platforms behind one hosted MCP server so your AI agent can inspect accounts and reconcile cross-channel spend in one session.
