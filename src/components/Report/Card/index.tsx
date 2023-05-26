import {
  ActionIcon,
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
  Transition,
  createStyles,
  rem,
} from "@mantine/core";
import {
  IconAlertTriangleFilled,
  IconCalendar,
  IconCannabis,
  IconClock,
  IconEdit,
  IconError404,
  IconHeart,
  IconHeartFilled,
} from "@tabler/icons-react";

import { IconCheck } from "@tabler/icons-react";
import { ImagePreview } from "~/components/Atom/ImagePreview";
import Link from "next/link";
import { Locale } from "~/types";
import type { ReportCardProps } from "~/types";
import { api } from "~/utils/api";
import { notifications } from "@mantine/notifications";
import { sanatizeDateString } from "~/helpers";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useTranslation } from "next-i18next";

const useStyles = createStyles((theme) => ({
  card: {
    transition: "transform 150ms ease, box-shadow 150ms ease",

    "&:hover": {
      // transform: "scale(1.004)",
      // color: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,

      // Add the desired box-shadow color here

      // Add the desired box-shadow color and theme's md shadow here
      boxShadow:
        theme.colorScheme === "dark"
          ? `0 0 4px ${theme.colors.pink[6]}`
          : `0 0 8px ${theme.colors.orange[8]}`,
    },
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  section: {
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
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
}));

export const likeSuccessfulMsg = {
  title: "Success",
  message: "Woohoo... you ❤️ this Grow!",
  color: "green",
  icon: <IconCheck />,
  loading: false,
};
export const dislikeSuccessfulMsg = {
  title: "Success",
  message: "Oh no... you removed your Like! 😢",
  color: "green",
  icon: <IconCheck />,
  loading: false,
};
export const createLikeErrorMsg = (msg: string) => ({
  loading: false,
  title: "Error",
  message: msg,
  color: "red",
  icon: <IconError404 />,
});

export default function ReportCard({
  report,
  procedure,
  setSearchString,
}: ReportCardProps) {
  const trpc = api.useContext();
  const router = useRouter();

  const { locale: activeLocale } = router;
  const { t } = useTranslation(activeLocale);

  const { classes } = useStyles();
  const { data: session, status } = useSession();
  const [showLikes, setShowLikes] = useState(false);

  const { mutate: likeReportMutation } = api.like.likeReport.useMutation({
    onError: (error) => {
      toast.error(error.message);
      console.error(error.message);
    },
    onSuccess: (likedReport) => {
      notifications.show(likeSuccessfulMsg);
      console.debug("likedReport", likedReport);
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await trpc.notifications.invalidate();
      await trpc.reports.invalidate();
    },
  });

  const { mutate: deleteLikeMutation } = api.like.deleteLike.useMutation({
    onError: (error) => {
      console.error(error);
      // Handle error, e.g., show an error message
    },
    onSuccess: () => {
      notifications.show(dislikeSuccessfulMsg);
    },
    onSettled: async () => {
      // Trigger any necessary refetch or invalidation, e.g., refetch the report data
      await trpc.notifications.getNotificationsByUserId.invalidate();
      await trpc.reports.invalidate();
    },
  });

  const { mutate: deleteMutation } = api.reports.deleteOwnReport.useMutation({
    onMutate: async (deletedReportId: string) => {
      if (procedure == "own") {
        // Cancel any outgoing refetches so they don't overwrite optimistic update
        await trpc.reports.getOwnReports.cancel();
        // Snapshot the previous value
        const previousReports = trpc.reports.getOwnReports.getData();
        // Optimistically update to the new value
        trpc.reports.getOwnReports.setData(
          { search: "", orderBy: "createdAt", desc: true },
          (prev) => {
            console.log("PREV", prev);
            if (!prev) return previousReports;
            return prev.filter((report) => report.id !== deletedReportId);
          }
        );
        // Return a context object with the snapshotted value
        return { previousReports };
      } else {
        // Cancel any outgoing refetches so they don't overwrite optimistic update
        await trpc.reports.getAllReports.cancel();
        // Snapshot the previous value
        const previousReports = trpc.reports.getAllReports.getData();
        // Optimistically update to the new value
        trpc.reports.getAllReports.setData(
          { search: "", orderBy: "createdAt", desc: true },
          (prev) => {
            if (!prev) return previousReports;
            return prev.filter((report) => report.id !== deletedReportId);
          }
        );
        // Return a context object with the snapshotted value
        return { previousReports };
      }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _variables, context) => {
      // toast.error(`An error occured when deleting todo`)
      if (!!context) {
        if (procedure == "own") {
          trpc.reports.getOwnReports.setData(
            { search: "", orderBy: "createdAt", desc: true },
            () => context.previousReports
          );
        } else {
          trpc.reports.getAllReports.setData(
            { search: "", orderBy: "createdAt", desc: true },
            () => context.previousReports
          );
        }
      }
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await trpc.reports.getOwnReports.invalidate();
      await trpc.reports.getAllReports.invalidate();
    },
  });

  const handleLikeReport = () => {
    // Ensure that the user is authenticated
    if (!session) {
      // Redirect to login or show a login prompt
      return;
    }

    // Call the likeReport mutation
    likeReportMutation({ reportId: report.id });
  };

  const handleDisLikeReport = () => {
    // Ensure that the user is authenticated
    if (status !== "authenticated") {
      // Redirect to login or show a login prompt
      return;
    }

    // Call the likeReport mutation
    deleteLikeMutation({ reportId: report.id });
  };

  const reportStrains = report.strains.map((badge) => (
    <Box key={badge.id}>
      <Badge
        className="cursor-pointer"
        onClick={() => {
          setSearchString(`strain:"${badge.name}"`);
        }}
        variant="gradient"
        gradient={{ from: "orange", to: "grape" }}
        fz="0.6rem"
        fw="bolder"
        px={4}
        mt={0}
        mb={0}
        // color={theme.colorScheme === "dark" ? theme.colors.lime[9] : "green"}

        leftSection={<IconCannabis size={rem(14)} />}
        // leftSection={badge.emoji}
      >
        {badge.name}
      </Badge>
    </Box>
  ));

  return (
    <Card withBorder radius="sm" p="sm" className={classes.card}>
      <Card.Section>
        <ImagePreview
          imageUrl={report.imageCloudUrl as string}
          title={report.title}
          description={report.description}
          publicLink={`/grow/${report.id}`}
          authorName={report.authorName as string}
          authorImageUrl={report.authorImage as string}
          comments={42}
          views={183}
        />
      </Card.Section>

      <Card.Section className={classes.section} mt={4}>
        <Flex justify="space-between">
          <Group position="left" className="inline-flex space-y-0">
            {/* Strains */}
            {reportStrains}
          </Group>
          <Flex align="flex-start">
            {/*// ❤️ */}
            <Box fz="sm" p={1} m={1}>
              {report.likes.length}
            </Box>
            <Box className="relative">
              <ActionIcon
                title="give props to grower"
                variant="default"
                className="cursor-default"
                onMouseEnter={() => void setShowLikes(true)}
                onMouseLeave={() => void setShowLikes(false)}
                onBlur={() => setShowLikes(false)}
                radius="sm"
                p={0}
                mr={-4}
                size={25}
              >
                {report.likes.find(
                  (like) => like.userId === session?.user.id
                ) ? (
                  <IconHeartFilled
                    onClick={handleDisLikeReport}
                    size="1.2rem"
                    className={`${classes.like} icon-transition`}
                    stroke={1.5}
                  />
                ) : (
                  <IconHeart
                    onClick={handleLikeReport}
                    size="1.2rem"
                    className={`${classes.like} icon-transition`}
                    stroke={1.5}
                  />
                )}
              </ActionIcon>
              {/*// Likes Tooltip */}
              {!!report.likes.length && (
                <Transition
                  mounted={showLikes}
                  transition="pop-bottom-right"
                  duration={100}
                  timingFunction="ease-in-out"
                >
                  {(transitionStyles) => (
                    <Paper
                      withBorder
                      className={`absolute bottom-full right-0 z-40 m-0 -mr-1 mb-2 w-max rounded p-0 text-right`}
                      style={transitionStyles}
                    >
                      {report.likes.map((like) => (
                        <Box key={like.id} mx={10} fz={"xs"}>
                          {like.name}
                        </Box>
                      ))}
                      <Text fz="xs" td="overline" pr={4} fs="italic">
                        {report.likes.length} Like
                        {report.likes.length > 1 ? "s" : ""} 👍
                      </Text>
                    </Paper>
                  )}
                </Transition>
              )}
            </Box>
          </Flex>
        </Flex>
      </Card.Section>

      <Card.Section className={classes.section} mt={4}>
        <Group position="apart">
          {/*// Stage/ Date */}
          <Group position="left">
            <Tooltip
              transitionProps={{ transition: "pop-bottom-left", duration: 100 }}
              label={t("common:reports-createdAt")}
              color="green"
              withArrow
              arrowPosition="side"
            >
              <Center>
                <Box pr={4}>
                  <IconCalendar size="1.2rem" />
                </Box>
                <Text className={`${classes.label} cursor-default`} c="dimmed">
                  {sanatizeDateString(
                    report.createdAt,
                    router.locale === Locale.DE ? Locale.DE : Locale.EN
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
              color="green"
              withArrow
              arrowPosition="side"
            >
              <Center>
                <Text className={`${classes.label} cursor-default`} c="dimmed">
                  {sanatizeDateString(
                    report.updatedAt,
                    router.locale === Locale.DE ? Locale.DE : Locale.EN
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
      {session && session.user.id == report.authorId && (
        <Group mt="xs" position="apart">
          <Button
            size="sm"
            variant="filled"
            color="red"
            radius="sm"
            style={{ flex: 0 }}
            className="border-1 cursor-default border-red-600"
            onClick={() => {
              deleteMutation(report.id);
            }}
          >
            {t("common:report-delete")}
            <IconAlertTriangleFilled
              className="ml-2"
              height={18}
              stroke={1.5}
            />
          </Button>
          <Link href={`/account/reports/${report.id}`}>
            <Button
              size="sm" /*
              className="border-orange-600" */
              variant="outline"
              radius="sm"
              style={{ flex: 1 }}
            >
              {t("common:report-edit")}
              <IconEdit className="ml-2" height={22} stroke={1.5} />
            </Button>
          </Link>
        </Group>
      )}
    </Card>
  );
}
