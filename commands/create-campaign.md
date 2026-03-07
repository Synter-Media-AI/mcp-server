---
description: Create a new ad campaign with AI-generated strategy
argument-hint: <campaign-brief>
allowed-tools: Bash
---

Create a new advertising campaign based on this brief: $ARGUMENTS

Use the Synter API to:
1. Generate a campaign strategy with targeting, budget allocation, and creative recommendations
2. Generate keyword suggestions with intent classification
3. Generate creative variations for A/B testing
4. Run pre-flight checks (geo targeting, conversion tracking, budget validation)
5. Present the full campaign plan for user approval before execution

Do NOT execute the campaign without explicit user approval. Always present the plan first with:
- Campaign structure (ad groups, targeting)
- Budget breakdown by platform
- Keyword list with match types
- Creative variations
- Expected performance estimates
