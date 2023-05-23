-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('INDOOR', 'OUTDOOR');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "environment" "Environment";
