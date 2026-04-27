"""
PAPYR-028 — Generate test PDFs for merge testing.

Generates 6 test files in backend/tests/merge_test_files/:
  1. text_only_a.pdf      — 3 pages, text only, A4 portrait
  2. text_only_b.pdf      — 2 pages, text only, A4 portrait
  3. mixed_content.pdf     — 4 pages, text + images + colored backgrounds
  4. letter_size.pdf       — 2 pages, US Letter (different from A4)
  5. landscape.pdf         — 3 pages, A4 landscape orientation
  6. not_a_pdf.txt         — plain text file (should be rejected by merge)

Usage:
    python generate_merge_test_pdfs.py

After running, open https://frontend-ten-omega-35.vercel.app/merge
and test each scenario described in the output.
"""

import os
import fitz  # PyMuPDF

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "merge_test_files")


def ensure_dir():
    os.makedirs(OUTPUT_DIR, exist_ok=True)


def create_text_only_a():
    """3 pages, A4 portrait, text only."""
    doc = fitz.open()
    for i in range(1, 4):
        page = doc.new_page(width=595, height=842)  # A4
        page.insert_text(
            (72, 100),
            f"File A — Halaman {i}",
            fontsize=24,
            color=(0.12, 0.23, 0.37),  # navy
        )
        page.insert_text(
            (72, 160),
            f"Ini adalah file text_only_a.pdf, halaman ke-{i} dari 3.\n"
            "Digunakan untuk test merge dua PDF sederhana.",
            fontsize=12,
            color=(0.3, 0.3, 0.3),
        )
        # Add page number at bottom
        page.insert_text(
            (280, 800),
            f"— {i} —",
            fontsize=10,
            color=(0.5, 0.5, 0.5),
        )
    path = os.path.join(OUTPUT_DIR, "text_only_a.pdf")
    doc.save(path)
    doc.close()
    return path


def create_text_only_b():
    """2 pages, A4 portrait, text only."""
    doc = fitz.open()
    for i in range(1, 3):
        page = doc.new_page(width=595, height=842)  # A4
        page.insert_text(
            (72, 100),
            f"File B — Halaman {i}",
            fontsize=24,
            color=(0.15, 0.39, 0.92),  # accent blue
        )
        page.insert_text(
            (72, 160),
            f"Ini adalah file text_only_b.pdf, halaman ke-{i} dari 2.\n"
            "File kedua untuk test merge sederhana.",
            fontsize=12,
            color=(0.3, 0.3, 0.3),
        )
        page.insert_text(
            (280, 800),
            f"— {i} —",
            fontsize=10,
            color=(0.5, 0.5, 0.5),
        )
    path = os.path.join(OUTPUT_DIR, "text_only_b.pdf")
    doc.save(path)
    doc.close()
    return path


