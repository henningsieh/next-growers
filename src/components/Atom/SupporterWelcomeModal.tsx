import {
  Box,
  Button,
  Checkbox,
  createStyles,
  Group,
  Image,
  Modal,
  rem,
  SegmentedControl,
  Stack,
  Text,
  Title,
  // useMantineTheme,
} from "@mantine/core";
import { IconBrandX } from "@tabler/icons-react";
import {
  SUBSCRIPTION_PERIODS,
  type SubscriptionPeriod,
} from "~/contexts/subscription";

import React, { useEffect, useState } from "react";

import { useTranslation } from "next-i18next";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  supporterLevel: {
    padding: theme.spacing.xs, // Reduced padding
    borderRadius: theme.radius.md,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[3]
    }`,
    transition: "transform 200ms ease, box-shadow 200ms ease",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: theme.shadows.md,
    },
    display: "flex",
    flexDirection: "column",
    height: "100%", // Make all cards the same height
  },
  title: {
    fontFamily: `"Grandstander", sans-serif`,
    fontSize: rem(24), // Slightly smaller
    fontWeight: 900,
    color:
      theme.colorScheme === "dark"
        ? theme.white
        : theme.colors.growgreen[4],

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(20), // Even smaller on mobile
    },
  },
  subtitle: {
    fontSize: rem(18),
    fontWeight: 500,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[3]
        : theme.colors.dark[6],
  },
  price: {
    fontSize: rem(16),
    fontWeight: 700,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.growgreen[3]
        : theme.colors.growgreen[7],
    whiteSpace: "nowrap", // Prevent text wrapping
    overflow: "visible", // Show the full text
  },
  priceInfo: {
    fontSize: rem(14),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[5]
        : theme.colors.gray[6],
  },
  description: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[4]
        : theme.colors.dark[3],
    lineHeight: 1.5,
  },
  button: {
    fontWeight: 700,
    cursor: "pointer",
  },
  packageImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: theme.radius.sm,
    position: "relative",
    zIndex: 1,
  },
  packageContent: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.sm, // Reduced gap
    flex: 1, // Take remaining space
  },
  packageHeader: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs, // Reduced margin
  },
  priceContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "auto",
    maxWidth: rem(250),
    position: "relative", // Ensure proper stacking
    zIndex: 3, // Even higher z-index to ensure visibility
    backgroundColor:
      theme.colorScheme === "dark"
        ? `${theme.colors.dark[6]}99` // Semi-transparent background
        : `${theme.colors.gray[0]}99`,
    borderRadius: theme.radius.sm,
    // padding: `${rem(4)} ${rem(8)}`, // Add some padding
    alignSelf: "start", // Changed to flex-end to align to the right
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "auto", // Ensure the container height matches the image
    paddingTop: 0, // Remove padding to avoid extra height
    overflow: "hidden",
    marginBottom: theme.spacing.xs, // Adjust spacing as needed
  },
  imageWrapper: {
    position: "relative", // Changed from absolute to relative to match the container height
    width: "100%",
    height: "100%", // Ensure the wrapper height matches the container
  },
  titleSection: {
    textAlign: "center",
    padding: theme.spacing.lg,
    // marginBottom: theme.spacing.md,
    borderRadius: theme.radius.md,
    background:
      theme.colorScheme === "dark"
        ? `linear-gradient(135deg, ${theme.colors.growgreen[7]}, ${theme.colors.growgreen[8]})`
        : `linear-gradient(135deg, ${theme.colors.growgreen[5]}, ${theme.colors.growgreen[7]})`,
    // boxShadow: theme.colorScheme === "dark" ? "none" : theme.shadows.xl,
  },

  mainTitle: {
    fontFamily: `"Grandstander", sans-serif`,
    fontSize: rem(32),
    fontWeight: 900,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.growgreen[3]
        : theme.colors.growgreen[2],
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(28),
    },
    position: "relative",
    display: "inline-block",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: -8,
      left: "25%",
      width: "50%",
      height: 3,
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.growgreen[5]
          : theme.colors.groworange[5],
      borderRadius: theme.radius.xl,
    },
  },

  subtitleText: {
    fontSize: rem(20),
    fontWeight: 600,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    color:
      theme.colorScheme === "dark" ? theme.white : theme.colors.gray[2],
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(18),
    },
  },

  descriptionText: {
    fontSize: rem(16),
    lineHeight: 1.6,
    marginTop: theme.spacing.md,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[3]
        : theme.colors.gray[4],
    maxWidth: "800px",
    margin: "0 auto",
  },

  twitterLink: {
    display: "inline-flex",
    alignItems: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.blue[4]
        : theme.colors.blue[6],
    textDecoration: "none",
    fontWeight: 600,
    fontSize: rem(20),
    transition: "color 200ms ease, transform 200ms ease",
    marginTop: theme.spacing.xs,

    "&:hover": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.blue[3]
          : theme.colors.blue[7],
      transform: "translateY(-2px)",
    },

    "& svg": {
      marginRight: theme.spacing.xs,
    },
  },
  segmentedControlRoot: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    border: `1px solid ${
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[3]
    }`,
    padding: theme.spacing.xs,
  },

  segmentedControlItem: {
    border: "none",
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2],
    },
    "&:not(:first-of-type)": {
      marginLeft: theme.spacing.xl,
    },
  },

  segmentedControlItemActive: {
    backgroundColor: `${theme.colors.growgreen[5]} !important`,
    boxShadow: theme.shadows.sm,
  },

  segmentedControlLabel: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    "&[data-active]": {
      color: `${theme.white} !important`,
    },
  },
}));

interface SupporterWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupporterWelcomeModal({
  isOpen,
  onClose,
}: SupporterWelcomeModalProps) {
  const { t } = useTranslation("common");
  const { classes } = useStyles();
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [subscriptionPeriod, setSubscriptionPeriod] =
    useState<SubscriptionPeriod>(SUBSCRIPTION_PERIODS.MONTHLY);
  const isMonthly = subscriptionPeriod === SUBSCRIPTION_PERIODS.MONTHLY;

  // const theme = useMantineTheme();

  const handleClose = () => {
    const currentTime = Date.now();

    // Set next show time based on checkbox status
    if (dontShowAgain) {
      // If "Don't show again" is checked, set next show time to one week later
      const oneWeekLater = currentTime + 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      localStorage.setItem(
        "supporterModalNextShow",
        oneWeekLater.toString()
      );
    } else {
      // Otherwise, set next show time to 24 hours later
      const oneDayLater = currentTime + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      localStorage.setItem(
        "supporterModalNextShow",
        oneDayLater.toString()
      );
    }

    // Always update the last shown timestamp
    localStorage.setItem(
      "supporterModalLastShown",
      currentTime.toString()
    );

    onClose();
  };

  useEffect(() => {
    // Reset states when modal opens
    if (isOpen) {
      setDontShowAgain(false);
      setSubscriptionPeriod(SUBSCRIPTION_PERIODS.MONTHLY);
    }
  }, [isOpen]);

  // Package details from the Membership.tsx file
  const packages = [
    {
      id: "basic",
      image:
        "https://assets.steadyhq.com/production/plan/96fb5e3b-0fa2-47a1-84db-383cea778889/image/1716644253?auto=format&h=300&w=400&fit=crop&fm=jpg",
      url: "https://steadyhq.com/de/plans/96fb5e3b-0fa2-47a1-84db-383cea778889/subscribe",
      titleKey: "supporter-level-basic-title",
      priceKey: "supporter-level-basic-price",
      yearlyPriceKey: "supporter-level-basic-yearlyPrice",
      descriptionKey: "supporter-level-basic-description",
      buttonKey: "supporter-level-basic-button",
    },
    {
      id: "premium",
      image:
        "https://assets.steadyhq.com/production/plan/a3429e5a-ffc2-4902-8161-184912fddbd6/image/1716645055?auto=format&h=300&w=400&fit=crop&fm=jpg",
      url: "https://steadyhq.com/de/plans/a3429e5a-ffc2-4902-8161-184912fddbd6/subscribe",
      titleKey: "supporter-level-premium-title",
      priceKey: "supporter-level-premium-price",
      yearlyPriceKey: "supporter-level-premium-yearlyPrice",
      descriptionKey: "supporter-level-premium-description",
      buttonKey: "supporter-level-premium-button",
    },
    {
      id: "pro",
      image:
        "https://assets.steadyhq.com/production/plan/2c5f1c61-7d6b-45b6-ad8f-8f1d006bc828/image/1716702543?auto=format&h=300&w=400&fit=crop&fm=jpg",
      url: "https://steadyhq.com/de/plans/2c5f1c61-7d6b-45b6-ad8f-8f1d006bc828/subscribe",
      titleKey: "supporter-level-pro-title",
      priceKey: "supporter-level-pro-price",
      yearlyPriceKey: "supporter-level-pro-yearlyPrice",
      descriptionKey: "supporter-level-pro-description",
      buttonKey: "supporter-level-pro-button",
    },
  ];

  // Helper function to safely extract the yearly price and discount parts
  const extractYearlyPriceParts = (fullText: string) => {
    if (!fullText || fullText.indexOf(" - ") === -1) {
      // If the format is not as expected, return the whole string as price
      return {
        price: fullText || "",
        discount: "",
      };
    }

    const parts = fullText.split(" - ");
    return {
      price: parts[0],
      discount: parts[1],
    };
  };

  return (
    <Modal
      withCloseButton={true}
      opened={isOpen}
      onClose={handleClose}
      title=""
      size="xl"
      centered
      styles={(theme) => ({
        body: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.colors.gray[2],
        },
        // You can also add other style targets if needed
        header: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.colors.gray[2],
        },
        // title: { ... },
        // close: { ... },
        // overlay: { ... },
      })}
    >
      <Stack spacing="md">
        {/* Enhanced Title and subtitle section */}
        <Box className={classes.titleSection}>
          <Title order={1} className={classes.mainTitle}>
            {t("supporter-modal-title")}
          </Title>
          <Text className={classes.subtitleText}>
            {t("supporter-modal-subtitle")}
          </Text>
          <Text className={classes.descriptionText}>
            {t("supporter-modal-description")}
          </Text>

          {/* Twitter link */}
          <Box mt="md">
            <a
              href="https://twitter.com/GrowaGram"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.twitterLink}
            >
              <IconBrandX size={24} />
              {t("supporter-modal-follow")} @GrowaGram
            </a>
          </Box>
        </Box>

        <Group position="center" mt="md">
          <SegmentedControl
            value={subscriptionPeriod}
            onChange={(value: SubscriptionPeriod) =>
              setSubscriptionPeriod(value)
            }
            classNames={{
              root: classes.segmentedControlRoot,
              control: classes.segmentedControlItem,
              controlActive: classes.segmentedControlItemActive,
              label: classes.segmentedControlLabel,
            }}
            data={[
              {
                label: t("supporter-payment-monthly"),
                value: SUBSCRIPTION_PERIODS.MONTHLY,
              },
              {
                label: t("supporter-payment-annually"),
                value: SUBSCRIPTION_PERIODS.YEARLY,
              },
            ]}
          />
        </Group>

        {/* Packages section - Refactored */}
        <Box>
          <Box
            sx={(theme) => ({
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: theme.spacing.md,
              [theme.fn.smallerThan("md")]: {
                gridTemplateColumns: "repeat(2, 1fr)",
              },
              [theme.fn.smallerThan("xs")]: {
                gridTemplateColumns: "1fr",
              },
            })}
          >
            {packages.map((pkg) => {
              // Pre-process the translations to avoid layout shifts
              const title = t(pkg.titleKey);
              const monthlyPrice = t(pkg.priceKey);
              const yearlyPriceText = t(pkg.yearlyPriceKey);
              const { price: yearlyPrice, discount: yearlyDiscount } =
                extractYearlyPriceParts(yearlyPriceText);
              const description = t(pkg.descriptionKey);
              const buttonText = t(pkg.buttonKey);

              return (
                <Box key={pkg.id} className={classes.supporterLevel}>
                  {/* Image with 4:3 aspect ratio */}
                  <Box className={classes.imageContainer}>
                    <Box className={classes.imageWrapper}>
                      <Image
                        src={pkg.image}
                        alt={title}
                        className={classes.packageImage}
                      />
                    </Box>
                  </Box>

                  {/* Content container */}
                  <Box className={classes.packageContent}>
                    {/* Package title and price */}
                    <Box className={classes.packageHeader}>
                      <Text className={classes.title}>{title}</Text>
                      <Box className={classes.priceContainer}>
                        <Text className={classes.price}>
                          {isMonthly ? monthlyPrice : yearlyPrice}
                        </Text>
                        {!isMonthly && yearlyDiscount && (
                          <Text size="xs" color="dimmed">
                            {yearlyDiscount}
                          </Text>
                        )}
                      </Box>
                    </Box>

                    <Text
                      className={classes.description}
                      sx={{ flex: 1 }}
                    >
                      {description}
                    </Text>

                    <Link
                      href={`${pkg.url}?period=${subscriptionPeriod}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ width: "100%", marginTop: "auto" }}
                    >
                      <Button
                        className={classes.button}
                        variant="filled"
                        color="growgreen"
                        fullWidth
                      >
                        {buttonText}
                      </Button>
                    </Link>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Group position="apart">
          <Checkbox
            checked={dontShowAgain}
            onChange={(event) =>
              setDontShowAgain(event.currentTarget.checked)
            }
            label={t("supporter-modal-dismiss")}
          />
          <Button onClick={handleClose} variant="filled">
            {t("supporter-modal-close")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
