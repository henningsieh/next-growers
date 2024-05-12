/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { env } from "~/env.mjs";

import {
  createTRPCRouter,
  protectedProcedure,
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
  savePlantToGrow: protectedProcedure
    .input(InputSavePlantToGrow)
    .query(({ ctx, input }) => {
      console.debug(input);

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
        console.debug(input);
      } catch (error) {
        // Handle any errors
        console.error("Error fetching breeders:", error);
        throw new Error("Internal server error");
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
