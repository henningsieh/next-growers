import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import {
  InputCreatePostServer,
  InputDeletePost,
} from "~/utils/inputValidation";

export const postRouter = createTRPCRouter({
  deletePost: protectedProcedure
    .input(InputDeletePost)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // Retrieve the post by its id
      const post = await ctx.prisma.post.findUnique({
        where: {
          id,
        },
      });

      // Check if the post exists
      if (!post) {
        throw new Error(`The post with id ${id} does not exist.`);
      }

      // Ensure that the user has permission to delete the post
      if (post.authorId !== ctx.session.user.id) {
        throw new Error("You are not authorized to delete this post.");
      }

      // Mark the post as deleted
      // const updatedPost = await ctx.prisma.post.update({
      //   where: {
      //     id,
      //   },
      //   data: {
      //     isDeleted: true,
      //   },
      // });
      //
      // return updatedPost;

      // Delete the post
      await ctx.prisma.post.delete({
        where: {
          id,
        },
      });

      // Optionally, you can return a success message or some indicator of the deletion
      return {
        success: true,
        deletedPost: post,
      };
    }),

  createPost: protectedProcedure
    .input(InputCreatePostServer)
    .mutation(async ({ ctx, input }) => {
      const {
        id,
        date,
        title,
        content,
        growStage,
        lightHoursPerDay,
        reportId,
        authorId,
        images, // Include the images field in the input
      } = input;

      const report = await ctx.prisma.report.findFirst({
        where: {
          id: reportId,
        },
      });

      if (authorId != ctx.session.user.id) {
        throw new Error(
          "A SECURITY ISSSUE OCCURED! (Missmatch: authorId != userId )"
        );
      }

      if (!report) {
        throw new Error(
          `The report with id: ${reportId} does not exist`
        );
      }

      if (report.authorId != ctx.session.user.id) {
        throw new Error(
          `You are not the owner of this report with id: ${reportId}`
        );
      }

      // const formattedDate = new Date(date);

      const post = await ctx.prisma.post.upsert({
        where: { id }, // Optional: Set the condition for upserting based on the id
        update: {
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
          images: {
            connect: images.map((imageId) => ({ id: imageId })),
          },
        },
        create: {
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
          images: {
            connect: images.map((imageId) => ({ id: imageId })),
          },
        },
      });

      // Update the `updated_at` field of the connected report to the
      // newest/youngest Post.date of all Posts of the connected report

      // Find all posts associated with the report
      const allConnectedPosts = await ctx.prisma.post.findMany({
        where: {
          reportId,
        },
        orderBy: {
          date: "desc", // Order by date in descending order to get the newest date first
        },
        select: {
          date: true,
        },
      });

      // Find the newest date among all posts
      const newestDateOfallConnectedPosts =
        allConnectedPosts.length > 0 ? allConnectedPosts[0].date : null;

      // Update the `updated_at` field of the connected report
      if (newestDateOfallConnectedPosts) {
        await ctx.prisma.report.update({
          where: {
            id: reportId,
          },
          data: {
            updatedAt: newestDateOfallConnectedPosts,
          },
        });
      }

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

      const report = await ctx.prisma.report.findUnique({
        where: {
          id: reportId,
        },
      });

      if (!report) {
        throw new Error(`Report with id ${reportId} does not exist`);
      }

      const posts = await ctx.prisma.post.findMany({
        orderBy: {
          date: "asc",
        },
        where: {
          // isDeleted: false,
          reportId: input,
        },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          images: {
            select: {
              id: true,
              publicId: true,
              cloudUrl: true,
            },
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
          comments: true,
        },
      });

      const formattedPosts = await Promise.all(
        posts.map(async (post) => {
          const date = new Date(post.date);
          const growDay =
            Math.floor(
              (new Date(post.date).getTime() -
                report.createdAt.getTime()) /
                (1000 * 60 * 60 * 24)
            ) + 1; // Adding 1 to get 1-based indexing

          const isoLikes = post.likes.map(
            ({ id, createdAt, updatedAt, user }) => ({
              id,
              userId: user.id,
              name: user.name,
              createdAt: createdAt.toISOString(),
              updatedAt: updatedAt.toISOString(),
            })
          );

          const comments = await ctx.prisma.comment.findMany({
            where: {
              postId: post.id,
            },
            orderBy: {
              createdAt: "asc",
            },
          });

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
      );

      return formattedPosts;
    }),
});
