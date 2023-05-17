/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `CannabisStrain` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `CannabisStrain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CannabisStrain" ADD COLUMN     "description" TEXT,
ADD COLUMN     "effects" TEXT[],
ADD COLUMN     "flavors" TEXT[],
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CannabisStrain_name_key" ON "CannabisStrain"("name");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_cannabisStrainId_fkey" FOREIGN KEY ("cannabisStrainId") REFERENCES "CannabisStrain"("id") ON DELETE SET NULL ON UPDATE CASCADE;
