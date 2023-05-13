import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { imageRouter } from "./routers/image";
import { likeRouter } from "./routers/like";
import { reportRouter } from "~/server/api/routers/report";
import { userRouter } from "~/server/api/routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  reports: reportRouter,
  user: userRouter,
  upload: imageRouter,
  like: likeRouter,
});



// export type definition of API
export type AppRouter = typeof appRouter;
