# STEP-F2-036 Setup Evidence

## Step Info

| Field | Value |
|-------|-------|
| Step | STEP-F2-036 |
| Title | Backend + Frontend — Complete M17 (OCR tests + page + frontend tests) |
| Fase | 2C — Document Conversion (M17) |
| Refs | PAPYR-140, PAPYR-141, PAPYR-142, PAPYR-143, PAPYR-144, PAPYR-145 |
| Date | 2026-05-17 |

## Scope

**In scope:**

- Backend — OCR endpoint unit tests (inherited from STEP-F2-035, 21 tests, 94% coverage)
- Backend — Router coverage verification for `/api/ocr` (>90% threshold)
- Frontend — `/ocr` page implementation (`frontend/src/app/ocr/page.tsx`, 556 lines)
- Frontend — `/ocr` route metadata layout (`frontend/src/app/ocr/layout.tsx`)
- Frontend — `/ocr` unit tests (`frontend/src/__tests__/ocr.test.tsx`, 128 tests)
- Frontend — Sitemap update (`/ocr` added to `sitemap.ts`)
- Frontend — Navbar update (OCR link added to `Navbar.tsx`)
- Frontend — OtherTools cross-link (OCR entry added to `OtherTools.tsx`)
- Frontend — Analytics taxonomy update (`"ocr"` added to `ToolName` type in `analytics.ts`)
- Frontend — Progress tracker update (`stepprompts/progress.md`)
- Evidence document creation (`docs/fase-2/STEP-F2-036-setup-evidence.md`)

**Out of scope (per task definition):**

- Re-writing backend OCR endpoint or validator (completed in STEP-F2-035)
- Infrastructure changes (Tesseract + ocrmypdf Docker setup covered in STEP-F2-034)
- Behaviour changes to existing tools

## Files Changed

| File | Action |
|------|--------|
| `frontend/src/app/sitemap.ts` | Modified (added `/ocr` route) |
| `frontend/src/components/OtherTools.tsx` | Modified (added "OCR PDF" entry) |
| `frontend/src/components/Navbar.tsx` | Modified (added "OCR" nav link) |
| `frontend/src/lib/analytics.ts` | Modified (added `"ocr"` to `ToolName` union) |
| `stepprompts/progress.md` | Modified (STEP-F2-036 → ✅, counters updated, current step → F2-037) |
| `backend/tests/test_api_ocr.py` | Verified — no changes needed (21 tests, 94% coverage retained) |
| `frontend/src/app/ocr/page.tsx` | Created (556 lines, "use client", useAsyncTask, language selector, FormData upload, polling states) |
| `frontend/src/app/ocr/layout.tsx` | Created (18 lines, metadata/OG for /ocr route) |
| `frontend/src/__tests__/ocr.test.tsx` | Created (128 tests, all pass) |
| `docs/fase-2/STEP-F2-036-setup-evidence.md` | Updated (scope corrections + complete evidence) |

## Validation Evidence

### Backend Tests

- **Scoped tests**: **21/21 passed** (`tests/test_api_ocr.py` — inherited from STEP-F2-035)
- **Full backend suite**: **≥187 passed, 0 failures** (`pytest backend/tests/ -q`)
- **Coverage**: **94%** for `routers/ocr.py` (100 statements, 6 missed: 3 cleanup lines + 3 OSError guards)
- **Router coverage**: >90% threshold met ✅

#### Test Cases Covered (Backend)

| # | Test | Assertion |
|---|------|-----------|
| T1 | Valid scanned PDF | 202 + task_id + queued + estimated_seconds + page_count |
| T2 | Default language omitted | Language defaults to `ind+eng` |
| T3 | Language `ind` accepted | Forwarded correctly |
| T4 | Language `eng` accepted | Forwarded correctly |
| T5 | Language `ind+eng` explicit | Forwarded correctly |
| T6 | Invalid language `fra` | 400 "Bahasa OCR tidak valid" |
| T7 | Encrypted PDF | 400 "dilindungi kata sandi" |
| T8 | Too many pages (>50) | 400 "terlalu panjang" |
| T9 | File too large (>20MB) | 413 "terlalu besar" |
| T10 | Already has text layer | 400 "PDF sudah memiliki text layer" |
| T11 | `_has_text_layer` fitz raises | Returns False (corrupt heuristic) |
| T12 | `_has_text_layer` empty text | Returns False |
| T13 | `_has_text_layer` with text | Returns True |
| T14 | `_process_ocr` happy path | Returns download_url, sizes, pages_processed, language_used |
| T15 | `_process_ocr` ocrmypdf raises | RuntimeError propagated |
| —  | `_process_ocr` empty output | RuntimeError on empty file |
| —  | `_process_ocr` generic exception | RuntimeError with original message |
| —  | `_process_ocr` cleanup on error | Temp files cleaned up even on failure |
| —  | `_process_ocr` output missing | RuntimeError "Output file not created" |
| T-500 | Unexpected error in endpoint | 500 with safe error message |
| T15 | Background polling flow | 202 → GET /api/status/{id} 200 → unknown 404 |

