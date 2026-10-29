# AGENTS.md

## Project

Planning repository for secure access to remote MCP servers through Cloudflare,
with 1Password secret management. It holds plans, runbooks, a review-only pilot
template and offline checks. Nothing here deploys or changes Cloudflare.

Before planning or editing, explicitly read:

- [README.md](README.md), [PLAN.md](PLAN.md) and
  [HARNESS-ONBOARDING.md](HARNESS-ONBOARDING.md) (maintained here).
- The issue and latest HANDOFF from Linear (project Cloudflare MCP Gateway).
- The task's read-only Contract Master context bundle; verify its recorded
  source commit and digest.
- The shared workflow, security and contract guidance inside that bundle.
  Links alone do not load those files.

## Workflow

Work arrives through the Contract Master workflow. Claude investigates and plans;
DeepSeek implements and tests; Codex independently verifies, reviews and merges.
Send results to the coordinator. Only the manager writes Linear. Humans handle
escalations. Follow the task's allowed scope, acceptance criteria and required
checks. Issues for this repository carry exactly one `repo:cf-mcp-gw` label.

## Commands

Use Node.js 24 and `npm ci --ignore-scripts`. No Cloudflare, 1Password or tenant
credentials are needed. Registered check IDs:

| ID          | Command                                            |
| ----------- | -------------------------------------------------- |
| `typecheck` | `npm ci --ignore-scripts && npm run check`         |
| `docs`      | `npm ci --ignore-scripts && npm run check:docs`    |
| `secrets`   | `npm ci --ignore-scripts && npm run check:secrets` |
| `tests`     | `npm ci --ignore-scripts && npm test`              |

Run all four before handing back a change. Format Markdown with Prettier
(`npx prettier --write <file>`); `docs` fails on unformatted files.

## Boundaries

- Never place tokens, OAuth secrets or credentials in files; use `op://`
  references or explicit placeholders.
- Never resolve `<CONFIRM_...>` placeholders in `pilot.example.json`; it is a
  review template. Live provisioning belongs to a separate trusted operator.
- Never push to `main`, force-push or rewrite history.
- Do not add dependencies or change check scripts unless the task allows it.
