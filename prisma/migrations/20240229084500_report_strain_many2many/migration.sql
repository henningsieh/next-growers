/*
  Warnings:

  - You are about to drop the column `reportId` on the `CannabisStrain` table. All the data in the column will be lost.
  - You are about to drop the column `reportId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `_ReportToContest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CannabisStrain" DROP CONSTRAINT "CannabisStrain_reportId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_reportId_fkey";

-- DropForeignKey
ALTER TABLE "_ReportToContest" DROP CONSTRAINT "_ReportToContest_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReportToContest" DROP CONSTRAINT "_ReportToContest_B_fkey";

-- AlterTable
ALTER TABLE "CannabisStrain" DROP COLUMN "reportId";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "reportId";

-- DropTable
DROP TABLE "_ReportToContest";

-- CreateTable
CREATE TABLE "_CannabisStrainToReport" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToReport" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ContestToReport" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CannabisStrainToReport_AB_unique" ON "_CannabisStrainToReport"("A", "B");

-- CreateIndex
CREATE INDEX "_CannabisStrainToReport_B_index" ON "_CannabisStrainToReport"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToReport_AB_unique" ON "_ProductToReport"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToReport_B_index" ON "_ProductToReport"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ContestToReport_AB_unique" ON "_ContestToReport"("A", "B");

-- CreateIndex
CREATE INDEX "_ContestToReport_B_index" ON "_ContestToReport"("B");

-- AddForeignKey
ALTER TABLE "_CannabisStrainToReport" ADD CONSTRAINT "_CannabisStrainToReport_A_fkey" FOREIGN KEY ("A") REFERENCES "CannabisStrain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CannabisStrainToReport" ADD CONSTRAINT "_CannabisStrainToReport_B_fkey" FOREIGN KEY ("B") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToReport" ADD CONSTRAINT "_ProductToReport_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToReport" ADD CONSTRAINT "_ProductToReport_B_fkey" FOREIGN KEY ("B") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContestToReport" ADD CONSTRAINT "_ContestToReport_A_fkey" FOREIGN KEY ("A") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContestToReport" ADD CONSTRAINT "_ContestToReport_B_fkey" FOREIGN KEY ("B") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
