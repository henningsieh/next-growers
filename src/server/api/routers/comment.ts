import { NotificationEvent } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import {
  InputEditCommentForm,
  InputGetCommentsByPostId,
} from "~/utils/inputValidation";

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

      const comments = await ctx.prisma.comment
        .findMany({
          orderBy: {
            createdAt: "desc",
          },
          where: {
            postId: postId,
            isResponseTo: null, // Filter out comments that are responses, they come as 'responses[]'
          },
          include: {
            isResponseTo: true, // Include the "mother" comment if it exists
            responses: {
              orderBy: {
                createdAt: "asc",
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
                responses: {
                  orderBy: {
                    createdAt: "asc",
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
                    responses: true, // Include the array of responses for each response
                    isResponseTo: true, // Include the isResponseTo field for each response
                  },
                },
                isResponseTo: true, // Include the isResponseTo field for each response
              },
            },
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
        })
        .then((comments) => {
          const commentsWithIsoLikes = comments.map((comment) => {
            const isoLikes = comment.likes.map(
              ({ id, createdAt, updatedAt, user }) => ({
                id,
                userId: user.id,
                name: user.name,
                createdAt: new Date(createdAt).toISOString(),
                updatedAt: new Date(updatedAt).toISOString(),
              })
            );

            const responsesWithIsoLikes = comment.responses.map(
              (response) => {
                const isoLikes = response.likes.map(
                  ({ id, createdAt, updatedAt, user }) => ({
                    id,
                    userId: user.id,
                    name: user.name,
                    createdAt: new Date(createdAt).toISOString(),
                    updatedAt: new Date(updatedAt).toISOString(),
                  })
                );

                return {
                  ...response,
                  likes: isoLikes,
                };
              }
            );

            return {
              ...comment,
              likes: isoLikes,
              responses: responsesWithIsoLikes,
            };
          });

          return commentsWithIsoLikes;
        });

      //console.debug({ comments });
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
    .input(InputEditCommentForm)
    .mutation(async ({ ctx, input }) => {
      const {
        id,
        isResponseTo: isResponseToId,
        postId,
        content,
      } = input;

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

        console.debug("isResponseToId", isResponseToId);

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

        // Create the new comment
        const newComment = await ctx.prisma.comment.create({
          data: {
            isResponseTo: isResponseToId
              ? { connect: { id: isResponseToId } }
              : undefined,
            content,
            author: { connect: { id: ctx.session.user.id } },
            post: { connect: { id: postId } },
          },
        });

        // Initialize notifiedAuthors set outside of the if block
        const notifiedAuthors = new Set<string>();

        // Create a notification for the author of the respondedToComment if response
        const respondedToComment = await ctx.prisma.comment.findUnique({
          where: {
            id: isResponseToId,
          }, // Assuming isResponseTo contains the ID of the responded comment
          select: {
            authorId: true,
            responses: { select: { authorId: true } },
          }, // Selecting only the authorId field
        });

        if (respondedToComment != null) {
          const responseAuthors = [
            respondedToComment.authorId,
            ...respondedToComment.responses?.map(
              (response) => response.authorId
            ),
          ];

          // Deduplicate authorIds
          const uniqueAuthors = Array.from(new Set(responseAuthors));

          // Create a notification for each unique author
          for (const notificationRecipientAuthorId of uniqueAuthors) {
            // Skip if this is the author of the newComment itself or if already notified
            if (
              newComment.authorId != notificationRecipientAuthorId &&
              !notifiedAuthors.has(notificationRecipientAuthorId)
            ) {
              await ctx.prisma.notification.create({
                data: {
                  recipient: {
                    connect: { id: notificationRecipientAuthorId }, // Connect to the author of the responded comment or response
                  },
                  event: NotificationEvent.COMMENT_ANSWERED, // Assuming you have a specific event type for comment replies
                  comment: {
                    connect: { id: newComment.id }, // Connect to the newly created comment
                  },
                },
              });

              // Add the author to the notified set
              notifiedAuthors.add(notificationRecipientAuthorId);
            }
          }
        }

        // Create a notification for the author of the Grow, but
        // only if this is NOT the author of the newComment itself and not already notified.

        if (
          post.authorId != newComment.authorId &&
          !notifiedAuthors.has(post.authorId)
        ) {
          await ctx.prisma.notification.create({
            data: {
              recipient: {
                connect: {
                  id: post.authorId,
                },
              },
              event: NotificationEvent.COMMENT_CREATED,
              comment: {
                connect: {
                  id: newComment.id,
                },
              },
            },
          });
        }

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
