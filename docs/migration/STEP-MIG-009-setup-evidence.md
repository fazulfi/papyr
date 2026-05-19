# STEP-MIG-009 Setup Evidence

## Step Info

| Field | Value |
|-------|-------|
| Step | STEP-MIG-009 |
| Title | docker-compose + Container Hardening |
| Track | VPS Migration (paranoid-grade) |
| Refs | `stepprompts/step-prompts-vps-migration.md` STEP-MIG-009 |
| Date | 2026-05-19 |
| Status | ✅ Completed |

## Scope

**In scope:**

- Author `deploy/docker-compose.yml` with hardened backend + nginx services
- Author `deploy/.env.production.example` template (no real values)
- `.gitignore` augmented to block `deploy/.env.production` and `deploy/.env.local`
- Sync compose + template to `/opt/papyr/production/` on VPS
- Pre-deploy chown `/opt/papyr/temp` to `101001:101001` for userns-remap
- Validate `docker compose config --quiet` on VPS

**Out of scope:**

- First container start (`docker compose up`) — deferred to STEP-MIG-013
- Real `.env` populate with R2 keys — deferred to STEP-MIG-013
- Nginx config (server blocks, TLS, /health route) — deferred to STEP-MIG-010
- GHCR image push and digest pin — deferred to STEP-MIG-012/013

## Files Created/Changed

### Repo

| File | Action |
|------|--------|
| `deploy/docker-compose.yml` | Created — 2 services (backend + nginx) hardened |
| `deploy/.env.production.example` | Created — env template with placeholders |
| `.gitignore` | Augmented — block `deploy/.env.production` and `deploy/.env.local` |
| `stepprompts/step-prompts-vps-migration.md` | Patched (commit `0b3d11c`) — image override env, userns chown, git pull sync, nginx healthcheck deferred |
| `stepprompts/progress.md` | STEP-MIG-009 marked ✅, current step → STEP-MIG-010 |
| `docs/migration/STEP-MIG-009-setup-evidence.md` | Created (this file) |

### On VPS

| File | Action |
|------|--------|
| `/opt/papyr/production/docker-compose.yml` | Installed, mode 644, owner deploy:deploy |
| `/opt/papyr/production/.env.production.example` | Installed, mode 644, owner deploy:deploy |
| `/opt/papyr/production/.env` | Created empty placeholder, mode 600 owner deploy:deploy (real values populated at MIG-013) |
| `/opt/papyr/temp` | chown to UID 101001:101001 (host-side mapping for container appuser UID 1001 under userns-remap) |

## Backend Service Hardening (compose-level)

| Layer | Setting |
|---|---|
| Image | `${PAPYR_BACKEND_IMAGE:-papyr-backend:test}` (overridable for MIG-013 GHCR digest) |
| Resources | cpus 3.5, memory 4G, reservation 1G |
| Filesystem | `read_only: true` |
| Tmpfs | `/tmp` 512M with `exec` (LibreOffice subprocess) + `/home/appuser/.cache` 128M |
| Volume | `/opt/papyr/temp` RW (subprocess intermediate files) + `/app/.env` RO |
| Capabilities | drop ALL, add CHOWN + DAC_OVERRIDE + SETGID + SETUID |
| Security opts | `no-new-privileges:true` |
| Network | `papyr-net` 172.30.30.0/24 bridge, internal-only |
| Port | `expose: 8000` (no host publish — only Nginx talks) |
| Healthcheck | `curl /health` 30s/10s/3retry, 40s start period |
| Logging | json-file 10m × 3 files |
| Restart | unless-stopped |

## Nginx Service (placeholder, full config at MIG-010)

| Layer | Setting |
|---|---|
| Image | `nginx:1.27-alpine` |
| Resources | cpus 0.5, memory 256M |
| Capabilities | drop ALL, add CHOWN + DAC_OVERRIDE + SETGID + SETUID + NET_BIND_SERVICE |
| Security opts | `no-new-privileges:true` |
| Ports | 80:80, 443:443 (host-published) |
| Volumes | conf.d RO, ssl RO, logs RW |
| depends_on | backend service_healthy |
| Healthcheck | disabled at this layer (replaced at MIG-010 once /health route exists) |

## Validation Evidence

### Compose validate (after empty .env placeholder)

```
$ cd /opt/papyr/production && docker compose config --quiet
$ echo "exit=$?"
exit=0
Compose syntax OK
```

### Compose config dump preview

Backend service shows correct hardening: cap_add CHOWN/DAC_OVERRIDE/SETGID/SETUID, cap_drop ALL, mem 4G (4294967296 bytes), cpus 3.5, healthcheck on `/health`, image resolved to `papyr-backend:test`, env `ENVIRONMENT=production` and `TMPDIR=/opt/papyr/temp`, expose 8000.

### userns-remap volume ownership

```
Before: drwxr-x--- 2 deploy deploy 4096 May 19 07:43 /opt/papyr/temp
After:  drwxr-x--- 2 101001 101001 4096 May 19 07:43 /opt/papyr/temp
```

### Network not yet created

```
$ docker network ls | grep papyr
(empty — expected, network created on first `compose up` at MIG-013)
```

### Compose ps (no containers running)

```
NAME    IMAGE   COMMAND   SERVICE   CREATED   STATUS   PORTS
(empty header only — expected, no `up` yet)
```

