# STEP-F2-042 Setup Evidence

Date: 2026-05-17
Step: STEP-F2-042 — E2E tests untuk client-side tools (Merge, Split, Rotate, Sign)
Phase: Fase 2D — Quality (M19)
Status: Completed (spec authored + Playwright list-mode verified; full execution intentionally skipped on operator laptop per user policy)

## Scope Verified

- 8 E2E test cases (2 per client-side tool) for Merge, Split, Rotate, Sign.
- Tests live in `frontend/e2e/client-tools.spec.ts`.
- Selectors taken directly from `frontend/src/app/{merge,split,rotate,sign}/page.tsx` source (Indonesian copy + real DOM structure).
- Existing helper file `frontend/e2e/helpers.ts` corrected because the placeholder `data-testid` selectors created in STEP-F2-041 do not match real DOM (none of the four pages expose `data-testid` attributes).

Out of scope:
- Server-side tools (those are STEP-F2-043).
- PDF-to-Excel / Image-to-PDF / navigation E2E (STEP-F2-044).
- Full Playwright execution on the operator laptop, per user instruction *"ei jangan e2e tes di laptop ku, meledak nanti, kalo bisa di skip aja"*.

## Files Changed

| File | Action |
|------|--------|
| `frontend/e2e/client-tools.spec.ts` | Created (8 test cases across 4 describe blocks) |
| `frontend/e2e/helpers.ts` | Modified (replaced non-existent `data-testid` selectors with stable text/role/structural selectors; added `waitForDownloadButton`; widened `verifyToolPageLoads`) |
| `stepprompts/progress.md` | Modified (STEP-F2-042 → ✅ 2026-05-17, current step → STEP-F2-043, counters updated) |
| `docs/fase-2/STEP-F2-042-setup-evidence.md` | Created (this file) |

## Test Coverage

8 unique tests; Playwright runs them on 3 projects (chromium / firefox / mobile-chrome) → 24 listed test invocations.

| Tool | Happy Path | Negative / Edge Case |
|------|------------|----------------------|
| Merge (`/merge`) | Upload `sample.pdf` + `single-page.pdf` → "Gabungkan PDF" → intercepts blob `download`, asserts `.pdf` filename, asserts "PDF berhasil digabungkan!" + "Unduh PDF Gabungan" CTA | "Gabungkan PDF" disabled with copy "Upload minimal 2 file PDF untuk menggabungkan." until ≥ 2 files selected |
| Split (`/split`) | Upload `sample.pdf`, fill `#page-range` with `1-2`, assert preview "(2 halaman)", click "Pisahkan PDF" → intercepts download, asserts `.pdf`, asserts "PDF berhasil dipisahkan!" | Range `99-100` triggers "melebihi total halaman dokumen" message and disables "Pisahkan PDF" |
| Rotate (`/rotate`) | Upload `sample.pdf`, click "Putar Semua 90°", click dynamic "Putar N halaman" CTA, assert "PDF berhasil diputar!", click "Unduh PDF" → intercepts download | Upload `single-page.pdf`, click "Putar Semua 180°", apply, download single-page rotation result |
| Sign (`/sign`) | Upload `single-page.pdf`, draw signature on `canvas[aria-label="Area menggambar tanda tangan"]`, "Gunakan Tanda Tangan", "Lanjut Tempatkan Signature", click center of placement canvas, "Tanda Tangani PDF" → intercepts download, asserts "PDF Ditandatangani" | After upload but with no placement, "Lanjut Tempatkan Signature" remains disabled |

Key selectors used (all matched against real source code):
- File inputs: `input[type="file"][multiple]` (merge), `input[type="file"]` first (split / rotate / shared `uploadPDF`), `input[type="file"][accept="application/pdf"]` (sign).
- Page-range input: `#page-range`.
- Drawing canvas: `canvas[aria-label="Area menggambar tanda tangan"]`.
- Action buttons: real Indonesian labels "Gabungkan PDF", "Pisahkan PDF", "Putar Semua 90°", "Putar N halaman", "Tanda Tangani PDF".
- Download CTAs: "Unduh PDF Gabungan", "Unduh PDF" (used by split & rotate).
- Download mechanism: `page.waitForEvent("download")` because the shared `downloadPDF()` helper fires a programmatic `<a>` click on a blob URL — there is no persistent `<a download>` element to scrape.

