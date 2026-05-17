"""
PAPYR-050 — Generate test PDFs for PDF-to-Image testing.

Usage:
    cd backend/tests
    python generate_p2i_test_pdfs.py

Output:
    p2i_test_files/
        5_pages.pdf           — 5 halaman teks, tiap halaman ada nomor besar
        mixed_content.pdf     — 5 halaman campuran teks + gambar warna-warni
        scanned.pdf           — 3 halaman simulasi scan (full raster, tanpa text layer)
        not_a_pdf.txt         — file bukan PDF untuk test validasi

Skenario test manual:
    1. Upload 5_pages.pdf, pilih halaman 1-2 → download ZIP isi 2 PNG
    2. Upload 5_pages.pdf, pilih halaman 3 → download single PNG
    3. Upload mixed_content.pdf → output harus terbaca (teks + gambar)
    4. Upload scanned.pdf → output harus dirender dengan benar
    5. Input halaman "0" → error jelas
    6. Input halaman "10" di 5_pages.pdf → error jelas
    7. Test di mobile: upload + download berfungsi
"""

import os

import fitz  # PyMuPDF

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "p2i_test_files")


def create_5page_text_pdf(path: str) -> None:
    """5 halaman teks dengan nomor besar di tengah + konten unik per halaman."""
    doc = fitz.open()
    for i in range(1, 6):
        page = doc.new_page(width=595, height=842)  # A4

        # Nomor halaman besar di tengah
        page.insert_text(
            fitz.Point(200, 400),
            f"{i}",
            fontsize=120,
            fontname="helv",
            color=(0.12, 0.23, 0.37),  # navy
        )

        # Label
        page.insert_text(
            fitz.Point(150, 480),
            f"Halaman {i} dari 5",
            fontsize=24,
            fontname="helv",
            color=(0.4, 0.4, 0.4),
        )

        # Identifikasi unik
        page.insert_text(
            fitz.Point(50, 100),
            "Dokumen: 5_pages.pdf",
            fontsize=14,
            fontname="helv",
            color=(0.6, 0.6, 0.6),
        )
        page.insert_text(
            fitz.Point(50, 130),
            f"Konten unik halaman {i}: P2I-TEXT-{i:03d}",
            fontsize=12,
            fontname="helv",
            color=(0.6, 0.6, 0.6),
        )

        # Body text
        text_block = (
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
            "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. "
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.\n\n"
        )
        page.insert_text(
            fitz.Point(50, 550),
            text_block * 3,
            fontsize=10,
            fontname="helv",
        )

    doc.save(path)
    doc.close()
    size_kb = os.path.getsize(path) / 1024
    print(f"  ✅ 5_pages.pdf — 5 halaman teks, {size_kb:.1f} KB")


def create_mixed_content_pdf(path: str) -> None:
    """5 halaman campuran teks + gambar warna-warni."""
    doc = fitz.open()
    for i in range(1, 6):
        page = doc.new_page(width=595, height=842)

        # Header teks
        page.insert_text(
            fitz.Point(50, 80),
            f"Bab {i}: Dokumen Campuran",
            fontsize=18,
            fontname="helv",
            color=(0.12, 0.23, 0.37),
        )

        # Body text
        text = (
            "Dokumen ini berisi campuran teks dan gambar untuk menguji "
            "konversi PDF ke gambar. Setiap halaman memiliki konten unik "
            "yang harus terbaca dengan jelas pada output PNG.\n\n"
            f"Identifikasi halaman: P2I-MIXED-{i:03d}\n\n"
            "Pastikan teks ini terbaca di hasil konversi. "
            "Warna gambar di bawah harus sesuai dengan label.\n"
        )
        page.insert_text(
            fitz.Point(50, 120),
            text,
            fontsize=11,
            fontname="helv",
        )

        # Gambar warna-warni
        pix = fitz.Pixmap(fitz.csRGB, fitz.IRect(0, 0, 400, 250), 0)
        r = (i * 50 + 30) % 256
        g = (i * 80 + 60) % 256
        b = (i * 110 + 90) % 256
        pix.set_rect(pix.irect, (r, g, b))
        page.insert_image(fitz.Rect(100, 300, 500, 550), pixmap=pix)

        # Caption
        page.insert_text(
            fitz.Point(150, 580),
            f"Gambar {i} — warna RGB({r},{g},{b})",
            fontsize=10,
            fontname="helv",
            color=(0.5, 0.5, 0.5),
        )

        # Nomor halaman di bawah
        page.insert_text(
            fitz.Point(280, 800),
            f"— {i} —",
            fontsize=12,
            fontname="helv",
            color=(0.7, 0.7, 0.7),
        )

    doc.save(path)
    doc.close()
    size_kb = os.path.getsize(path) / 1024
    print(f"  ✅ mixed_content.pdf — 5 halaman teks+gambar, {size_kb:.1f} KB")


