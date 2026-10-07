# Synter MCP Server

[![npm version](https://img.shields.io/npm/v/@synterai/mcp-server.svg)](https://www.npmjs.com/package/@synterai/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### An open-source MCP server for running ads with AI agents.

Run ads across 16 ad platforms from any MCP client: Google Ads, Microsoft Ads, Meta, LinkedIn, X, Reddit, TikTok, Snapchat, Pinterest, Spotify, Amazon Ads, Amazon DSP, The Trade Desk, OpenAI Ads, Display & Video 360, and StackAdapt. Destructive tools are flagged so your MCP client asks before running them.

Create campaigns. Adjust budgets. Pause underperformers. Generate creatives. Pull performance data. All through natural conversation.

**An open-source [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that lets AI agents read and run your ad accounts, with write tools flagged so your MCP client asks before running them.**

> **Note:** [`Synter-Media-AI/plugin`](https://github.com/Synter-Media-AI/plugin) is the canonical installable Claude plugin repo. The `.claude-plugin/` copy in this repo is not the install source.

---

## Install (hosted, browser sign-in)

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=synter-ads&config=eyJ1cmwiOiJodHRwczovL21jcC5zeW50ZXJhaS5jb20ifQ==)
[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_Synter-0098FF?logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=synter-ads&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.synterai.com%22%7D)

The hosted server lives at **`https://mcp.synterai.com`**. Add it to your client and sign in through your browser the first time you use it (OAuth with dynamic client registration and PKCE, per the MCP authorization spec). No API key to copy, nothing to install locally.

Signup is self-serve at [synterai.com/sign-up](https://synterai.com/sign-up). There is no access review: sign up, connect your ad accounts, and your MCP client can start working.

Synter's canonical domain is **synterai.com**; the hosted MCP endpoint is `https://mcp.synterai.com`.

> **Official packages:** The only official packages are `@synterai/mcp-server`, `@synterai/sdk-js`, PyPI `synter`, crates.io `synter`. `@iflow-mcp/*` copies are unofficial and outdated.

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

## How Synter Compares

The official Google Ads MCP server is read-only by design: per Google's documentation, it is "strictly read-only" and "cannot modify bids, pause campaigns, or create new assets." Most third-party ad MCP servers cover a single platform. We built Synter to do both halves of the job, across every major buying channel, from one server.

| | Synter MCP | Official Google Ads MCP | Typical third-party ad MCPs |
|---|---|---|---|
| **Access** | Read and write across 16 ad platforms | Read-only (current release) | Often read-only or partial write |
| **Platforms** | 16 ad platforms (list below) | Google Ads only | Usually a single platform |
| **Create campaigns** | ✅ Google Search, Display, PMax, Meta, LinkedIn, Reddit, more via `run_tool` | ❌ | Rarely |
| **Budgets and pause** | ✅ | ❌ | Varies |
| **AI creative generation** | ✅ Images, video, copy | ❌ | ❌ |
| **Audience sync** | ✅ Google, Meta, LinkedIn, Microsoft, Reddit, TikTok, X | ❌ | ❌ |
| **Safety** | Write tools annotated as destructive, so clients prompt first | n/a (read-only) | Varies |
| **Open source** | ✅ MIT | ✅ | Varies |

**16 ad platforms:** Google Ads, Microsoft Ads (Bing), Meta (Facebook and Instagram), LinkedIn Ads, X (Twitter) Ads, Reddit Ads, TikTok Ads, Snapchat Ads, Pinterest Ads, Spotify Ads, Amazon Ads (Sponsored Products, Brands, and Display), Amazon DSP, The Trade Desk, OpenAI Ads (ChatGPT), Display & Video 360, and StackAdapt.

Full campaign creation is available on most of them. Display & Video 360 and StackAdapt support write actions (pause, budget and line-item updates, audience upload) without campaign creation. A few retail media networks are also connected for reporting only.

The hosted server at `https://mcp.synterai.com` exposes the full hosted tool set, including performance pulls for every platform above. The `npx` package ships typed tools for the most common operations plus `run_tool` access to the full catalog of 140+ Synter tools.

For registry-style MCP discovery, [`server.json`](./server.json) is the machine-readable source of truth. Keep it aligned with [`package.json`](./package.json), [`manifest.json`](./manifest.json), [`gemini-extension.json`](./gemini-extension.json), and the setup examples in this README.

---

## ⚠️ Fair Warning

Your AI agent will be able to:
- **Create and launch campaigns** that spend real budget once they're live
- **Adjust bids** that affect how much you pay per click
- **Pause campaigns** (sometimes that's a good thing)
- **Add keywords** that change who sees your ads
- **Generate creatives** and upload them to your accounts

Write tools are annotated as destructive, so MCP clients prompt before running them. But still, maybe don't give this to an agent you just met.

---

## Local stdio (npx) / API-key fallback

Use this when your client only speaks stdio, or when you run headless and can't complete a browser sign-in.

### 1. Get Your API Key

Sign up at [synterai.com/sign-up](https://synterai.com/sign-up). Your API key is created automatically; you can view it or create more in [Developer Settings](https://synterai.com/developer).

### 2. Configure Your AI Client

**For Claude Desktop:** Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "synter": {
      "command": "npx",
      "args": ["@synterai/mcp-server"],
      "env": {
        "SYNTER_API_KEY": "syn_your_api_key_here"
      }
    }
  }
}
```

**For Cursor:** Add to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "synter": {
      "command": "npx",
      "args": ["@synterai/mcp-server"],
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
      "args": ["@synterai/mcp-server"],
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

This package is the raw MCP server. If you use **Claude Code** or **Claude Desktop**, the [**Synter plugin**](https://github.com/Synter-Media-AI/plugin) wraps this same server with ready-made skills (`/synter:launch`, `/synter:audience`, `/synter:optimize`, …), specialized agents, and an approval-before-spend safety hook:

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
| `list_campaigns` | List campaigns across all connected platforms |
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

1. Go to [synterai.com/settings/credentials](https://synterai.com/settings/credentials)
2. Click "Connect" next to each platform
3. Complete the OAuth flow
4. Your agent can now manage that platform

**Supported ad platforms (16; ✅ = reporting + full campaign creation, ✏️ = reporting + write actions without campaign creation):**
- Google Ads ✅
- Microsoft Ads (Bing) ✅
- Meta (Facebook/Instagram) ✅
- LinkedIn Ads ✅
- X (Twitter) Ads ✅
- Reddit Ads ✅
- TikTok Ads ✅
- Snapchat Ads ✅
- Pinterest Ads ✅
- Spotify Ads ✅
- Amazon Ads ✅
- Amazon DSP ✅
- The Trade Desk ✅
- OpenAI Ads (ChatGPT) ✅
- Display & Video 360 ✏️
- StackAdapt ✏️

A few retail media networks are also connected for reporting only.

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

### Safety: Confirmations Happen in Your Client

Every write tool, including the universal `execute` tool, is annotated as destructive, so MCP clients that honor annotations (Claude, Cursor, ChatGPT) ask you before running it. `execute` runs immediately by default; pass `dry_run: true` to validate a request without running it. Server-side, Synter checks plan entitlement, account holds, and a payment method on file before campaign writes. It does not add a second approval step, so for anything that spends money, approve only what the account owner wants.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SYNTER_API_KEY` | Yes (stdio) | Your Synter API key, from [synterai.com/developer](https://synterai.com/developer) |
| `SYNTER_API_URL` | No | API base URL override (defaults to the hosted Synter API) |

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
1. Go to [synterai.com/settings/credentials](https://synterai.com/settings/credentials)
2. Click "Connect" next to Google Ads (or another platform)
3. Complete the OAuth authorization

### Tools aren't showing in Claude/Cursor

1. Restart your AI client completely (not just refresh)
2. Check the MCP server logs for errors
3. Verify the config file path and JSON syntax

---

## FAQ

### Is there an MCP server for Google Ads?

Yes, two kinds. Google ships an official Google Ads MCP server, which is read-only in its current release: it can query reports, metrics, and metadata, but per Google's documentation it "cannot modify bids, pause campaigns, or create new assets." Our MCP server covers Google Ads with both read and write: create Search, Display, and Performance Max campaigns, add keywords and negative keywords, adjust budgets, pause campaigns, manage Customer Match audiences, set up conversion tracking, and pull performance data. Google Ads is one of 16 ad platforms the same server covers, with full campaign creation on most of them.

### Can Claude or ChatGPT manage my ad campaigns?

Yes. With the Synter MCP server connected, Claude (Claude Desktop, Claude Code), ChatGPT, Cursor, and any other MCP-compatible client can create campaigns, adjust budgets, pause underperformers, generate creatives, and sync audiences, and pull performance data across 16 ad platforms. Add the hosted server at `https://mcp.synterai.com` and sign in through your browser (OAuth); in Claude.ai and ChatGPT it's a custom connector with that URL. Signup is self-serve at [synterai.com/sign-up](https://synterai.com/sign-up). Clients that only speak stdio can run `npx @synterai/mcp-server` with a `SYNTER_API_KEY`, and headless HTTP clients can send an optional `X-Synter-Key` header instead of signing in. Destructive tools are flagged so your client asks for confirmation before running them.

### What is the difference between the official Google Ads MCP and Synter?

Two things: write access and platform coverage. The official Google Ads MCP is read-only in its current release and covers Google Ads only. Synter covers 16 ad platforms, with full campaign creation on most of them, including Google Ads, Meta, LinkedIn, Microsoft, TikTok, Amazon Ads, Amazon DSP, OpenAI Ads, and The Trade Desk. If you only need Google Ads reporting, the official server is a solid choice. If you want an agent that can act on what it finds, on Google and everywhere else you advertise, that is what we built Synter for.

---

## Resources

- **Sign up:** [synterai.com/sign-up](https://synterai.com/sign-up)
- **Synter Manual:** [synterai.com/manual](https://synterai.com/manual)
- **Documentation:** [docs.synterai.com](https://docs.synterai.com)
- **Claude Plugin:** [github.com/Synter-Media-AI/plugin](https://github.com/Synter-Media-AI/plugin) (skills, agents & this MCP for Claude Code / Desktop)
- **Tool Reference:** [docs.synterai.com/mcp/tools](https://docs.synterai.com/mcp/tools)
- **MCP Server Comparison:** [synterai.com/blog/best-ad-platform-mcp-servers](https://synterai.com/blog/best-ad-platform-mcp-servers)
- **Support:** [synterai.com/support](https://synterai.com/support) or [GitHub issues](https://github.com/Synter-Media-AI/mcp-server/issues)

---

## About

Synter (synterai.com, formerly syntermedia.ai), the AI ad-operations company, is not affiliated with synter.ai, Synter Resource Group (synter.com), Synterra Media, or Synternet.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  <a href="https://synterai.com">
    <img src="https://synterai.com/brand/logo-symbol-lime.png" alt="Synter" width="120" />
  </a>
  <br />
  <strong>Open source. MIT licensed. Built for agents that run ads.</strong>
  <br />
  <em>Review what your agent proposes before anything spends.</em>
</p>
