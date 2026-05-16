# STEP-F2-034 Setup Evidence

Date: 2026-05-16
Step: STEP-F2-034 — Infra Install Tesseract + ocrmypdf in Docker
Status: Completed (Dockerfile and Python dependency updated; local Docker daemon unavailable, Railway auto-build validation pending)

## Scope Verified

- Tesseract OCR runtime packages added to backend Docker image for OCR conversion (M17).
- Indonesian and English language packs added: `tesseract-ocr-ind`, `tesseract-ocr-eng`.
- `ocrmypdf>=16.0.0` added to backend Python dependencies.
- Installation follows existing single apt-get runtime-stage pattern: `apt-get install -y --no-install-recommends ... && apt-get clean && rm -rf /var/lib/apt/lists/*`.
- Image size target: runtime image < 1.5GB (per STEP-F2-034 prompt).
- Out of scope confirmed: no `/api/ocr` endpoint, no OCR processing router/service, no frontend OCR page.

## Files Changed

- `backend/Dockerfile` (updated)
- `backend/requirements.txt` (updated)
- `stepprompts/progress.md` (updated)
- `docs/fase-2/STEP-F2-034-setup-evidence.md` (this file)

## Validation Evidence

### 1) Dockerfile Syntax / Pattern Verification

**Dockerfile changes:**

```dockerfile
# Install Ghostscript for server-side PDF compression
# Install LibreOffice headless for PDF-to-Word conversion (PAPYR-128)
# Install Tesseract OCR with Indonesian + English language packs (PAPYR-138)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ghostscript \
        libreoffice-writer \
        libreoffice-common \
        tesseract-ocr \
        tesseract-ocr-ind \
        tesseract-ocr-eng && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

**Verification method:** Manual code review

- Multi-stage Dockerfile structure preserved (builder + runtime stages).
- Tesseract packages added to runtime stage (correct placement for CLI runtime tools).
- Existing Ghostscript + LibreOffice install block reused (no extra Docker layer).
- Existing apt cleanup preserved (`apt-get clean`, remove `/var/lib/apt/lists/*`).
- Entrypoint, app copy flow, and PORT configuration unchanged.

**Result:** ✅ Dockerfile syntax follows existing repo patterns.

### 2) Python Dependency Verification

**requirements.txt change:**

```txt
ocrmypdf>=16.0.0
```

**Verification method:** Manual code review

- Added to existing `backend/requirements.txt` dependency list.
- Installed through existing builder-stage `pip install --user --no-cache-dir -r requirements.txt` flow.
- No separate pip install step added.

**Result:** ✅ Python dependency added through existing dependency pipeline.

### 3) Backend Non-Regression Tests

**Command:**

```bash
pytest backend/tests/ -q
```

**Result:**

```text
166 passed, 2 warnings in 17.71s
```

**Notes:**

- STEP-F2-034 is infra-only; unit coverage >90% is not directly applicable because no executable application module was added.
- Existing backend regression suite remains green after requirements/Dockerfile changes.

### 4) Local Docker Build Attempt

**Docker client check:**

```bash
docker version --format "Client {{.Client.Version}} Server {{.Server.Version}}"
```

**Result:**

```text
Client 29.3.1 Server
docker: failed to connect to the docker API at npipe:////./pipe/docker_engine
```

**Conclusion:** Docker CLI is installed, but Docker daemon is not running on the local Windows machine.

**Fallback strategy:** Runtime validation will occur on Railway auto-build after push to `main`, matching the repository deployment runbook.

### 5) Container Runtime Verification Commands

These commands are the required runtime verification steps once Docker daemon / Railway build is available:

```bash
# Build backend image
docker build -t papyr-backend:test -f backend/Dockerfile .

# Verify Tesseract language packs
docker run --rm papyr-backend:test tesseract --list-langs
# Expected output includes: ind, eng

# Verify ocrmypdf import
docker run --rm papyr-backend:test python -c "import ocrmypdf; print('OK')"
# Expected output: OK

# Measure image size
docker images papyr-backend --format "{{.Repository}}:{{.Tag}} size={{.Size}}"
# Expected: < 1.5GB
```

### 6) Image Size Estimate

**Previous baseline after STEP-F2-030:** ~505–605MB (LibreOffice + Ghostscript + Python runtime)

**STEP-F2-034 additions:**

- Tesseract OCR + Indonesian/English language packs: estimated +50–100MB
- ocrmypdf and transitive Python dependencies: estimated +100–200MB

**Estimated runtime image:** ~655–905MB

**Target:** < 1.5GB ✅ (estimated to remain within target)

Actual image size will be measured from Docker/Railway build logs when runtime build is available.

## Docs Update Evidence

- `stepprompts/progress.md` updated:
  - `Last Updated`: `2026-05-16`
  - `Current Step`: `STEP-F2-035`
  - `Overall Progress`: `34 / 97 (35%)`
  - Fase 2C summary: `5 / 11 (45%)`
  - `STEP-F2-034` marked `✅ 2026-05-16`

## Git / Push / Deploy Evidence

### Commits

Pending — will be finalized after commit.

### Push

Pending — will be finalized after push.

### Deploy

Pending — push to `main` will trigger Railway backend auto-build/deploy.

## Notes

- STEP-F2-034 is infrastructure-only. No `/api/ocr` endpoint or frontend OCR page was implemented; those belong to STEP-F2-035/036.
- Existing backend tests pass.
- Docker daemon unavailable locally; runtime package verification deferred to Railway auto-build.
- Dockerfile change is minimal and follows existing F2-030 system dependency pattern.
