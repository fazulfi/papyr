# STEP-MIG-003 Setup Evidence

## Step Info

| Field | Value |
|-------|-------|
| Step | STEP-MIG-003 |
| Title | Filesystem Integrity + Rootkit Detection |
| Track | VPS Migration (paranoid-grade) |
| Refs | `stepprompts/step-prompts-vps-migration.md` STEP-MIG-003 |
| Date | 2026-05-19 |
| Status | ✅ Completed |

## Scope

**In scope:**

- Install AIDE (Advanced Intrusion Detection Environment) + initialize baseline
- Configure Papyr-specific AIDE rules (`/etc/aide/aide.conf.d/99_papyr_local`)
- Daily cron with journald alerting on file changes
- Mount `/tmp` and `/var/tmp` as tmpfs with `noexec,nosuid,nodev`
- Install chkrootkit + rkhunter + weekly cron
- Install Lynis + record baseline hardening index

**Out of scope:**

- AIDE update for `/opt/papyr/` files (deferred to STEP-MIG-008 when backend deployed)
- TMPDIR override for backend processes (deferred to STEP-MIG-008)
- Egress filter (STEP-MIG-005)
- OpenSCAP CIS scan (STEP-MIG-008)

## Files Created/Changed

### On VPS

| File | Action |
|------|--------|
| `/etc/aide/aide.conf.d/99_papyr_local` | Created — Papyr-specific rules using `Full` group |
| `/var/lib/aide/aide.db` | Created — 26 MB baseline database |
| `/etc/cron.daily/aide-check` | Created — explicit `--config` + journald alerting |
| `/etc/fstab` | Modified — appended Papyr hardening tmpfs block |
| `/etc/fstab.bak.pre-mig-003` | Created — pre-MIG-003 backup |
| `/etc/cron.weekly/rootkit-scan` | Created — chkrootkit + rkhunter + journald alerts |
| `/etc/rkhunter.conf.local` | Modified — `WEB_CMD=""` (disable Ubuntu invalid /bin/false default) |
| `/opt/papyr/security/lynis-baseline-20260519.log` | Created — 30 KB Lynis report |

### Active Mounts (tmpfs)

```
tmpfs on /tmp     type tmpfs (rw,nosuid,nodev,noexec,relatime,size=2097152k,inode64)
tmpfs on /var/tmp type tmpfs (rw,nosuid,nodev,noexec,relatime,size=524288k,inode64)
```

### Packages Installed

| Package | Purpose |
|---|---|
| `aide`, `aide-common` | File integrity baseline |
| `chkrootkit` | Rootkit signature scanner |
| `rkhunter` | Rootkit hunter scanner |
| `lynis` | Security audit |

### In Repo

| File | Action |
|------|--------|
| `stepprompts/step-prompts-vps-migration.md` | Patched task 3.2 (Full group), 3.4 (lsof safety), 3.7 (chown ordering) |
| `docs/migration/STEP-MIG-003-setup-evidence.md` | Created (this file) |
| `stepprompts/progress.md` | STEP-MIG-003 marked ✅, current step → STEP-MIG-004 |

## Validation Evidence

End-to-end verification on `papyr-prod-id`:

### 1. AIDE Database

```
-rw------- 1 root root 26217192 May 19 01:44 /var/lib/aide/aide.db
```

### 2. AIDE Manual Check

```
sudo aide --config /etc/aide/aide.conf --check
End timestamp: 2026-05-19 01:56:15 +0700 (run time: 6m 13s)
```

No differences against baseline (clean).

### 3. AIDE Daily Cron

```
-rwxr-xr-x 1 root root 431 May 19 01:45 /etc/cron.daily/aide-check
```

Explicit `--config /etc/aide/aide.conf` flag plus journald alert on `found differences`.

### 4. tmpfs noexec Mounts

```
tmpfs on /tmp     type tmpfs (rw,nosuid,nodev,noexec,relatime,size=2097152k,inode64)
tmpfs on /var/tmp type tmpfs (rw,nosuid,nodev,noexec,relatime,size=524288k,inode64)
```

### 5. /tmp Exec Test

```
$ /tmp/papyr-noexec-test.sh
PASS: /tmp exec blocked (Permission denied)
```

### 6. Rootkit Scanners

- `Rootkit Hunter 1.4.6` installed
- `chkrootkit version 0.55` installed

### 7. Weekly Rootkit Scan Cron

```
-rwxr-xr-x 1 root root 548 May 19 01:47 /etc/cron.weekly/rootkit-scan
```

### 8. Lynis Baseline

```
/opt/papyr/security/lynis-baseline-20260519.log (29823 bytes, owner deploy:deploy)
Hardening index : 74 [##############      ]
```

Above 70 baseline target ✅.

### 9. fstab Entries Persisted

