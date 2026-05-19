# STEP-MIG-008 Setup Evidence

## Step Info

| Field | Value |
|-------|-------|
| Step | STEP-MIG-008 |
| Title | Production Dockerfile + SBOM |
| Track | VPS Migration (paranoid-grade) |
| Refs | `stepprompts/step-prompts-vps-migration.md` STEP-MIG-008 |
| Date | 2026-05-19 |
| Status | ✅ Completed |

## Scope

**In scope:**

- Author `backend/Dockerfile.production` — multi-stage, hardened, non-root, healthcheck
- Update `backend/.dockerignore` to whitelist approach
- Build production image on VPS (not laptop, per operator preference)
- Generate SBOM (CycloneDX JSON + SPDX JSON + table) via syft
- CVE scan via trivy (HIGH + CRITICAL)
- Download all reports to `docs/security/` for repo audit trail
- Author `docs/security/security-baseline.md` (repo master copy synced to VPS at MIG-019)

**Out of scope:**

- Pushing image to GHCR (deferred to STEP-MIG-012 CI/CD)
- Running container in production (deferred to STEP-MIG-009 docker-compose + MIG-013 first deploy)
- Resolving HIGH/CRITICAL CVEs from trivy scan (documented as risk follow-up; many are upstream Debian deps that need base image refresh)

## Files Created/Changed

### Repo

| File | Action |
|------|--------|
| `backend/Dockerfile.production` | Created — multi-stage hardened Dockerfile |
| `backend/.dockerignore` | Replaced — whitelist approach (only main.py, requirements.txt, routers/, services/, utils/) |
| `docs/security/security-baseline.md` | Created — repo master copy of security baseline |
| `docs/security/sbom-papyr-backend.json` | Created — CycloneDX JSON SBOM (3.25 MB, 355 packages) |
| `docs/security/sbom-papyr-backend.spdx.json` | Created — SPDX JSON SBOM (7.42 MB) |
| `docs/security/sbom-papyr-backend.txt` | Created — table format SBOM (32 KB, 355 lines) |
| `docs/security/trivy-papyr-backend.json` | Created — trivy CVE scan JSON (1.38 MB) |
| `docs/security/trivy-papyr-backend.txt` | Created — trivy CVE scan table (117 KB) |
| `docs/security/mig008-phase-a.log` | Created — full Phase A execution log |
| `stepprompts/step-prompts-vps-migration.md` | Patched (commit `dc87038`) — build location moved from laptop to VPS |
| `stepprompts/progress.md` | STEP-MIG-008 marked ✅, current step → STEP-MIG-009 |
| `docs/migration/STEP-MIG-008-setup-evidence.md` | Created (this file) |

### On VPS

| File | Action |
|------|--------|
| `/opt/papyr/source/` | Cloned `https://github.com/fazulfi/papyr.git` |
| `/usr/local/bin/syft` | Installed v1.44.0 |
| `/usr/local/bin/trivy` | Installed v0.70.0 |
| `papyr-backend:builder` (Docker image) | Created — 1.07 GB |
| `papyr-backend:test` (Docker image) | Created — 1.13 GB (multi-stage final) |
| `/opt/papyr/security/sbom-papyr-backend.{json,spdx.json,txt}` | Generated |
| `/opt/papyr/security/trivy-papyr-backend.{json,txt}` | Generated |

## Build Details

- **Base image**: `python:3.11.9-slim-bookworm`
- **Builder stage size**: 1.07 GB (build deps + Python packages user install)
- **Runtime final image size**: 1.13 GB
- **Build time**: ~5 minutes (clean rebuild, after fix iterations)

> Image size 1.13 GB exceeds original target of <800 MB documented in step prompt because LibreOffice (writer + common) + Tesseract eng+ind language packs + Python deps including PyMuPDF/pdf2docx/camelot/opencv exceed the original estimate. Acceptable trade-off for Papyr feature set; no path to <800 MB without dropping functionality.

## Patches Applied

Three pre-execution patches and three iterative fixes during execution:

### Pre-execution (commit `dc87038`)

