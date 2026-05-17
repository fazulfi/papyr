"""
PAPYR-077 — Generate realistic Indonesian-style test files.

Creates test files that simulate real-world Indonesian documents:
1. Scan KTP/ijazah (image-heavy, large)
2. Laporan kantor multi-page (text + tables)
3. Tugas kuliah (mix of text and images)
4. Foto dokumen dari HP (low quality JPG)
5. Invoice (small, text-only)

Usage:
    python tests/generate_indonesia_test_files.py

Output: tests/indonesia_test_files/
"""

import io
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image, ImageDraw

OUTPUT_DIR = Path(__file__).parent / "indonesia_test_files"


def generate_scan_ktp() -> None:
    """1. Simulated KTP scan — image-heavy, ~2MB."""
    print("  Generating: scan_ktp_ijazah.pdf")

    doc = fitz.open()

    for _page_idx, doc_type in enumerate(["KTP", "Ijazah", "Akta Kelahiran"]):
        page = doc.new_page(width=595, height=842)

        # Create a raster image that simulates a scanned document
        img = Image.new("RGB", (1200, 800), color=(245, 240, 230))
        draw = ImageDraw.Draw(img)

        # Simulate scan artifacts — slightly off-white background with noise
        for x in range(0, 1200, 3):
            for y in range(0, 800, 3):
                r = 240 + (x * y) % 15
                g = 235 + (x + y) % 10
                b = 225 + (x * 3 + y) % 12
                draw.point((x, y), fill=(min(r, 255), min(g, 255), min(b, 255)))

        # Draw document border
        draw.rectangle([50, 50, 1150, 750], outline=(0, 0, 0), width=3)

        # Header
        draw.text((100, 80), "REPUBLIK INDONESIA", fill=(0, 0, 0))
        draw.text((100, 110), f"DOKUMEN: {doc_type}", fill=(0, 0, 0))

        # Simulated fields
        fields = [
            ("NIK", "3201234567890001"),
            ("Nama", "BUDI SANTOSO"),
            ("Tempat/Tgl Lahir", "JAKARTA, 15-03-1990"),
            ("Jenis Kelamin", "LAKI-LAKI"),
            ("Alamat", "JL. MERDEKA NO. 17 RT 003/RW 005"),
            ("Kel/Desa", "MENTENG"),
            ("Kecamatan", "MENTENG"),
            ("Agama", "ISLAM"),
            ("Status Perkawinan", "BELUM KAWIN"),
            ("Pekerjaan", "KARYAWAN SWASTA"),
        ]

        y_pos = 180
        for label, value in fields:
            draw.text((100, y_pos), f"{label}: {value}", fill=(30, 30, 30))
            y_pos += 40

        # Photo placeholder
        draw.rectangle([900, 180, 1100, 420], outline=(100, 100, 100), width=2)
        draw.text((940, 280), "FOTO", fill=(150, 150, 150))
        draw.text((930, 310), "3x4 cm", fill=(150, 150, 150))

        # Save as JPEG (simulates scan quality)
        img_bytes = io.BytesIO()
        img.save(img_bytes, format="JPEG", quality=75)

        rect = fitz.Rect(0, 0, 595, 842)
        page.insert_image(rect, stream=img_bytes.getvalue())

    doc.save(str(OUTPUT_DIR / "scan_ktp_ijazah.pdf"))
    doc.close()
    size = (OUTPUT_DIR / "scan_ktp_ijazah.pdf").stat().st_size
    print(f"    → {size / 1024:.1f} KB ({doc_type} scan, 3 pages)")


