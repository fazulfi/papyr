# STEP-F2-048 Setup Evidence

Date: 2026-05-17
Step: STEP-F2-048 — Verify all tests pass + fix flaky tests
Phase: Fase 2D — Quality (M19)
Status: Completed (Option B variant — adapted scope to current 5-job CI and skipped E2E backlog)

## User Directive

When the prompt's original Definition of Done called for "Full CI pipeline green (all 6 jobs pass)" and "All 13 tools have E2E coverage", the operator chose **Option B** to adapt the scope:

> "b"
> Context: A = skip step entirely, B = adapt scope to actual current state (5 jobs in CI, E2E skipped per F2-043/F2-044), C = unwind earlier skips and implement full DoD.

This step therefore reports against the realistic gate set that exists today, while still requiring all of those gates to be green.

## Scope Verified

- Restore CI green status by fixing the two pre-existing `prefer-const` ESLint errors (`frontend/src/__tests__/PDFPageViewer.test.tsx` and `frontend/src/app/sign/placement-logic.ts`).
- Re-run all local quality gates (Prettier, ESLint, Vitest, Ruff lint, Ruff format, Pytest) and confirm all pass.
- Document the actual coverage map in `frontend/e2e/COVERAGE.md`, accurately reflecting the F2-043/F2-044 E2E skip and the F2-047 5-job CI choice.
- Update progress + create this evidence doc.

Out of scope:
- Authoring or running additional E2E specs (those are deferred per F2-043 / F2-044 skip decisions).
- Coverage thresholds or coverage uploaders (no change to gate strictness; only documentation).

## Files Changed

| File | Action |
|------|--------|
| `frontend/src/__tests__/PDFPageViewer.test.tsx` | ESLint `--fix` applied — `let currentPage` → `const currentPage` (no behavior change) |
| `frontend/src/app/sign/placement-logic.ts` | ESLint `--fix` applied — `let width` → `const width` (no behavior change) |
| `frontend/e2e/fixtures/generate-fixtures.ts` | Re-formatted by Prettier after ESLint `--fix` (whitespace only, no behavior change) |
| `frontend/e2e/COVERAGE.md` | Created — honest test coverage matrix |
| `stepprompts/progress.md` | Modified (STEP-F2-048 → ✅ 2026-05-17, current step → STEP-F2-049, counters updated) |
| `docs/fase-2/STEP-F2-048-setup-evidence.md` | Created (this file) |

## CI Investigation

Initial check via `gh run list --branch main --limit 3` showed CI had been failing on the previous 3 pushes (the docs commits for F2-045, F2-046, F2-047). All three failed at the **same** step inside the new `frontend-lint` job:

> `'width' is never reassigned. Use 'const' instead — frontend/src/app/sign/placement-logic.ts#256`

Root cause: STEP-F2-045 evidence had explicitly noted two pre-existing `prefer-const` errors and 17 warnings, and intentionally left them in place. STEP-F2-047 then introduced `npm run lint` as a hard CI gate. The combination of those two decisions surfaces the existing errors as build failures in CI.

Fix: ran `npm run lint -- --fix`, which auto-fixed both `prefer-const` violations safely. Both fixes are mechanical: a `let` declaration that is never reassigned becomes `const`. No control flow, types, or runtime behavior changes.

## Validation Evidence

Local replication of the CI gate set:

| Gate | Command | Result |
|------|---------|--------|
| Prettier | `npm run format:check` | All matched files use Prettier code style |
| ESLint | `npm run lint` | 0 errors, 14 warnings (all pre-existing unused-imports/locals; not gating) |
| Vitest | `npm run test` | 18 files / 530 tests passed |
| Ruff lint | `ruff check .` | All checks passed |
| Ruff format | `ruff format --check .` | 51 files already formatted |
| Pytest | `pytest tests/ -q` | 208 passed |

E2E:

- `npx playwright test --list` parses 30 invocations (10 unique tests × chromium + firefox + mobile-chrome).
- Full run intentionally not executed on operator laptop (laptop policy from STEP-F2-041 onward) and not part of CI (Option C from STEP-F2-047).

## Definition of Done Mapping

| Original DoD Item | Status under Option B |
|-------------------|----------------------|
| Full CI pipeline green (all 6 jobs pass) | Adjusted: 5 of 5 active jobs are green locally; CI run after this push will confirm. The 6th `e2e` job was intentionally omitted in STEP-F2-047. |
| Zero flaky tests | Local Vitest (530/530) and Pytest (208/208) deterministic across reruns; CI re-runs across 3 prior pushes failed for the same reproducible lint reason — not flake. |
| Test coverage documented | `frontend/e2e/COVERAGE.md` added |
| All 13 tools have E2E coverage | Adjusted: only Merge/Split/Rotate/Sign (4 client-side tools) are covered by authored Playwright specs; server-side, async, hybrid, and navigation E2E were skipped per STEP-F2-043 and STEP-F2-044 evidence. The coverage doc reports this honestly. |

## Docs Update Evidence

- `stepprompts/progress.md`:
  - `Current Step` → `STEP-F2-049`.
  - `Overall Progress` → `46 / 97 (47%)`.
  - Phase Summary 2D → `6 / 14 (43%)`.
  - TOTAL → `43 / 97 (44%)`.
  - `STEP-F2-048` → `✅ 2026-05-17`.

## Git / Push / Deploy Evidence

### 1) Completion Commits

> Filled after commit. Plan: 3 logical groups
> - fix(frontend): apply ESLint `--fix` for two `prefer-const` violations + re-format e2e fixture script.
> - docs(fase2): add `frontend/e2e/COVERAGE.md`.
> - docs(fase2): mark STEP-F2-048 complete and add evidence.

### 2) Push

> Filled after push.

### 3) Deploy

- Pure quality + docs change. Production runtime is unaffected.
- Vercel / Railway redeploy is functionally a no-op.

## Notes

- The two `prefer-const` errors had been recorded as known baseline in `STEP-F2-045-setup-evidence.md`, with a note that they would be addressed when a future step targeted them. STEP-F2-048 is that future step: its DoD requires the lint gate to be green, so leaving them in place is no longer compatible with scope.
- The 14 remaining ESLint warnings are all `@typescript-eslint/no-unused-vars` on test/component locals. Treated as informational; CI does not fail on warnings under the current ESLint config. They are not addressed here — keep scope minimal.
- The Prettier `format:check` failure on `e2e/fixtures/generate-fixtures.ts` after ESLint `--fix` was caused by the auto-fix touching whitespace inside that file; re-running Prettier `--write` once normalized it.
- The COVERAGE.md document deliberately diverges from the prompt template's aspirational matrix (which assumed 31 E2E tests across all tools). It records what the suite actually exercises today.
