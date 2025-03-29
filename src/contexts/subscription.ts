export const SUBSCRIPTION_PERIODS = {
  MONTHLY: "monthly",
  YEARLY: "annual",
} as const;

export type SubscriptionPeriod =
  (typeof SUBSCRIPTION_PERIODS)[keyof typeof SUBSCRIPTION_PERIODS];
