# **Papyr**

## Implementation Backlog — Fase 3

### Alat PDF Gratis, Cepat, dan Privasi-First untuk Indonesia

**mypapyr.com**

---

## Informasi Dokumen

| Field | Detail |
|-------|--------|
| **Kode Dokumen** | PPR-IB-003 |
| **Versi** | 1.0 |
| **Status** | Draft |
| **Tanggal** | Mei 2026 |
| **Penulis** | Muhammad Fa'iz Zulfikar |
| **Reviewer** | — |
| **Scope** | Fase 3 (M23–M45) |
| **Total Tasks** | 149 tasks (PAPYR-225 — PAPYR-373) |
| **Estimasi Total** | ~170 jam |
| **Model Pengembangan** | 100% AI-driven |

---

## Riwayat Versi

| Versi | Tanggal | Perubahan | Penulis |
|-------|---------|-----------|---------|
| 1.0 | Mei 2026 | Initial draft — backlog lengkap M23–M45 (23 milestones, 5 fase) | Muhammad Fa'iz Zulfikar |

---

## Dokumen Terkait

| Kode | Dokumen | Keterangan |
|------|---------|------------|
| PPR-IB-001 | Papyr Implementation Backlog Fase 1 | Backlog M01–M11 (89 tasks, selesai) |
| PPR-IB-002 | Papyr Implementation Backlog Fase 2 | Backlog M12–M22 (135 tasks, in progress) |
| PPR-BRD-001 | Papyr BRD v1.0 | Business Requirements Document |
| PPR-SRS-001 | Papyr SRS v1.0 | Software Requirements Specification |
| PPR-TDD-001 | Papyr TDD v1.0 | Technical Design Document |
| PPR-RM-001 | Papyr Roadmap v1.0 | Product Roadmap |
| PPR-API-001 | Papyr API Spec v1.0 | API Specification |
| PPR-TP-001 | Papyr Test Plan v1.0 | Test Plan & Strategy |
| PPR-CLAW-001 | Papyr OpenClaw v1.0 | OpenClaw AI Agent Full Specification |

---

## Konteks Fase 3

### Status Saat Ini (Post-Fase 2)

| Aspek | Detail |
|-------|--------|
| **Versi** | v2.0.0 |
| **Tools live** | 13 (6 Fase 1 + 7 Fase 2) |
| **Tasks selesai** | 224 (PAPYR-001 — PAPYR-224) |
| **Stack** | Next.js 16 (Vercel) + FastAPI (Railway) + Cloudflare R2 |
| **Tests** | 23 vitest + 34 pytest + 29 Playwright E2E |
| **CI/CD** | GitHub Actions (lint + test + build + E2E) |
| **Upload limit** | 20 MB per file |
| **Retention** | 60 menit auto-delete |
| **Rate limit** | 10 req/menit per IP |
| **Analytics** | Vercel Analytics (13 tools tracked) |
| **Monitoring** | BetterStack + Telegram alerts |
| **Admin** | /admin dashboard (10 modul) |
| **AI Agent** | OpenClaw (9 agents aktif) |
| **Domain** | mypapyr.com (Hostinger DNS → Vercel) |

### Target Fase 3

- **Fokus:** Foundation & UX Polish (bukan fitur tool baru)
- **i18n:** English support (next-intl), language switcher
- **UX:** Dark mode, accessibility, onboarding, keyboard shortcuts
- **Performance:** PWA, Web Worker, lazy loading, edge caching
- **Interaction:** Global drag-drop, file history, undo/redo
- **Growth:** Social proof, feedback widget, tool recommendation
- **Total fitur baru:** 23 enhancements
- **Target release:** v3.0.0

### Filosofi Fase 3

| Prinsip | Penjelasan |
|---------|------------|
| **Polish over features** | Tidak ada tool baru. Fokus mempoles 13 tools yang sudah ada |
| **Performance budget** | LCP < 1.5s, FID < 50ms, CLS < 0.05 |
| **Accessibility first** | WCAG 2.1 AA compliance target |
| **International ready** | Bahasa Indonesia tetap default, English sebagai bahasa kedua |
| **Offline capable** | Basic PWA support, graceful degradation tanpa internet |

---

## Ringkasan Milestone

| Kode | Milestone | Fase | Periode | Tasks | Estimasi |
|------|-----------|------|---------|-------|----------|
| M23 | **i18n (English Support)** | 3A — Critical UX | Minggu 1–2 | 8 | 12 jam |
| M24 | **Error Boundary + Offline Handling** | 3A — Critical UX | Minggu 2–3 | 7 | 10 jam |
| M25 | **Progress Indicator** | 3A — Critical UX | Minggu 3–4 | 6 | 8 jam |
| M26 | **Rate Limit Feedback** | 3A — Critical UX | Minggu 4–5 | 7 | 10 jam |
| M27 | **Dark Mode** | 3B — UX Enhancement | Minggu 5–6 | 8 | 12 jam |
| M28 | **Accessibility (a11y)** | 3B — UX Enhancement | Minggu 6–8 | 9 | 14 jam |
| M29 | **PDF Preview** | 3B — UX Enhancement | Minggu 8–9 | 7 | 10 jam |
| M30 | **Onboarding Tour** | 3B — UX Enhancement | Minggu 9–10 | 6 | 7 jam |
| M31 | **Compression Comparison** | 3B — UX Enhancement | Minggu 10–11 | 6 | 7 jam |
| M32 | **PWA Support** | 3C — Performance | Minggu 11–12 | 8 | 10 jam |
| M33 | **Web Worker Processing** | 3C — Performance | Minggu 12–13 | 6 | 8 jam |
| M34 | **Lazy Loading Tools** | 3C — Performance | Minggu 13–14 | 5 | 5 jam |
| M35 | **Image Optimization** | 3C — Performance | Minggu 14 | 5 | 5 jam |
| M36 | **Prefetch on Hover** | 3C — Performance | Minggu 14–15 | 5 | 4 jam |
| M37 | **Edge Caching** | 3C — Performance | Minggu 15 | 5 | 3 jam |
| M38 | **Drag & Drop Global** | 3D — Interaction | Minggu 15–16 | 7 | 8 jam |
| M39 | **Keyboard Shortcuts** | 3D — Interaction | Minggu 16–17 | 7 | 7 jam |
| M40 | **File History (localStorage)** | 3D — Interaction | Minggu 17–18 | 6 | 6 jam |
| M41 | **Changelog Page** | 3D — Interaction | Minggu 18 | 5 | 4 jam |
| M42 | **Undo/Redo** | 3D — Interaction | Minggu 18–19 | 7 | 5 jam |
| M43 | **Social Proof Widget** | 3E — Growth | Minggu 19–20 | 6 | 5 jam |
| M44 | **User Feedback Widget** | 3E — Growth | Minggu 20 | 7 | 5 jam |
| M45 | **Tool Recommendation** | 3E — Growth | Minggu 20–21 | 6 | 5 jam |
| **TOTAL** | **23 Milestones** | **5 Fase** | **Minggu 1–21** | **149 tasks** | **~170 jam** |

> ~170 jam total / 10 jam/minggu = sekitar 17 minggu. Realistis untuk 100% AI-driven development.

---

## GitHub Labels yang Disarankan

### Labels Baru untuk Fase 3

| Label | Warna | Kegunaan |
|-------|-------|----------|
| `milestone:M23` | #E5E7EB | i18n (English Support) |
| `milestone:M24` | #E5E7EB | Error Boundary + Offline |
| `milestone:M25` | #E5E7EB | Progress Indicator |
| `milestone:M26` | #E5E7EB | Rate Limit Feedback |
| `milestone:M27` | #E5E7EB | Dark Mode |
| `milestone:M28` | #E5E7EB | Accessibility |
| `milestone:M29` | #E5E7EB | PDF Preview |
| `milestone:M30` | #E5E7EB | Onboarding Tour |
| `milestone:M31` | #E5E7EB | Compression Comparison |
| `milestone:M32` | #E5E7EB | PWA Support |
| `milestone:M33` | #E5E7EB | Web Worker Processing |
| `milestone:M34` | #E5E7EB | Lazy Loading Tools |
| `milestone:M35` | #E5E7EB | Image Optimization |
| `milestone:M36` | #E5E7EB | Prefetch on Hover |
| `milestone:M37` | #E5E7EB | Edge Caching |
| `milestone:M38` | #E5E7EB | Drag & Drop Global |
| `milestone:M39` | #E5E7EB | Keyboard Shortcuts |
| `milestone:M40` | #E5E7EB | File History |
| `milestone:M41` | #E5E7EB | Changelog Page |
| `milestone:M42` | #E5E7EB | Undo/Redo |
| `milestone:M43` | #E5E7EB | Social Proof Widget |
| `milestone:M44` | #E5E7EB | User Feedback Widget |
| `milestone:M45` | #E5E7EB | Tool Recommendation |
| `phase:3A` | #DC2626 | Critical UX |
| `phase:3B` | #7C3AED | UX Enhancement |
| `phase:3C` | #0891B2 | Performance |
| `phase:3D` | #059669 | Interaction |
| `phase:3E` | #F59E0B | Growth Foundation |

### Labels Existing (dari Fase 1 & 0.2)

| Label | Warna | Kegunaan |
|-------|-------|----------|
| `layer:infra` | #7C3AED | Setup environment, cloud services, konfigurasi |
| `layer:frontend` | #16A34A | UI components, halaman, client-side logic |
| `layer:backend` | #1D4ED8 | API endpoints, server-side processing |
| `layer:testing` | #A16207 | Unit test, integration test, E2E test |
| `layer:deploy` | #BE123C | Deployment, CI/CD, monitoring |
| `layer:seo-content` | #B45309 | Copy, meta tags, sitemap, SEO |
| `layer:design` | #EC4899 | UI/UX design, visual polish |

---

## Detail Backlog Per Milestone

---
### M23: i18n (English Support) — 8 tasks | 12 jam | Minggu 1–2

**Deskripsi:** Implementasi internasionalisasi menggunakan next-intl. Bahasa Indonesia tetap default, English sebagai bahasa kedua. Semua UI text dipindahkan ke translation files. Route prefix /en/ untuk English.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-225 | **Config** | **Setup next-intl + konfigurasi routing** | Install `next-intl`. Buat `i18n.ts` config: defaultLocale "id", locales ["id", "en"]. Setup middleware untuk locale detection (Accept-Language header). Konfigurasi routing: /id/ (default, tanpa prefix) dan /en/ (explicit prefix). Update `next.config.ts`. | **2h** |
| PAPYR-226 | **Frontend** | **Buat translation files Bahasa Indonesia** | Buat `messages/id.json` dengan semua UI text existing: navbar, footer, landing page, semua 13 tool pages (labels, buttons, descriptions, error messages, success messages). Estimasi ~300 translation keys. Struktur nested: `common`, `nav`, `footer`, `tools.compress`, `tools.merge`, dst. | **3h** |
| PAPYR-227 | **Frontend** | **Buat translation files English** | Buat `messages/en.json` — terjemahkan semua ~300 keys ke English. Pastikan tone konsisten: friendly, concise, action-oriented. Perhatikan konteks Indonesia (misal "Proteksi PDF" menjadi "Protect PDF"). | **2h** |
| PAPYR-228 | **Frontend** | **Migrate semua hardcoded text ke useTranslations** | Replace semua hardcoded string di components dan pages dengan `t(key)` dari `useTranslations()`. Prioritas: Navbar, Footer, Landing Page, lalu tool pages satu per satu. Pastikan tidak ada hardcoded Indonesian text tersisa. | **2h** |
| PAPYR-229 | **Frontend** | **Buat Language Switcher component** | Dropdown/toggle di Navbar: "ID | EN". Simpan preferensi ke cookie (NEXT_LOCALE). Redirect ke locale route yang sesuai saat switch. Tampilkan flag emoji atau text label. Posisi: di Navbar sebelah kanan, sebelum hamburger menu di mobile. | **1h** |
| PAPYR-230 | **Frontend** | **Update SEO metadata per locale** | Setiap halaman punya metadata berbeda per bahasa: title, description, OG tags. Gunakan `generateMetadata()` dengan locale parameter. Tambahkan `hreflang` alternate links di head. Update sitemap.ts untuk include /en/ routes. | **1h** |
| PAPYR-231 | **Frontend** | **Update sitemap + robots untuk multi-locale** | Sitemap harus include semua routes x 2 locales (id + en). Total: ~32 URLs (16 routes x 2 bahasa). Tambahkan `xhtml:link rel="alternate"` per entry. Robots.txt tetap sama (allow all). | **0.5h** |
| PAPYR-232 | **Testing** | **Test i18n: locale switching + fallback** | Vitest: test translation loading, test fallback ke "id" jika locale tidak dikenal, test cookie persistence. E2E: test language switcher navigates correctly, test /en/ routes render English text. Minimal 6 test cases. | **0.5h** |

