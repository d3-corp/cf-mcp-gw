# Harness onboarding task

Parent: D3S-69. Execution owner: administrator of the existing linear-harness deployment. Target: private GitHub repository `d3-corp/cf-mcp-gw`, base `main`, proposed repository key `cf-mcp-gw`. This task prepares dispatch; it does not authorize a cloud deployment.

## Historical onboarding observation

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

## Registered verification checks

The supplied 2026-10-23 task contract reports that service-account credential
preflight and repository access passed, PR #2 merged, and main
`331f138a5905566a7e214532bf6c17dcb2875507` passed isolated verification. It reports
these four required administrator-owned checks as registered. This worker has
not inspected deployment state or independently repeated credential preflight.
The historical observation above is not a current service-status claim.

| ID          | Exact argv (Linux)                                                 |
| ----------- | ------------------------------------------------------------------ |
| `typecheck` | `["sh", "-c", "npm ci --ignore-scripts && npm run check"]`         |
| `docs`      | `["sh", "-c", "npm ci --ignore-scripts && npm run check:docs"]`    |
| `secrets`   | `["sh", "-c", "npm ci --ignore-scripts && npm run check:secrets"]` |
| `tests`     | `["sh", "-c", "npm ci --ignore-scripts && npm test"]`              |

Use Node.js 24 and registry.npmjs.org only. These offline commands need no live
credentials. See [check limitations](README.md#offline-harness-checks).
Commands must come from administrator configuration, never arbitrary issue text.
Apply exactly one `repo:cf-mcp-gw` label and select all four check IDs in the
harness block only after the administrator confirms mapping and preflight.

## Bounded pilot configuration

[pilot.example.json](pilot.example.json) is a declarative review template, not a
Cloudflare API payload or an executable provisioning specification. No loader,
provider schema or apply command exists in this repository. `templateVersion`
versions this review format; `mode: review-only` records its intended use, not a
technical deployment interlock. Every `<CONFIRM_...>` value is unresolved and
must block application. Do not treat the listed account, portal or domain in
[PLAN.md](PLAN.md) as approval to select it.

| Fields                            | Required operator decision                                                                                                                                                                                            |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accountId`, `hostname`, `portal` | Explicit account/domain ownership approval; inspect existing portal, DNS, TLS and Access policies; confirm reuse or creation and record resource IDs. Mark existing portal ID inapplicable if creating.               |
| `identity`                        | Approved IdP and pilot group IDs, IdP MFA and applicable posture policy. Portal authorization alone does not supply independent MFA, purpose justification or temporary auth.                                         |
| `upstreams`                       | Start with one reviewed URL and owner, supported transport, per-user OAuth client/scopes, exact permitted read-only tool names and data classification. Confirm callbacks and consent in the chosen client.           |
| `directAccessBoundary`            | Declare customer-origin authorization/private routing or third-party endpoint egress enforcement and residual direct-access exposure.                                                                                 |
| `acceptance`                      | Real client/version, separate approved/outsider test identities and harmless synthetic read input; use restricted evidence storage for personal identifiers.                                                          |
| `operations`                      | Owner, retention/log access, budget/entitlement signoff, observation window, inspection and private-routing decisions. Gateway inspection requires Streamable HTTP; private origins require tested connectors/routes. |

Never place tokens, OAuth secrets, refresh tokens or service-account bootstrap
credentials in this file. A trusted operator separately selects least-privilege
1Password scopes and approved secret references when needed. Keep coordinator,
provisioning and upstream-registration authority separate. Cloudflare retains
runtime OAuth token custody; if that custody is unacceptable, stop and revisit
the architecture. Available accounts or domains confer no approval.

## Operator sequence and approval gates

1. **Review inputs.** Resolve every placeholder in a separate reviewed candidate,
   inventory the upstream and data sensitivity, and obtain owner approval for
   account, hostname, policy, cost and exact tool set. Preserve the example as a
   reusable template. Review the diff for secrets and unintended access.
2. **Confirm harness prerequisites.** The deployment administrator follows the
   deployed harness operations procedure to inspect service, active lease/run
   and containers during an idle maintenance window. Preserve state/auth paths,
   isolation and existing mappings. Confirm service-identity read/push/draft-PR
   access to pushed main and the `cf-mcp-gw` mapping to Agent Workflow Pilot
   (`51aca7df-c980-4c9b-8a14-a3f0909e94d2`) in confirmed d3space/D3S. Add only
   missing mappings. Validate the full deployed configuration with its
   documented `loadConfig` entry point and credential-aware read-only preflight.
   Use installed procedures for exact commands; this repository does not ship
   those operations tools. Record config version and status-only results.
3. **Verify unattended authentication.** Before any administrator-controlled
   restart, ensure no active work and follow the documented maintenance
   procedure. Preserve databases, leases and containers. Verify 1Password
   authentication after restart through the protected service-manager credential
   facility, collecting only success/failure and names/metadata. Do not print
   environment values, resolved secrets, request bodies or debug traces. Do not
   restart or retrieve credentials from the coding worker.
4. **Run offline verification.** Run each exact registered command above against
   the candidate. `docs` checks JSON syntax, not field semantics or Cloudflare
   compatibility. Independently review unresolved placeholders, HTTPS upstream,
   exact allowlist, per-user auth and policy decisions. Before any application,
   the trusted provisioner must validate the translated configuration with its
   actual provider schema and review the resulting resource diff. Offline
   success does not establish `loadConfig`, authentication or live acceptance.
5. **Obtain separate deployment approval.** A human approves the concrete resource
   diff, secret scopes, rollback baseline and maintenance window. Only a separate
   trusted operator/provisioner may resolve 1Password references and apply cloud
   changes. Coding and verification containers receive no gateway credentials.
   Inspect existing resources first; do not overwrite shared policies or routes.
6. **Record live evidence separately.** Execute the matrix below on the exact
   approved deployed revision, then observe for the agreed window and seek
   rollout review. Resynchronize upstream capabilities and review newly added
   tools before enabling them. A documentation PR is not gateway acceptance.

## Live acceptance record

For each case record timestamp, configuration revision, resource IDs, client
version, expected/actual outcome and sanitized correlation ID. Record pass/fail
without tokens, OAuth callbacks, sensitive tool arguments or response data.

| Case                     | Required evidence from trusted operator                                                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authorized flow          | Pilot member completes Access/IdP MFA, client initialization, listing and approved harmless read through the portal.                                                                        |
| Denied identity          | Outsider, removed-group user and applicable MFA/posture failure cannot reach/invoke tools; check existing sessions after revocation.                                                        |
| Provider isolation       | Two users retain distinct upstream permissions; revoked/expired OAuth fails; no shared administrative authority for sensitive tools.                                                        |
| Tool restrictions        | Approved read works, disallowed tool is absent and explicit invocation is denied; newly introduced tool stays unapproved.                                                                   |
| Client/session lifecycle | Consent/callbacks, reconnect, session expiry and token revocation behave as approved in the actual client.                                                                                  |
| Direct-upstream boundary | Customer-owned origin rejects unauthorized direct access or is private. For public third parties test managed endpoint egress and provider permissions; record any remaining direct access. |
| Failure and audit        | Upstream outage, connector loss and credential expiry fail safely; audit correlation, retention and log access match approvals.                                                             |
| Rotation                 | Update the scoped credential in 1Password and its consumer, validate a harmless request, revoke the old credential and confirm rejection; reauthenticate user OAuth at the provider.        |

Portal visibility and tool filtering do not prevent direct connections to public
upstreams. A user with provider permissions may bypass the portal unless tested
endpoint egress controls enforce the path. Portal tool restrictions therefore do
not establish a global tool prohibition. Record unmanaged-device and alternate
network exposure; unresolved gateway-only requirements block rollout. Optional
Gateway inspection must be tested with synthetic DLP inputs on supported transport.

## Rollback and handoff

The trusted operator captures the prior reviewed configuration and resource IDs
before applying. On unauthorized access, tool expansion, auth failure or unsafe
failure behavior, restrict the pilot Access policy, revoke active portal/provider
sessions using supported controls, disconnect the affected upstream and restore
the prior reviewed configuration. Verify access is denied and recovery works.
Preserve audit logs, checkpoints and harness state. Do not delete shared DNS,
tunnels, policies or databases; deletion requires a separately reviewed list.

The coordinator owns checkpoint commits, push/read-back, independent checks,
draft PR, HANDOFF and workflow transitions. Record deployment config version,
repository/project/check IDs, service status, run ID, branch/commit/push evidence,
check outcomes, draft PR, remaining blockers and exact next action. Queue Todo
plus `harness:ready` only after dependencies/preflight pass; verify one owned run
and publication before In Review. Human review controls merge and Done. This
worker changes files and runs offline checks only; it does not assert current
service health, cloud provisioning, restart authentication or live acceptance.
