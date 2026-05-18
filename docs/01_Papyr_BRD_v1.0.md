**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Business Requirements Document (BRD)**

Version 1.0

Mei 2026

**CONFIDENTIAL**

mypapyr.com

**Informasi Dokumen**

|                     |                                              |
|---------------------|----------------------------------------------|
| **Judul Dokumen**   | Business Requirements Document — Papyr       |
| **ID Dokumen**      | PPR-BRD-001                                  |
| **Versi**           | 1.0                                          |
| **Status**          | Approved                                     |
| **Tanggal Dibuat**  | Mei 2026                                     |
| **Terakhir Diubah** | Mei 2026                                     |
| **Penulis**         | Muhammad Fa'iz Zulfikar                      |
| **Ditinjau Oleh**   | Product Owner                                |
| **Disetujui Oleh**  | Product Owner                                |
| **Kerahasiaan**     | Confidential — Internal & Investor Use Only  |

**Riwayat Versi**

| **Versi** | **Tanggal** | **Penulis**                  | **Deskripsi**                                                |
|-----------|-------------|------------------------------|--------------------------------------------------------------|
| 1.0       | Mei 2026    | Muhammad Fa'iz Zulfikar      | Draft awal — BRD lengkap untuk scope Fase 1 + pricing model |

---

**1. Executive Summary**

Papyr adalah web application utilitas PDF yang dirancang khusus untuk pasar Indonesia. Dibangun dengan filosofi privacy-first, mobile-first, dan zero-login, Papyr memungkinkan pengguna untuk melakukan operasi PDF umum (compress, merge, split, convert) secara gratis, cepat, dan aman — tanpa perlu membuat akun atau mengunduh software apapun.

Produk ini menargetkan seluruh segmen pengguna Indonesia — mulai dari mahasiswa, pekerja kantoran, freelancer, hingga pelaku UMKM — yang membutuhkan tool PDF sederhana namun andal. Papyr membedakan diri dari kompetitor global (iLovePDF, SmallPDF, Adobe Acrobat Online) melalui tiga keunggulan utama: (1) server yang dekat dengan Indonesia untuk latensi rendah, (2) antarmuka berbahasa Indonesia secara default, dan (3) model gratis tanpa paywall yang membatasi penggunaan.

Papyr dikembangkan sebagai full-stack web application dengan arsitektur hybrid — operasi ringan diproses di sisi klien (browser) untuk kecepatan maksimal dan privasi, sementara operasi berat diproses di server dengan auto-delete file dalam 60 menit. Infrastruktur dioptimalkan untuk biaya operasional sangat rendah ($0-5/bulan) menggunakan Vercel Free Tier, Railway, dan Cloudflare R2.

Saat ini Papyr sudah live di mypapyr.com dengan 6 tool aktif (Compress, Merge, Split, Rotate, Image-to-PDF, PDF-to-Image) dan sedang dalam fase soft launch untuk validasi product-market fit.

---

**2. Business Objectives**

**2.1 Tujuan Primer**

- Menyediakan platform utilitas PDF gratis, cepat, dan privacy-first yang dapat diakses publik melalui mypapyr.com tanpa login.

- Membuktikan bahwa ada demand signifikan untuk PDF tool yang dioptimalkan untuk pengguna Indonesia (bahasa lokal, latensi rendah, tanpa paywall).

- Membangun trust awal melalui UX sederhana, bahasa Indonesia default, client-side processing, dan auto-delete file dalam 60 menit.

- Mencapai product-market fit yang terukur melalui organic traffic dan repeat usage sebelum monetisasi.

- Membangun fondasi teknis yang scalable untuk mendukung tool expansion dan premium tier di masa depan.

**2.2 Tujuan Sekunder**

- Mengakuisisi pengguna secara organik melalui SEO yang dioptimalkan untuk keyword PDF berbahasa Indonesia.

- Membangun brand awareness sebagai "PDF tool-nya Indonesia" sebelum kompetitor lokal muncul.

- Memvalidasi pricing model freemium + subscription murah untuk pasar Indonesia.

**2.3 Metrik Keberhasilan**