**Acceptance Criteria M23:**
- [ ] Semua UI text menggunakan translation keys (zero hardcoded strings)
- [ ] Language switcher berfungsi di Navbar (ID / EN)
- [ ] Route /en/compress, /en/merge, dst. render English UI
- [ ] Default route (tanpa prefix) tetap Bahasa Indonesia
- [ ] SEO metadata berbeda per locale (title, description, hreflang)
- [ ] Sitemap include semua routes untuk kedua bahasa
- [ ] Cookie NEXT_LOCALE persist preferensi user
- [ ] 6+ tests passing

**Tech Decision M23:**
```
Library: next-intl (bukan next-i18next)
Alasan:
  - Native App Router support (next-i18next masih Pages Router focused)
  - Server Component compatible (useTranslations di server)
  - Middleware-based locale detection
  - Smaller bundle (tree-shakeable)
  - Active maintenance, good TypeScript support

Routing Strategy: Prefix-based
  - /compress         -> Bahasa Indonesia (default, no prefix)
  - /en/compress      -> English
  - Middleware detect Accept-Language untuk first visit
  - Cookie override untuk returning visitors
```

---

### M24: Error Boundary + Offline Handling — 7 tasks | 10 jam | Minggu 2–3

**Deskripsi:** Implementasi React Error Boundary untuk graceful error handling, offline detection dengan visual feedback, dan basic service worker untuk offline page.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-233 | **Frontend** | **Buat global Error Boundary component** | React Error Boundary yang wrap seluruh app. Catch unhandled errors, tampilkan friendly error page (bukan white screen). Include: error message non-technical, tombol "Muat Ulang", link ke beranda. Log error ke console + analytics event `error_boundary_triggered`. | **2h** |
| PAPYR-234 | **Frontend** | **Buat per-tool Error Boundary** | Error Boundary khusus per tool page. Jika satu tool crash, tool lain tetap berfungsi. Tampilkan: "Terjadi masalah pada alat ini", tombol retry (reset error state), suggest tool alternatif. Wrap setiap tool page component. | **1.5h** |
| PAPYR-235 | **Frontend** | **Implementasi offline detection hook** | Custom hook `useOnlineStatus()`: listen `navigator.onLine` + `online`/`offline` events. Return `{ isOnline, wasOffline }`. `wasOffline` flag untuk show "Koneksi kembali" toast setelah reconnect. Debounce status changes (avoid flicker). | **1h** |
| PAPYR-236 | **Frontend** | **Buat Offline Banner component** | Banner fixed di top page saat offline: "Anda sedang offline. Beberapa fitur mungkin tidak tersedia." Warna kuning/warning. Dismiss button. Auto-hide saat kembali online dengan success toast "Koneksi kembali". Animasi slide-down/up. | **1.5h** |
| PAPYR-237 | **Frontend** | **Graceful degradation untuk server-side tools** | Saat offline: disable upload button untuk server-side tools (compress, protect, unlock, watermark-image, pdf-to-word, ocr, pdf-to-excel, pdf-to-image). Tampilkan tooltip "Butuh koneksi internet". Client-side tools (merge, split, rotate, sign, watermark-text) tetap berfungsi. | **1.5h** |
| PAPYR-238 | **Config** | **Setup basic service worker untuk offline page** | Buat `public/sw.js`: cache offline fallback page. Intercept navigation requests — jika network fail dan bukan cached, serve offline page. Precache: offline page HTML, CSS critical, logo. Register SW di layout. | **1.5h** |
| PAPYR-239 | **Frontend** | **Buat halaman /offline** | Static page: Papyr logo, "Anda sedang offline" heading, deskripsi singkat, list tools yang bisa dipakai offline (merge, split, rotate, sign), tombol "Coba Lagi" (reload page). Styled sesuai Papyr design system. | **1h** |

**Acceptance Criteria M24:**
- [ ] Unhandled error tidak menghasilkan white screen (Error Boundary catch)
- [ ] Per-tool error boundary isolasi crash ke satu tool saja
- [ ] Offline banner muncul saat koneksi terputus
- [ ] Server-side tools disabled saat offline dengan pesan jelas
- [ ] Client-side tools tetap berfungsi offline (merge, split, rotate, sign)
- [ ] Service worker serve offline page jika navigasi gagal
- [ ] Halaman /offline tersedia dengan informasi berguna

---

### M25: Progress Indicator — 6 tasks | 8 jam | Minggu 3–4

**Deskripsi:** Upgrade progress indicator untuk semua tools: upload progress bar dengan persentase, processing spinner dengan status text, file size display sebelum dan sesudah processing.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-240 | **Frontend** | **Buat UploadProgressBar component** | Progress bar component: animated fill, persentase text 0–100%, file name display, file size display (formatted: "2.4 MB"), estimated time remaining. Gunakan XMLHttpRequest `onprogress` atau fetch stream untuk real upload progress. Warna: accent color dari design system. | **2h** |
| PAPYR-241 | **Frontend** | **Buat ProcessingSpinner component** | Spinner dengan status text yang berubah: "Mengupload..." lalu "Memproses..." lalu "Hampir selesai..." lalu "Selesai!". Animasi: rotating circle + pulsing dots. Configurable: `status` prop untuk custom text. Tampilkan elapsed time setelah 5 detik processing. | **1.5h** |
| PAPYR-242 | **Frontend** | **Buat FileSizeDisplay component** | Tampilkan file size sebelum processing: "Ukuran asli: 4.2 MB". Setelah selesai: "Ukuran asli: 4.2 MB, Hasil: 1.8 MB (hemat 57%)". Format otomatis: bytes ke KB ke MB. Warna hijau jika ukuran berkurang, netral jika sama/bertambah. | **1h** |
| PAPYR-243 | **Frontend** | **Integrasi progress ke server-side tools** | Update semua server-side tool pages (compress, protect, unlock, watermark-image, pdf-to-image, pdf-to-word, ocr, pdf-to-excel): replace existing loading state dengan UploadProgressBar + ProcessingSpinner. Gunakan `onUploadProgress` dari axios/fetch. | **2h** |
| PAPYR-244 | **Frontend** | **Integrasi progress ke client-side tools** | Update client-side tools (merge, split, rotate, sign, watermark-text): tampilkan ProcessingSpinner saat pdf-lib sedang bekerja. Untuk merge banyak file: progress per file ("Menggabungkan file 3 dari 7..."). | **1h** |
| PAPYR-245 | **Testing** | **Test progress components** | Vitest: test UploadProgressBar renders correctly di berbagai persentase, test FileSizeDisplay formatting (bytes, KB, MB), test ProcessingSpinner status transitions. Minimal 5 test cases. | **0.5h** |

**Acceptance Criteria M25:**
- [ ] Upload progress bar menampilkan persentase real (bukan fake progress)
- [ ] Processing spinner menampilkan status text yang informatif
- [ ] File size ditampilkan sebelum dan sesudah processing
- [ ] Persentase penghematan ditampilkan untuk compress tool
- [ ] Semua 13 tools menggunakan progress components yang konsisten
- [ ] Elapsed time ditampilkan jika processing > 5 detik
- [ ] 5+ tests passing

---

### M26: Rate Limit Feedback — 7 tasks | 10 jam | Minggu 4–5

**Deskripsi:** Handle HTTP 429 response dengan UX yang baik: countdown timer sampai bisa request lagi, queue indicator jika multiple files, dan informasi jelas kenapa request ditolak.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-246 | **Backend** | **Tambah Retry-After header di 429 response** | Update rate limiter middleware: saat return 429, include header `Retry-After: <seconds>` dan body JSON dengan error message, retry_after seconds, limit, dan window info. Hitung sisa waktu dari window saat ini. | **1.5h** |
| PAPYR-247 | **Frontend** | **Buat RateLimitBanner component** | Banner yang muncul saat 429 diterima: "Terlalu banyak permintaan. Coba lagi dalam X detik." Countdown timer real-time (detik mundur). Auto-hide saat countdown selesai. Warna orange/warning. Posisi: di atas upload area tool yang bersangkutan. | **2h** |
| PAPYR-248 | **Frontend** | **Implementasi countdown timer hook** | Custom hook `useCountdown(seconds)`: return `{ remaining, isActive, reset }`. Countdown dari `Retry-After` value. Saat countdown aktif, disable semua upload/process buttons. Auto-enable saat countdown = 0. | **1h** |
| PAPYR-249 | **Frontend** | **Buat QueueIndicator component** | Untuk tools yang support multiple files (merge, image-to-pdf): jika rate limited, tampilkan queue status "File 3 dari 7 — menunggu rate limit". Auto-resume processing setelah countdown selesai. Sequential processing dengan delay antar request. | **2h** |
| PAPYR-250 | **Frontend** | **Global 429 interceptor** | Buat axios/fetch interceptor yang catch semua 429 responses. Parse `Retry-After` header. Emit event ke global state. Semua tool pages subscribe ke rate limit state. Prevent duplicate requests saat rate limited. | **1.5h** |
| PAPYR-251 | **Frontend** | **Informational tooltip tentang rate limit** | Tambahkan info icon di dekat upload button: tooltip "Papyr membatasi 10 permintaan per menit untuk menjaga kualitas layanan." Tampilkan sisa kuota jika memungkinkan (dari response header custom). | **1h** |
| PAPYR-252 | **Testing** | **Test rate limit UX** | Vitest: test countdown hook (decrement, auto-stop at 0), test RateLimitBanner visibility logic, test button disabled state. E2E: trigger rate limit, verify banner appears, verify countdown, verify auto-enable. Minimal 5 test cases. | **1h** |

**Acceptance Criteria M26:**
- [ ] 429 response menampilkan countdown timer (bukan generic error)
- [ ] Countdown timer akurat (dari Retry-After header)
- [ ] Upload/process buttons disabled selama rate limited
- [ ] Auto-enable setelah countdown selesai
- [ ] Queue indicator untuk multi-file tools
- [ ] Global interceptor catch semua 429 (tidak per-tool)
- [ ] Informational tooltip menjelaskan rate limit policy
- [ ] 5+ tests passing

---

### M27: Dark Mode — 8 tasks | 12 jam | Minggu 5–6

