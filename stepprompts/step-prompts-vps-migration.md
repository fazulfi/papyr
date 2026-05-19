# Papyr — VPS Migration Step Prompts (Production-Only, Paranoid-Grade)

> **Last updated:** 2026-05-18
> **Audience:** Operator (founder, manual + AI Agent assisted)
> **Source plan:** [`docs/35_Papyr_VPS_Migration_Plan_v1.0.md`](../docs/35_Papyr_VPS_Migration_Plan_v1.0.md)
> **Sub-track in:** [`stepprompts/progress.md`](progress.md)

This document is the executable, step-by-step companion to the migration plan. Each step is **atomic, copy-paste runnable**, with explicit prerequisites, verification, rollback, and Definition of Done. Production-only deployment to a Linode Indonesia VPS. **No staging environment.**

---

## Autopilot Rules

1. Execute steps strictly in order. Each step has prerequisites — do not skip ahead.
2. Never paste secrets or passwords into commit messages, repo files, or chat logs. Use `docs/vps-access.md` (gitignored) for sensitive values.
3. After every state-changing command, verify with the bundled `### Verifikasi` block. A step is not done until verification passes.
4. If verification fails, run the `### Rollback` block before retrying. Do not patch on top of a broken state.
5. One terminal window stays open as root SAFETY NET during STEP-MIG-001 in case SSH config locks the new `deploy` user out. Do not close it until STEP-MIG-001 verification fully passes.
6. Linode LISH (Linode Shell) is the absolute fallback when SSH is unreachable. Bookmark Linode dashboard URL before starting.
7. Snapshots first, changes second. Take a Linode snapshot at the start of each major track (000, 001, 008, 014, 017).
8. All commands assume non-interactive execution. Use `-y`, `--no-pager`, `DEBIAN_FRONTEND=noninteractive` where applicable.
9. Bahasa Indonesia for prose, English for code/identifiers.
10. **Setup evidence per step** — setiap STEP-MIG-XXX selesai, buat `docs/migration/STEP-MIG-XXX-setup-evidence.md` dengan format yang sama (Step Info, Scope, Files Changed, Validation Evidence, Definition of Done, Issues + Resolutions, Git commits, Notes). Pattern reference: `docs/migration/STEP-MIG-002-setup-evidence.md`. Commit evidence sebelum mark step complete di `progress.md`.

### SSH Alias Convention (post-MIG-001)

Setelah STEP-MIG-001 selesai, SSH ke VPS dilakukan via alias `papyr` yang terdaftar di laptop operator (`~/.ssh/config`). Mulai STEP-MIG-002 dan seterusnya, semua contoh perintah SSH/SCP dari laptop pakai bentuk alias supaya lebih ringkas dan konsisten.

Bentuk alias (gunakan ini di STEP-MIG-002+):

```
ssh papyr                                        # interactive login as deploy
ssh papyr "<remote command>"                     # run remote command
scp file.txt papyr:/home/deploy/                 # copy file (modern OpenSSH membaca ~/.ssh/config untuk scp)
```

Bentuk eksplisit (fallback kalau alias belum di-setup atau di-debug ada masalah):

```
ssh -i $HOME\.ssh\papyr\operator -p 52022 deploy@172.235.251.193
scp -i $HOME\.ssh\papyr\operator -P 52022 file.txt deploy@172.235.251.193:/home/deploy/
```

Konfigurasi alias didokumentasikan di `docs/vps-access.md` (gitignored). Kalau operator pakai laptop baru, regenerate alias dari snippet di file tersebut.

---

## Migration Context

| Aspek | Value |
|---|---|
| Backend (now) | Railway → `papyr-production.up.railway.app` |
| Backend (target) | Linode VPS Jakarta → `api.mypapyr.com` |
| Frontend | Vercel → `mypapyr.com` (no change) |
| VPS provider | Linode (whois confirmed: `OrgName: Linode`) |
| VPS region | Indonesia (Jakarta DC) |
| VPS spec | 8 GB RAM, 4 vCPU cores, dedicated IPv4 |
| Public IP | `172.235.251.193` |
| Initial root password | **LEAKED — must rotate in STEP-MIG-001** |
| SSH port (target) | `52022` |
| Deploy user | `deploy` (sudoer, key-only auth) |
| Backup target | IDCloudHost S3 (separate provider) |
| SSL strategy | Cloudflare Full (Strict) + Let's Encrypt origin cert |
| DNSSEC | Enabled at Cloudflare |
| 2FA | TOTP via google-authenticator + Linode account 2FA |
| Container runtime | Docker CE, single backend service + Nginx |
| Image registry | GHCR, pinned by SHA256 digest |
| Monitoring | Netdata Cloud + BetterStack + Telegram |
| Threat model | History of cryptojacking — assume hostile network |

---

## Step Sequence (22 Total)

| Step | Title | Effort |
|---|---|---|
| MIG-000 | Pre-flight audit + Railway extraction | 1-2h |
| MIG-001 | Emergency lockdown VPS | 1-2h |
| MIG-002 | Intrusion prevention layer | 1h |
| MIG-003 | Filesystem integrity + rootkit detection | 1h |
| MIG-004 | Egress filtering + honeypot | 1h |
| MIG-005 | Compliance baselines (OpenSCAP + Lynis) | 1-2h |
| MIG-006 | Server foundation (Docker + swap) | 30m |
| MIG-007 | SSH 2FA + LISH emergency recovery | 30m |
| MIG-008 | Production Dockerfile + SBOM | 1-2h |
| MIG-009 | docker-compose + container hardening | 1h |
| MIG-010 | Nginx reverse proxy + security headers | 1h |
| MIG-011 | Cloudflare DNS + WAF + DNSSEC + Let's Encrypt | 1h |
| MIG-012 | GitHub Actions deploy + supply chain | 1-2h |
| MIG-013 | First deploy + smoke verify | 30m |
| MIG-014 | Cutover Vercel `NEXT_PUBLIC_API_URL` | 15m |
| MIG-015 | Monitoring stack (Netdata + BetterStack + Telegram) | 1-2h |
| MIG-016 | 24h soak + verify all 13 tools | 24h passive |
| MIG-017 | Decommission Railway | 30m |
| MIG-018 | IDCloudHost S3 backup + DR drill | 1-2h |
| MIG-019 | Operations runbook | 1-2h |
| MIG-020 | Post-migration secret rotation | 1h |
| MIG-021 | Tag v2.0.0 + CHANGELOG + closeout | 30m |

---

## STEP-MIG-000: Pre-flight Audit + Railway Extraction

### Konteks

Sebelum menyentuh VPS, kita amankan secret yang sudah ada (Railway env vars), audit repo untuk leaked secrets, pastikan semua admin account ada 2FA, dan generate SSH keypair. Ini fondasi dari paranoid-grade migration.

### Prerequisites

- Akses ke Railway dashboard (papyr project)
- Akses ke GitHub, Vercel, Cloudflare, Hostinger, Linode, IDCloudHost (atau provider yang akan dipakai)
- Terminal di laptop dengan `ssh-keygen`, `gitleaks` (install dulu kalau belum), `gpg` (untuk encrypted local file)
- Password manager (Bitwarden / 1Password / KeePass) untuk store credentials

### Langkah

**0.1 Install gitleaks di laptop:**

```bash
# Windows (PowerShell, via scoop)
scoop install gitleaks
# atau via Chocolatey
# choco install gitleaks
# atau download release dari https://github.com/gitleaks/gitleaks/releases
```

**0.2 Scan repo Papyr untuk leaked secrets:**

```bash
cd C:\Users\faizz\papyr
gitleaks detect --source . --log-opts="--all" --report-path gitleaks-report.json --no-banner
```

- Kalau ada finding, **STOP**. Catat findings di `docs/vps-access.md` (gitignored), rotate secret yang bocor di provider masing-masing, force-push history rewrite kalau secret ada di git history.
- Kalau zero finding, lanjut.

**0.3 Audit 2FA semua admin account:**

Login satu-satu, pastikan 2FA aktif (TOTP atau hardware key):

| Account | Lokasi |
|---|---|
| GitHub | github.com/settings/security |
| Vercel | vercel.com/account/security |
| Cloudflare | dash.cloudflare.com/profile/two-factor |
| Hostinger | hpanel.hostinger.com/profile/security |
| Linode | cloud.linode.com/profile/auth |
| IDCloudHost | console.idcloudhost.com/account |
| Railway | railway.app/account |

Aktifkan 2FA untuk yang belum. Simpan recovery codes di password manager.

**0.4 Generate 3 SSH keypair Ed25519 di laptop:**

```bash
mkdir -p $HOME\.ssh\papyr
ssh-keygen -t ed25519 -C "papyr-operator-faiz" -f $HOME\.ssh\papyr\operator -N ""
ssh-keygen -t ed25519 -C "papyr-github-actions-deploy" -f $HOME\.ssh\papyr\gha-deploy -N ""
ssh-keygen -t ed25519 -C "papyr-restic-backup" -f $HOME\.ssh\papyr\restic -N ""
```

- `operator` = key kamu untuk SSH manual ke VPS sebagai `deploy`
- `gha-deploy` = key untuk GitHub Actions deploy workflow (separate identity, audit-friendly)
- `restic` = key untuk restic backup user (least privilege, separate)

**0.5 Buat `docs/vps-access.md` (HARUS gitignored):**

```bash
# Tambahkan ke .gitignore dulu
echo "docs/vps-access.md" >> .gitignore
git add .gitignore
git commit -m "chore: ignore vps-access secrets file"
```

Isi `docs/vps-access.md`:

```markdown
# VPS Access — Papyr Production

> ⚠️ This file is gitignored. Never commit. Never paste online.

## Linode VPS

- **Provider**: Linode (Akamai)
- **Region**: Jakarta, Indonesia
- **Plan**: 8 GB RAM, 4 cores, dedicated IPv4
- **Public IPv4**: 172.235.251.193
- **Linode Dashboard**: https://cloud.linode.com
- **LISH (emergency console)**: from Linode dashboard, click VPS → Launch LISH Console

## Initial Credentials (LEAKED — TO ROTATE IN MIG-001)

- Initial root user: root
- Initial root password: <store-in-password-manager>
- Initial SSH port: 22 (will change to 52022)

## Post-MIG-001 Credentials

- New root password: <generated-in-MIG-001-step-1.8>
- Deploy user: deploy
- Deploy SSH public key fingerprint: <paste-output-of-ssh-keygen-lf>
- SSH port: 52022
- 2FA TOTP secret: <captured-in-MIG-007>

## Railway Snapshot (extracted MIG-000.6)

- Backup file path: <local-encrypted-path>
- Extracted at: <YYYY-MM-DD HH:MM>

## Backup Restic Repository

- Bucket: papyr-vps-backups
- Provider: IDCloudHost S3
- Restic password: <store-in-password-manager>
- Restic SSH key fingerprint: <paste>
```

**0.6 Extract Railway env vars (CRITICAL):**

1. Buka Railway dashboard → Papyr project → Variables tab.
2. Copy semua env vars ke local file `~/.papyr/railway-env-snapshot.txt`.
3. Encrypt file dengan GPG atau simpan ke password manager:

```bash
# Encrypt with GPG (interactive, akan minta passphrase)
gpg --symmetric --cipher-algo AES256 --output $HOME\.papyr\railway-env-snapshot.txt.gpg $HOME\.papyr\railway-env-snapshot.txt
# Hapus plaintext setelah encrypt
Remove-Item $HOME\.papyr\railway-env-snapshot.txt
```

Vars yang minimum harus ada:
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`
- `ALLOWED_ORIGINS` atau `CORS_ORIGINS`
- `RATE_LIMIT_PER_MINUTE`, `MAX_UPLOAD_SIZE_MB`, `FILE_RETENTION_MINUTES`
- `ENVIRONMENT` (set ke `production` di VPS)
- Apa pun lain yang ada di `backend/utils/config.py`

**0.7 Linode snapshot baseline:**

1. Buka Linode dashboard → pilih VPS Papyr → tab "Backups" atau "Snapshots".
2. Klik "Take Snapshot", label `pre-migration-baseline-2026-05-18`.
3. Tunggu sampai status "Successful" (~10-30 menit untuk 8GB).

### Verifikasi

```bash
# 1. gitleaks bersih
gitleaks detect --source . --log-opts="--all" --no-banner
# Expected: "no leaks found"

# 2. .gitignore sudah include vps-access.md
Select-String -Path .gitignore -Pattern "vps-access.md"

# 3. SSH keys sudah ada
Get-ChildItem $HOME\.ssh\papyr
# Expected: operator, operator.pub, gha-deploy, gha-deploy.pub, restic, restic.pub

# 4. Encrypted railway snapshot ada
Test-Path $HOME\.papyr\railway-env-snapshot.txt.gpg
# Expected: True

# 5. Plaintext railway snapshot sudah dihapus
Test-Path $HOME\.papyr\railway-env-snapshot.txt
# Expected: False
```

Manual checks:
- [ ] 2FA aktif di GitHub, Vercel, Cloudflare, Hostinger, Linode, IDCloudHost, Railway
- [ ] Linode snapshot "Successful" di dashboard
- [ ] Recovery codes 2FA disimpan di password manager
- [ ] `docs/vps-access.md` exists dan gitignored

### Rollback

Tidak ada perubahan yang perlu di-rollback (semua local-only). Kalau gitleaks ketemu finding, follow rotate procedure di provider yang relevan SEBELUM lanjut ke MIG-001.

### Definition of Done

- [ ] gitleaks clean run, zero findings (atau findings sudah di-rotate)
- [ ] 2FA aktif di 7 admin accounts
- [ ] 3 SSH keypair generated dan tersimpan di `~/.ssh/papyr/`
- [ ] `docs/vps-access.md` gitignored dan terisi initial info
- [ ] Railway env vars extracted dan encrypted di local
- [ ] Linode snapshot "Successful" sebagai baseline rollback

### Catatan

- Snapshot Linode bayar (~$0.10/GB/month). Hapus setelah migrasi stable >7 hari.
- Encrypted file pakai GPG passphrase yang di-store di password manager — jangan ada di chat history.
- Kalau gitleaks ketemu R2 secrets di history, rotate R2 keys di Cloudflare dashboard SEBELUM MIG-001 supaya VPS pakai key baru.

---

## STEP-MIG-001: Emergency Lockdown VPS

### Konteks

Password root sudah leaked. Setiap menit yang lewat tanpa rotation = increased risk. Ini step paling kritis dari security perspective. Tujuan: rotate root password, create deploy user dengan key-only auth, disable root SSH login, ganti port SSH, basic UFW.

### Prerequisites

- STEP-MIG-000 selesai
- SSH keypair `~/.ssh/papyr/operator` ada di laptop
- Linode dashboard tab open (untuk LISH fallback)
- Terminal yang akan dipakai sebagai SAFETY NET (jangan tutup sampai akhir step)

### Langkah

**1.1 Login pertama sebagai root (one-time, password lama):**

```bash
# Dari laptop
ssh root@172.235.251.193
# Password: <leaked-password-from-vps-access.md>
```

⚠️ **JANGAN TUTUP terminal ini sampai step ini SELESAI dan deploy user sudah verified bisa SSH.**

**1.2 Update sistem dan install tools dasar:**

```bash
# Sebagai root di VPS
export DEBIAN_FRONTEND=noninteractive
apt update
apt upgrade -y
apt install -y curl wget git htop ufw fail2ban auditd unattended-upgrades sudo
apt autoremove -y
```

**1.3 Set timezone dan hostname:**

```bash
timedatectl set-timezone Asia/Jakarta
hostnamectl set-hostname papyr-prod-id
echo "127.0.0.1 papyr-prod-id" >> /etc/hosts
```

**1.4 Rotate root password:**

```bash
# Generate strong random password
NEW_ROOT_PASSWORD=$(openssl rand -base64 32 | tr -d '/+' | head -c 32)
echo "NEW ROOT PASSWORD (save to password manager NOW): $NEW_ROOT_PASSWORD"
# Apply password
echo "root:$NEW_ROOT_PASSWORD" | chpasswd
```

⚠️ **Save the printed password ke password manager (Bitwarden / 1Password) immediately.** Update `docs/vps-access.md` dengan note "rotated <YYYY-MM-DD>". Jangan paste password ke chat AI atau text file.

**1.5 Create deploy user:**

```bash
useradd -m -s /bin/bash -G sudo deploy
# Set random password (gak akan dipakai, tapi user butuh password "set" untuk sudo)
DEPLOY_PASSWORD=$(openssl rand -base64 32 | tr -d '/+' | head -c 32)
echo "deploy:$DEPLOY_PASSWORD" | chpasswd
echo "DEPLOY USER PASSWORD (save to password manager): $DEPLOY_PASSWORD"

# Setup sudo without password for deploy (lebih aman dari password-based sudo)
echo "deploy ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/deploy
chmod 0440 /etc/sudoers.d/deploy
```

**1.6 Setup SSH key auth untuk deploy user:**

```bash
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
touch /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
```

**Dari laptop (terminal terpisah):**

```bash
# Get public key content
Get-Content $HOME\.ssh\papyr\operator.pub
# Copy output ke clipboard
```

**Kembali ke VPS (sebagai root):**

```bash
# Paste public key (replace <PASTE_HERE> dengan actual public key dari laptop)
echo "<PASTE_HERE>" >> /home/deploy/.ssh/authorized_keys
# Verify
cat /home/deploy/.ssh/authorized_keys
```

**1.7 Test deploy SSH dari laptop SEBELUM mengubah sshd_config:**

**TERMINAL BARU di laptop (jangan tutup terminal root):**

```bash
ssh -i $HOME\.ssh\papyr\operator deploy@172.235.251.193
# Should login tanpa password prompt
```

Kalau berhasil:
```bash
# Inside deploy session, verify sudo works
sudo -n whoami
# Expected: root
exit
```

⚠️ **Kalau deploy SSH gagal, STOP. Debug dulu sebelum lanjut. Kalau lanjut dan sshd_config diubah, kamu bisa lockout total.**

**1.8 Harden sshd_config:**

**Sebagai root di VPS (terminal SAFETY NET):**

```bash
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.pre-mig-001
cat > /etc/ssh/sshd_config <<'EOF'
# Papyr production SSH config — hardened
Port 52022
AddressFamily inet
ListenAddress 0.0.0.0

# Authentication
PermitRootLogin no
PasswordAuthentication no
ChallengeResponseAuthentication no
KbdInteractiveAuthentication no
UsePAM yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PermitEmptyPasswords no

# Limits
MaxAuthTries 3
MaxSessions 2
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2

# Restrict access
AllowUsers deploy
DenyUsers root

# Misc hardening
X11Forwarding no
PrintMotd no
AcceptEnv LANG LC_*
Subsystem sftp /usr/lib/openssh/sftp-server
EOF

# Validate config
sshd -t
# Expected: no output (silent = valid)
```

**1.9 Update UFW BEFORE restarting sshd:**

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 52022/tcp comment 'SSH custom port'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
# JANGAN aktifin firewall sampai port 52022 sudah confirmed
ufw --force enable
ufw status verbose
```

**1.10 Restart sshd:**

```bash
systemctl restart sshd
systemctl status sshd --no-pager
# Expected: active (running)
```

**1.11 Test SSH ke port baru SEBELUM tutup terminal root:**

**TERMINAL BARU di laptop:**

```bash
ssh -i $HOME\.ssh\papyr\operator -p 52022 deploy@172.235.251.193
# Should login successfully
```

Kalau berhasil:
```bash
sudo -n whoami
exit
```

**1.12 Verify root SSH blocked:**

**TERMINAL BARU di laptop:**

```bash
ssh -p 52022 root@172.235.251.193
# Expected: Permission denied (publickey)
ssh root@172.235.251.193
# Expected: Connection refused atau timeout (port 22 blocked by UFW)
```

**1.13 Tutup terminal SAFETY NET hanya kalau 1.11 dan 1.12 PASS:**

```bash
# Di terminal root original
exit
```

### Verifikasi

```bash
# Dari laptop
ssh -i $HOME\.ssh\papyr\operator -p 52022 deploy@172.235.251.193 'cat /etc/os-release | grep PRETTY_NAME'
# Expected: Ubuntu 22.04 atau similar

ssh -i $HOME\.ssh\papyr\operator -p 52022 deploy@172.235.251.193 'sudo systemctl status sshd --no-pager | head -3'
# Expected: active (running)

ssh -i $HOME\.ssh\papyr\operator -p 52022 deploy@172.235.251.193 'sudo ufw status numbered'
# Expected: 22 NOT in list, 52022 + 80 + 443 ALLOW
```

### Rollback

Kalau locked out, gunakan **Linode LISH** untuk emergency console:

1. Login ke Linode dashboard → pilih VPS → tab "Networking" atau "Power" → klik "Launch LISH Console"
2. Login dengan root + new password (yang di-rotate di 1.4)
3. Restore sshd_config: `cp /etc/ssh/sshd_config.bak.pre-mig-001 /etc/ssh/sshd_config && systemctl restart sshd`
4. UFW disable: `ufw disable`
5. Investigate, fix, retry step.

### Definition of Done

- [ ] Root password rotated, lama tidak bisa pakai lagi
- [ ] Root SSH blocked (`PermitRootLogin no` + UFW deny port 22)
- [ ] User `deploy` bisa SSH dengan key (port 52022, no password)
- [ ] User `deploy` bisa `sudo -n` tanpa password prompt
- [ ] UFW active dengan rules: 52022/80/443 allow, default deny
- [ ] `docs/vps-access.md` updated dengan new password reference (paths only, no plaintext)
- [ ] Tidak ada terminal root yang masih open dari step ini

### Catatan

- Password root sekarang stored di password manager. Untuk maintenance lokal (LISH atau console), masih dipakai. Untuk operasi normal, selalu pakai `deploy` + sudo.
- Kalau pakai LISH banyak, 2FA Linode sangat penting (Track 0).
- Port 52022 dipilih karena gak terlalu obscure tapi blokir 99% scanner default.

