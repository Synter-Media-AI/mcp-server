> **1-Click Setup**: [Connect OpenAI Ads & Get Your Synter MCP](https://synterai.com/mcp/openai/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_openai) · [Download OpenAI Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/openai) · [Live Platform Guide](https://synterai.com/mcp/openai)
# OpenAI Ads MCP Server

> Connect Claude, Cursor, and Codex to OpenAI Ads for $0.00 conversational placement reporting, context-hint preflight, and PAUSED campaign staging.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/openai
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/openai/connect
- **Download & Install Page**: https://synterai.com/mcp/openai/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/openai
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: OpenAI Ads Direct API
- **Capability Scope**: Reporting + governed campaign workflows
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `pull_openai_ads_performance`

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

## OpenAI Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_openai_ads_performance` | Read | $0.00 (Free) | Pull OpenAI Ads impressions, clicks, spend, oCPC metrics, and conversions. |
| `list_campaigns` | Read | $0.00 (Free) | List OpenAI Ads campaigns, status, and budget configuration. |
| `run_launch_preflight` | Read | $0.00 (Free) | Verify landing page HTTP 200 status and pixel conversion health before launch. |
| `create_campaign_plan` | Write (approval-gated) | SOLO / SCALE | Stage PAUSED OpenAI Ads campaigns for operator review before spend begins. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste OpenAI Ads Prompts

1. `Pull our OpenAI Ads performance for the last 14 days and compare cost per conversion against Google Search.`
2. `Run launch preflight on our landing page and stage a PAUSED OpenAI Ads campaign targeting developer workflows.`

## Frequently Asked Questions

### Can I query OpenAI Ads alongside Google and Meta in one MCP server?

Yes. Synter unifies OpenAI Ads with 30+ search, social, and programmatic ad platforms behind https://mcp.synterai.com.

### What does it cost to read OpenAI Ads metrics?

Reading performance metrics is $0.00 with 0% ad spend markup.