**Deskripsi:** Implementasi dark mode dengan system preference detection, manual toggle, CSS custom properties, dan localStorage persistence. Tailwind `dark:` variant untuk styling.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-253 | **Design** | **Definisikan dark mode color palette** | Buat dark mode color tokens: `--color-navy-dark`, `--color-bg-dark`, `--color-text-dark`, `--color-surface-dark`, `--color-border-dark`. Pastikan contrast ratio WCAG AA (4.5:1 untuk text). Mapping: light token ke dark token. Dokumentasikan di design system. | **1.5h** |
| PAPYR-254 | **Frontend** | **Setup Tailwind dark mode (class strategy)** | Konfigurasi Tailwind: `darkMode: class`. Tambahkan `dark` class ke `<html>` element berdasarkan preferensi. Buat utility function `applyTheme(theme)`. Update CSS custom properties saat theme berubah. | **1.5h** |
| PAPYR-255 | **Frontend** | **Update CSS custom properties untuk dark mode** | Update `globals.css`: definisikan semua color variables dalam `:root` (light) dan `.dark` (dark). Migrasi dari hardcoded colors ke CSS variables di semua components. Variables: background, text, surface, border, accent, error, success. | **2h** |
| PAPYR-256 | **Frontend** | **Buat DarkModeToggle component** | Toggle button di Navbar: icon sun/moon. 3 states: Light, Dark, System. Cycle melalui ketiga state. Tampilkan current state icon. Posisi: di Navbar, sebelah Language Switcher. Animasi smooth transition saat switch. | **1.5h** |
| PAPYR-257 | **Frontend** | **Implementasi system preference detection** | Detect `prefers-color-scheme` media query. Jika user pilih "System": follow OS preference. Listen `change` event pada media query (real-time switch jika OS berubah). Default first visit: System (ikut OS). | **1h** |
| PAPYR-258 | **Frontend** | **localStorage persistence untuk theme** | Simpan preferensi ke `localStorage.setItem(papyr-theme, value)`. Load saat app init (sebelum render untuk avoid flash). Script di `<head>` untuk apply theme sebelum hydration (prevent FOUC). | **1h** |
| PAPYR-259 | **Frontend** | **Update semua components untuk dark mode** | Audit semua components: tambahkan `dark:` variants di Tailwind classes. Prioritas: Navbar, Footer, Landing Page cards, Tool pages (upload zone, buttons, results area), Admin dashboard. Pastikan semua text readable di dark background. | **2h** |
| PAPYR-260 | **Testing** | **Test dark mode** | Vitest: test theme toggle logic, test localStorage persistence, test system preference detection. E2E: test toggle switches theme, test page reload maintains preference. Visual regression: screenshot light vs dark. Minimal 5 test cases. | **0.5h** |

**Acceptance Criteria M27:**
- [ ] Dark mode toggle berfungsi di Navbar (Light/Dark/System)
- [ ] System preference detection mengikuti OS setting
- [ ] localStorage persist preferensi (survive page reload)
- [ ] Tidak ada FOUC (Flash of Unstyled Content) saat load
- [ ] Semua components readable di dark mode (contrast ratio AA)
- [ ] Smooth transition animation saat switch theme
- [ ] Admin dashboard juga support dark mode
- [ ] 5+ tests passing

**Tech Decision M27:**
```
Strategy: Tailwind dark: class + CSS custom properties
Alasan:
  - Tailwind dark: variant = familiar, well-documented
  - CSS custom properties = single source of truth untuk colors
  - Class strategy (bukan media) = user bisa override OS preference
  - Script di <head> = prevent FOUC tanpa layout shift

Color Mapping:
  Light                    Dark
  --color-navy (#1E3A5F)   --color-navy-dark (#E2E8F0)
  --color-bg (#FFFFFF)     --color-bg-dark (#0F172A)
  --color-text (#1E293B)   --color-text-dark (#F1F5F9)
  --color-surface (#F8FAFC) --color-surface-dark (#1E293B)
  --color-border (#E2E8F0) --color-border-dark (#334155)
  --color-accent (#3B82F6) --color-accent-dark (#60A5FA)
```

---

### M28: Accessibility (a11y) — 9 tasks | 14 jam | Minggu 6–8

**Deskripsi:** Implementasi WCAG 2.1 AA compliance: ARIA labels, keyboard navigation, screen reader support, focus management, skip links, dan color contrast audit.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-261 | **Frontend** | **Audit aksesibilitas existing** | Jalankan axe-core audit pada semua pages. Dokumentasikan semua violations: missing alt text, missing labels, contrast issues, missing landmarks. Prioritaskan fixes berdasarkan severity. | **1h** |
| PAPYR-262 | **Frontend** | **Tambahkan ARIA labels ke semua interactive elements** | Audit semua buttons, inputs, links, dropdowns: tambahkan `aria-label`, `aria-labelledby`, atau `aria-describedby` yang sesuai. Upload zone: `role="button"` dengan aria-label. Progress bar: `role="progressbar"` dengan aria-valuenow. | **2h** |
| PAPYR-263 | **Frontend** | **Implementasi keyboard navigation** | Semua interactive elements harus reachable via Tab. Logical tab order (top-to-bottom, left-to-right). Custom components (dropdown, modal, drag-drop): tambahkan keyboard handlers. Enter/Space untuk activate, Escape untuk close/cancel. | **2h** |
| PAPYR-264 | **Frontend** | **Buat Skip Links component** | Hidden link di top page: "Skip to main content", "Skip to navigation". Visible on focus (Tab). Jump ke `#main-content` dan `#navigation` landmarks. Styled: appear di top-left saat focused, disappear saat blur. | **1h** |
| PAPYR-265 | **Frontend** | **Focus management untuk dynamic content** | Saat content berubah (upload selesai, error muncul, download ready): move focus ke relevant element. Gunakan `useRef` + `focus()`. Announce changes via `aria-live="polite"` region. Prevent focus trap di modals (focus cycle within modal). | **2h** |
| PAPYR-266 | **Frontend** | **Screen reader announcements** | Buat `aria-live` region untuk dynamic updates: "File berhasil diupload", "Proses selesai, klik download", "Error: file terlalu besar". Gunakan `role="status"` untuk non-critical updates, `role="alert"` untuk errors. | **1.5h** |
| PAPYR-267 | **Frontend** | **Color contrast fix** | Audit semua text/background combinations. Fix violations: minimum 4.5:1 untuk normal text, 3:1 untuk large text. Update colors di light dan dark mode. Perhatikan: disabled states, placeholder text, subtle borders. | **1.5h** |
| PAPYR-268 | **Frontend** | **Semantic HTML audit + landmarks** | Pastikan: `<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>` digunakan correctly. Headings hierarchy (h1, h2, h3 tanpa skip). Lists untuk navigasi. `<button>` untuk actions, `<a>` untuk navigation. | **1.5h** |
| PAPYR-269 | **Testing** | **Accessibility testing (axe-core + manual)** | Setup axe-core di Playwright E2E tests: `@axe-core/playwright`. Run pada semua 13 tool pages + landing + admin. Target: zero critical/serious violations. Manual test: navigate entire app dengan keyboard only. Minimal 8 test cases. | **1.5h** |

**Acceptance Criteria M28:**
- [ ] Zero critical/serious axe-core violations pada semua pages
- [ ] Semua interactive elements reachable via keyboard (Tab)
- [ ] Skip links berfungsi (visible on focus, jump to content)
- [ ] Screen reader announces dynamic content changes
- [ ] Focus management correct setelah state changes
- [ ] Color contrast minimum 4.5:1 (WCAG AA) di light dan dark mode
- [ ] Semantic HTML landmarks digunakan correctly
- [ ] axe-core integrated di E2E test suite
- [ ] 8+ tests passing

---

### M29: PDF Preview — 7 tasks | 10 jam | Minggu 8–9

**Deskripsi:** Integrasi pdf.js untuk render preview halaman PDF di browser sebelum processing. Thumbnail generation untuk multi-page PDFs.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-270 | **Frontend** | **Setup pdf.js (pdfjs-dist)** | Install `pdfjs-dist`. Konfigurasi worker: copy `pdf.worker.min.mjs` ke public folder atau gunakan CDN worker. Setup TypeScript types. Buat wrapper utility `lib/pdfPreview.ts` untuk load dan render PDF. | **1.5h** |
| PAPYR-271 | **Frontend** | **Buat PDFPreview component** | Component: render halaman pertama PDF ke canvas setelah upload. Props: `file: File`, `page?: number`, `width?: number`. Auto-scale ke container width. Loading skeleton saat rendering. Error state jika PDF corrupt/encrypted. | **2h** |
| PAPYR-272 | **Frontend** | **Buat PDFThumbnails component** | Grid thumbnails untuk multi-page PDF: render semua halaman sebagai small previews (150px width). Lazy render (hanya visible thumbnails). Page number label di bawah tiap thumbnail. Click thumbnail untuk zoom/select page. Scroll container jika banyak halaman. | **2h** |
| PAPYR-273 | **Frontend** | **Integrasi preview ke tool pages** | Tambahkan PDFPreview ke semua tool pages yang terima PDF: setelah upload, tampilkan preview halaman pertama. Untuk split/rotate: tampilkan PDFThumbnails agar user bisa lihat semua halaman. Conditional render (hanya jika file valid). | **2h** |
| PAPYR-274 | **Frontend** | **PDF metadata display** | Setelah upload, tampilkan metadata: jumlah halaman, ukuran file, dimensi halaman (A4/Letter/Custom), apakah encrypted, title (jika ada). Gunakan pdf.js `getMetadata()` dan `numPages`. Tampilkan di info card di bawah preview. | **1h** |
| PAPYR-275 | **Frontend** | **Optimasi performa preview** | Render preview di requestAnimationFrame. Cancel render jika user upload file baru (abort previous). Limit thumbnail generation: maks 20 halaman. Memory cleanup: revoke object URLs, destroy pdf.js document. | **1h** |
| PAPYR-276 | **Testing** | **Test PDF preview** | Vitest: test PDFPreview renders canvas, test metadata extraction, test error handling (corrupt PDF). E2E: upload PDF, verify preview visible, verify page count correct. Minimal 5 test cases. | **0.5h** |

**Acceptance Criteria M29:**
- [ ] PDF preview render halaman pertama setelah upload
- [ ] Thumbnails tersedia untuk multi-page PDFs (split, rotate)
- [ ] Metadata ditampilkan: page count, file size, dimensions
- [ ] Preview responsive (scale ke container width)
- [ ] Memory cleanup proper (no memory leaks)
- [ ] Encrypted PDF handled gracefully (show lock icon, no crash)
- [ ] 5+ tests passing

**Tech Decision M29:**
```
Library: pdfjs-dist (Mozilla pdf.js)
Alasan:
  - Industry standard untuk PDF rendering di browser
  - Mature, well-maintained (Mozilla backing)
  - Worker-based (tidak block main thread)
  - TypeScript support
  - Render ke canvas (high quality)

Decision: Gunakan pdfjs-dist langsung (tanpa react-pdf wrapper)
  untuk kontrol penuh dan smaller bundle.
```

---

### M30: Onboarding Tour — 6 tasks | 7 jam | Minggu 9–10

