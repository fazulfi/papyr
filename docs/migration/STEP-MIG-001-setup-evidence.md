# STEP-MIG-001 Setup Evidence

## Step Info

| Field | Value |
|-------|-------|
| Step | STEP-MIG-001 |
| Title | Emergency Lockdown VPS |
| Track | VPS Migration (paranoid-grade) |
| Refs | `stepprompts/step-prompts-vps-migration.md` STEP-MIG-001 |
| Date | 2026-05-18 |
| Status | ✅ Completed |

## Scope

**In scope:**

- First (one-time) SSH login as root via leaked password
- Install baseline tools (curl, wget, git, htop, ufw, fail2ban, auditd, unattended-upgrades, sudo)
- Set timezone Asia/Jakarta + hostname `papyr-prod-id`
- Rotate root password (random 32-char) → password manager
- Create `deploy` user with sudo NOPASSWD
- Setup `/home/deploy/.ssh/authorized_keys` with operator pubkey
- Harden `sshd_config`: port 52022, PermitRootLogin no, PasswordAuthentication no, AllowUsers deploy
- Configure UFW: deny incoming default + allow 52022/80/443
- Test deploy SSH on port 52022 + verify root SSH blocked
- Configure SSH client alias `papyr` di laptop (`~/.ssh/config`)

**Out of scope:**

- Intrusion prevention (deferred to STEP-MIG-002)
- 2FA TOTP layer for SSH (deferred to STEP-MIG-007)
- Filesystem integrity monitoring (deferred to STEP-MIG-003)

## Files Created/Changed

### On VPS

| File | Action |
|------|--------|
| `/etc/ssh/sshd_config` | Replaced — Papyr hardened config |
| `/etc/ssh/sshd_config.bak.pre-mig-001` | Backup of pre-MIG-001 config (rollback safety) |
| `/etc/sudoers.d/deploy` | Created — `deploy ALL=(ALL) NOPASSWD:ALL`, mode 0440 |
| `/home/deploy/.ssh/authorized_keys` | Created — operator pubkey, mode 600, owner deploy:deploy |
| `/home/deploy/.ssh/` | Created — mode 700, owner deploy:deploy |
| `/etc/hosts` | Modified — added `127.0.0.1 papyr-prod-id` |

### On Laptop

| File | Action |
|------|--------|
| `~/.ssh/config` | Modified — appended `Host papyr` block |

### In Repo

| File | Action |
|------|--------|
| `stepprompts/progress.md` | Modified — STEP-MIG-001 marked ✅, current step → STEP-MIG-002 |
| `stepprompts/step-prompts-vps-migration.md` | Modified — added SSH alias convention block to autopilot rules |
| `docs/vps-access.md` (gitignored) | Modified — post-MIG-001 credentials block + SSH alias usage table |

## Validation Evidence

### SSH Connection Verification

End-to-end verification via SSH alias:

```bash
$ ssh papyr "hostname && whoami && uname -a"
papyr-prod-id
deploy
Linux papyr-prod-id 5.15.0-x.x-generic ... x86_64 GNU/Linux
```

### sshd Configuration Verification

```
Port 52022
PermitRootLogin no
PasswordAuthentication no
AllowUsers deploy
```

### UFW Status

```
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 52022/tcp                  ALLOW IN    Anywhere                   # SSH custom port
[ 2] 80/tcp                     ALLOW IN    Anywhere                   # HTTP
[ 3] 443/tcp                    ALLOW IN    Anywhere                   # HTTPS
[ 4] 52022/tcp (v6)             ALLOW IN    Anywhere (v6)              # SSH custom port
[ 5] 80/tcp (v6)                ALLOW IN    Anywhere (v6)              # HTTP
[ 6] 443/tcp (v6)               ALLOW IN    Anywhere (v6)              # HTTPS
```

Default policies: `deny incoming`, `allow outgoing`.

### Sudo Verification

```bash
$ ssh papyr "sudo -n whoami"
root
```

NOPASSWD works (no password prompt).

### Root Block Verification

- `ssh -p 52022 root@172.235.251.193` → `Permission denied (publickey)` (sshd: PermitRootLogin no + DenyUsers root)
- `ssh root@172.235.251.193` → `Connection refused` (UFW blocks port 22)

### Backup Safety

- `/etc/ssh/sshd_config.bak.pre-mig-001` exists for emergency rollback
- Root terminal closed only after Phase E verification PASSED

## Definition of Done

- [x] Root password rotated, password lama tidak bisa pakai lagi
- [x] Root password baru di password manager (entry "Papyr Linode root (post-MIG-001)")
- [x] Deploy password di password manager (entry "Papyr deploy user password")
- [x] User `deploy` SSH on port 52022 dengan key only (no password)
- [x] User `deploy` `sudo -n whoami` → `root` tanpa prompt
- [x] Root SSH blocked: port 22 + port 52022
- [x] UFW active: 52022/80/443 ALLOW, default deny
- [x] Terminal A (root) closed
- [x] sshd_config backup ada: `/etc/ssh/sshd_config.bak.pre-mig-001`
- [x] SSH alias `papyr` working di laptop

## Risk Mitigation

- **Multiple safety nets** active during execution: root terminal A kept open as fallback, deploy SSH tested in Terminal B before sshd_config edit, port 52022 verified in Terminal C before closing root
- **No LISH access** (reseller account) acknowledged — fallback was IDCH support ticket → ultimately not needed
- **Password rotation** done immediately after first login (Phase B), minimizing window where leaked password is valid

## Git / Push / Deploy

### Commits

1. `19c039c docs(mig): mark STEP-MIG-001 complete and document SSH alias convention`
2. `4a5f266 docs(mig): schedule R2 rotation at MIG-020 with compensating controls`

### Push

- Pushed to `origin/main`

## Notes

- VPS is now reachable only via `ssh papyr` (deploy user, port 52022, key-only)
- For emergency root access via LISH, use new password from password manager
- All future steps (MIG-002+) MUST use `ssh papyr` shorthand or `deploy@172.235.251.193:52022` with key — never root
- IDCH reseller fallback documented as last-resort recovery path
