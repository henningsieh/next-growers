import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import { z } from "zod";

export const notificationRouter = createTRPCRouter({
  /**
   * Get all notifications for a user
   * @Input: userId: String
   */
  getNotificationsByUserId: protectedProcedure.query(async ({ ctx }) => {
    const notifications = await ctx.prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        recipientId: ctx.session?.user.id,
      },
      include: {
        like: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return notifications;

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
