import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),
    // Add `.min(1) on ID and SECRET if you want to make sure they're not empty
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    TWITTER_API_KEY: z.string(),
    TWITTER_API_KEY_SECRET: z.string(),
    EMAIL_SERVER_HOST: z.string().min(1),
    EMAIL_SERVER_PORT: z
      .string()
      .min(1)
      .transform((v) => parseInt(v, 10)),
    EMAIL_SERVER_USER: z.string().min(1),
    EMAIL_SERVER_PASSWORD: z.string().min(1),
    EMAIL_FROM: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    SEEDFINDER_API_KEY: z.string().min(32),
    SENTRY_AUTH_TOKEN: z.string().min(1),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().min(1),
    NEXT_PUBLIC_STEADY_URL: z.string().min(1),
    NEXT_PUBLIC_INSTAGRAM_URL: z.string().min(1),
    NEXT_PUBLIC_TWITTERX_URL: z.string().min(1),
    NEXT_PUBLIC_FILE_UPLOAD_MAX_FILES: z.string().min(1),
    NEXT_PUBLIC_SEEDFINDER_BREEDER_LOGO_BASEURL: z.string().url(),
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_MAX_FILESIZE: z.string().min(1),
    NEXT_PUBLIC_CLOUDINARY_NAME: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    TWITTER_API_KEY: process.env.TWITTER_API_KEY,
    TWITTER_API_KEY_SECRET: process.env.TWITTER_API_KEY_SECRET,
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    NEXT_PUBLIC_CLOUDINARY_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
    SEEDFINDER_API_KEY: process.env.SEEDFINDER_API_KEY,
    NEXT_PUBLIC_SEEDFINDER_BREEDER_LOGO_BASEURL:
      process.env.NEXT_PUBLIC_SEEDFINDER_BREEDER_LOGO_BASEURL,
    NEXT_PUBLIC_FILE_UPLOAD_MAX_FILES:
      process.env.NEXT_PUBLIC_FILE_UPLOAD_MAX_FILES,
    NEXT_PUBLIC_STEADY_URL: process.env.NEXT_PUBLIC_STEADY_URL,
    NEXT_PUBLIC_INSTAGRAM_URL: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    NEXT_PUBLIC_TWITTERX_URL: process.env.NEXT_PUBLIC_TWITTERX_URL,
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_MAX_FILESIZE:
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_MAX_FILESIZE,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
  },
});
