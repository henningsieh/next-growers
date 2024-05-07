import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

import type { GetBreedersFromSeedfinderResponse } from "~/types";

import {
  InputGetAllBreders,
  InputGetStrainInfo,
} from "~/utils/inputValidation";

type GetBreederStrainsResponse = {
  [breederName: string]: GetBreedersFromSeedfinderResponse;
};

type GetStrainInfoResponse = {
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
export const strainRouter = createTRPCRouter({
  getBreedersFromSeedfinder: protectedProcedure
    .input(InputGetAllBreders)
    .query(async ({ input }) => {
      const { withStrains } = input;
      const url = `https://en.seedfinder.eu/api/json/ids.json?br=all&strains=${withStrains ? "1" : "0"}&ac=d8fe19486b31da9dbb7a01ee67798991`;

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
        const data =
          (await response.json()) as GetBreederStrainsResponse;

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
      const url = `https://en.seedfinder.eu/api/json/strain.json?br=${breederId}&str=${strainId}&ac=d8fe19486b31da9dbb7a01ee67798991`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data from the API");
        }
        const data = (await response.json()) as GetStrainInfoResponse;

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
  //FIXME: WITH  WORKING SEDDFINDER THIS SHOULD NOT BE NEEDED OR USED
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
});
