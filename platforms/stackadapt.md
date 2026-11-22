> **1-Click Setup**: [Connect StackAdapt & Get Your Synter MCP](https://synterai.com/mcp/stackadapt/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_stackadapt) · [Download StackAdapt MCP Kit (.zip)](https://synterai.com/api/mcp/kit/stackadapt) · [Live Platform Guide](https://synterai.com/mcp/stackadapt)
# StackAdapt Programmatic MCP Server

> Connect Claude, Cursor, and Codex to StackAdapt for $0.00 programmatic native, display, CTV, and ABM audience reporting.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/stackadapt
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/stackadapt/connect
- **Download & Install Page**: https://synterai.com/mcp/stackadapt/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/stackadapt
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: StackAdapt GraphQL & REST API
- **Capability Scope**: Reporting + audience workflows
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `stackadapt_get_campaigns`

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

## StackAdapt MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `stackadapt_get_campaigns` | Read | $0.00 (Free) | List StackAdapt campaigns, bids, budgets, and delivery status. |
| `stackadapt_get_audiences` | Read | $0.00 (Free) | List StackAdapt ABM and retargeting audience segments. |
| `get_performance` | Read | $0.00 (Free) | Pull StackAdapt impressions, clicks, spend, CPC, and conversions. |
| `attach_audience` | Write (approval-gated) | SOLO / SCALE | Attach matched audiences to StackAdapt campaigns. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste StackAdapt Prompts

1. `List all StackAdapt campaigns and flag any line item with high CPC and zero conversions over the last 30 days.`

## Frequently Asked Questions

### Can I audit StackAdapt spend alongside Google and LinkedIn for free?

Yes. All own-account StackAdapt read tools cost $0.00 with 0% markup on media spend.
