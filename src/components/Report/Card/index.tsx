import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Group,
  Paper,
  Text,
  Tooltip,
  createStyles,
  rem,
} from "@mantine/core";
import {
  IconAlertTriangleFilled,
  IconCannabis,
  IconEdit,
  IconHeart,
  IconHeartFilled,
  IconSeeding,
} from "@tabler/icons-react";

import { ImagePreview } from "~/components/Atom/ImagePreview";
import Link from "next/link";
import { Locale } from "~/types";
import type { ReportCardProps } from "~/types";
import { api } from "~/utils/api";
import { sanatizeDateString } from "~/helpers";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  card: {
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
    transition: "transform 0.3s ease-in-out",
  },

  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

export default function ReportCard({
  country,
  badges,
  report,
  procedure,
}: ReportCardProps) {
  const { classes } = useStyles();
  const { data: session } = useSession();
  const [showLikes, setShowLikes] = useState(false);

  const trpc = api.useContext();

  const { mutate: likeReportMutation } = api.like.likeReport.useMutation({
    onMutate: async ({ reportId }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await trpc.reports.getOwnReports.cancel();
      // Snapshot the previous reports
      const previousReports = trpc.reports.getOwnReports.getData();
      // Optimistically add the new like
      trpc.reports.getOwnReports.setData(
        { search: "", orderBy: "createdAt", desc: true },
        (prev) => {
          console.log("prev", prev); //FIXME: prev is EMPTY
          if (!prev) return previousReports;

          return prev.map((report) => {
            //identify report to set like on
            if (report.id === reportId) {
              // append the new entry to likes array

              report.likes.push({
                id: "",
                userId: session?.user.id as string,
                name: session?.user.name as string,
              });
            }
            return report;
          });
        }
      );
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error.message);
    },
    onSuccess: (likedReport) => {
      toast.success("Report liked successfully!");
      console.debug("likedReport", likedReport);
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await trpc.reports.getOwnReports.invalidate();
      await trpc.reports.getAllReports.invalidate();
    },
  });

  const { mutate: deleteLikeMutation } = api.like.deleteLike.useMutation({
    onError: (error) => {
      console.error(error);
      // Handle error, e.g., show an error message
    },
    onSuccess: (res) => {
      // Handle success, e.g., update UI
      toast.success("Your like has been removed!");
      console.debug("success.res", res);
    },
    onSettled: async () => {
      // Trigger any necessary refetch or invalidation, e.g., refetch the report data
      await trpc.reports.getOwnReports.invalidate();
      await trpc.reports.getAllReports.invalidate();
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
    if (!session) {
      // Redirect to login or show a login prompt
      return;
    }

    // Call the likeReport mutation
    deleteLikeMutation({ reportId: report.id });
  };

  const features = badges.map((badge) => (
    <Badge
      key={badge.label}
      variant="gradient"
      gradient={{ from: "orange", to: "grape" }}
      fz="0.6rem"
      fw="bolder"
      pl={4}
      pr={6}
      m={4}
      w={120}
      // color={theme.colorScheme === "dark" ? theme.colors.lime[9] : "green"}

      leftSection={badge.emoji}
    >
      {badge.label}
    </Badge>
  ));

  return (
    <Card withBorder radius="sm" p="sm" className={classes.card}>
      <Card.Section>
        <ImagePreview
          image={report.imageCloudUrl as string}
          title={report.title}
          description={report.description}
          publicLink={`/reports/${report.id}`}
          authorName={report.authorName as string}
          authorImageUrl={report.authorImage as string}
          comments={42}
          views={183}
        />
      </Card.Section>

      <Card.Section className={classes.section} mt={4}>
        <Group position="apart">
          {/* // Badge */}
          <Badge px={2} color="yellow" size="sm" radius="sm" variant="filled">
            {country}
          </Badge>

          <Group spacing={4} position="right">
            {/* // ❤️ */}
            <Box fz="sm" p={1} m={1}>
              {report.likes.length}
            </Box>
            <Box pr={4} m={0} className="relative">
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
              {/* // Likes Tooltip */}
              {!!report.likes.length && (
                <Paper
                  withBorder
                  className={`duration-400 absolute bottom-full right-0 z-10 m-0 w-max rounded p-0 text-right transition-opacity ${
                    showLikes ? "opacity-100" : "opacity-0"
                  } z-30`}
                >
                  {report.likes.map((like) => (
                    <Box
                      key={like.id}
                      mx={10}
                      fz={"xs"}
                      className="whitespace-no-wrap"
                    >
                      {like.name}
                    </Box>
                  ))}
                  <Text fz="xs" td="overline" pr={4} fs="italic">
                    {report.likes.length} Like
                    {report.likes.length > 1 ? "s" : ""} 👍
                  </Text>
                </Paper>
              )}
            </Box>
          </Group>
        </Group>
      </Card.Section>

      <Card.Section className={classes.section} mt={4}>
        <Group position="apart">
          {/* // Stage / Date */}
          <Group position="left">
            <Tooltip
              transitionProps={{ transition: "skew-down", duration: 300 }}
              label="Germination Date"
              color="green"
              // withArrow
              arrowPosition="center"
            >
              <Center>
                <IconCannabis size="1.6rem" color="green" />
                <Text className={classes.label} c="dimmed">
                  {sanatizeDateString(report.createdAt, Locale.EN)}
                </Text>
              </Center>
            </Tooltip>
          </Group>
          {/* // Stage / Date */}
          <Group position="left">
            <Tooltip
              transitionProps={{ transition: "skew-down", duration: 300 }}
              label="Seedling"
              color="green"
              withArrow
              arrowPosition="center"
            >
              <Center>
                <Text className={classes.label} c="dimmed">
                  {sanatizeDateString(report.createdAt, Locale.EN)}
                </Text>
                <IconSeeding size="1.6rem" color="green" />
              </Center>
            </Tooltip>
          </Group>
        </Group>
      </Card.Section>

      {/* // Tags */}
      <Card.Section className={classes.section} mt={0}>
        <Text mt="xs" className={classes.label} c="dimmed">
          Tags:
        </Text>
        <Group spacing={7} mt={4}>
          {features}
        </Group>
      </Card.Section>

      {/* // Session buttons */}
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
            Delete
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
              variant="default"
              radius="sm"
              style={{ flex: 1 }}
            >
              Edit
              <IconEdit className="ml-2" height={22} stroke={1.5} />
            </Button>
          </Link>
        </Group>
      )}
    </Card>
  );
}
