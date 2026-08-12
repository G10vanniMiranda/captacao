# Organic Lead Acquisition Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Project governance overrides skill recommendations: do not create worktrees, branches, commits, external resources, deployments, or migrations without the corresponding explicit human authorization.

**Goal:** Deliver one website-acquisition path and one custom-system-acquisition path from measurable entry through immutable submission, reversible lead consolidation, versioned qualification, protected commercial progression, and aggregate measurement.

**Architecture:** Use Next.js 16 App Router with structured TypeScript acquisition content and a client-side adaptive journey. Route Handlers call server-only orchestration and Drizzle repositories backed by Neon PostgreSQL; original submissions and evaluations are append-only, while lead association is a reversible link. Clerk authenticates `/admin`, but every protected read and mutation calls a server-side authorization boundary next to the resource.

**Tech Stack:** Next.js 16.3.0, React 19.2.8, TypeScript 5, Tailwind CSS 4, Neon PostgreSQL, Drizzle ORM, Zod, Clerk, Vercel Web Analytics, Vitest, React Testing Library, Playwright, Sentry before production.

## Global Constraints

- Preserve Acquisition, Journey, Submission, Lead, Qualification, and Commercial Progression as separate concepts.
- Collect essential data by default. Enable non-essential tracking only when technically useful and legally applicable, with consent when required.
- Do not encode a definitive legal conclusion in application behavior or documentation.
- Keep Clerk allowlist data server-side. `src/proxy.ts` is an optimistic filter, never the authorization boundary.
- Validate authentication and authorization inside every protected resource read and mutation.
- Keep qualification rules typed and versioned in code for this slice. Persist the rule version in every evaluation.
- Do not store qualification-band configuration in PostgreSQL in this slice.
- Do not inline investment thresholds inside evaluation logic.
- Propagate `requestId` or `correlationId` through orchestration, persistence, logs, responses, and error reporting.
- Logs, analytics, and error context contain no PII, original answers, secrets, cookies, tokens, or raw campaign values.
- Accepted submissions are immutable. Reclassification appends evaluations; it never overwrites history.
- Deduplication is deterministic, reversible, and separate from submissions. Never fuzzy-match or rewrite original submission data.
- Use the Node.js runtime and a lazy Neon serverless client suitable for Vercel. Do not open an eager connection during module evaluation.
- Do not generate arbitrary problem/solution/segment combinations. Ship exactly one website page and one system page.
- Do not build a CMS or CRM. Commercial progression is append-only contact, proposal, and contract events.
- Use observable red-green-refactor cycles. A passing build does not substitute for unit, integration, or browser evidence.

## Execution Gates

These gates do not block writing this plan, but they block the named implementation or release step:

1. **Dependency gate:** installing packages requires implementation-phase authorization.
2. **Database gate:** provisioning Neon and applying migrations require explicit authorization for a named local/test environment. Production migration remains protected.
3. **Commercial gate:** exact website and system investment thresholds must be supplied before activating `qualification-v1` or completing qualification acceptance tests.
4. **Content gate:** final commercial copy and stable public slugs must be approved before public release; this plan provides concrete draft copy for implementation and review.
5. **Privacy/legal gate:** production tracking mode, notice, retention, and consent requirements require product/legal approval.
6. **Admin gate:** Clerk project configuration and the approved server-side admin user IDs must be supplied before admin acceptance tests.
7. **Abuse gate:** a production-capable rate-limit mechanism and thresholds must be approved before exposing public submission endpoints.
8. **Sentry gate:** external Sentry configuration, secrets, and data-scrubbing review require separate authorization before production.
9. **Git gate:** every commit step below is optional and may run only after explicit commit authorization. Commit authorization never implies push.
10. **Deployment gate:** preview and production deployments remain protected and are not part of plan execution unless separately authorized.

## Planned File Map

```text
src/
├── app/
│   ├── api/journeys/route.ts
│   ├── api/journeys/[journeyId]/events/route.ts
│   ├── api/submissions/route.ts
│   ├── admin/actions.ts
│   ├── admin/leads/page.tsx
│   ├── admin/leads/[leadId]/page.tsx
│   ├── admin/metrics/page.tsx
│   ├── servicos/[slug]/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/journey/journey-form.tsx
├── db/client.ts
├── db/schema.ts
├── features/
│   ├── acquisition/content.schema.ts
│   ├── acquisition/pages.ts
│   ├── analytics/analytics-provider.tsx
│   ├── analytics/event-repository.ts
│   ├── analytics/tracking-policy.ts
│   ├── commercial/repository.ts
│   ├── intake/contracts.ts
│   ├── intake/service.ts
│   ├── journeys/repository.ts
│   ├── leads/deduplicate.ts
│   ├── leads/admin-data.ts
│   ├── leads/repository.ts
│   ├── metrics/repository.ts
│   ├── qualification/evaluate.ts
│   ├── qualification/repository.ts
│   ├── qualification/rules.ts
│   ├── qualification/types.ts
│   └── submissions/repository.ts
├── lib/auth/require-admin.ts
├── lib/observability/logger.ts
├── lib/observability/request-context.ts
└── proxy.ts
tests/
├── e2e/site-journey.spec.ts
├── e2e/system-journey.spec.ts
├── e2e/admin-authorization.spec.ts
├── integration/intake-service.test.ts
├── integration/immutability.test.ts
└── support/database.ts
drizzle/
├── 0000_vertical_slice.sql
└── 0001_immutable_records.sql
```

