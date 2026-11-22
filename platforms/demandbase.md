> **1-Click Setup**: [Connect Demandbase & Get Your Synter MCP](https://synterai.com/mcp/demandbase/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_demandbase) · [Download Demandbase MCP Kit (.zip)](https://synterai.com/api/mcp/kit/demandbase) · [Live Platform Guide](https://synterai.com/mcp/demandbase)
# Demandbase ABM MCP Server

> Connect Claude, Cursor, and Codex to Demandbase for $0.00 ABM campaign performance, account engagement audits, and cross-channel B2B attribution.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/demandbase
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/demandbase/connect
- **Download & Install Page**: https://synterai.com/mcp/demandbase/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/demandbase
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Demandbase Advertising API
- **Capability Scope**: Reporting and ABM audit
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `demandbase_get_campaigns`

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

## Demandbase MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `demandbase_get_campaigns` | Read | $0.00 (Free) | List Demandbase ABM advertising campaigns, status, and budgets. |
| `demandbase_get_performance` | Read | $0.00 (Free) | Pull Demandbase impressions, clicks, spend, and account reach metrics. |
| `get_attribution` | Read | $0.00 (Free) | Correlate Demandbase ABM touchpoints with CRM pipeline and closed revenue. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Demandbase Prompts

1. `List our Demandbase campaigns and compare spend and account reach against LinkedIn Ads over the last 30 days.`

## Frequently Asked Questions

### Are Demandbase MCP read calls free?

Yes. demandbase_get_campaigns and demandbase_get_performance cost $0.00 with 0% ad spend fee.
