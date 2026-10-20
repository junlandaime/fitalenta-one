-- AlterTable
ALTER TABLE `payments` ADD COLUMN `issued_at` DATETIME(3) NULL;

-- Backfill: seluruh invoice yang sudah ada sebelumnya sudah terlihat oleh peserta, anggap sudah terbit
UPDATE `payments` SET `issued_at` = `created_at` WHERE `issued_at` IS NULL;