# STEP-F2-049 Setup Evidence

Date: 2026-05-17
Step: STEP-F2-049 — Lighthouse audit + bundle analysis
Phase: Fase 2D — Quality (M20: Performance)
Status: Completed (Option B variant — setup + bundle analysis on laptop, full Lighthouse run deferred to non-laptop / CI)

## User Directive

> "B"
> Context: A = full implement + execute on laptop, B = setup tools + run lightweight bundle analysis only, skip Lighthouse run on laptop, C = skip step entirely.

This decision is consistent with the standing laptop policy in place since STEP-F2-041 (no headless-browser-heavy execution on operator laptop).

## Scope Verified

- Install `@lhci/cli` as a devDependency in `frontend/`.
- Configure Lighthouse CI via `frontend/lighthouserc.js` with the prompt's URL set, run count, and threshold matrix.
- Wire `npm run analyze` and `npm run analyze:ui` scripts using **Next.js Turbopack-native** `next experimental-analyze` (not `@next/bundle-analyzer`, which is not Turbopack-compatible).
- Keep `frontend/next.config.ts` clean (no plugin wrappers).
- Run `npm run analyze` to generate a bundle snapshot, capture top-chunk sizes, document them.
- Document setup, run instructions, and initial optimization recommendations in `frontend/LIGHTHOUSE.md`.

Out of scope:
- Executing the full Lighthouse audit on the operator laptop.
- Adjusting the codebase for performance/accessibility/SEO based on actual Lighthouse findings — the current step only sets up the audit infrastructure.
- Wiring Lighthouse CI into the GitHub Actions pipeline (consistent with the 5-job CI selected in STEP-F2-047).

## Files Changed

| File | Action |
|------|--------|
| `frontend/package.json` | Modified (devDep `@lhci/cli`; scripts `analyze`, `analyze:ui`, `lhci`) |
| `frontend/package-lock.json` | Modified (lockfile sync) |
| `frontend/lighthouserc.js` | Created (collect + assertions + temporary-public-storage upload) |
| `frontend/LIGHTHOUSE.md` | Created (setup, run instructions, bundle snapshot, recommendations) |
| `stepprompts/progress.md` | Modified (STEP-F2-049 → ✅ 2026-05-17, current step → STEP-F2-050, counters updated) |
| `docs/fase-2/STEP-F2-049-setup-evidence.md` | Created (this file) |

`frontend/next.config.ts` was left unchanged after a brief detour — see "Process Notes" below.

## Bundle Snapshot

Generated locally with `npm run analyze` (`next experimental-analyze -o`), output written to `frontend/.next/diagnostics/analyze`:

- Total client chunks: ~1.76 MB across all routes (uncompressed `.next/static/chunks/*.js`).
- Top heavy chunks:
  - ~424 KB and ~416 KB (PDF stack — likely pdfium runtime + render core).
  - ~222 KB.
  - ~146 KB.
  - ~110 KB.
  - Long tail under ~55 KB.

Detailed list and recommendations are in `frontend/LIGHTHOUSE.md`.

## Lighthouse CI Configuration

Defined in `frontend/lighthouserc.js`:

- URLs: `/`, `/compress`, `/merge`, `/protect`, `/pdf-to-word`.
- Server command: `npm run start`.
- Number of runs per URL: 3.
- Assertions:
  - Performance ≥ 0.90 (warn).
  - Accessibility ≥ 0.95 (error).
  - SEO ≥ 0.95 (error).
  - Best Practices ≥ 0.90 (warn).
- Upload target: `temporary-public-storage`.

Run instructions are documented in `frontend/LIGHTHOUSE.md`. The full Lighthouse run is **not** executed in this step because the operator laptop policy disallows headless-browser audits there.

## Validation Evidence

