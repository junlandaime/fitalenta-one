-- AlterTable
ALTER TABLE `programs` ADD COLUMN `form_template` VARCHAR(30) NOT NULL DEFAULT 'default';

-- AlterTable
ALTER TABLE `registrations` ADD COLUMN `gpa` VARCHAR(10) NULL,
    ADD COLUMN `color_blind_status` VARCHAR(30) NULL,
    ADD COLUMN `ktp_path` VARCHAR(191) NULL,
    ADD COLUMN `diploma_path` VARCHAR(191) NULL,
    ADD COLUMN `transcript_path` VARCHAR(191) NULL,
    ADD COLUMN `health_cert_path` VARCHAR(191) NULL,
    ADD COLUMN `color_blind_cert_path` VARCHAR(191) NULL,
    ADD COLUMN `drug_free_cert_path` VARCHAR(191) NULL,
    ADD COLUMN `toeic_cert_path` VARCHAR(191) NULL,
    ADD COLUMN `cv_path` VARCHAR(191) NULL,
    ADD COLUMN `supporting_docs_path` VARCHAR(191) NULL;
