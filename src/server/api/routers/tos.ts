import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tosRouter = createTRPCRouter({
  getCurrentTos: publicProcedure.query(async ({ ctx }) => {
    const tos = await ctx.prisma.tOS.findFirst({
      select: {
        id: true,
        html: true,
        version: true,
        isCurrent: true,
        effectiveAt: true,
      },
      where: {
        isCurrent: true,
      },
    });
    return tos;
  }),
});