def create_mixed_content():
    """4 pages with text, colored rectangles (simulating images), and varied layouts."""
    doc = fitz.open()

    # Page 1: Title page with colored background
    page = doc.new_page(width=595, height=842)
    page.draw_rect(fitz.Rect(0, 0, 595, 842), color=None, fill=(0.96, 0.97, 0.98))
    page.draw_rect(fitz.Rect(50, 200, 545, 400), color=None, fill=(0.12, 0.23, 0.37))
    page.insert_text(
        (100, 310),
        "Mixed Content PDF",
        fontsize=32,
        color=(1, 1, 1),
    )
    page.insert_text(
        (100, 350),
        "Halaman 1 — Title page dengan background berwarna",
        fontsize=12,
        color=(0.8, 0.8, 0.8),
    )

    # Page 2: Multiple colored blocks
    page = doc.new_page(width=595, height=842)
    page.insert_text((72, 60), "Halaman 2 — Blok Warna", fontsize=18, color=(0, 0, 0))
    colors = [
        (0.91, 0.30, 0.24),  # red
        (0.18, 0.80, 0.44),  # green
        (0.20, 0.60, 0.86),  # blue
        (0.95, 0.77, 0.06),  # yellow
    ]
    for idx, c in enumerate(colors):
        x = 72 + (idx % 2) * 240
        y = 100 + (idx // 2) * 280
        page.draw_rect(fitz.Rect(x, y, x + 200, y + 240), color=None, fill=c)
        page.insert_text(
            (x + 20, y + 130),
            f"Blok {idx + 1}",
            fontsize=14,
            color=(1, 1, 1),
        )

    # Page 3: Dense text
    page = doc.new_page(width=595, height=842)
    page.insert_text((72, 60), "Halaman 3 — Teks Padat", fontsize=18, color=(0, 0, 0))
    lorem = (
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. "
    )
    y = 100
    for _ in range(20):
        if y > 780:
            break
        page.insert_text((72, y), lorem, fontsize=9, color=(0.2, 0.2, 0.2))
        y += 30

    # Page 4: Footer page
    page = doc.new_page(width=595, height=842)
    page.draw_rect(fitz.Rect(0, 700, 595, 842), color=None, fill=(0.12, 0.23, 0.37))
    page.insert_text(
        (72, 400),
        "Halaman 4 — Akhir dokumen mixed content",
        fontsize=16,
        color=(0.3, 0.3, 0.3),
    )
    page.insert_text(
        (100, 760),
        "© 2026 Papyr — mypapyr.com",
        fontsize=12,
        color=(1, 1, 1),
    )

    path = os.path.join(OUTPUT_DIR, "mixed_content.pdf")
    doc.save(path)
    doc.close()
    return path


def create_letter_size():
    """2 pages, US Letter size (612 x 792 pt) — different from A4."""
    doc = fitz.open()
    for i in range(1, 3):
        page = doc.new_page(width=612, height=792)  # US Letter
        # Draw border to make size difference visible
        page.draw_rect(
            fitz.Rect(20, 20, 592, 772),
            color=(0.8, 0.2, 0.2),
            width=2,
        )
        page.insert_text(
            (72, 100),
            f"US Letter — Halaman {i}",
            fontsize=24,
            color=(0.8, 0.2, 0.2),
        )
        page.insert_text(
            (72, 150),
            "Ukuran: 612 × 792 pt (US Letter)\n"
            "Berbeda dari A4 (595 × 842 pt).\n"
            "Test: merge dengan file A4 harus tetap mempertahankan ukuran masing-masing.",
            fontsize=11,
            color=(0.3, 0.3, 0.3),
        )
    path = os.path.join(OUTPUT_DIR, "letter_size.pdf")
    doc.save(path)
    doc.close()
    return path


def create_landscape():
    """3 pages, A4 landscape (842 x 595 pt)."""
    doc = fitz.open()
    for i in range(1, 4):
        page = doc.new_page(width=842, height=595)  # A4 landscape
        # Draw a wide banner
        page.draw_rect(fitz.Rect(40, 40, 802, 200), color=None, fill=(0.15, 0.39, 0.92))
        page.insert_text(
            (80, 130),
            f"Landscape — Halaman {i}",
            fontsize=28,
            color=(1, 1, 1),
        )
        page.insert_text(
            (80, 260),
            "Orientasi: Landscape (842 × 595 pt)\n"
            "Test: merge landscape + portrait harus mempertahankan orientasi masing-masing halaman.",
            fontsize=11,
            color=(0.3, 0.3, 0.3),
        )
        # Draw some content across the wide page
        for j in range(5):
            x = 80 + j * 150
            page.draw_rect(
                fitz.Rect(x, 320, x + 120, 520),
                color=None,
                fill=(0.9 - j * 0.1, 0.9 - j * 0.05, 1.0),
            )
    path = os.path.join(OUTPUT_DIR, "landscape.pdf")
    doc.save(path)
    doc.close()
    return path


def create_not_a_pdf():
    """Plain text file that should be rejected by the merge tool."""
    path = os.path.join(OUTPUT_DIR, "not_a_pdf.txt")
    with open(path, "w", encoding="utf-8") as f:
        f.write("Ini bukan file PDF.\nHarus ditolak oleh tool merge Papyr.\n")
    return path


def main():
    ensure_dir()

    files = [
        ("1. Text Only A (3 hal, A4)", create_text_only_a),
        ("2. Text Only B (2 hal, A4)", create_text_only_b),
        ("3. Mixed Content (4 hal, A4)", create_mixed_content),
        ("4. US Letter (2 hal)", create_letter_size),
        ("5. Landscape (3 hal, A4)", create_landscape),
        ("6. Not a PDF (.txt)", create_not_a_pdf),
    ]

    print("=" * 60)
    print("PAPYR-028 — Generate Merge Test PDFs")
    print("=" * 60)
    print()

    for label, fn in files:
        path = fn()
        size = os.path.getsize(path)
        print(f"  ✅ {label}")
        print(f"     → {path} ({size:,} bytes)")
        print()

    print("=" * 60)
    print("TEST SCENARIOS")
    print("=" * 60)
    print()
    print("Buka: https://frontend-ten-omega-35.vercel.app/merge")
    print()
    print("Scenario 1: Merge 2 small PDFs (text only)")
    print("  → Upload text_only_a.pdf + text_only_b.pdf")
    print("  → Expected: merged.pdf = 5 halaman (3+2), urutan benar")
    print()
    print("Scenario 2: Merge 5 PDFs with mixed content")
    print("  → Upload semua 5 file PDF (a, b, mixed, letter, landscape)")
    print("  → Expected: merged.pdf = 14 halaman (3+2+4+2+3)")
    print()
    print("Scenario 3: Merge PDFs with different page sizes (A4 + Letter)")
    print("  → Upload text_only_a.pdf + letter_size.pdf")
    print("  → Expected: merged.pdf = 5 halaman, ukuran halaman bervariasi")
    print()
    print("Scenario 4: Merge landscape + portrait")
    print("  → Upload text_only_a.pdf + landscape.pdf")
    print("  → Expected: merged.pdf = 6 halaman, orientasi masing-masing tetap")
    print()
    print("Scenario 5: Reject non-PDF file")
    print("  → Upload not_a_pdf.txt")
    print("  → Expected: error 'bukan file PDF' — file ditolak")
    print()
    print("Scenario 6: Mobile test (Android Chrome)")
    print("  → Buka URL di HP, upload 2 PDF, merge, download")
    print("  → Expected: berfungsi normal")
    print()
    print("Scenario 7: Drag reorder")
    print("  → Upload text_only_b.pdf lalu text_only_a.pdf")
    print("  → Drag B ke posisi 2, A ke posisi 1")
    print("  → Expected: merged.pdf dimulai dari halaman A, lalu B")
    print()


if __name__ == "__main__":
    main()
