# Papyr

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

# Architecture Decision Records (ADR)

Version 1.0 | Mei 2026

**CONFIDENTIAL**

mypapyr.com

---

## Informasi Dokumen

| Field | Value |
|---|---|
| **Judul Dokumen** | Architecture Decision Records — Papyr |
| **ID Dokumen** | PPR-ADR-001 |
| **Versi** | 1.0 |
| **Status** | Approved |
| **Tanggal Dibuat** | Mei 2026 |
| **Terakhir Diubah** | Mei 2026 |
| **Penulis** | Muhammad Fa'iz Zulfikar |
| **Referensi** | PPR-BRD-001, Papyr_TechArch_MVP_0.1 |
| **Kerahasiaan** | Confidential — Internal & Investor Use Only |

---

## Matriks Persetujuan

| Peran | Nama | Tanda Tangan | Tanggal |
|---|---|---|---|
| **Product Owner** | Muhammad Fa'iz Zulfikar | Approved | 2026-05-03 |
| **AI Agent** | OpenCode/Sisyphus | Approved | 2026-05-03 |

---

## Riwayat Versi

| Versi | Tanggal | Penulis | Deskripsi |
|---|---|---|---|
| 0.1 | 2026-04-25 | Muhammad Fa'iz Zulfikar | Draft awal — ADR-001 s/d ADR-007 dalam Technical Architecture Document |
| 1.0 | 2026-05-03 | Muhammad Fa'iz Zulfikar | Formalisasi lengkap — 15 ADR, format standar, alternatif dan konsekuensi |

---

## 1. Tujuan dan Ruang Lingkup

Dokumen ini mencatat seluruh keputusan arsitektur signifikan yang diambil selama pengembangan Papyr Fase 1 hingga v1.1. Setiap ADR menjelaskan konteks, keputusan, alternatif yang dipertimbangkan, dan konsekuensi dari keputusan tersebut.

ADR bersifat permanen — keputusan yang sudah tidak berlaku tetap dicatat dengan status **Superseded** atau **Deprecated** untuk traceability. Nomor ADR tidak pernah digunakan ulang.

Dokumen ini menjadi referensi otoritatif untuk semua keputusan teknis dan arsitektur Papyr.

---

## 2. Format ADR (Adaptasi Michael Nygard)

### 2.1 Field Wajib

Setiap ADR memiliki field berikut:

- **Judul** — Nama keputusan yang deskriptif
- **Status** — Proposed | Accepted | Deprecated | Superseded | Rejected
- **Tanggal** — Kapan keputusan diambil
- **Konteks** — Masalah dan constraint yang melatarbelakangi
- **Keputusan** — Apa yang diputuskan dan mengapa
- **Alternatif yang Dipertimbangkan** — Opsi lain yang dievaluasi
- **Konsekuensi** — Dampak positif, negatif, dan netral

### 2.2 Konvensi Penomoran

- Format: ADR-001, ADR-002, ADR-003, ...
- Nomor bersifat permanen dan tidak pernah digunakan ulang.
- ADR yang di-supersede atau deprecated tetap ada untuk audit trail.

### 2.3 Siklus Status

1. **Proposed** — Diusulkan, belum disetujui
2. **Accepted** — Disetujui dan berlaku
3. **Deprecated** — Masih berlaku tapi akan diganti
4. **Superseded** — Digantikan oleh ADR lain
5. **Rejected** — Ditolak, tidak diimplementasi

---

## 3. Katalog ADR

---

## ADR-001: Batas Upload 20MB

**Status:** Accepted

**Tanggal:** 2026-04-25

### Konteks

PRD awal menetapkan batas upload 10MB per file. Namun, analisis use case pengguna Indonesia menunjukkan bahwa banyak dokumen scan (KTP, ijazah, laporan kantor) berukuran 10-15MB. Batas 10MB akan memaksa pengguna melakukan kompresi terlebih dahulu sebelum menggunakan tool lain — pengalaman yang buruk.

Kompetitor seperti iLovePDF membatasi 5-10MB di free tier. Memberikan batas lebih tinggi menjadi competitive advantage.

### Keputusan

Maksimum upload size untuk free tier Fase 1 adalah **20MB per file**. Batas ini diterapkan di dua layer:
- Frontend: validasi client-side sebelum upload (`limits.maxUploadBytes = 20 * 1024 * 1024`)
- Backend: validasi server-side di FastAPI endpoint

### Alternatif yang Dipertimbangkan

| Alternatif | Penilaian | Alasan Tidak Dipilih |
|---|---|---|
| 10MB (sesuai PRD awal) | Terlalu ketat | Banyak dokumen Indonesia 10-15MB, UX buruk |
| 50MB | Terlalu besar | Biaya storage/transfer tinggi, Railway timeout risk |
| 15MB | Kompromi | Masih memotong sebagian use case, 20MB lebih bulat |

### Konsekuensi

**Positif:**
- Mengakomodasi 95%+ file PDF kerja/kuliah Indonesia tanpa penolakan
- Competitive advantage vs iLovePDF (5MB free) dan SmallPDF (limited)
- UX lebih baik — pengguna tidak perlu pre-compress

**Negatif:**
- Biaya storage dan transfer lebih tinggi jika traffic naik
- Processing time lebih lama untuk file besar (timeout risk di Railway)
- Perlu monitoring ketat terhadap cost per task

**Netral:**
- Jika cost mulai tidak aman, bisa diturunkan ke 10MB di Fase 2 tanpa breaking change

---

## ADR-002: Ghostscript untuk Kompresi PDF Kompetitif

