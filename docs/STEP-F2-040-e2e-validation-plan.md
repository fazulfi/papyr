# STEP-F2-040 — Manual E2E Validation Plan
## Fase 2C Conversion Tools: /pdf-to-word, /ocr, /pdf-to-excel

**Date**: 2026-05-17
**Scope**: UI route load, upload validation, async-state UX, navigation/cross-link, console/network sanity, backend endpoint verification.
**Environment**: Production on `mypapyr.com` (Vercel frontend + Railway backend) OR local dev (`localhost:3000` + `localhost:8000`).

---

## Test Prerequisites

| Item | Description |
|------|-------------|
| ✅ Test PDF #1 | Small text-based PDF (<1 MB, 2-3 pages) |
| ✅ Test PDF #2 | Large PDF (~15 MB, 50+ pages) |
| ✅ Test PDF #3 | Scanned/Image-only PDF (no text layer) |
| ✅ Test PDF #4 | Table-containing PDF (for pdf-to-excel) |
| ✅ Test non-PDF file | e.g., `test.txt` or `test.jpg` |
| ✅ Test empty file | 0 byte file |
| ✅ Network tab open | Browser DevTools |
| ✅ Console tab open | Browser DevTools |
| ❌ = fail | Mark each row |

---

## 1. UI Route Load

Check that each tool page loads correctly with proper metadata, title, and description.

| # | Test Case | Tool | Pass Criteria | Evidence | Result |
|---|-----------|------|---------------|----------|--------|
| 1.1 | Navigate to `/pdf-to-word` | pdf-to-word | Page loads without error. H1 shows "PDF ke Word". Description text present. Icon visible. Upload dropzone visible. | Screenshot of full page | ❓ |
| 1.2 | Check page metadata (DevTools → `<head>`) | pdf-to-word | `<title>` contains "Konversi PDF ke Word (DOCX) - Papyr". `<meta name="description">` present. OG tags include correct URL and image path. | Console screenshot showing `<title>` + OG tags | ❓ |
| 1.3 | Navigate to `/ocr` | ocr | Page loads without error. H1 shows "OCR PDF". Language selection NOT visible yet (only after file select). Upload dropzone visible. | Screenshot of full page | ❓ |
| 1.4 | Check page metadata (DevTools → `<head>`) | ocr | `<title>` contains "OCR PDF — Konversi Gambar ke Teks (DOCX) - Papyr". OG url is `/ocr`. OG image is `/og/ocr.png`. | Console screenshot | ❓ |
| 1.5 | Navigate to `/pdf-to-excel` | pdf-to-excel | Page loads without error. H1 shows "PDF ke Excel". Description: "Ekstrak tabel dari file PDF". Upload dropzone visible. | Screenshot of full page | ❓ |
| 1.6 | Check page metadata (DevTools → `<head>`) | pdf-to-excel | `<title>` contains "Konversi PDF ke Excel (XLSX) - Papyr". OG url is `/pdf-to-excel`. OG image is `/og/pdf-to-excel.png`. | Console screenshot | ❓ |
| 1.7 | Verify robots + sitemap inclusion | all | Routes `/pdf-to-word`, `/pdf-to-excel`, `/ocr` present in `/sitemap.xml`. | Screenshot of sitemap content | ❓ |

---

## 2. Upload Validation

Test frontend and backend file validation for all three tools.

