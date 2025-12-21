import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { TRPCError } from "@trpc/server";
import type { SignApiOptions } from "cloudinary";
import { env } from "~/env.mjs";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

// import { v2 as cloudinary } from "cloudinary";
import cloudinary from "~/utils/cloudinary";
import { InputCreateImage } from "~/utils/inputValidation";

export const imageRouter = createTRPCRouter({
  generateSignature: protectedProcedure.query(() => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    // FIXME: use env instead!!
    const transformation = "w_2000,h_2000,c_limit,q_auto";
    const folder = "growagram/user_uploads";
    const api_key =
      cloudinary.config().api_key || env.CLOUDINARY_API_KEY;
    const api_secret =
      cloudinary.config().api_secret || env.CLOUDINARY_API_SECRET;
    const cloud_name =
      cloudinary.config().cloud_name || env.NEXT_PUBLIC_CLOUDINARY_NAME;
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        transformation: transformation,
        folder: folder,
      } as SignApiOptions,
      api_secret
    );

    return {
      cloud_name: cloud_name,
      api_key: api_key,
      signature: signature,
      timestamp: timestamp,
      transformation: transformation,
      folder: folder,
    };
  }),

  createImage: protectedProcedure
    .input(InputCreateImage)
    .mutation(async ({ ctx, input }) => {
      try {
        const { cloudUrl, ownerId, publicId } = input;

        if (ownerId != ctx.session.user.id) {
          //Throw new TRPC ERROR NOT ALLOWED
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Not allowed to create image for other users",
          });
        }

        const result = ctx.prisma.image.create({
          data: {
            ownerId: ownerId,
            cloudUrl: cloudUrl,
            publicId: publicId,
          },
        });

        return result;
      } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
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
        }
      }
    }),
});
