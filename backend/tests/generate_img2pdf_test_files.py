"""
PAPYR-042 — Generator file test untuk Image to PDF.
Menghasilkan berbagai file gambar untuk testing konversi gambar ke PDF.

Jalankan:
    cd backend/tests
    python generate_img2pdf_test_files.py
"""

import os
import struct
import zlib

OUTPUT_DIR = "img2pdf_test_files"


def ensure_dir():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"📁 Output directory: {OUTPUT_DIR}/\n")


# ---------------------------------------------------------------------------
# Minimal JPG generator (no Pillow needed)
# ---------------------------------------------------------------------------

def _create_minimal_jpg(width: int, height: int, r: int, g: int, b: int) -> bytes:
    """Create a minimal valid JPEG with solid color using raw JFIF encoding."""
    # This creates a tiny valid JPEG. For larger images we tile this approach.
    # Using a simple approach: create BMP-like data and wrap in JPEG markers.
    # Simpler: use a known minimal JPEG structure.

    # Actually, let's use a raw PPM → JPEG approach won't work without encoder.
    # Instead, create a valid minimal JPEG with quantization tables.
    # For simplicity, we'll create a 1x1 JPEG and note the limitation,
    # OR use PIL if available, falling back to raw bytes.

    try:
        from PIL import Image
        import io
        img = Image.new("RGB", (width, height), (r, g, b))
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=85)
        return buf.getvalue()
    except ImportError:
        # Fallback: create a minimal valid 1x1 JPEG (always works)
        # This is a known minimal JPEG file
        return _minimal_1x1_jpeg(r, g, b)


def _minimal_1x1_jpeg(r: int, g: int, b: int) -> bytes:
    """Absolute minimal valid JPEG — 1x1 pixel."""
    # Pre-built minimal JPEG structure with custom color
    # SOI + APP0 + DQT + SOF0 + DHT + SOS + data + EOI
    # For testing purposes, we use a pre-encoded minimal JPEG
    # and just return a valid JPEG file
    try:
        from PIL import Image
        import io
        img = Image.new("RGB", (1, 1), (r, g, b))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        return buf.getvalue()
    except ImportError:
        # Hardcoded minimal valid JPEG (white 1x1)
        return bytes.fromhex(
            "ffd8ffe000104a46494600010100000100010000"
            "ffdb004300080606070605080707070909080a0c"
            "140d0c0b0b0c1912130f141d1a1f1e1d1a1c1c"
            "20242e2720222c231c1c2837292c30313434341f"
            "27393d38323c2e333432ffc0000b080001000101"
            "011100ffc4001f000001050101010101010000000"
            "0000000000102030405060708090a0bffc4001f01"
            "0003010101010101010101000000000000010203"
            "0405060708090a0bffda00080101000003f00"
            "0fb52a4800014000500ffd9"
        )


def _create_png(width: int, height: int, r: int, g: int, b: int) -> bytes:
    """Create a valid PNG file with solid color (no external deps)."""

    def _chunk(chunk_type: bytes, data: bytes) -> bytes:
        c = chunk_type + data
        crc = struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)
        return struct.pack(">I", len(data)) + c + crc

    # PNG signature
    sig = b"\x89PNG\r\n\x1a\n"

    # IHDR
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    ihdr = _chunk(b"IHDR", ihdr_data)

    # IDAT — raw image data (filter byte 0 + RGB pixels per row)
    raw_row = b"\x00" + bytes([r, g, b]) * width
    raw_data = raw_row * height
    compressed = zlib.compress(raw_data)
    idat = _chunk(b"IDAT", compressed)

    # IEND
    iend = _chunk(b"IEND", b"")

    return sig + ihdr + idat + iend


# ---------------------------------------------------------------------------
# File generators
# ---------------------------------------------------------------------------

def gen_small_jpg():
    """Small JPG — 200x300, red-ish, ~few KB."""
    path = os.path.join(OUTPUT_DIR, "small_photo.jpg")
    data = _create_minimal_jpg(200, 300, 220, 80, 60)
    with open(path, "wb") as f:
        f.write(data)
    print(f"  ✅ {path} ({len(data):,} bytes) — JPG kecil 200×300")
    return path


