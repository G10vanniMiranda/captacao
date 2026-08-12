# Security and Privacy Baseline

## Data Classification

- **DECISION:** Contact and company identifiers, questionnaire answers, commercial context, and free-text operational problems are potentially sensitive business or personal data.
- **DECISION:** Acquisition and analytics events must use stable non-PII identifiers wherever possible.
- **ASSUMPTION:** The product will operate under Brazilian privacy obligations. Legal review remains required before production processing.

## Privacy Rules

- Collect only fields necessary for diagnosis, qualification, attribution, and commercial follow-up.
- Do not fingerprint devices or construct invasive identifiers.
- Collect essential data by default. Load non-essential tracking only when technically useful and legally applicable, with consent when required.
- Preserve first and last origin only within the approved retention and consent model.
- Do not place PII in URLs, campaign parameters, analytics event properties, logs, traces, error messages, screenshots, or technical reports.
- Provide a defined retention, access, correction, and deletion process before production use.

## Application Controls

- Validate all external input at the server boundary using the approved schema strategy.
- Enforce authorization server-side for every administrative read or write.
- Apply rate limiting and abuse controls to public submission endpoints.
- Use idempotency protection so retries do not duplicate submissions or commercial events.
- Protect state-changing requests against cross-site request forgery where the chosen session model requires it.
- Render untrusted content safely; do not accept executable editorial content.
- Keep secrets in environment-specific secret storage and never commit or print them.
- Use least-privilege credentials and separate local, test, staging, and production resources.
- Treat middleware or `proxy.ts` as an early routing control only; authenticate and authorize next to every protected resource read and mutation using a server-side allowlist.
- Preserve original accepted submissions as immutable records and represent deduplication through reversible links.

## Logging and Observability

Every server operation should propagate a `requestId` or `correlationId`. Logs should contain that identifier, operation names, coarse outcomes, duration, and sanitized error classes. They must exclude form answers, contact values, raw campaign values that may contain PII, authentication tokens, cookies, and database credentials.

## Threats Required in the Implementation Plan

- automated spam and submission flooding;
- duplicate or replayed submissions;
- injection through form or content fields;
- unauthorized administrative access;
- cross-tenant or cross-lead data disclosure if tenancy is introduced;
- analytics or logs leaking PII;
- attribution tampering;
- qualification-rule changes without history;
- destructive reclassification or lead merging;
- consent state drift across visits.

## Open Questions

- **OPEN QUESTION:** Consent categories, retention periods, and lawful bases require product/legal approval.
- **OPEN QUESTION:** Administrative authentication and role model.
- **OPEN QUESTION:** Rate-limit provider and thresholds.
- **OPEN QUESTION:** Encryption, backup, recovery, and audit-log responsibilities of the selected persistence provider.
- **OPEN QUESTION:** Error-monitoring provider and its data-scrubbing configuration.
