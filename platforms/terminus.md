> **1-Click Setup**: [Connect DemandScience & Get Your Synter MCP](https://synterai.com/mcp/terminus/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_terminus) · [Download DemandScience MCP Kit (.zip)](https://synterai.com/api/mcp/kit/terminus) · [Live Platform Guide](https://synterai.com/mcp/terminus)
# DemandScience (Terminus) ABM MCP Server

> Connect Claude, Cursor, and Codex to DemandScience (Terminus) ABM campaigns for $0.00 B2B display reporting alongside LinkedIn and Google.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/terminus
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/terminus/connect
- **Download & Install Page**: https://synterai.com/mcp/terminus/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/terminus
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: DemandScience / Terminus API
- **Capability Scope**: Reporting and ABM audit
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

## DemandScience MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_performance` | Read | $0.00 (Free) | Pull DemandScience (Terminus) impressions, clicks, and ABM campaign spend. |
| `list_campaigns` | Read | $0.00 (Free) | List DemandScience ABM campaigns and pacing status. |
| `get_attribution` | Read | $0.00 (Free) | Compare ABM display exposure against CRM opportunities and pipeline. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste DemandScience Prompts

1. `Pull DemandScience ABM campaign spend for the last 30 days and compare influenced pipeline against LinkedIn Ads.`

## Frequently Asked Questions

### Does Synter support both Terminus and DemandScience credentials?

Yes. Connect your DemandScience (Terminus) API credentials in Synter's encrypted drawer to query ABM performance at $0.00.