def create_scanned_pdf(path: str) -> None:
    """3 halaman simulasi scan — full raster, tanpa text layer."""
    doc = fitz.open()
    for i in range(1, 4):
        page = doc.new_page(width=595, height=842)

        # Full-page pixmap simulasi scan
        pix = fitz.Pixmap(fitz.csRGB, fitz.IRect(0, 0, 1190, 1684), 0)

        # Background putih keabu-abuan (seperti kertas scan)
        pix.set_rect(pix.irect, (245, 243, 240))

        # Simulasi baris teks (garis-garis gelap)
        for line in range(20):
            y_start = 100 + line * 70
            # Garis "teks" — strip gelap tipis
            pix.set_rect(
                fitz.IRect(80, y_start, 1100, y_start + 8),
                (30 + (i * 5) % 20, 30 + (i * 5) % 20, 30 + (i * 5) % 20),
            )
            # Spasi antar kata (gap kecil di tengah)
            gap_x = 300 + (line * 47) % 500
            pix.set_rect(
                fitz.IRect(gap_x, y_start, gap_x + 20, y_start + 8),
                (245, 243, 240),  # sama dengan background
            )

        # Nomor halaman di pojok kanan bawah (sebagai bagian dari "scan")
        # Simulasi dengan kotak kecil
        pix.set_rect(fitz.IRect(1050, 1600, 1150, 1640), (60, 60, 60))

        page.insert_image(fitz.Rect(0, 0, 595, 842), pixmap=pix)

    doc.save(path)
    doc.close()
    size_kb = os.path.getsize(path) / 1024
    print(f"  ✅ scanned.pdf — 3 halaman scan (raster only), {size_kb:.1f} KB")


def create_not_a_pdf(path: str) -> None:
    """File teks biasa untuk test validasi."""
    with open(path, "w") as f:
        f.write("Ini bukan file PDF. Hanya file teks biasa untuk testing validasi MIME type.")
    print("  ✅ not_a_pdf.txt — file bukan PDF")


def main() -> None:
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"\n📁 Output: {OUTPUT_DIR}\n")

    create_5page_text_pdf(os.path.join(OUTPUT_DIR, "5_pages.pdf"))
    create_mixed_content_pdf(os.path.join(OUTPUT_DIR, "mixed_content.pdf"))
    create_scanned_pdf(os.path.join(OUTPUT_DIR, "scanned.pdf"))
    create_not_a_pdf(os.path.join(OUTPUT_DIR, "not_a_pdf.txt"))

    print(f"\n✅ Semua file test berhasil dibuat di {OUTPUT_DIR}/")
    print("\n" + "=" * 60)
    print("SKENARIO TEST PAPYR-050 — PDF to Image")
    print("=" * 60)
    print("""
Buka halaman PDF ke Gambar di browser.

Test 1: Multi-page → ZIP
  → Upload 5_pages.pdf
  → Input halaman: 1-2
  → Klik "Ubah ke Gambar"
  → ✅ Download ZIP, isi 2 file PNG (page_1.png, page_2.png)
  → ✅ Buka PNG — harus ada nomor "1" dan "2" besar

Test 2: Single page → PNG
  → Upload 5_pages.pdf
  → Input halaman: 3
  → Klik "Ubah ke Gambar"
  → ✅ Download single PNG (bukan ZIP)
  → ✅ Buka PNG — harus ada nomor "3" besar

Test 3: PDF campuran teks + gambar
  → Upload mixed_content.pdf
  → Input halaman: 1-2
  → ✅ Output harus terbaca — teks jelas, gambar warna-warni terlihat

Test 4: PDF scan (raster only)
  → Upload scanned.pdf
  → Input halaman: 1
  → ✅ Output PNG harus menampilkan "halaman scan" dengan garis-garis

Test 5: Halaman tidak valid "0"
  → Upload 5_pages.pdf
  → Input halaman: 0
  → ✅ Muncul error yang jelas (bukan crash)

Test 6: Halaman melebihi total
  → Upload 5_pages.pdf
  → Input halaman: 10
  → ✅ Muncul error: "Halaman 10 di luar jangkauan. PDF ini memiliki 5 halaman."

Test 7: Mobile
  → Buka di HP (Android Chrome / Safari iOS)
  → Upload 5_pages.pdf
  → Pilih halaman 1-2
  → ✅ Upload, konversi, download semua berfungsi
""")


if __name__ == "__main__":
    main()
