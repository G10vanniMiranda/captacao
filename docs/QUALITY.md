# Quality Strategy

## Principles

- **DECISION:** Quality evidence precedes completion claims.
- **DECISION:** The vertical slice is developed through observable red-green-refactor cycles once implementation is authorized.
- **DECISION:** Tests verify behavior rather than source-text presence or implementation details.
- **DECISION:** No test, validation, or security control may be weakened merely to make a check pass.
- **DECISION:** Accessibility, privacy, and attribution correctness are acceptance criteria, not later enhancements.
- **DECISION:** Correlation identifiers, PII-safe logs, immutable submissions, reversible lead links, resource-level authorization, and serverless-safe Neon access are cross-cutting test requirements.

## Required Test Layers

### Domain tests

Cover questionnaire branching, submission preservation, qualification outcomes, rule-version selection, reclassification history, attribution precedence, and deterministic deduplication.

### Integration tests

Cover persistence boundaries, atomic submission and qualification behavior, idempotent event recording, schema validation, and authorization on administrative operations.

### Browser tests

Cover both landing pages, both adaptive journeys, valid submission, validation failures, abandonment events, consent choices, and the qualified/unqualified result path without asserting private data in analytics.

Browser tests live under `e2e/` and run against the local Next.js server with the Playwright-managed Chromium project. Traces are retained on the first retry and screenshots only on failure; generated reports and results remain untracked.

### Non-functional checks

Cover keyboard navigation, labels and error association, responsive behavior, metadata integrity, structured-content validation, sensitive-data redaction, and meaningful failure behavior.

## Vertical-Slice Acceptance Gates

- **DECISION:** One website page and one system page resolve from stable content identifiers.
- **DECISION:** Each page starts a measurable journey and preserves essential attribution according to consent.
- **DECISION:** Each adaptive flow validates required answers and persists the original submission once.
- **DECISION:** Qualification records the rule-set version, result, and reasons without overwriting older evaluations.
- **DECISION:** Missing timing or budget retains the lead and can result in an unqualified classification.
- **DECISION:** The primary KPI can be derived by page and intent.
- **DECISION:** No PII appears in analytics payloads, application logs, or user-facing error details.

## Evidence

Every implementation task must name the exact command and expected failure before implementation, then the exact command and expected passing behavior afterward. Build, lint, unit/integration tests, and browser tests are separate evidence and must be reported separately.

Evidence is classified as `PASS`, `FAIL`, `NOT RUN`, or `BLOCKED`. `PASS` requires a command that completed successfully; a successful build does not substitute for test or browser evidence.

## Technical Verification Contract

| Command | Contract |
| --- | --- |
| `npm run lint` | Run the repository ESLint configuration. |
| `npm run typecheck` | Type-check the project with TypeScript without emitting files. |
| `npm run test` | Run deterministic Vitest unit and component tests once in jsdom. |
| `npm run test:watch` | Run Vitest interactively during local development; this is not a release gate. |
| `npm run build` | Produce the local Next.js production build. |
| `npm run test:e2e` | Start the local application and run Playwright browser tests in Chromium. |
| `npm run verify` | Run `lint`, `typecheck`, `test`, and `build`, in that order, stopping on the first failure. |

`npm run verify` intentionally excludes E2E so the default local gate stays deterministic and does not require starting a server or browser. `npm run test:e2e` is a separate mandatory gate whenever a change affects rendered UI, routing, browser behavior, or a user journey, and before release-readiness claims for the vertical slice.

## Continuous Integration

- **DECISION:** `.github/workflows/ci.yml` runs on pushes to `main` and pull requests targeting `main`.
- **DECISION:** Node.js `24.x` is the shared local, CI, and Vercel runtime contract. `package.json` declares the runtime and CI selects the same version explicitly.
- **DECISION:** The `quality` check installs the lockfile with `npm ci` and runs `npm run verify`. This preserves the repository scripts as the single source of truth while the command output keeps lint, typecheck, test, and build results visible.
- **DECISION:** The independent `e2e` check installs only Playwright-managed Chromium and runs `npm run test:e2e` for every configured push and pull request.
- **DECISION:** Future branch protection should require the exact checks `quality` and `e2e`. Ruleset changes remain a protected external operation and are not part of CI configuration.
- **DECISION:** Browser reports, traces, screenshots, and test results are uploaded only after an E2E failure, retained for seven days, and must contain synthetic data without credentials or PII.
- **DECISION:** The workflow reads repository contents, writes only commit statuses needed by Vercel Deployment Checks, disables persisted checkout credentials, cancels superseded runs for the same branch or pull request, and applies a 20-minute timeout to each job.
- **DECISION:** CI receives no stored secrets, does not access provider or production resources, does not deploy, and uses only GitHub's ephemeral `GITHUB_TOKEN` to publish commit statuses. Remote execution begins only after a separately authorized push.

