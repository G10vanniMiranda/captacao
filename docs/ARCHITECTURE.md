# Conceptual Architecture

## Scope

- **DECISION:** The vertical slice uses Next.js App Router, Neon PostgreSQL with Drizzle, Zod, Clerk, Vercel Web Analytics, and versioned TypeScript qualification/content configuration.
- **FACT:** These approved technologies are not currently installed or configured beyond the existing Next.js scaffold.

## Logical Components

### Acquisition

Owns landing-page identity and acquisition context: entry page, stable page identifier, intent, problem, solution, segment, offer type, campaign parameters, referrer, first origin, and last origin.

### Journey

Owns the consent-aware interaction that begins on an acquisition page and leads toward conversion. It records the website-or-system branch and measurable step transitions without requiring a submission to exist.

### Submission

Owns the original conversion payload and its validation outcome. Original answers are preserved. A submission is not automatically a lead.

### Lead

Owns a consolidatable commercial identity. One person or company may have multiple journeys and submissions. Consolidation must not erase source submissions or their acquisition context.

### Qualification

Owns immutable evaluations of a lead or submission against a versioned rule set. Reclassification creates another evaluation; it never overwrites history.

Initial qualification signals are concrete need, timing, and compatible investment range. Missing timing or investment does not discard a captured lead.

### Commercial Progression

Owns simple contact, proposal, contract, and attributable-revenue events. A complete CRM is outside the MVP.

### Measurement

Derives funnels and the primary KPI from acquisition, journey, submission, qualification, and commercial events. Analytics payloads must not expose unnecessary PII.

## Conceptual Relationships

```text
AcquisitionPage 1 ---- * Journey
Journey         1 ---- 0..* Submission
Lead            1 ---- 1..* SubmissionLink ---- 1 Submission
Submission      1 ---- * QualificationEvaluation
Lead            1 ---- * CommercialEvent
QualificationRuleSet 1 ---- * QualificationEvaluation
```

The relationship model is conceptual. Storage keys, database constraints, and exact cardinalities remain subject to the persistence decision.

## Data Invariants

- **DECISION:** Acquisition, Journey, Submission, Lead, Qualification, and Commercial Progression remain separate concepts.
- **DECISION:** Original submission answers and acquisition context are preserved.
- **DECISION:** Qualification rule version and evaluation history are immutable audit data.
- **DECISION:** Website and system investment bands are independently configurable in a typed, versioned code module for the vertical slice; every evaluation persists the rule version.
- **DECISION:** A missing deadline or budget may produce an unqualified lead but never suppresses valid capture.
- **DECISION:** Fingerprinting and invasive identification are prohibited.
- **DECISION:** Editorial pages require stable identifiers and distinct intent; combinations are not generated indiscriminately.

## Initial End-to-End Slice

1. Resolve one website page or one system page from structured content.
2. Start a consent-aware journey with essential acquisition context.
3. Route through the corresponding adaptive questionnaire.
4. Validate and preserve the original submission.
5. associate or create a lead under an approved deterministic policy.
6. Evaluate qualification against the active versioned rule set.
7. Record essential funnel and commercial events.
8. Report qualified leads by page and intent without leaking PII.

## Remaining Technical Gates

- **OPEN QUESTION:** Exact commercial investment ranges for website and system qualification.
- **OPEN QUESTION:** Production legal basis, consent requirements, notices, and retention.
- **OPEN QUESTION:** Final commercial copy and stable identifiers for the two landing pages.
- **OPEN QUESTION:** Approved administrative identities for the server-side allowlist.
