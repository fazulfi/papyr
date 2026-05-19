# STEP-MIG-007 Setup Evidence

## Step Info

| Field | Value |
|-------|-------|
| Step | STEP-MIG-007 |
| Title | SSH 2FA + LISH Emergency Recovery |
| Track | VPS Migration (paranoid-grade) |
| Refs | `stepprompts/step-prompts-vps-migration.md` STEP-MIG-007 |
| Date | 2026-05-19 |
| Status | ⚠️ Implemented then rolled back same day per operator decision (key-only auth, TOTP file retained for future re-enable) |

## Scope

**In scope:**

- Install `libpam-google-authenticator` + `qrencode` for TOTP support
- Enroll deploy user with TOTP secret + 5 emergency scratch codes
- Add `pam_google_authenticator.so nullok` to `/etc/pam.d/sshd`
- Update `/etc/ssh/sshd_config` with `AuthenticationMethods publickey,keyboard-interactive` (idempotent edits)
- Reload sshd (no restart) so existing sessions are preserved
- Document IDCloudHost reseller emergency support ticket as primary recovery path
- Document Linode LISH as fallback for future direct-account access
- Document 2FA recovery procedure (scratch codes + nullok bypass)
- AIDE rebaseline post-2FA changes

**Out of scope:**

- Hardware token U2F/FIDO2 enrollment (could be added later as additional layer)
- Multi-user TOTP (only `deploy` user enrolled; future users follow same enrollment pattern)
- Linode LISH actual access (operator on IDCH reseller, no direct Linode dashboard)
- Phase D operator interactive TOTP login test (manual; server-side enforcement verified instead)

## Files Changed

### On VPS

| File | Action | Notes |
|------|--------|-------|
| `/home/deploy/.google_authenticator` | Created | mode 400, owner `deploy:deploy`, 164 bytes — TOTP secret + 5 scratch codes; secrets saved by operator to password manager only |
| `/etc/pam.d/sshd` | Replaced | added `auth required pam_google_authenticator.so nullok` line; backed up |
| `/etc/pam.d/sshd.bak.pre-mig-007` | Created | pre-MIG-007 PAM backup, 2133 bytes |
| `/etc/ssh/sshd_config` | Modified | idempotent edits: `ChallengeResponseAuthentication yes`, `KbdInteractiveAuthentication yes`, `AuthenticationMethods publickey,keyboard-interactive`; `UsePAM yes` already present |
| `/etc/ssh/sshd_config.bak.pre-mig-007` | Created | pre-MIG-007 sshd backup, 610 bytes |
| `/opt/papyr/security/security-baseline.md` | Appended | new sections: Emergency SSH Recovery (IDCH primary, LISH fallback) + 2FA Recovery |
| `/var/lib/aide/aide.db` | Rebaselined | 27485401 bytes (~27.5 MB), updated 08:36; captures TOTP file + PAM/sshd changes |

### In Repo

| File | Action |
|------|--------|
| `stepprompts/step-prompts-vps-migration.md` | Patched task 7.4 idempotent sshd edits + reload, task 7.5 reload-then-test ordering, task 7.6 IDCH primary recovery (commit `26e544a`) |
| `stepprompts/progress.md` | STEP-MIG-007 marked ✅, current step → STEP-MIG-008 |
| `docs/migration/STEP-MIG-007-setup-evidence.md` | Created (this file) |

## Validation Evidence

End-to-end captured in `mig007-phase-e.log` from operator's interactive session.

### Phase A — Packages installed

```
libpam-google-authenticator 20191231-2 amd64
qrencode 4.1.1-1 amd64
/usr/bin/google-authenticator
/usr/bin/qrencode
```

### Phase B — TOTP enrolled

```
-r-------- 1 deploy deploy 164 May 19 08:26 /home/deploy/.google_authenticator
```

Secret + 5 scratch codes saved to operator password manager. Not pasted to chat.

### Phase C — PAM + sshd_config applied

```
=== C5: Validate sshd_config ===
sshd -t exit: 0

=== C6: Show relevant sshd_config lines ===
2:Port 52022
6:PermitRootLogin no
7:PasswordAuthentication no
8:ChallengeResponseAuthentication yes
9:KbdInteractiveAuthentication yes
10:UsePAM yes
21:AllowUsers deploy
22:DenyUsers root
29:AuthenticationMethods publickey,keyboard-interactive

=== C7: Reload sshd (no disconnect) ===
active
sshd reloaded; active sessions preserved
```

