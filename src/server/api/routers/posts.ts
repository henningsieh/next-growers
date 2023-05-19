import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import { GrowStage } from "~/types";
import { z } from "zod";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        title: z.string().min(1),
        content: z.string().min(1),
        growStage: z.nativeEnum(GrowStage), // Use z.nativeEnum to accept the GrowStage enum type
        lightHoursPerDay: z.number().nullable(),
        reportId: z.string().min(1),
        authorId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        date,
        title,
        content,
        growStage,
        lightHoursPerDay,
        reportId,
        authorId,
      } = input;

      const report = await ctx.prisma.report.findFirst({
        where: {
          id: reportId,
        },
      });

      if (authorId != ctx.session.user.id) {
        throw new Error("A SECURITY ISSSUE OCCURED.");
      }

      if (!report) {
        throw new Error(`The report with id: ${reportId} does not exist`);
      }

      if (report.authorId != ctx.session.user.id) {
        throw new Error(
          `You are not the owner of this report with id: ${reportId}`
        );
      }

      // const formattedDate = new Date(date);

      const post = await ctx.prisma.post.create({
        data: {
          date,
          title,
          content,
          growStage,
          lightHoursPerDay,
          report: {
            connect: {
              id: reportId,
            },
          },
          author: {
            connect: {
              id: authorId,
            },
          },
        },
      });

      return post;
    }),

  /**
   * Get all posts for a report
   * @Input: reportId: String
   */
  getPostsByReportId: publicProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const reportId = input;

      const reports = await ctx.prisma.report.findUnique({
        where: {
          id: reportId,
        },
      });

      if (!reports) {
        throw new Error(`Report with id ${reportId} does not exist`);
      }

      const posts = await ctx.prisma.post.findMany({
        orderBy: {
          date: "asc",
        },
        where: {
          reportId: input,
        },
      });

      const formattedPosts = posts.map((tempPost) => {
        const { date, createdAt, updatedAt, ...temppost } = tempPost;

        const formattedPost = {
          date: date.toISOString(),
          ...temppost,
        };
        return formattedPost;
      });

      return formattedPosts;
    }),

  /**
   * Get PostDbInput // ONLY NEEDED AS TYPE
   * @Input: postId: String
   */
  getPostDbInput: publicProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const postId = input;

      const post = await ctx.prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        throw new Error(`Report with id ${postId} does not exist`);
      }

      const { id, createdAt, updatedAt, ...postDbInput } = post;
      /* 
      const formattedPost = {
        date: date.toISOString(),
        ...temppost,
      };
      return formattedPost; */
      return postDbInput;
    }),
});
