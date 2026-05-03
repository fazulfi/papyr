# Papyr — Docs Sync Rules

> **Prinsip: Setiap perubahan kode/arsitektur WAJIB diikuti update docs yang relevan. Tanpa diingatkan.**
> Agent HARUS cek file ini setiap kali melakukan perubahan yang berdampak pada dokumentasi.

---

## Aturan Utama

1. **Docs adalah source of truth** — jika kode tidak sesuai docs, kode yang salah (kecuali docs sudah outdated)
2. **Update docs di commit yang sama** atau commit terpisah segera setelahnya
3. **Jangan pernah skip** — "nanti aja update docs-nya" TIDAK BOLEH
4. **Version bump** — setiap docs yang di-update, naikkan versi di Version History table
5. **Cross-reference check** — jika update 1 doc, cek apakah docs lain yang mereferensikan juga perlu update

---

## Prioritas Update

Jika waktu terbatas, update docs dengan urutan prioritas:

**TDD (04) > SRS (03) > API Spec (11) > Roadmap (20) > lainnya**

---

## Trigger → Docs yang Harus Di-Update

### Perubahan Backend

| Trigger | Docs yang WAJIB di-update |
|---------|--------------------------|
| Endpoint baru | API Spec (11), SRS (03) requirement terkait, API Versioning Strategy (34) |
| Endpoint berubah (request/response) | API Spec (11), User Manual (23) jika user-facing, API Versioning Strategy (34) |
| Error code baru | API Spec (11) error registry, Coding Standards (13) |
| Rate limit berubah | API Spec (11) rate limiting section, Security Policy (12) |
| Auth flow berubah/ditambahkan | API Spec (11), Security Policy (12), TDD (04) |
| Service/module baru di FastAPI | TDD (04), Coding Standards (13) |
| Dependency baru (requirements.txt) | TDD (04) tech stack, Cost Projection (17) jika berbayar |

### Perubahan Frontend

| Trigger | Docs yang WAJIB di-update |
|---------|--------------------------|
| Page/tool baru | SRS (03), UI/UX Spec (19), Roadmap (20), Analytics Event Taxonomy (18) |
| Component baru | UI/UX Spec (19), Coding Standards (13) jika pattern baru |
| Design token berubah | UI/UX Spec (19), Brand Guidelines (32) |
| Navigation berubah | UI/UX Spec (19), User Manual (23) |
| Error state baru | UI/UX Spec (19), User Manual (23) |
| Analytics event baru | Analytics Event Taxonomy (18) |
| SEO/meta berubah | GTM Strategy (15) |

### Perubahan Infrastruktur

| Trigger | Docs yang WAJIB di-update |
|---------|--------------------------|
| Docker config berubah | TDD (04), Deployment Runbook (07) |
| CI/CD pipeline berubah | TDD (04), Deployment Runbook (07) |
| Environment variable baru | Deployment Runbook (07), Onboarding Guide (30) |
| Railway config berubah | TDD (04), Deployment Runbook (07), Cost Projection (17) |
| Vercel config berubah | TDD (04), Deployment Runbook (07) |
| Cloudflare R2 config berubah | TDD (04), Deployment Runbook (07), Security Policy (12) |
| Domain/DNS berubah | Deployment Runbook (07), Disaster Recovery Plan (33) |
| Scaling (plan upgrade, resource limit) | TDD (04), Cost Projection (17), Feasibility Study (09) |

### Perubahan Security

| Trigger | Docs yang WAJIB di-update |
|---------|--------------------------|
| Auth mechanism ditambahkan/berubah | Security Policy (12), API Spec (11), TDD (04) |
| Data classification baru | Security Policy (12), Legal Pages (26) |
| Rate limiting berubah | Security Policy (12), API Spec (11) |
| CORS config berubah | Security Policy (12), Deployment Runbook (07) |
| File retention policy berubah | Security Policy (12), Legal Pages (26), SLA (08) |
| Dependency vulnerability patched | Changelog (28), Release Notes (10) |

### Perubahan Fitur (User-Facing)