**Status:** Accepted

**Tanggal:** 2026-04-25

### Konteks

Kompresi PDF adalah fitur paling kritis untuk pengguna Indonesia. Use case utama: compress scan dokumen 5-15MB agar bisa dikirim via WhatsApp (<16MB) atau upload ke LMS kampus (<2MB). Kualitas kompresi yang buruk langsung merusak trust produk.

Benchmark awal menunjukkan bahwa library Python murni (PyPDF2, pikepdf) menghasilkan kompresi yang jauh di bawah iLovePDF. Ghostscript — engine open-source yang digunakan industri printing — menghasilkan rasio kompresi yang kompetitif.

### Keputusan

Menggunakan **Ghostscript** sebagai engine kompresi PDF di server-side dengan 3 preset kualitas:
- **Low** (screen) — kompresi maksimal, kualitas cukup untuk layar
- **Medium** (ebook) — keseimbangan ukuran dan kualitas
- **High** (printer) — kualitas tinggi, kompresi moderat

Ghostscript diinstall sebagai system dependency di Docker container (`apt-get install ghostscript`).

### Alternatif yang Dipertimbangkan

| Alternatif | Penilaian | Alasan Tidak Dipilih |
|---|---|---|
| PyPDF2 / pikepdf (Python) | Kompresi lemah | Rasio kompresi 10-20% vs 50-80% Ghostscript |
| qpdf | Moderate | Lebih baik dari PyPDF2 tapi masih di bawah Ghostscript |
| MuPDF (mutool clean) | Moderate | Tidak se-fleksibel Ghostscript untuk preset kualitas |
| Client-side compression | Tidak feasible | Browser tidak punya engine kompresi PDF yang memadai |

### Konsekuensi

**Positif:**
- Rasio kompresi kompetitif dengan iLovePDF (benchmark: 50-80% reduction)
- 3 level kualitas memberikan kontrol ke pengguna
- Engine mature dan battle-tested (digunakan industri printing sejak 1988)

**Negatif:**
- Setiap compress request membutuhkan server (tidak bisa client-side)
- Ghostscript berat di CPU — resource paling mahal di Fase 1
- Menambah ukuran Docker image (~50MB untuk Ghostscript)
- Perlu rate limiting ketat untuk mencegah abuse

**Netral:**
- Ghostscript adalah GPL — tidak masalah karena digunakan sebagai tool, bukan embedded library

---

## ADR-003: PDF-to-Image — User Pilih Halaman

**Status:** Accepted

**Tanggal:** 2026-04-25

### Konteks

Fitur PDF-to-Image mengkonversi halaman PDF menjadi gambar PNG. PDF dokumen kerja/kuliah Indonesia sering memiliki 10-50 halaman. Mengekspor semua halaman sekaligus menghasilkan ZIP besar yang tidak praktis dan memakan waktu processing lama.

Analisis use case menunjukkan pengguna biasanya hanya butuh 1-3 halaman spesifik (misalnya: halaman KTP, halaman tanda tangan, cover dokumen).

### Keputusan

PDF-to-Image memberikan UI **page range selector** untuk user memilih halaman tertentu yang ingin diekspor, bukan mengkonversi semua halaman sekaligus. Format input: `1-3, 5, 7-10`.

Output:
- 1 halaman → PNG langsung (tanpa ZIP)
- 2+ halaman → ZIP berisi `page_1.png`, `page_2.png`, dst.

### Alternatif yang Dipertimbangkan

| Alternatif | Penilaian | Alasan Tidak Dipilih |
|---|---|---|
| Auto-convert semua halaman | Wasteful | ZIP besar, processing lama, user biasanya hanya butuh 1-3 halaman |
| Thumbnail preview + click select | UX lebih baik tapi kompleks | Butuh rendering preview di client, scope terlalu besar untuk MVP |
| Hanya halaman pertama | Terlalu terbatas | Tidak memenuhi use case "export halaman tanda tangan" |

### Konsekuensi

**Positif:**
- Processing lebih cepat (hanya render halaman yang dipilih)
- Download lebih kecil dan praktis
- Hemat resource server (CPU dan storage)
- User mendapat kontrol penuh

**Negatif:**
- UI page selector lebih kompleks untuk dibangun
- Perlu validasi input range yang robust (edge cases: "0", "999", "abc")
- User harus tahu nomor halaman yang diinginkan

**Netral:**
- Komponen `PageRangeInput` bisa di-reuse untuk fitur Split PDF

---

## ADR-004: Auto-Delete Double Safety

**Status:** Accepted

**Tanggal:** 2026-04-25

### Konteks

Papyr berjanji kepada pengguna bahwa file akan dihapus dalam 60 menit. Ini adalah bagian fundamental dari privacy promise produk. Kegagalan menghapus file bukan hanya masalah teknis — ini adalah pelanggaran trust yang bisa merusak reputasi produk.

Satu mekanisme penghapusan saja berisiko gagal diam-diam (silent failure). Cloudflare R2 lifecycle rule memiliki granularitas minimum 1 hari, bukan 1 jam.

### Keputusan

Menggunakan **dua mekanisme penghapusan** (double safety):

1. **R2 Lifecycle Rule** (primary) — Cloudflare R2 auto-delete object setelah 24 jam (minimum yang didukung R2)
2. **Cron Job Fallback** (secondary) — Background task di FastAPI yang berjalan setiap 30 menit, menghapus semua file yang lebih tua dari `FILE_RETENTION_MINUTES` (60 menit)