- Step prompt rewritten to build SBOM and trivy scan on VPS instead of laptop, after operator stated laptop concern about LibreOffice/Tesseract resource demand. VPS has 8GB RAM, runs same target environment, gives runtime parity for build issues.

### Pre-execution (commit `04b666a`)

- Created `Dockerfile.production` with multi-stage builder/runtime, non-root appuser UID 1001, tini entrypoint, healthcheck, TMPDIR=/opt/papyr/temp.
- Replaced `.dockerignore` with whitelist approach.

### Iterative fix 1 (commit `12d8acb`)

- Initial build failed with `Errors were encountered while processing: ca-certificates / E: Sub-process /usr/bin/dpkg returned an error code (1)`.
- Split runtime apt install into two RUN steps (base utilities first, LibreOffice + tesseract second).
- Added `DEBIAN_FRONTEND=noninteractive` to runtime ENV.
- Did not resolve the trigger conflict.

### Iterative fix 2 (commit `bcacd9b`)

- Removed redundant `update-ca-certificates` from RUN chain (already runs as package post-install).
- Did not resolve the trigger conflict.

### Iterative fix 3 (commit `d3d96ad`) ✅

- Investigation via isolated `docker run` probe showed `python:3.11.9-slim-bookworm` already ships ca-certificates and the apt install was triggering an upgrade. Combined with concurrent dpkg locks during heavy package install, the upgrade trigger fails.
- Removed `ca-certificates` from runtime apt list entirely.
- Build succeeded.

## Validation Evidence

### Dockerfile build

```
[+] Building 5m 12s
=> [builder 1/5] FROM docker.io/library/python:3.11.9-slim-bookworm
=> [builder 5/5] RUN pip install --no-cache-dir --user -r requirements.txt
=> [runtime 2/7] RUN apt-get install -y --no-install-recommends apt-utils curl tini ghostscript poppler-utils libxcb-xfixes0
=> [runtime 3/7] RUN apt-get install -y --no-install-recommends tesseract-ocr tesseract-ocr-eng tesseract-ocr-ind libreoffice-writer libreoffice-common
=> [runtime 4-7] (chown, copy, user, expose) success
=> exporting to image
=> => writing image sha256:985935a2b2e2... done
=> => naming to docker.io/library/papyr-backend:test done
```

### Container runs as non-root

```
$ docker run --rm papyr-backend:test whoami
appuser
```

### Healthcheck configured

```
$ docker inspect papyr-backend:test --format '{{json .Config.Healthcheck}}'
{"Test":["CMD-SHELL","curl -fsS http://localhost:8000/health || exit 1"],"Interval":30000000000,"Timeout":10000000000,"StartPeriod":40000000000,"Retries":3}
```

### SBOM stats

- Total packages: **355**
- Categories: Python (~80), Debian (~270), binary (~5)
- Sample top entries: PyMuPDF 1.26.7, pdf2docx 0.5.13, camelot-py 1.0.9, fastapi 0.115.12, ocrmypdf 17.4.2

### Trivy CVE scan

| Severity | Count |
|---|---|
| CRITICAL | 12 |
| HIGH | 65 |
| **Total** | **77** (55 unique CVEs) |

⚠️ **Risk follow-up**: 12 CRITICAL + 65 HIGH CVEs reported. Most are upstream Debian system libraries (glibc, libssl, etc.) that require a refreshed `python:3.11.9-slim-bookworm` base image. Application Python deps mostly clean. Action plan:

1. **At MIG-012 (CI/CD)** — set trivy `--exit-code 1` for CRITICAL only so CI gates new CVE introductions.
2. **Monthly** — re-run trivy on production image, review delta.
3. **Quarterly** — bump base image to latest patch version + rebuild + retest.
4. **Out-of-band** — for any CVE marked actively exploited (KEV catalog), patch within 7 days.

## Definition of Done