---

## STEP-MIG-002: Intrusion Prevention Layer

### Konteks

VPS punya history dikompromi cryptominer. Layer ini menambahkan: CrowdSec (community threat feed yang lebih bagus dari fail2ban), unattended-upgrades (auto security patches), auditd (forensic logging), kernel hardening sysctl, dan baseline yang membuat brute-force jauh lebih mahal.

### Prerequisites

- STEP-MIG-001 selesai
- SSH bisa masuk sebagai `deploy@172.235.251.193:52022` dengan key

### Langkah

**2.1 Install CrowdSec (replace fail2ban dengan threat feed yang lebih kuat):**

```bash
# Sebagai deploy + sudo di VPS
sudo apt install -y curl
curl -s https://install.crowdsec.net | sudo sh
sudo apt install -y crowdsec
sudo systemctl enable --now crowdsec
sudo systemctl status crowdsec --no-pager
```

**2.2 Install CrowdSec firewall bouncer (yang execute the bans):**

```bash
sudo apt install -y crowdsec-firewall-bouncer-iptables
sudo systemctl enable --now crowdsec-firewall-bouncer
sudo cscli bouncers list
```

**2.3 Install useful CrowdSec scenarios:**

```bash
# SSH brute force protection
sudo cscli collections install crowdsecurity/sshd
# Linux base
sudo cscli collections install crowdsecurity/linux
# Nginx (akan dipakai nanti)
sudo cscli collections install crowdsecurity/nginx
sudo systemctl restart crowdsec
sudo cscli collections list
```

**2.4 Disable old fail2ban (kita pakai CrowdSec, jangan dobel):**

```bash
sudo systemctl disable --now fail2ban || true
sudo apt purge -y fail2ban
```

**2.5 Configure unattended-upgrades:**

```bash
# Non-interactive enable (avoid TUI prompt)
echo 'unattended-upgrades unattended-upgrades/enable_auto_updates boolean true' | sudo debconf-set-selections
sudo dpkg-reconfigure -f noninteractive unattended-upgrades
```

Edit config untuk auto-reboot kalau perlu:

```bash
sudo tee /etc/apt/apt.conf.d/52unattended-upgrades-local > /dev/null <<'EOF'
Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "04:00";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF

# Test
sudo unattended-upgrade --dry-run --debug 2>&1 | head -30
```

**2.6 Configure auditd untuk forensic logging:**

```bash
sudo tee /etc/audit/rules.d/papyr.rules > /dev/null <<'EOF'
# Log all sudo invocations
-a always,exit -F arch=b64 -S execve -F euid=0 -k sudo_exec
# Log all SSH config changes
-w /etc/ssh/sshd_config -p wa -k sshd_config
# Log /etc changes
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/sudoers -p wa -k identity
-w /etc/sudoers.d/ -p wa -k identity
# Log writes to /tmp (cryptominer dropping binaries)
-w /tmp -p w -k tmp_writes
-w /var/tmp -p w -k vartmp_writes
# Log writes to /usr/bin (privilege escalation attempts)
-w /usr/bin -p w -k bin_writes
-w /usr/sbin -p w -k bin_writes
EOF

sudo augenrules --load
sudo systemctl restart auditd
sudo systemctl status auditd --no-pager | head -5
```

**2.7 Kernel hardening via sysctl:**

```bash
sudo tee /etc/sysctl.d/99-papyr-hardening.conf > /dev/null <<'EOF'
# Network hardening
net.ipv4.tcp_syncookies = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.log_martians = 1
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0

# Kernel hardening
kernel.dmesg_restrict = 1
kernel.kptr_restrict = 2
kernel.yama.ptrace_scope = 2
fs.suid_dumpable = 0
fs.protected_hardlinks = 1
fs.protected_symlinks = 1

# Swap behavior (kita punya 8GB RAM, swap minim use)
vm.swappiness = 10
EOF

sudo sysctl -p /etc/sysctl.d/99-papyr-hardening.conf
```

**2.8 Disable USB storage (gak butuh di VPS):**

```bash
sudo tee /etc/modprobe.d/disable-usb-storage.conf > /dev/null <<'EOF'
install usb-storage /bin/true
EOF
```

**2.9 Disable services yang gak perlu (avahi, cups, snapd kalau ada):**

```bash
for service in avahi-daemon cups snapd; do
  sudo systemctl disable --now $service 2>/dev/null || true
done
```

**2.10 Set umask untuk new users:**

```bash
sudo sed -i 's/^UMASK.*/UMASK 027/' /etc/login.defs
grep "^UMASK" /etc/login.defs
```

**2.11 Apply umask 027 ke deploy user yang sudah ada:**

`/etc/login.defs` UMASK hanya affect user yang dibuat sesudahnya. Deploy user sudah ada dari MIG-001, jadi set umask explicit di shell init.

```bash
echo "umask 027" | sudo tee -a /home/deploy/.bashrc
echo "umask 027" | sudo tee -a /home/deploy/.profile
sudo chown deploy:deploy /home/deploy/.bashrc /home/deploy/.profile
```

### Verifikasi

```bash
# CrowdSec running
sudo cscli metrics
# Expected: tabular metrics, no errors

# CrowdSec collections installed
sudo cscli collections list | grep -E "sshd|linux|nginx"
# Expected: 3 lines, status "enabled"

# fail2ban disabled
systemctl status fail2ban --no-pager 2>&1 | head -3
# Expected: "could not be found" or "inactive"

# unattended-upgrades enabled
systemctl is-enabled unattended-upgrades
# Expected: enabled

# auditd running with our rules
sudo auditctl -l | head -10
# Expected: rules including sudo_exec, sshd_config, identity

# sysctl hardening applied
sudo sysctl net.ipv4.tcp_syncookies kernel.dmesg_restrict fs.suid_dumpable
# Expected: tcp_syncookies = 1, dmesg_restrict = 1, suid_dumpable = 0

# USB storage disabled
sudo modprobe -n -v usb-storage
# Expected: install /bin/true
```

### Rollback

```bash
# Restore fail2ban kalau diperlukan
sudo apt install -y fail2ban
sudo systemctl enable --now fail2ban
# Stop CrowdSec
sudo systemctl disable --now crowdsec crowdsec-firewall-bouncer
# Remove sysctl hardening
sudo rm /etc/sysctl.d/99-papyr-hardening.conf
sudo sysctl --system
```

### Definition of Done

- [ ] CrowdSec running, 3 collections installed (sshd, linux, nginx)
- [ ] CrowdSec firewall bouncer aktif
- [ ] fail2ban purged
- [ ] unattended-upgrades enabled, auto-reboot configured 04:00
- [ ] auditd running dengan papyr rules loaded
- [ ] sysctl hardening applied dan persisted
- [ ] USB storage disabled
- [ ] Unused services disabled (avahi/cups/snapd)
- [ ] umask 027 untuk new users
- [ ] umask 027 applied ke deploy user (`.bashrc` + `.profile`)

### Catatan

- CrowdSec sharing detection signals dengan komunitas: kalau IP brute-force ke VPS lain, kita dapat blocklist juga. Free tier cukup.
- auditd logs di `/var/log/audit/audit.log`. Akan di-rotate di STEP-MIG-006.
- `unattended-upgrades` reboot 04:00 = downtime ~30 detik kalau ada kernel update. Acceptable untuk single-instance setup.

---

## STEP-MIG-003: Filesystem Integrity + Rootkit Detection

### Konteks

Kalau cryptominer berhasil bypass network defense dan masuk, dia biasanya drop binary di `/tmp` atau `/var/tmp`, modify `/etc`, atau replace `/usr/bin` files. Step ini detect itu via AIDE (file integrity), restrict mount points, dan rootkit scanners.

### Prerequisites

- STEP-MIG-002 selesai

### Langkah

**3.1 Install AIDE (Advanced Intrusion Detection Environment):**

```bash
sudo apt install -y aide aide-common
```

**3.2 Configure AIDE untuk Papyr:**

`/opt/papyr/` belum exist saat MIG-003 dijalankan (akan dibuat di MIG-008). AIDE akan no-op untuk path yang tidak exist; saat MIG-008 nanti baru run `sudo aide --update` untuk register direktori baru ke baseline.

> ⚠️ **Group selection note**: Ubuntu's AIDE drop-in (`/etc/aide/aide.conf.d/`) di-include **sebelum** group definitions di main config. Group `NORMAL` (umum di Debian) tidak ada di Ubuntu. Pakai `Full` (line 51 di `/etc/aide/aide.conf`) yang setara — covers OwnerMode + i + n + Size + l + X + Checksums.

```bash
sudo tee /etc/aide/aide.conf.d/99_papyr_local > /dev/null <<'EOF'
# Papyr-specific AIDE rules
# Monitor /opt/papyr but exclude logs/temp dirs
# Note: /opt/papyr/ akan dibuat di STEP-MIG-008. AIDE no-op until then.
# Use Full group (defined in /etc/aide/aide.conf line 51) — covers OwnerMode + i + n + Size + l + X + Checksums
/opt/papyr$ Full
!/opt/papyr/logs
!/opt/papyr/temp
!/opt/papyr/backups
EOF

# Initialize AIDE database (akan butuh ~5-15 menit)
sudo aideinit
# Move new database ke active location
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db
```

**3.3 Setup AIDE daily cron:**

```bash
sudo tee /etc/cron.daily/aide-check > /dev/null <<'EOF'
#!/bin/bash
# Run AIDE check daily, log to /var/log/aide.log
AIDE_LOG=/var/log/aide.log
DATE=$(date +%Y-%m-%d)
{
  echo "=== AIDE Check $DATE ==="
  /usr/bin/aide --check 2>&1
  echo ""
} >> $AIDE_LOG

# If any changes detected, also log to journald with high priority
if /usr/bin/aide --check 2>&1 | grep -q "found differences"; then
  logger -p daemon.warning -t aide "AIDE detected file changes — review /var/log/aide.log"
fi
EOF
sudo chmod +x /etc/cron.daily/aide-check
```

**3.4 Restrict /tmp dan /var/tmp dengan noexec/nosuid/nodev:**

Ubuntu 22.04 default `/tmp` shared dengan rootfs. Kita bind-mount dengan flags ketat.

```bash
# Backup current fstab
sudo cp /etc/fstab /etc/fstab.bak.pre-mig-003

# Safety: pastikan tidak ada file di /tmp yang sedang dipakai (lsof harus kosong atau hanya systemd noise)
sudo lsof /tmp 2>/dev/null | head -10
sudo lsof /var/tmp 2>/dev/null | head -10

# Append tmpfs mounts
sudo tee -a /etc/fstab > /dev/null <<'EOF'

# Papyr hardening — restrict /tmp and /var/tmp
tmpfs   /tmp     tmpfs   defaults,nosuid,nodev,noexec,mode=1777,size=2G  0 0
tmpfs   /var/tmp tmpfs   defaults,nosuid,nodev,noexec,mode=1777,size=512M 0 0
EOF

# Apply (need reboot or manual mount)
sudo mount -o remount /tmp 2>/dev/null || sudo mount -t tmpfs -o defaults,nosuid,nodev,noexec,mode=1777,size=2G tmpfs /tmp
sudo mount -o remount /var/tmp 2>/dev/null || sudo mount -t tmpfs -o defaults,nosuid,nodev,noexec,mode=1777,size=512M tmpfs /var/tmp
```

⚠️ **Note**: Kalau Papyr backend butuh exec di `/tmp` (LibreOffice, OCRmyPDF subprocess), kita pakai `/opt/papyr/temp` directory dengan exec allowed (akan di-setup di STEP-MIG-006). `/tmp` system-wide tetap noexec.

**3.5 Install chkrootkit + rkhunter:**

```bash
sudo apt install -y chkrootkit rkhunter
sudo rkhunter --propupd
sudo rkhunter --update
```

**3.6 Setup weekly rootkit scan cron:**

```bash
sudo tee /etc/cron.weekly/rootkit-scan > /dev/null <<'EOF'
#!/bin/bash
# Weekly rootkit scan
LOG=/var/log/rootkit-scan.log
DATE=$(date +%Y-%m-%d)
{
  echo "=== Rootkit Scan $DATE ==="
  echo "--- chkrootkit ---"
  /usr/sbin/chkrootkit -q 2>&1 | grep -v "nothing found" | grep -v "no suspicious" || echo "chkrootkit: clean"
  echo "--- rkhunter ---"
  /usr/bin/rkhunter --check --skip-keypress --report-warnings-only 2>&1
  echo ""
} >> $LOG

# Alert on warnings
if grep -qi "warning\|infected\|trojan" $LOG; then
  logger -p daemon.warning -t rootkit-scan "Rootkit scan flagged warnings — review $LOG"
fi
EOF
sudo chmod +x /etc/cron.weekly/rootkit-scan
```

**3.7 Install Lynis untuk security audit baseline:**

```bash
sudo apt install -y lynis
sudo mkdir -p /opt/papyr/security
sudo chown -R deploy:deploy /opt/papyr
sudo lynis audit system --no-colors > /opt/papyr/security/lynis-baseline-$(date +%Y%m%d).log 2>&1
```

### Verifikasi

```bash
# AIDE database exists
sudo ls -la /var/lib/aide/aide.db
# Expected: file exists, size > 1MB

# AIDE check runs without error
sudo aide --check 2>&1 | tail -5
# Expected: "AIDE found NO differences" or known baseline differences

# /tmp is noexec
mount | grep "/tmp "
# Expected: includes "noexec"

# /tmp tmpfs cannot exec
echo '#!/bin/bash' > /tmp/test.sh
chmod +x /tmp/test.sh
/tmp/test.sh 2>&1 || echo "EXEC BLOCKED (expected)"
rm /tmp/test.sh
# Expected: "Permission denied" or similar

# rkhunter installed
rkhunter --version | head -1
# Expected: Rootkit Hunter version

# Lynis baseline saved
ls -la /opt/papyr/security/lynis-baseline-*.log
# Expected: file exists, size > 10KB

# Lynis hardening index
grep "Hardening index" /opt/papyr/security/lynis-baseline-*.log
# Expected: number, target >70 baseline (will improve to >85 after MIG-005)
```

### Rollback

```bash
# Restore fstab (revert /tmp/var/tmp tmpfs)
sudo cp /etc/fstab.bak.pre-mig-003 /etc/fstab
sudo umount /tmp /var/tmp 2>/dev/null || true
sudo reboot
# After reboot, /tmp is back to disk-based shared rootfs
```

### Definition of Done

- [ ] AIDE database initialized at `/var/lib/aide/aide.db`
- [ ] AIDE daily cron executable di `/etc/cron.daily/aide-check`
- [ ] `/tmp` and `/var/tmp` mounted as tmpfs dengan `noexec,nosuid,nodev`
- [ ] /tmp exec test gagal (Permission denied)
- [ ] chkrootkit + rkhunter installed
- [ ] Weekly rootkit scan cron di `/etc/cron.weekly/rootkit-scan`
- [ ] Lynis baseline report tersimpan di `/opt/papyr/security/lynis-baseline-<date>.log`
- [ ] Lynis hardening index recorded (target >70 untuk baseline)

### Catatan

- AIDE check pertama setelah Docker install (STEP-MIG-006) akan flag perubahan baru — itu expected, run `sudo aide --update` setelah verify perubahan legit.
- `/tmp` tmpfs 2GB cukup untuk Papyr (uvicorn buffer, temp files small). Kalau ada OOM-tmpfs, increase di fstab.
- LibreOffice exec dari `/tmp` akan gagal karena noexec. Itu sebabnya backend Dockerfile akan set `TMPDIR=/opt/papyr/temp` di STEP-MIG-008.

---

## STEP-MIG-004: Egress Filtering + Honeypot

### Konteks

Cryptominer yang berhasil masuk butuh dua hal: (1) connect ke mining pool, (2) drop binary di disk. Step 003 sudah blokir #2 via /tmp noexec. Step ini blokir #1 via egress firewall ke port pool umum, plus deploy honeypot di port 22 untuk waste attacker time + early warning.

### Prerequisites

- STEP-MIG-003 selesai

### Langkah

**4.1 Egress firewall — block known mining pool ports:**

```bash
# Block outbound to common mining pool ports
sudo ufw deny out 3333/tcp comment 'mining pool stratum'
sudo ufw deny out 4444/tcp comment 'mining pool stratum'
sudo ufw deny out 5555/tcp comment 'mining pool stratum'
sudo ufw deny out 7777/tcp comment 'mining pool stratum'
sudo ufw deny out 8333/tcp comment 'bitcoin'
sudo ufw deny out 9332/tcp comment 'litecoin'
sudo ufw deny out 14444/tcp comment 'mining pool stratum tls'
sudo ufw deny out 14433/tcp comment 'mining pool stratum tls'
sudo ufw deny out 9000/tcp comment 'monero pool common'
sudo ufw deny out 6666/tcp comment 'mining pool common'
sudo ufw status numbered | head -30
```

**4.2 Allow critical outbound (DNS, NTP, HTTPS, SMTP-submission for alerts):**

UFW default sudah `allow outgoing`, jadi ini optional restriction. Kalau mau full restrict outbound (more paranoid), set default deny outgoing dan allow specific:

```bash
# OPTIONAL: full egress whitelist mode (lebih ketat tapi bisa break update)
# Skip ini kalau gak nyaman, default-allow + deny mining ports cukup baseline.

# Versi paranoid:
# sudo ufw default deny outgoing
# sudo ufw allow out 53/udp comment 'DNS'
# sudo ufw allow out 53/tcp comment 'DNS TCP'
# sudo ufw allow out 80/tcp comment 'HTTP for apt'
# sudo ufw allow out 443/tcp comment 'HTTPS general'
# sudo ufw allow out 123/udp comment 'NTP'
# sudo ufw allow out 587/tcp comment 'SMTP submission'
```

Untuk Papyr, kita pakai default-allow + deny mining ports. Cukup balance antara security dan operability.

**4.3 Install endlessh (honeypot SSH di port 22):**

```bash
sudo apt install -y endlessh
sudo tee /etc/endlessh/config > /dev/null <<'EOF'
# endlessh — fake SSH banner sender
# Bind ke port 22 (yang sudah blocked oleh real sshd)
# Tujuan: waste scanner time dengan slow banner, generate detection signal
Port 22
Delay 10000
MaxLineLength 32
MaxClients 4096
LogLevel 1
BindFamily 4
EOF
```

**4.4 Allow port 22 di UFW (untuk endlessh):**

⚠️ Sebelum ini, port 22 di-deny by default. Kita allow lagi supaya scanner masuk ke endlessh, bukan reject langsung.

```bash
sudo ufw allow 22/tcp comment 'endlessh honeypot'
sudo systemctl enable --now endlessh
sudo systemctl restart endlessh
sudo systemctl status endlessh --no-pager | head -5
# Confirm endlessh actually listening on :22
sudo ss -tlnp | grep ":22 "
```

**4.5 Optional honeypot di 2222 (alternate SSH port yang sering di-scan):**

Skip kalau gak mau noise di logs. Kalau mau:

```bash
# Run another endlessh instance on 2222
# Skip — single port honeypot cukup untuk Papyr
```

**4.6 Test honeypot:**

```bash
# Dari laptop (PowerShell native, no nc dependency):
Test-NetConnection -ComputerName 172.235.251.193 -Port 22
# Expected: TcpTestSucceeded : True (means endlessh accepted connection)

# Optional slow-drip verification: ssh -o ConnectTimeout=5 -p 22 root@172.235.251.193
# Expected: hangs/timeout — banner drips slowly, never completes handshake.
# Real SSH still works via: ssh papyr (port 52022)
```

### Verifikasi

```bash
# UFW rules include mining port blocks
sudo ufw status numbered | grep -E "DENY OUT|3333|4444|5555|14444|8333"
# Expected: multiple lines with DENY OUT for mining ports

# endlessh running on port 22
sudo ss -tlnp | grep ":22 "
# Expected: tcp LISTEN ... :22 ... endlessh

# Real sshd masih di 52022
sudo ss -tlnp | grep ":52022 "
# Expected: tcp LISTEN ... :52022 ... sshd

# UFW status
sudo ufw status verbose | head -20
# Expected: active, default deny incoming, allow outgoing, with deny out rules
```

### Rollback

```bash
# Stop endlessh
sudo systemctl disable --now endlessh
sudo ufw deny 22/tcp
# Remove mining port deny rules
for port in 3333 4444 5555 7777 8333 9332 14444 14433 9000 6666; do
  sudo ufw delete deny out $port/tcp 2>/dev/null || true
done
```

### Definition of Done

- [ ] UFW blocks outbound mining pool ports (3333, 4444, 5555, 7777, 8333, 9332, 14444, 14433, 9000, 6666)
- [ ] endlessh running on port 22, configured untuk slow banner
- [ ] Real sshd masih reachable di port 52022
- [ ] Test connect ke port 22 dari laptop = slow banner drip (proof honeypot works)
- [ ] CrowdSec dapat sees endlessh logs (akan dipakai untuk auto-ban scanner di STEP-MIG-002 collections)

### Catatan

- endlessh waste scanner time dengan slow drip banner. Bandwidth cost negligible (~1KB/connection).
- Daftar mining ports di atas representative — kalau ada threat intelligence baru, append ke UFW rules.
- Kalau Papyr backend butuh outbound connection ke layanan baru di port unknown, allow specific di UFW dulu.

---

## STEP-MIG-005: Compliance Baselines (OpenSCAP + Lynis)

### Konteks

OpenSCAP scan VPS dengan CIS Ubuntu 22.04 Benchmark — formal compliance check untuk catch hardening gaps yang manual review missed. Lynis re-scan untuk track improvement vs baseline (STEP-MIG-003). Output dipakai sebagai security audit trail dan dipakai recurringly setiap quarter.

