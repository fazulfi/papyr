"""
PAPYR-021 — Benchmark Papyr vs iLovePDF.

Generates 3 test PDFs, compresses via Papyr API, saves originals + Papyr results.
User must manually compress the same originals via ilovepdf.com and record results.

Usage:
    python tests/benchmark_compress.py [--api-url URL]

Output:
    tests/benchmark/ — folder with original PDFs + Papyr compressed PDFs
    tests/benchmark_results.md — results template (fill in iLovePDF column manually)
"""

import argparse
import io
import os
import time
from pathlib import Path

import fitz  # PyMuPDF
import requests

DEFAULT_API_URL = "https://papyr-production.up.railway.app"
COMPRESS_ENDPOINT = "/api/compress"
OUTPUT_DIR = Path(__file__).parent / "benchmark"


# ─── PDF Generators (realistic content) ─────────────────────────────────────


def generate_text_document() -> tuple[bytes, str]:
    """1. Dokumen teks — surat/laporan multi-halaman."""
    doc = fitz.open()

    paragraphs = [
        "Kepada Yth. Bapak/Ibu Pimpinan,",
        "Dengan hormat, bersama surat ini kami sampaikan laporan bulanan untuk periode April 2026. "
        "Laporan ini mencakup ringkasan kegiatan operasional, pencapaian target, dan rencana kerja "
        "untuk bulan berikutnya.",
        "Pada bulan ini, tim kami berhasil menyelesaikan beberapa proyek penting yang telah "
        "direncanakan sejak awal kuartal. Berikut adalah ringkasan pencapaian utama:",
        "1. Implementasi sistem manajemen dokumen digital yang memungkinkan seluruh karyawan "
        "mengakses dan mengelola dokumen secara terpusat.",
        "2. Peningkatan infrastruktur jaringan kantor yang menghasilkan peningkatan kecepatan "
        "akses internet sebesar 40% dibandingkan bulan sebelumnya.",
        "3. Pelaksanaan program pelatihan karyawan dengan total 120 jam pelatihan yang diikuti "
        "oleh 85% karyawan aktif.",
        "4. Penyelesaian audit internal yang menunjukkan tingkat kepatuhan sebesar 97% terhadap "
        "standar operasional prosedur yang berlaku.",
        "Demikian laporan ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.",
        "Hormat kami,\nTim Operasional",
    ]

    for page_num in range(15):
        page = doc.new_page(width=595, height=842)
        y = 72
        page.insert_text((72, y), f"LAPORAN BULANAN — Halaman {page_num + 1}", fontsize=16, fontname="helv")
        y += 40

        for para in paragraphs:
            if y > 750:
                break
            # Insert text with word wrap approximation
            page.insert_text((72, y), para[:90], fontsize=10, fontname="helv")
            y += 15
            if len(para) > 90:
                page.insert_text((72, y), para[90:180], fontsize=10, fontname="helv")
                y += 15
            if len(para) > 180:
                page.insert_text((72, y), para[180:270], fontsize=10, fontname="helv")
                y += 15
            y += 8

    buf = io.BytesIO()
    doc.save(buf)
    doc.close()
    return buf.getvalue(), "01-text-document"


def generate_scanned_document() -> tuple[bytes, str]:
    """2. Dokumen scan — simulasi scan dengan noise pattern (~5-15MB)."""
    doc = fitz.open()

    for page_num in range(6):
        page = doc.new_page(width=595, height=842)

        # Use 100dpi equivalent to keep file under 20MB
        pix = fitz.Pixmap(fitz.csRGB, fitz.IRect(0, 0, 827, 1170), 0)

        # Fill with off-white base (like scanned paper)
        pix.set_rect(pix.irect, (245, 242, 238))

        # Add "text" blocks as dark rectangles (simulates scanned text lines)
        for line_y in range(80, 1100, 22):
            line_width = 550 + (page_num * 37 + line_y * 7) % 150
            rect = fitz.IRect(70, line_y, 70 + line_width, line_y + 6)
            gray = 30 + (line_y * 3) % 40
            pix.set_rect(rect, (gray, gray, gray))

        # Add a "header" block
        pix.set_rect(fitz.IRect(70, 35, 750, 60), (20, 20, 20))

        page.insert_image(fitz.Rect(0, 0, 595, 842), pixmap=pix)

    buf = io.BytesIO()
    doc.save(buf)
    doc.close()
    return buf.getvalue(), "02-scanned-document"