def generate_laporan_kantor() -> None:
    """2. Multi-page office report with text + tables."""
    print("  Generating: laporan_kantor.pdf")

    doc = fitz.open()

    # Cover page
    page = doc.new_page(width=595, height=842)
    page.insert_text(
        fitz.Point(150, 200),
        "LAPORAN BULANAN",
        fontsize=28,
        fontname="helv",
        color=(0.12, 0.23, 0.37),
    )
    page.insert_text(
        fitz.Point(150, 250), "PT. MAJU BERSAMA INDONESIA", fontsize=18, fontname="helv"
    )
    page.insert_text(
        fitz.Point(150, 300), "Periode: Januari — Maret 2025", fontsize=14, fontname="helv"
    )
    page.insert_text(
        fitz.Point(150, 340), "Divisi: Teknologi Informasi", fontsize=14, fontname="helv"
    )
    page.insert_text(fitz.Point(150, 700), "Jakarta, 1 April 2025", fontsize=12, fontname="helv")
    page.insert_text(fitz.Point(150, 720), "Disusun oleh: Tim IT", fontsize=12, fontname="helv")

    # Content pages
    sections = [
        (
            "1. Ringkasan Eksekutif",
            "Pada kuartal pertama tahun 2025, divisi IT telah menyelesaikan beberapa proyek "
            "strategis yang mendukung transformasi digital perusahaan. Total 15 proyek telah "
            "diselesaikan dengan tingkat keberhasilan 93%. Anggaran yang digunakan sebesar "
            "Rp 2.450.000.000 dari total alokasi Rp 3.000.000.000 (81.7%).\n\n"
            "Pencapaian utama meliputi migrasi sistem ERP ke cloud, implementasi sistem "
            "keamanan baru, dan peluncuran aplikasi mobile untuk karyawan.",
        ),
        (
            "2. Proyek yang Diselesaikan",
            "2.1 Migrasi ERP ke Cloud\n"
            "   Status: Selesai (100%)\n"
            "   Anggaran: Rp 800.000.000\n"
            "   Tim: 8 orang\n\n"
            "2.2 Sistem Keamanan Siber\n"
            "   Status: Selesai (100%)\n"
            "   Anggaran: Rp 450.000.000\n"
            "   Tim: 5 orang\n\n"
            "2.3 Aplikasi Mobile Karyawan\n"
            "   Status: Selesai (100%)\n"
            "   Anggaran: Rp 350.000.000\n"
            "   Tim: 6 orang",
        ),
        (
            "3. Kendala dan Solusi",
            "Beberapa kendala yang dihadapi selama kuartal ini:\n\n"
            "a) Keterlambatan pengiriman server dari vendor (2 minggu)\n"
            "   Solusi: Menggunakan cloud sementara selama masa tunggu\n\n"
            "b) Turnover karyawan di tim development (2 orang resign)\n"
            "   Solusi: Rekrutmen cepat + knowledge transfer intensif\n\n"
            "c) Perubahan regulasi OJK terkait data privacy\n"
            "   Solusi: Audit keamanan tambahan + update kebijakan",
        ),
        (
            "4. Rencana Kuartal Berikutnya",
            "Prioritas Q2 2025:\n\n"
            "1. Implementasi AI chatbot untuk customer service\n"
            "2. Upgrade infrastruktur jaringan kantor cabang\n"
            "3. Pelatihan keamanan siber untuk seluruh karyawan\n"
            "4. Integrasi sistem pembayaran digital\n"
            "5. Audit ISO 27001\n\n"
            "Estimasi anggaran: Rp 1.500.000.000\n"
            "Target penyelesaian: Juni 2025",
        ),
    ]

    for title, content in sections:
        page = doc.new_page(width=595, height=842)
        page.insert_text(
            fitz.Point(72, 72), title, fontsize=16, fontname="helv", color=(0.12, 0.23, 0.37)
        )
        # Insert content with word wrap
        rect = fitz.Rect(72, 110, 523, 770)
        page.insert_textbox(rect, content, fontsize=11, fontname="helv")

    doc.save(str(OUTPUT_DIR / "laporan_kantor.pdf"))
    doc.close()
    size = (OUTPUT_DIR / "laporan_kantor.pdf").stat().st_size
    print(f"    → {size / 1024:.1f} KB (5 pages, text + tables)")


