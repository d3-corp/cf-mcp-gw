# Cloudflare MCP gateway

Planning repository for secure access to remote MCP servers through Cloudflare,
with Linear harness workflow and 1Password secret management.

Planning issue: https://linear.app/d3space/issue/D3S-69

- [Setup plan](PLAN.md)
- [Harness onboarding](HARNESS-ONBOARDING.md)
- [Handoff](HANDOFF.md)

## Offline harness checks

Use Node.js 24 and `npm ci --ignore-scripts`. No Cloudflare, 1Password or tenant
credentials are needed. Required administrator-configured check IDs:

| ID          | Command after checkout                             | Purpose                                                      |
| ----------- | -------------------------------------------------- | ------------------------------------------------------------ |
| `typecheck` | `npm ci --ignore-scripts && npm run check`         | TypeScript validation                                        |
| `docs`      | `npm ci --ignore-scripts && npm run check:docs`    | Formatting, local links, external URL syntax and JSON syntax |
| `secrets`   | `npm ci --ignore-scripts && npm run check:secrets` | Credential patterns and sensitive filenames                  |
| `tests`     | `npm ci --ignore-scripts && npm test`              | Positive/negative verifier fixtures                          |

Apply exactly one `repo:cf-mcp-gw` label, use Agent Workflow Pilot, and select all
four check IDs after deployed mapping and preflight are verified. The coordinator
owns dispatch and publication; commands come from administrator configuration.
See the [pilot operator runbook](HARNESS-ONBOARDING.md#bounded-pilot-configuration)
and [review template](pilot.example.json). Neither authorizes cloud deployment.

Checks inspect files in the working directory, excluding `.git`, `node_modules`
and `coverage`. No Git metadata is needed in the disposable verification copy.
Sensitive filenames are flagged without reading their contents. Inventory fails on
symlinks, binary files and files over 1 MiB rather than silently skipping them.
Local links and Markdown heading fragments must resolve inside that inventory.
Raw HTML links and explicit HTML anchors are outside this Markdown checker;
use Markdown links/headings. External URLs are syntax-checked only and never
fetched, so this gate does not prove remote link availability. JSON files are
parsed for syntax; no gateway configuration schema exists yet. The pilot example is a review template only; define and test a provider schema
before implementing an apply path.

The secret check catches common GitHub/1Password/AWS tokens, private-key headers,
bearer tokens and quoted literal secret assignments; use `op://` references or
explicit placeholders instead. Findings report file/line and rule, never matched
values. This is bounded working-tree detection, not an exhaustive secret audit
or a Git-history scan. Arbitrary opaque strings may not be recognized. Preserve
1Password custody and review independently before publication.
