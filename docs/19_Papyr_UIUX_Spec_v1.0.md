# **Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

## **UI/UX Specification**

**Version 1.0**
**Juni 2025**

---

**CONFIDENTIAL**

mypapyr.com

---

## Informasi Dokumen

| Field | Detail |
|-------|--------|
| **Judul** | Papyr — UI/UX Specification |
| **Document ID** | PPR-UX-001 |
| **Versi** | 1.0 |
| **Status** | Draft |
| **Dibuat** | Juni 2025 |
| **Diperbarui** | Juni 2025 |
| **Penulis** | AI Agent (OpenCode/Sisyphus) |
| **Ditinjau Oleh** | Product Owner (Muhammad Fa'iz Zulfikar) |
| **Disetujui Oleh** | Product Owner (Muhammad Fa'iz Zulfikar) |
| **Kerahasiaan** | Confidential |

---

## Riwayat Versi

| Versi | Tanggal | Penulis | Deskripsi Perubahan |
|-------|---------|---------|---------------------|
| 1.0 | Juni 2025 | AI Agent (OpenCode/Sisyphus) | Dokumen awal — spesifikasi UI/UX lengkap berdasarkan codebase aktual |

---

## Daftar Isi

1. [Prinsip Desain](#1-prinsip-desain)
2. [Design System](#2-design-system)
3. [Komponen UI](#3-komponen-ui)
4. [Layout & Grid System](#4-layout--grid-system)
5. [Pola Navigasi](#5-pola-navigasi)
6. [Pola Interaksi](#6-pola-interaksi)
7. [Responsivitas](#7-responsivitas)
8. [Aksesibilitas](#8-aksesibilitas)
9. [Panduan Halaman](#9-panduan-halaman)
10. [Rekomendasi Peningkatan](#10-rekomendasi-peningkatan)
11. [Referensi Silang](#11-referensi-silang)
12. [Persetujuan](#12-persetujuan)

---

## 1. Prinsip Desain

Papyr dibangun berdasarkan lima prinsip desain fundamental yang menjadi landasan setiap keputusan visual dan interaksi dalam produk.

### 1.1 Mobile-First

Seluruh antarmuka dirancang dengan pendekatan mobile-first. Komponen dan layout dioptimalkan terlebih dahulu untuk layar kecil (360px ke atas), kemudian diperluas secara progresif untuk tablet dan desktop. Hal ini mencerminkan realitas pengguna Indonesia yang mayoritas mengakses internet melalui perangkat mobile.

Implementasi aktual:
- Container utama menggunakan `max-w-xl` (576px) pada halaman tool untuk fokus konten
- Padding horizontal `px-4` (16px) sebagai standar mobile
- Breakpoint `sm:` (640px) dan `md:` (768px) untuk penyesuaian progresif
- Touch target minimum 44px pada semua elemen interaktif

### 1.2 Privasi yang Terlihat (Privacy-Visible)

Privasi bukan hanya fitur teknis, melainkan elemen visual yang selalu hadir di setiap halaman tool. Komponen `PrivacyNotice` ditampilkan secara permanen (bukan hanya saat idle) untuk memberikan kepercayaan kepada pengguna bahwa file mereka aman.

Implementasi aktual:
- Komponen `PrivacyNotice` dengan tiga varian pesan: `server`, `client`, `hybrid`
- Ikon shield sebagai simbol visual keamanan
- Badge "Auto-hapus 1 jam" dan "Tanpa akun" di hero section
- Seksi privasi khusus di landing page dengan tiga pilar keamanan

### 1.3 Kecepatan yang Dirasakan (Speed-Focused)

Desain mengutamakan persepsi kecepatan melalui feedback visual instan, animasi loading yang informatif, dan transisi yang halus. Pengguna harus merasa bahwa setiap aksi mendapat respons segera.

Implementasi aktual:
- Animasi `animate-fade-up` (0.3s ease) untuk transisi state
- Shimmer animation pada progress bar saat processing
- Progress bar real-time saat upload dengan persentase
- Transisi state yang jelas: idle → uploading → processing → done

### 1.4 Aksesibilitas (Accessibility)

Antarmuka dirancang agar dapat diakses oleh semua pengguna, termasuk mereka yang menggunakan keyboard navigation atau screen reader. Setiap elemen interaktif memiliki label yang jelas dan kontras warna yang memadai.

Implementasi aktual:
- Atribut `aria-label` pada tombol ikon (hamburger menu, hapus file)
- Keyboard navigation pada upload zone (`tabIndex={0}`, handler `onKeyDown`)
- Semantic HTML (`<nav>`, `<main>`, `<footer>`, `<section>`)
- Kontras warna navy (#1E3A5F) pada background putih melebihi rasio WCAG AA

### 1.5 Indonesia-First

Seluruh copy, microcopy, dan konteks penggunaan dirancang khusus untuk pengguna Indonesia. Bahasa yang digunakan adalah Bahasa Indonesia informal-profesional yang mudah dipahami, dengan contoh use case yang relevan (WhatsApp, portal pemerintah, lamaran kerja).

Implementasi aktual:
- HTML `lang="id"` pada root element
- Semua teks UI dalam Bahasa Indonesia
- Contoh use case lokal: "kirim dokumen lewat WhatsApp", "upload ke portal pemerintah"
- Language switcher di footer (Indonesia aktif, English "Segera hadir")
- OpenGraph locale `id_ID`

### 1.6 Kesederhanaan Tanpa Kompromi (Minimal Complexity)

Setiap halaman tool mengikuti pola satu-tugas-satu-halaman. Tidak ada sidebar, tidak ada multi-step wizard yang membingungkan. Pengguna langsung melihat upload zone dan langsung bisa bekerja.

Implementasi aktual:
- Satu tool per halaman, tanpa tab atau multi-panel
- Upload zone sebagai focal point utama
- Alur linear: Upload → Konfigurasi (jika ada) → Proses → Download
- Komponen `OtherTools` di bawah untuk cross-navigation tanpa mengganggu fokus

---

## 2. Design System

### 2.1 Tipografi

| Properti | Nilai | Keterangan |
|----------|-------|------------|
| **Font Family** | DM Sans | Google Fonts, loaded via `next/font/google` |
| **CSS Variable** | `--font-dm-sans` | Diterapkan melalui Tailwind `font-sans` |
| **Fallback** | `system-ui, sans-serif` | Fallback stack |
| **Rendering** | `antialiased` | Diterapkan pada `<html>` element |
| **Subsets** | `latin` | Subset yang di-load |

#### Skala Tipografi

| Elemen | Ukuran | Weight | Tracking | Penggunaan |
|--------|--------|--------|----------|------------|
| Hero H1 | `clamp(40px, 6vw, 72px)` | `font-semibold` (600) | `-2px` | Heading utama landing page |
| Section H2 | `32px` / `28px` | `font-semibold` (600) | `tracking-tight` | Heading seksi landing |
| Tool H1 | `text-3xl` (30px) / `md:text-4xl` (36px) | `font-bold` (700) | `tracking-tight` | Heading halaman tool |
| Page H1 (FAQ/Privacy) | `text-2xl` (24px) / `sm:text-3xl` (30px) | `font-bold` (700) | default | Heading halaman konten |
| Section H2 (Privacy) | `text-lg` (18px) | `font-semibold` (600) | default | Sub-heading konten |
| Body | `text-base` (16px) | `font-normal` (400) | default | Paragraf utama |
| Body Small | `text-sm` (14px) | `font-medium` (500) | default | Label, deskripsi |
| Caption | `text-xs` (12px) | `font-medium` (500) | default | Helper text, metadata |
| Micro | `text-[11px]` | `font-semibold` (600) | `tracking-wider` | Label uppercase, badge |
| Pill Badge | `text-xs` (12px) | `font-medium` (500) | `tracking-wide` | Status badge |

### 2.2 Palet Warna

#### Warna Primer

| Nama | Hex | CSS Variable | Penggunaan |
|------|-----|--------------|------------|
| **Navy** | `#1E3A5F` | `--color-navy` | Teks heading, logo, CTA primer |
| **Accent Blue** | `#2563EB` | `--color-accent` | CTA, link aktif, ikon fitur, progress bar |
| **Background** | `#F9FAFB` | `--color-bg` | Background body utama |
| **White** | `#FFFFFF` | `--color-background` | Background kartu, input, modal |
| **Foreground** | `#171717` | `--color-foreground` | Teks body default |

#### Warna Sekunder (Tailwind Slate)

| Nama | Kelas Tailwind | Penggunaan |
|------|----------------|------------|
| Slate-100 | `bg-slate-100` | Background ikon, area highlight |
| Slate-200 | `border-slate-200` | Border kartu, divider, input |
| Slate-300 | `border-slate-300`, `text-slate-300` | Border upload zone (dashed), ikon disabled |
| Slate-400 | `text-slate-400` | Helper text, metadata, caption |
| Slate-500 | `text-slate-500` | Body text sekunder, deskripsi |
| Slate-600 | `text-slate-600` | Nav link default, body text |
| Slate-900 | `text-slate-900` | Nav link hover |

#### Warna Semantik

| Nama | Hex/Kelas | Penggunaan |
|------|-----------|------------|
| **Success** | `bg-emerald-500` | Ikon check pada state "done" |
| **Error Background** | `bg-rose-50/50` | Background error card |
| **Error Border** | `border-rose-200` | Border error card |
| **Error Text** | `text-rose-500` | Ikon dan heading error |
| **Error Input** | `border-rose-400` | Border input saat validasi gagal |

#### Warna Opacity/Tint

| Pattern | Penggunaan |
|---------|------------|
| `bg-accent/5` | Background upload zone saat drag |
| `bg-accent/10` | Background ikon tool, badge |
| `bg-accent/15` | Background ikon privasi |
| `border-accent/20` | Border success card |
| `border-accent/30` | Border pill badge |
| `border-accent/50` | Border hover upload zone |
| `border-accent/60` | Border hover tool card |

### 2.3 Skala Spacing

Papyr menggunakan skala spacing Tailwind CSS v4 default (berbasis 4px):

| Token | Nilai | Penggunaan Umum |
|-------|-------|-----------------|
| `gap-1` | 4px | Spacing antar ikon kecil |
| `gap-1.5` | 6px | Spacing ikon + teks dalam badge |
| `gap-2` | 8px | Spacing antar button group |
| `gap-3` | 12px | Spacing antar item dalam list |
| `gap-4` | 16px | Spacing antar card dalam grid |
| `gap-6` | 24px | Spacing antar section kecil |
| `gap-8` | 32px | Spacing antar section besar |
| `px-4` | 16px | Padding horizontal mobile |
| `px-5` | 20px | Padding horizontal card |
| `px-6` | 24px | Padding horizontal desktop container |
| `py-3` | 12px | Padding vertikal button sekunder |
| `py-4` | 16px | Padding vertikal button primer |
| `py-8` | 32px | Padding vertikal halaman (mobile) |
| `py-12` | 48px | Padding vertikal halaman (desktop) |
| `py-14` | 56px | Padding vertikal upload zone |
| `mb-4` | 16px | Margin bawah ikon tool header |
| `mb-8` | 32px | Margin bawah tool header section |
| `mt-16` | 64px | Margin atas OtherTools section |

### 2.4 Border Radius

| Token | Nilai | Penggunaan |
|-------|-------|------------|
| `rounded-md` | 6px | Logo icon container, nav link |
| `rounded-lg` | 8px | Button CTA navbar, input, OtherTools card |
| `rounded-xl` | 12px | Card utama, input field, button aksi |
| `rounded-2xl` | 16px | Upload zone, state card, feature badge |
| `rounded-[10px]` | 10px | Tool card landing, ikon container |
| `rounded-full` | 9999px | Pill badge, progress bar, avatar ikon |

### 2.5 Shadow

| Token | Nilai | Penggunaan |
|-------|-------|------------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Feature badge card, CTA navbar |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | CTA hero button |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Dragging state, dropdown |
| Custom: Tool card hover | `0 4px 20px rgba(37,99,235,0.1)` | Tool card hover state |
| Custom: Button accent | `0 2px 12px rgba(37,99,235,0.25)` | Download/action button |
| Custom: Success card | `0 4px 20px rgba(37,99,235,0.06)` | Done state card |
| Custom: Minimal | `0 1px 3px rgba(0,0,0,0.04)` | Tool card default |

### 2.6 Animasi

| Nama | Keyframes | Durasi | Easing | Penggunaan |
|------|-----------|--------|--------|------------|
| `animate-shimmer` | `background-position: -200% 0 → 200% 0` | 1.4s | ease-in-out infinite | Progress bar processing |
| `animate-fade-up` | `opacity: 0, translateY(10px) → opacity: 1, translateY(0)` | 0.3s | ease forwards | Transisi antar state |
| CSS `transition-all` | — | default (150ms) | default | Hover states umum |
| CSS `transition-colors` | — | default (150ms) | default | Perubahan warna |
| CSS `transition-transform` | — | default (150ms) | default | Hover translate |
| CSS `transition-shadow` | — | default (150ms) | default | Hover shadow |
| `duration-200` | — | 200ms | ease-in-out | Accordion expand/collapse |
| `hover:-translate-y-0.5` | — | — | — | Micro-lift pada hover CTA |

### 2.7 Ikonografi

| Aspek | Spesifikasi |
|-------|-------------|
| **Library** | Inline SVG (custom, mengikuti style Lucide React) |
| **Stroke Width** | 1.6–2.0 (standar), 1.7–1.8 (tool icons) |
| **Line Cap** | `round` |
| **Line Join** | `round` |
| **Ukuran Default** | 14–20px (contextual) |
| **Ukuran Tool Header** | 21px |
| **Ukuran Upload Zone** | 26px |
| **Warna** | Inherit dari parent (`currentColor`) |

---

## 3. Komponen UI

### 3.1 Navbar

**Deskripsi:** Navigasi utama yang sticky di bagian atas halaman. Menampilkan logo, link tool, dan CTA.

**Props:** Tidak ada (komponen mandiri).

**Spesifikasi Visual:**

| Properti | Nilai |
|----------|-------|
| Posisi | `sticky top-0 z-50` |
| Tinggi | `h-[52px]` |
| Background | `bg-bg/92 backdrop-blur-md` (semi-transparan dengan blur) |
| Border | `border-b border-slate-200` |
| Container | `max-w-[1200px] mx-auto px-6` |
| Logo Size | `h-7 w-7` (icon), `text-[17px]` (text) |

**State:**

| State | Visual |
|-------|--------|
| Default | Link `text-slate-600` |
| Active (current page) | Link `text-accent` |
| Hover | Link `hover:bg-slate-100 hover:text-slate-900` |
| Mobile Open | Dropdown `bg-white` dengan border top |
| Mobile Active | `bg-accent/10 text-accent` |

**Perilaku:**
- Desktop (≥768px): Menampilkan semua 6 link tool + CTA "Coba Gratis"
- Mobile (<768px): Menampilkan CTA mini + hamburger icon
- Hamburger toggle membuka/menutup dropdown menu
- Klik link pada mobile otomatis menutup menu

### 3.2 Footer

**Deskripsi:** Footer global dengan logo, link navigasi, copyright, dan language switcher.

**Props:** Tidak ada (komponen mandiri).

**Spesifikasi Visual:**

| Properti | Nilai |
|----------|-------|
| Background | `bg-bg` |
| Border | `border-t border-slate-200` |
| Container | `max-w-[1200px] mx-auto px-6 py-10` |
| Layout | `flex flex-wrap items-center justify-between gap-6` |
| Logo Size | `h-6 w-6` (icon), `text-[15px]` (text) |
| Link Style | `text-[13px] font-medium text-slate-500` |
| Copyright | `text-[13px] text-slate-300` |

**Sub-komponen: LanguageSwitcher**
- Trigger: Button dengan globe icon + "Indonesia" + chevron
- Dropdown: Popup ke atas (`bottom-full`) dengan opsi bahasa
- Indonesia: Aktif (dengan checkmark)
- English: Disabled dengan badge "Segera hadir"

### 3.3 PDFUploader

**Deskripsi:** Komponen upload reusable untuk tool yang memerlukan server-side processing (Compress, PDF-to-Image).

**Props:**

| Prop | Tipe | Default | Keterangan |
|------|------|---------|------------|
| `endpoint` | `string` | — | URL API endpoint |
| `toolName` | `ToolName` | `"compress"` | Nama tool untuk analytics |
| `maxSizeMB` | `number` | `20` | Batas ukuran file (MB) |
| `accept` | `string` | `"application/pdf"` | MIME type yang diterima |
| `onUploadComplete` | `function` | — | Callback saat upload selesai |
| `onReset` | `function` | — | Callback saat reset |
| `onStateChange` | `function` | — | Callback perubahan state |

**State Machine:**

```
idle → uploading → processing → done
  ↓        ↓           ↓
error ← error ←     error
```

**Visual per State:**

| State | Visual |
|-------|--------|
| **Idle** | Upload zone: dashed border, ikon upload, teks instruksi |
| **Uploading** | Card: file info + progress bar dengan persentase |
| **Processing** | Card: file info + shimmer progress bar + teks "Sedang mengompres..." |
| **Done** | Card: success icon + before/after comparison + download button + reset |
| **Error** | Card: rose background + alert icon + pesan error + tombol "Coba Lagi" |

**Fitur Khusus:**
- Auto-retry: Kegagalan pertama otomatis retry setelah 1 detik
- Drag & drop support dengan visual feedback (`border-accent bg-accent/5`)
- Validasi client-side: tipe file, ukuran, file kosong
- XHR upload dengan progress tracking real-time
- Timeout 120 detik

### 3.4 PageRangeInput

**Deskripsi:** Input untuk memilih halaman PDF dengan format range (contoh: "1-3, 5, 7-10").

**Props:**

| Prop | Tipe | Keterangan |
|------|------|------------|
| `totalPages` | `number` | Total halaman dokumen |
| `onChange` | `(pages: number[], raw: string) => void` | Callback perubahan |

**Spesifikasi Visual:**

| Properti | Nilai |
|----------|-------|
| Label | `text-sm font-medium text-navy` |
| Input | `rounded-xl border border-slate-200 px-4 py-3 text-sm` |
| Focus | `border-accent ring-1 ring-accent/20` |
| Error | `border-rose-400 ring-1 ring-rose-200` |
| Helper | `text-xs text-slate-400` |
| Preview | `text-xs text-accent` (halaman yang dipilih) |
| Error msg | `text-xs font-medium text-rose-500` |

**Quick Select Buttons:**
- "Halaman Pertama", "Halaman Terakhir", "Semua Halaman"
- Style: `rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs`
- Hover: `hover:border-accent hover:text-accent`

**Validasi:**
- Hanya angka, tanda hubung, koma, dan spasi
- Range harus valid (start ≤ end)
- Halaman tidak boleh melebihi total
- Live preview halaman yang dipilih

### 3.5 PrivacyNotice

**Deskripsi:** Notifikasi privasi yang selalu ditampilkan di setiap halaman tool.

**Props:**

| Prop | Tipe | Keterangan |
|------|------|------------|
| `model` | `"server" \| "client" \| "hybrid"` | Model pemrosesan |

**Pesan per Model:**

| Model | Pesan |
|-------|-------|
| `server` | "File kamu otomatis dihapus setelah 1 jam. Kami tidak pernah menyimpan dokumenmu." |
| `client` | "File tidak pernah meninggalkan perangkatmu. Semua proses berjalan di browser." |
| `hybrid` | "File kecil diproses di browser. File besar dikirim ke server dan otomatis dihapus dalam 1 jam." |

**Spesifikasi Visual:**

| Properti | Nilai |
|----------|-------|
| Container | `mt-6 rounded-xl bg-slate-50 p-4 border border-slate-100` |
| Layout | `flex items-start justify-center` |
| Icon | Shield, `text-slate-400`, 16px |
| Text | `text-sm text-slate-500` |

### 3.6 OtherTools

**Deskripsi:** Grid cross-navigation yang menampilkan tool lain selain yang sedang aktif.

**Props:**

| Prop | Tipe | Keterangan |
|------|------|------------|
| `currentTool` | `string` | Path tool yang sedang aktif (contoh: "/compress") |

**Spesifikasi Visual:**

| Properti | Nilai |
|----------|-------|
| Container | `mt-16 w-full border-t border-slate-200 pb-8 pt-8` |
| Heading | `text-sm font-semibold uppercase tracking-widest text-accent` |
| Grid | `grid grid-cols-2 gap-3` |
| Card | `rounded-lg border border-slate-200 bg-white px-4 py-3` |
| Card Text | `text-sm font-medium text-navy` |
| Card Hover | `hover:border-accent/50 hover:text-accent` |

**Perilaku:**
- Menampilkan 5 tool (semua kecuali yang aktif)
- Grid 2 kolom pada semua breakpoint
- Setiap card memiliki arrow icon di kanan

### 3.7 Upload Zone (Pattern)

**Deskripsi:** Pola upload zone yang digunakan secara konsisten di semua halaman tool.

**Spesifikasi Visual:**

| Properti | Nilai |
|----------|-------|
| Border | `border-2 border-dashed border-slate-300` |
| Background | `bg-white` |
| Padding | `px-5 py-14` |
| Border Radius | `rounded-2xl` |
| Alignment | `text-center` |
| Icon Container | `h-14 w-14 rounded-xl bg-accent/10 text-accent` |
| Heading | `text-base font-semibold tracking-tight text-navy` |
| Helper | `text-xs text-slate-400` |

**State Drag:**

| Properti | Nilai |
|----------|-------|
| Border | `border-accent` |
| Background | `bg-accent/5` |

### 3.8 Feature Badge Card

**Deskripsi:** Card kecil yang menampilkan fitur/keunggulan tool, ditampilkan saat state idle.

**Spesifikasi Visual:**

| Properti | Nilai |
|----------|-------|
| Layout | `flex flex-col items-center text-center` |
| Border Radius | `rounded-2xl` |
| Background | `bg-white` |
| Border | `border border-slate-100` |
| Shadow | `shadow-sm` |
| Padding | `p-5` |
| Icon | `text-accent mb-3` |
| Text | `text-sm font-semibold text-navy` |
| Grid | `grid-cols-1 md:grid-cols-3 gap-4` |

### 3.9 Sortable File Item (Merge)

**Deskripsi:** Item file yang dapat di-drag untuk reorder dalam tool Merge.

**Spesifikasi Visual:**

| Properti | Nilai |
|----------|-------|
| Layout | `flex items-center gap-3` |
| Border Radius | `rounded-xl` |
| Border | `border border-slate-200` (default), `border-accent` (dragging) |
| Background | `bg-white` |
| Padding | `px-3 py-3` |
| Drag Handle | Grip icon, `cursor-grab`, `text-slate-300` |
| Order Badge | `h-6 w-6 rounded-md bg-accent/10 text-xs font-bold text-accent` |
| File Name | `text-sm font-medium text-navy truncate` |
| File Size | `text-xs text-slate-400` |
| Remove Button | `rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500` |

### 3.10 Sortable Image Item (Image-to-PDF)

**Deskripsi:** Thumbnail gambar yang dapat di-drag untuk reorder dalam tool Image-to-PDF.

**Spesifikasi Visual:**

| Properti | Nilai |
|----------|-------|
| Layout | `relative overflow-hidden` |
| Border Radius | `rounded-xl` |
| Border | `border border-slate-200` (default), `border-accent` (dragging) |
| Thumbnail | `aspect-[4/3] w-full object-cover` |
| Order Badge | `absolute left-2 top-2 h-6 w-6 rounded-md bg-accent text-white` |
| Remove Button | `absolute right-2 top-2 h-6 w-6 rounded-full bg-black/50 text-white` (opacity 0 → 1 on hover) |
| Drag Handle | `absolute bottom-2 right-2 h-7 w-7 rounded-lg bg-black/40 text-white` (opacity 0 → 1 on hover) |
| File Info | `px-2.5 py-2`, nama `text-xs font-medium text-navy`, size `text-[11px] text-slate-400` |
| Grid | `grid-cols-2 sm:grid-cols-3 gap-3` |

### 3.11 Accordion Item (FAQ)

**Deskripsi:** Item FAQ yang dapat di-expand/collapse.

**Spesifikasi Visual:**

| Properti | Nilai |
|----------|-------|
| Container | `rounded-xl border border-slate-200 bg-white` |
| Hover | `hover:shadow-sm` |
| Question | `text-[15px] font-semibold text-navy` |
| Answer | `text-[15px] leading-relaxed text-slate-600` |
| Chevron | `text-slate-400`, rotasi 180° saat open |
| Padding Trigger | `px-5 py-4` |
| Padding Answer | `px-5 pb-4` |
| Animation | `grid-rows-[0fr] → grid-rows-[1fr]`, `opacity-0 → opacity-100`, `duration-200` |
| Spacing | `space-y-3` antar item |

### 3.12 Page Rotation Grid (Rotate)

**Deskripsi:** Grid visual halaman PDF untuk rotasi per-halaman.

**Spesifikasi Visual:**

| Properti | Nilai |
|----------|-------|
| Grid | `grid-cols-3 sm:grid-cols-4 gap-3` |
| Cell | `rounded-xl border-2 p-3` |
| Cell Default | `border-slate-200 bg-white` |
| Cell Rotated | `border-accent/40 bg-accent/5` |
| Cell Hover | `hover:border-accent/60` |
| Thumbnail | `h-16 w-12 rounded bg-slate-100` dengan `transform: rotate(Xdeg)` |
| Page Label | `text-xs font-medium text-slate-600` |
| Rotation Label | `text-[10px] font-semibold text-accent` |
| Hover Badge | `absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-white` (opacity 0 → 1) |

---

## 4. Layout & Grid System

### 4.1 Struktur Halaman Global

```
┌─────────────────────────────────────────────┐
│ Navbar (sticky, h-52px, z-50)               │
├─────────────────────────────────────────────┤
│                                             │
│ <main class="flex-1">                       │
│   [Page Content]                            │
│                                             │
├─────────────────────────────────────────────┤
│ Footer (border-t)                           │
└─────────────────────────────────────────────┘
```

**Body:** `flex min-h-full flex-col font-sans`
**Main:** `flex-1` (mengisi ruang antara navbar dan footer)

### 4.2 Container Widths

| Konteks | Max Width | Kelas | Penggunaan |
|---------|-----------|-------|------------|
| Landing Page | 1200px | `max-w-[1200px]` | Hero, tools grid, privacy section |
| Navbar/Footer | 1200px | `max-w-[1200px]` | Container navigasi |
| Tool Pages | 576px | `max-w-xl` | Halaman tool (compress, merge, dll.) |
| Content Pages | 672px | `max-w-2xl` | FAQ, Privacy |

### 4.3 Grid Systems

#### Landing Page — Tools Grid

```
Mobile:  grid-cols-1
Tablet:  sm:grid-cols-2
Desktop: lg:grid-cols-3
Gap:     gap-4
```

#### Landing Page — Privacy Section

```
Mobile:  grid-cols-1
Desktop: sm:grid-cols-3
Gap:     gap-8
```

#### Tool Page — Feature Badges

```
Mobile:  grid-cols-1
Desktop: md:grid-cols-3
Gap:     gap-4
```

#### Tool Page — OtherTools

```
All:     grid-cols-2
Gap:     gap-3
```

#### Image-to-PDF — Image Grid

```
Mobile:  grid-cols-2
Desktop: sm:grid-cols-3
Gap:     gap-3
```

#### Rotate — Page Grid

```
Mobile:  grid-cols-3
Desktop: sm:grid-cols-4
Gap:     gap-3
```

### 4.4 Padding System

| Konteks | Horizontal | Vertikal |
|---------|------------|----------|
| Landing sections | `px-6` (24px) | `py-20` (80px) |
| Navbar container | `px-6` (24px) | — (h-52px) |
| Footer container | `px-6` (24px) | `py-10` (40px) |
| Tool pages | `px-4` (16px) | `py-8 sm:py-12` (32px/48px) |
| Content pages | `px-4` (16px) | `py-12 sm:py-16` (48px/64px) |
| Cards | `p-5` atau `p-6` | — |
| Upload zone | `px-5 py-14` | — |

---

## 5. Pola Navigasi

### 5.1 Navbar — Perilaku Desktop (≥768px)

- Logo (kiri): Link ke homepage `/`
- Nav links (tengah-kiri): 6 tool links horizontal
- CTA (kanan): "Coba Gratis" → `/compress`
- Active state: Teks berubah ke `text-accent`
- Hover state: Background `bg-slate-100`, teks `text-slate-900`

### 5.2 Navbar — Perilaku Mobile (<768px)

- Logo (kiri): Link ke homepage
- CTA mini (kanan): "Coba Gratis" (lebih kecil)
- Hamburger (kanan): Toggle dropdown menu
- Dropdown: Full-width, background putih, 6 link vertikal
- Active link: `bg-accent/10 text-accent`
- Klik link → auto-close menu

### 5.3 Tool Navigation

- **Intra-tool:** Tidak ada breadcrumb. Setiap tool adalah halaman mandiri.
- **Cross-tool:** Komponen `OtherTools` di bawah setiap halaman tool
- **Back to home:** Via logo di navbar
- **Deep linking:** Setiap tool memiliki URL langsung (`/compress`, `/merge`, dll.)

### 5.4 Footer Navigation

- Link: Privasi, FAQ, Syarat, Kontak
- Language switcher: Indonesia (aktif), English (segera hadir)
- Logo: Link ke homepage

### 5.5 Sitemap & Routes

| Route | Halaman | Tipe |
|-------|---------|------|
| `/` | Landing Page | Static |
| `/compress` | Kompres PDF | Client (interactive) |
| `/merge` | Gabungkan PDF | Client (interactive) |
| `/split` | Pisahkan PDF | Client (interactive) |
| `/image-to-pdf` | Gambar ke PDF | Client (interactive) |
| `/pdf-to-image` | PDF ke Gambar | Client (interactive) |
| `/rotate` | Putar PDF | Client (interactive) |
| `/faq` | FAQ | Client (interactive) |
| `/privacy` | Kebijakan Privasi | Static (SSR) |

---

## 6. Pola Interaksi

### 6.1 Alur Upload (Server-Side Tools)

Berlaku untuk: **Compress**, **PDF-to-Image**

```
[Idle]
  User klik/drag file ke upload zone
    ↓
[Validasi Client]
  - Cek tipe file (PDF only)
  - Cek ukuran (≤ 20MB)
  - Cek file tidak kosong
  → Gagal: tampilkan error state
    ↓
[Uploading]
  - Progress bar real-time (0-100%)
  - Tampilkan nama file + ukuran
  - Timeout: 120 detik
    ↓
[Processing]
  - Shimmer animation pada progress bar
  - Teks kontekstual ("Sedang mengompres...")
    ↓
[Done]
  - Success icon (emerald)
  - Hasil (before/after untuk compress)
  - Tombol download
  - Tombol "Kompres file lain" (reset)
```

### 6.2 Alur Upload (Client-Side Tools)

Berlaku untuk: **Merge**, **Split**, **Rotate**, **Image-to-PDF** (< 3MB)

```
[Idle]
  User klik/drag file ke upload zone
    ↓
[Validasi Client]
  - Cek tipe file
  - Cek ukuran
  - Cek file tidak kosong
  → Gagal: tampilkan error state
    ↓
[Ready / File List]
  - Tampilkan file info
  - Konfigurasi tambahan (page range, rotation, reorder)
  - Tombol aksi (disabled sampai konfigurasi valid)
    ↓
[Processing]
  - Shimmer animation
  - Teks "Proses berjalan di browser"
    ↓
[Done]
  - Success icon
  - Tombol download (blob URL)
  - Tombol reset
```

### 6.3 Drag & Drop

**Upload Zone:**
- `onDragOver`: Set visual state (border accent, bg accent/5)
- `onDragLeave`: Reset visual state
- `onDrop`: Proses file, reset visual state

**Reorder (Merge, Image-to-PDF):**
- Library: `@dnd-kit/core` + `@dnd-kit/sortable`
- Sensor: `PointerSensor` (activation distance: 5px) + `KeyboardSensor`
- Strategy: `verticalListSortingStrategy` (Merge), `rectSortingStrategy` (Image-to-PDF)
- Visual: Item yang di-drag mendapat `border-accent shadow-lg z-50`

### 6.4 State Error

**Visual Konsisten:**
- Background: `bg-rose-50/50`
- Border: `border-rose-200`
- Icon: Alert circle, `text-rose-500`
- Heading: "Terjadi Kesalahan", `text-sm font-semibold`
- Message: `text-sm text-slate-600`
- Action: Tombol "Coba Lagi" (accent blue)

**Tipe Error:**
- Validasi file (tipe, ukuran, kosong)
- Network error (timeout, connection failed)
- Server error (5xx)
- Rate limit (429)

**Auto-Retry:**
- Kegagalan pertama pada server error → retry otomatis setelah 1 detik
- Kegagalan kedua → tampilkan error ke user

### 6.5 State Loading

**Dua Varian:**

1. **Determinate (Upload):** Progress bar dengan persentase (`width: X%`)
2. **Indeterminate (Processing):** Shimmer animation (`animate-shimmer`)

**Teks Kontekstual:**
- Upload: "Mengunggah... X%"
- Compress: "Sedang mengompres..."
- Merge: "Sedang menggabungkan X file..."
- Split: "Sedang memisahkan X halaman..."
- Image-to-PDF: "Membuat PDF dari X gambar..."
- PDF-to-Image: "Mengubah X halaman menjadi gambar..."
- Rotate: "Memutar halaman PDF..."
- Loading PDF: "Membaca dokumen PDF..."

### 6.6 State Download/Done

**Visual Konsisten:**
- Border: `border-accent/20`
- Shadow: `shadow-[0_4px_20px_rgba(37,99,235,0.06)]`
- Success Icon: `h-10 w-10 rounded-full bg-emerald-500` + check putih
- Download Button: Full-width, `bg-accent`, shadow accent
- Reset Button: Full-width, border, teks slate

**Khusus Compress:**
- Before/After comparison card
- Badge persentase penghematan (`-X%`)

---

## 7. Responsivitas

### 7.1 Breakpoints

| Breakpoint | Lebar | Kelas Tailwind | Target Device |
|------------|-------|----------------|---------------|
| Default | 0–639px | (tanpa prefix) | Mobile portrait |
| `sm` | ≥640px | `sm:` | Mobile landscape, tablet kecil |
| `md` | ≥768px | `md:` | Tablet, desktop kecil |
| `lg` | ≥1024px | `lg:` | Desktop |

### 7.2 Adaptasi per Breakpoint

#### Mobile (< 640px)

- Navbar: Logo + CTA mini + hamburger
- Tool pages: `py-8`, single column
- Landing tools grid: 1 kolom
- Feature badges: 1 kolom
- Image grid: 2 kolom
- Rotation grid: 3 kolom
- Font H1 tool: `text-3xl` (30px)
- Content pages: `py-12`

#### Tablet (≥ 640px)

- Landing tools grid: 2 kolom
- Privacy section: 3 kolom
- Tool pages: `sm:py-12`
- Image grid: 3 kolom
- Rotation grid: 4 kolom
- Content pages: `sm:py-16`

#### Desktop (≥ 768px)

- Navbar: Full horizontal nav + CTA
- Feature badges: 3 kolom
- Font H1 tool: `md:text-4xl` (36px)

#### Large Desktop (≥ 1024px)

- Landing tools grid: 3 kolom

### 7.3 Touch Targets

| Elemen | Ukuran Minimum | Implementasi |
|--------|----------------|--------------|
| Nav links (mobile) | 44px tinggi | `px-4 py-2.5` = ~44px |
| Upload zone | Full-width, 56px padding | Area klik sangat besar |
| Buttons (primer) | 56px tinggi | `py-4` + font size |
| Buttons (sekunder) | 44px tinggi | `py-3` + font size |
| Remove file button | 36px | `p-1.5` + icon 14px |
| Drag handle | 44px area | Touch-friendly spacing |
| Quick select buttons | 36px | `px-3 py-1.5` |
| Accordion trigger | 52px | `px-5 py-4` |

### 7.4 Adaptasi Mobile Khusus

- **Upload zone:** Teks "Seret PDF ke sini atau klik untuk upload" — pada mobile, klik adalah aksi utama
- **Drag reorder:** `PointerSensor` dengan `activationConstraint: { distance: 5 }` mencegah accidental drag saat scroll
- **Image thumbnails:** Overlay controls (remove, drag) muncul on hover — pada mobile, selalu visible atau tap-to-reveal
- **Navbar CTA:** Ukuran lebih kecil pada mobile (`px-3.5 py-1.5 text-[13px]`)

---

## 8. Aksesibilitas

### 8.1 Target Kepatuhan

| Standar | Level | Status |
|---------|-------|--------|
| WCAG 2.1 | AA | Sebagian besar terpenuhi |
| WCAG 2.1 | AAA | Belum ditargetkan |

### 8.2 Keyboard Navigation

| Elemen | Implementasi |
|--------|--------------|
| Upload zone | `tabIndex={0}`, `onKeyDown` (Enter/Space) |
| Navbar links | Native `<a>` / Next.js `<Link>` |
| Buttons | Native `<button>` |
| Accordion | Native `<button>` trigger |
| Drag & drop | `KeyboardSensor` dari @dnd-kit |
| File input | Hidden, triggered via button |
| Language switcher | `<button>` trigger |

### 8.3 Screen Reader

| Elemen | Implementasi |
|--------|--------------|
| Hamburger menu | `aria-label="Buka menu"` / `"Tutup menu"` |
| Remove file button | `aria-label="Hapus {filename}"` |
| Remove file (split/pdf-to-image) | `aria-label="Hapus file"` |
| Upload zone | `role="button"` |
| HTML lang | `lang="id"` |
| Page titles | Dynamic via Next.js `metadata` |

### 8.4 Kontras Warna

| Kombinasi | Rasio | Status WCAG AA |
|-----------|-------|----------------|
| Navy (#1E3A5F) pada White (#FFFFFF) | ~8.5:1 | Lulus |
| Accent (#2563EB) pada White (#FFFFFF) | ~4.6:1 | Lulus |
| Slate-500 pada White (#FFFFFF) | ~5.0:1 | Lulus |
| Slate-400 pada White (#FFFFFF) | ~3.5:1 | Lulus (large text only) |
| White pada Navy (#1E3A5F) | ~8.5:1 | Lulus |
| White pada Accent (#2563EB) | ~4.6:1 | Lulus |
| White pada Emerald-500 | ~3.4:1 | Borderline (ikon only) |

### 8.5 Rekomendasi Aksesibilitas

| Area | Status Saat Ini | Rekomendasi |
|------|-----------------|-------------|
| Focus ring | Tidak eksplisit (browser default) | Tambahkan `focus-visible:ring-2 ring-accent` |
| Skip navigation | Tidak ada | Tambahkan "Skip to content" link |
| Error announcement | Visual only | Tambahkan `aria-live="polite"` pada error region |
| Progress | Visual only | Tambahkan `role="progressbar"` + `aria-valuenow` |
| Image alt text | Ada pada thumbnails | Sudah baik |
| Form labels | Ada (`htmlFor`) | Sudah baik |
| Heading hierarchy | Konsisten | Sudah baik |

---

## 9. Panduan Halaman

### 9.1 Landing Page (`/`)

**Struktur:**

```
┌─────────────────────────────────────────────┐
│ [Navbar]                                    │
├─────────────────────────────────────────────┤
│                                             │
│ [Hero Section]                              │
│   - Pill badge ("Gratis · Tanpa akun...")   │
│   - H1: "Alat PDF yang langsung bekerja."  │
│   - Subtitle                                │
│   - CTA: "Mulai gratis"                    │
│   - Trust badges (3x)                       │
│                                             │
├─────────────────────────────────────────────┤
│ [Divider: border-t]                         │
├─────────────────────────────────────────────┤
│                                             │
│ [Tools Grid Section]                        │
│   - Section label ("Semua alat")            │
│   - H2: "Semua yang kamu butuhkan..."       │
│   - 6 tool cards (1/2/3 cols responsive)    │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│ [Privacy Section] (bg-slate-100)            │
│   - Section label ("Privasi utama")         │
│   - H2: "File kamu tetap milikmu"           │
│   - 3 privacy items (icon + title + desc)   │
│                                             │
├─────────────────────────────────────────────┤
│ [Footer]                                    │
└─────────────────────────────────────────────┘
```

**Spesifikasi Hero:**
- Container: `max-w-[1200px] px-6 pb-20 pt-24 text-center`
- Pill badge: `rounded-full border border-accent/30 bg-accent/10 px-3 py-1`
- H1: `clamp(40px, 6vw, 72px) font-semibold leading-[1.08] tracking-[-2px] text-navy`
- Subtitle: `max-w-[520px] text-lg leading-relaxed text-slate-500`
- CTA: `rounded-[10px] bg-navy px-8 py-3.5 text-base font-semibold text-white shadow-md`
- Trust badges: `text-[13.5px] font-medium text-slate-500` dengan ikon accent

**Tool Card:**
- Container: `rounded-[10px] border border-slate-200 bg-white p-6`
- Shadow default: `shadow-[0_1px_3px_rgba(0,0,0,0.04)]`
- Hover: `-translate-y-0.5 border-accent/60 shadow-[0_4px_20px_rgba(37,99,235,0.1)]`
- Icon container: `h-10 w-10 rounded-[10px] bg-slate-100`
- Icon hover: `bg-accent/15 text-accent`
- Title: `text-[15px] font-semibold text-navy`
- Description: `text-[13.5px] leading-snug text-slate-500`
- CTA text: `text-[13px] font-medium text-slate-400` → hover `text-accent`

### 9.2 Halaman Tool — Pola Umum

Berlaku untuk: Compress, Merge, Split, Image-to-PDF, PDF-to-Image

**Struktur:**

```
┌─────────────────────────────────────────────┐
│ [Navbar]                                    │
├─────────────────────────────────────────────┤
│                                             │
│ [Tool Header] (centered)                    │
│   - Icon (64x64, rounded-2xl, bg-accent/10)│
│   - H1 (tool name)                         │
│   - Description (1 line)                    │
│   - Context (use case Indonesia)            │
│                                             │
│ [Main Content Area]                         │
│   - Upload zone / File list / State cards   │
│                                             │
│ [Privacy Notice] (always visible)           │
│                                             │
│ [Feature Badges] (idle state only)          │
│   - 3 badges in grid                        │
│                                             │
│ [Other Tools] (cross-navigation)            │
│                                             │
├─────────────────────────────────────────────┤
│ [Footer]                                    │
└─────────────────────────────────────────────┘
```

**Container:** `mx-auto w-full max-w-xl px-4 py-8 sm:py-12`

**Tool Header:**
- Icon: `h-16 w-16 rounded-2xl bg-accent/10 text-accent`
- H1: `text-3xl md:text-4xl font-bold tracking-tight text-navy`
- Description: `text-base text-slate-500`
- Context: `text-sm text-slate-400 max-w-md`

### 9.3 Halaman Compress (`/compress`)

**Keunikan:**
- Menggunakan `PDFUploader` component (server-side processing)
- State "done" menampilkan before/after comparison
- Privacy model: `server`
- Feature badges: "Proses instan", "Aman & privat", "Kualitas terjaga"

### 9.4 Halaman Merge (`/merge`)

**Keunikan:**
- Multi-file upload (accept multiple)
- Sortable file list dengan drag-and-drop reorder
- Tombol merge disabled sampai ≥ 2 file
- Privacy model: `client`
- Feature badges: "Proses di browser", "Tanpa upload server", "Privasi terjaga"
- Teks upload zone berubah: "Seret beberapa PDF..." → "Tambah file lagi"

### 9.5 Halaman Split (`/split`)

**Keunikan:**
- Single file upload → loading (baca halaman) → ready (page range input)
- Menggunakan `PageRangeInput` component
- File info card dengan total halaman
- Tombol split disabled sampai range valid
- Privacy model: `client`
- Feature badges: "Proses di browser", "Tanpa upload server", "Privasi terjaga"

### 9.6 Halaman Image-to-PDF (`/image-to-pdf`)

**Keunikan:**
- Accept: `image/jpeg, image/png, image/webp`
- Multi-image upload dengan thumbnail preview
- Grid layout untuk thumbnails (2 cols mobile, 3 cols desktop)
- Drag-and-drop reorder (rect sorting strategy)
- Validasi magic bytes (header file)
- Hybrid processing: client (< 3MB) atau server fallback
- Privacy model: `hybrid`
- Feature badges: "Proses instan", "Tanpa upload server", "Privasi terjaga"

### 9.7 Halaman PDF-to-Image (`/pdf-to-image`)

**Keunikan:**
- Single file upload → loading → ready (page range input)
- Server-side processing (PyMuPDF)
- Hasil: PNG (single page) atau ZIP (multiple pages)
- Download via signed URL (bukan blob)
- Privacy model: `server`
- Feature badges: "Konversi cepat", "Auto-hapus 1 jam", "Privasi terjaga"

### 9.8 Halaman Rotate (`/rotate`)

**Keunikan:**
- Header layout berbeda: horizontal (icon + text), bukan centered
- Feature badges sebagai pill/chip (bukan card)
- Visual page grid untuk rotasi per-halaman
- Klik halaman = rotate 90° (kumulatif)
- Global rotation buttons: 90°, 180°, 270°
- Visual feedback: thumbnail berputar sesuai derajat
- Tombol proses menggunakan `bg-navy` (bukan accent)
- Done state: `bg-emerald-50 border-emerald-200` (berbeda dari tool lain)
- Privacy model: `client`

### 9.9 Halaman FAQ (`/faq`)

**Struktur:**

```
┌─────────────────────────────────────────────┐
│ [Navbar]                                    │
├─────────────────────────────────────────────┤
│                                             │
│ [Header]                                    │
│   - HelpCircle icon + H1 "Pertanyaan Umum" │
│   - Subtitle                                │
│                                             │
│ [Accordion] (8 items)                       │
│   - Single-open behavior                    │
│   - CSS grid animation                      │
│                                             │
│ [CTA Card]                                  │
│   - "Masih punya pertanyaan?"               │
│   - Email link                              │
│                                             │
├─────────────────────────────────────────────┤
│ [Footer]                                    │
└─────────────────────────────────────────────┘
```

**Container:** `max-w-2xl px-4 py-12 sm:py-16`
**Accordion behavior:** Single-open (klik item lain menutup yang sebelumnya)

### 9.10 Halaman Privacy (`/privacy`)

**Struktur:**

```
┌─────────────────────────────────────────────┐
│ [Navbar]                                    │
├─────────────────────────────────────────────┤
│                                             │
│ [Header]                                    │
│   - H1 "Kebijakan Privasi"                 │
│   - Last updated date                       │
│                                             │
│ [Content] (prose style)                     │
│   - Intro paragraph                         │
│   - Sections with H2 + bullet lists         │
│   - Contact section with email link         │
│                                             │
├─────────────────────────────────────────────┤
│ [Footer]                                    │
└─────────────────────────────────────────────┘
```

**Container:** `max-w-2xl px-4 py-12 sm:py-16`
**Content style:** `text-[15px] leading-relaxed text-slate-600 space-y-8`
**Section H2:** `text-lg font-semibold text-navy`
**Lists:** `list-disc space-y-2 pl-5`
**Links:** `font-medium text-accent underline underline-offset-2 hover:text-navy`

---

## 10. Rekomendasi Peningkatan

### 10.1 Dark Mode

**Status:** Belum diimplementasi (light only).

**Rekomendasi:**
- Implementasi menggunakan CSS custom properties yang sudah ada (`--color-bg`, `--color-background`, `--color-foreground`)
- Toggle di navbar atau footer
- Mapping warna:
  - `--color-bg`: `#F9FAFB` → `#0F172A` (slate-900)
  - `--color-background`: `#FFFFFF` → `#1E293B` (slate-800)
  - `--color-foreground`: `#171717` → `#F1F5F9` (slate-100)
  - `--color-navy`: `#1E3A5F` → `#93C5FD` (blue-300)
  - Border slate-200 → slate-700
- Simpan preferensi di `localStorage`
- Respect `prefers-color-scheme` media query

### 10.2 Animasi & Micro-Interactions

**Status:** Minimal (fade-up, shimmer, hover translate).

**Rekomendasi:**
- **Page transition:** Fade antar halaman menggunakan Next.js App Router transitions
- **Upload success:** Confetti atau checkmark animation saat proses selesai
- **Progress celebration:** Angka persentase penghematan dengan count-up animation
- **Drag feedback:** Scale up (1.02) pada item yang di-drag
- **Button press:** Scale down (0.98) pada click/tap
- **Skeleton loading:** Untuk initial page load pada tool pages
- **Stagger animation:** Tool cards di landing page muncul satu per satu

### 10.3 Peningkatan Aksesibilitas

**Rekomendasi:**
- Tambahkan skip navigation link
- Implementasi `aria-live` region untuk state changes
- Tambahkan `role="progressbar"` dengan `aria-valuenow`
- Custom focus ring (`focus-visible:ring-2 ring-accent ring-offset-2`)
- Reduced motion support (`prefers-reduced-motion: reduce`)
- High contrast mode support

### 10.4 Peningkatan UX

**Rekomendasi:**
- **Undo:** Tombol undo setelah menghapus file dari list
- **Batch download:** Download semua hasil sekaligus (untuk PDF-to-Image multi-page)
- **Preview:** Thumbnail preview PDF sebelum proses
- **History:** Riwayat file yang baru diproses (session-based, tanpa server storage)
- **Keyboard shortcuts:** Ctrl+U untuk upload, Ctrl+Enter untuk proses
- **Offline indicator:** Banner saat koneksi terputus
- **File size estimation:** Estimasi ukuran hasil sebelum proses

### 10.5 Peningkatan Visual

**Rekomendasi:**
- **Ilustrasi:** Custom illustrations untuk empty states dan error states
- **Gradient accent:** Subtle gradient pada hero section
- **Glass morphism:** Navbar blur yang lebih pronounced
- **Consistent done state:** Standardisasi visual done state di Rotate (saat ini berbeda dari tool lain)
- **Loading skeleton:** Placeholder content saat halaman loading
- **Tooltip:** Hover tooltip pada ikon dan badge

### 10.6 Peningkatan Performa Visual

**Rekomendasi:**
- **Image optimization:** Lazy loading untuk thumbnail di Image-to-PDF
- **Virtual scrolling:** Untuk file list yang sangat panjang (> 20 files)
- **Optimistic UI:** Tampilkan file di list sebelum validasi selesai
- **Progressive enhancement:** Fallback UI untuk browser tanpa JavaScript

---

## 11. Referensi Silang

| Dokumen | ID | Relevansi |
|---------|-----|-----------|
| Business Requirements Document | PPR-BRD-001 | Kebutuhan bisnis yang mendasari keputusan UI/UX |
| Software Requirements Specification | PPR-SRS-001 | Spesifikasi fungsional yang diimplementasikan di UI |
| Coding Standards | PPR-CS-001 | Standar kode yang mengatur implementasi komponen |
| API Specification | PPR-API-001 | Endpoint yang dikonsumsi oleh komponen frontend |
| Test Plan | PPR-TP-001 | Skenario testing UI/UX |
| Analytics Event Taxonomy | PPR-AET-001 | Event tracking yang terintegrasi di komponen |
| Security Policy | PPR-SP-001 | Kebijakan keamanan yang mempengaruhi desain privasi |
| GTM Strategy | PPR-GTM-001 | Strategi go-to-market yang mempengaruhi copy dan positioning |

### Mapping Kebutuhan ke Komponen UI

| Kebutuhan (BRD) | Komponen UI | Catatan |
|-----------------|-------------|---------|
| Compress PDF | PDFUploader + CompressPage | Server-side via Ghostscript |
| Merge PDF | MergePage (custom) | Client-side, dnd-kit reorder |
| Split PDF | SplitPage + PageRangeInput | Client-side, pdf-lib |
| Image to PDF | ImageToPdfPage (custom) | Hybrid: client < 3MB, server fallback |
| PDF to Image | PdfToImagePage + PageRangeInput | Server-side via PyMuPDF |
| Rotate PDF | RotatePage (custom) | Client-side, visual grid |
| Privacy compliance | PrivacyNotice + PrivacyPage | Always-visible notice |
| Mobile-first | Responsive layout | Tailwind breakpoints |
| Indonesia-first | All copy in Bahasa Indonesia | lang="id", locale id_ID |

---

## 12. Persetujuan

| Peran | Nama | Status | Tanggal |
|-------|------|--------|---------|
| **Product Owner** | Muhammad Fa'iz Zulfikar | Approved | 2025-06-03 |
| **AI Agent** | OpenCode/Sisyphus | Approved | 2025-06-03 |

---

*Dokumen ini bersifat rahasia dan merupakan properti intelektual Papyr. Distribusi tanpa izin tertulis dari Product Owner dilarang.*

---

**Papyr** — Alat PDF gratis, cepat, dan aman untuk Indonesia.
mypapyr.com
