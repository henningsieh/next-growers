/*
  Warnings:

  - You are about to drop the column `stage` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "stage",
ADD COLUMN     "growStage" "GrowStage" NOT NULL DEFAULT 'SEEDLING_STAGE';
