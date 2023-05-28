import { createTRPCRouter, protectedProcedure } from "../trpc";
import { InputSetUserName } from "~/helpers/inputValidation";

export const userRouter = createTRPCRouter({
  saveOwnUsername: protectedProcedure
    .input(InputSetUserName)
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

      return user;
    }),
});
