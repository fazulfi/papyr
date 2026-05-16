# STEP-F2-035 Setup Evidence

## Step Info

| Field | Value |
|-------|-------|
| Step | STEP-F2-035 |
| Title | Backend — Create POST /api/ocr endpoint |
| Fase | 2C — Document Conversion (M17) |
| Refs | PAPYR-140, PAPYR-141, PAPYR-142, PAPYR-143 |
| Date | 2026-05-16 |

## Scope

**In scope:**

- POST /api/ocr endpoint with 202 Accepted + async task pattern
- Language support: Indonesian (`ind`), English (`eng`), and auto-detect (`ind+eng`)
- Shared PDF validator: reject encrypted PDFs, max 20 MB upload, max 50 pages
- Text-layer presence detection — reject PDFs that already contain selectable text (400 "PDF sudah memiliki text layer")
- OCR processing via ocrmypdf (Tesseract backend) with 180s async task timeout
- Result upload to Cloudflare R2 + signed URL generation (3600s expiry)
- Task result payload: `download_url`, `original_size`, `output_size`, `expires_at`, `pages_processed`, `language_used`
- Polling via existing GET /api/status/{task_id}

**Out of scope:**

- STEP-F2-036: backend tests integration with frontend
- `/ocr` frontend page (belongs to STEP-F2-036)
- Frontend unit tests for OCR page (belongs to STEP-F2-036)
- Sitemap update (belongs to STEP-F2-036)

## Files Changed

| File | Action |
|------|--------|
| `backend/routers/ocr.py` | Created (new OCR endpoint router + async task handler) |
| `backend/main.py` | Modified (added OCR router import + include) |
| `backend/tests/test_api_ocr.py` | Created (new test suite for OCR endpoint) |
| `stepprompts/progress.md` | Modified (counters, current step, F2-035 row) |
| `docs/fase-2/STEP-F2-035-setup-evidence.md` | Created (this file) |

## Validation Evidence

### Tests

- **Scoped tests**: **21/21 passed** (`tests/test_api_ocr.py` — 21 passed, 0 failed, 2 pre-existing warnings)
- **Full backend suite**: **187 passed, 2 warnings** (`pytest backend/tests/ -q`)
- **Coverage**: **94%** for `routers/ocr.py` (100 statements, 6 missed: 3 cleanup lines + 3 OSError guards)

### LSP Diagnostics

- **Status**: No new syntax/runtime issues on `backend/routers/ocr.py` and `backend/main.py`; local basedpyright still shows existing project-wide import/type warnings (same pattern as other backend routers).

### Non-Regression

- Existing backend regression suite expected to remain green after adding new router
- No modifications to existing router logic

## Git / Push / Deploy

### Commits

1. **(pending)** — `feat(fase2): add POST /api/ocr with async OCR conversion`
   - File: `backend/routers/ocr.py`
   - Refs: PAPYR-140, PAPYR-141, PAPYR-142, PAPYR-143

2. **(pending)** — `test(fase2): add backend unit tests for /api/ocr endpoint`
   - File: `backend/tests/test_api_ocr.py`
   - Coverage target: 94% scoped coverage verified

3. **(pending)** — `docs(fase2): mark STEP-F2-035 complete and add evidence`
   - Files: `stepprompts/progress.md`, `docs/fase-2/STEP-F2-035-setup-evidence.md`

### Push

- **Command**: `git push origin main`
- **Result**: _Pending finalization_
- **Status**: _Pending finalization_

### Deploy

- **Trigger**: Push to `main` expected to trigger Railway backend auto-build/deploy.
- **Status**: _Pending finalization_

## Notes

- ocrmypdf runs are mocked in unit tests; real OCR runtime validation occurs on Railway after deploy.
- Text-layer rejection prevents unnecessary OCR processing on PDFs that already contain selectable text, saving compute time and R2 storage.
- Async task pattern (202 + polling) matches existing STEP-F2-032 (pdf-to-word) and STEP-F2-031 (shared async task service) conventions.
- Indonesian and English language packs were installed in STEP-F2-034 (Tesseract + ocrmypdf infra); this step wires them into the `/api/ocr` endpoint.