---

### Task 1: Establish the Authorized Test and Dependency Foundation

**Dependencies:** Dependency gate must be approved before execution.

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.mts`
- Create: `vitest.setup.ts`
- Create: `playwright.config.ts`
- Create: `.env.test.example`
- Create: `tests/smoke.test.ts`

**Interfaces:**

- Produces: `npm run test`, `npm run test:run`, `npm run test:integration`, and `npm run test:e2e`.
- Produces: `TEST_DATABASE_URL` as the only integration-test database input.

- [ ] **Step 1: Install runtime and development dependencies after authorization**

Run:

```powershell
npm install @neondatabase/serverless drizzle-orm zod @clerk/nextjs @vercel/analytics server-only libphonenumber-js
npm install -D drizzle-kit vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event vite-tsconfig-paths @playwright/test postgres dotenv-cli
```

Expected: `package.json` and `package-lock.json` change; no provider resource is created.

- [ ] **Step 2: Add deterministic test scripts**

Add to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:integration": "vitest run tests/integration",
    "test:e2e": "playwright test",
    "db:generate": "drizzle-kit generate",
    "db:migrate:test": "dotenv -e .env.test -- drizzle-kit migrate"
  }
}
```

- [ ] **Step 3: Configure Vitest and the first failing smoke test**

Create `vitest.config.mts`:

```ts
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
  },
})
```

Create `tests/smoke.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

describe('test harness', () => {
  it('runs deterministic assertions', () => {
    expect(1 + 1).toBe(2)
  })
})
```

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

Create `.env.test.example` with a deliberately non-routable example that cannot identify a real environment:

```dotenv
TEST_DATABASE_URL=postgresql://captacao_test:captacao_test@127.0.0.1:55432/captacao_test
```

- [ ] **Step 4: Run the harness evidence**

Run: `npm run test:run`

Expected: PASS with one smoke test and zero failures.

- [ ] **Step 5: Configure Playwright without running a deployment**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://127.0.0.1:3000', trace: 'on-first-retry' },
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
```

- [ ] **Step 6: Human-gated checkpoint**

Run `git diff --check` and `npm run test:run`. If explicit commit authorization exists, commit only Task 1 files; otherwise stop at the commit gate.

---

### Task 2: Add Correlation IDs and PII-Safe Structured Logging

**Dependencies:** Task 1.

**Files:**

- Create: `src/lib/observability/request-context.ts`
- Create: `src/lib/observability/request-context.test.ts`
- Create: `src/lib/observability/logger.ts`
- Create: `src/lib/observability/logger.test.ts`

**Interfaces:**

- Produces: `createRequestContext(request: Request): RequestContext`.
- Produces: `RequestContext = { requestId: string; startedAt: number }`.
- Produces: `logInfo(context, event, fields?)` and `logError(context, event, errorCode, fields?)`.
- Constraint: `fields` accepts only scalar values under an explicit safe-key allowlist.

- [ ] **Step 1: Write failing request-ID tests**

```ts
import { describe, expect, it } from 'vitest'
import { createRequestContext } from './request-context'

describe('createRequestContext', () => {
  it('preserves a valid inbound UUID', () => {
    const request = new Request('https://example.test', {
      headers: { 'x-request-id': '018f47a2-7438-7b6e-9d54-b0f90e601001' },
    })
    expect(createRequestContext(request).requestId).toBe(
      '018f47a2-7438-7b6e-9d54-b0f90e601001',
    )
  })

  it('replaces an unsafe inbound value', () => {
    const request = new Request('https://example.test', {
      headers: { 'x-request-id': 'email@example.test\nforged=true' },
    })
    expect(createRequestContext(request).requestId).toMatch(/^[0-9a-f-]{36}$/)
  })
})
```

Run: `npm run test:run -- src/lib/observability/request-context.test.ts`

Expected: FAIL because the module does not exist.

- [ ] **Step 2: Implement request context**

```ts
export type RequestContext = Readonly<{
  requestId: string
  startedAt: number
}>

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function createRequestContext(request: Request): RequestContext {
  const inbound = request.headers.get('x-request-id')
  return {
    requestId: inbound && UUID_PATTERN.test(inbound) ? inbound : crypto.randomUUID(),
    startedAt: Date.now(),
  }
}
```

- [ ] **Step 3: Write failing logger-redaction tests**

Test that `email`, `phone`, `answers`, `cookie`, `token`, and `campaignRaw` keys throw before any log is emitted, while `route`, `outcome`, `durationMs`, `pageId`, `intentId`, and `offerType` are accepted.

- [ ] **Step 4: Implement an allowlisted logger**

```ts
import type { RequestContext } from './request-context'

const SAFE_KEYS = new Set([
  'route',
  'outcome',
  'durationMs',
  'pageId',
  'intentId',
  'offerType',
  'eventType',
  'errorCode',
])

type SafeValue = string | number | boolean | null
type SafeFields = Readonly<Record<string, SafeValue>>

function assertSafe(fields: SafeFields) {
  for (const key of Object.keys(fields)) {
    if (!SAFE_KEYS.has(key)) throw new Error(`Unsafe log field: ${key}`)
  }
}

export function logInfo(
  context: RequestContext,
  event: string,
  fields: SafeFields = {},
) {
  assertSafe(fields)
  console.info(JSON.stringify({ level: 'info', event, requestId: context.requestId, ...fields }))
}

