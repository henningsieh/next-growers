/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import type {
  BreedersResponse,
  StrainInfoFromSeedfinder,
} from "~/types";

import {
  InputGetAllBreederFromSeedfinder,
  InputGetStrainInfoFromSeedfinder,
  InputSavePlantToGrow,
} from "~/utils/inputValidation";

export const strainRouter = createTRPCRouter({
  getAllPlantsByReportId: publicProcedure
    .input(z.object({ reportId: z.string() }))
    .query(async ({ ctx, input }) => {
      const existingReport = await ctx.prisma.report.findUnique({
        where: {
          id: input.reportId,
        },
        include: {
          plants: {
            include: {
              seedfinderStrain: true,
            },
          },
        },
      });

      // CHECK IF GROW IS AVAILABLE
      if (!existingReport) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This grow was not found",
        });
      } else {
        return existingReport.plants;
      }
    }),

  savePlantToGrow: protectedProcedure
    .input(InputSavePlantToGrow)
    .mutation(async ({ ctx, input }) => {
      const {
        growId,
        strainId,
        name,
        type,
        cbd,
        description,
        flowering_days,
        flowering_info,
        flowering_automatic,
        seedfinder_ext_url,
        breederId,
        breeder_name,
        breeder_description,
        breeder_website_url,
      } = input;

      try {
        const existingReport = await ctx.prisma.report.findUnique({
          where: {
            id: growId,
          },
        });

        // CHECK IF GROW IS AVAILABLE
        if (!existingReport) {
          throw new Error("This grow was not found");
        }

        // CHECK IF SESSION USER IS AUTHOR OF GROW
        if (ctx.session.user.id != existingReport.authorId) {
          throw new Error("You are not authorized to edit this report");
        }

        // CREATE OR UPDATE seedfinderStrain
        const seedfinderStrain =
          await ctx.prisma.seedfinderStrain.upsert({
            where: { strainId_breederId: { strainId, breederId } }, // Define unique identifier
            create: {
              // Data to create if not found
              strainId,
              breederId,
              name,
              type,
              cbd,
              description,
              flowering_days,
              flowering_info,
              flowering_automatic,
              seedfinder_ext_url,
              breeder_name,
              breeder_description,
              breeder_website_url,
            },
            update: {
              // Data to update if found
              // strainId,
              // breederId,
              name,
              type,
              cbd,
              description,
              flowering_days,
              flowering_info,
              flowering_automatic,
              seedfinder_ext_url,
              breeder_name,
              breeder_description,
              breeder_website_url,
            },
          });

        // CREATE PLANT AND CONNECT TO seedfinderStrain
        const plant = await ctx.prisma.plant.create({
          data: {
            reportId: growId,
            seedfinderStrainId: seedfinderStrain.id,
          },
          include: { seedfinderStrain: true },
        });

        return {
          success: true,
          plant,
        };
      } catch (error: unknown) {
        //FIXME: CONFLICT never possible on upsert mutations
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: error.message,
              cause: error.cause,
            });
          }
        } else if (error instanceof TRPCError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            cause: error,
          });
        } else {
          throw new Error("Internal server error");
        }
      }
    }),

  deletePlantById: protectedProcedure
    .input(z.object({ plantId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { plantId } = input;

      try {
        // Check if the plant exists
        const plant = await ctx.prisma.plant.findUnique({
          where: {
            id: plantId,
          },
          include: {
            report: true,
          },
        });

        if (!plant) {
          throw new Error("Plant not found");
        }

        // Check if the user is authorized to delete the plant
        if (ctx.session.user.id !== plant.report.authorId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to delete this plant",
          });
        }

        // Delete the plant
        const deletedPlant = await ctx.prisma.plant.delete({
          where: {
            id: plantId,
          },
        });

        return {
          success: true,
          message: "Plant deleted successfully",
          deletedPlant,
        };
      } catch (error: unknown) {
        // Handle errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            cause: error.cause,
          });
          console.error(error);
        } else if (error instanceof TRPCError) {
          throw new TRPCError(error);
          console.error(error);
        } else {
          throw new Error(`Internal server error`);
          console.error(error);
        }
      }
    }),

  /**
   * @input input: {     breederId: string;     strainId: string; }
   * @return data: StrainInfoFromSeedfinder
   */
  getStrainInfoFromSeedfinder: protectedProcedure
    .input(InputGetStrainInfoFromSeedfinder)
    .query(async ({ input }) => {
      try {
        // Make an API call to fetch breeders from Seedfinder
        const response: Response = await fetch(
          `https://de.seedfinder.eu/api/json/strain.json?br=${input.breederId}&str=${input.strainId}&ac=${env.SEEDFINDER_API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch breeders from Seedfinder");
        }
        // Parse the response JSON
        const data =
          (await response.json()) as StrainInfoFromSeedfinder;
        // Return the breeders data
        return data;
      } catch (error) {
        // Handle any errors
        console.error("Error fetching breeders:", error);
        throw new Error("Internal server error");
      }
    }),

  /**
   * @input input: {     breeder: string;     strains: string; }
   * @return data: StrainInfoFromSeedfinder
   */
  getAllBreederFromSeedfinder: protectedProcedure
    .input(InputGetAllBreederFromSeedfinder)
    .query(async ({ input }) => {
      try {
        // Make an API call to fetch breeders from Seedfinder
        const response: Response = await fetch(
          `https://en.seedfinder.eu/api/json/ids.json?br=${input.breeder}&strains=${input.strains}&ac=${env.SEEDFINDER_API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch breeders from Seedfinder");
        }
        // Parse the response JSON
        const data = (await response.json()) as BreedersResponse;
        // Return the breeders data
        return data;
      } catch (error) {
        // Handle any errors
        console.error("Error fetching breeders:", error);
        throw new Error("Internal server error");
      }
    }),

  /**
   * Get all notifications for a user
   * @Input: userId: String
   */
  getAllStrains: protectedProcedure.query(async ({ ctx }) => {
    const strains = await ctx.prisma.cannabisStrain.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        effects: true,
        flavors: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const formattedStrains = strains.map((strain) => ({
      ...strain,
      createdAt: strain.createdAt.toISOString(),
      updatedAt: strain.updatedAt.toISOString(),
    }));

    return formattedStrains;

    /* return notifications.map(
        ({ id, event, readAt, createdAt, updatedAt }) => ({
          id,
          event,
          readAt,
          createdAt,
          updatedAt,
        })
      ); */
  }),

  /**
   * Mark a notification as read by setting the readAt field to the current date
   * @Input: notificationId: String
   */
  markNotificationAsRead: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const notificationId = input;

      // Check if the notification exists
      const existingNotification =
        await ctx.prisma.notification.findFirst({
          where: {
            id: notificationId,
          },
        });
      if (!existingNotification) {
        throw new Error("Notification does not exist");
      }

      // Check if the user is the owner of the notification
      if (existingNotification.recipientId !== ctx.session.user.id) {
        throw new Error("You are not the owner of this notification");
      }

      // Update the readAt field of the notification
      try {
        const updatedNotification =
          await ctx.prisma.notification.update({
            where: { id: existingNotification.id },
            data: {
              readAt: new Date(),
            },
          });
        return updatedNotification;
      } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.debug(error.message);
          throw new Error(
            `Failed to delete notification: ${error.message}`
          );
        } else {
          throw new Error("Failed to delete notification");
        }
      }
    }),
  /**
   * Mark all notifications of the session.user as read by setting the readAt field to the current date
   */
  markAllNotificationsAsRead: protectedProcedure.mutation(
    async ({ ctx }) => {
      // Update the readAt field of all notifications for the user
      const updatedNotifications =
        await ctx.prisma.notification.updateMany({
          where: { recipientId: ctx.session?.user.id },
          data: {
            readAt: new Date(),
          },
        });

      return updatedNotifications;
    }
  ),
});
