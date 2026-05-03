# Papyr — Ops Autopilot

> **Prinsip: Agent menjalankan semua maintenance tanpa founder ingatkan.**
> File ini adalah instruksi operasional post-launch. Berlaku setelah Fase 2D selesai (M20 deployed).

---

## Kapan File Ini Digunakan

- Setelah Fase 2D selesai dan M20 (Monitoring & Alerting) sudah live
- Founder bilang "maintenance", "cek sistem", "daily check", atau "ops"
- Agent memulai sesi baru dan progress menunjukkan M20+ aktif
- Setelah M21 (OpenClaw), tambahan checklist OpenClaw juga berlaku

---

## 1. Daily Checklist (Setiap Sesi)

> Agent WAJIB jalankan ini di awal setiap sesi kerja saat M20+.
> Jangan tanya "mau saya cek?" — LANGSUNG cek.

| # | Task | Cara Cek | Jika Bermasalah |
|---|------|----------|-----------------|
| 1 | Vercel — mypapyr.com bisa diakses, tidak ada deployment error | Buka mypapyr.com + cek Vercel dashboard | Cek Vercel deployment logs, rollback jika perlu. Ikuti Incident Response (doc 21) |
| 2 | Railway — backend health check hijau | `curl https://papyr-production.up.railway.app/health` | Cek Railway logs, restart service. Ikuti Deployment Runbook (doc 07) |
| 3 | Cloudflare R2 — cron cleanup berjalan, tidak ada file expired menumpuk | Cek R2 bucket via dashboard atau API | Trigger manual cleanup, investigasi cron schedule |
| 4 | GitHub Actions — tidak ada workflow gagal | `gh run list --limit 5` | Investigasi dan fix. Cek test results (23 vitest + 34 pytest) |
| 5 | BetterStack — tidak ada alert aktif | BetterStack dashboard + cek Telegram alerts | Ikuti Monitoring Playbook (doc 25) |
| 6 | Error logs — tidak ada error baru di Railway | Railway logs dashboard, filter ERROR | Investigasi, buat GitHub Issue jika bug |
| 7 | GitHub Issues — ada laporan user baru? | `gh issue list --state open` | Triage dan assign priority label |

### Tambahan Setelah M21 (OpenClaw)

| # | Task | Cara Cek | Jika Bermasalah |
|---|------|----------|-----------------|
| 8 | OpenClaw — semua 10 agent aktif di HostData.id VPS | `docker ps` di VPS, pastikan 10 container running | Restart container yang mati, cek logs |
| 9 | Warta — laporan harian terkirim | Cek output Warta di channel yang ditentukan | Restart Warta agent, cek konfigurasi |
| 10 | Kicau — aktivitas Twitter/X berjalan | Cek timeline akun, pastikan posting terjadwal jalan | Cek Kicau logs, pastikan API key valid |

**Output:** Laporkan ke founder: "Daily check ✅ — semua hijau" atau "Daily check ⚠️ — [masalah] — sedang ditangani"

---

## 2. Weekly Tasks (Setiap Minggu / 7 Sesi)

> Agent track kapan terakhir weekly task dijalankan.
> Jika sudah 7+ hari sejak terakhir, LANGSUNG jalankan.

| # | Task | Referensi Doc |
|---|------|---------------|
| 1 | Review Vercel Analytics — traffic trends, top pages, referral sources, bounce rate | Internal Ops Manual (doc 22) |
| 2 | Review tool usage — tool mana paling sering dipakai, conversion rate per tool | Internal Ops Manual (doc 22) |
| 3 | Dependency audit — cek Dependabot alerts, auto-merge patch versions | Security Policy (doc 12) |
| 4 | Spot-check R2 — pastikan file expired benar-benar terhapus, tidak ada orphan files | Internal Ops Manual (doc 22) |
| 5 | SEO review — cek Google Search Console, indexing status, crawl errors | Internal Ops Manual (doc 22) |
| 6 | Review community feedback (jika ada channel aktif) — catat feature requests | Internal Ops Manual (doc 22) |

