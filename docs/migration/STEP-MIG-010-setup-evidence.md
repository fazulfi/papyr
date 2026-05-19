# STEP-MIG-010 Setup Evidence

## Step Info

| Field | Value |
|-------|-------|
| Step | STEP-MIG-010 |
| Title | Nginx Reverse Proxy + Security Headers |
| Track | VPS Migration (paranoid-grade) |
| Refs | `stepprompts/step-prompts-vps-migration.md` STEP-MIG-010 |
| Date | 2026-05-19 |
| Status | ✅ Completed |

## Scope

**In scope:**

- Author `deploy/nginx/conf.d/production.conf` — server block for api.mypapyr.com with hardening
- Author `deploy/nginx/conf.d/default.conf` — drop unknown hosts (444)
- Sync configs to `/opt/papyr/nginx/conf.d/` on VPS
- Validate via ephemeral `nginx:1.27-alpine` container `nginx -t`
- Fetch + save current Cloudflare IPv4 ranges to `/opt/papyr/security/cloudflare-ips-v4.txt`

**Out of scope:**

- Compose `up nginx` — deferred until backend has real `.env` (STEP-MIG-013)
- TLS / Let's Encrypt origin cert — STEP-MIG-011
- Cloudflare DNS A record + WAF rules — STEP-MIG-011
- Strict UFW restriction to Cloudflare IPs only — skipped per step prompt (Cloudflare proxy + WAF already filter)

## Files Created/Changed

### Repo

| File | Action |
|------|--------|
| `deploy/nginx/conf.d/production.conf` | Created — 4350 bytes, hardened server block |
| `deploy/nginx/conf.d/default.conf` | Created — 176 bytes, drop unknown hosts |
| `stepprompts/step-prompts-vps-migration.md` | Patched (commit `e23bab2`) — sync via git pull instead of scp -r |
| `stepprompts/progress.md` | STEP-MIG-010 marked ✅, current step → STEP-MIG-011 |
| `docs/migration/STEP-MIG-010-setup-evidence.md` | Created (this file) |

### On VPS

| File | Action |
|------|--------|
| `/opt/papyr/nginx/conf.d/production.conf` | Installed, mode 644 deploy:deploy |
| `/opt/papyr/nginx/conf.d/default.conf` | Installed, mode 644 deploy:deploy |
| `/opt/papyr/security/cloudflare-ips-v4.txt` | Created — 15 current Cloudflare IPv4 ranges |

## production.conf Surface

### Layer 7 protections

- Bad-bot User-Agent block via `map` → 403 (nikto, sqlmap, nessus, w3af, paros, zaproxy, burp, masscan, zmap, nmap, mj12bot, ahrefsbot, dotbot, semrushbot, empty UA)
- Sensitive path block via `map` → 444 (.env, .git, .htaccess, .sql, wp-admin, wp-login, phpmyadmin, adminer, xmlrpc, path traversal `../`)
- Catch-all `location /` → 444 silent close

### Cloudflare integration

- 15 `set_real_ip_from` ranges (IPv4) covering current Cloudflare proxy edge
- `real_ip_header CF-Connecting-IP` so logs and rate limits use real client IP
- `real_ip_recursive on` for chained proxies

### Rate limiting (defense in depth with FastAPI)

| Zone | Rate | Burst |
|---|---|---|
| `papyr_api` | 30 r/min | 10 nodelay |
| `papyr_burst` | 2 r/sec | 5 (api) / 20 (status) |

### Routes

- `/health` — `proxy_pass backend`, no rate limit, `access_log off`
- `/test/connectivity` — backend connectivity_router prefix `/test`
- `/api/` — rate-limited, 300s read/send timeout for async OCR + PDF-to-Word polling, streaming buffering off
- `/status/` — backend status_router for useAsyncTask polling, burst=20 nodelay

### Body & timeouts

- `client_max_body_size 25M` (Papyr 20MB upload + 5M headroom)
- `client_body_timeout 60s`, `client_header_timeout 30s`
- API: `proxy_read_timeout 300s`, `proxy_send_timeout 300s`, `proxy_connect_timeout 30s`

### Security headers (always set)

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Misc

- `server_tokens off` (no nginx version disclosure)

## default.conf Surface

`listen 80 default_server` + `server_name _` + `return 444` — silently drops requests with unmatched/missing Host header.

## Validation Evidence

### Nginx syntax test (ephemeral container)

```
$ docker run --rm -v /opt/papyr/nginx/conf.d:/etc/nginx/conf.d:ro nginx:1.27-alpine nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
exit=0
```

### Files persisted

```
/opt/papyr/nginx/conf.d/:
  -rw-r--r-- deploy:deploy 4350 production.conf
  -rw-r--r-- deploy:deploy  176 default.conf
```

### Cloudflare IPv4 ranges (15 current, fully matches production.conf hardcoded list)

