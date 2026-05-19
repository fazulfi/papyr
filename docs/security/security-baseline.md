# Papyr Security Baseline — Repo Master Copy

> This file is the **repo-tracked master copy** of the security baseline.
> It is synced to the VPS at `/opt/papyr/security/security-baseline.md` via STEP-MIG-019.
> The VPS copy may be appended to during operational steps; treat any drift as something to reconcile back into this file.

Last updated: 2026-05-19

## Compliance Reference

- CIS Ubuntu Linux 22.04 Benchmark Level 1 Server
- SCAP Security Guide upstream release v0.1.74 pinned at `/opt/papyr/security/ssg/ssg-ubuntu2204-ds.xml`

## Applied Remediations (host)

- See `openscap-results-*.xml` for full audit trail
- Kernel hardening sysctl applied (`/etc/sysctl.d/99-papyr-hardening.conf`)
- Login banner set
- IPv4 forwarding disabled
- Core dumps disabled (`/etc/security/limits.d/papyr.conf`)
- umask 027 default (`/etc/profile.d/umask.sh`)
- sshd Banner directive enabled
- /tmp + /var/tmp tmpfs noexec/nosuid/nodev (STEP-MIG-003)
- AIDE filesystem integrity baseline + daily cron
- chkrootkit + rkhunter weekly cron
- CrowdSec + auditd + UFW deny-out mining ports + endlessh honeypot

## Container / Application Baseline

- Production Dockerfile: `backend/Dockerfile.production` (multi-stage, hardened)
- Base image: `python:3.11.9-slim-bookworm`
- Container user: `appuser` (UID/GID 1001), non-root
- ENTRYPOINT: `tini --` for SIGTERM forwarding
- TMPDIR: `/opt/papyr/temp` (host /tmp is noexec)
- Healthcheck: HTTP `/health` every 30s

## SBOM + CVE Scan Cadence

| Activity | Frequency | Tooling | Output location |
|---|---|---|---|
| SBOM regeneration | Every deploy | syft (CycloneDX + SPDX + table) | `docs/security/sbom-papyr-backend.{json,spdx.json,txt}` |
| Manual SBOM check | Monthly | syft | reuse same output paths, diff vs previous |
| CVE scan | Every deploy | trivy (HIGH+CRITICAL) | `docs/security/trivy-papyr-backend.{json,txt}` |
| CVE production scan | Monthly cron | trivy on running image | `/opt/papyr/security/trivy-papyr-backend-<date>.{json,txt}` |
| OpenSCAP CIS L1 | Quarterly | oscap | `/opt/papyr/security/openscap-results-<date>.{xml,html}` |
| Lynis | Monthly | lynis | `/opt/papyr/security/lynis-postharden-<date>.log` |
| AIDE filesystem | Daily cron | aide --check | `/var/log/aide.log` + journald alert on changes |
| Rootkit scan | Weekly cron | chkrootkit + rkhunter | `/var/log/rootkit-scan.log` + journald alert |

## Deferred Items

(Items intentionally not applied with justification.)

- IPv6 disabled — DEFERRED. Linode dedicated IPv6 /64 dipakai untuk fallback connectivity.
- Mandatory password complexity — DEFERRED. SSH password auth disabled, sudo NOPASSWD, password complexity moot.
- USB authorize_default — DEFERRED. USB disabled via modprobe (STEP-MIG-002).
- Ubuntu USG (CIS profile) — DEFERRED. Requires Ubuntu Pro token; using upstream SSG release instead.
- SSH 2FA (TOTP) — IMPLEMENTED then ROLLED BACK at STEP-MIG-007 per operator decision (friction unacceptable for solo-operator workflow). Re-enable path documented; TOTP file `~deploy/.google_authenticator` retained.

## Audit Trail

- `/opt/papyr/security/openscap-results-*.xml` — raw OpenSCAP results
- `/opt/papyr/security/openscap-report-*.html` — human-readable report
- `/opt/papyr/security/lynis-baseline-*.log` — Lynis baseline (STEP-MIG-003)
- `/opt/papyr/security/lynis-postharden-*.log` — Lynis after hardening (STEP-MIG-005)
- `/opt/papyr/security/sbom-papyr-backend.{json,spdx.json,txt}` — SBOM (STEP-MIG-008)
- `/opt/papyr/security/trivy-papyr-backend.{json,txt}` — CVE scan (STEP-MIG-008)
- `/opt/papyr/security/security-baseline.md` — VPS copy of this file (synced via STEP-MIG-019)
- `docs/security/` — repo-tracked copies of all of the above

## Emergency SSH Recovery

(See `/opt/papyr/security/security-baseline.md` for the operational version with IDCH support ticket recovery primary path and Linode LISH fallback. Repo copy keeps reference paths only.)

## 2FA Recovery

(Path documented in VPS copy. Currently disabled — see Deferred Items above. Operator can re-enable via STEP-MIG-007 Phase C in ~5 minutes.)
