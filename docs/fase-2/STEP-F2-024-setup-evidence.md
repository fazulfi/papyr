# STEP-F2-024 Setup Evidence

Date: 2026-05-16
Step: STEP-F2-024 — Frontend Signature upload mode + type mode
Status: Completed (implementation + validation)

## Scope Implemented
- **Upload mode**: Accepts PNG/JPG (max 1MB), validates MIME type + size, preview thumbnail, converts to base64 PNG via canvas, error handling for invalid files.
- **Type mode**: Text input with 4 Google Fonts (Dancing Script, Caveat, Satisfy, Pacifico), color picker (black/blue), canvas-based text rendering, base64 PNG export, Google Fonts injection.
- Integration of both modes into `/sign` page replacing F2-022 placeholders while preserving draw mode.
- Font test coverage and DOM-helper coverage via mocked APIs in node environment.

### Files Created
- `frontend/src/components/SignatureUpload.tsx` — Upload-mode component (drag-drop, preview, canvas conversion)
- `frontend/src/components/SignatureType.tsx` — Type-mode component (text input, font selector, color picker, canvas render)

### Files Modified
- `frontend/src/app/sign/logic.ts` — Added: `MAX_SIGNATURE_IMAGE_SIZE_BYTES`, `ALLOWED_SIGNATURE_IMAGE_TYPES`, `validateSignatureImageFile`, `loadImage`, `imageFileToBase64Png`, `SIGNATURE_FONTS` (4 fonts), `DEFAULT_SIGNATURE_FONT`, `renderSignatureText`, `getGoogleFontsLink`, `injectSignatureFonts`
- `frontend/src/app/sign/page.tsx` — Replaced `PlaceholderPanel` with `SignatureUpload` (upload mode) and `SignatureType` (type mode) conditional rendering
- `frontend/src/__tests__/sign.test.tsx` — Added: upload-mode contract tests (`validateSignatureImageFile`, `ALLOWED_SIGNATURE_IMAGE_TYPES`, PNG export shape), type-mode contract tests (`SIGNATURE_FONTS`, `DEFAULT_SIGNATURE_FONT`, `createSignaturePngDataUrl`, `extractPngBase64` round-trip)
- `frontend/src/__tests__/sign-type-fonts.test.ts` — New: node-safe tests for `SIGNATURE_FONTS`, `DEFAULT_SIGNATURE_FONT`, `getGoogleFontsLink` URL format
- `frontend/src/__tests__/sign-dom-helpers.test.ts` — New: mocked-DOM tests for `imageFileToBase64Png`, `renderSignatureText`, `injectSignatureFonts`, `getGoogleFontsLink`, including error-path coverage

### Key Requirement: Font Correction
The initial subagent implementation used Great Vibes/Alex Brush/Dancing Script/Cedarville Cursive.
Corrected to **Dancing Script, Caveat, Satisfy, Pacifico** (per STEP-F2-024 specs) via manual edit before validation.

## Validation Evidence

### 1) Diagnostics
Commands: `lsp_diagnostics` on all changed files.
Result: All clean (0 diagnostics).

### 2) Unit Tests + Coverage
Command: `npm run test -- --coverage` (frontend/)
Result:
- Test files: **11 passed**
- Tests: **208 passed, 0 failed**
- Scoped coverage: `frontend/src/app/sign/logic.ts` = **100% statements / 100% branches / 100% functions / 100% lines**

DOM-dependent functions (`loadImage`, `imageFileToBase64Png`, `renderSignatureText`, `injectSignatureFonts`) tested in node env via mocked `document`, `HTMLCanvasElement`, `HTMLImageElement`, and `URL` globals.

### 3) Build
Command: `npm run build` (frontend/)
Result:
- Build succeeded
- `/sign` route generated successfully as static route
- TypeScript clean

## Git / Push / Deploy Evidence
Commits:
1. `<commit_hash_1>` — `feat(fase2): add signature upload and type modes with fonts and tests`
2. `<commit_hash_2>` — `feat(fase2): wire upload and type modes into /sign page`
3. `<commit_hash_3>` — `docs(fase2): mark STEP-F2-024 complete and add evidence`

Push:
- `git push origin main`
- Result: pending (see commit hashes after execution)

Deploy trigger:
- Push to `main` triggers auto-deploy (Vercel workflow).

## Notes
- Out of scope kept intact: PDF viewer (STEP-F2-025), drag-drop placement (STEP-F2-026), apply/download pipeline (STEP-F2-027).
- Unrelated untracked files intentionally untouched.
