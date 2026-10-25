// Registers a guard that swallows Sentry CLI timeouts during `next build` so
// they can't fail the build. Called once from next.config.ts.
let sentryErrorCount = 0;
const MAX_SENTRY_ERRORS = 5;

export function registerSentryBuildErrorHandler(): void {
  process.on("unhandledRejection", (reason: unknown) => {
    if (String(reason).includes("sentry-cli")) {
      sentryErrorCount++;
      console.warn(
        `⚠️  Sentry CLI error #${sentryErrorCount} caught and ignored:`,
        reason
      );
      console.warn("Build will continue...");

      if (sentryErrorCount >= MAX_SENTRY_ERRORS) {
        console.warn(
          `⚠️  ${MAX_SENTRY_ERRORS} Sentry errors encountered. Continuing build anyway.`
        );
      }
      // Don't exit - swallow the error
      return;
    }

    // Re-throw other unhandled rejections
    console.error("Unhandled Rejection:", reason);
    process.exit(1);
  });
}
