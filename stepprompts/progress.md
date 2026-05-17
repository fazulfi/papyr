# Papyr Fase 2 — Progress Tracker

> **Instruksi:** Setelah menyelesaikan setiap STEP, update status di file ini menjadi ✅ beserta tanggal selesai.
> Format: `| STEP-F2-XXX | Judul | ⬜ |` → `| STEP-F2-XXX | Judul | ✅ YYYY-MM-DD |`

**Last Updated:** 2026-05-17
**Current Step:** STEP-F2-038
**Overall Progress:** 37 / 97 (38%)

---

## Phase Summary

| Fase | Steps | Done | Progress |
|------|-------|------|----------|
| 2A — Security (M12+M13) | 13 | 13 | 100% |
| 2B — Enhancement (M14+M15) | 16 | 16 | 100% |
| 2C — Conversion (M16+M17+M18) | 11 | 7 | 64% |
| 2D — Quality (M19-M20) | 14 | 0 | 0% |
| 2E — OpenClaw (M21) | 28 | 0 | 0% |
| 2F — Dashboard (M22) | 15 | 0 | 0% |
| **TOTAL** | **97** | **35** | **36%** |

---

## Fase 2A — Security Tools (M12-M13)

### M12: Protect PDF (Password Protect)

| Step | Title | Status |
|------|-------|--------|
| STEP-F2-001 | Backend — Create shared PDF validator utility | ✅ 2026-05-14 |
| STEP-F2-002 | Backend — Create encryption service (shared protect/unlock) | ✅ 2026-05-14 |
| STEP-F2-003 | Backend — Create POST /api/protect endpoint | ✅ 2026-05-14 |
| STEP-F2-004 | Backend — Unit tests for protect endpoint | ✅ 2026-05-14 |
| STEP-F2-005 | Frontend — Create /protect page with full UI | ✅ 2026-05-14 |
| STEP-F2-006 | Frontend — Create PasswordInput shared component | ✅ 2026-05-14 |
| STEP-F2-007 | Frontend — Unit tests for /protect page and PasswordInput | ✅ 2026-05-14 |
| STEP-F2-008 | Testing — Manual E2E test protect flow | ✅ 2026-05-14 |

### M13: Unlock PDF (Remove Password)

| Step | Title | Status |
|------|-------|--------|
| STEP-F2-009 | Backend — Create POST /api/unlock endpoint | ✅ 2026-05-14 |
| STEP-F2-010 | Backend — Unit tests for unlock endpoint | ✅ 2026-05-14 |
| STEP-F2-011 | Frontend — Create /unlock page with full UI | ✅ 2026-05-14 |
| STEP-F2-012 | Frontend — Unit tests for /unlock page | ✅ 2026-05-14 |
| STEP-F2-013 | Testing — Manual E2E test unlock flow + Fase 2A complete | ✅ 2026-05-14 |

---

## Fase 2B — Document Enhancement (M14-M15)

### M14: Watermark PDF

| Step | Title | Status |
|------|-------|--------|
| STEP-F2-014 | Frontend — Create /watermark page with tab UI (text/image) | ✅ 2026-05-14 |
| STEP-F2-015 | Frontend — Watermark preview on first PDF page | ✅ 2026-05-14 |
| STEP-F2-016 | Frontend — Text watermark processing client-side (pdf-lib) | ✅ 2026-05-15 |
| STEP-F2-017 | Backend — Create POST /api/watermark for image watermark | ✅ 2026-05-15 |
| STEP-F2-018 | Frontend — Image watermark API integration + analytics | ✅ 2026-05-15 |
| STEP-F2-019 | Backend — Unit tests for watermark endpoint | ✅ 2026-05-15 |
| STEP-F2-020 | Frontend — Unit tests for /watermark page | ✅ 2026-05-15 |
| STEP-F2-021 | Testing — Manual E2E test watermark flow | ✅ 2026-05-16 |

### M15: Sign PDF (Digital Signature)