def gen_medium_jpg():
    """Medium JPG — 800x600, blue-ish."""
    path = os.path.join(OUTPUT_DIR, "medium_photo.jpg")
    data = _create_minimal_jpg(800, 600, 60, 100, 200)
    with open(path, "wb") as f:
        f.write(data)
    print(f"  ✅ {path} ({len(data):,} bytes) — JPG medium 800×600")
    return path


def gen_png_a():
    """PNG A — 400x400, green."""
    path = os.path.join(OUTPUT_DIR, "icon_green.png")
    data = _create_png(400, 400, 50, 180, 80)
    with open(path, "wb") as f:
        f.write(data)
    print(f"  ✅ {path} ({len(data):,} bytes) — PNG 400×400 hijau")
    return path


def gen_png_b():
    """PNG B — 600x400, purple."""
    path = os.path.join(OUTPUT_DIR, "banner_purple.png")
    data = _create_png(600, 400, 150, 50, 200)
    with open(path, "wb") as f:
        f.write(data)
    print(f"  ✅ {path} ({len(data):,} bytes) — PNG 600×400 ungu")
    return path


def gen_png_c():
    """PNG C — 300x500, orange."""
    path = os.path.join(OUTPUT_DIR, "card_orange.png")
    data = _create_png(300, 500, 240, 150, 30)
    with open(path, "wb") as f:
        f.write(data)
    print(f"  ✅ {path} ({len(data):,} bytes) — PNG 300×500 oranye")
    return path


def _create_noisy_png(width: int, height: int) -> bytes:
    """Create a PNG with pseudo-random pixel data that won't compress well.
    Guarantees large file size without Pillow."""
    import hashlib

    def _chunk(chunk_type: bytes, data: bytes) -> bytes:
        c = chunk_type + data
        crc = struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)
        return struct.pack(">I", len(data)) + c + crc

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    ihdr = _chunk(b"IHDR", ihdr_data)

    # Generate pseudo-random rows using hash chain (deterministic, no Pillow)
    raw_rows = bytearray()
    seed = b"papyr-test-seed"
    for y in range(height):
        raw_rows.append(0)  # filter byte
        row_seed = hashlib.md5(seed + y.to_bytes(4, "big")).digest()
        for x in range(0, width * 3, 16):
            chunk = hashlib.md5(row_seed + x.to_bytes(4, "big")).digest()
            remaining = min(16, width * 3 - x)
            raw_rows.extend(chunk[:remaining])

    # Use minimal compression to keep file large
    compressed = zlib.compress(bytes(raw_rows), 1)
    idat = _chunk(b"IDAT", compressed)
    iend = _chunk(b"IEND", b"")

    return sig + ihdr + idat + iend


def gen_large_jpg():
    """Large image > 3MB to trigger backend fallback."""
    try:
        from PIL import Image
        import io
        import random
        # With Pillow: create noisy JPEG
        path = os.path.join(OUTPUT_DIR, "large_photo.jpg")
        img = Image.new("RGB", (3000, 2000))
        pixels = img.load()
        random.seed(42)
        for y in range(2000):
            for x in range(3000):
                pixels[x, y] = (
                    random.randint(0, 255),
                    random.randint(0, 255),
                    random.randint(0, 255),
                )
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=95)
        data = buf.getvalue()
    except ImportError:
        # Without Pillow: create noisy PNG (won't compress well → large file)
        path = os.path.join(OUTPUT_DIR, "large_photo.png")
        # 1200x900 with noise → ~3.5MB after minimal zlib compression
        data = _create_noisy_png(1200, 900)
        if len(data) < 3 * 1024 * 1024:
            # If still too small, increase dimensions
            data = _create_noisy_png(1400, 1050)

    with open(path, "wb") as f:
        f.write(data)
    size_mb = len(data) / (1024 * 1024)
    print(f"  ✅ {path} ({size_mb:.1f} MB) — Gambar besar untuk backend fallback")
    return path


