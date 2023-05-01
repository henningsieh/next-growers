// import type { AppRouter } from "./server/api/root";
// import type { inferRouterOutputs } from "@trpc/server";

import { z } from "zod";

export const reportInput = z
  .object({
    title: z.string().min(1).max(100, {
      message: "Title should be less than or equal to 100 characters",
    }),
    description: z.string().min(1).max(500, {
      message: "Description should be less than or equal to 500 characters",
    }),
  })
  .optional();
