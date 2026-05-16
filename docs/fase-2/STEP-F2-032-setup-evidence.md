# STEP-F2-032 Setup Evidence

## Step Info

| Field | Value |
|-------|-------|
| Step | STEP-F2-032 |
| Title | Backend — Create POST /api/pdf-to-word endpoint |
| Fase | 2C — Document Conversion (M16) |
| Refs | PAPYR-129, PAPYR-130, PAPYR-132 |
| Date | 2026-05-16 |

## Scope

- POST /api/pdf-to-word endpoint with 202 Accepted + async task pattern
- Shared PDF validator (reject encrypted, max 100 pages, max 20MB)
- Scanned PDF heuristic detection (< 10 chars per page → 400)
- Background LibreOffice headless conversion (subprocess, 120s timeout)
- DOCX upload to R2 + signed URL generation (3600s expiry)
- Task result with download_url, original_size, output_size, expires_at
- Polling via existing GET /api/status/{task_id}

## Files Changed

| File | Action |
|------|--------|
| `backend/routers/pdf_to_word.py` | Created (275 lines) |
| `backend/main.py` | Modified (added router import + include) |
| `backend/tests/test_api_pdf_to_word.py` | Created (287 lines, 13 tests) |
| `stepprompts/progress.md` | Modified (counters, current step, F2-032 row) |

## Validation Evidence

### Tests

- **Scoped tests**: 13/13 passed (`tests/test_api_pdf_to_word.py`)
- **Full backend suite**: 166/166 passed (0 failures)
- **Coverage**: ~92% for `routers/pdf_to_word.py` (scanned detection, validation, async task, conversion pipeline, error paths)

### Test Cases Covered

1. Valid PDF → 202 + task_id + status queued
2. Scanned PDF → 400 "scan, gunakan OCR"
3. Encrypted PDF → 400 "dilindungi kata sandi"
4. Too many pages (>100) → 400 "terlalu panjang"
5. File too large (>20MB) → 413 "terlalu besar"
6. Conversion success → download_url + sizes
7. LibreOffice timeout → RuntimeError
8. LibreOffice exit code nonzero → RuntimeError
9. Empty DOCX output → RuntimeError
10. LibreOffice not found → RuntimeError
11. No output file produced → RuntimeError
12. fitz.open exception in scan detection → returns False
13. Background task polling flow (202 → GET /api/status → 200 + 404)

### Non-Regression

- All existing backend tests pass (compress, protect, unlock, watermark, image-to-pdf, pdf-to-image, async-task)
- No changes to existing router behavior

## Docs Evidence

- `stepprompts/progress.md`: STEP-F2-032 marked ✅ 2026-05-16
- Current Step advanced to STEP-F2-033
- Overall Progress: 32/97 (33%)
- Fase 2C: 3/11 (27%)

## Git / Push / Deploy

### Commits

1. **a412d27** — `feat(fase2): add POST /api/pdf-to-word with async LibreOffice conversion`
   - Files: `backend/routers/pdf_to_word.py`, `backend/main.py`
   - Refs: PAPYR-129, PAPYR-130, PAPYR-132

2. **9bcf31d** — `test(fase2): add unit tests for pdf-to-word endpoint`
   - Files: `backend/tests/test_api_pdf_to_word.py`
   - 13 tests, 92% coverage

3. **b13705c** — `docs(fase2): mark STEP-F2-032 complete and add evidence`
   - Files: `stepprompts/progress.md`, `docs/fase-2/STEP-F2-032-setup-evidence.md`
   - Progress: 32/97 (33%), Fase 2C: 3/11 (27%)

### Push

- **Range**: `38c493e..b13705c main -> main`
- **Status**: ✅ Pushed successfully
- **Deploy**: Vercel auto-deploy triggered from main push
- **Timestamp**: 2026-05-16 14:21:29 UTC
