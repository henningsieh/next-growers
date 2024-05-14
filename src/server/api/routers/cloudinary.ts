import type { SignApiOptions } from "cloudinary";
import { env } from "~/env.mjs";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

// import { v2 as cloudinary } from "cloudinary";
import cloudinary from "~/utils/cloudinary";

export const cloudinaryRouter = createTRPCRouter({
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
      cloudinary.config().cloud_name || env.CLOUDINARY_NAME;
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
});