| # | Test Case | Tool | Pass Criteria | Evidence | Result |
|---|-----------|------|---------------|----------|--------|
| 2.1 | Upload a non-PDF file (.txt) | pdf-to-word | Error message displayed: `"<file>" bukan file PDF.` Upload zone stays visible. Network tab shows NO POST request to backend. | Screenshot of error + network tab | ❓ |
| 2.2 | Upload a non-PDF file (.txt) | ocr | Same error: `"<file>" bukan file PDF.` No POST to `/api/ocr`. | Screenshot | ❓ |
| 2.3 | Upload a non-PDF file (.txt) | pdf-to-excel | Same error: `"<file>" bukan file PDF.` No POST to `/api/pdf-to-excel`. | Screenshot | ❓ |
| 2.4 | Upload empty file (0 bytes) | pdf-to-word | Error: `"<file>" kosong.` No backend call. | Screenshot | ❓ |
| 2.5 | Upload empty file (0 bytes) | ocr | Same behavior. | Screenshot | ❓ |
| 2.6 | Upload empty file (0 bytes) | pdf-to-excel | Same behavior. | Screenshot | ❓ |
| 2.7 | Drag-and-drop non-PDF file | all | Drop event triggers same validation error. File input NOT populated. | Screenshot of drag-drop in progress + result error | ❓ |
| 2.8 | Drag-and-drop valid PDF | all | Drop zone highlights on dragover. On drop: file info card appears (name + size). | Short screen recording or sequential screenshots | ❓ |

---

## 3. Async-State UX

Test the full lifecycle: idle → file selected → submitting → queued/processing → done. Also test error path.

### 3.1 Happy Path (pdf-to-word)

| # | Test Case | Pass Criteria | Evidence | Result |
|---|-----------|---------------|----------|--------|
| 3.1a | Select valid PDF | Upload zone disappears. File info card appears with filename + size. "Konversi ke Word" button enabled. | Screenshot of file selected state | ❓ |
| 3.1b | Click "Konversi ke Word" | Button disabled immediately. Spinner appears. Status: "Mengunggah file PDF...". Network tab: POST `/api/pdf-to-word` with 202 response. | Network tab screenshot + UI screenshot | ❓ |
| 3.1c | Await processing state | Upload spinner transitions to progress bar. Shows "Dalam antrean" → "Sedang diproses" with 15% → 65% → higher % progress. Estimated time box appears. Network: polling GET `/api/status/{task_id}` every ~3s. | Network tab showing polling requests | ❓ |
| 3.1d | Conversion completes | Green checkmark appears. Result card shows: Ukuran asli, Ukuran output, Link berlaku (countdown). "Download File Word" link (opens new tab). "Konversi File Lain" button visible. | Screenshot of complete state | ❓ |
| 3.1e | Click "Download File Word" | New tab opens with file download. URL matches `result.download_url`. File downloads as `.docx`. | Screenshot of download tab + downloaded file | ❓ |
| 3.1f | Click "Konversi File Lain" | All state resets. Upload zone returns. File input cleared. | Screenshot of reset state | ❓ |

### 3.2 Happy Path (ocr)

| # | Test Case | Pass Criteria | Evidence | Result |
|---|-----------|---------------|----------|--------|
| 3.2a | Select valid scanned PDF | Upload zone disappears. File info card appears. Language selection radio buttons visible: "Bahasa Indonesia", "English", "Indonesia + English". Default: "Indonesia + English" selected. | Screenshot showing file + language selection + hint text | ❓ |
| 3.2b | Switch language to "English" | Radio selection changes visually. Selected option has accent border/background. | Screenshot | ❓ |
| 3.2c | Click "Ekstrak Teks (OCR)" | Button disabled. "Mengunggah file PDF..." spinner. POST `/api/ocr` with 202 response (check FormData includes `file` + `language` fields). | Network tab showing POST + FormData payload | ❓ |
| 3.2d | Processing state | Shows "Memproses OCR..." + progress bar + estimated time. Polling GET `/api/status/{task_id}`. | Screenshot | ❓ |
| 3.2e | OCR completes | Green checkmark. Result card shows: Ukuran asli, Ukuran output, Halaman diproses, Bahasa OCR, Link berlaku. "Download File Word" button. "OCR File Lain" button. | Screenshot of complete state | ❓ |
| 3.2f | Verify language shown in result | `result.language_used` matches selected language. | Screenshot of result card | ❓ |

### 3.3 Happy Path (pdf-to-excel)