| Step | Title | Status |
|------|-------|--------|
| STEP-F2-022 | Frontend — Create /sign page with main layout | ✅ 2026-05-16 |
| STEP-F2-023 | Frontend — Signature pad component (draw mode) | ✅ 2026-05-16 |
| STEP-F2-024 | Frontend — Signature upload mode + type mode | ✅ 2026-05-16 |
| STEP-F2-025 | Frontend — PDF page viewer with navigation | ✅ 2026-05-16 |
| STEP-F2-026 | Frontend — Drag-and-drop signature placement | ✅ 2026-05-16 |
| STEP-F2-027 | Frontend — Apply signature to PDF with pdf-lib + download | ✅ 2026-05-16 |
| STEP-F2-028 | Frontend — Unit tests for /sign page | ✅ 2026-05-16 |
| STEP-F2-029 | Testing — Manual E2E test sign flow | ✅ 2026-05-16 |

---

## Fase 2C — Document Conversion (M16-M18)

### M16: PDF-to-Word

| Step | Title | Status |
|------|-------|--------|
| STEP-F2-030 | Infra — Install LibreOffice headless in Docker/Railway | ✅ 2026-05-16 |
| STEP-F2-031 | Backend — Create async task service (shared M16/M17) | ✅ 2026-05-16 |
| STEP-F2-032 | Backend — Create POST /api/pdf-to-word endpoint | ✅ 2026-05-16 |
| STEP-F2-033 | Backend — Unit tests for pdf-to-word + Frontend page + tests | ✅ 2026-05-16 |

### M17: OCR (Optical Character Recognition)

| Step | Title | Status |
|------|-------|--------|
| STEP-F2-034 | Infra — Install Tesseract + ocrmypdf in Docker | ✅ 2026-05-16 |
| STEP-F2-035 | Backend — Create POST /api/ocr endpoint | ✅ 2026-05-16 |
| STEP-F2-036 | Backend + Frontend — Complete M17 (OCR tests + page + frontend tests) | ✅ 2026-05-17 |

### M18: PDF-to-Excel

| Step | Title | Status |
|------|-------|--------|
| STEP-F2-037 | Infra — Install camelot-py + dependencies in Docker | ✅ 2026-05-17 |
| STEP-F2-038 | Backend — Create POST /api/pdf-to-excel + preview endpoint | ⬜ |
| STEP-F2-039 | Backend + Frontend — Complete M18 (tests + page + frontend tests) | ⬜ |
| STEP-F2-040 | Testing — Manual E2E test Fase 2C (all conversion tools) | ⬜ |

---

## Fase 2D — Cross-cutting Quality (M19-M20)

### M19: E2E Testing + Code Quality

| Step | Title | Status |
|------|-------|--------|
| STEP-F2-041 | Setup Playwright di frontend project | ⬜ |
| STEP-F2-042 | E2E tests untuk client-side tools (Merge, Split, Rotate, Sign) | ⬜ |
| STEP-F2-043 | E2E tests untuk server-side tools (7 tools) | ⬜ |
| STEP-F2-044 | E2E tests untuk PDF-to-Excel, Image-to-PDF, dan Navigation | ⬜ |
| STEP-F2-045 | Setup Prettier untuk frontend | ⬜ |
| STEP-F2-046 | Setup Ruff untuk backend | ⬜ |
| STEP-F2-047 | Update CI/CD pipeline (E2E + lint/format checks) | ⬜ |
| STEP-F2-048 | Verify all tests pass + fix flaky tests | ⬜ |

### M20: Performance, Monitoring & SEO

| Step | Title | Status |
|------|-------|--------|
| STEP-F2-049 | Lighthouse audit + bundle analysis | ⬜ |
| STEP-F2-050 | Performance optimization berdasarkan audit | ⬜ |
| STEP-F2-051 | Setup uptime monitoring (BetterStack) + Telegram alerts | ⬜ |
| STEP-F2-052 | Update landing page grid + Navbar/Footer untuk 13 tools | ⬜ |
| STEP-F2-053 | Update sitemap + OG images + analytics taxonomy | ⬜ |
| STEP-F2-054 | Final deploy + smoke test Fase 2D + tag v2.0.0 | ⬜ |

---

## Fase 2E — OpenClaw AI Agent (M21)

### M21: OpenClaw AI Agent

