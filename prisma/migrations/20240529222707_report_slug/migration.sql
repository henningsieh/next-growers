-- CreateTable
CREATE TABLE "ReportSlug" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportSlug_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReportSlug_slug_key" ON "ReportSlug"("slug");

-- AddForeignKey
ALTER TABLE "ReportSlug" ADD CONSTRAINT "ReportSlug_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