PAM config lines:

```
5:@include common-auth
8:auth required pam_google_authenticator.so nullok
14:@include common-account
17:@include common-session
26:@include common-password
```

### Phase D — Server-side enforcement verified

```
$ ssh -o BatchMode=yes papyr "whoami"
deploy@172.235.251.193: Permission denied (keyboard-interactive).
exit=255

$ ssh -o BatchMode=yes -o PreferredAuthentications=publickey papyr "whoami"
deploy@172.235.251.193: Permission denied (keyboard-interactive).
exit=255
```

Both BatchMode tests confirm:

- pubkey alone is rejected (sshd refuses to skip TOTP step)
- `AuthenticationMethods publickey,keyboard-interactive` chain enforced at sshd level

Operator's interactive TOTP login (real human typing 6-digit code) was implicitly verified by the entire Phase E flow: every `scp` and `ssh papyr` invocation prompted `Verification code:` and succeeded once a valid code was entered.

### Phase E — Recovery doc + AIDE + final state

Recovery section appended to `security-baseline.md` (Emergency SSH Recovery + 2FA Recovery; visible in log lines 8-31).

AIDE rebaseline:

```
AIDE start: 2026-05-19T08:26:07+07:00
End timestamp: 2026-05-19 08:36:23 +0700 (run time: 10m 16s)
AIDE end:   2026-05-19T08:36:24+07:00
-rw------- 1 root root 27485401 May 19 08:36 /var/lib/aide/aide.db
```

Final state:

```
--- sshd active ---
active

--- backups exist ---
-rw-r----- 1 root root 2133 May 19 08:10 /etc/pam.d/sshd.bak.pre-mig-007
-rw-r----- 1 root root  610 May 19 08:10 /etc/ssh/sshd_config.bak.pre-mig-007

--- AIDE db ---
-rw------- 1 root root 27485401 May 19 08:36 /var/lib/aide/aide.db

--- whoami ---
deploy
```

## Definition of Done

- [x] Google Authenticator PAM module + qrencode installed
- [x] TOTP secret + 5 backup codes saved to operator password manager (not pasted to chat)
- [x] `~deploy/.google_authenticator` exists, mode 400, owner deploy:deploy
- [x] PAM stack includes `pam_google_authenticator.so nullok`
- [x] sshd has `AuthenticationMethods publickey,keyboard-interactive`
- [x] sshd reload (no restart) preserved existing sessions
- [x] SSH login dengan key + TOTP works (Phase E `scp/ssh` invocations all prompted Verification code)
- [x] SSH login dengan key only BLOCKED (BatchMode tests Permission denied)
- [x] LISH + IDCH emergency procedures documented in `security-baseline.md`
- [x] 2FA recovery procedure documented
- [x] AIDE database rebaselined post-2FA changes
- [x] sshd_config + PAM backups exist for rollback

## Patches Applied (commit `26e544a`)

Three pre-execution improvements:

1. **Task 7.4** — sshd_config edits switched from sed-substitute to grep-then-append idempotent pattern so reruns do not duplicate or silently no-op when lines deviate from expected format.
2. **Task 7.5** — reload-then-test ordering with explicit safety-net script and key-only test that must fail; reload (not restart) so existing sessions are preserved.
3. **Task 7.6** — LISH section augmented with IDCloudHost reseller support ticket as primary recovery path; LISH retained as fallback for future direct-Linode access. PAM ordering and `nullok` flag kept unchanged for graceful rollout.

## Issues + Resolutions

1. **Subagent could not complete Phase E because every fresh SSH session now requires TOTP.** Tool-driven SSH cannot type interactive 6-digit codes. **Resolution:** bundled all of Phase E (E1 baseline append + E2 AIDE rebaseline + E3 verification) into a single bash script `/tmp/mig007-phase-e.sh` which the operator ran once via `ssh papyr` (one TOTP prompt for upload, one for run, one for log download). Output captured at `/tmp/mig007-phase-e.log`, downloaded to laptop, parsed by Sisyphus to drive evidence finalization without further SSH calls.
2. **Windows OpenSSH `ControlMaster` is broken** (`getsockname failed: Not a socket`). Cannot reuse persistent SSH master to suppress repeated TOTP prompts. **Resolution:** documented as a known-limitation; future automation via WSL ssh client (which supports ControlMaster) or via remote `agent forward + ssh from VPS to itself` if needed.

