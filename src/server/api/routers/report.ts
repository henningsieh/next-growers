import { createTRPCRouter, protectedProcedure } from "../trpc";

import { z } from "zod";

//import { reportInput } from "~/types"


export const reportRouter = createTRPCRouter({
  
  /**
   * Get all Reports 
   */
  getAllReports: protectedProcedure.query(async ({ ctx }) => {
    const todos = await ctx.prisma.report.findMany();
    return todos.map(({ id, title, description, authorId, createdAt, updatedAt }) => ({ id, title, description, authorId, createdAt, updatedAt }));
  }),
  /**
   * Get own Reports 
   */
  getOwnReports: protectedProcedure.query(async ({ ctx }) => {
    const todos = await ctx.prisma.report.findMany({
      where: {
        authorId: ctx.session.user.id,
      },
    });
    return todos.map(( { id, title, description, authorId, createdAt, updatedAt }) => ({ id, title, description, authorId, createdAt, updatedAt }));
  }),
  /**
   * Get Reports by  UserId
   * @Input: userId: String 
   */
  getReportsByUserId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const todos = await ctx.prisma.report.findMany({
      where: {
        authorId: input,
      },
    });
    return todos.map(( { id, title, description, authorId, createdAt, updatedAt }) => ({ id, title, description, authorId, createdAt, updatedAt }));
  }),
});