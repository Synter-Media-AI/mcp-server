> **1-Click Setup**: [Connect 6sense & Get Your Synter MCP](https://synterai.com/mcp/6sense/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_6sense) · [Download 6sense MCP Kit (.zip)](https://synterai.com/api/mcp/kit/6sense) · [Live Platform Guide](https://synterai.com/mcp/6sense)
# 6sense ABM MCP Server

> 6sense Revenue AI intent, account audiences, and ABM attribution

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/6sense
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/6sense/connect
- **Download & Install Page**: https://synterai.com/mcp/6sense/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/6sense
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: 6sense Revenue AI & ABM API
- **Capability Scope**: ABM intent and account audience sync
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `build_abm_audience`

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

## 6sense MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `build_abm_audience` | Read | $0.00 (Free) | Build an ABM account audience from 6sense intent, fit, and engagement signals. |
| `sync_audience` | Read | $0.00 (Free) | Sync a 6sense account audience to a connected ad platform for activation. |
| `get_attribution` | Read | $0.00 (Free) | Retrieve 6sense Revenue AI attribution data mapping accounts to pipeline and revenue. |
| `get_paid_media_report` | Read | $0.00 (Free) | Fetch a paid media performance report linked to 6sense account segments and intent topics. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste 6sense Prompts

1. `Show me the top 50 accounts with rising intent in my 6sense segments`
2. `Build an ABM audience from high-fit, high-intent accounts and sync to LinkedIn`
3. `What revenue is attributed to 6sense-sourced accounts this quarter?`

## Frequently Asked Questions

### How does the 6sense MCP Server authenticate?

Authentication uses an API key configured in your workspace. No OAuth flow is required.

### Can I sync audiences to ad platforms?

Yes, the sync_audience tool can push 6sense account audiences to connected platforms such as LinkedIn and Demandbase.

### Does it support predictive model tuning?

The server surfaces predictive scores and intent data but does not modify 6sense model configuration.
