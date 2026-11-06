# YouTube demo script: Synter MCP Server

Draft. Record only against a demo ad account. Title and narration stay on reporting, dry-run previews, and the published price.

## Video details

- **Title:** Synter MCP: ad reports and campaign changes across 30+ platforms
- **Length:** about 3 minutes
- **Style:** screen recording with voiceover
- **Thumbnail:** Synter logo, the hosted URL, and “30+ ad platforms”. No cash or credit-card imagery.

## Intro (0:00–0:20)

**Visual:** https://synterai.com/mcp and the GitHub repo https://github.com/Synter-Media-AI/mcp-server

**Voiceover:**

> Synter is an open-source MCP server for ad reports and approved campaign changes.
>
> It connects Claude, Cursor, ChatGPT, and other MCP clients to 30+ ad platforms.
>
> Reads are free. A verified write is 25 cents, and Synter takes none of the media spend.

## Scene 1 — Connect (0:20–0:55)

**Visual:** MCP client settings. Add a custom connector.

**Action:**

1. Add `https://mcp.synterai.com`.
2. Complete the OAuth sign-in.
3. Optional second shot: local stdio config for clients that cannot use HTTP.

```json
{
  "mcpServers": {
    "synter": {
      "command": "npx",
      "args": ["-y", "@synterai/mcp-server"],
      "env": {
        "SYNTER_API_KEY": "syn_your_key_here"
      }
    }
  }
}
```

Keys are created at https://synterai.com/developer. Say that on screen. Do not show a real key.

**Voiceover:**

> The hosted server is mcp.synterai.com. Sign in in the browser.
>
> If your client only speaks stdio, run the npm package and set SYNTER_API_KEY. There is also a --demo flag that returns sandbox data with no key, and a --read-only flag that removes write tools.

## Scene 2 — A report (0:55–1:40)

**Visual:** A new chat.

**Action:** Ask: “List my Google Ads campaigns and their spend, clicks, and conversions for the last 7 days.” Wait for `list_campaigns` or `get_performance`. Show the table.

**Voiceover:**

> Start with a read. The agent calls list_campaigns or get_performance for one platform. Platform is required; one call does not merge every channel.
>
> Impressions, clicks, spend, conversions, and ROAS come back from the connected account. That read is free.

## Scene 3 — Daily spend and pacing (1:40–2:10)

**Action:** Ask: “Show daily spend for this Google Ads account for the last 14 days, then a pacing report.”

**Voiceover:**

> get_daily_spend is the day-by-day series. pacing_report compares spend with the budget. Same pattern on each platform the account has connected.

## Scene 4 — Preview, then a write (2:10–2:45)

**Action:**

1. Ask for a pause or a budget change with `dry_run: true`.
2. Show the preview payload and that the live account did not change.
3. Only if the demo account is disposable: run the same call without dry_run, then read the campaign back with `list_campaigns`.

**Voiceover:**

> A write is a separate step. dry_run previews the payload and does not change the account.
>
> When you run it live, a verified write is 25 cents. The ad platform still bills the media spend. Confirm the account, the campaign, and the budget before you leave dry_run.

## Scene 5 — Where it runs (2:45–3:10)

**Visual:** README platform table.

**Voiceover:**

> Hosted coverage is 30+ ad platforms. The local package’s platform enum includes Google, Meta, LinkedIn, Microsoft, Reddit, TikTok, X, Pinterest, Snapchat, Spotify, Amazon Ads, Amazon DSP, The Trade Desk, OpenAI Ads, DV360, and StackAdapt.
>
> Creative tools can generate an image or a video. Image providers in the tool schema are Imagen, Flux, and SDXL. Video providers are Veo, Runway, Luma, and Creatify.

## Outro (3:10–3:25)

**Visual:** repo, star button, and these lines on screen.

```text
https://mcp.synterai.com
https://github.com/Synter-Media-AI/mcp-server
https://docs.synterai.com
```

**Voiceover:**

> Synter MCP server. Open source. Link in the description.

## Description

```text
Synter is an open-source MCP server for ad performance reports and approved campaign changes across 30+ ad platforms.

Hosted: https://mcp.synterai.com
Source: https://github.com/Synter-Media-AI/mcp-server
Docs: https://docs.synterai.com
Sign up: https://synterai.com/sign-up
API keys (stdio): https://synterai.com/developer

MCP reads are free. Verified writes are $0.25 each, 0% of ad spend. Ad platforms bill media spend directly. Use dry_run before a live change.

Install the local package:
npx -y @synterai/mcp-server

Timestamps:
0:00 Intro
0:20 Connect
0:55 A report
1:40 Daily spend and pacing
2:10 Preview, then a write
2:45 Platforms
3:10 Outro
```

## Tags

```text
mcp, model context protocol, synter, google ads, meta ads, linkedin ads, advertising, ppc, ad reporting, open source, cursor, claude, chatgpt
```

## Recording checklist

- Demo account only. Hide bookmarks, notifications, and any live customer data.
- 1920x1080, dark mode.
- Run the prompts once before recording so the tool names on screen match this script.
- Blur the API key if the stdio config is shown.
- Speed up waits. Keep the dry-run response on screen long enough to read.
