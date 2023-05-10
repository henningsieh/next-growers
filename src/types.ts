import type { AppRouter } from "./server/api/root";
import type { inferRouterOutputs } from "@trpc/server";
import { z } from "zod";

type RouterOutput = inferRouterOutputs<AppRouter>;

type getAllReportsOutput = RouterOutput["reports"]["getAllReports"];
export type Report = getAllReportsOutput[number];

type getOwnReportsOutput = RouterOutput["reports"]["getOwnReports"];
export type OwnReport = getOwnReportsOutput[number];

export const reportInput = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  cloudUrl: z.string().min(1).max(1000),
});

export const reportEditInput = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
});

export const userSetUSerNameInput = z.object({
  id: z.string().min(1),
  name: z.string().min(6).max(100),  
})

export const imageUploadInput = z.object({
  fileName: z.string(),  
})

export interface ImageUploadResponse {
  success: boolean;
  cloudUrl: string;
}