## Validation Evidence

### LSP Diagnostics

- `frontend/e2e/client-tools.spec.ts`: ✅ No diagnostics
- `frontend/e2e/helpers.ts`: ✅ No diagnostics

### Playwright Static Verification

- Command: `& "C:\Program Files\nodejs\node.exe" .\node_modules\@playwright\test\cli.js test e2e/client-tools.spec.ts --list`
- Result: **24 listings** across `chromium`, `firefox`, `mobile-chrome` projects (8 unique tests × 3 projects). All tests parsed successfully.
- This confirms TypeScript compiles, all imports resolve, and the spec file is structurally valid.

### Vitest Regression

- Command: `& "C:\Program Files\nodejs\node.exe" .\node_modules\vitest\vitest.mjs run --reporter=dot`
- Result: **18 test files passed, 530 tests passed** in ~1.53s. No regression from helpers.ts changes (helpers.ts is excluded from Vitest via the `**/e2e/**` exclude added in STEP-F2-041).

### Full E2E Execution

- **Skipped on operator laptop** per explicit user policy from STEP-F2-041 onward.
- Framework + spec are ready; full run can be performed in CI or on a dedicated environment via:
  - `npm --prefix frontend run test:e2e -- e2e/client-tools.spec.ts` (all browsers)
  - or `npx playwright test e2e/client-tools.spec.ts --project=chromium` (single browser)

## Definition of Done Mapping

| DoD Item | Status |
|----------|--------|
| 8 E2E tests created (2 per client-side tool) | ✅ |
| Merge: multi-file merge + no-files / one-file disabled state | ✅ |
| Split: page range happy path + invalid range error | ✅ |
| Rotate: 90° all-pages + single-page 180° rotation | ✅ |
| Sign: draw + place + apply + no-placement disabled state | ✅ |
| All tests pass on chromium | ⚠️ Static `--list` validation passed; full chromium execution skipped on operator laptop per user policy. Reserved for CI / non-laptop environment. |

## Docs Update Evidence

- `stepprompts/progress.md`:
  - `Current Step` → `STEP-F2-043`.
  - `Overall Progress` → `42 / 97 (43%)`.
  - Phase Summary 2D → `2 / 14 (14%)`.
  - TOTAL → `39 / 97 (40%)`.
  - `STEP-F2-042` → `✅ 2026-05-17`.

## Git / Push / Deploy Evidence

### 1) Completion Commit

> Filled after commit.

### 2) Push

> Filled after push.

### 3) Deploy

- Pure dev tooling change: only `frontend/e2e/**` and docs/progress affected.
- Production runtime is unaffected; Vercel/Railway redeploy is not impacted functionally.

## Notes

- helpers.ts came from STEP-F2-041 referencing `[data-testid="download-button"]` and `[data-testid="upload-zone"]`. Investigation while writing the spec confirmed those test IDs do not exist anywhere in the four client-side pages. The placeholder helpers are now replaced with stable Indonesian-text/role-based selectors and a structural file-input selector for `verifyToolPageLoads`.
- `downloadPDF()` (in `frontend/src/lib/pdfUtils.ts`) constructs a temporary `<a>` element, clicks it, and revokes the blob URL after ~100ms. `page.waitForEvent("download")` is the only reliable interception point.
- Sign tool is a state machine (idle → pdf-selected → placing-signature → signing → done). The happy-path test covers the full transition; the negative test stops at pdf-selected and asserts the disabled "Lanjut Tempatkan Signature" CTA.
- This step intentionally does not modify any production page or component. Only test infrastructure under `frontend/e2e/` is touched.