| **Metrik**                    | **Definisi**                                          | **Target (Bulan 3)** | **Target (Bulan 12)** |
|-------------------------------|-------------------------------------------------------|----------------------|-----------------------|
| Tasks Processed               | Total operasi PDF yang berhasil diselesaikan          | 5.000                | 100.000               |
| SEO Organic Traffic           | Kunjungan bulanan dari mesin pencari                  | 2.000                | 30.000                |
| Repeat Usage Rate             | Pengguna yang kembali dalam 30 hari                   | 25%                  | 40%                   |
| Performance (P95 Response)    | Waktu respons server percentile 95                    | < 3 detik            | < 2 detik             |
| Task Success Rate             | Persentase task yang berhasil tanpa error             | > 95%                | > 99%                 |
| Mobile Completion Rate        | Task yang selesai dari perangkat mobile               | > 80%                | > 90%                 |
| Avg Infrastructure Cost       | Biaya infrastruktur rata-rata per bulan               | < $5                 | < $20                 |

### Referensi Go-to-Market Strategy

- **Fase 1 (Soft Launch):** Distribusi ke circle personal, komunitas mahasiswa, dan forum Indonesia (Twitter/X, Reddit r/indonesia)
- **Fase 5 (SEO Growth):** Organic acquisition melalui konten SEO berbahasa Indonesia yang menargetkan keyword "compress PDF", "gabung PDF", "convert gambar ke PDF"
- **Fase 6 (Monetisasi):** Introduksi tier Pro setelah mencapai 10.000+ monthly active tasks
- **Paid Acquisition:** Tidak direncanakan untuk fase awal (self-funded constraint)

---

**3. Problem Statement**

**3.1 Situasi Saat Ini**

Mayoritas pengguna internet di Indonesia yang membutuhkan operasi PDF sederhana (compress untuk upload berkas, merge dokumen, convert gambar ke PDF) bergantung pada tool global seperti iLovePDF atau SmallPDF. Tool-tool ini memiliki beberapa masalah fundamental bagi pengguna Indonesia:

1. **Server jauh dari Indonesia** — latensi tinggi, upload/download lambat terutama untuk koneksi mobile.
2. **Paywall agresif** — batas penggunaan harian (2-3 operasi gratis) memaksa pengguna membayar atau mencari alternatif.
3. **Bahasa asing** — antarmuka hanya tersedia dalam bahasa Inggris, membingungkan pengguna non-teknis.
4. **Privasi dipertanyakan** — file diunggah ke server luar negeri tanpa transparansi penanganan data.
5. **Membutuhkan instalasi** — beberapa solusi memerlukan download software desktop.

**3.2 Core Pain Points**

| **#** | **Pain Point**                                    | **Dampak**                                                                |
|-------|---------------------------------------------------|---------------------------------------------------------------------------|
| 1     | Latensi tinggi (server di Eropa/AS)               | Upload 5MB memakan waktu 10-30 detik di koneksi 4G Indonesia              |
| 2     | Paywall dan batas penggunaan harian               | Pengguna frustrasi, mencari tool baru setiap kali limit tercapai          |
| 3     | Kekhawatiran privasi                              | File sensitif (KTP, ijazah, kontrak) diunggah ke server asing             |
| 4     | Bahasa Inggris only                               | Pengguna non-teknis kesulitan memahami opsi dan error message             |
| 5     | Perlu install software                            | Tidak praktis di perangkat mobile atau komputer kantor yang terbatas      |

**3.3 Gap Analysis**

Solusi yang ada di pasar saat ini: (1) dioptimalkan untuk pasar global, bukan Indonesia secara spesifik, (2) menggunakan model freemium yang agresif dengan batas sangat rendah, (3) tidak menawarkan client-side processing untuk privasi, (4) tidak tersedia dalam Bahasa Indonesia, dan (5) tidak memiliki server yang dekat dengan pengguna Indonesia. Papyr mengisi semua gap ini secara bersamaan.

---

**4. Project Scope**

**4.1 In Scope — Fase 1 (Saat Ini Live)**

