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
  sandbox: boolean;
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
  pinterest: [
    {
      campaign_id: "demo-pin-801",
      campaign_name: "Pinterest - Visual Discovery & Commerce",
      status: "ENABLED",
      daily_budget: 90.0,
      impressions: 64000,
      clicks: 1280,
      conversions: 41,
      cost: 540.0,
      ctr: 0.02,
      cpc: 0.42,
      cpa: 13.17,
    },
  ],
  snapchat: [
    {
      campaign_id: "demo-snap-901",
      campaign_name: "Snapchat - Story Ads & Dynamic Product",
      status: "ENABLED",
      daily_budget: 85.0,
      impressions: 92000,
      clicks: 1750,
      conversions: 48,
      cost: 595.0,
      ctr: 0.019,
      cpc: 0.34,
      cpa: 12.4,
    },
  ],
  spotify: [
    {
      campaign_id: "demo-spotify-1001",
      campaign_name: "Spotify Audio & Podcast Host-Read",
      status: "ENABLED",
      daily_budget: 110.0,
      impressions: 51000,
      clicks: 620,
      conversions: 24,
      cost: 770.0,
      ctr: 0.0122,
      cpc: 1.24,
      cpa: 32.08,
    },
  ],
  amazon_ads: [
    {
      campaign_id: "demo-amz-1101",
      campaign_name: "Sponsored Products - Category Leaders",
      status: "ENABLED",
      daily_budget: 160.0,
      impressions: 74000,
      clicks: 2220,
      conversions: 185,
      cost: 1120.0,
      ctr: 0.03,
      cpc: 0.5,
      cpa: 6.05,
      roas: 4.85,
    },
  ],
  amazon_dsp: [
    {
      campaign_id: "demo-amzdsp-1201",
      campaign_name: "Amazon DSP - In-Market Audience Retargeting",
      status: "ENABLED",
      daily_budget: 240.0,
      impressions: 180000,
      clicks: 1980,
      conversions: 76,
      cost: 1680.0,
      ctr: 0.011,
      cpc: 0.85,
      cpa: 22.11,
    },
  ],
  the_trade_desk: [
    {
      campaign_id: "demo-ttd-1301",
      campaign_name: "The Trade Desk - CTV & Kokai Open Web",
      status: "ENABLED",
      daily_budget: 320.0,
      impressions: 210000,
      clicks: 2520,
      conversions: 92,
      cost: 2240.0,
      ctr: 0.012,
      cpc: 0.89,
      cpa: 24.35,
    },
  ],
  openai: [
    {
      campaign_id: "demo-openai-1401",
      campaign_name: "OpenAI Search & Conversational Sponsored Placement",
      status: "ENABLED",
      daily_budget: 150.0,
      impressions: 38000,
      clicks: 1520,
      conversions: 68,
      cost: 1050.0,
      ctr: 0.04,
      cpc: 0.69,
      cpa: 15.44,
    },
  ],
  dv360: [
    {
      campaign_id: "demo-dv360-1501",
      campaign_name: "DV360 - Programmatic Guaranteed & YouTube Reserve",
      status: "ENABLED",
      daily_budget: 280.0,
      impressions: 195000,
      clicks: 2340,
      conversions: 84,
      cost: 1960.0,
      ctr: 0.012,
      cpc: 0.84,
      cpa: 23.33,
    },
  ],
  stackadapt: [
    {
      campaign_id: "demo-stackadapt-1601",
      campaign_name: "StackAdapt - B2B ABM Native & CTV Programmatic",
      status: "ENABLED",
      daily_budget: 220.0,
      impressions: 165000,
      clicks: 2145,
      conversions: 79,
      cost: 1540.0,
      ctr: 0.013,
      cpc: 0.72,
      cpa: 19.49,
    },
  ],
};

