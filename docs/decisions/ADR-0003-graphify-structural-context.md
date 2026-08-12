# ADR-0003: Graphify as Local Structural Context

- Status: Accepted for pilot use
- Date: 2026-08-11
- Evaluated version: Graphify 0.9.40

## Context

Agents need a small structural map of files, symbols, imports, dependencies, tests, and related configuration without treating generated context as authority. The project governance, specification, direct source inspection, tests, and quality gates remain authoritative in that order.

The pilot evaluated the official `Graphify-Labs/graphify` repository, its official documentation, and release 0.9.40. Graphify is a Python 3.10+ CLI distributed as the `graphifyy` package. Its AST code extraction is local, deterministic, and does not require an account, API key, embedding provider, vector store, MCP server, or hosted service.

## Decision

Use Graphify only as an on-demand, local structural index with these boundaries:

- install the pinned CLI in the ignored project-local `.graphify-tool/` virtual environment;
- do not run `graphify codex install` or `graphify install --platform codex`;
- do not install an assistant Skill, Codex hook, Git hook, MCP server, global graph, or background watcher;
- do not configure an LLM backend, API key, hosted Graphify service, Neo4j, FalkorDB, embeddings, or external persistence;
- build the initial graph with `graphify extract . --code-only --no-cluster`;
- use `graphify update . --no-cluster` for the local incremental code graph and lightweight local document structure;
- keep `graphify-out/` local and untracked because it is derived, reproducible state;
- keep `.graphifyignore` versioned as the project-specific exclusion boundary.

The selected installation is reversible: deleting the ignored virtual environment and derived output removes the local tool and index. Removal remains a deliberate local operation; it is not automated by hooks.

## Authority and Use

The required task flow is:

```text
Task
-> AGENTS.md and Human Gates
-> specification or plan
-> scoped Graphify query
-> direct file inspection
-> authorized implementation
-> tests
-> npm run verify
```

Use Graphify to identify likely files, symbols, imports, dependencies, related tests, and probable change impact. Prefer scoped commands such as `query`, `explain`, `path`, and `affected`.

Do not use Graphify as:

- authority to expand scope or perform an operation;
- a substitute for `AGENTS.md`, specifications, plans, direct inspection, textual search, tests, or verification;
- proof that a dynamic route, browser journey, runtime dependency, or security boundary is complete;
- justification for commit, push, merge, deployment, migration, production access, branch deletion, or worktree deletion.

Every material Graphify result must be classified against repository truth as `CORRECT`, `PARTIAL`, or `INCORRECT` before it guides edits.

## Privacy and Exclusions

The pilot uses no semantic model pass. Code is parsed locally with tree-sitter, and the incremental command reported that no LLM was needed. Graph files are stored under ignored `graphify-out/` as JSON plus local manifest/cache data.

`.gitignore` and `.graphifyignore` exclude environment files, secrets, credential files, private key and certificate formats, dependencies, build outputs, test artifacts, the Graphify environment/output, and the generated npm lockfile. The pilot must never use `--no-gitignore`.

Markdown headings may appear through Graphify's local lightweight document scan, but semantic document extraction remains disabled. Enabling semantic extraction, an external backend, a hosted service, HTTP MCP, database introspection, or any API key requires a new privacy and Human Gate review.

## Freshness Policy

- Before a task that benefits from structural context, run `graphify update . --no-cluster` and inspect its result.
- After imports, file layout, symbols, tests, or configuration change, run the same incremental command.
- After a large rename/delete, exclusion change, or suspicious shrink/growth, run `graphify update . --force --no-cluster`, then validate representative queries against direct inspection.
- A message that no graph changes were detected is freshness evidence only for the indexed corpus, not proof that the repository is correct.
- Do not add automatic hooks. Manual refresh keeps updates visible and avoids coupling graph writes to protected Git operations.

## Pilot Evidence and Limitations

The stabilized local graph indexed 24 files with nodes and produced 245 nodes and 238 relationships. It correctly located the `Home()` component, the colocated component test, their import relationship, the Vitest and Playwright configuration files, quality scripts, and the architecture document.

Known limitations:

- natural-language retrieval is label-sensitive; a generic `homepage` query missed the `Home()` symbol;
- the browser test references `/` rather than importing `Home()`, so Graphify did not connect `e2e/home.spec.ts` to the component;
- exact configuration values still require direct file inspection;
- unsupported or deliberately excluded files do not appear as graph nodes;
- the graph can be stale, incomplete, ambiguous, or wrong even when commands exit successfully.

The homepage change-impact pilot was therefore `PARTIAL`: Graphify found the component and unit-test dependency, while direct inspection additionally found the E2E smoke test and the relevant `test`, `test:e2e`, and `verify` gates.

## Multi-Agent Readiness

Future authorized subagents may receive a small Graphify result plus exact file paths instead of independently scanning the whole repository. They still inherit all Human Gates, must inspect cited files directly, and must not rely on the graph to broaden their scope. This pilot does not enable or dispatch subagents.

## References

- [Official repository](https://github.com/Graphify-Labs/graphify)
- [Official quickstart](https://graphify.com/docs)
- [Official CLI reference](https://graphify.com/docs/cli)
- [Official MCP tools reference](https://graphify.com/docs/mcp-tools)
- [Official releases](https://github.com/Graphify-Labs/graphify/releases)
