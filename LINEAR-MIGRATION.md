# Linear workspace migration

Requested 2026-10-21 after an account switch. Target workspace discovery is pending: Orca team discovery and both available Linear MCP connections still return only the original d3space workspace and D3S team. Do not recreate issues or overwrite mappings in that workspace as a substitute for the requested destination.

## Source inventory

- Workspace: d3space, `8828a093-3bc4-4cc9-a943-f139ade20a88`.
- Team: D3S, `c23c72c5-c9b8-480e-8011-fb2faa80a86b`.
- Planning issue: D3S-69; implementation onboarding child: D3S-70.
- Private repository: d3-corp/cf-mcp-gw, main branch exists.
- Planning PR: https://github.com/d3-corp/cf-mcp-gw/pull/1.
- Repository key proposed for harness: cf-mcp-gw; actual deployed mapping is unverified.
- Latest service inspection reports auto-restart; protected configuration requires administrator access.

## Migration sequence

1. Connect the target workspace to Orca and verify it through `linear team list --workspace all --json`. Resolve workspace/team IDs, current user, project, Todo/In Progress/In Review states and queue label IDs from the destination. Matching names never establish matching IDs.
2. Search the destination for existing gateway planning/onboarding tasks before creating anything. Read their latest handoffs. Reuse matching tasks or recreate PLAN.md and HARNESS-ONBOARDING.md as an assigned parent/child pair, preserving acceptance criteria. Record a source-to-destination identifier map. Do not delete or change old issues without a separate need.
3. Attach the existing draft PR to the destination planning issue. Update README.md, PLAN.md, HARNESS-ONBOARDING.md, HANDOFF.md and PR body to use the verified destination links. Preserve the source references in this migration inventory for traceability.
4. Verify that the harness's LINEAR_API_KEY belongs to the destination workspace. Switching a chat connector does not rotate the separately managed harness credential. Update it in the selected 1Password Environment using an authorized secret-management session; verify identity and names without exposing values. Preserve GitHub and inference credential separation.
5. Administrator inspects coordinator status and active runs/containers before changing the service. Back up the reviewed configuration and durable state without deleting either. If a run is active, use documented cancellation/drain/recovery procedures. Do not treat an auto-restart loop as idle proof.
6. Update deployed team, project, workflow state and label IDs to the destination, preserving repository mappings, required checks, isolation and credential paths. Decide explicitly whether to run a separately isolated deployment or migrate the existing coordinator: changing a shared team configuration affects every repository, not just this project.
7. Use a separate state namespace/database for the new workspace unless the harness provides and verifies a supported state migration. Old leases, checkpoints, outbox operations and remote issue IDs must never be replayed into the new workspace. Retain old state for recovery and audit.
8. Validate configuration through the harness schema; run credential-aware read-only doctor and status. Resolve startup errors before dispatch. Confirm destination identity and repository access with the coordinator's own identity rather than this interactive session's credentials.
9. Queue one bounded pilot only after mapping/check IDs and dependencies are verified. Confirm selection from the destination project, single execution ownership, pushed checkpoint, independent checks, draft PR, destination HANDOFF and In Review. Human review controls merge and Done.

## Completion evidence

Record destination workspace/team/project/state/label IDs, parent/child issue links, verified 1Password credential scope, deployed config/state namespace, successful preflight, pilot run/checkpoint and updated PR. Until those exist, the account migration remains incomplete and the original gateway plan remains the source artifact.

## Rollback

Stop new dispatch through the documented coordinator procedure. Preserve destination state separately; restore the prior reviewed config and its corresponding credential/state context only after checking for active work and pending writes. Verify old identity and preflight before resuming any old queue. Never clear SQLite or retry outbox entries against a different workspace.
