import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import { LikeReportInput } from "~/types"

export const likeRouter = createTRPCRouter({
  
  likeReport: protectedProcedure.input(LikeReportInput).mutation(async ({ ctx, input }) => {
    // Check if the report exists
    const existingReport = await ctx.prisma.report.findUnique({
      where: {
        id: input.reportId
      },
    });
    if (!existingReport) {
      throw new Error('Report does not exist');
    }

    // Check if the user exists
    const existingUser = await ctx.prisma.user.findUnique({
      where: {
        id: input.userId,
      },
    });
    if (!existingUser) {
      throw new Error('User does not exist');
    }

    // Check if the user has already liked the report
    const existingLike = await ctx.prisma.like.findUnique({
      where: {
        userId_reportId: {
          userId: input.userId,
          reportId: input.reportId,
        },
      },
    });
    if (existingLike) {
      throw new Error('You have already liked this report');
    }

    // Create a new like
    const like = await ctx.prisma.like.create({
      data: {
        user: {
          connect: {
            id: input.userId,
          },
        },
        report: {
          connect: {
            id: input.reportId,
          },
        },
      },
    });

    return like;
  })
});
