import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { z } from "zod";

export const imageRouter = createTRPCRouter({
  test: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        // message: `Hello ${input.text}`,
        message: `ERROR: NO AUTHED POST REQUEST | msg: ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => { // not used!!
    return ctx.prisma.image.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "You can now see this secret message!";
  }),

});