def gen_invalid_gif():
    """Invalid file — GIF (not accepted)."""
    path = os.path.join(OUTPUT_DIR, "animation.gif")
    # Minimal valid GIF89a
    data = b"GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x00\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
    with open(path, "wb") as f:
        f.write(data)
    print(f"  ✅ {path} ({len(data):,} bytes) — GIF (harus ditolak)")
    return path


def gen_invalid_pdf():
    """Invalid file — PDF (not an image)."""
    path = os.path.join(OUTPUT_DIR, "document.pdf")
    data = b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF"
    with open(path, "wb") as f:
        f.write(data)
    print(f"  ✅ {path} ({len(data):,} bytes) — PDF (harus ditolak)")
    return path


def gen_not_image_txt():
    """Invalid file — plain text with .png extension."""
    path = os.path.join(OUTPUT_DIR, "fake_image.png")
    data = b"This is not an image file, just plain text pretending to be PNG."
    with open(path, "wb") as f:
        f.write(data)
    print(f"  ✅ {path} ({len(data):,} bytes) — Text file dengan ekstensi .png (harus ditolak)")
    return path


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("=" * 60)
    print("PAPYR-042 — Generator File Test Image to PDF")
    print("=" * 60)
    print()

    ensure_dir()

    print("📸 Generating test files...\n")

    gen_small_jpg()
    gen_medium_jpg()
    gen_png_a()
    gen_png_b()
    gen_png_c()
    gen_large_jpg()
    gen_invalid_gif()
    gen_invalid_pdf()
    gen_not_image_txt()

    print()
    print("=" * 60)
    print("🧪 SKENARIO TEST (7 + 3 bonus)")
    print("=" * 60)

    print("""
📋 Test 1 — Single JPG → PDF
   Upload: small_photo.jpg
   Expected: PDF 1 halaman, ukuran sesuai gambar (200×300)
   Proses: client-side (< 3MB)

📋 Test 2 — 3 PNG → PDF, verifikasi urutan
   Upload: icon_green.png, banner_purple.png, card_orange.png
   Expected: PDF 3 halaman, urutan: hijau → ungu → oranye
   Proses: client-side (< 3MB total)

📋 Test 3 — Reorder lalu convert
   Upload: icon_green.png, banner_purple.png, card_orange.png
   Drag reorder: oranye → hijau → ungu
   Expected: PDF 3 halaman, urutan: oranye → hijau → ungu

📋 Test 4 — Mix JPG + PNG
   Upload: small_photo.jpg + icon_green.png + medium_photo.jpg
   Expected: PDF 3 halaman, semua gambar tampil benar

📋 Test 5 — Large image (> 3MB) → backend fallback
   Upload: large_photo.jpg (atau large_photo.png)
   Expected: Proses via backend (POST /api/image-to-pdf)
   Verifikasi: download URL dari R2 (bukan blob)

📋 Test 6 — File invalid ditolak
   Upload: animation.gif → harus ditolak
   Upload: document.pdf → harus ditolak
   Upload: fake_image.png → harus ditolak (MIME check)

📋 Test 7 — Mobile (Android/iOS)
   Buka /image-to-pdf di HP
   Pilih foto dari galeri
   Convert → download PDF

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 BONUS TEST

📋 Bonus 1 — Banyak gambar (10+)
   Upload semua file valid (small_photo + medium_photo + 3 PNG)
   Duplikat beberapa kali sampai 10+ file
   Expected: semua diproses, urutan benar

📋 Bonus 2 — Gambar landscape + portrait mix
   Upload: medium_photo.jpg (landscape 800×600) + card_orange.png (portrait 300×500)
   Expected: PDF dengan halaman berbeda ukuran

📋 Bonus 3 — Remove file dari list
   Upload 3 file, hapus 1, convert
   Expected: PDF hanya 2 halaman
""")


if __name__ == "__main__":
    main()