| **Modul**          | **Fitur**                                                                                                    | **Prioritas** | **Processing** |
|--------------------|--------------------------------------------------------------------------------------------------------------|---------------|----------------|
| Compress PDF       | Kompres file PDF dengan 3 level kualitas (low, medium, high). Ghostscript engine.                            | P1            | Server         |
| Merge PDF          | Gabungkan 2+ file PDF menjadi satu. Drag-and-drop reorder.                                                  | P1            | Client         |
| Split PDF          | Pisahkan halaman PDF berdasarkan range (e.g., 1-3, 5, 7-10).                                                | P1            | Client         |
| Image to PDF       | Konversi gambar (JPG, PNG, WEBP) menjadi PDF. Multi-image support. Client + server fallback.                 | P1            | Hybrid         |
| PDF to Image       | Konversi halaman PDF menjadi gambar PNG. Pilih halaman spesifik. ZIP untuk multi-page.                       | P1            | Server         |
| Rotate PDF         | Putar halaman PDF (90°, 180°, 270°). Per-halaman atau semua halaman.                                        | P1            | Client         |
| Landing Page       | Homepage dengan grid 6 tool, tagline, privacy messaging, mobile-responsive.                                  | P1            | —              |
| SEO Infrastructure | Sitemap.xml, robots.txt, Open Graph, Twitter Card, meta tags Bahasa Indonesia.                               | P1            | —              |
| Privacy & Cleanup  | Auto-delete file dari R2 dalam 60 menit. Cron fallback setiap 30 menit. UUID filename.                      | P1            | Server         |
| Security           | MIME + extension + magic bytes validation, rate limit 10 req/min/IP, CORS strict, signed URLs, no logging.   | P1            | Server         |
| Analytics          | Event tracking: task_started, task_completed, task_failed, device_category. Vercel Analytics.                | P1            | Client         |
| Auto-Retry         | Retry otomatis 1x pada kegagalan task sebelum menampilkan error ke pengguna.                                 | P2            | Client         |

**4.2 In Scope — Fase 2 (Roadmap Berikutnya)**

| **Modul**          | **Fitur**                                                          | **Prioritas** |
|--------------------|--------------------------------------------------------------------|---------------|
| Protect PDF        | Tambahkan password ke PDF                                          | P1            |
| Unlock PDF         | Hapus password dari PDF (jika user tahu password)                  | P1            |
| Watermark PDF      | Tambahkan watermark teks/gambar ke PDF                             | P2            |
| Sign PDF           | Tanda tangan digital sederhana (draw/upload)                       | P2            |
| PDF to Word        | Konversi PDF ke DOCX                                               | P2            |
| OCR                | Extract teks dari PDF/gambar (Bahasa Indonesia + English)          | P2            |
| Multi-language     | Dukungan English sebagai bahasa kedua                              | P2            |

**4.3 Out of Scope**

- Login / registrasi pengguna (hingga Fase 3)
- Dashboard pengguna
- Payment / subscription (hingga Fase 3)
- AI-powered features (Fase 5)
- e-Meterai integration (Fase 6)
- Native mobile application (iOS/Android)
- Offline mode
- PDF editing (text/image manipulation)
- Batch processing (hingga Pro tier)
- API access untuk developer (hingga Pro tier)

---

**5. Stakeholders**

| **Stakeholder**    | **Peran**                | **Tanggung Jawab**                                              | **Tingkat Kepentingan** |
|--------------------|--------------------------|------------------------------------------------------------------|-------------------------|
| Product Owner      | Founder & Solo Developer | Visi produk, requirements, development, deployment, final approval | Tinggi                  |
| AI Agent           | Development Partner      | Eksekusi coding, testing, documentation, code review             | Tinggi                  |
| End Users          | Pengguna publik          | Menggunakan tool PDF; sumber feedback utama                      | Tinggi                  |
| Investor/Partner   | Potential stakeholder    | Evaluasi bisnis untuk potensi investasi/kerjasama                | Medium                  |

*Catatan: Dalam model solo-founder + AI agent saat ini, semua peran teknis dijalankan oleh Founder dengan bantuan AI Agent (OpenCode/Sisyphus). Pemisahan peran dipertahankan untuk kejelasan dokumentasi dan skalabilitas tim di masa depan.*

---

**6. Target Users & Personas**

**6.1 Persona Primer — "Rina, 21, Mahasiswa"**

