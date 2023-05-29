import type { AppRouter } from "./server/api/root";
import type { inferRouterOutputs } from "@trpc/server";

import type { Dispatch, SetStateAction } from "react";

import type { User } from "next-auth";

type RouterOutput = inferRouterOutputs<AppRouter>;

type getAllReportsOutput = RouterOutput["reports"]["getAllReports"];
export type Reports = getAllReportsOutput;
export type Report = getAllReportsOutput[number];

type getPostsByReportIdOutput =
  RouterOutput["posts"]["getPostsByReportId"];
export type Posts = getPostsByReportIdOutput;
export type Post = getPostsByReportIdOutput[number];

export type IsoReportWithPostsFromDb =
  RouterOutput["reports"]["getIsoReportWithPostsFromDb"];

export type PostDbInput = {
  date: Date;
  title: string;
  growStage: keyof typeof GrowStage;
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

type getLikesByItemIdOutput = RouterOutput["like"]["getLikesByItemId"];
export type Likes = getLikesByItemIdOutput;
export type Like = getLikesByItemIdOutput[number];

export interface EditFormProps {
  report: IsoReportWithPostsFromDb;
  strains: Strains;
  user: User;
}

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

export interface IsoReportCardProps extends FakeCardBadgeProps {
  report: IsoReportWithPostsFromDb;
  procedure: "all" | "own";

  setSearchString: Dispatch<SetStateAction<string>>;
}

export interface SplitObject {
  strain: string;
  searchstring: string;
}

export type NotificationEventMap =
  | "LIKE_CREATED" // TODO: NOTIFY item.author
  | "COMMENT_CREATED" //TODO: NOTIFY report.author + comment.parent.author
  | "POST_CREATED" //TODO: NOTIFY report.author + report.followers
  | "REPORT_CREATED"; //TODO: NOTIFY user.followers

export enum Locale {
  EN = "en",
  DE = "de",
}

export enum GrowStage {
  SEEDLING_STAGE = "Seedling",
  VEGETATIVE_STAGE = "Vegetative ",
  FLOWERING_STAGE = "Flowering",
}

export enum Environment {
  INDOOR = "Indoor",
  OUTDOOR = "Outdoor",
}
