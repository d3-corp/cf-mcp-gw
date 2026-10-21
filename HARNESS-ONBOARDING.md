# Harness onboarding task

Parent: D3S-69. Execution owner: administrator of the existing linear-harness deployment. Target: private GitHub repository `d3-corp/cf-mcp-gw`, base `main`, proposed repository key `cf-mcp-gw`. This task prepares dispatch; it does not authorize a cloud deployment.

## Current blocker

On 2026-10-21 a coarse service query briefly reported active, but the detailed follow-up reported activating/auto-restart with MainPID=0. Successful preflight and repository registration remain unverified. The deployed configuration is root-owned and not readable by this session; noninteractive sudo requires a password. Do not infer repository registration from example configuration or restart the service without inspecting durable run/container state. No deployed configuration was edited.

## Acceptance criteria

1. Inspect coordinator status, active lease/run and containers through its documented operations procedure. Use an idle maintenance window and preserve all state.
2. Verify a pushed main branch exists and the coordinator identity has read/push/draft-PR permissions for d3-corp/cf-mcp-gw. This session's GitHub permission does not prove the service identity's access.
3. Use Agent Workflow Pilot (`51aca7df-c980-4c9b-8a14-a3f0909e94d2`) in the user-confirmed d3space/D3S workspace. Inspect the deployed repository/project allowlists. Add the mapping only if absent; preserve existing mappings, absolute state/auth paths and isolation controls.
4. Register administrator-owned required checks appropriate to documentation/configuration: formatting/links, configuration validation once configuration exists, and secret scanning. Record exact check IDs and argv; do not use issue text as executable commands. No live cloud credentials in verification.
5. Validate the full configuration with loadConfig, run documented credential-aware read-only preflight and collect status-only evidence. Verify restart authentication to 1Password without printing values. No secret values in logs or tickets.
6. Prepare a narrowly scoped documentation/configuration issue selecting the verified key/check IDs in a harness block. Queue Todo plus harness:ready only once dependencies and preflight pass. Verify one coordinator-owned run, pushed checkpoint, independent checks, draft PR and HANDOFF before In Review.

## Next issue scope

Prepare declarative pilot configuration and a detailed operator runbook from PLAN.md using confirmed target inputs. Do not apply resources from the coding worker. Live provisioning uses a separate trusted identity; live acceptance must record authorized and denied flows, tool restrictions, bypass boundary and rotation evidence.

## Handoff requirements

Record deployment config version, mapping/project/check IDs, service status, run ID if dispatched, branch/commit/push read-back, independent checks, draft PR, blockers and exact next action. Human review controls merge and Done. If access remains unavailable, leave this task in Backlog and record the missing administrator step.