Cron job menggunakan `asyncio.create_task(_cleanup_loop())` di FastAPI lifespan, dengan structured logging untuk setiap cleanup run.

### Alternatif yang Dipertimbangkan

| Alternatif | Penilaian | Alasan Tidak Dipilih |
|---|---|---|
| R2 lifecycle saja | Tidak cukup granular | Minimum 1 hari, tidak memenuhi janji 60 menit |
| Cron job saja | Single point of failure | Jika backend crash, file tidak terhapus |
| External cron (cron-job.org) | Dependency tambahan | Menambah external dependency, kurang reliable |
| Delete immediately after download | Tidak praktis | User mungkin perlu download ulang dalam 60 menit |

### Konsekuensi

**Positif:**
- Privacy promise terpenuhi — file pasti terhapus dalam 60 menit (cron) atau 24 jam (lifecycle)
- Redundansi mencegah silent failure
- Structured logging memungkinkan monitoring cleanup health
- Storage cost terkontrol — tidak ada file orphan

**Negatif:**
- Cron job menambah kompleksitas backend
- Perlu state tracking (list objects + check timestamp)
- Sedikit overhead CPU setiap 30 menit untuk listing objects

**Netral:**
- R2 lifecycle rule sebagai safety net terakhir jika cron dan backend keduanya gagal

---

## ADR-005: Plausible Analytics

**Status:** Superseded oleh ADR-008

**Tanggal:** 2026-04-25

### Konteks

Papyr membutuhkan analytics untuk mengukur product-market fit: berapa task yang diproses, tool mana yang paling populer, dan dari device apa pengguna mengakses. Namun, sebagai produk privacy-first, menggunakan Google Analytics yang membutuhkan cookie banner dan melacak pengguna secara invasif bertentangan dengan positioning produk.

### Keputusan

~~Menggunakan **Plausible Analytics** untuk event tracking. Self-host di Railway atau pakai cloud plan ($9/bulan).~~

**SUPERSEDED:** Keputusan ini digantikan oleh ADR-008 (Migrasi ke Vercel Analytics) sebelum implementasi aktual.

### Alternatif yang Dipertimbangkan

| Alternatif | Penilaian | Alasan Tidak Dipilih (pada saat itu) |
|---|---|---|
| Google Analytics | Privacy concern | Butuh cookie banner, tracking invasif, bertentangan dengan brand |
| Umami | Viable | Mirip Plausible tapi ekosistem lebih kecil |
| Custom analytics | Over-engineering | Terlalu banyak effort untuk MVP |

### Konsekuensi

**Catatan:** ADR ini tidak pernah diimplementasi. Lihat ADR-008 untuk keputusan final.

---

## ADR-006: Indonesia-First Language

**Status:** Accepted

**Tanggal:** 2026-04-25

### Konteks

Papyr menargetkan pasar Indonesia sebagai wedge market. Kompetitor global (iLovePDF, SmallPDF, Adobe) semuanya menggunakan bahasa Inggris. Menyediakan antarmuka dalam Bahasa Indonesia dari hari pertama adalah differentiator kuat — terutama untuk pengguna non-teknis (mahasiswa, pekerja kantoran) yang kesulitan dengan istilah teknis bahasa Inggris.

Membangun bilingual dari awal mempersulit copywriting, menambah scope, dan memperlambat launch.

### Keputusan

Landing page dan semua tool page menggunakan **Bahasa Indonesia sebagai bahasa default**. Semua copy, error message, dan UI text ditulis dalam Bahasa Indonesia yang natural dan mudah dipahami.

English menyusul di Fase 2 atau Bulan 3-4 setelah validasi product-market fit.

Implementasi:
- Language switcher placeholder di Footer (Indonesia active, English disabled)
- Error messages dalam Bahasa Indonesia (contoh: "Terlalu banyak permintaan. Coba lagi dalam 1 menit.")
- SEO metadata dalam Bahasa Indonesia

### Alternatif yang Dipertimbangkan

| Alternatif | Penilaian | Alasan Tidak Dipilih |
|---|---|---|
| English-first | Kehilangan differentiator | Sama seperti kompetitor, tidak ada keunikan |
| Bilingual dari awal | Scope creep | Mempersulit copywriting, menambah 2x effort untuk setiap teks |
| Auto-detect browser language | Kompleks | Butuh i18n framework, over-engineering untuk MVP |

### Konsekuensi

**Positif:**
- Differentiator kuat vs semua kompetitor global
- Copy terasa lokal dan natural — membangun trust
- Fokus pada satu bahasa mempercepat development
- SEO keyword Indonesia belum saturated

**Negatif:**
- Kehilangan organic traffic English di bulan pertama
- Pengguna non-Indonesia tidak bisa menggunakan tool
- Perlu refactoring saat menambah English (i18n framework)

**Netral:**
- Acceptable trade-off karena acquisition awal fokus ke user Indonesia via WhatsApp workflow dan SEO lokal

---

## ADR-007: Auto-Retry 1x pada Kegagalan

**Status:** Accepted

**Tanggal:** 2026-04-25

### Konteks

Railway backend mengalami cold start ~30 detik saat tidak ada traffic. Koneksi mobile 4G di Indonesia juga sering mengalami network hiccup. Kedua situasi ini menyebabkan request pertama gagal — bukan karena file bermasalah, tapi karena infrastruktur belum siap.

Menampilkan error langsung pada kegagalan pertama memberikan pengalaman buruk, terutama jika retry manual akan berhasil.

### Keputusan