| # | Test Case | Pass Criteria | Evidence | Result |
|---|-----------|---------------|----------|--------|
| 3.3a | Select valid table-PDF | File info card appears. "Konversi ke Excel" button enabled. | Screenshot | ❓ |
| 3.3b | Click "Konversi ke Excel" | POST `/api/pdf-to-excel` with 202. Progress states as above. | Screenshot | ❓ |
| 3.3c | Conversion completes | Result card shows: Ukuran asli, Ukuran output, Tabel ditemukan (number >0), Link berlaku. "Download File Excel" button. | Screenshot showing `tables_found` > 0 | ❓ |
| 3.3d | Verify XLSX download | Downloads as `.xlsx`. Contains one sheet per extracted table. | Screenshot of file in Excel | ❓ |

### 3.4 Error States

| # | Test Case | Tool | Pass Criteria | Evidence | Result |
|---|-----------|------|---------------|----------|--------|
| 3.4a | Attempt convert with invalid file (already shows error) | all | Button clickable but triggers re-validation error before API call. | Screenshot | ❓ |
| 3.4b | Network failure (disconnect before POST) | all | Error state shown: red alert box with error message. "Kembali" and "Coba Lagi" buttons visible. | Screenshot | ❓ |
| 3.4c | Upload scanned PDF to pdf-to-word | pdf-to-word | Backend returns 400: "PDF ini adalah scan, gunakan OCR terlebih dahulu." Red error box shown. Action buttons: "Kembali" + "Coba Lagi". | Screenshot of error state + network tab showing 400 response | ❓ |
| 3.4d | Upload text-layer PDF to OCR | ocr | Backend returns 400: "PDF sudah memiliki text layer". Error displayed. | Screenshot + network 400 | ❓ |
| 3.4e | Upload encrypted PDF | all | Backend returns 400: "PDF ini dilindungi kata sandi. Gunakan fitur Unlock terlebih dahulu." | Screenshot + network 400 | ❓ |
| 3.4f | Upload PDF over page limit (101+ pages to pdf-to-word) | pdf-to-word | Backend returns 400: page count exceeded. Error shown. | Screenshot + network 400 | ❓ |
| 3.4g | Upload PDF over page limit (51+ pages to ocr or pdf-to-excel) | ocr, pdf-to-excel | Backend returns 400: max 50 pages exceeded. | Screenshot + network 400 | ❓ |
| 3.4h | Click "Coba Lagi" after error | all | Error clears. Returns to file-selected state with same file. User can retry. | Screenshots before/after clicking retry | ❓ |
| 3.4i | Click "Kembali" after error | all | Error clears. Returns to initial upload zone. File deselected. | Screenshots before/after clicking kembali | ❓ |

---

## 4. Navigation & Cross-Link Checks

| # | Test Case | Pass Criteria | Evidence | Result |
|---|-----------|---------------|----------|--------|
| 4.1 | Desktop Navbar shows links | All three tool links present in navbar: "PDF ke Word", "PDF ke Excel", "OCR". Clickable and navigate correctly. | Screenshot of navbar | ❓ |
| 4.2 | Mobile hamburger menu | On <768px viewport, hamburger icon present. Clicking reveals nav links including the three tools. | Screenshot of mobile menu open | ❓ |
| 4.3 | OtherTools cross-links on pdf-to-word | Scroll to bottom of `/pdf-to-word`. Section "Alat lainnya" shows 12 tool cards (all except current). Includes "PDF ke Excel" and "OCR PDF". Each link navigates correctly. | Screenshot of OtherTools section | ❓ |
| 4.4 | OtherTools cross-links on ocr | Bottom of `/ocr` shows 12 tools. Includes "PDF ke Word" and "PDF ke Excel". | Screenshot | ❓ |
| 4.5 | OtherTools cross-links on pdf-to-excel | Bottom of `/pdf-to-excel` shows 12 tools. Includes "PDF ke Word" and "OCR PDF". | Screenshot | ❓ |
| 4.6 | Click cross-link while in done state | Navigates to target tool page. Target page loads in clean state (no residual state from previous tool). | Screenshot of target page at initial upload state | ❓ |
| 4.7 | Verify 404 not possible | Manual URL entry for `/pdf-to-word`, `/ocr`, `/pdf-to-excel` all resolve to valid pages. Typo URLs return 404 page. | Screenshots | ❓ |

