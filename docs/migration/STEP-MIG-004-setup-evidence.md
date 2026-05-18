# STEP-MIG-004 Setup Evidence

## Step Info

| Field | Value |
|-------|-------|
| Step | STEP-MIG-004 |
| Title | Egress Filtering + Honeypot |
| Track | VPS Migration (paranoid-grade) |
| Refs | `stepprompts/step-prompts-vps-migration.md` STEP-MIG-004 |
| Date | 2026-05-19 |
| Status | ✅ Completed |

## Scope

**In scope:**

- Add UFW outbound deny rules for common cryptomining pool / stratum ports.
- Install `endlessh` as a fake SSH banner honeypot on public TCP/22.
- Reopen UFW TCP/22 only for the honeypot.
- Keep real SSH untouched on TCP/52022 with key-only `deploy` access.
- Validate from laptop and VPS that TCP/22 accepts connections and TCP/52022 real SSH remains operational.

**Out of scope:**

- No real sshd configuration changes.
- No fail2ban changes or install (CrowdSec remains the active replacement).
- No outbound default-deny whitelist mode; Papyr keeps UFW default allow outgoing plus explicit mining-port denies.
- Optional alternate honeypot on TCP/2222 skipped.

## Files Created/Changed

### On VPS

| File / Resource | Action |
|---|---|
| UFW rules | Added 10 IPv4 + 10 IPv6 `DENY OUT` rules for mining-related TCP ports: 3333, 4444, 5555, 7777, 8333, 9332, 14444, 14433, 9000, 6666 |
| `endlessh` package | Installed from Ubuntu jammy universe (`endlessh 1.1-5`) |
| `/etc/endlessh/config` | Installed with slow banner settings, `Port 22`, `Delay 10000`, `MaxLineLength 32`, `MaxClients 4096`, `LogLevel 1`, `BindFamily 4` |
| UFW rule `22/tcp` | Added `ALLOW IN` with comment `endlessh honeypot` |
| `/etc/systemd/system/endlessh.service.d/override.conf` | Created because Ubuntu package unit uses `PrivateUsers=true`; override sets `PrivateUsers=false` and `AmbientCapabilities=CAP_NET_BIND_SERVICE` so endlessh can bind TCP/22 without changing sshd |
| `endlessh.service` | Enabled and restarted; active on `0.0.0.0:22` |

### In Repo

| File | Action |
|------|--------|
| `docs/migration/STEP-MIG-004-setup-evidence.md` | Created (this file) |
| `stepprompts/progress.md` | STEP-MIG-004 marked ✅, current step → STEP-MIG-005 |

## Validation Evidence

End-to-end verification on `papyr-prod-id` and from laptop.

### 1. UFW Mining Deny-Out Rules

Command:

```bash
ssh papyr "sudo ufw status numbered"
```

Relevant output:

```text
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 52022/tcp                  ALLOW IN    Anywhere                   # SSH custom port
[ 2] 80/tcp                     ALLOW IN    Anywhere                   # HTTP
[ 3] 443/tcp                    ALLOW IN    Anywhere                   # HTTPS
[ 4] 3333/tcp                   DENY OUT    Anywhere                   (out) # mining pool stratum
[ 5] 4444/tcp                   DENY OUT    Anywhere                   (out) # mining pool stratum
[ 6] 5555/tcp                   DENY OUT    Anywhere                   (out) # mining pool stratum
[ 7] 7777/tcp                   DENY OUT    Anywhere                   (out) # mining pool stratum
[ 8] 8333/tcp                   DENY OUT    Anywhere                   (out) # bitcoin
[ 9] 9332/tcp                   DENY OUT    Anywhere                   (out) # litecoin
[10] 14444/tcp                  DENY OUT    Anywhere                   (out) # mining pool stratum tls
[11] 14433/tcp                  DENY OUT    Anywhere                   (out) # mining pool stratum tls
[12] 9000/tcp                   DENY OUT    Anywhere                   (out) # monero pool common
[13] 6666/tcp                   DENY OUT    Anywhere                   (out) # mining pool common
[17] 3333/tcp (v6)              DENY OUT    Anywhere (v6)              (out) # mining pool stratum
[18] 4444/tcp (v6)              DENY OUT    Anywhere (v6)              (out) # mining pool stratum
[19] 5555/tcp (v6)              DENY OUT    Anywhere (v6)              (out) # mining pool stratum
[20] 7777/tcp (v6)              DENY OUT    Anywhere (v6)              (out) # mining pool stratum
[21] 8333/tcp (v6)              DENY OUT    Anywhere (v6)              (out) # bitcoin
[22] 9332/tcp (v6)              DENY OUT    Anywhere (v6)              (out) # litecoin
[23] 14444/tcp (v6)             DENY OUT    Anywhere (v6)              (out) # mining pool stratum tls
[24] 14433/tcp (v6)             DENY OUT    Anywhere (v6)              (out) # mining pool stratum tls
[25] 9000/tcp (v6)              DENY OUT    Anywhere (v6)              (out) # monero pool common
[26] 6666/tcp (v6)              DENY OUT    Anywhere (v6)              (out) # mining pool common
```

Count check:

```text
DENY_OUT_COUNT
20
```

Expected was at least 10; result is 20 because UFW added IPv4 and IPv6 rules.

### 2. endlessh Config Installed

Command:

```bash
scp C:\Users\faizz\AppData\Local\Temp\opencode\endlessh-config papyr:/tmp/
ssh papyr "sudo install -m 644 -o root -g root /tmp/endlessh-config /etc/endlessh/config && rm /tmp/endlessh-config && cat /etc/endlessh/config"
```