Jika task gagal, sistem **otomatis retry 1 kali** di background sebelum menampilkan error ke pengguna. Jika retry juga gagal, tampilkan pesan error yang jelas dengan opsi coba lagi manual.

Strategi retry:
- Network error / timeout → retry otomatis
- File validation error (corrupt, wrong type) → langsung tampilkan error (tidak di-retry)
- Rate limit (429) → langsung tampilkan error

### Alternatif yang Dipertimbangkan

| Alternatif | Penilaian | Alasan Tidak Dipilih |
|---|---|---|
| Tidak ada retry | UX buruk | Cold start Railway sering menyebabkan false failure |
| Retry 3x dengan exponential backoff | Terlalu lama | User menunggu terlalu lama jika memang gagal |
| Keep-alive ping setiap 14 menit | Biaya tambahan | Menghabiskan Railway credit, tidak menyelesaikan network hiccup |

### Konsekuensi

**Positif:**
- Menangani cold start dan network hiccup secara transparan
- User tidak perlu sadar ada retry — pengalaman seamless
- Meningkatkan task success rate secara signifikan

**Negatif:**
- Retry bisa memperlambat feedback jika gagal karena file corrupt
- Sedikit lebih kompleks di frontend (state management retry)

**Netral:**
- Diferensiasi error type (network vs file) mengurangi dampak negatif

---

## ADR-008: Migrasi dari Plausible ke Vercel Analytics

**Status:** Accepted (Supersedes ADR-005)

**Tanggal:** 2026-04-29

### Konteks

ADR-005 merencanakan penggunaan Plausible Analytics. Namun saat implementasi Milestone 8 (Analytics & Monitoring), ditemukan bahwa:

1. Plausible self-host membutuhkan setup tambahan dan maintenance di Railway (menambah cost)
2. Plausible cloud plan $9/bulan — melebihi budget infrastruktur MVP ($5/bulan)
3. Vercel Analytics sudah terintegrasi langsung dengan Vercel deployment (zero setup)
4. Vercel Analytics gratis di Free tier, privacy-friendly, dan tidak membutuhkan cookie banner
5. Vercel Speed Insights memberikan bonus performance monitoring

### Keputusan

Menggunakan **Vercel Analytics + Speed Insights** sebagai pengganti Plausible Analytics.

Implementasi:
- Install `@vercel/analytics` + `@vercel/speed-insights` di layout.tsx
- Custom event tracking via thin wrapper `analytics.ts` dengan fungsi:
  - `trackTaskStarted(tool)` — fire saat user klik tombol proses
  - `trackTaskCompleted(tool)` — fire saat hasil siap
  - `trackTaskFailed(tool, error)` — fire saat error, dengan error type (truncated 200 char)
- Device category tracking (mobile/tablet/desktop) via `window.innerWidth`
- Enable di Vercel dashboard (manual activation)

### Alternatif yang Dipertimbangkan

| Alternatif | Penilaian | Alasan Tidak Dipilih |
|---|---|---|
| Plausible self-host | Maintenance overhead | Butuh setup, RAM, dan monitoring tambahan di Railway |
| Plausible cloud ($9/bln) | Over budget | Melebihi target $5/bulan untuk infrastruktur |
| Google Analytics | Privacy concern | Cookie banner, tracking invasif, bertentangan dengan brand |
| PostHog | Over-featured | Terlalu kompleks untuk kebutuhan MVP, free tier terbatas |
| Umami self-host | Viable tapi effort | Butuh database dan hosting terpisah |

### Konsekuensi

**Positif:**
- Zero cost (termasuk dalam Vercel Free tier)
- Zero setup — terintegrasi langsung dengan deployment
- Privacy-friendly — tidak membutuhkan cookie banner
- Speed Insights sebagai bonus (Core Web Vitals monitoring)
- Custom events mendukung tracking task lifecycle

**Negatif:**
- Vendor lock-in ke Vercel ecosystem
- Fitur analytics lebih terbatas dibanding Plausible (no funnel, no goals)
- Data tidak bisa di-export atau self-host

**Netral:**
- Jika butuh analytics lebih advanced di masa depan, bisa menambah Plausible/PostHog tanpa menghapus Vercel Analytics

---

## ADR-009: Hybrid Processing Boundary (Client vs Server)

**Status:** Accepted

**Tanggal:** 2026-04-25

### Konteks

Papyr memiliki 6 tool PDF dengan karakteristik processing yang berbeda. Beberapa operasi (merge, split, rotate) hanya memanipulasi struktur PDF tanpa perlu rendering pixel. Operasi lain (compress, PDF-to-image) membutuhkan engine khusus yang tidak tersedia di browser.

Memproses semua operasi di server berarti: (1) semua file harus di-upload — lambat di 4G Indonesia, (2) biaya server lebih tinggi, (3) privacy risk karena file meninggalkan device pengguna.

### Keputusan

Menggunakan **arsitektur hybrid** dengan aturan:

| Operasi | Processing | Library | Alasan |
|---|---|---|---|
| Merge PDF | Client-side | pdf-lib | Manipulasi struktur, tidak butuh rendering |
| Split PDF | Client-side | pdf-lib | Ekstraksi halaman, tidak butuh rendering |
| Rotate PDF | Client-side | pdf-lib | Set rotation metadata, trivial |
| Compress PDF | Server-side | Ghostscript | Butuh engine kompresi yang tidak ada di browser |
| PDF to Image | Server-side | PyMuPDF | Rasterisasi membutuhkan rendering engine |
| Image to PDF | Hybrid | pdf-lib + PyMuPDF | File kecil (<3MB) di client, besar di server |

