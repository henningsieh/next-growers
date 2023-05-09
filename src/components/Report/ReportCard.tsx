import {
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Text,
  Tooltip,
  createStyles,
  rem,
} from "@mantine/core";
import {
  IconAlertTriangleFilled,
  IconClock,
  IconEdit,
  IconHeart,
  IconTimeline,
} from "@tabler/icons-react";

import { IconTimelineEventPlus } from "@tabler/icons-react";
import Link from "next/link";
import type { Report } from "~/types";
import UserAvatar from "../Atom/UserAvatar";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

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
  },

  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

interface FakeCardBadgeProps {
  image: string;
  country: string;
  badges: {
    emoji: string;
    label: string;
  }[];
}

interface ReportCardProps extends FakeCardBadgeProps {
  report: Report;
  procedure: "all" | "own";
}

export default function ReportCard({
  image,
  country,
  badges,
  report,
  procedure,
}: ReportCardProps) {
  const trpc = api.useContext();
  const { mutate: deleteMutation } = api.reports.deleteOwnReport.useMutation({
    onMutate: async (deletedReportId) => {
      if (procedure == "own") {
        // Cancel any outgoing refetches so they don't overwrite optimistic update
        await trpc.reports.getOwnReports.cancel();
        // Snapshot the previous value
        const previousReports = trpc.reports.getOwnReports.getData();
        // Optimistically update to the new value
        trpc.reports.getOwnReports.setData(undefined, (prev) => {
          if (!prev) return previousReports;
          return prev.filter((report) => report.id !== deletedReportId);
        });
        // Return a context object with the snapshotted value
        return { previousReports };
      } else {
        // Cancel any outgoing refetches so they don't overwrite optimistic update
        await trpc.reports.getAllReports.cancel();
        // Snapshot the previous value
        const previousReports = trpc.reports.getAllReports.getData();
        // Optimistically update to the new value
        trpc.reports.getAllReports.setData(undefined, (prev) => {
          if (!prev) return previousReports;
          return prev.filter((report) => report.id !== deletedReportId);
        });
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
            undefined,
            () => context.previousReports
          );
        } else {
          trpc.reports.getAllReports.setData(
            undefined,
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

  const { classes, theme } = useStyles();

  const features = badges.map((badge) => (
    <Badge
      color={theme.colorScheme === "dark" ? "dark" : "gray"}
      key={badge.label}
      leftSection={badge.emoji}
    >
      {badge.label}
    </Badge>
  ));

  const { data: session } = useSession();

  return (
    <Card withBorder radius="md" p="sm" className={classes.card}>
      <Card.Section>
        <Image src={image} alt={report.id} height={180} />
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group position="apart">
          <Text fz="lg" fw={500}>
            {report.title}
          </Text>
          <Badge size="sm">{country}</Badge>

          <UserAvatar
            userName={report.authorName}
            imageUrl={
              report.authorImage
                ? report.authorImage
                : `https://ui-avatars.com/api/?name=${
                    report.authorName as string
                  }`
            }
            avatarRadius="sm"
          />
        </Group>
        <Text fz="sm" mt="xs">
          {report.description}
        </Text>
        {/* <Text mt="sm" className={classes.label} c="dimmed">
          updated at: {report.updatedAt.toLocaleDateString()}
        </Text> */}
        <Text mt="sm" className={classes.label} c="dimmed">
          <IconTimelineEventPlus />
          {report.createdAt.toLocaleDateString()}
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text mt="md" className={classes.label} c="dimmed">
          Tags:
        </Text>
        <Group spacing={7} mt={5}>
          {features}
        </Group>
      </Card.Section>

      {session && session.user.id == report.authorId && (
        <Group mt="xs" position="apart">
          <Button
            size="sm"
            variant="filled"
            color="red"
            radius="sm"
            style={{ flex: 0 }}
            className="border-1 border-red-600"
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
              size="sm"
              className="border-orange-600"
              variant="default"
              radius="sm"
              style={{ flex: 1 }}
            >
              Edit
              <IconEdit className="ml-2" height={22} stroke={1.5} />
            </Button>
          </Link>
          {/* 
          <ActionIcon variant="default" radius="sm" size={38}>
            <IconHeart width={22} className={classes.like} stroke={1.5} />
          </ActionIcon> */}
        </Group>
      )}
    </Card>
  );
}