# ADR-0001: Engineering Harness Governance

- Status: Accepted
- Date: 2026-08-11

## Context

The project uses agentic workflows and development methodologies that may recommend Git operations, worktrees, subagents, deployments, migrations, or external actions. Technical capability is not operational authority.

## Decision

- **DECISION:** Human authority and project governance take precedence over `AGENTS.md`, methodologies, plugins, skills, agents, tools, and quality gates in that order.
- **DECISION:** Commit, push, merge, deploy, production migration, production write, destructive operations, branch deletion, and worktree deletion remain protected operations requiring explicit and specific human authorization.
- **DECISION:** Local branch and worktree creation are conditional and require clear necessity within authorized scope.
- **DECISION:** Evidence is classified as `OBSERVED`, `INFERRED`, or `NOT VERIFIED`.
- **DECISION:** Preexisting worktree changes are preserved; unrelated work is not discarded or overwritten.
- **DECISION:** Superpowers workflows guide methodology but cannot grant authority or bypass Human Gates.

## Consequences

Plans may mention protected operations only as explicit Human Gates. They cannot be executed because a skill recommends them. Completion reports state which protected operations occurred. Production remains protected by default.

## Phase 3 Application

- **FACT:** `AGENTS.md` already contains the governing rules and its Next.js-managed block remains intact.
- **FACT:** Phase 3 authorizes documentation, specification, planning, README edits when necessary, and relevant ADRs.
- **DECISION:** Phase 3 does not authorize application implementation, dependency installation, worktrees, branches, subagents, commits, pushes, merges, deployment, migrations, or production changes.