**Aturan utama:** Proses di client jika operasinya tidak butuh rendering pixel. Kirim ke server hanya jika butuh engine khusus (Ghostscript/PyMuPDF).

### Alternatif yang Dipertimbangkan

| Alternatif | Penilaian | Alasan Tidak Dipilih |
|---|---|---|
| Semua server-side | Mahal dan lambat | Upload wajib untuk semua operasi, biaya tinggi, privacy risk |
| Semua client-side | Tidak feasible | Browser tidak punya Ghostscript atau rendering engine PDF |
| WebAssembly Ghostscript | Belum mature | WASM port Ghostscript belum production-ready, bundle size besar |
| PDF.js untuk rendering | Partial solution | Bisa render tapi tidak bisa compress, kualitas output inkonsisten |

### Konsekuensi

**Positif:**
- Client-side operations = zero upload, zero latency, zero privacy risk
- Biaya server berkurang drastis (hanya 2 dari 6 tool butuh server)
- UX lebih cepat untuk merge/split/rotate (instant, tanpa loading)
- Privacy lebih baik — file sensitif tidak pernah meninggalkan device untuk operasi ringan

**Negatif:**
- Dua code path (client + server) menambah kompleksitas
- Client-side bergantung pada kemampuan browser (pdf-lib compatibility)
- Perlu fallback logic untuk Image-to-PDF (threshold 3MB)

**Netral:**
- Arsitektur ini scalable — tool baru bisa ditambahkan ke salah satu path sesuai kebutuhan

---

## ADR-010: pdf-lib untuk Operasi PDF Client-Side

**Status:** Accepted

**Tanggal:** 2026-04-27

### Konteks

Operasi client-side (merge, split, rotate, image-to-PDF) membutuhkan library JavaScript yang bisa memanipulasi PDF di browser. Library harus: (1) bisa merge/split/rotate tanpa server, (2) bisa embed gambar ke PDF, (3) ukuran bundle reasonable, (4) API yang clean dan well-documented, (5) aktif di-maintain.

### Keputusan

Menggunakan **pdf-lib** sebagai library utama untuk semua operasi PDF client-side.

Fungsi yang diimplementasi:
- `mergePDFs(files)` — gabungkan multiple PDF via `copyPages()`
- `splitPDF(file, pages)` — ekstraksi halaman via `copyPages()` dengan index selection
- `rotatePDF(file, pageRotationMap)` — rotasi per-halaman via `page.setRotation(degrees(...))`
- `rotatePDFAllPages(file, addDegree)` — rotasi semua halaman
- `imagesToPDF(files)` — embed JPG/PNG/WebP ke PDF via `embedJpg()`/`embedPng()`
- `getPDFPageCount(file)` — baca jumlah halaman
- `downloadPDF(data, filename)` — trigger browser download

### Alternatif yang Dipertimbangkan

| Alternatif | Penilaian | Alasan Tidak Dipilih |
|---|---|---|
| PDF.js (Mozilla) | Viewer, bukan editor | Fokus pada rendering/viewing, bukan manipulasi struktur PDF |
| jsPDF | Pembuatan PDF baru | Bagus untuk create PDF dari scratch, lemah untuk manipulasi existing PDF |
| pdfmake | Pembuatan PDF baru | Sama seperti jsPDF — fokus create, bukan manipulate |
| HummusJS | Node.js only | Tidak berjalan di browser |
| PSPDFKit | Commercial | Mahal, overkill untuk kebutuhan MVP |

### Konsekuensi

**Positif:**
- API clean dan TypeScript-friendly
- Bundle size reasonable (~200KB gzipped)
- Mendukung merge, split, rotate, embed image dalam satu library
- Aktif di-maintain, komunitas besar (5K+ GitHub stars)
- Berjalan di semua browser modern (Chrome 90+, Safari 15+, Firefox 90+)

**Negatif:**
- Tidak mendukung WebP embedding secara native (perlu canvas conversion — lihat ADR-013)
- Tidak bisa melakukan kompresi PDF (tetap butuh server untuk compress)
- Beberapa PDF kompleks (encrypted, XFA forms) mungkin gagal di-load
- `ignoreEncryption: true` diperlukan untuk handle PDF dengan permission flags

**Netral:**
- Library ini cukup untuk semua kebutuhan client-side Fase 1 dan 0.2

---

## ADR-011: Cloudflare R2 sebagai Object Storage (Bukan AWS S3)

**Status:** Accepted

**Tanggal:** 2026-04-25

### Konteks

Papyr membutuhkan object storage untuk menyimpan file sementara (hasil compress, PDF-to-image output) sebelum user download. Requirement: (1) S3-compatible API, (2) signed URL support, (3) lifecycle rules, (4) biaya sangat rendah atau gratis untuk volume MVP.

Budget infrastruktur total: maksimum $5/bulan. Storage harus gratis atau mendekati gratis.

### Keputusan

Menggunakan **Cloudflare R2** sebagai object storage dengan konfigurasi:
- Bucket: `papyr-files`
- Access: via boto3 S3-compatible API (`signature_version="s3v4"`)
- Signed URL expiry: 3600 detik (1 jam)
- Lifecycle rule: auto-delete setelah 24 jam (minimum R2)
- File naming: UUID-based (`uuid.uuid4().hex` + extension)
- Region: auto (Cloudflare global)

### Alternatif yang Dipertimbangkan

