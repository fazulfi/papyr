# STEP-F2-045 Setup Evidence

Date: 2026-05-17
Step: STEP-F2-045 — Setup Prettier untuk frontend
Phase: Fase 2D — Quality (M19)
Status: Completed

## Scope Verified

- Install Prettier + `eslint-config-prettier` as devDependencies in `frontend/`.
- Add `frontend/.prettierrc` with the standard config (semi, single quotes, tabWidth 2, trailingComma all, printWidth 100, lf line endings).
- Add `frontend/.prettierignore` covering build artifacts, lockfiles, and Playwright outputs.
- Update `frontend/eslint.config.mjs` to extend `eslint-config-prettier` so ESLint stops fighting Prettier on stylistic rules.
- Add `format` and `format:check` scripts to `frontend/package.json`.
- Reformat the entire frontend codebase (`src/**` + `e2e/**`) with Prettier.

Out of scope:
- Backend formatting (covered by STEP-F2-046 with Ruff).
- Pre-existing ESLint warnings/errors unrelated to formatting (left untouched; baseline preserved).

## Files Changed

| File | Action |
|------|--------|
| `frontend/package.json` | Modified (devDeps `prettier`, `eslint-config-prettier`; scripts `format`, `format:check`) |
| `frontend/package-lock.json` | Modified (lockfile sync for Prettier + eslint-config-prettier) |
| `frontend/.prettierrc` | Created |
| `frontend/.prettierignore` | Created |
| `frontend/eslint.config.mjs` | Modified (added `prettier` to extends array) |
| `frontend/src/**` | Reformatted (mass Prettier rewrite — no semantic changes) |
| `frontend/e2e/**/*.ts` | Reformatted |
| `stepprompts/progress.md` | Modified (STEP-F2-045 → ✅ 2026-05-17, current step → STEP-F2-046, counters updated) |
| `docs/fase-2/STEP-F2-045-setup-evidence.md` | Created (this file) |

## Validation Evidence

### Format Check

- `npm run format` reformatted 85 files where Prettier flagged style drift.
- `npm run format:check` (post-format): `All matched files use Prettier code style!` ✅

### ESLint

- Baseline (pre-Prettier): 2 errors, 17 warnings — all pre-existing, unrelated to formatting.
- After Prettier reformat: same 2 errors, 17 warnings. No new lint issues introduced. The two errors are pre-existing `prefer-const` issues in `src/app/sign/placement-logic.ts` and an internal `width` reassignment; the warnings are unused-imports/locals across multiple test files. None of these are caused by Prettier or scoped to STEP-F2-045.

### Vitest Regression

- Command: `& "C:\Program Files\nodejs\node.exe" .\node_modules\vitest\vitest.mjs run --reporter=dot`
- Result: **18 test files passed, 530 tests passed** in ~2.29s. No regressions from the mass reformat.

### Playwright Static Verification

- Command: `& "C:\Program Files\nodejs\node.exe" .\node_modules\@playwright\test\cli.js test --list`
- Result: **30 tests parsed across 2 spec files** (`smoke.spec.ts` + `client-tools.spec.ts`) on chromium / firefox / mobile-chrome. Reformatted spec files still parse correctly.

## Definition of Done Mapping

| DoD Item | Status |
|----------|--------|
| Prettier installed + configured | ✅ devDep + `.prettierrc` + `.prettierignore` |
| `npm run format:check` passes (zero issues) | ✅ "All matched files use Prettier code style!" |
| ESLint config updated (no conflicts) | ✅ `eslint-config-prettier` added to extends array |
| Seluruh frontend codebase terformat | ✅ `src/**` + `e2e/**` ran through Prettier |

## Docs Update Evidence

- `stepprompts/progress.md`:
  - `Current Step` → `STEP-F2-046`.
  - `Overall Progress` → `43 / 97 (44%)`.
  - Phase Summary 2D → `3 / 14 (21%)`.
  - TOTAL → `40 / 97 (41%)`.
  - `STEP-F2-045` → `✅ 2026-05-17`.

## Git / Push / Deploy Evidence

### 1) Completion Commits

> Filled after commit. Plan: 3 logical groups
> - chore: install Prettier + ESLint integration + scripts (`package.json`, `package-lock.json`, `eslint.config.mjs`, `.prettierrc`, `.prettierignore`).
> - style: mass reformat of `src/**` + `e2e/**` (no behavior changes).
> - docs: progress + this evidence doc.

### 2) Push

> Filled after push.

### 3) Deploy

- Pure tooling + formatting change. Production runtime is unaffected.
- Vercel/Railway redeploys will receive a no-op deploy from a behavior standpoint.

## Notes

- The mass reformat commit will look very large in the diff because Prettier rewrote whitespace, quotes, trailing commas, and line breaks across the project. Each individual file change is purely stylistic — no logic, control flow, exports, or runtime behavior was modified.
- The two pre-existing ESLint errors and 17 warnings predate this step and are intentionally left in place per scope discipline. They will be addressed where (and if) future steps target them.
- Backend formatting is a separate concern handled by STEP-F2-046 (Ruff). This step deliberately does not touch backend code.
- E2E test files (`frontend/e2e/**/*.ts`) are formatted as part of this step. Playwright still parses them correctly via `--list`. Full E2E runs remain skipped per the operator's standing policy on this laptop.
