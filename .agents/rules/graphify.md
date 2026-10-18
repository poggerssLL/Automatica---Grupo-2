---
trigger: always_on
description: Consult the graphify knowledge graph at graphify-out/ for codebase and architecture questions.
---

## graphify

This project uses a local graphify knowledge graph at graphify-out/.

Rules:
- For codebase or architecture questions, when `graphify-out/graph.json` exists, first run `graphify query "<question>"` (CLI) or `query_graph` (MCP). Use `graphify path "<A>" "<B>"` / `shortest_path` for relationships and `graphify explain "<concept>"` / `get_node` for focused concepts. These return a scoped subgraph, usually much smaller than `GRAPH_REPORT.md` or raw grep output.
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context
- If the graph is missing or stale, use `graphify extract . --code-only --no-cluster` or `graphify update .`; do not invoke an external LLM or index private files without separate authorization.
- The code-only graph does not cover all documentation or images. Verify answers against source files and relevant tests; absence from the graph is not evidence of absence from the project.
- After modifying indexed code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost).