| Alternatif | Penilaian | Alasan Tidak Dipilih |
|---|---|---|
| AWS S3 | Mahal untuk MVP | Egress fee $0.09/GB, tidak ada free tier yang cukup |
| Google Cloud Storage | Mahal untuk MVP | Egress fee serupa AWS, free tier terbatas |
| Supabase Storage | Viable | Sudah ada Supabase project, tapi R2 lebih murah dan zero egress |
| Local filesystem (Railway) | Tidak persistent | Railway container ephemeral, file hilang saat redeploy |
| Backblaze B2 | Viable tapi kurang familiar | API kurang mature, signed URL support terbatas |

### Konsekuensi

**Positif:**
- **Zero egress fee** — download gratis berapa pun volume
- Free tier generous: 10GB storage, 10 juta Class B operations/bulan
- S3-compatible API — bisa pakai boto3 tanpa perubahan
- Signed URL support untuk secure download
- Global distribution via Cloudflare network

**Negatif:**
- Lifecycle rule minimum 1 hari (bukan 1 jam) — perlu cron fallback (ADR-004)
- Tidak ada region selection (auto) — latency mungkin tidak optimal untuk Indonesia
- Vendor lock-in ke Cloudflare ecosystem (meskipun S3-compatible)

**Netral:**
- Migrasi ke S3 atau compatible storage mudah karena menggunakan boto3 standard API

---

## ADR-012: FastAPI (Python) untuk Backend — Bukan Express/Hono

**Status:** Accepted

**Tanggal:** 2026-04-25

### Konteks

Backend Papyr membutuhkan: (1) endpoint untuk upload/download file, (2) integrasi dengan Ghostscript (CLI tool), (3) integrasi dengan PyMuPDF (Python library), (4) rate limiting, (5) async processing.

Ghostscript dipanggil sebagai subprocess, dan PyMuPDF adalah library Python-native. Menggunakan Node.js backend berarti harus memanggil Python subprocess untuk setiap operasi PDF — menambah latency dan kompleksitas.

### Keputusan

Menggunakan **FastAPI (Python 3.11)** sebagai backend framework dengan alasan:
- PyMuPDF dan Ghostscript terintegrasi native di Python ecosystem
- FastAPI async-native — cocok untuk I/O-bound operations (upload/download)
- Auto-generated OpenAPI docs
- Type hints dan Pydantic validation
- Deployment via Docker (`python:3.11-slim`)

Stack backend:
- FastAPI — web framework
- slowapi — rate limiting (10 req/min/IP)
- boto3 — Cloudflare R2 client
- PyMuPDF (fitz) — PDF rendering dan image conversion
- Ghostscript — PDF compression (via subprocess)
- uvicorn — ASGI server

### Alternatif yang Dipertimbangkan

| Alternatif | Penilaian | Alasan Tidak Dipilih |
|---|---|---|
| Express.js (Node.js) | Perlu Python subprocess | Ghostscript/PyMuPDF butuh Python, menambah latency dan complexity |
| Hono (Node.js) | Sama seperti Express | Lightweight tapi masalah yang sama — PDF ecosystem di Python |
| Flask (Python) | Sync-only | Tidak async-native, performance lebih rendah untuk concurrent requests |
| Django (Python) | Overkill | Terlalu berat untuk API-only service, ORM tidak dibutuhkan |
| Go (Gin/Fiber) | Perlu CGO bindings | PyMuPDF tidak ada di Go, Ghostscript binding kompleks |

### Konsekuensi

**Positif:**
- Native integration dengan PyMuPDF dan Ghostscript — zero overhead
- Async support untuk concurrent file operations
- Auto-generated API docs (Swagger UI)
- Python ecosystem mature untuk PDF processing
- Docker deployment straightforward

**Negatif:**
- Python lebih lambat dari Go/Rust untuk CPU-bound tasks
- Memory footprint lebih besar dari Node.js untuk idle state
- Cold start di Railway ~30 detik (Python + dependencies loading)

**Netral:**
- Single worker (`--workers 1`) cukup untuk traffic MVP, bisa scale horizontal jika dibutuhkan

---

## ADR-013: WebP Support via Canvas Conversion

**Status:** Accepted

**Tanggal:** 2026-04-28

### Konteks

Image-to-PDF tool harus mendukung format WebP karena banyak pengguna Indonesia menyimpan gambar dari WhatsApp dan browser dalam format WebP. Namun, pdf-lib hanya mendukung embedding JPG dan PNG secara native — tidak ada `embedWebp()` method.

### Keputusan

Menggunakan **OffscreenCanvas API** untuk mengkonversi WebP ke PNG sebelum embedding ke PDF:

```typescript
async function webpToPng(file: File): Promise<Uint8Array> {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const blob = await canvas.convertToBlob({ type: "image/png" });
  return new Uint8Array(await blob.arrayBuffer());
}
```

Flow: WebP file → `createImageBitmap()` → `OffscreenCanvas` → PNG blob → `doc.embedPng()` → PDF page.

### Alternatif yang Dipertimbangkan

| Alternatif | Penilaian | Alasan Tidak Dipilih |
|---|---|---|
| Tidak mendukung WebP | Kehilangan use case | WhatsApp dan browser modern banyak menggunakan WebP |
| Server-side conversion (Sharp/Pillow) | Overhead | Menambah server round-trip untuk operasi yang bisa di-client |
| WASM decoder (libwebp) | Bundle size besar | Menambah ~500KB ke bundle untuk satu format |
| Fork pdf-lib + tambah WebP | Maintenance burden | Harus maintain fork, tidak sustainable |

### Konsekuensi

