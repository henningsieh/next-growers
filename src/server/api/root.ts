import { commentRouter } from "./routers/comment";
import { exampleRouter } from "./routers/example";
import { imageRouter } from "./routers/image";
import { lightWattsRouter } from "./routers/lightWatts";
import { likeRouter } from "./routers/like";
import { notificationRouter } from "./routers/notification";
import { postRouter } from "./routers/posts";
import { reportRouter } from "./routers/report";
import { strainRouter } from "./routers/strains";
import { tosRouter } from "./routers/tos";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

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
  image: imageRouter,
  tos: tosRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