def generate_tugas_kuliah() -> None:
    """3. University assignment — mix of text and images."""
    print("  Generating: tugas_kuliah.pdf")

    doc = fitz.open()

    # Cover
    page = doc.new_page(width=595, height=842)
    page.insert_text(
        fitz.Point(100, 200), "TUGAS AKHIR", fontsize=28, fontname="helv", color=(0.12, 0.23, 0.37)
    )
    page.insert_text(
        fitz.Point(100, 260), "ANALISIS PENGARUH MEDIA SOSIAL", fontsize=16, fontname="helv"
    )
    page.insert_text(
        fitz.Point(100, 285), "TERHADAP PERILAKU KONSUMEN", fontsize=16, fontname="helv"
    )
    page.insert_text(fitz.Point(100, 310), "DI INDONESIA", fontsize=16, fontname="helv")
    page.insert_text(fitz.Point(100, 400), "Oleh:", fontsize=12, fontname="helv")
    page.insert_text(
        fitz.Point(100, 420), "Siti Nurhaliza (NIM: 2021001234)", fontsize=12, fontname="helv"
    )
    page.insert_text(fitz.Point(100, 460), "Program Studi: Manajemen", fontsize=12, fontname="helv")
    page.insert_text(
        fitz.Point(100, 480), "Fakultas Ekonomi dan Bisnis", fontsize=12, fontname="helv"
    )
    page.insert_text(fitz.Point(100, 500), "Universitas Indonesia", fontsize=12, fontname="helv")
    page.insert_text(fitz.Point(100, 700), "Jakarta, 2025", fontsize=12, fontname="helv")

    # Content pages with charts (simulated as colored rectangles)
    for i in range(7):
        page = doc.new_page(width=595, height=842)

        # Header
        page.insert_text(
            fitz.Point(72, 50),
            f"BAB {i + 1}",
            fontsize=14,
            fontname="helv",
            color=(0.12, 0.23, 0.37),
        )

        # Text content
        text = (
            "Berdasarkan hasil penelitian yang telah dilakukan, ditemukan bahwa "
            "penggunaan media sosial memiliki pengaruh signifikan terhadap perilaku "
            "konsumen di Indonesia. Data menunjukkan bahwa 78% responden mengaku "
            "pernah membeli produk setelah melihat iklan di media sosial.\n\n"
            "Temuan ini sejalan dengan teori Uses and Gratifications yang menyatakan "
            "bahwa konsumen aktif memilih media yang sesuai dengan kebutuhan mereka. "
            "Dalam konteks e-commerce Indonesia, platform seperti Tokopedia, Shopee, "
            "dan Bukalapak telah berhasil memanfaatkan media sosial sebagai kanal "
            "pemasaran utama.\n\n"
        ) * 2

        rect = fitz.Rect(72, 80, 523, 400)
        page.insert_textbox(rect, text, fontsize=10, fontname="helv")

        # Simulated chart/diagram
        chart_img = Image.new("RGB", (400, 300), color=(248, 249, 250))
        draw = ImageDraw.Draw(chart_img)

        # Bar chart simulation
        colors_list = [(37, 99, 235), (30, 58, 95), (100, 150, 200), (200, 100, 100)]
        bar_heights = [200, 150, 180, 120]
        for j, (h, c) in enumerate(zip(bar_heights, colors_list, strict=False)):
            x = 50 + j * 90
            draw.rectangle([x, 280 - h, x + 60, 280], fill=c)

        draw.text((50, 10), f"Grafik {i + 1}.1 — Data Responden", fill=(0, 0, 0))
        draw.line([(40, 280), (380, 280)], fill=(0, 0, 0), width=2)

        img_bytes = io.BytesIO()
        chart_img.save(img_bytes, format="PNG")
        chart_rect = fitz.Rect(100, 420, 500, 720)
        page.insert_image(chart_rect, stream=img_bytes.getvalue())

    doc.save(str(OUTPUT_DIR / "tugas_kuliah.pdf"))
    doc.close()
    size = (OUTPUT_DIR / "tugas_kuliah.pdf").stat().st_size
    print(f"    → {size / 1024:.1f} KB (8 pages, text + charts)")


