/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  InputCreateReport,
  InputEditReport,
  InputGetReports,
} from "~/helpers/inputValidation";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import type { SplitObject } from "~/types";
import { splitSearchString } from "~/helpers";
import { z } from "zod";

export const reportRouter = createTRPCRouter({
  /**
   * Get all Reports with author information
   */
  getAllReports: publicProcedure
    .input(InputGetReports)
    .query(async ({ ctx, input }) => {
      const { orderBy, desc, search } = input;

      const { searchstring, strain } = splitSearchString(search);

      const reports = await ctx.prisma.report.findMany({
        where: {
          OR: [
            {
              title: {
                contains: searchstring,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: searchstring,
                mode: "insensitive",
              },
            },
            {
              author: {
                name: {
                  contains: searchstring,
                  mode: "insensitive",
                },
              },
            },
          ],
          strains: {
            some: {
              name: {
                contains: strain,
                mode: "insensitive",
              },
            },
          },
        },
        orderBy: {
          [orderBy]: desc ? "desc" : "asc",
        },
        include: {
          author: { select: { id: true, name: true, image: true } },
          image: { select: { id: true, publicId: true, cloudUrl: true } },
          strains: true,
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

      return reports.map(
        ({
          id,
          image,
          title,
          description,
          strains,
          author,
          likes,
          createdAt,
          updatedAt,
        }) => ({
          id,
          imagePublicId: image?.publicId,
          imageCloudUrl: image?.cloudUrl,
          title,
          description,
          strains,
          authorId: author?.id,
          authorName: author?.name,
          authorImage: author?.image,
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
          // Map the Like relation to extract user information
          likes: likes.map(({ id, user }) => ({
            id,
            userId: user.id,
            name: user.name,
          })),
        })
      );
    }),

  /**
   * Get own Reports by authorId
   * @Input: userId: String
   */
  getOwnReports: protectedProcedure
    .input(InputGetReports)
    .query(async ({ ctx, input }) => {
      const { orderBy, desc, search } = input;

      const { searchstring, strain } = splitSearchString(search);

      const reports = await ctx.prisma.report.findMany({
        where: {
          OR: [
            {
              title: {
                contains: searchstring,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: searchstring,
                mode: "insensitive",
              },
            },
            {
              author: {
                name: {
                  contains: searchstring,
                  mode: "insensitive",
                },
              },
            },
          ],
          strains: {
            some: {
              name: {
                contains: strain,
                mode: "insensitive",
              },
            },
          },
        },
        orderBy: {
          [orderBy]: desc ? "desc" : "asc",
        },
        include: {
          author: { select: { id: true, name: true, image: true } },
          image: { select: { id: true, publicId: true, cloudUrl: true } },
          strains: true,
          likes: {
            // Include the Like relation and select the users who liked the report
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
      return reports.map(
        ({
          id,
          image,
          title,
          description,
          strains,
          author,
          likes,
          createdAt,
          updatedAt,
        }) => ({
          id,
          imagePublicId: image?.publicId,
          imageCloudUrl: image?.cloudUrl,
          title,
          description,
          strains,
          authorId: author?.id,
          authorName: author?.name,
          authorImage: author?.image,
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
          likes: likes.map(({ id, user }) => ({
            id,
            userId: user.id,
            name: user.name,
          })),
        })
      );
    }),

  /**
   * Get Report by Id
   * @Input: userId: String
   */
  getReportById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const report = await ctx.prisma.report.findUnique({
        include: {
          author: { select: { id: true, name: true, image: true } },
          image: { select: { id: true, publicId: true, cloudUrl: true } },
          strains: true,
        },
        where: {
          id: input,
        },
      });
      return {
        id: report?.id,
        imagePublicId: report?.image?.publicId,
        imageCloudUrl: report?.image?.cloudUrl,
        title: report?.title,
        description: report?.description,
        strains: report?.strains,
        authorId: report?.author?.id,
        authorName: report?.author?.name,
        authorImage: report?.author?.image,
        createdAt: report?.createdAt.toISOString(),
        updatedAt: report?.updatedAt.toISOString(),
      };
    }),

  /**
   * Get Reports by foreign AuthourId
   * @Input: userId: String
   */
  getReportsByAuthorId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const reports = await ctx.prisma.report.findMany({
        include: {
          author: { select: { id: true, name: true, image: true } },
          image: { select: { id: true, publicId: true, cloudUrl: true } },
        },
        where: {
          id: input,
        },
      });
      return reports.map(
        ({ id, title, description, authorId, createdAt, updatedAt }) => ({
          id,
          title,
          description,
          authorId,
          createdAt,
          updatedAt,
        })
      );
    }),

  deleteOwnReport: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // First, check if the report exists
      const existingReport = await ctx.prisma.report.findUnique({
        where: {
          id: input,
        },
      });
      if (!existingReport) {
        throw new Error("Report not found");
      }

      // Then, check if the user is the author of the report
      if (existingReport.authorId !== ctx.session.user.id) {
        throw new Error("You are not authorized to delete this report");
      }

      // Finally, delete the report
      await ctx.prisma.report.delete({
        where: {
          id: input,
        },
      });

      return { success: true };
    }),

  create: protectedProcedure
    .input(InputCreateReport)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.report.create({
        data: {
          title: input.title,
          description: input.description,
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          image: {
            connect: {
              id: input.imageId,
            },
          },
        },
      });
    }),

  saveReport: protectedProcedure
    .input(InputEditReport)
    .mutation(async ({ ctx, input }) => {
      // First, check if the report exists
      const existingReport = await ctx.prisma.report.findUnique({
        where: {
          id: input.id,
        },
      });

      // Then, check if the user is the author of the report
      if (existingReport && existingReport.authorId !== ctx.session.user.id) {
        throw new Error("You are not authorized to edit this report");
      }

      // Update the report
      const { strains, ...reportData } = input;
      const data = {
        ...reportData,
        authorId: ctx.session.user.id,
        strains: {
          set: strains.map((strainId) => ({ id: strainId })),
        },
      };
      const report = await ctx.prisma.report.update({
        where: {
          id: input.id,
        },
        data,
      });

      return report;
    }),
});
