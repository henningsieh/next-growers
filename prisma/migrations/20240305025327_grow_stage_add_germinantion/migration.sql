/*
  Warnings:

  - The values [PREPARATION] on the enum `GrowStage` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GrowStage_new" AS ENUM ('PREPARATION_STAGE', 'GERMINANTION_STAGE', 'SEEDLING_STAGE', 'VEGETATIVE_STAGE', 'FLOWERING_STAGE');
ALTER TABLE "Post" ALTER COLUMN "growStage" DROP DEFAULT;
ALTER TABLE "Post" ALTER COLUMN "growStage" TYPE "GrowStage_new" USING ("growStage"::text::"GrowStage_new");
ALTER TYPE "GrowStage" RENAME TO "GrowStage_old";
ALTER TYPE "GrowStage_new" RENAME TO "GrowStage";
DROP TYPE "GrowStage_old";
ALTER TABLE "Post" ALTER COLUMN "growStage" SET DEFAULT 'SEEDLING_STAGE';
COMMIT;
