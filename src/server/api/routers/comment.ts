import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
import { z } from "zod";
import {
  InputCreatePostServer,
  InputGetCommentsByPostId,
  InputSaveComment,
} from "~/helpers/inputValidation";

export const commentRouter = createTRPCRouter({
  /**
   * Get all posts for a report
   * @Input: reportId: String
   */
  getCommentsByPostId: publicProcedure
    .input(InputGetCommentsByPostId)
    .query(async ({ ctx, input }) => {
      const { postId } = input;

      const post = await ctx.prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        throw new Error(`Post with id ${postId} does not exist`);
      }

      const comments = await ctx.prisma.comment.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          postId: postId,
        },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          likes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });
      /* 
      const formattedPosts = await Promise.all(
        posts.map(async (post) => {
          const date = new Date(post.date);
          const growDay =
            Math.floor(
              (new Date(post.date).getTime() -
                report.createdAt.getTime()) /
                (1000 * 60 * 60 * 24)
            ) + 1; // Adding 1 to get 1-based indexing

          const comments = await ctx.prisma.comment.findMany({
            where: {
              postId: post.id,
            },
            orderBy: {
              createdAt: "asc",
            },
          });

          const isoLikes = post.likes.map(
            ({ id, createdAt, updatedAt, user }) => ({
              id,
              userId: user.id,
              name: user.name,
              createdAt: createdAt.toISOString(),
              updatedAt: updatedAt.toISOString(),
            })
          );

          const isoComments = comments.map((comment) => ({
            ...comment,
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString(),
          }));

          // Omitting createdAt and updatedAt properties from post
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { createdAt, updatedAt, likes, ...strippedPost } = post;

          return {
            ...strippedPost,
            likes: isoLikes,
            date: date.toISOString(),
            growDay,
            comments: isoComments,
          };
        })
      ); */

      return comments;
    }),

  saveComment: protectedProcedure
    .input(InputSaveComment)
    .mutation(async ({ ctx, input }) => {
      const { id, postId, content } = input;

      if (id) {
        // Saving an edited comment
        const existingComment = await ctx.prisma.comment.findUnique({
          where: { id },
        });

        if (!existingComment) {
          throw new Error(`Comment with id ${id} does not exist`);
        }

        if (existingComment.authorId !== ctx.session.user.id) {
          throw new Error(
            "You are not authorized to edit this comment"
          );
        }

        const updatedComment = await ctx.prisma.comment.update({
          where: { id },
          data: { content },
        });

        return updatedComment;
      } else {
        // Creating a new comment
        const post = await ctx.prisma.post.findUnique({
          where: { id: postId },
        });

        if (!post) {
          throw new Error(`Post with id ${postId} does not exist`);
        }

        const newComment = await ctx.prisma.comment.create({
          data: {
            content,
            author: { connect: { id: ctx.session.user.id } },
            post: { connect: { id: postId } },
          },
        });

        return newComment;
      }
    }),

  deleteCommentById: protectedProcedure
    .input(z.string().nonempty())
    .mutation(async ({ ctx, input }) => {
      const commentId = input;

      const existingComment = await ctx.prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!existingComment) {
        throw new Error(`Comment with id ${commentId} does not exist`);
      }

      if (existingComment.authorId !== ctx.session.user.id) {
        throw new Error(
          "You are not authorized to delete this comment"
        );
      }

      const deletedComment = await ctx.prisma.comment.delete({
        where: { id: commentId },
      });

      return deletedComment;
    }),
});
