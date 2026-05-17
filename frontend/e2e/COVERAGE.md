# Test Coverage Summary

Last updated: 2026-05-17

This document records the actual automated-test surface in `papyr/`. It is the
honest map of what the project's tests verify today, not the aspirational target
from the original Fase 2D backlog.

## Unit / Integration Tests

### Frontend (Vitest)

| Suite | Files | Tests | Status |
|-------|-------|-------|--------|
| Conversion pages (PDF-to-Word, OCR, PDF-to-Excel) | 3 | many (logic + UI rendering helpers) | All pass |
| Sign tool (apply-signature, placement-logic, signature pad/type, sign DOM helpers) | 6 | many | All pass |
| Other tool pages (protect, unlock, watermark) | 3 | many | All pass |
| PDFPageViewer + components (PasswordInput, etc.) | 2 | many | All pass |
| Library helpers (analytics, config, pdfUtils, format) | 3 | many | All pass |
| Page-level state machines (placement-state) | 1 | many | All pass |
| **Total** | **18 files** | **530 tests** | **All pass** |

Run: `npm run test` (frontend). All 530 tests pass with no warnings or skipped
tests as of STEP-F2-048 verification.

### Backend (Pytest)

| Suite | Tests | Status |
|-------|-------|--------|
| API endpoints (compress / image-to-pdf / pdf-to-image / pdf-to-word / ocr / pdf-to-excel) | many | All pass |
| Services (async task, encryption, compression, pdf-to-image) | many | All pass |
| Utils (PDF validator, edge cases, full flow, indonesia files, autodelete signed url) | many | All pass |
| Auth-flow style tests (protect, unlock, watermark) | many | All pass |
| **Total** | **208 tests** | **All pass** |

Run: `pytest tests/` (backend). 208 tests pass with no failures.

## End-to-End Tests (Playwright)

| Category | Tools | Tests | Status |
|----------|-------|-------|--------|
| Smoke (homepage + 13 tool pages) | All 13 tools | 2 | Authored, executed in CI / non-laptop env |
| Client-side | Merge, Split, Rotate, Sign | 8 (2 per tool) | Authored, executed in CI / non-laptop env |
| Server-side (sync) | Compress, Protect, Unlock, Watermark, PDF-to-Image | 0 | Intentionally skipped — see STEP-F2-043 evidence |
| Server-side (async) | PDF-to-Word, OCR | 0 | Intentionally skipped — see STEP-F2-043 evidence |
| Hybrid + Navigation | Image-to-PDF, PDF-to-Excel, cross-tool navigation | 0 | Intentionally skipped — see STEP-F2-044 evidence |
| **Total authored** | **5 tools (4 client-side + smoke)** | **10 unique tests** | Authored |

E2E spec files:

- `frontend/e2e/smoke.spec.ts` — homepage + 13 tool pages accessibility
- `frontend/e2e/client-tools.spec.ts` — Merge, Split, Rotate, Sign happy / negative paths
- Helpers: `frontend/e2e/helpers.ts`
- Fixtures: `frontend/e2e/fixtures/generate-fixtures.ts` (sample.pdf, single-page.pdf)

Run: `npm run test:e2e` (frontend). Static `--list` parses 30 invocations
(10 unique tests × chromium + firefox + mobile-chrome). Full execution is
intentionally not run on the operator laptop; CI also does not run the E2E job
per STEP-F2-047 Option C decision.

## Quality Gates (CI)

CI workflow `.github/workflows/ci.yml` runs 5 jobs on every push / PR to
`main` and `develop`:

1. `frontend-lint` — `npm run format:check` (Prettier) + `npm run lint` (ESLint)
2. `frontend-test` — `npm run test` (Vitest)
3. `frontend-build` — `npm run build` (Next.js production build)
4. `backend-lint` — `ruff check .` + `ruff format --check .` (pinned `ruff==0.7.4`)
5. `backend-test` — `pytest tests/ -v --tb=short`

E2E job is intentionally not part of CI — same Option C rationale.

## Local Verification Command Bundle

To replicate the exact gate set CI runs, plus a static E2E parse:

```bash
# Frontend
cd frontend
npm run format:check
npm run lint
npm run test
npm run build  # optional locally; Next.js build
npx playwright test --list  # static parse only; full run skipped on operator laptop

# Backend
cd ../backend
ruff check .
ruff format --check .
pytest tests/
```

## Tracking Decisions That Affected This Coverage Map

- **STEP-F2-040** (manual E2E for conversion tools) was completed by the
  operator after deploy/debug cycles; documented in
  `docs/fase-2/STEP-F2-040-setup-evidence.md`.
- **STEP-F2-041** added Playwright + smoke spec.
- **STEP-F2-042** added the client-side E2E spec (Merge/Split/Rotate/Sign).
- **STEP-F2-043** (server-side E2E) and **STEP-F2-044** (PDF-to-Excel /
  Image-to-PDF / Navigation E2E) were both **skipped by user request**.
  Evidence:
  - `docs/fase-2/STEP-F2-043-setup-evidence.md`
  - `docs/fase-2/STEP-F2-044-setup-evidence.md`
- **STEP-F2-047** chose the 5-job CI variant (Option C) — no `e2e` job in
  CI — consistent with the F2-043 / F2-044 skip.

This coverage document is intentionally not aspirational: it reports the
state that the test runners actually exercise today.
