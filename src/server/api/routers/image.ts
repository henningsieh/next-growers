import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { imageUploadInput } from "~/types";
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
/*   getAll: publicProcedure.query(({ ctx }) => { // not used!!
    return null // ctx.prisma.example.findMany();
  }),
  */
  getSecretMessage: protectedProcedure.query(() => {
    return "You can now see this secret message!";
  }),
  
/*   create: protectedProcedure
    .input(imageUploadInput)
    .mutation(async ({ ctx, input }) => {
    return await ctx.prisma.report.create({
      data: {
        title: input.title,
        description: input.description,
        author: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
    });
    console.log(input.fileName)
  }), */
});
