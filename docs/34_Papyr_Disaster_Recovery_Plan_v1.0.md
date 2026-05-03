**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Disaster Recovery Plan**

Version 1.0 | Juni 2026

**CONFIDENTIAL**

mypapyr.com

---

## Informasi Dokumen

| Field | Value |
|---|---|
| **Judul Dokumen** | Disaster Recovery Plan — Papyr |
| **ID Dokumen** | PPR-DRP-001 |
| **Versi** | 1.0 |
| **Status** | Approved |
| **Tanggal Dibuat** | 2026-06-03 |
| **Terakhir Diubah** | 2026-06-03 |
| **Penulis** | OpenCode AI Agent (Sisyphus) |
| **Ditinjau Oleh** | Muhammad Fa'iz Zulfikar |
| **Disetujui Oleh** | Muhammad Fa'iz Zulfikar |
| **Kerahasiaan** | Internal |

---

## Riwayat Versi

| Versi | Tanggal | Penulis | Deskripsi |
|---|---|---|---|
| 1.0 | 2026-06-03 | OpenCode AI Agent (Sisyphus) | Rilis awal — Disaster Recovery Plan lengkap mencakup inventaris layanan, skenario bencana, strategi backup, prosedur failover, dan runbook pemulihan per layanan |

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Inventaris Layanan Kritis](#2-inventaris-layanan-kritis)
3. [Skenario Bencana & Respons](#3-skenario-bencana--respons)
4. [Strategi Backup](#4-strategi-backup)
5. [Prosedur Failover](#5-prosedur-failover)
6. [Komunikasi Insiden](#6-komunikasi-insiden)
7. [Pengujian DR](#7-pengujian-dr)
8. [Matriks RTO/RPO](#8-matriks-rtorpo)
9. [Kontak Darurat](#9-kontak-darurat)
10. [Rencana Pemulihan Per-Layanan](#10-rencana-pemulihan-per-layanan)
11. [Risiko & Mitigasi](#11-risiko--mitigasi)
12. [Dokumen Terkait](#12-dokumen-terkait)

---

## 1. Executive Summary

### 1.1 Tujuan

Disaster Recovery Plan (DRP) ini mendefinisikan prosedur pemulihan layanan Papyr (mypapyr.com) ketika terjadi gangguan besar yang menyebabkan satu atau lebih komponen infrastruktur tidak tersedia. Dokumen ini dirancang untuk konteks proyek solo-founder yang dioperasikan 100% oleh AI (OpenClaw), sehingga prosedur pemulihan mengutamakan otomasi dan kesederhanaan.

### 1.2 Ruang Lingkup

DRP ini mencakup seluruh layanan yang mendukung operasional Papyr:

- **Frontend** (Vercel) — antarmuka pengguna
- **Backend API** (Railway) — pemrosesan PDF server-side
- **File Storage** (Cloudflare R2) — penyimpanan file sementara
- **DNS/Domain** (Hostinger) — resolusi domain mypapyr.com
- **Git Repository & CI/CD** (GitHub) — kode sumber dan deployment pipeline
- **VPS** (HostData.id) — OpenClaw dan PostgreSQL (Fase 2E)

### 1.3 Target RTO/RPO Global

| Metrik | Target | Keterangan |
|---|---|---|
| **RTO (Recovery Time Objective)** | < 2 jam | Waktu maksimal layanan boleh tidak tersedia |
| **RPO (Recovery Point Objective)** | < 1 jam | Data maksimal yang boleh hilang |
| **MTTR (Mean Time to Recover)** | < 30 menit | Rata-rata waktu pemulihan untuk insiden umum |

Catatan: Target di atas berlaku untuk layanan inti (frontend + backend). Layanan pendukung (analytics, VPS) memiliki toleransi lebih longgar.

### 1.4 Prinsip Desain

1. **Ephemeral by design** — File pengguna dihapus otomatis dalam 60 menit. Tidak ada data pengguna persisten yang perlu di-backup saat ini.
2. **Client-side first** — 3 dari 6 tool (Merge, Split, Rotate) berjalan sepenuhnya di browser. Backend down tidak menghentikan seluruh layanan.
3. **Otomasi pemulihan** — OpenClaw mendeteksi dan memperbaiki masalah secara otomatis sebelum eskalasi ke founder.
4. **Infrastruktur terdistribusi** — Setiap komponen menggunakan provider berbeda, mengurangi risiko single point of failure.

---

## 2. Inventaris Layanan Kritis

### 2.1 Layanan Aktif (Production)

| Service | Provider | Tier/Biaya | Criticality | Current State | Fungsi |
|---|---|---|---|---|---|
| Frontend | Vercel (Free) | Free | HIGH | Production | UI, SSR, static assets, client-side PDF tools |
| Backend API | Railway ($5/mo Starter) | $5/bulan | HIGH | Production | Compress, PDF-to-Image, Image-to-PDF fallback |
| File Storage | Cloudflare R2 (Free) | Free tier | HIGH | Production | Upload/download file sementara (60min TTL) |
| DNS/Domain | Hostinger (mypapyr.com) | ~$10/tahun | HIGH | Production | Resolusi domain, DNS management |
| Git Repository | GitHub | Free | MEDIUM | Production | Source code, version control |
| CI/CD | GitHub Actions | Free | MEDIUM | Production | Auto-deploy on push to main |
| Analytics | Vercel Analytics | Free | LOW | Production | Web analytics, Speed Insights |

### 2.2 Layanan Terencana (Future)

| Service | Provider | Tier/Biaya | Criticality | Planned State | Fungsi |
|---|---|---|---|---|---|
| OpenClaw VPS | HostData.id | VPS | MEDIUM | Planned (Fase 2E) | AI operations agent, monitoring, auto-fix |
| Database | PostgreSQL on HostData.id | Self-hosted | MEDIUM | Planned (MVP 0.3) | User data, analytics, tool usage history |

### 2.3 Dependency Map

```
User Request
    │
    ├── Client-side tools (Merge/Split/Rotate)
    │       └── Hanya butuh: Frontend (Vercel) + DNS (Hostinger)
    │
    └── Server-side tools (Compress/PDF-to-Image/Image-to-PDF >3MB)
            └── Butuh: Frontend + Backend (Railway) + R2 (Cloudflare) + DNS
```

Implikasi: Jika Railway atau R2 down, 3 tool client-side tetap berfungsi normal.

---

## 3. Skenario Bencana & Respons

### 3.1 Vercel Down (Frontend Tidak Tersedia)

| Aspek | Detail |
|---|---|
| **Skenario** | Platform Vercel mengalami outage global atau regional yang menyebabkan frontend tidak dapat diakses |
| **Impact** | Seluruh layanan Papyr tidak dapat diakses pengguna. Semua 6 tool tidak berfungsi. |
| **Detection** | Vercel status page, uptime monitor (OpenClaw), user report via Telegram |
| **Response** | 1. Cek status.vercel.com untuk konfirmasi outage. 2. Jika outage > 30 menit, deploy emergency ke Cloudflare Pages atau Netlify. 3. Update DNS CNAME ke deployment darurat. 4. Monitor hingga Vercel pulih, lalu kembalikan DNS. |
| **RTO** | < 1 jam (jika perlu failover manual), < 5 menit (jika Vercel auto-recover) |
| **RPO** | 0 (tidak ada data yang hilang, frontend stateless) |

### 3.2 Railway Down (Backend API Tidak Tersedia)

| Aspek | Detail |
|---|---|
| **Skenario** | Railway mengalami outage atau container crash berulang yang tidak bisa auto-restart |
| **Impact** | Tool server-side tidak berfungsi: Compress (Ghostscript), PDF-to-Image (PyMuPDF), Image-to-PDF untuk file >3MB. Tool client-side (Merge, Split, Rotate) tetap berfungsi normal. |
| **Detection** | Health check endpoint gagal (/health), OpenClaw monitoring, error rate meningkat di frontend |
| **Response** | 1. Cek status Railway dan container logs. 2. Jika container crash: restart via Railway dashboard atau CLI. 3. Jika platform outage > 30 menit: deploy backend ke Render atau Fly.io sebagai emergency. 4. Update NEXT_PUBLIC_API_URL di Vercel env vars. 5. Redeploy frontend dengan API URL baru. |
| **RTO** | < 15 menit (auto-restart), < 2 jam (failover ke provider lain) |
| **RPO** | 0 (file di R2 tetap tersedia, tidak ada state di backend) |

### 3.3 Cloudflare R2 Down (File Storage Tidak Tersedia)

| Aspek | Detail |
|---|---|
| **Skenario** | Cloudflare R2 mengalami outage sehingga upload dan download file gagal |
| **Impact** | Semua tool server-side gagal (tidak bisa upload/download hasil). Tool client-side tetap berfungsi karena tidak memerlukan R2. |
| **Detection** | Upload error di backend logs, Cloudflare status page, user error reports |
| **Response** | 1. Cek status Cloudflare. 2. Jika outage singkat (< 15 menit): tampilkan pesan maintenance di UI untuk tool server-side. 3. Jika outage panjang: disable endpoint server-side tools, tampilkan pesan "Sedang dalam perbaikan". 4. Tool client-side tetap aktif tanpa perubahan. |
| **RTO** | Bergantung Cloudflare (biasanya < 30 menit). Tidak ada failover realistis untuk R2 pada tier gratis. |
| **RPO** | 0 (file bersifat ephemeral, 60 menit TTL, kehilangan file temporary tidak berdampak) |

### 3.4 DNS/Hostinger Down (Domain Tidak Dapat Diakses)

| Aspek | Detail |
|---|---|
| **Skenario** | Hostinger DNS mengalami gangguan sehingga mypapyr.com tidak resolve |
| **Impact** | Pengguna tidak bisa mengakses mypapyr.com. Layanan sebenarnya tetap berjalan di Vercel/Railway. |
| **Detection** | DNS lookup gagal, pengguna melaporkan "site not found", monitoring tools |
| **Response** | 1. Verifikasi DNS resolution gagal (dig/nslookup). 2. Jika Hostinger DNS down: akses langsung via Vercel URL (frontend-ten-omega-35.vercel.app) sebagai workaround sementara. 3. Jika berkepanjangan: pertimbangkan migrasi DNS ke Cloudflare DNS (gratis). 4. Komunikasikan URL alternatif ke pengguna. |
| **RTO** | < 1 jam (workaround via direct URL), < 24 jam (migrasi DNS jika diperlukan) |
| **RPO** | 0 (tidak ada data yang hilang) |

### 3.5 GitHub Down (Repository & CI/CD Tidak Tersedia)

| Aspek | Detail |
|---|---|
| **Skenario** | GitHub mengalami outage sehingga push, pull, dan GitHub Actions tidak berfungsi |
| **Impact** | Tidak bisa deploy perubahan baru. Layanan yang sudah berjalan TIDAK terpengaruh (Vercel dan Railway sudah memiliki build terakhir). Development terhenti sementara. |
| **Detection** | githubstatus.com, git push gagal, Actions tidak trigger |
| **Response** | 1. Layanan production tetap berjalan tanpa intervensi. 2. Development bisa dilanjutkan secara lokal (git distributed). 3. Tunggu GitHub pulih untuk push dan deploy. 4. Jika butuh emergency deploy tanpa GitHub: deploy manual via Vercel CLI / Railway CLI dari local repo. |
| **RTO** | 0 untuk production (tidak terpengaruh). Development: bergantung GitHub recovery. |
| **RPO** | 0 (git distributed, semua developer memiliki full copy) |

### 3.6 HostData.id VPS Down (OpenClaw + Database)

| Aspek | Detail |
|---|---|
| **Skenario** | VPS di HostData.id mengalami downtime (hardware failure, network issue, maintenance) |
| **Impact** | OpenClaw berhenti beroperasi (monitoring, auto-fix, Telegram alerts). Database PostgreSQL tidak tersedia. Core Papyr (frontend + backend + R2) TIDAK terpengaruh. |
| **Detection** | OpenClaw heartbeat berhenti, Telegram alerts berhenti, manual check |
| **Response** | 1. Core Papyr tetap berjalan normal tanpa intervensi. 2. Hubungi support HostData.id untuk status VPS. 3. Jika downtime > 4 jam: pertimbangkan spin up VPS baru dan restore dari backup. 4. Restore PostgreSQL dari pg_dump terakhir. |
| **RTO** | 0 untuk core Papyr. < 4 jam untuk OpenClaw + DB. |
| **RPO** | < 24 jam (daily pg_dump backup) |

### 3.7 Data Breach / Security Incident

| Aspek | Detail |
|---|---|
| **Skenario** | Akses tidak sah ke environment variables, R2 bucket, atau server backend |
| **Impact** | Potensi akses ke file pengguna yang sedang diproses (window 60 menit), API keys terekspos, reputasi rusak |
| **Detection** | Unusual API patterns, unauthorized access logs, R2 access anomaly, credential leak notification dari GitHub |
| **Response** | 1. SEGERA rotate semua API keys dan secrets (R2, Railway, Vercel). 2. Revoke semua active sessions. 3. Audit access logs di setiap provider. 4. Jika R2 terkompromi: delete semua objects, bucket bersifat ephemeral jadi dampak minimal. 5. Update environment variables di semua platform. 6. Redeploy semua services. 7. Dokumentasikan insiden dan lakukan postmortem. |
| **RTO** | < 2 jam (credential rotation + redeploy) |
| **RPO** | N/A (file ephemeral, tidak ada data pengguna persisten saat ini) |

### 3.8 DDoS Attack

| Aspek | Detail |
|---|---|
| **Skenario** | Serangan DDoS terhadap frontend (Vercel) atau backend (Railway) |
| **Impact** | Layanan lambat atau tidak responsif. Rate limit terlampaui. Biaya Railway bisa meningkat. |
| **Detection** | Spike traffic abnormal, response time meningkat drastis, Railway billing alert |
| **Response** | 1. Vercel memiliki DDoS protection bawaan (Cloudflare edge). 2. Untuk backend: aktifkan rate limiting lebih ketat. 3. Jika serangan persisten: enable Cloudflare proxy (orange cloud) di DNS untuk backend. 4. Block IP ranges yang teridentifikasi. 5. Jika Railway billing melonjak: scale down atau pause service sementara. |
| **RTO** | < 30 menit (mitigation aktif) |
| **RPO** | 0 (tidak ada data loss dari DDoS) |

### 3.9 Accidental Deletion

| Aspek | Detail |
|---|---|
| **Skenario** | Penghapusan tidak sengaja terhadap: (a) source code, (b) R2 objects, (c) database records |
| **Impact** | (a) Kode hilang dari branch. (b) File pengguna yang sedang diproses hilang. (c) Data historis hilang. |
| **Detection** | (a) Git log menunjukkan force push atau branch deletion. (b) User melaporkan download gagal. (c) Query return empty. |
| **Response** | (a) Git reflog untuk recover commits. Jika branch dihapus di remote: restore dari local clone atau GitHub branch protection. (b) R2 objects bersifat ephemeral (60 menit). Kehilangan file temporary berdampak minimal, pengguna bisa re-upload. (c) Restore PostgreSQL dari pg_dump backup terakhir. |
| **RTO** | (a) < 15 menit. (b) 0 (pengguna re-upload). (c) < 1 jam (restore backup). |
| **RPO** | (a) 0 (git distributed). (b) 0 (ephemeral). (c) < 24 jam (daily backup). |

---

## 4. Strategi Backup

### 4.1 Source Code

| Aspek | Detail |
|---|---|
| **Metode** | Git distributed version control |
| **Lokasi** | GitHub (remote), local machines (clone), OpenClaw VPS (clone) |
| **Frekuensi** | Setiap commit (real-time) |
| **Retensi** | Unlimited (full git history) |
| **Recovery** | Clone dari remote atau local copy mana pun |

Git bersifat distributed. Setiap clone adalah full backup. Selama minimal satu copy ada (GitHub, local, VPS), kode aman.

### 4.2 R2 File Storage

| Aspek | Detail |
|---|---|
| **Metode** | Tidak di-backup |
| **Alasan** | File bersifat temporary by design (60 menit auto-delete) |
| **Lifecycle** | Upload > proses > download > auto-delete (cron 30 menit + R2 lifecycle 24 jam safety net) |
| **Recovery** | Pengguna re-upload file asli jika diperlukan |

Tidak ada kebutuhan backup untuk R2. File yang tersimpan adalah hasil proses sementara yang akan dihapus otomatis.

### 4.3 Database PostgreSQL (Future, MVP 0.3)

| Aspek | Detail |
|---|---|
| **Metode** | pg_dump automated daily |
| **Lokasi Backup** | Cloudflare R2 bucket terpisah (atau S3-compatible storage) |
| **Frekuensi** | Daily (02:00 WIB) |
| **Retensi** | 30 hari rolling |
| **Recovery** | pg_restore dari dump terakhir |
| **Verifikasi** | Weekly automated restore test ke staging database |

### 4.4 OpenClaw Data (Future, Fase 2E)

| Aspek | Detail |
|---|---|
| **Metode** | Sama dengan PostgreSQL (data OpenClaw disimpan di DB yang sama) |
| **Tambahan** | Config files dan scripts di-backup via git |
| **Recovery** | Restore DB + redeploy OpenClaw dari git |

### 4.5 Dokumentasi

| Aspek | Detail |
|---|---|
| **Metode** | Tersimpan di git repository (folder /docs) |
| **Backup** | Inherent dari git distributed |
| **Recovery** | Clone repository |

### 4.6 Environment Variables & Secrets

| Aspek | Detail |
|---|---|
| **Metode** | Didokumentasikan di Deployment Runbook (PPR-DR-001) |
| **Lokasi Aktif** | Dashboard masing-masing provider (Vercel, Railway, Cloudflare) |
| **Backup** | Encrypted copy di password manager founder |
| **Recovery** | Re-input dari dokumentasi atau password manager |

---

## 5. Prosedur Failover

### 5.1 Frontend Failover (Vercel > Cloudflare Pages / Netlify)

**Trigger:** Vercel outage > 30 menit tanpa ETA pemulihan.

**Langkah:**

1. Build frontend secara lokal: `cd frontend && npm run build`
2. Deploy ke Cloudflare Pages: `npx wrangler pages deploy .next --project-name papyr-emergency`
3. Atau deploy ke Netlify: `npx netlify deploy --prod --dir=.next`
4. Update DNS CNAME di Hostinger: arahkan mypapyr.com ke deployment baru
5. Verifikasi akses via mypapyr.com
6. Monitor Vercel status. Setelah pulih, kembalikan DNS ke Vercel.

**Catatan:** Vercel memiliki redundansi bawaan (multi-region edge). Outage total sangat jarang. Failover ini untuk skenario worst-case.

### 5.2 Backend Failover (Railway > Render / Fly.io)

**Trigger:** Railway outage > 30 menit atau container tidak bisa restart.

**Langkah:**

1. Deploy backend ke Render:
   - Push ke branch `emergency-render`
   - Render auto-deploy dari GitHub (jika sudah dikonfigurasi)
   - Atau manual: `render deploy` via CLI
2. Alternatif Fly.io:
   - `cd backend && fly deploy`
3. Update environment variable `NEXT_PUBLIC_API_URL` di Vercel dashboard
4. Trigger redeploy frontend di Vercel
5. Verifikasi health check endpoint di provider baru
6. Setelah Railway pulih: kembalikan API URL ke Railway, redeploy frontend

**Catatan:** Railway memiliki auto-restart bawaan. Kebanyakan downtime teratasi dalam < 5 menit tanpa intervensi.

### 5.3 R2 Failover

**Trigger:** Cloudflare R2 outage yang menyebabkan upload/download gagal.

**Langkah:**

1. Tidak ada failover realistis untuk object storage pada tier gratis
2. Disable server-side tool endpoints di backend (return maintenance response)
3. Update frontend untuk menampilkan pesan: "Tool Compress, PDF-to-Image, dan Image-to-PDF sedang dalam perbaikan. Tool Merge, Split, dan Rotate tetap tersedia."
4. Monitor Cloudflare status page
5. Setelah R2 pulih: re-enable endpoints, remove maintenance message

**Catatan:** Cloudflare memiliki SLA 99.9% untuk R2. Outage total sangat jarang terjadi.

### 5.4 VPS Failover (HostData.id)

**Trigger:** VPS down > 4 jam, support tidak responsif.

**Langkah:**

1. Core Papyr tidak terpengaruh (frontend, backend, R2 independen dari VPS)
2. Jika perlu OpenClaw segera: spin up VPS baru di HostData.id (atau provider lain sebagai last resort)
3. Clone repository, setup environment, restore PostgreSQL dari backup
4. Update DNS/config yang mengarah ke VPS lama
5. Verifikasi OpenClaw operational

**Catatan:** VPS down tidak mempengaruhi pengguna Papyr secara langsung. Dampak hanya pada operasional internal (monitoring, auto-fix).

---

## 6. Komunikasi Insiden

### 6.1 Komunikasi Internal

| Channel | Penggunaan | Trigger |
|---|---|---|
| Telegram (Auto) | Alert otomatis dari OpenClaw | Service down, error rate tinggi, anomaly |
| Telegram (Manual) | Eskalasi ke founder | OpenClaw gagal auto-fix dalam 15 menit |
| Git Issue | Dokumentasi insiden | Setiap insiden severity HIGH |

### 6.2 Komunikasi Eksternal

| Channel | Penggunaan | Implementasi |
|---|---|---|
| Status Page | Informasi real-time ke pengguna | BetterStack status page (rekomendasi) atau /status endpoint |
| Landing Page Banner | Notifikasi maintenance | Conditional banner di frontend |
| Social Media | Update untuk outage besar | Twitter/X jika diperlukan |

### 6.3 Alur Eskalasi

```
Deteksi Masalah
    │
    ▼
OpenClaw Auto-Detect (monitoring setiap 5 menit)
    │
    ├── Auto-fix berhasil → Log + lanjut monitoring
    │
    └── Auto-fix gagal (3x retry)
            │
            ▼
        Telegram Alert ke Founder
            │
            ├── Founder online → Manual intervention
            │
            └── Founder offline > 1 jam
                    │
                    ▼
                Activate maintenance mode (otomatis)
                Tampilkan pesan di frontend
```

### 6.4 Template Komunikasi

**Internal Alert (Telegram):**
```
[ALERT] Papyr Service Down
Service: {nama_service}
Status: {DOWN/DEGRADED}
Detected: {timestamp}
Auto-fix: {ATTEMPTING/FAILED}
Action needed: {YES/NO}
```

**External Status Update:**
```
[Papyr Status Update]
Beberapa layanan sedang mengalami gangguan.
Tool yang tersedia: Merge, Split, Rotate
Tool dalam perbaikan: Compress, PDF-to-Image, Image-to-PDF
Estimasi pemulihan: {waktu}
```

---

## 7. Pengujian DR

### 7.1 Jadwal Pengujian

| Frekuensi | Jenis Pengujian | Cakupan |
|---|---|---|
| **Quarterly** (3 bulan) | Backup Restore Test | Verifikasi pg_dump bisa di-restore dengan benar |
| **Semi-annual** (6 bulan) | Service Outage Simulation | Simulasi satu layanan down, verifikasi failover |
| **Annual** (12 bulan) | Full DR Drill | Simulasi bencana besar, eksekusi seluruh DRP |

### 7.2 Prosedur Pengujian Quarterly

1. Ambil pg_dump backup terbaru
2. Restore ke database staging/test
3. Verifikasi integritas data (row count, checksum)
4. Jalankan query validasi
5. Dokumentasikan hasil di postmortem template

### 7.3 Prosedur Pengujian Semi-annual

1. Pilih satu layanan untuk disimulasikan down (rotasi setiap test)
2. Disconnect/stop layanan tersebut di staging environment
3. Verifikasi detection berfungsi (OpenClaw alert terkirim)
4. Eksekusi prosedur failover sesuai DRP
5. Ukur waktu recovery aktual vs target RTO
6. Dokumentasikan gap dan improvement

### 7.4 Prosedur Full DR Drill (Annual)

1. Simulasikan skenario: "Railway + R2 down bersamaan"
2. Eksekusi seluruh alur: detection > alert > failover > communication > recovery
3. Ukur: RTO aktual, RPO aktual, communication time
4. Identifikasi bottleneck dan update DRP
5. Presentasikan hasil dan action items

### 7.5 Kriteria Keberhasilan

| Metrik | Target | Acceptable |
|---|---|---|
| RTO aktual vs target | Sesuai atau lebih cepat | Maksimal 1.5x target |
| Alert delivery time | < 2 menit | < 5 menit |
| Backup restore success | 100% | 100% (tidak ada toleransi) |
| Failover procedure accuracy | Semua langkah executable | Maksimal 1 langkah perlu update |

---

## 8. Matriks RTO/RPO

| Service | Criticality | RTO Target | RPO Target | Failover Strategy |
|---|---|---|---|---|
| Frontend (Vercel) | HIGH | < 1 jam | 0 | Deploy ke Cloudflare Pages / Netlify |
| Backend API (Railway) | HIGH | < 2 jam | 0 | Deploy ke Render / Fly.io |
| File Storage (Cloudflare R2) | HIGH | Bergantung Cloudflare | 0 | Disable server-side tools, maintenance mode |
| DNS/Domain (Hostinger) | HIGH | < 1 jam | 0 | Direct URL workaround, migrasi DNS |
| Git Repository (GitHub) | MEDIUM | 0 (production unaffected) | 0 | Local clone, manual deploy via CLI |
| CI/CD (GitHub Actions) | MEDIUM | 0 (production unaffected) | 0 | Manual deploy via Vercel/Railway CLI |
| Analytics (Vercel) | LOW | Tidak kritis | N/A | Tidak ada failover, tunggu pulih |
| OpenClaw VPS (HostData.id) | MEDIUM | < 4 jam | < 24 jam | Spin up VPS baru, restore dari backup |
| Database (HostData.id) | MEDIUM | < 4 jam | < 24 jam | pg_restore dari daily backup |

---

## 9. Kontak Darurat

### 9.1 Internal

| Peran | Nama | Kontak | Availability |
|---|---|---|---|
| Founder & Operator | Muhammad Fa'iz Zulfikar | Telegram (primary) | Best-effort, timezone WIB |
| AI Operations | OpenClaw | Automated (24/7) | Always-on (jika VPS aktif) |

### 9.2 Provider Support

| Provider | Support URL | Metode | SLA Response |
|---|---|---|---|
| Vercel | vercel.com/support | Web ticket, community | Hobby: community only |
| Railway | railway.app/support | Discord, web ticket | Starter: community |
| Cloudflare | cloudflare.com/support | Web ticket | Free: community forum |
| HostData.id | hostdata.id | Ticket, WhatsApp | Sesuai SLA VPS |
| Hostinger | hostinger.co.id | Live chat, ticket | 24/7 live chat |
| GitHub | support.github.com | Web ticket | Free: community |

### 9.3 Catatan Penting

Sebagai proyek solo-founder pada tier gratis/starter, akses ke dedicated support terbatas. Strategi utama:

1. Andalkan redundansi bawaan provider (Vercel edge, Railway auto-restart, Cloudflare global network)
2. Gunakan community forums dan status pages untuk informasi
3. Siapkan failover ke provider alternatif untuk skenario worst-case
4. OpenClaw sebagai "first responder" otomatis 24/7

---

## 10. Rencana Pemulihan Per-Layanan

### 10.1 Runbook: Frontend Recovery (Vercel)

**Prerequisite:** Node.js 20+, Vercel CLI, akses ke Hostinger DNS

```
STEP 1: Konfirmasi Outage
  - Cek status.vercel.com
  - Cek apakah deployment URL langsung bisa diakses
  - Jika hanya DNS issue, lihat Runbook 10.4

STEP 2: Assess Duration
  - Jika ETA < 30 menit: tunggu, aktifkan maintenance banner
  - Jika ETA > 30 menit atau unknown: lanjut ke STEP 3

STEP 3: Emergency Deploy
  - git pull origin main
  - cd frontend
  - npm install
  - npm run build
  - Pilih target:
    a) Cloudflare Pages: npx wrangler pages deploy out --project-name papyr-emergency
    b) Netlify: npx netlify deploy --prod --dir=out

STEP 4: DNS Cutover
  - Login Hostinger DNS management
  - Update CNAME record: mypapyr.com -> {emergency-deployment-url}
  - TTL: set ke 300 (5 menit) untuk fast propagation

STEP 5: Verifikasi
  - Tunggu DNS propagation (5-15 menit)
  - Test akses mypapyr.com
  - Test semua 6 tool
  - Konfirmasi API connectivity

STEP 6: Rollback (setelah Vercel pulih)
  - Kembalikan CNAME ke cname.vercel-dns.com
  - Hapus emergency deployment
  - Verifikasi mypapyr.com kembali ke Vercel
```

### 10.2 Runbook: Backend Recovery (Railway)

**Prerequisite:** Python 3.11+, Railway CLI atau akses ke provider alternatif

```
STEP 1: Konfirmasi Outage
  - Cek https://papyr-production.up.railway.app/health
  - Cek Railway status page
  - Cek container logs di Railway dashboard

STEP 2: Attempt Auto-Recovery
  - Railway dashboard > Restart deployment
  - Tunggu 2-3 menit
  - Cek /health lagi
  - Jika berhasil: selesai, monitor 15 menit

STEP 3: Jika Auto-Recovery Gagal
  - Cek logs untuk root cause (OOM, crash loop, config error)
  - Jika config error: fix dan redeploy
  - Jika platform issue: lanjut ke STEP 4

STEP 4: Emergency Deploy ke Alternatif
  - Opsi A (Render):
    - render.com > New Web Service > Connect GitHub repo
    - Set build command: pip install -r requirements.txt
    - Set start command: uvicorn main:app --host 0.0.0.0 --port $PORT
    - Set environment variables (copy dari Railway)
  - Opsi B (Fly.io):
    - cd backend
    - fly launch --no-deploy
    - Set secrets: fly secrets set R2_ACCOUNT_ID=xxx ...
    - fly deploy

STEP 5: Update Frontend Config
  - Vercel dashboard > Settings > Environment Variables
  - Update NEXT_PUBLIC_API_URL ke URL backend baru
  - Trigger redeploy frontend

STEP 6: Verifikasi
  - Test /health di backend baru
  - Test Compress tool end-to-end
  - Test PDF-to-Image tool
  - Test Image-to-PDF dengan file > 3MB
  - Monitor error rate 30 menit

STEP 7: Rollback (setelah Railway pulih)
  - Kembalikan NEXT_PUBLIC_API_URL ke Railway URL
  - Redeploy frontend
  - Shutdown emergency backend
```

### 10.3 Runbook: R2 Storage Recovery

**Prerequisite:** Akses Cloudflare dashboard

```
STEP 1: Konfirmasi Outage
  - Cek cloudflarestatus.com
  - Test upload/download via backend logs
  - Cek R2 dashboard accessibility

STEP 2: Enable Maintenance Mode
  - Karena tidak ada failover realistis untuk R2:
  - Update backend: return 503 dengan pesan maintenance untuk endpoints:
    POST /compress
    POST /pdf-to-image
    POST /image-to-pdf (server path)
  - Frontend menampilkan: "Tool ini sedang dalam perbaikan"

STEP 3: Komunikasi
  - Update status page
  - Pastikan tool client-side (Merge, Split, Rotate) tetap prominent di UI

STEP 4: Recovery (setelah R2 pulih)
  - Verifikasi upload/download berfungsi
  - Remove maintenance mode
  - Test semua server-side tools
  - Monitor 30 menit
```

### 10.4 Runbook: DNS Recovery (Hostinger)

**Prerequisite:** Akses Hostinger panel, atau Cloudflare account sebagai alternatif

```
STEP 1: Konfirmasi DNS Issue
  - nslookup mypapyr.com
  - dig mypapyr.com (dari multiple locations)
  - Jika resolve gagal: DNS issue confirmed

STEP 2: Workaround Segera
  - Komunikasikan URL langsung ke pengguna:
    Frontend: frontend-ten-omega-35.vercel.app
  - Update status page dengan URL alternatif

STEP 3: Jika Hostinger Down > 2 Jam
  - Pertimbangkan migrasi DNS ke Cloudflare:
    a) Buat Cloudflare account (jika belum)
    b) Add site mypapyr.com
    c) Update nameservers di domain registrar
    d) Recreate DNS records di Cloudflare
  - Catatan: Propagasi nameserver bisa 24-48 jam

STEP 4: Recovery
  - Setelah DNS pulih, verifikasi resolution
  - Jika sudah migrasi ke Cloudflare: pertahankan (lebih reliable)
  - Update dokumentasi
```

### 10.5 Runbook: Database Recovery (Future)

**Prerequisite:** Akses VPS HostData.id, pg_dump backup tersedia

```
STEP 1: Konfirmasi Database Down
  - SSH ke VPS: ssh user@vps-ip
  - systemctl status postgresql
  - Cek logs: journalctl -u postgresql

STEP 2: Attempt Restart
  - systemctl restart postgresql
  - Tunggu 30 detik
  - psql -U papyr -d papyr_db -c "SELECT 1"
  - Jika berhasil: selesai, monitor

STEP 3: Jika Restart Gagal (Data Corruption)
  - Stop PostgreSQL: systemctl stop postgresql
  - Backup corrupted data dir (just in case)
  - Restore dari backup:
    - Download pg_dump terbaru dari R2 backup bucket
    - dropdb papyr_db (jika masih ada)
    - createdb papyr_db
    - pg_restore -d papyr_db backup_latest.dump
  - Start PostgreSQL: systemctl start postgresql
  - Verifikasi data integrity

STEP 4: Jika VPS Tidak Accessible
  - Spin up VPS baru di HostData.id
  - Install PostgreSQL
  - Restore dari backup
  - Update connection strings di aplikasi
  - Redeploy services yang terhubung ke DB
```

---

## 11. Risiko & Mitigasi

### 11.1 Risiko Saat Ini

| # | Risiko | Likelihood | Impact | Mitigasi |
|---|---|---|---|---|
| R1 | Single person dependency (founder) | MEDIUM | HIGH | OpenClaw sebagai first responder otomatis. Dokumentasi lengkap memungkinkan handover. |
| R2 | Free tier limitations (Vercel, R2) | MEDIUM | MEDIUM | Monitor usage. Upgrade ke paid tier jika mendekati limit. |
| R3 | Railway $5 tier resource constraints | MEDIUM | MEDIUM | Monitor memory/CPU. Optimize backend. Upgrade jika traffic meningkat. |
| R4 | No dedicated support (free/starter tiers) | HIGH | LOW | Andalkan community + self-service. Siapkan failover ke provider lain. |
| R5 | DNS single point (Hostinger) | LOW | HIGH | Pertimbangkan migrasi ke Cloudflare DNS (gratis, lebih reliable). |
| R6 | No real-time monitoring (pre-OpenClaw) | HIGH | MEDIUM | Prioritaskan setup OpenClaw. Sementara: manual check + Vercel Analytics. |
| R7 | Credential exposure via git | LOW | HIGH | .env di .gitignore. GitHub secret scanning aktif. Rotate keys berkala. |

### 11.2 Risiko Future (Post MVP 0.3)

| # | Risiko | Likelihood | Impact | Mitigasi |
|---|---|---|---|---|
| R8 | Database data loss | LOW | HIGH | Daily pg_dump, 30-day retention, weekly restore test |
| R9 | VPS compromise | LOW | HIGH | Firewall rules, SSH key only, regular updates, fail2ban |
| R10 | Backup failure (silent) | MEDIUM | HIGH | Automated backup verification, alert jika backup gagal |
| R11 | Cost escalation (traffic growth) | MEDIUM | MEDIUM | Cost monitoring, auto-scaling limits, budget alerts |

### 11.3 Risk Acceptance

Risiko berikut diterima secara sadar mengingat konteks proyek (solo-founder, early-stage, budget minimal):

1. **Tidak ada multi-region redundancy** — Diterima. Traffic masih rendah, single region cukup.
2. **Tidak ada hot standby** — Diterima. Cold failover (deploy ke provider lain) cukup untuk skala saat ini.
3. **R2 tanpa backup** — Diterima. File bersifat ephemeral (60 menit). Tidak ada data persisten di R2.
4. **Community-only support** — Diterima. Failover strategy mengurangi dependency pada provider support.

---

## 12. Dokumen Terkait

| ID Dokumen | Judul | Relevansi |
|---|---|---|
| PPR-IR-001 | Incident Response Plan | Prosedur penanganan insiden, eskalasi, playbook |
| PPR-DR-001 | Deployment Runbook | Prosedur deployment, rollback, health check |
| PPR-SLA-001 | Service Level Agreement | Target ketersediaan, metrik layanan |
| PPR-SP-001 | Security Policy | Kontrol keamanan, manajemen kerentanan |
| PPR-MP-001 | Monitoring Playbook | Strategi pemantauan, alerting, dashboard |
| PPR-PM-001 | Postmortem Template | Template analisis pasca-insiden |
| PPR-OC-001 | OpenClaw Specification | Spesifikasi AI operations agent |

---

## Persetujuan Dokumen

| Peran | Nama | Tanggal | Tanda Tangan |
|---|---|---|---|
| Penulis | OpenCode AI Agent (Sisyphus) | 2026-06-03 | [Digital] |
| Reviewer | Muhammad Fa'iz Zulfikar | 2026-06-03 | [Digital] |
| Approver | Muhammad Fa'iz Zulfikar | 2026-06-03 | [Digital] |

---

*Dokumen ini bersifat living document dan akan diperbarui seiring perubahan infrastruktur Papyr. Review wajib dilakukan setiap kali ada perubahan signifikan pada arsitektur layanan.*

---

**Papyr** — Tool PDF gratis, cepat, dan aman untuk Indonesia.

mypapyr.com | PPR-DRP-001 v1.0