|                      |                                                                                                    |
|----------------------|----------------------------------------------------------------------------------------------------|
| **Background**       | Mahasiswa semester 5 di Surabaya. Sering perlu compress PDF untuk upload tugas (max 2MB di LMS). Menggunakan HP Android sebagai perangkat utama. |
| **Goals**            | Compress PDF tugas agar lolos batas upload. Merge beberapa scan menjadi satu PDF. Convert foto catatan ke PDF. |
| **Frustrations**     | iLovePDF lambat di 4G. Batas 2 file gratis per hari. Tidak paham bahasa Inggris teknis. Takut file tugas bocor. |
| **Tech Comfort**     | Medium. Familiar dengan smartphone, jarang pakai laptop.                                           |
| **Access Pattern**   | Akses dari HP Android via Chrome. Butuh selesai dalam < 1 menit. Biasanya malam sebelum deadline.  |
| **Fitur Utama**      | Compress PDF, Image-to-PDF, Merge PDF.                                                             |

**6.2 Persona Sekunder — "Andi, 28, Pekerja Kantoran"**

|                      |                                                                                                    |
|----------------------|----------------------------------------------------------------------------------------------------|
| **Background**       | Staff administrasi di perusahaan Jakarta. Sering perlu merge dokumen kontrak, split halaman tertentu, dan compress untuk email. |
| **Goals**            | Merge beberapa PDF kontrak. Split halaman yang perlu ditandatangani. Compress agar bisa dikirim via email (max 10MB). |
| **Frustrations**     | Tidak boleh install software di komputer kantor. SmallPDF minta bayar setelah 2 operasi. Khawatir file kontrak rahasia diunggah ke server luar. |
| **Tech Comfort**     | Medium-High. Pakai laptop kantor dan HP.                                                           |
| **Access Pattern**   | Akses dari laptop kantor (Chrome) saat jam kerja. Kadang dari HP saat di luar kantor.              |
| **Fitur Utama**      | Merge PDF, Split PDF, Compress PDF, Protect PDF (upcoming).                                        |

**6.3 Persona Tersier — "Dewi, 35, Freelancer/UMKM"**

|                      |                                                                                                    |
|----------------------|----------------------------------------------------------------------------------------------------|
| **Background**       | Freelance graphic designer yang juga menjalankan toko online. Perlu convert desain ke PDF, watermark portfolio, dan compress katalog produk. |
| **Goals**            | Convert gambar produk ke PDF katalog. Watermark portfolio agar tidak dicuri. Compress file besar untuk WhatsApp. |
| **Frustrations**     | Tool gratis selalu ada limit. Perlu tool yang bisa dipakai berkali-kali tanpa bayar. Butuh hasil cepat untuk kirim ke klien. |
| **Tech Comfort**     | High. Pakai laptop dan HP secara bergantian.                                                       |
| **Access Pattern**   | Akses kapan saja, terutama saat ada order atau deadline klien. Butuh batch processing (future).    |
| **Fitur Utama**      | Image-to-PDF, Compress PDF, Watermark (upcoming), Rotate PDF.                                      |

---

**7. Business Rules**

**7.1 Aturan Pemrosesan File**

| **Rule ID** | **Aturan**                          | **Detail**                                                                                                                                     |
|-------------|-------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| BR-001      | Batas Ukuran Upload                 | Maksimum 20MB per file. File yang melebihi batas ditolak dengan pesan error yang jelas dalam Bahasa Indonesia.                                 |
| BR-002      | Validasi File Multi-Layer           | Setiap file divalidasi melalui 3 layer: (1) MIME type, (2) ekstensi file, (3) magic bytes header. Ketiga layer harus lolos.                   |
| BR-003      | Auto-Delete 60 Menit               | Semua file yang diunggah ke server (R2) otomatis dihapus dalam 60 menit. Tidak ada pengecualian.                                               |
| BR-004      | Cleanup Double Safety               | Penghapusan dijamin melalui 2 mekanisme: (1) R2 lifecycle rule, (2) cron job fallback setiap 30 menit yang menghapus file expired.             |
| BR-005      | UUID Filename                       | Semua file disimpan dengan UUID sebagai nama file. Nama asli file tidak pernah disimpan di server.                                             |
| BR-006      | No Content Logging                  | Konten file tidak pernah di-log. Hanya metadata operasional (ukuran, tipe, timestamp) yang dicatat.                                            |
| BR-007      | Client-Side Priority                | Operasi yang bisa dilakukan di browser (merge, split, rotate) HARUS diproses di client. Server hanya untuk operasi yang membutuhkan engine khusus. |
| BR-008      | Signed URL Access                   | File hasil pemrosesan hanya bisa diakses melalui signed URL dengan expiry time. Tidak ada direct public access ke R2 bucket.                   |

