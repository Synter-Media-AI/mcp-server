# Claude Code Instructions — @synterai/mcp-server

## Project Ecosystem

This is the **@synterai/mcp-server** — the public-facing MCP SDK that wraps the synter-media backend.

| Project | Relationship | Rules of engagement |
|---------|-------------|---------------------|
| `synter-media` | This SDK wraps synter-media's API. Changes to synter-media's API surface may require updates here. | Always check synter-media's route definitions before adding/changing tools. Never expose internal synter-media endpoints that aren't intended to be public. Version-bump before publishing. |
| `synter-docs` | Docs for this SDK live in synter-docs. | When tools change here, flag synter-docs needs updating. |
| `jobs-outreach-engine` | No direct dependency. | — |
| `gumshoe` | Completely separate. | Never reference Gumshoe in this package. |

**This is a published npm package (`@synterai/mcp-server`). Everything here is public. No internal credentials, account IDs, or proprietary logic.**

---

## CRITICAL: Workspace & Account Verification

**BEFORE any action that touches an external system, verify you are in the mcp-server project.**

| Check | Expected value | Action if wrong |
|-------|---------------|-----------------|
| Working directory | `/Users/joelhorwitz/work/mcp-server/` | STOP — ask user to confirm |
| Package name | `@synterai/mcp-server` (check `package.json`) | STOP if different |
| GitHub repo | `mcp-server` repo — NOT `jshorwitz/synter-media` | STOP before any push |
| npm/registry | Publishing to `@synterai` scope only | Confirm before `npm publish` |
| Deployment target | syntermedia.ai MCP endpoint — NOT production Synter app | Confirm before deploy |

**This MCP server is a public-facing SDK used by external developers. Any breaking change, bad publish, or accidental credentials exposure affects all users of the package.**

### Additional safety rules

- Never hardcode API keys, tokens, or secrets in source files.
- Always bump the version in `package.json` before publishing.
- Test locally with `node dist/index.js` before publishing to npm.
- The `skills/` and `agents/` directories contain Synter-specific configs — do not expose internal Synter account IDs or API endpoints in published code.

## Project Overview

This is the Model Context Protocol server for Synter's ad management platform. It exposes tools for managing campaigns across Google, Meta, LinkedIn, Microsoft, Reddit, TikTok, and more.

- Entry point: `src/index.ts`
- Built with TypeScript, compiled to `dist/`
- Published as `@synterai/mcp-server` on npm
