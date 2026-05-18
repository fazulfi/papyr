# STEP-MIG-002 Setup Evidence

## Step Info

| Field | Value |
|-------|-------|
| Step | STEP-MIG-002 |
| Title | Intrusion Prevention Layer (CrowdSec, auditd, sysctl) |
| Track | VPS Migration (paranoid-grade) |
| Refs | `stepprompts/step-prompts-vps-migration.md` STEP-MIG-002 |
| Date | 2026-05-18 |
| Status | ✅ Completed |

## Scope

**In scope:**

- Install CrowdSec (community threat feed, replaces fail2ban)
- Install crowdsec-firewall-bouncer-iptables (executes IP bans)
- Install 3 CrowdSec collections: sshd, linux, nginx
- Purge fail2ban (replaced by CrowdSec)
- Enable unattended-upgrades + auto-reboot 04:00
- Configure auditd with Papyr forensic rules (sudo, sshd_config, identity files, /tmp + /var/tmp + /usr/{bin,sbin} writes)
- Apply kernel hardening sysctl (network + privilege)
- Block USB storage module
- Mask snapd service + socket
- Set umask 027 (login.defs + deploy user .bashrc/.profile)

**Out of scope:**

- AIDE filesystem integrity (deferred to STEP-MIG-003)
- /tmp noexec mount (deferred to STEP-MIG-003)
- Egress filter (deferred to STEP-MIG-005)
- OpenSCAP CIS scan (deferred to STEP-MIG-008)

## Files Created/Changed

### On VPS

| File | Action |
|------|--------|
| `/etc/apt/sources.list.d/crowdsec_crowdsec.list` | Created — packagecloud.io repo |
| `/etc/apt/keyrings/crowdsec_crowdsec-archive-keyring.gpg` | Created — repo signing key |
| `/etc/apt/apt.conf.d/52unattended-upgrades-local` | Created — auto-reboot 04:00 + remove unused |
| `/etc/audit/rules.d/papyr.rules` | Created — 10 forensic rules |
| `/etc/sysctl.d/99-papyr-hardening.conf` | Created — network + kernel hardening |
| `/etc/modprobe.d/disable-usb-storage.conf` | Created — USB storage block |
| `/etc/login.defs` | Modified — UMASK 027 |
| `/home/deploy/.bashrc` | Modified — appended `umask 027` |
| `/home/deploy/.profile` | Modified — appended `umask 027` |
| `/etc/systemd/system/snapd.service` | Symlinked → `/dev/null` (masked) |
| `/etc/systemd/system/snapd.socket` | Symlinked → `/dev/null` (masked) |

### Packages

| Package | Action |
|---|---|
| `crowdsec` | Installed |
| `crowdsec-firewall-bouncer-iptables` | Installed |
| `fail2ban` | Purged |

### In Repo

| File | Action |
|------|--------|
| `stepprompts/progress.md` | Modified — STEP-MIG-002 marked ✅, current step → STEP-MIG-003 |
| `stepprompts/step-prompts-vps-migration.md` | Modified — patched task 2.5 (non-interactive `debconf-set-selections`) and added task 2.11 (deploy umask) |

## Validation Evidence

End-to-end verification via `ssh papyr` running `mig002-verify.sh`:

### 1. CrowdSec Metrics (running + parsing logs)

```
| file:/var/log/audit/audit.log | 3.36k | 3.04k | 314 | 1.20k | - |
| file:/var/log/auth.log        |   189 |    11 | 178 |     - | - |
| file:/var/log/kern.log        |    20 |     - |  20 |     - | - |
| file:/var/log/syslog          |   533 |     - | 533 |     - | - |
```

### 2. CrowdSec Collections

```
crowdsecurity/linux   ✔️ enabled
crowdsecurity/nginx   ✔️ enabled
crowdsecurity/sshd    ✔️ enabled
```

Plus auto-included: auditd, base-http-scenarios, http-cve, whitelist-good-actors.

### 3. CrowdSec Firewall Bouncer

```
Name: cs-firewall-bouncer-1779128721
Type: crowdsec-firewall-bouncer
Auth Type: api-key
Status: active
```

iptables `CROWDSEC_CHAIN` chain registered:

```
CROWDSEC_CHAIN  all  --  0.0.0.0/0   0.0.0.0/0
Chain CROWDSEC_CHAIN (1 references)
```

### 4. fail2ban Purged

```
$ systemctl status fail2ban
Unit fail2ban.service could not be found.
```

### 5. unattended-upgrades

