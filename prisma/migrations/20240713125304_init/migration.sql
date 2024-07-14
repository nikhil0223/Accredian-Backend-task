/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `referralId` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[referralid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_referralId_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `phoneNumber`,
    DROP COLUMN `referralId`,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `referralid` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_referralid_key` ON `User`(`referralid`);
