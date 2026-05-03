# Database Migration Plan

<div align="center">

# PAPYR

## Database Migration Plan

### Dokumen Perencanaan Migrasi Database

**Versi 1.0**

**Juni 2026**

</div>

---

## Informasi Dokumen

| Field           | Detail                                |
|-----------------|---------------------------------------|
| Judul           | Database Migration Plan               |
| ID Dokumen      | PPR-DBM-001                           |
| Versi           | 1.0                                   |
| Status          | Draft                                 |
| Dibuat          | 2026-06-03                            |
| Diperbarui      | 2026-06-03                            |
| Penulis         | OpenCode AI Agent (Sisyphus)          |
| Reviewer        | Muhammad Fa'iz Zulfikar               |
| Approver        | Muhammad Fa'iz Zulfikar               |
| Kerahasiaan     | Internal                              |

---

## Riwayat Versi

| Versi | Tanggal    | Penulis                      | Perubahan                          |
|-------|------------|------------------------------|------------------------------------|
| 1.0   | 2026-06-03 | OpenCode AI Agent (Sisyphus) | Dokumen awal, rencana migrasi penuh |

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Keputusan Database](#2-keputusan-database)
3. [Arsitektur Database](#3-arsitektur-database)
4. [Schema Design: papyr](#4-schema-design-papyr)
5. [Schema Design: openclaw](#5-schema-design-openclaw)
6. [Migration Strategy](#6-migration-strategy)
7. [Migration Tooling](#7-migration-tooling)
8. [Backup Strategy](#8-backup-strategy)
9. [Connection Management](#9-connection-management)
10. [Performance](#10-performance)
11. [Security](#11-security)
12. [Rollback Strategy](#12-rollback-strategy)
13. [Timeline](#13-timeline)
14. [Risiko dan Mitigasi](#14-risiko-dan-mitigasi)
15. [Dokumen Terkait](#15-dokumen-terkait)

---

## 1. Executive Summary

### Kondisi Saat Ini

Papyr saat ini beroperasi sepenuhnya dalam mode **stateless**. Tidak ada database, tidak ada penyimpanan user, tidak ada session management. Setiap request diproses secara independen tanpa menyimpan state apapun. Arsitektur ini cocok untuk fase awal (MVP 0.1 dan 0.2) di mana fokus utama adalah validasi fitur konversi dokumen.

### Kebutuhan Masa Depan

MVP 0.3 memperkenalkan fitur-fitur yang membutuhkan persistent storage:

- **Autentikasi (M23)**: User registration, login, session management
- **User Dashboard (M24)**: Profil pengguna, riwayat penggunaan
- **Usage Tracking (M25)**: Pencatatan penggunaan tool per user untuk enforce rate limit
- **Payment/Subscription (M26)**: Integrasi Midtrans/Xendit, manajemen langganan Pro (Rp 19.900/bulan)
- **API Key Management (M27)**: Pembuatan dan manajemen API key untuk akses programmatic

Selain itu, Fase 2E (M21) akan meluncurkan OpenClaw, sebuah AI agent platform yang membutuhkan 15+ tabel untuk operasinya.

### Tujuan Dokumen

Dokumen ini mendefinisikan strategi migrasi dari arsitektur stateless ke arsitektur berbasis PostgreSQL, mencakup schema design, migration strategy, tooling, backup, security, dan timeline pelaksanaan.

---

## 2. Keputusan Database

### Keputusan: PostgreSQL Self-Hosted pada HostData.id VPS

Setelah evaluasi beberapa opsi, keputusan final adalah menggunakan **PostgreSQL self-hosted** pada VPS HostData.id yang sama dengan deployment OpenClaw.

### Alasan Pemilihan

| Kriteria            | PostgreSQL Self-Hosted | Supabase/Managed | SQLite   |
|---------------------|------------------------|------------------|----------|
| Biaya bulanan       | Rp 0 (sudah ada VPS)  | $25+/bulan       | Rp 0     |
| Kontrol penuh       | Ya                     | Terbatas         | Ya       |
| Skalabilitas        | Tinggi                 | Tinggi           | Rendah   |
| Co-location         | Ya (1 VPS)             | Tidak            | Ya       |
| Multi-schema        | Ya                     | Ya               | Tidak    |
| Concurrent writes   | Tinggi                 | Tinggi           | Rendah   |
| Backup flexibility  | Penuh                  | Terbatas         | Manual   |

### Justifikasi Detail

1. **Efisiensi biaya**: VPS HostData.id sudah tersedia untuk OpenClaw. Menambahkan PostgreSQL di VPS yang sama tidak menambah biaya infrastruktur.

2. **Kontrol penuh**: Self-hosted memberikan kontrol total atas konfigurasi, tuning, backup schedule, dan upgrade path.

3. **Co-location dengan OpenClaw**: OpenClaw juga membutuhkan PostgreSQL. Satu instance PostgreSQL dengan dua schema terpisah lebih efisien daripada dua database terpisah.

4. **Performa**: Latency minimal karena aplikasi dan database berada di server yang sama (localhost connection).

5. **Compliance**: Data pengguna Indonesia tetap di server Indonesia (HostData.id berlokasi di Indonesia).

---

## 3. Arsitektur Database

### Topologi

```
┌─────────────────────────────────────────────────────────┐
│                  HostData.id VPS                         │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              PostgreSQL 16                         │  │
│  │                                                   │  │
│  │  ┌─────────────────┐  ┌────────────────────────┐ │  │
│  │  │  Schema: papyr  │  │  Schema: openclaw      │ │  │
│  │  │                 │  │                        │ │  │
│  │  │  - users        │  │  - oc_agents          │ │  │
│  │  │  - sessions     │  │  - oc_conversations   │ │  │
│  │  │  - usage_logs   │  │  - oc_messages        │ │  │
│  │  │  - subscriptions│  │  - oc_tools           │ │  │
│  │  │  - api_keys     │  │  - oc_executions      │ │  │
│  │  │                 │  │  - ... (15+ tabel)     │ │  │
│  │  └─────────────────┘  └────────────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Papyr App   │  │  OpenClaw    │  │  PgBouncer   │  │
│  │  (Next.js)   │  │  (Agent)     │  │  (Pooler)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Prinsip Arsitektur

1. **Schema separation**: Setiap aplikasi memiliki schema sendiri. Tidak ada cross-schema query tanpa explicit permission.
2. **Shared instance**: Satu PostgreSQL instance melayani kedua schema untuk efisiensi resource.
3. **Connection pooling**: PgBouncer di depan PostgreSQL untuk manajemen koneksi yang efisien.
4. **Least privilege**: Setiap aplikasi hanya punya akses ke schema miliknya.

---

## 4. Schema Design: papyr

### ER Diagram

```
┌──────────────────┐       ┌──────────────────┐
│      users       │       │     sessions     │
├──────────────────┤       ├──────────────────┤
│ id (PK, UUID)    │──┐    │ id (PK, UUID)    │
│ email (UNIQUE)   │  │    │ user_id (FK)     │──┐
│ password_hash    │  │    │ token (UNIQUE)   │  │
│ name             │  │    │ expires_at       │  │
│ role             │  │    │ created_at       │  │
│ plan             │  └────│                  │  │
│ created_at       │       └──────────────────┘  │
│ updated_at       │                             │
└──────────────────┘                             │
        │                                        │
        │       ┌──────────────────┐             │
        │       │    usage_logs    │             │
        │       ├──────────────────┤             │
        ├───────│ id (PK, UUID)    │             │
        │       │ user_id (FK)     │─────────────┘
        │       │ tool_name        │
        │       │ file_size        │
        │       │ processing_time  │
        │       │ status           │
        │       │ created_at       │
        │       └──────────────────┘
        │
        │       ┌──────────────────────┐
        │       │    subscriptions     │
        │       ├──────────────────────┤
        ├───────│ id (PK, UUID)        │
        │       │ user_id (FK)         │
        │       │ plan                 │
        │       │ status               │
        │       │ started_at           │
        │       │ expires_at           │
        │       │ payment_provider     │
        │       │ payment_id           │
        │       └──────────────────────┘
        │
        │       ┌──────────────────────┐
        │       │      api_keys        │
        │       ├──────────────────────┤
        └───────│ id (PK, UUID)        │
                │ user_id (FK)         │
                │ key_hash (UNIQUE)    │
                │ name                 │
                │ permissions          │
                │ rate_limit           │
                │ created_at           │
                │ last_used_at         │
                │ revoked_at           │
                └──────────────────────┘
```

### DDL: Tabel users

```sql
CREATE TABLE papyr.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user'
        CHECK (role IN ('user', 'admin')),
    plan VARCHAR(20) NOT NULL DEFAULT 'free'
        CHECK (plan IN ('free', 'free_login', 'pro')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON papyr.users(email);
CREATE INDEX idx_users_plan ON papyr.users(plan);

-- Trigger untuk auto-update updated_at
CREATE OR REPLACE FUNCTION papyr.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON papyr.users
    FOR EACH ROW EXECUTE FUNCTION papyr.update_updated_at();
```

### DDL: Tabel sessions

```sql
CREATE TABLE papyr.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES papyr.users(id) ON DELETE CASCADE,
    token VARCHAR(512) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON papyr.sessions(user_id);
CREATE INDEX idx_sessions_token ON papyr.sessions(token);
CREATE INDEX idx_sessions_expires_at ON papyr.sessions(expires_at);
```

### DDL: Tabel usage_logs

```sql
CREATE TABLE papyr.usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES papyr.users(id) ON DELETE CASCADE,
    tool_name VARCHAR(50) NOT NULL
        CHECK (tool_name IN ('ocr', 'pdf_to_word', 'compress_pdf', 'merge_pdf', 'image_convert')),
    file_size BIGINT NOT NULL DEFAULT 0,
    processing_time INTEGER NOT NULL DEFAULT 0, -- dalam milidetik
    status VARCHAR(20) NOT NULL DEFAULT 'success'
        CHECK (status IN ('success', 'failed', 'timeout')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usage_logs_user_id ON papyr.usage_logs(user_id);
CREATE INDEX idx_usage_logs_tool_name ON papyr.usage_logs(tool_name);
CREATE INDEX idx_usage_logs_created_at ON papyr.usage_logs(created_at);

-- Index komposit untuk query rate limit harian
CREATE INDEX idx_usage_logs_user_tool_date
    ON papyr.usage_logs(user_id, tool_name, created_at DESC);
```

### DDL: Tabel subscriptions

```sql
CREATE TABLE papyr.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES papyr.users(id) ON DELETE CASCADE,
    plan VARCHAR(20) NOT NULL
        CHECK (plan IN ('free_login', 'pro')),
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'expired', 'cancelled', 'pending')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    payment_provider VARCHAR(20)
        CHECK (payment_provider IN ('midtrans', 'xendit', NULL)),
    payment_id VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON papyr.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON papyr.subscriptions(status);
CREATE INDEX idx_subscriptions_expires_at ON papyr.subscriptions(expires_at);
```

### DDL: Tabel api_keys

```sql
CREATE TABLE papyr.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES papyr.users(id) ON DELETE CASCADE,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    permissions JSONB NOT NULL DEFAULT '["read"]'::jsonb,
    rate_limit INTEGER NOT NULL DEFAULT 100, -- requests per jam
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_api_keys_user_id ON papyr.api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON papyr.api_keys(key_hash);
CREATE INDEX idx_api_keys_revoked ON papyr.api_keys(revoked_at)
    WHERE revoked_at IS NULL;
```

---

## 5. Schema Design: openclaw

Schema `openclaw` berisi 15+ tabel yang mendukung operasi AI agent platform OpenClaw. Detail lengkap schema ini didokumentasikan dalam **PPR-CLAW-001** (Dokumen 30: OpenClaw Technical Specification).

### Ringkasan Tabel

Semua tabel dalam schema ini menggunakan prefix `oc_`:

| Tabel               | Fungsi                                    |
|---------------------|-------------------------------------------|
| oc_agents           | Definisi dan konfigurasi agent            |
| oc_conversations    | Sesi percakapan dengan agent              |
| oc_messages         | Pesan individual dalam percakapan         |
| oc_tools            | Registry tool yang tersedia               |
| oc_executions       | Log eksekusi tool oleh agent              |
| oc_knowledge_bases  | Knowledge base untuk RAG                  |
| oc_documents        | Dokumen dalam knowledge base              |
| oc_embeddings       | Vector embeddings untuk semantic search   |
| oc_workflows        | Definisi workflow multi-step              |
| oc_workflow_steps   | Step individual dalam workflow            |
| oc_api_configs      | Konfigurasi API eksternal                 |
| oc_usage_metrics    | Metrik penggunaan (token, cost)           |
| oc_feedback         | Feedback pengguna terhadap response       |
| oc_templates        | Template prompt yang reusable             |
| oc_audit_logs       | Audit trail untuk compliance              |

### Referensi

Untuk DDL lengkap, constraint, index, dan relasi antar tabel, lihat:
- **PPR-CLAW-001** bagian Database Schema (Dokumen 30)

---

## 6. Migration Strategy

### Pendekatan: Phased Migration

Migrasi dilakukan secara bertahap mengikuti milestone MVP 0.3. Setiap phase menambahkan tabel baru tanpa mengubah tabel yang sudah ada (additive-only approach).

### Fase 1: Foundation (MVP 0.3, Milestone M23)

**Tujuan**: Setup PostgreSQL dan tabel dasar untuk autentikasi.

Langkah-langkah:
1. Install PostgreSQL 16 pada VPS HostData.id
2. Konfigurasi pg_hba.conf untuk local-only access
3. Buat database `papyr_production`
4. Buat schema `papyr`
5. Jalankan migration: `001_create_users.sql`
6. Jalankan migration: `002_create_sessions.sql`
7. Buat role `papyr_app` dengan akses terbatas
8. Setup PgBouncer

**Validasi**: User registration dan login berfungsi end-to-end.

### Fase 2: Usage Tracking (MVP 0.3, Milestone M25)

**Tujuan**: Pencatatan penggunaan tool untuk enforce rate limit.

Langkah-langkah:
1. Jalankan migration: `003_create_usage_logs.sql`
2. Implementasi rate limit query
3. Backfill data jika diperlukan

**Validasi**: Rate limit 5x/hari per tool untuk plan free_login berfungsi.

### Fase 3: Subscriptions (MVP 0.3, Milestone M26)

**Tujuan**: Manajemen langganan dan integrasi payment gateway.

Langkah-langkah:
1. Jalankan migration: `004_create_subscriptions.sql`
2. Integrasi webhook Midtrans/Xendit
3. Implementasi upgrade/downgrade flow

**Validasi**: Pembayaran Pro (Rp 19.900/bulan) tercatat dan plan user terupdate otomatis.

### Fase 4: API Keys (MVP 0.3, Milestone M27)

**Tujuan**: Akses programmatic via API key.

Langkah-langkah:
1. Jalankan migration: `005_create_api_keys.sql`
2. Implementasi key generation dan validation
3. Rate limiting per API key

**Validasi**: API key dapat dibuat, digunakan, dan di-revoke.

### Fase 5: OpenClaw (Fase 2E, Milestone M21)

**Tujuan**: Setup schema openclaw untuk AI agent platform.

Langkah-langkah:
1. Buat schema `openclaw`
2. Buat role `openclaw_app`
3. Jalankan migration batch: `006_create_openclaw_schema.sql` sampai `020_create_oc_audit_logs.sql`
4. Setup pgvector extension untuk embeddings

**Validasi**: Semua 15+ tabel oc_ terbuat dengan relasi yang benar.

---

## 7. Migration Tooling

### Rekomendasi Utama: Raw SQL Migration Files

Untuk Papyr (Next.js), pendekatan yang direkomendasikan adalah **raw SQL migration files** yang disimpan dalam direktori `migrations/`.

### Struktur Direktori

```
papyr/
├── migrations/
│   ├── 001_create_users.sql
│   ├── 001_create_users.down.sql
│   ├── 002_create_sessions.sql
│   ├── 002_create_sessions.down.sql
│   ├── 003_create_usage_logs.sql
│   ├── 003_create_usage_logs.down.sql
│   ├── 004_create_subscriptions.sql
│   ├── 004_create_subscriptions.down.sql
│   ├── 005_create_api_keys.sql
│   ├── 005_create_api_keys.down.sql
│   └── ...
├── scripts/
│   ├── migrate.sh          # Script untuk menjalankan migration
│   └── rollback.sh         # Script untuk rollback
└── ...
```

### Konvensi Penamaan

- Format: `{nomor_urut}_{deskripsi}.sql`
- Nomor urut: 3 digit, dimulai dari 001
- Deskripsi: snake_case, singkat dan jelas
- File down: tambahkan `.down.sql` untuk rollback script

### Migration Tracking Table

```sql
CREATE TABLE papyr.schema_migrations (
    version INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Alternatif: Drizzle ORM

Jika tim memutuskan untuk menggunakan TypeScript-native approach (terutama untuk OpenClaw yang berbasis TypeScript), **Drizzle ORM** adalah alternatif yang viable:

```typescript
// Contoh schema definition dengan Drizzle
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().default('user'),
  plan: varchar('plan', { length: 20 }).notNull().default('free'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
```

### Keputusan

Untuk Fase 1-4 (Papyr), gunakan **raw SQL**. Sederhana, tidak ada dependency tambahan, mudah di-review.

Untuk Fase 5 (OpenClaw), evaluasi ulang apakah Drizzle ORM lebih cocok mengingat codebase TypeScript.

---

## 8. Backup Strategy

### Strategi Backup

| Komponen        | Frekuensi | Retensi  | Tujuan                    |
|-----------------|-----------|----------|---------------------------|
| Full backup     | Harian    | 30 hari  | Cloudflare R2 atau AWS S3 |
| WAL archiving   | Kontinu   | 7 hari   | Local disk                |
| Weekly restore  | Mingguan  | N/A      | Validasi integritas       |

### Script Backup Harian

```bash
#!/bin/bash
# /opt/scripts/backup_postgres.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/postgres"
S3_BUCKET="s3://papyr-backups/postgres"

# Full dump dengan kompresi
pg_dump -U postgres -d papyr_production \
    --format=custom \
    --compress=9 \
    -f "${BACKUP_DIR}/papyr_${DATE}.dump"

# Upload ke R2/S3
aws s3 cp "${BACKUP_DIR}/papyr_${DATE}.dump" \
    "${S3_BUCKET}/daily/papyr_${DATE}.dump"

# Hapus backup lokal lebih dari 7 hari
find ${BACKUP_DIR} -name "*.dump" -mtime +7 -delete

# Hapus backup remote lebih dari 30 hari
aws s3 ls ${S3_BUCKET}/daily/ | \
    awk '{print $4}' | \
    while read file; do
        # Logic penghapusan file > 30 hari
    done
```

### Restore Test Mingguan

Setiap minggu, backup terbaru di-restore ke environment staging untuk memvalidasi:
1. Integritas data (tidak corrupt)
2. Waktu restore (harus < 15 menit untuk ukuran DB saat ini)
3. Aplikasi berfungsi normal dengan data yang di-restore

### Cron Schedule

```cron
# Backup harian jam 02:00 WIB
0 2 * * * /opt/scripts/backup_postgres.sh

# Restore test setiap Minggu jam 04:00 WIB
0 4 * * 0 /opt/scripts/restore_test.sh
```

---

## 9. Connection Management

### Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]?schema=[schema]
```

### Environment Variables

```env
# Papyr Application
DATABASE_URL=postgresql://papyr_app:${POSTGRES_PASSWORD}@localhost:5432/papyr_production?schema=papyr
POSTGRES_USER=papyr_app
POSTGRES_PASSWORD=<generated_secure_password>
POSTGRES_DB=papyr_production
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# PgBouncer (jika digunakan)
PGBOUNCER_URL=postgresql://papyr_app:${POSTGRES_PASSWORD}@localhost:6432/papyr_production
```

### PgBouncer Configuration

```ini
; /etc/pgbouncer/pgbouncer.ini

[databases]
papyr_production = host=localhost port=5432 dbname=papyr_production

[pgbouncer]
listen_addr = 127.0.0.1
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt

; Pool settings
pool_mode = transaction
default_pool_size = 20
max_client_conn = 100
min_pool_size = 5

; Timeouts
server_idle_timeout = 600
client_idle_timeout = 0
query_timeout = 30
```

### Connection Pool Sizing

Untuk VPS dengan resource terbatas, formula pool size:

```
pool_size = (jumlah_cpu_core * 2) + jumlah_disk_spindle
```

Dengan asumsi VPS 2 core, 1 SSD:
- Optimal pool size: (2 * 2) + 1 = **5 koneksi per aplikasi**
- Max pool size: **20 koneksi** (termasuk buffer)

---

## 10. Performance

### Strategi Indexing

#### Prinsip Umum

1. Setiap foreign key harus memiliki index
2. Kolom yang sering digunakan di WHERE clause harus di-index
3. Composite index untuk query pattern yang sering digunakan
4. Partial index untuk query dengan filter spesifik

#### Index Kritis untuk Rate Limiting

Query rate limit adalah query paling sering dijalankan. Harus optimal:

```sql
-- Query: Berapa kali user X menggunakan tool Y hari ini?
SELECT COUNT(*) FROM papyr.usage_logs
WHERE user_id = $1
  AND tool_name = $2
  AND created_at >= CURRENT_DATE;

-- Index yang mendukung query ini:
CREATE INDEX idx_usage_logs_user_tool_date
    ON papyr.usage_logs(user_id, tool_name, created_at DESC);
```

### Query Optimization Guidelines

1. **Gunakan EXPLAIN ANALYZE** untuk setiap query baru sebelum production
2. **Hindari SELECT ***, selalu spesifikkan kolom yang dibutuhkan
3. **Pagination** menggunakan cursor-based (keyed pagination), bukan OFFSET
4. **Batch insert** untuk usage_logs jika volume tinggi
5. **Prepared statements** untuk query yang berulang

### Monitoring dengan pg_stat_statements

```sql
-- Aktifkan extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Query untuk melihat slow queries
SELECT
    query,
    calls,
    mean_exec_time,
    total_exec_time,
    rows
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;
```

### Maintenance Otomatis

```sql
-- Autovacuum settings (postgresql.conf)
-- Untuk tabel usage_logs yang high-write:
ALTER TABLE papyr.usage_logs SET (
    autovacuum_vacuum_scale_factor = 0.05,
    autovacuum_analyze_scale_factor = 0.02
);
```

---

## 11. Security

### Encrypted Connections (SSL)

```ini
# postgresql.conf
ssl = on
ssl_cert_file = '/etc/ssl/certs/postgres.crt'
ssl_key_file = '/etc/ssl/private/postgres.key'
ssl_min_protocol_version = 'TLSv1.2'
```

### Role-Based Access Control

```sql
-- Role untuk aplikasi Papyr (read/write pada schema papyr saja)
CREATE ROLE papyr_app LOGIN PASSWORD 'secure_password_here';
GRANT USAGE ON SCHEMA papyr TO papyr_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA papyr TO papyr_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA papyr TO papyr_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA papyr
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO papyr_app;

-- Role untuk aplikasi OpenClaw (read/write pada schema openclaw saja)
CREATE ROLE openclaw_app LOGIN PASSWORD 'secure_password_here';
GRANT USAGE ON SCHEMA openclaw TO openclaw_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA openclaw TO openclaw_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA openclaw TO openclaw_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA openclaw
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO openclaw_app;

-- Role readonly untuk monitoring dan reporting
CREATE ROLE papyr_readonly LOGIN PASSWORD 'secure_password_here';
GRANT USAGE ON SCHEMA papyr TO papyr_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA papyr TO papyr_readonly;
GRANT USAGE ON SCHEMA openclaw TO papyr_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA openclaw TO papyr_readonly;
```

### Prinsip Security

| Prinsip                    | Implementasi                                      |
|----------------------------|---------------------------------------------------|
| Least privilege            | Setiap app hanya akses schema sendiri             |
| No superuser in app        | Aplikasi tidak pernah connect sebagai postgres     |
| Password rotation          | Rotasi password setiap 90 hari                    |
| Connection restriction     | pg_hba.conf: hanya localhost dan IP tertentu      |
| Audit logging              | Log semua DDL changes dan failed auth attempts    |
| Data encryption at rest    | Full disk encryption pada VPS                     |

### pg_hba.conf

```
# TYPE  DATABASE        USER            ADDRESS         METHOD
local   all             postgres                        peer
local   all             papyr_app                       md5
local   all             openclaw_app                    md5
local   all             papyr_readonly                  md5
host    all             all             127.0.0.1/32    md5
host    all             all             ::1/128         md5
# Tolak semua koneksi remote
host    all             all             0.0.0.0/0       reject
```

---

## 12. Rollback Strategy

### Prinsip Rollback

Setiap migration file memiliki pasangan **up** (forward) dan **down** (rollback). Rollback harus diuji sebelum migration dijalankan di production.

### Contoh Rollback Script

```sql
-- 001_create_users.down.sql
DROP TRIGGER IF EXISTS trg_users_updated_at ON papyr.users;
DROP FUNCTION IF EXISTS papyr.update_updated_at();
DROP TABLE IF EXISTS papyr.users CASCADE;
```

```sql
-- 002_create_sessions.down.sql
DROP TABLE IF EXISTS papyr.sessions CASCADE;
```

### Prosedur Rollback

1. **Sebelum migration production**: Jalankan up + down + up di environment staging
2. **Jika migration gagal**: Jalankan down script untuk versi yang gagal
3. **Jika data corruption**: Restore dari backup terakhir yang valid
4. **Komunikasi**: Notify tim via channel yang ditentukan sebelum rollback

### Rollback Checklist

```
[ ] Down script sudah ditulis dan di-review
[ ] Down script sudah ditest di staging
[ ] Backup terbaru sudah diverifikasi
[ ] Tim sudah dinotifikasi
[ ] Monitoring aktif selama rollback
[ ] Validasi post-rollback: aplikasi berfungsi normal
```

### Batasan Rollback

Beberapa operasi tidak bisa di-rollback secara sempurna:
- **Data deletion**: Jika up script menghapus data, down script tidak bisa mengembalikannya
- **Column type change**: Perubahan tipe data mungkin lossy
- **Constraint addition**: Jika data sudah melanggar constraint yang di-rollback

Untuk kasus-kasus ini, **restore dari backup** adalah satu-satunya opsi yang aman.

---

## 13. Timeline

### Alignment dengan MVP 0.3 Milestones

```
2026
│
├── M23 (Milestone 23) ─── Fase 1: PostgreSQL Setup + Users + Sessions
│   ├── Week 1: Install PostgreSQL, konfigurasi, setup PgBouncer
│   ├── Week 2: Create schema, run migrations 001-002
│   └── Week 3: Integration testing, auth flow validation
│
├── M24 (Milestone 24) ─── (Tidak ada migration, menggunakan tabel existing)
│   └── User Dashboard menggunakan tabel users yang sudah ada
│
├── M25 (Milestone 25) ─── Fase 2: Usage Tracking
│   ├── Week 1: Run migration 003
│   └── Week 2: Rate limit implementation + testing
│
├── M26 (Milestone 26) ─── Fase 3: Subscriptions
│   ├── Week 1: Run migration 004
│   ├── Week 2: Payment gateway integration
│   └── Week 3: End-to-end payment flow testing
│
├── M27 (Milestone 27) ─── Fase 4: API Keys
│   ├── Week 1: Run migration 005
│   └── Week 2: API key generation + validation testing
│
└── Fase 2E, M21 ──────── Fase 5: OpenClaw Schema
    ├── Week 1: Create openclaw schema, install pgvector
    ├── Week 2: Run migrations 006-020
    └── Week 3: Integration testing dengan OpenClaw agent
```

### Estimasi Durasi per Phase

| Phase   | Milestone | Durasi Estimasi | Dependencies              |
|---------|-----------|-----------------|---------------------------|
| Fase 1 | M23       | 3 minggu        | VPS ready, domain ready   |
| Fase 2 | M25       | 2 minggu        | Fase 1 selesai           |
| Fase 3 | M26       | 3 minggu        | Fase 2 selesai, Midtrans |
| Fase 4 | M27       | 2 minggu        | Fase 1 selesai           |
| Fase 5 | 2E-M21    | 3 minggu        | Fase 1 selesai           |

---

## 14. Risiko dan Mitigasi

| No | Risiko                                    | Dampak  | Probabilitas | Mitigasi                                                    |
|----|-------------------------------------------|---------|--------------|-------------------------------------------------------------|
| 1  | VPS down, database tidak accessible       | Tinggi  | Rendah       | Daily backup ke R2/S3, restore procedure terdokumentasi     |
| 2  | Disk penuh karena usage_logs membengkak   | Sedang  | Sedang       | Partitioning by month, auto-archive data > 6 bulan          |
| 3  | Connection exhaustion saat traffic spike  | Sedang  | Sedang       | PgBouncer pooling, connection limit per role                 |
| 4  | Data breach / unauthorized access         | Tinggi  | Rendah       | SSL, least privilege roles, no remote access, disk encryption|
| 5  | Migration gagal di production             | Sedang  | Rendah       | Test di staging dulu, rollback script ready, backup sebelum  |
| 6  | Performance degradation seiring waktu     | Sedang  | Sedang       | pg_stat_statements monitoring, regular VACUUM, index review  |
| 7  | Konflik schema antara papyr dan openclaw  | Rendah  | Rendah       | Schema separation ketat, no cross-schema access              |
| 8  | Password/credential leak                  | Tinggi  | Rendah       | Environment variables, tidak hardcode, rotasi 90 hari        |
| 9  | PostgreSQL version incompatibility        | Rendah  | Rendah       | Pin ke PostgreSQL 16, test upgrade di staging                |
| 10 | Backup corrupt / tidak bisa di-restore    | Tinggi  | Rendah       | Weekly restore test, checksum validation                     |

### Contingency Plan

Jika VPS HostData.id mengalami downtime berkepanjangan (> 4 jam):
1. Restore backup terbaru ke VPS alternatif
2. Update DNS/connection string
3. Validasi data integrity
4. Resume operasi normal

---

## 15. Dokumen Terkait

| ID Dokumen   | Judul                              | Relevansi                              |
|--------------|------------------------------------|----------------------------------------|
| PPR-CLAW-001 | OpenClaw Technical Specification   | Schema detail untuk openclaw (15+ tabel)|
| PPR-MVP-003  | MVP 0.3 Roadmap                    | Timeline milestone M23-M27             |
| PPR-SEC-001  | Security Policy                    | Kebijakan keamanan data                |
| PPR-INF-001  | Infrastructure Plan                | Spesifikasi VPS HostData.id            |
| PPR-PAY-001  | Payment Integration Spec           | Detail integrasi Midtrans/Xendit       |

---

## Persetujuan Dokumen

| Peran     | Nama                      | Tanda Tangan | Tanggal    |
|-----------|---------------------------|--------------|------------|
| Penulis   | OpenCode AI Agent (Sisyphus) | _________  | 2026-06-03 |
| Reviewer  | Muhammad Fa'iz Zulfikar   | _________    | __________ |
| Approver  | Muhammad Fa'iz Zulfikar   | _________    | __________ |

---

*Dokumen ini bersifat internal dan rahasia. Distribusi hanya untuk pihak yang berkepentingan.*
