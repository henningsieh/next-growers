/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { splitSearchString } from "~/helpers";
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

export const reportRouter = createTRPCRouter({
  /**
   * Get Own IsoReportwithPosts with SearchString
   * @Input: orderBy: z.ZodString; desc: z.ZodBoolean; search: z.ZodString;
   */
  getOwnIsoReportsWithPostsFromDb: protectedProcedure
    .input(InputGetReports)
    .query(({ ctx, input }) => {
      const { orderBy, desc, search } = input;
      const { searchstring, strain } = splitSearchString(search);
      return ctx.prisma.report
        .findMany({
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
            strains: strain
              ? {
                  some: {
                    name: {
                      contains: strain,
                      mode: "insensitive",
                    },
                  },
                }
              : {},
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
              orderBy: {
                date: "asc",
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
        .then((reportsFromDb) => {
          // Convert all Dates to IsoStrings
          const isoReportsFromDb = reportsFromDb.map((reportFromDb) => {
            const isoPosts = (reportFromDb?.posts || []).map((post) => {
              const postDate = new Date(post.date);
              const reportCreatedAt = new Date(reportFromDb.createdAt);
              const timeDifference =
                postDate.getTime() - reportCreatedAt.getTime();
              const growDay = Math.floor(
                timeDifference / (1000 * 60 * 60 * 24)
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

              const isoComments = post.comments.map((comment) => ({
                ...comment,
                createdAt: comment.createdAt.toISOString(),
                updatedAt: comment.updatedAt.toISOString(),
              }));

              return {
                ...post,
                date: postDate.toISOString(),
                likes: isoLikes,
                comments: isoComments,
                growDay,
              };
            });

            const isoLikes = reportFromDb.likes.map(
              ({ id, createdAt, updatedAt, user }) => ({
                id,
                userId: user.id,
                name: user.name,
                createdAt: createdAt.toISOString(),
                updatedAt: updatedAt.toISOString(),
              })
            );

            return {
              ...reportFromDb,
              createdAt: reportFromDb?.createdAt.toISOString(),
              updatedAt: reportFromDb?.updatedAt.toISOString(),
              likes: isoLikes,
              posts: isoPosts,
            };
          });

          return isoReportsFromDb;
        });
    }),

  /**
   * Get IsoReportwithPosts with SearchString
   * @Input: orderBy: z.ZodString; desc: z.ZodBoolean; search: z.ZodString;
   */
  getIsoReportsWithPostsFromDb: publicProcedure
    .input(InputGetReports)
    .query(({ ctx, input }) => {
      const { orderBy, desc, search } = input;
      const { searchstring, strain } = splitSearchString(search);
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
              orderBy: {
                date: "asc",
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
        .then((reportsFromDb) => {
          // Convert all Dates to IsoStrings
          const isoReportsFromDb = reportsFromDb.map((reportFromDb) => {
            const isoPosts = (reportFromDb?.posts || []).map((post) => {
              const postDate = new Date(post.date);
              const reportCreatedAt = new Date(reportFromDb.createdAt);
              const timeDifference =
                postDate.getTime() - reportCreatedAt.getTime();
              const growDay = Math.floor(
                timeDifference / (1000 * 60 * 60 * 24)
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

              const isoComments = post.comments.map((comment) => ({
                ...comment,
                createdAt: comment.createdAt.toISOString(),
                updatedAt: comment.updatedAt.toISOString(),
              }));

              return {
                ...post,
                date: postDate.toISOString(),
                likes: isoLikes,
                comments: isoComments,
                growDay,
              };
            });

            const isoLikes = reportFromDb.likes.map(
              ({ id, createdAt, updatedAt, user }) => ({
                id,
                userId: user.id,
                name: user.name,
                createdAt: createdAt.toISOString(),
                updatedAt: updatedAt.toISOString(),
              })
            );

            return {
              ...reportFromDb,
              createdAt: reportFromDb?.createdAt.toISOString(),
              updatedAt: reportFromDb?.updatedAt.toISOString(),
              likes: isoLikes,
              posts: isoPosts,
            };
          });

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
            orderBy: {
              date: "asc",
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
          },
        },
        where: {
          id: input,
        },
      });
      // Convert all Dates to IsoStrings
      const isoReportFromDb = {
        ...reportFromDb,
        createdAt: reportFromDb?.createdAt.toISOString() as string,
        updatedAt: reportFromDb?.updatedAt.toISOString() as string,
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
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ({ date, likes, createdAt, updatedAt, ...post }) => {
            const postDate = new Date(date);
            const reportCreatedAt = new Date(
              reportFromDb?.createdAt as Date
            );
            const timeDifference =
              postDate.getTime() - reportCreatedAt.getTime();
            const growDay = Math.floor(
              timeDifference / (1000 * 60 * 60 * 24) + 1
            );

            const isoLikes = likes.map(
              ({ id, createdAt, updatedAt, user }) => ({
                id,
                userId: user.id,
                name: user.name,
                createdAt: createdAt.toISOString(),
                updatedAt: updatedAt.toISOString(),
              })
            );

            const isoComments = post.comments.map((comment) => ({
              ...comment,
              createdAt: comment.createdAt.toISOString(),
              updatedAt: comment.updatedAt.toISOString(),
            }));

            return {
              date: postDate.toISOString(),
              likes: isoLikes,
              ...post,
              comments: isoComments,
              growDay,
            };
          }
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
      if (
        existingReport &&
        existingReport.authorId !== ctx.session.user.id
      ) {
        throw new Error("You are not authorized to edit this report");
      }

      // Update the report
      const { strains, createdAt, imageId, ...reportData } = input;
      const data = {
        ...reportData,
        authorId: ctx.session.user.id,
        strains: {
          set: strains.map((strainId) => ({ id: strainId })),
        },
        image: {
          connect: {
            id: imageId,
          },
        },

        createdAt: createdAt,
        // updatedAt: createdAt,
      };
      console.debug(data);
      const report = await ctx.prisma.report.update({
        where: {
          id: input.id,
        },
        data,
      });

      return report;
    }),
});
