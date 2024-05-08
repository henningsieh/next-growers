import { commentRouter } from "./routers/comment";
import { lightWattsRouter } from "./routers/lightWatts";
import { likeRouter } from "./routers/like";
import { notificationRouter } from "./routers/notification";
import { postRouter } from "./routers/posts";
import { strainRouter } from "./routers/strains";

import { exampleRouter } from "~/server/api/routers/example";
import { reportRouter } from "~/server/api/routers/report";
import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  reports: reportRouter,
  user: userRouter,
  like: likeRouter,
  notifications: notificationRouter,
  strains: strainRouter,
  posts: postRouter,
  lightwatts: lightWattsRouter,
  comments: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