| Gate | Command | Result |
|------|---------|--------|
| Bundle analyzer | `npm run analyze` | "Analyze completed in 5.1s. Results written to .next/diagnostics/analyze" |
| Prettier | `npm run format:check` | All matched files use Prettier code style |
| ESLint | `npm run lint` | 0 errors, 14 warnings (pre-existing baseline) |
| Vitest | `npm run test` | 18 files / 530 tests passed |
| Backend Ruff lint | `ruff check .` | All checks passed (unchanged from STEP-F2-046) |
| Backend Ruff format | `ruff format --check .` | 51 files already formatted (unchanged from STEP-F2-046) |
| Backend Pytest | `pytest tests/ -q` | 208 passed (unchanged from STEP-F2-048) |
| `next.config.ts` shape | Read post-step | Clean — no plugin wrapper, identical to pre-step |

## Process Notes

The prompt template called for `@next/bundle-analyzer` wired through `next.config.ts`. That plugin still exists in the npm registry but is **incompatible with Turbopack** (Next.js 16 uses Turbopack as the default builder). When run, the `withBundleAnalyzer` wrapper printed:

> "The Next Bundle Analyzer is not compatible with Turbopack builds, no report will be generated. Consider trying the new Turbopack analyzer via `next experimental-analyze`."

The implementation switched to the built-in Turbopack analyzer (`next experimental-analyze`):

- Removed `@next/bundle-analyzer` from devDependencies.
- Reverted `frontend/next.config.ts` to the original minimal config.
- Replaced the `analyze` npm script to use `next experimental-analyze -o` (output mode, no interactive UI), and added `analyze:ui` for the interactive variant.

The end result satisfies the prompt's intent (a Turbopack-compatible bundle analyzer wired into npm scripts) without shipping a non-functional plugin into the codebase.

## Definition of Done Mapping

| Original DoD Item | Status under Option B |
|-------------------|----------------------|
| Bundle analyzer configured and run | ✅ `npm run analyze` works, snapshot captured. Implementation switched from `@next/bundle-analyzer` to Turbopack-native `next experimental-analyze` because the former is incompatible with Next.js 16's default builder. |
| Lighthouse CI configured with thresholds | ✅ `frontend/lighthouserc.js` matches prompt thresholds. |
| Scores documented (Performance >90, A11y >95, SEO >95) | Adjusted: scores not collected because full Lighthouse run is intentionally deferred (Option B). Run instructions are documented for execution in CI / non-laptop env. |
| Optimization recommendations listed | ✅ Initial recommendations in `frontend/LIGHTHOUSE.md` derived from the bundle snapshot; will be revisited after the first non-laptop Lighthouse run. |

## Docs Update Evidence

- `stepprompts/progress.md`:
  - `Current Step` → `STEP-F2-050`.
  - `Overall Progress` → `47 / 97 (48%)`.
  - Phase Summary 2D → `7 / 14 (50%)`.
  - TOTAL → `44 / 97 (45%)`.
  - `STEP-F2-049` → `✅ 2026-05-17`.

## Git / Push / Deploy Evidence

### 1) Completion Commits

> Filled after commit. Plan: 3 logical groups
> - chore: install `@lhci/cli` + add analyze/analyze:ui/lhci scripts.
> - feat: add `frontend/lighthouserc.js` Lighthouse CI configuration.
> - docs: `frontend/LIGHTHOUSE.md` + progress + this evidence doc.

### 2) Push

> Filled after push.

### 3) Deploy

- Pure tooling + docs change. No runtime code or production behavior changed.
- Vercel / Railway redeploy is functionally a no-op.

## Notes

- The bundle snapshot's heavy chunks are consistent with the PDF stack (`pdfjs-dist` + `pdf-lib`). Optimization will likely revolve around dynamic imports and ensuring tools that don't render PDFs in the browser don't pull the renderer worker.
- Lighthouse's accessibility error threshold of 0.95 is aggressive. When the audit eventually runs in CI/non-laptop env, expect first-pass failures on common items like missing `lang` on form inputs, color contrast, or missing image alt text. These will be triaged in a future step rather than chased in this one.
- `frontend/.next/diagnostics/analyze/` is a build artifact and should not be committed; it is implicitly ignored by `frontend/.gitignore` (`.next/`).
