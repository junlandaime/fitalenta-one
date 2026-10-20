-- AlterTable
ALTER TABLE `team_members` ADD COLUMN `type` ENUM('expert', 'team') NOT NULL DEFAULT 'expert';

-- CreateIndex
CREATE INDEX `team_members_type_is_active_order_idx` ON `team_members`(`type`, `is_active`, `order`);
