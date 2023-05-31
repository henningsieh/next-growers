/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotificationEvent, Prisma } from "@prisma/client";
import { z } from "zod";
import { InputLike } from "~/helpers/inputValidation";

export const likeRouter = createTRPCRouter({
  getLikesByItemId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const likes = await ctx.prisma.like.findMany({
        where: {
          OR: [
            { reportId: input },
            { postId: input },
            { commentId: input },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      const formattedLikes = likes.map(
        ({ id, createdAt, updatedAt, user }) => ({
          id,
          userId: user.id,
          name: user.name,
          image: user.image,
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
        })
      );

      return formattedLikes;
    }),

  // like / dislike Report
  likeReport: protectedProcedure
    .input(InputLike)
    .mutation(async ({ ctx, input }) => {
      // Check if the report exists
      const existingReport = await ctx.prisma.report.findUnique({
        where: {
          id: input.id,
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
            reportId: input.id,
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
              id: input.id,
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
  dislikeReport: protectedProcedure
    .input(InputLike)
    .mutation(async ({ ctx, input }) => {
      // Check if the like exists
      const existingLike = await ctx.prisma.like.findFirst({
        where: {
          reportId: input.id,
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

  // like / dislike Post
  likePost: protectedProcedure
    .input(InputLike)
    .mutation(async ({ ctx, input }) => {
      // Check if the report exists
      const existingPost = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!existingPost) {
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
          userId_postId: {
            userId: ctx.session.user.id,
            postId: input.id,
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
          post: {
            connect: {
              id: input.id,
            },
          },
        },
      });
      // Create a notification for the report author
      await ctx.prisma.notification.create({
        data: {
          recipient: {
            connect: {
              id: existingPost.authorId,
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
  dislikePost: protectedProcedure
    .input(InputLike)
    .mutation(async ({ ctx, input }) => {
      // Check if the like exists
      const existingLike = await ctx.prisma.like.findFirst({
        where: {
          postId: input.id,
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

  // like / dislike Post
  likeComment: protectedProcedure
    .input(InputLike)
    .mutation(async ({ ctx, input }) => {
      // Check if the report exists
      const existingComment = await ctx.prisma.comment.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!existingComment) {
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
          userId_commentId: {
            userId: ctx.session.user.id,
            commentId: input.id,
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
          comment: {
            connect: {
              id: input.id,
            },
          },
        },
      });
      // Create a notification for the report author
      await ctx.prisma.notification.create({
        data: {
          recipient: {
            connect: {
              id: existingComment.authorId,
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
  dislikeCommentFIXME: protectedProcedure
    .input(InputLike)
    .mutation(async ({ ctx, input }) => {
      // Check if the like exists
      const existingLike = await ctx.prisma.like.findFirst({
        where: {
          postId: input.id,
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
