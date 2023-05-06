import {
  Badge,
  Button,
  Card,
  Group,
  Image,
  Text,
  createStyles,
  rem,
} from "@mantine/core";
import {
  IconAlertTriangleFilled,
  IconEdit,
  IconHeart,
} from "@tabler/icons-react";

import Link from "next/link";
import type { OwnReport } from "~/types";
import { api } from "~/utils/api";

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

interface BadgeCardProps {
  image: string;
  country: string;
  badges: {
    emoji: string;
    label: string;
  }[];
}

interface ReportCardProps extends BadgeCardProps {
  report: OwnReport;
}

export default function ReportCard({
  image,
  country,
  badges,
  report,
}: ReportCardProps) {
  const { classes, theme } = useStyles();

  const trpc = api.useContext();
  const { mutate: deleteMutation } = api.reports.deleteOwnReport.useMutation({
    onMutate: async (deleteId) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await trpc.reports.getOwnReports.cancel();

      // Snapshot the previous value
      const previousReports = trpc.reports.getOwnReports.getData();

      // Optimistically update to the new value
      trpc.reports.getOwnReports.setData(undefined, (prev) => {
        if (!prev) return previousReports;
        return prev.filter((report) => report.id !== deleteId);
      });

      // Return a context object with the snapshotted value
      return { previousReports };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (_err, _newTodo, context) => {
      // toast.error(`An error occured when deleting todo`)
      if (!context) return;
      trpc.reports.getOwnReports.setData(
        undefined,
        () => context.previousReports
      );
    },
    // Always refetch after error or success:
    onSettled: async () => {
      console.log("SETTLED");
      await trpc.reports.getOwnReports.invalidate();
    },
  });

  const features = badges.map((badge) => (
    <Badge
      color={theme.colorScheme === "dark" ? "dark" : "gray"}
      key={badge.label}
      leftSection={badge.emoji}
    >
      {badge.label}
    </Badge>
  ));

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image src={image} alt={report.id} height={180} />
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group position="apart">
          <Text fz="lg" fw={500}>
            Title: {report.title}
          </Text>
          <Badge size="sm">{country}</Badge>
        </Group>
        <Text fz="sm" mt="xs">
          description: {report.description}
        </Text>
        <Text mt="md" className={classes.label} c="dimmed">
          updated at: {report.updatedAt.toLocaleString()}
        </Text>
        <Text mt="md" className={classes.label} c="dimmed">
          created at: {report.createdAt.toLocaleString()}
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

      <Group mt="xs">
        <Button
          fullWidth
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
          <IconAlertTriangleFilled className="ml-2" height={18} stroke={1.5} />
        </Button>
        <Link href={`/account/report/${report.id}`}>
          <Button
            className="border-orange-600"
            variant="default"
            radius="sm"
            style={{ flex: 1 }}
          >
            Edit Report <IconEdit className="ml-2" height={18} stroke={1.5} />
          </Button>
        </Link>
        {/* 
          <ActionIcon variant="default" radius="sm" size={38}>
            <IconHeart width={22} className={classes.like} stroke={1.5} />
          </ActionIcon> */}
      </Group>
    </Card>
  );
}
