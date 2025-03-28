/**
 * Supporter Modal Display Logic
 *
 * This utility manages when to display the supporter welcome modal
 * based on user interactions and time-based rules.
 */

// Constants for time intervals (in milliseconds)
export const TIME_INTERVALS = {
  WEEKLY: 7 * 24 * 60 * 60 * 1000, // 7 days
  MONTHLY: 30 * 24 * 60 * 60 * 1000, // 30 days
};

/**
 * Determines if the supporter modal should be shown
 * @returns boolean
 */
export const shouldShowSupporterModal = (): boolean => {
  // If user has explicitly dismissed the modal
  if (typeof window !== "undefined") {
    const dismissed = localStorage.getItem("supporterModalDismissed");
    if (dismissed === "true") {
      return false;
    }

    // Check when the modal was last shown
    const lastShown = localStorage.getItem("supporterModalLastShown");

    // First time user (no record of last shown)
    if (!lastShown) {
      return true;
    }

    // Check if enough time has passed since last shown (using weekly interval)
    const timeSinceLastShown = Date.now() - parseInt(lastShown);
    return timeSinceLastShown > TIME_INTERVALS.WEEKLY;
  }

  return false;
};

/**
 * Resets the display frequency tracking
 * Useful for testing or administrative purposes
 */
export const resetModalTracking = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("supporterModalLastShown");
    localStorage.removeItem("supporterModalDismissed");
  }
};