| Trigger | Docs yang WAJIB di-update |
|---------|--------------------------|
| Fitur/tool baru ditambahkan | SRS (03), TDD (04), User Manual (23), Release Notes (10), Changelog (28), Test Plan (06), Analytics Event Taxonomy (18) |
| Fitur existing berubah behavior | SRS (03), User Manual (23), Changelog (28) |
| Fitur dihapus/deprecated | SRS (03), User Manual (23), Release Notes (10), Changelog (28), Roadmap (20) |
| Bug fix yang mengubah behavior | Changelog (28), Release Notes (10) |
| Performance improvement | Changelog (28), Performance Benchmark (27) jika baseline berubah |

### Perubahan Operasional

| Trigger | Docs yang WAJIB di-update |
|---------|--------------------------|
| Monitoring alert baru | Monitoring Playbook (25) |
| Backup/recovery strategy berubah | Disaster Recovery Plan (33), Internal Ops Manual (22) |
| Incident response procedure berubah | Incident Response (21) |
| SLA target berubah | SLA (08) |
| Maintenance window berubah | SLA (08), Internal Ops Manual (22) |
| Ops procedure baru | Internal Ops Manual (22) |
| Postmortem dilakukan | Postmortem Template (24), Incident Response (21) |

### Perubahan Bisnis/Strategi

| Trigger | Docs yang WAJIB di-update |
|---------|--------------------------|
| Pricing/monetisasi berubah | Roadmap (20), GTM Strategy (15), BRD (01), Cost Projection (17) |
| Target market berubah | BRD (01), GTM Strategy (15), Competitive Analysis (16) |
| Competitor baru muncul | Competitive Analysis (16) |
| Phase/milestone planning | Roadmap (20), BRD (01), Project Plan (05) |
| Legal/compliance requirement baru | Security Policy (12), Legal Pages (26), Feasibility Study (09) |
| Brand identity berubah | Brand Guidelines (32), UI/UX Spec (19) |

---

## Quick Reference: Doc Index

| # | Doc | Kapan Di-Update |
|---|-----|-----------------|
| 01 | BRD | Perubahan bisnis/strategi/scope |
| 02 | Project Charter | Jarang — hanya jika scope/stakeholder berubah drastis |
| 03 | SRS | Fitur baru/berubah, data model berubah |
| 04 | TDD | API/infra/security/arsitektur berubah |
| 05 | Project Plan | Jarang — hanya jika phase structure berubah |
| 06 | Test Plan | Test strategy/coverage berubah, fitur baru perlu TC |
| 07 | Deployment Runbook | Infra/CI-CD/deploy procedure berubah |
| 08 | SLA | Target/maintenance window berubah |
| 09 | Feasibility Study | Jarang — hanya jika cost/tech stack berubah drastis |
| 10 | Release Notes | Setiap release |
| 11 | API Spec | Setiap endpoint baru/berubah |
| 12 | Security Policy | Setiap security mechanism berubah |
| 13 | Coding Standards | Jarang — hanya jika convention berubah |
| 14 | ADR | Setiap keputusan arsitektur baru |
| 15 | GTM Strategy | Marketing/pricing/launch strategy berubah |
| 16 | Competitive Analysis | Competitor baru, feature comparison berubah |
| 17 | Cost Projection | Biaya infra/service berubah, dependency berbayar baru |
| 18 | Analytics Event Taxonomy | Event baru, event naming berubah, tool baru ditambahkan |
| 19 | UI/UX Spec | Design token/component/pattern baru |
| 20 | Roadmap | Phase trigger tercapai, feature planning |
| 21 | Incident Response | Incident procedure berubah |
| 22 | Internal Ops Manual | Ops procedure berubah |
| 23 | User Manual | Setiap fitur user-facing berubah |
| 24 | Postmortem Template | Jarang — hanya jika template format berubah |
| 25 | Monitoring Playbook | Alert/metric/dashboard baru |
| 26 | Legal Pages | Legal/compliance/privacy requirement berubah |
| 27 | Performance Benchmark | Baseline berubah, target baru |
| 28 | Changelog | **Setiap commit yang mengubah behavior** |
| 29 | OpenClaw | Perubahan pada OpenClaw agent system |
| 30 | Onboarding Guide | Setup procedure/tooling/env vars berubah |
| 31 | Database Migration Plan | Setiap migration baru (aktif di Fase 3) |
| 32 | Brand Guidelines | Visual identity/tone/logo berubah |
| 33 | Disaster Recovery Plan | Recovery procedure/infra berubah |
| 34 | API Versioning Strategy | Versioning policy/breaking change berubah |
| — | fase-2/29_Implementation_Backlog_MVP_0.2 | Task selesai, scope Fase 2 berubah |
| — | fase-3/36_Implementation_Backlog_MVP_0.3 | Task selesai, scope Fase 3 berubah |