---

## 5. Console & Network Sanity

| # | Test Case | Pass Criteria | Evidence | Result |
|---|-----------|---------------|----------|--------|
| 5.1 | No console errors on page load | Console has 0 errors (red), 0 uncaught exceptions. | Console screenshot for each tool | ❓ |
| 5.2 | No console errors during file selection | Selecting file produces no console errors. | Console screenshot | ❓ |
| 5.3 | No console errors during submission | POST request fires successfully. Console shows no errors. | Console + network screenshot | ❓ |
| 5.4 | No console errors during polling | Repeated GET `/api/status/{task_id}` calls all return 200. No CORS errors. No network failures. | Network tab screenshot showing successful polling cycle | ❓ |
| 5.5 | No console errors on completion | Transition to done state produces no errors. | Console screenshot | ❓ |
| 5.6 | All API calls to correct URL | POST to `/api/pdf-to-word`, `/api/ocr`, or `/api/pdf-to-excel`. GET to `/api/status/{task_id}`. No unexpected 404s. | Network tab full log | ❓ |
| 5.7 | Vercel Analytics events fire | `task_started` event fires on conversion click. `task_completed` fires on done. `task_failed` fires on error. Check via Vercel dashboard or network for `/_vercel/analytics` beacon. | Network tab filter for `analytics` or Vercel dashboard screenshot | ❓ |
| 5.8 | No JS runtime errors in any state | All 7 states (idle, file-selected, submitting, queued, processing, done, failed) produce zero console errors. | Console screenshots per state | ❓ |

---

## 6. Safe Backend Endpoint Verification

These checks verify backend endpoint behaviour **without executing the actual conversion** (safe GET/OPTIONS calls + status endpoint checks).

| # | Test Case | Endpoint | Pass Criteria | Evidence | Result |
|---|-----------|----------|---------------|----------|--------|
| 6.1 | OPTIONS preflight | `/api/pdf-to-word` | Returns 200 with CORS headers (`Access-Control-Allow-Origin`, `Allow: POST, OPTIONS`). | Network tab screenshot | ❓ |
| 6.2 | OPTIONS preflight | `/api/ocr` | Same CORS headers. | Network tab screenshot | ❓ |
| 6.3 | OPTIONS preflight | `/api/pdf-to-excel` | Same CORS headers. | Network tab screenshot | ❓ |
| 6.4 | OPTIONS preflight | `/api/status/{non-existent-id}` | Same CORS headers. | Network tab screenshot | ❓ |
| 6.5 | GET unknown task returns 404 | `GET /api/status/fakeid123` | Returns 404 with `{"detail": "Task not found"}`. | Screenshot of response | ❓ |
| 6.6 | GET known task returns structured response | `GET /api/status/{task_id}` (from a submitted job) | Response contains: `task_id`, `status`, `created_at`, `progress`, `result`, `error`, `metadata`. | Screenshot of response body | ❓ |
| 6.7 | POST without file returns 422 | `POST /api/pdf-to-word` with no body | Returns 422 validation error (FastAPI auto-validation). | Screenshot | ❓ |
| 6.8 | POST non-PDF file to pdf-to-word | `POST /api/pdf-to-word` with .txt file | Backend rejects at magic bytes check: `400` with detail about invalid PDF content. | Screenshot + network tab | ❓ |
| 6.9 | POST non-PDF file to ocr | `POST /api/ocr` with .txt file | Same 400 validation. | Screenshot | ❓ |
| 6.10 | POST non-PDF file to pdf-to-excel | `POST /api/pdf-to-excel` with .txt file | Same 400 validation. | Screenshot | ❓ |
| 6.11 | POST oversized file (>20MB) | pdf-to-word | Frontend validation blocks before POST. If bypassed, backend returns 413. | Screenshot | ❓ |

