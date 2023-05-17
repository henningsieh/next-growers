import type { AppRouter } from "./server/api/root";
import type { inferRouterOutputs } from "@trpc/server";
import { z } from "zod";

type RouterOutput = inferRouterOutputs<AppRouter>;

type getAllReportsOutput = RouterOutput["reports"]["getAllReports"];
export type Report = getAllReportsOutput[number];

type getOwnReportsOutput = RouterOutput["reports"]["getOwnReports"];
export type OwnReport = getOwnReportsOutput[number];

type getAllNotificationsOutput =
  RouterOutput["notifications"]["getNotificationsByUserId"];
export type Notifications = getAllNotificationsOutput;
export type Notification = getAllNotificationsOutput[number];

export const reportInput = z.object({
  title: z
    .string()
    .min(8, { message: "Title should have at least 8 letters" })
    .max(32, { message: "Title should have max 32 letters" }),
  description: z
    .string()
    .min(12, { message: "Description should have at least 12 letters" })
    .max(64, { message: "Description should have max 64 letters" }),
  imageId: z.string().min(1, { message: "Header image is missing" }),
});

export const getReportsInput = z.object({
  orderBy: z.string().min(1),
  desc: z.boolean(),
  search: z.string(),
});

export const reportEditInput = z.object({
  id: z.string().min(1),
  title: z
    .string()
    .min(8, { message: "Title should have at least 8 letters" })
    .max(32, { message: "Title should have max 32 letters" }),
  description: z
    .string()
    .min(12, { message: "Description should have at least 12 letters" })
    .max(64, { message: "Description should have max 64 letters" }),
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
}

export type NotificationEventMap =
  | "LIKE_CREATED"
  | "COMMENT_CREATED"
  | "POST_CREATED"
  | "REPORT_CREATED";
