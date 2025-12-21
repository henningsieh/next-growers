// Catch unhandled rejections during build to prevent build failures from Sentry timeouts
let sentryErrorCount = 0;
const MAX_SENTRY_ERRORS = 5;

process.on("unhandledRejection", (reason, promise) => {
  if (reason && reason.toString().includes("sentry-cli")) {
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
