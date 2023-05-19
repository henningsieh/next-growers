import { GrowStage, Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import { z } from "zod";

export const postRouter = createTRPCRouter({
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
   * Get post by id
   * @Input: postId: String
   */
  getPostById: publicProcedure
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

      const { date, createdAt, updatedAt, ...temppost } = post;

      const formattedPost = {
        date: date.toISOString(),
        ...temppost,
      };
      return formattedPost;
    }),
});
