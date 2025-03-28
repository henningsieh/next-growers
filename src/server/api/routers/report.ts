/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { splitSearchString } from "~/utils/helperUtils";
import {
  InputCreateReportForm,
  InputEditReportForm,
  InputGetReports,
} from "~/utils/inputValidation";

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
            /*
            strains: {
              //FIXME: workaround for hiding "unready" (without strains) reports
              some: {
                name: {
                  contains: strain,
                  mode: "insensitive",
                },
              },
            },
            */

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
            plants: {
              select: {
                id: true,
                plantName: true,
                seedfinderStrain: {
                  select: {
                    id: true,
                    name: true,
                    picture_url: true,
                    strainId: true,
                    breeder_name: true,
                    breeder_logo_url: true,
                    breederId: true,
                    type: true,
                    cbd: true,
                    description: true,
                    flowering_days: true,
                    flowering_info: true,
                    flowering_automatic: true,
                    seedfinder_ext_url: true,
                    breeder_description: true,
                    breeder_website_url: true,
                  },
                },
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
            },
            // count posts instead of fetching them
            _count: {
              select: {
                posts: true,
              },
            },
          },
        })
        .then((reportsFromDb) => {
          const isoReportsFromDb = reportsFromDb.map((reportFromDb) => {
            const isoPosts =
              (reportFromDb.posts || []).length > 0
                ? reportFromDb.posts.map((post) => {
                    const postDate = new Date(post.date).toISOString();
                    const reportCreatedAt = reportFromDb?.createdAt;

                    // Convert both dates to local time
                    const localPostDate = new Date(postDate);
                    const localReportCreatedAt = new Date(
                      reportCreatedAt
                    );

                    // Set the time of day to midnight for both dates
                    localPostDate.setHours(0, 0, 0, 0);
                    localReportCreatedAt.setHours(0, 0, 0, 0);

                    // Calculate the difference in milliseconds between the two dates
                    const differenceInMs =
                      localPostDate.getTime() -
                      localReportCreatedAt.getTime();

                    // Convert the difference from milliseconds to days
                    const growDay = Math.floor(
                      differenceInMs / (1000 * 60 * 60 * 24)
                    );

                    const isoLikes = post.likes.map(
                      ({ id, createdAt, updatedAt, user }) => ({
                        id,
                        userId: user.id,
                        name: user.name,
                        createdAt: new Date(createdAt).toISOString(),
                        updatedAt: new Date(updatedAt).toISOString(),
                      })
                    );

                    const isoImages = post.images.map(
                      ({ id, cloudUrl, publicId, postOrder }) => ({
                        id,
                        publicId,
                        cloudUrl,
                        postOrder: postOrder == null ? 0 : postOrder,
                      })
                    );

                    const isoComments = post.comments.map(
                      (comment) => ({
                        ...comment,
                        createdAt: new Date(
                          comment.createdAt
                        ).toISOString(),
                        updatedAt: new Date(
                          comment.updatedAt
                        ).toISOString(),
                      })
                    );

                    return {
                      ...post,
                      createdAt: post.createdAt.toISOString(),
                      updatedAt: post.createdAt.toISOString(),
                      date: postDate,
                      likes: isoLikes,
                      images: isoImages,
                      comments: isoComments,
                      growDay,
                    };
                  })
                : [];

            const isoLikes = reportFromDb.likes.map(
              ({ id, createdAt, updatedAt, user }) => ({
                id,
                userId: user.id,
                name: user.name,
                createdAt: new Date(createdAt).toISOString(),
                updatedAt: new Date(updatedAt).toISOString(),
              })
            );

            const newestPostDate =
              reportsFromDb.length > 0
                ? new Date(
                    Math.max(
                      ...isoPosts.map((post) =>
                        new Date(post.date).getTime()
                      )
                    )
                  )
                : null;

            // Destructure to omit 'posts'
            const { posts: _posts, ...rest } = reportFromDb;
            return {
              ...rest,
              likes: isoLikes,
              postCount: reportFromDb._count?.posts,
              updatedAt: newestPostDate
                ? newestPostDate.toISOString()
                : reportFromDb.updatedAt.toISOString(),
              createdAt: reportFromDb.createdAt.toISOString(),
            };
          });

          return isoReportsFromDb;
        });
    }),

  /**
   * Get IsoReportwithPosts with SearchString
   * @Input: orderBy: z.ZodString; desc: z.ZodBoolean; search: z.ZodString;
   */
  getIsoReportsWithPostsCountFromDb: publicProcedure
    .input(InputGetReports)
    .query(async ({ ctx, input }) => {
      const { orderBy, desc, search, page, pageSize } = input;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { searchstring, strain } = splitSearchString(search);

      const skip = (page - 1) * pageSize;
      const take = pageSize;

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
            // Ensure reports have at least one post
            posts: {
              some: {}, // This filters for reports that have at least one post
            },
            // strains: {
            //   //FIXME: workaround for hiding "unready" (without strains) reports
            //   some: {
            //     name: {
            //       contains: strain,
            //       mode: "insensitive",
            //     },
            //   },
            // },
            /* 
            strains: strain
              ? {
                  some: {
                    name: {
                      contains: strain,
                      mode: "insensitive",
                    },
                  },
                }
              : {}, */
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
            plants: {
              select: {
                id: true,
                plantName: true,
                seedfinderStrain: {
                  select: {
                    id: true,
                    name: true,
                    picture_url: true,
                    strainId: true,
                    breeder_name: true,
                    breeder_logo_url: true,
                    breederId: true,
                    type: true,
                    cbd: true,
                    description: true,
                    flowering_days: true,
                    flowering_info: true,
                    flowering_automatic: true,
                    seedfinder_ext_url: true,
                    breeder_description: true,
                    breeder_website_url: true,
                  },
                },
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
            },
            // count posts instead of fetching them
            _count: {
              select: {
                posts: true,
              },
            },
          },
          orderBy: {
            [orderBy]: desc ? "desc" : "asc",
          },
          skip,
          take,
        })
        .then(async (reportsFromDb) => {
          const totalCount = await ctx.prisma.report.count({
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
              // Also add the same filter to the count query
              posts: {
                some: {}, // This ensures we only count reports with at least one post
              },
            },
          });

          const isoReportsFromDb = reportsFromDb.map((reportFromDb) => {
            const isoPosts =
              (reportFromDb.posts || []).length > 0
                ? reportFromDb.posts.map((post) => {
                    const postDate = new Date(post.date).toISOString();
                    const reportCreatedAt = reportFromDb?.createdAt;

                    // Convert both dates to local time
                    const localPostDate = new Date(postDate);
                    const localReportCreatedAt = new Date(
                      reportCreatedAt
                    );

                    // Set the time of day to midnight for both dates
                    localPostDate.setHours(0, 0, 0, 0);
                    localReportCreatedAt.setHours(0, 0, 0, 0);

                    // Calculate the difference in milliseconds between the two dates
                    const differenceInMs =
                      localPostDate.getTime() -
                      localReportCreatedAt.getTime();

                    // Convert the difference from milliseconds to days
                    const growDay = Math.floor(
                      differenceInMs / (1000 * 60 * 60 * 24)
                    );

                    const isoLikes = post.likes.map(
                      ({ id, createdAt, updatedAt, user }) => ({
                        id,
                        userId: user.id,
                        name: user.name,
                        createdAt: new Date(createdAt).toISOString(),
                        updatedAt: new Date(updatedAt).toISOString(),
                      })
                    );

                    const isoImages = post.images.map(
                      ({ id, cloudUrl, publicId, postOrder }) => ({
                        id,
                        publicId,
                        cloudUrl,
                        postOrder: postOrder == null ? 0 : postOrder,
                      })
                    );

                    const isoComments = post.comments.map(
                      (comment) => ({
                        ...comment,
                        createdAt: new Date(
                          comment.createdAt
                        ).toISOString(),
                        updatedAt: new Date(
                          comment.updatedAt
                        ).toISOString(),
                      })
                    );

                    return {
                      ...post,
                      createdAt: post.createdAt.toISOString(),
                      updatedAt: post.createdAt.toISOString(),
                      date: postDate,
                      likes: isoLikes,
                      images: isoImages,
                      comments: isoComments,
                      growDay,
                    };
                  })
                : [];

            const isoLikes = reportFromDb.likes.map(
              ({ id, createdAt, updatedAt, user }) => ({
                id,
                userId: user.id,
                name: user.name,
                createdAt: new Date(createdAt).toISOString(),
                updatedAt: new Date(updatedAt).toISOString(),
              })
            );

            const newestPostDate =
              isoPosts.length > 0
                ? new Date(
                    Math.max(
                      ...isoPosts.map((post) =>
                        new Date(post.date).getTime()
                      )
                    )
                  )
                : null;

            // Destructure to omit 'posts'
            const { posts: _posts, ...rest } = reportFromDb;
            return {
              ...rest,
              likes: isoLikes,
              postCount: reportFromDb._count?.posts,
              updatedAt: newestPostDate
                ? newestPostDate.toISOString()
                : reportFromDb.updatedAt.toISOString(),
              createdAt: reportFromDb.createdAt.toISOString(),
            };
          });

          return {
            totalCount: totalCount,
            isoReportsFromDb,
          };
        });
    }),

  /**
   * Get Report by Id
   * @Input: reportId: String
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
          plants: {
            select: {
              id: true,
              plantName: true,
              seedfinderStrain: {
                select: {
                  id: true,
                  name: true,
                  picture_url: true,
                  strainId: true,
                  breeder_name: true,
                  breeder_logo_url: true,
                  breederId: true,
                  type: true,
                  cbd: true,
                  description: true,
                  flowering_days: true,
                  flowering_info: true,
                  flowering_automatic: true,
                  seedfinder_ext_url: true,
                  breeder_description: true,
                  breeder_website_url: true,
                },
              },
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
          },
        },
        where: {
          id: input,
        },
      });

      // If reportFromDb is null, it means no report was found with the given ID
      if (!reportFromDb) {
        // Throw an error using tRPC's built-in error handling
        throw new TRPCError({
          code: "NOT_FOUND",
          // no catch error available
          message: `Grow with ID ${input} was not found.`,
          // cause: error,
        });
      }

      // Convert all Dates to IsoStrings
      const newestPostDate = reportFromDb?.posts.reduce(
        (prevDate, post) => {
          const postDate = new Date(post.date);
          return postDate > prevDate ? postDate : prevDate;
        },
        new Date(reportFromDb.createdAt)
      );

      const isoReportFromDb = {
        ...reportFromDb,
        createdAt: reportFromDb.createdAt.toISOString(),
        updatedAt: newestPostDate
          ? newestPostDate.toISOString()
          : reportFromDb?.updatedAt.toISOString(),
        likes: reportFromDb?.likes.map(
          ({ id, createdAt, updatedAt, user }) => ({
            id,
            userId: user.id,
            name: user.name,
            createdAt: createdAt.toISOString(),
            updatedAt: updatedAt.toISOString(),
          })
        ),

        posts: (reportFromDb.posts || []).map((post) => {
          const postDate = new Date(post.date);
          const reportCreatedAt = reportFromDb?.createdAt;

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

          const isoImages = post.images.map(
            ({ id, cloudUrl, publicId, postOrder }) => ({
              id,
              publicId,
              cloudUrl,
              postOrder: postOrder == null ? 0 : postOrder,
            })
          );

          const isoComments = post.comments.map((comment) => ({
            ...comment,
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString(),
          }));

          return {
            ...post,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.createdAt.toISOString(),
            date: postDate.toISOString(),
            likes: isoLikes,
            images: isoImages,
            comments: isoComments,
            growDay,
          };
        }),
        strains: reportFromDb?.strains || [],
      };

      return isoReportFromDb;
    }),

  /**
   * Get Reports by foreign AuthourId
   * @Input: userId: String
   */
  /*   getReportsByAuthorId: publicProcedure
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
    }), */

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
    .input(InputCreateReportForm)
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
    .input(InputEditReportForm)
    .mutation(async ({ ctx, input }) => {
      // First, check if the report exists
      const existingReport = await ctx.prisma.report.findUnique({
        where: {
          id: input.id,
        },
        include: {
          strains: true, // Include related strains
        },
      });

      // Then, check if the user is the author of the report
      if (
        existingReport &&
        existingReport.authorId !== ctx.session.user.id
      ) {
        throw new Error("You are not authorized to edit this report");
      } else if (existingReport != null) {
        // build report data
        const {
          //strains: newStrainIds,
          createdAt,
          imageId,
          ...reportData
        } = input;

        // // Extract connected strain IDs from the database
        // const connectedStrainIds = existingReport.strains.map(
        //   (strain) => strain.id
        // );

        // // Find IDs to disconnect
        // const strainIdsToDisconnect = connectedStrainIds.filter(
        //   (id) => !newStrainIds.includes(id)
        // );

        // Fetch the current updatedAt value to be able to let it unchanged
        const currentReport = (await ctx.prisma.report.findUnique({
          where: {
            id: reportData.id,
          },
          select: {
            updatedAt: true,
          },
        })) as {
          updatedAt: Date;
        };

        const data = {
          ...reportData,
          authorId: ctx.session.user.id,
          // strains: {
          //   disconnect: strainIdsToDisconnect.map((strainId) => ({
          //     id: strainId,
          //   })),
          //   connect: newStrainIds.map((strainId) => ({
          //     id: strainId,
          //   })),
          // },
          image: {
            connect: {
              id: imageId,
            },
          },

          createdAt: createdAt,
          updatedAt: currentReport.updatedAt,
        };

        // safe report
        const report = await ctx.prisma.report.update({
          where: {
            id: input.id,
          },
          data,
        });

        return report;
      }
    }),
});