export function logError(
  context: RequestContext,
  event: string,
  errorCode: string,
  fields: SafeFields = {},
) {
  assertSafe(fields)
  console.error(
    JSON.stringify({ level: 'error', event, requestId: context.requestId, errorCode, ...fields }),
  )
}
```

- [ ] **Step 5: Verify and checkpoint**

Run: `npm run test:run -- src/lib/observability`

Expected: PASS. Run `git diff --check`; stop at the commit gate unless explicitly authorized.

---

### Task 3: Define Structured Acquisition Content and Tracking Policy

**Dependencies:** Tasks 1–2. Content gate must be reviewed before public release.

**Files:**

- Create: `src/features/acquisition/content.schema.ts`
- Create: `src/features/acquisition/pages.ts`
- Create: `src/features/acquisition/pages.test.ts`
- Create: `src/features/analytics/tracking-policy.ts`
- Create: `src/features/analytics/tracking-policy.test.ts`

**Interfaces:**

- Produces: `CommercialPage`, `OfferType`, `getCommercialPage(slug)`.
- Produces: exactly two stable pages: `site-profissional-v1` and `sistema-sob-medida-v1`.
- Produces: `shouldLoadWebAnalytics(policy, consent): boolean`.

- [ ] **Step 1: Write failing content-invariant tests**

```ts
import { describe, expect, it } from 'vitest'
import { commercialPages } from './pages'

describe('commercialPages', () => {
  it('contains one distinct page for each approved offer', () => {
    expect(commercialPages.map((page) => page.offerType).sort()).toEqual(['SITE', 'SYSTEM'])
    expect(new Set(commercialPages.map((page) => page.id)).size).toBe(2)
    expect(new Set(commercialPages.map((page) => page.intentId)).size).toBe(2)
  })
})
```

Run: `npm run test:run -- src/features/acquisition/pages.test.ts`

Expected: FAIL because content modules do not exist.

- [ ] **Step 2: Add the exact content contract**

```ts
import { z } from 'zod'

export const offerTypeSchema = z.enum(['SITE', 'SYSTEM'])

export const commercialPageSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+-v\d+$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  offerType: offerTypeSchema,
  intentId: z.string().min(1),
  problem: z.string().min(1),
  solution: z.string().min(1),
  segment: z.string().nullable(),
  title: z.string().min(1),
  description: z.string().min(1),
  headline: z.string().min(1),
  proposition: z.string().min(1),
  cta: z.string().min(1),
})

export type CommercialPage = z.infer<typeof commercialPageSchema>
export type OfferType = z.infer<typeof offerTypeSchema>
```

- [ ] **Step 3: Add the two concrete draft pages**

Use these stable identities and reviewable drafts in `pages.ts`:

```ts
export const commercialPages = commercialPageSchema.array().parse([
  {
    id: 'site-profissional-v1',
    slug: 'criacao-de-site-profissional',
    offerType: 'SITE',
    intentId: 'contratar-site-profissional',
    problem: 'presenca-digital-sem-conversao',
    solution: 'site-profissional-sob-medida',
    segment: null,
    title: 'Criação de site profissional sob medida',
    description: 'Planeje um site alinhado ao seu negócio e solicite um diagnóstico inicial.',
    headline: 'Um site profissional para transformar interesse em oportunidades',
    proposition: 'Diagnóstico orientado ao objetivo, funcionalidades, prazo e contexto atual do negócio.',
    cta: 'Solicitar diagnóstico do site',
  },
  {
    id: 'sistema-sob-medida-v1',
    slug: 'desenvolvimento-de-sistema-sob-medida',
    offerType: 'SYSTEM',
    intentId: 'contratar-sistema-sob-medida',
    problem: 'processo-operacional-limitante',
    solution: 'sistema-sob-medida',
    segment: null,
    title: 'Desenvolvimento de sistema sob medida',
    description: 'Estruture o problema operacional e solicite um diagnóstico para um sistema sob medida.',
    headline: 'Um sistema sob medida para resolver o processo que limita sua operação',
    proposition: 'Diagnóstico baseado no processo atual, usuários, integrações, prazo e investimento.',
    cta: 'Solicitar diagnóstico do sistema',
  },
])
```

- [ ] **Step 4: Define a non-legal tracking switch**

```ts
export type TrackingPolicy = 'disabled' | 'anonymous-approved' | 'consent-required'
export type AnalyticsConsent = 'unknown' | 'granted' | 'denied'

export function shouldLoadWebAnalytics(
  policy: TrackingPolicy,
  consent: AnalyticsConsent,
): boolean {
  if (policy === 'disabled') return false
  if (policy === 'anonymous-approved') return true
  return consent === 'granted'
}
```

Default `NEXT_PUBLIC_WEB_ANALYTICS_POLICY` to `disabled`. Enabling either other mode requires the privacy/legal gate; the name `anonymous-approved` records an approval decision rather than asserting a universal legal conclusion.

- [ ] **Step 5: Verify and checkpoint**

Run: `npm run test:run -- src/features/acquisition src/features/analytics/tracking-policy.test.ts`

Expected: PASS. Run `git diff --check`; stop at the commit gate unless explicitly authorized.

---

### Task 4: Implement Typed, Versioned Qualification Rules in Code

**Dependencies:** Tasks 1 and 3. Commercial gate blocks activation until exact thresholds are supplied.

**Files:**

- Create: `src/features/qualification/types.ts`
- Create: `src/features/qualification/rules.ts`
- Create: `src/features/qualification/evaluate.ts`
- Create: `src/features/qualification/evaluate.test.ts`

**Interfaces:**

- Produces: `QualificationRuleSet`, `QualificationInput`, `QualificationResult`.
- Produces: `evaluateQualification(input, rules)` as a pure function.
- Persists later: `rules.version`, result, reason codes, and evaluated non-PII facts.

- [ ] **Step 1: Write failing qualification behavior tests with explicit fixtures**

```ts
const rules = {
  version: 'qualification-test-v1',
  minimumInvestmentCents: { SITE: 1_000_000, SYSTEM: 3_000_000 },
} as const