---

## 7. Edge Cases & Regression Safety

| # | Test Case | Pass Criteria | Evidence | Result |
|---|-----------|---------------|----------|--------|
| 7.1 | Rapid double-click "Konversi" button | all | Second click does nothing. Button is `disabled` while `isBusy`. Single POST request fired. | Network tab showing exactly 1 POST | ❓ |
| 7.2 | Navigate away mid-conversion, then return | all | Backend task continues in background. Returning via direct URL shows fresh page (no state restoration — expected). No orphaned polling. | Console: no errors from unmounted component | ❓ |
| 7.3 | Open tool in two browser tabs simultaneously | all | Each tab operates independently. No shared state contamination. Both can upload different files. | Screenshot of two tabs | ❓ |
| 7.4 | Refresh page during processing | all | Page reloads to initial upload state. No stale state. Backend task still completes (but frontend lost reference). | Screenshot of fresh page after refresh | ❓ |
| 7.5 | Verify OCR `/api/status/{task_id}` result fields | ocr | `result` object contains: `download_url`, `original_size`, `output_size`, `expires_at`, `pages_processed`, `language_used`. | Screenshot of polling response | ❓ |
| 7.6 | Verify pdf-to-excel `/api/status/{task_id}` result fields | pdf-to-excel | `result` object contains: `download_url`, `original_size`, `output_size`, `expires_at`, `tables_found`. | Screenshot of polling response | ❓ |
| 7.7 | Verify pdf-to-word `/api/status/{task_id}` result fields | pdf-to-word | `result` object contains: `download_url`, `original_size`, `output_size`, `expires_at`. | Screenshot of polling response | ❓ |
| 7.8 | PrivacyNotice renders on all tools | all | Shield icon + text: "File kamu otomatis dihapus setelah 1 jam. Kami tidak pernah menyimpan dokumenmu." visible at bottom of all states. | Screenshot | ❓ |

---

## 8. OCR-Specific: Language Selection Behaviour

| # | Test Case | Pass Criteria | Evidence | Result |
|---|-----------|---------------|----------|--------|
| 8.1 | Select "Bahasa Indonesia" only | `ind` | API POST includes `language: ind`. Result card shows "ind" or "Bahasa Indonesia" for `language_used`. | Network tab FormData + result screenshot | ❓ |
| 8.2 | Select "English" only | `eng` | Same verification. | As above | ❓ |
| 8.3 | Deselect (implicit — radio buttons always have one selected) | all | Default remains `ind+eng` if user never clicks. | Screenshot of default state | ❓ |

---

## Summary Table

| Section | Total Tests | Pass | Fail | Skipped |
|---------|-------------|------|------|---------|
| 1. UI Route Load | 7 | — | — | — |
| 2. Upload Validation | 8 | — | — | — |
| 3. Async-State UX | 27 | — | — | — |
| 4. Navigation & Cross-Link | 7 | — | — | — |
| 5. Console & Network Sanity | 8 | — | — | — |
| 6. Safe Backend Endpoint | 11 | — | — | — |
| 7. Edge Cases & Regression | 8 | — | — | — |
| 8. OCR Language Selection | 3 | — | — | — |
| **TOTAL** | **79** | **0** | **0** | **0** |

---

## Evidence Recording Instructions

For each test case, record:
1. **Screenshot** of the UI state with DevTools (Console + Network) visible
2. **Short screen recording** (~5-10s) for state transitions (file select → convert → processing → done)
3. **Console errors** — if any appear, capture full stack trace
4. **Network responses** — for error cases, expand the failing request to show request/response payload

**Naming convention**: `STEP-F2-040_{section#}_{test#}_{tool}_{state}.png`
Example: `STEP-F2-040_3.1c_pdf-to-word_processing.png`

---

*End of validation plan. All checks are read-only exploratory verification. No files were modified.*
