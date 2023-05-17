/*
  Warnings:

  - You are about to drop the column `cannabisStrainId` on the `Report` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_cannabisStrainId_fkey";

-- AlterTable
ALTER TABLE "CannabisStrain" ADD COLUMN     "reportId" TEXT;

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "cannabisStrainId";

-- AddForeignKey
ALTER TABLE "CannabisStrain" ADD CONSTRAINT "CannabisStrain_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE SET NULL ON UPDATE CASCADE;
