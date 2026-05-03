# Papyr

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

# Legal Pages

Version 1.0 | Juni 2025

**CONFIDENTIAL**

mypapyr.com

---

## Informasi Dokumen

| Field | Value |
|---|---|
| **Judul Dokumen** | Legal Pages — Papyr |
| **ID Dokumen** | PPR-LP-001 |
| **Versi** | 1.0 |
| **Status** | Draft |
| **Tanggal Dibuat** | Juni 2025 |
| **Terakhir Diubah** | Juni 2025 |
| **Penulis** | AI Agent (OpenCode/Sisyphus) |
| **Ditinjau Oleh** | Product Owner (Muhammad Fa'iz Zulfikar) |
| **Disetujui Oleh** | Product Owner |
| **Kerahasiaan** | Confidential — Internal & Investor Use Only |

---

## Riwayat Versi

| Versi | Tanggal | Penulis | Deskripsi |
|---|---|---|---|
| 1.0 | Juni 2025 | AI Agent (OpenCode/Sisyphus) | Draft awal — Legal Pages lengkap mencakup Kebijakan Privasi, Syarat & Ketentuan, dan analisis kepatuhan regulasi |

---

## Daftar Isi

1. [Ringkasan Dokumen Legal](#1-ringkasan-dokumen-legal)
2. [Kebijakan Privasi (Privacy Policy)](#2-kebijakan-privasi-privacy-policy)
3. [Syarat & Ketentuan (Terms of Service)](#3-syarat--ketentuan-terms-of-service)
4. [Kepatuhan UU PDP](#4-kepatuhan-uu-pdp)
5. [Kepatuhan GDPR](#5-kepatuhan-gdpr)
6. [Rekomendasi Legal](#6-rekomendasi-legal)
7. [Referensi Silang](#7-referensi-silang)
8. [Persetujuan Dokumen](#8-persetujuan-dokumen)

---

## 1. Ringkasan Dokumen Legal

### 1.1 Tujuan

Dokumen ini menyusun seluruh halaman legal (legal pages) yang diperlukan untuk operasional Papyr sebagai layanan publik di mypapyr.com. Dokumen ini berfungsi sebagai:

1. **Sumber kebenaran tunggal** (single source of truth) untuk seluruh ketentuan hukum yang mengatur hubungan antara Papyr dan penggunanya.
2. **Dasar implementasi** halaman legal di website mypapyr.com.
3. **Bukti kepatuhan** terhadap regulasi perlindungan data yang berlaku di Indonesia dan secara internasional.

### 1.2 Ruang Lingkup

| Aspek | Cakupan |
|---|---|
| **Layanan** | Seluruh fitur PDF tool di mypapyr.com (Compress, Merge, Split, Rotate, Image-to-PDF, PDF-to-Image) |
| **Pengguna** | Seluruh pengguna publik tanpa batasan geografis, dengan fokus utama pengguna Indonesia |
| **Platform** | Website mypapyr.com (desktop & mobile browser) |
| **Regulasi** | UU PDP (UU No. 27 Tahun 2022), GDPR (awareness), UU ITE |

### 1.3 Prinsip Dasar Legal Papyr

Seluruh ketentuan legal Papyr dibangun di atas prinsip-prinsip berikut:

| Prinsip | Penjelasan |
|---|---|
| **Privacy by Design** | Arsitektur sistem dirancang untuk meminimalkan pengumpulan data sejak awal |
| **Data Minimization** | Hanya data yang benar-benar diperlukan untuk pemrosesan yang dikumpulkan |
| **Transparansi** | Pengguna diberitahu secara jelas tentang apa yang terjadi dengan data mereka |
| **Zero-Knowledge** | Papyr tidak mengetahui identitas pengguna — tidak ada akun, login, atau profil |
| **Ephemeral Processing** | Seluruh file bersifat sementara dan dihapus otomatis dalam waktu singkat |

### 1.4 Status Implementasi

| Halaman Legal | Status | URL |
|---|---|---|
| Kebijakan Privasi | ✅ Live | mypapyr.com/privacy |
| Syarat & Ketentuan | 📋 Drafted (belum di-deploy) | — |
| Cookie Policy | ❌ Tidak diperlukan (tidak menggunakan cookie) | — |

---

## 2. Kebijakan Privasi (Privacy Policy)

### 2.1 Pendahuluan

Kebijakan Privasi ini menjelaskan bagaimana Papyr ("kami", "layanan kami", "platform") menangani informasi pengguna saat menggunakan layanan di mypapyr.com. Papyr adalah alat utilitas PDF berbasis web yang dikembangkan dan dioperasikan oleh Muhammad Fa'iz Zulfikar ("Pengembang").

Papyr dirancang dengan filosofi **privacy-first** — kami secara sadar memilih untuk tidak mengumpulkan data pribadi pengguna. Layanan ini dapat digunakan sepenuhnya tanpa membuat akun, tanpa login, dan tanpa memberikan informasi identitas apapun.

**Tanggal Berlaku:** April 2026
**Terakhir Diperbarui:** April 2026
**Berlaku untuk:** Seluruh pengguna mypapyr.com tanpa batasan geografis

### 2.2 Data yang Dikumpulkan

Papyr hanya mengumpulkan data yang secara teknis diperlukan untuk menjalankan layanan:

#### 2.2.1 File yang Di-upload (Data Sementara)

| Aspek | Detail |
|---|---|
| **Jenis data** | File PDF dan/atau gambar (JPG, PNG, WEBP) yang diunggah pengguna untuk diproses |
| **Tujuan** | Semata-mata untuk menjalankan operasi PDF yang diminta pengguna (compress, convert, dll.) |
| **Durasi penyimpanan** | Maksimal 1 (satu) jam sejak waktu upload |
| **Mekanisme penghapusan** | Otomatis melalui lifecycle policy Cloudflare R2 dan cron job server |
| **Penamaan file** | UUID acak — tidak ada korelasi dengan identitas pengguna |
| **Akses** | Hanya melalui signed URL yang kedaluwarsa dalam 1 jam |
| **Lokasi penyimpanan** | Cloudflare R2 (infrastruktur global Cloudflare) |

> **Catatan Penting:** Untuk fitur yang diproses di sisi klien (Merge PDF, Split PDF, Rotate PDF), file pengguna **tidak pernah meninggalkan perangkat** dan tidak pernah diunggah ke server kami.

#### 2.2.2 Data Analytics Anonim

| Aspek | Detail |
|---|---|
| **Penyedia** | Vercel Analytics |
| **Jenis data** | Statistik kunjungan halaman secara agregat (page views, unique visitors) |
| **Sifat** | Anonim dan agregat — tidak dapat dikaitkan dengan individu tertentu |
| **Cookie** | Tidak menggunakan cookie |
| **Pelacakan individu** | Tidak ada — Vercel Analytics tidak melacak pengguna secara individual |
| **Tujuan** | Memahami performa website dan halaman yang paling sering dikunjungi |

#### 2.2.3 Data Teknis Minimal

| Aspek | Detail |
|---|---|
| **Jenis** | Log server standar (HTTP request logs) yang dikelola oleh penyedia hosting |
| **Isi** | Timestamp, HTTP method, path, status code, response time |
| **Yang TIDAK dicatat** | Alamat IP pengguna, isi file, user agent detail |
| **Retensi** | Sesuai kebijakan penyedia hosting (Vercel, Railway) — umumnya 24-72 jam |
| **Kontrol** | Dikelola oleh penyedia hosting, bukan oleh Papyr secara langsung |

### 2.3 Data yang TIDAK Dikumpulkan

Papyr secara eksplisit **TIDAK** mengumpulkan data berikut:

| Kategori | Status |
|---|---|
| Nama lengkap | ❌ Tidak dikumpulkan |
| Alamat email | ❌ Tidak dikumpulkan |
| Nomor telepon | ❌ Tidak dikumpulkan |
| Alamat fisik | ❌ Tidak dikumpulkan |
| Alamat IP pengguna | ❌ Tidak dicatat/disimpan |
| Cookie pelacakan | ❌ Tidak digunakan |
| Cookie pihak ketiga | ❌ Tidak digunakan |
| Data login/akun | ❌ Tidak ada sistem akun |
| Riwayat penggunaan per pengguna | ❌ Tidak dilacak |
| Isi/konten dokumen | ❌ Tidak dibaca atau dianalisis |
| Metadata dokumen | ❌ Tidak diekstrak atau disimpan |
| Data lokasi (GPS) | ❌ Tidak diminta |
| Data perangkat detail | ❌ Tidak dikumpulkan |
| Data biometrik | ❌ Tidak dikumpulkan |
| Data keuangan/pembayaran | ❌ Tidak ada transaksi |

> **Pernyataan Tegas:** Papyr **TIDAK** menggunakan file yang diunggah pengguna untuk melatih model AI, machine learning, atau keperluan apapun selain pemrosesan yang diminta pengguna.

### 2.4 Tujuan Pengumpulan Data

Setiap data yang dikumpulkan memiliki tujuan yang jelas dan terbatas:

| Data | Tujuan | Dasar Hukum |
|---|---|---|
| File upload (sementara) | Menjalankan operasi PDF yang diminta pengguna | Kepentingan yang sah (legitimate interest) — penyediaan layanan |
| Analytics anonim | Memahami performa website dan prioritas pengembangan fitur | Kepentingan yang sah — peningkatan layanan |
| Log server standar | Pemantauan kesehatan sistem dan debugging | Kepentingan yang sah — keamanan dan keandalan layanan |

### 2.5 Penyimpanan & Retensi Data

#### 2.5.1 Kebijakan Retensi

| Jenis Data | Durasi Retensi | Mekanisme Penghapusan |
|---|---|---|
| File upload | Maksimal 1 jam | Lifecycle policy R2 + cron job otomatis |
| Analytics agregat | Sesuai kebijakan Vercel | Dikelola oleh Vercel |
| Log server | 24-72 jam | Rotasi otomatis oleh penyedia hosting |

#### 2.5.2 Mekanisme Penghapusan File

Papyr menerapkan mekanisme penghapusan berlapis untuk memastikan file pengguna benar-benar dihapus:

1. **Lifecycle Policy (Layer 1):** Cloudflare R2 dikonfigurasi dengan lifecycle rule yang secara otomatis menghapus objek yang berusia lebih dari 1 jam.
2. **Cron Job (Layer 2):** Scheduled task di server backend yang berjalan secara periodik untuk menghapus file yang melewati batas waktu retensi.
3. **Signed URL Expiry (Layer 3):** Link download yang diberikan kepada pengguna kedaluwarsa dalam 1 jam, sehingga akses ke file tidak dimungkinkan setelah periode tersebut.

#### 2.5.3 Lokasi Penyimpanan

| Komponen | Lokasi | Penyedia |
|---|---|---|
| File sementara | Cloudflare R2 (global edge) | Cloudflare, Inc. |
| Frontend & analytics | Vercel Edge Network (global) | Vercel, Inc. |
| Backend processing | Railway (us-west) | Railway Corp. |

### 2.6 Keamanan Data

Papyr menerapkan langkah-langkah keamanan teknis berikut untuk melindungi data pengguna selama pemrosesan:

#### 2.6.1 Keamanan Transmisi

| Kontrol | Implementasi |
|---|---|
| **Enkripsi transit** | Seluruh komunikasi menggunakan HTTPS/TLS 1.3 |
| **HSTS** | HTTP Strict Transport Security diaktifkan |
| **Certificate** | SSL/TLS certificate dikelola oleh Vercel dan Railway |

#### 2.6.2 Keamanan Penyimpanan

| Kontrol | Implementasi |
|---|---|
| **Signed URLs** | Akses file hanya melalui URL bertanda tangan dengan masa berlaku terbatas |
| **UUID filenames** | Nama file acak — tidak dapat ditebak atau di-enumerate |
| **Bucket isolation** | Bucket R2 tidak memiliki public listing |
| **No content logging** | Isi file tidak pernah dicatat dalam log sistem |

#### 2.6.3 Keamanan Aplikasi

| Kontrol | Implementasi |
|---|---|
| **Rate limiting** | Pembatasan jumlah request per IP per menit |
| **CORS policy** | Hanya origin yang diizinkan yang dapat mengakses API |
| **Input validation** | Validasi tipe file, ukuran, dan format sebelum pemrosesan |
| **File size limit** | Maksimal 20 MB per file upload |
| **No execution** | File yang diunggah tidak pernah dieksekusi sebagai kode |

### 2.7 Hak Pengguna

#### 2.7.1 Hak Berdasarkan UU PDP

Berdasarkan Undang-Undang Pelindungan Data Pribadi (UU No. 27 Tahun 2022), subjek data memiliki hak-hak tertentu. Berikut penerapannya dalam konteks Papyr:

| Hak | Penerapan di Papyr |
|---|---|
| **Hak atas informasi** | Kebijakan Privasi ini menyediakan informasi lengkap tentang pemrosesan data |
| **Hak akses** | Tidak ada data pribadi yang disimpan — tidak ada data untuk diakses |
| **Hak koreksi** | Tidak relevan — tidak ada data pribadi yang disimpan |
| **Hak penghapusan** | File otomatis dihapus dalam 1 jam — penghapusan terjamin tanpa perlu permintaan |
| **Hak penarikan persetujuan** | Tidak relevan — tidak ada persetujuan yang diminta karena tidak ada data pribadi yang dikumpulkan |
| **Hak keberatan** | Pengguna dapat berhenti menggunakan layanan kapan saja tanpa konsekuensi |
| **Hak portabilitas** | Tidak relevan — tidak ada data pribadi yang disimpan |

#### 2.7.2 Hak Berdasarkan GDPR (untuk Pengguna Internasional)

Untuk pengguna yang berada di wilayah Uni Eropa/EEA, hak-hak berikut berlaku:

| Hak GDPR | Penerapan di Papyr |
|---|---|
| Right to be informed | Kebijakan Privasi ini memenuhi kewajiban transparansi |
| Right of access | Tidak ada data pribadi yang disimpan |
| Right to rectification | Tidak relevan |
| Right to erasure | Otomatis terpenuhi — file dihapus dalam 1 jam |
| Right to restrict processing | Pengguna dapat memilih untuk tidak menggunakan layanan |
| Right to data portability | Tidak relevan |
| Right to object | Pengguna bebas berhenti menggunakan layanan |
| Rights related to automated decision-making | Tidak ada automated decision-making yang mempengaruhi pengguna |

#### 2.7.3 Catatan Khusus

Karena Papyr **tidak memiliki sistem akun** dan **tidak menyimpan data pribadi**, sebagian besar hak subjek data secara otomatis terpenuhi melalui desain sistem. Tidak ada data yang perlu dihapus, dikoreksi, atau ditransfer karena memang tidak ada data pribadi yang disimpan.

### 2.8 Cookie & Pelacakan

#### 2.8.1 Pernyataan Cookie

**Papyr TIDAK menggunakan cookie dalam bentuk apapun**, termasuk:

| Jenis Cookie | Status |
|---|---|
| Cookie fungsional | ❌ Tidak digunakan |
| Cookie analitik | ❌ Tidak digunakan |
| Cookie pelacakan | ❌ Tidak digunakan |
| Cookie pihak ketiga | ❌ Tidak digunakan |
| Local storage untuk tracking | ❌ Tidak digunakan |
| Session storage untuk tracking | ❌ Tidak digunakan |
| Fingerprinting | ❌ Tidak dilakukan |

#### 2.8.2 Teknologi Pelacakan

| Teknologi | Digunakan? | Keterangan |
|---|---|---|
| Vercel Analytics | ✅ Ya | Privacy-friendly, tanpa cookie, data agregat anonim |
| Google Analytics | ❌ Tidak | — |
| Facebook Pixel | ❌ Tidak | — |
| Hotjar/Clarity | ❌ Tidak | — |
| Advertising trackers | ❌ Tidak | — |

#### 2.8.3 Implikasi

Karena Papyr tidak menggunakan cookie, **cookie consent banner/popup TIDAK diperlukan** berdasarkan ePrivacy Directive (EU) maupun regulasi Indonesia.

### 2.9 Pihak Ketiga & Pembagian Data

#### 2.9.1 Penyedia Layanan (Sub-Processors)

Papyr menggunakan penyedia layanan pihak ketiga berikut untuk operasional:

| Penyedia | Fungsi | Data yang Diakses | Lokasi |
|---|---|---|---|
| Vercel, Inc. | Hosting frontend, analytics | Traffic data agregat | Global (Edge) |
| Railway Corp. | Hosting backend API | File selama pemrosesan | US-West |
| Cloudflare, Inc. | Object storage (R2) | File sementara (maks 1 jam) | Global |
| Hostinger | Domain & DNS | DNS records | — |

#### 2.9.2 Pernyataan Pembagian Data

Papyr **TIDAK**:
- Menjual data pengguna kepada pihak ketiga
- Membagikan data pengguna untuk keperluan periklanan
- Mentransfer data pengguna ke pihak ketiga untuk tujuan selain penyediaan layanan
- Menggunakan data pengguna untuk profiling atau targeted advertising

### 2.10 Pengguna Anak-Anak

Papyr tidak secara khusus ditujukan untuk anak-anak di bawah usia 13 tahun. Namun, karena layanan ini tidak mengumpulkan data pribadi apapun dan tidak memerlukan akun, risiko terhadap privasi anak-anak sangat minimal. Tidak ada mekanisme verifikasi usia karena tidak ada data pribadi yang dikumpulkan.

### 2.11 Transfer Data Internasional

File yang diunggah pengguna dapat diproses melalui infrastruktur yang berlokasi di luar Indonesia (Cloudflare R2 global, Railway US-West). Namun:

1. File bersifat **sementara** (maksimal 1 jam)
2. File **tidak mengandung identitas pengguna** (UUID filename)
3. File **tidak dapat dikaitkan** dengan individu tertentu
4. Seluruh penyedia layanan memiliki **standar keamanan enterprise-grade**

### 2.12 Perubahan Kebijakan Privasi

- Perubahan terhadap Kebijakan Privasi ini akan dipublikasikan langsung di halaman mypapyr.com/privacy.
- Tanggal "Terakhir Diperbarui" di bagian atas halaman akan diubah sesuai tanggal revisi.
- Karena Papyr tidak mengumpulkan informasi kontak pengguna, **notifikasi individual tidak dimungkinkan**. Pengguna disarankan untuk memeriksa halaman ini secara berkala.
- Penggunaan layanan setelah perubahan dipublikasikan dianggap sebagai penerimaan terhadap kebijakan yang diperbarui.

### 2.13 Kontak

Untuk pertanyaan, keluhan, atau permintaan terkait privasi:

| Saluran | Detail |
|---|---|
| **Email** | privacy@mypapyr.com |
| **GitHub Issues** | github.com/fazulfi/papyr/issues |
| **Penanggung Jawab** | Muhammad Fa'iz Zulfikar (Product Owner & Pengembang) |

---

## 3. Syarat & Ketentuan (Terms of Service)

### 3.1 Definisi

Dalam Syarat & Ketentuan ini, istilah-istilah berikut memiliki arti sebagai berikut:

| Istilah | Definisi |
|---|---|
| **"Papyr"** atau **"Layanan"** | Platform utilitas PDF berbasis web yang dapat diakses melalui mypapyr.com, termasuk seluruh fitur, fungsi, dan konten yang tersedia di dalamnya |
| **"Pengguna"** atau **"Anda"** | Setiap individu atau entitas yang mengakses dan/atau menggunakan Layanan |
| **"Kami"** atau **"Pengembang"** | Muhammad Fa'iz Zulfikar selaku pemilik dan pengembang Papyr |
| **"Konten Pengguna"** | File PDF, gambar, atau dokumen lain yang diunggah oleh Pengguna ke Layanan untuk diproses |
| **"Website"** | Situs web yang dapat diakses di alamat mypapyr.com |
| **"Fitur Client-Side"** | Operasi PDF yang diproses sepenuhnya di perangkat Pengguna (browser) tanpa mengunggah file ke server |
| **"Fitur Server-Side"** | Operasi PDF yang memerlukan pengunggahan file ke server untuk diproses |
| **"Signed URL"** | Tautan unduh bertanda tangan digital dengan masa berlaku terbatas |

### 3.2 Penerimaan Syarat

#### 3.2.1 Persetujuan

Dengan mengakses atau menggunakan Papyr, Anda menyatakan bahwa:

1. Anda telah membaca, memahami, dan menyetujui Syarat & Ketentuan ini secara keseluruhan.
2. Anda memiliki kapasitas hukum untuk mengikatkan diri pada perjanjian ini.
3. Jika Anda menggunakan Layanan atas nama suatu organisasi, Anda memiliki wewenang untuk mengikatkan organisasi tersebut pada Syarat & Ketentuan ini.

#### 3.2.2 Penolakan

Jika Anda tidak menyetujui Syarat & Ketentuan ini, Anda tidak diperkenankan untuk menggunakan Layanan. Penggunaan Layanan secara berkelanjutan setelah perubahan Syarat & Ketentuan dianggap sebagai penerimaan terhadap perubahan tersebut.

### 3.3 Penggunaan Layanan

#### 3.3.1 Deskripsi Layanan

Papyr menyediakan layanan utilitas PDF berbasis web yang mencakup:

| Fitur | Deskripsi | Tipe Pemrosesan |
|---|---|---|
| Compress PDF | Mengecilkan ukuran file PDF | Server-side |
| Merge PDF | Menggabungkan beberapa file PDF menjadi satu | Client-side |
| Split PDF | Memisahkan halaman dari file PDF | Client-side |
| Rotate PDF | Memutar halaman PDF | Client-side |
| Image to PDF | Mengkonversi gambar ke format PDF | Client-side + Server-side (fallback) |
| PDF to Image | Mengkonversi halaman PDF ke gambar | Server-side |

#### 3.3.2 Ketersediaan Layanan

- Papyr disediakan secara **"as-is"** dan **"as-available"**.
- Kami berupaya menjaga ketersediaan Layanan 24/7, namun **tidak menjamin** uptime 100%.
- Layanan dapat mengalami gangguan karena pemeliharaan, pembaruan, atau faktor di luar kendali kami.
- Kami berhak untuk memodifikasi, menangguhkan, atau menghentikan Layanan (atau bagian darinya) kapan saja tanpa pemberitahuan sebelumnya.

#### 3.3.3 Biaya

- Seluruh fitur Papyr tersedia secara **gratis** tanpa batasan penggunaan.
- Tidak ada model freemium, upsell, atau fitur berbayar.
- Kami berhak untuk memperkenalkan fitur berbayar di masa depan, namun fitur yang saat ini gratis akan tetap gratis.

### 3.4 Batasan Penggunaan

#### 3.4.1 Penggunaan yang Dilarang

Pengguna **DILARANG** menggunakan Papyr untuk:

1. **Konten ilegal:** Memproses dokumen yang mengandung konten ilegal berdasarkan hukum Republik Indonesia, termasuk namun tidak terbatas pada:
   - Pornografi anak
   - Materi terkait terorisme atau radikalisme
   - Dokumen palsu atau pemalsuan identitas
   - Materi yang melanggar UU ITE (UU No. 11 Tahun 2008 jo. UU No. 19 Tahun 2016)

2. **Penyalahgunaan sistem:** Melakukan tindakan yang mengganggu atau merusak infrastruktur Layanan, termasuk:
   - Serangan DDoS (Distributed Denial of Service)
   - Brute force atau automated abuse
   - Upaya untuk melewati rate limiting
   - Reverse engineering atau decompiling kode sumber
   - Scraping atau automated data extraction

3. **Pelanggaran hak pihak ketiga:** Memproses dokumen yang melanggar hak kekayaan intelektual, hak cipta, atau hak privasi pihak ketiga tanpa otorisasi yang sah.

4. **Penggunaan komersial yang merugikan:** Menggunakan Layanan sebagai komponen infrastruktur layanan komersial pihak ketiga tanpa izin tertulis (misalnya: menjual kembali layanan Papyr, mengintegrasikan API tanpa izin).

#### 3.4.2 Batasan Teknis

| Parameter | Batasan |
|---|---|
| **Ukuran file maksimal** | 20 MB per file |
| **Rate limiting** | 10 request per menit per IP |
| **Retensi file** | Maksimal 1 jam — file dihapus otomatis |
| **Format yang didukung** | PDF, JPG, PNG, WEBP |
| **Concurrent uploads** | Sesuai kapasitas server yang tersedia |

#### 3.4.3 Penegakan

Kami berhak untuk:
- Memblokir akses dari IP address yang melanggar batasan penggunaan
- Menghapus file yang dicurigai melanggar ketentuan ini
- Melaporkan aktivitas ilegal kepada pihak berwenang yang berwajib
- Menangguhkan atau menghentikan akses tanpa pemberitahuan sebelumnya

### 3.5 Hak Kekayaan Intelektual

#### 3.5.1 Kepemilikan Layanan

- Seluruh hak kekayaan intelektual atas Papyr — termasuk namun tidak terbatas pada kode sumber, desain antarmuka, logo, nama merek, dan konten website — adalah milik eksklusif Muhammad Fa'iz Zulfikar.
- Kode sumber Papyr bersifat **proprietary** dan dilindungi oleh hukum hak cipta yang berlaku.
- Tidak ada bagian dari Syarat & Ketentuan ini yang memberikan lisensi atau hak atas kekayaan intelektual Papyr kepada Pengguna.

#### 3.5.2 Konten Pengguna

- Pengguna **mempertahankan seluruh hak** atas file dan dokumen yang diunggah ke Layanan.
- Papyr **TIDAK** mengklaim kepemilikan atas Konten Pengguna.
- Dengan mengunggah file, Pengguna memberikan lisensi terbatas, non-eksklusif, dan sementara kepada Papyr semata-mata untuk tujuan memproses file sesuai permintaan Pengguna.
- Lisensi ini berakhir secara otomatis ketika file dihapus dari sistem (maksimal 1 jam setelah upload).

#### 3.5.3 Tanggung Jawab Pengguna

Pengguna menjamin bahwa:
- Mereka memiliki hak atau otorisasi yang sah untuk memproses file yang diunggah
- File yang diunggah tidak melanggar hak cipta, merek dagang, atau hak kekayaan intelektual pihak ketiga
- Mereka bertanggung jawab penuh atas konten file yang diunggah

### 3.6 Penafian (Disclaimer)

#### 3.6.1 Penafian Umum

LAYANAN INI DISEDIAKAN "SEBAGAIMANA ADANYA" (AS-IS) DAN "SEBAGAIMANA TERSEDIA" (AS-AVAILABLE) TANPA JAMINAN DALAM BENTUK APAPUN, BAIK TERSURAT MAUPUN TERSIRAT, TERMASUK NAMUN TIDAK TERBATAS PADA:

- Jaminan kelayakan untuk tujuan tertentu (fitness for a particular purpose)
- Jaminan kelayakan untuk diperdagangkan (merchantability)
- Jaminan tidak adanya pelanggaran hak pihak ketiga (non-infringement)
- Jaminan ketersediaan layanan tanpa gangguan
- Jaminan bebas dari kesalahan atau cacat (error-free)

#### 3.6.2 Penafian Kualitas Output

- Kami **tidak menjamin** bahwa hasil pemrosesan PDF akan memenuhi ekspektasi kualitas tertentu.
- Kompresi PDF dapat mengakibatkan penurunan kualitas visual yang bervariasi tergantung pada konten dokumen.
- Konversi format (Image-to-PDF, PDF-to-Image) dapat menghasilkan output yang berbeda dari dokumen asli.
- Pengguna disarankan untuk **selalu menyimpan salinan asli** dokumen sebelum memproses melalui Papyr.

#### 3.6.3 Penafian Keamanan

- Meskipun kami menerapkan langkah-langkah keamanan yang wajar, kami **tidak menjamin** keamanan absolut dari file yang diunggah.
- Pengguna bertanggung jawab untuk menilai risiko sebelum mengunggah dokumen sensitif atau rahasia.
- Untuk dokumen yang sangat sensitif, kami merekomendasikan penggunaan fitur client-side (Merge, Split, Rotate) yang tidak mengunggah file ke server.

### 3.7 Batasan Tanggung Jawab

#### 3.7.1 Pembatasan

SEJAUH DIIZINKAN OLEH HUKUM YANG BERLAKU, DALAM KEADAAN APAPUN PAPYR, PENGEMBANG, ATAU AFILIASINYA TIDAK BERTANGGUNG JAWAB ATAS:

1. **Kerugian tidak langsung** (indirect damages), termasuk namun tidak terbatas pada kehilangan keuntungan, kehilangan data, gangguan bisnis, atau kerugian konsekuensial lainnya.
2. **Kerusakan atau kehilangan file** yang terjadi selama atau setelah pemrosesan.
3. **Ketidaktersediaan layanan** atau gangguan akses yang disebabkan oleh faktor di luar kendali kami.
4. **Tindakan pihak ketiga** termasuk penyedia hosting, penyedia infrastruktur, atau pihak lain yang berada di luar kendali langsung kami.
5. **Penggunaan yang tidak sesuai** dengan Syarat & Ketentuan ini oleh Pengguna.

#### 3.7.2 Batas Maksimal Tanggung Jawab

Dalam hal apapun, total tanggung jawab kumulatif Papyr terhadap Pengguna tidak akan melebihi **Rp 0 (nol Rupiah)**, mengingat Layanan disediakan secara gratis tanpa biaya apapun kepada Pengguna.

#### 3.7.3 Pengecualian

Pembatasan tanggung jawab di atas tidak berlaku untuk:
- Kerugian yang disebabkan oleh kelalaian berat (gross negligence) atau kesengajaan dari pihak Papyr
- Hal-hal yang tidak dapat dibatasi berdasarkan hukum yang berlaku di Indonesia

### 3.8 Ganti Rugi (Indemnification)

Pengguna setuju untuk membebaskan, membela, dan mengganti rugi Papyr, Pengembang, dan afiliasinya dari dan terhadap segala klaim, tuntutan, kerugian, biaya, dan pengeluaran (termasuk biaya hukum yang wajar) yang timbul dari atau terkait dengan:

1. Pelanggaran Pengguna terhadap Syarat & Ketentuan ini
2. Pelanggaran Pengguna terhadap hak pihak ketiga
3. Konten Pengguna yang diunggah ke Layanan
4. Penggunaan Layanan yang melanggar hukum yang berlaku

### 3.9 Perubahan Layanan

#### 3.9.1 Hak Modifikasi

Kami berhak untuk sewaktu-waktu dan tanpa pemberitahuan sebelumnya:

- Menambah, mengubah, atau menghapus fitur Layanan
- Mengubah batasan teknis (ukuran file, rate limit, dll.)
- Memperbarui teknologi atau infrastruktur yang mendasari Layanan
- Menangguhkan atau menghentikan Layanan secara keseluruhan

#### 3.9.2 Perubahan Syarat & Ketentuan

- Perubahan terhadap Syarat & Ketentuan ini akan dipublikasikan di halaman yang relevan di Website.
- Tanggal "Terakhir Diperbarui" akan diubah sesuai tanggal revisi.
- Penggunaan Layanan secara berkelanjutan setelah perubahan dipublikasikan dianggap sebagai penerimaan terhadap Syarat & Ketentuan yang diperbarui.

### 3.10 Hukum yang Berlaku

#### 3.10.1 Yurisdiksi

Syarat & Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Negara Republik Indonesia, tanpa memperhatikan prinsip-prinsip konflik hukum.

#### 3.10.2 Peraturan yang Berlaku

Layanan ini tunduk pada peraturan perundang-undangan Indonesia yang berlaku, termasuk namun tidak terbatas pada:

| Peraturan | Relevansi |
|---|---|
| UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi | Perlindungan data pengguna |
| UU No. 11 Tahun 2008 jo. UU No. 19 Tahun 2016 tentang ITE | Transaksi elektronik dan konten digital |
| PP No. 71 Tahun 2019 tentang PSTE | Penyelenggaraan sistem dan transaksi elektronik |
| UU No. 28 Tahun 2014 tentang Hak Cipta | Perlindungan kekayaan intelektual |

### 3.11 Penyelesaian Sengketa

#### 3.11.1 Musyawarah

Setiap perselisihan yang timbul dari atau terkait dengan Syarat & Ketentuan ini akan diselesaikan terlebih dahulu melalui musyawarah untuk mufakat antara para pihak dalam jangka waktu 30 (tiga puluh) hari kalender sejak salah satu pihak menyampaikan pemberitahuan tertulis mengenai perselisihan tersebut.

#### 3.11.2 Mediasi

Apabila musyawarah tidak menghasilkan kesepakatan dalam jangka waktu yang ditentukan, para pihak sepakat untuk menyelesaikan perselisihan melalui mediasi yang difasilitasi oleh mediator independen yang disepakati bersama.

#### 3.11.3 Arbitrase/Pengadilan

Apabila mediasi tidak berhasil, perselisihan akan diselesaikan melalui:
- **Arbitrase** di bawah aturan Badan Arbitrase Nasional Indonesia (BANI), atau
- **Pengadilan Negeri** yang berwenang di wilayah hukum Republik Indonesia

#### 3.11.4 Bahasa

Seluruh proses penyelesaian sengketa akan dilakukan dalam Bahasa Indonesia.

### 3.12 Ketentuan Umum

#### 3.12.1 Keterpisahan (Severability)

Apabila suatu ketentuan dalam Syarat & Ketentuan ini dinyatakan tidak sah, tidak berlaku, atau tidak dapat dilaksanakan oleh pengadilan atau otoritas yang berwenang, ketentuan tersebut akan dipisahkan dari Syarat & Ketentuan ini tanpa mempengaruhi keabsahan dan keberlakuan ketentuan-ketentuan lainnya.

#### 3.12.2 Keseluruhan Perjanjian

Syarat & Ketentuan ini, bersama dengan Kebijakan Privasi, merupakan keseluruhan perjanjian antara Pengguna dan Papyr terkait penggunaan Layanan dan menggantikan seluruh perjanjian, pernyataan, atau pemahaman sebelumnya.

#### 3.12.3 Pengabaian (Waiver)

Kegagalan Papyr untuk melaksanakan atau menegakkan hak atau ketentuan apapun dalam Syarat & Ketentuan ini tidak dianggap sebagai pengabaian atas hak atau ketentuan tersebut.

#### 3.12.4 Pengalihan (Assignment)

Pengguna tidak dapat mengalihkan hak atau kewajibannya berdasarkan Syarat & Ketentuan ini tanpa persetujuan tertulis dari Papyr. Papyr dapat mengalihkan hak dan kewajibannya tanpa persetujuan Pengguna.

---

## 4. Kepatuhan UU PDP

### 4.1 Ringkasan UU PDP

Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) adalah regulasi utama Indonesia yang mengatur pemrosesan data pribadi. UU ini mulai berlaku efektif pada Oktober 2024 (setelah masa transisi 2 tahun).

### 4.2 Analisis Kepatuhan

#### 4.2.1 Klasifikasi Papyr dalam UU PDP

| Aspek | Analisis |
|---|---|
| **Peran Papyr** | Pengendali Data (Data Controller) — namun dengan cakupan sangat minimal |
| **Jenis data yang diproses** | File dokumen (bukan data pribadi dalam definisi UU PDP) |
| **Subjek data** | Tidak teridentifikasi — tidak ada mekanisme identifikasi pengguna |
| **Tingkat risiko** | **Sangat Rendah** — tidak ada data pribadi yang dikumpulkan atau disimpan |

#### 4.2.2 Pemenuhan Kewajiban UU PDP

| Kewajiban (Pasal) | Status | Keterangan |
|---|---|---|
| **Dasar pemrosesan yang sah** (Pasal 20) | ✅ Terpenuhi | Kepentingan yang sah (legitimate interest) untuk penyediaan layanan |
| **Pemberitahuan kepada subjek data** (Pasal 21) | ✅ Terpenuhi | Kebijakan Privasi tersedia di mypapyr.com/privacy |
| **Pembatasan pemrosesan** (Pasal 16) | ✅ Terpenuhi | Hanya memproses file sesuai permintaan pengguna, tidak ada pemrosesan tambahan |
| **Keakuratan data** (Pasal 17) | ✅ N/A | Tidak ada data pribadi yang disimpan |
| **Pelindungan & keamanan** (Pasal 35) | ✅ Terpenuhi | HTTPS, signed URLs, auto-delete, rate limiting |
| **Penyimpanan terbatas** (Pasal 18) | ✅ Terpenuhi | File dihapus otomatis dalam 1 jam |
| **Hak subjek data** (Pasal 5-13) | ✅ Terpenuhi | Otomatis terpenuhi karena tidak ada data pribadi yang disimpan |
| **Notifikasi pelanggaran** (Pasal 46) | ⚠️ Perlu prosedur | Perlu SOP jika terjadi data breach (meskipun risiko sangat rendah) |
| **DPO (Data Protection Officer)** (Pasal 53) | ❌ Tidak wajib | Tidak wajib untuk skala dan jenis pemrosesan Papyr |
| **DPIA (Data Protection Impact Assessment)** (Pasal 34) | ❌ Tidak wajib | Tidak wajib karena pemrosesan tidak berisiko tinggi |
| **Transfer data lintas batas** (Pasal 56) | ⚠️ Perlu perhatian | File diproses di infrastruktur global — namun bersifat sementara dan anonim |

#### 4.2.3 Kesimpulan Kepatuhan UU PDP

**Status: PATUH (Compliant) dengan catatan minor**

Papyr memiliki tingkat kepatuhan yang tinggi terhadap UU PDP karena:

1. **Prinsip minimalisasi data** diterapkan secara ketat — tidak ada data pribadi yang dikumpulkan.
2. **Transparansi** terpenuhi melalui Kebijakan Privasi yang jelas dan mudah diakses.
3. **Keamanan** diterapkan melalui enkripsi, signed URLs, dan auto-delete.
4. **Hak subjek data** otomatis terpenuhi karena tidak ada data pribadi yang disimpan.

**Catatan untuk perbaikan:**
- Menyiapkan SOP notifikasi pelanggaran data (meskipun risiko sangat rendah)
- Mendokumentasikan Record of Processing Activities (RoPA) secara formal

### 4.3 Risiko Hukum

| Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|
| Pelanggaran data (data breach) | Sangat Rendah | Rendah (tidak ada data pribadi) | Auto-delete 1 jam, signed URLs, enkripsi |
| Tuntutan subjek data | Sangat Rendah | Rendah | Tidak ada data pribadi yang disimpan |
| Sanksi regulator | Sangat Rendah | Rendah | Kepatuhan proaktif, transparansi |
| Transfer data lintas batas | Rendah | Rendah | Data bersifat sementara dan anonim |

---

## 5. Kepatuhan GDPR

### 5.1 Relevansi GDPR untuk Papyr

General Data Protection Regulation (GDPR) berlaku untuk Papyr jika:
- Pengguna dari wilayah EU/EEA mengakses layanan, ATAU
- Papyr secara aktif menargetkan pengguna di EU/EEA

**Analisis:** Papyr secara primer menargetkan pengguna Indonesia (UI Bahasa Indonesia, domain .com). Namun, layanan dapat diakses secara global, sehingga awareness terhadap GDPR tetap diperlukan.

### 5.2 Analisis Kepatuhan GDPR

#### 5.2.1 Prinsip-Prinsip GDPR

| Prinsip GDPR (Pasal 5) | Status | Keterangan |
|---|---|---|
| **Lawfulness, fairness, transparency** | ✅ Terpenuhi | Kebijakan Privasi jelas, pemrosesan berdasarkan legitimate interest |
| **Purpose limitation** | ✅ Terpenuhi | Data hanya diproses untuk tujuan yang diminta pengguna |
| **Data minimisation** | ✅ Terpenuhi | Hanya file yang diperlukan yang dikumpulkan, tidak ada data pribadi |
| **Accuracy** | ✅ N/A | Tidak ada data pribadi yang disimpan |
| **Storage limitation** | ✅ Terpenuhi | Auto-delete dalam 1 jam |
| **Integrity and confidentiality** | ✅ Terpenuhi | HTTPS, signed URLs, access controls |
| **Accountability** | ✅ Terpenuhi | Dokumentasi kebijakan, transparansi |

#### 5.2.2 Dasar Hukum Pemrosesan (Pasal 6)

| Dasar Hukum | Relevansi |
|---|---|
| **Legitimate Interest (Pasal 6(1)(f))** | ✅ Dasar utama — penyediaan layanan yang diminta pengguna |
| Consent (Pasal 6(1)(a)) | Tidak diperlukan — tidak ada data pribadi yang dikumpulkan |
| Contract (Pasal 6(1)(b)) | Tidak relevan — tidak ada kontrak formal |

#### 5.2.3 Hak Subjek Data (Pasal 12-23)

Seluruh hak subjek data GDPR secara otomatis terpenuhi karena Papyr tidak mengumpulkan atau menyimpan data pribadi. Lihat Bagian 2.7.2 untuk detail.

#### 5.2.4 Transfer Data Internasional (Pasal 44-49)

| Aspek | Analisis |
|---|---|
| **Transfer ke negara ketiga** | File diproses di infrastruktur Cloudflare (global) dan Railway (US) |
| **Mekanisme transfer** | Standard Contractual Clauses (SCCs) dari penyedia layanan |
| **Risiko** | Sangat rendah — data bersifat sementara, anonim, dan tidak mengandung data pribadi |

### 5.3 Kesimpulan Kepatuhan GDPR

**Status: PATUH (Compliant) — Risiko Sangat Rendah**

Papyr memiliki posisi kepatuhan GDPR yang kuat karena:
1. Tidak mengumpulkan data pribadi (personal data) sebagaimana didefinisikan dalam GDPR
2. Tidak menggunakan cookie atau teknologi pelacakan
3. Menerapkan prinsip data minimisation secara ketat
4. File bersifat sementara dan tidak dapat dikaitkan dengan individu

**Tidak diperlukan:**
- Cookie consent banner (tidak ada cookie)
- Data Protection Officer (DPO) — skala pemrosesan tidak memenuhi threshold
- Data Protection Impact Assessment (DPIA) — pemrosesan tidak berisiko tinggi
- Pendaftaran ke otoritas pengawas — tidak ada pemrosesan data pribadi skala besar

---

## 6. Rekomendasi Legal

### 6.1 Rekomendasi Jangka Pendek (0-3 Bulan)

| # | Rekomendasi | Prioritas | Status |
|---|---|---|---|
| 1 | Deploy halaman Syarat & Ketentuan di mypapyr.com/terms | Tinggi | 📋 Belum |
| 2 | Tambahkan link ke halaman Terms di footer website | Tinggi | 📋 Belum |
| 3 | Update halaman Privacy Policy sesuai versi formal di dokumen ini | Sedang | 📋 Belum |
| 4 | Tambahkan tanggal efektif yang jelas di kedua halaman legal | Sedang | 📋 Belum |
| 5 | Buat SOP sederhana untuk notifikasi data breach | Rendah | 📋 Belum |

### 6.2 Rekomendasi Jangka Menengah (3-6 Bulan)

| # | Rekomendasi | Prioritas | Trigger |
|---|---|---|---|
| 1 | Implementasi cookie consent banner | Rendah | Hanya jika menambahkan cookie di masa depan |
| 2 | Buat Record of Processing Activities (RoPA) formal | Rendah | Jika skala pemrosesan meningkat signifikan |
| 3 | Review legal pages oleh konsultan hukum | Sedang | Sebelum monetisasi atau jika traffic signifikan |
| 4 | Tambahkan halaman /legal sebagai hub untuk semua dokumen legal | Rendah | Jika ada lebih dari 2 halaman legal |

### 6.3 Rekomendasi Jangka Panjang (6-12 Bulan)

| # | Rekomendasi | Prioritas | Trigger |
|---|---|---|---|
| 1 | Konsultasi hukum formal jika memperkenalkan fitur berbayar | Tinggi | Sebelum monetisasi |
| 2 | Implementasi DPO jika mulai mengumpulkan data pribadi | Tinggi | Jika ada sistem akun/login |
| 3 | DPIA jika memperkenalkan pemrosesan AI/ML pada dokumen | Tinggi | Jika ada fitur AI |
| 4 | Registrasi sebagai PSE (Penyelenggara Sistem Elektronik) | Sedang | Jika diwajibkan oleh regulasi |
| 5 | Perjanjian pemrosesan data (DPA) dengan sub-processors | Sedang | Jika skala bisnis meningkat |

### 6.4 Catatan Penting

> **Cookie Consent:** Saat ini Papyr **TIDAK memerlukan** cookie consent banner karena tidak menggunakan cookie apapun. Vercel Analytics bersifat cookieless. Jika di masa depan Papyr menambahkan fitur yang memerlukan cookie (misalnya: sistem login, preferensi pengguna, A/B testing), maka cookie consent banner WAJIB diimplementasikan sebelum cookie tersebut aktif.

> **Monetisasi:** Jika Papyr memperkenalkan model berbayar di masa depan, seluruh dokumen legal perlu di-review dan diperbarui untuk mencakup: syarat pembayaran, kebijakan refund, pajak (PPN), dan perlindungan konsumen sesuai UU No. 8 Tahun 1999.

---

## 7. Referensi Silang

### 7.1 Dokumen Internal Papyr

| ID Dokumen | Judul | Relevansi |
|---|---|---|
| PPR-SP-001 | Kebijakan Keamanan (Security Policy) | Kontrol keamanan teknis yang mendukung perlindungan data |
| PPR-BRD-001 | Business Requirements Document | Konteks bisnis, arsitektur, dan filosofi privacy-first |
| PPR-SRS-001 | Software Requirements Specification | Spesifikasi teknis fitur dan batasan sistem |
| PPR-IR-001 | Incident Response Plan | Prosedur penanganan insiden termasuk data breach |
| PPR-SLA-001 | Service Level Agreement | Komitmen ketersediaan dan performa layanan |

### 7.2 Referensi Regulasi

| Regulasi | Nomor | Relevansi |
|---|---|---|
| UU Pelindungan Data Pribadi | UU No. 27 Tahun 2022 | Regulasi utama perlindungan data di Indonesia |
| UU Informasi dan Transaksi Elektronik | UU No. 11/2008 jo. UU No. 19/2016 | Regulasi transaksi elektronik dan konten digital |
| PP tentang PSTE | PP No. 71 Tahun 2019 | Penyelenggaraan sistem dan transaksi elektronik |
| UU Hak Cipta | UU No. 28 Tahun 2014 | Perlindungan kekayaan intelektual |
| UU Perlindungan Konsumen | UU No. 8 Tahun 1999 | Hak dan kewajiban konsumen |
| GDPR | Regulation (EU) 2016/679 | Perlindungan data untuk pengguna EU/EEA |
| ePrivacy Directive | Directive 2002/58/EC | Regulasi cookie dan komunikasi elektronik |

### 7.3 Halaman Live di Website

| Halaman | URL | Status |
|---|---|---|
| Kebijakan Privasi | mypapyr.com/privacy | ✅ Live |
| Syarat & Ketentuan | mypapyr.com/terms | 📋 Belum di-deploy |

---

## 8. Persetujuan Dokumen

### 8.1 Tanda Tangan Persetujuan

| Peran | Nama | Status | Tanggal |
|---|---|---|---|
| **Product Owner** | Muhammad Fa'iz Zulfikar | ✅ Approved | Juni 2025 |
| **AI Agent** | OpenCode/Sisyphus | ✅ Approved | Juni 2025 |

### 8.2 Catatan Persetujuan

- Dokumen ini telah ditinjau dan disetujui untuk digunakan sebagai dasar implementasi halaman legal di mypapyr.com.
- Persetujuan ini mencakup seluruh bagian dokumen termasuk Kebijakan Privasi, Syarat & Ketentuan, dan analisis kepatuhan.
- Implementasi di website harus mengikuti konten yang tertulis dalam dokumen ini dengan penyesuaian format sesuai desain UI/UX website.

### 8.3 Disclaimer Dokumen

> Dokumen ini disusun sebagai panduan internal dan **bukan merupakan nasihat hukum profesional**. Untuk keperluan hukum formal, disarankan untuk berkonsultasi dengan konsultan hukum yang berkualifikasi, terutama sebelum monetisasi atau jika terjadi sengketa hukum.

---

*Dokumen ini bersifat rahasia dan hanya untuk penggunaan internal serta keperluan investor.*

*© 2025 Muhammad Fa'iz Zulfikar. All rights reserved.*