### Tambahan Setelah M21 (OpenClaw)

| # | Task | Referensi Doc |
|---|------|---------------|
| 7 | Review laporan mingguan Warta — ringkasan performa semua agent | Internal Ops Manual (doc 22) |
| 8 | Review SEO pipeline Aksara — artikel yang dipublish, keyword ranking | Internal Ops Manual (doc 22) |
| 9 | Review Pustaka backup status — pastikan backup mingguan berhasil | Internal Ops Manual (doc 22) |

**Output:** Buat ringkasan weekly di GitHub Issue atau commit ke `docs/ops-logs/weekly-YYYY-WW.md`

---

## 3. Monthly Tasks (Setiap Bulan)

> Agent track kapan terakhir monthly task dijalankan.

| # | Task | Referensi Doc |
|---|------|---------------|
| 1 | R2 storage review — total usage, growth trend, estimasi kapan mendekati free tier limit (10 GB/bulan) | Cost Projection (doc 17) |
| 2 | Railway resource review — CPU, RAM, bandwidth usage, estimasi biaya | Cost Projection (doc 17) |
| 3 | Cost review — total biaya infra bulan ini (Vercel, Railway, R2, domain) vs budget | Cost Projection (doc 17), Feasibility Study (doc 09) |
| 4 | Dependency minor/patch updates — test di local, pastikan CI hijau, merge | Security Policy (doc 12) |
| 5 | Google Search Console review — indexing issues, manual actions, search performance trends | Internal Ops Manual (doc 22) |
| 6 | Review open GitHub Issues — close stale issues, reprioritize backlog | — |
| 7 | Update Changelog (doc 28) jika ada release bulan ini | Changelog (doc 28) |
| 8 | Generate monthly report — kirim ke founder via Telegram | Monitoring Playbook (doc 25) |

### Tambahan Setelah M21 (OpenClaw)

| # | Task | Referensi Doc |
|---|------|---------------|
| 9 | HostData.id VPS resource review — CPU, RAM, disk usage, bandwidth | Cost Projection (doc 17) |
| 10 | OpenClaw agent performance review — uptime per agent, error rate, task completion rate | Internal Ops Manual (doc 22) |
| 11 | Review Kicau engagement metrics — impressions, clicks, follower growth | Internal Ops Manual (doc 22) |
| 12 | Review Aksara content output — artikel published, organic traffic dari konten | Internal Ops Manual (doc 22) |

**Output:** Commit `docs/ops-logs/monthly-YYYY-MM.md` dengan ringkasan semua findings

---

## 4. Quarterly Tasks (Setiap 3 Bulan)

| # | Task | Referensi Doc |
|---|------|---------------|
| 1 | Full security audit — OWASP Top 10 review, cek signed URL implementation, rate limiting | Security Policy (doc 12) |
| 2 | Dependency major version evaluation — buat branch test, document migration steps | Security Policy (doc 12) |
| 3 | Performance benchmark — jalankan load test pada semua tool endpoints, bandingkan dengan baseline | Performance Benchmark (doc 27) |
| 4 | Docs review — baca semua docs, update yang outdated | Internal Ops Manual (doc 22) |
| 5 | Secret rotation — rotate R2 keys, Railway tokens, Vercel tokens, API keys | Security Policy (doc 12) |
| 6 | SSL/TLS check — pastikan sertifikat Vercel dan Railway masih valid | Deployment Runbook (doc 07) |
| 7 | Disaster Recovery drill — simulasi 1 skenario dari DR plan | Disaster Recovery (doc 33) |
| 8 | Review SLA compliance — hitung uptime aktual vs target | SLA (doc 08) |
| 9 | Vercel Analytics deep dive — user behavior patterns, device breakdown, geographic distribution | Internal Ops Manual (doc 22) |

### Tambahan Setelah M21 (OpenClaw)