**7.2 Aturan Rate Limiting**

| **Rule ID** | **Aturan**                          | **Detail**                                                                                                                                     |
|-------------|-------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| BR-009      | Rate Limit per IP                   | Maksimum 10 request per menit per IP address. Pesan error 429 dalam Bahasa Indonesia.                                                          |
| BR-010      | No Authentication Required          | Semua tool Fase 1 dapat diakses tanpa login. Rate limit berbasis IP saja.                                                                     |

**7.3 Aturan Bisnis & Monetisasi (Roadmap)**

| **Rule ID** | **Aturan**                          | **Detail**                                                                                                                                     |
|-------------|-------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| BR-011      | Free Tier (Tanpa Login)             | Semua tool dasar (Compress, Merge, Split, Rotate, Image-to-PDF, PDF-to-Image, Protect, Unlock, Watermark) unlimited. Max file 20MB.            |
| BR-012      | Free Tier (Dengan Login)            | Semua tool dasar + OCR 5x/hari, PDF-to-Word 5x/hari, PDF-to-Excel 3x/hari, Sign PDF 5x/hari.                                                 |
| BR-013      | Pro Tier                            | Rp 19.900/bulan atau Rp 149.000/tahun. Semua tool unlimited, batch processing, 100MB file size, priority processing, no branding, API access.  |
| BR-014      | Payment Gateway                     | Midtrans atau Xendit. Mendukung e-wallet Indonesia (GoPay, OVO, DANA), bank transfer, dan kartu kredit/debit.                                  |

---

**8. High-Level Functional Requirements**

Spesifikasi fungsional detail didokumentasikan dalam Software Requirements Specification (SRS — PPR-SRS-001).

**8.1 PDF Compression**

- REQ-CMP-001: Sistem harus mendukung kompresi PDF dengan 3 level kualitas (low, medium, high) menggunakan Ghostscript engine.

- REQ-CMP-002: Sistem harus menampilkan persentase pengurangan ukuran setelah kompresi berhasil.

- REQ-CMP-003: Sistem harus menolak file yang terproteksi password dengan pesan error yang jelas.

- REQ-CMP-004: Hasil kompresi harus tersedia melalui signed URL untuk download.

**8.2 PDF Merge**

- REQ-MRG-001: Sistem harus mendukung penggabungan 2 atau lebih file PDF menjadi satu dokumen.

- REQ-MRG-002: Pengguna harus dapat mengatur urutan file melalui drag-and-drop.

- REQ-MRG-003: Proses merge harus dilakukan sepenuhnya di sisi klien (browser) menggunakan pdf-lib.

- REQ-MRG-004: Sistem harus mendukung merge hingga 20 file sekaligus.

**8.3 PDF Split**

- REQ-SPL-001: Sistem harus mendukung pemisahan halaman PDF berdasarkan range yang ditentukan pengguna (e.g., "1-3, 5, 7-10").

- REQ-SPL-002: Proses split harus dilakukan sepenuhnya di sisi klien menggunakan pdf-lib.

- REQ-SPL-003: Sistem harus menampilkan jumlah total halaman PDF sebelum split.

- REQ-SPL-004: Hasil split harus otomatis di-download sebagai file PDF baru.

**8.4 Image to PDF**

- REQ-IMG-001: Sistem harus mendukung konversi gambar JPG, PNG, dan WEBP menjadi PDF.

- REQ-IMG-002: Sistem harus mendukung konversi multi-gambar menjadi satu PDF (satu gambar per halaman).

- REQ-IMG-003: File < 3MB diproses di client; file >= 3MB menggunakan server fallback.

- REQ-IMG-004: Validasi gambar harus mencakup MIME type, ekstensi, dan magic bytes (termasuk RIFF+WEBP signature).

**8.5 PDF to Image**

