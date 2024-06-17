import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tosRouter = createTRPCRouter({
  getCurrentTos: publicProcedure.query(async ({ ctx }) => {
    try {
      const tos = await ctx.prisma.tOS.findFirst({
        select: {
          id: true,
          html_en: true,
          html_de: true,
          version: true,
          isCurrent: true,
          effectiveAt: true,
        },
        where: {
          isCurrent: true,
        },
      });
      if (!tos) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No current TOS found",
        });
      }
      return tos;
    } catch (error: unknown) {
      if (error instanceof TRPCError) {
        throw new TRPCError({
          code: error.code,
          message: error.message,
          cause: error.cause,
        });
      } else if (error instanceof Error) {
        throw new Error(error.message, {
          cause: error.cause,
        } as ErrorOptions);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }),
});
