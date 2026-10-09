/**
 * Synter MCP Server - Demo Sandbox Mode
 *
 * Provides realistic, zero-credential mock data for all 25 tools
 * across Google, Meta, LinkedIn, Microsoft, Reddit, TikTok, and X.
 *
 * Allows developers and evaluators to test agent workflows in < 60 seconds
 * without needing an API key, credit card, or connected ad accounts.
 */

export const DEMO_BANNER_NOTICE =
  "DEMO SANDBOX DATA: Running in zero-credential demo mode. Connect real ad accounts at https://synterai.com/settings/integrations";

export interface SandboxResponse extends Record<string, unknown> {
  sandbox: true;
  notice: string;
}

/**
 * Checks if demo sandbox mode is enabled via CLI flag or environment variable.
 */
export function isDemoMode(
  env: NodeJS.ProcessEnv = process.env,
  argv: string[] = process.argv
): boolean {
  return (
    env.SYNTER_DEMO === "true" ||
    env.SYNTER_DEMO === "1" ||
    argv.includes("--demo")
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Realistic Platform-Specific Sandbox Campaigns
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_CAMPAIGNS: Record<string, Array<Record<string, unknown>>> = {
  google: [
    {
      campaign_id: "demo-google-101",
      campaign_name: "Search - High-Intent Core Keywords",
      status: "ENABLED",
      daily_budget: 150.0,
      impressions: 42300,
      clicks: 1840,
      conversions: 89,
      cost: 1104.0,
      ctr: 0.0435,
      cpc: 0.6,
      cpa: 12.4,
      bidding_strategy: "MAXIMIZE_CONVERSIONS",
    },
    {
      campaign_id: "demo-google-102",
      campaign_name: "PMax - Developer & Enterprise Scale",
      status: "ENABLED",
      daily_budget: 250.0,
      impressions: 115000,
      clicks: 3420,
      conversions: 142,
      cost: 2150.0,
      ctr: 0.0297,
      cpc: 0.63,
      cpa: 15.14,
      bidding_strategy: "MAXIMIZE_CONVERSIONS",
    },
    {
      campaign_id: "demo-google-103",
      campaign_name: "Retargeting - Demo Form Bouncers",
      status: "PAUSED",
      daily_budget: 50.0,
      impressions: 18200,
      clicks: 410,
      conversions: 28,
      cost: 320.0,
      ctr: 0.0225,
      cpc: 0.78,
      cpa: 11.43,
      bidding_strategy: "TARGET_CPA",
    },
  ],
  meta: [
    {
      campaign_id: "demo-meta-201",
      campaign_name: "Reels & Stories - Vector Architecture Visual",
      status: "ENABLED",
      daily_budget: 200.0,
      impressions: 89400,
      clicks: 2120,
      conversions: 94,
      cost: 1400.0,
      ctr: 0.0237,
      cpc: 0.66,
      cpa: 14.89,
      roas: 3.42,
    },
    {
      campaign_id: "demo-meta-202",
      campaign_name: "Founder Journey - In-Feed Video",
      status: "ENABLED",
      daily_budget: 100.0,
      impressions: 45000,
      clicks: 980,
      conversions: 39,
      cost: 700.0,
      ctr: 0.0218,
      cpc: 0.71,
      cpa: 17.95,
      roas: 2.85,
    },
  ],
  linkedin: [
    {
      campaign_id: "demo-li-301",
      campaign_name: "B2B VP Marketing & Growth Engineers",
      status: "ENABLED",
      daily_budget: 300.0,
      impressions: 22400,
      clicks: 430,
      conversions: 31,
      cost: 2100.0,
      ctr: 0.0192,
      cpc: 4.88,
      cpa: 67.74,
    },
  ],
  microsoft: [
    {
      campaign_id: "demo-ms-401",
      campaign_name: "Bing Search - B2B Competitor Alternatives",
      status: "ENABLED",
      daily_budget: 75.0,
      impressions: 14200,
      clicks: 610,
      conversions: 22,
      cost: 450.0,
      ctr: 0.043,
      cpc: 0.74,
      cpa: 20.45,
    },
  ],
  reddit: [
    {
      campaign_id: "demo-reddit-501",
      campaign_name: "r/programming & r/datascience - MCP Showcase",
      status: "ENABLED",
      daily_budget: 50.0,
      impressions: 62000,
      clicks: 1250,
      conversions: 44,
      cost: 350.0,
      ctr: 0.0202,
      cpc: 0.28,
      cpa: 7.95,
    },
  ],
  tiktok: [
    {
      campaign_id: "demo-tt-601",
      campaign_name: "UGC Dev Experience & Agent Demo",
      status: "ENABLED",
      daily_budget: 100.0,
      impressions: 140000,
      clicks: 2800,
      conversions: 85,
      cost: 700.0,
      ctr: 0.02,
      cpc: 0.25,
      cpa: 8.24,
    },
  ],
  x: [
    {
      campaign_id: "demo-x-701",
      campaign_name: "Tech Founders & AI Engineers Launch",
      status: "ENABLED",
      daily_budget: 80.0,
      impressions: 78000,
      clicks: 1650,
      conversions: 52,
      cost: 560.0,
      ctr: 0.0212,
      cpc: 0.34,
      cpa: 10.77,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Sandbox Dispatcher
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns deterministic, high-fidelity sandbox data for any tool request.
 */
export function getSandboxToolResult(
  name: string,
  args: Record<string, unknown>
): SandboxResponse {
  const platform = String(args.platform || "google").toLowerCase();

  switch (name) {
    case "list_campaigns": {
      const allCampaigns = DEMO_CAMPAIGNS[platform] || DEMO_CAMPAIGNS.google;
      const statusFilter = typeof args.status === "string" ? args.status.toUpperCase() : null;
      const filtered = statusFilter
        ? allCampaigns.filter((c) => c.status === statusFilter)
        : allCampaigns;

      const limit = typeof args.limit === "number" ? args.limit : 50;

      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        platform,
        total_campaigns: filtered.length,
        campaigns: filtered.slice(0, limit),
      };
    }

    case "get_performance": {
      const campaigns = DEMO_CAMPAIGNS[platform] || DEMO_CAMPAIGNS.google;
      const totalSpend = campaigns.reduce((acc, c) => acc + (Number(c.cost) || 0), 0);
      const totalClicks = campaigns.reduce((acc, c) => acc + (Number(c.clicks) || 0), 0);
      const totalImpressions = campaigns.reduce((acc, c) => acc + (Number(c.impressions) || 0), 0);
      const totalConversions = campaigns.reduce((acc, c) => acc + (Number(c.conversions) || 0), 0);
      const avgCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
      const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
      const avgCpa = totalConversions > 0 ? totalSpend / totalConversions : 0;

      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        platform,
        date_range: args.date_range || "LAST_7_DAYS",
        summary: {
          total_spend_usd: Number(totalSpend.toFixed(2)),
          total_impressions: totalImpressions,
          total_clicks: totalClicks,
          total_conversions: totalConversions,
          ctr: Number(avgCtr.toFixed(4)),
          cpc: Number(avgCpc.toFixed(2)),
          cpa: Number(avgCpa.toFixed(2)),
          roas: 3.15,
        },
        campaigns,
      };
    }

    case "get_daily_spend": {
      const days = [
        { date: "2026-10-03", spend: 412.5, impressions: 24500, clicks: 610, conversions: 24 },
        { date: "2026-10-04", spend: 435.0, impressions: 26100, clicks: 640, conversions: 27 },
        { date: "2026-10-05", spend: 510.2, impressions: 31200, clicks: 780, conversions: 33 },
        { date: "2026-10-06", spend: 489.0, impressions: 29800, clicks: 740, conversions: 30 },
        { date: "2026-10-07", spend: 495.5, impressions: 30400, clicks: 765, conversions: 32 },
        { date: "2026-10-08", spend: 530.0, impressions: 33100, clicks: 820, conversions: 36 },
        { date: "2026-10-09", spend: 381.8, impressions: 23900, clicks: 535, conversions: 21 },
      ];

      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        platform,
        period: "LAST_7_DAYS",
        daily_records: days,
        total_period_spend: 3254.0,
      };
    }

    case "list_ad_accounts": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        platform,
        accounts: [
          {
            account_id: `demo-${platform}-acc-01`,
            account_name: `Demo Primary ${platform.toUpperCase()} Account`,
            currency: "USD",
            timezone: "America/New_York",
            status: "ACTIVE",
          },
          {
            account_id: `demo-${platform}-acc-02`,
            account_name: `Demo Secondary Growth Account`,
            currency: "USD",
            timezone: "America/New_York",
            status: "ACTIVE",
          },
        ],
      };
    }

    case "diagnose_tracking": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        url: args.url || "https://synterai.com",
        gtm_detected: true,
        gtm_container_id: "GTM-DEMO001",
        gtag_detected: true,
        conversion_pixels: [
          { platform: "google", status: "ACTIVE", id: "AW-5759537962" },
          { platform: "meta", status: "ACTIVE", id: "25935306396076686" },
          { platform: "linkedin", status: "ACTIVE", id: "511437086" },
        ],
        issues_found: 0,
        recommendations: ["Tracking setup is complete and ready for live conversions."],
      };
    }

    case "list_landing_pages": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        landing_pages: [
          {
            page_id: "lp_demo_01",
            title: "Autonomous Ad Infrastructure - Get Started",
            url: "https://synterai.com/demo",
            status: "PUBLISHED",
            views: 14200,
            conversions: 840,
            conversion_rate: 0.0592,
          },
          {
            page_id: "lp_demo_02",
            title: "Synter vs Pipeboard Comparison",
            url: "https://synter.dev/vs/pipeboard",
            status: "PUBLISHED",
            views: 8900,
            conversions: 512,
            conversion_rate: 0.0575,
          },
        ],
      };
    }

    case "list_conversions": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        platform,
        conversions: [
          { id: "conv_01", name: "Demo Request Submitted", category: "LEAD", count_last_30d: 142 },
          { id: "conv_02", name: "MCP Copied / Installed", category: "SIGNUP", count_last_30d: 840 },
          { id: "conv_03", name: "Scale Plan Upgrade", category: "PURCHASE", count_last_30d: 28 },
        ],
      };
    }

    // ── Simulated Mutations ──

    case "create_search_campaign": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        campaign_id: "demo-google-search-9001",
        campaign_name: args.campaign_name || "Demo Search Campaign",
        status: "PAUSED",
        daily_budget: args.daily_budget || 50.0,
        headlines_submitted: Array.isArray(args.headlines) ? args.headlines.length : 15,
        descriptions_submitted: Array.isArray(args.descriptions) ? args.descriptions.length : 4,
        keywords_submitted: Array.isArray(args.keywords) ? args.keywords.length : 10,
        resource_name: "customers/5759537962/campaigns/demo-google-search-9001",
        message:
          "[Sandbox] Google Ads Search campaign created in PAUSED state. No real ad spend was incurred.",
      };
    }

    case "create_pmax_campaign":
    case "create_display_campaign": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        campaign_id: `demo-${platform}-pmax-9002`,
        campaign_name: args.campaign_name || `Demo ${platform.toUpperCase()} Campaign`,
        status: "PAUSED",
        daily_budget: args.daily_budget || 100.0,
        resource_name: `customers/5759537962/campaigns/demo-${platform}-9002`,
        message: `[Sandbox] ${name} executed successfully in simulation mode.`,
      };
    }

    case "create_meta_campaign":
    case "create_linkedin_campaign":
    case "create_reddit_campaign": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        campaign_id: `demo-${platform}-cmp-8801`,
        campaign_name: args.campaign_name || `Demo ${platform.toUpperCase()} Campaign`,
        status: "PAUSED",
        daily_budget: args.daily_budget || 100.0,
        message: `[Sandbox] ${name} executed successfully in simulation mode.`,
      };
    }

    case "pause_campaign": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        campaign_id: args.campaign_id || "demo-cmp-1001",
        platform,
        status: "PAUSED",
        previous_status: "ENABLED",
        message: `[Sandbox] Campaign ${args.campaign_id || "demo-cmp-1001"} paused successfully.`,
      };
    }

    case "update_campaign_budget": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        campaign_id: args.campaign_id || "demo-cmp-1001",
        platform,
        new_daily_budget: args.daily_budget || 100.0,
        message: `[Sandbox] Daily budget updated to $${args.daily_budget || 100.0} USD.`,
      };
    }

    case "add_keywords":
    case "add_negative_keywords": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        campaign_id: args.campaign_id || "demo-cmp-1001",
        keywords_added: args.keywords || ["demo keyword 1", "demo keyword 2"],
        match_type: args.match_type || "EXACT",
      };
    }

    case "stage_audience_artifact": {
      const bodyStr = typeof args.body === "string" ? args.body : "";
      const lines = bodyStr.split("\n").filter(Boolean);
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        artifact_id: "art_demo_sandbox_8f2a",
        script_name: args.script_name || "meta_ads_create_audience",
        ttl_seconds: args.ttl_seconds || 86400,
        record_count: lines.length || 2500,
      };
    }

    case "sync_audience":
    case "manage_audience": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        audience_id: args.audience_id || "aud_demo_sandbox_7712",
        audience_name: args.audience_name || "Demo High-Intent ICP Segment",
        platform,
        status: "SYNCED",
        matched_count: 4820,
        match_rate: "74.8%",
      };
    }

    case "create_conversion": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        conversion_id: "conv_demo_signup_01",
        conversion_name: args.conversion_name || "Demo Signup",
        category: "SIGNUP",
        value: 20.0,
      };
    }

    case "generate_image": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        image_url: "https://synterai.com/assets/demo-generated-ad.png",
        asset_id: "asset_demo_img_101",
        dimensions: { width: 1200, height: 628 },
        prompt: args.prompt || "Clean vector banner for B2B growth engineering",
      };
    }

    case "generate_video": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        video_url: "https://synterai.com/assets/demo-generated-clip.mp4",
        asset_id: "asset_demo_vid_202",
        duration_seconds: 15,
        format: "9:16",
        caption: "AI Agent Ad Management across 27 Platforms",
      };
    }

    case "upload_image": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        asset_id: "asset_demo_img_101",
        asset_name: args.asset_name || "demo_creative.png",
        resource_name: "customers/5759537962/assets/asset_demo_img_101",
      };
    }

    case "run_tool": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        script_name: args.script_name || "unknown",
        platform: args.platform || "generic",
        output: `[Sandbox] Mock execution of script '${args.script_name}' completed.`,
      };
    }

    default: {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        tool: name,
        args,
        message: `[Sandbox] Executed '${name}' in zero-credential demo mode.`,
      };
    }
  }
}
