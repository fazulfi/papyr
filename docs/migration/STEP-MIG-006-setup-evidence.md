# STEP-MIG-006 Setup Evidence

## Step Info

| Field | Value |
|-------|-------|
| Step | STEP-MIG-006 |
| Title | Server Foundation (Docker + Swap + Dirs) |
| Track | VPS Migration (paranoid-grade) |
| Refs | `stepprompts/step-prompts-vps-migration.md` STEP-MIG-006 |
| Date | 2026-05-19 |
| Status | ✅ Completed |

## Scope

**In scope:**

- Install Docker CE from Docker's official Ubuntu repository.
- Install Docker Compose plugin and Buildx plugin.
- Harden `/etc/docker/daemon.json` with JSON log rotation, `no-new-privileges`, `icc: false`, `live-restore`, disabled userland proxy, and `userns-remap: default`.
- Add `deploy` to the `docker` group and verify a fresh SSH session can run Docker without sudo.
- Create and persist a 4GB `/swapfile` while preserving the pre-existing Linode swap partition.
- Create `/opt/papyr` application directory tree with strict permissions while preserving `/opt/papyr/security/` from STEP-MIG-005.
- Install Papyr logrotate config and weekly Docker prune cron.
- Rebaseline AIDE after Docker/package/filesystem changes.

**Out of scope:**

- No `sshd` or SSH port changes. Real SSH remains on alias `papyr` / port `52022`.
- No application deployment or `docker-compose.yml` creation.
- No frontend or application source changes.
- No edits to `docs/35_Papyr_VPS_Migration_Plan_v1.0.md` or `frontend/next.config.ts`.

## Files Created/Changed

### On VPS

| File / Resource | Action |
|---|---|
| `/etc/apt/keyrings/docker.asc` | Installed Docker official GPG key |
| `/etc/apt/sources.list.d/docker.list` | Added Docker official Ubuntu repository |
| Docker CE packages | Installed `docker-ce`, `docker-ce-cli`, `containerd.io`, `docker-buildx-plugin`, `docker-compose-plugin` |
| `/etc/docker/daemon.json` | Created daemon hardening config with `userns-remap=default`, `no-new-privileges`, `icc=false`, `live-restore`, `userland-proxy=false`, and `json-file` 10MB×3 log rotation |
| `deploy` user groups | Added `deploy` to `docker` group |
| `/swapfile` | Created 4GB swap file, mode `600`, active |
| `/etc/fstab` | Appended `/swapfile none swap sw 0 0` idempotently |
| `/opt/papyr/production` | Created, owned `deploy:deploy`, mode `700` |
| `/opt/papyr/nginx` | Created, owned `deploy:deploy`, mode `750` |
| `/opt/papyr/nginx/conf.d` | Created, owned `deploy:deploy`, mode `750` |
| `/opt/papyr/nginx/ssl` | Created, owned `deploy:deploy`, mode `700` |
| `/opt/papyr/logs` | Created, owned `deploy:deploy`, mode `750` |
| `/opt/papyr/backups` | Created, owned `deploy:deploy`, mode `750` |
| `/opt/papyr/temp` | Created, owned `deploy:deploy`, mode `750` |
| `/opt/papyr/security/` | Preserved from STEP-MIG-005; contents verified intact |
| `/etc/logrotate.d/papyr` | Installed Papyr weekly logrotate config, mode `644`, root-owned |
| `/etc/cron.weekly/docker-prune` | Installed weekly Docker prune cron, mode `755`, root-owned |
| `/var/lib/aide/aide.db` | Rebaselined after Docker/swap/directory/logrotate/cron changes |

### In Repo

| File | Action |
|------|--------|
| `docs/migration/STEP-MIG-006-setup-evidence.md` | Created (this file) |
| `stepprompts/progress.md` | STEP-MIG-006 marked ✅, current step → STEP-MIG-007 |

## Validation Evidence

### 1. Docker CE + Compose Installed

Command:

```bash
scp C:\Users\faizz\AppData\Local\Temp\opencode\mig006-phase-a.sh papyr:/tmp/mig006-phase-a.sh
ssh papyr "bash /tmp/mig006-phase-a.sh; rm /tmp/mig006-phase-a.sh"
```

Relevant output:

```text
=== A4: Verify ===
Docker version 29.5.1, build 2518b52
Docker Compose version v5.1.3
=== A5: Add deploy to docker group ===
deploy : deploy sudo docker
```

### 2. Docker Daemon Hardening Applied

Command:

```bash
scp C:\Users\faizz\AppData\Local\Temp\opencode\docker-daemon.json C:\Users\faizz\AppData\Local\Temp\opencode\mig006-phase-b.sh papyr:/tmp/
ssh papyr bash /tmp/mig006-phase-b.sh
```

Relevant output:

```text
active
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "userland-proxy": false,
  "live-restore": true,
  "no-new-privileges": true,
  "icc": false,
  "userns-remap": "default"
}
docker-info-ok
```

`userns-remap` was kept; the daemon restarted successfully and `docker info` succeeded.

### 3. Swap File Created + Persisted

Commands:

```bash
ssh papyr sudo swapon --show
ssh papyr "if ! sudo swapon --show | grep -q /swapfile; then sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile 2>&1 | tail -3 && sudo swapon /swapfile && sudo swapon --show; fi"
ssh papyr "grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab"
ssh papyr "free -h | grep -E 'Mem|Swap'; sysctl vm.swappiness"
```

Output:

```text
NAME     TYPE      SIZE USED PRIO
/dev/sdb partition 496M   0B   -2
Setting up swapspace version 1, size = 4 GiB (4294963200 bytes)
no label, UUID=e0a07a02-22ac-49e8-9af9-109d99ba0ec2
NAME      TYPE      SIZE USED PRIO
/dev/sdb  partition 496M   0B   -2
/swapfile file        4G   0B   -3
/swapfile none swap sw 0 0
Mem:           7.8Gi       365Mi       1.8Gi       1.0Mi       5.6Gi       7.1Gi
Swap:          4.5Gi          0B       4.5Gi
vm.swappiness = 10
```

The VPS already had a 496M Linode swap partition. STEP-MIG-006 added the required 4GB `/swapfile`; total swap now shows 4.5Gi.

### 4. Papyr Directory Tree + Security Preservation

Command:

```bash
scp C:\Users\faizz\AppData\Local\Temp\opencode\mig006-phase-d.sh papyr:/tmp/
ssh papyr bash /tmp/mig006-phase-d.sh
```

Output:

```text
total 32
drwxr-x--- 8 deploy deploy 4096 May 19 07:43 .
drwxr-xr-x 4 root   root   4096 May 19 07:41 ..
drwxr-x--- 2 deploy deploy 4096 May 19 07:43 backups
drwxr-x--- 2 deploy deploy 4096 May 19 07:43 logs
drwxr-x--- 4 deploy deploy 4096 May 19 07:43 nginx
drwx------ 2 deploy deploy 4096 May 19 07:43 production
drwxr-x--- 3 deploy deploy 4096 May 19 07:10 security
drwxr-x--- 2 deploy deploy 4096 May 19 07:43 temp
=== /opt/papyr/security still intact ===
lynis-baseline-20260519.log
lynis-postharden-20260519.log
openscap-report-20260519.html
openscap-results-20260519.xml
security-baseline.md
ssg
```

### 5. Logrotate + Weekly Docker Prune Installed

Command:

```bash
scp C:\Users\faizz\AppData\Local\Temp\opencode\papyr-logrotate.conf C:\Users\faizz\AppData\Local\Temp\opencode\docker-prune C:\Users\faizz\AppData\Local\Temp\opencode\mig006-phase-e.sh papyr:/tmp/
ssh papyr bash /tmp/mig006-phase-e.sh
```

Output:

```text
WARNING: logrotate in debug mode does nothing except printing debug messages!  Consider using verbose mode (-v) instead if this is not what you want.

reading config file /etc/logrotate.d/papyr
Reading state from file: /var/lib/logrotate/status
Allocating hash table for state file, size 64 entries
Creating new state
Creating new state
Creating new state
Creating new state
Creating new state
-rwxr-xr-x 1 root root 250 May 19 07:43 /etc/cron.weekly/docker-prune
-rw-r--r-- 1 root root 381 May 19 07:43 /etc/logrotate.d/papyr
```

### 6. Deploy Can Run Docker Without Sudo

Command:

```bash
ssh papyr "whoami; docker run --rm hello-world | head -5"
```

Output:

```text
deploy
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
4f55086f7dd0: Pulling fs layer
4f55086f7dd0: Verifying Checksum
4f55086f7dd0: Download complete
4f55086f7dd0: Pull complete
Digest: sha256:0e760fdfbc48ba8041e7c6db999bb40bfca508b4be580ac75d32c4e29d202ce1
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
```

### 7. AIDE Rebaseline

Command:

```bash
ssh papyr "echo START; date; sudo aide --config /etc/aide/aide.conf --update 2>&1 | tail -10; echo COPY_DB; sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db; sudo ls -la /var/lib/aide/aide.db; echo DONE; date"
```

Output:

```text
START
Tue May 19 07:43:42 AM WIB 2026
 HAVAL     : BDOps50w2GckKKysF9rWJTmmZyJg89C5
             YVxqNZ4KP4A=
 WHIRLPOOL : QvrujJB3HHSY3CVH+6k4F6QH3y7+fD1h
             Ev5P/6fhcgG8Igdo1b/sFWUXCWKarh7i
             rbCYdQBKVbXEoBzOPJrOcQ==
 GOST      : 21nOc7nHd8KoF7Dyog+3O2jO4rXxD4+D
             MxbMP7CislI=

End timestamp: 2026-05-19 07:53:35 +0700 (run time: 9m 53s)
COPY_DB
-rw------- 1 root root 27471127 May 19 07:53 /var/lib/aide/aide.db
DONE
Tue May 19 07:53:35 AM WIB 2026
```

### 8. Final Verification Summary

Command:

```bash
scp C:\Users\faizz\AppData\Local\Temp\opencode\mig006-verify.sh papyr:/tmp/
ssh papyr bash /tmp/mig006-verify.sh
ssh papyr whoami
```

Output:

```text
=== Docker ===
Docker version 29.5.1, build 2518b52
Docker Compose version v5.1.3
active

=== Daemon config ===
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "userland-proxy": false,
  "live-restore": true,
  "no-new-privileges": true,
  "icc": false,
  "userns-remap": "default"
}

=== Group ===
docker

=== Swap ===
Mem:           7.8Gi       345Mi       203Mi       1.0Mi       7.2Gi       7.1Gi
Swap:          4.5Gi       0.0Ki       4.5Gi
vm.swappiness = 10

=== Dirs ===
total 32
drwxr-x--- 8 deploy deploy 4096 May 19 07:43 .
drwxr-xr-x 4 root   root   4096 May 19 07:41 ..
drwxr-x--- 2 deploy deploy 4096 May 19 07:43 backups
drwxr-x--- 2 deploy deploy 4096 May 19 07:43 logs
drwxr-x--- 4 deploy deploy 4096 May 19 07:43 nginx
drwx------ 2 deploy deploy 4096 May 19 07:43 production
drwxr-x--- 3 deploy deploy 4096 May 19 07:10 security
drwxr-x--- 2 deploy deploy 4096 May 19 07:43 temp

=== /opt/papyr/security still intact ===
lynis-baseline-20260519.log
lynis-postharden-20260519.log
openscap-report-20260519.html
openscap-results-20260519.xml
security-baseline.md
ssg

=== Cron ===
-rwxr-xr-x 1 root root 250 May 19 07:43 /etc/cron.weekly/docker-prune
-rw-r--r-- 1 root root 381 May 19 07:43 /etc/logrotate.d/papyr

=== AIDE ===
-rw------- 1 root root 27471127 May 19 07:53 /var/lib/aide/aide.db

=== whoami ===
deploy
deploy
```