Local verification and CI use the same commands: `npm run verify` for the quality job and `npm run test:e2e` for the browser job. CI adds only clean installation, the Linux runner, and the Playwright Chromium system dependencies around those contracts.

### Production Promotion Gate

- **DECISION:** Vercel Deployment Checks is the selected mechanism for withholding production alias assignment until the required GitHub checks `quality` and `e2e` succeed.
- **DECISION:** On pushes to `main`, each existing CI job uses the official `vercel/repository-dispatch/actions/status@v1` action to publish a uniquely named GitHub commit status: `quality` or `e2e`. The action starts the status as pending and its post-step reports the real job result without rerunning or replacing any quality gate.
- **SECURITY:** The action uses GitHub's ephemeral `GITHUB_TOKEN` with `contents: read` and `statuses: write`. No Vercel token, project identifier, team identifier, deployment identifier, or stored GitHub Actions secret is required.
- **DECISION:** Vercel requires exactly the GitHub-originated `quality` and `e2e` statuses for Production, blocking at production-domain alias assignment. The native Vercel checks `Lint` and `TypeCheck` are not substitutes and remain independently configured.
- Deployment Checks do not prevent the build or deployment record from being created. A failed or pending required check withholds production promotion and production-domain alias assignment, leaving the previous production deployment active.
- Successful `quality` and `e2e` results permit automatic production alias assignment for the corresponding commit; neither the workflow nor the status action performs a deploy or promotion.
- Status publication is limited to pushes on `main`. Pull-request and Preview runs retain the existing CI gates without waiting on these Vercel Deployment Checks.
- Commit, push, merge, manual deploy, rollback, environment changes, production migration, production writes, and GitHub ruleset changes remain Human Gates and are not authorized by this mechanism.
- The success path is verified only when GitHub Actions, Vercel Deployment Checks, promotion, and production alias state have all been observed for the same commit. The failure path requires a later controlled test and must not be simulated on `main`.

## Test Organization

- Unit and component tests are colocated with source files as `src/**/*.test.ts` or `src/**/*.test.tsx`.
- Component tests use Testing Library queries that reflect accessible user behavior and load `jest-dom` matchers from the shared Vitest setup.
- TypeScript aliases are resolved from `tsconfig.json`; tests may import application code through `@/` exactly as production code does.
- Browser tests live under `e2e/` and verify externally observable behavior rather than framework internals.
- A harness test must fail for a meaningful regression. Placeholder assertions such as `expect(true).toBe(true)` are not acceptable.

## Test Discipline

- Do not weaken a test, remove a valid assertion, or bypass a failure merely to obtain `PASS`.
- A bugfix should include a regression test whenever the behavior can be reproduced deterministically.
- New business rules should follow test-driven development when appropriate: observe the relevant failure before adding implementation.
- Prefer assertions about observable behavior. Assert implementation details only when that detail is itself a required contract.
- Use mocks only at a justified boundary, such as an external provider, clock, browser API, or persistence adapter; do not mock the behavior under test.

## Test Data Discipline

- Use the smallest deterministic fixture that proves the behavior under test.
- Do not place real PII, credentials, production identifiers, or copied production payloads in fixtures, snapshots, logs, reports, traces, or screenshots.
- Tests must not call production, send real communications, execute real charges, or depend on production data or credentials.
- Database integration tests introduced with the vertical slice must use an explicitly authorized isolated test database and must refuse production-like targets.
- Original submission immutability, reversible lead consolidation, correlation identifiers, and PII-safe observability require direct positive and negative evidence when those boundaries are implemented.

## Coverage Policy

No arbitrary global percentage is imposed at the harness stage. Coverage expectations are risk-based: business rules, security and authorization boundaries, privacy controls, immutable data behavior, deduplication, and failure paths require direct tests. Coverage tooling or thresholds may be added only when the resulting signal is actionable and the team agrees on the enforcement policy.

## Methodology Integration

Superpowers provides development methodology, not authority. Implementation should use observable red-green-refactor cycles, and completion claims require fresh verification evidence. Skill recommendations remain subordinate to `AGENTS.md`, including all Human Gates for commits, external changes, deployments, migrations, and production writes.

## Open Questions

- **OPEN QUESTION:** Local/test database strategy and isolation model.
- **OPEN QUESTION:** Accessibility automation tool and manual review checklist.
- **OPEN QUESTION:** Performance budgets for landing pages and journey interactions.
