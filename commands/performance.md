---
description: Get a performance report for your campaigns
argument-hint: [platform] [time-period]
allowed-tools: Bash
---

Generate a campaign performance report. Arguments: $ARGUMENTS

Use the Synter API to:
1. Pull live performance metrics from connected ad platforms
2. Calculate key metrics: CPA, ROAS, CTR, conversion rate
3. Compare against previous period
4. Identify top and bottom performing campaigns
5. Provide optimization recommendations

If no platform is specified, report across all connected platforms.
If no time period is specified, default to last 7 days vs previous 7 days.

Present results with:
- Summary metrics table
- Period-over-period trends
- Top 3 and bottom 3 campaigns
- Specific optimization actions to take
