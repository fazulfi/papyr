# STEP-F2-041 Setup Evidence

Date: 2026-05-17
Step: STEP-F2-041 — Setup Playwright di frontend project
Phase: Fase 2D — Quality (M19)
Status: Completed (framework setup; smoke E2E execution skipped on operator laptop per user request)

## Scope Verified

- Install Playwright (`@playwright/test`) di frontend project.
- Tambah `playwright.config.ts` dengan project chromium, firefox, mobile-chrome, baseURL `http://localhost:3000`, retries CI, screenshot on failure, video on retry, trace on first retry, dan `webServer` auto-start `npm run dev`.
- Buat folder `frontend/e2e/` plus `e2e/fixtures/` dengan generator + sample PDF fixtures.
- Buat helper `frontend/e2e/helpers.ts`.
- Buat smoke test `frontend/e2e/smoke.spec.ts` (homepage + 13 tool pages).
- Tambah scripts `test:e2e`, `test:e2e:ui`, `test:e2e:headed`, `test:e2e:report`, `e2e:fixtures` ke `frontend/package.json`.
- Update `frontend/.gitignore` untuk Playwright artifacts.
- Pastikan unit test (Vitest) tidak ikut menjalankan file `e2e/**` supaya pipeline existing tidak rusak.

Out of scope (sesuai STEP definition):
- Penulisan E2E test per-tool (akan ditangani di STEP-F2-042 dan seterusnya).
- Eksekusi penuh smoke test di laptop operator (di-skip atas permintaan user; framework siap dijalankan di environment yang lebih kuat / CI).

## Files Changed

| File | Action |
|------|--------|
| `frontend/playwright.config.ts` | Created (chromium + firefox + mobile-chrome, screenshot/video/trace, webServer) |
| `frontend/e2e/fixtures/generate-fixtures.ts` | Created (pdf-lib generator: sample.pdf 3 halaman, single-page.pdf) |
| `frontend/e2e/fixtures/sample.pdf` | Created (3 halaman test PDF) |
| `frontend/e2e/fixtures/single-page.pdf` | Created (1 halaman test PDF) |
| `frontend/e2e/helpers.ts` | Created (uploadPDF, waitForProcessing, verifyToolPageLoads) |
| `frontend/e2e/smoke.spec.ts` | Created (homepage + 13 tool pages accessibility) |
| `frontend/package.json` | Modified (devDependency `@playwright/test`, `tsx`; scripts `test:e2e*`, `e2e:fixtures`) |
| `frontend/package-lock.json` | Modified (lockfile sync) |
| `frontend/.gitignore` | Modified (`/test-results/`, `/playwright-report/`, `/blob-report/`, `/playwright/.cache/`) |
| `frontend/vitest.config.ts` | Modified (exclude `**/e2e/**`, `**/playwright-report/**`, `**/test-results/**`) |
| `stepprompts/progress.md` | Modified (STEP-F2-041 ✅ 2026-05-17, current step → STEP-F2-042, counters updated) |
| `docs/fase-2/STEP-F2-041-setup-evidence.md` | Created (this file) |

## Validation Evidence

### Framework Setup

- `npm install --save-dev @playwright/test tsx` selesai tanpa error (devDependency masuk ke `frontend/package.json`).
- `npx playwright install chromium firefox` mendownload Chrome for Testing 148.0.7778.96 dan Firefox 150.0.2 ke `%LOCALAPPDATA%\ms-playwright\` (binaries ada di cache user, tidak masuk repo).
- Generator fixture dijalankan via `node node_modules/tsx/dist/cli.mjs e2e/fixtures/generate-fixtures.ts` → output `Fixtures generated successfully.` dan menghasilkan `sample.pdf` + `single-page.pdf` di `frontend/e2e/fixtures/`.

### Vitest Regression

Untuk memastikan setup E2E tidak merusak pipeline unit test existing:

- Command: `& "C:\Program Files\nodejs\node.exe" .\node_modules\vitest\vitest.mjs run --reporter=dot` (di `frontend/`).
- Hasil: **18 test files passed, 530 tests passed** dalam ~1.88s.
- Catatan: setelah Vitest pertama tidak sengaja meng-collect `e2e/smoke.spec.ts`, `vitest.config.ts` di-update untuk `exclude: ["**/e2e/**", "**/playwright-report/**", "**/test-results/**", ...]`. Run kedua bersih.

### LSP Diagnostics

- `frontend/playwright.config.ts`: ✅ No diagnostics
- `frontend/e2e/fixtures/generate-fixtures.ts`: ✅ No diagnostics
- `frontend/e2e/helpers.ts`: ✅ No diagnostics
- `frontend/e2e/smoke.spec.ts`: ✅ No diagnostics

### Smoke E2E Execution

- **Skipped** di laptop operator atas permintaan eksplisit user: *"ei jangan e2e tes di laptop ku, meledak nanti, kalo bisa di skip aja"*.
- Run percobaan awal sebelum permintaan skip menunjukkan setup Playwright aktif dan dapat menjalankan test (homepage test pass), tapi run penuh tidak dilanjutkan agar tidak membebani mesin user.
- Framework siap dijalankan kemudian via `npm run test:e2e` di environment yang lebih ringan/CI.

## Definition of Done Mapping

| DoD Item | Status |
|----------|--------|
| Playwright installed dengan chromium + firefox | ✅ devDependency + binaries terpasang |
| `playwright.config.ts` configured (base URL, screenshots, video) | ✅ |
| Folder `e2e/` created dengan fixtures dan helpers | ✅ |
| Test PDF fixtures generated (sample.pdf, single-page.pdf) | ✅ via `tsx e2e/fixtures/generate-fixtures.ts` |
| Smoke test passes (homepage + all 13 tool pages accessible) | ⚠️ Eksekusi penuh **skipped on operator laptop** atas permintaan user; framework verified dapat dijalankan, full smoke akan dijalankan di environment yang sesuai |
| `.gitignore` updated untuk Playwright artifacts | ✅ |

## Docs Update Evidence

- `stepprompts/progress.md`:
  - `Current Step` → `STEP-F2-042`.
  - `Overall Progress` → `41 / 97 (42%)`.
  - Phase Summary 2D → `1 / 14 (7%)`.
  - TOTAL → `38 / 97 (39%)`.
  - `STEP-F2-041` → `✅ 2026-05-17`.

## Git / Push / Deploy Evidence

### 1) Completion Commit

> Filled after commit.

### 2) Push

> Filled after push.

### 3) Deploy

- Push ke `main` memicu Vercel/Railway redeploy seperti biasa.
- Tidak ada perubahan production runtime di STEP-F2-041 (pure dev tooling); deployment seharusnya tidak terdampak fungsionalnya.

## Notes

- STEP-F2-041 hanya menyiapkan framework E2E. Penulisan dan eksekusi E2E test per-tool ada di STEP-F2-042 (client-side tools), STEP-F2-043 (server-side tools), STEP-F2-044 (PDF-to-Excel, Image-to-PDF, Navigation).
- Smoke test full execution (chromium + firefox + mobile-chrome) sebaiknya dijalankan di environment yang stabil (CI / mesin yang tidak akan kepanasan); operator laptop di-skip dengan persetujuan eksplisit.
- Vitest config sengaja meng-exclude folder `e2e/` supaya unit test runner tidak salah meng-execute test Playwright yang membutuhkan webServer.