```
173.245.48.0/20
103.21.244.0/22
103.22.200.0/22
103.31.4.0/22
141.101.64.0/18
108.162.192.0/18
190.93.240.0/20
188.114.96.0/20
197.234.240.0/22
198.41.128.0/17
162.158.0.0/15
104.16.0.0/13
104.24.0.0/14
172.64.0.0/13
131.0.72.0/22
```

Saved at `/opt/papyr/security/cloudflare-ips-v4.txt`. Refresh quarterly.

### UFW state (unchanged, no strict CF restriction applied)

```
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), deny (routed)

To                         Action      From
--                         ------      ----
52022/tcp                  ALLOW IN    Anywhere   # SSH custom port
80/tcp                     ALLOW IN    Anywhere   # HTTP
443/tcp                    ALLOW IN    Anywhere   # HTTPS
22/tcp                     ALLOW IN    Anywhere   # endlessh honeypot
+ 6 IPv6 mirrors
+ 20 DENY OUT mining ports (from MIG-004)
```

## Definition of Done

- [x] `deploy/nginx/conf.d/production.conf` exists di repo + di VPS
- [x] `deploy/nginx/conf.d/default.conf` drops unknown hosts (444)
- [x] Cloudflare Real IP whitelist applied (logs use real client IP)
- [x] Bad bot blocking via User-Agent map
- [x] Sensitive path blocking (`.env`, `.git`, etc)
- [x] Rate limiting: `papyr_api` 30r/m, `papyr_burst` 2r/s + burst handling
- [x] Security headers: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [x] `client_max_body_size 25M`, `proxy_read_timeout 300s` for async polling
- [x] Nginx config syntax valid (ephemeral nginx -t test passes)
- [x] Cloudflare IPv4 list saved untuk quarterly refresh

## Patches Applied

Pre-execution (commit `e23bab2`):

1. **Sync via git pull on VPS** — replaced `scp -r deploy/nginx/` to staging-conf approach with the canonical pattern: `git pull` on `/opt/papyr/source/` then `sudo install -m 644` to `/opt/papyr/nginx/conf.d/`. Matches MIG-008 + MIG-009.

Verified before authoring:

2. **Backend route surface** — confirmed `/health` is top-level FastAPI handler (`main.py` line 112) and `/test/connectivity` is via `connectivity_router` with prefix `/test` (`backend/routers/connectivity.py`). Both nginx route blocks match real backend surface.

## Issues Encountered + Resolutions

1. **Nginx image pull triggered by ephemeral test** — `nginx:1.27-alpine` was not yet on VPS, first run pulled ~33 MB. Acceptable one-time cost. Future MIG-013 compose up will reuse the cached image.
2. **No new issues** — clean execution path.

## Risk Mitigation

- **Hardcoded CF IP list will go stale**: documented quarterly refresh cadence in `security-baseline.md`. Action: re-run `curl https://www.cloudflare.com/ips-v4 -o /opt/papyr/security/cloudflare-ips-v4.txt`, diff against `production.conf`, update server block if drift.
- **Catch-all 444 silent drop**: legitimate clients without proper Host header get connection-reset, no error message. Trade-off accepted because all real traffic uses `api.mypapyr.com`.
- **Server-block requires backend service name resolution at compose up time**: `proxy_pass http://backend:8000` only resolves on `papyr-net` network. MIG-013 compose up creates network + DNS first, before nginx starts (via `depends_on: backend service_healthy`).
- **Strict UFW restriction to CF IPs deferred**: Cloudflare proxy + WAF (MIG-011) provides L7 filtering. Origin still accepts non-CF traffic on 80/443 — this is acceptable because (1) nginx default_server returns 444 for non-Host requests, (2) Cloudflare DNS A record is what real users hit, (3) attacker direct-to-IP gets 444 catch-all.

## Git / Push / Deploy

### Commits

1. `e23bab2 docs(mig): patch STEP-MIG-010 sync via git pull on VPS` (pre-execution patch)
2. `840760a feat(deploy): add hardened nginx server blocks for production reverse proxy` (production.conf + default.conf)
3. (this evidence + progress commit)

### Push

- All commits pushed to `origin/main`
- VPS `/opt/papyr/source` updated via `git pull origin main`
- Configs deployed to `/opt/papyr/nginx/conf.d/` and validated

## Notes

- Compose `nginx` service from MIG-009 expects `/opt/papyr/nginx/conf.d` mounted RO at `/etc/nginx/conf.d`. The configs from this step are exactly what nginx will load on first compose up at MIG-013.
- The `/api/` location proxies to `http://backend:8000` (Docker compose network DNS). When containers start, Docker resolves `backend` → 172.30.30.x within `papyr-net`. Until then, the configs are dormant on disk.
- Following MIG-011 will replace the current `listen 80` with `listen 443 ssl http2` after Let's Encrypt origin cert is installed. Cloudflare proxy will keep 80→443 redirect.
- The ephemeral nginx `nginx -t` test does not resolve `backend:8000` upstream — that requires the compose network. `nginx -t` only checks config syntax + directive validity.
