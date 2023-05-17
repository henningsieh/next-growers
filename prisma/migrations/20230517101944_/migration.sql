/*
  Warnings:

  - Made the column `type` on table `CannabisStrain` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CannabisStrain" ALTER COLUMN "type" SET NOT NULL;
