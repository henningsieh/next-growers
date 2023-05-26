import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { z } from "zod";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  /*   getAll: publicProcedure.query(({ ctx }) => { // not used!!
    return null // ctx.prisma.example.findMany();
  }),
  */
  getSecretMessage: protectedProcedure.query(() => {
    return "You can now see this secret message!";
  }),
});