### Prerequisites

- STEP-MIG-004 selesai

### Langkah

**5.1 Install OpenSCAP scanner + SCAP Security Guide:**

```bash
sudo apt install -y libopenscap8 ssg-base ssg-applications scap-security-guide
```

**5.2 Run OpenSCAP scan dengan CIS Ubuntu 22.04 profile:**

```bash
# /opt/papyr/security sudah dibuat di STEP-MIG-003 (owner deploy:deploy).

# List available profiles
sudo oscap info /usr/share/xml/scap/ssg/content/ssg-ubuntu2204-ds.xml | grep "Profile" | head -10

# Run scan with CIS Level 1 server profile
sudo oscap xccdf eval \
  --profile xccdf_org.ssgproject.content_profile_cis_level1_server \
  --results /opt/papyr/security/openscap-results-$(date +%Y%m%d).xml \
  --report /opt/papyr/security/openscap-report-$(date +%Y%m%d).html \
  /usr/share/xml/scap/ssg/content/ssg-ubuntu2204-ds.xml || true
# Note: scan akan exit non-zero kalau ada failures, that's expected

sudo chown -R deploy:deploy /opt/papyr/security
```

**5.3 Review OpenSCAP report (download HTML to laptop untuk review):**

```bash
# Dari laptop
scp -i $HOME\.ssh\papyr\operator -P 52022 deploy@172.235.251.193:/opt/papyr/security/openscap-report-*.html .
# Open di browser, review failures
```

**5.4 Apply mandatory remediations dari OpenSCAP findings:**

Common findings dan fix (idempotent — safe to re-run):

```bash
# Sebagai deploy + sudo

# Disable IPv4 forwarding (idempotent: only append if not present)
if ! grep -qE '^net\.ipv4\.ip_forward\s*=\s*0' /etc/sysctl.d/99-papyr-hardening.conf; then
  echo "net.ipv4.ip_forward = 0" | sudo tee -a /etc/sysctl.d/99-papyr-hardening.conf
fi

# Disable core dumps via limits.d (sysctl suid_dumpable already set di MIG-002)
if ! sudo test -f /etc/security/limits.d/papyr.conf || ! sudo grep -q '^\* hard core 0' /etc/security/limits.d/papyr.conf; then
  echo "* hard core 0" | sudo tee /etc/security/limits.d/papyr.conf
fi

# Set login banner (idempotent)
sudo tee /etc/issue.net > /dev/null <<'EOF'
WARNING: Authorized access only. All activity is logged and monitored.
EOF

# Add Banner directive to sshd_config (idempotent)
if ! sudo grep -qE '^Banner\s+/etc/issue\.net' /etc/ssh/sshd_config; then
  echo "Banner /etc/issue.net" | sudo tee -a /etc/ssh/sshd_config
fi

# Apply sysctl
sudo sysctl --system > /dev/null

# Reload sshd (no disconnect; reload supported di OpenSSH 8+ Ubuntu 22.04)
sudo sshd -t  # validate config first
sudo systemctl reload sshd

# Set default umask di profile (idempotent)
echo "umask 027" | sudo tee /etc/profile.d/umask.sh > /dev/null
sudo chmod +x /etc/profile.d/umask.sh
```

**5.5 Document deferred items:**

Note: heredoc dengan `'EOF'` quoted prevents `$()` substitution. Render `Last updated:` lewat real `date` substitution dulu, baru tee.

```bash
TODAY=$(date +%Y-%m-%d)
sudo tee /opt/papyr/security/security-baseline.md > /dev/null <<EOF
# Security Baseline — Papyr Production VPS

Last updated: ${TODAY}

## Compliance Reference
- CIS Ubuntu Linux 22.04 Benchmark Level 1 Server

## Applied Remediations
- See \`openscap-results-*.xml\` for full audit trail
- Kernel hardening sysctl applied (\`/etc/sysctl.d/99-papyr-hardening.conf\`)
- Login banner set
- IPv4 forwarding disabled
- Core dumps disabled
- umask 027 default

## Deferred Items
(Items intentionally not applied with justification.)

- IPv6 disabled — DEFERRED. Linode dedicated IPv6 /64 dipakai untuk fallback connectivity.
- Mandatory password complexity — DEFERRED. SSH password auth disabled, sudo NOPASSWD, password complexity moot.
- USB authorize_default — DEFERRED. USB disabled via modprobe (STEP-MIG-002).

## Re-scan Cadence
- OpenSCAP: quarterly
- Lynis: monthly (or after major change)
- AIDE: daily (cron, see STEP-MIG-003)
- Rootkit: weekly (cron, see STEP-MIG-003)

## Audit Trail
- \`/opt/papyr/security/openscap-results-*.xml\` — raw OpenSCAP results
- \`/opt/papyr/security/openscap-report-*.html\` — human-readable report
- \`/opt/papyr/security/lynis-baseline-*.log\` — Lynis baseline (STEP-MIG-003)
- \`/opt/papyr/security/lynis-postharden-*.log\` — Lynis after hardening (this step)
EOF

sudo chown deploy:deploy /opt/papyr/security/security-baseline.md
```

**5.6 Re-run Lynis untuk compare hardening index:**

```bash
sudo lynis audit system --no-colors > /opt/papyr/security/lynis-postharden-$(date +%Y%m%d).log 2>&1
grep "Hardening index" /opt/papyr/security/lynis-postharden-*.log
# Expected: number, target >85 (improvement dari baseline)
```

### Verifikasi

```bash
# OpenSCAP report exists
ls -la /opt/papyr/security/openscap-report-*.html
# Expected: file exists

# OpenSCAP results saved
ls -la /opt/papyr/security/openscap-results-*.xml
# Expected: file exists

# Lynis post-harden score >85
grep "Hardening index" /opt/papyr/security/lynis-postharden-*.log | tail -1
# Expected: number >= 85

# Login banner applied
ssh -i $HOME\.ssh\papyr\operator -p 52022 deploy@172.235.251.193 'cat /etc/issue.net'
# Expected: "WARNING: Authorized access only..."

# IPv4 forwarding disabled
sysctl net.ipv4.ip_forward
# Expected: net.ipv4.ip_forward = 0

# security-baseline.md exists
ls -la /opt/papyr/security/security-baseline.md
# Expected: file exists
```

### Rollback

Tidak banyak yang perlu di-rollback dari step ini (semua additive hardening). Kalau ada satu remediation yang break sesuatu, comment line spesifik di sysctl atau revert SSH banner.

### Definition of Done

- [ ] OpenSCAP report (XML + HTML) tersimpan di `/opt/papyr/security/`
- [ ] Mandatory remediations applied (IPv4 forwarding off, core dumps off, login banner, umask)
- [ ] `security-baseline.md` documents applied + deferred items
- [ ] Lynis post-harden hardening index >= 85
- [ ] Re-scan cadence documented (quarterly OpenSCAP, monthly Lynis)

### Catatan

- OpenSCAP scan butuh ~5-10 menit. Hasil verbose, fokus ke `[fail]` items di HTML report.
- CIS Level 1 Server profile = production-ready baseline. Level 2 = stricter, banyak operability tradeoff. Skip Level 2 untuk Papyr.
- Cron quarterly OpenSCAP scan = dijadwalkan di STEP-MIG-019 sebagai bagian dari runbook.

---

## STEP-MIG-006: Server Foundation (Docker + Swap + Dirs)

### Konteks

Setelah hardening base OS, sekarang setup containerization runtime. Docker CE official repo (lebih update dari apt default), daemon hardening, swap file 4GB sebagai OOM safety net (8GB RAM = enough tapi swap = parachute), dan directory structure untuk Papyr application.

### Prerequisites

- STEP-MIG-005 selesai

### Langkah

**6.1 Install Docker CE dari official repo:**

```bash
# Sebagai deploy + sudo

# Add Docker GPG key
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add Docker repo
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker CE + compose plugin
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify
sudo docker --version
sudo docker compose version
```

**6.2 Add deploy user to docker group:**

```bash
sudo usermod -aG docker deploy
# Need to logout-login untuk group apply
```

⚠️ **Note**: Docker group = root equivalent (Docker socket access). Mitigasi sudah ada via `no-new-privileges` di daemon config (next step). Untuk paranoid setup, consider rootless Docker — defer untuk simplicity.

**6.3 Configure Docker daemon hardening:**

> ⚠️ **userns-remap caveat**: option `"userns-remap": "default"` membuat container UID 0 di-shift ke host UID 100000+. Trade-off: shared volumes butuh ownership adjustment. File yang ditulis container akan owned `100000:100000` di host, bukan `deploy:deploy`. Akan dihandle di STEP-MIG-009 saat compose volumes di-setup (set host directory owner to 100000 atau pakai user mapping di compose). Kalau ternyata ribet, comment line ini dan restart docker — daemon hardening lain tetap aktif tanpa userns-remap.

> **Heredoc note**: tulis `daemon.json` di laptop lokal lalu `scp + install` untuk avoid PowerShell heredoc mangling.

```bash
sudo tee /etc/docker/daemon.json > /dev/null <<'EOF'
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
EOF
sudo systemctl restart docker
sudo systemctl status docker --no-pager | head -5
```

**6.4 Create 4GB swap file (OOM safety net):**

```bash
# Check current swap
sudo swapon --show

# Create 4GB swap file
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Persist to fstab
echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab

# Verify
sudo swapon --show
free -h
```

**6.5 Tune swappiness (sudah di sysctl 99-papyr-hardening.conf):**

```bash
# Already set to 10 in STEP-MIG-002
sysctl vm.swappiness
# Expected: vm.swappiness = 10
```

**6.6 Create Papyr directory structure:**

> ⚠️ `/opt/papyr/security` sudah exists sejak STEP-MIG-005 dengan ownership `deploy:deploy` mode 750 dan berisi files (openscap report, lynis logs, ssg/, security-baseline.md). `mkdir -p` idempotent dan `chown -R` no-op untuk file yang sudah deploy:deploy, tapi targeted chmod harus pakai non-recursive di top-level untuk avoid accidental permission flip pada existing files.

```bash
sudo mkdir -p /opt/papyr/{production,nginx/conf.d,nginx/ssl,logs,backups,temp}
# /opt/papyr/security sudah ada dari MIG-005 — tidak buat ulang
sudo chown -R deploy:deploy /opt/papyr
sudo chmod 750 /opt/papyr
sudo chmod 700 /opt/papyr/production  # contains .env
sudo chmod 700 /opt/papyr/nginx/ssl
sudo chmod 750 /opt/papyr/{logs,backups,temp,nginx,nginx/conf.d}
# /opt/papyr/security mode tetap 750 dari MIG-003
ls -la /opt/papyr/
```

`/opt/papyr/temp` akan di-mount sebagai writable tmpfs di compose (LibreOffice butuh exec, jadi gak bisa pakai /tmp yang noexec).

**6.7 Logrotate untuk Papyr logs:**

```bash
sudo tee /etc/logrotate.d/papyr > /dev/null <<'EOF'
/opt/papyr/logs/*.log /opt/papyr/logs/*/*.log {
    weekly
    rotate 4
    compress
    delaycompress
    missingok
    notifempty
    create 0640 deploy deploy
    sharedscripts
    postrotate
        # Reload Nginx for rotation (akan dipakai setelah Nginx running)
        if [ -f /opt/papyr/production/docker-compose.yml ]; then
            cd /opt/papyr/production && docker compose kill -s USR1 nginx 2>/dev/null || true
        fi
    endscript
}
EOF

# Test logrotate config
sudo logrotate -d /etc/logrotate.d/papyr 2>&1 | head -10
# Expected: no errors
```

**6.8 Cron weekly Docker prune (cleanup old images/containers):**

```bash
sudo tee /etc/cron.weekly/docker-prune > /dev/null <<'EOF'
#!/bin/bash
# Weekly Docker cleanup — remove dangling images, stopped containers, unused volumes
LOG=/opt/papyr/logs/docker-prune.log
mkdir -p /opt/papyr/logs
{
  echo "=== Docker prune $(date +%Y-%m-%d) ==="
  docker system prune -af --filter "until=168h" 2>&1
  docker volume prune -f --filter "label!=keep" 2>&1
  echo ""
} >> $LOG
EOF
sudo chmod +x /etc/cron.weekly/docker-prune
```

**6.9 Verify deploy user can run Docker:**

⚠️ Setelah `usermod -aG docker deploy` (task 6.2), group apply tidak immediate untuk session yang sudah jalan. Pakai pattern berikut tanpa harus disconnect:

```bash
# Option A (recommended): re-SSH baru dari laptop, group langsung apply.
ssh -i $HOME\.ssh\papyr\operator -p 52022 deploy@172.235.251.193 'docker run --rm hello-world | head -3'
# atau via alias:
ssh papyr 'docker run --rm hello-world | head -3'

# Option B (kalau current session perlu langsung): pakai sg untuk run sub-shell dengan docker group.
sg docker -c 'docker run --rm hello-world | head -3'
```

Expected output: 3 baris pertama dari "Hello from Docker!" message.

**6.10 AIDE update setelah Docker install:**

⚠️ AIDE rebaseline butuh ~6 menit (sama seperti aide-init di MIG-003). Run ini paling akhir setelah semua perubahan filesystem (Docker install, swap file, /opt/papyr dirs, logrotate, cron) selesai supaya satu sweep covers everything.

```bash
# Docker install adds many files. Re-baseline AIDE.
sudo aide --config /etc/aide/aide.conf --update
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db
ls -la /var/lib/aide/aide.db
```

### Verifikasi

```bash
# Docker installed and running
docker --version
# Expected: Docker version 24.x or higher

docker compose version
# Expected: Docker Compose version v2.x

sudo systemctl is-active docker
# Expected: active

# Daemon hardening applied
sudo cat /etc/docker/daemon.json
# Expected: shows our config

# Deploy user in docker group
groups deploy | grep -o docker
# Expected: docker

# Deploy can run Docker
docker run --rm hello-world | head -3
# Expected: Hello from Docker

# Swap active
free -h | grep Swap
# Expected: 4Gi swap

# Papyr dirs exist
ls -la /opt/papyr/
# Expected: production, nginx, logs, security, backups, temp dirs

# Logrotate config valid
sudo logrotate -d /etc/logrotate.d/papyr 2>&1 | grep -i error
# Expected: no output (no errors)
```

### Rollback

```bash
# Remove Docker
sudo apt purge -y docker-ce docker-ce-cli containerd.io docker-compose-plugin docker-buildx-plugin
sudo rm -rf /var/lib/docker /etc/docker

# Remove swap
sudo swapoff /swapfile
sudo rm /swapfile
sudo sed -i '/swapfile/d' /etc/fstab

# Remove dirs
sudo rm -rf /opt/papyr
```

### Definition of Done

- [ ] Docker CE 24.x+ installed dari official repo
- [ ] docker-compose-plugin v2 installed
- [ ] Daemon hardening applied (`/etc/docker/daemon.json` dengan log-rotation, no-new-privileges, userns-remap, live-restore)
- [ ] Deploy user in docker group, bisa `docker run` tanpa sudo
- [ ] 4GB swap file aktif dan persisted di `/etc/fstab`
- [ ] vm.swappiness = 10
- [ ] `/opt/papyr/{production,nginx/conf.d,nginx/ssl,logs,security,backups,temp}` exists dengan permissions ketat
- [ ] Logrotate config untuk Papyr logs aktif
- [ ] Weekly docker prune cron aktif
- [ ] AIDE database re-baselined setelah Docker install

### Catatan

- `userns-remap` = container UID di-shift, kalau ada container escape, attacker UID bukan root host. Trade-off: shared volumes butuh ownership adjustment. Kita test di STEP-MIG-009.
- `icc: false` = inter-container communication disabled by default, butuh explicit network. Papyr cuma satu service jadi gak masalah.
- Swap 4GB di SSD: cost = ~3-5GB rotated wear per bulan. OK untuk Linode SSD.

---

## STEP-MIG-007: SSH 2FA + LISH Emergency Recovery

### Konteks

Defense-in-depth untuk SSH: kalau private key + passphrase ke-leak, attacker masih butuh 2FA TOTP code. Plus document LISH (Linode Shell) emergency procedure untuk situasi SSH lockout total. Ini paranoid layer terakhir untuk authentication.

### Prerequisites

- STEP-MIG-006 selesai
- TOTP authenticator app di phone (Google Authenticator, Authy, atau Bitwarden Authenticator)

### Langkah

**7.1 Install Google Authenticator PAM module:**

```bash
sudo apt install -y libpam-google-authenticator qrencode
```

**7.2 Configure TOTP untuk deploy user:**

```bash
# As deploy user (NOT sudo)
google-authenticator -t -d -f -r 3 -R 30 -W
```

Flags meaning:
- `-t` = time-based (TOTP, not counter-based HOTP)
- `-d` = disallow reuse of previous tokens
- `-f` = force write to ~/.google_authenticator
- `-r 3 -R 30` = rate-limit 3 attempts per 30 seconds
- `-W` = disable code re-use within 1.5min window

**Output akan show:**
- QR code di terminal — scan dengan authenticator app
- Secret key (base32) — backup ke password manager
- 5 emergency scratch codes — backup ke password manager

⚠️ **Save QR code SECRET dan 5 emergency codes ke password manager segera.**

**7.3 Configure PAM untuk SSH 2FA:**

```bash
# Backup PAM config
sudo cp /etc/pam.d/sshd /etc/pam.d/sshd.bak.pre-mig-007

# Add Google Authenticator to SSH PAM stack
# Edit /etc/pam.d/sshd
sudo tee /etc/pam.d/sshd > /dev/null <<'EOF'
# PAM configuration for the Secure Shell service
# 2FA: require TOTP after pubkey

# Standard SSH auth (pubkey)
@include common-auth

# 2FA: require Google Authenticator
auth required pam_google_authenticator.so nullok

# Disallow non-root logins when /etc/nologin exists
account required pam_nologin.so

# Standard Un*x authorization
@include common-account

# Standard session
@include common-session
session optional pam_motd.so motd=/run/motd.dynamic
session optional pam_motd.so noupdate
session optional pam_mail.so standard noenv
session required pam_limits.so
session required pam_env.so
session required pam_env.so user_readenv=1 envfile=/etc/default/locale

# Standard Un*x password
@include common-password
EOF

# `nullok` = users tanpa ~/.google_authenticator masih bisa login (graceful rollout).
# Setelah deploy user confirmed working, ubah ke required (no nullok) untuk full enforcement.
```

**7.4 Update sshd_config untuk enforce 2FA:**

> **Idempotent edit pattern**: kita pakai grep-then-append (idempotent, safe to re-run) supaya tidak break kalau line sudah ada atau format berbeda dari ekspektasi sed. Reload (no restart) supaya tidak drop session existing.

```bash
# Backup sshd_config sebelum edit
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.pre-mig-007

# Enable challenge-response untuk 2FA (idempotent)
if sudo grep -qE '^ChallengeResponseAuthentication\s+no' /etc/ssh/sshd_config; then
  sudo sed -i 's/^ChallengeResponseAuthentication.*/ChallengeResponseAuthentication yes/' /etc/ssh/sshd_config
elif ! sudo grep -qE '^ChallengeResponseAuthentication\s+yes' /etc/ssh/sshd_config; then
  echo "ChallengeResponseAuthentication yes" | sudo tee -a /etc/ssh/sshd_config
fi

# KbdInteractive (idempotent)
if sudo grep -qE '^KbdInteractiveAuthentication\s+no' /etc/ssh/sshd_config; then
  sudo sed -i 's/^KbdInteractiveAuthentication.*/KbdInteractiveAuthentication yes/' /etc/ssh/sshd_config
elif ! sudo grep -qE '^KbdInteractiveAuthentication\s+yes' /etc/ssh/sshd_config; then
  echo "KbdInteractiveAuthentication yes" | sudo tee -a /etc/ssh/sshd_config
fi

# AuthenticationMethods (idempotent)
if ! sudo grep -qE '^AuthenticationMethods\s+publickey,keyboard-interactive' /etc/ssh/sshd_config; then
  echo "AuthenticationMethods publickey,keyboard-interactive" | sudo tee -a /etc/ssh/sshd_config
fi

# UsePAM (idempotent — actually already in sshd_config from MIG-001)
if ! sudo grep -qE '^UsePAM\s+yes' /etc/ssh/sshd_config; then
  echo "UsePAM yes" | sudo tee -a /etc/ssh/sshd_config
fi

# Validate config
sudo sshd -t
echo "sshd -t exit: $?"
# Expected: 0 (silent = valid)
```

**7.5 Test 2FA login DALAM SAFETY-NET MODE:**

⚠️ **JANGAN TUTUP terminal SSH yang sekarang.** Buka terminal BARU di laptop. Pakai SSH alias.

Step 1 — reload sshd di terminal lama (no disconnect):

```bash
# Di terminal lama (yang masih open). Reload, bukan restart, supaya session existing tidak terputus.
sudo systemctl reload sshd
sudo systemctl status sshd --no-pager | head -3
```

Step 2 — test 2FA dari terminal kedua di laptop:

```bash
# Terminal BARU di laptop
ssh papyr
# atau full form: ssh -i $HOME\.ssh\papyr\operator -p 52022 deploy@172.235.251.193

# Expected: prompt "Verification code:" setelah pubkey accepted
# Enter TOTP code dari authenticator app (6 digits)
# Should login successfully
```

⚠️ **Kalau Step 2 fail (no TOTP prompt atau access denied)**, JANGAN tutup terminal lama. Debug di terminal lama:

```bash
# Cek PAM config
sudo grep "google_authenticator" /etc/pam.d/sshd
# Cek sshd config
sudo grep -E "AuthenticationMethods|ChallengeResponse|KbdInteractive|UsePAM" /etc/ssh/sshd_config
# Cek user TOTP file
ls -la /home/deploy/.google_authenticator
# Cek sshd logs
sudo journalctl -u sshd -n 30 --no-pager
```

