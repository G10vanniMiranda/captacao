# ADR-0002: Technical Foundation for the Vertical Slice

- Status: Accepted with explicit pre-production gates
- Date: 2026-08-11

## Context

The approved product design requires a concrete technical baseline before an implementation plan can name exact files, interfaces, tests, and commands. The repository currently contains only the standard Next.js 16.3.0 scaffold. The human owner approved this baseline on 2026-08-11 with the consent, authorization, qualification-configuration, and cross-cutting constraints recorded below.

## 1. Database and Persistence

**Options**

1. Neon PostgreSQL through Vercel Marketplace with Drizzle ORM.
2. Supabase PostgreSQL with its SDK and integrated authentication.
3. Provider-neutral PostgreSQL with Prisma ORM.

**Trade-offs**

- Neon plus Drizzle is a small relational stack, fits serverless execution, and retains normal PostgreSQL semantics, but database and authentication remain separate concerns.
- Supabase consolidates database and authentication, but couples more application boundaries to one backend platform.
- Prisma provides a mature generated client and migrations, but adds generation and runtime considerations that are unnecessary for a small first slice.

**Recommendation**

Use Neon PostgreSQL through Vercel Marketplace and Drizzle ORM behind a narrow repository boundary. Use the Node.js runtime for persistence paths, lazy database initialization, pooled/serverless connections, and migration files reviewed before any environment is changed. No database provisioning or migration is authorized in Phase 3.

## 2. Analytics

**Options**

1. Store only first-party domain events in PostgreSQL.
2. Use only Vercel Web Analytics and custom events.
3. Store authoritative first-party events and use Vercel Web Analytics for anonymous traffic behavior.

**Trade-offs**

- Database-only events support qualification and revenue joins but provide less convenient traffic exploration.
- Platform analytics provides immediate aggregate traffic reports but must not become the source of truth for commercial state.
- The combined approach adds one integration while keeping business metrics reproducible from owned data.

**Recommendation**

Use an append-only first-party event ledger as the authority for journey, funnel, qualification, and commercial events. Add Vercel Web Analytics for anonymous page and referrer trends. Custom analytics properties must use stable non-PII page, intent, offer, step, and outcome codes only.

## 3. Consent

**Options**

1. Essential-only journey continuity plus anonymous cookieless analytics.
2. Explicit category consent for analytics and marketing identifiers.
3. A third-party consent-management platform.

**Trade-offs**

- Essential-only processing minimizes collection and implementation scope but restricts cross-visit attribution.
- Category consent supports richer attribution but requires preference state, revocation, and legal copy.
- A CMP provides governance features but is disproportionate before tracking requirements and legal bases are approved.

**Recommendation**

Collect only essential data by default. Add non-essential tracking only when it is technically useful and legally applicable, using consent when required. The implementation must support gating non-essential tracking without asserting that one universal consent model is legally sufficient. Legal basis, consent requirements, retention, notice text, and identifier classification remain product/legal gates before production.

## 4. Test Stack

**Options**

1. Vitest, React Testing Library, and Playwright.
2. Jest, React Testing Library, and Playwright.
3. Playwright-heavy coverage with minimal unit tests.

**Trade-offs**

- Vitest is fast and TypeScript-friendly, while async Server Components still favor browser coverage.
- Jest is mature but adds more Next.js-specific transformation setup.
- Browser-heavy testing maximizes realism but makes domain feedback slower and failure diagnosis broader.

**Recommendation**

Use Vitest for pure domain and server-boundary tests, React Testing Library for synchronous client components, and Playwright for both adaptive journeys and async Server Component integration. Use a disposable PostgreSQL test database for persistence integration tests.

## 5. Runtime Schema Validation

**Options**

1. Zod schemas shared across server boundaries and forms.
2. Valibot schemas shared across boundaries.
3. Hand-written validation per endpoint.

**Trade-offs**

- Zod has broad TypeScript ecosystem support and straightforward inferred types, at the cost of a larger dependency.
- Valibot can reduce bundle weight but is less established in the current project context.
- Hand-written validation avoids a dependency but duplicates contracts and increases drift risk.

**Recommendation**

Use Zod as the runtime source of truth for structured content, journey steps, submissions, qualification configuration, and public server inputs. Keep validation server-side even when client validation improves usability.

## 6. Minimum Administration

**Options**

1. A Clerk-protected internal `/admin` route with an explicit user allowlist.
2. Auth.js with passwordless email and a database adapter.
3. Provider console and reviewed scripts only; no application admin route.

**Trade-offs**

- Clerk minimizes authentication implementation and supplies App Router primitives, but introduces a vendor and user-data processor.
- Auth.js offers more ownership but adds email delivery, adapter, and session configuration.
- Console/scripts minimize attack surface but make commercial progression and configuration operationally fragile.

**Recommendation**

Use a Clerk-protected internal route with no public signup. Keep the allowlist exclusively server-side and validate authentication plus authorization next to every protected resource read or mutation. Middleware or `proxy.ts` may provide routing convenience and early rejection, but it is not the authorization boundary. Limit the MVP surface to viewing leads/submissions and recording simple commercial events. Creating or editing arbitrary page content remains outside scope.