- REQ-P2I-001: Sistem harus mendukung konversi halaman PDF menjadi gambar PNG dengan resolusi 150 DPI.

- REQ-P2I-002: Pengguna harus dapat memilih halaman spesifik untuk dikonversi.

- REQ-P2I-003: Jika lebih dari 1 halaman dipilih, hasil harus dikemas dalam file ZIP.

- REQ-P2I-004: Proses konversi menggunakan PyMuPDF di server.

**8.6 PDF Rotate**

- REQ-ROT-001: Sistem harus mendukung rotasi halaman PDF (90°, 180°, 270°).

- REQ-ROT-002: Pengguna harus dapat merotasi halaman individual atau semua halaman sekaligus.

- REQ-ROT-003: Proses rotasi harus dilakukan sepenuhnya di sisi klien menggunakan pdf-lib.

**8.7 Landing Page & UX**

- REQ-UX-001: Landing page harus menampilkan grid semua tool yang tersedia dengan ikon dan deskripsi singkat.

- REQ-UX-002: Antarmuka harus menggunakan Bahasa Indonesia sebagai bahasa default.

- REQ-UX-003: Desain harus mobile-first dan responsif di semua ukuran layar.

- REQ-UX-004: Setiap halaman tool harus menampilkan privacy notice tentang auto-delete 60 menit.

- REQ-UX-005: Error message harus ditampilkan dalam Bahasa Indonesia yang mudah dipahami.

**8.8 Analytics & Monitoring**

- REQ-ANL-001: Sistem harus melacak event task_started, task_completed, dan task_failed untuk setiap tool.

- REQ-ANL-002: Sistem harus melacak device_category (mobile/tablet/desktop) pada setiap event.

- REQ-ANL-003: Backend harus mencatat cleanup_success dan cleanup_failure sebagai structured log event.

- REQ-ANL-004: Analytics harus menggunakan Vercel Analytics (privacy-friendly, no cookies).

---

**9. Non-Functional Requirements**

| **ID**  | **Kategori**  | **Requirement**                                                        | **Target**              |
|---------|---------------|------------------------------------------------------------------------|-------------------------|
| NFR-001 | Performance   | Waktu pemrosesan compress PDF (file 5MB)                               | < 5 detik              |
| NFR-002 | Performance   | Client-side operation (merge/split/rotate)                             | < 2 detik              |
| NFR-003 | Performance   | Page load time (mobile, 4G)                                            | < 3 detik              |
| NFR-004 | Availability  | System uptime                                                          | > 99%                  |
| NFR-005 | Security      | Semua transmisi data terenkripsi                                       | TLS 1.3                |
| NFR-006 | Security      | File validation multi-layer                                            | MIME + ext + magic bytes |
| NFR-007 | Security      | File auto-delete dari server                                           | Maksimum 60 menit      |
| NFR-008 | Security      | Rate limiting                                                          | 10 req/min/IP          |
| NFR-009 | Privacy       | Tidak ada logging konten file                                          | Zero content logging   |
| NFR-010 | Privacy       | Filename anonymization                                                 | UUID replacement       |
| NFR-011 | Usability     | Mobile-first responsive design                                         | Semua ukuran layar     |
| NFR-012 | Usability     | Bahasa Indonesia default                                               | 100% UI dalam Bahasa   |
| NFR-013 | SEO           | Core Web Vitals score                                                  | Good (semua hijau)     |
| NFR-014 | SEO           | Sitemap, robots.txt, Open Graph, Twitter Card                          | Tersedia dan valid     |
| NFR-015 | Scalability   | Concurrent users tanpa degradasi                                       | 100 concurrent         |
| NFR-016 | Cost          | Biaya infrastruktur bulanan (MVP)                                      | < $5/bulan             |
| NFR-017 | Reliability   | Auto-retry pada kegagalan task                                         | 1x retry otomatis      |
| NFR-018 | Compliance    | Kesadaran UU PDP (UU No. 27/2022)                                      | Privacy Policy tersedia |
| NFR-019 | Compliance    | GDPR awareness (untuk ekspansi internasional)                          | ToS & Privacy Policy   |

---

**10. Assumptions & Constraints**

**10.1 Asumsi**

1. Pengguna memiliki koneksi internet yang stabil untuk mengakses aplikasi (minimal 3G/4G).