Kalau Step 2 PASS, lanjut Step 3:

Step 3 — verify key-only login (without TOTP) is BLOCKED:

```bash
# Terminal kedua di laptop
ssh -o "PreferredAuthentications=publickey" papyr
# Expected: "Permission denied (keyboard-interactive)" — 2FA enforced
```

Kalau Step 3 PASS, kamu boleh tutup terminal lama. Future SSH lewat `ssh papyr` akan minta TOTP.

**7.6 Document emergency SSH recovery procedure:**

> **Reseller caveat**: Papyr VPS dibeli via IDCloudHost reseller, jadi operator **tidak punya** akses Linode dashboard / LISH. Recovery path utama bukan LISH, tapi IDCH support ticket. Section ini document keduanya untuk completeness.

```bash
# Append to /opt/papyr/security/security-baseline.md
sudo tee -a /opt/papyr/security/security-baseline.md > /dev/null <<'EOF'

## Emergency SSH Recovery

### Primary path: IDCloudHost reseller support (operator's situation)

VPS provisioned via IDCH reseller, no direct Linode dashboard access.

If SSH is unreachable (locked out, sshd misconfig, network failure):

1. Open IDCloudHost support ticket marked URGENT — request emergency console access ke VPS Linode mereka.
2. Wait for IDCH ops to provide console (web SSH or VNC) — response time 30 min-4 hour business hours.
3. Login as `root` with password from password manager (rotated MIG-001).
4. Diagnose:
   - sshd status: `systemctl status sshd`
   - sshd config valid: `sshd -t`
   - UFW status: `ufw status`
   - Network interface: `ip addr show`
5. Common fixes:
   - Restore sshd_config: `cp /etc/ssh/sshd_config.bak.pre-mig-XXX /etc/ssh/sshd_config && systemctl reload sshd`
   - Restore PAM config: `cp /etc/pam.d/sshd.bak.pre-mig-007 /etc/pam.d/sshd`
   - Disable UFW temporarily: `ufw disable` then re-enable after fix
   - CrowdSec self-ban: `cscli decisions list` and remove laptop IP if banned (`cscli decisions delete --ip <laptop_public_ip>`)
6. After fix, exit console and SSH again from laptop.

### Fallback path: Linode LISH (not available to operator, documented for future)

If at some point the operator gains direct Linode account access:

1. Login to Linode Cloud Manager: https://cloud.linode.com
2. Navigate to Linodes → select papyr-prod-id
3. Click "Launch LISH Console" (top-right)
4. Same diagnose + fix steps as above.
5. LISH access requires Linode account 2FA (recommended once direct access available).

## 2FA Recovery

If TOTP device lost or 2FA-locked-out:

1. Enter via IDCH support ticket (or LISH if available) as `root`
2. Edit `/home/deploy/.google_authenticator` to validate one of the 5 backup scratch codes
3. Or temporarily set `nullok` in `/etc/pam.d/sshd` to bypass 2FA:
   `sudo sed -i 's/auth required pam_google_authenticator.so/auth required pam_google_authenticator.so nullok/' /etc/pam.d/sshd && sudo systemctl reload sshd`
4. SSH as deploy, re-enroll TOTP: `google-authenticator -t -d -f -r 3 -R 30 -W`
5. Save new secrets to password manager
6. Re-enable strict 2FA after recovery: remove `nullok` and reload sshd

EOF
sudo chown deploy:deploy /opt/papyr/security/security-baseline.md
```

### Verifikasi

```bash
# Login dengan key + TOTP works
# (Manual test dari laptop, expect TOTP prompt setelah pubkey accepted)

# Login dengan key only (no TOTP) BLOCKED
ssh -i $HOME\.ssh\papyr\operator -p 52022 -o "PreferredAuthentications=publickey" deploy@172.235.251.193
# Expected: "Permission denied (keyboard-interactive)" — 2FA enforced

# google_authenticator config exists for deploy
ls -la /home/deploy/.google_authenticator
# Expected: file exists, mode 400

# sshd config has AuthenticationMethods
sudo grep "AuthenticationMethods" /etc/ssh/sshd_config
# Expected: AuthenticationMethods publickey,keyboard-interactive
```

### Rollback

```bash
# Disable 2FA
sudo cp /etc/pam.d/sshd.bak.pre-mig-007 /etc/pam.d/sshd
sudo sed -i 's/^AuthenticationMethods.*//' /etc/ssh/sshd_config
sudo systemctl restart sshd
# Verify SSH works without 2FA
```

### Definition of Done

- [ ] Google Authenticator PAM module installed
- [ ] TOTP secret + backup codes saved ke password manager
- [ ] `~deploy/.google_authenticator` exists, mode 400
- [ ] PAM stack include `pam_google_authenticator.so`
- [ ] sshd `AuthenticationMethods publickey,keyboard-interactive`
- [ ] SSH login works dengan key + TOTP
- [ ] SSH login dengan key only BLOCKED
- [ ] LISH emergency procedure documented di `/opt/papyr/security/security-baseline.md`
- [ ] 2FA recovery procedure documented

### Catatan

- TOTP code valid 30 detik. Time sync penting (`timedatectl status`).
- `nullok` di PAM = users tanpa TOTP file masih bisa login. Untuk paranoid mode, hapus `nullok` setelah semua admin user enrolled.
- Backup scratch codes (5x) = sekali pakai. Save semua, gunakan kalau phone hilang.
- Linode LISH access butuh Linode account 2FA (sudah aktif di STEP-MIG-000).

---

## STEP-MIG-008: Production Dockerfile + SBOM

### Konteks

Build Dockerfile production yang minimal attack surface, multi-stage untuk image size kecil, run as non-root, native deps untuk OCR/LibreOffice/Camelot. Generate SBOM (Software Bill of Materials) dengan syft untuk track dependencies untuk CVE response. Scan dengan trivy untuk catch CVEs sebelum push.

### Prerequisites

- STEP-MIG-007 selesai
- Repo Papyr ada di laptop (untuk test build local dulu)

### Langkah

**8.1 Buat Dockerfile.production di laptop (BUKAN di VPS):**

```bash
# Di laptop, di repo papyr
cd C:\Users\faizz\papyr
```

Buat `backend/Dockerfile.production`:

```dockerfile
# syntax=docker/dockerfile:1.7
# Papyr backend production Dockerfile (multi-stage, hardened)

# ============================================================
# Stage 1: Builder
# ============================================================
FROM python:3.11.9-slim-bookworm AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Build deps for native Python packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libffi-dev \
        libxml2-dev \
        libxslt1-dev \
        zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build
COPY requirements.txt requirements-dev.txt ./
RUN pip install --no-cache-dir --user -r requirements.txt

# ============================================================
# Stage 2: Runtime
# ============================================================
FROM python:3.11.9-slim-bookworm AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PATH=/home/appuser/.local/bin:$PATH \
    TMPDIR=/opt/papyr/temp

# Runtime native deps for Papyr tools:
# - tesseract-ocr-eng/ind: OCR for English + Indonesian
# - libreoffice-writer: PDF→Word fallback
# - ghostscript: PDF compression
# - poppler-utils: PDF utilities (used by camelot)
# - libxcb-xfixes0: opencv-python-headless dependency
# - curl: healthcheck inside container
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        tesseract-ocr \
        tesseract-ocr-eng \
        tesseract-ocr-ind \
        libreoffice-writer \
        libreoffice-common \
        ghostscript \
        poppler-utils \
        libxcb-xfixes0 \
        curl \
        ca-certificates \
        tini \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Create non-root user
RUN groupadd -r appuser --gid 1001 && \
    useradd -r -m -g appuser --uid 1001 -s /bin/bash appuser && \
    mkdir -p /opt/papyr/temp && \
    chown -R appuser:appuser /opt/papyr

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder --chown=appuser:appuser /root/.local /home/appuser/.local

# Copy application code
COPY --chown=appuser:appuser . /app

USER appuser

EXPOSE 8000

# Healthcheck — used by Docker + compose
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -fsS http://localhost:8000/health || exit 1

# Use tini for proper signal handling (graceful shutdown)
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4", "--log-level", "info"]
```

**8.2 Update `backend/.dockerignore`:**

```
# Ignore everything by default
**

# Whitelist what we need
!main.py
!requirements.txt
!routers/
!services/
!utils/

# Re-exclude development files
**/__pycache__
**/*.pyc
**/*.pyo
**/*.pyd
**/.pytest_cache
**/tests/
**/test_*.py
**/*_test.py
**/.venv
**/venv
**/env
**/.env
**/.env.*
!**/.env.example
**/Dockerfile*
**/docker-compose*
**/*.md
**/.git
**/.github
```

**8.3 Test build di laptop:**

```bash
cd C:\Users\faizz\papyr\backend
docker build -f Dockerfile.production -t papyr-backend:test .
# Expected: build success, image size <800MB
docker images papyr-backend:test
```

**8.4 Install syft + trivy di laptop:**

```bash
# Windows (scoop)
scoop install syft
scoop install trivy
# Verify
syft version
trivy --version
```

**8.5 Generate SBOM (Software Bill of Materials):**

```bash
mkdir -p docs/security
syft packages docker:papyr-backend:test -o cyclonedx-json > docs/security/sbom-papyr-backend.json
syft packages docker:papyr-backend:test -o spdx-json > docs/security/sbom-papyr-backend.spdx.json
syft packages docker:papyr-backend:test -o table > docs/security/sbom-papyr-backend.txt

# View summary
head -50 docs/security/sbom-papyr-backend.txt
```

**8.6 Run trivy scan untuk CVE check:**

```bash
trivy image --severity HIGH,CRITICAL --exit-code 0 papyr-backend:test
```

Review output. Action:
- **CRITICAL**: harus fix sebelum push (update base image, dep, atau patch)
- **HIGH**: dokumentasikan kalau gak bisa fix immediately

```bash
# Save report
trivy image --severity HIGH,CRITICAL --format json -o docs/security/trivy-papyr-backend.json papyr-backend:test
trivy image --severity HIGH,CRITICAL --format table papyr-backend:test > docs/security/trivy-papyr-backend.txt
```

**8.7 Document SBOM regeneration cadence:**

Add to `docs/security/security-baseline.md` (di laptop, akan di-sync ke VPS via STEP-MIG-019):

```markdown
## SBOM + CVE Scan Cadence

- SBOM regeneration: setiap deploy (auto via GitHub Actions, STEP-MIG-012)
- Manual SBOM check: monthly (operator)
- CVE scan: setiap deploy (trivy in CI), monthly cron in production
```

### Verifikasi

```bash
# Image build success
docker images papyr-backend:test --format "{{.Size}}"
# Expected: <800MB (Python slim + deps)

# Image runs as non-root
docker run --rm papyr-backend:test whoami
# Expected: appuser

# SBOM generated
ls -la docs/security/sbom-papyr-backend.*
# Expected: .json + .spdx.json + .txt

# Trivy report exists
ls -la docs/security/trivy-papyr-backend.*
# Expected: .json + .txt

# Healthcheck command works (will fail because no app running, but command exists)
docker inspect papyr-backend:test --format '{{json .Config.Healthcheck}}'
# Expected: shows healthcheck config

# Test container can run uvicorn (briefly)
docker run --rm -d --name papyr-test -p 8888:8000 papyr-backend:test
sleep 5
curl -fsS http://localhost:8888/health || echo "ENV VARS MISSING (expected for test)"
docker stop papyr-test
# Expected: container starts, /health returns either 200 (if R2 mock) or fails on missing env (acceptable for test)
```

### Rollback

```bash
# Remove test image
docker rmi papyr-backend:test
# Remove SBOM/trivy reports
rm docs/security/sbom-* docs/security/trivy-*
# Remove Dockerfile.production
git checkout backend/Dockerfile.production
```

### Definition of Done

- [ ] `backend/Dockerfile.production` exists, multi-stage, hardened
- [ ] `backend/.dockerignore` updated dengan whitelist approach
- [ ] Image builds successfully di laptop (test image size <800MB)
- [ ] Container runs as `appuser` (UID 1001), bukan root
- [ ] Healthcheck configured di Dockerfile
- [ ] SBOM generated (CycloneDX JSON + SPDX + TXT) di `docs/security/`
- [ ] Trivy scan run, output saved, CRITICAL = 0
- [ ] SBOM regeneration cadence documented

### Catatan

- Image dengan LibreOffice + Tesseract = ~600-700MB. Acceptable untuk Papyr.
- `tini` sebagai PID 1 supaya graceful SIGTERM handling pas docker stop.
- Multi-stage build = builder layer (build-essential, etc) tidak shipped ke final image.
- `userns-remap` di daemon (STEP-MIG-006) akan remap UID 1001 ke UID > 100000 di host. Ownership di mounted volumes butuh adjustment di STEP-MIG-009.

---

## STEP-MIG-009: docker-compose + Container Hardening

### Konteks

docker-compose.yml define how the production container runs di VPS. Hardening: memory limit (4G dari 8GB total), CPU limit (3.5 dari 4 cores), read-only filesystem dengan tmpfs untuk writable areas, drop all capabilities then add minimum, no-new-privileges, named network, healthcheck, json-file logging dengan rotation. Image referenced by SHA256 digest (not `:latest`) untuk supply chain integrity.

### Prerequisites

- STEP-MIG-008 selesai (Dockerfile dibuild dan SBOM/trivy clean)

### Langkah

**9.1 Buat `deploy/docker-compose.yml` di repo (laptop):**

```bash
mkdir -p deploy
```

Buat `deploy/docker-compose.yml`:

```yaml
# Papyr production docker-compose
# Single backend service + Nginx reverse proxy
# Hardened: read-only fs, dropped caps, no-new-privileges, mem/cpu limits

name: papyr-prod

services:
  backend:
    # Pinned by SHA256 digest in production (set after first GHCR push, MIG-013)
    # Placeholder for first deploy:
    image: ghcr.io/fazulfi/papyr-backend:latest
    container_name: papyr-backend
    restart: unless-stopped

    # Resource limits (8GB RAM, 4 cores total → leave 4GB + 0.5 core for system + Nginx)
    deploy:
      resources:
        limits:
          cpus: '3.5'
          memory: 4G
        reservations:
          memory: 1G

    # Security hardening
    read_only: true
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - CHOWN          # for some apt packages cleanup at boot
      - DAC_OVERRIDE   # for tini + signal handling
      - SETGID
      - SETUID

    # Writable areas (tmpfs, ephemeral)
    tmpfs:
      - /tmp:exec,mode=1777,size=512M
      - /home/appuser/.cache:size=128M
    volumes:
      # Persistent temp dir for LibreOffice/OCRmyPDF subprocess (needs exec)
      - /opt/papyr/temp:/opt/papyr/temp:rw
      # Read-only env file
      - /opt/papyr/production/.env:/app/.env:ro

    environment:
      ENVIRONMENT: production
      TMPDIR: /opt/papyr/temp

    # Use the .env file mounted above
    env_file:
      - /opt/papyr/production/.env

    # Internal port — Nginx will proxy to this
    expose:
      - "8000"
    # Don't publish port to host — only Nginx talks to backend

    networks:
      - papyr-net

    healthcheck:
      test: ["CMD", "curl", "-fsS", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service=papyr-backend"

  nginx:
    image: nginx:1.27-alpine
    container_name: papyr-nginx
    restart: unless-stopped

    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M

    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - DAC_OVERRIDE
      - SETGID
      - SETUID
      - NET_BIND_SERVICE   # to bind 80/443

    ports:
      - "80:80"
      - "443:443"

    volumes:
      - /opt/papyr/nginx/conf.d:/etc/nginx/conf.d:ro
      - /opt/papyr/nginx/ssl:/etc/letsencrypt:ro
      - /opt/papyr/logs/nginx:/var/log/nginx

    depends_on:
      backend:
        condition: service_healthy

    networks:
      - papyr-net

    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 5s
      retries: 3

    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service=papyr-nginx"

networks:
  papyr-net:
    driver: bridge
    name: papyr-net
    ipam:
      config:
        - subnet: 172.30.30.0/24
```

**9.2 Buat `deploy/.env.production.example` (template, jangan isi real values):**

```bash
cat > deploy/.env.production.example <<'EOF'
# Papyr backend production environment
# This file is mounted read-only at /app/.env
# Real values stored at /opt/papyr/production/.env (chmod 600 deploy:deploy)
# DO NOT commit real values

# Cloudflare R2
R2_ACCOUNT_ID=<from-cloudflare>
R2_ACCESS_KEY_ID=<from-cloudflare>
R2_SECRET_ACCESS_KEY=<from-cloudflare>
R2_BUCKET_NAME=papyr-files

# CORS — allow frontend origin
ALLOWED_ORIGINS=https://mypapyr.com,https://www.mypapyr.com

# Rate limiting
RATE_LIMIT_PER_MINUTE=10
MAX_UPLOAD_SIZE_MB=20
FILE_RETENTION_MINUTES=60

# Environment
ENVIRONMENT=production
LOG_LEVEL=INFO
EOF
```

**9.3 Tambah `.gitignore` untuk deploy secrets:**

```bash
# Make sure these are gitignored
cat >> .gitignore <<'EOF'

# Deploy secrets
deploy/.env.production
deploy/.env.local
EOF
```

**9.4 Commit Dockerfile + compose ke repo:**

```bash
git add backend/Dockerfile.production backend/.dockerignore deploy/docker-compose.yml deploy/.env.production.example .gitignore docs/security/
git commit -m "build(backend): production Dockerfile + compose + SBOM baseline" -m "Multi-stage Dockerfile with hardened runtime (non-root, healthcheck, tini PID1). docker-compose with read-only fs, dropped capabilities, no-new-privileges, memory/CPU limits. Initial SBOM (CycloneDX + SPDX) and trivy CVE scan baseline. Image will be referenced by SHA256 digest in production once first GHCR push completes (STEP-MIG-013)."
```

**9.5 Sync ke VPS (manual SCP, akan dipakai untuk first deploy):**

```bash
# Dari laptop
scp -i $HOME\.ssh\papyr\operator -P 52022 -r deploy/ deploy@172.235.251.193:/opt/papyr/production-config/
```

**Di VPS:**

```bash
# Move files
sudo mv /opt/papyr/production-config/docker-compose.yml /opt/papyr/production/docker-compose.yml
sudo mv /opt/papyr/production-config/.env.production.example /opt/papyr/production/.env.production.example
sudo rm -rf /opt/papyr/production-config
sudo chown deploy:deploy /opt/papyr/production/*
ls -la /opt/papyr/production/
```

**9.6 Test compose syntax:**

```bash
cd /opt/papyr/production
docker compose config --quiet
echo "Compose syntax OK"
```

### Verifikasi

```bash
# Compose file exists at VPS
ls -la /opt/papyr/production/docker-compose.yml
# Expected: file exists

# Syntax valid
cd /opt/papyr/production && docker compose config --quiet
# Expected: silent (valid)

# Network not yet created (will be on first up)
docker network ls | grep papyr
# Expected: no output

# .env not yet copied (will do in STEP-MIG-013)
ls -la /opt/papyr/production/.env 2>&1 | head -1
# Expected: "No such file" — that's correct (env akan disetup di MIG-013)
```

### Rollback

```bash
# Remove compose at VPS
sudo rm /opt/papyr/production/docker-compose.yml /opt/papyr/production/.env.production.example
# Revert local commit
cd C:\Users\faizz\papyr
git revert HEAD
```

### Definition of Done

- [ ] `deploy/docker-compose.yml` di repo dengan hardened config
- [ ] `deploy/.env.production.example` template di repo
- [ ] `.gitignore` blocks `deploy/.env.production`
- [ ] Compose synced ke VPS at `/opt/papyr/production/docker-compose.yml`
- [ ] `docker compose config` validates without error
- [ ] Backend service: read-only, mem 4G, cpus 3.5, dropped caps minimal
- [ ] Nginx service: read-only conf, NET_BIND_SERVICE only added cap, ports 80/443
- [ ] Healthcheck configured untuk both services
- [ ] Logging: json-file dengan rotation 10m/3 files
- [ ] Network `papyr-net` defined dengan custom subnet

### Catatan

- `image: ghcr.io/fazulfi/papyr-backend:latest` = placeholder. Setelah MIG-013 first deploy, replace dengan `image: ghcr.io/fazulfi/papyr-backend@sha256:abc...` digest reference.
- `cap_add: NET_BIND_SERVICE` untuk Nginx supaya bisa bind port 80/443 sebagai non-root inside container.
- `tmpfs /tmp:exec` di backend = LibreOffice butuh exec di tmp, tapi ini ephemeral container tmpfs, bukan host /tmp (yang noexec).
- Healthcheck `start_period: 40s` = uvicorn + LibreOffice load butuh waktu sebelum healthy.

---

## STEP-MIG-010: Nginx Reverse Proxy + Security Headers

### Konteks

