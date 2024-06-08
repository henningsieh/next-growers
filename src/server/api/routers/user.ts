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
});
