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
      const { searchstring, strain } =
        splitSearchString(search);

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
          author: {
            select: { id: true, name: true, image: true },
          },
          image: {
            select: {
              id: true,
              publicId: true,
              cloudUrl: true,
            },
          },
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

      const { searchstring, strain } =
        splitSearchString(search);

      const reports = await ctx.prisma.report.findMany({
        where: {
          authorId: ctx.session.user.id,
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
          author: {
            select: { id: true, name: true, image: true },
          },
          image: {
            select: {
              id: true,
              publicId: true,
              cloudUrl: true,
            },
          },
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
   * Get IsoReportwithPosts by Id
   * @Input: userId: String
   */
  getIsoReportsWithPostsFromDb: publicProcedure
    .input(InputGetReports)
    .query(({ ctx, input }) => {
      const { orderBy, desc, search } = input;
      const { searchstring, strain } =
        splitSearchString(search);
      return ctx.prisma.report
        .findMany({
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
            author: {
              select: { id: true, name: true, image: true },
            },
            image: {
              select: {
                id: true,
                publicId: true,
                cloudUrl: true,
              },
            },
            strains: {
              select: {
                id: true,
                name: true,
                description: true,
                effects: true,
                flavors: true,
              },
            },
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
            posts: {
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
                comments: true,
              },
            },
          },
        })
        .then(reportsFromDb => {
          // Convert all Dates to IsoStrings
          const isoReportsFromDb = reportsFromDb.map(
            reportFromDb => ({
              ...reportFromDb,
              createdAt: reportFromDb?.createdAt.toISOString(),
              updatedAt: reportFromDb?.updatedAt.toISOString(),

              likes: reportFromDb.likes.map(
                ({ id, createdAt, updatedAt, user }) => ({
                  id,
                  userId: user.id,
                  name: user.name,
                  createdAt: createdAt.toISOString(),
                  updatedAt: updatedAt.toISOString(),
                })
              ),

              posts: (reportFromDb?.posts || []).map(
                ({
                  date,
                  likes,
                  createdAt,
                  updatedAt,
                  ...post
                }) => ({
                  date: date.toISOString(),
                  likes: likes.map(
                    ({ id, createdAt, updatedAt, user }) => ({
                      id,
                      userId: user.id,
                      name: user.name,
                      createdAt: createdAt.toISOString(),
                      updatedAt: updatedAt.toISOString(),
                    })
                  ),
                  ...post,

                  comments: post.comments.map(comment => ({
                    ...comment,
                    createdAt: comment.createdAt.toISOString(),
                    updatedAt: comment.updatedAt.toISOString(),
                  })),
                })
              ),
            })
          );

          return isoReportsFromDb;
        });
    }),

  /**
   * Get Report by Id
   * @Input: userId: String
   */
  getIsoReportWithPostsFromDb: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const reportFromDb = await ctx.prisma.report.findUnique({
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          image: {
            select: {
              id: true,
              publicId: true,
              cloudUrl: true,
            },
          },
          strains: {
            select: {
              id: true,
              name: true,
              description: true,
              effects: true,
              flavors: true,
            },
          },
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
          posts: {
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
              comments: true,
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
          },
        },
        where: {
          id: input,
        },
      });
      // Convert all Dates to IsoStrings
      const isoReportFromDb = {
        ...reportFromDb,
        createdAt:
          reportFromDb?.createdAt.toISOString() as string,
        updatedAt:
          reportFromDb?.updatedAt.toISOString() as string,
        likes: reportFromDb?.likes.map(
          ({ id, createdAt, updatedAt, user }) => ({
            id,
            userId: user.id,
            name: user.name,
            createdAt: createdAt.toISOString(),
            updatedAt: updatedAt.toISOString(),
          })
        ),

        posts: (reportFromDb?.posts || []).map(
          ({ date, likes, createdAt, updatedAt, ...post }) => ({
            date: date.toISOString(),
            likes: likes.map(
              ({ id, createdAt, updatedAt, user }) => ({
                id,
                userId: user.id,
                name: user.name,
                createdAt: createdAt.toISOString(),
                updatedAt: updatedAt.toISOString(),
              })
            ),
            ...post,

            comments: post.comments.map(comment => ({
              ...comment,
              createdAt: comment.createdAt.toISOString(),
              updatedAt: comment.updatedAt.toISOString(),
            })),
          })
        ),
        strains: reportFromDb?.strains || [],
      };
      return isoReportFromDb;
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
          author: {
            select: { id: true, name: true, image: true },
          },
          image: {
            select: {
              id: true,
              publicId: true,
              cloudUrl: true,
            },
          },
        },
        where: {
          id: input,
        },
      });
      return reports.map(
        ({
          id,
          title,
          description,
          authorId,
          createdAt,
          updatedAt,
        }) => ({
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
      const existingReport = await ctx.prisma.report.findUnique(
        {
          where: {
            id: input,
          },
        }
      );
      if (!existingReport) {
        throw new Error("Report not found");
      }

      // Then, check if the user is the author of the report
      if (existingReport.authorId !== ctx.session.user.id) {
        throw new Error(
          "You are not authorized to delete this report"
        );
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
      const existingReport = await ctx.prisma.report.findUnique(
        {
          where: {
            id: input.id,
          },
        }
      );

      // Then, check if the user is the author of the report
      if (
        existingReport &&
        existingReport.authorId !== ctx.session.user.id
      ) {
        throw new Error(
          "You are not authorized to edit this report"
        );
      }

      // Update the report
      const { strains, createdAt, ...reportData } = input;
      const data = {
        ...reportData,
        authorId: ctx.session.user.id,
        strains: {
          set: strains.map(strainId => ({ id: strainId })),
        },
        createdAt: createdAt,
        // updatedAt: createdAt,
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
