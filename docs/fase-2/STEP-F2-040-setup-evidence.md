# STEP-F2-040 Setup Evidence

Date: 2026-05-17
Step: STEP-F2-040 — Testing Manual E2E test Fase 2C (all conversion tools)
Status: Completed (manual E2E reported by operator after deploy/debug cycle)

## Scope Verified

- Manual E2E validation for Fase 2C conversion tools was completed by the operator.
- Tools covered:
  - `/pdf-to-word`
  - `/ocr`
  - `/pdf-to-excel`
- STEP-F2-040 validates the completed M16/M17/M18 conversion stack after backend, frontend, unit-test, and deploy fixes.
- No new feature scope was added in this step; fixes were limited to E2E-discovered bugs that blocked expected conversion behavior.

## Manual E2E Checklist

Operator-reported validation covered the STEP-F2-040 conversion flows:

| Area | Case | Result |
|------|------|--------|
| PDF-to-Word | Scanned PDF negative case shows OCR guidance and reset action | PASS |
| PDF-to-Word | `tugas_kuliah.pdf` converts to downloadable DOCX | PASS |
| PDF-to-Word | DOCX opens in Microsoft Word with usable preserved layout | PASS |
| OCR | OCR output remains PDF and is presented as searchable/selectable PDF, not Word | PASS after UI copy fix |
| OCR | OCR task no longer fails with `[object Object]` or missing `unpaper` runtime error | PASS after fixes/deploy |
| OCR | Searchable-text behavior verified by operator; remaining OCR limits are scan-quality dependent | ACCEPTED |
| PDF-to-Excel | `invoice_toko.pdf` converts to downloadable XLSX | PASS |
| PDF-to-Excel | XLSX opens with invoice metadata and full item table rows | PASS |
| PDF-to-Excel | Numeric Pandas headers (`0 1 2 3`) removed and columns readable | PASS |
| Navigation/UI | Conversion pages expose reset/retry/download actions clearly | PASS |

Operator final confirmation:

> `okelah e2e sepertinya sudah berhasil`

## E2E Defects Found and Fixed

Manual E2E surfaced several production/runtime issues. All were fixed and pushed before marking STEP-F2-040 complete:

1. **Async polling URL mismatch**
   - Symptom: `Gagal memeriksa status konversi.`
   - Fixes:
     - `63c685d` — `fix(frontend): poll async task status from api root`
     - `e8fd2e7` — `fix(frontend): pass status api base for conversion tools`

2. **Async worker task_id not forwarded**
   - Symptom: `_convert_pdf_to_docx() missing 1 required positional argument: 'task_id'`
   - Fix:
     - `423387c` — `fix(backend): forward task id to async workers`

3. **PDF-to-Word LibreOffice missing output fallback quality**
   - Symptoms: missing output file, then poor plain-text fallback layout
   - Fixes:
     - `40b6c90` — `fix(backend): use layout-aware PDF-to-Word fallback`
     - `c11d236` — earlier text fallback retained in history but superseded by `40b6c90`

4. **Conversion validation reset UI**
   - Symptom: selected invalid file had no clear "choose another file" action
   - Fixes:
     - `627a406` — `fix(frontend): add reset action for conversion validation errors`
     - `379608a` — `fix(frontend): show reset action in selected-file errors`

5. **OCR error serialization and copy mismatch**
   - Symptoms: `[object Object]` error; OCR UI said Word even though output is searchable PDF
   - Fixes:
     - `1e063ca` — `fix(frontend): submit OCR form data for polling`
     - `880e1d6` — `fix(frontend): clarify OCR searchable PDF output`

6. **PDF-to-Excel Camelot API and extraction quality**
   - Symptoms: `module 'camelot' has no attribute 'extract'`; first XLSX output missed main invoice table rows; later output had numeric headers/poor column sizing
   - Fixes:
     - `8e6b6b8` — `fix(backend): use Camelot read_pdf for Excel extraction`
     - `c5894c0` — `fix(backend): prefer lattice extraction for PDF-to-Excel`
     - `260ff6b` — `fix(backend): polish PDF-to-Excel workbook formatting`

7. **OCR quality and Railway memory constraints**
   - Symptoms: partial text selection in OCR output; then Railway OOM after heavy `unpaper` cleanup dependency
   - Fixes:
     - `db1bcef` — `fix(backend): improve OCR recognition settings`
     - `e7f9b21` — `fix(backend): install unpaper for OCR cleanup` (superseded)
     - `9ff3b99` — `fix(backend): avoid OCR cleanup dependency OOM`

## Automated Regression Evidence

During the E2E/debug cycle, targeted regression commands were repeatedly run after each fix. Final notable checks included:

- OCR backend tests: `22 passed`
- OCR frontend tests: `37 passed`
- PDF-to-Excel backend tests: `18 passed`
- Conversion frontend tests: `102 passed` where applicable during async/UI fixes
- Broader backend conversion suites passed during earlier fixes:
  - `63 passed` for OCR/PDF-to-Excel/async task targeted suite
  - `83 passed` for PDF-to-Word/OCR/PDF-to-Excel/PDF-to-Image targeted suite

Known note:

- Backend basedpyright diagnostics still report existing repo-wide implicit import/type-stub issues. Functional pytest/Vitest suites were used as the regression gate for this E2E step.

## Files Changed

- `stepprompts/progress.md` (updated)
- `docs/fase-2/STEP-F2-040-setup-evidence.md` (this file)

Production/runtime fixes from E2E were committed separately in the commits listed above.

## Docs Update Evidence

- `stepprompts/progress.md` updated:
  - `Current Step`: `STEP-F2-041`
  - `Overall Progress`: `40 / 97 (41%)`
  - Fase 2C summary: `9 / 11 (82%)`
  - TOTAL summary: `37 / 97 (38%)`
  - `STEP-F2-040` marked `✅ 2026-05-17`

## Git / Push / Deploy Evidence

### 1) Completion Commit

- `cf1d47d` — `docs(fase2): mark STEP-F2-040 manual E2E complete`
- Files: `stepprompts/progress.md`, `docs/fase-2/STEP-F2-040-setup-evidence.md`

### 2) Push

- Command: `git push origin main`
- Result: `9ff3b99..cf1d47d  main -> main`
- Status: pushed ✅

### 3) Deploy

- Push to `main` triggers Railway/Vercel deployment flows.
- Runtime conversion fixes were validated through user manual E2E after deploy iterations.

## Notes

- STEP-F2-040 is a manual E2E gate; completion is based on operator verification, not automated Playwright execution.
- Fase 2C conversion stack is accepted as usable for the tested sample files.
- Further OCR quality improvements may still be scan-quality and resource-limit dependent, but current behavior is accepted for this step.
