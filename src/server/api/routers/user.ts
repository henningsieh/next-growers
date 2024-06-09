import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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

  getUserProfilesById: publicProcedure
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
            followerId_followingId: {
              followerId: ctx.session.user.id,
              followingId: userIdToUnfollow,
            },
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
});