Output:

```text
# endlessh — fake SSH banner sender
# Bind ke port 22 (yang sudah blocked oleh real sshd)
# Tujuan: waste scanner time dengan slow banner, generate detection signal
Port 22
Delay 10000
MaxLineLength 32
MaxClients 4096
LogLevel 1
BindFamily 4
```

### 3. endlessh Service Status

Command:

```bash
ssh papyr "sudo systemctl status endlessh --no-pager | head -10"
```

Output:

```text
● endlessh.service - Endlessh SSH Tarpit
     Loaded: loaded (/lib/systemd/system/endlessh.service; enabled; vendor preset: enabled)
    Drop-In: /etc/systemd/system/endlessh.service.d
             └─override.conf
     Active: active (running) since Tue 2026-05-19 02:07:46 WIB; 18ms ago
       Docs: man:endlessh(1)
   Main PID: 113423 ((endlessh))
      Tasks: 1 (limit: 9384)
     Memory: 568.0K
        CPU: 13ms
```

Active check:

```text
ENDLESSH_ACTIVE
active
```

### 4. endlessh Listening on TCP/22

Command:

```bash
ssh papyr "sudo ss -tlnp | grep ':22 '"
```

Output:

```text
LISTEN 0      4096         0.0.0.0:22         0.0.0.0:*    users:(("endlessh",pid=113423,fd=3))
```

### 5. Real sshd Still Listening on TCP/52022

Command:

```bash
ssh papyr "sudo ss -tlnp | grep ':52022 '"
```

Output:

```text
LISTEN 0      128          0.0.0.0:52022      0.0.0.0:*    users:(("sshd",pid=15307,fd=3))
```

### 6. Laptop TCP/22 Connectivity Test

Command from laptop PowerShell:

```powershell
Test-NetConnection -ComputerName 172.235.251.193 -Port 22 -InformationLevel Quiet
```

Output:

```text
Test-NetConnection-22=True
```

### 7. Real SSH Login Still Works

Command:

```bash
ssh papyr "whoami"
```

Output:

```text
deploy
```

## Definition of Done

- [x] UFW blocks outbound mining pool ports: 3333, 4444, 5555, 7777, 8333, 9332, 14444, 14433, 9000, 6666.
- [x] UFW deny-out count is >=10 (`20`, IPv4 + IPv6).
- [x] `endlessh` installed.
- [x] `/etc/endlessh/config` installed with slow banner config.
- [x] UFW allows TCP/22 for the honeypot.
- [x] `endlessh` is active and listening on `0.0.0.0:22`.
- [x] Real `sshd` remains on `0.0.0.0:52022`.
- [x] Laptop `Test-NetConnection` to TCP/22 returns `True`.
- [x] `ssh papyr "whoami"` returns `deploy`.

## Patches Applied

Two prompt/documentation patches were already committed at `6d7a13a` before execution:

1. PowerShell-native `Test-NetConnection` verification for laptop TCP/22 test.
2. Explicit `systemctl restart endlessh` after enable/config install.

Runtime patch applied during this execution:

1. **Systemd override for privileged bind** — Ubuntu `endlessh` unit shipped with `PrivateUsers=true`, causing `Permission denied` for TCP/22 even when running as root. Added `/etc/systemd/system/endlessh.service.d/override.conf` with `PrivateUsers=false` and `AmbientCapabilities=CAP_NET_BIND_SERVICE`, then `systemctl daemon-reload` + restart. This only affects endlessh and does not touch sshd.

## Issues Encountered + Resolutions

1. **Accidental local `sudo apt install` attempt** — initial command omitted `ssh papyr`; local Windows sudo is disabled, no local system change occurred. Resolution: reran correctly as `ssh papyr "sudo DEBIAN_FRONTEND=noninteractive apt install -y endlessh"`.
2. **`endlessh` failed to bind TCP/22 with `Permission denied`** — package service has `PrivateUsers=true` and no active bind capability. Resolution: install endlessh-only systemd drop-in with `PrivateUsers=false` and `AmbientCapabilities=CAP_NET_BIND_SERVICE`; restart confirmed `0.0.0.0:22` listener.

## Cryptominer Kill-Chain Coverage Update

| Layer | Threat | MIG-004 Mitigation |
|---|---|---|
| 1 | Internet SSH scanners probing default TCP/22 | `endlessh` fake SSH banner slowly drips data and wastes attacker/scanner time while producing detection signal |
| 5 | Cryptominer C2 / mining pool egress | UFW explicit `DENY OUT` rules block common mining pool / stratum ports while preserving default operational outbound traffic |

Additive with MIG-003:

- MIG-003 blocks common drop-and-execute path via `/tmp` and `/var/tmp` `noexec`.
- MIG-004 blocks common monetization path via mining pool egress and increases noise/cost for SSH scanners.

## Git / Push / Deploy

### Commits

1. `6d7a13a` — pre-execution patch commit for STEP-MIG-004 prompt improvements.
2. This evidence/progress commit: `docs(mig): mark STEP-MIG-004 complete (egress filter + honeypot)`.

### Push

- Pushed to `origin/main` after evidence commit.

## Notes

- Real SSH config was not modified. `sshd` stayed on TCP/52022 throughout.
- Existing SSH session was not closed.
- fail2ban was not installed or touched.
- UFW added both IPv4 and IPv6 deny-out rules, so the verification count is 20.
- Reboot deferred; not required for UFW/endlessh activation. Apt reported a pending kernel upgrade unrelated to this step.
