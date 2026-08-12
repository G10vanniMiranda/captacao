# Project Context

## Classification

- **FACT:** The repository is a minimal Next.js application created with Create Next App.
- **FACT:** The installed application stack is Next.js 16.3.0, React 19.2.8, TypeScript 5, Tailwind CSS 4, and ESLint 9.
- **DECISION:** This phase records approved product knowledge and an implementation plan; it does not implement the application.
- **ASSUMPTION:** The existing web application is the intended starting point for the MVP. This must be revalidated if another delivery surface is introduced.

## Product

The product is an organic lead-acquisition platform for a company that builds custom websites and software systems. Its primary conversion is a qualified request for diagnosis or quotation.

The commercial offers are:

- website development;
- custom software-system development.

The primary acquisition mechanism is a controlled set of commercial landing pages aligned with real search intent. Editorial candidates may combine problem, solution, and segment, but a page may exist only when it has distinct intent, specific content, a real commercial proposition, a stable identifier, and traceable acquisition context.

## Primary Journey

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

The journey separates website and system demand early. Website questions cover objective, site type, current situation, essential features, timing, and investment. System questions cover the operational problem, users, current process, known integrations or requirements, timing, and investment.

## Success

- **DECISION:** The primary KPI is commercially qualified leads by landing page and intent.
- **DECISION:** Supporting metrics include stage conversion, abandonment, website-versus-system distribution, disqualification reasons, commercial progression, proposals, contracts, and attributable revenue when available.
- **DECISION:** The first release proves one website page and one system page end to end before expanding the editorial matrix.

## MVP Boundaries

The MVP includes adaptive website and system journeys, persistent submissions, versioned qualification, essential attribution and measurement, validation, and corresponding privacy controls.

The MVP excludes a complete CMS, a proprietary CRM, broad programmatic page generation, predictive lead scoring, extensive nurture, scheduling as the primary conversion, free tools, and premature abstractions.

## Open Questions

- **OPEN QUESTION:** Which persistence technology and hosting provider will be used?
- **OPEN QUESTION:** Which analytics and consent strategy will be used?
- **OPEN QUESTION:** Which testing and schema-validation stack will be adopted?
- **OPEN QUESTION:** What is the minimum administrative access mechanism?
- **OPEN QUESTION:** Where will the application be deployed and how will it be observed?
- **OPEN QUESTION:** What exact deterministic lead-deduplication policy will apply?
- **OPEN QUESTION:** How will structured landing-page content be represented?
- **OPEN QUESTION:** How will commercial investment bands be managed and versioned?

