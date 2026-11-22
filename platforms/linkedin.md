> **1-Click Setup**: [Connect LinkedIn Ads & Get Your Synter MCP](https://synterai.com/mcp/linkedin/connect?utm_source=github&utm_medium=readme&utm_campaign=mcp_linkedin) · [Download LinkedIn Ads MCP Kit (.zip)](https://synterai.com/api/mcp/kit/linkedin) · [Live Platform Guide](https://synterai.com/mcp/linkedin)
# LinkedIn Ads MCP Server

> Audit B2B lead generation spend, pull company engagement reports, sync ABM matched audiences, and stage Sponsored Content via Claude, Cursor, and Codex.

## Quick Facts

- **Canonical URL**: https://synterai.com/mcp/linkedin
- **1-Click Connect + Signup Deep Link**: https://synterai.com/mcp/linkedin/connect
- **Download & Install Page**: https://synterai.com/mcp/linkedin/install
- **Starter Kit Download (.zip)**: https://synterai.com/api/mcp/kit/linkedin
- **Hosted MCP Endpoint**: `https://mcp.synterai.com` (server name: `synter-ads`, transport: Streamable HTTP + browser OAuth)
- **Platform API**: LinkedIn Marketing API v2025+
- **Capability Scope**: Reporting + full campaign creation
- **Read Pricing**: $0.00 (0% ad spend markup)
- **First Read-Only Verification Tool**: `get_workspaces` then `pull_linkedin_ads_performance`

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

## LinkedIn Ads MCP Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `pull_linkedin_ads_performance` | Read | $0.00 (Free) | Pull spend, impressions, clicks, CPC, CPM, leads, and Cost Per Lead (CPL). |
| `pull_linkedin_company_engagement` | Read | $0.00 (Free) | Inspect company-level impressions, clicks, and engagement across target ABM accounts. |
| `list_audiences` | Read | $0.00 (Free) | Inspect Matched Audiences, contact lists, and company list sync status. |
| `sync_audience` | Write (approval-gated) | SOLO / SCALE | Sync ABM company domains and hashed contacts directly into LinkedIn Matched Audiences. |
| `linkedin_ads_create_campaign_group` | Write (approval-gated) | SOLO / SCALE | Create a PAUSED LinkedIn Campaign Group with budget and schedule guardrails. |
| `linkedin_ads_create_campaign` | Write (approval-gated) | SOLO / SCALE | Create a PAUSED LinkedIn Sponsored Content campaign with firmographic targeting. |
| `update_campaign_budget` | Write (approval-gated) | SOLO / SCALE | Update daily or total LinkedIn campaign budgets safely. |

## Core Workspace & Verification Tools

| Tool | Effect | Cost | Description |
| :--- | :--- | :--- | :--- |
| `get_workspaces` | Read | $0.00 (Free) | Confirm the active Synter workspace before reading or mutating any ad account. |
| `list_connected_accounts` | Read | $0.00 (Free) | List connected ad platforms and external advertiser account IDs in your workspace. |
| `get_connection_status` | Read | $0.00 (Free) | Verify OAuth or API credential health for a connected ad platform before querying. |
| `get_connect_link` | Read | $0.00 (Free) | Return a direct browser link to connect or re-authorize an ad platform. |
| `list_campaigns` | Read | $0.00 (Free) | List campaigns, budgets, and delivery status across connected ad accounts. |
| `get_performance` | Read | $0.00 (Free) | Pull normalized spend, impressions, clicks, conversions, and CPA across platforms. |

## Copy-Paste LinkedIn Ads Prompts

1. `Pull our LinkedIn Ads performance for the last 30 days grouped by campaign group and calculate Cost Per Lead.`
2. `Pull LinkedIn company engagement for the last 30 days and highlight enterprise accounts with >5 clicks.`
3. `Stage a PAUSED LinkedIn Sponsored Content campaign targeting CTOs and VPs of Engineering at SaaS companies with 200 to 5000 employees.`

## Frequently Asked Questions

### Can I connect LinkedIn without a browser OAuth popup?

Yes. Synter supports both 1-click LinkedIn OAuth and direct LinkedIn Business Manager partner sharing so teams keep full administrative control.

### Does Synter enforce LinkedIn's 300-member audience minimum?

Yes. Synter's audience preflight checks verify matched audience readiness before activating delivery.
