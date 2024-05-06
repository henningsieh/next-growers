import { Prisma } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

import {
  InputGetAllBreders,
  InputGetStrainInfo,
} from "~/utils/inputValidation";

type SeedfinderStrain = {
  [strainName: string]: string;
};

type BreederStrainsResponse = {
  [breederName: string]: GetBreedersFromSeedfinderResponse;
};

type StrainInfoResponse = {
  error: boolean;
  name: string;
  id: string;
  brinfo: {
    name: string;
    id: string;
    type: string;
    cbd: string;
    description: string;
    link: string;
    pic: string;
    flowering: {
      auto: boolean;
      days: number;
      info: string;
    };
    descr: string;
  };
  comments: boolean;
  links: {
    info: string;
    review: string;
    upload: {
      picture: string;
      review: string;
      medical: string;
    };
  };
  licence: {
    url_cc: string;
    url_sf: string;
    info: string;
  };
};

// Response: getBreedersFromSeedfinder
export type GetBreedersFromSeedfinderResponse = {
  [key: string]: {
    name: string;
    logo: string;
    strains?: SeedfinderStrain[];
  };
};
export const strainRouter = createTRPCRouter({
  getBreedersFromSeedfinder: protectedProcedure
    .input(InputGetAllBreders)
    .query(async ({ input }) => {
      const { withStrains } = input;
      const url = `https://en.seedfinder.eu/api/json/ids.json?br=all&strains=${withStrains ? "1" : "0"}&ac=d8fe19486b31da9dbb7a01ee67798991`;

      // const url = `https://en.seedfinder.eu/api/json/ids.json?br=all&strains=1&ac=d8fe19486b31da9dbb7a01ee67798991`;

      try {
        const breedersFromSeedfinder = await fetch(url);
        if (!breedersFromSeedfinder.ok) {
          throw new Error("Failed to fetch data from the API");
        }
        const data =
          (await breedersFromSeedfinder.json()) as GetBreedersFromSeedfinderResponse;

        return data;
      } catch (error) {
        console.error("Error:", error);
        throw new Error("Internal server error");
      }
    }),

  getStrainInfo: protectedProcedure
    .input(InputGetStrainInfo)
    .query(async ({ input }) => {
      const { breederId, strainId } = input;
      const url = `https://de.seedfinder.eu/api/json/strain.json?br=${breederId}&str=${strainId}&ac=d8fe19486b31da9dbb7a01ee67798991`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data from the API");
        }
        const data = (await response.json()) as StrainInfoResponse;

        return data;
      } catch (error) {
        console.error("Error:", error);
        throw new Error("Internal server error");
      }
    }),

  getBreederStrains: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const breederId = input;
      const url = `https://en.seedfinder.eu/api/json/ids.json?br=${breederId}&strains=1&ac=d8fe19486b31da9dbb7a01ee67798991`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data from the API");
        }
        const data = (await response.json()) as BreederStrainsResponse;

        return data;
      } catch (error) {
        console.error("Error:", error);
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
