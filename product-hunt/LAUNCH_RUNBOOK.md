# 🚀 Product Hunt Launch Runbook — Synter MCP Server

**Launch Date:** Tuesday, March 10, 2026 at 12:01 AM PST  
**Demo Video:** https://www.youtube.com/watch?v=mgKwsLxRgN8  
**PH Upcoming Page:** https://www.producthunt.com/products/synter-media-ai  
**Promo Code:** PRODUCTHUNT (2,000 bonus credits)

---

## ⏰ Timeline

| When | Action |
|------|--------|
| **March 7 (Fri)** | Schedule PH launch for March 10 |
| **March 8 (Sat)** | Run promo code SQL on production |
| **March 9 (Sun)** | Upload email template to Loops.so |
| **March 9 5:00 PM PST** | Start outreach script (Wave 1: APAC) |
| **March 9 9:00 PM PST** | Wave 2: Europe (auto via script) |
| **March 9 11:00 PM PST** | Wave 3: US (auto via script) |
| **March 10 12:01 AM PST** | 🚀 LAUNCH! Post first comment |
| **March 10 12:05 AM** | Launch tweets fire (auto via script) |
| **March 10 morning** | Send user broadcast, post on HN/Reddit/LinkedIn |
| **March 10 all day** | Monitor & respond to every comment |

---

## 📋 Pre-Launch (March 7–9)

### 1. Schedule PH Launch

Go to https://www.producthunt.com/posts/new and fill in:

| Field | Value |
|-------|-------|
| Product Name | Synter MCP Server |
| Tagline | Give your AI agent a credit card for ad campaigns |
| URL | https://syntermedia.ai/mcp |
| Description | *(copy from PRODUCT_HUNT.md)* |
| Tags | AI Agents, Marketing automation platforms, Engineering & Development |
| Thumbnail | `product-hunt/thumbnail-240x240.png` |
| Gallery | `product-hunt/gallery-{1..6}-*.png` (1270x760) |
| Video | https://www.youtube.com/watch?v=mgKwsLxRgN8 |
| Pricing | Paid (with a free plan) |
| Shoutouts | Anthropic (Claude + MCP), Amp (Sourcegraph), Cursor, Nango |
| Makers | Joel Horwitz (@joelhorwitz) |
| Promo Code | PRODUCTHUNT — 2,000 bonus credits |
| Schedule | March 10, 2026 at 12:01 AM PST |

**After scheduling, copy the PH link** (e.g., `https://www.producthunt.com/posts/synter-mcp-server`) and update:

```bash
# Update the notification file with real PH URL
# Edit: apps/web/src/lib/notifications/product-hunt-launch.ts
# Change: product_hunt_url: "(to be filled with actual PH link)"
# To:     product_hunt_url: "https://www.producthunt.com/posts/synter-mcp-server"
```

### 2. Run Promo Code SQL (March 8)

```bash
doppler run --config prd -- psql $DATABASE_URL -f scripts/create-producthunt-promo.sql
```

Verify:
```bash
doppler run --config prd -- psql $DATABASE_URL -c "SELECT code, credits, expires_at, is_active FROM promo_codes WHERE code = 'PRODUCTHUNT'"
```

### 3. Upload Email Template to Loops.so (March 9)

1. Open https://app.loops.so
2. Go to **Transactional** → **New Template**
3. Copy compiled HTML from `apps/web/email-templates/product-hunt-launch/index.mjml`
   - Compile MJML → HTML at https://mjml.io/try-it-live or `npx mjml index.mjml`
4. Name it: `product_hunt_launch`
5. Set variables: `{{firstName}}`, `{{product_hunt_url}}`, `{{promo_code}}`
6. Send test to joel@syntermedia.ai
7. Note the transactional template ID
8. Update Doppler: `doppler secrets set LOOPS_PH_LAUNCH_TEMPLATE_ID=<template-id> --config prd`

### 4. Verify Credentials (March 9)

```bash
# Validate all credentials (X API, Loops, DB) in one command
pnpm ph:validate

# Or dry-run the entire pipeline end-to-end
pnpm ph:launch:dry
```

---

## 🌊 Launch Eve — Monday, March 9, 5:00 PM PST

### Start Outreach Script

```bash
# Full run (all 3 waves with automatic delays)
pnpm ph:outreach

# Or run individual waves manually:
pnpm ph:outreach:wave apac     # 5:00 PM PST
pnpm ph:outreach:wave europe   # 9:00 PM PST
pnpm ph:outreach:wave us       # 11:00 PM PST
```

The script sends personalized tweets to 15 targets across 3 timezone waves:
- **APAC (5 targets):** Nika, Moeez, Ica, Joy, Roozbeh
- **Europe (4 targets):** fmerian, Artem, Erliza, Daniel Popa
- **US (6 targets):** Chris Messina, Quinn Slack, Gabe Perez, Ken Savage, Xiangkai Zeng, Cruise Chen

After all waves, it posts the launch announcement tweet + follow-up thread.

---

## 🚀 Launch Day — Tuesday, March 10

### 12:01 AM PST — Launch Goes Live

1. **Verify** the PH page is live
2. **Post first comment** (maker comment from PRODUCT_HUNT.md) — this is CRITICAL for engagement
3. Launch tweets should auto-fire from the outreach script

