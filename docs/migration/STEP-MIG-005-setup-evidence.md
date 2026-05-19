# STEP-MIG-005 Setup Evidence

## Step Info

| Field | Value |
|-------|-------|
| Step | STEP-MIG-005 |
| Title | Compliance Baselines (OpenSCAP + Lynis) |
| Track | VPS Migration (paranoid-grade) |
| Refs | `stepprompts/step-prompts-vps-migration.md` STEP-MIG-005 |
| Date | 2026-05-19 |
| Status | ✅ Completed |

## Scope

**In scope:**

- Install OpenSCAP scanner and upstream ComplianceAsCode SCAP Security Guide datastream.
- Run CIS Ubuntu 22.04 Level 1 Server baseline scan.
- Save OpenSCAP XML/HTML results under `/opt/papyr/security/` and download HTML evidence locally.
- Apply five idempotent remediations: IPv4 forwarding off, core dumps disabled, remote login banner, `sshd` Banner directive with reload only, and default `umask 027`.
- Write `/opt/papyr/security/security-baseline.md` with applied/deferred items and scan cadence.
- Re-run Lynis post-hardening and record index trajectory.
- Verify real SSH on alias `papyr` still returns `deploy` after changes.

**Out of scope:**

- No `sshd` port or authentication method changes.
- No `systemctl restart sshd`; only `sshd -t` then `systemctl reload sshd`.
- No Ubuntu Pro / USG attachment.
- No automatic OpenSCAP remediation.
- No frontend or application code changes.

## Files Created/Changed

### On VPS

| File / Resource | Action |
|---|---|
| `/opt/papyr/security/ssg/ssg-ubuntu2204-ds.xml` | Installed upstream ComplianceAsCode SSG v0.1.74 Ubuntu 22.04 datastream |
| `/opt/papyr/security/openscap-results-20260519.xml` | OpenSCAP raw XCCDF results saved |
| `/opt/papyr/security/openscap-report-20260519.html` | OpenSCAP human-readable HTML report saved and copied to laptop temp evidence dir |
| `/opt/papyr/security/security-baseline.md` | Created baseline/deferred-items document |
| `/opt/papyr/security/lynis-postharden-20260519.log` | Lynis post-hardening audit log saved |
| `/etc/sysctl.d/99-papyr-hardening.conf` | Appended `net.ipv4.ip_forward = 0` if missing |
| `/etc/security/limits.d/papyr.conf` | Created with `* hard core 0` |
| `/etc/issue.net` | Set authorized-access-only warning banner |
| `/etc/ssh/sshd_config` | Added `Banner /etc/issue.net` directive, config validated, sshd reloaded |
| `/etc/profile.d/umask.sh` | Created with `umask 027`, executable/readable |

### In Repo

| File | Action |
|------|--------|
| `docs/migration/STEP-MIG-005-setup-evidence.md` | Created (this file) |
| `stepprompts/progress.md` | STEP-MIG-005 marked ✅, current step → STEP-MIG-006 |

## Validation Evidence

### 1. OpenSCAP Scanner + Upstream SSG

Commands:

```bash
ssh papyr "sudo DEBIAN_FRONTEND=noninteractive apt install -y libopenscap8 wget unzip curl"
scp C:\Users\faizz\AppData\Local\Temp\opencode\step-mig-005-phase-a.sh papyr:/tmp/
ssh papyr "bash /tmp/step-mig-005-phase-a.sh; rm /tmp/step-mig-005-phase-a.sh"
```

Relevant output:

```text
/usr/bin/oscap
-rw-r--r-- 1 deploy deploy 12798530 May 19 07:05 /opt/papyr/security/ssg/ssg-ubuntu2204-ds.xml
Document type: Source Data Stream
Profiles:
  Title: Standard System Security Profile for Ubuntu 22.04
SSG_VERSION=0.1.74
```

### 2. CIS Level 1 Server Profile Selected

Command:

```bash
ssh papyr "sudo oscap info /opt/papyr/security/ssg/ssg-ubuntu2204-ds.xml | grep -E 'Profile|cis_level1_server|CIS.*Level 1' | head -40"
```

Relevant output:

```text
Profiles:
  Title: CIS Ubuntu 22.04 Level 1 Server Benchmark
    Id: xccdf_org.ssgproject.content_profile_cis_level1_server
  Title: CIS Ubuntu 22.04 Level 1 Workstation Benchmark
  Title: Standard System Security Profile for Ubuntu 22.04
```

