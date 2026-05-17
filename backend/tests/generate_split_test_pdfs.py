"""
PAPYR-035 — Generate test PDFs for Split PDF testing.
Generates a 10-page PDF with distinct content per page for easy verification.

Usage:
    cd backend/tests
    python generate_split_test_pdfs.py

Output:
    split_test_files/
        10_pages.pdf          — 10 halaman, tiap halaman ada nomor besar
        single_page.pdf       — 1 halaman saja
        landscape_mixed.pdf   — 8 halaman, campuran portrait + landscape
        not_a_pdf.txt         — file bukan PDF untuk test validasi
"""

import os

import fitz  # PyMuPDF

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "split_test_files")


def create_numbered_pdf(path: str, num_pages: int, label: str = "Halaman") -> None:
    """Create a PDF where each page has a large page number and label."""
    doc = fitz.open()
    for i in range(1, num_pages + 1):
        page = doc.new_page(width=595, height=842)  # A4 portrait
        # Large page number in center
        page.insert_text(
            fitz.Point(180, 450),
            f"{i}",
            fontsize=120,
            fontname="helv",
            color=(0.12, 0.23, 0.37),  # navy
        )
        # Label below
        page.insert_text(
            fitz.Point(150, 520),
            f"{label} {i} dari {num_pages}",
            fontsize=24,
            fontname="helv",
            color=(0.4, 0.4, 0.4),
        )
        # Unique content per page for verification
        page.insert_text(
            fitz.Point(50, 100),
            f"Dokumen: {os.path.basename(path)}",
            fontsize=14,
            fontname="helv",
            color=(0.6, 0.6, 0.6),
        )
        page.insert_text(
            fitz.Point(50, 130),
            f"Konten unik halaman {i}: SPLIT-TEST-PAGE-{i:03d}",
            fontsize=12,
            fontname="helv",
            color=(0.6, 0.6, 0.6),
        )
    doc.save(path)
    doc.close()
    size_kb = os.path.getsize(path) / 1024
    print(f"  ✅ {os.path.basename(path)} — {num_pages} halaman, {size_kb:.1f} KB")


def create_single_page_pdf(path: str) -> None:
    """Create a minimal 1-page PDF."""
    create_numbered_pdf(path, 1, "Satu-satunya halaman")


def create_landscape_mixed_pdf(path: str) -> None:
    """Create 8 pages alternating portrait and landscape."""
    doc = fitz.open()
    for i in range(1, 9):
        if i % 2 == 0:
            # Landscape
            page = doc.new_page(width=842, height=595)
            orientation = "LANDSCAPE"
        else:
            # Portrait
            page = doc.new_page(width=595, height=842)
            orientation = "PORTRAIT"

        page.insert_text(
            fitz.Point(150, 300),
            f"{i}",
            fontsize=100,
            fontname="helv",
            color=(0.15, 0.38, 0.92),  # accent blue
        )
        page.insert_text(
            fitz.Point(100, 380),
            f"Halaman {i} — {orientation}",
            fontsize=20,
            fontname="helv",
            color=(0.3, 0.3, 0.3),
        )
        page.insert_text(
            fitz.Point(50, 80),
            f"SPLIT-MIXED-{i:03d}",
            fontsize=12,
            fontname="helv",
            color=(0.6, 0.6, 0.6),
        )
    doc.save(path)
    doc.close()
    size_kb = os.path.getsize(path) / 1024
    print(f"  ✅ {os.path.basename(path)} — 8 halaman (mixed orientation), {size_kb:.1f} KB")


def create_not_a_pdf(path: str) -> None:
    """Create a plain text file disguised with .txt extension."""
    with open(path, "w") as f:
        f.write("Ini bukan file PDF. Hanya file teks biasa untuk testing validasi.")
    print(f"  ✅ {os.path.basename(path)} — file bukan PDF")


def main() -> None:
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"\n📁 Output: {OUTPUT_DIR}\n")

    # 1. Main test file: 10 pages with clear numbering
    create_numbered_pdf(os.path.join(OUTPUT_DIR, "10_pages.pdf"), 10)

    # 2. Single page PDF (edge case)
    create_single_page_pdf(os.path.join(OUTPUT_DIR, "single_page.pdf"))

    # 3. Mixed orientation (portrait + landscape)
    create_landscape_mixed_pdf(os.path.join(OUTPUT_DIR, "landscape_mixed.pdf"))

    # 4. Non-PDF file for validation test
    create_not_a_pdf(os.path.join(OUTPUT_DIR, "not_a_pdf.txt"))

    print(f"\n✅ Semua file test berhasil dibuat di {OUTPUT_DIR}/")
    print("\n" + "=" * 60)
    print("SKENARIO TEST PAPYR-035 — Split PDF")
    print("=" * 60)
    print("""
Buka https://frontend-ten-omega-35.vercel.app/split

Test 1: Split range 1-3
  → Upload 10_pages.pdf
  → Input: 1-3
  → Klik "Pisahkan PDF"
  → ✅ Output harus 3 halaman (nomor 1, 2, 3)

Test 2: Split single page
  → Upload 10_pages.pdf
  → Input: 5
  → ✅ Output harus 1 halaman (nomor 5)

Test 3: Split multi-range
  → Upload 10_pages.pdf
  → Input: 1-5, 8-10
  → ✅ Output harus 8 halaman (1,2,3,4,5,8,9,10)

Test 4: Invalid input "0"
  → Upload 10_pages.pdf
  → Input: 0
  → ✅ Error message muncul

Test 5: Page exceeds total
  → Upload 10_pages.pdf
  → Input: 15
  → ✅ Error: "Halaman 15 melebihi total halaman dokumen (10)"

Test 6: Start > end
  → Upload 10_pages.pdf
  → Input: 5-3
  → ✅ Error: "Rentang tidak valid..."

Test 7: Mobile test
  → Buka di Android Chrome
  → Upload 10_pages.pdf
  → Split 1-3
  → ✅ Upload, split, download semua berfungsi

Bonus tests:
  → Upload single_page.pdf, split "1" → output 1 halaman
  → Upload landscape_mixed.pdf, split "2,4,6" → 3 halaman landscape
  → Upload not_a_pdf.txt → error validasi MIME type
""")


if __name__ == "__main__":
    main()
