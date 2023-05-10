import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { reportEditInput, reportInput } from "~/types"

import { z, } from "zod";

export const reportRouter = createTRPCRouter({
  
  /**
   * Get all Reports with author information
   */
  getAllReports: publicProcedure.query(async ({ ctx }) => {
    const reports = await ctx.prisma.report.findMany({
      include: { author: { select: { id: true, name: true, image: true } } },
    });
    return reports.map(({ id, title, description, author, createdAt, updatedAt }) => ({
      id,
      title,
      description,
      authorId: author?.id,
      authorName: author?.name,
      authorImage: author?.image,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    }));
  }),

  /**
   * Get Reports by  UserId
   * @Input: userId: String 
   */
  getOwnReports: protectedProcedure.query(async ({ ctx }) => {
    const reports = await ctx.prisma.report.findMany({
      include: { author: { select: { id: true, name: true, image: true } } },
      where: { authorId: ctx.session.user.id },
    });
    return reports.map(({ id, title, description, author, createdAt, updatedAt }) => ({
      id,
      title,
      description,
      authorId: author?.id,
      authorName: author?.name,
      authorImage: author?.image,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    }));
  }),

  /**
   * Get Reports by foreign AuthourId
   * @Input: userId: String 
   */
  getReportsByAuthorId: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const reports = await ctx.prisma.report.findMany({
      where: {
        id: input,
      },
    });
    return reports.map(( { id, title, description, authorId, createdAt, updatedAt }) => ({ id, title, description, authorId, createdAt, updatedAt }));
  }),

  /**
   * Get Report by Id
   * @Input: userId: String 
   */
  getReportById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const report = await ctx.prisma.report.findFirst({
      where: {
        id: input,
      },
    });
    return {
      ...report,
      createdAt: report?.createdAt.toISOString(),
      updatedAt: report?.updatedAt.toISOString(),
    };
  }),
  
  deleteOwnReport: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    // First, check if the report exists
    const existingReport = await ctx.prisma.report.findUnique({
      where: {
        id: input,
      },
    });
    if (!existingReport) {
      throw new Error('Report not found');
    }
  
    // Then, check if the user is the author of the report
    if (existingReport.authorId !== ctx.session.user.id) {
      throw new Error('You are not authorized to delete this report');
    }
  
    // Finally, delete the report
    await ctx.prisma.report.delete({
      where: {
        id: input,
      },
    });
    
    return { success: true };
  }),


  create: protectedProcedure.input(reportInput).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.report.create({
      data: {
        title: input.title,
        description: input.description,
        imageUrl: input.cloudUrl,
        author: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
    });
  }),


  saveOwnReport: protectedProcedure.input(reportEditInput).mutation(async ({ ctx, input }) => {
    // First, check if the report exists
    const existingReport = await ctx.prisma.report.findUnique({
      where: {
        id: input.id,
      },
    });
    
    // Then, check if the user is the author of the report
    if (existingReport && existingReport.authorId !== ctx.session.user.id) {
      throw new Error('You are not authorized to edit this report');
    }
    
    // Create or update the report
    const data = {
      ...input,
      authorId: ctx.session.user.id,
    };
    const report = await ctx.prisma.report.upsert({
      where: {
        id: input.id,
      },
      create: data,
      update: data,
    });
    
    return report;
  })


}


)