def generate_presentation() -> tuple[bytes, str]:
    """3. Presentasi dengan gambar — slide deck dengan warna dan shapes."""
    doc = fitz.open()

    slide_colors = [
        (30, 58, 95),    # Navy (Papyr brand)
        (37, 99, 235),   # Blue (Papyr accent)
        (220, 38, 38),   # Red
        (22, 163, 74),   # Green
        (147, 51, 234),  # Purple
        (234, 88, 12),   # Orange
    ]

    for slide_num in range(12):
        page = doc.new_page(width=842, height=595)  # Landscape

        # Background color
        bg = slide_colors[slide_num % len(slide_colors)]
        pix = fitz.Pixmap(fitz.csRGB, fitz.IRect(0, 0, 842, 595), 0)
        pix.set_rect(pix.irect, bg)

        # Add "content area" (lighter rectangle)
        lighter = tuple(min(255, c + 40) for c in bg)
        pix.set_rect(fitz.IRect(50, 80, 792, 545), lighter)

        # Add "chart" blocks
        for bar_x in range(100, 700, 80):
            bar_height = 100 + (slide_num * 37 + bar_x * 13) % 200
            bar_color = tuple(min(255, c + 80) for c in bg)
            pix.set_rect(
                fitz.IRect(bar_x, 400 - bar_height, bar_x + 50, 400),
                bar_color,
            )

        page.insert_image(fitz.Rect(0, 0, 842, 595), pixmap=pix)

        # Title text (white on dark)
        page.insert_text(
            (80, 60),
            f"Slide {slide_num + 1}: Strategi Bisnis Q2 2026",
            fontsize=20,
            fontname="helv",
            color=(1, 1, 1),
        )

    buf = io.BytesIO()
    doc.save(buf)
    doc.close()
    return buf.getvalue(), "03-presentation"


# ─── Helpers ─────────────────────────────────────────────────────────────────


def fmt_size(size_bytes: int) -> str:
    if size_bytes >= 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.1f} MB"
    elif size_bytes >= 1024:
        return f"{size_bytes / 1024:.1f} KB"
    return f"{size_bytes} B"


def compress_via_papyr(api_url: str, pdf_bytes: bytes, filename: str) -> dict:
    """Compress via Papyr API (ebook preset)."""
    url = f"{api_url}{COMPRESS_ENDPOINT}?quality=ebook"
    start = time.time()

    resp = requests.post(
        url,
        files={"file": (f"{filename}.pdf", pdf_bytes, "application/pdf")},
        timeout=60,
    )
    elapsed_ms = int((time.time() - start) * 1000)

    if resp.status_code == 200:
        data = resp.json()
        # Download the compressed file
        dl_resp = requests.get(data["download_url"], timeout=30)
        compressed_bytes = dl_resp.content if dl_resp.status_code == 200 else b""

        return {
            "status": "OK",
            "original_size": data["original_size"],
            "compressed_size": data["compressed_size"],
            "saved_percent": data["saved_percent"],
            "compressed_bytes": compressed_bytes,
            "elapsed_ms": elapsed_ms,
        }
    else:
        detail = resp.json().get("detail", resp.text[:200]) if resp.headers.get("content-type", "").startswith("application/json") else resp.text[:200]
        return {"status": "ERROR", "detail": detail, "elapsed_ms": elapsed_ms}


