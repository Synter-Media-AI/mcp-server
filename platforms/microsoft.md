> **1-Click Setup**: [Connect Microsoft Ads & Get Your Synter MCP](https://synterai.com/mcp/microsoft/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_microsoft) · [Download Microsoft Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/microsoft) · [Live Platform Guide](https://synterai.com/mcp/microsoft)
# Microsoft Ads (Bing) MCP Server

> Connect Claude, Cursor, and Codex to Microsoft Advertising for $0.00 Bing Search reporting, LinkedIn profile bid modifiers, and exact/phrase negative keyword hygiene.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/microsoft
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/microsoft/connect
- **Download & Install Page**: https://synterai.com/mcp/microsoft/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/microsoft
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: Microsoft Advertising API v13
- **Capability Scope**: Reporting + full campaign creation
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `pull_microsoft_ads_performance`

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

## Microsoft Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_microsoft_ads_performance` | Read | $0.00 (Free) | Pull Microsoft Ads campaign, ad-group, and keyword spend, clicks, CPC, and conversions. |
| `list_campaigns` | Read | $0.00 (Free) | List Microsoft Ads campaigns, daily budgets, and delivery status. |
| `audit_campaign_waste` | Read | $0.00 (Free) | Surface non-converting search queries and wasted spend across Bing Search. |
| `add_keywords` | Write (approval-gated) | SOLO / SCALE | Add exact and phrase keywords to Microsoft Ads search ad groups. |
| `add_negative_keywords` | Write (approval-gated) | SOLO / SCALE | Add explicit PHRASE or EXACT negative keywords to block off-ICP search traffic. |
| `create_campaign_plan` | Write (approval-gated) | SOLO / SCALE | Stage Microsoft Search campaigns as PAUSED drafts for operator sign-off. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste Microsoft Ads Prompts

1. `Pull Microsoft Ads performance for the last 14 days and compare CPA against our Google Search campaigns.`
2. `Audit wasted spend in Microsoft Ads and stage PHRASE negative keywords for job-seeker queries.`

## Frequently Asked Questions

### Does Microsoft Ads MCP support explicit negative keyword match types?

Yes. add_negative_keywords supports explicit PHRASE and EXACT negative keyword match types supported by Microsoft Advertising.

### Is Microsoft Ads read reporting free?

Yes. All own-account reporting and waste-audit reads cost $0.00 with 0% ad spend fee.
