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
        watt,
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

      await Promise.all(
        images.map(async (item, index) => {
          await ctx.prisma.image.update({
            where: { id: item.id }, // Specify the unique identifier for the image
            data: {
              postOrder: index, // Update the postOrder field with the current index
            },
          });
        })
      );

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
            connect: images.map((image) => ({ id: image.id })),
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
            connect: images.map((image) => ({ id: image.id })),
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

      // Check if watt is defined and not null or undefined
      if (watt !== undefined && watt !== null) {
        await ctx.prisma.lightWatts.upsert({
          where: { postId: id },
          update: { watt },
          create: {
            watt,
            post: { connect: { id } },
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
              postOrder: true,
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
          LightWatts: { select: { watt: true } }, // Select only the 'watt' field from LightWatts
        },
      });

      const formattedPosts = await Promise.all(
        posts.map(async (post) => {
          const postDate = new Date(post.date);
          const reportCreatedAt = report.createdAt;

          // Convert both dates to local time
          const localPostDate = new Date(postDate);
          const localReportCreatedAt = new Date(reportCreatedAt);

          // Set the time of day to midnight for both dates
          localPostDate.setHours(0, 0, 0, 0);
          localReportCreatedAt.setHours(0, 0, 0, 0);

          // Calculate the difference in milliseconds between the two dates
          const differenceInMs =
            localPostDate.getTime() - localReportCreatedAt.getTime();

          // Convert the difference from milliseconds to days
          const growDay = Math.floor(
            differenceInMs / (1000 * 60 * 60 * 24)
          );

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

          // Map images and handle postOrder
          const images = post.images.map(
            ({ id, publicId, cloudUrl, postOrder }) => ({
              id,
              publicId,
              cloudUrl,
              postOrder: postOrder ?? 0, // Default to 0 if postOrder is null
            })
          );

          return {
            ...strippedPost,
            likes: isoLikes,
            date: postDate.toISOString(),
            growDay,
            comments: isoComments,
            images,
          };
        })
      );

      return formattedPosts;
    }),
});
