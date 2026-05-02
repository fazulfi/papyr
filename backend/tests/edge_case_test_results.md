# PAPYR-078 — Edge Case Test Results

**Tanggal:** 2026-04-30 13:45
**Total tests:** 13 (13 passed, 0 failed)

## Results

| # | Test Case | Status | HTTP | Detail | Waktu |
|---|-----------|--------|------|--------|-------|
| 1 | compress: empty file (0 bytes) | ✅ | 400 | File kosong. Silakan upload file PDF yang valid. | 787ms |
| 2 | compress: fake PDF (JPEG renamed to .pdf) | ✅ | 400 | "fake.pdf" bukan file PDF yang valid. Konten file  | 765ms |
| 3 | compress: password-protected PDF | ✅ | 400 | PDF ini dilindungi kata sandi dan tidak dapat dipr | 833ms |
| 4 | compress: tiny PDF (1 page, <10KB) | ✅ | 200 | {'download_url': 'https://4061cf40c14de3c97cd7af53 | 1564ms |
| 5 | pdf-to-image: empty file | ✅ | 400 | "empty.pdf" kosong. Silakan upload file PDF yang v | 782ms |
| 6 | pdf-to-image: fake PDF (JPEG content) | ✅ | 400 | "fake.pdf" bukan file PDF yang valid. Konten file  | 1769ms |
| 7 | pdf-to-image: password-protected PDF | ✅ | 400 | PDF ini dilindungi kata sandi dan tidak dapat dipr | 767ms |
| 8 | pdf-to-image: tiny PDF (1 page) | ✅ | 200 | {'download_url': 'https://4061cf40c14de3c97cd7af53 | 1457ms |
| 9 | pdf-to-image: invalid page '0' | ✅ | 400 | Halaman 0 di luar jangkauan. PDF ini memiliki 1 ha | 549ms |
| 10 | pdf-to-image: out-of-bounds page '99' | ✅ | 400 | Halaman 99 di luar jangkauan. PDF ini memiliki 1 h | 743ms |
| 11 | image-to-pdf: empty file | ✅ | 400 | "empty.png" kosong. Silakan upload gambar yang val | 767ms |
| 12 | image-to-pdf: PDF instead of image | ✅ | 400 | "document.pdf" bukan format yang didukung. Hanya J | 797ms |
| 13 | image-to-pdf: small valid PNG | ✅ | 200 | {'download_url': 'https://4061cf40c14de3c97cd7af53 | 1391ms |

## Edge Cases Tested

1. **Empty file (0 bytes)** → Harus menampilkan error yang jelas
2. **File .pdf tapi isi JPEG** → Harus gagal dengan pesan yang tepat
3. **PDF dilindungi password** → Harus menampilkan pesan khusus
4. **PDF sangat kecil (<10KB)** → Harus tetap berfungsi
5. **File maksimum (20MB)** → Harus tetap berfungsi
6. **File melebihi batas (>20MB)** → Harus menampilkan error ukuran
