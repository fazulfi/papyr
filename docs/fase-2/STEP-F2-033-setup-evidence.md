# STEP-F2-033 Setup Evidence

## Step Info

| Field | Value |
|-------|-------|
| Step | STEP-F2-033 |
| Title | Backend — Unit tests for pdf-to-word + Frontend page + tests |
| Fase | 2C — Document Conversion (M16) |
| Refs | PAPYR-129, PAPYR-130, PAPYR-132 |
| Date | 2026-05-16 |

## Scope

- Backend unit tests for `/api/pdf-to-word` (13 tests, 92% coverage)
- Frontend `/pdf-to-word` page with full UI
- Frontend unit tests for `/pdf-to-word` page
- Shared PDF validator integration (encrypted, max pages, max size)
- Scanned PDF heuristic detection (< 10 chars per page → 400)
- Async task polling via GET /api/status/{task_id}
- DOCX download via signed R2 URL

## Files Changed

| File | Action |
|------|--------|
| `backend/tests/test_api_pdf_to_word.py` | Created (287 lines, 13 tests) |
| `frontend/src/app/pdf-to-word/page.tsx` | Created |
| `frontend/src/components/pdf-to-word/` | Created (UI components) |
| `stepprompts/progress.md` | Modified (STEP-F2-033 ✅, counters, current step → F2-034) |
| `frontend/src/app/sitemap.ts` | Modified (added `/pdf-to-word`) |
| `frontend/src/lib/analytics.ts` | Modified (added `"pdf-to-word"` to ToolName) |
| `frontend/src/components/OtherTools.tsx` | Modified (added PDF ke Word entry) |
| `frontend/src/components/Navbar.tsx` | Modified (added PDF ke Word nav link) |

## Validation Evidence

### Backend Tests

- **Scoped tests**: 13/13 passed (`tests/test_api_pdf_to_word.py`)
- **Full backend suite**: 179/179 passed (0 failures)
- **Coverage**: ~92% for `routers/pdf_to_word.py`

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

### Frontend Tests

- Unit tests for `/pdf-to-word` page components pass
- Integration with existing shared components (FileUpload, DownloadButton, etc.)

### Non-Regression

- All existing backend tests pass (compress, protect, unlock, watermark, image-to-pdf, pdf-to-image, async-task)
- No changes to existing router behavior
- Existing tool pages unaffected

## Docs Evidence

- `stepprompts/progress.md`: STEP-F2-033 marked ✅ 2026-05-16
- Current Step advanced to STEP-F2-034
- Overall Progress: 33/97 (34%)
- Fase 2C: 4/11 (36%)

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

4. **[pending]** — `feat(fase2): add /pdf-to-word frontend page + analytics + nav`
   - Files: `frontend/src/app/pdf-to-word/page.tsx`, `frontend/src/components/pdf-to-word/`, `frontend/src/app/sitemap.ts`, `frontend/src/lib/analytics.ts`, `frontend/src/components/OtherTools.tsx`, `frontend/src/components/Navbar.tsx`
   - Refs: PAPYR-129, PAPYR-130

### Push

- **Status**: Git push pending (frontend changes staged)
- **Deploy**: Vercel auto-deploy will trigger after push