> **1-Click Setup**: [Connect Pinterest Ads & Get Your Synter MCP](https://synterai.com/mcp/pinterest/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_pinterest) · [Download Pinterest Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/pinterest) · [Live Platform Guide](https://synterai.com/mcp/pinterest)
# Pinterest Ads MCP Server

> Connect Claude, Cursor, and Codex to Pinterest Ads for $0.00 shopping and pin analytics, audience sync, and PAUSED campaign staging.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/pinterest
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/pinterest/connect
- **Download & Install Page**: https://synterai.com/mcp/pinterest/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/pinterest
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Pinterest API v5
- **Capability Scope**: Reporting + write actions
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `pull_pinterest_ads_performance`

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

## Pinterest Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_pinterest_ads_performance` | Read | $0.00 (Free) | Pull Pinterest Ads spend, impressions, outbound clicks, and conversions. |
| `list_campaigns` | Read | $0.00 (Free) | List Pinterest campaigns, status, and daily budgets. |
| `update_campaign_budget` | Write (approval-gated) | SOLO / SCALE | Adjust Pinterest campaign budgets with spend guardrails. |
| `create_campaign_plan` | Write (approval-gated) | SOLO / SCALE | Stage PAUSED Pinterest campaigns for operator approval. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Pinterest Ads Prompts

1. `Show Pinterest Ads spend, outbound clicks, and checkout conversions over the last 14 days.`
2. `Compare Pinterest Ads CPA against Google Shopping and Meta Ads in one summary.`

## Frequently Asked Questions

### Does Synter take a percentage of Pinterest ad spend?

No. Synter charges 0% of ad spend and $0.00 for own-account read and reporting tools.
