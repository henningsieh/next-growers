import type { Dispatch, SetStateAction } from "react";

import type { AppRouter } from "./server/api/root";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

type getAllReportsOutput = RouterOutput["reports"]["getAllReports"];
export type Reports = getAllReportsOutput;
export type Report = getAllReportsOutput[number];

type getOwnReportsOutput = RouterOutput["reports"]["getOwnReports"];
export type OwnReports = getOwnReportsOutput;
export type OwnReport = getOwnReportsOutput[number];

type getPostsByReportIdOutput = RouterOutput["posts"]["getPostsByReportId"];
export type Posts = getPostsByReportIdOutput;
export type Post = getPostsByReportIdOutput[number];
// export type PostDbInput = RouterOutput["posts"]["getPostDbInput"];

export type PostDbInput = {
  date: Date;
  title: string;
  growStage: GrowStage;
  lightHoursPerDay: number | null;
  images: string[];
  content: string;
  reportId: string;
  authorId: string;
};

type getAllNotificationsOutput =
  RouterOutput["notifications"]["getNotificationsByUserId"];
export type Notifications = getAllNotificationsOutput;
export type Notification = getAllNotificationsOutput[number];

type getAllStrainsOutput = RouterOutput["strains"]["getAllStrains"];
export type Strains = getAllStrainsOutput;
export type Strain = getAllStrainsOutput[number];

export interface ImageUploadResponse {
  success: boolean;
  imageId: string;
  // reportId: string;
  imagePublicId: string;
  cloudUrl: string;
}

export interface MultiUploadResponse {
  success: boolean;
  // reportId: string;
  imageIds: string[];
  imagePublicIds: string[];
  cloudUrls: string[];
}

export interface SortingPanelProps {
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
  desc: boolean;
  handleToggleDesc: () => void;
}

export interface FakeCardBadgeProps {
  country: string;
  badges: {
    emoji: string;
    label: string;
  }[];
}

export interface ReportCardProps extends FakeCardBadgeProps {
  report: Report;
  procedure: "all" | "own";

  setSearchString: Dispatch<SetStateAction<string>>;
}

export interface SplitObject {
  strain: string;
  searchstring: string;
}

export type NotificationEventMap =
  | "LIKE_CREATED"
  | "COMMENT_CREATED"
  | "POST_CREATED"
  | "REPORT_CREATED";

export enum Locale {
  EN = "en",
  DE = "de",
}

export enum GrowStage {
  SEEDLING_STAGE = "SEEDLING_STAGE",
  VEGETATIVE_STAGE = "VEGETATIVE_STAGE",
  FLOWERING_STAGE = "FLOWERING_STAGE",
}