| Step | Title | Status |
|------|-------|--------|
| STEP-F2-055 | Setup VPS & Docker environment | ⬜ |
| STEP-F2-056 | Setup PostgreSQL + Redis containers | ⬜ |
| STEP-F2-057 | Core Framework scaffold (TypeScript + BullMQ + LLM client) | ⬜ |
| STEP-F2-058 | Database schema + Drizzle ORM + migrations | ⬜ |
| STEP-F2-059 | SOUL.md + HEARTBEAT.md implementation | ⬜ |
| STEP-F2-060 | Agent: SEO Pipeline (Aksara) | ⬜ |
| STEP-F2-061 | Agent: Competitor Monitoring (Telik/Dawat) | ⬜ |
| STEP-F2-062 | Agent: Server Health Monitoring (Jaga/Kertas) | ⬜ |
| STEP-F2-063 | Agent: Security Scanning (Tameng/Pena) | ⬜ |
| STEP-F2-064 | Agent: Reporting (Warta/Tinta) | ⬜ |
| STEP-F2-065 | Agent: Self-Improvement (Lontar/Nalar) | ⬜ |
| STEP-F2-066 | Agent: Project Management (Dalang/Kelola) | ⬜ |
| STEP-F2-067 | Agent: Backup & Verify (Pustaka/Simpan) | ⬜ |
| STEP-F2-068 | Agent: Analytics Intelligence (Prasasti/Cerdas) | ⬜ |
| STEP-F2-069 | Agent: Social Media / Twitter (Kicau) | ⬜ |
| STEP-F2-070 | Telegram Bot setup (grammy) | ⬜ |
| STEP-F2-071 | Dashboard /admin/openclaw (Next.js) | ⬜ |
| STEP-F2-072 | CLI Interface (commander.js) | ⬜ |
| STEP-F2-073 | Error Handling & Resilience | ⬜ |
| STEP-F2-074 | Email Integration (Resend) + Quarterly/Yearly Reports | ⬜ |
| STEP-F2-075 | Incident Auto-Fix Engine | ⬜ |
| STEP-F2-076 | Dockerfile + Docker Compose (full system) | ⬜ |
| STEP-F2-077 | Unit Tests for core framework + agents | ⬜ |
| STEP-F2-078 | Integration Tests (testcontainers) | ⬜ |
| STEP-F2-079 | E2E Tests (full system) | ⬜ |
| STEP-F2-080 | CI/CD Pipeline for OpenClaw | ⬜ |
| STEP-F2-081 | Documentation Update | ⬜ |
| STEP-F2-082 | Production Deployment & Verification | ⬜ |

---

## Fase 2F — Admin Dashboard (M22)

### M22: Admin Dashboard

| Step | Title | Status |
|------|-------|--------|
| STEP-F2-083 | Frontend — Setup admin route structure + auth middleware | ⬜ |
| STEP-F2-084 | Frontend — Create admin layout (sidebar + header) | ⬜ |
| STEP-F2-085 | Frontend — Build OpenClaw Monitoring page | ⬜ |
| STEP-F2-086 | Frontend — Build Analytics Overview page | ⬜ |
| STEP-F2-087 | Frontend — Build Server Health page | ⬜ |
| STEP-F2-088 | Frontend — Build Security Scan page | ⬜ |
| STEP-F2-089 | Frontend — Build SEO & Competitor page | ⬜ |
| STEP-F2-090 | Frontend — Build System Logs page | ⬜ |
| STEP-F2-091 | Frontend — Build Backup Status page | ⬜ |
| STEP-F2-092 | Frontend — Build Revenue/Billing placeholder page | ⬜ |
| STEP-F2-093 | Frontend — Build User Management placeholder page | ⬜ |
| STEP-F2-094 | Frontend — Build Settings page | ⬜ |
| STEP-F2-095 | Backend — Create admin API routes | ⬜ |
| STEP-F2-096 | Frontend — Admin SEO exclusion | ⬜ |
| STEP-F2-097 | Testing — Unit tests admin auth + API routes | ⬜ |

---

## Backlog ID Cross-Reference

| STEP Range | PAPYR Range | Milestone | Fase |
|------------|-------------|-----------|------|
| STEP-F2-001 — 013 | PAPYR-090 — 098B | M12-M13: Security Tools | 2A |
| STEP-F2-014 — 029 | PAPYR-107 — 116B | M14-M15: Document Enhancement | 2B |
| STEP-F2-030 — 040 | PAPYR-128 — 158B | M16-M18: Document Conversion | 2C |
| STEP-F2-041 — 054 | PAPYR-159 — 178 | M19-M20: Cross-cutting Quality | 2D |
| STEP-F2-055 — 082 | PAPYR-179 — 224 | M21: OpenClaw AI Agent | 2E |
| STEP-F2-083 — 097 | PAPYR-204 — 218 | M22: Admin Dashboard | 2F |