**Deskripsi:** First-time user tooltip walkthrough yang menjelaskan fitur utama Papyr. localStorage flag "seen" untuk tidak tampilkan ulang. Skip option tersedia.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-277 | **Frontend** | **Buat OnboardingTour component** | Multi-step tooltip tour: highlight element, show tooltip dengan penjelasan, next/prev/skip buttons. Overlay backdrop (dim non-highlighted area). Steps configurable via array. Smooth scroll ke target element. Posisi tooltip auto-adjust. | **2h** |
| PAPYR-278 | **Frontend** | **Definisikan tour steps untuk landing page** | 4–5 steps: (1) "Pilih alat PDF yang kamu butuhkan" highlight tool grid, (2) "Upload file langsung dari browser" highlight upload area, (3) "Privasi terjaga, file dihapus otomatis" highlight privacy badge, (4) "Gratis tanpa batas" highlight pricing info, (5) "Ganti bahasa di sini" highlight language switcher. | **1h** |
| PAPYR-279 | **Frontend** | **Definisikan tour steps untuk tool page** | 3–4 steps (trigger saat pertama kali buka tool page): (1) "Upload PDF di sini" highlight upload zone, (2) "Atur pengaturan sesuai kebutuhan" highlight config area, (3) "Klik untuk memproses" highlight process button, (4) "Download hasil di sini" highlight download area. | **1h** |
| PAPYR-280 | **Frontend** | **localStorage persistence + seen flag** | Simpan flag setelah tour selesai atau di-skip. Check flag saat app load — jika sudah seen, jangan tampilkan. Separate flags per tour: `onboarding-landing-seen`, `onboarding-tool-seen`. | **0.5h** |
| PAPYR-281 | **Frontend** | **Skip + "Jangan tampilkan lagi" option** | Tombol "Lewati" di setiap step. Checkbox "Jangan tampilkan lagi" di step terakhir (default checked). Jika user close tanpa finish: tampilkan lagi next visit (kecuali checkbox checked). Help menu item "Lihat Tour Lagi" untuk reset flag. | **1.5h** |
| PAPYR-282 | **Testing** | **Test onboarding tour** | Vitest: test tour step navigation (next/prev/skip), test localStorage flag set correctly, test tour tidak muncul jika flag exists. E2E: fresh visit, tour appears, complete, reload, tour tidak muncul. Minimal 4 test cases. | **1h** |

**Acceptance Criteria M30:**
- [ ] Tour muncul otomatis untuk first-time visitors
- [ ] Tour tidak muncul jika sudah pernah dilihat (localStorage flag)
- [ ] Skip option tersedia di setiap step
- [ ] Tour highlight correct elements dengan backdrop overlay
- [ ] "Lihat Tour Lagi" option tersedia di help menu
- [ ] Tour responsive (berfungsi di mobile)
- [ ] 4+ tests passing

---

### M31: Compression Comparison — 6 tasks | 7 jam | Minggu 10–11

**Deskripsi:** Setelah compress selesai, tampilkan perbandingan visual: before/after file size, persentase penghematan, dan visual bar chart. Meningkatkan perceived value.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-283 | **Frontend** | **Buat CompressionResult component** | Card component setelah compress selesai: tampilkan original size, compressed size, savings percentage, visual comparison bar. Animasi: numbers count up, bar fills. Warna hijau jika savings > 30%, kuning jika 10–30%, merah jika < 10%. | **2h** |
| PAPYR-284 | **Frontend** | **Visual comparison bar** | Horizontal bar chart: bar atas (original, full width, abu-abu), bar bawah (compressed, proportional width, hijau). Label di samping: "4.2 MB" dan "1.8 MB". Animasi: bar bawah shrink dari full ke actual size. Responsive width. | **1.5h** |
| PAPYR-285 | **Frontend** | **Savings badge + celebration** | Badge besar: "Hemat 57%!" dengan icon checkmark. Jika savings > 50%: confetti animation (subtle, 2 detik). Jika savings < 10%: tampilkan note "File ini sudah cukup kecil. Coba quality setting lebih rendah." | **1h** |
| PAPYR-286 | **Frontend** | **Integrasi ke halaman /compress** | Replace existing download-only result dengan CompressionResult component. Data dari API response: `original_size`, `output_size`. Hitung savings di frontend. Tetap tampilkan download button di bawah comparison. | **1h** |
| PAPYR-287 | **Backend** | **Pastikan API response include size data** | Verify endpoint /api/compress return `original_size` dan `output_size` dalam response. Jika belum ada, tambahkan. Hitung di backend sebelum upload ke R2. | **1h** |
| PAPYR-288 | **Testing** | **Test compression comparison** | Vitest: test CompressionResult renders correctly, test percentage calculation, test color logic (green/yellow/red), test edge cases (0% savings, file larger after compress). Minimal 4 test cases. | **0.5h** |

**Acceptance Criteria M31:**
- [ ] Before/after file size ditampilkan setelah compress
- [ ] Persentase penghematan dihitung dan ditampilkan
- [ ] Visual bar chart menunjukkan perbandingan ukuran
- [ ] Animasi smooth saat results muncul
- [ ] Color coding: hijau (>30%), kuning (10–30%), merah (<10%)
- [ ] Celebration animation untuk savings besar (>50%)
- [ ] 4+ tests passing

---
### M32: PWA Support — 8 tasks | 10 jam | Minggu 11–12

**Deskripsi:** Progressive Web App: manifest.json, enhanced service worker, install prompt, offline page, app icons. User bisa "install" Papyr ke home screen.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-289 | **Config** | **Buat manifest.json** | File `public/manifest.json`: name "Papyr", short_name "Papyr", description, start_url "/", display "standalone", theme_color (navy), background_color (white), icons (192x192, 512x512, maskable). Categories: productivity, utilities. | **1h** |
| PAPYR-290 | **Design** | **Buat app icons (PWA)** | Generate icon set: 192x192 (standard), 512x512 (splash), 180x180 (Apple touch), maskable icon (safe zone). Format: PNG. Design: Papyr logo on solid background. Simpan di `public/icons/`. | **1h** |
| PAPYR-291 | **Frontend** | **Enhanced service worker** | Upgrade SW dari M24: tambah caching strategies. Cache-first untuk static assets (JS, CSS, fonts, images). Network-first untuk API calls. Stale-while-revalidate untuk tool pages. Precache critical routes (landing, top 3 tools). Versioning untuk cache invalidation. | **2h** |
| PAPYR-292 | **Frontend** | **Install prompt (A2HS)** | Intercept `beforeinstallprompt` event. Tampilkan custom install banner: "Tambahkan Papyr ke Home Screen untuk akses cepat". Tombol "Install" dan "Nanti". Simpan dismissal ke localStorage (jangan tampilkan lagi selama 7 hari). Tampilkan hanya setelah user pakai 2+ tools. | **1.5h** |
| PAPYR-293 | **Frontend** | **Offline page enhancement** | Upgrade halaman /offline dari M24: tambahkan cached tool list (tools yang sudah pernah dibuka), recent activity dari localStorage, tombol retry dengan auto-retry setiap 30 detik. Styled sesuai PWA standalone mode. | **1h** |
| PAPYR-294 | **Frontend** | **Link manifest + meta tags PWA** | Tambahkan di head: link rel manifest, Apple meta tags (apple-mobile-web-app-capable, apple-mobile-web-app-status-bar-style), meta name theme-color. Conditional theme-color untuk dark mode. | **0.5h** |
| PAPYR-295 | **Frontend** | **SW registration + update flow** | Register SW di app entry. Handle SW update: tampilkan toast "Versi baru tersedia" dengan tombol "Update". skipWaiting + clients.claim untuk activate new SW. Graceful reload setelah update. | **1.5h** |
| PAPYR-296 | **Testing** | **Test PWA** | Lighthouse PWA audit: target semua checks pass. Manual test: install di Android Chrome, install di iOS Safari (Add to Home Screen). Verify: standalone mode, correct icons, offline page works. Minimal 4 test cases. | **1.5h** |

**Acceptance Criteria M32:**
- [ ] Lighthouse PWA audit pass (installable, offline-capable)
- [ ] manifest.json valid dengan semua required fields
- [ ] App icons tersedia di semua ukuran (192, 512, maskable)
- [ ] Install prompt muncul setelah user engagement
- [ ] Service worker cache static assets (cache-first)
- [ ] SW update flow smooth (toast + reload)
- [ ] Offline page berfungsi saat no network
- [ ] 4+ tests passing

**Tech Decision M32:**
```
Approach: Custom service worker (bukan next-pwa)
Alasan:
  - next-pwa kurang maintained (last update lama)
  - Custom SW = full control over caching strategies
  - Bisa fine-tune per route type
  - Avoid dependency yang mungkin break di Next.js update

Caching Strategy:
  - Static assets (JS/CSS/fonts): Cache-first, 30 day max-age
  - Tool pages HTML: Stale-while-revalidate
  - API calls: Network-first, fallback to error
  - Images: Cache-first, 7 day max-age
  - Offline fallback: Precached /offline page
```

---

### M33: Web Worker Processing — 6 tasks | 8 jam | Minggu 12–13

**Deskripsi:** Offload pdf-lib operations ke Web Worker agar UI tetap responsive saat processing file besar. Gunakan Comlink untuk ergonomic worker communication.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-297 | **Config** | **Setup Comlink + Web Worker config** | Install `comlink`. Konfigurasi Next.js webpack untuk handle `.worker.ts` files. Buat worker entry point `workers/pdfWorker.ts`. Verify worker loads correctly di dev dan production build. TypeScript types untuk worker API. | **1.5h** |
| PAPYR-298 | **Frontend** | **Migrate pdf-lib operations ke worker** | Pindahkan semua pdf-lib operations (merge, split, rotate, watermark-text) ke `pdfWorker.ts`. Expose via Comlink: `mergePDFs(files)`, `splitPDF(file, pages)`, `rotatePDF(file, rotations)`, `addTextWatermark(file, config)`. Return Uint8Array result. | **2h** |
| PAPYR-299 | **Frontend** | **Buat usePDFWorker hook** | Custom hook: lazy-initialize worker on first use, expose worker methods, handle worker errors, cleanup on unmount (terminate worker). Return `{ mergePDFs, splitPDF, rotatePDF, addWatermark, isProcessing, error }`. Singleton worker instance. | **1.5h** |
| PAPYR-300 | **Frontend** | **Update tool pages untuk gunakan worker** | Update merge, split, rotate, watermark-text pages: replace direct pdf-lib calls dengan `usePDFWorker()` hook calls. Verify UI tetap responsive saat processing (no jank). Progress callback dari worker jika possible. | **1.5h** |
| PAPYR-301 | **Frontend** | **Fallback untuk browser tanpa Worker support** | Check `typeof Worker !== undefined`. Jika tidak support: fallback ke main thread processing (existing behavior). Tampilkan warning: "Browser Anda tidak mendukung Web Worker, processing mungkin lambat untuk file besar." | **0.5h** |
| PAPYR-302 | **Testing** | **Test Web Worker processing** | Vitest: test worker initialization, test merge/split/rotate via worker, test fallback behavior. Performance test: compare main thread vs worker untuk file 10MB (UI responsiveness). Minimal 5 test cases. | **1h** |

**Acceptance Criteria M33:**
- [ ] pdf-lib operations berjalan di Web Worker (bukan main thread)
- [ ] UI tetap responsive saat processing file besar (no jank)
- [ ] Comlink provides type-safe worker communication
- [ ] Fallback ke main thread jika Worker tidak tersedia
- [ ] Worker singleton (tidak spawn multiple workers)
- [ ] Memory cleanup proper (terminate worker on unmount)
- [ ] 5+ tests passing

**Tech Decision M33:**
```
Library: Comlink (Google)
Alasan:
  - Ergonomic API (worker functions terasa seperti async functions biasa)
  - Type-safe (TypeScript support excellent)
  - Tiny bundle (~1KB gzipped)
  - Handles serialization/deserialization otomatis
  - Proxy-based (no manual postMessage)

Worker Architecture:
  - Single worker instance (singleton)
  - Shared across all client-side tools
  - Lazy initialization (hanya load saat pertama kali dibutuhkan)
  - Transferable objects untuk large ArrayBuffers (zero-copy)
```

