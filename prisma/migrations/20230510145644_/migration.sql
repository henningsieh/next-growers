/*
  Warnings:

  - You are about to drop the column `tape` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Report` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reportId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "tape",
ADD COLUMN     "type" "TypeOf" NOT NULL;

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "imageUrl";

-- CreateIndex
CREATE UNIQUE INDEX "Image_reportId_key" ON "Image"("reportId");