**Positif:**
- WebP support tanpa dependency tambahan (Canvas API built-in di browser)
- Tetap client-side — tidak perlu upload ke server
- OffscreenCanvas tidak memblokir main thread
- Kualitas konversi lossless (WebP → PNG)

**Negatif:**
- Sedikit overhead memory (decode + re-encode)
- OffscreenCanvas tidak tersedia di browser sangat lama (IE11, Safari <16.4)
- File size output lebih besar (PNG > WebP) — tapi acceptable karena di-embed ke PDF

**Netral:**
- Browser target Papyr (Chrome 90+, Safari 15+, Firefox 90+) semua mendukung OffscreenCanvas

---

## ADR-014: Validasi File Multi-Layer (Triple Validation)

**Status:** Accepted

**Tanggal:** 2026-04-27

### Konteks

Papyr menerima file upload dari pengguna anonim tanpa autentikasi. Ini membuka risiko: (1) upload file berbahaya yang di-rename jadi .pdf, (2) file corrupt yang menyebabkan crash di Ghostscript/PyMuPDF, (3) abuse dengan file non-PDF.

Validasi hanya berdasarkan ekstensi file sangat mudah di-bypass. Validasi hanya berdasarkan MIME type juga bisa di-spoof.

### Keputusan

Menggunakan **validasi 3 layer** untuk setiap file yang di-upload:

1. **MIME Type** — Check `Content-Type` header dan file MIME
2. **Ekstensi File** — Hanya `.pdf`, `.jpg`, `.jpeg`, `.png`, `.webp` yang diterima
3. **Magic Bytes** — Baca header bytes file untuk verifikasi format sebenarnya:
   - PDF: `%PDF` (bytes 0-3)
   - JPEG: `FF D8 FF` (bytes 0-2)
   - PNG: `89 50 4E 47` (bytes 0-3)
   - WebP: `RIFF` + `WEBP` (bytes 0-3 + 8-11)

Ketiga layer **harus lolos** — jika salah satu gagal, file ditolak dengan HTTP 400 dan pesan error Bahasa Indonesia.

### Alternatif yang Dipertimbangkan

| Alternatif | Penilaian | Alasan Tidak Dipilih |
|---|---|---|
| Hanya MIME type | Mudah di-spoof | Attacker bisa set Content-Type palsu |
| Hanya ekstensi | Sangat mudah di-bypass | Rename .exe jadi .pdf |
| MIME + ekstensi (tanpa magic bytes) | Masih vulnerable | Kedua bisa di-manipulasi tanpa mengubah konten file |
| Antivirus scanning | Overkill untuk MVP | Mahal, lambat, dan tidak relevan untuk PDF tool |

### Konsekuensi

**Positif:**
- Mencegah upload file berbahaya yang di-rename
- Mencegah crash di processing engine (Ghostscript/PyMuPDF)
- Defense-in-depth — 3 layer harus konsisten
- Error message jelas dalam Bahasa Indonesia

**Negatif:**
- Sedikit overhead per request (baca header bytes)
- False positive mungkin terjadi untuk PDF yang sangat non-standard
- Perlu maintenance jika menambah format baru

**Netral:**
- Validasi berjalan sangat cepat (<1ms) — tidak terasa oleh user

---

## ADR-015: Next.js 16 dengan App Router untuk Frontend

**Status:** Accepted

**Tanggal:** 2026-04-25

### Konteks

Frontend Papyr membutuhkan: (1) SSR/SSG untuk SEO (meta tags, sitemap, robots.txt), (2) file-based routing, (3) TypeScript support, (4) edge deployment (Vercel), (5) performance optimal untuk mobile Indonesia (4G).

Papyr adalah content-heavy site (landing page, tool pages, FAQ, privacy policy) yang membutuhkan SEO excellence untuk organic acquisition.

### Keputusan

Menggunakan **Next.js 16 dengan App Router** sebagai frontend framework, deployed di Vercel Free tier.

Fitur yang dimanfaatkan:
- App Router — file-based routing dengan layout nesting
- `layout.tsx` per directory — metadata SEO per tool page
- `sitemap.ts` — auto-generated sitemap.xml (7 URLs)
- `robots.ts` — auto-generated robots.txt
- `opengraph-image.tsx` — dynamic OG image generation
- Server Components — untuk static content (landing, FAQ)
- Client Components — untuk interactive tool pages (`"use client"`)
- Vercel Edge Network — global CDN, zero-config

### Alternatif yang Dipertimbangkan

| Alternatif | Penilaian | Alasan Tidak Dipilih |
|---|---|---|
| Vite + React (SPA) | Tidak ada SSR | SEO sangat buruk untuk SPA, tidak ada meta tags server-side |
| Remix | Viable | Ekosistem lebih kecil, Vercel integration kurang mature |
| Nuxt.js (Vue) | Viable | Tim lebih familiar dengan React ecosystem |
| Astro | Viable untuk static | Kurang cocok untuk interactive tool pages yang butuh state management |
| SvelteKit | Viable | Ekosistem lebih kecil, hiring path lebih sulit di masa depan |

### Konsekuensi

**Positif:**
- SEO excellent — SSR meta tags, sitemap, OG images
- Vercel deployment zero-config — push to GitHub = auto deploy
- Edge network global — fast TTFB untuk pengguna Indonesia
- TypeScript native — type safety end-to-end
- Tailwind CSS v4 integration seamless

**Negatif:**
- Bundle size lebih besar dari Vite SPA (framework overhead)
- App Router masih relatif baru — beberapa edge cases
- Vendor coupling dengan Vercel (meskipun bisa self-host)

