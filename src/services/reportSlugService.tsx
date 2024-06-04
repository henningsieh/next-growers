// services/itemService.ts
import type { IsoReportWithPostsFromDb } from "~/types";

export function getLatestSlugFromReport(
  report: IsoReportWithPostsFromDb
): string {
  return report?.reportSlug ? report.reportSlug[0].slug : report.id;
}
