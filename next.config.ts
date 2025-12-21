import { env } from "./src/env";
import { withSentryConfig } from "@sentry/nextjs";

import type { NextConfig } from "next";

const config = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "en.seedfinder.eu",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "forum.cannabisanbauen.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: `/${env.NEXT_PUBLIC_CLOUDINARY_NAME}/**`,
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "*.twimg.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: true,

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    defaultLocale: "en",
    locales: ["de", "en"],
  },
} satisfies NextConfig;

const sentryOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "growagram",
  project: "growagram",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Disable telemetry
  telemetry: false,

  // Release health check options - increase retries and timeout
  release: {
    cleanArtifacts: true,
    finalize: false, // Don't finalize release to avoid extra API calls
  },

  // Error handling - make non-critical
  errorHandler: (err: Error) => {
    console.warn("⚠️  Sentry upload warning:", err.message);
    console.warn("Build will continue despite Sentry error...");
  },

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
};

export default withSentryConfig(config, sentryOptions);