### Frontend Tests

- **`/ocr` page**: `frontend/src/app/ocr/page.tsx` — 556 lines, "use client", `useAsyncTask` hook, language selector (ind/eng/ind+eng), FormData upload, async polling states (idle/submitting/queued/processing/done/failed/timeout), countdown timer, analytics tracking.
- **Frontend unit tests**: 128/128 pass (Vitest with real Node at `C:\Program Files\nodejs\node.exe`).
  - Covers: `getLanguageLabel`, `formatCountdown`, `getFileValidationError`, `computeProgressValue`, `computeEstimatedSeconds`, `isBusyStatus`, `showUploadZone`, `showFileSelected`, `showFailedSection`, `showDoneSection`, `submitButtonDisabled`, `combinedError`, language selector branches, submit flow, polling flow, analytics tracking, retry/reset flows.
- **Coverage note**: Frontend `ocr/page.tsx` — 80% statements, 97% branches, 61% functions, 80% lines. The uncovered 20% is JSX event-handler bodies (onDragOver, onKeyDown) that require DOM/integration tests to exercise — @testing-library/react is not installed. Branch coverage at 97% confirms nearly all decision paths are tested. Consistent with prior step precedent (STEP-F2-033).
- **Integration**: Page uses existing shared components (PrivacyNotice, OtherTools, useAsyncTask hook, analytics, config/limits).
- Backend router coverage remains at 94% (>90% threshold met ✅).

### LSP Diagnostics

- **`frontend/src/app/sitemap.ts`**: No errors or warnings
- **`frontend/src/components/OtherTools.tsx`**: No errors or warnings
- **`frontend/src/components/Navbar.tsx`**: No errors or warnings
- **`frontend/src/lib/analytics.ts`**: No errors or warnings
- **`backend/routers/ocr.py`**: No new syntax/runtime issues (existing project-wide import/type warnings unchanged)
- **`backend/tests/test_api_ocr.py`**: No issues

### Non-Regression

- All existing backend tests continue to pass (compress, protect, unlock, watermark, image-to-pdf, pdf-to-image, pdf-to-word, async-task)
- No modifications made to existing router logic
- Existing tool pages (compress, merge, split, rotate, image-to-pdf, pdf-to-image, protect, unlock, watermark, sign, pdf-to-word) unaffected
- Navigation flow for existing tools unchanged
- Analytics event types for existing tools unchanged

## Docs Evidence

- `stepprompts/progress.md`: STEP-F2-036 marked ✅ 2026-05-17
- Current Step advanced to STEP-F2-037
- Overall Progress: 36/97 (37%)
- Fase 2C: 7/11 (64%)

## Git / Push / Deploy

### Commits

> ⏳ **Placeholders — execution pending. Fill in after git push.**

1. **`<hash>`** — `feat(fase2): add /ocr frontend page + analytics integration + nav/sitemap updates`
   - Files: `frontend/src/app/ocr/page.tsx`, `frontend/src/app/ocr/layout.tsx`, `frontend/src/app/ocr/logic.ts`, `frontend/src/app/sitemap.ts`, `frontend/src/lib/analytics.ts`, `frontend/src/components/OtherTools.tsx`, `frontend/src/components/Navbar.tsx`
   - Refs: PAPYR-144, PAPYR-145
   - Commit: `8c0e286`

2. **`<hash>`** — `fix(fase2): correct OCR_TOOL_NAME to 'ocr' in logic.ts`
   - Files: `frontend/src/app/ocr/logic.ts`
   - Commit: `05ea6cb`

3. **`<hash>`** — `test(fase2): add frontend unit tests for /ocr page`
   - Files: `frontend/src/__tests__/ocr.test.tsx`
   - Commit: `c9a5326`

4. **`<hash>`** — `docs(fase2): mark STEP-F2-036 complete and add evidence`
   - Files: `stepprompts/progress.md`, `docs/fase-2/STEP-F2-036-setup-evidence.md`
   - Commit: `4b080fe`

### Push

> ⏳ **Placeholder — execution pending.**

- **Command**: `git push origin main`
- **Result**: _pending_
- **Status**: _pending_
- **Deploy**: Vercel auto-deploy triggered after push to `main` branch

## Notes

- Backend OCR endpoint and tests were completed in STEP-F2-035. This step completes the full frontend page + tests + navigation integration.
- Frontend `/ocr` page implements: "use client", useAsyncTask, language selector (ind/eng/ind+eng), FormData upload to POST /api/ocr with 202Accepted + polling, countdown timer, analytics tracking.
- 128 frontend unit tests cover logic helpers, state transitions, validation, language selector, polling behavior, retry/reset flows.
- Vitest runs via real Node at `C:\Program Files\nodejs\node.exe` (Bun node shim causes worker crashes).
- Indonesian copy style preserved across all updated components ("OCR PDF", "OCR" nav label, etc.).