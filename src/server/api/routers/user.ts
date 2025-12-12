import { NotificationEvent, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { TwitterApi } from "twitter-api-v2";
import { z } from "zod";
import { env } from "~/env.mjs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import {
  InputSaveUserImage,
  InputSaveUserName,
} from "~/utils/inputValidation";
import { getUserSelectObject } from "~/utils/repository/userSelectObject";

//import sendEmail from "~/utils/sendEmail";

export const userRouter = createTRPCRouter({
  saveOwnUsername: protectedProcedure
    .input(InputSaveUserName)
    .mutation(async ({ ctx, input }) => {
      try {
        // First, check if the user exists
        const existingUser = await ctx.prisma.user.findUnique({
          where: {
            id: input.id,
          },
        });
        if (!existingUser) {
          throw new Error("User does not exist");
        }

        // Then, check if the user is authorized to edit their own username
        if (existingUser.id !== ctx.session.user.id) {
          throw new Error("You are not authorized to edit this user");
        }

        // Update the user's name
        const user = await ctx.prisma.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            name: input.name,
          },
        });

        const result = {
          success: true,
          user,
        };
        return result;
      } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: error.message,
              cause: error,
            });
          }
        } else if (error instanceof TRPCError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            cause: error,
          });
        }
      }
    }),

  saveOwnUserImage: protectedProcedure
    .input(InputSaveUserImage)
    .mutation(async ({ ctx, input }) => {
      // First, check if the user exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!existingUser) {
        throw new Error("User does not exist");
      }

      // Then, check if the user is authorized to edit their own image
      if (existingUser.id !== ctx.session.user.id) {
        throw new Error(
          "You are not authorized to edit this user's image"
        );
      }

      // Update the user's image URL
      const user = await ctx.prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          image: input.imageURL,
        },
      });

      return user;
    }),

  saveGrowerProfileHeaderImg: protectedProcedure
    .input(
      z.object({
        cloudUrl: z.string(),
        publicId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // First, check if the user exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!existingUser) {
        throw new Error("User does not exist");
      }

      // Create a new image record
      const image = await ctx.prisma.image.create({
        data: {
          cloudUrl: input.cloudUrl,
          publicId: input.publicId,
          ownerId: existingUser.id,
        },
      });

      // Check if the user already has a grower profile
      if (existingUser.growerProfileId) {
        // Update the existing grower profile with the new header image
        const growerProfile = await ctx.prisma.growerProfile.update({
          where: {
            id: existingUser.growerProfileId,
          },
          data: {
            headerImg: {
              connect: {
                id: image.id,
              },
            },
          },
        });
        return { growerProfile, image };
      } else {
        // Create a new grower profile with the new header image
        const growerProfile = await ctx.prisma.growerProfile.create({
          data: {
            headerImg: {
              connect: {
                id: image.id,
              },
            },
            user: {
              connect: {
                id: existingUser.id,
              },
            },
          },
        });

        // Update the user's growerProfileId
        await ctx.prisma.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            growerProfileId: growerProfile.id,
          },
        });

        return { growerProfile, image };
      }
    }),

  getGrowerProfilesById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;

      try {
        const users = await ctx.prisma.user.findMany({
          where: {
            id: userId,
          },
          select: getUserSelectObject(userId),
        });
        return users;
      } catch (error: unknown) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
            cause: error.cause,
          });
        } else if (error instanceof Error) {
          throw new Error(error.message, {
            cause: error.cause,
          } as ErrorOptions);
        } else {
          throw new Error("An unknown error occurred");
        }
      }
    }),
  getGrowerProfileById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;

      try {
        const users = await ctx.prisma.user.findFirst({
          where: {
            id: userId,
          },
          select: getUserSelectObject(userId),
        });
        return users;
      } catch (error: unknown) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
            cause: error.cause,
          });
        } else if (error instanceof Error) {
          throw new Error(error.message, {
            cause: error.cause,
          } as ErrorOptions);
        } else {
          throw new Error("An unknown error occurred");
        }
      }
    }),

  isFollowingUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;

      try {
        const existingFollow = await ctx.prisma.follows.findFirst({
          where: {
            followerId: ctx.session.user.id,
            followingId: userId,
          },
        });

        return existingFollow;
      } catch (error: unknown) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
            cause: error.cause,
          });
        } else if (error instanceof Error) {
          throw new Error(error.message, {
            cause: error.cause,
          } as ErrorOptions);
        } else {
          throw new Error("An unknown error occurred");
        }
      }
    }),

  followUserById: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId: userIdToFollow } = input;

      try {
        // First, check if the user exists
        const existingUser = await ctx.prisma.user.findUnique({
          where: {
            id: userIdToFollow,
          },
        });
        if (!existingUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User does not exist",
          });
        }

        // Then, check if the user is authorized to follow the user
        if (existingUser.id === ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You cannot follow yourself",
          });
        }

        // Check if the user is already following the user
        const existingFollow = await ctx.prisma.follows.findFirst({
          where: {
            followerId: ctx.session.user.id,
            followingId: userIdToFollow,
          },
        });
        if (existingFollow) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You are already following this user",
          });
        }

        // Follow the user
        const follow = await ctx.prisma.follows.create({
          data: {
            followerId: ctx.session.user.id,
            followingId: userIdToFollow,
          },
        });

        // Create a notification for the user being followed
        await ctx.prisma.notification.create({
          data: {
            recipient: {
              connect: {
                id: userIdToFollow,
              },
            },
            event: NotificationEvent.FOLLOWED_USER,
            follow: {
              connect: {
                id: follow.id,
              },
            },
          },
        });

        // // SEND EMAIL TO THE SESSION USER
        // const emailOptions = {
        //   to: ctx.session.user.email as string,

        //   subject: `You are now following ${existingUser.name}`,
        //   //FIXME:write a nice e-mail text here
        //   text: `You are now following ${existingUser.name}!`,
        // };
        // //send the email
        // await sendEmail(emailOptions);

        return follow;
      } catch (error: unknown) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
            cause: error.cause,
          });
        } else if (error instanceof Error) {
          throw new Error(error.message, {
            cause: error.cause,
          } as ErrorOptions);
        } else {
          throw new Error("An unknown error occurred");
        }
      }
    }),

  unfollowUserById: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId: userIdToUnfollow } = input;

      try {
        // First, check if the user exists
        const existingUser = await ctx.prisma.user.findUnique({
          where: {
            id: userIdToUnfollow,
          },
        });
        if (!existingUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User does not exist",
          });
        }

        // Then, check if the user is authorized to unfollow the user
        if (existingUser.id === ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You cannot unfollow yourself",
          });
        }

        // Check if the user is not following the user
        const existingFollow = await ctx.prisma.follows.findFirst({
          where: {
            followerId: ctx.session.user.id,
            followingId: userIdToUnfollow,
          },
        });
        if (!existingFollow) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You are not following this user",
          });
        }

        // Unfollow the user
        await ctx.prisma.follows.delete({
          where: {
            id: existingFollow.id,
          },
        });

        return existingFollow;
      } catch (error: unknown) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
            cause: error.cause,
          });
        } else if (error instanceof Error) {
          throw new Error(error.message, {
            cause: error.cause,
          } as ErrorOptions);
        } else {
          throw new Error("An unknown error occurred");
        }
      }
    }),

  hasAcceptedCurrentTOS: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (!ctx.session.user.acceptedTOSId) {
        // User has never accepted TOS
        return false;
      } else {
        const tos = await ctx.prisma.tOS.findUnique({
          where: {
            id: ctx.session.user.acceptedTOSId,
          },
          select: {
            id: true,
            version: true,
            isCurrent: true,
          },
        });

        if (!tos) {
          // INTERNAL SERVER ERROR: TOS record does not exist
          const cause = new Error("Accepted TOS record does not exist");
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: cause.message,
            cause,
          });
        }

        return tos.isCurrent;
      }
    } catch (error: unknown) {
      if (error instanceof TRPCError) {
        throw new TRPCError({
          code: error.code,
          message: error.message,
          cause: error.cause,
        });
      } else if (error instanceof Error) {
        throw new Error(error.message, {
          cause: error.cause,
        } as ErrorOptions);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }),

  acceptCurrentTOS: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      // Retrieve the current TOS
      const currentTOS = await ctx.prisma.tOS.findFirst({
        where: {
          isCurrent: true,
        },
      });
      if (!currentTOS) {
        // INTERNAL SERVER ERROR: No current TOS record
        const cause = new Error("No current TOS found");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: cause.message,
          cause,
        });
      }

      // Update the user's accepted TOS ID
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          acceptedTOSId: currentTOS.id,
        },
      });

      return user;
    } catch (error: unknown) {
      if (error instanceof TRPCError) {
        throw new TRPCError({
          code: error.code,
          message: error.message,
          cause: error.cause,
        });
      } else if (error instanceof Error) {
        throw new Error(error.message, {
          cause: error.cause,
        } as ErrorOptions);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }),

  refreshUserImageFromProvider: protectedProcedure.mutation(
    async ({ ctx }) => {
      try {
        // Try Twitter first
        let account = await ctx.prisma.account.findFirst({
          where: {
            userId: ctx.session.user.id,
            provider: "twitter",
          },
        });

        let newImageUrl: string | undefined;

        if (
          account &&
          account.oauth_token &&
          account.oauth_token_secret
        ) {
          // Initialize Twitter API client with user tokens
          const userClient = new TwitterApi({
            appKey: env.TWITTER_API_KEY,
            appSecret: env.TWITTER_API_KEY_SECRET,
            accessToken: account.oauth_token,
            accessSecret: account.oauth_token_secret,
          });

          // Fetch user profile
          const userProfile = await userClient.v2.me({
            "user.fields": ["profile_image_url"],
          });

          newImageUrl = userProfile.data.profile_image_url;
        } else {
          // Try Google
          account = await ctx.prisma.account.findFirst({
            where: {
              userId: ctx.session.user.id,
              provider: "google",
            },
          });

          if (account && account.access_token) {
            // Fetch from Google userinfo
            const response = await fetch(
              "https://www.googleapis.com/oauth2/v2/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${account.access_token}`,
                },
              }
            );

            if (response.ok) {
              const userInfo = (await response.json()) as {
                picture?: string;
              };
              newImageUrl = userInfo.picture;
            }
          }
        }

        if (!newImageUrl) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No linked account found or failed to fetch image",
          });
        }

        // Update the user's image in DB
        await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            image: newImageUrl,
          },
        });

        return { newImageUrl };
      } catch (error: unknown) {
        if (error instanceof TRPCError) {
          throw error;
        } else if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            cause: error,
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unknown error occurred",
          });
        }
      }
    }
  ),
});