---

### M34: Lazy Loading Tools — 5 tasks | 5 jam | Minggu 13–14

**Deskripsi:** Dynamic import per tool page untuk reduce initial bundle size. Loading skeleton saat tool page loading. Code splitting per route.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-303 | **Frontend** | **Audit current bundle size** | Run `next build` dengan `ANALYZE=true`. Identifikasi: total bundle size, per-page bundle, shared chunks, largest dependencies. Dokumentasikan baseline metrics. Target: reduce initial load by 30%+. | **0.5h** |
| PAPYR-304 | **Frontend** | **Implement dynamic imports per tool** | Gunakan `next/dynamic` untuk lazy load heavy tool components: SignaturePad, PDFPageViewer, WatermarkConfig, TablePreview, PDFThumbnails. Hanya load saat user navigate ke tool page tersebut. `ssr: false` untuk client-only components. | **1.5h** |
| PAPYR-305 | **Frontend** | **Buat LoadingSkeleton component** | Skeleton UI yang muncul saat tool page loading: shimmer animation, layout matching actual tool page (upload zone placeholder, config area placeholder, button placeholder). Per-tool skeleton variant. | **1.5h** |
| PAPYR-306 | **Frontend** | **Lazy load pdf.js dan pdf-lib** | Dynamic import `pdfjs-dist` hanya saat user upload PDF (bukan saat page load). Dynamic import `pdf-lib` hanya saat user click process. Reduce initial JS parse time. Show loading indicator saat library loading. | **1h** |
| PAPYR-307 | **Testing** | **Verify bundle size reduction** | Run `next build` setelah optimization. Compare: initial bundle size before vs after. Target: main bundle < 150KB gzipped. Verify: semua tools masih berfungsi setelah lazy loading. Lighthouse Performance score check. Minimal 3 test cases. | **0.5h** |

**Acceptance Criteria M34:**
- [ ] Initial bundle size berkurang 30%+ dari baseline
- [ ] Tool pages lazy-loaded (hanya download JS saat navigate)
- [ ] Loading skeleton muncul saat tool page loading
- [ ] pdf.js dan pdf-lib di-load on-demand (bukan upfront)
- [ ] Semua tools tetap berfungsi setelah lazy loading
- [ ] Lighthouse Performance score tetap >90
- [ ] 3+ tests passing

---

### M35: Image Optimization — 5 tasks | 5 jam | Minggu 14

**Deskripsi:** Gunakan next/image untuk semua assets, auto-convert ke WebP/AVIF, blur placeholder untuk perceived performance.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-308 | **Frontend** | **Migrate semua img ke next/image** | Audit semua `<img>` tags di codebase. Replace dengan `<Image>` dari `next/image`. Set `width`, `height`, `alt` untuk setiap image. Gunakan `fill` prop untuk responsive images. Priority loading untuk above-the-fold images. | **1.5h** |
| PAPYR-309 | **Frontend** | **Konfigurasi image optimization** | Update `next.config.ts`: images.formats dengan avif dan webp. Set `deviceSizes` dan `imageSizes` sesuai breakpoints Papyr. Enable `remotePatterns` jika ada external images. Verify: images served as WebP/AVIF di production. | **0.5h** |
| PAPYR-310 | **Frontend** | **Blur placeholder untuk semua images** | Generate blur data URL untuk static images (logo, icons, OG images). Gunakan `placeholder="blur"` + `blurDataURL`. Untuk dynamic images: gunakan tiny placeholder (10x10 scaled up). Perceived loading jadi lebih smooth. | **1h** |
| PAPYR-311 | **Frontend** | **Optimize OG images dan icons** | Compress semua images di `public/`: OG images (target < 100KB each), tool icons, PWA icons. Convert ke WebP where possible. Remove unused images. Verify: total public/ folder < 2MB. | **1h** |
| PAPYR-312 | **Testing** | **Verify image optimization** | Lighthouse audit: check "Serve images in next-gen formats" pass. Verify: no `<img>` tags remaining (semua pakai next/image). Check: all images have alt text. Network tab: verify WebP/AVIF served. Minimal 3 test cases. | **1h** |

**Acceptance Criteria M35:**
- [ ] Semua images menggunakan next/image component
- [ ] Images auto-served sebagai WebP/AVIF
- [ ] Blur placeholder untuk above-the-fold images
- [ ] Total public/ folder < 2MB
- [ ] Lighthouse "Serve images in next-gen formats" pass
- [ ] Semua images punya alt text
- [ ] 3+ tests passing

---

### M36: Prefetch on Hover — 5 tasks | 4 jam | Minggu 14–15

**Deskripsi:** Next.js Link prefetch on hover untuk tool pages, preload critical resources. Reduce perceived navigation time.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-313 | **Frontend** | **Audit existing Link prefetch behavior** | Check current Next.js Link behavior: default prefetch (viewport-based). Identify: which links benefit from hover prefetch, which are already fast enough. Document current navigation times. | **0.5h** |
| PAPYR-314 | **Frontend** | **Implement hover prefetch untuk tool cards** | Landing page tool cards: `onMouseEnter` trigger `router.prefetch`. Debounce 100ms (avoid prefetch on quick mouse pass). Hanya prefetch jika user hovers > 100ms. Limit: maks 3 concurrent prefetches. | **1h** |
| PAPYR-315 | **Frontend** | **Preload critical resources** | Tambahkan `<link rel="preload">` untuk: DM Sans font (woff2), critical CSS, hero image. Preconnect ke API domain. Preconnect ke R2 domain untuk download. | **1h** |
| PAPYR-316 | **Frontend** | **Prefetch adjacent tools** | Saat user di tool page (misal /compress): prefetch "related tools" pages yang muncul di OtherTools component. Lazy prefetch setelah current page fully loaded (requestIdleCallback). Limit: maks 2 adjacent prefetches. | **1h** |
| PAPYR-317 | **Testing** | **Verify prefetch behavior** | DevTools Network tab: verify prefetch requests fire on hover. Measure: navigation time before vs after prefetch. Verify: no excessive prefetching (bandwidth waste). Lighthouse check: no negative impact on initial load. Minimal 3 test cases. | **0.5h** |

**Acceptance Criteria M36:**
- [ ] Tool cards prefetch on hover (debounced 100ms)
- [ ] Critical resources preloaded (font, CSS)
- [ ] Preconnect ke API dan R2 domains
- [ ] Adjacent tools prefetched setelah page load
- [ ] No excessive prefetching (max 3 concurrent)
- [ ] Navigation time berkurang (perceived instant)
- [ ] 3+ tests passing

---

### M37: Edge Caching — 5 tasks | 3 jam | Minggu 15

**Deskripsi:** Cloudflare CDN caching untuk static assets, proper cache headers, stale-while-revalidate strategy.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-318 | **Config** | **Konfigurasi cache headers di Next.js** | Update `next.config.ts`: set `headers()` untuk static assets. `/_next/static/*`: `Cache-Control: public, max-age=31536000, immutable`. Font files: `max-age=31536000`. HTML pages: `s-maxage=3600, stale-while-revalidate=86400`. | **0.5h** |
| PAPYR-319 | **Config** | **Konfigurasi Vercel edge caching** | Verify Vercel CDN settings: ISR revalidation untuk static pages, edge caching untuk API routes yang cacheable (sitemap, robots). Set `revalidate` di page configs. Verify: `x-vercel-cache: HIT` di response headers. | **0.5h** |
| PAPYR-320 | **Config** | **Cloudflare CDN untuk R2 assets** | Konfigurasi Cloudflare: cache R2 signed URLs (short TTL karena expire). Page Rules atau Cache Rules untuk static assets. Browser TTL: 1 year untuk immutable assets. Verify: CF-Cache-Status header. | **1h** |
| PAPYR-321 | **Frontend** | **Implement stale-while-revalidate untuk API** | Untuk non-sensitive API calls (health check, tool metadata): gunakan SWR pattern. Cache-Control: public, s-maxage=60, stale-while-revalidate=300. User dapat response cepat dari cache, background revalidate. | **0.5h** |
| PAPYR-322 | **Testing** | **Verify caching behavior** | Check response headers: verify Cache-Control correct per resource type. Test: first visit vs second visit TTFB. Verify: Vercel CDN HIT ratio. Verify: no caching pada sensitive endpoints (upload, process). Minimal 3 test cases. | **0.5h** |

**Acceptance Criteria M37:**
- [ ] Static assets cached dengan immutable header (1 year)
- [ ] HTML pages gunakan stale-while-revalidate
- [ ] Vercel CDN HIT ratio > 80% untuk static assets
- [ ] R2 assets cached via Cloudflare
- [ ] Sensitive endpoints (upload/process) TIDAK di-cache
- [ ] TTFB berkurang untuk returning visitors
- [ ] 3+ tests passing

---

### M38: Drag & Drop Global — 7 tasks | 8 jam | Minggu 15–16

**Deskripsi:** Drag-and-drop file ke semua tool pages (bukan hanya merge). Visual drop zone yang muncul saat file di-drag ke browser window.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-323 | **Frontend** | **Buat GlobalDropZone component** | Full-page drop zone yang muncul saat user drag file ke browser window. Overlay: semi-transparent backdrop + dashed border + icon + text "Lepaskan file di sini". Listen dragenter/dragleave/dragover/drop pada document. Z-index tinggi (di atas semua content). | **2h** |
| PAPYR-324 | **Frontend** | **File type validation pada drop** | Saat file di-drop: validasi tipe file sesuai tool yang aktif. Compress/merge/split/rotate/protect/unlock: hanya PDF. Image-to-PDF: hanya JPG/PNG. Watermark image mode: PDF + image. Tampilkan error jika tipe salah. | **1h** |
| PAPYR-325 | **Frontend** | **Integrasi drop ke semua tool pages** | Setiap tool page: wrap dengan GlobalDropZone. Saat file di-drop: auto-populate upload state (sama seperti click upload). Trigger same flow: file validation, preview, ready to process. Support single file dan multiple files (merge, image-to-pdf). | **1.5h** |
| PAPYR-326 | **Frontend** | **Visual feedback saat drag** | Saat drag masuk browser: highlight drop zone (border glow, background color change). Saat drag di atas valid area: green highlight. Saat drag di atas invalid area: red highlight + X icon. Smooth transitions. | **1h** |
| PAPYR-327 | **Frontend** | **Landing page drop: auto-detect tool** | Jika user drop file di landing page (bukan tool page): detect file type dan suggest tool. PDF: "Mau apa dengan PDF ini?" + quick action buttons (Compress, Merge, Split, dll). Image: redirect ke /image-to-pdf. Multiple PDFs: redirect ke /merge. | **1h** |
| PAPYR-328 | **Frontend** | **Mobile touch fallback** | Pada mobile: drag-drop tidak tersedia (no native file drag). Pastikan upload button tetap prominent. Jangan tampilkan "drag file here" text di mobile. Detect touch device via media query atau pointer check. | **0.5h** |
| PAPYR-329 | **Testing** | **Test drag & drop** | E2E: test drag PDF ke tool page, test drag invalid file (show error), test landing page auto-detect. Vitest: test file type validation logic, test GlobalDropZone visibility states. Minimal 5 test cases. | **1h** |

**Acceptance Criteria M38:**
- [ ] Drag-drop berfungsi di semua 13 tool pages
- [ ] Visual drop zone muncul saat file di-drag ke window
- [ ] File type validation sesuai tool yang aktif
- [ ] Landing page auto-detect file type dan suggest tool
- [ ] Green/red visual feedback untuk valid/invalid drop
- [ ] Mobile: upload button prominent, no drag-drop text
- [ ] 5+ tests passing