it('qualifies a concrete site need with timing and compatible investment', () => {
  expect(
    evaluateQualification(
      { offerType: 'SITE', hasConcreteNeed: true, timing: 'WITHIN_90_DAYS', investmentCents: 1_500_000 },
      rules,
    ),
  ).toEqual({ qualified: true, reasons: [], ruleVersion: 'qualification-test-v1' })
})

it('retains missing timing and investment as explicit non-qualification reasons', () => {
  expect(
    evaluateQualification(
      { offerType: 'SYSTEM', hasConcreteNeed: true, timing: null, investmentCents: null },
      rules,
    ),
  ).toEqual({
    qualified: false,
    reasons: ['TIMING_MISSING', 'INVESTMENT_MISSING'],
    ruleVersion: 'qualification-test-v1',
  })
})
```

Run: `npm run test:run -- src/features/qualification/evaluate.test.ts`

Expected: FAIL because the evaluator does not exist.

- [ ] **Step 2: Implement exact types and pure evaluation**

Use reason codes `NEED_NOT_CONCRETE`, `TIMING_MISSING`, `INVESTMENT_MISSING`, and `INVESTMENT_BELOW_MINIMUM`. Return every applicable reason in stable order. Qualification is true only when the reason array is empty.

- [ ] **Step 3: Add the versioned production rule module without inventing commercial values**

`rules.ts` must export the type-safe factory:

```ts
export function defineQualificationRuleSet<const T extends QualificationRuleSet>(rules: T): T {
  return rules
}
```

Do not export an active production rule until the commercial gate supplies both integer cent values. When supplied, add one immutable object named `qualificationRulesV1` with version `qualification-v1`; its values must appear only in this module.

- [ ] **Step 4: Verify rule-version behavior**

Add a test proving two rule sets can classify the same input differently while each result retains its own version. Run the qualification test file and expect PASS.

- [ ] **Step 5: Human-gated checkpoint**

Record the commercial gate as open if values are absent. Run `git diff --check`; stop at the commit gate unless explicitly authorized.

---

### Task 5: Add the Neon/Drizzle Schema, Lazy Client, and Immutable-Record Guards

**Dependencies:** Tasks 1–2. Database gate required before applying migrations anywhere.

**Files:**

- Create: `drizzle.config.ts`
- Create: `src/db/schema.ts`
- Create: `src/db/client.ts`
- Create: `src/db/client.test.ts`
- Create: `drizzle/0000_vertical_slice.sql`
- Create: `drizzle/0001_immutable_records.sql`
- Create: `tests/support/database.ts`

**Interfaces:**

- Produces: `getDb()` with lazy Neon HTTP initialization.
- Produces tables: `journeys`, `journey_events`, `submissions`, `leads`, `lead_identities`, `lead_submission_links`, `deduplication_reviews`, `qualification_evaluations`, `commercial_events`.
- Constraint: `submissions` and `qualification_evaluations` reject update/delete at the database boundary.

- [ ] **Step 1: Write a failing lazy-initialization test**

Mock `@neondatabase/serverless` and verify importing `src/db/client.ts` does not call `neon()`, while the first `getDb()` call does and later calls reuse the same client.

- [ ] **Step 2: Implement serverless-safe initialization**

```ts
import 'server-only'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

function createDb() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not configured')
  return drizzle(neon(url), { schema })
}

let database: ReturnType<typeof createDb> | undefined

export function getDb() {
  database ??= createDb()
  return database
}
```

Route Handlers that call persistence must export `export const runtime = 'nodejs'`.

- [ ] **Step 3: Define the relational schema and constraints**

Use UUID primary keys with `defaultRandom()`, timezone-aware timestamps, and these required uniqueness rules:

- `journeys.id` primary key;
- `submissions.idempotencyKey` unique;
- `lead_identities(kind, normalizedValue)` unique;
- one active `lead_submission_links` row per submission via a partial unique index;
- `qualification_evaluations(submissionId, ruleVersion)` unique;
- `journey_events(journeyId, eventId)` unique.

Store original answers in `submissions.answers` JSONB and original contact fields in `submissions.contact` JSONB. Store only non-PII codes in journey events and qualification evaluated facts.

- [ ] **Step 4: Add database immutability guards**

Create `drizzle/0001_immutable_records.sql`:

```sql
CREATE FUNCTION reject_immutable_change() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION '% is immutable', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER submissions_are_immutable
BEFORE UPDATE OR DELETE ON submissions
FOR EACH ROW EXECUTE FUNCTION reject_immutable_change();