2. Pengguna mengakses aplikasi terutama dari mobile browser (Chrome pada Android) dan desktop browser (Chrome/Edge).

3. Mayoritas file PDF yang diproses berukuran < 10MB (sesuai use case mahasiswa dan pekerja kantoran).

4. Vercel Free Tier dan Railway $5/bulan cukup untuk menangani traffic awal (< 1.000 tasks/hari).

5. Cloudflare R2 Free Tier (10GB storage, 10 juta read/bulan) cukup untuk volume MVP.

6. Pengguna Indonesia lebih memilih tool gratis tanpa login dibanding tool berbayar dengan fitur lebih lengkap.

7. Client-side processing (pdf-lib) cukup reliable di browser modern (Chrome 90+, Safari 15+, Firefox 90+).

**10.2 Constraints**

- Fase 1 hanya mendukung Bahasa Indonesia — English ditambahkan di Fase 2.

- Tidak ada login/registrasi di Fase 1 — semua akses anonim.

- Maksimum upload 20MB per file — limitasi dari infrastruktur free/low-cost.

- Tidak ada batch processing di MVP — satu file per operasi (kecuali merge dan image-to-pdf).

- Tidak ada offline mode — koneksi internet diperlukan untuk semua operasi.

- Budget infrastruktur sangat terbatas ($0-5/bulan) — self-funded, no external investment.

- Solo developer + AI agent — kapasitas development terbatas, prioritas pada kualitas over kuantitas.

- Tidak ada customer support formal — hanya FAQ page dan privacy policy.

---

**11. Dependencies**

> 🚧 **Migrasi backend sedang berlangsung**: Baris "Railway" akan diganti dengan "HostData.id VPS (NAT 4GB)" setelah migrasi selesai. Lihat [`docs/35_Papyr_VPS_Migration_Plan_v1.0.md`](./35_Papyr_VPS_Migration_Plan_v1.0.md).

| **Dependency**         | **Tipe**          | **Tujuan**                                                              | **Tingkat Risiko** |
|------------------------|-------------------|-------------------------------------------------------------------------|---------------------|
| Vercel                 | Platform          | Frontend hosting (Next.js), analytics, edge network                     | Rendah              |
| Railway                | Platform          | Backend hosting (FastAPI/Python), auto-scaling                           | Rendah              |
| Cloudflare R2          | Object Storage    | Penyimpanan sementara file yang diproses (auto-delete 60 menit)         | Rendah              |
| Ghostscript            | System Library    | Engine kompresi PDF di server                                           | Rendah              |
| PyMuPDF (fitz)         | Python Library    | PDF-to-Image conversion dan Image-to-PDF server fallback                | Rendah              |
| pdf-lib                | JS Library        | Client-side PDF operations (merge, split, rotate)                       | Rendah              |
| Vercel Analytics       | Analytics Service | Event tracking tanpa cookies (privacy-friendly)                         | Rendah              |
| Domain (mypapyr.com)   | External Service  | Domain utama produk                                                     | Rendah              |
| Let's Encrypt / Vercel | Security          | SSL/TLS certificate untuk HTTPS                                         | Rendah              |
| slowapi                | Python Library    | Rate limiting berbasis IP                                               | Rendah              |
| boto3                  | Python Library    | S3-compatible client untuk Cloudflare R2                                | Rendah              |

---

**12. Competitive Analysis Summary**

| **Aspek**              | **Papyr**                    | **iLovePDF**              | **SmallPDF**              | **Adobe Acrobat Online**  | **PDF24**                 | **Stirling PDF**          |
|------------------------|------------------------------|---------------------------|---------------------------|---------------------------|---------------------------|---------------------------|
| **Harga**              | Gratis (unlimited)           | Freemium (2-3 ops/hari)   | Freemium (2 ops/hari)     | Freemium (limited)        | Gratis                    | Gratis (self-host)        |
| **Bahasa Indonesia**   | Ya (default)                 | Tidak                     | Tidak                     | Tidak                     | Tidak                     | Tidak                     |
| **Server Dekat ID**    | Ya (Vercel Edge + Railway)   | Tidak (EU)                | Tidak (EU)                | Tidak (US)                | Tidak (DE)                | Self-host                 |
| **Client-Side**        | Ya (merge/split/rotate)      | Tidak                     | Tidak                     | Tidak                     | Sebagian                  | Tidak                     |
| **Login Required**     | Tidak                        | Tidak (tapi limited)      | Ya (untuk save)           | Ya                        | Tidak                     | Tidak                     |
| **Mobile UX**          | Excellent (mobile-first)     | Good                      | Good                      | Average                   | Average                   | Poor                      |
| **Privacy**            | Auto-delete 60min, no log    | Delete after processing   | Delete after 1 hour       | Adobe privacy policy      | Delete after processing   | Full control (self-host)  |
| **Tool Count**         | 6 (growing)                  | 25+                       | 20+                       | 15+                       | 30+                       | 40+                       |