## Definition of Done

- [x] Docker CE 24.x+ installed from the official Docker repository (`29.5.1`).
- [x] Docker Compose plugin v2+ installed (`v5.1.3`).
- [x] Docker daemon hardening applied with log rotation, `no-new-privileges`, `userns-remap`, `live-restore`, `icc=false`, and `userland-proxy=false`.
- [x] `docker info` succeeds after daemon restart.
- [x] `deploy` is in the `docker` group.
- [x] Fresh SSH session can run `docker run --rm hello-world` without sudo.
- [x] 4GB `/swapfile` active and persisted in `/etc/fstab`.
- [x] `vm.swappiness = 10`.
- [x] `/opt/papyr/{production,nginx,nginx/conf.d,nginx/ssl,logs,security,backups,temp}` exists with strict permissions.
- [x] `/opt/papyr/security/` retained STEP-MIG-005 evidence files.
- [x] Papyr logrotate config installed and dry-run parsed without config errors.
- [x] Weekly Docker prune cron installed executable.
- [x] AIDE database rebaselined after Docker install and filesystem changes.
- [x] Final `ssh papyr "whoami"` returns `deploy`.

## Patches Applied

Prompt/documentation patches already committed at `d009114` before execution:

1. `userns-remap` caveat for shifted host ownership on bind mounts.
2. Directory safety note to preserve existing `/opt/papyr/security/` files.
3. Re-SSH pattern for Docker group membership verification.
4. AIDE rebaseline note after Docker installation and filesystem changes.

Runtime implementation followed the patched pattern by writing multi-line files/scripts locally under `C:\Users\faizz\AppData\Local\Temp\opencode\`, copying them to `/tmp/`, and installing via `sudo install` or running remote scripts.

## Issues Encountered + Resolutions

1. **PowerShell/SSH quoting broke initial Phase B inline command** — first attempt produced `bash: -c: line 2: syntax error: unexpected end of file`, before applying daemon config. Resolution: switched to the revised scp'd helper-script pattern and reran Phase B successfully.
2. **A second quoted helper invocation also hit SSH quote parsing** — `ssh papyr "bash /tmp/mig006-phase-b.sh; ..."` produced `unexpected EOF while looking for matching '"'`. Resolution: used `ssh papyr bash /tmp/mig006-phase-b.sh` with no remote shell quoting; daemon hardening then completed.
3. **Existing 496M swap partition present** — `swapon --show` was not empty because `/dev/sdb` was already active. Resolution: treated `/swapfile` as absent, created the required 4GB `/swapfile`, and persisted it. Final `free -h` shows total swap `4.5Gi`.
4. **Docker Compose major version differs from prompt expectation** — installed official Docker plugin reports `Docker Compose version v5.1.3`, not a v2 string. Resolution: recorded actual official repo version; Docker CE and compose verification both pass.
5. **`userns-remap` fallback was not needed** — Docker restarted cleanly with `userns-remap: default` and `docker info` succeeded. Resolution: kept `userns-remap=default` and recorded future volume-ownership risk below.

## Risk Follow-up

- `userns-remap=default` shifts container root to host UID/GID range `100000+`. Bind-mounted volumes written by containers may be owned by remapped IDs instead of `deploy:deploy`. Address and test ownership strategy in STEP-MIG-009 when production `docker-compose.yml` and volumes are created.

## Git Commits + Push Confirmation

Pending in this working tree until the STEP-MIG-006 evidence/progress commit is created and pushed.

## Notes

- Logrotate dry-run was in debug mode and showed expected state-file initialization; no config parse errors were observed.
- `/opt/papyr/security/` still contains the MIG-005 Lynis logs, OpenSCAP XML/HTML, `security-baseline.md`, and pinned SSG directory.
- Weekly Docker prune retention (`until=168h`) should be reviewed quarterly once real production image rollout patterns are known.
- AIDE baseline was updated after Docker installation, `/swapfile`, `/opt/papyr` directory changes, logrotate config, and weekly cron were all in place.
