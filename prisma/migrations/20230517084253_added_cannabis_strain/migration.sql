-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "cannabisStrainId" TEXT;

-- CreateTable
CREATE TABLE "CannabisStrain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "effects" TEXT[],
    "flavors" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CannabisStrain_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_cannabisStrainId_fkey" FOREIGN KEY ("cannabisStrainId") REFERENCES "CannabisStrain"("id") ON DELETE SET NULL ON UPDATE CASCADE;
