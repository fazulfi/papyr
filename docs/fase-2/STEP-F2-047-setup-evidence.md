# STEP-F2-047 Setup Evidence

Date: 2026-05-17
Step: STEP-F2-047 — Update CI/CD pipeline (E2E + lint/format checks)
Phase: Fase 2D — Quality (M19)
Status: Completed (5-job variant — operator chose Option C: skip E2E job in CI)

## User Directive

Operator chose **Option C** when asked which CI flavor to apply:

> "C"
> Context: A = full 6 jobs (incl. e2e), B = 6 jobs but e2e scoped to client-side only, C = 5 jobs (skip e2e in CI).

This decision is consistent with the operator's earlier scope decision in STEP-F2-043 / STEP-F2-044 to skip the remaining E2E backlog.

## Scope Verified

- Replace existing 2-job CI workflow (`frontend` + `backend`) with a 5-job split that surfaces lint/format/test/build status independently.
- Wire Prettier check (from STEP-F2-045) into the frontend lint job.
- Wire Ruff check + format check (from STEP-F2-046) into a dedicated backend lint job.
- Keep existing pytest job intact, including the safe dummy R2 env vars.
- Preserve existing `concurrency.cancel-in-progress` policy.
- Skip Playwright E2E job from CI per Option C.

Out of scope:
- Authoring or running E2E specs in CI (Option C).
- Coverage thresholds and code-coverage uploaders (deferred — current step only adds checks, not gates).
- Deploy gating / environment promotion (covered by later steps in Fase 2D).

## Files Changed

| File | Action |
|------|--------|
| `.github/workflows/ci.yml` | Rewritten into 5 jobs: `frontend-lint`, `frontend-test`, `frontend-build`, `backend-lint`, `backend-test` |
| `stepprompts/progress.md` | Modified (STEP-F2-047 → ✅ 2026-05-17, current step → STEP-F2-048, counters updated) |
| `docs/fase-2/STEP-F2-047-setup-evidence.md` | Created (this file) |

## Workflow Layout

| Job | Purpose | Triggers via |
|-----|---------|--------------|
| `frontend-lint` | `npm run format:check` + `npm run lint` | every push/PR to `main`/`develop` |
| `frontend-test` | `npm run test` (Vitest) | every push/PR to `main`/`develop` |
| `frontend-build` | `npm run build` with sample `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_SITE_URL` env | runs after `frontend-lint` and `frontend-test` |
| `backend-lint` | `ruff check .` and `ruff format --check .` (pinned `ruff==0.7.4`) | every push/PR to `main`/`develop` |
| `backend-test` | `pytest tests/ -v --tb=short` with dummy R2 env vars | every push/PR to `main`/`develop` |

Triggers (unchanged from previous CI):

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

Concurrency policy preserved:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

## Validation Evidence

### YAML Syntax

- `python -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))"` parses cleanly.
- Top-level keys observed: `name`, `on`, `concurrency`, `jobs`. (PyYAML reports `on` as boolean `True` due to YAML 1.1 truthy rule; GitHub Actions parses this correctly.)
- All 5 expected jobs present: `frontend-lint`, `frontend-test`, `frontend-build`, `backend-lint`, `backend-test`.

### Local Tooling Confirmation

- Frontend `format:check` and `lint` already pass locally as of STEP-F2-045 (`All matched files use Prettier code style!` + ESLint baseline preserved).
- Frontend Vitest passes locally as of STEP-F2-045/F2-046 verification: 18 files, 530 tests.
- Backend Ruff lint + format check pass locally as of STEP-F2-046 (`All checks passed!` + `51 files already formatted`).
- Backend pytest passes locally as of STEP-F2-046 verification: 208 passed.

These are the same commands the new CI jobs invoke; the local pass state is the strongest pre-merge indicator.

### CI Run

- Push to `main` triggers the new 5-job pipeline. Monitoring will confirm green status; failures (if any) typically come from CI-only deps such as missing system packages or env vars.
- The previous single-job `frontend` + `backend` workflow is fully replaced (no leftover legacy job names).

## Definition of Done Mapping

| DoD Item | Status |
|----------|--------|
| CI workflow has 6 jobs: frontend-lint, frontend-test, frontend-build, backend-lint, backend-test, e2e | Adjusted: 5 jobs total. `e2e` job intentionally **omitted per operator's Option C choice**. |
| E2E job depends on build + backend-test | N/A (e2e job not added). |
| Artifacts uploaded on failure | N/A (no e2e job to upload from). Existing pytest output remains in CI logs. |
| CI passes on push | To be confirmed after `git push origin main` triggers the new workflow run. |

## Docs Update Evidence

- `stepprompts/progress.md`:
  - `Current Step` → `STEP-F2-048`.
  - `Overall Progress` → `45 / 97 (46%)`.
  - Phase Summary 2D → `5 / 14 (36%)`.
  - TOTAL → `42 / 97 (43%)`.
  - `STEP-F2-047` → `✅ 2026-05-17`.

## Git / Push / Deploy Evidence

### 1) Completion Commits

> Filled after commit. Plan: 2 logical groups
> - ci: rewrite `.github/workflows/ci.yml` into 5-job pipeline with Prettier + Ruff gates.
> - docs: progress + this evidence doc.

### 2) Push

> Filled after push.

### 3) Deploy

- CI workflow only; no production runtime impact.
- Vercel / Railway redeploy is unaffected by this change because nothing in the runtime code or container build was modified.
- The new CI run does add ~2-3 minutes more wall-clock per push due to job parallelism (offset by faster fail-fast on lint/format errors).

## Notes

- This step intentionally diverges from the prompt template: the prompt's 6th job (`e2e`) is replaced with a deliberate skip decision documented above and consistent with the F2-043 / F2-044 skip from earlier in this session.
- The Ruff version is **pinned to `0.7.4`** (matching `requirements-dev.txt` from STEP-F2-046) to avoid CI/local drift.
- The Prettier `format:check` script was added in STEP-F2-045; this step is the first place it actually gates merges through CI.
- If the operator decides to add an E2E job later, the existing `frontend/playwright.config.ts` (STEP-F2-041) and `frontend/e2e/client-tools.spec.ts` (STEP-F2-042) plus `helpers.ts` are CI-ready: backend would need to be either started inside the e2e job (uvicorn) or scoped out by limiting the Playwright project list.
