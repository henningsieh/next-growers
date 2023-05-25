/*
  Warnings:

  - A unique constraint covering the columns `[reportId,date]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Post_reportId_date_key" ON "Post"("reportId", "date");