# ─── Main ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PAPYR-021 Benchmark Script")
    parser.add_argument("--api-url", default=DEFAULT_API_URL)
    parser.add_argument("--local", action="store_true", help="Use localhost:8000")
    args = parser.parse_args()

    api_url = "http://127.0.0.1:8000" if args.local else args.api_url

    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"\n{'='*70}")
    print(f"  PAPYR-021 — Benchmark: Papyr vs iLovePDF")
    print(f"  API: {api_url}")
    print(f"{'='*70}\n")

    generators = [
        ("Dokumen Teks (surat/laporan)", generate_text_document),
        ("Dokumen Scan (simulasi)", generate_scanned_document),
        ("Presentasi (gambar + warna)", generate_presentation),
    ]

    results = []

    for test_name, generator in generators:
        print(f"▶ {test_name}")

        # Generate
        pdf_bytes, label = generator()
        input_size = len(pdf_bytes)
        print(f"  Generated: {label} ({fmt_size(input_size)})")

        # Save original
        orig_path = OUTPUT_DIR / f"{label}-original.pdf"
        orig_path.write_bytes(pdf_bytes)
        print(f"  Saved: {orig_path.name}")

        # Compress via Papyr
        result = compress_via_papyr(api_url, pdf_bytes, label)

        if result["status"] == "OK":
            # Save Papyr compressed
            papyr_path = OUTPUT_DIR / f"{label}-papyr.pdf"
            papyr_path.write_bytes(result["compressed_bytes"])
            print(
                f"  Papyr: {fmt_size(result['original_size'])} → {fmt_size(result['compressed_size'])} "
                f"(hemat {result['saved_percent']}%) [{result['elapsed_ms']}ms]"
            )
            print(f"  Saved: {papyr_path.name}")

            results.append({
                "test_name": test_name,
                "label": label,
                "input_size": input_size,
                "papyr_size": result["compressed_size"],
                "papyr_percent": result["saved_percent"],
                "papyr_ms": result["elapsed_ms"],
            })
        else:
            print(f"  ❌ Papyr error: {result.get('detail', 'Unknown')}")
            results.append({
                "test_name": test_name,
                "label": label,
                "input_size": input_size,
                "papyr_size": None,
                "papyr_percent": None,
                "papyr_ms": None,
            })

        print()
        time.sleep(2)

    # Generate benchmark report template
    report_lines = [
        "# PAPYR-021 — Benchmark: Papyr vs iLovePDF",
        "",
        f"**Tanggal:** {time.strftime('%Y-%m-%d %H:%M WIB')}",
        f"**Papyr preset:** ebook (150 dpi)",
        f"**iLovePDF preset:** default (recommended compression)",
        "",
        "## Hasil Perbandingan",
        "",
        "| File | Input | Papyr Output | Papyr % | iLovePDF Output | iLovePDF % | Pemenang |",
        "|------|-------|-------------|---------|-----------------|------------|----------|",
    ]

    for r in results:
        papyr_col = fmt_size(r["papyr_size"]) if r["papyr_size"] else "❌ Error"
        papyr_pct = f"{r['papyr_percent']}%" if r["papyr_percent"] is not None else "—"
        report_lines.append(
            f"| {r['test_name']} | {fmt_size(r['input_size'])} | "
            f"{papyr_col} | {papyr_pct} | "
            f"___ KB/MB | __% | ___ |"
        )

    report_lines.extend([
        "",
        "## Instruksi Pengisian iLovePDF",
        "",
        "1. Buka https://www.ilovepdf.com/compress_pdf",
        "2. Upload file `*-original.pdf` dari folder `tests/benchmark/`",
        "3. Pilih **Recommended Compression**",
        "4. Catat ukuran output dan persentase",
        "5. Isi kolom iLovePDF di tabel di atas",
        "6. Bandingkan visual quality: buka kedua file (`*-papyr.pdf` dan hasil iLovePDF) di browser",
        "",
        "## File Test",
        "",
    ])

    for r in results:
        report_lines.append(f"- `{r['label']}-original.pdf` ({fmt_size(r['input_size'])})")

    report_lines.extend([
        "",
        "## Catatan",
        "",
        "- Test PDF menggunakan synthetic content (generated via PyMuPDF)",
        "- Solid-color images compress sangat baik — hasil real-world akan berbeda",
        "- Untuk benchmark akurat, gunakan PDF asli (scan KTP, presentasi, laporan)",
        "- Papyr menggunakan Ghostscript /ebook preset (150 dpi)",
        "",
    ])

    report_path = Path(__file__).parent / "benchmark_results.md"
    report_path.write_text("\n".join(report_lines), encoding="utf-8")

    print(f"\n📄 Report template: {report_path}")
    print(f"📁 Test files: {OUTPUT_DIR}/")
    print(f"\n{'='*70}")
    print(f"  Next: Upload *-original.pdf files to ilovepdf.com")
    print(f"  and fill in the benchmark_results.md table")
    print(f"{'='*70}")
