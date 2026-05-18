# STEP-F2-050 Setup Evidence

Date: 2026-05-18
Step: STEP-F2-050 — Performance optimization berdasarkan audit
Phase: Fase 2D — Quality (M20: Performance)
Status: Completed (Option B variant — conservative, audit-grounded changes only)

## User Directive

> "opsi B"
> Context: A = full implement (extract all tool pages to `components/tools/*`, dynamic-import wrappers, full Lighthouse rerun), B = conservative — apply only safe high-impact optimizations grounded in the actual codebase audit, document the rest, C = skip step entirely.

This decision keeps the policy line from STEP-F2-041 / F2-049 (no Lighthouse run on operator laptop) and avoids large refactors of pages that already pass 530 unit tests.

## Scope Verified

- Re-audit each item from the STEP-F2-049 recommendation list against the actual codebase. Apply only changes that are grounded in the audit, not in template assumptions.
- Touch as little code as possible; do not refactor working pages without a measured reason.
- Update `frontend/LIGHTHOUSE.md` to record what was already in place and what was changed.

Out of scope:
- Extracting `app/{merge,split,rotate,sign}/page.tsx` into `components/tools/*` wrappers.
- Replacing `URL.createObjectURL` blob `<img>` previews with custom `next/image` loaders.
- Re-running the full Lighthouse audit on the operator laptop.

## Audit-Driven Findings

| Recommendation (from F2-049) | Audit result | Action |
|---|---|---|
| `pdfjs-dist` dynamically imported | Already lazy: both consumers (`components/PDFPageViewer.tsx`, `components/WatermarkPreview.tsx`) call `await import('pdfjs-dist')` inside effects. Worker fetch only happens after user upload. | None needed |
| `pdf-lib` tree-shaken | Already named-import only across `lib/pdfUtils.ts`, `app/watermark/processing.ts`, `app/sign/apply-signature.ts`, plus tests. Each route bundles its own `pdf-lib` chunk on visit. | None needed |
| `@dnd-kit/*` per-tool footprint | Used by Merge, code-split per route. Not in homepage chunk. | None needed (further split = bigger refactor, deferred) |
| Replace `<img>` with `next/image` | One occurrence in `app/image-to-pdf/page.tsx:312` for `URL.createObjectURL()` blob preview. `next/image` requires stable dimensions or remote allow-list; blob URLs intentionally don't fit. | Left as-is, documented |
| Font setup with `display: swap` + `preload` | `next/font/google` was already used with DM_Sans, but `display` and `preload` were unset. | **Applied** |
| Theme inline script (FOUC risk) | Already inlined in layout. No FOUC observed locally. | Re-evaluate after real Lighthouse run |

## Files Changed

| File | Action |
|------|--------|
| `frontend/src/app/layout.tsx` | Modified (added `display: 'swap'` and `preload: true` to the `DM_Sans` import; everything else preserved) |
| `frontend/LIGHTHOUSE.md` | Updated — added "STEP-F2-050 Optimization Audit (2026-05-18)" section recording each recommendation's audit result and action. Header date bumped to 2026-05-18. |
| `stepprompts/progress.md` | Modified (STEP-F2-050 → ✅ 2026-05-18, current step → STEP-F2-051, counters updated) |
| `docs/fase-2/STEP-F2-050-setup-evidence.md` | Created (this file) |

Net code diff: 2 lines in `frontend/src/app/layout.tsx`.

## Validation Evidence

| Gate | Command | Result |
|------|---------|--------|
| Vitest | `npm run test` | 18 files / 530 tests passed |
| ESLint | `npm run lint` | 0 errors, 14 warnings (pre-existing baseline) |
| Prettier | `npm run format:check` | All matched files use Prettier code style |

CI run after push will exercise the same gates plus Backend Ruff + Pytest + Next.js build, expected to remain green.

## Definition of Done Mapping

| Original DoD Item | Status under Option B |
|-------------------|----------------------|
| Heavy libraries lazy loaded via dynamic import | Audit confirmed `pdfjs-dist` was already lazy-loaded; `pdf-lib` is tree-shaken via named imports per-route. No further change required for the high-cost libraries. |
| Critical font preloaded with `display: swap` | **Applied** to `frontend/src/app/layout.tsx`. |
| Images optimized with `next/image` | Adjusted: only one `<img>` exists in src tree, and it renders a `URL.createObjectURL()` blob preview that cannot move to `next/image` without an additional loader; documented as deferred. |
| LCP < 2.5s, Lighthouse Performance > 90 | Cannot verify in this step — full Lighthouse run is intentionally deferred to a non-laptop / CI environment per the standing policy. The `lhci autorun` command and config from STEP-F2-049 are unchanged and ready when run. |

## Docs Update Evidence

- `stepprompts/progress.md`:
  - `Current Step` → `STEP-F2-051`.
  - `Overall Progress` → `48 / 97 (49%)`.
  - Phase Summary 2D → `8 / 14 (57%)`.
  - TOTAL → `45 / 97 (46%)`.
  - `STEP-F2-050` → `✅ 2026-05-18`.

## Git / Push / Deploy Evidence

### 1) Completion Commits

> Filled after commit. Plan: 2 logical groups
> - perf: font directive + LIGHTHOUSE.md audit appendix.
> - docs: progress + this evidence doc.

### 2) Push

> Filled after push.

### 3) Deploy

- Tiny diff in production runtime (font directive flags only). Vercel redeploy will replace the build, but functional behavior of the production app is unchanged at the user-visible level.
- Backend / Railway is unaffected.

## Notes

- Most of this step's value is in the audit itself: the F2-049 recommendation list assumed the codebase needed several large fixes. The actual codebase already has lazy `pdfjs-dist` imports and named `pdf-lib` imports in place. Recording that explicitly in `LIGHTHOUSE.md` prevents future steps from "re-fixing" things that aren't broken.
- Real Core Web Vitals values (LCP / FID / CLS) require a Lighthouse run with Chromium against a production server. That gate stays available as `npm run lhci` whenever it is executed in CI / non-laptop env, with the same thresholds set up in STEP-F2-049 (Performance ≥ 0.90 warn, A11y / SEO ≥ 0.95 error, Best Practices ≥ 0.90 warn).
- The 14 ESLint warnings remain at the baseline established in STEP-F2-048; they are informational and do not gate CI.
