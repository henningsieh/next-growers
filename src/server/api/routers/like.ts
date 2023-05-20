import { InputDeletelike, InputLike } from "~/helpers/inputValidation";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotificationEvent, Prisma } from "@prisma/client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const likeRouter = createTRPCRouter({
  likeReport: protectedProcedure
    .input(InputLike)
    .mutation(async ({ ctx, input }) => {
      // Check if the report exists
      const existingReport = await ctx.prisma.report.findUnique({
        where: {
          id: input.reportId,
        },
      });
      if (!existingReport) {
        throw new Error("Report does not exist");
      }

      // Check if the user exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!existingUser) {
        throw new Error("User does not exist");
      }

      // Check if the user has already liked the report
      const existingLike = await ctx.prisma.like.findUnique({
        where: {
          userId_reportId: {
            userId: ctx.session.user.id,
            reportId: input.reportId,
          },
        },
      });
      if (existingLike) {
        throw new Error("You have already liked this report");
      }

      // Create a new like
      const like = await ctx.prisma.like.create({
        data: {
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          report: {
            connect: {
              id: input.reportId,
            },
          },
        },
      });
      // Create a notification for the report author
      await ctx.prisma.notification.create({
        data: {
          recipient: {
            connect: {
              id: existingReport.authorId,
            },
          },
          event: NotificationEvent.LIKE_CREATED,
          like: {
            connect: {
              id: like.id,
            },
          },
        },
      });
      return like;
    }),

  deleteLike: protectedProcedure
    .input(InputDeletelike)
    .mutation(async ({ ctx, input }) => {
      // Check if the like exists
      const existingLike = await ctx.prisma.like.findFirst({
        where: {
          reportId: input.reportId,
          userId: ctx.session.user.id,
        },
      });
      if (!existingLike) {
        throw new Error("Like does not exist");
      }

      // Check if the user is the owner of the like
      if (existingLike.userId !== ctx.session.user.id) {
        throw new Error("You are not the owner of this like");
      }

      // Delete the like
      try {
        await ctx.prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });
      } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.debug(error.message);
          throw new Error(`Failed to delete like: ${error.message}`);
        } else {
          throw new Error("Failed to delete like");
        }
      }

      return true;
    }),
});