def generate_foto_dokumen() -> None:
    """4. Phone photos of documents — low quality JPGs."""
    print("  Generating: foto_ktp.jpg, foto_bukti_transfer.jpg, foto_formulir.jpg")

    configs = [
        ("foto_ktp.jpg", (1080, 720), "KTP — BUDI SANTOSO\nNIK: 3201234567890001"),
        (
            "foto_bukti_transfer.jpg",
            (720, 1280),
            "BUKTI TRANSFER\nBank BCA\nRp 1.500.000\nTgl: 15/03/2025",
        ),
        (
            "foto_formulir.jpg",
            (1080, 1440),
            "FORMULIR PENDAFTARAN\nNama: ___________\nAlamat: ___________",
        ),
    ]

    for filename, size, text in configs:
        # Simulate phone photo — slightly warm tone, not perfectly aligned
        img = Image.new("RGB", size, color=(250, 245, 235))
        draw = ImageDraw.Draw(img)

        # Add some "paper" texture
        for x in range(0, size[0], 2):
            for y in range(0, size[1], 2):
                shade = 240 + ((x + y) % 15)
                draw.point((x, y), fill=(shade, shade - 5, shade - 10))

        # Document content
        draw.rectangle([30, 30, size[0] - 30, size[1] - 30], outline=(50, 50, 50), width=2)

        y_offset = 80
        for line in text.split("\n"):
            draw.text((60, y_offset), line, fill=(20, 20, 20))
            y_offset += 40

        # Save as low-quality JPEG (simulates phone camera)
        img.save(str(OUTPUT_DIR / filename), format="JPEG", quality=60)
        fsize = (OUTPUT_DIR / filename).stat().st_size
        print(f"    → {filename}: {fsize / 1024:.1f} KB")


