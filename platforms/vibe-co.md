> **1-Click Setup**: [Connect Vibe.co & Get Your Synter MCP](https://synterai.com/mcp/vibe-co/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_vibe-co) · [Download Vibe.co MCP Kit (.zip)](https://synterai.com/api/mcp/kit/vibe-co) · [Live Platform Guide](https://synterai.com/mcp/vibe-co)
# Vibe.co MCP Server

> Connect Claude, Cursor, and Codex to Vibe.co for $0.00 read-only workflows, Self-Serve Streaming CPM analysis, and governed execution alongside 43+ ad platforms.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/vibe-co
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/vibe-co/connect
- **Download & Install Page**: https://synterai.com/mcp/vibe-co/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/vibe-co
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Vibe.co CTV Partner Seat
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

## Vibe.co MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `list_connected_accounts` | Read | $0.00 (Free) | Verify Vibe.co CTV seat status and inspect available cross-channel CTV and video tools. |
| `get_connection_status` | Read | $0.00 (Free) | Check active credential health and workspace scoping for Vibe.co. |
| `list_campaigns` | Read | $0.00 (Free) | List active workspace campaigns across connected ad accounts alongside Vibe.co. |
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

## Copy-Paste Vibe.co Prompts

1. `List my connected ad accounts and confirm Vibe.co CTV seat readiness.`
2. `Compare connected video and CTV CPM benchmarks across YouTube, DV360, and Meta Video.`
3. `Draft a local DMA streaming TV campaign brief for Vibe.co with pacing guardrails.`

## Frequently Asked Questions

### Is reading Vibe.co metrics free via Synter MCP?

Yes. Own-account read and inspection tools on https://mcp.synterai.com cost $0.00 with 0% ad spend markup. Reporting and execution depth varies by platform API and connected-account scope.

### Can Claude, Cursor, or ChatGPT query Vibe.co alongside other ad networks?

Yes. Synter unifies Vibe.co with 43+ ad platforms behind one hosted MCP server so your AI agent can inspect accounts and reconcile cross-channel spend in one session.
