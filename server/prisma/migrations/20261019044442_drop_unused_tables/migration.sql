/*
  Warnings:

  - You are about to drop the `clients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `companies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hero_slides` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `university_partners` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `visitors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `job` DROP FOREIGN KEY `job_company_id_fkey`;

-- DropTable
DROP TABLE `clients`;

-- DropTable
DROP TABLE `companies`;

-- DropTable
DROP TABLE `hero_slides`;

-- DropTable
DROP TABLE `job`;

-- DropTable
DROP TABLE `settings`;

-- DropTable
DROP TABLE `university_partners`;

-- DropTable
DROP TABLE `visitors`;