def generate_invoice() -> None:
    """5. Small text-only invoice PDF."""
    print("  Generating: invoice_toko.pdf")

    doc = fitz.open()
    page = doc.new_page(width=595, height=842)

    # Header
    page.insert_text(
        fitz.Point(72, 72), "INVOICE", fontsize=24, fontname="helv", color=(0.12, 0.23, 0.37)
    )
    page.insert_text(fitz.Point(72, 105), "No: INV-2025-0342", fontsize=11, fontname="helv")
    page.insert_text(fitz.Point(72, 125), "Tanggal: 15 Maret 2025", fontsize=11, fontname="helv")

    # From/To
    page.insert_text(
        fitz.Point(72, 170), "Dari:", fontsize=10, fontname="helv", color=(0.4, 0.4, 0.4)
    )
    page.insert_text(fitz.Point(72, 185), "Toko Elektronik Jaya", fontsize=11, fontname="helv")
    page.insert_text(
        fitz.Point(72, 200), "Jl. Mangga Dua No. 45, Jakarta Utara", fontsize=10, fontname="helv"
    )

    page.insert_text(
        fitz.Point(350, 170), "Kepada:", fontsize=10, fontname="helv", color=(0.4, 0.4, 0.4)
    )
    page.insert_text(fitz.Point(350, 185), "PT. Maju Bersama", fontsize=11, fontname="helv")
    page.insert_text(
        fitz.Point(350, 200), "Jl. Sudirman No. 100, Jakarta", fontsize=10, fontname="helv"
    )

    # Table header
    y = 260
    page.draw_rect(fitz.Rect(72, y, 523, y + 25), color=(0.12, 0.23, 0.37), fill=(0.12, 0.23, 0.37))
    page.insert_text(fitz.Point(80, y + 17), "Item", fontsize=10, fontname="helv", color=(1, 1, 1))
    page.insert_text(fitz.Point(250, y + 17), "Qty", fontsize=10, fontname="helv", color=(1, 1, 1))
    page.insert_text(
        fitz.Point(310, y + 17), "Harga", fontsize=10, fontname="helv", color=(1, 1, 1)
    )
    page.insert_text(
        fitz.Point(420, y + 17), "Total", fontsize=10, fontname="helv", color=(1, 1, 1)
    )

    # Items
    items = [
        ("Laptop ASUS VivoBook 14", "2", "Rp 8.500.000", "Rp 17.000.000"),
        ("Mouse Logitech M331", "5", "Rp 250.000", "Rp 1.250.000"),
        ("Keyboard Mechanical", "3", "Rp 450.000", "Rp 1.350.000"),
        ("Monitor LG 24 inch", "2", "Rp 2.100.000", "Rp 4.200.000"),
        ("Kabel HDMI 2m", "10", "Rp 35.000", "Rp 350.000"),
    ]

    y += 30
    for item, qty, price, total in items:
        page.insert_text(fitz.Point(80, y + 15), item, fontsize=10, fontname="helv")
        page.insert_text(fitz.Point(255, y + 15), qty, fontsize=10, fontname="helv")
        page.insert_text(fitz.Point(310, y + 15), price, fontsize=10, fontname="helv")
        page.insert_text(fitz.Point(420, y + 15), total, fontsize=10, fontname="helv")
        page.draw_line(fitz.Point(72, y + 25), fitz.Point(523, y + 25), color=(0.8, 0.8, 0.8))
        y += 28

    # Total
    y += 10
    page.draw_rect(
        fitz.Rect(350, y, 523, y + 30), color=(0.95, 0.95, 0.95), fill=(0.95, 0.95, 0.95)
    )
    page.insert_text(
        fitz.Point(360, y + 20), "TOTAL:", fontsize=12, fontname="helv", color=(0.12, 0.23, 0.37)
    )
    page.insert_text(
        fitz.Point(420, y + 20),
        "Rp 24.150.000",
        fontsize=12,
        fontname="helv",
        color=(0.12, 0.23, 0.37),
    )

    # Footer
    page.insert_text(
        fitz.Point(72, 700),
        "Pembayaran: Transfer Bank BCA 1234567890",
        fontsize=10,
        fontname="helv",
    )
    page.insert_text(fitz.Point(72, 720), "a.n. Toko Elektronik Jaya", fontsize=10, fontname="helv")
    page.insert_text(
        fitz.Point(72, 760),
        "Terima kasih atas kepercayaan Anda.",
        fontsize=10,
        fontname="helv",
        color=(0.4, 0.4, 0.4),
    )

    doc.save(str(OUTPUT_DIR / "invoice_toko.pdf"))
    doc.close()
    size = (OUTPUT_DIR / "invoice_toko.pdf").stat().st_size
    print(f"    → {size / 1024:.1f} KB (1 page, text-only invoice)")


# --- Main ---------------------------------------------------------------------

if __name__ == "__main__":
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"\n📁 Output: {OUTPUT_DIR}")
    print(f"{'=' * 60}")

    generate_scan_ktp()
    generate_laporan_kantor()
    generate_tugas_kuliah()
    generate_foto_dokumen()
    generate_invoice()

    print(f"\n{'=' * 60}")
    print("✅ Semua file test Indonesia berhasil di-generate!")
    print()
    print("Manual test scenarios:")
    print("  1. scan_ktp_ijazah.pdf → Compress → verify masih terbaca")
    print("  2. laporan_kantor.pdf (5 hal) → Merge dengan file lain → verify urutan")
    print("  3. tugas_kuliah.pdf (8 hal) → Split halaman 3-5 → verify 3 halaman")
    print("  4. foto_*.jpg (3 foto) → Image to PDF → verify terbaca")
    print("  5. invoice_toko.pdf → PDF to Image → verify output bersih")