- [x] `backend/Dockerfile.production` exists, multi-stage, hardened — committed
- [x] `backend/.dockerignore` whitelist approach — committed
- [x] Image builds successfully on VPS (1.13 GB, exceeds target but acceptable)
- [x] Container runs as `appuser` (UID 1001), bukan root
- [x] Healthcheck configured di Dockerfile
- [x] SBOM generated (CycloneDX JSON + SPDX + TXT) di `/opt/papyr/security/` + downloaded ke `docs/security/`
- [x] Trivy scan run, output saved + downloaded, CVE count documented (12 CRITICAL + 65 HIGH)
- [x] SBOM regeneration cadence documented di `docs/security/security-baseline.md`

## Issues Encountered + Resolutions

1. **Three iterative ca-certificates trigger failures.** Required isolated `docker run` probe to identify root cause (base image already had ca-certificates, apt was running an upgrade that conflicted with concurrent dpkg locks). Resolved by removing the package from runtime apt list. Build then succeeded.
2. **SBOM generation initially produced 0-byte JSON files.** syft layer cache filled `/tmp` (2 GB tmpfs from MIG-003) — image data plus extraction overflowed. Resolved by setting `TMPDIR=/opt/papyr/security/syft-tmp` (rootfs has 137 GB free), regenerated successfully.
3. **PowerShell SSH heredoc quoting** broke several command attempts during debugging. Resolved by writing all multi-line operations to local `.sh` files in `$env:TEMP\opencode\`, scp to `/tmp/`, run via `ssh papyr "bash /tmp/<script>.sh; rm /tmp/<script>.sh"`. Pattern documented for future MIG steps.
4. **STEP-MIG-007 TOTP rolled back same day** to remove SSH friction during this and future automation steps. Operator decision; documented in MIG-007 evidence.

## Risk Mitigation

- **Image size 1.13 GB**: Larger than ideal for fast deploys, but matches feature surface. Compensated by Docker layer caching — only changed app code rebuilds (~30s).
- **Critical CVEs**: 12 CRITICAL items in trivy report. Action plan above. Not blocker for first deploy because: (1) backend not yet exposed publicly, (2) CrowdSec + UFW + auditd from MIG-002 watch attack surface, (3) MIG-012 CI/CD will gate future regressions.
- **userns-remap interaction**: container UID 1001 maps to host UID 101001. `/opt/papyr/temp` mounted volume must be writable by 101001:101001 (handled at MIG-009 compose).
- **Build location now VPS**: any future repo update (including from CI/CD post-MIG-012) needs `git pull` on VPS before rebuild, or replaced by registry pull. Documented in step prompts.

## Git / Push / Deploy

### Commits

1. `dc87038 docs(mig): patch STEP-MIG-008 to build SBOM and trivy on VPS not laptop` (pre-execution patch)
2. `04b666a feat(backend): add hardened production Dockerfile and dockerignore whitelist`
3. `12d8acb fix(backend): split runtime apt install to avoid ca-certificates trigger failure` (iterative fix 1, did not resolve)
4. `bcacd9b fix(backend): remove redundant update-ca-certificates in apt RUN` (iterative fix 2, did not resolve)
5. `d3d96ad fix(backend): drop ca-certificates from runtime apt install` (iterative fix 3, ✅ resolved)
6. (this evidence + SBOM + trivy + cadence doc commit)

### Push

- All commits pushed to `origin/main`
- Build location: VPS at `/opt/papyr/source/backend/`

## Notes

- syft v1.44.0 + trivy v0.70.0 installed at `/usr/local/bin/` on VPS via official install scripts.
- Total of 4 commit cycles to get Dockerfile build working — all incremental, all reversible. The iterative diagnostic was important: the third hypothesis (base image already has ca-certificates) was the actual root cause, but the first two attempts (split RUN, remove update-ca-certificates) were reasonable based on the error message alone.
- Future SBOM/trivy regenerations should use `TMPDIR=/opt/papyr/security/syft-tmp` to avoid /tmp tmpfs overflow.
- The 1.13 GB image is the practical floor for this feature set on bookworm. Path to smaller: switch to alpine + manual LibreOffice/Tesseract install (significantly more work, untested compatibility with PyMuPDF), or distroless (incompatible with LibreOffice headless requirements). Both deferred unless image size becomes a measurable problem.
