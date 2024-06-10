import { LightWattChart } from "../LightWattChart/LightWattChart";
import StrainsInGrow from "../StrainsInGrow";
import {
  Center,
  Container,
  createStyles,
  Flex,
  Group,
  rem,
  Space,
  Text,
  Title,
} from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconEye,
  IconHome,
} from "@tabler/icons-react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import LikeHeart from "~/components/Atom/LikeHeart";

import type { IsoReportWithPostsFromDb } from "~/types";
import { Environment, Locale } from "~/types";

import { sanatizeDateString } from "~/utils/helperUtils";

const useStyles = createStyles((theme) => ({
  icon: {
    marginRight: rem(5),
    color:
      theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.black,
  },
  section: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.xs,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[3]
    }`,
  },
}));

interface GrowBasicDataProps {
  grow: IsoReportWithPostsFromDb;
  dateOfnewestPost: Date;
}

export const GrowBasicData = ({
  grow,
  dateOfnewestPost,
}: GrowBasicDataProps) => {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const { classes } = useStyles();

  const reportBasicData = [
    {
      label: sanatizeDateString(
        grow?.createdAt,
        router.locale === Locale.DE ? Locale.DE : Locale.EN,
        false,
        false
      ),
      icon: IconCalendar,
    },
    {
      label: Environment[grow.environment as keyof typeof Environment],
      icon: IconHome,
    },
    {
      label: "1468",
      icon: IconEye,
    },
    {
      label: sanatizeDateString(
        grow?.updatedAt,
        router.locale === Locale.DE ? Locale.DE : Locale.EN,
        false,
        false
      ),
      icon: IconClock,
    },
  ];

  const reportBasics = reportBasicData.map((growBasic) => (
    <Center key={growBasic.label}>
      <growBasic.icon size={18} className={classes.icon} stroke={1.8} />
      <Text size="xs"> {growBasic.label} </Text>
    </Center>
  ));

  return (
    <Container size="xl" className="flex flex-col space-y-2">
      <Flex
        align="center"
        px="sm"
        justify="space-between"
        className={classes.section}
      >
        <Title order={2}>{t("common:report-details-headline")}</Title>

        <Text p="md" fz="md">
          {grow.title}
        </Text>
        <LikeHeart itemToLike={grow} itemType={"Report"} />
      </Flex>

      <StrainsInGrow plants={grow.plants} />

      <Space h="md" />

      <LightWattChart
        repordId={grow.id}
        reportStartDate={new Date(grow.createdAt)}
        dateOfnewestPost={dateOfnewestPost}
      />

      <Group mt="xl" position="apart" spacing="xs">
        {reportBasics}
      </Group>
    </Container>
  );
};
