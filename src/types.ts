import type { AppRouter } from "./server/api/root";
import type { inferRouterOutputs } from "@trpc/server";
import { z } from "zod";

type RouterOutput = inferRouterOutputs<AppRouter>;

type getAllReportsOutput = RouterOutput["reports"]["getAllReports"];

export type Report = getAllReportsOutput[number];

export const reportInput = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
});
