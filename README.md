# Papyr

**Alat PDF gratis untuk Indonesia** — [mypapyr.com](https://mypapyr.com)

Compress, merge, split, dan konversi PDF dengan mudah. Mobile-first, cepat, dan menjaga privasi.

## Fitur (MVP 0.1)

- **Compress PDF** — Perkecil ukuran file PDF
- **Merge PDF** — Gabungkan beberapa PDF jadi satu
- **Split PDF** — Pisahkan halaman PDF
- **Image to PDF** — Konversi gambar ke PDF
- **PDF to Image** — Konversi PDF ke gambar

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Client PDF | pdf-lib (browser-side) |
| Backend | FastAPI (Python) |
| Server PDF | PyMuPDF, Ghostscript |
| Storage | Cloudflare R2 |
| Hosting | Vercel (frontend), Render (backend) |
| Analytics | Plausible |

## Setup

### Prerequisites

- Node.js 20+
- Python 3.11+
- Git

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

### Backend

```bash
cd backend
cp .env.example .env
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Struktur Proyek

```
papyr/
├── frontend/          # Next.js app
├── backend/           # FastAPI server
├── blueprint/         # Dokumentasi & desain
└── .env.example       # Template environment variables
```

## Lisensi

Hak cipta © 2026 Muhammad Fa'iz Zulfikar. All rights reserved.