CREATE TRIGGER qualification_evaluations_are_immutable
BEFORE UPDATE OR DELETE ON qualification_evaluations
FOR EACH ROW EXECUTE FUNCTION reject_immutable_change();
```

- [ ] **Step 5: Add the isolated test-database helper**

`tests/support/database.ts` must refuse non-test URLs unless the database name ends in `_test`. It connects with the `postgres` test driver, runs only committed migrations, and truncates mutable test tables between cases. It must never accept a production hostname allowlist entry.

- [ ] **Step 6: Apply only to an explicitly authorized test database and verify**

Run after database authorization:

```powershell
npm run db:generate
npm run db:migrate:test
npm run test:integration -- tests/integration/immutability.test.ts
```

Expected: generated migration matches schema; update/delete attempts on immutable tables fail. No production resource is touched.

- [ ] **Step 7: Human-gated checkpoint**

Run `git diff --check`; stop at the commit gate unless explicitly authorized.

---

### Task 6: Implement Journey, Submission, and Append-Only Event Repositories

**Dependencies:** Tasks 2 and 5.

**Files:**

- Create: `src/features/journeys/repository.ts`
- Create: `src/features/submissions/repository.ts`
- Create: `src/features/analytics/event-repository.ts`
- Create: `tests/integration/repositories.test.ts`

**Interfaces:**

- `createJourney(input, context): Promise<{ journeyId: string }>`.
- `appendJourneyEvent(input, context): Promise<void>`.
- `insertSubmission(input, context): Promise<{ submissionId: string; duplicate: boolean }>`.
- No repository exports update/delete operations for submissions or events.

- [ ] **Step 1: Write failing integration tests**

Cover:

1. journey creation snapshots stable page/intent/offer codes;
2. event appends retain `correlationId` and contain no contact/answer fields;
3. the same idempotency key returns the original submission instead of inserting twice;
4. a different idempotency key creates another immutable submission for the same journey.

- [ ] **Step 2: Implement exact input contracts**

```ts
export type SubmissionInsert = Readonly<{
  journeyId: string
  idempotencyKey: string
  offerType: 'SITE' | 'SYSTEM'
  contact: Readonly<{ name: string; email: string; phone: string | null; company: string | null }>
  answers: Readonly<Record<string, string | number | boolean | null>>
}>
```

All functions accept `RequestContext` separately and persist only `context.requestId` as correlation data.

- [ ] **Step 3: Implement idempotent insertion and safe logs**

Use `onConflictDoNothing()` on `idempotencyKey`, then select the existing ID. Log only route, outcome, offer type, page ID, and duration; never serialize inputs.

- [ ] **Step 4: Verify repository behavior**

Run: `npm run test:integration -- tests/integration/repositories.test.ts`

Expected: PASS against the authorized isolated test database.

- [ ] **Step 5: Human-gated checkpoint**

Run `git diff --check`; stop at the commit gate unless explicitly authorized.

---

### Task 7: Implement Reversible Deterministic Lead Consolidation

**Dependencies:** Tasks 5–6.

**Files:**

- Create: `src/features/leads/deduplicate.ts`
- Create: `src/features/leads/deduplicate.test.ts`
- Create: `src/features/leads/repository.ts`
- Create: `tests/integration/lead-consolidation.test.ts`

**Interfaces:**

- `normalizeIdentity(contact): NormalizedIdentity[]`.
- `resolveLeadForSubmission(tx, submission, context): Promise<LeadResolution>`.
- `revokeLeadSubmissionLink(linkId, actorId, reason): Promise<void>` for authorized admin use later.
- `LeadResolution` is `CREATED`, `LINKED_EXACT`, or `REVIEW_REQUIRED`.

- [ ] **Step 1: Write failing normalization tests**

Test trimmed case-folded email and E.164 phone normalization. Reject malformed values through Zod before deduplication. Never log or return normalized values outside server-only repository code.

- [ ] **Step 2: Write failing conflict tests**

Cover zero candidates, one exact candidate, email and phone matching different leads, and a supplied identifier conflicting with the candidate lead. Assert that conflict creates a new lead plus `deduplication_reviews` row without rewriting either submission.

- [ ] **Step 3: Implement the deterministic algorithm**

```text
zero candidate leads
  -> create lead, attach normalized identities, create active submission link
exactly one candidate and no conflicting supplied identifier
  -> create active submission link with reason EXACT_IDENTITY
multiple candidates or any conflict
  -> create a new lead without claiming conflicting identities
  -> create active submission link with reason CONFLICT_ISOLATION
  -> append a deduplication review containing candidate lead IDs
