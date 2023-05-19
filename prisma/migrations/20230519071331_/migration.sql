/*
  Warnings:

  - Added the required column `date` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GrowStage" AS ENUM ('SEEDLING_STAGE', 'VEGETATIVE_STAGE', 'FLOWERING_STAGE');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lightHoursPerDay" INTEGER,
ADD COLUMN     "stage" "GrowStage" NOT NULL DEFAULT 'SEEDLING_STAGE';