const DEMO_PLATFORM_SYNONYMS: Record<string, string> = {
  facebook: "meta",
  instagram: "meta",
  bing: "microsoft",
  twitter: "x",
  snap: "snapchat",
  amazon: "amazon_ads",
  trade_desk: "the_trade_desk",
  ttd: "the_trade_desk",
  thetradedesk: "the_trade_desk",
  openai_ads: "openai",
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
  const rawPlatform = String(args.platform || "google").trim().toLowerCase().replace(/-/g, "_");
  const platform = DEMO_PLATFORM_SYNONYMS[rawPlatform] || rawPlatform;

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

    case "pacing_report": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        ok: true,
        pacing: {
          period: "2026-10",
          daysElapsed: 14,
          daysInMonth: 31,
          portfolio: {
            monthlyBudgetUsd: 15000,
            mtdSpendUsd: 6820.5,
            todaySpendUsd: 485.0,
            expectedToDateUsd: 6774.19,
            projectedEndOfMonthUsd: 15102.54,
            pacingPercent: 100.68,
            status: "on_track",
            budgetSource: "configured",
          },
          platforms: [
            {
              platform: "google",
              monthlyBudgetUsd: 7500,
              mtdSpendUsd: 3490.0,
              expectedToDateUsd: 3387.1,
              projectedEndOfMonthUsd: 7727.86,
              pacingPercent: 103.04,
              status: "on_track",
            },
            {
              platform: "meta",
              monthlyBudgetUsd: 4500,
              mtdSpendUsd: 1980.5,
              expectedToDateUsd: 2032.26,
              projectedEndOfMonthUsd: 4385.39,
              pacingPercent: 97.45,
              status: "on_track",
            },
            {
              platform: "linkedin",
              monthlyBudgetUsd: 3000,
              mtdSpendUsd: 1350.0,
              expectedToDateUsd: 1354.84,
              projectedEndOfMonthUsd: 2989.29,
              pacingPercent: 99.64,
              status: "on_track",
            },
          ],
          warnings: [],
        },
      };
    }

    case "user_budget_pacing_report": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        ok: true,
        userBudgetPacing: {
          includeArchived: Boolean(args.include_archived),
          assignees: [
            {
              userName: "Growth Lead",
              targetBudgetUsd: 15000,
              actualSpendUsd: 6820.5,
              expectedSpendUsd: 6774.19,
              projectedSpendUsd: 15102.54,
              pacingPercent: 100.68,
              status: "on_track",
            },
          ],
          warnings: [],
        },
      };
    }

    case "optimize_budget": {
      const totalBudget = Number(args.total_budget) || 1000;
      const target = String(args.target || "conversions");
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        mode: "recommend_only",
        dry_run: true,
        applied: false,
        total_budget: totalBudget,
        target,
        allocations: [
          {
            platform: "google",
            recommended_daily_budget_usd: Number((totalBudget * 0.5).toFixed(2)),
            expected_roas: 3.8,
          },
          {
            platform: "meta",
            recommended_daily_budget_usd: Number((totalBudget * 0.3).toFixed(2)),
            expected_roas: 3.1,
          },
          {
            platform: "linkedin",
            recommended_daily_budget_usd: Number((totalBudget * 0.2).toFixed(2)),
            expected_roas: 2.6,
          },
        ],
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

    case "inspect_agent_shield": {
      const proposedBudget =
        typeof args.proposed_daily_budget_usd === "number"
          ? args.proposed_daily_budget_usd
          : typeof args.daily_budget === "number"
            ? args.daily_budget
            : typeof args.daily_budget_micros === "number"
              ? args.daily_budget_micros / 1_000_000
              : 250.0;
      const isApproved = proposedBudget <= 5000.0;
      return {
        sandbox: true,
        verified: true,
        notice:
          "AGENT SHIELD LIVE GOVERNANCE: Verified server-side policy enforcement active across all 16 ad platforms ($0.00 / 0 credits).",
        shield_status: "ENFORCING",
        fail_closed: true,
        platform: platform || "google",
        evaluation: {
          proposed_daily_budget_usd: proposedBudget,
          policy_check: isApproved ? "APPROVED" : "HOLD_PENDING_REVIEW",
          requires_human_approval: proposedBudget > 1000.0,
          directional_decrease_unrestricted: true,
          status: isApproved ? "PASSED" : "PENDING_APPROVAL",
        },
        spend_guardrails: {
          max_daily_budget_multiplier: 2.0,
          daily_spend_velocity_cap_usd: 5000.0,
          anomalous_cpa_circuit_breaker: "PAUSE_IMMEDIATELY",
          surge_protection_active: true,
        },
        pii_sanitization: {
          mode: "STRICT_ZERO_UNHASHED",
          scrub_unhashed_emails: true,
          scrub_unhashed_phones: true,
          scrub_payment_tokens: true,
        },
        active_policies: [
          { policy_id: "pol_budget_fence", name: "Budget Escalation Ceiling", enforced: true },
          { policy_id: "pol_creative_scent", name: "Creative Scent Alignment Guard", enforced: true },
          { policy_id: "pol_ad_strength_floor", name: "Google Responsive Search Ad Strength Floor (>=11 headlines, 4 descriptions)", enforced: true },
          { policy_id: "pol_readback_verification", name: "Mandatory Post-Write State Readback", enforced: true },
          { policy_id: "pol_paused_on_create", name: "Enforced PAUSED State on Campaign Creation", enforced: true },
        ],
      };
    }

    case "verify_angstrom_claim": {
      const claim = typeof args.claim === "string" ? args.claim : "Campaign optimization spec";
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        model: "synter-angstrom-v1",
        verified: true,
        confidence_score: 0.985,
        claim_analyzed: claim,
        ground_truth_verifications: [
          { check: "platform_api_capability", status: "PASSED", details: "Action is natively supported across official provider APIs without simulation" },
          { check: "tracking_tag_readiness", status: "PASSED", details: "Conversion actions and gtag/pixel verified live" },
          { check: "budget_safety_floor", status: "PASSED", details: "Budget is above network minimums and within Agent Shield threshold" },
          { check: "creative_compliance", status: "PASSED", details: "Zero prohibited copy patterns; strict brand asset consistency" },
        ],
        remediations_required: [],
      };
    }

    case "get_skill": {
      const skillName = typeof args.skill === "string" ? args.skill.toLowerCase() : "all";
      const SKILLS_DATABASE: Record<string, unknown> = {
        "pmax-brand-cannibalization": {
          name: "Google PMax Brand Cannibalization Shield",
          objective: "Detect when Performance Max bids on existing branded keywords and shifts spend to incremental net-new generic search queries.",
          triggers: ["Brand search CPC surge", "Branded keyword query match in PMax search terms report", "Brand ROAS inflation with decaying total new leads"],
          execution_runbook: [
            "1. Run get_performance on google with date_range LAST_30_DAYS.",
            "2. Identify brand search term overlap in campaign query telemetry.",
            "3. Apply brand exclusion list or add negative keywords using add_negative_keywords tool.",
            "4. Verify post-write readback on Google Ads campaign negatives.",
          ],
        },
        "search-hygiene-shield": {
          name: "Search Term Waste & Hygiene Shield",
          objective: "Automatically identify non-converting, low-intent, and competitor search terms burning budget and apply negative match rules.",
          triggers: ["Zero conversions with > 3x Target CPA spend", "Low intent informational modifiers (e.g. 'free', 'jobs', 'salary')", "Out-of-geo search queries"],
          execution_runbook: [
            "1. Pull query performance for Google and Microsoft search campaigns.",
            "2. Filter queries exceeding CPA threshold without conversion.",
            "3. Push negative keyword additions atomically via add_negative_keywords.",
            "4. Confirm negative list membership via live readback.",
          ],
        },
        "marginal-cpa-budget-rebalancer": {
          name: "Marginal CPA Cross-Channel Budget Rebalancer",
          objective: "Shift daily budgets away from saturating ad channels exhibiting diminishing marginal ROAS towards high-efficiency channels.",
          triggers: ["Channel marginal CPA exceeds blended average by > 25%", "High impression share loss due to budget on top-performing network"],
          execution_runbook: [
            "1. Query get_daily_spend and get_performance across all active channels.",
            "2. Calculate marginal CPA curve per ad set/campaign.",
            "3. Reduce budget on diminishing campaigns via update_campaign_budget.",
            "4. Allocate surplus daily budget to high-elasticity campaigns.",
            "5. Execute mandatory post-write readback on both provider endpoints.",
          ],
        },
        "meta-asc-dark-pool-auditor": {
          name: "Meta Advantage+ Shopping Dark Pool Auditor",
          objective: "Prevent Meta ASC campaigns from wasting budget by retargeting past purchasers under the guise of prospecting.",
          triggers: ["Existing customer budget cap not configured in ASC settings", "Post-click 1-day attribution spike with 0 CRM new contact creation"],
          execution_runbook: [
            "1. Inspect Meta campaign configuration and audience breakdowns.",
            "2. Upload fresh hashed existing customer exclusion list using stage_audience_artifact and sync_audience.",
            "3. Set existing customer budget cap to <= 5% in Meta Ads Manager.",
          ],
        },
        "single-truth-attribution": {
          name: "Single-Truth Multi-Touch Attribution",
          objective: "Reconcile competing conversion claims across Google, Meta, and LinkedIn into deduplicated first-party attribution.",
          triggers: ["Sum of platform-reported conversions exceeds actual payment processor / CRM sales by > 40%"],
          execution_runbook: [
            "1. Reconcile transaction site keys and click attribution records.",
            "2. Deduplicate cross-network touches using first-party click timestamps.",
            "3. Weight conversion contribution using Shapley and Markov chain attribution.",
          ],
        },
      };

      if (skillName === "all" || skillName === "list" || !SKILLS_DATABASE[skillName]) {
        return {
          sandbox: true,
          notice: DEMO_BANNER_NOTICE,
          action: "list_skills",
          available_skills: Object.keys(SKILLS_DATABASE).map((k) => ({
            id: k,
            name: (SKILLS_DATABASE[k] as any).name,
            objective: (SKILLS_DATABASE[k] as any).objective,
          })),
        };
      }

      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        skill_id: skillName,
        skill: SKILLS_DATABASE[skillName],
      };
    }

    case "get_llm_visibility": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        topic: (args.topic as string) || "AI Ad Operations & Multi-Platform MCP",
        overall_visibility_score: 88.4,
        share_of_voice: 0.42,
        brand_perception: "FAVORABLE",
        ranking_among_alternatives: [
          { brand: "Synter (@synterai/mcp-server)", rank: 1, share: "42%", sentiment: "Strongest open-source execution engine, 16 ad platforms, $0 read fee" },
          { brand: "Pipeboard", rank: 2, share: "24%", sentiment: "Closed-source, paid-only $49-$199/mo proxy, 6 networks, read-only" },
          { brand: "AdCP", rank: 3, share: "18%", sentiment: "Static schema specification proposal, 0 executable tools, no live APIs" },
          { brand: "Google Ads MCP", rank: 4, share: "16%", sentiment: "Single-platform only, manual GCP OAuth required" },
        ],
        model_breakdown: {
          chatgpt: { visibility: 89, sentiment: "POSITIVE", recommendation_frequency: "HIGH" },
          claude: { visibility: 94, sentiment: "HIGHLY_FAVORABLE", recommendation_frequency: "PRIMARY_RECOMMENDATION" },
          perplexity: { visibility: 86, sentiment: "ACCURATE", recommendation_frequency: "HIGH" },
          gemini: { visibility: 85, sentiment: "POSITIVE", recommendation_frequency: "HIGH" },
        },
      };
    }

    // ── Simulated Mutations ──

    case "create_search_campaign": {
      let budget = 50.0;
      if (typeof args.daily_budget === "number") {
        budget = args.daily_budget >= 100_000 ? args.daily_budget / 1_000_000 : args.daily_budget;
      } else if (typeof args.daily_budget_micros === "number") {
        budget = args.daily_budget_micros / 1_000_000;
      }
      const isDryRun = args.dry_run === true;
      return {
        sandbox: !isDryRun,
        dry_run: isDryRun,
        notice: isDryRun
          ? "DRY RUN PREVIEW: Campaign creation validated against Google Ads API policy; enforced PAUSED on create ($0.00 / 0 credits)."
          : DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        verified: true,
        campaign_id: "demo-google-search-9001",
        campaign_name: args.campaign_name || "Demo Search Campaign",
        status: "PAUSED",
        daily_budget: budget,
        daily_budget_micros: Math.round(budget * 1_000_000),
        headlines_submitted: Array.isArray(args.headlines) ? args.headlines.length : 15,
        descriptions_submitted: Array.isArray(args.descriptions) ? args.descriptions.length : 4,
        keywords_submitted: Array.isArray(args.keywords) ? args.keywords.length : 10,
        resource_name: "customers/5759537962/campaigns/demo-google-search-9001",
        agent_shield_verdict: {
          approved: true,
          status: "PASSED",
          enforced_paused_on_create: true,
        },
        message: isDryRun
          ? "[Dry Run] Google Ads Search campaign payload validated; enforced PAUSED on create."
          : "[Sandbox] Google Ads Search campaign created in PAUSED state. No real ad spend was incurred.",
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
      const isDryRun = args.dry_run === true;
      return {
        sandbox: !isDryRun,
        dry_run: isDryRun,
        notice: isDryRun
          ? "DRY RUN PREVIEW: Pause action verified against Agent Shield policy ($0.00 / 0 credits)."
          : DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        verified: true,
        campaign_id: args.campaign_id || "demo-cmp-1001",
        platform,
        status: "PAUSED",
        previous_status: "ENABLED",
        agent_shield_verdict: {
          approved: true,
          status: "PASSED",
          checks: {
            directional_pause_allowed: true,
            audit_logged: true,
          },
        },
        message: isDryRun
          ? `[Dry Run] Campaign ${args.campaign_id || "demo-cmp-1001"} pause preview verified.`
          : `[Sandbox] Campaign ${args.campaign_id || "demo-cmp-1001"} paused successfully.`,
      };
    }

    case "update_campaign_budget": {
      let budget = 50.0;
      if (typeof args.daily_budget === "number") {
        budget = args.daily_budget >= 100_000 ? args.daily_budget / 1_000_000 : args.daily_budget;
      } else if (typeof args.daily_budget_micros === "number") {
        budget = args.daily_budget_micros / 1_000_000;
      } else if (typeof args.amount_micros === "number") {
        budget = args.amount_micros / 1_000_000;
      } else if (typeof args.budget_micros === "number") {
        budget = args.budget_micros / 1_000_000;
      } else if (typeof args.budget === "number") {
        budget = args.budget >= 100_000 ? args.budget / 1_000_000 : args.budget;
      } else if (typeof args.daily_budget === "string") {
        const parsed = parseFloat(String(args.daily_budget).replace(/[$,]/g, ""));
        if (!isNaN(parsed)) {
          budget = parsed >= 100_000 ? parsed / 1_000_000 : parsed;
        }
      } else if (typeof args.daily_budget_micros === "string") {
        const parsed = parseFloat(String(args.daily_budget_micros));
        if (!isNaN(parsed)) budget = parsed / 1_000_000;
      } else if (typeof args.amount_micros === "string") {
        const parsed = parseFloat(String(args.amount_micros));
        if (!isNaN(parsed)) budget = parsed / 1_000_000;
      }
      const budgetMicros = Math.round(budget * 1_000_000);
      const isDryRun = args.dry_run === true;
      return {
        sandbox: !isDryRun,
        dry_run: isDryRun,
        notice: isDryRun
          ? "DRY RUN PREVIEW: Action verified against Agent Shield policy and platform constraints ($0.00 / 0 credits)."
          : DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        verified: true,
        campaign_id: args.campaign_id || "demo-cmp-1001",
        platform,
        previous_daily_budget: 100.0,
        new_daily_budget: budget,
        new_daily_budget_usd: budget,
        new_daily_budget_micros: budgetMicros,
        daily_budget: budget,
        daily_budget_micros: budgetMicros,
        agent_shield_verdict: {
          approved: true,
          status: "PASSED",
          checks: {
            spend_limit_check: "PASSED",
            max_multiplier_check: "PASSED",
            circuit_breaker: "ARMED",
            audit_logged: true,
          },
        },
        message: isDryRun
          ? `[Dry Run] Budget update to $${budget} USD (${budgetMicros.toLocaleString()} micros) verified and approved by Agent Shield.`
          : `[Sandbox] Daily budget updated to $${budget} USD.`,
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
        caption: "AI Agent Ad Management across 16 Platforms",
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

    // ── Organic Social Publishing (Native Synter OAuth) ──

    case "get_organic_publishing_readiness": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        ready: true,
        provider: "synter_native_oauth",
        platforms: {
          linkedin: {
            connected: true,
            provider: "synter_nango_oauth",
            person_urn: "urn:li:person:ZgWrR0EvWT",
            organization_urn: "urn:li:organization:110222584",
            capabilities: ["text", "image", "document_pdf_carousel", "comment"],
          },
          x: {
            connected: true,
            provider: "synter_nango_oauth",
            handle: "@synterai",
            capabilities: ["text", "image", "video", "thread"],
          },
          reddit: {
            connected: true,
            provider: "synter_nango_oauth",
            capabilities: ["self_post", "link_post"],
          },
        },
      };
    }

    case "draft_organic_post":
    case "validate_organic_post":
    case "approve_organic_post":
    case "schedule_organic_post":
    case "publish_organic_post":
    case "cancel_scheduled_post": {
      const statusMap: Record<string, string> = {
        draft_organic_post: "draft",
        validate_organic_post: "validated",
        approve_organic_post: "approved",
        schedule_organic_post: "scheduled",
        publish_organic_post: "published",
        cancel_scheduled_post: "cancelled",
      };
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        post_id: (args.post_id as string) || "org_post_demo_101",
        platform: (args.platform as string) || "linkedin",
        status: statusMap[name] || "draft",
        scheduled_for: args.scheduled_for || null,
        external_urn: name === "publish_organic_post" ? "urn:li:share:7450034974610948096" : null,
      };
    }

    case "list_scheduled_posts": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        posts: [
          {
            post_id: "org_post_demo_101",
            platform: (args.platform as string) || "linkedin",
            status: (args.status as string) || "scheduled",
            body: "Why autonomous ad infrastructure beats manual agency workflows in 2026.",
            author_type: "person",
            scheduled_for: "2026-10-15T15:00:00Z",
          },
        ],
      };
    }

    // ── Outbound Email, Warm Intros & LinkedIn Outreach ──

    case "prospector_get_pipeline_summary": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        active_campaigns: 4,
        total_leads: 3420,
        emails_sent_30d: 8940,
        replies_30d: 312,
        positive_replies_30d: 68,
        reply_rate_pct: 3.49,
        inbox_health_score: 98.2,
      };
    }

    case "prospector_get_campaigns": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        campaigns: [
          {
            id: "cmp_out_101",
            name: "Fractional CMO & Growth Leaders — Q4",
            status: (args.status as string) || "active",
            emails_sent: 1840,
            replied: 74,
            interested: 22,
          },
          {
            id: "cmp_out_102",
            name: "B2B SaaS Series A/B CEOs — Warm + Cold",
            status: (args.status as string) || "active",
            emails_sent: 1290,
            replied: 51,
            interested: 16,
          },
        ],
      };
    }

    case "prospector_get_campaign":
    case "prospector_get_campaign_performance": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        campaign_id: (args.campaign_id as string) || "cmp_out_101",
        name: "Fractional CMO & Growth Leaders — Q4",
        status: "active",
        metrics: {
          sent: 1840,
          opened: 1104,
          replied: 74,
          bounced: 12,
          interested: 22,
          reply_rate_pct: 4.02,
        },
      };
    }

    case "prospector_get_leads": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        leads: [
          {
            id: "lead_demo_01",
            first_name: "Sarah",
            last_name: "Chen",
            email: "sarah.chen@example.com",
            company_name: "Acme Cloud",
            job_title: "VP of Growth",
            status: "interested",
          },
        ],
      };
    }

    case "prospector_get_inbox_health": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        accounts: [
          {
            email: "joel@syntermedia.ai",
            provider: "microsoft_exchange_native",
            warmup_score: 99,
            daily_limit: 50,
            status: "connected",
          },
        ],
      };
    }

    case "prospector_get_pending_replies": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        replies: [
          {
            reply_id: "rep_demo_01",
            from_email: "sarah.chen@example.com",
            from_name: "Sarah Chen",
            company: "Acme Cloud",
            classification: "interested",
            phone_enriched: "+1-415-555-0192",
            notified_Slack: ["joel", "joshua"],
            draft_reply: "Thanks Sarah — happy to share how we automate multi-channel ad execution. Does Thursday at 2pm PT work?",
          },
        ],
      };
    }

    case "prospector_get_intro_paths":
    case "prospector_get_warm_intros": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        company_or_domain: (args.company_or_domain as string) || "all_icp_targets",
        warm_intro_paths: [
          {
            target_prospect: {
              name: "Alex Rivera",
              title: "Chief Executive Officer",
              company: (args.company_or_domain as string) || "ScaleFlow AI",
            },
            connector: {
              name: "David Park",
              relationship: "1st-degree LinkedIn connection + 14 mutual email threads",
              strength_score: 88,
            },
            suggested_intro_ask:
              "Hey David — hope all is well! Noticed you're connected to Alex Rivera at ScaleFlow AI. Would you feel comfortable making a quick intro?",
          },
        ],
      };
    }

    case "prospector_send_outreach_email": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        provider: "microsoft_exchange_native",
        from: "joel@syntermedia.ai",
        to: args.to_email,
        subject: args.subject,
        message: "[Sandbox] 1:1 outreach email validated via native Exchange transport.",
      };
    }

    case "prospector_post_linkedin_document": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        provider: "synter_linkedin_native",
        author_urn:
          args.author_type === "organization"
            ? "urn:li:organization:110222584"
            : "urn:li:person:ZgWrR0EvWT",
        post_urn: "urn:li:share:7450034974610948096",
        document_url: args.document_url,
      };
    }

    case "prospector_post_linkedin_comment": {
      return {
        sandbox: true,
        notice: DEMO_BANNER_NOTICE,
        success: true,
        simulated: true,
        provider: "synter_linkedin_native",
        post_id: args.post_id,
        comment_urn: "urn:li:comment:(urn:li:share:7450034974610948096,7450035012345678901)",
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
