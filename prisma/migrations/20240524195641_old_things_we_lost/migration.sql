-- AlterEnum
ALTER TYPE "NotificationEvent" ADD VALUE 'COMMENT_ANSWERED';

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "isResponseToId" TEXT;

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "postOrder" INTEGER;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SeedfinderStrain" (
    "id" TEXT NOT NULL,
    "strainId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "picture_url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "cbd" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "flowering_days" INTEGER NOT NULL,
    "flowering_info" TEXT NOT NULL,
    "flowering_automatic" BOOLEAN NOT NULL,
    "seedfinder_ext_url" TEXT NOT NULL,
    "breederId" TEXT NOT NULL,
    "breeder_name" TEXT NOT NULL,
    "breeder_logo_url" TEXT NOT NULL,
    "breeder_description" TEXT NOT NULL,
    "breeder_website_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeedfinderStrain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plant" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "seedfinderStrainId" TEXT NOT NULL,
    "plantName" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LightWatts" (
    "id" TEXT NOT NULL,
    "watt" DOUBLE PRECISION NOT NULL,
    "postId" TEXT,

    CONSTRAINT "LightWatts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SeedfinderStrain_strainId_breederId_idx" ON "SeedfinderStrain"("strainId", "breederId");

-- CreateIndex
CREATE UNIQUE INDEX "SeedfinderStrain_strainId_breederId_key" ON "SeedfinderStrain"("strainId", "breederId");

-- CreateIndex
CREATE UNIQUE INDEX "LightWatts_postId_key" ON "LightWatts"("postId");

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_seedfinderStrainId_fkey" FOREIGN KEY ("seedfinderStrainId") REFERENCES "SeedfinderStrain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LightWatts" ADD CONSTRAINT "LightWatts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_isResponseToId_fkey" FOREIGN KEY ("isResponseToId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