```
# Papyr hardening — restrict /tmp and /var/tmp
tmpfs   /tmp     tmpfs   defaults,nosuid,nodev,noexec,mode=1777,size=2G  0 0
tmpfs   /var/tmp tmpfs   defaults,nosuid,nodev,noexec,mode=1777,size=512M 0 0
```

## Definition of Done

- [x] AIDE database initialized at `/var/lib/aide/aide.db` (26 MB)
- [x] AIDE daily cron executable at `/etc/cron.daily/aide-check` (with `--config` fix)
- [x] `/tmp` and `/var/tmp` mounted as tmpfs with `noexec,nosuid,nodev`
- [x] /tmp exec test blocked
- [x] chkrootkit + rkhunter installed
- [x] Weekly rootkit scan cron at `/etc/cron.weekly/rootkit-scan`
- [x] Lynis baseline saved at `/opt/papyr/security/lynis-baseline-20260519.log`
- [x] Hardening index 74 (target ≥70 ✅)

## Cryptominer Kill-Chain Coverage (additive over MIG-002)

| Layer | Threat | MIG-003 Mitigation |
|---|---|---|
| 3 | Drop binary in `/tmp` | tmpfs noexec — block execution at filesystem layer (defense in depth with auditd from MIG-002) |
| 3 | Drop binary in `/var/tmp` | tmpfs noexec on `/var/tmp` |
| 4 | Modify `/etc`, `/usr/bin` | AIDE daily check — flag any unauthorized file change |
| 5 | Persist via known rootkit | chkrootkit + rkhunter weekly scan — signature-based detection |

## Patches Applied to Step Prompts

Pre-execution improvements:

1. **Task 3.2 group selection** — Ubuntu's AIDE main config defines `Full` (line 51), not `NORMAL`. Drop-in is included before group definitions, so NORMAL group lookup fails. Replaced with `Full` (covers OwnerMode + i + n + Size + l + X + Checksums) and documented Ubuntu-specific behavior.
2. **Task 3.4 lsof safety check** — Added `lsof /tmp` and `lsof /var/tmp` checks before the tmpfs remount so an in-use file does not silently abort the mount.
3. **Task 3.7 chown ordering** — Moved `chown -R deploy:deploy /opt/papyr` to before the `lynis audit` write so the baseline log is owned by deploy from creation.

## Issues Encountered + Resolutions

1. **`group 'NORMAL' is not defined`** at `aideinit` — Ubuntu loads `aide.conf.d/` before main groups defined. Resolution: switch from `NORMAL` to `Full` group; documented in patches above.
2. **rkhunter `--update` invalid `WEB_CMD`** — Ubuntu ships `WEB_CMD="/bin/false"` which is not absolute path. Resolution: append `WEB_CMD=""` to `/etc/rkhunter.conf.local` to disable remote update; signatures from package still work for `--check`.
3. **Custom `/etc/cron.daily/aide-check` missing `--config`** — Aide CLI requires `--config` flag explicitly (it does not auto-find `/etc/aide/aide.conf`). Resolution: rewrite cron with `aide --config /etc/aide/aide.conf --check`.
4. **PowerShell quoting mangled `tee <<EOF`** (recurring) — Resolution: continue pattern of write-locally + scp + install. Used 6 helper scripts in `$TEMP\opencode\` to bypass quoting.
5. **tmpfs mount hides `/tmp/rootkit-scan`** — Phase B's tmpfs mount happened before `/tmp/rootkit-scan` was scp'd, hiding the file. Resolution: re-scp helper to `/tmp` (now tmpfs) and resume.

## Risk Mitigation

- **`/tmp` noexec impact on backend** — At MIG-008, backend Dockerfile must set `TMPDIR=/opt/papyr/temp` so LibreOffice / OCRmyPDF subprocess exec works. Documented in autopilot rules + step 3.4 caveat.
- **Lynis hardening index 74** — comfortably above 70 baseline. Target post-MIG-005 (egress filter): >85.
- **AIDE no-op on `/opt/papyr/`** — expected since directory does not exist yet; rule pre-loaded so no extra config touch needed at MIG-008.

## Git / Push / Deploy

### Commits

1. `806734c docs(mig): patch STEP-MIG-003 for safer tmpfs mount and ordering` (pre-execution patches)
2. (this evidence doc commit, pushed alongside progress.md mark complete)

### Push

- Pushed to `origin/main`

## Notes

- AIDE init took 3m34s; full check 6m13s. Acceptable for daily cron at 06:25 (Ubuntu default cron.daily window).
- Lynis report has 47 actionable suggestions; review and pick low-risk improvements at a later hardening pass (not in MIG-003 scope).
- rkhunter `--check` output rotates to `/var/log/rkhunter.log`; weekly cron will aggregate into `/var/log/rootkit-scan.log` for journald-friendly format.
- Reboot deferred — tmpfs mounts and sysctl config persist via fstab + sysctl.d, no reboot required.