| # | Task | Referensi Doc |
|---|------|---------------|
| 10 | OpenClaw full audit — review semua 10 agent configs, update prompts jika perlu | Internal Ops Manual (doc 22) |
| 11 | VPS security audit — update OS packages, review firewall rules, cek Docker image versions | Security Policy (doc 12) |
| 12 | Pustaka backup restore test — restore 1 backup ke environment terpisah, verifikasi integritas | Disaster Recovery (doc 33) |

**Output:** Commit `docs/ops-logs/quarterly-YYYY-QN.md` dengan full report

---

## 5. On-Demand / Triggered Tasks

| Trigger | Action | Referensi |
|---------|--------|-----------|
| Critical CVE published (dependency) | Patch within 24 hours, deploy, verifikasi | Security Policy (doc 12) |
| Railway resource spike > 80% | Alert founder, investigasi traffic source, plan upgrade jika perlu | Cost Projection (doc 17) |
| R2 storage mendekati free tier limit | Alert founder, review cleanup policy, pertimbangkan retention lebih pendek | Cost Projection (doc 17) |
| BetterStack alert / downtime terdeteksi | Ikuti Incident Response playbook | Incident Response (doc 21), Monitoring Playbook (doc 25) |
| User melaporkan bug | Triage, buat GitHub Issue, fix, deploy | Internal Ops Manual (doc 22) |
| Health check gagal | Cek Railway logs, restart jika perlu, rollback jika deployment baru | Deployment Runbook (doc 07) |
| GitHub Actions CI gagal di main | Investigasi, fix, jangan merge PR lain sampai CI hijau | Deployment Runbook (doc 07) |
| OpenClaw agent down (setelah M21) | Restart container, cek logs, eskalasi jika berulang | Internal Ops Manual (doc 22) |

---

## 6. Fase 3 Trigger Monitoring

> Agent WAJIB cek ini di setiap monthly review.
> Fase 3 = ekspansi fitur lanjutan, monetisasi, atau scaling besar.

| Metric | Target | Cara Cek | Action Saat Tercapai |
|--------|--------|----------|---------------------|
| Monthly visitors | 10,000+ | Vercel Analytics | Alert founder: "Fase 3 trigger — traffic sudah cukup tinggi" |
| Tool usage per hari | 500+ operasi | Vercel Analytics custom events | Lapor ke founder |
| Uptime (3 bulan terakhir) | 99.5%+ | BetterStack uptime report | Lapor ke founder |
| Critical bugs | 0 open | GitHub Issues filter `critical` | Harus 0 sebelum Fase 3 |
| R2 usage trend | Mendekati 80% free tier | R2 dashboard | Pertimbangkan upgrade atau optimasi |
| OpenClaw stability (setelah M21) | Semua 10 agent uptime > 95% | Docker stats di VPS | Lapor ke founder |

---

## 7. Ops Log Format

Setiap ops activity di-log ke `docs/ops-logs/`:

```
docs/ops-logs/
├── daily-2026-05-15.md        (hanya jika ada issue)
├── weekly-2026-W20.md
├── monthly-2026-05.md
└── quarterly-2026-Q2.md
```

Template:

```markdown
# [Daily/Weekly/Monthly/Quarterly] Ops Log — [DATE]

## Status: ✅ All Clear / ⚠️ Issues Found

## Checks Performed
- [ ] Check 1 — result
- [ ] Check 2 — result

## Issues Found
- None / [describe issue + action taken]

## Metrics
- Uptime: XX.X%
- Vercel Analytics: XXX visitors minggu ini
- R2 Storage: XX MB / 10 GB free tier
- Railway usage: CPU XX%, RAM XX MB
- Error rate: X.XX%
- Tool usage: XXX operasi (compress: XX, merge: XX, split: XX, ...)

## Actions Taken
- [what was done]

## Next Actions
- [what needs follow-up]
```

---

*File ini di-maintain oleh AI Agent. Update jika ada perubahan infrastruktur atau prosedur operasional.*