```

Do not implement fuzzy matching. Revocation sets `revokedAt`, `revokedBy`, and `revokeReason`, then a later authorized operation may create a new active link.

- [ ] **Step 4: Verify reversibility and immutability together**

Run: `npm run test:integration -- tests/integration/lead-consolidation.test.ts tests/integration/immutability.test.ts`

Expected: PASS; revoking a link leaves the submission unchanged.

- [ ] **Step 5: Human-gated checkpoint**

Run `git diff --check`; stop at the commit gate unless explicitly authorized.

---

### Task 8: Orchestrate Atomic Submission, Lead Resolution, Qualification, and Events

**Dependencies:** Tasks 2, 4, 6, and 7. Commercial rule set must be active.

**Files:**

- Create: `src/features/intake/contracts.ts`
- Create: `src/features/intake/service.ts`
- Create: `src/features/qualification/repository.ts`
- Create: `tests/integration/intake-service.test.ts`

**Interfaces:**

- `submitIntake(input, context): Promise<SubmitIntakeResult>`.
- `SubmitIntakeResult = { submissionId; leadId; accepted: true; duplicate: boolean }`.
- Transaction order: submission → lead link/review → qualification evaluation → funnel event.

- [ ] **Step 1: Write failing orchestration tests**

Prove:

- a valid submission is retained when timing and investment are missing;
- its qualification is unqualified with both reason codes and `qualification-v1`;
- retrying an idempotency key does not duplicate lead, evaluation, or event;
- a transaction failure after submission insertion rolls back the entire operation;
- re-evaluating later appends a new evaluation version without updating the old one.

- [ ] **Step 2: Define and validate the public contract with Zod**

Use discriminated unions on `offerType`. Website answers include objective, site type, current situation, essential features, timing, and optional investment cents. System answers include operational problem, users, current process, known integrations, timing, and optional investment cents.

- [ ] **Step 3: Implement one Drizzle transaction**

The service receives the already-validated `RequestContext`; it never reads headers or logs payloads. The response omits qualification reasons and all stored contact values.

- [ ] **Step 4: Verify atomic behavior**

Run: `npm run test:integration -- tests/integration/intake-service.test.ts`

Expected: PASS with no duplicate rows on retry.

- [ ] **Step 5: Human-gated checkpoint**

Run `git diff --check`; stop at the commit gate unless explicitly authorized.

---

### Task 9: Expose Public Route Handlers with Validation, Correlation, and Abuse Preconditions

**Dependencies:** Tasks 2, 3, 6, and 8. Abuse gate must be resolved before public release.

**Files:**

- Create: `src/app/api/journeys/route.ts`
- Create: `src/app/api/journeys/[journeyId]/events/route.ts`
- Create: `src/app/api/submissions/route.ts`
- Create: `src/app/api/submissions/route.test.ts`

**Interfaces:**

- `POST /api/journeys` returns `{ journeyId, requestId }` with status 201.
- `POST /api/journeys/:journeyId/events` returns status 204 plus `x-request-id`.
- `POST /api/submissions` returns `{ accepted: true, submissionId, requestId }` with status 201.
- Validation failures return `{ error: { code: 'INVALID_INPUT' }, requestId }` without echoing input.

- [ ] **Step 1: Write failing handler tests**

Test invalid JSON, schema failure, valid creation, idempotent retry, response/request header correlation, maximum body size enforcement, and absence of input values in mocked logger calls.

- [ ] **Step 2: Implement the common handler pattern**

Each file exports `runtime = 'nodejs'`, creates `RequestContext` first, validates JSON with Zod, calls a service, sets `x-request-id`, and maps known domain errors to stable non-sensitive codes. Unknown errors log only `errorCode: 'UNEXPECTED'` and return status 500.

- [ ] **Step 3: Add essential abuse controls that require no new provider**

Reject bodies over 32 KiB, require a UUID idempotency key, validate allowed content types, include a hidden honeypot field that must be empty, and reject journey submissions that arrive earlier than a conservative client-measured interaction threshold. Do not treat these controls as a substitute for the production rate-limit gate.

- [ ] **Step 4: Verify route behavior**

Run: `npm run test:run -- src/app/api/submissions/route.test.ts`

Expected: PASS. Run `git diff --check`; stop at the commit gate unless explicitly authorized.

---

### Task 10: Build the Two Landing Pages and Adaptive Journey UI

**Dependencies:** Tasks 3, 4, and 9. Content gate must be reviewed before public release.

**Files:**

- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Create: `src/app/servicos/[slug]/page.tsx`
- Create: `src/components/journey/journey-form.tsx`
- Create: `src/components/journey/journey-form.test.tsx`

**Interfaces:**

- `JourneyFormProps = { pageId; intentId; offerType; steps; qualificationRuleVersion }`.
- Client state contains only current answers, `journeyId`, idempotency key, and non-PII step metadata.
- The browser sends contact/answers only to `/api/submissions`; analytics events never receive them.

- [ ] **Step 1: Write failing component tests**

For `SITE`, assert objective, site type, current situation, features, timing, investment, and contact steps. For `SYSTEM`, assert operational problem, users, current process, integrations, timing, investment, and contact steps. Assert accessible labels, error summaries, focus movement, back navigation, and that missing timing/investment can still submit.

- [ ] **Step 2: Implement the dynamic commercial route**

Use `generateStaticParams()` from the two slugs and `generateMetadata()` from validated content. Await `params` per Next.js 16 conventions. Unknown slugs call `notFound()`.

- [ ] **Step 3: Implement journey start and step events**

Create the journey after the visitor activates the CTA, not on page load. Send only `pageId`, `intentId`, `offerType`, `stepId`, and event type. Generate the submission idempotency UUID once and retain it across retries.

- [ ] **Step 4: Implement submission UX**

Show field-level and summary validation without exposing server details. On 201, replace the form with a neutral confirmation and the visible request ID for support. Do not display internal qualification status.

- [ ] **Step 5: Verify component behavior**

Run: `npm run test:run -- src/components/journey/journey-form.test.tsx`

Expected: PASS. Run `npm run lint`; expect exit 0.

- [ ] **Step 6: Human-gated checkpoint**

Run `git diff --check`; stop at the commit gate unless explicitly authorized.

---

### Task 11: Add Consent-Aware Vercel Web Analytics

**Dependencies:** Tasks 3 and 10. Privacy/legal gate controls the production mode.

**Files:**

- Create: `src/features/analytics/analytics-provider.tsx`
- Create: `src/features/analytics/analytics-provider.test.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**

