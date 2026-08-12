# Organic Lead Acquisition Platform — Design Specification

- Status: Approved product design and technical foundation
- Date: 2026-08-11

## Problem

The company needs organic acquisition that converts genuine search intent into diagnosable commercial opportunities for custom websites and software systems. A generic contact form cannot preserve intent, adapt qualification questions, explain why a lead qualified, or attribute later commercial outcomes to the page that originated demand.

## Objectives

- Convert commercial landing-page visits into qualified diagnosis or quotation requests.
- Separate website and system journeys early enough to ask relevant questions.
- Preserve original submissions while supporting consolidated leads and repeated journeys.
- Produce versioned, explainable qualification without losing historical evaluations.
- Attribute qualified leads and downstream outcomes to stable pages and intent.
- Prove the full model with one website page and one system page before expansion.

## Non-Objectives

The initial MVP is not a full CMS, proprietary CRM, broad programmatic SEO generator, predictive scoring system, extensive nurture platform, scheduling product, or free-tool suite. It will not introduce abstractions without demonstrated need.

## Audience

Primary visitors are organizations or professionals with a concrete need for a website or custom system. Internal commercial users need enough trusted context to assess, contact, propose to, and contract with captured leads. Product and marketing users need aggregate acquisition and funnel evidence without unnecessary PII exposure.

## Journey

```text
measurable visit
-> journey start
-> valid submission
-> lead
-> qualification
-> contact
-> proposal
-> contract
```

The journey branches into `SITE` or `SYSTEM`.

The website branch captures objective, site type, current situation, essential functionality, timing, and investment. The system branch captures operational problem, involved users, current process, known integrations or requirements, timing, and investment.

A valid submission is retained even when timing or investment is absent. Those omissions may make the captured lead unqualified under the active rules but do not discard it.

## Logical Components

1. **Acquisition:** structured commercial pages and origin context.
2. **Journey:** consent-aware interaction and step progression.
3. **Submission:** original validated answers and submission metadata.
4. **Lead:** consolidatable commercial identity linked to one or more submissions.
5. **Qualification:** immutable evaluation against a versioned rule set.
6. **Commercial Progression:** simple contact, proposal, contract, and revenue events.
7. **Measurement:** funnel and attribution projections without unnecessary PII.
8. **Minimum Administration:** a Clerk-authenticated internal route for viewing captured data and recording simple commercial progression, with server-side allowlist authorization enforced at each protected resource.

## Conceptual Model

Acquisition pages have stable identifiers and explicit intent, problem, solution, segment, and offer metadata when applicable. A page can originate many journeys. A journey can result in zero or more submission attempts, but only validated accepted payloads become submissions.

Submissions preserve original answers. Leads may consolidate multiple submissions through the approved deterministic, reversible linking policy. Qualification evaluations reference both the evaluated context and the exact immutable rule-set version. Reclassification appends an evaluation. Commercial events append progression rather than turning the MVP into a CRM.

## Qualification

Initial commercial qualification considers:

- a concrete need;
- timing;
- an investment band compatible with the selected offer.

Website and system investment bands are independent, configurable, and versioned. For the vertical slice, they live in a dedicated typed and versioned code module rather than PostgreSQL and are never inlined into qualification logic. Exact commercial values remain unapproved. Every evaluation stores result, reason codes, evaluated facts, rule-set version, and evaluation time. Later rule changes create a new code version and never rewrite an earlier evaluation. Database-backed configuration is deferred until editing without deployment or administrative management becomes a demonstrated need.

## Attribution

When available and appropriate, the platform preserves entry page, stable page identifier, intent, problem, solution, segment, offer type, campaign parameters, referrer, first origin, and last origin.

First and last origin have explicit precedence rules in the technical design. Attribution identifiers must not rely on fingerprinting. Essential data is collected by default. Non-essential tracking is enabled only when technically useful and legally applicable, with consent when required. The specification does not make a definitive legal classification; legal basis, consent requirements, retention, notices, and identifier classification require product/legal approval before production.