## 7. Deployment

**Options**

1. Vercel managed deployment.
2. Container deployment on a managed platform.
3. Self-managed infrastructure.

**Trade-offs**

- Vercel matches the existing Next.js stack and offers preview environments, but increases platform coupling.
- Containers improve portability but add build, runtime, network, and scaling operations.
- Self-management adds no MVP product value.

**Recommendation**

Use Vercel for preview and eventual production deployment, with the database in a compatible nearby region. Deployment remains a protected operation and is not authorized by this ADR or Phase 3.

## 8. Observability

**Options**

1. Structured Vercel runtime logs only.
2. Structured logs plus Sentry error monitoring.
3. Full OpenTelemetry and external log/trace drains.

**Trade-offs**

- Runtime logs are the smallest baseline but have limited aggregation and alerting.
- Sentry improves actionable error diagnosis but requires aggressive PII scrubbing and another processor.
- Full telemetry is powerful but exceeds the initial slice.

**Recommendation**

Use structured, redacted runtime logs from the first implementation task and add Sentry before a production release. Defer full tracing and drains. Error context must be allowlisted; form answers, contact data, campaign values, cookies, and tokens are prohibited.

## 9. Lead Deduplication

**Options**

1. Always create a new lead and link manually.
2. Automatically link exact normalized email or phone matches.
3. Fuzzy identity matching.

**Trade-offs**

- Manual-only linking preserves safety but creates operational duplication.
- Deterministic matching reduces duplicates while requiring conflict handling and reversible links.
- Fuzzy matching risks false merges and opaque identity decisions.

**Recommendation**

Normalize email and phone into separate identity records. Automatically link only when exactly one existing lead matches and no supplied identifier conflicts. Otherwise create a new lead and flag a possible duplicate for review. Links are reversible; submissions and attribution records are never merged, rewritten, or deleted. Fuzzy matching is prohibited in the MVP.

## 10. Structured Content

**Options**

1. Version-controlled TypeScript content objects validated with Zod.
2. MDX files with frontmatter.
3. A headless CMS.

**Trade-offs**

- TypeScript objects provide exact contracts and reviewable changes for two pages, but require developer edits.
- MDX improves rich editorial authoring but mixes content and executable presentation concerns.
- A CMS improves author autonomy but adds schemas, authentication, preview, and publishing workflow outside the slice.

**Recommendation**

Use version-controlled TypeScript content objects validated at build/test time. Each page has a stable ID and slug plus explicit intent, problem, solution, segment, offer, metadata, proposition, and allowed journey entry point. Do not generate arbitrary matrix combinations.

## 11. Investment-Band Configuration

**Options**

1. Environment variables.
2. Version-controlled code configuration.
3. Immutable versioned PostgreSQL rule-set records with explicit activation.

**Trade-offs**

- Environment variables are easy to change but weak for structure, history, and auditing.
- Code configuration is reviewable but requires a release for commercial changes.
- Database records preserve activation and evaluation history but require restricted administration and transactional rules.

**Recommendation**

Keep qualification rules in a dedicated typed, versioned code module for the vertical slice. Do not inline investment values inside evaluation logic. Each released rule set has a stable version identifier, independent website and system rules, and immutable semantics after use. Every evaluation persists the version identifier and reasons. Move rule configuration to PostgreSQL only after there is demonstrated need for editing without deployment or administrative management.

## 12. Cross-Cutting Requirements

- Every request and background operation carries a `requestId` or `correlationId` through logs, persistence orchestration, and error reporting.
- Logs and error-monitoring context use an allowlist and contain no PII, submission answers, credentials, tokens, cookies, or raw campaign values.
- Original accepted submissions are immutable. Corrections or later interactions create new records or explicit append-only events.
- Deduplication and lead consolidation are reversible linking operations separate from submissions. They never rewrite or delete original submission data.
- Neon connections use a Vercel-serverless-compatible strategy: Node.js runtime for persistence, the Neon serverless/pooled connection path, lazy client initialization, and no eager module-level connection that can break builds.

## Consequences if Accepted

The implementation plan can use exact Next.js App Router files, Drizzle migrations and repositories, Zod contracts, Vitest/Testing Library/Playwright suites, Clerk-protected administration, Vercel Web Analytics, versioned code-based qualification rules, and a Vercel/Neon deployment target. It must include resource-level authorization, correlation identifiers, PII-safe telemetry, immutable submissions, reversible lead links, and serverless-safe database initialization. Dependency installation, database provisioning, migrations, authentication configuration, deployment, and production operations remain unauthorized until separately approved.

## References

- [Next.js testing guidance](https://nextjs.org/docs/app/guides/testing)
- [Vercel Marketplace storage](https://vercel.com/docs/marketplace-storage)
- [Vercel Web Analytics](https://vercel.com/docs/analytics)
- [Vercel analytics privacy and compliance](https://vercel.com/docs/analytics/privacy-policy)
- [Clerk Next.js App Router quickstart](https://clerk.com/docs/nextjs/getting-started/quickstart)
