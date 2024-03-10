import {
  Box,
  Container,
  Space,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "top",
    alignItems: "center",
    paddingTop: theme.spacing.md,
  },

  title: {
    color: theme.white,
    fontSize: rem(48),
    fontWeight: 900,
    lineHeight: 1.1,
    paddingTop: 12,
    paddingBottom: 12,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(42),
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(36),
      lineHeight: 1.3,
    },
  },

  description: {
    color: theme.white,
    textAlign: "center",

    [theme.fn.smallerThan("sm")]: {
      fontSize: theme.fontSizes.md,
    },
  },

  photoCredit: {
    position: "fixed",
    bottom: theme.spacing.md,
    left: theme.spacing.md,
    color: theme.colors.gray[7],
    textDecoration: "none",
    fontSize: 14,
    zIndex: -10,
  },
}));

export default function HowTo() {
  const { classes } = useStyles();

  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  return (
    <Box>
      <Container
        mb={"xl"}
        pb={"xl"}
        size="lg"
        className={classes.container}
      >
        <Title className={classes.title}>
          {t("common:app-headermenu-how-to")}
        </Title>
        <Title order={2}>🤔 {t("common:how-does-this-work")} 💡</Title>
        <Space h="xl" />

        {/* Create and Manage Grows */}
        <Title className="text-center" order={3} mt={"xl"} mb="xs">
          {t("common:CreateandManageGrows")}
        </Title>
        <Text className={classes.description} size="lg" mb="md">
          {t("common:CreateandManageGrows_content")}
        </Text>

        {/* Detailed Updates */}
        <Title className="text-center" order={3} mt={"xl"} mb="xs">
          {t("common:DetailedUpdates")}
        </Title>
        <Text className={classes.description} size="lg" mb="md">
          {t("common:DetailedUpdates_content")}
        </Text>

        {/* Seamless Authentication */}
        <Title className="text-center" order={3} mt={"xl"} mb="xs">
          {t("common:SeamlessAuthentication")}
        </Title>
        <Text className={classes.description} size="lg" mb="md">
          {t("common:SeamlessAuthentication_content")}
        </Text>

        {/* Effortless Search */}
        <Title className="text-center" order={3} mt={"xl"} mb="xs">
          {t("common:EffortlessSearch")}
        </Title>
        <Text className={classes.description} size="lg" mb="md">
          {t("common:EffortlessSearch_content")}
        </Text>

        {/* Strain Specific Search */}
        <Title className="text-center" order={3} mt={"xl"} mb="xs">
          {t("common:StrainSpecificSearch")}
        </Title>
        <Text className={classes.description} size="lg" mb="md">
          {t("common:StrainSpecificSearch_content")}
        </Text>

        {/* Show Appreciation */}
        <Title className="text-center" order={3} mt={"xl"} mb="xs">
          {t("common:ShowAppreciation")}
        </Title>
        <Text className={classes.description} size="lg" mb="md">
          {t("common:ShowAppreciation_content")}
        </Text>

        {/* Responsive Privacy Data Handling */}
        <Title className="text-center" order={3} mt={"xl"} mb="xs">
          {t("common:ResponsivePrivacyDataHandling")}
        </Title>
        <Text className={classes.description} size="lg" mb="md">
          {t("common:ResponsivePrivacyDataHandling_content")}
        </Text>
      </Container>

      {/* Photo credit */}
      <Box className={classes.photoCredit}>
        <a href="https://unsplash.com/de/fotos/gruner-und-brauner-tannenzapfen-JEI-uPbp1Aw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
          Background Image on Unsplash
        </a>
        from
        <a href="https://unsplash.com/de/@diyahna22?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
          Diyahna Lewis
        </a>
      </Box>
    </Box>
  );
}
