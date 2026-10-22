-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('superadmin', 'admin', 'editor', 'user') NOT NULL DEFAULT 'user';