---

## Update Checklist (Copy-Paste per Commit)

Sebelum commit, agent WAJIB tanya diri sendiri:

```
□ Apakah saya menambah/mengubah API endpoint?   → Update: API Spec (11), SRS (03), API Versioning (34)
□ Apakah saya menambah/mengubah UI/page?        → Update: UI/UX Spec (19), SRS (03), Analytics (18)
□ Apakah saya mengubah infra/config?            → Update: TDD (04), Deployment Runbook (07)
□ Apakah saya mengubah security?                → Update: Security Policy (12), Legal Pages (26)
□ Apakah ini user-facing change?                → Update: User Manual (23), Release Notes (10), Changelog (28)
□ Apakah ini arsitektur decision?               → Update: ADR (14), TDD (04)
□ Apakah saya menambah env variable?            → Update: Deployment Runbook (07), Onboarding Guide (30)
□ Apakah saya menambah analytics event?         → Update: Analytics Event Taxonomy (18)
□ Apakah saya menambah test?                    → Update: Test Plan (06) jika strategy/coverage berubah
□ Apakah saya mengubah design token/branding?   → Update: Brand Guidelines (32), UI/UX Spec (19)
□ Apakah ada biaya baru (service/dependency)?   → Update: Cost Projection (17)
□ Apakah milestone/task selesai?                → Update: Roadmap (20), Backlog fase terkait
```

Jika jawaban "ya" untuk salah satu → **UPDATE DOCS SEBELUM COMMIT.**

---

## Cross-Document Consistency Standards

Jika update docs, pastikan nilai-nilai ini TETAP konsisten di semua docs:

| Standard | Canonical Value | Jika Berubah, Update Semua |
|----------|----------------|---------------------------|
| File retention | 60 menit auto-delete | Docs: 03, 04, 08, 11, 12, 23, 26 |
| Max upload size | 20 MB | Docs: 03, 04, 11, 12, 23 |
| Rate limit | 10 req/menit per IP | Docs: 04, 08, 11, 12 |
| Frontend hosting | Vercel | Docs: 04, 07, 09, 17, 33 |
| Backend hosting | Railway | Docs: 04, 07, 09, 17, 33 |
| Object storage | Cloudflare R2 | Docs: 04, 07, 09, 12, 17, 33 |
| Client PDF library | pdf-lib | Docs: 04, 13, 19 |
| Server PDF engine | PyMuPDF + Ghostscript | Docs: 04, 07, 09 |
| Analytics | Vercel Analytics | Docs: 04, 18, 19 |
| Domain | mypapyr.com | Docs: 07, 15, 26, 32, 33 |
| Language (UI) | Bahasa Indonesia | Docs: 03, 19, 23, 32 |
| Auth | Belum ada (Fase 2+) | Docs: 03, 04, 12, 20 |
| Database | Belum aktif (Fase 3) | Docs: 04, 09, 20, 31 |
| OpenClaw event prefix | `claw_` | Docs: 18, 29 |

---

## Perubahan OpenClaw (Papyr)

> OpenClaw adalah sistem AI agent otonom internal Papyr. Semua perubahan pada OpenClaw WAJIB diikuti update docs yang relevan. Referensi utama: Doc 29 (OpenClaw).

| Trigger | Docs yang WAJIB di-update |
|---------|--------------------------|
| OpenClaw agent code berubah (logic, prompt, pipeline) | OpenClaw (29), TDD (04), API Spec (11) |
| OpenClaw env vars berubah | OpenClaw (29), Deployment Runbook (07) |
| OpenClaw monitoring berubah | OpenClaw (29), Monitoring Playbook (25) |
| OpenClaw security berubah | OpenClaw (29), Security Policy (12) |
| Agent baru ditambahkan ke OpenClaw | OpenClaw (29), SRS (03), Test Plan (06) |

---

*File ini di-maintain oleh AI Agent. Update jika ada docs baru atau aturan sync baru.*
