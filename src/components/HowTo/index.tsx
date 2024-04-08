import {
  Box,
  Container,
  createStyles,
  rem,
  Space,
  Text,
  Title,
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
    textAlign: "center",

    [theme.fn.smallerThan("sm")]: {
      fontSize: theme.fontSizes.md,
    },
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
        <Title order={2}>💡 {t("common:how-does-this-work")} 🤔</Title>
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
    </Box>
  );
}
