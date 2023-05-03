import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import { reportInput } from "~/types"
import { z, } from "zod";

export const reportRouter = createTRPCRouter({
  
  /**
   * Get all Reports 
   */
  getAll: publicProcedure.query(async ({ ctx }) => {
    const reports = await ctx.prisma.report.findMany();
    return reports.map(({ id, title, description,  }) => ({ id, title, description }));
  }),

  /**
   * Get Reports by  UserId
   * @Input: userId: String 
   */
  getOwn: protectedProcedure.query(async ({ ctx }) => {
    const reports = await ctx.prisma.report.findMany({
      where: {
        authorId: ctx.session.user.id,
      },
    });
    return reports.map(( { id, title, description, authorId, createdAt, updatedAt }) => ({ id, title, description, authorId, createdAt, updatedAt }));
  }),

  /**
   * Get Reports by  foreign AuthourId
   * @Input: userId: String 
   */
  getReportsByUserId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const reports = await ctx.prisma.report.findMany({
      where: {
        authorId: input,
      },
    });
    return reports.map(( { id, title, description, authorId, createdAt, updatedAt }) => ({ id, title, description, authorId, createdAt, updatedAt }));
  }),
  
  create: protectedProcedure.input(reportInput).mutation(async ({ ctx, input }) => {
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
  })
}


)