- `systemctl is-enabled unattended-upgrades` → `enabled`
- Dry-run successful (no syntax errors in `52unattended-upgrades-local`)
- Auto-reboot configured 04:00

### 6. auditd Rules (10 loaded)

```
-a always,exit -F arch=b64 -S execve -F euid=0 -F key=sudo_exec
-w /etc/ssh/sshd_config -p wa -k sshd_config
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/sudoers -p wa -k identity
-w /etc/sudoers.d -p wa -k identity
-w /tmp -p w -k tmp_writes
-w /var/tmp -p w -k vartmp_writes
-w /usr/bin -p w -k bin_writes
-w /usr/sbin -p w -k bin_writes
```

### 7. sysctl Hardening Sample

```
net.ipv4.tcp_syncookies = 1
kernel.dmesg_restrict = 1
fs.suid_dumpable = 0
kernel.yama.ptrace_scope = 2
```

Full set in `/etc/sysctl.d/99-papyr-hardening.conf` (network + kernel + fs + vm).

### 8. USB Storage Blocked

```
$ sudo modprobe -n -v usb-storage
install /bin/true
```

### 9. Disabled Services

```
avahi-daemon: not installed
cups:         not installed
snapd:        masked
snapd.socket: masked
```

### 10. umask Deploy User

```
/home/deploy/.bashrc:umask 027
/home/deploy/.profile:umask 027
```

## Definition of Done

- [x] CrowdSec running, 3 collections installed (sshd, linux, nginx)
- [x] CrowdSec firewall bouncer aktif
- [x] fail2ban purged
- [x] unattended-upgrades enabled, auto-reboot 04:00
- [x] auditd 10 rules loaded
- [x] sysctl hardening applied + persisted
- [x] USB storage disabled
- [x] Unused services disabled (avahi/cups/snapd)
- [x] umask 027 untuk new users
- [x] umask 027 applied ke deploy user (`.bashrc` + `.profile`)

## Cryptominer Kill-Chain Coverage

| Layer | Threat | MIG-002 Mitigation |
|---|---|---|
| 1 | SSH brute force | CrowdSec sshd collection (community blocklist + scenarios) |
| 2 | Privilege escalation | auditd sudo_exec + suid_dumpable=0 + ptrace_scope=2 |
| 3 | Drop binary `/tmp`/`/var/tmp` | auditd tmp_writes + vartmp_writes (detection only — noexec deferred to MIG-003) |
| 4 | Persist via /etc | auditd identity rules (passwd, shadow, sudoers, sudoers.d) + sshd_config watch |
| 5 | Outbound C2 | ⏳ Deferred to STEP-MIG-005 (egress filter) |
| 6 | Mining traffic anomaly | ⏳ Deferred to STEP-MIG-014/015 (Netdata + BetterStack) |

## Patches Applied to Step Prompts

Two improvements vs original step prompts (committed before execution):

1. **Task 2.5 made non-interactive** — replaced `dpkg-reconfigure -plow` (TUI prompt) with `debconf-set-selections` + `dpkg-reconfigure -f noninteractive` for fully scripted execution.
2. **Task 2.11 added** — explicit umask 027 to `deploy` user's `.bashrc` + `.profile` since `/etc/login.defs` UMASK only affects future user creation.

## Issues Encountered + Resolutions

1. **PowerShell quoting mangled `tee <<EOF`** — escape characters from PowerShell broke heredoc content (extra junk after `Automatic-Reboot` value broke `apt_pkg.init_config`). Resolution: write config files locally with `Write` tool, `scp` to VPS, install with `install -m 644 -o root -g root`.
2. **snapd still activatable via socket** — `systemctl disable snapd.service` left `snapd.socket` enabled. Resolution: also disable + mask `snapd.socket`.

## Git / Push / Deploy

### Commits

1. `28ecec4 docs(mig): patch STEP-MIG-002 for non-interactive unattended-upgrades and deploy umask`
2. `c2d7108 docs(mig): mark STEP-MIG-002 complete (intrusion prevention layer)`

### Push

- Pushed to `origin/main`

## Notes

- CrowdSec free tier sufficient for this scale; sharing community threat intel with other instances
- auditd logs at `/var/log/audit/audit.log`; rotation deferred to STEP-MIG-006
- unattended-upgrades reboot 04:00 = ~30 sec downtime if kernel update; acceptable for single-instance setup
- LibreOffice / OCRmyPDF subprocess exec from `/tmp` will fail when `/tmp` becomes noexec at STEP-MIG-003 — Dockerfile must set `TMPDIR=/opt/papyr/temp` (planned at MIG-008)