Nginx di-front-of backend container, terminate kalau-cliffhanger gak ada SSL (Cloudflare proxy → HTTP origin via Let's Encrypt cert later in MIG-011), apply security headers, rate limiting di edge layer (defense in depth dengan FastAPI), block bad bots, drop unknown hosts.

### Prerequisites

- STEP-MIG-009 selesai (compose synced)

### Langkah

**10.1 Buat `deploy/nginx/conf.d/production.conf` di repo:**

```bash
mkdir -p deploy/nginx/conf.d
```

Buat `deploy/nginx/conf.d/production.conf`:

```nginx
# Papyr API production server block
# Listens HTTP on 80 (HTTPS terminated at Cloudflare for now, Let's Encrypt origin cert in MIG-011)

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=papyr_api:10m rate=30r/m;
limit_req_zone $binary_remote_addr zone=papyr_burst:10m rate=2r/s;

# Map User-Agent untuk block bad bots
map $http_user_agent $bad_bot {
    default 0;
    "~*(nikto|sqlmap|fimap|nessus|whatweb|openvas|jaeles|gobuster|dirbuster|feroxbuster|wapiti|skipfish|w3af|paros|zaproxy|burp)" 1;
    "~*(masscan|zmap|nmap)" 1;
    "~*(zgrab|petalbot|semrushbot|mj12bot|ahrefsbot|dotbot|seznambot)" 1;
    "" 1;  # empty user agent = bot
}

# Block requests to known sensitive paths
map $request_uri $blocked_path {
    default 0;
    "~*\.(env|git|svn|htaccess|htpasswd|sql|bak|backup|swp|old|orig)" 1;
    "~*/wp-(admin|login|content|includes)" 1;
    "~*/(phpmyadmin|adminer|setup\.php|xmlrpc\.php)" 1;
    "~*\.\.\/" 1;  # path traversal
}

server {
    listen 80;
    server_name api.mypapyr.com;

    # Cloudflare Real IP (so logs/rate limits use real client IP)
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 131.0.72.0/22;
    real_ip_header CF-Connecting-IP;
    real_ip_recursive on;

    # Block bad bots and sensitive paths early
    if ($bad_bot) { return 403; }
    if ($blocked_path) { return 444; }

    # Disable server_tokens
    server_tokens off;

    # Body size — Papyr accepts files up to 20MB plus headroom
    client_max_body_size 25M;
    client_body_timeout 60s;
    client_header_timeout 30s;

    # Security headers (defense in depth, FastAPI also sets some)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # Health check endpoint (no rate limit, public)
    location = /health {
        proxy_pass http://backend:8000/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        access_log off;  # don't spam logs with healthcheck
    }

    # Status endpoint (also public)
    location = /test/connectivity {
        proxy_pass http://backend:8000/test/connectivity;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # API endpoints — rate limited
    location /api/ {
        limit_req zone=papyr_api burst=10 nodelay;
        limit_req zone=papyr_burst burst=5;

        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;

        # Long timeouts for async OCR/PDF-to-Word polling
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        proxy_connect_timeout 30s;

        # Streaming responses
        proxy_buffering off;
        proxy_request_buffering off;
    }

    # Status polling endpoint (used by frontend useAsyncTask hook)
    location /status/ {
        limit_req zone=papyr_burst burst=20 nodelay;
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 60s;
    }

    # Catch-all — return 444 (drop connection silently)
    location / {
        return 444;
    }
}
```

**10.2 Buat `deploy/nginx/conf.d/default.conf` (drop unknown hosts):**

```nginx
# Drop requests untuk hostnames yang gak match production server
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    return 444;
}
```

**10.3 Sync ke VPS:**

```bash
# Dari laptop
scp -i $HOME\.ssh\papyr\operator -P 52022 -r deploy/nginx/ deploy@172.235.251.193:/opt/papyr/staging-conf/
```

**Di VPS:**

```bash
sudo cp -r /opt/papyr/staging-conf/conf.d/* /opt/papyr/nginx/conf.d/
sudo rm -rf /opt/papyr/staging-conf
sudo chown -R deploy:deploy /opt/papyr/nginx/conf.d/
ls -la /opt/papyr/nginx/conf.d/
```

**10.4 Test config dengan ephemeral nginx container:**

```bash
docker run --rm -v /opt/papyr/nginx/conf.d:/etc/nginx/conf.d:ro nginx:1.27-alpine nginx -t
# Expected: "syntax is ok" and "test is successful"
```

**10.5 UFW — allow Cloudflare IPs only on port 80/443 (defense in depth):**

```bash
# Get Cloudflare IPs (akan kita refresh quarterly)
CF_IPS=$(curl -s https://www.cloudflare.com/ips-v4)
echo "$CF_IPS" | sudo tee /opt/papyr/security/cloudflare-ips-v4.txt

# Add UFW rules — DO NOT remove existing 80/443 allow yet (akan ada gap)
# This is OPTIONAL hardening. Cloudflare proxy already filters before reaching origin.
# Skip kalau gak nyaman — Cloudflare orange cloud sudah strong protection.

# Versi paranoid:
# echo "$CF_IPS" | while read ip; do
#   sudo ufw allow from $ip to any port 80 proto tcp comment 'Cloudflare HTTP'
#   sudo ufw allow from $ip to any port 443 proto tcp comment 'Cloudflare HTTPS'
# done
# # Hapus generic 80/443 allow setelah CF rules in place
# sudo ufw delete allow 80/tcp
# sudo ufw delete allow 443/tcp
```

Untuk Papyr, kita keep generic 80/443 allow + Cloudflare proxy. Cloudflare WAF (next step) akan handle layer 7 filtering.

### Verifikasi

```bash
# Nginx configs di tempat
ls /opt/papyr/nginx/conf.d/
# Expected: production.conf, default.conf

# Syntax test
docker run --rm -v /opt/papyr/nginx/conf.d:/etc/nginx/conf.d:ro nginx:1.27-alpine nginx -t 2>&1
# Expected: "syntax is ok" and "test is successful"

# Cloudflare IP list saved
ls -la /opt/papyr/security/cloudflare-ips-v4.txt
# Expected: file exists

# UFW masih correct
sudo ufw status verbose | head -10
# Expected: 80, 443, 52022, 22 allow; mining ports deny
```

### Rollback

```bash
# Remove nginx configs
sudo rm /opt/papyr/nginx/conf.d/*
# Revert local commit
cd C:\Users\faizz\papyr
git revert HEAD
```

### Definition of Done

- [ ] `deploy/nginx/conf.d/production.conf` exists di repo + di VPS
- [ ] `deploy/nginx/conf.d/default.conf` drops unknown hosts (444)
- [ ] Cloudflare Real IP whitelist applied (logs use real client IP)
- [ ] Bad bot blocking via User-Agent map
- [ ] Sensitive path blocking (`.env`, `.git`, etc)
- [ ] Rate limiting: `papyr_api` 30r/m, `papyr_burst` 2r/s + burst handling
- [ ] Security headers: HSTS, X-Frame-Options, CSP-related
- [ ] `client_max_body_size 25M`, `proxy_read_timeout 300s` for async polling
- [ ] Nginx config syntax valid (test passes)
- [ ] Cloudflare IPv4 list saved untuk reference

### Catatan

- Cloudflare IPs jarang berubah, refresh quarterly cukup. Auto-refresh via cron defer kalau ada bandwidth.
- Rate limit Nginx 30r/m = 0.5 r/s rata-rata, burst 10 = sekali burst 10 request OK. FastAPI sudah rate-limit 10/m juga, jadi bottom line tetap 10/m per IP.
- Status polling (`/status/`) burst 20 supaya useAsyncTask hook gak ke-throttle saat polling cepat.

---

## STEP-MIG-011: Cloudflare DNS + WAF + DNSSEC + Let's Encrypt

### Konteks

Wire `api.mypapyr.com` to VPS via Cloudflare DNS (proxied for DDoS + WAF), enable DNSSEC, configure WAF rules dan rate limiting at edge, then issue Let's Encrypt origin cert via DNS-01 challenge for full encryption all the way to VPS.

### Prerequisites

- STEP-MIG-010 selesai
- Akses Cloudflare dashboard untuk `mypapyr.com`
- Cloudflare API token dengan DNS edit permission (akan dibuat di step ini)

### Langkah

**11.1 Cloudflare DNS — A record:**

1. Login ke Cloudflare dashboard → `mypapyr.com` zone.
2. Tab "DNS" → Click "Add record":
   - Type: `A`
   - Name: `api`
   - IPv4: `172.235.251.193`
   - Proxy status: **Proxied** (orange cloud ON)
   - TTL: Auto
3. Save.

**11.2 Cloudflare DNSSEC:**

1. Tab "DNS" → scroll ke "DNSSEC" section.
2. Click "Enable DNSSEC".
3. Catat DS record yang ditampilkan (kalau Hostinger butuh konfigurasi parent zone).
4. Login ke Hostinger → DNS settings untuk `mypapyr.com` → enable DNSSEC dengan DS record dari Cloudflare.

**11.3 Cloudflare SSL/TLS:**

1. Tab "SSL/TLS" → Overview.
2. Set encryption mode: **Full (Strict)** (akan butuh valid origin cert dari Let's Encrypt).
3. Tab "Edge Certificates":
   - Always Use HTTPS: ON
   - Minimum TLS Version: 1.2
   - Opportunistic Encryption: ON
   - TLS 1.3: ON
   - Automatic HTTPS Rewrites: ON

**11.4 Cloudflare Security:**

1. Tab "Security" → Settings:
   - Security Level: High
   - Bot Fight Mode: ON
   - Browser Integrity Check: ON
   - Challenge Passage: 30 minutes

**11.5 Cloudflare WAF Custom Rules:**

Tab "Security" → "WAF" → "Custom rules". Add rules:

```
Rule 1: Block sensitive paths
  Field: URI Path
  Operator: matches regex
  Value: \.(env|git|svn|htaccess|htpasswd|sql|bak|backup|swp|old|orig)$|/(wp-admin|wp-login|phpmyadmin|adminer)
  Action: Block

Rule 2: Challenge empty or suspicious User-Agent
  Field: User-Agent
  Operator: matches regex
  Value: ^$|nikto|sqlmap|nessus|whatweb|gobuster|feroxbuster|wapiti
  Action: Managed Challenge

Rule 3: Block path traversal
  Field: URI Path
  Operator: contains
  Value: ../
  Action: Block
```

**11.6 Cloudflare Rate Limiting:**

Tab "Security" → "Rate limiting rules":

```
Rule: API rate limit
  Match: URI Path matches /api/
  Action: Block
  Threshold: 100 requests per 1 minute (per IP)
```

**11.7 Generate Cloudflare API token (untuk certbot DNS-01):**

1. Cloudflare → My Profile → API Tokens → Create Token.
2. Template: "Edit zone DNS".
3. Permissions: Zone:DNS:Edit.
4. Zone Resources: Include — Specific zone — `mypapyr.com`.
5. Click Create. **Copy token** ke `docs/vps-access.md` (gitignored).

**11.8 Install certbot di VPS:**

```bash
# Sebagai deploy + sudo di VPS
sudo apt install -y certbot python3-certbot-dns-cloudflare
```

**11.9 Configure certbot dengan Cloudflare credentials:**

```bash
sudo mkdir -p /etc/letsencrypt
sudo tee /etc/letsencrypt/cloudflare.ini > /dev/null <<'EOF'
# Cloudflare API token for certbot DNS-01
dns_cloudflare_api_token = <PASTE_CLOUDFLARE_API_TOKEN_HERE>
EOF
sudo chmod 600 /etc/letsencrypt/cloudflare.ini
```

**11.10 Issue Let's Encrypt cert untuk api.mypapyr.com:**

```bash
sudo certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini \
  --dns-cloudflare-propagation-seconds 30 \
  --email <YOUR_EMAIL> \
  --agree-tos \
  --no-eff-email \
  -d api.mypapyr.com

# Expected output:
# "Successfully received certificate"
# "Certificate saved at /etc/letsencrypt/live/api.mypapyr.com/fullchain.pem"
# "Key saved at /etc/letsencrypt/live/api.mypapyr.com/privkey.pem"
```

**11.11 Update Nginx config untuk pakai Let's Encrypt cert:**

```bash
# Backup current production.conf
sudo cp /opt/papyr/nginx/conf.d/production.conf /opt/papyr/nginx/conf.d/production.conf.bak.pre-ssl
```

Edit `/opt/papyr/nginx/conf.d/production.conf` untuk add HTTPS listener (di laptop, edit `deploy/nginx/conf.d/production.conf`, sync ulang ke VPS, atau edit langsung di VPS):

Replace `server { listen 80; server_name api.mypapyr.com;` block dengan:

```nginx
# HTTP — redirect to HTTPS
server {
    listen 80;
    server_name api.mypapyr.com;

    # ACME challenge for renewal
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect everything else to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS — main server block
server {
    listen 443 ssl http2;
    server_name api.mypapyr.com;

    ssl_certificate /etc/letsencrypt/live/api.mypapyr.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.mypapyr.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # ... (rest of original 80 server block content: cf-real-ip, bad_bot/blocked_path checks, locations, etc.)
}
```

**11.12 Setup certbot auto-renewal cron:**

```bash
sudo tee /etc/cron.d/certbot-renew > /dev/null <<'EOF'
0 3 * * * root certbot renew --quiet --post-hook "cd /opt/papyr/production && /usr/bin/docker compose restart nginx"
EOF
```

### Verifikasi

```bash
# DNS resolves
dig api.mypapyr.com +short
# Expected: Cloudflare IP (104.x or similar — proxied)

# DNSSEC works
dig api.mypapyr.com +dnssec | grep RRSIG
# Expected: RRSIG records present

# Cloudflare proxy active
curl -I https://api.mypapyr.com 2>&1 | grep -i "cf-ray"
# Expected: cf-ray header present

# Cert files exist
sudo ls -la /etc/letsencrypt/live/api.mypapyr.com/
# Expected: fullchain.pem, privkey.pem, chain.pem

# Cert expiry
sudo openssl x509 -in /etc/letsencrypt/live/api.mypapyr.com/fullchain.pem -noout -dates
# Expected: notAfter ~90 days from now

# Cron auto-renew set
cat /etc/cron.d/certbot-renew
# Expected: shows our cron line
```

### Rollback

```bash
# Disable Cloudflare proxy: di Cloudflare dashboard, click orange cloud → grey
# Revert SSL mode ke "Off" or "Flexible"
# Disable DNSSEC

# Remove cert
sudo certbot delete --cert-name api.mypapyr.com

# Revert Nginx config
sudo cp /opt/papyr/nginx/conf.d/production.conf.bak.pre-ssl /opt/papyr/nginx/conf.d/production.conf
```

### Definition of Done

- [ ] Cloudflare A record `api → 172.235.251.193` proxied (orange)
- [ ] DNSSEC enabled di Cloudflare + DS record di Hostinger
- [ ] SSL/TLS mode "Full (Strict)"
- [ ] Edge Certificates: HSTS, Always HTTPS, Min TLS 1.2, TLS 1.3 ON
- [ ] Bot Fight Mode ON, Security Level High
- [ ] WAF Custom Rules: 3+ rules block sensitive paths/UA/traversal
- [ ] Rate Limiting Rule active untuk `/api/`
- [ ] Cloudflare API token created untuk certbot
- [ ] certbot DNS-01 issued cert untuk api.mypapyr.com
- [ ] Nginx production.conf updated untuk SSL (port 443 + redirect 80→443)
- [ ] certbot auto-renew cron daily 03:00

### Catatan

- DNS-01 challenge butuh Cloudflare API token, bukan HTTP-01. Karena VPS belum running app, HTTP-01 akan gagal saat ini. Setelah app running (MIG-013), kita bisa switch ke HTTP-01 untuk renewal kalau preferable.
- Cloudflare Full (Strict) = end-to-end encrypted, even di origin leg. Butuh valid cert. Let's Encrypt valid 90 hari, auto-renew via cron.
- Cert renewal akan restart Nginx — ~5 detik downtime per 60-90 hari. Acceptable.
- DNSSEC propagation ke parent zone bisa ~24 jam. Verify pakai `dig +trace`.

---

## STEP-MIG-012: GitHub Actions Deploy + Supply Chain (trivy + SBOM)

### Konteks

Setup CI/CD pipeline yang build image, scan untuk CVE (trivy), generate SBOM (syft), push ke GHCR pinned by SHA256 digest, then SSH deploy ke VPS dengan auto-rollback kalau healthcheck gagal. Separate workflow dari `ci.yml` (yang stays untuk unit/lint gates).

### Prerequisites

- STEP-MIG-011 selesai
- GitHub repo `fazulfi/papyr` admin access
- Linode VPS reachable via SSH dari internet (port 52022)

### Langkah

**12.1 Generate dedicated SSH deploy key untuk GitHub Actions:**

```bash
# Di laptop (sudah di-generate di MIG-000 sebagai gha-deploy)
cat $HOME\.ssh\papyr\gha-deploy.pub
# Copy public key content
```

**12.2 Add public key ke deploy user authorized_keys di VPS:**

```bash
# Dari laptop, SSH ke VPS
ssh -i $HOME\.ssh\papyr\operator -p 52022 deploy@172.235.251.193

# Di VPS:
echo "<paste-gha-deploy-public-key>" | sudo tee -a /home/deploy/.ssh/authorized_keys

# Optional: restrict by source IP (GitHub Actions IPs change frequently — skip restriction)
```

**12.3 Generate GHCR PAT (Personal Access Token):**

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic).
2. Generate new token (classic):
   - Name: `papyr-ghcr-push`
   - Expiration: 90 days
   - Scopes: `write:packages`, `read:packages`, `delete:packages`
3. **Copy token**, save ke password manager.

**12.4 Add GitHub Secrets:**

GitHub → repo `fazulfi/papyr` → Settings → Secrets and variables → Actions → New repository secret. Add:

| Secret | Value |
|---|---|
| `GHCR_TOKEN` | PAT dari step 12.3 |
| `VPS_HOST` | `172.235.251.193` |
| `VPS_PORT` | `52022` |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | Content of `$HOME\.ssh\papyr\gha-deploy` (private key, **full content**) |

**12.5 Buat `.github/workflows/deploy-vps.yml`:**

```yaml
name: Deploy Backend to VPS

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - 'deploy/**'
      - '.github/workflows/deploy-vps.yml'
  workflow_dispatch:

concurrency:
  group: deploy-vps
  cancel-in-progress: false

jobs:
  build-and-deploy:
    name: Build, Scan, Push, Deploy
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GHCR_TOKEN }}

      - name: Build image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile.production
          load: true
          tags: papyr-backend:test
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: papyr-backend:test
          format: 'table'
          exit-code: '1'
          severity: 'CRITICAL,HIGH'
          ignore-unfixed: true

      - name: Generate SBOM (syft)
        uses: anchore/sbom-action@v0
        with:
          image: papyr-backend:test
          format: cyclonedx-json
          output-file: sbom-papyr-backend.cyclonedx.json

      - name: Upload SBOM artifact
        uses: actions/upload-artifact@v4
        with:
          name: sbom-${{ github.sha }}
          path: sbom-papyr-backend.cyclonedx.json
          retention-days: 90

      - name: Push to GHCR
        id: push
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile.production
          push: true
          tags: |
            ghcr.io/fazulfi/papyr-backend:latest
            ghcr.io/fazulfi/papyr-backend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Capture image digest
        id: digest
        run: |
          DIGEST=$(docker buildx imagetools inspect ghcr.io/fazulfi/papyr-backend:${{ github.sha }} --raw | sha256sum | awk '{print $1}')
          echo "Image digest: sha256:${DIGEST}"
          echo "digest=sha256:${DIGEST}" >> $GITHUB_OUTPUT

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.VPS_SSH_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -p ${{ secrets.VPS_PORT }} -H ${{ secrets.VPS_HOST }} >> ~/.ssh/known_hosts

      - name: Login VPS to GHCR
        run: |
          ssh -i ~/.ssh/deploy_key -p ${{ secrets.VPS_PORT }} ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} \
            "echo '${{ secrets.GHCR_TOKEN }}' | docker login ghcr.io -u ${{ github.actor }} --password-stdin"

      - name: Pull image on VPS
        run: |
          ssh -i ~/.ssh/deploy_key -p ${{ secrets.VPS_PORT }} ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} \
            "cd /opt/papyr/production && docker compose pull backend"

      - name: Capture pre-deploy image (for rollback)
        id: pre_deploy
        run: |
          PREVIOUS=$(ssh -i ~/.ssh/deploy_key -p ${{ secrets.VPS_PORT }} ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} \
            "docker inspect --format='{{.Image}}' papyr-backend 2>/dev/null || echo none")
          echo "previous=${PREVIOUS}" >> $GITHUB_OUTPUT

      - name: Deploy on VPS
        run: |
          ssh -i ~/.ssh/deploy_key -p ${{ secrets.VPS_PORT }} ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} \
            "cd /opt/papyr/production && docker compose up -d backend nginx"

      - name: Smoke test (health check)
        id: smoke
        run: |
          for i in {1..12}; do
            sleep 10
            STATUS=$(ssh -i ~/.ssh/deploy_key -p ${{ secrets.VPS_PORT }} ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} \
              "curl -fsS -o /dev/null -w '%{http_code}' http://localhost:80/health" || echo "000")
            echo "Attempt $i: HTTP $STATUS"
            if [ "$STATUS" = "200" ]; then
              echo "Health check passed"
              echo "healthy=true" >> $GITHUB_OUTPUT
              exit 0
            fi
          done
          echo "Health check FAILED after 2 minutes"
          echo "healthy=false" >> $GITHUB_OUTPUT
          exit 1

      - name: Rollback on failure
        if: failure() && steps.pre_deploy.outputs.previous != 'none' && steps.smoke.outputs.healthy != 'true'
        run: |
          echo "Rolling back to ${{ steps.pre_deploy.outputs.previous }}"
          ssh -i ~/.ssh/deploy_key -p ${{ secrets.VPS_PORT }} ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} \
            "docker tag ${{ steps.pre_deploy.outputs.previous }} ghcr.io/fazulfi/papyr-backend:latest && cd /opt/papyr/production && docker compose up -d backend"

      - name: Cleanup SSH key
        if: always()
        run: rm -f ~/.ssh/deploy_key

      - name: Summary
        if: success()
        run: |
          echo "### Deploy summary" >> $GITHUB_STEP_SUMMARY
          echo "- Commit: ${{ github.sha }}" >> $GITHUB_STEP_SUMMARY
          echo "- Image: ghcr.io/fazulfi/papyr-backend:${{ github.sha }}" >> $GITHUB_STEP_SUMMARY
          echo "- Digest: ${{ steps.digest.outputs.digest }}" >> $GITHUB_STEP_SUMMARY
          echo "- SBOM artifact uploaded (90-day retention)" >> $GITHUB_STEP_SUMMARY
          echo "- Health check passed" >> $GITHUB_STEP_SUMMARY
```

**12.6 Commit + push workflow:**

```bash
cd C:\Users\faizz\papyr
git add .github/workflows/deploy-vps.yml
git commit -m "ci(deploy): add VPS deploy workflow with trivy + SBOM + auto-rollback" -m "Workflow trigger: push main affecting backend/, deploy/, or workflow file. Steps: build → trivy CVE scan (fail HIGH/CRITICAL) → SBOM via syft → push to GHCR → SSH pull on VPS → docker compose up → smoke test 2min → rollback on failure. Image referenced by SHA256 digest in summary. SBOM artifact retained 90 days."
git push origin main
```

**12.7 First test via workflow_dispatch:**

GitHub → Actions tab → "Deploy Backend to VPS" → Run workflow → main branch → Run.

Expected: build OK, trivy OK, push OK. Deploy step akan **fail** karena `.env` belum di-setup di VPS (dilakukan di MIG-013). Workflow akan auto-rollback (no previous to rollback to → "none" handled).

### Verifikasi

```bash
# Workflow file in repo
ls -la .github/workflows/deploy-vps.yml
# Expected: file exists

# GitHub Secrets configured (manual check di GitHub UI)
# - GHCR_TOKEN, VPS_HOST, VPS_PORT, VPS_USER, VPS_SSH_KEY all present

# First workflow run shows GHCR push success
# (manual check di GitHub Actions UI)

# Image visible di GHCR
# https://github.com/fazulfi?tab=packages
# Expected: papyr-backend package exists
```

### Rollback

```bash
# Disable workflow
git rm .github/workflows/deploy-vps.yml
git commit -m "chore: temporarily disable VPS deploy workflow" && git push

# Or just disable from GitHub Actions UI
```

### Definition of Done

- [ ] gha-deploy SSH public key di VPS authorized_keys
- [ ] GHCR PAT generated dan saved
- [ ] 5 GitHub Secrets configured: GHCR_TOKEN, VPS_HOST, VPS_PORT, VPS_USER, VPS_SSH_KEY
- [ ] `.github/workflows/deploy-vps.yml` di repo
- [ ] First workflow_dispatch run: GHCR push OK
- [ ] SBOM artifact uploaded di Actions UI
- [ ] Trivy scan run, no HIGH/CRITICAL CVE blocking
- [ ] Image visible at GHCR `ghcr.io/fazulfi/papyr-backend`

### Catatan

- Trivy `ignore-unfixed: true` = skip CVE yang upstream belum punya fix. Realistis untuk Python slim images.
- SBOM 90-day retention = balance antara cost dan audit needs. Quarterly compliance audit cukup.
- Rollback "no previous" = first deploy normal failure. Setelah ada baseline image, rollback otomatis ke previous.
- Workflow durasi: ~5-8 menit (build cache hit), ~12-15 menit (cold).

---

## STEP-MIG-013: First Deploy + Smoke Verify

### Konteks

Pertama kali backend jalan di VPS dengan real env vars. Copy `.env` dari encrypted laptop file, login GHCR di VPS, pull image yang sudah di-push di MIG-012, run compose, verify health endpoint dan satu real endpoint berfungsi.

### Prerequisites

- STEP-MIG-012 selesai (image sudah di GHCR)
- File `~/.papyr/railway-env-snapshot.txt.gpg` masih ada di laptop
- Cert Let's Encrypt sudah issued (MIG-011)

### Langkah

**13.1 Decrypt railway env snapshot di laptop:**

```bash
# Di laptop
gpg --decrypt $HOME\.papyr\railway-env-snapshot.txt.gpg > $HOME\.papyr\railway-env-snapshot.txt
# Edit untuk menambahkan/memastikan ENVIRONMENT=production dan adjust ALLOWED_ORIGINS
notepad $HOME\.papyr\railway-env-snapshot.txt
```

Pastikan vars yang ada minimum:

```
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=papyr-files
ALLOWED_ORIGINS=https://mypapyr.com,https://www.mypapyr.com
RATE_LIMIT_PER_MINUTE=10
MAX_UPLOAD_SIZE_MB=20
FILE_RETENTION_MINUTES=60
ENVIRONMENT=production
LOG_LEVEL=INFO
```

**13.2 SCP `.env` ke VPS:**

```bash
scp -i $HOME\.ssh\papyr\operator -P 52022 $HOME\.papyr\railway-env-snapshot.txt deploy@172.235.251.193:/tmp/papyr-env-temp
```

**Di VPS:**

```bash
sudo mv /tmp/papyr-env-temp /opt/papyr/production/.env
sudo chown deploy:deploy /opt/papyr/production/.env
sudo chmod 600 /opt/papyr/production/.env
ls -la /opt/papyr/production/.env
# Expected: -rw------- 1 deploy deploy ... .env
```

**13.3 Hapus plaintext di laptop:**

```bash
# Di laptop
Remove-Item $HOME\.papyr\railway-env-snapshot.txt
```

**13.4 Login GHCR di VPS:**

```bash
# Di VPS, sebagai deploy
read -s GHCR_TOKEN  # paste token, tidak akan muncul di history
echo "$GHCR_TOKEN" | docker login ghcr.io -u fazulfi --password-stdin
unset GHCR_TOKEN
docker info | grep -i registry
# Expected: registry mirror or login config saved
```

**13.5 Pull image:**

```bash
cd /opt/papyr/production
docker compose pull backend
docker compose pull nginx
docker images | grep papyr
```

**13.6 Bring up containers:**

```bash
cd /opt/papyr/production
docker compose up -d
docker compose ps
# Expected: papyr-backend (healthy), papyr-nginx (healthy/up)
```

**13.7 Watch logs untuk errors:**

```bash
docker compose logs -f --tail 100
# Expected: uvicorn started on 0.0.0.0:8000, no errors
# Wait until "Application startup complete"
# Ctrl+C untuk stop tailing
```

**13.8 Local verification (di VPS):**

```bash
# Backend internal
curl -fsS http://localhost:80/health
# Expected: {"status":"ok"} or similar

# Backend langsung (port 8000 bukan exposed, jadi via container)
docker exec papyr-backend curl -fsS http://localhost:8000/health
```

**13.9 External verification (dari laptop):**

```bash
# DNS resolves
nslookup api.mypapyr.com

# HTTPS health
curl -fsS https://api.mypapyr.com/health
# Expected: 200 OK, {"status":"ok"}

# Cert valid
curl -fsS -I https://api.mypapyr.com/health
# Expected: HTTP/2 200, security headers present, cf-ray present
```

**13.10 Test real endpoint (compress kecil file):**

```bash
# Buat 100KB dummy PDF di laptop
# Test compress endpoint dengan PowerShell
$file = "tests/p2i_test_files/5_pages.pdf"
$response = Invoke-WebRequest -Uri "https://api.mypapyr.com/api/compress?quality=ebook" -Method POST -InFile $file -ContentType "multipart/form-data"
echo $response.StatusCode
# Expected: 200, body ada result PDF (compressed)
```

**13.11 Pin image by digest (replace `:latest` di compose):**

Setelah deploy berhasil, capture image digest dan pin di compose.yml supaya supply chain integrity:

```bash
# Di VPS
DIGEST=$(docker inspect ghcr.io/fazulfi/papyr-backend:latest --format='{{index .RepoDigests 0}}' | cut -d@ -f2)
echo "Pinning to digest: $DIGEST"

# Update compose
sudo sed -i "s|image: ghcr.io/fazulfi/papyr-backend:latest|image: ghcr.io/fazulfi/papyr-backend@${DIGEST}|" /opt/papyr/production/docker-compose.yml
grep "image:" /opt/papyr/production/docker-compose.yml
# Expected: image: ghcr.io/fazulfi/papyr-backend@sha256:abc...

# Validate compose
docker compose config --quiet
```

Note: di repo (laptop), kita keep `:latest` untuk reference. Di VPS specific runtime, pin digest.

**13.12 Update AIDE database setelah Docker images installed:**

```bash
sudo aide --update
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db
```

### Verifikasi

```bash
# Both containers healthy
docker compose ps --format "{{.Name}}: {{.State}} {{.Status}}"
# Expected: papyr-backend: running healthy, papyr-nginx: running healthy

# External health
curl -fsS https://api.mypapyr.com/health
# Expected: {"status":"ok"} or equivalent

# SSL cert valid (no warnings)
curl -fsS -I https://api.mypapyr.com/health 2>&1 | grep -E "HTTP|cf-ray|server"
# Expected: HTTP/2 200, cf-ray header

# .env permissions ketat
sudo ls -la /opt/papyr/production/.env
# Expected: -rw------- deploy:deploy

# Image pinned by digest
grep "image:" /opt/papyr/production/docker-compose.yml | grep backend
# Expected: image with @sha256:

# Test compress endpoint
# (manual smoke test sukses di step 13.10)
```

### Rollback

```bash
# Stop containers
cd /opt/papyr/production
docker compose down

# Logs ke debug
docker compose logs > /tmp/first-deploy-debug.log

# Roll back ke previous backend (kalau ada)
docker compose up -d nginx  # at minimum keep nginx for status

# Investigate via logs, fix env atau image, retry from 13.6
```

### Definition of Done

- [ ] `.env` di `/opt/papyr/production/.env` (chmod 600 deploy:deploy)
- [ ] Plaintext `.env` di laptop sudah dihapus
- [ ] GHCR login successful di VPS
- [ ] Both containers (backend + nginx) running + healthy
- [ ] `https://api.mypapyr.com/health` returns 200
- [ ] Cert valid via Cloudflare proxy
- [ ] Test endpoint (compress) returns valid response
- [ ] Image pinned by SHA256 digest di compose.yml VPS
- [ ] AIDE database refreshed setelah Docker images installed

### Catatan

- Saat compress endpoint dites, file dropped di R2 production bucket. Verify R2 lifecycle (60min auto-delete) tetap aktif.
- Kalau healthcheck fail, biasanya .env missing var atau salah credential. Cek `docker compose logs backend | grep -i error`.
- Image digest pinning = supply chain integrity. Setiap deploy via Actions akan replace digest, manual update ini hanya first deploy.

---

## STEP-MIG-014: Cutover Vercel `NEXT_PUBLIC_API_URL`

### Konteks

Switch frontend production traffic dari Railway ke VPS. Single env var change di Vercel + redeploy. Rollback = single env var revert (instant). Railway tetap running selama soak window kalau perlu rollback.

### Prerequisites

- STEP-MIG-013 selesai (api.mypapyr.com healthy)
- Akses Vercel dashboard untuk Papyr project

### Langkah

**14.1 Pre-cutover smoke check:**

```bash
# Dari laptop, verify both backends responsive
curl -fsS https://papyr-production.up.railway.app/health
# Expected: 200 OK (Railway masih jalan)

curl -fsS https://api.mypapyr.com/health
# Expected: 200 OK (VPS jalan)
```

Catat current `NEXT_PUBLIC_API_URL` di Vercel sebagai rollback target.

**14.2 Update Vercel env var:**

1. Login Vercel dashboard.
2. Pilih Papyr project.
3. Settings → Environment Variables.
4. Cari `NEXT_PUBLIC_API_URL`:
   - Production env, current value: `https://papyr-production.up.railway.app`
   - Click Edit → change value to: `https://api.mypapyr.com`
   - Save.

**14.3 Trigger Vercel redeploy:**

1. Tab "Deployments" → click "..." pada deployment terakhir → "Redeploy".
2. Atau push satu commit kecil ke main untuk auto-trigger.

```bash
# Option B: trigger via empty commit
cd C:\Users\faizz\papyr
git commit --allow-empty -m "chore: trigger Vercel redeploy after VPS cutover" && git push origin main
```

**14.4 Wait for Vercel deployment success:**

Refresh Deployments tab, wait sampai status "Ready" untuk deployment baru (~1-2 menit).

**14.5 Verify cutover di browser:**

1. Buka `https://mypapyr.com` di Chrome/Edge incognito.
2. Open DevTools → Network tab.
3. Try satu tool (misal compress) dengan file kecil.
4. Verify network requests:
   - POST harus ke `https://api.mypapyr.com/api/compress`
   - **BUKAN** `https://papyr-production.up.railway.app`
5. Status request 200, response valid.

**14.6 Smoke test 13 tools (1 file kecil per tool):**

Lakukan satu round end-to-end:

| Tool | URL | Test File |
|---|---|---|
| Compress | /compress | tests/p2i_test_files/5_pages.pdf |
| Merge | /merge | sample.pdf + single-page.pdf (client-side) |
| Split | /split | sample.pdf (client-side) |
| Rotate | /rotate | sample.pdf (client-side) |
| Image-to-PDF | /image-to-pdf | small JPG |
| PDF-to-Image | /pdf-to-image | sample.pdf |
| Protect | /protect | sample.pdf + test123 password |
| Unlock | /unlock | protected.pdf + password |
| Watermark | /watermark | sample.pdf |
| Sign | /sign | single-page.pdf (client-side) |
| PDF-to-Word | /pdf-to-word | tests/indonesia_test_files/tugas_kuliah.pdf |
| OCR | /ocr | tests/indonesia_test_files/scan_ktp_ijazah.pdf |
| PDF-to-Excel | /pdf-to-excel | tests/indonesia_test_files/invoice_toko.pdf |

**14.7 Watch backend logs untuk first real traffic:**

```bash
# Di VPS
cd /opt/papyr/production
docker compose logs -f backend
# Watch errors, slow requests, anomalies
```

### Verifikasi

```bash
# Browser network tab shows api.mypapyr.com calls
# (manual verify)

# Backend logs ada hits dari real users
docker compose logs backend --since 5m | head -20
# Expected: lines showing /api/* requests

# Smoke test 13 tools all pass
# (manual checklist 14.6)
```

### Rollback

```bash
# 1-step rollback: revert Vercel env var
# Vercel dashboard → Settings → Environment Variables
# Edit NEXT_PUBLIC_API_URL → https://papyr-production.up.railway.app
# Trigger redeploy

# Atau via Vercel CLI:
# vercel env rm NEXT_PUBLIC_API_URL production
# vercel env add NEXT_PUBLIC_API_URL production  # paste old URL

# Frontend kembali ke Railway dalam 1-2 menit
```

### Definition of Done

- [ ] Vercel `NEXT_PUBLIC_API_URL` updated ke `https://api.mypapyr.com`
- [ ] Vercel deployment success, status Ready
- [ ] Browser DevTools confirms calls go to api.mypapyr.com
- [ ] All 13 tools smoke tested end-to-end (1 file each)
- [ ] Backend logs show real traffic, no error storm
- [ ] Railway tetap running (untuk rollback safety net)

### Catatan

- Cutover = env var change. Bukan code change. Rollback = revert single var, instant.
- Vercel cache: kalau ada users yang masih buka tab lama, browser akan pakai cached JS yang masih point ke Railway. Setelah hard refresh, akan pakai env var baru.
- Watch traffic split antara Railway dan VPS selama 1-2 jam setelah cutover supaya tau kalau ada client yang stuck.

---

## STEP-MIG-015: Monitoring Stack (Netdata + BetterStack + Telegram)

### Konteks

Setelah production live, butuh real-time alert. Netdata = system + container metrics + alerting. BetterStack = uptime monitoring eksternal. Telegram bot = delivery channel untuk alerts. Khusus untuk threat model cryptojacking: alert CPU anomali + outbound traffic anomali.

### Prerequisites

- STEP-MIG-014 selesai (production live di api.mypapyr.com)
- Phone dengan Telegram app + akses chat dengan @BotFather

### Langkah

**15.1 Buat Telegram bot:**

1. Open Telegram → search `@BotFather`.
2. Send `/newbot`.
3. Bot name: `Papyr Ops Bot`.
4. Username: `PapyrOpsBot` (atau yang available).
5. Save bot token ke password manager dan `docs/vps-access.md`.

**15.2 Get chat_id untuk alerts:**

1. Send `/start` ke bot baru kamu.
2. Send any message ke bot.
3. Open di browser: `https://api.telegram.org/bot<TOKEN>/getUpdates`
4. Cari `"chat":{"id":<NUMBER>` — itu chat_id kamu.
5. Save chat_id.

**15.3 Test bot sendMessage:**

```bash
# Di VPS atau laptop
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/sendMessage" \
  -d "chat_id=<CHAT_ID>" \
  -d "text=Papyr Ops Bot test 🚀"
# Expected: Telegram receives the message
```

**15.4 Install Netdata di VPS:**

```bash
# Kickstart official installer (akan deteksi OS)
bash <(curl -Ss https://my-netdata.io/kickstart.sh) --dont-wait --stable-channel
```

Tunggu instalasi (~5 menit). Akan jalan as user `netdata` di port 19999 (localhost only by default).

**15.5 Register Netdata ke Netdata Cloud (free tier):**

1. Buka https://app.netdata.cloud, signup atau login.
2. Buat workspace "Papyr Production".
3. "Connect a Node" → ikuti instruksi yang muncul (claim token + paste command di VPS).

```bash
# Command yang muncul di Netdata Cloud, paste ke VPS:
sudo netdata-claim.sh -token=<CLAIM_TOKEN> -rooms=<ROOM_ID> -url=https://app.netdata.cloud
```

**15.6 Configure Netdata alerts → Telegram:**

```bash
sudo tee /etc/netdata/health_alarm_notify.conf > /dev/null <<'EOF'
SEND_TELEGRAM="YES"
TELEGRAM_BOT_TOKEN="<PASTE_BOT_TOKEN>"
DEFAULT_RECIPIENT_TELEGRAM="<PASTE_CHAT_ID>"

# Map severity → notification
role_recipients_telegram[sysadmin]="<PASTE_CHAT_ID>"
role_recipients_telegram[domainadmin]="<PASTE_CHAT_ID>"
role_recipients_telegram[dba]="<PASTE_CHAT_ID>"
role_recipients_telegram[webmaster]="<PASTE_CHAT_ID>"
EOF
sudo chmod 640 /etc/netdata/health_alarm_notify.conf
sudo chown root:netdata /etc/netdata/health_alarm_notify.conf
```

**15.7 Custom alert rules untuk Papyr (cryptojacking detection):**

```bash
sudo tee /etc/netdata/health.d/papyr_security.conf > /dev/null <<'EOF'
# Papyr-specific security alerts

# Alert if ANY non-Papyr process consumes >50% CPU sustained
template: papyr_unknown_high_cpu
on: apps.cpu
class: Workload
type: System
component: CPU
calc: $papyr_backend + $papyr_nginx
units: %
every: 60
warn: $this < 50 AND ($apps_cpu_total - $this) > 50
crit: $this < 30 AND ($apps_cpu_total - $this) > 70
delay: down 5m multiplier 1.5 max 30m
info: Non-Papyr process consuming high CPU — possible cryptojacking
to: sysadmin

# Alert if outbound network traffic exceeds 100Mbps sustained
template: papyr_high_outbound_traffic
on: net.bandwidth
class: Workload
type: System
component: Network
calc: $sent
units: Mbps
every: 60
warn: $this > 50
crit: $this > 100
delay: down 5m multiplier 1.5 max 30m
info: Outbound network anomaly — possible data exfil or cryptojacking
to: sysadmin

# Alert on disk usage >85%
template: papyr_disk_usage_high
on: disk_space.root
class: Workload
type: System
component: Disk
calc: $used_percent
units: %
every: 600
warn: $this > 75
crit: $this > 85
delay: down 1h multiplier 1.5 max 24h
info: Root filesystem nearing capacity
to: sysadmin
EOF

sudo systemctl reload netdata
```

**15.8 Test Netdata alert delivery:**

```bash
# Trigger fake alert via netdata
sudo /usr/libexec/netdata/plugins.d/alarm-notify.sh test
# Expected: Telegram receives test alert
```

**15.9 Setup BetterStack uptime monitoring:**

1. Signup di https://betterstack.com/uptime (free tier).
2. Add 3 monitors:

| Monitor | URL | Method | Interval |
|---|---|---|---|
| Frontend | `https://mypapyr.com` | HEAD | 3 min |
| Backend Health | `https://api.mypapyr.com/health` | GET, expect 200 + body contains "ok" | 3 min |
| R2 Connectivity | `https://api.mypapyr.com/test/connectivity` | GET, expect 200 | 5 min |

3. Settings → Integrations → Telegram → connect bot dan chat_id.
4. Enable Telegram channel di setiap monitor's "Notification settings".

**15.10 Test BetterStack alert:**

1. Manually trigger downtime: `docker compose stop nginx` di VPS untuk 30 detik.
2. Verify Telegram notification dari BetterStack.
3. `docker compose start nginx`, verify "Recovered" notification.

### Verifikasi

```bash
# Netdata service running
sudo systemctl is-active netdata
# Expected: active

# Netdata dashboard accessible (local)
curl -fsS http://localhost:19999/api/v1/info | head -5
# Expected: JSON response

# Netdata Cloud claim success
sudo cat /var/lib/netdata/cloud.d/cloud.conf | grep "claimed_id" | head -1
# Expected: shows claimed_id (proof Cloud connected)

# Telegram alerts wired
sudo grep "SEND_TELEGRAM" /etc/netdata/health_alarm_notify.conf
# Expected: SEND_TELEGRAM="YES"

# Custom alerts loaded
sudo curl -sS http://localhost:19999/api/v1/alarms | grep papyr | head -5
# Expected: papyr_unknown_high_cpu, papyr_high_outbound_traffic, papyr_disk_usage_high

# BetterStack monitors active (manual check di dashboard)
# - 3 monitors all "Up"
# - Telegram integration connected
```

### Rollback

```bash
# Stop Netdata
sudo systemctl disable --now netdata
sudo apt purge -y netdata netdata-plugin-*

# Disable BetterStack monitors via UI atau delete
```

### Definition of Done

- [ ] Telegram bot `@PapyrOpsBot` created, token saved
- [ ] Test message sent → Telegram receives
- [ ] Netdata installed di VPS
- [ ] Netdata claimed ke Netdata Cloud workspace
- [ ] Telegram alerts configured di Netdata
- [ ] 3 custom alerts: high non-Papyr CPU, high outbound, disk usage
- [ ] Netdata test alert delivered to Telegram
- [ ] BetterStack 3 monitors configured (frontend, backend health, R2 connectivity)
- [ ] BetterStack Telegram integration aktif
- [ ] BetterStack downtime test → Telegram notif received

### Catatan

- Netdata Cloud free tier = unlimited nodes (untuk personal/small project), 1 user.
- BetterStack free tier = 10 monitors, 3 menit interval. Cukup untuk Papyr.
- Custom alert thresholds bisa di-tune setelah baseline traffic patterns terlihat (1-2 minggu).
- Telegram bot token = sensitive. Rotate kalau pernah leaked (chat history, screenshot, dll).

---

## STEP-MIG-016: 24h Soak + Verify All 13 Tools

### Konteks

Production live tapi belum proven. 24-72 jam observation window dengan real traffic + manual smoke test untuk catch corner cases. Periksa metric trends, alert noise level, dan all 13 tools end-to-end dengan real-world files.

### Prerequisites

- STEP-MIG-015 selesai (monitoring aktif)

### Langkah

**16.1 Hari 0 (cutover day) — first-hour watch:**

```bash
# Di VPS, watch logs real-time
cd /opt/papyr/production
docker compose logs -f --since 5m
```

Watch for:
- Error spikes
- Slow request warnings
- 5xx responses
- Unexpected traffic patterns

**16.2 Watch dashboards:**

- Netdata Cloud: https://app.netdata.cloud → Papyr workspace → real-time metrics
- BetterStack: https://uptime.betterstack.com → Monitors → all 3 should be Up
- Vercel: https://vercel.com → Papyr project → real-time deployments + analytics

**16.3 Hari 0 — manual end-to-end smoke (full coverage):**

Lengkapi checklist 13 tools dengan real files. Kalau memungkinkan pakai files yang besar/edge case (bukan sample.pdf 5KB):

| Tool | URL | Suggested Test File |
|---|---|---|
| Compress | mypapyr.com/compress | 5MB textbook PDF |
| Merge | mypapyr.com/merge | 3 PDFs ukuran berbeda |
| Split | mypapyr.com/split | 50-page PDF |
| Rotate | mypapyr.com/rotate | scan dengan random orientation |
| Image-to-PDF | mypapyr.com/image-to-pdf | 5 JPEGs (mixed sizes) |
| PDF-to-Image | mypapyr.com/pdf-to-image | 10-page PDF, ZIP output |
| Protect | mypapyr.com/protect | 1MB PDF + password |
| Unlock | mypapyr.com/unlock | output dari Protect |
| Watermark | mypapyr.com/watermark | "CONFIDENTIAL" text watermark |
| Sign | mypapyr.com/sign | drawn signature |
| PDF-to-Word | mypapyr.com/pdf-to-word | scan/text PDF (timing test) |
| OCR | mypapyr.com/ocr | scan KTP atau ijazah |
| PDF-to-Excel | mypapyr.com/pdf-to-excel | invoice dengan tabel |

Untuk async (PDF-to-Word, OCR, PDF-to-Excel), watch polling timing — should complete dalam timeout (2-3 menit).

**16.4 Verify R2 lifecycle:**

```bash
# Di VPS, periksa R2 access
docker exec papyr-backend python -c "
from utils.r2 import s3_client, settings
import json

response = s3_client.list_objects_v2(Bucket=settings.r2_bucket_name, MaxKeys=10)
print(json.dumps(response.get('Contents', []), default=str, indent=2))
"
# Expected: list ada beberapa file recent uploads
```

Wait 1 jam, list lagi — file dari 1 jam lalu harus auto-deleted (sesuai R2 lifecycle 60 min).

**16.5 Hari 1 — periksa security tools:**

```bash
# AIDE daily report
sudo cat /var/log/aide.log | tail -20
# Expected: "AIDE found NO differences" or known/expected changes (Docker images, logs)

# CrowdSec decisions
sudo cscli decisions list
# Expected: bans dari brute-force scanners (proof CrowdSec working)
sudo cscli metrics
# Expected: scanned/parsed counts non-zero

# fail2ban (should be inactive — replaced by CrowdSec)
sudo systemctl status fail2ban 2>/dev/null | head -3 || echo "Not installed (correct)"

# rkhunter weekly scan output (kalau sudah ada minggu ini)
sudo cat /var/log/rootkit-scan.log | tail -10 || echo "Not yet run"
```

**16.6 Hari 1-2 — performance metrics:**

Di Netdata Cloud, periksa charts untuk:
- CPU: peak usage, average. Expected: average <30%, peak <70%
- RAM: peak usage. Expected: <60% of 8GB
- Disk: usage growth (mostly logs)
- Network: outbound bandwidth (no anomaly spikes)
- Containers: backend + nginx healthy throughout

**16.7 Hari 2 — alert noise audit:**

Review Telegram alerts received:
- Acceptable: occasional CrowdSec bans, alerts from real performance dips
- Tune kalau noise: e.g., custom alert thresholds di Netdata terlalu sensitif

**16.8 Hari 2-3 — go/no-go decision:**

Criteria untuk lanjut decommission:
- [ ] Zero unhandled errors di backend logs (5xx, exceptions)
- [ ] All 13 tools smoke tested + working
- [ ] R2 lifecycle (60min auto-delete) confirmed working
- [ ] No OOM events
- [ ] No anomalous CPU/network alerts
- [ ] AIDE clean (no unexpected file changes)
- [ ] CrowdSec banning attackers normally
- [ ] BetterStack 100% uptime over soak window

Kalau ada finding bermasalah → fix dulu, restart soak.

### Verifikasi

```bash
# Backend uptime >24h
docker inspect papyr-backend --format '{{.State.StartedAt}}'
# Expected: >24h ago

# Zero error logs in last 24h
docker compose logs backend --since 24h 2>&1 | grep -iE "error|exception|critical" | grep -v "RetryError"  | head -20
# Expected: very few or none

# AIDE clean
sudo cat /var/log/aide.log | tail -5
# Expected: "AIDE found NO differences" recent

# All 13 tools tested (manual checklist)

# Disk healthy
df -h /
# Expected: <85% used

# RAM peaks acceptable
free -h
# Expected: available memory >2GB
```

### Rollback

Kalau soak gagal (terlalu banyak issues):

```bash
# Rollback Vercel ke Railway URL (instant)
# Vercel dashboard → NEXT_PUBLIC_API_URL → revert
# Frontend kembali ke Railway

# Investigate root cause di VPS, fix, retest, repeat soak
```

### Definition of Done

- [ ] 24-72 jam soak dengan zero unrecoverable issues
- [ ] All 13 tools smoke tested end-to-end di production
- [ ] R2 lifecycle (60min auto-delete) verified
- [ ] AIDE daily reports clean (or expected diffs only)
- [ ] CrowdSec actively banning attackers (decisions list non-empty)
- [ ] No OOM events
- [ ] No anomalous Netdata alerts (after tuning false positives)
- [ ] BetterStack 99%+ uptime over soak
- [ ] Go/no-go decision: GO

### Catatan

- Real production traffic = best test. 24h gives chance untuk catch off-hours patterns.
- Kalau ada issue minor (e.g., timeout pada tool tertentu), patch dan deploy via GitHub Actions deploy workflow.
- BetterStack synthetic checks 3-min interval = reasonable trade antara cost dan responsiveness.

---

## STEP-MIG-017: Decommission Railway

### Konteks

VPS sudah proven stable >24h. Railway tidak lagi serving traffic (Vercel sudah cutover). Hapus Railway service untuk menghentikan billing dan reduce attack surface (less infra = less to defend).

### Prerequisites

- STEP-MIG-016 selesai dengan GO decision
- Akses Railway dashboard

### Langkah

**17.1 Final verify VPS healthy:**

```bash
curl -fsS https://api.mypapyr.com/health
# Expected: 200 OK

curl -fsS https://api.mypapyr.com/test/connectivity
# Expected: 200 OK with R2 connectivity
```

**17.2 Verify zero traffic ke Railway dalam 24+ jam terakhir:**

1. Login Railway dashboard.
2. Project Papyr → backend service → Metrics tab.
3. Verify request count = 0 (atau hanya healthchecks dari Railway internal) selama 24+ jam terakhir.

**17.3 Final backup of Railway state (just in case):**

1. Railway dashboard → Variables tab → screenshot atau export semua env vars (kita sudah punya dari MIG-000, ini sebagai double-check).
2. Project Settings → Service → screenshot deploy logs terakhir.

**17.4 Scale Railway service ke 0:**

1. Railway dashboard → backend service → Settings → Scale → set replicas to 0.
2. Service akan idle, tidak bayar compute lagi (mungkin masih ada storage cost minimal).

**17.5 Wait 24 jam:**

Verify sekali lagi tidak ada user yang complain frontend down. Kalau masih ada client lama dengan cached JS yang menunjuk ke Railway, mereka akan dapat error → hard refresh akan resolve.

**17.6 Delete Railway project:**

1. Railway dashboard → Project Settings → Danger Zone → "Delete Project".
2. Konfirmasi dengan ketik nama project.
3. Project + service + storage = gone.

**17.7 Cancel Railway billing kalau ada:**

1. Account Settings → Billing → cancel pembayaran subscription kalau ada.
2. Catat jumlah credit terakhir / refund kalau applicable.

**17.8 Update README.md untuk hapus migration callout:**

Edit `README.md`:

```markdown
# Hapus migration callout block (bagian "🚧 Migrasi backend sedang berlangsung")
# Update tabel Deployed URLs:
| ⚙️ Backend API | [api.mypapyr.com](https://api.mypapyr.com) | Linode (Jakarta) |
| 💓 Health Check | [/health](https://api.mypapyr.com/health) | Linode (Jakarta) |
```

**17.9 Update 9 docs lain — hapus migration callouts, ganti URL Railway → api.mypapyr.com:**

Files yang harus di-update (sesuai callout di STEP-F2-050 sebelumnya):
- `docs/01_Papyr_BRD_v1.0.md`
- `docs/02_Papyr_Project_Charter_v1.0.md`
- `docs/03_Papyr_SRS_v1.0.md`
- `docs/04_Papyr_TDD_v1.0.md`
- `docs/07_Papyr_Deployment_Runbook_v1.0.md`
- `docs/10_Papyr_Release_Notes_v1.0.md`
- `docs/11_Papyr_API_Spec_v1.0.md`
- `docs/21_Papyr_Incident_Response_v1.0.md`

Untuk masing-masing file:
1. Hapus migration callout block (yang dimulai dengan "🚧 Migrasi backend sedang berlangsung").
2. Replace `papyr-production.up.railway.app` → `api.mypapyr.com`.
3. Update platform "Railway" → "Linode (Jakarta)" di tabel-tabel dependency.

```bash
# Bulk grep dan manual edit
cd C:\Users\faizz\papyr
grep -rln "papyr-production.up.railway.app" docs/ README.md
# Edit each file dengan editor

# Verify zero references kecuali historical (CHANGELOG)
grep -r "papyr-production.up.railway.app" --exclude=CHANGELOG.md --exclude-dir=.git .
# Expected: zero matches setelah cleanup
```

**17.10 Update progress.md tracker:**

Edit `stepprompts/progress.md`:
- STEP-MIG-017 status → ✅ <date>

**17.11 Commit + push:**

```bash
git add README.md docs/
git commit -m "docs: complete VPS migration cutover, remove Railway references" -m "Migration to Linode VPS Jakarta is complete. Remove all migration-in-progress callouts. Replace papyr-production.up.railway.app with api.mypapyr.com across 9 docs. Mark Railway as decommissioned in deployment runbook. CHANGELOG.md historical entries kept as-is."
git push origin main
```

### Verifikasi

```bash
# Railway project deleted
# (manual verify di Railway dashboard — project not visible)

# Zero Railway URL references (excluding historical CHANGELOG)
grep -rL "papyr-production.up.railway.app" --include="*.md" --exclude=CHANGELOG.md --exclude-dir=.git .
# Expected: empty list

# README badge updated (sudah dilakukan di sebelumnya)
grep "api-online" README.md | head -1
# Expected: "https://api.mypapyr.com/health"
```

### Rollback

Tidak ada rollback praktis di step ini — kalau Railway sudah delete, tidak bisa restore. Kalau diperlukan emergency Railway redeploy, deploy fresh dari repo (image GHCR sama, env vars dari backup MIG-000).

### Definition of Done

- [ ] Railway project deleted dari dashboard
- [ ] Railway billing cancelled
- [ ] README.md migration callout hapus, badge + URL update ke api.mypapyr.com
- [ ] 8 docs lain: callouts hapus, URL replace, platform update
- [ ] CHANGELOG.md tetap historical (jangan diubah)
- [ ] Progress tracker updated
- [ ] Commit + push success

### Catatan

- Railway free trial $5 credit yang habis tidak ke-refund. Acceptable cost untuk infrastructure transition.
- Image GHCR bisa stay even setelah Railway delete — itu di GitHub container registry, terpisah dari Railway.

---

## STEP-MIG-018: IDCloudHost S3 Backup + DR Drill

### Konteks

Disaster recovery: kalau VPS hilang/compromised, kita harus bisa restore dalam <1 jam. Pakai restic (encrypted incremental backup, deduplicated) ke IDCloudHost S3 (Indonesia DC, separate provider untuk DR isolation). Daily backup + DR drill (test restore) untuk pastikan backup actually works.

### Prerequisites

- STEP-MIG-017 selesai
- Account IDCloudHost (atau equivalent local S3-compatible provider)

### Langkah

**18.1 Buat IDCloudHost S3 bucket + access key:**

1. Login ke IDCloudHost console.
2. Object Storage → New Bucket:
   - Name: `papyr-vps-backups`
   - Region: Jakarta
   - Access: Private
3. IAM → New User → permissions: read+write hanya bucket `papyr-vps-backups`.
4. Generate Access Key + Secret Key. Save ke password manager + `docs/vps-access.md`.

**18.2 Install restic di VPS:**

```bash
sudo apt install -y restic
restic version
# Expected: restic 0.16.x or higher
```

**18.3 Configure restic environment:**

```bash
sudo mkdir -p /opt/papyr/backups/.restic
sudo tee /opt/papyr/backups/.restic/restic.env > /dev/null <<'EOF'
# Restic environment
export RESTIC_REPOSITORY="s3:s3.idcloudhost.com/papyr-vps-backups"
export AWS_ACCESS_KEY_ID="<IDCH_ACCESS_KEY>"
export AWS_SECRET_ACCESS_KEY="<IDCH_SECRET_KEY>"
export RESTIC_PASSWORD_FILE="/opt/papyr/backups/.restic/password"
EOF
sudo chmod 600 /opt/papyr/backups/.restic/restic.env
sudo chown root:root /opt/papyr/backups/.restic/restic.env

# Generate strong restic password (encrypts the backup itself)
RESTIC_PW=$(openssl rand -base64 48 | tr -d '/+' | head -c 48)
echo "RESTIC PASSWORD (save to password manager NOW): $RESTIC_PW"
echo "$RESTIC_PW" | sudo tee /opt/papyr/backups/.restic/password > /dev/null
sudo chmod 600 /opt/papyr/backups/.restic/password
sudo chown root:root /opt/papyr/backups/.restic/password
```

⚠️ **Save the restic password ke password manager IMMEDIATELY.** Tanpa password, backup tidak bisa di-restore. Loss of password = loss of backup.

**18.4 Initialize restic repository:**

```bash
sudo bash -c 'source /opt/papyr/backups/.restic/restic.env && restic init'
# Expected: "created restic repository <id> at s3:s3.idcloudhost.com/papyr-vps-backups"
```

**18.5 Buat backup script:**

```bash
sudo tee /opt/papyr/backups/backup.sh > /dev/null <<'EOF'
#!/bin/bash
set -euo pipefail

source /opt/papyr/backups/.restic/restic.env

LOG=/opt/papyr/logs/backup.log
DATE=$(date +%Y-%m-%d_%H:%M)

{
  echo "=== Backup start $DATE ==="

  # Backup important files
  restic backup \
    --tag papyr-prod \
    --tag $(hostname) \
    /opt/papyr/production/.env \
    /opt/papyr/production/docker-compose.yml \
    /opt/papyr/nginx/conf.d/ \
    /opt/papyr/security/ \
    /etc/letsencrypt/live/ \
    /etc/letsencrypt/renewal/ \
    /etc/ssh/sshd_config \
    /home/deploy/.ssh/authorized_keys \
    /home/deploy/.google_authenticator \
    /var/log/audit/audit.log

  # Apply retention policy: keep 7 daily + 4 weekly + 6 monthly
  restic forget --prune \
    --keep-daily 7 \
    --keep-weekly 4 \
    --keep-monthly 6 \
    --tag papyr-prod

  # Verify integrity
  restic check --read-data-subset=1G

  echo "=== Backup end $(date +%H:%M) ==="
  echo ""
} >> $LOG 2>&1
EOF

sudo chmod 700 /opt/papyr/backups/backup.sh
sudo chown root:root /opt/papyr/backups/backup.sh
```

**18.6 Test backup manual:**

```bash
sudo /opt/papyr/backups/backup.sh
sudo tail -30 /opt/papyr/logs/backup.log
# Expected: success with "Files: ... new" and snapshot ID
```

**18.7 Cron daily backup at 02:00:**

```bash
sudo tee /etc/cron.d/papyr-backup > /dev/null <<'EOF'
# Daily Papyr backup at 02:00 Jakarta time
0 2 * * * root /opt/papyr/backups/backup.sh
EOF
sudo chmod 644 /etc/cron.d/papyr-backup
```

**18.8 DR drill — test restore:**

```bash
# Buat directory test restore
sudo mkdir -p /tmp/restore-test

# Source restic env
source /opt/papyr/backups/.restic/restic.env

# List snapshots
restic snapshots

# Get latest snapshot ID
SNAPSHOT_ID=$(restic snapshots --json | python3 -c 'import sys,json; print(json.load(sys.stdin)[-1]["id"])')

# Restore to test dir
restic restore $SNAPSHOT_ID --target /tmp/restore-test

# Verify integrity
ls -la /tmp/restore-test/opt/papyr/production/
# Expected: docker-compose.yml restored

# Compare with production
diff /tmp/restore-test/opt/papyr/production/docker-compose.yml /opt/papyr/production/docker-compose.yml
# Expected: identical (no diff)

# Cleanup test
sudo rm -rf /tmp/restore-test
```

**18.9 Document restore procedure di runbook:**

Akan dilakukan di STEP-MIG-019.

### Verifikasi

```bash
# Restic repo accessible
sudo bash -c 'source /opt/papyr/backups/.restic/restic.env && restic snapshots --no-lock' | head -10
# Expected: list snapshots dengan timestamps

# Backup script executable
sudo ls -la /opt/papyr/backups/backup.sh
# Expected: -rwx------ 1 root root

# Cron registered
sudo cat /etc/cron.d/papyr-backup
# Expected: shows our cron line

# Backup log shows recent run
sudo tail -5 /opt/papyr/logs/backup.log
# Expected: "=== Backup end ..." dengan recent timestamp

# Test restore success (manual confirm di DR drill 18.8)
```

### Rollback

```bash
# Stop daily cron
sudo rm /etc/cron.d/papyr-backup

# Optional: delete backup repository (DO NOT do unless intentional)
# source /opt/papyr/backups/.restic/restic.env
# restic forget --keep-tag none
```

### Definition of Done

- [ ] IDCloudHost bucket `papyr-vps-backups` created
- [ ] IAM access key + secret saved
- [ ] Restic installed di VPS
- [ ] Restic password generated dan saved (password manager)
- [ ] Restic repository initialized
- [ ] Backup script di `/opt/papyr/backups/backup.sh`
- [ ] First manual backup success, snapshot visible
- [ ] Daily cron at 02:00 active
- [ ] DR drill: restore to `/tmp/restore-test` success, files match production
- [ ] Retention policy: 7 daily + 4 weekly + 6 monthly

### Catatan

- Restic encrypts backup data at rest dengan password — even if IDCloudHost compromised, attacker tanpa password can't read.
- IDCloudHost storage cost: ~Rp 250/GB/month. Papyr backup ~50-200MB per snapshot, retention 6 months = ~5-15GB total = ~Rp 5-10K/month.
- Restic deduplication = backup baru cuma store delta dari previous, jauh lebih efficient daripada full backup.
- DR drill setiap 3 bulan untuk pastikan backup valid (jadwalkan reminder di calendar atau di runbook).

---

## STEP-MIG-019: Operations Runbook

### Konteks

Living document untuk on-call/operator. Cover semua skenario operasional umum: SSH access, deploy, rollback, log inspection, common errors + fixes, emergency procedures, security incident response. Operator-facing language dengan copy-paste ready commands.

### Prerequisites

- STEP-MIG-018 selesai

### Langkah

**19.1 Buat `docs/runbook-vps.md`:**

```bash
cd C:\Users\faizz\papyr
```

Buat `docs/runbook-vps.md` dengan content komprehensif. Skip menulis content full di sini — ini outline yang harus diisi:

```markdown
# Papyr VPS Operations Runbook

> Living document. Update setiap perubahan operational.

## 1. Quick Reference

- **Production frontend**: https://mypapyr.com
- **Production backend**: https://api.mypapyr.com
- **VPS IP**: 172.235.251.193
- **VPS provider**: Linode Jakarta
- **SSH**: `ssh -i ~/.ssh/papyr/operator -p 52022 deploy@172.235.251.193`
- **LISH (emergency)**: cloud.linode.com
- **Monitoring**: app.netdata.cloud (Papyr workspace), uptime.betterstack.com

## 2. SSH Access

### Normal access
[copy-paste command]

### TOTP recovery
[5 backup scratch codes location, recovery procedure]

### Emergency LISH
[step-by-step Linode console login]

## 3. Deploy Procedure

### Standard deploy (via GitHub Actions)
[push main → workflow auto-runs]

### Manual deploy (rare)
[ssh in, docker compose pull, up -d]

### Rollback
[two paths: revert image digest OR Vercel env var revert]

## 4. Log Inspection

### Backend logs
docker compose logs backend --since 1h

### Nginx logs
docker compose logs nginx --since 1h
tail -f /opt/papyr/logs/nginx/access.log
tail -f /opt/papyr/logs/nginx/error.log

### System logs
journalctl --since "1 hour ago"

### Audit logs
sudo cat /var/log/audit/audit.log | head -50
sudo aureport --summary

### CrowdSec activity
sudo cscli decisions list
sudo cscli alerts list

## 5. Common Errors + Fixes

### OOM (out of memory)
[swap usage, container limit, scale workers down, RAM upgrade trigger]

### GHCR auth failure
[docker login ghcr.io renewal, PAT expiry]

### Cloudflare 502
[backend down? Nginx down? Check Cloudflare → "Trace"]

### R2 access errors
[R2 keys rotated? CORS? Bucket name?]

### Certbot renewal failure
[manual renew, Cloudflare API token expiry]

### CrowdSec self-ban
[remove your IP from decisions if mistakenly banned]

## 6. VPS Reboot Procedure

[shutdown gracefully via Linode dashboard or `sudo reboot`]
[expected downtime ~30 detik]
[verify all services back via healthcheck]

## 7. Backup Restore Procedure

### From IDCloudHost backup
[full restic restore commands]
[partial restore single file]

### Disaster recovery (full VPS rebuild)
[step-by-step: provision new VPS → restore backup → re-deploy]
[expected RTO: 1-2 hours]

## 8. Security Incident Response

### Suspected compromise (high CPU, weird process)
[isolate VPS via UFW deny outgoing, snapshot, investigate, restore from clean backup]

### AIDE alert (file changed unexpectedly)
[review change, kalau legitimate, sudo aide --update]
[kalau suspicious, isolate + investigate]

### CrowdSec ban storm
[high false positives → tune thresholds, whitelist trusted IPs]

### Massive 5xx error rate
[backend down? trigger rollback]

## 9. Update Procedure

### Apt security patches
[automatic via unattended-upgrades, weekly review]

### Docker image
[via deploy workflow]

### SSL certs
[automatic via certbot cron, watch expiry]

### Dependencies
[trivy alerts new CVEs, schedule update PR]

## 10. Monitoring Access

### Netdata Cloud
[URL, login, dashboard navigation]

### BetterStack
[URL, login, monitor navigation]

### Telegram alerts
[bot @PapyrOpsBot, chat_id, recovery from notifs]

## 11. Compliance + Audit Cadence

- AIDE: daily (auto)
- chkrootkit + rkhunter: weekly (auto)
- Lynis: monthly (manual via runbook reminder)
- OpenSCAP: quarterly (manual)
- Backup DR drill: quarterly
- Secret rotation: quarterly (or on incident)
- 2FA recovery code refresh: annually

## 12. Provider Account Access

[passkey/2FA recovery procedure for Linode, Cloudflare, IDCloudHost, Vercel, GitHub, Hostinger]
```

Saya sengaja kasih outline aja karena content full = sangat panjang. Operator atau AI Agent akan fill in detail saat actual operations run.

**19.2 Commit runbook outline:**

```bash
git add docs/runbook-vps.md
git commit -m "docs: add VPS operations runbook outline"
git push origin main
```

**19.3 Iterate fill-in:**

Sebagai bagian dari ongoing operations, isi detail di setiap section saat encounter scenario. Update progress.md untuk mark STEP-MIG-019 sebagai completed setelah outline + sections kritis (1-4) terisi.

### Verifikasi

```bash
# Runbook exists
ls -la docs/runbook-vps.md
# Expected: file exists, size >5KB

# Sections present
grep -c "^## " docs/runbook-vps.md
# Expected: >=12 sections

# Pushed to repo
git log -1 --oneline docs/runbook-vps.md
# Expected: shows commit
```

### Rollback

Tidak applicable — docs only, additive.

### Definition of Done

- [ ] `docs/runbook-vps.md` exists di repo
- [ ] Outline 12 sections lengkap
- [ ] Quick reference (section 1) terisi dengan real values
- [ ] SSH access (section 2) terisi
- [ ] Deploy procedure (section 3) terisi
- [ ] Log inspection (section 4) terisi
- [ ] Common errors (section 5) — minimal 3 sub-sections terisi
- [ ] Emergency procedures (sections 7+8) terisi
- [ ] Committed + pushed

### Catatan

- Runbook = living doc. Update setiap kali encounter new error/scenario.
- Operator-facing language. Asumsikan pembaca paham basic Linux + Docker tapi belum paham infrastructure spesifik Papyr.
- Hindari menyalin secret/credential ke runbook — reference `docs/vps-access.md` (gitignored).

---

## STEP-MIG-020: Post-Migration Secret Rotation

### Konteks

Selama migrasi, beberapa secret pernah ada di laptop plaintext, di-paste ke chat AI, atau visible di screenshots. Best practice: rotate semua sensitive credentials setelah migrasi stable. Ini quarterly cadence baseline.

⚠️ **Mandatory rotation untuk Papyr (deferred dari MIG-000):**
R2 keys (`R2_ACCESS_KEY_ID` dan `R2_SECRET_ACCESS_KEY`) sudah pernah di-paste ke chat AI di MIG-000. Operator-accepted risk dengan deferral ke step ini. Rotation R2 di 20.2 **tidak boleh di-skip**, dan harus dijalankan paling lambat akhir minggu pertama setelah migrasi stable.

### Compensating Controls (selama deferral window MIG-000 → MIG-020)

Selama window di mana keys lama masih dipakai, operator wajib:

- Cek **Cloudflare R2 dashboard activity log** mingguan: anomalous request volume, unfamiliar source IPs, unusual object-key patterns. Investigate immediately kalau ada anomali.
- Apply **R2 bucket storage cap** (kalau Cloudflare expose option) untuk bound billing blast-radius kalau attacker upload junk.
- Monitor `papyr-files` bucket size growth via dashboard. Production normal: kosong setiap 60 menit (file retention).
- Cek apakah ada object dengan key yang tidak dibuat oleh backend (suspicious pattern).

### Prerequisites

- STEP-MIG-019 selesai
- Production stable >7 hari (proven, before risking secret rotation downtime)

### Langkah

**20.1 Inventory semua secrets:**

| Secret | Used by | Rotation impact |
|---|---|---|
| R2 access_key + secret | Backend (.env), Local backup | Backend env reload + redeploy |
| GHCR PAT | GitHub Actions, VPS docker login | Update GitHub Secret + VPS docker login |
| Cloudflare API token (certbot) | certbot DNS-01 | Update `/etc/letsencrypt/cloudflare.ini` |
| Telegram bot token | Netdata + BetterStack | Update both integrations |
| BetterStack API key | Optional, only if API used | Update saved key |
| Restic password | Backup encryption | **DO NOT rotate easily** — would invalidate existing backups. Skip unless compromise. |
| Linode account password | Dashboard login | Linode profile → Change Password |
| VPS root password | LISH emergency | `passwd root` di LISH |
| VPS deploy user password | sudo NOPASSWD set, password unused | Optional rotate |
| TOTP secret (deploy user) | SSH 2FA | Re-enroll google-authenticator |
| Provider 2FA recovery codes | Account recovery | Regenerate at each provider |

**20.2 Rotate R2 keys:**

1. Cloudflare → R2 → Manage R2 API Tokens → existing token → Roll/Regenerate.
2. Save new keys ke password manager.
3. Update VPS `.env`:
   ```bash
   ssh -i ~/.ssh/papyr/operator -p 52022 deploy@172.235.251.193
   sudo nano /opt/papyr/production/.env
   # Update R2_ACCESS_KEY_ID dan R2_SECRET_ACCESS_KEY
   sudo chmod 600 /opt/papyr/production/.env
   cd /opt/papyr/production && docker compose restart backend
   ```
4. Verify:
   ```bash
   curl -fsS https://api.mypapyr.com/test/connectivity
   # Expected: 200 OK with R2 connectivity
   ```

**20.3 Rotate GHCR PAT:**

1. GitHub → Settings → Developer settings → PAT → existing `papyr-ghcr-push` → Regenerate.
2. Save new token.
3. Update GitHub Secret `GHCR_TOKEN` di repo settings.
4. Update VPS:
   ```bash
   read -s NEW_PAT
   echo "$NEW_PAT" | docker login ghcr.io -u fazulfi --password-stdin
   unset NEW_PAT
   ```
5. Trigger workflow_dispatch deploy untuk verify works.

**20.4 Rotate Cloudflare API token (certbot):**

1. Cloudflare → My Profile → API Tokens → existing token → Roll.
2. Update VPS:
   ```bash
   sudo nano /etc/letsencrypt/cloudflare.ini
   # Update token
   sudo chmod 600 /etc/letsencrypt/cloudflare.ini
   ```
3. Test renewal:
   ```bash
   sudo certbot renew --dry-run
   # Expected: success
   ```

**20.5 Rotate Telegram bot token:**

1. Telegram → @BotFather → `/mybots` → select PapyrOpsBot → API Token → Revoke + Regenerate.
2. Save new token.
3. Update Netdata:
   ```bash
   sudo nano /etc/netdata/health_alarm_notify.conf
   # Update TELEGRAM_BOT_TOKEN
   sudo systemctl reload netdata
   ```
4. Update BetterStack integration: dashboard → Integrations → Telegram → update bot token.
5. Test alert delivery:
   ```bash
   sudo /usr/libexec/netdata/plugins.d/alarm-notify.sh test
   # Expected: Telegram receives test
   ```

**20.6 Rotate VPS root password:**

```bash
# Via LISH atau SSH (kalau masih bisa)
NEW_ROOT_PW=$(openssl rand -base64 32 | tr -d '/+' | head -c 32)
echo "NEW ROOT PW: $NEW_ROOT_PW"
echo "root:$NEW_ROOT_PW" | sudo chpasswd
```

Save ke password manager. Update `docs/vps-access.md`.

**20.7 Document rotation di security baseline:**

```bash
# Append rotation log
sudo tee -a /opt/papyr/security/security-baseline.md > /dev/null <<EOF

## Rotation Log

| Date | Item | Rotated by |
|---|---|---|
| $(date +%Y-%m-%d) | R2 keys, GHCR PAT, Cloudflare API token, Telegram bot, root password | Operator |
EOF
```

**20.8 Update password manager + docs/vps-access.md:**

Refresh all entries dengan new values + dates.

**20.9 Document quarterly rotation cadence:**

Add reminder ke runbook + calendar:
- Quarterly: rotate R2 keys, GHCR PAT, Cloudflare API token, Telegram bot
- Annually: rotate VPS root password, regenerate 2FA TOTP, regenerate 2FA recovery codes
- On incident: rotate immediately

### Verifikasi

```bash
# All services still working post-rotation

# Backend healthy with new R2 keys
curl -fsS https://api.mypapyr.com/test/connectivity

# Deploy workflow works with new GHCR PAT
# (manual: trigger workflow_dispatch, verify deploy success)

# Certbot renewal dry-run works
sudo certbot renew --dry-run

# Telegram alerts deliver
sudo /usr/libexec/netdata/plugins.d/alarm-notify.sh test

# SSH still works
ssh -i ~/.ssh/papyr/operator -p 52022 deploy@172.235.251.193 'echo OK'

# Rotation log appended
sudo tail -10 /opt/papyr/security/security-baseline.md
```

### Rollback

Per-secret rollback berbeda:

- R2: re-roll dengan keys baru di Cloudflare lagi (kembali ke pre-rotation = tidak ada keys lama, harus generate fresh).
- GHCR PAT: regenerate, update everywhere.
- Cloudflare token: regenerate, update certbot.

Tidak ada "undo rotation" — rotation always forward.

### Definition of Done

- [ ] R2 keys rotated, .env + docker compose restart success
- [ ] GHCR PAT rotated, GitHub Secret updated, VPS docker login refreshed, deploy workflow tested
- [ ] Cloudflare API token rotated, certbot dry-run success
- [ ] Telegram bot token rotated, Netdata + BetterStack updated, test alert success
- [ ] VPS root password rotated, saved ke password manager
- [ ] `docs/vps-access.md` updated dengan timestamps
- [ ] Rotation logged di `security-baseline.md`
- [ ] Quarterly rotation reminder added ke runbook + calendar

### Catatan

- Restic password TIDAK di-rotate biasa — itu encrypt existing backups, kalau di-change harus re-encrypt semua snapshots. Skip unless compromise.
- TOTP secret jangan di-rotate kecuali compromise (loss of phone, leak). Re-enroll = invalidate previous backups codes.
- Quarterly rotation = balance antara security hygiene dan operational overhead.

---

## STEP-MIG-021: Tag v2.0.0 + CHANGELOG + Closeout

### Konteks

Final step. Capture migration achievement, tag release, update CHANGELOG, mark all STEP-MIG-* sebagai ✅, dan resume Fase 2D di STEP-F2-051 (yang sebenarnya sudah dilakukan via STEP-MIG-015 monitoring).

### Prerequisites

- STEP-MIG-020 selesai
- Production stable >7 hari

### Langkah

**21.1 Update CHANGELOG.md:**

Add entry baru di top untuk versi v2.0.0:

```markdown
## [2.0.0] — 2026-05-XX — VPS Migration

### Infrastructure
- Migrated backend from Railway to Linode VPS (Jakarta, Indonesia DC)
- Backend now at `api.mypapyr.com` (Cloudflare proxied, Full Strict SSL with Let's Encrypt origin cert)
- Removed dual-stack staging concept (production-only deployment)
- Added paranoid-grade hardening: CrowdSec, AIDE, OpenSCAP CIS L1, restricted /tmp, egress filtering, honeypot
- Container hardening: read-only fs, dropped capabilities, no-new-privileges, image SHA256 digest pinning

### Security
- 22-step migration sequence with documented rollback for each step
- SSH 2FA via TOTP for deploy user
- Image vulnerability scanning (trivy) gating CI/CD
- SBOM generation per build (CycloneDX + SPDX)
- Daily encrypted backups to IDCloudHost S3 via restic, quarterly DR drill

### Monitoring
- Real-time metrics via Netdata Cloud
- Uptime monitoring via BetterStack
- Telegram bot for alert delivery
- Cryptojacking-specific alerts (high non-Papyr CPU, anomalous egress)

### Resources
- VPS: 8GB RAM, 4 cores, 50GB SSD, 4GB swap
- Cost: ~Rp 50-150K/month (VPS + IDCloudHost backup) vs Railway $5/month

### Documentation
- New: `docs/runbook-vps.md` — operations runbook
- New: `docs/35_Papyr_VPS_Migration_Plan_v1.0.md` — architecture reference
- Updated: 8 reference docs (BRD, Charter, SRS, TDD, Deployment Runbook, Release Notes, API Spec, Incident Response) — Railway URLs replaced with api.mypapyr.com
- New: `stepprompts/step-prompts-vps-migration.md` — 22-step execution sequence

### Migration Steps Completed
- STEP-MIG-000: Pre-flight audit + Railway extraction
- STEP-MIG-001: Emergency lockdown VPS
- STEP-MIG-002 → 007: VPS hardening (CrowdSec, AIDE, egress, OpenSCAP, Docker, SSH 2FA)
- STEP-MIG-008 → 011: Application + container + Nginx + SSL
- STEP-MIG-012 → 013: CI/CD + first deploy
- STEP-MIG-014 → 016: Cutover + monitoring + soak
- STEP-MIG-017: Decommission Railway
- STEP-MIG-018: IDCloudHost S3 backup + DR drill
- STEP-MIG-019: Operations runbook
- STEP-MIG-020: Post-migration secret rotation
```

**21.2 Tag annotated v2.0.0:**

```bash
cd C:\Users\faizz\papyr
git fetch --tags

# Annotated tag
git tag -a v2.0.0 -m "Release v2.0.0: VPS Migration

Migrated backend from Railway to Linode VPS Jakarta dengan paranoid-grade hardening.
Production-only deployment (no staging). 22-step migration sequence completed.

Key changes:
- Backend at api.mypapyr.com (Cloudflare Full Strict, Let's Encrypt)
- 8GB RAM / 4 core VPS, Indonesia DC, dedicated IPv4
- Hardening: CrowdSec, AIDE, OpenSCAP CIS L1, container hardening, image digest pinning
- Monitoring: Netdata Cloud + BetterStack + Telegram alerts
- Backup: daily encrypted to IDCloudHost S3 via restic
- CI/CD: GitHub Actions with trivy scan + SBOM generation

See docs/35_Papyr_VPS_Migration_Plan_v1.0.md and stepprompts/step-prompts-vps-migration.md."

git push origin v2.0.0
```

**21.3 Update progress.md sub-track ke 100% complete:**

Edit `stepprompts/progress.md`:
- Change `**Current Step:** STEP-MIG-001 ...` → `**Current Step:** STEP-F2-051 (Fase 2D resumed; VPS migration complete)`
- Mark all STEP-MIG-001 sampai STEP-MIG-021 sebagai `✅ <date>`
- Update Phase Summary 2D (STEP-F2-051 yang sudah dikerjakan via STEP-MIG-015 monitoring counts sebagai done)

**21.4 Resume Fase 2D di STEP-F2-051 (auto-completed via MIG-015):**

```markdown
| STEP-F2-051 | Setup uptime monitoring (BetterStack) + Telegram alerts | ✅ <date> (delivered as part of STEP-MIG-015) |
```

**21.5 Final commit:**

```bash
git add CHANGELOG.md stepprompts/progress.md
git commit -m "docs: tag v2.0.0 release for VPS migration completion" -m "Update CHANGELOG.md with v2.0.0 entry covering all 22 STEP-MIG steps. Mark VPS migration complete in progress tracker. Resume Fase 2D at STEP-F2-051 (which was already delivered via STEP-MIG-015 monitoring stack)."
git push origin main
```

**21.6 Verify deploy workflow still passing:**

GitHub → Actions → ensure latest deploy run is green.

**21.7 Take final Linode snapshot (post-migration baseline):**

Linode dashboard → take snapshot, label `post-migration-stable-v2.0.0-<date>`.

### Verifikasi

```bash
# Tag exists locally + remote
git tag -l v2.0.0
# Expected: v2.0.0

git ls-remote --tags origin v2.0.0
# Expected: shows ref to v2.0.0

# CHANGELOG updated
head -10 CHANGELOG.md
# Expected: shows v2.0.0 entry

# Progress tracker updated
grep "STEP-MIG" stepprompts/progress.md | head -25
# Expected: all 22 STEP-MIG marked ✅

# All 13 tools still working (final smoke test)
curl -fsS https://api.mypapyr.com/health
# Expected: 200 OK

# Linode snapshot taken (manual verify di dashboard)
```

### Rollback

Tidak ada rollback dari step ini (closeout). Kalau ada issue post-tag, ship hotfix sebagai v2.0.1.

### Definition of Done

- [ ] CHANGELOG.md updated dengan v2.0.0 entry
- [ ] Annotated tag `v2.0.0` pushed ke origin
- [ ] All STEP-MIG-001 sampai STEP-MIG-021 marked ✅ di progress.md
- [ ] STEP-F2-051 marked ✅ (delivered as part of STEP-MIG-015)
- [ ] Linode snapshot baseline post-migration taken
- [ ] Latest deploy workflow run green
- [ ] Production stable, all 13 tools accessible

### Catatan

- v2.0.0 = major version bump karena infrastructure shift, even though no breaking API changes.
- Setelah ini, lanjut Fase 2D yang tersisa: STEP-F2-052 (Sentry?), STEP-F2-053 (deploy verification?), STEP-F2-054 (final smoke test + tag v2.0.0 — bisa di-skip kalau sudah dilakukan di sini).

---

## Glossary + References

- **VDF**: Virtual DNS Forwarding (HostData.id port forwarding mechanism — gak relevan untuk Linode VPS dengan dedicated IP).
- **LISH**: Linode Shell — emergency console via Linode dashboard, fallback kalau SSH lockout.
- **Cloudflare Full (Strict)**: end-to-end encrypted, requires valid origin cert.
- **AIDE**: Advanced Intrusion Detection Environment — file integrity monitoring.
- **CrowdSec**: open-source intrusion prevention dengan community threat feeds.
- **SBOM**: Software Bill of Materials — dependency manifest untuk CVE response.
- **Restic**: encrypted incremental backup tool dengan deduplication.
- **GHCR**: GitHub Container Registry.
- **TOTP**: Time-based One-Time Password (Google Authenticator).

### Internal Cross-References

- Architecture reference: `docs/35_Papyr_VPS_Migration_Plan_v1.0.md`
- Progress tracker: `stepprompts/progress.md`
- Operations runbook: `docs/runbook-vps.md`
- Security baseline: `/opt/papyr/security/security-baseline.md` (di VPS)
- Access credentials: `docs/vps-access.md` (gitignored, di laptop)

### External References

- Linode docs: https://www.linode.com/docs/
- CrowdSec docs: https://docs.crowdsec.net/
- Restic docs: https://restic.readthedocs.io/
- Netdata docs: https://learn.netdata.cloud/
- Cloudflare API: https://developers.cloudflare.com/api/
- Let's Encrypt + DNS-01: https://eff-certbot.readthedocs.io/en/stable/using.html#dns-plugins






















