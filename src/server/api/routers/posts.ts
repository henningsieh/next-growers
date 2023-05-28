import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
import { z } from "zod";
import { InputCreatePostServer } from "~/helpers/inputValidation";

export const postRouter = createTRPCRouter({
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

      // console.debug("date", date);
      // Update the `updated_at` field of the connected report
      await ctx.prisma.report.update({
        where: {
          id: reportId,
        },
        data: {
          updatedAt: date,
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
        include: {
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
        },
      });

      const formattedPosts = posts.map((tempPost) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { date, createdAt, updatedAt, likes, ...temppost } =
          tempPost;

        const formattedPost = {
          date: date.toISOString(),
          likes: likes.map(({ id, createdAt, updatedAt, user }) => ({
            id,
            userId: user.id,
            name: user.name,
            createdAt: createdAt.toISOString(),
            updatedAt: updatedAt.toISOString(),
          })),
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
        include: {
          images: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!post) {
        throw new Error(`Post with id ${postId} does not exist`);
      }

      const imageIds = post.images.map((image) => image.id);

      return { ...post, images: imageIds };
    }),
});
