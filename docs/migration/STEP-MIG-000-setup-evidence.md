# STEP-MIG-000 Setup Evidence

## Step Info

| Field | Value |
|-------|-------|
| Step | STEP-MIG-000 |
| Title | Pre-flight audit + Railway extraction |
| Track | VPS Migration (paranoid-grade) |
| Refs | `stepprompts/step-prompts-vps-migration.md` STEP-MIG-000 |
| Date | 2026-05-18 |
| Status | ✅ Completed (with caveats) |

## Scope

**In scope:**

- Install gitleaks v8.21.2 di laptop operator
- Run gitleaks scan repo Papyr + git history untuk detect leaked secrets
- Generate 3 SSH keypair Ed25519 (operator, gha-deploy, restic) di `~/.ssh/papyr/`
- Setup `docs/vps-access.md` skeleton (gitignored)
- Update `.gitignore` untuk `docs/vps-access.md` + `gitleaks-report.json`
- 2FA audit di 7 admin accounts (GitHub, Vercel, Cloudflare, Hostinger, Linode, IDCloudHost, Railway)
- Extract Railway env vars
- Linode snapshot baseline (skipped — reseller account)

**Out of scope:**

- VPS-side configuration (deferred to STEP-MIG-001)
- Secret rotation (deferred to STEP-MIG-020)

## Files Created/Changed

| File | Action |
|------|--------|
| `~/.ssh/papyr/{operator,gha-deploy,restic}{,.pub}` | Created (laptop only, no commit) |
| `docs/vps-access.md` | Created (gitignored) |
| `.gitignore` | Modified — added `docs/vps-access.md` + `gitleaks-report.json` |
| `stepprompts/progress.md` | Modified — STEP-MIG-000 marked ✅ with caveats |

## Validation Evidence

### gitleaks Scan

- Tool: gitleaks v8.21.2
- Scope: full repo + complete git history
- Result: **3 findings, all FALSE POSITIVES**
- Findings:
  - `docs/11_Papyr_API_Spec_v1.0.md:451` — dummy R2 file key in API spec example
  - `docs/11_Papyr_API_Spec_v1.0.md:737` — dummy R2 file key in API spec example
  - `docs/35_Papyr_API_Versioning_Strategy_v1.0.md:587` — dummy R2 file key in API spec example
- Conclusion: no real secrets leaked in repo or git history

### SSH Keypairs Generated

| Key | Fingerprint | Purpose |
|---|---|---|
| operator | `SHA256:jP+e/iEC0dg6SIFqRprApBrOagZ/6woiOnbWNAo5+hQ` | Manual SSH ke VPS sebagai `deploy` |
| gha-deploy | `SHA256:DvRDLm5c/LteBTTB92PvAGQVxUyEpVF6TZkuAHgR6VM` | GitHub Actions deploy (MIG-012) |
| restic | `SHA256:a/8oPFlaSpYnVWn8s3XYvfwTH6TstiR5CTYigMwa2dM` | Backup user (MIG-018) |

All Ed25519, no passphrase (relying on Windows BitLocker / OS-level disk encryption).

### 2FA Audit

| Account | 2FA | Status |
|---|---|---|
| GitHub | ✅ | Required by GitHub policy |
| Vercel | ✅ | Passkeys + TOTP |
| Cloudflare | ✅ | TOTP |
| Hostinger | ✅ | Mobile auth |
| Railway | ✅ | TOTP + Recovery codes |
| **Linode** | ❌ | Reseller (IDCloudHost) — no direct dashboard access |
| **IDCloudHost** | ❌ | MFA enroll fails: `"This user can't be enrolled with MFA"` |

5/7 enabled. Risks documented in `docs/vps-access.md`.

### Railway Env Vars Extraction

Successfully captured 7 vars (CORS_ORIGINS, FILE_RETENTION_MINUTES, MAX_UPLOAD_SIZE_MB, R2_ACCESS_KEY_ID, R2_ACCOUNT_ID, R2_BUCKET_NAME, R2_SECRET_ACCESS_KEY, RATE_LIMIT_PER_MINUTE).

⚠️ **Caveat — R2 keys leaked in chat:** operator pasted env vars into AI chat instead of GPG-encrypted local file. Treat as compromised.

**Operator decision:** "pakai sesuai yang aku paste" — accepted risk, deferred R2 rotation to STEP-MIG-020.

**Compensating controls during deferral window:**
- Weekly Cloudflare R2 activity log review (anomalous request volume / unfamiliar IPs)
- R2 bucket storage cap if Cloudflare exposes one
- Bucket size monitoring (production normal: cleared every 60 min)

### Linode Snapshot Baseline

❌ **Skipped** — VPS purchased via IDCloudHost reseller, no direct Linode dashboard access. Mitigation: VPS still empty (no production data yet); restic backup strategy at MIG-018 provides DR going forward.

## Known Risks

Documented in `docs/vps-access.md` Operational Risks section:

1. **R2 keys compromised** — rotation deferred to MIG-020
2. **Linode/IDCH no-2FA** — long unique passwords + reseller dependency
3. **No DR isolation** between VPS provider (Linode via IDCH) and backup provider (IDCloudHost S3) — both vendors are IDCH-managed

## Git / Push / Deploy

### Commits

1. `199520e chore: gitignore VPS access secrets and gitleaks reports` — added `docs/vps-access.md` + `gitleaks-report.json` to `.gitignore`
2. `f92620f docs: mark STEP-MIG-000 complete with caveats` — progress.md update

### Push

- Pushed to `origin/main`

## Notes

- All sensitive credentials documented in `docs/vps-access.md` (gitignored, paths-only references to password manager)
- Initial VPS root password remains LEAKED (image-included default) — must rotate at STEP-MIG-001 task 1.4
- IDCH MFA enrollment bug filed as support ticket