Chosen profile ID: `xccdf_org.ssgproject.content_profile_cis_level1_server`.

### 3. OpenSCAP Scan Results

Command:

```bash
ssh papyr "sudo oscap xccdf eval --profile xccdf_org.ssgproject.content_profile_cis_level1_server --results /opt/papyr/security/openscap-results-20260519.xml --report /opt/papyr/security/openscap-report-20260519.html /opt/papyr/security/ssg/ssg-ubuntu2204-ds.xml || true"
```

Relevant output excerpt:

```text
Title  Package "prelink" Must not be Installed
Result pass

Title  Install AIDE
Result pass

Title  Build and Test AIDE Database
Result fail

-rw-r----- 1 deploy deploy 2791371 May 19 07:06 /opt/papyr/security/openscap-report-20260519.html
-rw-r----- 1 deploy deploy 8773854 May 19 07:06 /opt/papyr/security/openscap-results-20260519.xml
```

Result counts:

```text
     82 <result>fail</result>
     37 <result>notapplicable</result>
      7 <result>notchecked</result>
    167 <result>pass</result>
```

HTML report copied to laptop evidence dir:

```text
C:\Users\faizz\AppData\Local\Temp\opencode\openscap-report-20260519.html  2791371 bytes
```

### 4. Remediations Applied

Command:

```bash
scp C:\Users\faizz\AppData\Local\Temp\opencode\mig005-remediate.sh papyr:/tmp/
ssh papyr "bash /tmp/mig005-remediate.sh; rm /tmp/mig005-remediate.sh"
```

Relevant output:

```text
net.ipv4.ip_forward = 0
* hard core 0
Banner /etc/issue.net
All remediations applied
```

`sysctl --system` emitted known pre-existing invalid-argument warnings for two keys, but continued successfully and did not block sshd validation/reload:

```text
sysctl: setting key "net.ipv4.conf.all.accept_source_route": Invalid argument
sysctl: setting key "net.ipv4.conf.all.promote_secondaries": Invalid argument
```

### 5. Remediation Verification

Command:

```bash
ssh papyr "cat /etc/issue.net; sudo grep -E '^Banner' /etc/ssh/sshd_config; sudo sysctl net.ipv4.ip_forward; sudo cat /etc/security/limits.d/papyr.conf; cat /etc/profile.d/umask.sh; sudo systemctl is-active sshd"
ssh papyr "whoami"
```

Output:

```text
WARNING: Authorized access only. All activity is logged and monitored.
Banner /etc/issue.net
net.ipv4.ip_forward = 0
* hard core 0
umask 027
active
deploy
```

### 6. Security Baseline Written

Command:

```bash
scp C:\Users\faizz\AppData\Local\Temp\opencode\mig005-baseline.sh papyr:/tmp/
ssh papyr "bash /tmp/mig005-baseline.sh; rm /tmp/mig005-baseline.sh"
```

Output:

```text
security-baseline.md written
# Security Baseline — Papyr Production VPS

Last updated: 2026-05-19

## Compliance Reference
- CIS Ubuntu Linux 22.04 Benchmark Level 1 Server
- SCAP Security Guide upstream release v0.1.74 pinned at /opt/papyr/security/ssg/ssg-ubuntu2204-ds.xml
```

### 7. Lynis Post-Harden

Command:

```bash
ssh papyr "sudo lynis audit system --no-colors > /opt/papyr/security/lynis-postharden-20260519.log 2>&1; sudo chown deploy:deploy /opt/papyr/security/lynis-postharden-20260519.log; grep 'Hardening index' /opt/papyr/security/lynis-postharden-20260519.log"
```

Output:

```text
Hardening index : 75 [###############     ]
```

Trajectory: baseline `74` → postharden `75`.

### 8. Final File + SSH Verification

Command:

```bash
ssh papyr "ls -la /opt/papyr/security/ | head -30; ls -la /opt/papyr/security/ssg/ssg-ubuntu2204-ds.xml; sudo systemctl is-active sshd; sudo sysctl net.ipv4.ip_forward"
ssh papyr "whoami"
```

Relevant output:

```text
-rw-rw---- 1 deploy deploy   29823 May 19 01:48 lynis-baseline-20260519.log
-rw-rw---- 1 deploy deploy   29362 May 19 07:09 lynis-postharden-20260519.log
-rw-r----- 1 deploy deploy 2791371 May 19 07:06 openscap-report-20260519.html
-rw-r----- 1 deploy deploy 8773854 May 19 07:06 openscap-results-20260519.xml
-rw-r----- 1 deploy deploy    1655 May 19 07:08 security-baseline.md
drwxr-x--- 2 deploy deploy    4096 May 19 07:05 ssg
-rw-r--r-- 1 deploy deploy 12798530 May 19 07:05 /opt/papyr/security/ssg/ssg-ubuntu2204-ds.xml
active
net.ipv4.ip_forward = 0
deploy
```

## Definition of Done

- [x] OpenSCAP report XML saved in `/opt/papyr/security/`.
- [x] OpenSCAP report HTML saved in `/opt/papyr/security/` and copied locally for evidence.
- [x] Upstream ComplianceAsCode SSG datastream pinned under `/opt/papyr/security/ssg/`.
- [x] CIS Ubuntu 22.04 Level 1 Server profile selected and recorded.
- [x] Mandatory remediations applied: IPv4 forwarding off, core dumps off, login banner, sshd Banner directive, umask.
- [x] `sshd` config validated before reload; no restart performed.
- [x] `ssh papyr "whoami"` returns `deploy` after reload.
- [x] `security-baseline.md` documents applied and deferred items.
- [x] Lynis post-harden index recorded (`75`; baseline was `74`).
- [x] Re-scan cadence documented.

## Patches Applied

Prompt/documentation patches already committed at `15e283a` before execution:

1. Idempotent remediations.
2. `sshd -t` validation plus `systemctl reload sshd` instead of restart.
3. Heredoc date substitution fix for `security-baseline.md`.
4. `mkdir`/`cd` removal because `/opt/papyr/security/` already exists from STEP-MIG-003.

Runtime adaptation during execution:

1. Ubuntu archive SSG packages were unavailable, so upstream ComplianceAsCode SSG v0.1.74 was downloaded and pinned at `/opt/papyr/security/ssg/ssg-ubuntu2204-ds.xml`.
2. `/etc/profile.d/umask.sh` was adjusted to mode `755` after initial verification showed `deploy` could not read it directly; final content verified as `umask 027`.
3. A PowerShell quoting issue caused a first Lynis log path without a date; it was renamed to `/opt/papyr/security/lynis-postharden-20260519.log` and verified.

## Issues Encountered + Resolutions

1. **Ubuntu 22.04 default repos do not package SSG content** — `ssg-base`, `ssg-applications`, and `scap-security-guide` were not in the default archive. Canonical's USG package requires an Ubuntu Pro token for CIS profiles. Resolution: downloaded upstream ComplianceAsCode SSG release v0.1.74 and pinned it at `/opt/papyr/security/ssg/ssg-ubuntu2204-ds.xml`. Quarterly re-scan should re-pull the latest stable release.
2. **PowerShell command substitution mangling** — direct `$(date +%Y%m%d)` inside PowerShell SSH strings was evaluated locally. Resolution: used local helper scripts copied via `scp` for multi-line/date-sensitive commands, and renamed the one affected Lynis log to the correct dated filename.
3. **Banner appears before SSH command output** — expected after enabling `Banner /etc/issue.net`; final laptop-side `ssh papyr "whoami"` still returned `deploy`.
4. **Lynis target not reached** — post-harden index improved from `74` to `75`, below the aspirational `85`. Actual value is recorded; remaining findings are deferred to later hardening/runbook steps.

## Compliance Coverage Update

- OpenSCAP CIS Ubuntu 22.04 Level 1 Server baseline established using upstream SSG v0.1.74.
- OpenSCAP artifacts retained as raw XML and HTML under `/opt/papyr/security/`.
- Lynis post-hardening index recorded: `74 → 75`.
- Deferred items documented with operational justification in `/opt/papyr/security/security-baseline.md`.

## Git Commits + Push Confirmation

Pending in this working tree until the STEP-MIG-005 evidence/progress commit is created and pushed.

## Notes

- Quarterly OpenSCAP re-scan should refresh the upstream ComplianceAsCode SSG release before scanning.
- Hardening trajectory is incremental; this step prioritized safe additive remediations without touching SSH port/auth or production operability.
- Real SSH remains on alias `papyr` and returns `deploy` after Banner reload.
