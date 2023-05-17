/*
  Warnings:

  - You are about to drop the `CannabisStrain` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_cannabisStrainId_fkey";

-- DropTable
DROP TABLE "CannabisStrain";