- Reads `NEXT_PUBLIC_WEB_ANALYTICS_POLICY` with default `disabled`.
- Persists consent choice only for `consent-required` mode under `captacao:analytics-consent:v1`.
- Renders `<Analytics />` only when `shouldLoadWebAnalytics()` returns true.

- [ ] **Step 1: Write failing policy/UI tests**

Test disabled, anonymous-approved, consent-required unknown, granted, denied, and revocation. Assert that no PII or form state is passed to Vercel Analytics.

- [ ] **Step 2: Implement the client provider**

The provider renders no banner in `disabled` or `anonymous-approved`. In `consent-required`, it renders explicit accept/decline controls and stores only the choice, policy version, and timestamp. It supports revocation from a privacy control in the footer.

- [ ] **Step 3: Define the custom-event allowlist**

Allow only `journey_started`, `journey_step_viewed`, and `submission_accepted` with `pageId`, `intentId`, `offerType`, and `stepId`. Never include `journeyId`, `submissionId`, request ID, contact values, answers, or raw query parameters.

- [ ] **Step 4: Verify and checkpoint**

Run: `npm run test:run -- src/features/analytics`

Expected: PASS. Run `git diff --check`; stop at the commit gate unless explicitly authorized.

---

### Task 12: Add Clerk Authentication and Resource-Level Admin Authorization

**Dependencies:** Tasks 1, 5, and 7. Admin gate required for configured acceptance tests.

**Files:**

- Create: `src/proxy.ts`
- Create: `src/lib/auth/require-admin.ts`
- Create: `src/lib/auth/require-admin.test.ts`
- Create: `src/features/leads/admin-data.ts`
- Create: `src/features/commercial/repository.ts`
- Create: `src/app/admin/actions.ts`
- Create: `src/app/admin/leads/page.tsx`
- Create: `src/app/admin/leads/[leadId]/page.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**

- `requireAdmin(): Promise<{ userId: string }>` reads `ADMIN_USER_IDS` server-side.
- `listLeadSummariesForAdmin()` and `getLeadDetailForAdmin(leadId)` call `requireAdmin()` internally.
- `appendCommercialEventForAdmin(input)` calls `requireAdmin()` internally and appends only `CONTACTED`, `PROPOSAL_CREATED`, or `CONTRACTED`.
- Client components never receive the allowlist.

- [ ] **Step 1: Write failing authorization tests**

Mock Clerk `auth()` and cover unauthenticated, authenticated but absent from allowlist, and allowlisted user. Assert allowlist parsing rejects empty IDs and never references a `NEXT_PUBLIC_` variable.

- [ ] **Step 2: Implement the server-only boundary**

```ts
import 'server-only'
import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'