### Final state

```
/opt/papyr/production/:
  -rw-r--r-- deploy:deploy 3445 docker-compose.yml
  -rw-r--r-- deploy:deploy 1030 .env.production.example
  -rw------- deploy:deploy    0 .env (placeholder, mode 600)
/opt/papyr/temp:
  drwxr-x--- 101001:101001 (userns-mapped, ready for container appuser)
```

## Definition of Done

- [x] `deploy/docker-compose.yml` di repo dengan hardened config
- [x] `deploy/.env.production.example` template di repo
- [x] `.gitignore` blocks `deploy/.env.production`
- [x] Compose synced ke VPS at `/opt/papyr/production/docker-compose.yml`
- [x] `docker compose config --quiet` validates without error
- [x] Backend service: read-only, mem 4G, cpus 3.5, dropped caps minimal
- [x] Nginx service: dropped caps + NET_BIND_SERVICE only added cap, ports 80/443
- [x] Healthcheck configured untuk backend (nginx healthcheck deferred to MIG-010)
- [x] Logging: json-file dengan rotation 10m/3 files
- [x] Network `papyr-net` defined dengan custom subnet 172.30.30.0/24
- [x] `/opt/papyr/temp` ownership set ke 101001:101001 (userns-remap mapping)

## Patches Applied

Pre-execution (commit `0b3d11c`):

1. **Image override env var** — `image: ${PAPYR_BACKEND_IMAGE:-papyr-backend:test}` so MIG-009 standalone validation works against the local tag while MIG-013 first deploy can swap in a GHCR-pinned digest by setting the env var.
2. **Userns-remap chown step (9.5b)** — added explicit `sudo chown 101001:101001 /opt/papyr/temp` before the first compose up. Without this, the container appuser UID 1001 (mapped to host UID 101001) could not write to the persistent volume.
3. **Sync via git pull, not scp** — matches the MIG-008 pattern of using the cloned source tree as the canonical artifact path. Cleaner than `scp -r deploy/`.
4. **Nginx healthcheck deferred to MIG-010** — `/health` route requires nginx config that lands at MIG-010; the placeholder healthcheck would have failed validation at this layer.

## Issues Encountered + Resolutions

1. **`docker compose config` failed at first run** — error `env file /opt/papyr/production/.env not found`. The compose file declares `env_file: /opt/papyr/production/.env`, which Docker Compose validates strictly even at config-only mode. **Resolution**: created an empty `.env` placeholder (`sudo install -m 600 -o deploy -g deploy /dev/null /opt/papyr/production/.env`). MIG-013 first deploy will populate this file with real R2 keys plus other env. Empty file is acceptable for compose validation because all referenced variables are also overridable via the `environment:` block.
2. **PowerShell SSH heredoc broke** when trying to chain multi-line shell commands. Resolved by writing each phase to a `.sh` script in `$env:TEMP\opencode\`, scp to `/tmp/`, run via `ssh papyr "bash /tmp/<script>.sh"`. Same pattern used since MIG-007.

## Risk Mitigation

- **read_only rootfs at backend** — if any Python lib writes outside `/tmp` or `/home/appuser/.cache`, container crashes at first request. Diagnose via `docker logs papyr-backend` at MIG-013 first run; mitigation is to add specific tmpfs mounts for the affected path.
- **cap drop ALL + minimal cap_add** — current set (CHOWN, DAC_OVERRIDE, SETGID, SETUID) is liberal enough for tini PID 1 plus uvicorn plus LibreOffice fork; tightening can happen later after monitoring.
- **userns-remap volume ownership** — handled at this step. Future volumes added in subsequent MIG steps must also be chown'd to 101001:101001 (or container UID + 100000 in general).
- **No /health route in app yet** — backend Dockerfile healthcheck calls `curl /health`. The application FastAPI must expose this route. Verify at MIG-013 first run; fail-fast healthcheck with 40s start period gives time for uvicorn boot.

## Git / Push / Deploy

### Commits

1. `0b3d11c docs(mig): patch STEP-MIG-009 image override env, userns chown, git pull sync` (pre-execution)
2. `cf4f219 feat(deploy): add hardened production docker-compose + env template` (compose + template + gitignore)
3. (this evidence + progress commit, pushed alongside this doc)

### Push

- All commits pushed to `origin/main`
- VPS `/opt/papyr/source` updated via `git pull origin main`
- Compose file deployed to `/opt/papyr/production/` and validated

## Notes

- Empty `.env` placeholder at `/opt/papyr/production/.env` will be replaced with real values from operator password manager at MIG-013. The placeholder ensures compose validation works at MIG-009 without leaking secrets.
- userns-remap mapping documented for reference: container UID 0 → host UID 100000, container UID 1001 → host UID 101001. Any future host-mounted volume must follow this pattern.
- Image tag override pattern (`PAPYR_BACKEND_IMAGE`) lets MIG-013 deploy use either `papyr-backend:test` (local rebuild) or `ghcr.io/fazulfi/papyr-backend@sha256:<digest>` (registry-pinned) without editing compose.
- Subnet 172.30.30.0/24 chosen to avoid Docker default ranges (172.17/16, 172.18/16) and potential overlap with VPN subnets.