**SWOT Analysis**

| **Strengths**                                          | **Weaknesses**                                         |
|--------------------------------------------------------|--------------------------------------------------------|
| Latensi rendah untuk pengguna Indonesia                | Tool count masih sedikit (6 vs 25+ kompetitor)         |
| Gratis tanpa paywall — unlimited usage                 | Brand awareness nol (baru launch)                      |
| Privacy-first (client-side + auto-delete)              | Solo developer — kapasitas terbatas                    |
| Bahasa Indonesia default                               | Tidak ada fitur advanced (OCR, edit, sign)             |
| Mobile-first design                                    | Tidak ada offline mode                                 |
| Biaya operasional sangat rendah                        | Belum ada social proof / testimonial                   |

| **Opportunities**                                      | **Threats**                                            |
|--------------------------------------------------------|--------------------------------------------------------|
| Pasar Indonesia besar (270M+ populasi, internet 77%)   | Kompetitor global bisa menambah Bahasa Indonesia       |
| Belum ada PDF tool lokal yang dominan                  | iLovePDF/SmallPDF bisa menurunkan harga               |
| SEO keyword "compress PDF" belum saturated di ID       | Biaya scaling jika traffic melonjak                    |
| Potensi B2B (UMKM, instansi pemerintah)               | Abuse/misuse (upload konten ilegal)                    |
| Ekspansi ke Southeast Asia (MY, PH, VN, TH)           | Tech debt jika growth terlalu cepat                    |

---

**13. Risk Assessment**

| **Risk ID** | **Risiko**                        | **Probabilitas** | **Dampak** | **Mitigasi**                                                                    |
|-------------|-----------------------------------|------------------|------------|---------------------------------------------------------------------------------|
| RSK-001     | Kompetitor menambah Bahasa ID     | Medium           | Medium     | Fokus pada speed + privacy sebagai differentiator, bukan hanya bahasa            |
| RSK-002     | Biaya scaling melonjak            | Low              | High       | Arsitektur client-side first, monitor cost per task, set budget alert            |
| RSK-003     | Abuse/misuse platform             | Medium           | Medium     | Rate limiting, file size limit, no persistent storage, monitoring                |
| RSK-004     | SEO competition dari incumbent    | High             | Medium     | Long-tail keyword strategy, konten lokal, technical SEO excellence               |
| RSK-005     | Tech debt dari solo development   | Medium           | Medium     | Automated testing, clean architecture, documentation, AI-assisted code review    |
| RSK-006     | Railway/Vercel pricing change     | Low              | High       | Arsitektur portable (Docker), siap migrasi ke VPS jika diperlukan               |
| RSK-007     | Data breach / privacy incident    | Low              | Critical   | No persistent storage, auto-delete, no content logging, security-first design   |

---

**14. Document Approval**

Dengan menandatangani di bawah ini, approver mengkonfirmasi bahwa mereka telah meninjau Business Requirements Document ini dan menyetujui bahwa dokumen ini secara akurat merepresentasikan business requirements untuk Papyr MVP.

|                   |                              |               |            |
|:------------------|:-----------------------------|:--------------|:-----------|
| **Peran**         | **Nama**                     | **Tanda Tangan** | **Tanggal** |
| **Product Owner** | Muhammad Fa'iz Zulfikar      | Approved      | 2026-05-03 |

Dokumen ini dapat berubah. Setiap modifikasi harus ditinjau dan disetujui ulang oleh semua penandatangan.
