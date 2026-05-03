# Papyr Brand Guidelines

---

## Informasi Dokumen

|                     |                                              |
|---------------------|----------------------------------------------|
| **Judul Dokumen**   | Papyr Brand Guidelines                       |
| **ID Dokumen**      | PPR-BG-001                                   |
| **Versi**           | 1.0                                          |
| **Status**          | Approved                                     |
| **Tanggal Dibuat**  | 2026-06-03                                   |
| **Terakhir Diubah** | 2026-06-03                                   |
| **Penulis**         | OpenCode AI Agent (Sisyphus)                 |
| **Ditinjau Oleh**   | Muhammad Fa'iz Zulfikar                      |
| **Disetujui Oleh**  | Muhammad Fa'iz Zulfikar                      |
| **Kerahasiaan**     | Internal                                     |

---

## Riwayat Versi

| **Versi** | **Tanggal**  | **Penulis**                  | **Deskripsi**                                                    |
|-----------|--------------|------------------------------|------------------------------------------------------------------|
| 1.0       | 2026-06-03   | OpenCode AI Agent (Sisyphus) | Dokumen awal. Seluruh design token diekstrak dari codebase aktif |

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Brand Identity](#2-brand-identity)
3. [Logo Specification](#3-logo-specification)
4. [Color Palette](#4-color-palette)
5. [Typography](#5-typography)
6. [Spacing dan Layout](#6-spacing-dan-layout)
7. [Component Patterns](#7-component-patterns)
8. [Iconography](#8-iconography)
9. [Animation dan Interaction](#9-animation-dan-interaction)
10. [Tone of Voice dan Copywriting](#10-tone-of-voice-dan-copywriting)
11. [Social Media Guidelines](#11-social-media-guidelines)
12. [Do's and Don'ts](#12-dos-and-donts)
13. [Dokumen Terkait](#13-dokumen-terkait)

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen

Dokumen ini adalah referensi utama untuk siapa pun (manusia atau AI agent) yang membangun, mengembangkan, atau memodifikasi antarmuka Papyr. Setiap keputusan visual, tipografi, warna, spacing, dan interaksi harus merujuk ke dokumen ini.

Tujuan spesifik:

- Menjamin konsistensi visual di seluruh halaman dan komponen
- Menjadi single source of truth untuk design token
- Memandu developer dan AI agent dalam membuat keputusan UI tanpa ambiguitas
- Mempercepat development dengan menghilangkan kebutuhan "tanya desainer"

### 1.2 Brand Philosophy

Papyr dibangun dengan filosofi desain yang terinspirasi Vercel: **clean, fast, trustworthy**.

Setiap pixel harus terasa:

- **Ringan** — whitespace yang cukup, tidak sesak, tidak berisik
- **Cepat** — animasi subtle, transisi halus, tidak ada yang menghalangi user
- **Terpercaya** — profesional, konsisten, tidak murahan
- **Sederhana** — satu aksi per layar, hierarki visual yang jelas

Prinsip utama: jika ragu, pilih yang lebih sederhana. Kurangi, jangan tambahkan.

### 1.3 Siapa yang Harus Membaca

- Frontend developer yang mengerjakan UI Papyr
- AI agent (OpenCode, Sisyphus, OpenClaw) yang generate atau modifikasi kode UI
- Siapa pun yang membuat konten visual untuk Papyr (social media, marketing)

---

## 2. Brand Identity

### 2.1 Brand Name

**Papyr** — permainan kata dari "paper" (kertas). Nama ini dipilih karena:

- Singkat, mudah diingat, mudah diketik
- Domain tersedia (mypapyr.com)
- Relevan dengan produk (alat PDF = alat kertas digital)
- Terdengar modern dan tech-forward

Penulisan yang benar: **Papyr** (huruf P kapital, sisanya lowercase). Bukan PAPYR, bukan papyr, bukan PaPyR.

### 2.2 Tagline

> "Tool PDF gratis, cepat, dan aman untuk Indonesia"

Variasi yang diperbolehkan:

- "Alat PDF gratis, cepat, dan privasi-first untuk Indonesia"
- "Compress, merge, split PDF — gratis, langsung dari browser"

Variasi yang TIDAK diperbolehkan:

- Tagline dalam bahasa Inggris
- Tagline yang menyebut kompetitor
- Tagline yang menggunakan superlative tanpa bukti ("terbaik di Indonesia")

### 2.3 Brand Values

| Value | Penjelasan | Manifestasi di Produk |
|-------|------------|----------------------|
| **Speed** | Cepat di semua aspek: loading, processing, UX flow | Client-side processing, edge CDN, animasi ringan |
| **Privacy** | Data user adalah milik user, bukan milik kita | Auto-delete 60 menit, tanpa login, tanpa tracking invasif |
| **Simplicity** | Satu tool, satu tujuan, satu klik | UI minimalis, no clutter, hierarki jelas |
| **Indonesia-first** | Dibangun untuk dan oleh orang Indonesia | Bahasa Indonesia, server dekat Asia, UX lokal |

### 2.4 Brand Voice

Papyr berbicara dengan nada:

- **Profesional tapi approachable** — bukan korporat kaku, bukan juga terlalu santai
- **Bahasa Indonesia casual-formal** — "kamu" bukan "Anda", tapi tetap sopan
- **Tanpa jargon teknis** — "perkecil ukuran file" bukan "compress lossy dengan Ghostscript"
- **Langsung ke poin** — tidak bertele-tele, tidak pakai basa-basi

Contoh nada yang benar:

- "Gabungkan beberapa PDF jadi satu dokumen"
- "File otomatis dihapus dalam 60 menit"
- "Gratis, tanpa login, tanpa batas"

Contoh nada yang salah:

- "Kami dengan senang hati menyediakan layanan penggabungan dokumen PDF"
- "Leverage our cutting-edge compression technology"
- "Yuk cobain fitur keren kita dong!"

---

## 3. Logo Specification

### 3.1 Logo Utama (Current Implementation)

Logo Papyr saat ini terdiri dari dua elemen:

1. **Icon** — kotak navy dengan rounded corners, berisi ikon dokumen putih (SVG)
2. **Wordmark** — teks "Papyr" di samping icon

Konstruksi teknis icon:

```
Container: 28x28px
Border radius: rounded-md (6px)
Background: #1E3A5F (navy)
Icon: white stroke SVG (file icon dengan folded corner)
SVG viewBox: 0 0 24 24
SVG stroke: white
SVG strokeWidth: 2
SVG fill: none
```

Konstruksi teknis wordmark:

```
Font: DM Sans
Size: 17px (text-[17px])
Weight: font-semibold (600)
Tracking: tracking-tight (-0.025em)
Color: #1E3A5F (text-navy)
```

### 3.2 Variasi Logo

| Variasi | Penggunaan | Komponen |
|---------|-----------|----------|
| **Full** (icon + wordmark) | Navbar, header utama | Icon 28x28 + "Papyr" text |
| **Icon only** | Favicon, mobile navbar collapsed, social avatar | Icon 28x28 saja |
| **Wordmark only** | Konteks di mana icon sudah muncul terpisah | Teks "Papyr" saja |

### 3.3 Minimum Size

- Icon only: minimum 24px (di bawah ini detail SVG tidak terbaca)
- Full logo (icon + wordmark): minimum 16px height untuk wordmark
- Untuk print: minimum 10mm width untuk full logo

### 3.4 Clear Space

Area kosong di sekeliling logo harus minimal **1x lebar icon** (28px) di semua sisi. Tidak boleh ada elemen lain yang masuk ke area ini.

```
         28px
    ┌─────────────┐
    │             │
28px│   [LOGO]    │28px
    │             │
    └─────────────┘
         28px
```

### 3.5 Logo Don'ts

Hal-hal yang TIDAK boleh dilakukan pada logo:

- Jangan stretch atau distort proporsi logo
- Jangan ubah warna navy ke warna lain
- Jangan tambahkan drop shadow, glow, atau efek visual lain
- Jangan rotate logo
- Jangan letakkan logo di atas background yang kontrasnya rendah
- Jangan tambahkan outline atau border tambahan
- Jangan ubah border radius icon
- Jangan ganti font wordmark

### 3.6 Catatan untuk Masa Depan

Saat ini logo hanya tersedia sebagai inline SVG di kode. Rekomendasi untuk iterasi berikutnya:

- Buat file SVG terpisah: `logo-full.svg`, `logo-icon.svg`, `logo-wordmark.svg`
- Buat versi PNG untuk kebutuhan non-web (email signature, dokumen)
- Buat versi monochrome (putih di atas gelap, hitam di atas terang)
- Pertimbangkan favicon.ico yang lebih detail

---

## 4. Color Palette

### 4.1 Warna Utama (Primary Palette)

| Token | Hex | Nama | Penggunaan |
|-------|-----|------|-----------|
| `--color-navy` | `#1E3A5F` | Navy | Heading, logo background, primary CTA, elemen utama |
| `--color-accent` | `#2563EB` | Blue | Link, active state, secondary CTA, hover effect, badge |
| `--color-bg` | `#F9FAFB` | Light Gray | Background halaman |
| `--color-background` | `#FFFFFF` | White | Card, modal, surface |
| `--color-foreground` | `#171717` | Near Black | Body text |

### 4.2 Warna Pendukung (Supporting Palette)

| Token | Hex/Value | Nama | Penggunaan |
|-------|-----------|------|-----------|
| Muted | `#64748B` | Slate-500 | Teks sekunder, deskripsi, placeholder |
| Border | `#E2E8F0` | Slate-200 | Divider, card border, separator |
| Accent Light | `accent/10` | Blue 10% | Badge background, highlight area |
| Accent Medium | `accent/15` | Blue 15% | Icon container hover background |
| Accent Border | `accent/30` | Blue 30% | Badge border, subtle accent border |
| Accent Hover | `accent/60` | Blue 60% | Card border on hover |
| Slate-100 | `#F1F5F9` | Slate-100 | Icon container default background |

### 4.3 Warna Status (Semantic Colors)

| Status | Warna | Penggunaan |
|--------|-------|-----------|
| **Success** | Green (to be defined) | Upload berhasil, proses selesai |
| **Error** | Red (to be defined) | Error message, validasi gagal |
| **Warning** | Amber (to be defined) | Peringatan, file terlalu besar |

Catatan: warna status belum didefinisikan secara eksplisit di codebase. Ketika dibutuhkan, gunakan Tailwind default (green-600, red-600, amber-600) sampai ada keputusan final.

### 4.4 Tabel Penggunaan Warna

| Elemen | Warna yang Digunakan | Catatan |
|--------|---------------------|---------|
| Background halaman | `#F9FAFB` | Selalu, tanpa exception |
| Card background | `#FFFFFF` | Putih solid, bukan transparent |
| Heading (H1, Hero) | `#1E3A5F` (navy) | Semua heading utama |
| Body text | `#171717` | Teks paragraf, label |
| Secondary text | `#64748B` | Deskripsi, helper text |
| Link | `#2563EB` (accent) | Semua link clickable |
| Primary button bg | `#1E3A5F` (navy) | CTA utama |
| Secondary button bg | `#2563EB` (accent) | CTA sekunder |
| Card border default | `#E2E8F0` | 1px solid |
| Card border hover | `accent/60` | Transisi dari slate ke accent |
| Icon default | `#64748B` (slate-500) | Sebelum hover |
| Icon hover | `#2563EB` (accent) | Saat hover |

### 4.5 Color Don'ts

- Jangan gunakan navy untuk body text (terlalu gelap-biru, gunakan `#171717`)
- Jangan gunakan accent untuk heading (accent hanya untuk interactive element)
- Jangan gunakan warna di luar palette tanpa approval
- Jangan gunakan opacity di bawah 10% untuk accent (tidak terlihat)
- Jangan campur warm colors (orange, red) kecuali untuk status semantic
- Jangan gunakan gradient untuk background atau button

---

## 5. Typography

### 5.1 Font Utama

| Property | Value |
|----------|-------|
| **Font Family** | DM Sans |
| **Source** | Google Fonts (variable font) |
| **CSS Variable** | `--font-dm-sans` |
| **Fallback** | `system-ui, sans-serif` |
| **Subsets** | Latin |
| **Weight Range** | 100-900 (variable) |

DM Sans dipilih karena:

- Geometric sans-serif yang modern dan clean
- Variable font (satu file, semua weight)
- Excellent readability di layar kecil
- Gratis dan open source
- Cocok dengan estetika Vercel-style

### 5.2 Type Scale

| Level | Size | Weight | Tracking | Leading | Penggunaan |
|-------|------|--------|----------|---------|-----------|
| **Hero** | `clamp(40px, 6vw, 72px)` | `font-semibold` (600) | `tracking-[-2px]` | `leading-[1.08]` | Headline utama landing page |
| **H2** | `32px` (text-[32px]) | `font-semibold` (600) | `tracking-tight` | Default | Section heading |
| **H3** | `28px` (text-[28px]) | `font-semibold` (600) | `tracking-tight` | Default | Sub-section heading |
| **Section Label** | `12px` (text-xs) | `font-semibold` (600) | `tracking-widest` | Default | Label di atas section, UPPERCASE |
| **Body Title** | `15px` (text-[15px]) | `font-semibold` (600) | Default | Default | Judul card, nama tool |
| **Body Desc** | `13.5px` (text-[13.5px]) | `font-normal` (400) | Default | `leading-snug` | Deskripsi card, helper text |
| **Small** | `13px` (text-[13px]) | `font-normal` (400) | Default | Default | Footer text, metadata |
| **Badge** | `12px` (text-xs) | `font-medium` (500) | Default | Default | Pill badge, tag |

### 5.3 Aturan Tipografi

**Line Height:**

- Hero text: `leading-[1.08]` (sangat rapat, untuk impact visual)
- Body text: `leading-relaxed` (1.625, untuk readability)
- Description: `leading-snug` (1.375, antara rapat dan longgar)

**Letter Spacing:**

- Hero: `tracking-[-2px]` (negatif, untuk kesan bold dan modern)
- Heading: `tracking-tight` (-0.025em, sedikit rapat)
- Section label: `tracking-widest` (0.1em, untuk uppercase readability)
- Body: default (0, tidak dimodifikasi)

**Text Transform:**

- Section label: `uppercase` (selalu)
- Semua elemen lain: normal case

**Text Rendering:**

- Seluruh halaman menggunakan class `antialiased` pada elemen `<html>`
- Ini memberikan rendering font yang lebih halus di semua browser

### 5.4 Typography Don'ts

- Jangan gunakan font selain DM Sans untuk UI
- Jangan gunakan weight di bawah 400 (terlalu tipis untuk layar)
- Jangan gunakan italic (tidak ada use case di Papyr)
- Jangan gunakan text-decoration underline kecuali untuk link
- Jangan buat heading lebih besar dari Hero scale
- Jangan gunakan tracking positif kecuali untuk section label

---

## 6. Spacing dan Layout

### 6.1 Layout Container

| Property | Value | Keterangan |
|----------|-------|-----------|
| **Max Width** | `1200px` | Konten tidak pernah lebih lebar dari ini |
| **Container Class** | `mx-auto max-w-[1200px]` | Centered dengan auto margin |
| **Horizontal Padding** | `px-6` (24px) | Padding kiri-kanan di semua breakpoint |
| **Page Background** | `bg-bg` (#F9FAFB) | Seluruh halaman |

### 6.2 Vertical Spacing (Section)

| Section | Padding | Value | Keterangan |
|---------|---------|-------|-----------|
| Navbar | Height | `h-[52px]` | Fixed height, compact |
| Hero section | Bottom | Varies | Tergantung konten |
| Tools grid | Vertical | `py-20` (80px) | Atas dan bawah |
| Privacy section | Vertical | `py-[72px]` | Sedikit lebih kecil dari tools |
| Footer | Top padding | `py-10` (40px) | Lebih compact |

### 6.3 Component Spacing

| Elemen | Spacing | Value |
|--------|---------|-------|
| Card internal | Padding | `p-6` (24px) |
| Grid gap (tools) | Gap | `gap-4` (16px) |
| Privacy items gap | Gap | `gap-8` (32px) |
| Button padding (primary) | Horizontal | `px-8` (32px) |
| Button padding (primary) | Vertical | `py-3.5` (14px) |
| Button padding (secondary) | Horizontal | `px-5` (20px) |
| Button padding (secondary) | Vertical | `py-2` (8px) |
| Icon container | Size | `h-10 w-10` (40x40px) |

### 6.4 Grid System

| Breakpoint | Columns | Penggunaan |
|------------|---------|-----------|
| Mobile (default) | 1 kolom | Semua card stack vertikal |
| Small (`sm:`) | 2 kolom | Tool cards mulai grid |
| Large (`lg:`) | 3 kolom | Tool cards full grid |

Class pattern: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`

### 6.5 Spacing Don'ts

- Jangan gunakan margin negatif kecuali untuk overlay pattern yang sudah ada
- Jangan ubah max-width dari 1200px
- Jangan kurangi horizontal padding di bawah 24px (px-6)
- Jangan buat section padding kurang dari 40px vertikal
- Jangan gunakan fixed pixel spacing yang tidak kelipatan 4px

---

## 7. Component Patterns

### 7.1 Cards

Card adalah komponen utama untuk menampilkan tool dan informasi.

**Default State:**

```
rounded-[10px]
border border-slate-200
bg-white
p-6
shadow-[0_1px_3px_rgba(0,0,0,0.04)]
transition-all
```

**Hover State:**

```
hover:-translate-y-0.5
hover:border-accent/60
hover:shadow-[0_4px_20px_rgba(37,99,235,0.1)]
```

Efek hover memberikan kesan "lift" yang subtle. Card naik 2px dan shadow berubah dari abu-abu netral ke accent blue yang lembut.

### 7.2 Buttons

**Primary Button (CTA Utama):**

```
rounded-[10px]
bg-navy
px-8 py-3.5
text-base font-semibold text-white
shadow-md
transition-all
hover:-translate-y-0.5
hover:shadow-lg
```

Digunakan untuk: aksi utama halaman ("Mulai gratis", "Compress PDF")

**Secondary Button (CTA Sekunder):**

```
rounded-lg
bg-accent
px-5 py-2
text-sm font-semibold text-white
shadow-sm
transition-all
hover:-translate-y-0.5
hover:shadow-md
```

Digunakan untuk: aksi pendukung ("Coba Gratis", "Lihat semua tool")

### 7.3 Pill Badge

Badge digunakan untuk label status atau kategori.

```
rounded-full
border border-accent/30
bg-accent/10
px-3 py-1
text-xs font-medium text-accent
```

Dengan dot indicator:

```
[dot] inline-block h-1.5 w-1.5 rounded-full bg-accent mr-1.5
```

### 7.4 Icon Containers

Container untuk ikon tool di card.

**Default State:**

```
h-10 w-10
rounded-[10px]
bg-slate-100
text-slate-500
flex items-center justify-center
transition-colors
```

**Hover State (mengikuti parent card hover):**

```
group-hover:bg-accent/15
group-hover:text-accent
```

### 7.5 Navbar

```
sticky top-0 z-50
border-b border-slate-200
bg-bg/92
backdrop-blur-md
```

Navbar menggunakan background semi-transparent (92% opacity) dengan backdrop blur untuk efek glassmorphism yang subtle. Height fixed di 52px.

Konten navbar:

```
max-w-[1200px] mx-auto
px-6
h-[52px]
flex items-center justify-between
```

### 7.6 Footer

```
border-t border-slate-200
bg-bg
py-10
```

Footer menggunakan border-top sebagai separator visual. Background sama dengan halaman (bg) untuk kesan menyatu.

### 7.7 Component Pattern Summary

| Komponen | Border Radius | Shadow Default | Shadow Hover |
|----------|--------------|----------------|--------------|
| Card | `rounded-[10px]` | `0_1px_3px_rgba(0,0,0,0.04)` | `0_4px_20px_rgba(37,99,235,0.1)` |
| Button Primary | `rounded-[10px]` | `shadow-md` | `shadow-lg` |
| Button Secondary | `rounded-lg` (8px) | `shadow-sm` | `shadow-md` |
| Badge | `rounded-full` | none | none |
| Icon Container | `rounded-[10px]` | none | none |
| Input | `rounded-lg` (8px) | none | ring on focus |

---

## 8. Iconography

### 8.1 Style Guide

Semua ikon di Papyr menggunakan style Lucide (stroke-based, bukan filled).

Karakteristik:

- **Stroke-based** — outline only, tidak ada fill solid
- **Rounded caps dan joins** — `strokeLinecap="round" strokeLinejoin="round"`
- **Konsisten** — semua ikon dari satu "keluarga" visual
- **Inline SVG** — tidak ada dependency ke icon library external

### 8.2 Ukuran dan Stroke Width

| Konteks | Size | Stroke Width | Keterangan |
|---------|------|-------------|-----------|
| Tool icon (dalam card) | `19x19` | `1.8` | Ikon utama yang merepresentasikan tool |
| UI icon (small) | `15x15` | `2` | Chevron, close, menu indicator |
| Menu/navigation icon | `20x20` | `2` | Hamburger menu, globe, external link |
| Logo icon (dalam container) | `14x14` | `2` | File icon di dalam logo square |

### 8.3 SVG Template

Setiap ikon mengikuti template ini:

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="19"
  height="19"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.8"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <!-- path data -->
</svg>
```

Penting: `stroke="currentColor"` memungkinkan warna ikon dikontrol via CSS (`text-*` class).

### 8.4 Ikon yang Digunakan

| Tool/Fitur | Ikon | Deskripsi Visual |
|-----------|------|-----------------|
| Compress | Archive/box dengan panah ke bawah | Representasi "perkecil" |
| Merge | Dua dokumen bergabung | Representasi "gabung" |
| Split | Gunting atau dokumen terpisah | Representasi "pisah" |
| Image to PDF | Gambar dengan panah ke dokumen | Konversi visual |
| PDF to Image | Dokumen dengan panah ke gambar | Konversi visual |
| Rotate | Panah melingkar | Rotasi |
| Menu (mobile) | Tiga garis horizontal | Standard hamburger |
| Globe | Lingkaran dengan garis meridian | Language switcher |
| External link | Kotak dengan panah diagonal | Link ke luar |

### 8.5 Iconography Don'ts

- Jangan gunakan filled icons (harus stroke-based)
- Jangan campur icon style (semua harus Lucide-compatible)
- Jangan gunakan icon library CDN (semua inline SVG)
- Jangan ubah strokeLinecap dari "round"
- Jangan buat ikon lebih besar dari 24x24 untuk UI standard
- Jangan gunakan warna hardcoded di SVG (selalu `currentColor`)

---

## 9. Animation dan Interaction

### 9.1 Prinsip Animasi

Animasi di Papyr bersifat **subtle dan fungsional**. Tidak ada animasi yang purely decorative atau mengganggu flow user.

Prinsip:

- Animasi harus memberikan feedback, bukan distraksi
- Durasi pendek (150-300ms untuk micro-interaction)
- Easing natural (ease-out untuk masuk, ease-in untuk keluar)
- Jangan animasi yang menghalangi user melakukan aksi berikutnya

### 9.2 Hover Lift

Pattern paling umum di Papyr. Elemen naik 2px saat di-hover.

```css
transition-all
hover:-translate-y-0.5
```

Digunakan pada: card, button primary, button secondary.

Efek ini memberikan kesan "clickable" dan depth tanpa berlebihan.

### 9.3 Shadow Transition

Bersamaan dengan hover lift, shadow berubah untuk memperkuat kesan depth.

```css
/* Card */
shadow-[0_1px_3px_rgba(0,0,0,0.04)]
hover:shadow-[0_4px_20px_rgba(37,99,235,0.1)]

/* Button Primary */
shadow-md
hover:shadow-lg

/* Button Secondary */
shadow-sm
hover:shadow-md
```

### 9.4 Shimmer (Loading State)

Animasi shimmer digunakan untuk skeleton loading.

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

Implementasi: gradient linear yang bergerak horizontal, memberikan kesan "loading" tanpa spinner.

### 9.5 Fade Up (Content Appearance)

Animasi untuk konten yang muncul saat halaman load atau scroll.

```css
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Konten bergerak dari bawah (10px) ke posisi normal sambil fade in. Subtle dan tidak mengganggu.

### 9.6 Transition Classes

| Class | Penggunaan | Keterangan |
|-------|-----------|-----------|
| `transition-all` | Card, button | Transisi semua property |
| `transition-colors` | Icon container, link | Hanya transisi warna |

Durasi default Tailwind (150ms) sudah cukup untuk semua micro-interaction di Papyr.

### 9.7 Text Rendering

```html
<html class="antialiased">
```

Class `antialiased` diterapkan di level `<html>` untuk memastikan semua teks di-render dengan subpixel antialiasing yang halus.

### 9.8 Animation Don'ts

- Jangan gunakan animasi yang lebih dari 500ms untuk UI interaction
- Jangan gunakan bounce atau elastic easing
- Jangan animasi layout shift (CLS harus 0)
- Jangan gunakan infinite animation kecuali shimmer loading
- Jangan disable animasi tanpa menyediakan `prefers-reduced-motion` fallback
- Jangan gunakan transform scale untuk hover (hanya translateY)

---

## 10. Tone of Voice dan Copywriting

### 10.1 Bahasa

Seluruh UI Papyr menggunakan **Bahasa Indonesia** sebagai bahasa utama.

```html
<html lang="id">
```

Aturan bahasa:

- Gunakan Bahasa Indonesia yang natural, bukan terjemahan kaku dari Inggris
- Boleh gunakan kata serapan yang sudah umum (file, upload, download, compress)
- Hindari istilah teknis yang tidak perlu
- Jika harus pakai istilah teknis, sertakan penjelasan singkat

### 10.2 Style Penulisan

| Aspek | Aturan | Contoh Benar | Contoh Salah |
|-------|--------|-------------|-------------|
| Panjang | Singkat, langsung | "Gabungkan PDF" | "Gunakan fitur ini untuk menggabungkan file PDF Anda" |
| Nada | Confident, helpful | "File dihapus otomatis" | "Kami akan menghapus file Anda demi keamanan" |
| Subjek | Fokus ke aksi | "Compress PDF" | "Fitur Compress PDF Kami" |
| Kata ganti | "kamu" atau impersonal | "File kamu aman" | "File Anda aman di server kami" |

### 10.3 CTA (Call to Action)

Pattern CTA yang digunakan:

| CTA | Konteks | Button Type |
|-----|---------|-------------|
| "Mulai gratis" | Hero section, landing page | Primary |
| "Coba Gratis" | Secondary CTA, card | Secondary |
| "Gunakan alat" | Tool card link | Text link |
| "Compress PDF" | Tool-specific page | Primary |
| "Download" | Setelah proses selesai | Primary |
| "Upload file" | Area upload | Primary |

Aturan CTA:

- Selalu mulai dengan kata kerja
- Maksimal 3 kata
- Jangan gunakan "Klik di sini" atau "Selengkapnya"
- Jangan gunakan tanda seru

### 10.4 Error Messages

Error message harus:

- Dalam Bahasa Indonesia
- Spesifik (apa yang salah)
- Helpful (apa yang harus dilakukan user)
- Tidak menyalahkan user

Contoh:

| Situasi | Message Benar | Message Salah |
|---------|--------------|--------------|
| File terlalu besar | "File melebihi batas 20MB. Coba compress dulu." | "Error: file size exceeded" |
| Format salah | "Format tidak didukung. Gunakan file PDF." | "Invalid file format" |
| Server error | "Terjadi kesalahan. Coba lagi dalam beberapa detik." | "Internal server error 500" |
| Upload gagal | "Upload gagal. Periksa koneksi internet kamu." | "Upload failed" |

### 10.5 Section Labels

Section label menggunakan format khusus:

```
text-xs font-semibold uppercase tracking-widest text-accent
```

Contoh: "ALAT PDF", "PRIVASI", "FITUR"

Aturan:

- Selalu uppercase
- Maksimal 2 kata
- Bahasa Indonesia
- Warna accent (biru)

### 10.6 Microcopy

| Elemen | Contoh |
|--------|--------|
| Empty state | "Drag file ke sini atau klik untuk upload" |
| Loading | "Memproses..." |
| Success | "Selesai! File siap di-download." |
| Tooltip | "Maksimal 20MB per file" |
| Placeholder | "Pilih halaman (contoh: 1-3, 5, 7-9)" |

---

## 11. Social Media Guidelines

### 11.1 Platform Utama

Papyr hadir di Twitter/X melalui akun OpenClaw (AI agent yang mengelola social media).

### 11.2 Profile Setup

| Elemen | Spesifikasi |
|--------|------------|
| **Display Name** | Papyr |
| **Username** | Sesuai yang tersedia |
| **Avatar** | Logo icon (navy square dengan file icon putih) |
| **Header** | Warna bg (#F9FAFB) dengan tagline |
| **Bio** | "Tool PDF gratis, cepat, dan aman untuk Indonesia. Compress, merge, split, dan lainnya." |

### 11.3 Content Tone

Nada di social media sedikit lebih casual dari website, tapi tetap profesional:

- Boleh gunakan emoji secukupnya (1-2 per post)
- Bahasa Indonesia casual ("lo/gue" TIDAK boleh, "kamu/aku" boleh)
- Informatif dan helpful, bukan hard-selling
- Boleh humor ringan yang relevan

### 11.4 Visual Guidelines untuk Social Media

- Gunakan color palette yang sama (navy, accent blue, white, light gray)
- Font DM Sans jika memungkinkan (untuk gambar/graphic)
- Jika DM Sans tidak tersedia, gunakan Inter atau system sans-serif
- Aspect ratio: 16:9 untuk header image, 1:1 untuk post image
- Jangan gunakan stock photo. Gunakan screenshot produk atau graphic sederhana

### 11.5 Content Pillars

| Pillar | Persentase | Contoh |
|--------|-----------|--------|
| **Tips dan Tutorial** | 40% | "Cara compress PDF tanpa kehilangan kualitas" |
| **Product Update** | 30% | "Fitur baru: Rotate PDF sudah live!" |
| **Behind the Scene** | 20% | "Minggu ini kami optimasi speed 2x lebih cepat" |
| **Community** | 10% | Retweet user yang mention, reply helpful |

---

## 12. Do's and Don'ts

### 12.1 Visual Do's

```
[BENAR] Card dengan subtle shadow dan hover lift
┌─────────────────────────────┐
│  [icon]  Tool Name          │  ← rounded-[10px], border-slate-200
│  Description text here      │  ← shadow subtle, hover: lift + blue shadow
└─────────────────────────────┘

[BENAR] Hierarki tipografi yang jelas
SECTION LABEL          ← xs, uppercase, tracking-widest, accent
Heading Besar          ← 32px, semibold, navy
Body text normal       ← 15px, foreground

[BENAR] Whitespace yang cukup
┌──────────────────────────────────────────────┐
│                                              │
│         max-w-[1200px] centered              │
│                                              │
│    ┌────┐  ┌────┐  ┌────┐                   │
│    │card│  │card│  │card│   ← gap-4          │
│    └────┘  └────┘  └────┘                   │
│                                              │
└──────────────────────────────────────────────┘
```

### 12.2 Visual Don'ts

```
[SALAH] Card tanpa border atau shadow (flat, tidak ada depth)
┌─────────────────────────────┐
│  Tool Name                  │  ← Tidak ada visual separation
│  Description                │
└─────────────────────────────┘

[SALAH] Terlalu banyak warna
┌─────────────────────────────┐
│  [RED icon]  [GREEN title]  │  ← Warna random, tidak dari palette
│  [ORANGE description]       │
└─────────────────────────────┘

[SALAH] Spacing terlalu rapat
┌────┐┌────┐┌────┐  ← Tidak ada gap
│card││card││card│
└────┘└────┘└────┘

[SALAH] Font mixing
Heading (Poppins)     ← Font berbeda
Body (Roboto)         ← Font berbeda lagi
Label (Montserrat)    ← Tiga font = chaos
```

### 12.3 Interaction Do's

| Aksi | Respons yang Benar |
|------|-------------------|
| Hover card | Lift 2px + border accent + shadow blue |
| Hover button | Lift 2px + shadow increase |
| Hover icon | Background berubah ke accent/15, warna ke accent |
| Hover link | Warna tetap accent, underline muncul |
| Click button | Immediate feedback (no delay) |
| Upload file | Progress indicator + status text |

### 12.4 Interaction Don'ts

| Aksi | Respons yang Salah |
|------|-------------------|
| Hover | Scale transform (membesar) |
| Hover | Warna berubah drastis (navy ke merah) |
| Click | Delay lebih dari 100ms sebelum feedback |
| Loading | Spinner tanpa context ("apa yang sedang loading?") |
| Error | Alert/popup yang blocking |
| Success | Confetti atau animasi berlebihan |

### 12.5 Copy Do's and Don'ts

| Do | Don't |
|----|-------|
| "Compress PDF" | "Klik untuk Compress PDF Anda" |
| "File dihapus otomatis dalam 60 menit" | "Demi keamanan dan privasi Anda, kami secara otomatis menghapus..." |
| "Gratis, tanpa login" | "Nikmati layanan gratis kami tanpa perlu registrasi!" |
| "Upload gagal. Coba lagi." | "Oops! Something went wrong :(" |
| "Maksimal 20MB" | "Ukuran file yang diperbolehkan tidak boleh melebihi 20 megabyte" |

---

## 13. Dokumen Terkait

| **ID Dokumen** | **Judul**                              | **Versi** |
|----------------|----------------------------------------|-----------|
| PPR-BRD-001    | Business Requirements Document         | 1.0       |
| PPR-SRS-001    | Software Requirements Specification    | 1.0       |
| PPR-TDD-001    | Technical Design Document              | 1.0       |
| PPR-UIUX-001  | UI/UX Specification                    | 1.0       |
| PPR-CS-001     | Coding Standards                       | 1.0       |
| PPR-GTM-001    | Go-To-Market Strategy                  | 1.0       |
| PPR-CLAW-001   | OpenClaw System Specification          | 1.1       |

---

## Persetujuan Dokumen

| **Peran**       | **Nama**                    | **Tanggal**  | **Tanda Tangan** |
|-----------------|-----------------------------|--------------|------------------|
| Penulis         | OpenCode AI Agent (Sisyphus)| 2026-06-03   | [Digital]        |
| Peninjau        | Muhammad Fa'iz Zulfikar     | 2026-06-03   | [Digital]        |
| Penyetuju       | Muhammad Fa'iz Zulfikar     | 2026-06-03   | [Digital]        |

---

*Dokumen ini adalah living document. Update setiap kali ada perubahan design token di codebase.*

*Terakhir diverifikasi terhadap codebase: 2026-06-03*
