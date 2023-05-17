-- CreateEnum
CREATE TYPE "CannabisStraintype" AS ENUM ('Indica', 'Sativa', 'Hybrid');

-- AlterTable
ALTER TABLE "CannabisStrain" ADD COLUMN     "type" "CannabisStraintype";
