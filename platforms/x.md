> **1-Click Setup**: [Connect X Ads & Get Your Synter MCP](https://synterai.com/mcp/x/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_x) · [Download X Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/x) · [Live Platform Guide](https://synterai.com/mcp/x)
# X Ads MCP Server

> Connect Claude, Cursor, and Codex to X Ads for $0.00 read-only analytics, live conversation keyword targeting, follower lookalikes, and PAUSED campaign staging.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/x
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/x/connect
- **Download & Install Page**: https://synterai.com/mcp/x/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/x
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: X Ads API v12
- **Capability Scope**: Reporting + full campaign creation
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `pull_x_ads_performance`

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

## X Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_x_ads_performance` | Read | $0.00 (Free) | Pull impressions, clicks, spend, engagement rate, and conversion metrics from X Ads. |
| `list_campaigns` | Read | $0.00 (Free) | List X Ads campaigns, funding instruments, daily budgets, and delivery states. |
| `get_campaign_observation` | Read | $0.00 (Free) | Inspect pacing, delivery anomalies, and cost-per-click shifts across X campaigns. |
| `create_campaign_plan` | Write (approval-gated) | SOLO / SCALE | Stage keyword-targeted and follower-lookalike X Ads campaigns as PAUSED drafts. |
| `update_campaign_budget` | Write (approval-gated) | SOLO / SCALE | Adjust X campaign budgets with directional velocity guardrails. |
| `pause_campaign` | Write (approval-gated) | SOLO / SCALE | Immediately pause underperforming X Ads campaigns. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste X Ads Prompts

1. `Pull our X Ads performance over the past 14 days and compare CPC and conversion rate across keyword-targeted vs follower-lookalike line items.`
2. `Stage a PAUSED X Ads keyword campaign targeting engineering and CTO conversations mentioning Google Ads MCP and Meta Ads MCP.`

## Frequently Asked Questions

### Can Claude query X Ads performance for free?

Yes. Connecting your X Ads account and running pull_x_ads_performance or list_campaigns costs $0.00 with zero ad spend markup.

### How are X Ads writes governed?

All new X Ads builds are staged PAUSED first via create_campaign_plan, and budget increases above workspace thresholds require explicit approval.