**Tech Decision M38:**
```
Approach: Extend existing react-dropzone pattern (bukan @dnd-kit)
Alasan:
  - @dnd-kit sudah dipakai untuk REORDER items (merge page)
  - File DROP berbeda dari item REORDER
  - react-dropzone atau native HTML5 Drag API lebih cocok untuk file drop
  - GlobalDropZone = document-level listener, bukan per-component
  - Avoid mixing @dnd-kit contexts (reorder vs file drop)
```

---

### M39: Keyboard Shortcuts — 7 tasks | 7 jam | Minggu 16–17

**Deskripsi:** Keyboard shortcuts untuk common actions: Ctrl+U upload, Ctrl+Enter process, Escape cancel, ? help overlay.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-330 | **Frontend** | **Buat useKeyboardShortcuts hook** | Custom hook yang register global keyboard listeners. Support: single key (?), modifier combos (Ctrl+U, Ctrl+Enter). Prevent conflicts dengan browser defaults. Disable saat input/textarea focused. Configurable per-page shortcuts. | **1.5h** |
| PAPYR-331 | **Frontend** | **Implementasi global shortcuts** | Register shortcuts: Ctrl+U (trigger upload/file picker), Ctrl+Enter (trigger process/submit), Escape (cancel current operation, close modal), ? (toggle help overlay). Semua shortcuts aktif di tool pages. | **1h** |
| PAPYR-332 | **Frontend** | **Buat KeyboardShortcutsHelp overlay** | Modal/overlay yang muncul saat user tekan "?": list semua available shortcuts dengan deskripsi. Grouped by category: Navigation, Actions, General. Styled sesuai design system. Close dengan Escape atau click outside. | **1.5h** |
| PAPYR-333 | **Frontend** | **Tool-specific shortcuts** | Per-tool shortcuts: Merge page: Ctrl+Shift+A (add more files). Split page: Ctrl+A (select all pages). Rotate page: R (rotate selected 90 degrees). Compress: Q (cycle quality). Register hanya saat di tool page tersebut. | **1h** |
| PAPYR-334 | **Frontend** | **Visual hint untuk shortcuts** | Tampilkan keyboard shortcut hint di tooltip buttons: "Proses (Ctrl+Enter)", "Upload (Ctrl+U)". Subtle text di bawah button atau sebagai title attribute. Hanya tampilkan di desktop (hide di mobile/touch). | **0.5h** |
| PAPYR-335 | **Frontend** | **Accessibility: shortcuts tidak conflict dengan AT** | Pastikan shortcuts tidak conflict dengan screen reader shortcuts (NVDA, VoiceOver). Gunakan Ctrl/Cmd modifier (bukan single keys kecuali "?"). Test dengan NVDA/VoiceOver aktif. Provide option untuk disable shortcuts. | **0.5h** |
| PAPYR-336 | **Testing** | **Test keyboard shortcuts** | Vitest: test hook registers/unregisters correctly, test modifier detection, test disabled saat input focused. E2E: test Ctrl+U opens file picker, test ? opens help, test Escape closes modal. Minimal 5 test cases. | **1h** |

**Acceptance Criteria M39:**
- [ ] Ctrl+U trigger file upload di semua tool pages
- [ ] Ctrl+Enter trigger process/submit
- [ ] Escape cancel/close current operation
- [ ] ? toggle keyboard shortcuts help overlay
- [ ] Shortcuts disabled saat typing di input/textarea
- [ ] Visual hints di buttons (desktop only)
- [ ] No conflict dengan screen reader shortcuts
- [ ] 5+ tests passing

---

### M40: File History (localStorage) — 6 tasks | 6 jam | Minggu 17–18

**Deskripsi:** Recent files list (name + timestamp + tool used) di localStorage. Clear history option. Berguna untuk user yang sering pakai Papyr.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-337 | **Frontend** | **Buat useFileHistory hook** | Custom hook: save file metadata ke localStorage setelah processing selesai. Data: fileName, fileSize, toolUsed, timestamp, status (success/failed). Max 20 entries (FIFO). Return `{ history, addEntry, clearHistory, removeEntry }`. | **1h** |
| PAPYR-338 | **Frontend** | **Buat FileHistory component** | List component: tampilkan recent files dengan icon tool, file name (truncated), timestamp (relative: "2 jam lalu"), tool badge. Sorted by most recent. Empty state: "Belum ada riwayat". Responsive: card layout di mobile. | **1.5h** |
| PAPYR-339 | **Frontend** | **Integrasi history ke semua tools** | Setelah processing selesai (success) di setiap tool: call `addEntry()` dengan metadata file. Jangan simpan file content (hanya metadata). Jangan simpan jika user cancel sebelum selesai. | **1h** |
| PAPYR-340 | **Frontend** | **Tampilkan history di landing page** | Section "Riwayat Terbaru" di landing page (di bawah tool grid). Tampilkan 5 entries terbaru. Link "Lihat semua" ke /history page. Hanya tampilkan jika ada history (hide section jika kosong). | **1h** |
| PAPYR-341 | **Frontend** | **Clear history + privacy** | Tombol "Hapus Riwayat" dengan konfirmasi dialog. Privacy note: "Riwayat hanya disimpan di browser Anda, tidak dikirim ke server." Auto-clear option: hapus otomatis setelah 30 hari (configurable). | **1h** |
| PAPYR-342 | **Testing** | **Test file history** | Vitest: test addEntry, test FIFO (max 20), test clearHistory, test removeEntry, test localStorage persistence. E2E: process file, verify history entry appears, clear history, verify empty. Minimal 5 test cases. | **0.5h** |

**Acceptance Criteria M40:**
- [ ] File history tersimpan di localStorage setelah processing
- [ ] Maksimal 20 entries (oldest removed first)
- [ ] History ditampilkan di landing page (5 terbaru)
- [ ] Clear history option dengan konfirmasi
- [ ] Privacy note jelas (data lokal saja)
- [ ] Tidak menyimpan file content (hanya metadata)
- [ ] 5+ tests passing

---

### M41: Changelog Page — 5 tasks | 4 jam | Minggu 18

**Deskripsi:** Public /changelog route, auto-generated dari CHANGELOG.md, styled page.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-343 | **Frontend** | **Buat halaman /changelog** | Route /changelog: render CHANGELOG.md sebagai styled HTML. Parse markdown ke HTML (remark/rehype atau next-mdx-remote). Styled: version headers, date badges, categorized changes (Added, Fixed, Changed). | **1.5h** |
| PAPYR-344 | **Frontend** | **Styling changelog page** | Design: timeline-style layout, version number prominent, date badge, colored category tags (green: Added, blue: Changed, red: Fixed). Responsive. Match Papyr design system. Table of contents sidebar (desktop). | **1h** |
| PAPYR-345 | **Frontend** | **Auto-parse CHANGELOG.md at build time** | Gunakan `fs.readFileSync` di getStaticProps atau generateStaticParams untuk read CHANGELOG.md at build time. Parse sections per version. No runtime file reading. Rebuild saat CHANGELOG.md berubah. | **0.5h** |
| PAPYR-346 | **Frontend** | **Link changelog dari Footer + Navbar** | Tambahkan link "Changelog" atau "Apa yang Baru" di Footer. Optional: badge "New" di Navbar jika ada update dalam 7 hari terakhir (compare latest version date). | **0.5h** |
| PAPYR-347 | **Testing** | **Test changelog page** | E2E: verify /changelog loads, verify version entries render, verify links work. Vitest: test markdown parsing logic. Minimal 3 test cases. | **0.5h** |

**Acceptance Criteria M41:**
- [ ] /changelog route accessible dan menampilkan version history
- [ ] Content auto-generated dari CHANGELOG.md (no manual duplication)
- [ ] Styled dengan timeline layout dan category tags
- [ ] Link tersedia di Footer
- [ ] Responsive (mobile-friendly)
- [ ] 3+ tests passing

---

### M42: Undo/Redo — 7 tasks | 5 jam | Minggu 18–19

**Deskripsi:** Setelah split/rotate, undo tanpa re-upload. State management untuk operation history.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-348 | **Frontend** | **Buat useUndoRedo hook** | Generic hook: maintain history stack (past, present, future). Methods: `undo()`, `redo()`, `push(state)`, `canUndo`, `canRedo`. Max history depth: 10 states. Memory-efficient: store diffs jika possible, atau full state snapshots. | **1h** |
| PAPYR-349 | **Frontend** | **Integrasi undo/redo ke Rotate page** | Setelah rotate halaman: push state ke history. Undo: revert rotation. Redo: re-apply rotation. State: array of page rotations. User bisa undo multiple rotations tanpa re-upload PDF. | **1h** |
| PAPYR-350 | **Frontend** | **Integrasi undo/redo ke Split page** | Setelah select/deselect pages: push state ke history. Undo: revert page selection. State: array of selected page numbers. User bisa undo page selection changes. | **0.5h** |
| PAPYR-351 | **Frontend** | **Integrasi undo/redo ke Merge page** | Setelah reorder files: push state ke history. Undo: revert file order. State: array of file objects with order. User bisa undo drag-reorder tanpa re-upload. | **0.5h** |
| PAPYR-352 | **Frontend** | **Undo/Redo UI buttons** | Tombol Undo dan Redo di toolbar tool pages: icon arrows, disabled state jika cannot undo/redo. Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Shift+Z (redo). Tooltip: "Undo (Ctrl+Z)". | **1h** |
| PAPYR-353 | **Frontend** | **Visual feedback saat undo/redo** | Toast notification saat undo/redo: "Dibatalkan: rotasi halaman 3" atau "Dikembalikan: urutan file". Subtle animation pada affected element. Highlight changed element briefly. | **0.5h** |
| PAPYR-354 | **Testing** | **Test undo/redo** | Vitest: test hook push/undo/redo/canUndo/canRedo, test max depth (11th push removes oldest), test integration with rotate state. E2E: rotate page, undo, verify reverted. Minimal 5 test cases. | **0.5h** |

**Acceptance Criteria M42:**
- [ ] Undo/redo berfungsi di rotate, split, dan merge pages
- [ ] Ctrl+Z dan Ctrl+Shift+Z shortcuts berfungsi
- [ ] UI buttons disabled saat cannot undo/redo
- [ ] Max 10 history states (memory efficient)
- [ ] Toast notification saat undo/redo
- [ ] Tidak perlu re-upload file untuk undo
- [ ] 5+ tests passing

---

### M43: Social Proof Widget — 6 tasks | 5 jam | Minggu 19–20

**Deskripsi:** "X PDF diproses hari ini" counter, animated number, dari analytics data. Meningkatkan trust dan social proof.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-355 | **Backend** | **Endpoint counter: GET /api/stats/today** | Return jumlah PDF yang diproses hari ini (dari analytics/database). Cache response 5 menit (tidak perlu real-time). Fallback: return estimasi jika data tidak tersedia. Include: today_count, total_count, last_updated. | **1.5h** |
| PAPYR-356 | **Frontend** | **Buat SocialProofCounter component** | Widget: "1.247 PDF diproses hari ini" dengan animated number (count up animation). Icon: document/checkmark. Posisi: di landing page hero section atau di bawah hero. Refresh setiap 5 menit. Skeleton saat loading. | **1.5h** |
| PAPYR-357 | **Frontend** | **Animated number count-up** | Animasi: number counts up dari 0 ke actual value saat component masuk viewport (Intersection Observer). Duration: 2 detik. Easing: ease-out. Format: locale-aware (1.247 untuk ID, 1,247 untuk EN). | **0.5h** |
| PAPYR-358 | **Frontend** | **Integrasi ke landing page** | Tempatkan SocialProofCounter di landing page: di bawah hero tagline, sebelum tool grid. Responsive: full-width di mobile, inline di desktop. Conditional render: hide jika API error (graceful degradation). | **0.5h** |
| PAPYR-359 | **Frontend** | **Total counter badge** | Badge tambahan: "Total: 15.000+ PDF diproses sejak launch". Tampilkan di footer atau di bawah daily counter. Update monthly (hardcoded milestone atau dari API). | **0.5h** |
| PAPYR-360 | **Testing** | **Test social proof widget** | Vitest: test counter renders, test count-up animation triggers, test API error fallback. E2E: verify counter visible on landing page. Minimal 3 test cases. | **0.5h** |

