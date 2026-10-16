# YouTube Video Script: Synter MCP Server Demo

## Video Details
- **Title:** The MCP Extension Claude Doesn't Want You to Use (AI Agents Managing Real Ad Budgets)
- **Duration:** 3-4 minutes
- **Style:** Screen recording with voiceover
- **Thumbnail:** Claude logo + money/credit card + "AI can spend your $$$"

---

## INTRO (0:00 - 0:20)

**VISUAL:** GitHub repo page for synter-mcp-server

**VOICEOVER:**
> "What happens when you give an AI agent access to your ad budgets?
>
> Not just read access. Full control. Create campaigns. Adjust bids. Spend real money.
>
> This is Synter—the MCP extension that turns Claude into a media buyer."

---

## SCENE 1: The Setup (0:20 - 1:00)

**VISUAL:** syntermedia.ai/developer page

**ACTION:**
1. Show the developer portal
2. Click "Create API Key"
3. Name it "Claude Desktop"
4. Copy the key (show the syn_xxx format)

**VOICEOVER:**
> "Setup takes about 60 seconds. First, get your API key from syntermedia.ai/developer.
>
> This key connects Claude to your ad accounts across Google, Meta, LinkedIn, Reddit, TikTok, and more."

**VISUAL:** Claude Desktop config file

**ACTION:**
1. Open `~/Library/Application Support/Claude/claude_desktop_config.json`
2. Show the config being added:
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
3. Save and restart Claude Desktop

**VOICEOVER:**
> "Add this to your Claude Desktop config. One restart, and you're connected."

---

## SCENE 2: First Command (1:00 - 1:45)

**VISUAL:** Claude Desktop - fresh conversation

**ACTION:**
1. Type: "Show me all my Google Ads campaigns and their performance this week"
2. Wait for Claude to call the tool
3. Show the response with campaign data

**VOICEOVER:**
> "Let's start simple. 'Show me all my Google Ads campaigns.'
>
> Claude calls the Synter API, pulls your campaign data, and shows you performance metrics.
>
> Impressions, clicks, spend, conversions, ROAS—all in one response."

**VISUAL:** Highlight the campaign performance table

---

## SCENE 3: Taking Action (1:45 - 2:30)

**VISUAL:** Continue in Claude Desktop

**ACTION:**
1. Type: "Pause the campaign with the lowest ROAS"
2. Show Claude identifying the worst performer
3. Show the confirmation message
4. Show Claude executing the pause

**VOICEOVER:**
> "Now let's do something real. 'Pause the campaign with the lowest ROAS.'
>
> Claude identifies the underperformer, confirms the action, and pauses it.
>
> This is actually happening in your Google Ads account. Real changes. Real impact."

**ACTION:**
1. Type: "Add 'project management software' as a keyword to my best performing campaign"
2. Show the keyword being added

**VOICEOVER:**
> "Add keywords. Adjust budgets. Create new campaigns. All through conversation."

---

## SCENE 4: Cross-Platform (2:30 - 3:00)

**VISUAL:** Claude Desktop

**ACTION:**
1. Type: "What's my total spend across all platforms this month?"
2. Show Claude pulling data from multiple platforms
3. Display a summary table

**VOICEOVER:**
> "But here's where it gets interesting. Synter works across platforms.
>
> Google, Meta, LinkedIn, Reddit, TikTok, Microsoft, StackAdapt, The Trade Desk.
>
> One question. Every platform. One answer."

**VISUAL:** Show the multi-platform spend breakdown

---

## SCENE 5: Creative Generation (3:00 - 3:30)

**VISUAL:** Claude Desktop

**ACTION:**
1. Type: "Generate a display ad image for a B2B SaaS product. Dark theme, professional, 1200x628."
2. Show Claude calling the image generation tool
3. Display the generated image

**VOICEOVER:**
> "Claude can also generate creatives. This uses Imagen, Flux, or SDXL under the hood.
>
> 'Generate a display ad for my SaaS product.' Done.
>
> Upload it directly to your ad accounts."

---

## SCENE 6: The Warning (3:30 - 3:45)

**VISUAL:** README "Fair Warning" section

**VOICEOVER:**
> "Fair warning: your AI agent can now spend real money.
>
> We built in confirmations for destructive actions. But still—maybe don't give this to an agent you just met."

---

## OUTRO (3:45 - 4:00)

**VISUAL:** GitHub repo with star button highlighted

**VOICEOVER:**
> "Synter MCP Server. Open source. Free to use.
>
> Get your API key at syntermedia.ai. Install in 60 seconds.
>
> Link in the description."

**TEXT OVERLAY:**
```
github.com/Synter-Media-AI/mcp-server
syntermedia.ai/developer

⭐ Star if this terrifies you (in a good way)
```

---

## B-ROLL SUGGESTIONS

- Quick cuts of different ad platform dashboards (Google Ads, Meta, LinkedIn)
- Terminal showing the MCP server starting
- Split screen: Claude Desktop on left, Google Ads dashboard on right showing changes
- The Synter logo animation

---

## DESCRIPTION

```
The MCP extension Claude doesn't want you to use.

Because once you install it, your AI agent can spend real money.

Synter MCP Server lets Claude, Cursor, and other AI assistants manage ad campaigns across:
• Google Ads
• Meta (Facebook/Instagram)
• LinkedIn Ads
• Microsoft Ads
• Reddit Ads
• TikTok Ads
• StackAdapt
• The Trade Desk

Create campaigns. Adjust budgets. Add keywords. Pause underperformers. Generate creatives.

All through natural conversation.

🔗 LINKS:
GitHub: https://github.com/Synter-Media-AI/mcp-server
Get API Key: https://syntermedia.ai/developer
Documentation: https://syntermedia.ai/manual

📦 INSTALL:
npx -y @synterai/mcp-server

⏱️ TIMESTAMPS:
0:00 - Intro
0:20 - Setup (60 seconds)
1:00 - First Command
1:45 - Taking Action
2:30 - Cross-Platform
3:00 - Creative Generation
3:30 - Fair Warning
3:45 - Outro

#AI #Claude #MCP #Advertising #GoogleAds #Marketing #OpenSource
```

---

## TAGS

```
mcp, model context protocol, claude, anthropic, ai agents, google ads, meta ads, linkedin ads, advertising, ppc, digital marketing, ai marketing, automation, open source, cursor, amp, ai assistant, chatgpt alternative, marketing automation, ad management
```

---

## THUMBNAIL OPTIONS

1. **Shock value:** Claude logo + pile of money + "AI SPENDING YOUR $$$"
2. **Curiosity:** "The MCP Extension They Don't Want You to Use" with redacted text
3. **Demo style:** Split screen Claude + Google Ads with arrow between them
4. **Minimal:** Synter logo + "AI → Ads" with glowing effect

---

## RECORDING CHECKLIST

Before recording:
- [ ] Clean desktop, hide personal bookmarks
- [ ] Use demo account with realistic but safe data
- [ ] Test all commands work before recording
- [ ] Have Claude Desktop config ready to paste
- [ ] Dark mode everything
- [ ] 1920x1080 resolution
- [ ] Hide notifications

During recording:
- [ ] Speak slowly and clearly
- [ ] Pause after each action for editing
- [ ] Show cursor movements deliberately
- [ ] Wait for API responses (don't cut too early)

After recording:
- [ ] Add subtle background music
- [ ] Add text overlays for key points
- [ ] Speed up waiting periods (2x)
- [ ] Add chapter markers
