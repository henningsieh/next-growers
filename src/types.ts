import type { Dispatch, SetStateAction } from "react";

import type { AppRouter } from "./server/api/root";
import type { inferRouterOutputs } from "@trpc/server";
import { z } from "zod";

type RouterOutput = inferRouterOutputs<AppRouter>;

type getAllReportsOutput = RouterOutput["reports"]["getAllReports"];
export type Report = getAllReportsOutput[number];

type getOwnReportsOutput = RouterOutput["reports"]["getOwnReports"];
export type OwnReport = getOwnReportsOutput[number];

type getPostsByReportIdOutput = RouterOutput["posts"]["getPostsByReportId"];
export type Posts = getPostsByReportIdOutput;
export type Post = getPostsByReportIdOutput[number];

export type PostDbInput = {
  date: Date;
  title: string;
  growStage: GrowStage;
  lightHoursPerDay: number | null;
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

export const getReportsInput = z.object({
  orderBy: z.string().min(1),
  desc: z.boolean(),
  search: z.string(),
});

export const reportCreateInput = z.object({
  title: z
    .string()
    .min(8, { message: "Title should have at least 8 letters" })
    .max(32, { message: "Title should have max 32 letters" }),
  description: z
    .string()
    .min(12, { message: "Content should have at least 12 letters" })
    .max(64, { message: "Content should have max 64 letters" }),
  imageId: z.string().min(1, { message: "Header image is missing" }),
});
export const reportEditInput = z.object({
  id: z.string().min(1),
  title: z
    .string()
    .min(8, { message: "Title should have at least 8 letters" })
    .max(32, { message: "Title should have max 32 letters" }),
  description: z
    .string()
    .min(12, { message: "Content should have at least 12 letters" })
    .max(64, { message: "Content should have max 64 letters" }),
  strains: z
    .array(z.string())
    .min(1, { message: "Report should have at least 1 strain" }),
});

export const userSetUSerNameInput = z.object({
  id: z.string().min(1),
  name: z.string().min(6).max(100),
});

export const imageUploadInput = z.object({
  fileName: z.string(),
});
export const LikeReportInput = z.object({
  reportId: z.string(),
});
export const DeleteLikeInput = z.object({
  reportId: z.string(),
});

export interface ImageUploadResponse {
  success: boolean;
  imageId: string;
  reportId: string;
  imagePublicId: string;
  cloudUrl: string;
}

export enum Locale {
  EN = "en",
  DE = "de",
}

export enum GrowStage {
  SEEDLING_STAGE = "SEEDLING_STAGE",
  VEGETATIVE_STAGE = "VEGETATIVE_STAGE",
  FLOWERING_STAGE = "FLOWERING_STAGE",
}

export interface SortingPanelProps {
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
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

export type NotificationEventMap =
  | "LIKE_CREATED"
  | "COMMENT_CREATED"
  | "POST_CREATED"
  | "REPORT_CREATED";