### 12:15 AM PST — Share Everywhere

**X (@SynterMedia):**
Already handled by outreach script (launch_announcement, thread_1-3 tweets).

**LinkedIn (Joel Horwitz):**
Post from `product-hunt/SOCIAL_POSTS.md` → LinkedIn section.
Replace `[link]` and `[PH link]` with actual PH URL.

**Hacker News:**
Post from `product-hunt/SOCIAL_POSTS.md` → Hacker News section.
URL: https://news.ycombinator.com/submit

**Reddit:**
Post to r/ClaudeAI, r/MCP, r/PPC from `product-hunt/SOCIAL_POSTS.md` → Reddit section.

### Morning — Send User Broadcast

```bash
# Option A: Via master script (handles auth automatically)
pnpm ph:broadcast:dry   # Preview recipients
pnpm ph:broadcast        # Send for real

# Option B: Via curl (requires session cookie)
curl -X POST https://syntermedia.ai/api/admin/broadcast/product-hunt \
  -H 'Content-Type: application/json' \
  -H 'Cookie: synter_session=<YOUR_SESSION_COOKIE>' \
  -d '{"dryRun": true}'
```

### All Day — Monitor & Engage

1. **Respond to EVERY comment** within minutes (upvotes come from engagement)
2. **Monitor** at https://hunted.space for ranking
3. **Share milestone updates** on X:
   ```
   [X] upvotes in [Y] hours on @ProductHunt 🙏
   If you manage ad campaigns across multiple platforms, this is for you.
   → [PH link]
   ```

---

## 📦 Post-Launch (March 11+)

- [ ] Thank commenters personally on PH
- [ ] Write "behind the scenes" LinkedIn post with metrics
- [ ] Update blog post with PH badge if ranked
- [ ] Add PH badge to syntermedia.ai/mcp page
- [ ] Record final upvote count and ranking

---

## 🛠 Troubleshooting

### X API Rate Limits
The outreach script has a 3-minute delay between tweets. If rate-limited:
```bash
# Resume from a specific wave
pnpm ph:outreach:wave us
```

### Loops Email Fails
Check: `doppler secrets get LOOPS_API_KEY LOOPS_PH_LAUNCH_TEMPLATE_ID --config prd`

### Outreach Script Crashes
Re-run just the remaining wave(s) — sent tweets won't be duplicated (Twitter rejects exact duplicates).

### Launch Tweets Only
```bash
pnpm ph:launch-tweets       # Send launch tweets
pnpm ph:launch-tweets:dry   # Preview first
```

---

## 🎯 Quick Command Reference

| Command | What It Does |
|---------|-------------|
| `pnpm ph:validate` | Validate X API, Loops, DB credentials |
| `pnpm ph:launch:dry` | Dry-run entire pipeline (preview everything) |
| `pnpm ph:launch` | 🚀 Execute full pipeline (credentials → promo → outreach → tweets → broadcast) |
| `pnpm ph:outreach:dry` | Preview all outreach messages |
| `pnpm ph:outreach` | Send all 3 outreach waves with timed delays |
| `pnpm ph:outreach:wave apac` | Send only APAC wave |
| `pnpm ph:outreach:wave europe` | Send only Europe wave |
| `pnpm ph:outreach:wave us` | Send only US wave |
| `pnpm ph:launch-tweets:dry` | Preview launch tweets |
| `pnpm ph:launch-tweets` | Post launch announcement + thread |
| `pnpm ph:broadcast:dry` | Preview broadcast recipients |
| `pnpm ph:broadcast` | Email all Synter users about the launch |

---

## 📁 Asset Inventory

| Asset | Location | Status |
|-------|----------|--------|
| Thumbnail (240x240) | `product-hunt/thumbnail-240x240.png` | ✅ Ready |
| Gallery 1 — Hero | `product-hunt/gallery-1-hero.png` | ✅ Ready |
| Gallery 2 — Comparison | `product-hunt/gallery-2-comparison.png` | ✅ Ready |
| Gallery 3 — CTA | `product-hunt/gallery-3-cta.png` | ✅ Ready |
| Gallery 4 — Setup Steps | `product-hunt/gallery-4-setup-steps.png` | ✅ Ready |
| Gallery 5 — Platform Coverage | `product-hunt/gallery-5-platform-coverage.png` | ✅ Ready |
| Gallery 6 — Tool Categories | `product-hunt/gallery-6-tool-categories.png` | ✅ Ready |
| Demo Video | https://www.youtube.com/watch?v=mgKwsLxRgN8 | ✅ Uploaded |
| First Comment | `PRODUCT_HUNT.md` → First Comment section | ✅ Written |
| Social Posts | `product-hunt/SOCIAL_POSTS.md` | ✅ Written |
| Outreach Script | `scripts/ph-launch-outreach.ts` | ✅ Ready |
| Promo Code SQL | `scripts/create-producthunt-promo.sql` | ✅ Ready |
| Email Template | `email-templates/product-hunt-launch/index.mjml` | ✅ Ready |
| Broadcast API | `POST /api/admin/broadcast/product-hunt` | ✅ Deployed |