export async function requireAdmin() {
  const { userId } = await auth()
  const allowed = new Set(
    (process.env.ADMIN_USER_IDS ?? '').split(',').map((value) => value.trim()).filter(Boolean),
  )
  if (!userId || !allowed.has(userId)) notFound()
  return { userId }
}
```

Use `notFound()` to avoid confirming the existence of protected resources to unauthorized callers.

- [ ] **Step 3: Add optimistic Clerk proxy only**

`src/proxy.ts` uses `clerkMiddleware()` and matches `/admin(.*)`. Its test must prove protected data functions still deny access when proxy behavior is bypassed.

- [ ] **Step 4: Implement minimal DTOs and append-only commercial actions**

Admin list DTO exposes only lead ID, latest offer type, qualification result/reasons, created time, and last commercial state. Detail DTO adds contact and original submission answers only after `requireAdmin()`. The Server Action validates event input with Zod and delegates to the authorized repository; it does not trust hidden form fields for actor identity.

- [ ] **Step 5: Verify authorization near resources**

Run: `npm run test:run -- src/lib/auth src/features/leads/admin-data.test.ts src/features/commercial`

Expected: PASS; bypassing proxy cannot bypass resource authorization.

- [ ] **Step 6: Human-gated checkpoint**

Run `git diff --check`; stop at the commit gate unless explicitly authorized.

---

### Task 13: Add KPI and Funnel Projections Without Building a CRM

**Dependencies:** Tasks 5, 6, 8, and 12.

**Files:**

- Create: `src/features/metrics/repository.ts`
- Create: `src/features/metrics/repository.test.ts`
- Create: `src/app/admin/metrics/page.tsx`

**Interfaces:**

- `getQualifiedLeadsByPageAndIntentForAdmin(range)`.
- `getFunnelByOfferForAdmin(range)`.
- `getNonQualificationReasonsForAdmin(range)`.
- `getCommercialProgressionForAdmin(range)`.
- All functions call `requireAdmin()` and return aggregate DTOs without contact data.

- [ ] **Step 1: Write failing aggregate tests**

Seed two pages, repeated journeys, duplicate submission retries, qualified/unqualified evaluations, and commercial events. Assert the primary KPI counts distinct leads under their active reversible links and chosen evaluation version, not raw submissions.

- [ ] **Step 2: Implement aggregate queries**

Use explicit date bounds and stable page/intent/offer/reason codes. Do not add exports, filters beyond date/offer, free-text search, pipelines, assignments, notes, or CRM entities.

- [ ] **Step 3: Render the protected metrics page**

Use a Server Component that calls authorized aggregate functions. Render tables with headings and empty states. Do not ship raw event or submission payloads to the browser.

- [ ] **Step 4: Verify and checkpoint**

Run: `npm run test:integration -- src/features/metrics/repository.test.ts`

Expected: PASS. Run `git diff --check`; stop at the commit gate unless explicitly authorized.

---

### Task 14: Verify Both End-to-End Paths, Privacy Boundaries, and Accessibility

**Dependencies:** Tasks 9–13 plus authorized test database and Clerk test identities.

**Files:**

- Create: `tests/e2e/site-journey.spec.ts`
- Create: `tests/e2e/system-journey.spec.ts`
- Create: `tests/e2e/admin-authorization.spec.ts`
- Create: `tests/e2e/privacy.spec.ts`

**Interfaces:**

- Produces browser evidence for the complete website and system journeys.
- Produces negative evidence for unauthorized admin access and PII leakage.

- [ ] **Step 1: Write the website journey test**

Navigate to `/servicos/criacao-de-site-profissional`, start the journey, complete website fields, submit, and assert the confirmation plus request ID. Verify one submission, one lead link, one evaluation with `qualification-v1`, and expected non-PII events in the test database.

- [ ] **Step 2: Write the system journey test**

Navigate to `/servicos/desenvolvimento-de-sistema-sob-medida`, complete system-specific fields with missing timing or investment, submit successfully, and assert the captured lead remains with explicit unqualified reasons.

- [ ] **Step 3: Write authorization tests**

Assert anonymous and non-allowlisted users cannot retrieve admin list/detail or invoke commercial mutations, including direct endpoint/action access that bypasses `src/proxy.ts`.

- [ ] **Step 4: Write privacy and analytics tests**

Intercept analytics requests and server logs. Assert email, phone, name, company, original answers, journey ID, submission ID, cookies, tokens, and raw query parameters are absent. Test disabled and consent-required tracking modes.

- [ ] **Step 5: Run the full local verification suite**

Run:

```powershell
npm run test:run
npm run test:integration
npm run lint
npm run build
npm run test:e2e
```

Expected: every command exits 0. Report each command separately; do not collapse them into one PASS claim.

- [ ] **Step 6: Human-gated checkpoint**

Run `git diff --check` and review the complete diff. Stop at the commit gate unless explicitly authorized.

---

### Task 15: Add Sentry as a Pre-Production Error Boundary and Complete Release Gates

**Dependencies:** Task 14. Sentry and deployment gates remain separate protected/external actions.

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `next.config.ts`
- Create: `instrumentation-client.ts`
- Create: `src/instrumentation.ts`
- Create: `src/lib/observability/sentry.ts`
- Create: `src/lib/observability/sentry.test.ts`
- Update: `docs/SECURITY.md`
- Update: `docs/QUALITY.md`

**Interfaces:**

- `captureSafeError(context, errorCode, error)` sends request ID, route code, operation code, and sanitized error class only.
- Sentry receives no request bodies, form answers, contact data, cookies, authorization headers, raw URLs, or raw campaign parameters.

- [ ] **Step 1: Install Sentry only after its external-integration gate**

Run: `npm install @sentry/nextjs`

Do not run an interactive wizard against production or create a Sentry project without explicit authorization.

- [ ] **Step 2: Write failing scrubbing tests**

Mock Sentry transport and assert before-send scrubbing removes request data, cookies, user identity, breadcrumbs containing inputs, and disallowed tags. Assert `requestId` and stable error code remain.

- [ ] **Step 3: Implement allowlisted capture**

Use `sendDefaultPii: false`, disable automatic user-IP collection, and build event context from the same allowlist as structured logs. Do not pass the original error message when it may contain input; map known errors to stable classes and codes.

- [ ] **Step 4: Run pre-production gates without deploying**

Verify:

- commercial investment values approved and `qualification-v1` active;
- privacy/legal decision recorded for tracking mode and retention;
- admin IDs configured server-side in the target environment;
- production rate limiting selected and tested;
- Neon and Vercel regions reviewed;
- backup/recovery responsibilities documented;
- Sentry scrubbing test passes;
- all Task 14 commands pass against non-production resources.

- [ ] **Step 5: Stop before deployment**

Produce a deployment-readiness report. Do not deploy, promote, migrate production, change production environment variables, or write production data without explicit, operation-specific authorization.

## Plan Self-Review

- **Spec coverage:** Tasks 3 and 10 cover the two acquisition pages; Tasks 6–9 cover journey and immutable submission; Tasks 7–8 cover reversible lead consolidation and versioned qualification; Tasks 11 and 13 cover attribution/measurement; Task 12 covers minimum administration and commercial events; Tasks 2, 5, 9, 11, 12, 14, and 15 cover privacy, authorization, observability, and abuse boundaries.
- **Scope:** The plan produces one independently testable vertical slice and excludes CMS, CRM, page generation, predictive scoring, nurture, scheduling, free tools, CI, and production operations.
- **Known execution blockers:** exact investment thresholds, final commercial copy, privacy/legal production decisions, admin identities, production rate limiting, and external provider authorization are explicit gates rather than invented values.
- **Type consistency:** `OfferType`, `RequestContext`, `QualificationRuleSet`, `SubmitIntakeResult`, stable reason codes, and repository contracts are introduced before downstream use.
- **Authority:** Commit, push, branch, worktree, subagents, deployment, production migration, and production write are never implicitly authorized by this plan.
