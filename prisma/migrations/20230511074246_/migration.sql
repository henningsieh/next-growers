/*
  Warnings:

  - Added the required column `cloudUrl` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "cloudUrl" TEXT NOT NULL;