**Acceptance Criteria M43:**
- [ ] Daily counter ditampilkan di landing page
- [ ] Animated count-up saat masuk viewport
- [ ] Data dari API (cached 5 menit)
- [ ] Graceful degradation jika API error
- [ ] Locale-aware number formatting
- [ ] 3+ tests passing

---

### M44: User Feedback Widget — 7 tasks | 5 jam | Minggu 20

**Deskripsi:** In-app feedback button, simple form, sends to OpenClaw PM agent untuk processing.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-361 | **Frontend** | **Buat FeedbackButton component** | Floating button di bottom-right: icon speech bubble + "Feedback". Click: open feedback form modal. Posisi: fixed, z-index tinggi, tidak overlap dengan content. Hide di mobile (terlalu kecil) atau pindah ke hamburger menu. | **0.5h** |
| PAPYR-362 | **Frontend** | **Buat FeedbackForm component** | Modal form: (1) Rating 1–5 stars atau emoji scale, (2) Category dropdown (Bug, Saran, Pertanyaan, Lainnya), (3) Message textarea (max 500 chars), (4) Email opsional. Submit button. Character counter. Validation: message required (min 10 chars). | **1.5h** |
| PAPYR-363 | **Backend** | **Endpoint POST /api/feedback** | Terima feedback: rating, category, message, email (optional), page_url, user_agent. Validasi input. Simpan ke database atau kirim ke OpenClaw Dalang agent via internal API. Rate limit: 3 feedback per IP per jam. Return 201 Created. | **1h** |
| PAPYR-364 | **Frontend** | **Success state + thank you** | Setelah submit: tampilkan "Terima kasih atas feedback Anda!" dengan checkmark animation. Auto-close modal setelah 3 detik. Simpan flag ke localStorage: jangan tampilkan feedback button selama 24 jam setelah submit (avoid spam). | **0.5h** |
| PAPYR-365 | **Frontend** | **Context-aware feedback** | Auto-attach context ke feedback: current page URL, tool yang sedang dipakai, browser info. Jika user submit feedback dari tool page: pre-fill category "Bug" jika ada error state, atau "Saran" jika success state. | **0.5h** |
| PAPYR-366 | **Backend** | **Forward feedback ke OpenClaw** | Setelah feedback disimpan: trigger OpenClaw Dalang agent untuk process. Dalang categorize, prioritize, dan buat GitHub issue jika actionable. Telegram notification ke admin untuk feedback rating 1–2 (urgent). | **0.5h** |
| PAPYR-367 | **Testing** | **Test feedback widget** | Vitest: test form validation, test submit flow, test rate limit handling. E2E: open feedback, fill form, submit, verify success state. Minimal 4 test cases. | **0.5h** |

**Acceptance Criteria M44:**
- [ ] Feedback button visible di semua pages (desktop)
- [ ] Form: rating + category + message + optional email
- [ ] Submit berhasil mengirim ke backend
- [ ] Rate limit: max 3 per jam per IP
- [ ] Context auto-attached (page URL, tool, browser)
- [ ] OpenClaw Dalang menerima dan process feedback
- [ ] 4+ tests passing

**API Contract M44:**
```
POST /api/feedback
Content-Type: application/json

Request:
  {
    "rating": 4,
    "category": "saran",
    "message": "Tambahkan fitur batch processing untuk compress",
    "email": "user@example.com",
    "context": {
      "page_url": "/compress",
      "tool": "compress",
      "user_agent": "Mozilla/5.0..."
    }
  }

Response 201:
  {
    "success": true,
    "message": "Feedback diterima. Terima kasih!"
  }

Response 429: { "error": "Terlalu banyak feedback. Coba lagi nanti." }
```

---

### M45: Tool Recommendation — 6 tasks | 5 jam | Minggu 20–21

**Deskripsi:** "Kamu baru compress, mau sekalian merge?" suggestion setelah task complete. Cross-sell tools yang relevan.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-368 | **Frontend** | **Definisikan recommendation rules** | Mapping tool relationships: compress selesai maka suggest merge/split. Merge selesai maka suggest compress. Split selesai maka suggest merge. Rotate selesai maka suggest compress. PDF-to-Word selesai maka suggest OCR. Configurable rules array. | **0.5h** |
| PAPYR-369 | **Frontend** | **Buat ToolRecommendation component** | Card yang muncul setelah task selesai (di bawah download button): "Mau sekalian [tool]?" dengan icon, short description, dan CTA button. Dismissable (X button). Animasi: slide-up setelah 1 detik delay. Max 1 recommendation per session. | **1.5h** |
| PAPYR-370 | **Frontend** | **Smart recommendation logic** | Jangan recommend tool yang baru saja dipakai. Jangan recommend jika user sudah dismiss 2x (localStorage counter). Prioritaskan tools yang belum pernah dipakai user (dari file history). Randomize jika multiple candidates. | **1h** |
| PAPYR-371 | **Frontend** | **Integrasi ke semua tool pages** | Setelah processing selesai (success state) di setiap tool: render ToolRecommendation component dengan rules yang sesuai. Pass current tool name sebagai context. Conditional: hanya tampilkan jika user belum navigate away. | **1h** |
| PAPYR-372 | **Frontend** | **Track recommendation clicks** | Analytics event: `recommendation_shown` (tool_from, tool_suggested), `recommendation_clicked` (tool_from, tool_suggested), `recommendation_dismissed`. Measure conversion rate. Data untuk optimize rules di masa depan. | **0.5h** |
| PAPYR-373 | **Testing** | **Test tool recommendation** | Vitest: test recommendation rules (correct suggestions per tool), test dismiss logic, test max-show limit. E2E: complete compress, verify recommendation appears, click, verify navigation. Minimal 4 test cases. | **0.5h** |

**Acceptance Criteria M45:**
- [ ] Recommendation muncul setelah task selesai
- [ ] Suggestion relevan berdasarkan tool yang baru dipakai
- [ ] Dismissable dan tidak muncul berlebihan
- [ ] Click recommendation navigasi ke tool yang disarankan
- [ ] Analytics track shown/clicked/dismissed
- [ ] 4+ tests passing

**Recommendation Rules:**

| Setelah Tool | Suggest | Alasan |
|-------------|---------|--------|
| Compress | Merge, Split | User mungkin mau gabung/pisah setelah compress |
| Merge | Compress | File gabungan biasanya besar, perlu compress |
| Split | Merge, Compress | Mungkin mau gabung ulang atau compress hasil |
| Rotate | Compress, Merge | Setelah fix orientasi, mungkin mau optimize |
| Protect | Compress | File encrypted biasanya mau di-compress juga |
| Unlock | Compress, Merge | Setelah unlock, mungkin mau proses lebih lanjut |
| Watermark | Compress, Protect | Setelah watermark, mungkin mau compress atau protect |
| Sign | Compress, Protect | Setelah sign, mungkin mau compress atau protect |
| PDF-to-Word | OCR | Jika hasil kurang bagus, suggest OCR dulu |
| OCR | PDF-to-Word, PDF-to-Excel | Setelah OCR, text extractable untuk conversion |
| PDF-to-Excel | OCR | Jika tabel tidak terdeteksi, suggest OCR |
| Image-to-PDF | Compress, Merge | Hasil image-to-pdf biasanya besar |
| PDF-to-Image | Image-to-PDF | Mungkin mau convert balik |

---
## Dependency Graph

```
                    +-------------------------------------------------------------+
                    |                    Fase 3 DEPENDENCY GRAPH                  |
                    +-------------------------------------------------------------+

    Fase 3A                Fase 3B                Fase 3C
    Critical UX             UX Enhancement          Performance
    ----------              --------------          -----------

    +-------+               +-------+               +-------+
    |  M23  |               |  M27  |               |  M32  |
    | i18n  |               | Dark  |..............> | PWA   |
    |       |               | Mode  |               |       |
    +---+---+               +---+---+               +---+---+
        |                       |                       |
        | translation keys      | CSS variables         | service worker
        | needed for all        | needed for a11y       | needed for
        v                       v                       v
    +-------+               +-------+               +-------+
    |  M24  |               |  M28  |               |  M33  |
    | Error |               | a11y  |               | Web   |
    |Boundary               |       |               |Worker |
    +---+---+               +-------+               +---+---+
        |                                               |
        | offline detection  +-------+                  | worker ready
        | reused in PWA      |  M29  |                  v
        v                    |Preview|              +-------+
    +-------+               +-------+              |  M34  |
    |  M25  |                                      | Lazy  |
    |Progress               +-------+              | Load  |
    +---+---+               |  M30  |              +---+---+
        |                   |Onboard|                  |
        v                   +-------+                  v
    +-------+                                      +-------+
    |  M26  |               +-------+              |  M35  |
    | Rate  |               |  M31  |              | Image |
    | Limit |               |Compress              | Optim |
    +-------+               |Compare|              +---+---+
                            +-------+                  |
                                                       v
                                                   +-------+
                                                   |  M36  |
    Fase 3D                Fase 3E               |Prefetch
    Interaction             Growth                  +---+---+
    -----------             ------                     |
                                                       v
    +-------+               +-------+              +-------+
    |  M38  |               |  M43  |              |  M37  |
    | Drag  |               |Social |              | Edge  |
    | Drop  |               | Proof |              | Cache |
    +-------+               +---+---+              +-------+
                                |
    +-------+                   v
    |  M39  |               +-------+
    |Keyboard               |  M44  |
    |Shortcut               |Feedback
    +-------+               +---+---+
                                |
    +-------+                   v
    |  M40  |               +-------+
    | File  |               |  M45  |
    |History|               | Tool  |
    +-------+               | Recom |
                            +-------+
    +-------+
    |  M41  |
    |Change |
    | log   |
    +-------+

    +-------+
    |  M42  |
    | Undo  |
    | Redo  |
    +-------+

    ================================================================
    LEGEND:
    ------
    ------>  Hard dependency (must complete before starting)
    ......>  Soft dependency (shared logic, can parallel with care)
    ================================================================
```

### Dependency Detail

| Milestone | Depends On | Alasan |
|-----------|-----------|--------|
| M23 | — | Standalone, bisa mulai langsung |
| M24 | M23 | Error messages perlu translation keys |
| M25 | — | Standalone component, bisa parallel |
| M26 | M25 | Rate limit UI reuse progress components |
| M27 | — | Standalone, CSS variables independent |
| M28 | M27 | a11y audit perlu dark mode selesai (contrast check both modes) |
| M29 | — | Standalone, pdf.js independent |
| M30 | M23 | Tour text perlu translation keys |
| M31 | — | Standalone, hanya affect /compress page |
| M32 | M24 | PWA service worker extend dari M24 basic SW |
| M33 | — | Standalone, Web Worker independent |
| M34 | M33 | Lazy loading perlu worker ready (pdf-lib di worker) |
| M35 | — | Standalone, image optimization independent |
| M36 | M34 | Prefetch strategy depends on bundle split decisions |
| M37 | — | Standalone, config-level changes |
| M38 | — | Standalone, extend existing upload pattern |
| M39 | — | Standalone, custom hook |
| M40 | — | Standalone, localStorage only |
| M41 | — | Standalone, static page |
| M42 | — | Standalone, state management hook |
| M43 | — | Standalone, needs analytics API |
| M44 | — | Standalone, needs backend endpoint |
| M45 | M40 | Recommendation uses file history data |

