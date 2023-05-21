/*
  Warnings:

  - Added the required column `ownerId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
