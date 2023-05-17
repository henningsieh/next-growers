/*
  Warnings:

  - You are about to drop the column `description` on the `CannabisStrain` table. All the data in the column will be lost.
  - You are about to drop the column `effects` on the `CannabisStrain` table. All the data in the column will be lost.
  - You are about to drop the column `flavors` on the `CannabisStrain` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `CannabisStrain` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_cannabisStrainId_fkey";

-- DropIndex
DROP INDEX "CannabisStrain_name_key";

-- AlterTable
ALTER TABLE "CannabisStrain" DROP COLUMN "description",
DROP COLUMN "effects",
DROP COLUMN "flavors",
DROP COLUMN "name";
