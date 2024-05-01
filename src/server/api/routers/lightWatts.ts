import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

interface DataPoint {
  date: Date;
  watt: number;
}

export const lightWattsRouter = createTRPCRouter({
  /**
   * Get all LightWatts for a report
   * @Input: reportId: String
   */
  getAllLightWattsByReportId: publicProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const reportId = input;

      // Get all LightWatts
      // Fetch LightWatts associated with the provided reportId
      const lightWatts = await ctx.prisma.lightWatts.findMany({
        where: {
          post: {
            reportId: reportId,
          },
        },
        // Include the related Post to get the date information
        include: {
          post: {
            select: {
              date: true,
            },
          },
        },
        // Sort the results by date in ascending order
        orderBy: {
          post: {
            date: "asc",
          },
        },
      });

      // Transform the result into the desired format
      const rawData: DataPoint[] = lightWatts.map((lightWatt) => ({
        date: lightWatt.post
          ? new Date(lightWatt.post.date)
          : new Date(),
        watt: lightWatt.watt,
      }));

      return rawData;
    }),
});