## Privacy and Security

- Collect only data necessary for conversion, qualification, attribution, and follow-up.
- Do not fingerprint or use invasive identification.
- Do not expose PII in logs, analytics, URLs, error messages, or unnecessary technical reports.
- Propagate a `requestId` or `correlationId` through server operations, persistence orchestration, logs, and error reporting without attaching PII.
- Validate public input server-side, limit abuse, and make accepted writes idempotent.
- Keep original accepted submissions immutable.
- Keep deduplication and lead consolidation reversible and separate from submissions.
- Restrict administrative data and actions with server-side authentication and resource-level authorization. Middleware or `proxy.ts` alone is not an authorization boundary; the allowlist remains server-side.
- Use a Neon connection strategy suitable for Vercel serverless execution: Node.js persistence runtime, pooled/serverless transport, and lazy client initialization.
- Define retention and data-subject handling before production use.

## Metrics

The primary KPI is commercially qualified leads by landing page and intent.

Supporting measures are conversion per stage, abandonment, website-versus-system distribution, non-qualification reasons, commercial progression, proposals, contracts, and attributable revenue when available.

## Vertical Slice

The first implementation delivers:

- one commercial website-development page;
- one commercial custom-system page;
- an adaptive website journey;
- an adaptive system journey;
- validated and persistent original submissions;
- separately consolidatable leads;
- versioned qualification;
- essential acquisition attribution;
- essential funnel measurement;
- simple commercial events;
- matching validation, authorization, abuse protection, consent, and PII controls.

The slice is complete only when both paths work end to end and the primary KPI can be derived by page and intent.

## MVP Limits

Only content and behavior needed to prove the two paths are included. New page combinations require distinct intent and specific commercial content. CMS, CRM, broad content generation, predictive scoring, extensive nurture, scheduling-first conversion, and unrelated tools remain outside scope.

## Risks

- Search-intent pages may become thin or duplicative if content governance is weak.
- Premature lead merging may corrupt attribution or erase distinct needs.
- Qualification bands may change before enough commercial evidence exists.
- Analytics choices may create consent or PII leakage risks.
- A minimum admin surface may accidentally expand toward a CRM.
- Provider choices may couple persistence, authentication, observability, and deployment.

## Approved Technical Foundation

| Decision | Approved baseline | Remaining gate |
|---|---|---|---|
| Database and persistence | Neon PostgreSQL, Drizzle, narrow repositories, serverless-safe lazy connection | Provisioning and any migration require separate authorization |
| Analytics | Authoritative first-party events plus Vercel Web Analytics | Custom event allowlist and privacy review before release |
| Consent | Essential collection by default; non-essential tracking only when applicable, with consent when required | Product/legal approval before production |
| Test stack | Vitest, React Testing Library, Playwright, disposable PostgreSQL test database | Test database provisioning during authorized implementation |
| Schema validation | Zod at every external boundary | Dependency installation during authorized implementation |
| Minimum administration | Clerk `/admin`, no public signup, server-side allowlist and resource-level authorization | Identity configuration and approved admin identities |
| Deployment | Vercel with a nearby compatible Neon region | Deployment remains protected |
| Observability | PII-safe structured logs; Sentry before production | Sentry configuration and privacy review |
| Deduplication | Exact deterministic identity matching with reversible links and conflict review | Final normalization and conflict rules tested before release |
| Structured content | Version-controlled TypeScript objects validated with Zod | Final commercial copy for the two pages |
| Investment bands | Typed versioned code rules; persist version ID per evaluation | Exact website and system ranges require commercial approval before qualification implementation |

## Specification Self-Review

- **FACT:** No placeholders or unbounded implementation directives are present.
- **FACT:** Product scope matches the approved two-path vertical slice.
- **FACT:** Conceptual entities remain separate and qualification history remains immutable.
- **FACT:** The technical baseline is approved; exact commercial investment ranges and production legal/privacy determinations remain explicit gates rather than implementation assumptions.
