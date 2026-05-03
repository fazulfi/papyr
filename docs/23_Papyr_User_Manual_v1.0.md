**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**User Manual**

Version 1.0

Juni 2025

**CONFIDENTIAL**

mypapyr.com

---

**Informasi Dokumen**

|                     |                                                      |
|---------------------|------------------------------------------------------|
| **Judul Dokumen**   | User Manual — Papyr                                  |
| **ID Dokumen**      | PPR-UM-001                                           |
| **Versi**           | 1.0                                                  |
| **Status**          | Draft                                                |
| **Tanggal Dibuat**  | Juni 2025                                            |
| **Terakhir Diubah** | Juni 2025                                            |
| **Penulis**         | AI Agent (OpenCode/Sisyphus)                         |
| **Ditinjau Oleh**   | Product Owner (Muhammad Fa'iz Zulfikar)              |
| **Disetujui Oleh**  | Product Owner                                        |
| **Kerahasiaan**     | Confidential                                         |

**Riwayat Versi**

| **Versi** | **Tanggal** | **Penulis**                  | **Deskripsi**                                                                                      |
|-----------|-------------|------------------------------|----------------------------------------------------------------------------------------------------|
| 1.0       | Juni 2025   | AI Agent (OpenCode/Sisyphus) | Draft awal — User Manual lengkap untuk 6 tool PDF aktif di MVP 1.1, mencakup panduan pengguna dan informasi teknis untuk developer |

**Referensi Silang**

| **Dokumen**                          | **ID**       | **Relasi**                                    |
|--------------------------------------|--------------|-----------------------------------------------|
| Business Requirements Document       | PPR-BRD-001  | Sumber business rules & batasan               |
| Software Requirements Specification  | PPR-SRS-001  | Detail functional requirements                |
| Technical Design Document            | PPR-TDD-001  | Arsitektur teknis & keputusan desain          |
| API Specification                    | PPR-API-001  | Spesifikasi endpoint backend                  |
| Security Policy                      | PPR-SP-001   | Kebijakan keamanan & privasi                  |

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Memulai](#2-memulai)
3. [Panduan Tool — Kompres PDF](#3-panduan-tool--kompres-pdf)
4. [Panduan Tool — Gabungkan PDF](#4-panduan-tool--gabungkan-pdf)
5. [Panduan Tool — Pisahkan PDF](#5-panduan-tool--pisahkan-pdf)
6. [Panduan Tool — Gambar ke PDF](#6-panduan-tool--gambar-ke-pdf)
7. [Panduan Tool — PDF ke Gambar](#7-panduan-tool--pdf-ke-gambar)
8. [Panduan Tool — Putar PDF](#8-panduan-tool--putar-pdf)
9. [Batasan & Limitasi](#9-batasan--limitasi)
10. [Privasi & Keamanan](#10-privasi--keamanan)
11. [FAQ (Pertanyaan Umum)](#11-faq-pertanyaan-umum)
12. [Troubleshooting](#12-troubleshooting)
13. [Untuk Developer](#13-untuk-developer)
14. [Kontak & Dukungan](#14-kontak--dukungan)
15. [Persetujuan Dokumen](#15-persetujuan-dokumen)

---

## 1. Pendahuluan

### 1.1 Apa Itu Papyr?

Papyr adalah aplikasi web utilitas PDF yang dirancang khusus untuk pengguna Indonesia. Papyr menyediakan berbagai alat pengolahan PDF yang dapat diakses langsung dari browser — tanpa perlu mengunduh software, tanpa perlu membuat akun, dan tanpa biaya.

Papyr tersedia di **[mypapyr.com](https://mypapyr.com)**.

### 1.2 Untuk Siapa Papyr?

Papyr dirancang untuk siapa saja yang bekerja dengan file PDF dalam keseharian:

| **Pengguna**          | **Kebutuhan Umum**                                                                 |
|-----------------------|------------------------------------------------------------------------------------|
| **Mahasiswa**         | Kompres PDF tugas agar bisa di-upload ke portal kampus, gabungkan beberapa file tugas menjadi satu |
| **Pekerja Kantoran**  | Perkecil ukuran PDF untuk dikirim via email atau WhatsApp, pisahkan halaman tertentu dari dokumen panjang |
| **Freelancer**        | Konversi gambar desain ke PDF untuk portofolio, putar halaman dokumen yang terbalik |
| **UMKM**             | Gabungkan invoice dan kwitansi menjadi satu file, konversi PDF ke gambar untuk posting di media sosial |
| **Developer**         | Memahami arsitektur sistem, API endpoint, dan cara berkontribusi pada proyek       |

### 1.3 Fitur Utama

Papyr saat ini menyediakan **6 tool PDF** yang aktif:

| **No** | **Tool**          | **Fungsi**                                                    | **Pemrosesan**          |
|--------|-------------------|---------------------------------------------------------------|-------------------------|
| 1      | Kompres PDF       | Perkecil ukuran file PDF hingga 80% tanpa kehilangan kualitas baca | Server (Ghostscript)    |
| 2      | Gabungkan PDF     | Gabungkan beberapa file PDF menjadi satu dokumen              | Client (browser)        |
| 3      | Pisahkan PDF      | Pisahkan halaman tertentu dari file PDF                       | Client (browser)        |
| 4      | Gambar ke PDF     | Konversi gambar JPG/PNG/WEBP menjadi file PDF                 | Client + Server         |
| 5      | PDF ke Gambar     | Konversi halaman PDF menjadi gambar PNG                       | Server (PyMuPDF)        |
| 6      | Putar PDF         | Putar halaman PDF per halaman atau semua sekaligus            | Client (browser)        |

### 1.4 Keunggulan Papyr

- **Indonesia-first** — Antarmuka dalam Bahasa Indonesia, server dekat Asia, UX disesuaikan kebutuhan lokal.
- **Privasi terjaga** — File otomatis dihapus maksimal 1 jam, tanpa login, tanpa tracking invasif.
- **Mobile-first** — Didesain untuk layar HP, bukan desktop-first yang dipaksakan responsive.
- **Cepat** — Operasi ringan diproses langsung di browser (zero upload), operasi berat di server tanpa antrian.
- **Gratis** — Semua fitur gratis tanpa batas, tanpa watermark, tanpa upsell.

---

## 2. Memulai

### 2.1 Mengakses Papyr

Papyr adalah aplikasi web — tidak perlu mengunduh atau menginstal apapun. Cukup buka browser dan kunjungi:

> **[https://mypapyr.com](https://mypapyr.com)**

### 2.2 Persyaratan Browser

Papyr kompatibel dengan browser modern yang mendukung JavaScript ES2020+:

| **Browser**          | **Versi Minimum** | **Status**    |
|----------------------|-------------------|---------------|
| Google Chrome        | 90+               | Didukung      |
| Mozilla Firefox      | 90+               | Didukung      |
| Safari               | 15+               | Didukung      |
| Microsoft Edge       | 90+               | Didukung      |
| Samsung Internet     | 15+               | Didukung      |
| Opera                | 76+               | Didukung      |

> **Catatan:** Pastikan JavaScript diaktifkan di browser Anda. Papyr memerlukan JavaScript untuk memproses file PDF di sisi client.

### 2.3 Tidak Perlu Instalasi

Papyr tidak memerlukan:

- Instalasi software atau aplikasi
- Pembuatan akun atau registrasi
- Login atau autentikasi
- Pemberian alamat email atau data pribadi

Buka website, pilih tool, proses file — selesai.

### 2.4 Navigasi Utama

Saat membuka mypapyr.com, Anda akan melihat halaman utama (landing page) dengan navigasi ke semua tool yang tersedia. Setiap tool memiliki halaman tersendiri yang dapat diakses melalui:

| **Tool**          | **URL Langsung**                          |
|-------------------|-------------------------------------------|
| Kompres PDF       | `mypapyr.com/compress`                    |
| Gabungkan PDF     | `mypapyr.com/merge`                       |
| Pisahkan PDF      | `mypapyr.com/split`                       |
| Gambar ke PDF     | `mypapyr.com/image-to-pdf`                |
| PDF ke Gambar     | `mypapyr.com/pdf-to-image`                |
| Putar PDF         | `mypapyr.com/rotate`                      |
| FAQ               | `mypapyr.com/faq`                         |
| Kebijakan Privasi | `mypapyr.com/privacy`                     |

---

## 3. Panduan Tool — Kompres PDF

### 3.1 Deskripsi

Tool **Kompres PDF** memperkecil ukuran file PDF tanpa mengurangi kualitas baca secara signifikan. Cocok untuk mengirim dokumen lewat WhatsApp, email kantor, atau upload ke portal pemerintah yang memiliki batas ukuran file.

### 3.2 Langkah-langkah

1. **Buka halaman Kompres PDF** — Kunjungi `mypapyr.com/compress` atau klik "Kompres PDF" dari halaman utama.
2. **Upload file PDF** — Klik area upload atau seret (drag-and-drop) file PDF ke area yang tersedia.
3. **Pilih level kualitas** — Pilih salah satu dari 3 preset kualitas:

   | **Level**          | **Keterangan**                                      | **Cocok Untuk**                              |
   |--------------------|-----------------------------------------------------|----------------------------------------------|
   | **Rendah** (Screen)  | Ukuran paling kecil, kualitas layar (72 DPI)       | Kirim via WhatsApp, preview cepat            |
   | **Sedang** (Ebook)   | Keseimbangan ukuran dan kualitas (150 DPI) — *default* | Email kantor, upload portal, penggunaan umum |
   | **Tinggi** (Printer) | Kualitas cetak tinggi, ukuran lebih besar (300 DPI) | Dokumen yang perlu dicetak                   |

4. **Tunggu proses kompresi** — File akan di-upload ke server dan diproses oleh Ghostscript. Progress bar akan menunjukkan status pemrosesan.
5. **Download hasil** — Setelah selesai, Anda akan melihat informasi ukuran asli, ukuran setelah kompresi, dan persentase penghematan. Klik tombol "Download" untuk mengunduh file hasil kompresi.

### 3.3 Perilaku yang Diharapkan

- Setelah upload, sistem menampilkan progress bar selama pemrosesan.
- Setelah selesai, ditampilkan perbandingan ukuran: ukuran asli vs ukuran hasil kompresi beserta persentase penghematan.
- Link download tersedia selama **1 jam** setelah pemrosesan selesai.
- Anda dapat memproses file baru dengan mengklik tombol "Proses File Lain" atau "Mulai Ulang".

### 3.4 Tips

- Gunakan level **Sedang (Ebook)** untuk sebagian besar kebutuhan — ini memberikan keseimbangan terbaik antara ukuran dan kualitas.
- Jika file PDF berisi banyak gambar beresolusi tinggi, kompresi akan memberikan penghematan ukuran yang lebih signifikan.
- File PDF yang sudah pernah dikompres mungkin tidak mengalami pengurangan ukuran yang besar.

### 3.5 Batasan Khusus Tool

| **Batasan**                | **Nilai**                                    |
|----------------------------|----------------------------------------------|
| Ukuran file maksimum       | 20 MB                                        |
| Format file                | Hanya `.pdf`                                 |
| PDF terproteksi password   | Tidak dapat diproses                         |
| Timeout pemrosesan         | 30 detik                                     |

### 3.6 Catatan Teknis

- **Pemrosesan:** Server-side — file di-upload ke server backend (FastAPI) dan diproses menggunakan Ghostscript.
- **Penyimpanan:** Hasil kompresi disimpan sementara di Cloudflare R2 dan dapat diakses melalui signed URL yang berlaku selama 1 jam.
- **Privasi:** File otomatis dihapus dari server dalam waktu maksimal 1 jam setelah pemrosesan.

---

## 4. Panduan Tool — Gabungkan PDF

### 4.1 Deskripsi

Tool **Gabungkan PDF** (Merge PDF) menggabungkan beberapa file PDF menjadi satu dokumen. Anda dapat mengatur urutan file dengan fitur drag-and-drop sebelum menggabungkan.

### 4.2 Langkah-langkah

1. **Buka halaman Gabungkan PDF** — Kunjungi `mypapyr.com/merge` atau klik "Gabungkan PDF" dari halaman utama.
2. **Upload file PDF** — Klik area upload atau seret beberapa file PDF sekaligus ke area yang tersedia. Anda juga dapat menambahkan file satu per satu.
3. **Atur urutan file** — Setelah file ter-upload, Anda akan melihat daftar file yang telah dipilih. Gunakan fitur **drag-and-drop** untuk mengatur urutan:
   - **Di desktop:** Klik dan tahan ikon drag (titik-titik) di sebelah kiri nama file, lalu seret ke posisi yang diinginkan.
   - **Di mobile:** Tekan dan tahan ikon drag, lalu geser ke posisi yang diinginkan.
4. **Hapus file (opsional)** — Klik ikon silang (X) di sebelah kanan nama file untuk menghapus file dari daftar.
5. **Klik "Gabungkan"** — Setelah urutan sesuai, klik tombol "Gabungkan PDF" untuk memulai proses penggabungan.
6. **Download hasil** — Setelah selesai, klik tombol "Download" untuk mengunduh file PDF gabungan.

### 4.3 Perilaku yang Diharapkan

- File yang di-upload ditampilkan dalam daftar dengan nama file dan ukuran.
- Urutan file dalam daftar menentukan urutan halaman dalam PDF gabungan.
- Proses penggabungan berlangsung sangat cepat karena diproses langsung di browser.
- Setelah selesai, file hasil langsung tersedia untuk di-download tanpa menunggu upload ke server.

### 4.4 Tips

- Pastikan urutan file sudah benar sebelum menggabungkan — urutan dalam daftar = urutan halaman dalam PDF hasil.
- Anda dapat menambahkan file tambahan kapan saja sebelum mengklik tombol "Gabungkan".
- Tidak ada batasan jumlah file yang dapat digabungkan, namun performa tergantung pada kemampuan browser dan perangkat Anda.

### 4.5 Batasan Khusus Tool

| **Batasan**                | **Nilai**                                    |
|----------------------------|----------------------------------------------|
| Format file                | Hanya `.pdf`                                 |
| Jumlah file minimum        | 2 file                                       |
| PDF terproteksi password   | Tidak dapat diproses                         |

### 4.6 Catatan Teknis

- **Pemrosesan:** Client-side — seluruh proses penggabungan dilakukan di browser menggunakan library `pdf-lib`. File **tidak pernah di-upload ke server**.
- **Privasi:** Karena diproses di browser, file tidak pernah meninggalkan perangkat Anda. Ini adalah level privasi tertinggi.
- **Performa:** Kecepatan pemrosesan tergantung pada spesifikasi perangkat dan ukuran total file.

---

## 5. Panduan Tool — Pisahkan PDF

### 5.1 Deskripsi

Tool **Pisahkan PDF** (Split PDF) memungkinkan Anda mengekstrak halaman tertentu dari file PDF. Anda dapat memilih halaman spesifik atau rentang halaman menggunakan format page range.

### 5.2 Langkah-langkah

1. **Buka halaman Pisahkan PDF** — Kunjungi `mypapyr.com/split` atau klik "Pisahkan PDF" dari halaman utama.
2. **Upload file PDF** — Klik area upload atau seret file PDF ke area yang tersedia.
3. **Tunggu file dimuat** — Sistem akan membaca file dan menampilkan jumlah total halaman.
4. **Tentukan halaman yang ingin diekstrak** — Masukkan nomor halaman atau rentang halaman di kolom input menggunakan format berikut:

   | **Format**       | **Contoh**    | **Hasil**                              |
   |------------------|---------------|----------------------------------------|
   | Halaman tunggal  | `3`           | Mengekstrak halaman 3 saja             |
   | Rentang halaman  | `1-5`         | Mengekstrak halaman 1 sampai 5         |
   | Kombinasi        | `1-3, 5, 7-10`| Mengekstrak halaman 1, 2, 3, 5, 7, 8, 9, 10 |

   > **Catatan:** Nomor halaman dimulai dari 1 (halaman pertama = 1). Gunakan koma untuk memisahkan beberapa pilihan, dan tanda strip (-) untuk rentang halaman.

5. **Klik "Pisahkan"** — Setelah memasukkan halaman yang diinginkan, klik tombol "Pisahkan PDF" untuk memulai proses.
6. **Download hasil** — Setelah selesai, klik tombol "Download" untuk mengunduh file PDF yang berisi halaman-halaman yang telah diekstrak.

### 5.3 Perilaku yang Diharapkan

- Setelah upload, sistem menampilkan jumlah total halaman dalam PDF.
- Input page range divalidasi secara real-time — jika format salah atau nomor halaman di luar jangkauan, akan muncul pesan error.
- Proses pemisahan berlangsung cepat karena diproses di browser.
- Hasil berupa file PDF baru yang hanya berisi halaman-halaman yang dipilih.

### 5.4 Tips

- Gunakan format `1-3, 5, 7-10` untuk mengekstrak halaman yang tidak berurutan dalam satu kali proses.
- Jika Anda hanya butuh satu halaman, cukup masukkan nomor halaman tersebut (misalnya `5`).
- Perhatikan jumlah total halaman yang ditampilkan setelah upload untuk memastikan nomor halaman yang Anda masukkan valid.

### 5.5 Batasan Khusus Tool

| **Batasan**                | **Nilai**                                    |
|----------------------------|----------------------------------------------|
| Format file                | Hanya `.pdf`                                 |
| Jumlah file                | 1 file per proses                            |
| PDF terproteksi password   | Tidak dapat diproses                         |
| Nomor halaman              | Harus dalam jangkauan (1 sampai total halaman) |

### 5.6 Catatan Teknis

- **Pemrosesan:** Client-side — seluruh proses pemisahan dilakukan di browser menggunakan library `pdf-lib`. File **tidak pernah di-upload ke server**.
- **Privasi:** File tidak pernah meninggalkan perangkat Anda.
- **Validasi:** Sistem memvalidasi format page range dan memastikan nomor halaman berada dalam jangkauan yang valid.

---

## 6. Panduan Tool — Gambar ke PDF

### 6.1 Deskripsi

Tool **Gambar ke PDF** (Image to PDF) mengkonversi satu atau beberapa file gambar menjadi satu file PDF. Setiap gambar menjadi satu halaman PDF. Mendukung format JPG, PNG, dan WEBP dengan fitur drag-and-drop untuk mengatur urutan.

### 6.2 Langkah-langkah

1. **Buka halaman Gambar ke PDF** — Kunjungi `mypapyr.com/image-to-pdf` atau klik "Gambar ke PDF" dari halaman utama.
2. **Upload gambar** — Klik area upload atau seret satu atau beberapa file gambar ke area yang tersedia. Format yang didukung:

   | **Format** | **Ekstensi**          |
   |------------|-----------------------|
   | JPEG       | `.jpg`, `.jpeg`       |
   | PNG        | `.png`                |
   | WEBP       | `.webp`               |

3. **Atur urutan gambar** — Setelah gambar ter-upload, Anda akan melihat preview thumbnail dari setiap gambar. Gunakan fitur **drag-and-drop** untuk mengatur urutan halaman dalam PDF hasil.
4. **Hapus gambar (opsional)** — Klik ikon silang (X) pada thumbnail gambar untuk menghapusnya dari daftar.
5. **Klik "Konversi"** — Setelah urutan sesuai, klik tombol "Konversi ke PDF" untuk memulai proses.
6. **Download hasil** — Setelah selesai, klik tombol "Download" untuk mengunduh file PDF hasil konversi.

### 6.3 Perilaku yang Diharapkan

- Setelah upload, setiap gambar ditampilkan sebagai thumbnail dengan preview.
- Urutan gambar dalam grid menentukan urutan halaman dalam PDF hasil.
- Jika total ukuran gambar kecil (di bawah 3 MB), proses dilakukan langsung di browser (sangat cepat).
- Jika total ukuran gambar besar (3 MB ke atas), proses dilakukan di server sebagai fallback.
- Setiap gambar menjadi satu halaman PDF dengan dimensi sesuai ukuran gambar asli.

### 6.4 Tips

- Untuk hasil terbaik, gunakan gambar dengan resolusi yang konsisten.
- Anda dapat mencampur format gambar (misalnya JPG dan PNG) dalam satu konversi.
- Jika konversi di browser gagal (misalnya karena keterbatasan memori perangkat), sistem akan otomatis mencoba memproses di server.

### 6.5 Batasan Khusus Tool

| **Batasan**                | **Nilai**                                    |
|----------------------------|----------------------------------------------|
| Format gambar              | JPG, PNG, WEBP                               |
| Ukuran per file            | Maksimal 20 MB                               |
| Jumlah gambar minimum      | 1 gambar                                     |
| Threshold client-side      | Total ukuran < 3 MB diproses di browser      |

### 6.6 Catatan Teknis

- **Pemrosesan:** Hybrid — jika total ukuran gambar di bawah 3 MB, diproses di browser menggunakan `pdf-lib` (zero upload). Jika di atas 3 MB, gambar di-upload ke server dan diproses menggunakan PyMuPDF.
- **Validasi:** Sistem memvalidasi format file melalui MIME type, ekstensi file, dan magic bytes (header file) untuk memastikan file benar-benar gambar yang valid.
- **Privasi:** Untuk file kecil yang diproses di browser, gambar tidak pernah meninggalkan perangkat. Untuk file besar yang diproses di server, file otomatis dihapus dalam 1 jam.

---

## 7. Panduan Tool — PDF ke Gambar

### 7.1 Deskripsi

Tool **PDF ke Gambar** (PDF to Image) mengkonversi halaman PDF menjadi gambar PNG berkualitas tinggi. Anda dapat memilih halaman tertentu atau mengkonversi semua halaman sekaligus.

### 7.2 Langkah-langkah

1. **Buka halaman PDF ke Gambar** — Kunjungi `mypapyr.com/pdf-to-image` atau klik "PDF ke Gambar" dari halaman utama.
2. **Upload file PDF** — Klik area upload atau seret file PDF ke area yang tersedia.
3. **Tunggu file dimuat** — Sistem akan membaca file dan menampilkan jumlah total halaman.
4. **Pilih halaman (opsional)** — Secara default, semua halaman akan dikonversi. Jika Anda hanya ingin mengkonversi halaman tertentu, masukkan nomor halaman menggunakan format page range:

   | **Format**       | **Contoh**    | **Hasil**                              |
   |------------------|---------------|----------------------------------------|
   | Kosong (default) | *(biarkan kosong)* | Semua halaman dikonversi          |
   | Halaman tunggal  | `3`           | Hanya halaman 3                        |
   | Rentang halaman  | `1-5`         | Halaman 1 sampai 5                     |
   | Kombinasi        | `1-3, 5, 7`  | Halaman 1, 2, 3, 5, dan 7             |

5. **Klik "Konversi"** — Klik tombol "Konversi ke Gambar" untuk memulai proses.
6. **Download hasil** — Setelah selesai, klik tombol "Download" untuk mengunduh hasil:
   - **1 halaman:** File PNG tunggal.
   - **2 halaman atau lebih:** File ZIP berisi semua gambar PNG (bernama `page_1.png`, `page_2.png`, dst.).

### 7.3 Perilaku yang Diharapkan

- Setelah upload, sistem menampilkan jumlah total halaman dalam PDF.
- Input page range divalidasi — format salah atau nomor halaman di luar jangkauan akan menampilkan pesan error.
- Proses konversi memerlukan upload ke server karena rendering PDF ke gambar membutuhkan engine PyMuPDF.
- Gambar dihasilkan pada resolusi 150 DPI — cukup untuk tampilan layar dan penggunaan umum.

### 7.4 Tips

- Jika Anda hanya butuh beberapa halaman, tentukan halaman spesifik untuk mempercepat proses dan menghemat bandwidth.
- Hasil gambar PNG cocok untuk di-share di media sosial, presentasi, atau dokumentasi.
- Untuk PDF dengan banyak halaman, hasil akan dikemas dalam file ZIP yang dapat diekstrak di perangkat Anda.

### 7.5 Batasan Khusus Tool

| **Batasan**                | **Nilai**                                    |
|----------------------------|----------------------------------------------|
| Ukuran file maksimum       | 20 MB                                        |
| Format file                | Hanya `.pdf`                                 |
| Format output              | PNG (150 DPI)                                |
| PDF terproteksi password   | Tidak dapat diproses                         |
| Output multi-halaman       | Dikemas dalam file ZIP                       |

### 7.6 Catatan Teknis

- **Pemrosesan:** Server-side — file di-upload ke server backend dan diproses menggunakan PyMuPDF pada resolusi 150 DPI.
- **Output:** Jika 1 halaman dikonversi, output berupa file PNG tunggal. Jika 2+ halaman, output berupa file ZIP berisi semua PNG.
- **Penyimpanan:** Hasil konversi disimpan sementara di Cloudflare R2 dengan signed URL yang berlaku selama 1 jam.
- **Privasi:** File otomatis dihapus dari server dalam waktu maksimal 1 jam.

---

## 8. Panduan Tool — Putar PDF

### 8.1 Deskripsi

Tool **Putar PDF** (Rotate PDF) memungkinkan Anda memutar halaman PDF — baik per halaman secara individual maupun semua halaman sekaligus. Mendukung rotasi 90°, 180°, dan 270° (searah jarum jam).

### 8.2 Langkah-langkah

1. **Buka halaman Putar PDF** — Kunjungi `mypapyr.com/rotate` atau klik "Putar PDF" dari halaman utama.
2. **Upload file PDF** — Klik area upload atau seret file PDF ke area yang tersedia.
3. **Tunggu file dimuat** — Sistem akan membaca file dan menampilkan daftar halaman.
4. **Pilih mode rotasi:**

   **Mode A — Putar Per Halaman (Individual):**
   - Setiap halaman ditampilkan dengan opsi rotasi tersendiri.
   - Klik tombol rotasi pada halaman yang ingin diputar.
   - Setiap klik memutar halaman 90° searah jarum jam.
   - Anda dapat memutar halaman yang berbeda dengan sudut yang berbeda.

   **Mode B — Putar Semua Halaman (Global):**
   - Pilih sudut rotasi yang diinginkan (90°, 180°, atau 270°).
   - Semua halaman akan diputar dengan sudut yang sama.

5. **Klik "Putar"** — Setelah pengaturan rotasi sesuai, klik tombol "Putar PDF" untuk memulai proses.
6. **Download hasil** — Setelah selesai, klik tombol "Download" untuk mengunduh file PDF dengan halaman yang telah diputar.

### 8.3 Perilaku yang Diharapkan

- Setelah upload, sistem menampilkan daftar halaman dengan indikator rotasi.
- Rotasi per halaman memungkinkan pengaturan yang fleksibel — misalnya halaman 1 diputar 90° sementara halaman 2 tetap.
- Proses rotasi berlangsung sangat cepat karena diproses di browser.
- Hasil berupa file PDF baru dengan halaman yang telah diputar sesuai pengaturan.

### 8.4 Tips

- Gunakan rotasi per halaman jika hanya beberapa halaman yang perlu diputar (misalnya halaman landscape di tengah dokumen portrait).
- Gunakan rotasi global jika seluruh dokumen perlu diputar (misalnya dokumen yang di-scan terbalik).
- Setiap klik tombol rotasi pada halaman individual menambahkan 90° — klik 2x untuk 180°, 3x untuk 270°, 4x kembali ke posisi awal.

### 8.5 Batasan Khusus Tool

| **Batasan**                | **Nilai**                                    |
|----------------------------|----------------------------------------------|
| Format file                | Hanya `.pdf`                                 |
| Jumlah file                | 1 file per proses                            |
| Sudut rotasi               | 90°, 180°, 270° (kelipatan 90°)             |
| PDF terproteksi password   | Tidak dapat diproses                         |

### 8.6 Catatan Teknis

- **Pemrosesan:** Client-side — seluruh proses rotasi dilakukan di browser menggunakan library `pdf-lib`. File **tidak pernah di-upload ke server**.
- **Privasi:** File tidak pernah meninggalkan perangkat Anda.
- **Implementasi:** Rotasi dilakukan dengan mengubah metadata rotasi pada setiap halaman PDF, bukan dengan merender ulang konten — sehingga kualitas tetap terjaga 100%.

---

## 9. Batasan & Limitasi

### 9.1 Batasan Umum

| **Parameter**                  | **Nilai**                                    | **Keterangan**                                    |
|--------------------------------|----------------------------------------------|---------------------------------------------------|
| Ukuran file maksimum           | 20 MB per file                               | Berlaku untuk semua tool yang memerlukan upload ke server |
| Retensi file di server         | Maksimal 1 jam                               | File otomatis dihapus setelah 1 jam               |
| Validitas link download        | 1 jam                                        | Signed URL kedaluwarsa setelah 1 jam              |
| Rate limit                     | 10 request per menit per IP                  | Berlaku untuk endpoint server-side                |
| Format PDF input               | `.pdf` (valid, tidak terenkripsi)            | PDF terproteksi password tidak dapat diproses     |
| Format gambar input            | `.jpg`, `.jpeg`, `.png`, `.webp`             | Berlaku untuk tool Gambar ke PDF                  |

### 9.2 Batasan Per Tool

| **Tool**          | **Pemrosesan** | **Batas Upload** | **Catatan Khusus**                                    |
|-------------------|----------------|------------------|-------------------------------------------------------|
| Kompres PDF       | Server         | 20 MB            | Timeout 30 detik, 3 level kualitas                    |
| Gabungkan PDF     | Client         | Tergantung perangkat | Minimal 2 file, tidak ada upload ke server         |
| Pisahkan PDF      | Client         | Tergantung perangkat | Page range format, tidak ada upload ke server      |
| Gambar ke PDF     | Hybrid         | 20 MB per gambar | < 3 MB total = client, >= 3 MB = server              |
| PDF ke Gambar     | Server         | 20 MB            | Output PNG 150 DPI, multi-halaman = ZIP               |
| Putar PDF         | Client         | Tergantung perangkat | Per halaman atau global, tidak ada upload ke server |

### 9.3 Batasan Client-Side

Untuk tool yang diproses di browser (Gabungkan PDF, Pisahkan PDF, Putar PDF), batasan bergantung pada kemampuan perangkat:

- **Memori browser:** File PDF yang sangat besar mungkin menyebabkan browser kehabisan memori, terutama pada perangkat mobile dengan RAM terbatas.
- **Performa:** Kecepatan pemrosesan tergantung pada spesifikasi CPU dan RAM perangkat.
- **Tidak ada batas upload 20 MB:** Karena file tidak di-upload ke server, batas 20 MB tidak berlaku — namun file yang sangat besar tetap dapat menyebabkan masalah performa di browser.

---

## 10. Privasi & Keamanan

### 10.1 Prinsip Privasi Papyr

Papyr dirancang dengan prinsip **privacy-first**. Berikut adalah komitmen privasi kami:

| **Aspek**                  | **Kebijakan**                                                                 |
|----------------------------|-------------------------------------------------------------------------------|
| **Tanpa Login**            | Tidak perlu membuat akun, login, atau memberikan email                        |
| **Tanpa Tracking Invasif** | Tidak menggunakan cookie tracking pihak ketiga atau fingerprinting            |
| **Auto-Delete**            | Semua file yang di-upload ke server otomatis dihapus dalam maksimal 1 jam     |
| **Client-Side Processing** | 3 dari 6 tool diproses sepenuhnya di browser — file tidak pernah meninggalkan perangkat |
| **HTTPS**                  | Semua transfer data dienkripsi menggunakan HTTPS/TLS                          |
| **Signed URL**             | File hasil pemrosesan hanya dapat diakses melalui URL bertanda tangan kriptografis yang kedaluwarsa dalam 1 jam |

### 10.2 Pemrosesan Client-Side vs Server-Side

| **Pemrosesan**   | **Tool**                                    | **Implikasi Privasi**                                    |
|------------------|---------------------------------------------|----------------------------------------------------------|
| Client (Browser) | Gabungkan PDF, Pisahkan PDF, Putar PDF      | File **tidak pernah** meninggalkan perangkat Anda. Privasi maksimal. |
| Server           | Kompres PDF, PDF ke Gambar                  | File di-upload ke server, diproses, lalu otomatis dihapus dalam 1 jam. |
| Hybrid           | Gambar ke PDF                               | File kecil (< 3 MB) diproses di browser. File besar di-upload ke server. |

### 10.3 Penyimpanan File di Server

Untuk tool yang memerlukan pemrosesan server-side:

- File disimpan sementara di **Cloudflare R2** (object storage) dengan akses terbatas.
- Setiap file memiliki **signed URL** unik yang hanya berlaku selama 1 jam.
- File otomatis dihapus melalui **lifecycle policy** dan **cron job** yang berjalan secara berkala.
- Tidak ada manusia yang mengakses atau melihat file Anda — pemrosesan sepenuhnya otomatis.

### 10.4 Data yang Tidak Dikumpulkan

Papyr **tidak** mengumpulkan:

- Nama, email, atau informasi pribadi
- Konten file PDF atau gambar yang Anda proses
- Riwayat penggunaan yang dapat diidentifikasi secara personal
- Cookie tracking pihak ketiga

### 10.5 Analytics

Papyr menggunakan **Vercel Analytics** dan **Speed Insights** untuk memantau performa website secara agregat. Data yang dikumpulkan bersifat anonim dan tidak dapat dikaitkan dengan pengguna individual. Analytics ini membantu kami memahami tool mana yang paling sering digunakan dan mengoptimalkan performa.

---

## 11. FAQ (Pertanyaan Umum)

### Q1: Apakah file saya aman?

**Ya, keamanan file Anda adalah prioritas kami.** Semua transfer menggunakan HTTPS (terenkripsi). File yang di-upload ke server disimpan di Cloudflare R2 dengan akses terbatas, dan otomatis dihapus dalam 1 jam. Untuk fitur yang diproses di browser (Gabungkan PDF, Pisahkan PDF, Putar PDF), file Anda tidak pernah meninggalkan perangkat Anda.

### Q2: Berapa lama file disimpan di server?

**Maksimal 1 jam.** Setelah itu, file dihapus otomatis dari server kami — tanpa pengecualian. Link download juga kedaluwarsa setelah 1 jam. Untuk fitur yang diproses di browser, file tidak pernah di-upload ke server sama sekali.

### Q3: Apakah perlu daftar akun?

**Tidak.** Papyr bisa langsung dipakai tanpa daftar, tanpa login, tanpa email. Buka website, pilih alat, selesai. Kami tidak mengumpulkan data pribadi apapun.

### Q4: Berapa ukuran file maksimum?

**Saat ini batas upload adalah 20 MB per file.** Untuk fitur yang diproses di browser (Gabungkan PDF, Pisahkan PDF, Putar PDF), batasnya lebih fleksibel karena tidak perlu upload ke server.

### Q5: Bisa dipakai di HP?

**Ya!** Papyr dioptimalkan untuk mobile. Semua fitur bisa diakses dari browser HP tanpa perlu install aplikasi. Cukup buka mypapyr.com dari Chrome, Safari, atau browser lainnya.

### Q6: Apakah Papyr gratis?

**Ya, semua fitur Papyr gratis** — Kompres PDF, Gabungkan PDF, Pisahkan PDF, Gambar ke PDF, PDF ke Gambar, dan Putar PDF. Tidak ada biaya tersembunyi, tidak ada watermark, tidak ada upsell.

### Q7: Format file apa yang didukung?

Papyr mendukung file **PDF**, **JPG**, **PNG**, dan **WEBP**. Anda bisa mengompres PDF, menggabungkan beberapa PDF, memisahkan halaman PDF, mengubah gambar (JPG/PNG/WEBP) menjadi PDF, mengubah halaman PDF menjadi gambar PNG, dan memutar halaman PDF.

### Q8: Bagaimana cara menghubungi Papyr?

Anda bisa menghubungi kami melalui email di **privacy@mypapyr.com**. Kami akan merespons secepat mungkin.

---

## 12. Troubleshooting

### 12.1 Error Umum dan Solusinya

| **No** | **Pesan Error / Gejala**                                                    | **Penyebab**                                    | **Solusi**                                                                                   |
|--------|-----------------------------------------------------------------------------|------------------------------------------------|----------------------------------------------------------------------------------------------|
| 1      | "Tipe file tidak valid. Hanya file PDF yang diterima."                      | File yang di-upload bukan PDF                  | Pastikan file berekstensi `.pdf` dan merupakan file PDF yang valid                           |
| 2      | "Ukuran file terlalu besar: X MB. Maksimal 20 MB."                         | File melebihi batas 20 MB                      | Coba kompres file terlebih dahulu, atau gunakan tool lain untuk memperkecil ukuran           |
| 3      | "PDF ini dilindungi kata sandi dan tidak dapat diproses."                   | PDF terenkripsi/terproteksi password           | Buka proteksi password terlebih dahulu menggunakan software PDF lain, lalu coba lagi         |
| 4      | "File bukan PDF yang valid atau file corrupt."                              | File rusak atau bukan PDF asli                 | Pastikan file tidak rusak. Coba buka file di PDF reader lain untuk memverifikasi             |
| 5      | "Terlalu banyak permintaan. Coba lagi dalam 1 menit."                      | Rate limit terlampaui (10 req/menit)           | Tunggu 1 menit, lalu coba lagi                                                              |
| 6      | "Proses kompresi melebihi batas waktu (30 detik)."                         | File terlalu besar atau kompleks               | Coba file yang lebih kecil, atau gunakan level kualitas yang lebih rendah                    |
| 7      | "Format halaman tidak valid."                                               | Format page range salah                        | Gunakan format yang benar: angka, koma, dan strip. Contoh: `1-3, 5, 7`                      |
| 8      | "Halaman di luar jangkauan."                                                | Nomor halaman melebihi total halaman PDF       | Periksa jumlah total halaman dan pastikan nomor yang dimasukkan valid                        |
| 9      | File tidak bisa di-upload (tidak ada respons)                               | Koneksi internet terputus                      | Periksa koneksi internet Anda dan coba lagi                                                  |
| 10     | Proses sangat lambat di browser                                             | File terlalu besar untuk pemrosesan client-side | Coba file yang lebih kecil, atau tutup tab browser lain untuk membebaskan memori             |
| 11     | "Gagal memproses file. Silakan coba lagi."                                  | Error internal server                          | Tunggu beberapa saat dan coba lagi. Jika masalah berlanjut, hubungi kami                     |
| 12     | Link download tidak berfungsi                                               | Signed URL telah kedaluwarsa (> 1 jam)         | Proses ulang file untuk mendapatkan link download baru                                       |

### 12.2 Tips Umum Troubleshooting

1. **Refresh halaman** — Jika terjadi error yang tidak terduga, coba refresh halaman browser (Ctrl+R atau Cmd+R) dan ulangi proses.
2. **Coba browser lain** — Jika masalah terjadi di satu browser, coba gunakan browser lain (misalnya Chrome, Firefox, atau Edge).
3. **Periksa koneksi internet** — Untuk tool yang memerlukan upload ke server (Kompres PDF, PDF ke Gambar), pastikan koneksi internet stabil.
4. **Bersihkan cache browser** — Jika halaman tidak memuat dengan benar, coba bersihkan cache browser Anda.
5. **Gunakan mode incognito** — Jika ada masalah dengan ekstensi browser yang mengganggu, coba buka Papyr di mode incognito/private.
6. **Periksa ukuran file** — Pastikan file tidak melebihi batas 20 MB untuk tool server-side.
7. **Hubungi kami** — Jika masalah berlanjut setelah mencoba semua langkah di atas, kirim email ke privacy@mypapyr.com dengan deskripsi masalah.

---

## 13. Untuk Developer

Bagian ini ditujukan untuk developer yang ingin memahami arsitektur teknis Papyr atau berkontribusi pada proyek.

### 13.1 Tech Stack

| **Layer**        | **Teknologi**                          | **Keterangan**                                          |
|------------------|----------------------------------------|---------------------------------------------------------|
| Frontend         | Next.js 16, TypeScript, Tailwind CSS v4 | SSR + static, DM Sans font, design tokens              |
| Client PDF       | pdf-lib, @dnd-kit                      | Merge, split, rotate, image-to-PDF di browser           |
| Backend API      | FastAPI (Python 3.11)                  | Compress, image-to-PDF fallback, PDF-to-image           |
| Server PDF       | PyMuPDF (fitz), Ghostscript            | Rendering & compression berkualitas tinggi              |
| Storage          | Cloudflare R2                          | Object storage, auto-delete, signed URLs                |
| Hosting          | Vercel (frontend) + Railway (backend)  | Frontend edge-global, backend containerized             |
| Domain           | Hostinger                              | mypapyr.com, DNS management                             |
| Analytics        | Vercel Analytics + Speed Insights      | Web analytics + performance monitoring                  |

### 13.2 Arsitektur Sistem

```
                         ┌──────────────────────────────────────────┐
                         │              mypapyr.com                 │
                         │           (Hostinger DNS)                │
                         └──────────────┬───────────────────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
        ┌───────────────────┐                   ┌───────────────────┐
        │   Vercel (Edge)   │                   │ Railway (us-west2)│
        │   Global CDN      │                   │   Container       │
        ├───────────────────┤                   ├───────────────────┤
        │   Next.js 16      │   ── REST API ──▶ │   FastAPI         │
        │   TypeScript      │                   │   Python 3.11     │
        │   Tailwind v4     │                   │   PyMuPDF         │
        │   pdf-lib         │                   │   Ghostscript     │
        └───────────────────┘                   └────────┬──────────┘
                                                         │
                                                         ▼
                                                ┌───────────────────┐
                                                │  Cloudflare R2    │
                                                │  Object Storage   │
                                                ├───────────────────┤
                                                │  Signed URLs      │
                                                │  Auto-delete      │
                                                └───────────────────┘
```

### 13.3 API Endpoints

Papyr Backend API adalah RESTful API yang tidak memerlukan autentikasi. Semua endpoint bersifat publik.

**Base URL:**

| **Environment** | **Base URL**                                    |
|-----------------|-------------------------------------------------|
| Production      | `https://papyr-production.up.railway.app`       |
| Local Dev       | `http://localhost:8000`                          |

**Endpoint Operasional:**

| **Method** | **Endpoint**           | **Deskripsi**                                    | **Engine**    |
|------------|------------------------|--------------------------------------------------|---------------|
| `POST`     | `/api/compress`        | Kompres file PDF dengan preset kualitas          | Ghostscript   |
| `POST`     | `/api/image-to-pdf`    | Konversi gambar (JPG/PNG/WEBP) ke PDF            | PyMuPDF       |
| `POST`     | `/api/pdf-to-image`    | Konversi halaman PDF ke gambar PNG               | PyMuPDF       |
| `GET`      | `/health`              | Health check — verifikasi server aktif           | —             |

**Catatan:** Operasi Merge, Split, dan Rotate diproses sepenuhnya di browser (client-side) menggunakan `pdf-lib` dan **tidak memiliki endpoint API**.

**Rate Limiting:**

| **Parameter**       | **Nilai**                                    |
|---------------------|----------------------------------------------|
| Batas               | 10 request per menit per IP address          |
| Implementasi        | slowapi (sliding window)                     |
| Response saat limit | HTTP 429 — `"Terlalu banyak permintaan. Coba lagi dalam 1 menit."` |

**Format Request:** Semua endpoint upload menggunakan `multipart/form-data`.

**Format Response:** Semua response menggunakan `application/json`.

**CORS Policy:** Hanya origin yang terdaftar (whitelist) yang diizinkan mengakses API:
- `https://mypapyr.com`
- `https://frontend-ten-omega-35.vercel.app`
- `http://localhost:3000` (development)

> Untuk spesifikasi API yang lebih detail (termasuk validasi input, format request/response, dan kode error), lihat dokumen **API Specification** (PPR-API-001).

### 13.4 Strategi Pemrosesan

| **Operasi**      | **< 3 MB**                | **>= 3 MB**               |
|------------------|---------------------------|---------------------------|
| Compress         | Server (Ghostscript)      | Server (Ghostscript)      |
| Merge            | Client (pdf-lib)          | Client (pdf-lib)          |
| Split            | Client (pdf-lib)          | Client (pdf-lib)          |
| Rotate           | Client (pdf-lib)          | Client (pdf-lib)          |
| Image to PDF     | Client (pdf-lib)          | Server (PyMuPDF)          |
| PDF to Image     | Server (PyMuPDF)          | Server (PyMuPDF)          |

> File kecil diproses langsung di browser — zero upload, zero latency, zero privacy risk.

### 13.5 Struktur Proyek

```
papyr/
├── frontend/                  # Next.js 16 app (Vercel)
│   └── src/
│       ├── app/               # Pages & routes
│       │   ├── compress/      # /compress — PDF compression
│       │   ├── merge/         # /merge — PDF merge
│       │   ├── split/         # /split — PDF split
│       │   ├── image-to-pdf/  # /image-to-pdf — Image conversion
│       │   ├── pdf-to-image/  # /pdf-to-image — PDF to image
│       │   ├── rotate/        # /rotate — PDF rotation
│       │   ├── faq/           # /faq — FAQ page
│       │   ├── privacy/       # /privacy — Privacy policy
│       │   ├── sitemap.ts     # Auto-generated sitemap.xml
│       │   └── robots.ts      # Auto-generated robots.txt
│       ├── components/        # Reusable UI components
│       │   ├── Navbar.tsx     # Sticky nav, mobile hamburger
│       │   ├── Footer.tsx     # Footer
│       │   ├── OtherTools.tsx # Cross-link to other tools
│       │   ├── PDFUploader.tsx
│       │   ├── PageRangeInput.tsx
│       │   └── PrivacyNotice.tsx
│       └── lib/               # Config, utilities, helpers
│           ├── analytics.ts   # Vercel Analytics event tracking
│           ├── config.ts      # Typed env config + limits
│           ├── format.ts      # Formatting utilities
│           └── pdfUtils.ts    # pdf-lib operations
├── backend/                   # FastAPI server (Railway)
│   ├── routers/               # API route handlers
│   ├── services/              # Business logic
│   │   ├── compress.py        # Ghostscript compression
│   │   ├── image_to_pdf.py    # PyMuPDF image conversion
│   │   └── pdf_to_image_service.py  # PDF rasterization
│   ├── utils/
│   │   ├── config.py          # Validated env config
│   │   └── r2.py              # Cloudflare R2 helpers
│   ├── Dockerfile             # Production container
│   ├── requirements.txt
│   └── main.py                # FastAPI entrypoint
├── docs/                      # Enterprise documentation
├── CHANGELOG.md               # Riwayat perubahan per milestone
└── README.md
```

### 13.6 Setup Lokal

**Prerequisites:**

| **Tool**     | **Versi** | **Keterangan**           |
|--------------|-----------|--------------------------|
| Node.js      | 20+       | Frontend runtime         |
| Python       | 3.11+     | Backend runtime          |
| Ghostscript  | 10+       | PDF compression engine   |
| Git          | —         | Version control          |

**Frontend:**

```bash
cd frontend
cp .env.example .env.local    # Edit sesuai kebutuhan
npm install
npm run dev                    # → http://localhost:3000
```

**Backend:**

```bash
cd backend
cp .env.example .env           # Isi R2 credentials
python -m venv venv
venv\Scripts\activate           # macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload       # → http://localhost:8000
```

### 13.7 Cara Berkontribusi

Papyr adalah proyek proprietary milik Muhammad Fa'iz Zulfikar. Kontribusi saat ini terbatas pada kolaborasi yang disetujui oleh Product Owner. Jika Anda tertarik untuk berkontribusi:

1. Hubungi Product Owner melalui email di **privacy@mypapyr.com**.
2. Jelaskan area kontribusi yang diminati (bug fix, fitur baru, dokumentasi, dll.).
3. Tunggu persetujuan sebelum memulai pengembangan.

> **Catatan:** Kode sumber bersifat proprietary dan tidak boleh digunakan, disalin, atau didistribusikan tanpa izin tertulis dari pemilik.

### 13.8 Dokumentasi Teknis Terkait

Untuk informasi teknis yang lebih mendalam, lihat dokumen-dokumen berikut:

| **Dokumen**                          | **ID**        | **Deskripsi**                                          |
|--------------------------------------|---------------|--------------------------------------------------------|
| Business Requirements Document       | PPR-BRD-001   | Kebutuhan bisnis dan batasan                           |
| Software Requirements Specification  | PPR-SRS-001   | Spesifikasi kebutuhan fungsional dan non-fungsional    |
| Technical Design Document            | PPR-TDD-001   | Arsitektur teknis dan keputusan desain                 |
| API Specification                    | PPR-API-001   | Spesifikasi lengkap endpoint backend                   |
| Security Policy                      | PPR-SP-001    | Kebijakan keamanan komprehensif                        |
| Architecture Decision Records        | PPR-ADR-001   | Catatan keputusan arsitektur                           |
| Deployment Runbook                   | PPR-DR-001    | Panduan deployment dan operasional                     |
| Coding Standards                     | PPR-CS-001    | Standar penulisan kode                                 |

---

## 14. Kontak & Dukungan

### 14.1 Informasi Kontak

| **Channel**    | **Detail**                                    |
|----------------|-----------------------------------------------|
| Email          | privacy@mypapyr.com                           |
| Website        | [mypapyr.com](https://mypapyr.com)            |
| FAQ            | [mypapyr.com/faq](https://mypapyr.com/faq)    |

### 14.2 Cara Melaporkan Masalah

Jika Anda mengalami masalah saat menggunakan Papyr, silakan kirim email ke **privacy@mypapyr.com** dengan informasi berikut:

1. **Deskripsi masalah** — Jelaskan apa yang terjadi dan apa yang Anda harapkan terjadi.
2. **Tool yang digunakan** — Sebutkan tool mana yang bermasalah (Kompres PDF, Gabungkan PDF, dll.).
3. **Browser dan perangkat** — Sebutkan browser (Chrome, Firefox, dll.) dan perangkat (HP, laptop, dll.) yang digunakan.
4. **Pesan error** — Jika ada pesan error, sertakan teks lengkapnya.
5. **Langkah reproduksi** — Jelaskan langkah-langkah yang dilakukan sebelum masalah terjadi.

### 14.3 Waktu Respons

Kami berusaha merespons setiap email dalam waktu **1-3 hari kerja**. Untuk masalah kritis yang mempengaruhi ketersediaan layanan, kami akan memprioritaskan penanganan.

### 14.4 Tentang Papyr

Papyr dikembangkan oleh **Muhammad Fa'iz Zulfikar** sebagai solo project dengan bantuan AI Agent. Papyr bertujuan menyediakan tool PDF yang gratis, cepat, dan aman untuk pengguna Indonesia.

- Website: [mypapyr.com](https://mypapyr.com)
- GitHub: [github.com/fazulfi](https://github.com/fazulfi)

---

## 15. Persetujuan Dokumen

| **Peran**                          | **Nama**                       | **Status**   | **Tanggal**  |
|------------------------------------|--------------------------------|--------------|--------------|
| Product Owner                      | Muhammad Fa'iz Zulfikar        | Approved     | Juni 2025    |
| AI Agent (Penulis)                 | OpenCode/Sisyphus              | Approved     | Juni 2025    |

---

*Dokumen ini bersifat confidential dan ditujukan untuk penggunaan internal Papyr. Hak cipta © 2025 Muhammad Fa'iz Zulfikar. All rights reserved.*