---

## Urutan Pengerjaan (Rekomendasi)

### Sprint 1 (Minggu 1–5): Fase 3A — Critical UX

```
M23 (i18n) -> M24 (Error Boundary) -> M25 (Progress) -> M26 (Rate Limit)
```

**Rationale:** Fase 3A harus pertama karena:
- i18n (M23) mengubah semua text di app — harus selesai sebelum fitur lain yang tambah text
- Error handling (M24) dan progress (M25) adalah UX dasar yang dibutuhkan semua fitur lain
- Rate limit feedback (M26) melengkapi error handling

### Sprint 2 (Minggu 5–11): Fase 3B — UX Enhancement

```
M27 (Dark Mode) -> M28 (a11y) -> M29 (Preview) -> M30 (Onboarding) -> M31 (Comparison)
```

**Rationale:** Dark mode dulu karena a11y audit perlu check kedua mode. Preview dan onboarding bisa parallel tapi sequential lebih aman untuk solo dev.

### Sprint 3 (Minggu 11–15): Fase 3C — Performance

```
M32 (PWA) -> M33 (Worker) -> M34 (Lazy Load) -> M35 (Images) -> M36 (Prefetch) -> M37 (Cache)
```

**Rationale:** PWA extend service worker dari M24. Worker harus sebelum lazy loading. Image dan prefetch bisa parallel. Cache terakhir (config-level).

### Sprint 4 (Minggu 15–19): Fase 3D — Interaction

```
M38 (Drag Drop) | M39 (Keyboard) | M40 (History) | M41 (Changelog) | M42 (Undo)
```

**Rationale:** Semua milestone di Fase 3D independent. Bisa dikerjakan dalam urutan apapun. Prioritaskan M38 dan M39 (high impact).

### Sprint 5 (Minggu 19–21): Fase 3E — Growth

```
M43 (Social Proof) -> M44 (Feedback) -> M45 (Recommendation)
```

**Rationale:** Growth features terakhir karena butuh product stable. M45 depends on M40 (file history).

---

## Estimasi Resource

### Waktu

| Fase | Jam | Minggu (@10 jam/minggu) |
|------|-----|------------------------|
| Fase 3A (Critical UX) | 40 jam | 4 minggu |
| Fase 3B (UX Enhancement) | 50 jam | 5 minggu |
| Fase 3C (Performance) | 35 jam | 3.5 minggu |
| Fase 3D (Interaction) | 30 jam | 3 minggu |
| Fase 3E (Growth) | 15 jam | 1.5 minggu |
| **Total** | **~170 jam** | **~17 minggu** |

### Infrastruktur Tambahan

| Service | Biaya | Keterangan |
|---------|-------|------------|
| Vercel (existing) | Free tier | Frontend hosting, edge CDN |
| Railway (existing) | ~$5/bulan | Backend API |
| Cloudflare (existing) | Free tier | R2 storage + CDN |
| **Tidak ada biaya tambahan** | **$0** | Fase 3 murni frontend/UX work |

### Task Distribution Summary

| Layer | Tasks | Jam | Persentase |
|-------|-------|-----|-----------|
| Frontend | 112 | 130 jam | 76% |
| Config | 12 | 14 jam | 8% |
| Backend | 5 | 7 jam | 4% |
| Testing | 23 | 14 jam | 8% |
| Design | 3 | 4 jam | 2% |
| **Total** | **148** | **~170 jam** | **100%** |

> Fase 3 sangat frontend-heavy (76%). Ini sesuai dengan fokus "UX Polish" — hampir semua pekerjaan di sisi client.

---

## Appendix A: Task ID Quick Reference

| Range | Milestone | Fase |
|-------|-----------|------|
| PAPYR-225 — PAPYR-232 | M23: i18n (English Support) | 3A |
| PAPYR-233 — PAPYR-239 | M24: Error Boundary + Offline | 3A |
| PAPYR-240 — PAPYR-245 | M25: Progress Indicator | 3A |
| PAPYR-246 — PAPYR-252 | M26: Rate Limit Feedback | 3A |
| PAPYR-253 — PAPYR-260 | M27: Dark Mode | 3B |
| PAPYR-261 — PAPYR-269 | M28: Accessibility | 3B |
| PAPYR-270 — PAPYR-276 | M29: PDF Preview | 3B |
| PAPYR-277 — PAPYR-282 | M30: Onboarding Tour | 3B |
| PAPYR-283 — PAPYR-288 | M31: Compression Comparison | 3B |
| PAPYR-289 — PAPYR-296 | M32: PWA Support | 3C |
| PAPYR-297 — PAPYR-302 | M33: Web Worker Processing | 3C |
| PAPYR-303 — PAPYR-307 | M34: Lazy Loading Tools | 3C |
| PAPYR-308 — PAPYR-312 | M35: Image Optimization | 3C |
| PAPYR-313 — PAPYR-317 | M36: Prefetch on Hover | 3C |
| PAPYR-318 — PAPYR-322 | M37: Edge Caching | 3C |
| PAPYR-323 — PAPYR-329 | M38: Drag & Drop Global | 3D |
| PAPYR-330 — PAPYR-336 | M39: Keyboard Shortcuts | 3D |
| PAPYR-337 — PAPYR-342 | M40: File History | 3D |
| PAPYR-343 — PAPYR-347 | M41: Changelog Page | 3D |
| PAPYR-348 — PAPYR-354 | M42: Undo/Redo | 3D |
| PAPYR-355 — PAPYR-360 | M43: Social Proof Widget | 3E |
| PAPYR-361 — PAPYR-367 | M44: User Feedback Widget | 3E |
| PAPYR-368 — PAPYR-373 | M45: Tool Recommendation | 3E |

---

## Appendix B: i18n Translation Key Structure

```
messages/
  id.json          <- Bahasa Indonesia (default)
  en.json          <- English

Key Structure (nested):
  common.*         <- Shared UI text (buttons, labels, errors)
  nav.*            <- Navigation items
  footer.*         <- Footer content
  landing.*        <- Landing page specific
  tools.compress.* <- Per-tool text
  tools.merge.*
  tools.split.*
  tools.rotate.*
  tools.protect.*
  tools.unlock.*
  tools.watermark.*
  tools.sign.*
  tools.pdfToWord.*
  tools.ocr.*
  tools.pdfToExcel.*
  tools.imageToPdf.*
  tools.pdfToImage.*
  errors.*         <- Error messages
  feedback.*       <- Feedback widget text
  onboarding.*     <- Tour step text
  changelog.*      <- Changelog page text

Estimated total: ~300 keys per locale
```

---

## Appendix C: PWA Manifest Template

```json
{
  "name": "Papyr — Alat PDF Gratis untuk Indonesia",
  "short_name": "Papyr",
  "description": "Compress, merge, split, dan 10+ alat PDF lainnya. Gratis, cepat, privasi terjaga.",
  "start_url": "/",
  "display": "standalone",
  "orientation": "any",
  "theme_color": "#1E3A5F",
  "background_color": "#FFFFFF",
  "categories": ["productivity", "utilities"],
  "lang": "id",
  "dir": "ltr",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-maskable.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

---

## Appendix D: Keyboard Shortcuts Reference Table

### Global Shortcuts (semua pages)

| Shortcut | Action | Keterangan |
|----------|--------|------------|
| `?` | Toggle help overlay | Tampilkan/sembunyikan daftar shortcuts |
| `Ctrl+U` | Open file picker | Trigger upload dialog |
| `Ctrl+Enter` | Process/Submit | Trigger tombol proses utama |
| `Escape` | Cancel/Close | Tutup modal, cancel operation |
| `Ctrl+Z` | Undo | Batalkan aksi terakhir |
| `Ctrl+Shift+Z` | Redo | Kembalikan aksi yang dibatalkan |

### Tool-Specific Shortcuts

| Tool | Shortcut | Action |
|------|----------|--------|
| Merge | `Ctrl+Shift+A` | Tambah file lagi |
| Split | `Ctrl+A` | Select semua halaman |
| Rotate | `R` | Rotate selected 90 derajat |
| Rotate | `Shift+R` | Rotate selected -90 derajat |
| Compress | `Q` | Cycle quality setting |
| All tools | `D` | Download hasil (jika ready) |

### Shortcuts yang Dihindari (conflict dengan browser/AT)

| Shortcut | Alasan |
|----------|--------|
| `Ctrl+S` | Browser save page |
| `Ctrl+P` | Browser print |
| `Ctrl+W` | Browser close tab |
| `Alt+*` | Screen reader navigation |
| `Tab` | Native focus navigation (jangan override) |

---

## Catatan Penutup

### Definition of Done — Fase 3

Fase 3 dianggap **SELESAI** ketika:

1. ✅ i18n berfungsi (ID + EN) dengan language switcher
2. ✅ Dark mode berfungsi dengan system preference detection
3. ✅ WCAG 2.1 AA compliance (zero critical axe-core violations)
4. ✅ PWA installable (Lighthouse PWA audit pass)
5. ✅ Web Worker untuk client-side PDF operations
6. ✅ Initial bundle size berkurang 30%+ dari baseline
7. ✅ Lighthouse Performance >95 di semua tool pages
8. ✅ Drag-drop berfungsi di semua tool pages
9. ✅ Keyboard shortcuts berfungsi (Ctrl+U, Ctrl+Enter, ?, Escape)
10. ✅ File history tersimpan di localStorage
11. ✅ Feedback widget berfungsi dan terhubung ke OpenClaw
12. ✅ Tool recommendation muncul setelah task selesai
13. ✅ Release tagged v3.0.0
14. ✅ README dan CHANGELOG updated

### Prinsip Pengembangan

- **AI-driven:** Semua code ditulis dengan bantuan AI (Claude/GPT)
- **Privacy-first:** Tidak ada file yang disimpan lebih dari 60 menit
- **Mobile-first:** Semua UI didesain untuk mobile terlebih dahulu
- **Progressive enhancement:** Client-side first, server fallback jika perlu
- **Accessible:** WCAG 2.1 AA compliance sebagai minimum standard
- **Performance budget:** LCP < 1.5s, FID < 50ms, CLS < 0.05

### Risk Register Fase 3

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| next-intl breaking change di Next.js update | Medium | Low | Pin version, test sebelum upgrade |
| Dark mode FOUC di slow connections | Low | Medium | Inline script di head, minimal CSS |
| Web Worker tidak support di browser lama | Low | Low | Fallback ke main thread, progressive enhancement |
| PWA install prompt tidak muncul di iOS | Medium | High | iOS Safari limitations documented, manual A2HS guide |
| Bundle size tidak berkurang 30% | Medium | Medium | Aggressive code splitting, remove unused deps |
| axe-core false positives | Low | Medium | Manual review, whitelist known false positives |
| Service worker cache stale | Medium | Medium | Versioned cache, update notification flow |

---

> **Next step:** Mulai dari PAPYR-225 (M23: i18n). Bawa dokumen ini ke sesi coding sebagai referensi. Target: 1–2 tasks per sesi coding.

---

*Dokumen ini adalah living document dan akan di-update seiring progress pengerjaan Fase 3.*

*Hak cipta © 2026 Muhammad Fa'iz Zulfikar. All rights reserved.*