**Netral:**
- Next.js 16 adalah versi terbaru saat init — backward-compatible dengan ecosystem

---

## 4. Indeks ADR

| ADR | Status | Tanggal | Ringkasan |
|---|---|---|---|
| ADR-001 | Accepted | 2026-04-25 | Batas upload 20MB per file (naik dari 10MB di PRD awal) |
| ADR-002 | Accepted | 2026-04-25 | Ghostscript untuk kompresi PDF kompetitif (3 level kualitas) |
| ADR-003 | Accepted | 2026-04-25 | PDF-to-Image: user pilih halaman via page range selector |
| ADR-004 | Accepted | 2026-04-25 | Double safety auto-delete: R2 lifecycle + cron fallback 30 menit |
| ADR-005 | Superseded | 2026-04-25 | Plausible Analytics — digantikan ADR-008 |
| ADR-006 | Accepted | 2026-04-25 | Indonesia-first language: Bahasa Indonesia default |
| ADR-007 | Accepted | 2026-04-25 | Auto-retry 1x pada kegagalan (network error only) |
| ADR-008 | Accepted | 2026-04-29 | Migrasi ke Vercel Analytics + Speed Insights (supersedes ADR-005) |
| ADR-009 | Accepted | 2026-04-25 | Hybrid processing boundary: client untuk ringan, server untuk berat |
| ADR-010 | Accepted | 2026-04-27 | pdf-lib untuk semua operasi PDF client-side |
| ADR-011 | Accepted | 2026-04-25 | Cloudflare R2 (zero egress) vs AWS S3 untuk object storage |
| ADR-012 | Accepted | 2026-04-25 | FastAPI (Python) karena native PDF ecosystem integration |
| ADR-013 | Accepted | 2026-04-28 | WebP support via OffscreenCanvas → PNG conversion |
| ADR-014 | Accepted | 2026-04-27 | Validasi file triple-layer: MIME + ekstensi + magic bytes |
| ADR-015 | Accepted | 2026-04-25 | Next.js 16 App Router untuk SEO dan edge deployment |

---

## 5. Matriks Keputusan (Weighted Scoring)

### 5.1 Backend Framework

| Kriteria | Bobot | FastAPI | Express.js | Hono | Flask | Django |
|---|---:|---:|---:|---:|---:|---:|
| PDF ecosystem integration | 25 | 5 | 2 | 2 | 5 | 5 |
| Async performance | 20 | 5 | 4 | 5 | 2 | 3 |
| Development speed | 20 | 5 | 4 | 4 | 4 | 3 |
| Type safety | 15 | 4 | 3 | 5 | 2 | 2 |
| Deployment simplicity | 10 | 4 | 4 | 4 | 4 | 3 |
| Community/docs | 10 | 4 | 5 | 3 | 5 | 5 |
| **Total Tertimbang** | **100** | **470** | **340** | **345** | **365** | **360** |

### 5.2 Object Storage

| Kriteria | Bobot | Cloudflare R2 | AWS S3 | GCS | Supabase Storage |
|---|---:|---:|---:|---:|---:|
| Cost (free tier) | 30 | 5 | 2 | 2 | 4 |
| Egress pricing | 25 | 5 | 1 | 1 | 4 |
| S3 compatibility | 15 | 5 | 5 | 4 | 3 |
| Signed URL support | 15 | 5 | 5 | 5 | 4 |
| Lifecycle rules | 10 | 3 | 5 | 5 | 3 |
| Global distribution | 5 | 5 | 4 | 4 | 3 |
| **Total Tertimbang** | **100** | **480** | **310** | **290** | **365** |

### 5.3 Analytics Platform

| Kriteria | Bobot | Vercel Analytics | Plausible | Google Analytics | PostHog |
|---|---:|---:|---:|---:|---:|
| Cost (MVP budget) | 30 | 5 | 2 | 5 | 3 |
| Privacy compliance | 25 | 5 | 5 | 1 | 4 |
| Setup effort | 20 | 5 | 3 | 4 | 3 |
| Custom events | 15 | 4 | 4 | 5 | 5 |
| Integration depth | 10 | 5 | 3 | 3 | 3 |
| **Total Tertimbang** | **100** | **485** | **355** | **345** | **355** |

---

## 6. Catatan Governance

- ADR yang sudah **Accepted** harus direferensikan dalam design docs, PRD, dan deployment runbooks.
- Konflik antara implementasi dan ADR adalah governance defect yang memerlukan remediasi.
- ADR yang di-supersede harus menyertakan referensi ke ADR pengganti.
- Setiap ADR baru harus melalui review Product Owner sebelum status berubah ke Accepted.
- Nomor ADR bersifat permanen — tidak pernah di-reuse meskipun ADR di-reject atau supersede.

---

## 7. Lampiran — Template ADR

```markdown
## ADR-XXX: <Judul Keputusan>

**Status:** Proposed | Accepted | Deprecated | Superseded | Rejected

**Tanggal:** YYYY-MM-DD

### Konteks

<Masalah dan constraint apa yang ada?>

### Keputusan

<Apa yang diputuskan dan mengapa?>

### Alternatif yang Dipertimbangkan

| Alternatif | Penilaian | Alasan Tidak Dipilih |
|---|---|---|
| Opsi A | ... | ... |

### Konsekuensi

**Positif:**
- <Manfaat>

**Negatif:**
- <Trade-off>

**Netral:**
- <Efek samping netral>
```

---

*Akhir Dokumen.*
