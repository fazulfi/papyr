**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Postmortem Template**

Version 1.0 | Juni 2025

**CONFIDENTIAL**

mypapyr.com

---

## Informasi Dokumen

|                     |                                              |
|---------------------|----------------------------------------------|
| **Judul Dokumen**   | Postmortem Template — Papyr                  |
| **ID Dokumen**      | PPR-PM-001                                   |
| **Versi**           | 1.0                                          |
| **Status**          | Draft                                        |
| **Tanggal Dibuat**  | Juni 2025                                    |
| **Terakhir Diubah** | Juni 2025                                    |
| **Penulis**         | AI Agent (OpenCode/Sisyphus)                 |
| **Ditinjau Oleh**   | Product Owner (Muhammad Fa'iz Zulfikar)      |
| **Disetujui Oleh**  | Product Owner                                |
| **Kerahasiaan**     | Confidential — Internal & Investor Use Only  |

---

## Riwayat Versi

| **Versi** | **Tanggal** | **Penulis**                  | **Deskripsi**                                                        |
|-----------|-------------|------------------------------|----------------------------------------------------------------------|
| 1.0       | Juni 2025   | AI Agent (OpenCode/Sisyphus) | Rilis awal — Template postmortem lengkap untuk operasi AI-driven     |

---

## Dokumen Terkait

| **ID Dokumen** | **Judul**                                    | **Relevansi**                                      |
|----------------|----------------------------------------------|----------------------------------------------------|
| PPR-IR-001     | Incident Response Plan                       | Prosedur respons insiden, eskalasi, dan komunikasi |
| PPR-SLA-001    | Service Level Agreement                      | Target ketersediaan, metrik layanan, dan SLO       |
| PPR-SP-001     | Security Policy                              | Kebijakan keamanan dan manajemen kerentanan        |
| PPR-DR-001     | Deployment Runbook                           | Prosedur deployment, rollback, dan maintenance     |

---

## Daftar Isi

1. [Panduan Penggunaan Template](#1-panduan-penggunaan-template)
2. [Template Postmortem](#2-template-postmortem)
3. [Contoh Postmortem](#3-contoh-postmortem)
4. [Referensi Klasifikasi Severity](#4-referensi-klasifikasi-severity)
5. [Referensi Silang](#5-referensi-silang)
6. [Persetujuan Dokumen](#6-persetujuan-dokumen)

---

## 1. Panduan Penggunaan Template

### 1.1 Tujuan Dokumen

Dokumen ini menyediakan template standar untuk pembuatan laporan postmortem insiden pada platform Papyr (mypapyr.com). Template ini dirancang untuk memastikan setiap insiden didokumentasikan secara konsisten, komprehensif, dan berfokus pada pembelajaran — bukan menyalahkan individu.

Papyr beroperasi dengan model **100% AI-driven operations** di mana seluruh pengembangan, deployment, dan pemeliharaan dilakukan oleh AI Agent di bawah supervisi Product Owner. Template ini mengakomodasi konteks operasional tersebut.

### 1.2 Kapan Membuat Postmortem

Postmortem **WAJIB** dibuat untuk insiden dengan kriteria berikut:

| Kriteria                                      | Wajib Postmortem |
|-----------------------------------------------|:----------------:|
| Severity P0 (Critical) — layanan down total   | ✅ Ya            |
| Severity P1 (High) — fitur utama terganggu    | ✅ Ya            |
| Severity P2 (Medium) — fitur minor terganggu  | ⚠️ Opsional     |
| Severity P3 (Low) — kosmetik/minor            | ❌ Tidak         |
| Insiden keamanan (data breach, vulnerability) | ✅ Ya            |
| Insiden yang berdampak pada pengguna > 1 jam  | ✅ Ya            |
| Near-miss yang berpotensi P0/P1               | ⚠️ Dianjurkan   |

### 1.3 Timeline Pembuatan Postmortem

| Severity | Deadline Draft Postmortem | Deadline Final Postmortem |
|----------|---------------------------|---------------------------|
| P0       | 24 jam setelah resolusi   | 72 jam setelah resolusi   |
| P1       | 48 jam setelah resolusi   | 7 hari setelah resolusi   |
| P2       | 7 hari setelah resolusi   | 14 hari setelah resolusi  |

### 1.4 Prinsip Postmortem

1. **Blameless** — Fokus pada sistem dan proses, bukan menyalahkan individu atau AI Agent.
2. **Faktual** — Berdasarkan data, log, dan timeline yang terverifikasi.
3. **Actionable** — Setiap postmortem harus menghasilkan action items yang konkret dan terukur.
4. **Transparan** — Informasi dibagikan secara terbuka kepada stakeholder yang relevan.
5. **Iteratif** — Postmortem adalah dokumen hidup yang dapat diperbarui seiring ditemukannya informasi baru.

### 1.5 Cara Menggunakan Template

1. **Salin** seluruh Bagian 2 (Template Postmortem) ke dokumen baru.
2. **Beri nama file** dengan format: `PM-[YYYY]-[NNN]_[Judul_Singkat].md` (contoh: `PM-2025-001_API_Down_Railway_Deploy.md`).
3. **Isi** semua field placeholder `[...]` dengan informasi aktual insiden.
4. **Hapus** instruksi dalam tanda kurung siku setelah diisi.
5. **Review** bersama Product Owner sebelum finalisasi.
6. **Simpan** di direktori `docs/postmortems/` pada repository Papyr.

### 1.6 Penanggung Jawab

| Peran                  | Tanggung Jawab                                                    |
|------------------------|-------------------------------------------------------------------|
| **AI Agent**           | Menyusun draft postmortem, mengumpulkan log dan timeline          |
| **Product Owner**      | Review, approval, dan memastikan action items ditindaklanjuti     |
| **Incident Commander** | Memvalidasi timeline dan keputusan yang diambil selama insiden    |

---

## 2. Template Postmortem

> **Instruksi:** Salin seluruh bagian ini untuk setiap insiden baru. Isi semua field `[...]` dengan informasi aktual.

---

### POSTMORTEM: [Judul Singkat Insiden]

---

### 2.1 Informasi Insiden

| Field                  | Detail                                                |
|------------------------|-------------------------------------------------------|
| **ID Insiden**         | [PM-YYYY-NNN]                                         |
| **Tanggal Insiden**    | [YYYY-MM-DD]                                          |
| **Waktu Mulai**        | [HH:MM WIB]                                           |
| **Waktu Selesai**      | [HH:MM WIB]                                           |
| **Severity**           | [P0 / P1 / P2 / P3]                                  |
| **Durasi Total**       | [X jam Y menit]                                       |
| **Dampak**             | [Ringkasan singkat dampak pada pengguna]              |
| **Komponen Terdampak** | [Frontend / Backend / Storage / DNS / Seluruh Sistem] |
| **Status**             | [Draft / In Review / Final]                           |
| **Penulis**            | [Nama / AI Agent]                                     |
| **Tanggal Postmortem** | [YYYY-MM-DD]                                          |

---

### 2.2 Ringkasan Eksekutif

[Tulis 1-2 paragraf yang merangkum insiden secara keseluruhan. Paragraf pertama menjelaskan APA yang terjadi dan DAMPAK-nya. Paragraf kedua menjelaskan PENYEBAB utama dan RESOLUSI yang dilakukan.]

[Contoh format: "Pada tanggal [tanggal], layanan [komponen] mengalami [jenis gangguan] selama [durasi]. Insiden ini berdampak pada [jumlah/persentase] pengguna yang tidak dapat [aksi yang terganggu]. Penyebab utama adalah [root cause singkat]. Insiden berhasil diselesaikan dengan [tindakan resolusi]."]

---

### 2.3 Timeline Insiden

> **Instruksi:** Dokumentasikan setiap event penting secara kronologis. Gunakan zona waktu WIB (UTC+7). Sertakan waktu deteksi, eskalasi, tindakan, dan resolusi.

| **Waktu (WIB)** | **Event**                                                    | **Aktor**          |
|------------------|--------------------------------------------------------------|--------------------|
| [HH:MM]          | [Insiden dimulai — deskripsi trigger awal]                   | [Sistem/Otomatis]  |
| [HH:MM]          | [Alert terdeteksi — sumber deteksi]                          | [Monitoring/User]  |
| [HH:MM]          | [Investigasi dimulai — langkah pertama yang diambil]         | [AI Agent/PO]      |
| [HH:MM]          | [Root cause teridentifikasi — temuan utama]                  | [AI Agent]         |
| [HH:MM]          | [Tindakan mitigasi dilakukan — deskripsi aksi]               | [AI Agent]         |
| [HH:MM]          | [Layanan pulih — konfirmasi pemulihan]                       | [Sistem/Otomatis]  |
| [HH:MM]          | [Insiden ditutup — konfirmasi stabilitas]                    | [Product Owner]    |

---

### 2.4 Analisis Akar Masalah (Root Cause Analysis)

#### 2.4.1 Deskripsi Root Cause

[Jelaskan penyebab utama insiden secara teknis dan detail. Sertakan referensi ke log, error message, atau konfigurasi yang relevan.]

#### 2.4.2 Analisis 5 Whys

| # | Pertanyaan                                                | Jawaban                                                       |
|---|-----------------------------------------------------------|---------------------------------------------------------------|
| 1 | Mengapa insiden terjadi?                                  | [Jawaban level 1 — gejala langsung]                           |
| 2 | Mengapa [jawaban 1] terjadi?                              | [Jawaban level 2 — penyebab menengah]                         |
| 3 | Mengapa [jawaban 2] terjadi?                              | [Jawaban level 3 — penyebab lebih dalam]                      |
| 4 | Mengapa [jawaban 3] terjadi?                              | [Jawaban level 4 — penyebab sistemik]                         |
| 5 | Mengapa [jawaban 4] terjadi?                              | [Jawaban level 5 — akar masalah fundamental]                  |

#### 2.4.3 Faktor Kontributor

- [Faktor 1 — misalnya: kurangnya automated testing pada deployment pipeline]
- [Faktor 2 — misalnya: tidak ada canary deployment]
- [Faktor 3 — misalnya: monitoring alert threshold terlalu tinggi]

---

### 2.5 Dampak

#### 2.5.1 Dampak pada Pengguna

| Metrik                          | Detail                                              |
|---------------------------------|-----------------------------------------------------|
| **Jumlah pengguna terdampak**   | [Estimasi jumlah atau persentase]                   |
| **Fitur yang tidak tersedia**   | [Daftar fitur yang terganggu]                       |
| **Durasi dampak pada pengguna** | [Berapa lama pengguna merasakan gangguan]           |
| **Error yang dilihat pengguna** | [Pesan error atau perilaku yang dialami]            |

#### 2.5.2 Dampak pada Data

| Aspek                    | Detail                                                     |
|--------------------------|------------------------------------------------------------|
| **Data hilang**          | [Ya/Tidak — jika ya, jelaskan scope]                       |
| **Data terekspos**       | [Ya/Tidak — jika ya, jelaskan scope dan tindakan]          |
| **Integritas data**      | [Apakah ada data yang corrupt atau inconsistent]           |
| **File pengguna**        | [Apakah file yang sedang diproses terpengaruh]             |

#### 2.5.3 Dampak Finansial

| Aspek                    | Detail                                                     |
|--------------------------|------------------------------------------------------------|
| **Biaya infrastruktur**  | [Biaya tambahan akibat insiden, jika ada]                  |
| **Potensi revenue loss** | [Estimasi kerugian pendapatan, jika applicable]            |
| **Biaya resolusi**       | [Biaya yang dikeluarkan untuk menyelesaikan insiden]       |

#### 2.5.4 Dampak Reputasi

| Aspek                    | Detail                                                     |
|--------------------------|------------------------------------------------------------|
| **Keluhan pengguna**     | [Jumlah dan channel — email, social media, dll]            |
| **Liputan media**        | [Ya/Tidak — jika ya, detail]                               |
| **Dampak SEO**           | [Apakah ada dampak pada ranking atau indexing]             |
| **Trust score**          | [Estimasi dampak pada kepercayaan pengguna]                |

---

### 2.6 Respons & Resolusi

#### 2.6.1 Deteksi

| Aspek                    | Detail                                                     |
|--------------------------|------------------------------------------------------------|
| **Metode deteksi**       | [Monitoring otomatis / Laporan pengguna / Manual check]    |
| **Waktu deteksi**        | [Berapa lama dari mulai insiden hingga terdeteksi]         |
| **Alert yang trigger**   | [Nama alert/monitoring yang mendeteksi]                    |

#### 2.6.2 Tindakan yang Dilakukan

| # | Tindakan                                                  | Pelaku        | Waktu     | Hasil          |
|---|-----------------------------------------------------------|---------------|-----------|----------------|
| 1 | [Tindakan pertama yang diambil]                           | [AI Agent/PO] | [HH:MM]   | [Berhasil/Gagal] |
| 2 | [Tindakan kedua yang diambil]                             | [AI Agent/PO] | [HH:MM]   | [Berhasil/Gagal] |
| 3 | [Tindakan resolusi final]                                 | [AI Agent/PO] | [HH:MM]   | [Berhasil/Gagal] |

#### 2.6.3 Rollback (Jika Dilakukan)

| Aspek                    | Detail                                                     |
|--------------------------|------------------------------------------------------------|
| **Rollback dilakukan?**  | [Ya/Tidak]                                                 |
| **Versi rollback**       | [Dari versi X ke versi Y]                                  |
| **Waktu rollback**       | [Berapa lama proses rollback]                              |
| **Dampak rollback**      | [Apakah ada side effect dari rollback]                     |

---

### 2.7 Apa yang Berjalan Baik

> **Instruksi:** Dokumentasikan hal-hal positif selama penanganan insiden. Ini penting untuk memperkuat praktik yang sudah baik.

- [Hal positif 1 — misalnya: monitoring mendeteksi insiden dalam < 5 menit]
- [Hal positif 2 — misalnya: rollback procedure berjalan sesuai runbook]
- [Hal positif 3 — misalnya: komunikasi antar tim berjalan efektif]
- [Hal positif 4 — misalnya: dokumentasi deployment membantu percepat resolusi]

---

### 2.8 Apa yang Perlu Diperbaiki

> **Instruksi:** Dokumentasikan area yang perlu improvement. Fokus pada proses dan sistem, bukan individu.

- [Area perbaikan 1 — misalnya: alert threshold perlu diturunkan untuk deteksi lebih cepat]
- [Area perbaikan 2 — misalnya: perlu automated rollback untuk deployment gagal]
- [Area perbaikan 3 — misalnya: runbook perlu diperbarui untuk skenario ini]
- [Area perbaikan 4 — misalnya: perlu staging environment untuk testing sebelum production]

---

### 2.9 Action Items

> **Instruksi:** Setiap action item harus SMART (Specific, Measurable, Achievable, Relevant, Time-bound).

| **ID**   | **Deskripsi**                                              | **PIC**        | **Deadline**   | **Status**     | **Prioritas** |
|----------|------------------------------------------------------------|----------------|----------------|----------------|---------------|
| AI-001   | [Deskripsi action item 1]                                  | [AI Agent/PO]  | [YYYY-MM-DD]   | [Open/In Progress/Done] | [P0/P1/P2] |
| AI-002   | [Deskripsi action item 2]                                  | [AI Agent/PO]  | [YYYY-MM-DD]   | [Open/In Progress/Done] | [P0/P1/P2] |
| AI-003   | [Deskripsi action item 3]                                  | [AI Agent/PO]  | [YYYY-MM-DD]   | [Open/In Progress/Done] | [P0/P1/P2] |
| AI-004   | [Deskripsi action item 4]                                  | [AI Agent/PO]  | [YYYY-MM-DD]   | [Open/In Progress/Done] | [P0/P1/P2] |

---

### 2.10 Pelajaran yang Dipetik

> **Instruksi:** Rangkum insight utama yang didapat dari insiden ini. Fokus pada pembelajaran yang dapat diterapkan untuk mencegah insiden serupa di masa depan.

1. **[Judul Pelajaran 1]** — [Penjelasan detail tentang apa yang dipelajari dan bagaimana ini mengubah pendekatan ke depan.]
2. **[Judul Pelajaran 2]** — [Penjelasan detail tentang apa yang dipelajari dan bagaimana ini mengubah pendekatan ke depan.]
3. **[Judul Pelajaran 3]** — [Penjelasan detail tentang apa yang dipelajari dan bagaimana ini mengubah pendekatan ke depan.]

---

### 2.11 Pencegahan

> **Instruksi:** Dokumentasikan langkah-langkah preventif yang akan diimplementasikan untuk mencegah insiden serupa terulang.

#### 2.11.1 Pencegahan Jangka Pendek (< 1 Minggu)

| # | Tindakan Preventif                                        | PIC           | Target Selesai |
|---|-----------------------------------------------------------|---------------|----------------|
| 1 | [Tindakan preventif segera 1]                             | [AI Agent/PO] | [YYYY-MM-DD]   |
| 2 | [Tindakan preventif segera 2]                             | [AI Agent/PO] | [YYYY-MM-DD]   |

#### 2.11.2 Pencegahan Jangka Menengah (1-4 Minggu)

| # | Tindakan Preventif                                        | PIC           | Target Selesai |
|---|-----------------------------------------------------------|---------------|----------------|
| 1 | [Tindakan preventif menengah 1]                           | [AI Agent/PO] | [YYYY-MM-DD]   |
| 2 | [Tindakan preventif menengah 2]                           | [AI Agent/PO] | [YYYY-MM-DD]   |

#### 2.11.3 Pencegahan Jangka Panjang (> 1 Bulan)

| # | Tindakan Preventif                                        | PIC           | Target Selesai |
|---|-----------------------------------------------------------|---------------|----------------|
| 1 | [Tindakan preventif jangka panjang 1]                     | [AI Agent/PO] | [YYYY-MM-DD]   |
| 2 | [Tindakan preventif jangka panjang 2]                     | [AI Agent/PO] | [YYYY-MM-DD]   |

---

## 3. Contoh Postmortem

> **Catatan:** Contoh berikut adalah skenario hipotetis untuk mendemonstrasikan cara pengisian template. Papyr belum pernah mengalami insiden produksi hingga saat dokumen ini dibuat.

---

### POSTMORTEM: API Down 30 Menit — Railway Deployment Gagal

---

### 3.1 Informasi Insiden

| Field                  | Detail                                                        |
|------------------------|---------------------------------------------------------------|
| **ID Insiden**         | PM-2025-001                                                   |
| **Tanggal Insiden**    | 2025-07-15                                                    |
| **Waktu Mulai**        | 14:23 WIB                                                     |
| **Waktu Selesai**      | 14:53 WIB                                                     |
| **Severity**           | P1 (High)                                                     |
| **Durasi Total**       | 30 menit                                                      |
| **Dampak**             | Seluruh fitur server-side (Compress, PDF to Image) tidak tersedia |
| **Komponen Terdampak** | Backend API (Railway)                                         |
| **Status**             | Final                                                         |
| **Penulis**            | AI Agent (OpenCode/Sisyphus)                                  |
| **Tanggal Postmortem** | 2025-07-16                                                    |

---

### 3.2 Ringkasan Eksekutif

Pada tanggal 15 Juli 2025 pukul 14:23 WIB, layanan backend API Papyr yang di-host di Railway mengalami downtime total selama 30 menit. Insiden ini disebabkan oleh kegagalan deployment otomatis yang dipicu oleh push ke branch `main`. Container baru gagal start karena incompatible dependency version pada `PyMuPDF`, menyebabkan health check gagal dan Railway tidak melakukan traffic routing ke container baru — sementara container lama sudah di-terminate.

Insiden berdampak pada seluruh pengguna yang menggunakan fitur server-side (Compress PDF, Image to PDF fallback, dan PDF to Image) selama 30 menit. Fitur client-side (Merge, Split, Rotate) tetap berfungsi normal. Estimasi 45-60 pengguna terdampak berdasarkan rata-rata traffic pada jam tersebut. Resolusi dilakukan dengan rollback ke deployment sebelumnya melalui Railway dashboard.

---

### 3.3 Timeline Insiden

| **Waktu (WIB)** | **Event**                                                              | **Aktor**         |
|------------------|------------------------------------------------------------------------|-------------------|
| 14:20            | AI Agent push commit ke branch `main` (update dependency PyMuPDF)      | AI Agent          |
| 14:21            | Railway auto-deploy triggered, build dimulai                           | Railway (Otomatis)|
| 14:23            | Build selesai, container baru gagal start — error `ImportError`        | Railway (Otomatis)|
| 14:23            | Container lama di-terminate, traffic routing gagal                     | Railway (Otomatis)|
| 14:23            | API endpoint `/health` mulai return 502                                | Sistem            |
| 14:25            | Vercel Analytics mendeteksi spike error rate pada API calls            | Monitoring        |
| 14:27            | Product Owner menerima notifikasi dari Railway deployment failed       | Product Owner     |
| 14:28            | AI Agent mulai investigasi — cek Railway logs                          | AI Agent          |
| 14:32            | Root cause teridentifikasi — PyMuPDF 1.25.0 incompatible dengan Python 3.11 | AI Agent    |
| 14:35            | Keputusan: rollback ke deployment sebelumnya                           | Product Owner     |
| 14:37            | Rollback dieksekusi via Railway dashboard                              | AI Agent          |
| 14:40            | Container lama berhasil di-redeploy, health check passing              | Railway (Otomatis)|
| 14:42            | API endpoint `/health` kembali return 200 OK                           | Sistem            |
| 14:45            | Verifikasi seluruh endpoint berfungsi normal                           | AI Agent          |
| 14:53            | Insiden ditutup setelah 10 menit stabilitas terkonfirmasi              | Product Owner     |

---

### 3.4 Analisis Akar Masalah

#### 3.4.1 Deskripsi Root Cause

Deployment gagal karena update dependency `PyMuPDF` dari versi 1.24.3 ke 1.25.0 yang memiliki breaking change pada API internal. Versi 1.25.0 membutuhkan Python 3.12+, sementara container Papyr menggunakan Python 3.11. Hal ini menyebabkan `ImportError` saat container startup, sehingga FastAPI application gagal initialize.

Railway dikonfigurasi dengan zero-downtime deployment, namun karena container lama sudah di-terminate sebelum container baru confirmed healthy (race condition pada free/hobby tier), terjadi gap di mana tidak ada container yang melayani traffic.

#### 3.4.2 Analisis 5 Whys

| # | Pertanyaan                                                | Jawaban                                                                    |
|---|-----------------------------------------------------------|----------------------------------------------------------------------------|
| 1 | Mengapa API down?                                         | Container baru gagal start dan container lama sudah di-terminate           |
| 2 | Mengapa container baru gagal start?                       | `ImportError` pada PyMuPDF 1.25.0 yang incompatible dengan Python 3.11    |
| 3 | Mengapa dependency incompatible lolos ke production?      | Tidak ada version pinning yang ketat di `requirements.txt` (menggunakan `>=`) |
| 4 | Mengapa tidak ada testing sebelum deploy ke production?   | Belum ada CI/CD pipeline dengan automated testing dan staging environment  |
| 5 | Mengapa belum ada CI/CD pipeline?                         | Prioritas MVP fokus pada fitur, infrastruktur CI/CD belum di-scope         |

#### 3.4.3 Faktor Kontributor

- Tidak ada version pinning yang ketat pada `requirements.txt` (menggunakan `>=` alih-alih `==`).
- Tidak ada staging environment untuk testing deployment sebelum production.
- Railway hobby tier memiliki keterbatasan pada zero-downtime deployment.
- Tidak ada automated rollback ketika health check gagal dalam threshold waktu tertentu.

---

### 3.5 Dampak

#### 3.5.1 Dampak pada Pengguna

| Metrik                          | Detail                                                        |
|---------------------------------|---------------------------------------------------------------|
| **Jumlah pengguna terdampak**   | Estimasi 45-60 pengguna (berdasarkan avg traffic 14:00-15:00) |
| **Fitur yang tidak tersedia**   | Compress PDF, Image to PDF (server fallback), PDF to Image    |
| **Durasi dampak pada pengguna** | 30 menit (14:23 — 14:53 WIB)                                 |
| **Error yang dilihat pengguna** | "Gagal memproses file. Silakan coba lagi nanti." (error toast)|

#### 3.5.2 Dampak pada Data

| Aspek                    | Detail                                                     |
|--------------------------|------------------------------------------------------------|
| **Data hilang**          | Tidak — file yang sedang diproses saat insiden gagal upload, tidak ada data loss |
| **Data terekspos**       | Tidak — tidak ada data breach                              |
| **Integritas data**      | Tidak terpengaruh — R2 storage tetap intact                |
| **File pengguna**        | File yang sedang di-upload saat insiden perlu di-upload ulang oleh pengguna |

#### 3.5.3 Dampak Finansial

| Aspek                    | Detail                                                     |
|--------------------------|------------------------------------------------------------|
| **Biaya infrastruktur**  | Tidak ada biaya tambahan (Railway flat rate $5/bulan)       |
| **Potensi revenue loss** | Tidak applicable (layanan gratis pada fase MVP)            |
| **Biaya resolusi**       | $0 — resolusi dilakukan oleh AI Agent tanpa biaya tambahan |

#### 3.5.4 Dampak Reputasi

| Aspek                    | Detail                                                     |
|--------------------------|------------------------------------------------------------|
| **Keluhan pengguna**     | 0 keluhan formal (belum ada channel feedback aktif)        |
| **Liputan media**        | Tidak ada                                                  |
| **Dampak SEO**           | Minimal — downtime 30 menit tidak mempengaruhi crawling    |
| **Trust score**          | Dampak rendah — pengguna baru, belum ada ekspektasi SLA publik |

---

### 3.6 Respons & Resolusi

#### 3.6.1 Deteksi

| Aspek                    | Detail                                                     |
|--------------------------|------------------------------------------------------------|
| **Metode deteksi**       | Railway deployment notification + Vercel error spike       |
| **Waktu deteksi**        | 4 menit dari mulai insiden (14:23 → 14:27)                |
| **Alert yang trigger**   | Railway "Deploy Failed" email notification                 |

#### 3.6.2 Tindakan yang Dilakukan

| # | Tindakan                                                  | Pelaku        | Waktu   | Hasil    |
|---|-----------------------------------------------------------|---------------|---------|----------|
| 1 | Cek Railway deployment logs untuk identifikasi error      | AI Agent      | 14:28   | Berhasil |
| 2 | Identifikasi root cause: PyMuPDF version incompatibility  | AI Agent      | 14:32   | Berhasil |
| 3 | Rollback ke deployment sebelumnya via Railway dashboard    | AI Agent      | 14:37   | Berhasil |
| 4 | Verifikasi health check dan seluruh endpoint              | AI Agent      | 14:45   | Berhasil |

#### 3.6.3 Rollback

| Aspek                    | Detail                                                     |
|--------------------------|------------------------------------------------------------|
| **Rollback dilakukan?**  | Ya                                                         |
| **Versi rollback**       | Dari commit `a3f7b2c` (PyMuPDF 1.25.0) ke `e9d1a4f` (PyMuPDF 1.24.3) |
| **Waktu rollback**       | 5 menit (14:37 → 14:42)                                   |
| **Dampak rollback**      | Tidak ada side effect — kembali ke state stabil sebelumnya |

---

### 3.7 Apa yang Berjalan Baik

- Railway deployment notification terkirim dalam 4 menit, memungkinkan respons cepat.
- Rollback procedure sederhana dan efektif melalui Railway dashboard.
- Fitur client-side (Merge, Split, Rotate) tetap berfungsi karena arsitektur hybrid client/server.
- AI Agent mampu mengidentifikasi root cause dalam 4 menit setelah mulai investigasi.
- Tidak ada data loss atau security breach selama insiden.

---

### 3.8 Apa yang Perlu Diperbaiki

- Perlu version pinning yang ketat (`==`) pada seluruh dependency di `requirements.txt`.
- Perlu CI/CD pipeline dengan automated testing sebelum deployment ke production.
- Perlu staging environment untuk validasi deployment sebelum production.
- Railway deployment strategy perlu dikonfigurasi agar container lama tidak di-terminate sebelum container baru healthy.
- Perlu automated health check monitoring yang lebih proaktif (bukan hanya bergantung pada Railway notification).
- Perlu status page publik agar pengguna tahu ketika ada gangguan.

---

### 3.9 Action Items

| **ID**   | **Deskripsi**                                                          | **PIC**        | **Deadline**   | **Status** | **Prioritas** |
|----------|------------------------------------------------------------------------|----------------|----------------|------------|---------------|
| AI-001   | Pin semua dependency ke exact version di `requirements.txt`            | AI Agent       | 2025-07-17     | Done       | P0            |
| AI-002   | Tambahkan `requirements.txt` lock file (pip-compile)                   | AI Agent       | 2025-07-20     | Done       | P1            |
| AI-003   | Setup GitHub Actions CI pipeline dengan basic testing                  | AI Agent       | 2025-07-25     | In Progress| P1            |
| AI-004   | Konfigurasi Railway health check grace period yang lebih panjang       | AI Agent       | 2025-07-18     | Done       | P1            |
| AI-005   | Implementasi external uptime monitoring (UptimeRobot/Betterstack)      | AI Agent       | 2025-07-30     | Open       | P2            |
| AI-006   | Evaluasi staging environment di Railway (dev service)                  | Product Owner  | 2025-08-15     | Open       | P2            |

---

### 3.10 Pelajaran yang Dipetik

1. **Version pinning adalah keharusan** — Menggunakan `>=` pada dependency production adalah risiko tinggi. Seluruh dependency harus di-pin ke exact version dan di-update secara deliberate dengan testing.

2. **Arsitektur hybrid melindungi dari total outage** — Keputusan arsitektur untuk memproses operasi ringan di client-side terbukti memberikan graceful degradation. Pengguna Merge/Split/Rotate tidak terdampak sama sekali.

3. **Automated rollback lebih baik dari manual** — Meskipun rollback manual berhasil dalam 5 menit, automated rollback pada health check failure akan mengurangi downtime secara signifikan.

---

### 3.11 Pencegahan

#### 3.11.1 Pencegahan Jangka Pendek (< 1 Minggu)

| # | Tindakan Preventif                                        | PIC           | Target Selesai |
|---|-----------------------------------------------------------|---------------|----------------|
| 1 | Pin semua dependency ke exact version                     | AI Agent      | 2025-07-17     |
| 2 | Konfigurasi Railway health check grace period 60 detik    | AI Agent      | 2025-07-18     |

#### 3.11.2 Pencegahan Jangka Menengah (1-4 Minggu)

| # | Tindakan Preventif                                        | PIC           | Target Selesai |
|---|-----------------------------------------------------------|---------------|----------------|
| 1 | Setup CI/CD pipeline dengan dependency compatibility test | AI Agent      | 2025-07-25     |
| 2 | Implementasi external uptime monitoring                   | AI Agent      | 2025-07-30     |

#### 3.11.3 Pencegahan Jangka Panjang (> 1 Bulan)

| # | Tindakan Preventif                                        | PIC           | Target Selesai |
|---|-----------------------------------------------------------|---------------|----------------|
| 1 | Setup staging environment untuk pre-production validation | Product Owner | 2025-08-15     |
| 2 | Implementasi automated rollback pada deployment failure   | AI Agent      | 2025-09-01     |

---

## 4. Referensi Klasifikasi Severity

> **Referensi:** Klasifikasi ini selaras dengan PPR-IR-001 (Incident Response Plan) dan PPR-SLA-001 (Service Level Agreement).

### 4.1 Definisi Severity Level

| **Severity** | **Label**    | **Definisi**                                                                 | **Contoh pada Papyr**                                              |
|--------------|--------------|------------------------------------------------------------------------------|--------------------------------------------------------------------|
| **P0**       | Critical     | Seluruh layanan down, tidak ada workaround, berdampak pada semua pengguna   | mypapyr.com tidak dapat diakses sama sekali (DNS/Vercel down)      |
| **P1**       | High         | Fitur utama tidak berfungsi, workaround terbatas, berdampak signifikan      | Backend API down — Compress & PDF to Image tidak tersedia           |
| **P2**       | Medium       | Fitur minor terganggu, workaround tersedia, dampak terbatas                 | Image to PDF server fallback gagal, tapi client-side masih bekerja |
| **P3**       | Low          | Masalah kosmetik atau minor, tidak berdampak pada fungsionalitas inti       | Typo pada UI, styling glitch pada browser tertentu                 |

### 4.2 Matriks Severity vs Dampak

| **Severity** | **Ketersediaan**       | **Pengguna Terdampak** | **Data Impact** | **Target Resolusi** |
|--------------|------------------------|------------------------|-----------------|---------------------|
| **P0**       | Total outage           | 100% pengguna          | Potensi loss    | < 1 jam             |
| **P1**       | Partial outage         | > 50% pengguna         | Tidak ada       | < 4 jam             |
| **P2**       | Degraded performance   | < 50% pengguna         | Tidak ada       | < 24 jam            |
| **P3**       | Minimal impact         | < 10% pengguna         | Tidak ada       | < 7 hari            |

### 4.3 Eskalasi Berdasarkan Severity

| **Severity** | **Notifikasi**                    | **Eskalasi**                          | **Postmortem**     |
|--------------|-----------------------------------|---------------------------------------|--------------------|
| **P0**       | Immediate — semua channel         | Product Owner + AI Agent segera       | Wajib (24 jam)     |
| **P1**       | < 15 menit                        | Product Owner informed                | Wajib (48 jam)     |
| **P2**       | < 1 jam                           | AI Agent handle, PO informed          | Opsional           |
| **P3**       | Next business day                 | AI Agent handle                       | Tidak diperlukan   |

---

## 5. Referensi Silang

### 5.1 Dokumen Terkait

| **ID Dokumen** | **Judul**                          | **Relevansi dengan Postmortem**                                    |
|----------------|------------------------------------|--------------------------------------------------------------------|
| PPR-IR-001     | Incident Response Plan             | Prosedur respons insiden yang dijalankan sebelum postmortem dibuat. Postmortem adalah output dari proses incident response. |
| PPR-SLA-001    | Service Level Agreement            | Mendefinisikan target ketersediaan dan metrik layanan yang menjadi baseline untuk menilai severity dan dampak insiden. |
| PPR-SP-001     | Security Policy                    | Kebijakan keamanan yang relevan jika insiden melibatkan aspek keamanan atau data breach. |
| PPR-DR-001     | Deployment Runbook                 | Prosedur deployment dan rollback yang direferensikan dalam resolusi insiden. |
| PPR-TDD-001    | Technical Design Document          | Arsitektur sistem yang membantu analisis root cause dan dampak insiden. |

### 5.2 Alur Proses: Insiden → Postmortem

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   DETEKSI       │────▶│   RESPONS       │────▶│   RESOLUSI      │────▶│   POSTMORTEM    │
│   (PPR-IR-001)  │     │   (PPR-IR-001)  │     │   (PPR-DR-001)  │     │   (PPR-PM-001)  │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ • Monitoring    │     │ • Triage        │     │ • Fix/Rollback  │     │ • Timeline      │
│ • Alert        │     │ • Eskalasi      │     │ • Verifikasi    │     │ • Root Cause    │
│ • Notifikasi   │     │ • Komunikasi    │     │ • Stabilisasi   │     │ • Action Items  │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 5.3 Penyimpanan & Penamaan File

| Aspek              | Standar                                                          |
|--------------------|------------------------------------------------------------------|
| **Direktori**      | `docs/postmortems/`                                              |
| **Format nama**    | `PM-[YYYY]-[NNN]_[Judul_Singkat].md`                            |
| **Contoh**         | `PM-2025-001_API_Down_Railway_Deploy.md`                         |
| **Versi kontrol**  | Git — setiap update postmortem di-commit dengan pesan deskriptif |
| **Retensi**        | Permanen — postmortem tidak pernah dihapus                       |

---

## 6. Persetujuan Dokumen

### 6.1 Tanda Tangan Persetujuan

| **Peran**                | **Nama**                          | **Status**   | **Tanggal**  |
|--------------------------|-----------------------------------|--------------|--------------|
| Product Owner            | Muhammad Fa'iz Zulfikar           | Approved     | Juni 2025    |
| AI Agent                 | OpenCode/Sisyphus                 | Approved     | Juni 2025    |

### 6.2 Catatan Persetujuan

Dokumen ini telah ditinjau dan disetujui sebagai template standar untuk pembuatan laporan postmortem insiden pada platform Papyr. Template ini berlaku efektif sejak tanggal persetujuan dan wajib digunakan untuk seluruh insiden yang memenuhi kriteria postmortem sebagaimana didefinisikan pada Bagian 1.2.

### 6.3 Jadwal Peninjauan

| Aspek                    | Detail                                                     |
|--------------------------|------------------------------------------------------------|
| **Frekuensi review**     | Setiap 6 bulan atau setelah insiden P0/P1                  |
| **Review berikutnya**    | Desember 2025                                              |
| **Penanggung jawab**     | Product Owner + AI Agent                                   |

---

*Dokumen ini adalah template internal Papyr. Seluruh insiden yang memenuhi kriteria wajib didokumentasikan menggunakan format ini untuk memastikan konsistensi, akuntabilitas, dan pembelajaran berkelanjutan.*

---

**— Akhir Dokumen —**
