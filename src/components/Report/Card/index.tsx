import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Group,
  Paper,
  Text,
  Tooltip,
  createStyles,
  rem,
  useMantineTheme,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCalendar,
  IconCannabis,
  IconClock,
  IconEdit,
} from "@tabler/icons-react";
import { sanatizeDateString } from "~/helpers";

import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

import { ImagePreview } from "~/components/Atom/ImagePreview";
import LikeHeart from "~/components/Atom/LikeHeart";

import { Locale } from "~/types";
import type { IsoReportCardProps } from "~/types";

import { api } from "~/utils/api";

const useStyles = createStyles((theme) => ({
  card: {
    transition: "transform 150ms ease, box-shadow 150ms ease",

    "&:hover": {
      // transform: "scale(1.004)",
      // color: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,

      // Add the desired box-shadow color and theme's md shadow here
      boxShadow:
        theme.colorScheme !== "dark"
          ? `0 0 4px ${theme.colors.grape[7]}`
          : `0 0 8px ${theme.colors.orange[7]}`,
    },
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[2],
  },

  section: {
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[2]
    }`,
    paddingLeft: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },

  like: {
    color: theme.colors.red[6],
    transition: "transform 2.3s ease-in-out",
  },

  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },

  badgecontainer: {
    marginBottom: "-0.5rem",
  },
}));

export default function ReportCard({
  report: isoReport,
  procedure,
  setSearchString,
}: IsoReportCardProps) {
  const trpc = api.useUtils();
  const router = useRouter();

  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const theme = useMantineTheme();
  const { classes } = useStyles();
  const { data: session, status } = useSession();

  const { mutate: deleteMutation } =
    api.reports.deleteOwnReport.useMutation({
      onMutate: async (deletedReportId: string) => {
        if (procedure == "own") {
          // Cancel any outgoing refetches so they don't overwrite optimistic update
          await trpc.reports.getOwnIsoReportsWithPostsFromDb.cancel();
          // Snapshot the previous value
          const previousReports =
            trpc.reports.getOwnIsoReportsWithPostsFromDb.getData();
          // Optimistically update to the new value
          trpc.reports.getOwnIsoReportsWithPostsFromDb.setData(
            { search: "", orderBy: "createdAt", desc: true },
            (prev) => {
              if (!prev) return previousReports;
              return prev.filter(
                (report) => report.id !== deletedReportId
              );
            }
          );
          // Return a context object with the snapshotted value
          return { previousReports };
        } else {
          // Cancel any outgoing refetches so they don't overwrite optimistic update
          await trpc.reports.getIsoReportsWithPostsFromDb.cancel();
          // Snapshot the previous value
          const previousReports =
            trpc.reports.getIsoReportsWithPostsFromDb.getData();
          // Optimistically update to the new value
          trpc.reports.getIsoReportsWithPostsFromDb.setData(
            { search: "", orderBy: "createdAt", desc: true },
            (prev) => {
              if (!prev) return previousReports;
              return prev.filter(
                (report) => report.id !== deletedReportId
              );
            }
          );
          // Return a context object with the snapshotted value
          return { previousReports };
        }
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (_err, _variables, context) => {
        if (!!context) {
          if (procedure == "own") {
            trpc.reports.getOwnIsoReportsWithPostsFromDb.setData(
              { search: "", orderBy: "createdAt", desc: true },
              () => context.previousReports
            );
          } else {
            trpc.reports.getIsoReportsWithPostsFromDb.setData(
              { search: "", orderBy: "createdAt", desc: true },
              () => context.previousReports
            );
          }
        }
      },
      // Always refetch after error or success:
      onSettled: async () => {
        await trpc.reports.getOwnIsoReportsWithPostsFromDb.invalidate();
        await trpc.reports.getIsoReportsWithPostsFromDb.invalidate();
      },
    });

  const reportStrains = isoReport.strains.map((strainBadge) => (
    <Box key={strainBadge.id}>
      <Badge
        className="badgecontainer cursor-pointer"
        onClick={() => {
          setSearchString(`strain:"${strainBadge.name}"`);
        }}
        // color={theme.colorScheme === "dark" ? "yellow" : "blue"}
        variant="gradient"
        gradient={{
          from: theme.colors.dark[4],
          to: theme.colors.green[9],
        }}
        fz={"0.66rem"}
        px={"0.4rem"}
        leftSection={<IconCannabis stroke={1.6} size={rem(14)} />}
      >
        {strainBadge.name}
      </Badge>
    </Box>
  ));

  return (
    <Paper m={0} withBorder radius="sm" p={0} className={classes.card}>
      <Card.Section>
        <ImagePreview
          imageUrl={isoReport.image?.cloudUrl as string}
          title={isoReport.title as string}
          description={isoReport.description as string}
          publicLink={`/grow/${isoReport.id as string}`}
          authorName={isoReport.author?.name as string}
          authorImageUrl={
            isoReport.author?.image
              ? isoReport.author?.image
              : `https://ui-avatars.com/api/?name=${
                  isoReport.author?.name as string
                }`
          }
          comments={42}
          views={183}
        />
      </Card.Section>

      <Card.Section className={classes.section} mt={6}>
        <Flex
          mih={64}
          // mah={64}
          align="flex-start"
          justify="space-between"
        >
          <Group
            position="left"
            className="overflow-hidden bottom-0 inline-flex space-y-0"
          >
            {/* Strains */}
            {reportStrains}
          </Group>
          <LikeHeart itemToLike={isoReport} itemType={"Report"} />
        </Flex>
      </Card.Section>

      <Card.Section className={classes.section} mt={4}>
        <Group position="apart" c="dimmed">
          {/*// Stage/ Date */}
          <Group position="left">
            <Tooltip
              transitionProps={{
                transition: "pop-bottom-left",
                duration: 100,
              }}
              label={t("common:reports-createdAt")}
              color={theme.colors.orange[7]}
              withArrow
              arrowPosition="side"
            >
              <Center>
                <Box pr={4}>
                  <IconCalendar size="1.2rem" />
                </Box>
                <Text className={`${classes.label} cursor-default`}>
                  {sanatizeDateString(
                    isoReport.createdAt,
                    router.locale === Locale.DE ? Locale.DE : Locale.EN,
                    false
                  )}
                </Text>
              </Center>
            </Tooltip>
          </Group>
          {/*// Stage/ Date */}
          <Group position="left">
            <Tooltip
              transitionProps={{
                transition: "pop-bottom-right",
                duration: 100,
              }}
              label={t("common:reports-updatedAt")}
              color={theme.colors.orange[7]}
              withArrow
              arrowPosition="side"
            >
              <Center>
                <Text className={`${classes.label} cursor-default`}>
                  {sanatizeDateString(
                    isoReport.updatedAt as string,
                    router.locale === Locale.DE ? Locale.DE : Locale.EN,
                    false
                  )}
                </Text>
                <Box pl={4}>
                  <IconClock size="1.2rem" />
                </Box>
              </Center>
            </Tooltip>
          </Group>
        </Group>
      </Card.Section>

      {/*// Strains */}
      {/*
      <Card.Section className={classes.section} mt={0}>
        <Text mt="xs" className={classes.label} c="dimmed">
          Strains in this Grow:
        </Text>
        <Group spacing={7} mt={4}>
          {reportStrains}
        </Group>
      </Card.Section> */}

      {/*// Session buttons */}
      {status === "authenticated" &&
        session.user.id == isoReport.authorId && (
          <Group m="xs" position="apart">
            {/** NO DANGEROUS DELETE BUTTON AT THE MOMENT */}
            {/* <Button
              size="xs"
              radius="sm"
              style={{ flex: 0 }}
              className="hover:bg-red-600 border-red-500"
              onClick={() => {
                deleteMutation(isoReport.id as string);
              }}
            >
              {t("common:report-delete-button")}
              <IconAlertTriangle
                className="ml-2"
                height={20}
                stroke={1.6}
              />
            </Button> */}
            <Link href={`/account/grows/${isoReport.id as string}`}>
              <Button
                size="xs"
                radius="sm"
                style={{ flex: 1 }}
                variant="outline"
              >
                {t("common:report-edit-button")}
                <IconEdit className="ml-2" height={22} stroke={1.4} />
              </Button>
            </Link>
          </Group>
        )}
    </Paper>
  );
}