## Risk Mitigation

- **Lockout risk** — `nullok` flag in PAM means users without a `~/.google_authenticator` file can still authenticate with pubkey alone. This is intentional graceful-rollout behavior. Future users joining `deploy` (none planned) would need to enroll TOTP before strict mode is flipped on. To enforce strict mode, remove `nullok` and reload sshd.
- **Lost phone** — 5 emergency scratch codes saved to password manager. One-shot use; regenerate via `google-authenticator` after recovery.
- **TOTP time skew** — VPS NTP-synced via `systemd-timesyncd`; verify with `timedatectl status` if codes are rejected.
- **PAM/sshd config rollback** — `/etc/pam.d/sshd.bak.pre-mig-007` and `/etc/ssh/sshd_config.bak.pre-mig-007` available for emergency restore via IDCH support console.

## Reseller Fallback Path

Operator does not have direct Linode dashboard / LISH access (VPS via IDCloudHost reseller). Recovery procedure documented in `/opt/papyr/security/security-baseline.md`:

1. Open IDCloudHost support ticket marked URGENT
2. IDCH ops provides emergency console (web SSH or VNC) within 30 min – 4 hour
3. Restore configs from `*.bak.pre-mig-007` files; reload sshd
4. SSH back from laptop

LISH path retained for future when direct Linode access is gained.

## Git / Push / Deploy

### Commits

1. `26e544a docs(mig): patch STEP-MIG-007 for idempotent sshd edits and IDCH recovery` (pre-execution)
2. (this evidence + progress commit, pushed alongside this doc)

### Push

- Pushed to `origin/main`

## Notes

- TOTP code valid 30s window; time sync important.
- 5 emergency scratch codes are one-shot; regenerate immediately after use.
- AIDE rebaseline took 10m 16s on this hardware (longer than initial 3m 34s at MIG-003 because more files exist now post-Docker, post-OpenSCAP, post-MIG-005).
- Linode LISH access requires Linode account 2FA — recommended to enable once direct access is gained (currently blocked by reseller chain).
- This step is the last hardening layer before application deployment. Subsequent steps (MIG-008+) focus on production Dockerfile, image build, secrets, deploy, monitoring.

## Rollback (operator decision, same day)

Operator: "jangan pake totp aja, ribet" (TOTP every-login friction is unacceptable for solo-operator workflow with frequent automation).

Decision: roll back enforcement to key-only auth. Preserve enrollment artifacts so re-enable is one-step in the future.

### What was reverted

- `/etc/pam.d/sshd` restored from `.bak.pre-mig-007` (no `pam_google_authenticator.so` line)
- `/etc/ssh/sshd_config` restored from `.bak.pre-mig-007` (no `AuthenticationMethods` line, `ChallengeResponseAuthentication` and `KbdInteractiveAuthentication` back to default `no`)
- sshd validated with `sshd -t` and reloaded (no disconnect)

### What was kept

- `/home/deploy/.google_authenticator` (mode 400) — operator can re-enable strict 2FA in seconds by re-running Phase C of original step
- TOTP secret + scratch codes still in operator password manager (not deleted)
- AIDE database rebaseline from Phase E (legitimate filesystem snapshot)
- `security-baseline.md` Emergency Recovery section (still useful even without TOTP)

### Implications

- Future SSH from any source: pubkey only. No TOTP prompt.
- If pubkey file (`~/.ssh/papyr/operator`) leaks → attacker gets full deploy access. Compensating controls:
  - Laptop disk encryption (Windows BitLocker)
  - Key file permission ACL (Windows default)
  - Repo `.gitignore` already excludes private keys
  - Activity monitoring via auditd (MIG-002) + AIDE (MIG-003) + CrowdSec
- Re-enable path: re-run STEP-MIG-007 Phase C + reload sshd. ~5 minutes including verification.

Operator-accepted risk. Tracked.
