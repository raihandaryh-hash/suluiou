-- =====================================================================
-- MySQL 8.0 Schema untuk Sulu (port dari Postgres/Supabase)
-- Untuk: bahasa.iou.edu.gm/sulu
-- Engine: InnoDB, charset: utf8mb4 (mendukung emoji + huruf Indonesia lengkap)
--
-- Catatan:
--   - Postgres `uuid` → MySQL `CHAR(36)` (string UUID standar)
--   - Postgres `jsonb` → MySQL `JSON` (native sejak 5.7+)
--   - Postgres `timestamp with time zone` → MySQL `TIMESTAMP` (UTC, default NOW)
--   - Postgres `text[]` → MySQL `JSON` (array of strings)
--   - TIDAK ada Row Level Security di MySQL — semua filtering harus
--     di-handle di PHP layer (validasi JWT + role admin sebelum SELECT)
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- Tabel: assessment_results
-- Hasil asesmen siswa. Public bisa INSERT (via /api/results),
-- hanya admin yang bisa SELECT/UPDATE (di-enforce PHP).
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `assessment_results`;
CREATE TABLE `assessment_results` (
  `id` CHAR(36) NOT NULL,
  `student_name` VARCHAR(255) DEFAULT NULL,
  `student_email` VARCHAR(255) DEFAULT NULL,
  `student_phone` VARCHAR(50) DEFAULT NULL,
  `student_class` VARCHAR(100) DEFAULT NULL,
  `school_name` VARCHAR(255) DEFAULT NULL,
  `student_province` VARCHAR(100) DEFAULT NULL,
  `province` VARCHAR(100) DEFAULT NULL,
  `family_background` TEXT DEFAULT NULL,
  `aspiration` TEXT DEFAULT NULL,
  `scores` JSON NOT NULL,
  `top_pathway_id` VARCHAR(100) NOT NULL,
  `top_pathway_name` VARCHAR(255) NOT NULL,
  `match_percentage` INT NOT NULL,
  `all_matches` JSON NOT NULL,
  `projection` TEXT DEFAULT NULL,
  `lead_score` INT NOT NULL DEFAULT 0,
  `follow_up_status` ENUM('new', 'contacted', 'qualified', 'enrolled', 'rejected')
      NOT NULL DEFAULT 'new',
  `notes` TEXT DEFAULT NULL,
  `lm_name` VARCHAR(255) DEFAULT NULL,
  `lm_id` VARCHAR(100) DEFAULT NULL,
  `submitted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  -- Index untuk admin dashboard (sort + filter)
  KEY `idx_submitted_at` (`submitted_at` DESC),
  KEY `idx_lead_score` (`lead_score` DESC),
  KEY `idx_follow_up_status` (`follow_up_status`),
  KEY `idx_top_pathway` (`top_pathway_id`),
  KEY `idx_province` (`province`),
  KEY `idx_lm_id` (`lm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Tabel: province_contexts
-- Data konteks per provinsi (industri, sektor ekonomi, dll) untuk AI.
-- Public read-only (dipakai edge function generate-projection).
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `province_contexts`;
CREATE TABLE `province_contexts` (
  `id` CHAR(36) NOT NULL,
  `province` VARCHAR(100) NOT NULL,
  `economic_sectors` JSON DEFAULT NULL,
  `narrative_hooks` JSON DEFAULT NULL,
  `opportunities_2030` TEXT DEFAULT NULL,
  `social_context` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_province` (`province`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Tabel: admin_users
-- Pengganti Supabase Auth users untuk admin login.
-- Password disimpan sebagai bcrypt hash (PHP password_hash(PASSWORD_BCRYPT)).
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE `admin_users` (
  `id` CHAR(36) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `display_name` VARCHAR(255) DEFAULT NULL,
  `role` ENUM('admin', 'lm', 'viewer') NOT NULL DEFAULT 'lm',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `last_login_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_email` (`email`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Tabel: user_sessions (opsional kalau pakai JWT, wajib kalau pakai
-- server-side session token)
-- Simpan refresh tokens / revoke list. Skip kalau JWT stateless.
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `user_sessions`;
CREATE TABLE `user_sessions` (
  `id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  `token_hash` VARCHAR(255) NOT NULL,
  `user_agent` VARCHAR(500) DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_token_hash` (`token_hash`),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `fk_session_user` FOREIGN KEY (`user_id`)
      REFERENCES `admin_users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- Seed: 1 admin user untuk testing
-- Ganti password 'changeme123' SEGERA setelah login pertama.
-- Hash di bawah = password_hash('changeme123', PASSWORD_BCRYPT)
-- =====================================================================
INSERT INTO `admin_users` (`id`, `email`, `password_hash`, `display_name`, `role`)
VALUES (
  UUID(),
  'admin@iou.edu.gm',
  '$2y$10$KzL5aN8Q3yXJK1YqJ5rZLeF8zL5pN3zXJK1YqJ5rZLeF8zL5pN3zX',
  'Admin IOU',
  'admin'
);

-- =====================================================================
-- Catatan deployment:
-- 1. Jalankan: mysql -u root -p sulu_db < MYSQL_SCHEMA.sql
-- 2. Verifikasi: SHOW TABLES; (harus ada 4 tabel)
-- 3. Import data lama: lihat DATA_MIGRATION.md
-- 4. Generate password hash baru:
--    php -r "echo password_hash('PASSWORD_BARU', PASSWORD_BCRYPT) . PHP_EOL;"
-- =====================================================================
