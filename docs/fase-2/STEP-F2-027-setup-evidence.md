# STEP-F2-027 Setup Evidence

Date: 2026-05-16
Step: STEP-F2-027 — Frontend Apply signature to PDF with pdf-lib + download
Status: Completed (implementation + validation)

## Scope Implemented
- Created `apply-signature.ts` — pure pipeline converting placement[] + signatureImage into signed PDF bytes.
- `base64PngToUint8Array()` decodes PNG data URL to bytes via `atob`.
- `applySignatures()` loads PDF with `pdf-lib`, embeds signature PNG per placement, handles relative→absolute coordinate conversion (top-left UI → bottom-left PDF).
- Aspect-ratio-preserving fit scaling, y-axis inversion, per-page validation.
- Updated `page.tsx` — replaces stub `handleApplySignature` with async pipeline, wiring signing/done/error states.
- Added `signing` spinner UI and `done` success panel with "Download Ulang" + "Tanda Tangani PDF Lain" buttons.
- Existing draw/upload/type/viewer/placement flows fully preserved.

## Files Changed
- `frontend/src/app/sign/apply-signature.ts` (new)
- `frontend/src/app/sign/page.tsx` (updated)
- `frontend/src/__tests__/apply-signature.test.ts` (new)
- `stepprompts/progress.md` (updated)
- `docs/fase-2/STEP-F2-027-setup-evidence.md` (this file)

## Validation Evidence
### 1) Diagnostics
Commands:
- `lsp_diagnostics frontend/src/app/sign/apply-signature.ts`
- `lsp_diagnostics frontend/src/app/sign/page.tsx`
- `lsp_diagnostics frontend/src/__tests__/apply-signature.test.ts`

Result:
- All clean (0 diagnostics).

### 2) Tests
Command:
- `npm --prefix frontend test -- --coverage`

Result:
- Test files: 15 passed
- Tests: 386 passed, 0 failed
- Scoped coverage (new files):
  - `frontend/src/app/sign/apply-signature.ts`: **93.22% statements**, **87.5% branches**, **100% functions**, **100% lines**
  - `frontend/src/app/sign/logic.ts`: 100% all metrics
  - `frontend/src/app/sign/placement-logic.ts`: 95.74% statements

### 3) Build
Command:
- `npm --prefix frontend run build`

Result:
- Build succeeded.
- `/sign` route generated successfully as static route.
- TypeScript compilation clean.

## Docs Update Evidence
- `stepprompts/progress.md` updated:
  - `Current Step`: `STEP-F2-028`
  - `Overall Progress`: `27 / 97 (28%)`
  - Fase 2B summary: `14 / 16 (88%)`
  - `STEP-F2-027` marked `✅ 2026-05-16`

## Git / Push / Deploy Evidence
Commits:
1. `96f49d4` — `feat(fase2): add pdf-lib apply-signature pipeline and download flow`
2. `a7d2d33` — `feat(fase2): integrate sign apply/download states into /sign flow`
3. `dbc03cd` — `docs(fase2): mark STEP-F2-027 complete and add evidence`

Push:
- `git push origin main`
- Result: `41df2c2..dbc03cd  main -> main`

Deploy trigger:
- Push to `main` triggers auto-deploy (Vercel workflow). Deploy ran automatically.

## Notes
- Out of scope kept intact: STEP-F2-028 (unit tests for /sign page), STEP-F2-029 (manual E2E test).
- Broader product docs, CHANGELOG, README, and unrelated VPS files were left untouched.
