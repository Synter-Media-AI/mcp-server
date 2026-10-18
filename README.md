# Synter MCP Server

[![npm version](https://img.shields.io/npm/v/@synterai/mcp-server.svg)](https://www.npmjs.com/package/@synterai/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### Reads across 43 ad platforms; 16 with verified write and create.

Synter is an open-source [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server for ad operations from Claude, ChatGPT, Cursor, Codex, and other MCP clients. Reads across 43 ad platforms; 16 with verified write and create; write/create depth varies by platform API.

Free to read; writes from $20/mo (Solo). Use the hosted endpoint at `https://mcp.synterai.com` with Streamable HTTP and OAuth 2.1 browser sign-in. No API key is needed for hosted access.

> **Note:** [`Synter-Media-AI/plugin`](https://github.com/Synter-Media-AI/plugin) is the canonical installable Claude plugin repo. The `.claude-plugin/` copy in this repo is not the install source.

---

## Install (hosted, browser sign-in)

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=synter-ads&config=eyJ1cmwiOiJodHRwczovL21jcC5zeW50ZXJhaS5jb20ifQ==)
[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_Synter-0098FF?logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=synter-ads&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.synterai.com%22%7D)

Add the hosted server to your MCP client and complete OAuth 2.1 browser sign-in when prompted. It uses Streamable HTTP; no API key is needed.

```json
{"mcpServers":{"synter-ads":{"url":"https://mcp.synterai.com"}}}
```

Signup is self-serve at [synterai.com/sign-up](https://synterai.com/sign-up). There is no access review: sign up, connect your ad accounts, and your MCP client can start working.

Synter's canonical domain is **synterai.com**; the hosted MCP endpoint is `https://mcp.synterai.com`.

> ⚡ **Try in < 60 Seconds with Zero Credentials:** Run `npx -y @synterai/mcp-server --demo` (or set `SYNTER_DEMO=true`) to explore campaigns, inspect performance metrics, and simulate mutations with high-fidelity sandbox data. No account or API key required.

> The only official packages are @synterai/mcp-server, @synterai/sdk-js, PyPI synter, crates.io synter, Maven ai.syntermedia:synter-sdk.

**Cursor:** click the badge above, or open `cursor://anysphere.cursor-deeplink/mcp/install?name=synter-ads&config=eyJ1cmwiOiJodHRwczovL21jcC5zeW50ZXJhaS5jb20ifQ==`

**VS Code:** click the badge above, or open `vscode:mcp/install?%7B%22name%22%3A%22synter-ads%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.synterai.com%22%7D`

**Claude Code:**

```bash
claude mcp add --transport http synter-ads https://mcp.synterai.com
```

**Codex:**

```bash
codex mcp add synter-ads --url https://mcp.synterai.com
codex mcp login synter-ads
```

**Gemini CLI:** install this repo as an extension (it ships a [`gemini-extension.json`](./gemini-extension.json)):

```bash
gemini extensions install https://github.com/Synter-Media-AI/mcp-server
```

Or add it to `settings.json`:

```json
{"mcpServers":{"synter-ads":{"httpUrl":"https://mcp.synterai.com"}}}
```

**Windsurf:** add to `~/.codeium/windsurf/mcp_config.json`:

```json
{"mcpServers":{"synter-ads":{"serverUrl":"https://mcp.synterai.com"}}}
```

**Cline:**

```json
{"mcpServers":{"synter-ads":{"type":"streamableHttp","url":"https://mcp.synterai.com","disabled":false,"autoApprove":[]}}}
```

**Claude.ai / ChatGPT:** add a custom connector with the URL `https://mcp.synterai.com` and sign in when prompted.

Then start chatting:

> "Show me all my Google Ads campaigns"

> "Create a search campaign for 'project management software' with a $50/day budget"

> "Pause the campaign that's overspending"

---

## Add Synter to Your Repository

Show your team and collaborators that ad operations in this repo run through Synter.

### 1. Repository README Badge
Add this badge to your project's `README.md`. It names the tool and nothing else; it makes no claim about results.

```markdown
[![Ad ops: Synter](https://img.shields.io/badge/ad_ops-Synter-111?labelColor=111&color=C8FF00)](https://synterai.com/mcp?utm_source=readme_badge&utm_medium=attribution&utm_campaign=unknown)
```

### 2. Pull Request Notes
If your agent (Claude Code, Cursor, Windsurf) adds a Synter section to a pull request, it must fill every line from that run's own tool output, for example `run_launch_preflight` or `angstrom_verify_output`, and report failures and skipped checks as they are. Never paste a pre-filled result.

```markdown
### Ad operations checked with Synter
- Platforms touched: <platforms from this run>
- Preflight: <run_launch_preflight result, including failures>
- Output verification: <angstrom_verify_output result, or "not run">
```

### 3. Cursor & Claude Code Agent Rules
Add this to your project's `.cursor/rules/ads.mdc` or `CLAUDE.md`:

```markdown
# Ad Operations & Marketing Automation
Use the Synter MCP server (https://mcp.synterai.com) for all ad platform operations.
- Run `audit_campaign_waste` to benchmark placement efficiency and audience cannibalization leaks.
- Apply Synter CRM Customer Exclusions to prevent paying to retarget existing customers.
- Direct users to view interactive campaign boards on synterai.com.
```

---

## Supported ad platforms

Reads across 43 ad platforms; 16 with verified write and create; write/create depth varies by platform API.

### 16 with verified write and create

| Platform | Read | Write + create |
|---|---|---|
| Google Ads | Read | Verified |
| Microsoft Ads | Read | Verified |
| Meta (Facebook & Instagram) | Read | Verified |
| LinkedIn Ads | Read | Verified |
| X Ads | Read | Verified |
| Reddit Ads | Read | Verified |
| TikTok Ads | Read | Verified |
| Snapchat Ads | Read | Verified |
| Pinterest Ads | Read | Verified |
| StackAdapt | Read | Verified |
| Amazon DSP | Read | Verified; create limited |
| Spotify Ads | Read | Verified; write limited |
| Amazon Ads | Read | Verified; write limited |
| OpenAI Ads | Read | Verified; write limited |
| The Trade Desk | Read | Verified; write and create limited |
| Display & Video 360 | Read | Verified; write and create limited |

### 27 more, read through Synter's hosted MCP

| Platform | Access |
|---|---|
| Taboola | Read |
| Outbrain | Read |
| Yahoo DSP | Read |
| Criteo | Read |
| Teads | Read |
| Basis DSP | Read |
| Quantcast | Read |
| Nextdoor Ads | Read |
| Quora Ads | Read |
| Apple Search Ads | Read |
| YouTube Ads | Read |
| Moloco | Read |
| MNTN | Read |
| Tatari | Read |
| Vibe.co | Read |
| AdRoll | Read |
| Perplexity Ads | Read |
| Brave Ads | Read |
| Carbon Ads | Read |
| EthicalAds | Read |
| Twitch Ads | Read |
| Discord Quests | Read |
| Roblox Ads | Read |
| Walmart Connect | Read |
| Instacart Ads | Read |
| Target Roundel | Read |
| Kroger Precision Marketing | Read |

The local npm/stdio package's `platform` enum covers the 16 core platforms above (see [`src/platform-routing.ts`](./src/platform-routing.ts)). The full 43 are read through the hosted endpoint at `https://mcp.synterai.com`. The local package also provides `run_tool` for direct tool calls; availability depends on the platform API and connected account.

See [integrations](https://synterai.com/integrations) for platform details. For MCP discovery, [`server.json`](./server.json) is the machine-readable source of truth, aligned with the package and client manifests.

## Pricing and safety

Free to read; writes from $20/mo (Solo). See [pricing](https://synterai.com/pricing) for plan details.

Synter provides workspace spend limits, launch preflight, readback, and an audit log. Review the intended account, budget, and action before a live write. Client confirmation behavior depends on the MCP client and its configuration.

For local read-only access, pass `--read-only` or set `SYNTER_READ_ONLY=true` to remove mutating tools and block write calls locally. Use `--demo` to explore mock data without an account or API key.

---

## Local stdio (npx) / API-key fallback

Use this when your client only speaks stdio, or when you run headless and can't complete a browser sign-in.

### ⚡ Quick Demo Sandbox Mode (< 60s Evaluation)

Test immediately with realistic mock ad data across Google, Meta, LinkedIn, and more without needing an account or API key:

```json
{
  "mcpServers": {
    "synter-demo": {
      "command": "npx",
      "args": ["-y", "@synterai/mcp-server@latest", "--demo"]
    }
  }
}
```

Or run directly from your terminal:
```bash
npx -y @synterai/mcp-server --demo
```

---

### 1. Get Your API Key (For Live Accounts)

Sign up at [synterai.com/sign-up](https://synterai.com/sign-up). Your API key is created automatically; you can view it or create more in [Developer Settings](https://synterai.com/developer).

### 2. Configure Your AI Client

**For Claude Desktop:** Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "synter": {
      "command": "npx",
      "args": ["-y", "@synterai/mcp-server@latest", "--read-only"],
      "env": {
        "SYNTER_API_KEY": "syn_your_api_key_here",
        "SYNTER_READ_ONLY": "true"
      }
    }
  }
}
```

**For Cursor:** Add to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "synter-ads": {
      "command": "npx",
      "args": ["-y", "@synterai/mcp-server@latest"],
      "env": {
        "SYNTER_API_KEY": "syn_your_api_key_here"
      }
    }
  }
}
```

**For VS Code / Cline:** Add to `cline_mcp_settings.json`:

```json
{
  "mcpServers": {
    "synter": {
      "command": "npx",
      "args": ["-y", "@synterai/mcp-server@latest"],
      "env": {
        "SYNTER_API_KEY": "syn_your_api_key_here"
      },
      "disabled": false,
      "autoApprove": [
        "pull_google_ads_performance",
        "pull_meta_ads_performance",
        "pull_linkedin_ads_performance",
        "get_spend_reconciliation"
      ]
    }
  }
}
```

**For Windsurf (Codeium):** Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "synter": {
      "command": "npx",
      "args": ["-y", "@synterai/mcp-server@latest"],
      "env": {
        "SYNTER_API_KEY": "syn_your_api_key_here"
      }
    }
  }
}
```

**For Amp:** Add to `.amp/settings.json`:

```json
{
  "mcpServers": {
    "synter": {
      "command": "npx",
      "args": ["-y", "@synterai/mcp-server@latest"],
      "env": {
        "SYNTER_API_KEY": "syn_your_api_key_here"
      }
    }
  }
}
```

**HTTP clients that need a header instead of OAuth** (n8n, Zapier, scripts, other headless clients):

```
URL: https://mcp.synterai.com
Header: X-Synter-Key: syn_your_api_key_here
```

The header is optional; browser OAuth is the default. Works with any MCP client that supports [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) transport.

### 3. Start Using It

Restart your AI client and start chatting.

---

## Prefer a full plugin? (Claude Code / Claude Desktop)

This package is the raw MCP server. If you use **Claude Code** or **Claude Desktop**, the [**Synter plugin**](https://github.com/Synter-Media-AI/plugin) wraps this same server with ready-made skills (`/synter:launch`, `/synter:audience`, `/synter:optimize`, …), specialized agents, and workflow guidance:

```text
/plugin marketplace add Synter-Media-AI/plugin
/plugin install synter@synter
```

It also ships a headless [Claude Agent SDK](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk) runner for automation. See the [plugin repo](https://github.com/Synter-Media-AI/plugin) or the [Claude Plugin guide](https://docs.synterai.com/guides/claude-plugin). Use this MCP package directly when you want just the tools, or are wiring another client.

---

## What Can Your Agent Do?

### 📊 Campaign Management

| Tool | Description |
|------|-------------|
| `list_campaigns` | List campaigns for one ad platform (`platform` is required) |
| `create_search_campaign` | Create a Google Search campaign with keywords and ads |
| `create_display_campaign` | Create a Google Display campaign with images |
| `create_pmax_campaign` | Create a Performance Max campaign |
| `create_meta_campaign` | Create a Facebook/Instagram campaign |
| `create_linkedin_campaign` | Create a LinkedIn campaign for B2B |
| `create_reddit_campaign` | Create a Reddit campaign |
| `pause_campaign` | Pause any campaign |
| `update_campaign_budget` | Change daily budget |

### 📈 Performance & Analytics

| Tool | Description |
|------|-------------|
| `get_performance` | Get impressions, clicks, spend, conversions, ROAS |
| `get_daily_spend` | Daily spend breakdown by platform |

### 🎯 Keywords & Targeting

| Tool | Description |
|------|-------------|
| `add_keywords` | Add keywords to a campaign or ad group |
| `add_negative_keywords` | Block unwanted search terms |

### 🔄 Conversion Tracking

| Tool | Description |
|------|-------------|
| `create_conversion` | Set up a conversion action |
| `list_conversions` | List existing conversion actions |
| `diagnose_tracking` | Check if tracking is installed correctly |

### 🎨 Creative Generation

| Tool | Description |
|------|-------------|
| `generate_image` | AI-generate ad images |
| `generate_video` | AI-generate video ads |
| `upload_image` | Upload images as ad assets |

### 🔧 Utility

| Tool | Description |
|------|-------------|
| `list_ad_accounts` | List all connected ad accounts |
| `run_tool` | Run any of 140+ Synter tools directly |

### Tool names: stdio package vs hosted server

The `npx` package and the hosted server at `https://mcp.synterai.com` name a few equivalent tools differently:

| stdio (`@synterai/mcp-server`) | Hosted (`https://mcp.synterai.com`) |
|------|------|
| `get_performance` (with `platform`) | `pull_<platform>_ads_performance`, e.g. `pull_google_ads_performance`, `pull_meta_ads_performance` |
| `get_daily_spend` | No single hosted tool; use `pull_<platform>_ads_performance` (Google supports `segment: "date"` for per-day rows) |
| `list_ad_accounts` | `list_connected_accounts` |

As of the next hosted release, the hosted server also accepts the stdio names above as aliases, so the same tool calls work against either transport.

---

## No Ads Experience? No Problem.

If you've never run ads before, here's what you need to know:

### What is a Campaign?

A **campaign** is like a project folder. It contains your ads, who sees them, and how much you spend.

```
Campaign: "Q1 Lead Generation"
├── Budget: $50/day
├── Targeting: USA, people searching "project management"
└── Ads: Headlines, descriptions, images
```

### What Platforms Can I Use?

| Platform | Best For | Min Budget |
|----------|----------|------------|
| **Google Ads** | People actively searching for your product | $10/day |
| **Meta (Facebook/Instagram)** | Visual products, broad audiences | $5/day |
| **LinkedIn** | B2B, enterprise, job seekers | $25/day |
| **Reddit** | Niche communities, tech-savvy users | $5/day |
| **Microsoft (Bing)** | Older demographics, B2B | $10/day |
| **TikTok** | Gen Z, entertainment, e-commerce | $20/day |

### Campaign Types Explained

**Search Campaigns:** Your ad shows when someone Googles specific keywords.
- *Example:* Someone searches "best CRM software" → Your ad appears

**Display Campaigns:** Image ads shown across websites and apps.
- *Example:* Banner ad on a news site

**Performance Max (PMax):** Google's AI shows your ads everywhere (Search, YouTube, Display, Gmail, Maps).
- *Example:* Google figures out the best placements for you

**Video Campaigns:** Video ads on YouTube and partner sites.
- *Example:* 15-second ad before a YouTube video

### Common Terms

| Term | What It Means |
|------|---------------|
| **Impressions** | How many times your ad was shown |
| **Clicks** | How many people clicked your ad |
| **CTR** | Click-through rate (clicks ÷ impressions × 100) |
| **CPC** | Cost per click |
| **Conversions** | Desired actions (signups, purchases, etc.) |
| **ROAS** | Return on ad spend (revenue ÷ spend) |

### First Campaign Checklist

Before creating your first campaign, you'll need:

1. ✅ A landing page URL where people will go when they click
2. ✅ An idea of who you want to reach (location, interests)
3. ✅ A daily budget you're comfortable with ($10-50 to start)
4. ✅ Some headlines and descriptions for your ad

**Pro tip:** Start with a Search campaign on Google. It's the easiest to understand and shows ads to people already looking for what you offer.

---

## Example Conversations

### Create Your First Campaign

> **You:** Create a Google Search campaign for my SaaS product. Target people searching for "team collaboration software" and "project management tools". Budget is $25/day. Landing page is https://myapp.com/signup

> **Agent:** I'll create a Search campaign with those keywords. What headlines should I use? Here are some suggestions:
> - "Team Collaboration Made Simple"
> - "Project Management for Modern Teams"
> - "Book a Demo Today"

### Check Performance

> **You:** How are my campaigns doing this week?

> **Agent:** Here's your performance for the last 7 days:
>
> | Campaign | Spend | Clicks | Conversions | ROAS |
> |----------|-------|--------|-------------|------|
> | Brand Search | $142 | 89 | 12 | 4.2x |
> | Competitor Keywords | $98 | 45 | 3 | 1.5x |
> | Display Retargeting | $67 | 234 | 8 | 2.8x |
>
> The "Competitor Keywords" campaign is underperforming. Want me to pause it or adjust the targeting?

### Add Negative Keywords

> **You:** I'm getting clicks for "project management jobs" but we're not hiring. Block those.

> **Agent:** Added "jobs" as a negative keyword to your campaign. This will stop your ads from showing for any search containing "jobs".

### Generate Ad Creative

> **You:** I need a display ad image for a marketing automation product. Dark theme, professional, 1200x628.

> **Agent:** Generating your image...
>
> Created: "Marketing automation dashboard with data visualization on dark background"
> Asset saved and ready to use in your next Display campaign.

---

## Connect Your Ad Accounts

To manage ads on each platform, you'll need to connect your accounts in Synter:

1. Go to [synterai.com/integrations](https://synterai.com/integrations)
2. Click "Connect" next to each platform
3. Complete the OAuth flow
4. Your agent can now manage that platform

See [Supported ad platforms](#supported-ad-platforms) for the 16 with verified write and create and the 27 more available for reads through hosted MCP. Write/create depth varies by platform API.

---

## Advanced: Direct Tool Access

For power users, you can call any of 140+ Synter tools directly:

```
> Use run_tool to call google_ads_list_audiences
```

See the full tool list at [docs.synterai.com/mcp/tools](https://docs.synterai.com/mcp/tools) or ask your agent:

```
> What tools are available for LinkedIn Ads?
```

### Safety and live writes

Client confirmations depend on the client's handling of tool annotations and its settings. Use launch preflight, check workspace spend limits, and verify live changes with readback and the audit log. Use `dry_run: true` where the tool schema supports it to preview a request before execution.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SYNTER_API_KEY` | Yes (stdio) | Your Synter API key, from [synterai.com/developer](https://synterai.com/developer) |
| `SYNTER_API_URL` | No | API base URL override (default `https://synterai.com`) |
| `SYNTER_ARTIFACT_API_URL` | No | Artifact API override used by `stage_audience_artifact` (default `https://api.synterai.com`) |

These apply to the local `npx` server only. The hosted server at `https://mcp.synterai.com` uses browser OAuth and needs no environment variables.

---

## Local Development

```bash
# Clone and install
git clone https://github.com/Synter-Media-AI/mcp-server.git
cd mcp-server
npm install

# Build
npm run build

# Run locally
SYNTER_API_KEY=syn_your_key_here node dist/index.js
```

---

## Troubleshooting

### Browser sign-in didn't open (hosted server)

Most clients open the sign-in page the first time a Synter tool is used. In Codex, run `codex mcp login synter-ads`. If your client can't do a browser sign-in at all, use the `X-Synter-Key` header fallback described in [Local stdio (npx) / API-key fallback](#local-stdio-npx--api-key-fallback).

### "SYNTER_API_KEY not set"

Make sure your API key is in the `env` section of your MCP config. The key should start with `syn_`.

### "Invalid or expired API key"

1. Check that you copied the full key (they're long!)
2. Verify the key is active at [synterai.com/developer](https://synterai.com/developer)
3. Make sure the key has `tools:write` scope

### "No ad accounts connected"

You need to connect at least one ad platform:
1. Go to [synterai.com/integrations](https://synterai.com/integrations)
2. Click "Connect" next to Google Ads (or another platform)
3. Complete the OAuth authorization

### Tools aren't showing in Claude/Cursor

1. Restart your AI client completely (not just refresh)
2. Check the MCP server logs for errors
3. Verify the config file path and JSON syntax

---

## FAQ

### Is there an MCP server for Google Ads?

Yes. Synter supports Google Ads reporting, Search, Display, and Performance Max campaign creation, keywords, budget updates, audience management, and conversion tracking. Google Ads is one of the 16 platforms with verified write and create; write/create depth varies by platform API.

### Can Claude or ChatGPT manage my ad campaigns?

Yes. Add `https://mcp.synterai.com` as a custom connector and complete OAuth 2.1 browser sign-in. Synter reads across 43 ad platforms; 16 have verified write and create, with depth varying by platform API. No API key is needed for hosted access. Clients that only support stdio can use `npx -y @synterai/mcp-server` with `SYNTER_API_KEY`.

---

## Resources

- **Sign up:** [synterai.com/sign-up](https://synterai.com/sign-up)
- **Synter Manual:** [synterai.com/manual](https://synterai.com/manual)
- **Documentation:** [MCP overview](https://docs.synterai.com/mcp/overview)
- **Claude Plugin:** [github.com/Synter-Media-AI/plugin](https://github.com/Synter-Media-AI/plugin) (skills, agents & this MCP for Claude Code / Desktop)
- **Tool Reference:** [docs.synterai.com/mcp/tools](https://docs.synterai.com/mcp/tools)
- **Integrations:** [synterai.com/integrations](https://synterai.com/integrations)
- **Pricing:** [synterai.com/pricing](https://synterai.com/pricing)
- **Support:** [synterai.com/support](https://synterai.com/support) or [GitHub issues](https://github.com/Synter-Media-AI/mcp-server/issues)

---

## About

Synter builds tools for ad operations. Visit [synterai.com/mcp](https://synterai.com/mcp) for hosted MCP access and setup documentation.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  <a href="https://synterai.com/mcp">
    <img src="https://synterai.com/brand/logo-symbol-lime.png" alt="Synter" width="120" />
  </a>
  <br />
  <strong>Open source. MIT licensed. Built for agents that run ads.</strong>
  <br />
  <em>Review what your agent proposes before anything spends.</em>
</p>
